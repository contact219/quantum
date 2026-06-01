require('dotenv').config({ path: '/var/www/bondverify/.env' });
const mysql = require('mysql2/promise');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASS, database: process.env.DB_NAME,
  waitForConnections: true, connectionLimit: 10, timezone: '+00:00'
});

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET }
});

const TIERS = [60, 30, 14, 7, 3, 1, -1]; // -1 = 1 day past lapse

const SUBJECTS = {
  60: `Your Texas Notary Bond Expires in 60 Days`,
  30: `30 Days Left — Renew Your Texas Notary Bond`,
  14: `⚠️ 2 Weeks Left on Your Notary Bond`,
  7:  `URGENT: Your Notary Bond Expires in 7 Days`,
  3:  `3 Days Left — Renew Before You Lose Your Commission`,
  1:  `Tomorrow: Last Day to Renew Your Notary Bond`,
  '-1': `Your Notary Bond Has Lapsed — Reinstate Today`
};

function buildEmail(firstName, notaryId, expireDateObj, daysLeft) {
  const expStr = expireDateObj.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  const lapsed = daysLeft < 0;
  const accentColor = daysLeft <= 3 ? '#dc2626' : daysLeft <= 14 ? '#d97706' : '#0ea5e9';
  const renewUrl = `https://quantumsurety.bond/bonds/notary-bond?notary_id=${encodeURIComponent(notaryId)}`;

  const headline = lapsed
    ? `Your bond lapsed on ${expStr}.`
    : `Your bond expires <strong>${daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}</strong> on ${expStr}.`;

  const body = lapsed
    ? `<p style="color:#475569">Hi ${firstName}, your Texas notary bond expired on <strong>${expStr}</strong>. Until you reinstate, you cannot legally perform notarizations in Texas.</p>
       <p style="color:#475569">The good news: Quantum Surety can reinstate your bond <strong>same day</strong>, with your certificate emailed instantly.</p>`
    : daysLeft <= 7
    ? `<p style="color:#475569">Hi ${firstName}, this is a final reminder — your Texas notary bond expires very soon. Without an active bond, your notary commission is suspended and you cannot notarize documents.</p>
       <p style="color:#475569"><strong>Renew in under 2 minutes. Certificate delivered instantly. $50.</strong></p>`
    : `<p style="color:#475569">Hi ${firstName}, your Texas notary bond is coming up on its expiration date. Renewing early guarantees no gap in your commission and locks in today's rate.</p>
       <p style="color:#475569">It takes under 2 minutes online, and your certificate is emailed the same day.</p>`;

  const cta = lapsed ? 'Reinstate My Bond — $50' : 'Renew My Bond — $50';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:580px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <div style="background:#0f172a;padding:24px 32px;display:flex;align-items:center;gap:12px">
    <img src="https://quantumsurety.bond/QS_Logo.png" width="36" height="36" alt="QS"/>
    <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:.02em">Quantum Surety</span>
  </div>
  <div style="padding:32px">
    <div style="background:${accentColor}1a;border-left:4px solid ${accentColor};border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px">
      <p style="margin:0;color:#0f172a;font-size:15px">${headline}</p>
    </div>
    ${body}
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:24px 0;font-size:13px;color:#64748b">
      <strong>Notary ID:</strong> ${notaryId} &nbsp;|&nbsp; <strong>Bond Expires:</strong> ${expStr}
    </div>
    <a href="${renewUrl}" style="display:block;text-align:center;background:${accentColor};color:#fff;padding:16px;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none;margin-bottom:24px">${cta}</a>
    <p style="font-size:13px;color:#94a3b8;line-height:1.6">
      Questions? Reply to this email or call <a href="tel:+12145067373" style="color:#94a3b8">214-506-7373</a>.<br/>
      <a href="https://quantumsurety.bond/unsubscribe?id=${notaryId}" style="color:#94a3b8">Unsubscribe</a> &bull;
      <a href="https://quantumsurety.bond" style="color:#94a3b8">quantumsurety.bond</a>
    </p>
  </div>
</div>
</body></html>`;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const today = new Date();
  today.setHours(0,0,0,0);
  let totalSent = 0, totalSkipped = 0, totalErrors = 0;

  for (const days of TIERS) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + days);
    const dateStr = targetDate.toISOString().split('T')[0];

    // Get notaries expiring on target date that haven't been emailed this tier+expire_date combo
    const [rows] = await pool.execute(`
      SELECT n.notary_id, n.first_name, n.email, n.expire_date
      FROM notaries n
      WHERE DATE(n.expire_date) = ?
        AND n.email IS NOT NULL AND n.email != '' AND n.email LIKE '%@%'
        AND NOT EXISTS (
          SELECT 1 FROM renewal_outreach r
          WHERE r.recipient_type = 'notary'
            AND r.recipient_id = n.notary_id
            AND r.days_before = ?
            AND r.bond_expire_date = DATE(n.expire_date)
        )
      LIMIT 2000
    `, [dateStr, days]);

    if (!rows.length) continue;
    console.log(`[${days > 0 ? days+'-day' : 'lapsed'}] Found ${rows.length} notaries to email`);

    let batchSent = 0;
    for (const row of rows) {
      try {
        const expObj = new Date(row.expire_date);
        const html = buildEmail(row.first_name || 'Notary', row.notary_id, expObj, days);
        const subject = SUBJECTS[days] || `Bond Expiration Notice — ${row.notary_id}`;

        await ses.send(new SendEmailCommand({
          Source: 'alerts@quantumsurety.bond',
          Destination: { ToAddresses: [row.email] },
          Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } }
        }));

        await pool.execute(`
          INSERT IGNORE INTO renewal_outreach (recipient_type, recipient_id, email, days_before, bond_expire_date)
          VALUES ('notary', ?, ?, ?, ?)
        `, [row.notary_id, row.email, days, dateStr]);

        batchSent++;
        totalSent++;

        // Rate limiting — ~14 sends/second to stay under SES limits
        if (batchSent % 10 === 0) await sleep(700);
      } catch(e) {
        totalErrors++;
        if (totalErrors <= 5) console.error(`Error sending to ${row.email}:`, e.message);
      }
    }
    console.log(`[${days > 0 ? days+'-day' : 'lapsed'}] Sent: ${batchSent}`);
  }

  console.log(`\nRenewal outreach complete. Sent: ${totalSent} | Errors: ${totalErrors}`);
  await pool.end();
  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
