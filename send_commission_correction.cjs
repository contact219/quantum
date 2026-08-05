#!/usr/bin/env node
/**
 * Correction email to campaign-46 openers.
 * Fixes the 55% → 10% commission error.
 * Reads /tmp/referral_openers.csv (first_name,last_name,email)
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs   = require('fs');
const path = require('path');

const ses      = new SESClient({ region: 'us-east-2', credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET } });
const FROM     = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const SENT_LOG = path.join(__dirname, 'commission_correction_sent.json');
const CSV      = process.argv[2] || '/tmp/referral_openers.csv';
const DRY_RUN  = process.argv.includes('--dry-run');

function loadSent() {
  try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'))); }
  catch { return new Set(); }
}
function logSent(email, sent) {
  sent.add(email);
  fs.writeFileSync(SENT_LOG, JSON.stringify([...sent]));
}

function buildEmail(firstName) {
  const greeting = firstName ? `Hi ${firstName},` : `Hi,`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;font-size:15px;line-height:1.75">

<div style="border-bottom:3px solid #C9A84C;padding-bottom:12px;margin-bottom:24px">
  <h1 style="margin:0;font-size:20px;color:#0A0A0F">QUANTUM SURETY</h1>
</div>

<p>${greeting}</p>

<p>I need to send you a quick correction regarding the referral program email you received from us recently.</p>

<p>That email stated a <strong>55% commission</strong> on referrals — that was an error on our part. We apologize for the confusion.</p>

<p>The correct commission rate for our referral program is <strong>10% of the bond sale</strong>.</p>

<div style="background:#f9f6ef;border-left:4px solid #C9A84C;padding:18px 22px;margin:24px 0">
  <p style="margin:0 0 10px;font-weight:bold;color:#0A0A0F">Referral Program — Correct Details</p>
  <ul style="margin:0;padding-left:20px;color:#333;font-size:14px;line-height:1.8">
    <li>Earn <strong>10% commission</strong> on every notary bond sold through your referral</li>
    <li>Texas notary bonds are $50 — you earn $5 per referral</li>
    <li>No paperwork, no hassle — we handle everything</li>
    <li>Commissions paid monthly via check or ACH</li>
  </ul>
</div>

<p>If you have questions about the program or want to get started, just reply to this email or visit our partner page:</p>

<p style="margin:24px 0">
  <a href="https://partners.quantumsurety.bond" style="background:#C9A84C;color:#000;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px">
    Join the Referral Program →
  </a>
</p>

<p>Again, I apologize for the error. We take accuracy seriously and wanted to correct this immediately.</p>

<p>Best,<br>
<strong>Theodore Sparks</strong><br>
Quantum Surety LLC<br>
TDI License #3480229 | (214) 666-8718<br>
<a href="https://quantumsurety.bond" style="color:#2563eb">quantumsurety.bond</a></p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0">
<p style="font-size:11px;color:#94a3b8">
  Quantum Surety LLC · 1416 Bessie Drive, Wylie, TX 75098 · TDI #3480229<br>
  <a href="mailto:contact@quantumsurety.bond?subject=Unsubscribe" style="color:#94a3b8">Unsubscribe</a>
</p>

</body>
</html>`;

  const text = `${greeting}

I need to send you a quick correction regarding the referral program email you received from us recently.

That email stated a 55% commission on referrals — that was an error. We apologize for the confusion.

The correct commission rate is 10% of the bond sale.

Referral Program — Correct Details:
- Earn 10% commission on every notary bond sold through your referral
- Texas notary bonds are $50 — you earn $5 per referral
- No paperwork — we handle everything
- Commissions paid monthly via check or ACH

Join the referral program: https://partners.quantumsurety.bond

Again, I apologize for the error.

Theodore Sparks
Quantum Surety LLC | TDI #3480229 | (214) 666-8718
quantumsurety.bond`;

  return {
    subject: 'Correction: our referral commission rate is 10%, not 55%',
    html,
    text,
  };
}

async function main() {
  if (!fs.existsSync(CSV)) { console.error(`CSV not found: ${CSV}`); process.exit(1); }

  const lines = fs.readFileSync(CSV, 'utf8').trim().split('\n');
  const contacts = lines.map(l => {
    const parts = l.split(',');
    return { firstName: parts[0]?.trim() || '', lastName: parts[1]?.trim() || '', email: parts[2]?.trim() || '' };
  }).filter(c => c.email && c.email.includes('@'));

  console.log(`[Correction Blast] ${contacts.length} contacts loaded.`);
  if (DRY_RUN) console.log('[DRY RUN] Not sending.');

  const sent = loadSent();
  let count = 0;

  for (const c of contacts) {
    if (sent.has(c.email)) { console.log(`  SKIP: ${c.email}`); continue; }

    const { subject, html, text } = buildEmail(c.firstName);

    if (DRY_RUN) {
      console.log(`  [DRY] → ${c.email} | ${c.firstName} ${c.lastName}`);
      count++;
      continue;
    }

    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [c.email] },
        ReplyToAddresses: [REPLY_TO],
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Html: { Data: html, Charset: 'UTF-8' }, Text: { Data: text, Charset: 'UTF-8' } },
        },
      }));
      logSent(c.email, sent);
      console.log(`  ✓ ${c.email}`);
      count++;
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.error(`  ✗ ${c.email}: ${e.message}`);
    }
  }

  console.log(`\n[Correction Blast] Done. Sent: ${count}`);
}

main().catch(console.error);
