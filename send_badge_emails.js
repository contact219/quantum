require('dotenv').config();
const fs = require('fs');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const mysql = require('mysql2/promise');

const DRY_RUN = process.argv.includes('--dry-run');
const leads = JSON.parse(fs.readFileSync('/var/www/bondverify/badge_leads.json', 'utf8'));

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const pool = mysql.createPool({
  host: '127.0.0.1', user: process.env.DB_USER || 'bondverify',
  password: process.env.DB_PASS, database: process.env.DB_NAME || 'bondverify',
  waitForConnections: true, connectionLimit: 3,
});

const FROM = 'alerts@quantumsurety.bond';
const SUBJECT = 'Your free Texas Notary Bond badge — show your bond status on your website';

function buildEmail(name, email, notaryId) {
  const firstName = (name || '').split(' ')[0] || 'Texas Notary';
  const badgeUrl = notaryId ? `https://verify.quantumsurety.bond/api/badge/notary/${notaryId}` : null;
  const verifyUrl = notaryId ? `https://verify.quantumsurety.bond/verify/notary/${notaryId}` : null;
  const badgePageUrl = `https://quantumsurety.bond/badge${notaryId ? `?type=notary&id=${notaryId}` : ''}`;

  const embedSnippet = notaryId
    ? `&lt;a href="${verifyUrl}" target="_blank"&gt;\n  &lt;img src="${badgeUrl}" alt="Bond Verified by Quantum Surety" width="280" height="56"&gt;\n&lt;/a&gt;`
    : null;

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;background:#ffffff;">
  <div style="background:#0a0f1e;padding:24px 28px;border-bottom:3px solid #f59e0b;">
    <div style="font-size:10px;letter-spacing:4px;color:#f59e0b;font-family:monospace;margin-bottom:6px;">QUANTUM SURETY</div>
    <div style="font-size:22px;font-weight:800;color:#ffffff;">Your Free Bond Verification Badge</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:16px;color:#0f172a;font-weight:600;margin:0 0 16px;">Hi ${firstName},</p>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 16px;">
      Thank you for your Texas Notary Bond. We have a free gift for you: a <strong>live bond verification badge</strong>
      you can add to your website, email signature, Thumbtack listing, or Linktree. It shows your bond as Active —
      and updates automatically from Texas SOS data.
    </p>
    ${badgeUrl ? `<div style="text-align:center;margin:20px 0;">
      <img src="${badgeUrl}" alt="Your bond badge" width="280" height="56" style="border-radius:6px;">
      <div style="font-size:11px;color:#94a3b8;margin-top:6px;font-family:monospace;">Live badge — updates daily from Texas SOS</div>
    </div>` : ''}
    ${embedSnippet ? `<div style="background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:16px;margin-bottom:20px;">
      <div style="font-size:11px;color:#8b949e;font-family:monospace;margin-bottom:8px;">PASTE INTO YOUR WEBSITE:</div>
      <div style="font-family:monospace;font-size:11px;color:#4C9AC9;white-space:pre-wrap;">${embedSnippet}</div>
    </div>` : ''}
    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:8px;">WHY NOTARIES USE THIS BADGE:</div>
      <ul style="font-size:13px;color:#475569;line-height:1.8;margin:0;padding-left:20px;">
        <li>Proves to clients you're actively bonded — before they even ask</li>
        <li>Works on any website, email signature, or listing (Thumbtack, Angi, Yelp)</li>
        <li>Updates automatically — no maintenance needed</li>
        <li>Free forever</li>
      </ul>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${badgePageUrl}" style="display:inline-block;background:#f59e0b;color:#000;font-weight:800;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;">
        Get Your Badge &rarr;
      </a>
    </div>
    <p style="font-size:13px;color:#0f172a;margin-top:20px;">
      Questions? Call <strong>(214) 666-8718</strong><br>
      &mdash; The Quantum Surety Team
    </p>
  </div>
  <div style="background:#f1f5f9;padding:16px 28px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;">
    Quantum Surety LLC &middot; Texas-Licensed Surety Bond Agency &middot; <a href="https://quantumsurety.bond" style="color:#94a3b8;">quantumsurety.bond</a>
  </div>
</div>`;

  const text = `Hi ${firstName},\n\nThank you for your Texas Notary Bond. Claim your free live bond status badge:\n\n${badgePageUrl}\n\nIt shows your bond as Active on your website, email signature, or any listing. Updates automatically from Texas SOS.\n\nQuestions? (214) 666-8718\nQuantum Surety LLC`;
  return { html, text };
}

async function run() {
  console.log(`[Badge] Starting badge adoption email | dry_run=${DRY_RUN} | leads=${leads.length}`);
  let sent = 0, failed = 0;
  for (const lead of leads) {
    if (!lead.email || !lead.email.includes('@')) continue;
    try {
      const [rows] = await pool.execute('SELECT notary_id FROM notaries WHERE LOWER(email) = ? LIMIT 1', [lead.email.toLowerCase().trim()]);
      const notaryId = rows.length ? rows[0].notary_id : null;
      if (DRY_RUN) {
        console.log(`[Badge] DRY ${lead.email} | id=${notaryId || 'none'}`);
        continue;
      }
      const { html, text } = buildEmail(lead.name, lead.email, notaryId);
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [lead.email] },
        Message: { Subject: { Data: SUBJECT }, Body: { Html: { Data: html }, Text: { Data: text } } },
      }));
      sent++;
      if (sent % 25 === 0) console.log(`[Badge] Sent ${sent}/${leads.length}...`);
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      failed++;
      if (!/invalid.*address|address.*invalid/i.test(e.message || '')) {
        console.error(`[Badge] Error ${lead.email}:`, e.message);
      }
    }
  }
  console.log(`[Badge] Done. Sent=${sent} Failed=${failed}`);
  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
