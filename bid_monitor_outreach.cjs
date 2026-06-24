#!/usr/bin/env node
/**
 * Outreach to TxSmartBuy bid monitor procurement contacts.
 * Pitch: refer contractors bidding on their projects to us for bonding.
 * Skips already-contacted emails.
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET }
});

const FROM = 'Theodore Sparks <ted@quantumsurety.bond>';
const DRY_RUN = process.argv.includes('--dry-run');

// Already emailed in a prior session
const ALREADY_SENT = new Set([
  'cynthia.greene@jeffersoncountytx.gov',
  'alicia.duke@tdcj.texas.gov',
]);

function buildEmail(contactEmail, projectName) {
  // Extract a short project description for personalization
  const project = (projectName || '').replace(/LOCAL LET MAINTENANCE CONTRACT[,\s]*/i, '').trim() || 'your project';
  const subject = `Bonding for contractors on your Texas project`;
  const html = `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:14px;color:#0f172a;margin:0 0 12px">Hi,</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 12px">
    I'm Ted Sparks at Quantum Surety — a TDI-licensed Texas surety agency. I noticed your recent procurement posting and wanted to make sure you're aware of us as a resource for contractor bonding.
  </p>
  <p style="color:#475569;line-height:1.7;margin:0 0 12px">
    If your project requires contractors to carry Performance &amp; Payment Bonds, Bid Bonds, or other surety bonds, we can issue them same-day and work with most contractor credit profiles. We're happy to help vendors on your project get bonded quickly.
  </p>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin:16px 0">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      ✓ Bid Bonds — same-day, any amount<br>
      ✓ Performance &amp; Payment Bonds — all project sizes<br>
      ✓ Texas Contractor License Bonds (TDLR)<br>
      ✓ TDI Licensed · quantumsurety.bond
    </p>
  </div>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    If you have contractors who need bonding and aren't sure where to turn, feel free to share my contact. I'm responsive and can typically turn quotes around the same day.
  </p>
  <p style="color:#64748b;font-size:13px;margin:0">
    — Ted Sparks · <strong>(214) 666-8718</strong> · ted@quantumsurety.bond<br>
    <span style="color:#94a3b8;font-size:11px">Quantum Surety LLC · TDI #3480229 · Wylie, TX</span>
  </p>
</div>`;
  const text = `Hi,\n\nI'm Ted Sparks at Quantum Surety (TDI License #3480229). I saw your recent TX procurement posting and wanted to connect.\n\nIf your project requires Performance & Payment Bonds or Bid Bonds, we can issue them same-day. Happy to be a resource for contractors who need bonding on your project.\n\nFeel free to share my contact with vendors who need bonds.\n\nTed Sparks · (214) 666-8718 · ted@quantumsurety.bond\nQuantum Surety LLC · TDI #3480229`;
  return { subject, html, text };
}

async function main() {
  const db = new Client({
    host: '192.168.4.122', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS || 'QsCRMV8yNgKOoaNPu67JF!'
  });
  await db.connect();

  const { rows } = await db.query(`
    SELECT DISTINCT ON (email) id, name, email
    FROM leads
    WHERE status = 'new'
      AND source = 'TxSmartBuy Bid Monitor'
      AND email IS NOT NULL AND email != ''
    ORDER BY email, id DESC
  `);

  console.log(`Found ${rows.length} bid monitor leads`);
  const sentIds = [];
  let sent = 0;

  for (const r of rows) {
    const email = r.email.toLowerCase().trim();
    if (ALREADY_SENT.has(email)) { console.log(`  SKIP (already sent) ${email}`); continue; }
    if (DRY_RUN) { console.log(`  [DRY] ${email} | ${(r.name||'').slice(0,60)}`); sentIds.push(r.id); continue; }
    const { subject, html, text } = buildEmail(email, r.name);
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: ['ted@quantumsurety.bond'],
        Destination: { ToAddresses: [email] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } }
      }));
      console.log(`  Sent → ${email}`);
      sentIds.push(r.id);
      sent++;
    } catch (e) {
      console.error(`  FAIL ${email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  if (!DRY_RUN && sentIds.length > 0) {
    await db.query(
      `UPDATE leads SET status='contacted', notes='Bid monitor procurement outreach sent', updated_at=NOW() WHERE id = ANY($1)`,
      [sentIds]
    );
    console.log(`Updated ${sentIds.length} leads to contacted`);
  }
  await db.end();
  console.log(`Done. Sent: ${sent}`);
}
main().catch(e => { console.error(e); process.exit(1); });
