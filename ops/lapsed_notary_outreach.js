require('dotenv').config({ path: '/var/www/bondverify/.env' });
const fs = require('fs');
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const { SESClient, SendEmailCommand, unsubUrl } = require('../lib/qs_ses.cjs');

/**
 * Lapsed-notary email: one message to Texas notaries whose commission ended in the 60 days before
 * the latest Secretary of State data release and who, per that release, did not renew.
 * Built 2026-10-01 (Ted approved: "lets do it"); nothing is sent without --send.
 *
 * Why this is truthful only after a NEW release: the state publishes quarterly. Before a release,
 * "expired" in our copy can mean "renewed since the last release". So the script refuses to run
 * unless notary_feed_watch.py has imported a release newer than 2026-07-15, and it only targets
 * commissions that ended BEFORE that release (the release itself shows no renewal for them).
 *
 * Sources for every claim in the copy:
 *   1 Tex. Admin. Code §87.15: renewals accepted from 90 days before expiry and "must be received by
 *     the secretary of state no later than the expiration date"; a renewal is filed "in the same manner
 *     and on the same form as if filing an original application".
 *   Tex. Gov't Code §406.010: $10,000 notary bond. §406.007: $21 in SOS fees. $50 is our 4-year price.
 *   We deliberately do NOT say "you can't renew" (the rule doesn't say it in those words).
 *
 * Safety: one email per commission ever (lapsed_outreach UNIQUE), both opt-out lists + our buyers
 * suppressed (fails closed), anyone with ANOTHER active commission on the same email skipped, one
 * marketing email per address per day under GET_LOCK('notary_marketing_send'), signed one-click
 * unsubscribe via lib/qs_ses.cjs. --pct N sends to a stable N% slice (CRC32 of email) for testing.
 *
 * Usage: node lapsed_notary_outreach.js [--send] [--limit N] [--pct N]   (dry run by default)
 */

const PREVIEW = process.argv.includes('--preview');
// --preview reads the old (July) data for a look only; it can never send.
const SEND = process.argv.includes('--send') && !PREVIEW;
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? parseInt(process.argv[i + 1], 10) : d; };
const LIMIT = arg('--limit', 500);
const PCT = arg('--pct', 10);
const CAMPAIGN = 'notary-lapsed';
const LAST_KNOWN_RELEASE = 1784092224;   // 2026-07-15: the release whose "expired" can't be trusted
const FROM = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY = 'administrator@quantumsurety.bond';
const APPLY = 'https://quantumsurety.bond/get-bond?type=notary&utm_source=email&utm_medium=lapsed&utm_campaign=' + CAMPAIGN;

const pool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS,
  database: process.env.DB_NAME, connectionLimit: 3, timezone: '+00:00' });
const ses = new SESClient({ region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET } });

