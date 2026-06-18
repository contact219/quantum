// Notary bond renewal campaign — targets notaries expiring in 1-45 days with valid emails
// Run: node notary_renewal_campaign.js [--dry-run] [--limit N]
require('dotenv').config();
const mysql = require('mysql2/promise');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT   = parseInt((process.argv.find(a => a.startsWith('--limit=')) || '').split('=')[1] || '5000');
const DELAY   = 120; // ms between sends (~8/sec, well under SES 14/sec limit)

const pool = mysql.createPool({
  host:     process.env.DB_HOST || '127.0.0.1',
  user:     process.env.DB_USER || 'bondverify',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'bondverify',
  waitForConnections: true, connectionLimit: 3,
});

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM    = 'alerts@quantumsurety.bond';
const SUBJECT = 'Your Texas Notary Bond expires soon — renew in 2 minutes for $50';
const APPLY   = 'https://quantumsurety.bond/get-bond?type=notary&src=renewal-campaign';
const UNSUB   = 'https://verify.quantumsurety.bond/api/unsubscribe?email=';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function daysLeft(d) {
  return Math.max(0, Math.floor((new Date(d) - Date.now()) / 86400000));
}

function buildEmail(notary) {
  const name    = notary.first_name || 'Texas Notary';
  const expDate = fmtDate(notary.expire_date);
  const days    = daysLeft(notary.expire_date);
  const urgency = days <= 7 ? '⚠️ URGENT: ' : days <= 14 ? '📅 ACTION NEEDED: ' : '';
  const unsubUrl = UNSUB + encodeURIComponent(notary.email);

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;background:#ffffff;">
  <div style="background:#0a0f1e;padding:24px 28px;border-bottom:3px solid #f59e0b;">
    <div style="font-size:10px;letter-spacing:4px;color:#f59e0b;font-family:monospace;margin-bottom:6px;">QUANTUM SURETY</div>
    <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:1px;">Texas Notary Bond Renewal</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:16px;color:#0f172a;font-weight:600;margin:0 0 8px;">Hi ${name},</p>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
      Your Texas Notary Public Bond expires on <strong style="color:${days <= 7 ? '#dc2626' : days <= 14 ? '#d97706' : '#0f172a'}">${expDate}</strong>${days <= 14 ? ` — that's only <strong>${days} days away</strong>` : ''}.
      Operating with a lapsed bond puts your commission at risk and can result in fines.
    </p>

    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:12px;font-weight:700;color:#92400e;letter-spacing:2px;margin-bottom:8px;">YOUR RENEWAL OPTIONS</div>
      <table style="width:100%;font-size:13px;color:#1e293b;">
        <tr><td style="padding:5px 0;">✅ 4-Year Texas Notary Bond</td><td style="text-align:right;font-weight:800;color:#059669;">$50 flat</td></tr>
        <tr><td style="padding:5px 0;">✅ Carrier: RLI Insurance</td><td style="text-align:right;color:#64748b;">A-rated</td></tr>
        <tr><td style="padding:5px 0;">✅ Same-day issuance</td><td style="text-align:right;color:#64748b;">Digital + paper</td></tr>
        <tr><td style="padding:5px 0;">✅ Instant bond certificate</td><td style="text-align:right;color:#64748b;">PDF + mail</td></tr>
      </table>
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="${APPLY}" style="display:inline-block;background:#f59e0b;color:#000000;font-size:16px;font-weight:800;padding:15px 40px;border-radius:8px;text-decoration:none;letter-spacing:1px;">
        RENEW MY BOND — $50 →
      </a>
      <div style="margin-top:10px;font-size:11px;color:#94a3b8;">Takes less than 2 minutes. No phone call needed.</div>
    </div>

    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:20px;border-left:3px solid #f59e0b;">
      <p style="font-size:12px;color:#475569;margin:0;line-height:1.6;">
        <strong>Also needed:</strong> Texas law (SB 693) now requires all notaries to complete a 3-hour education course before commissioning or renewing.
        The course is available at <a href="https://www.sos.texas.gov/notary/notarycourse.shtml" style="color:#0ea5e9;">sos.texas.gov</a> for $20.
      </p>
    </div>

    <p style="font-size:13px;color:#64748b;line-height:1.6;">
      Your bond status is publicly tracked on <a href="https://quantumsurety.bond/texas-bond-watch" style="color:#0ea5e9;">Texas Bond Watch</a> — our free statewide bond compliance tracker.
      Renew today to keep your status current.
    </p>

    <p style="font-size:13px;color:#0f172a;margin-top:20px;">
      Questions? Call us at <strong>(214) 666-8718</strong> or reply to this email.<br>
      — The Quantum Surety Team
    </p>
  </div>
  <div style="background:#f1f5f9;padding:16px 28px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;line-height:1.6;">
    Quantum Surety LLC · Texas-Licensed Surety Bond Agency<br>
    <a href="https://quantumsurety.bond" style="color:#94a3b8;">quantumsurety.bond</a> ·
    <a href="${unsubUrl}" style="color:#94a3b8;">Unsubscribe</a> ·
    You received this because your Texas Notary Bond expiration is publicly recorded with the Texas Secretary of State.
  </div>
</div>`;

  const text = `Hi ${name},\n\nYour Texas Notary Public Bond expires on ${expDate}${days <= 14 ? ` (${days} days away)` : ''}.\n\nRenew online in 2 minutes at $50 flat:\n${APPLY}\n\n4-Year Bond · RLI Insurance · Same-day issuance\n\nQuestions? Call (214) 666-8718\n\nQuantum Surety LLC · quantumsurety.bond\nUnsubscribe: ${unsubUrl}`;

  return { html, text };
}

async function run() {
  console.log(`[Campaign] Starting notary renewal blast | dry_run=${DRY_RUN} | limit=${LIMIT}`);

  const [notaries] = await pool.execute(
    `SELECT notary_id, first_name, last_name, email, expire_date, city
     FROM notaries
     WHERE email IS NOT NULL AND LENGTH(email) > 5 AND email LIKE '%@%'
       AND expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 45 DAY)
       AND email NOT IN (SELECT email FROM unsubscribes)
       AND email NOT IN (
         SELECT email FROM notary_campaign_sends
         WHERE campaign_name = 'renewal-45d-2026-06' AND sent_at > NOW() - INTERVAL 30 DAY
       )
       AND notary_id NOT IN (
         SELECT recipient_id FROM renewal_outreach
         WHERE sent_at > NOW() - INTERVAL 24 HOUR
       )
     ORDER BY expire_date ASC
     LIMIT ?`,
    [LIMIT]
  );

  console.log(`[Campaign] ${notaries.length} eligible notaries`);
  if (DRY_RUN) {
    console.log('[Campaign] DRY RUN — sample:');
    notaries.slice(0, 3).forEach(n => console.log(` ${n.email} | expires ${n.expire_date}`));
    await pool.end();
    return;
  }

  let sent = 0, failed = 0;
  for (const notary of notaries) {
    try {
      const { html, text } = buildEmail(notary);
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [notary.email] },
        Message: {
          Subject: { Data: SUBJECT },
          Body: { Html: { Data: html }, Text: { Data: text } },
        },
        Tags: [{ Name: 'campaign', Value: 'renewal-45d' }, { Name: 'source', Value: 'bond-watch' }],
      }));
      await pool.execute(
        'INSERT IGNORE INTO notary_campaign_sends (notary_id, email, campaign_name, subject, status, is_auto) VALUES (?, ?, ?, ?, ?, ?)',
        [notary.notary_id, notary.email, 'renewal-45d-2026-06', SUBJECT, 'sent', true]
      );
      sent++;
      if (sent % 100 === 0) console.log(`[Campaign] Sent ${sent}/${notaries.length}...`);
      await new Promise(r => setTimeout(r, DELAY));
    } catch (e) {
      const msg = e.message || '';
      if (/throttl|rate.limit/i.test(msg)) {
        console.error('[Campaign] Rate limited — pausing 30s');
        await new Promise(r => setTimeout(r, 30000));
      } else if (/invalid.*address|address.*invalid|email.*not/i.test(msg)) {
        failed++;
      } else {
        console.error(`[Campaign] Error for ${notary.email}:`, msg);
        failed++;
      }
    }
  }

  console.log(`[Campaign] Done. Sent: ${sent} | Failed: ${failed}`);
  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
