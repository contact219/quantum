require('dotenv').config({ path: '/var/www/bondverify/.env' });
const mysql = require('mysql2/promise');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Quarterly refresh of the public Texas Bond Data package.
 *
 * What this DOES automate:
 *   - regenerates all 8 CSV cuts from the live mirrors
 *   - publishes them at https://verify.quantumsurety.bond/datasets/ (stable URLs,
 *     so the origin download links are never stale even if the mirrors lag)
 *   - writes manifest.json and diffs row counts against the previous run
 *   - emails a summary with the deltas and a tarball link
 *
 * What it CANNOT automate:
 *   - re-uploading to data.world / Kaggle / Hugging Face. Those need per-platform
 *     API tokens that don't exist on this box. The email is the prompt to do it.
 *     If tokens are ever added, the Kaggle and HF steps are two CLI calls — see
 *     datasets/texas-bond-data/UPLOAD.md in the quantum repo.
 *
 * Cron: 0 10 1 1,4,7,10 *  — 1st of Jan/Apr/Jul/Oct at 10:00 UTC.
 * Deliberately after the monthly source imports (notaries 07:00, contractors 08:00
 * on the 1st) so a refresh always reflects the newest state data.
 */

const PUBLIC_DIR = '/var/www/bondverify/public/datasets';
const MANIFEST = path.join(PUBLIC_DIR, 'manifest.json');
const BASE_URL = 'https://verify.quantumsurety.bond/datasets';
const ALERT_TO = 'contact219@gmail.com';
const DRY = process.argv.includes('--dry-run');

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

function csv(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n';
}

const JOBS = [
  ['texas-notary-expirations-by-month.csv', `
    SELECT DATE_FORMAT(expire_date,'%Y-%m') AS month, COUNT(*) AS commissions_expiring
    FROM notaries
    WHERE expire_date >= '2020-01-01' AND expire_date < DATE_ADD(CURDATE(), INTERVAL 60 MONTH)
    GROUP BY month ORDER BY month`],
  ['texas-notary-commissions-by-city.csv', `
    SELECT city, COUNT(*) AS commissions_total,
           SUM(expire_date >= CURDATE()) AS commissions_active,
           SUM(expire_date <  CURDATE()) AS commissions_expired
    FROM notaries WHERE city IS NOT NULL AND city <> ''
    GROUP BY city HAVING commissions_total >= 5 ORDER BY commissions_total DESC`],
  ['texas-notary-commissions-by-zip.csv', `
    SELECT zip, COUNT(*) AS commissions_total,
           SUM(expire_date >= CURDATE()) AS commissions_active
    FROM notaries WHERE zip IS NOT NULL AND zip <> ''
    GROUP BY zip HAVING commissions_total >= 5 ORDER BY commissions_total DESC`],
  ['texas-gdn-dealer-expirations-by-month.csv', `
    SELECT DATE_FORMAT(license_expiration,'%Y-%m') AS month, COUNT(*) AS licences_expiring
    FROM auto_dealers WHERE license_expiration IS NOT NULL
    GROUP BY month ORDER BY month`],
  ['texas-gdn-dealers-by-county.csv', `
    SELECT county, COUNT(*) AS dealers_total,
           SUM(license_status='Active') AS dealers_active,
           SUM(license_expiration < CURDATE()) AS dealers_expired
    FROM auto_dealers WHERE county IS NOT NULL AND county <> ''
    GROUP BY county ORDER BY dealers_total DESC`],
  ['texas-gdn-dealers-by-city.csv', `
    SELECT city, COUNT(*) AS dealers_total, SUM(license_status='Active') AS dealers_active
    FROM auto_dealers WHERE city IS NOT NULL AND city <> ''
    GROUP BY city HAVING dealers_total >= 3 ORDER BY dealers_total DESC`],
  ['texas-gdn-dealers-by-license-type.csv', `
    SELECT license_type, license_category, COUNT(*) AS dealers_total
    FROM auto_dealers WHERE license_type IS NOT NULL AND license_type <> ''
    GROUP BY license_type, license_category ORDER BY dealers_total DESC`],
  ['texas-bond-data-summary.csv', `
    SELECT 'notary_commissions' AS dataset, COUNT(*) AS total_records,
           SUM(expire_date >= CURDATE()) AS active_records,
           SUM(expire_date <  CURDATE()) AS expired_records
    FROM notaries
    UNION ALL
    SELECT 'gdn_dealers', COUNT(*), SUM(license_expiration >= CURDATE()), SUM(license_expiration < CURDATE())
    FROM auto_dealers
    UNION ALL
    SELECT 'tdlr_contractor_licences', COUNT(*), NULL, NULL FROM contractors`],
];

function readPrevManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf-8')); } catch { return null; }
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASS, database: process.env.DB_NAME,
    waitForConnections: true, connectionLimit: 3, timezone: '+00:00',
  });

  const prev = readPrevManifest();
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const files = [];
  for (const [file, sql] of JOBS) {
    const [rows] = await pool.query(sql);
    if (!DRY) fs.writeFileSync(path.join(PUBLIC_DIR, file), csv(rows));
    files.push({ file, rows: rows.length });
    console.log(`${String(rows.length).padStart(6)} rows  ${file}`);
  }

  // Headline totals for the email — the numbers the dataset is actually about.
  const [[summary]] = await pool.query(`
    SELECT (SELECT COUNT(*) FROM notaries) AS notaries,
           (SELECT COUNT(*) FROM notaries WHERE expire_date >= CURDATE()) AS notaries_active,
           (SELECT COUNT(*) FROM auto_dealers) AS dealers,
           (SELECT COUNT(*) FROM contractors) AS contractors`);
  await pool.end();

  const generated = new Date().toISOString().slice(0, 10);
  const manifest = { generated, base_url: BASE_URL, license: 'CC-BY-4.0', totals: summary, files };

  if (!DRY) {
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    execSync(`cd ${PUBLIC_DIR} && tar czf texas-bond-data.tar.gz *.csv manifest.json`);
  }

  // ── Diff against the previous refresh ────────────────────────────────────
  const deltas = files.map((f) => {
    const before = prev?.files?.find((p) => p.file === f.file)?.rows;
    return { ...f, before, delta: before === undefined ? null : f.rows - before };
  });

  const n = (v) => Number(v || 0).toLocaleString('en-US');
  const sign = (d) => (d === null ? '—' : d === 0 ? '0' : d > 0 ? `+${n(d)}` : n(d));

  const rowsHtml = deltas.map((d) => `<tr>
      <td style="padding:6px 10px;font-family:ui-monospace,monospace;font-size:12px">${d.file}</td>
      <td style="padding:6px 10px;text-align:right">${n(d.rows)}</td>
      <td style="padding:6px 10px;text-align:right;color:${d.delta > 0 ? '#166534' : d.delta < 0 ? '#b45309' : '#64748b'}">${sign(d.delta)}</td>
    </tr>`).join('');

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.6">
  <h2 style="margin:0 0 4px">Texas Bond Data — quarterly refresh</h2>
  <p style="color:#64748b;margin:0 0 20px">Generated ${generated}${prev ? ` · previous refresh ${prev.generated}` : ' · first run'}</p>

  <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:20px">
    <p style="margin:0"><strong>${n(summary.notaries)}</strong> notary commissions (${n(summary.notaries_active)} active)</p>
    <p style="margin:4px 0 0"><strong>${n(summary.dealers)}</strong> GDN dealers · <strong>${n(summary.contractors)}</strong> TDLR contractor licences</p>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:13px">
    <thead><tr style="background:#f1f5f9">
      <th style="text-align:left;padding:8px 10px;font-size:11px;color:#475569">FILE</th>
      <th style="text-align:right;padding:8px 10px;font-size:11px;color:#475569">ROWS</th>
      <th style="text-align:right;padding:8px 10px;font-size:11px;color:#475569">CHANGE</th>
    </tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>

  <p style="margin:20px 0 8px"><strong>Fresh files are already live:</strong></p>
  <p style="margin:0"><a href="${BASE_URL}/texas-bond-data.tar.gz" style="color:#2563eb">${BASE_URL}/texas-bond-data.tar.gz</a></p>
  <p style="margin:4px 0 0;color:#64748b;font-size:13px">Individual CSVs at ${BASE_URL}/&lt;filename&gt;</p>

  <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;margin-top:20px">
    <p style="margin:0;color:#78350f"><strong>Manual step:</strong> re-upload to data.world, Kaggle and Hugging Face.
    Those need per-platform API tokens that aren't on this server, so the refresh stops here.</p>
    <p style="margin:8px 0 0;color:#78350f;font-size:13px">Steps: <code>datasets/texas-bond-data/UPLOAD.md</code> in the quantum repo.
    The whole point of the listings is that the data is current — if a refresh goes unpublished for a year,
    either update it or drop "live" from the descriptions.</p>
  </div>

  <p style="color:#94a3b8;font-size:11px;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:12px">
    /var/www/bondverify/scripts/quarterly_dataset_refresh.js on 130.51.23.147 · runs 1st of Jan/Apr/Jul/Oct
  </p>
</div>`;

  const text = `Texas Bond Data — quarterly refresh (${generated})

${n(summary.notaries)} notary commissions (${n(summary.notaries_active)} active)
${n(summary.dealers)} GDN dealers | ${n(summary.contractors)} TDLR contractor licences

${deltas.map((d) => `  ${d.file.padEnd(46)} ${String(d.rows).padStart(6)}  ${sign(d.delta)}`).join('\n')}

Fresh files: ${BASE_URL}/texas-bond-data.tar.gz

MANUAL STEP: re-upload to data.world, Kaggle and Hugging Face.
Those need API tokens not present on this server. See datasets/texas-bond-data/UPLOAD.md.`;

  if (DRY) {
    console.log('\n--- DRY RUN, no files written, no email sent ---');
    console.log(text);
    return;
  }

  await ses.send(new SendEmailCommand({
    Source: 'Quantum Surety Ops <alerts@quantumsurety.bond>',
    Destination: { ToAddresses: [ALERT_TO] },
    Message: {
      Subject: { Data: `Texas Bond Data refreshed ${generated} — re-upload to aggregators` },
      Body: { Html: { Data: html }, Text: { Data: text } },
    },
  }));
  console.log(`\nRefresh complete. Summary emailed to ${ALERT_TO}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