const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cap = s => { const f = String(s || '').trim().split(/\s+/)[0] || ''; return /^[a-z][a-z'-]*$/i.test(f) ? f[0].toUpperCase() + f.slice(1).toLowerCase() : ''; };

function message(first, endStr, relStr, email) {
  const hi = first ? `Hi ${first},` : 'Hello,';
  const paras = [
    `Texas Secretary of State records published ${relStr} show that your notary commission ended on ${endStr}, with no renewal on file.`,
    `Texas renewals have to be received by the expiration date (1 Tex. Admin. Code §87.15). To notarize again, you apply for a commission the same way as an original application, and you need a $10,000 notary bond.`,
    `Our bond is $50 for the full 4-year term; the Secretary of State charges its own $21 filing fee. It takes a few minutes online, and your bond certificate is emailed to you, typically within minutes.`,
    `If you've already taken care of this, or you've decided not to continue as a notary, no action is needed and you won't hear from us about it again.`,
  ];
  const unsub = unsubUrl(email);
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:15px">
<p>${esc(hi)}</p>${paras.slice(0, 3).map(p => `<p style="color:#334155">${esc(p)}</p>`).join('')}
<p style="margin:24px 0"><a href="${APPLY}" style="background:#16a34a;color:#fff;padding:12px 26px;border-radius:6px;text-decoration:none;font-weight:700">Get my notary bond</a></p>
<p style="color:#334155">${esc(paras[3])}</p>
<p style="color:#334155">Questions? Just reply to this email.</p>
<p style="color:#334155">Theodore Sparks<br>Quantum Surety LLC · TDI License #3480229</p>
<p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:10px;margin-top:20px">Quantum Surety · 1416 Bessie Drive, Wylie, TX 75098<br>You're receiving this because Texas Secretary of State records list your notary commission. <a href="${unsub}" style="color:#94a3b8">Unsubscribe</a></p></div>`;
  const text = `${hi}\n\n${paras.slice(0, 3).join('\n\n')}\n\nGet my notary bond: ${APPLY}\n\n${paras[3]}\n\nQuestions? Just reply to this email.\n\nTheodore Sparks\nQuantum Surety LLC | TDI License #3480229\n1416 Bessie Drive, Wylie, TX 75098\nUnsubscribe: ${unsub}\n`;
  return { subject: `Your Texas notary commission ended on ${endStr}`, html, text };
}

async function crmSuppression() {
  const pg = new Client({ host: process.env.CRM_PG_HOST, port: parseInt(process.env.CRM_PG_PORT || '5433', 10),
    database: process.env.CRM_PG_DB, user: process.env.CRM_PG_USER, password: process.env.CRM_PG_PASS,
    connectionTimeoutMillis: 15000, statement_timeout: 30000 });
  await pg.connect();
  try {
    const { rows } = await pg.query(`
      SELECT lower(trim(email)) e FROM unsubscribes WHERE email LIKE '%@%'
      UNION SELECT lower(trim(insured_email)) FROM bk_bonds WHERE bond_type ILIKE '%notary%'
        AND status IN ('issued','pending') AND insured_email LIKE '%@%' AND created_at > now() - interval '400 days'`);
    return new Set(rows.map(r => r.e));
  } finally { await pg.end(); }
}

async function main() {
  // Gate 1: a release newer than 2026-07-15 must have been IMPORTED (not just published).
  let st = {};
  try { st = JSON.parse(fs.readFileSync('/var/www/bondverify/.notary_feed_state.json', 'utf8')); } catch (_) {}
  const rel = Number(st.imported_rows_updated_at || 0);
  // --july-cohort (Ted approved 2026-10-01, option B): the July 15 release itself confirms no renewal
  // for commissions that ended BEFORE it (May 16 - Jul 14), so that group may be sent from July data.
  const JULY = process.argv.includes('--july-cohort') && rel === LAST_KNOWN_RELEASE;
  if (rel <= LAST_KNOWN_RELEASE && !JULY) {
    console.log(`[${CAMPAIGN}] waiting: newest imported state release is ${rel ? new Date(rel * 1000).toISOString().slice(0, 10) : 'unknown'}; need one after 2026-07-15. Nothing sent.`);
    if (!PREVIEW) { await pool.end(); return; }
    console.log(`[${CAMPAIGN}] --preview: showing what the July data would select (NOT sendable).`);
  }
  const relDate = new Date(rel * 1000);
  const relStr = fmt(relDate);

  await pool.query(`CREATE TABLE IF NOT EXISTS lapsed_outreach (
    id INT AUTO_INCREMENT PRIMARY KEY, notary_id VARCHAR(50) NOT NULL, email VARCHAR(255) NOT NULL,
    expire_date DATE NOT NULL, release_ts INT NOT NULL, sent_at DATETIME NOT NULL DEFAULT UTC_TIMESTAMP(),
    UNIQUE KEY one_per_commission (notary_id, expire_date), KEY email (email))
    CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci`);

  let suppress;
  try { suppress = await crmSuppression(); }
  catch (e) { console.error('[abort] CRM suppression unreadable, sending nothing: ' + e.message); await pool.end(); process.exit(1); }

  const lockConn = await pool.getConnection();
  const [[lk]] = await lockConn.query("SELECT GET_LOCK('notary_marketing_send', 1800) AS got");
  if (lk.got !== 1) { console.error('[abort] another notary sender holds the lock'); lockConn.release(); await pool.end(); process.exit(1); }

  // Commissions that ended in the 60 days before the release and show no renewal in it; skip any
  // address that also holds an active commission (shared inboxes, re-commissioned notaries).
  const [rows] = await pool.query(`
    SELECT n.notary_id, n.first_name, n.email, n.expire_date
      FROM notaries n
      LEFT JOIN unsubscribes u ON u.email = n.email
     WHERE n.expire_date >= DATE(FROM_UNIXTIME(?)) - INTERVAL 60 DAY
       AND n.expire_date <  DATE(FROM_UNIXTIME(?))
       AND n.email REGEXP '^[^@ ]+@[^@ ]+[.][a-zA-Z]{2,}$' AND n.email NOT LIKE '%noemail%'
       AND MOD(CRC32(LOWER(TRIM(n.email))), 100) < ?
       AND u.id IS NULL
       AND NOT EXISTS (SELECT 1 FROM notaries a WHERE a.email = n.email AND a.expire_date >= CURDATE())
       AND NOT EXISTS (SELECT 1 FROM lapsed_outreach l WHERE l.notary_id = n.notary_id AND l.expire_date = n.expire_date)
     ORDER BY n.expire_date DESC
     LIMIT ?`, [rel, rel, PCT, LIMIT]);

  const seen = new Set();
  for (const q of ['SELECT LOWER(email) e FROM renewal_outreach WHERE sent_at >= CURDATE()',
                   'SELECT LOWER(email) e FROM notary_campaign_sends WHERE sent_at >= CURDATE()',
                   'SELECT LOWER(email) e FROM lapsed_outreach WHERE sent_at >= CURDATE()']) {
    const [r] = await pool.query(q); for (const x of r) if (x.e) seen.add(String(x.e).trim());
  }

  console.log(`[${CAMPAIGN}] release ${relDate.toISOString().slice(0, 10)} | ${PCT}% slice | selected ${rows.length} (limit ${LIMIT}) | ${SEND ? 'SEND' : 'DRY RUN'}`);
  let sent = 0, skipped = 0, failed = 0;
  for (const r of rows) {
    const email = String(r.email).trim().toLowerCase();
    if (suppress.has(email) || seen.has(email)) { skipped++; continue; }
    seen.add(email);
    const m = message(cap(r.first_name), fmt(r.expire_date), relStr, email);
    if (!SEND) { if (sent < 5) console.log(`  [DRY] ended ${fmt(r.expire_date)} | "${m.subject}"`); sent++; continue; }
    try {
      const [ins] = await pool.execute('INSERT IGNORE INTO lapsed_outreach (notary_id, email, expire_date, release_ts) VALUES (?,?,?,?)',
        [r.notary_id, email, r.expire_date, rel]);
      if (ins.affectedRows !== 1) { skipped++; continue; }
      await ses.send(new SendEmailCommand({ Source: FROM, ReplyToAddresses: [REPLY], Destination: { ToAddresses: [email] },
        Message: { Subject: { Data: m.subject }, Body: { Html: { Data: m.html }, Text: { Data: m.text } } },
        Tags: [{ Name: 'campaign', Value: CAMPAIGN }] }));
      sent++;
    } catch (e) {
      failed++; console.error(`  FAIL ${email.replace(/^(.{3}).*@/, '$1***@')}: ${e.message}`);
      await pool.execute('DELETE FROM lapsed_outreach WHERE notary_id = ? AND expire_date = ?', [r.notary_id, r.expire_date]).catch(() => {});
    }
    await new Promise(x => setTimeout(x, 120));
  }
  console.log(`[${CAMPAIGN}] ${SEND ? 'sent' : 'would send'} ${sent} | skipped (opt-out, buyer, mailed today) ${skipped} | failed ${failed}`);
  await lockConn.query("SELECT RELEASE_LOCK('notary_marketing_send')"); lockConn.release();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
