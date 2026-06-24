#!/usr/bin/env node
/**
 * Google Review Ask — emails sold customers asking for a Google/TrustPilot review
 * Targets leads with status='sold' that have valid emails
 *
 * Usage:
 *   SES_KEY=... SES_SECRET=... CRM_DB_PASS=... node send_review_ask.cjs
 *   node send_review_ask.cjs --dry-run
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DRY_RUN  = process.argv.includes('--dry-run');
const SENT_LOG = path.join(__dirname, 'review_ask_sent.json');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM     = 'Theodore Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
// Google Business Profile review link — update with your actual GBP place ID
const REVIEW_URL = 'https://g.page/r/CfUj5WxGiI1KEBM/review';

function loadSent() { try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG,'utf8'))); } catch { return new Set(); } }
function logSent(e, s) { s.add(e); fs.writeFileSync(SENT_LOG, JSON.stringify([...s])); }

function buildEmail(lead) {
  const name = (lead.name || '').split(' ')[0] || 'there';
  const bond = lead.bond_type || 'surety bond';
  return {
    subject: `${name}, quick favor — how was your experience with Quantum Surety?`,
    html: `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 14px">
    Thank you for getting your <strong>${bond}</strong> through Quantum Surety. We're a small Texas-based agency and every review makes a real difference for us.
  </p>
  <p style="color:#475569;line-height:1.7;margin:0 0 20px">
    If you had a good experience, would you mind leaving us a quick Google review? It takes about 60 seconds and helps other Texas professionals find us when they need a bond.
  </p>
  <a href="${REVIEW_URL}" style="display:inline-block;background:#f59e0b;color:#000;padding:13px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;margin-bottom:20px">
    ⭐ Leave a Google Review
  </a>
  <p style="color:#64748b;font-size:13px;line-height:1.6">
    If anything wasn't perfect, just reply to this email — I read every response personally.<br><br>
    Thank you,<br>
    <strong>Theodore Sparks</strong><br>
    Founder, Quantum Surety LLC<br>
    (214) 666-8718
  </p>
  <p style="color:#94a3b8;font-size:11px;margin-top:20px">Quantum Surety LLC · TDI #3480229 · Wylie, TX</p>
</div>`,
    text: `Hi ${name},\n\nThank you for getting your ${bond} through Quantum Surety.\n\nIf you had a good experience, a quick Google review would mean a lot to us:\n${REVIEW_URL}\n\nIf anything wasn't perfect, just reply — I read every response personally.\n\nThank you,\nTheodore Sparks\nFounder, Quantum Surety LLC\n(214) 666-8718`,
  };
}

async function main() {
  const db = new Client({
    host: '192.168.4.122', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS || 'QsCRMV8yNgKOoaNPu67JF!',
  });
  await db.connect();

  const { rows } = await db.query(`
    SELECT DISTINCT ON (email) id, name, email, bond_type
    FROM leads
    WHERE status = 'sold'
      AND email IS NOT NULL AND email != ''
      AND email NOT LIKE '%noemail%'
    ORDER BY email, updated_at DESC
  `);

  await db.end();
  console.log(`Found ${rows.length} sold customers`);

  const sent = loadSent();
  let count = 0;

  for (const lead of rows) {
    const email = lead.email.toLowerCase().trim();
    if (sent.has(email)) { console.log(`  skip (already sent): ${email}`); continue; }

    const { subject, html, text } = buildEmail(lead);

    if (DRY_RUN) {
      console.log(`  [DRY] → ${email} | "${subject}"`);
      count++; continue;
    }

    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [email] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
      }));
      logSent(email, sent);
      count++;
      console.log(`  Sent → ${email}`);
    } catch (e) {
      console.error(`  FAIL ${email}: ${e.message}`);
    }
  }
  console.log(`Done. Sent: ${count}`);
}
main().catch(e => { console.error(e); process.exit(1); });
