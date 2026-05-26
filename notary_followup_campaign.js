// Notary bond renewal follow-up — targets notaries who received the first email
// but whose bond still hasn't been renewed (still expiring in 1-45 days)
// Run: node notary_followup_campaign.js [--dry-run] [--limit N]
require('dotenv').config();
const mysql = require('mysql2/promise');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT   = parseInt((process.argv.find(a => a.startsWith('--limit=')) || '').split('=')[1] || '5000');
const DELAY   = 120; // ms between sends

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
const SUBJECT = 'Last reminder: Your Texas Notary Bond expires soon';
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
  const urgent  = days <= 7;
  const encoded = encodeURIComponent(notary.email);
  const renewUrl = `https://quantumsurety.bond/renew?email=${encoded}&src=followup-7d`;
  const unsubUrl = UNSUB + encoded;

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;background:#ffffff;">
  <div style="background:#0a0f1e;padding:24px 28px;border-bottom:3px solid ${urgent ? '#dc2626' : '#f59e0b'};">
    <div style="font-size:10px;letter-spacing:4px;color:#f59e0b;font-family:monospace;margin-bottom:6px;">QUANTUM SURETY</div>
    <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:1px;">${urgent ? '⚠️ ' : ''}Texas Notary Bond — Final Reminder</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:16px;color:#0f172a;font-weight:600;margin:0 0 8px;">Hi ${name},</p>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
      We sent you a reminder about your expiring Texas Notary Bond last week. We noticed you haven't renewed yet — your bond still expires on
      <strong style="color:${urgent ? '#dc2626' : '#d97706'}">${expDate}</strong>${days <= 14 ? ` (<strong>${days} days away</strong>)` : ''}.
    </p>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">
      Operating with a lapsed bond puts your notary commission at risk and can result in removal from the Texas SOS active notary registry.
    </p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${renewUrl}" style="display:inline-block;background:#f59e0b;color:#000000;font-size:18px;font-weight:800;padding:18px 48px;border-radius:8px;text-decoration:none;letter-spacing:1px;">
        RENEW NOW — $50 →
      </a>
      <div style="margin-top:10px;font-size:12px;color:#94a3b8;">We'll pre-fill your info — takes under 2 minutes.</div>
    </div>

    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <div style="font-size:12px;color:#475569;line-height:1.6;">
        <strong>4-Year Texas Notary Bond · $50 flat · RLI Insurance (A-rated) · Same-day PDF certificate</strong>
      </div>
    </div>

    <p style="font-size:13px;color:#0f172a;margin-top:20px;">
      Questions? Call <strong>(214) 666-8718</strong> or reply to this email.<br>
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

  const text = `Hi ${name},\n\nThis is a follow-up reminder that your Texas Notary Bond expires on ${expDate}${days <= 14 ? ` (${days} days away)` : ''}.\n\nRenew in under 2 minutes — we'll pre-fill your info:\n${renewUrl}\n\n4-Year Bond · RLI Insurance · $50 flat · Same-day PDF\n\nQuestions? Call (214) 666-8718\n\nQuantum Surety LLC · quantumsurety.bond\nUnsubscribe: ${unsubUrl}`;

  return { html, text };
}

async function run() {
  console.log(`[Followup] Starting 7-day notary follow-up | dry_run=${DRY_RUN} | limit=${LIMIT}`);

  // Target notaries who got the first campaign email 7+ days ago but whose bond still expires within 45 days
  const [notaries] = await pool.execute(
    `SELECT n.notary_id, n.first_name, n.last_name, n.email, n.expire_date, n.city
     FROM notaries n
     INNER JOIN notary_campaign_sends cs ON cs.email = n.email
     WHERE cs.campaign_name = 'renewal-45d-2026-05'
       AND cs.sent_at <= NOW() - INTERVAL 7 DAY
       AND n.expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 45 DAY)
       AND n.email NOT IN (SELECT email FROM unsubscribes)
       AND n.email NOT IN (
         SELECT email FROM notary_campaign_sends
         WHERE campaign_name = 'followup-7d-2026-05' AND sent_at > NOW() - INTERVAL 30 DAY
       )
     ORDER BY n.expire_date ASC
     LIMIT ?`,
    [LIMIT]
  );

  console.log(`[Followup] ${notaries.length} eligible notaries`);
  if (DRY_RUN) {
    console.log('[Followup] DRY RUN — sample:');
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
        Tags: [{ Name: 'campaign', Value: 'followup-7d' }, { Name: 'source', Value: 'bond-watch' }],
      }));
      await pool.execute(
        'INSERT IGNORE INTO notary_campaign_sends (notary_id, email, campaign_name, subject, status, is_auto) VALUES (?, ?, ?, ?, ?, ?)',
        [notary.notary_id, notary.email, 'followup-7d-2026-05', SUBJECT, 'sent', true]
      );
      sent++;
      if (sent % 100 === 0) console.log(`[Followup] Sent ${sent}/${notaries.length}...`);
      await new Promise(r => setTimeout(r, DELAY));
    } catch (e) {
      const msg = e.message || '';
      if (/throttl|rate.limit/i.test(msg)) {
        console.error('[Followup] Rate limited — pausing 30s');
        await new Promise(r => setTimeout(r, 30000));
      } else {
        failed++;
        if (!/invalid.*address|address.*invalid|email.*not/i.test(msg)) {
          console.error(`[Followup] Error for ${notary.email}:`, msg);
        }
      }
    }
  }

  console.log(`[Followup] Done. Sent: ${sent} | Failed: ${failed}`);
  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
