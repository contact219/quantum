#!/usr/bin/env node
/**
 * GDN Dealer Bond Email Blast
 * Targets: (1) expired dealers — urgent compliance warning
 *          (2) expiring dealers (≤90 days) — renewal reminder
 *
 * Usage:
 *   node gdn_bond_blast.cjs --dry-run          preview only
 *   node gdn_bond_blast.cjs --segment expired  expired only
 *   node gdn_bond_blast.cjs --segment expiring expiring only
 *   node gdn_bond_blast.cjs                    all
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DRY_RUN  = process.argv.includes('--dry-run');
const SEGMENT  = process.argv.includes('--segment') ? process.argv[process.argv.indexOf('--segment') + 1] : 'all';
const LIMIT_IDX = process.argv.indexOf('--limit');
const SEND_LIMIT = LIMIT_IDX !== -1 ? parseInt(process.argv[LIMIT_IDX + 1], 10) : Infinity;
const SENT_LOG = path.join(__dirname, 'gdn_blast_sent.json');
const RATE_MS  = 150; // ~6/sec, well within SES limits

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM     = 'Theodore Sparks <nice.shotwell-sparks@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

function loadSent() {
  try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'))); }
  catch { return new Set(); }
}
function logSent(email, sent) {
  sent.add(email);
  fs.writeFileSync(SENT_LOG, JSON.stringify([...sent]));
}

function daysUntil(dateStr) {
  return Math.floor((new Date(dateStr) - new Date()) / 86400000);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function buildExpiredEmail(dealer) {
  const verifyUrl = `https://verify.quantumsurety.bond`;
  const renewUrl  = `https://quantumsurety.bond/get-bond?type=dealer&license=${encodeURIComponent(dealer.license_number)}&utm_source=blast&utm_campaign=gdn_expired`;
  const expiredOn = formatDate(dealer.license_expiration);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;font-size:15px;line-height:1.75;background:#fff">

<div style="border-bottom:3px solid #ef4444;padding-bottom:12px;margin-bottom:24px">
  <h1 style="margin:0;font-size:18px;color:#0A0A0F">QUANTUM SURETY</h1>
  <p style="margin:2px 0 0;font-size:11px;color:#888;letter-spacing:2px">TEXAS GDN BOND COMPLIANCE NOTICE</p>
</div>

<p>Hi ${dealer.business_name},</p>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;margin:20px 0;border-radius:0 6px 6px 0">
  <p style="margin:0;font-weight:700;color:#991b1b;font-size:16px">⚠ Your GDN Dealer Bond Has Expired</p>
  <p style="margin:8px 0 0;color:#7f1d1d;font-size:14px">License #${dealer.license_number} — Bond expired ${expiredOn}</p>
</div>

<p>Your Texas GDN surety bond expired on <strong>${expiredOn}</strong>. Under Texas law, operating a dealership without an active surety bond puts your GDN license at risk — TxDMV can suspend or revoke your license for a lapsed bond.</p>

<p>We've also launched a free public bond lookup tool at <strong>verify.quantumsurety.bond</strong> where car buyers can now check any dealer's bond status before purchasing a vehicle. Your current status shows as <strong style="color:#ef4444">EXPIRED</strong> on that tool.</p>

<div style="background:#f9f6ef;border-left:4px solid #C9A84C;padding:18px 22px;margin:24px 0">
  <p style="margin:0 0 10px;font-weight:bold;color:#0A0A0F">Renew Your GDN Bond Today</p>
  <ul style="margin:0;padding-left:20px;color:#333;font-size:14px;line-height:1.9">
    <li>Instant online issuance — certificate emailed immediately</li>
    <li>TxDMV-approved carriers — meets all GDN requirements</li>
    <li>Affordable rates — no office visit required</li>
    <li>Renew in under 5 minutes</li>
  </ul>
</div>

<p style="margin:24px 0">
  <a href="${renewUrl}" style="background:#C9A84C;color:#000;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;display:inline-block">
    Renew GDN Bond Now →
  </a>
</p>

<p>Questions? Reply to this email or call <strong>(214) 666-8718</strong>.</p>

<p>Best,<br>
<strong>Theodore Sparks</strong><br>
Quantum Surety LLC<br>
TDI License #3480229 | (214) 666-8718<br>
<a href="https://quantumsurety.bond" style="color:#2563eb">quantumsurety.bond</a></p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0">
<p style="font-size:11px;color:#94a3b8">
  Quantum Surety LLC · 1910 Pacific Ave Ste 8090, Dallas TX 75201 · TDI #3480229<br>
  <a href="mailto:contact@quantumsurety.bond?subject=Unsubscribe&body=Please unsubscribe ${encodeURIComponent(dealer.email)}" style="color:#94a3b8">Unsubscribe</a>
</p>
</body></html>`;

  const text = `Hi ${dealer.business_name},

Your GDN dealer bond has expired.

License #${dealer.license_number} — Bond expired ${expiredOn}

Under Texas law, operating without an active surety bond puts your GDN license at risk. Your status also shows as EXPIRED on our public dealer lookup at verify.quantumsurety.bond.

Renew your GDN bond instantly: ${renewUrl}

Questions? Call (214) 666-8718 or reply to this email.

Theodore Sparks
Quantum Surety LLC | TDI #3480229 | (214) 666-8718
quantumsurety.bond`;

  return {
    subject: `⚠ GDN Bond Expired — License #${dealer.license_number} (${dealer.business_name})`,
    html,
    text,
  };
}

function buildExpiringEmail(dealer) {
  const days    = daysUntil(dealer.license_expiration);
  const expDate = formatDate(dealer.license_expiration);
  const renewUrl = `https://quantumsurety.bond/get-bond?type=dealer&license=${encodeURIComponent(dealer.license_number)}&utm_source=blast&utm_campaign=gdn_expiring`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;font-size:15px;line-height:1.75;background:#fff">

<div style="border-bottom:3px solid #C9A84C;padding-bottom:12px;margin-bottom:24px">
  <h1 style="margin:0;font-size:18px;color:#0A0A0F">QUANTUM SURETY</h1>
  <p style="margin:2px 0 0;font-size:11px;color:#888;letter-spacing:2px">TEXAS GDN BOND RENEWAL REMINDER</p>
</div>

<p>Hi ${dealer.business_name},</p>

<p>Your Texas GDN dealer bond expires in <strong>${days} day${days !== 1 ? 's' : ''}</strong> on <strong>${expDate}</strong>.</p>

<div style="background:#f9f6ef;border-left:4px solid #C9A84C;padding:18px 22px;margin:24px 0;border-radius:0 6px 6px 0">
  <p style="margin:0 0 6px;font-weight:bold;color:#0A0A0F">License #${dealer.license_number}</p>
  <p style="margin:0;color:#555;font-size:14px">Bond expires: <strong>${expDate}</strong> &nbsp;·&nbsp; ${days} days remaining</p>
</div>

<p>Don't let your bond lapse — TxDMV requires an active surety bond for your GDN license to remain valid. Renewing with Quantum Surety takes less than 5 minutes and your certificate arrives by email instantly.</p>

<p style="margin:24px 0">
  <a href="${renewUrl}" style="background:#C9A84C;color:#000;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;display:inline-block">
    Renew GDN Bond — Instant Certificate →
  </a>
</p>

<p style="font-size:13px;color:#64748b">Already renewed with another company? No action needed. This is a courtesy reminder from Quantum Surety — we maintain a public dealer bond lookup at <a href="https://verify.quantumsurety.bond" style="color:#2563eb">verify.quantumsurety.bond</a>.</p>

<p>Best,<br>
<strong>Theodore Sparks</strong><br>
Quantum Surety LLC<br>
TDI License #3480229 | (214) 666-8718<br>
<a href="https://quantumsurety.bond" style="color:#2563eb">quantumsurety.bond</a></p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0">
<p style="font-size:11px;color:#94a3b8">
  Quantum Surety LLC · 1910 Pacific Ave Ste 8090, Dallas TX 75201 · TDI #3480229<br>
  <a href="mailto:contact@quantumsurety.bond?subject=Unsubscribe&body=Please unsubscribe ${encodeURIComponent(dealer.email)}" style="color:#94a3b8">Unsubscribe</a>
</p>
</body></html>`;

  const text = `Hi ${dealer.business_name},

Your Texas GDN dealer bond expires in ${days} days on ${expDate}.

License #${dealer.license_number}

Renew instantly at: ${renewUrl}

Theodore Sparks
Quantum Surety LLC | TDI #3480229 | (214) 666-8718
quantumsurety.bond`;

  return {
    subject: `GDN Bond Expires in ${days} Days — ${dealer.business_name} (License #${dealer.license_number})`,
    html,
    text,
  };
}

async function main() {
  const pg = new Client({
    host: '192.168.4.122',
    port: 5433,
    database: 'quantum_surety',
    user: 'quantum_user',
    password: process.env.CRM_DB_PASS,
  });
  await pg.connect();

  let query;
  if (SEGMENT === 'expired') {
    query = `SELECT business_name, license_number, license_expiration::text, email
             FROM auto_dealers
             WHERE license_expiration < CURRENT_DATE
               AND email IS NOT NULL AND email != ''
             ORDER BY license_expiration DESC`;
  } else if (SEGMENT === 'expiring') {
    query = `SELECT business_name, license_number, license_expiration::text, email
             FROM auto_dealers
             WHERE license_expiration BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
               AND email IS NOT NULL AND email != ''
             ORDER BY license_expiration ASC`;
  } else {
    query = `SELECT business_name, license_number, license_expiration::text, email
             FROM auto_dealers
             WHERE (license_expiration < CURRENT_DATE OR license_expiration <= CURRENT_DATE + INTERVAL '90 days')
               AND email IS NOT NULL AND email != ''
             ORDER BY license_expiration ASC`;
  }

  const { rows } = await pg.query(query);
  await pg.end();

  console.log(`[GDN Blast] Segment: ${SEGMENT} | ${rows.length} dealers loaded${DRY_RUN ? ' | DRY RUN' : ''}`);

  const sent = loadSent();
  let count = 0, skipped = 0, errors = 0;

  for (const dealer of rows) {
    if (count >= SEND_LIMIT) { console.log(`[GDN Blast] Limit of ${SEND_LIMIT} reached, stopping.`); break; }
    if (sent.has(dealer.email)) { skipped++; continue; }

    const isExpired = daysUntil(dealer.license_expiration) < 0;
    const { subject, html, text } = isExpired ? buildExpiredEmail(dealer) : buildExpiringEmail(dealer);

    if (DRY_RUN) {
      console.log(`  [DRY] ${isExpired ? '🔴 EXPIRED' : '🟡 EXPIRING'} → ${dealer.email} | ${dealer.business_name} | exp: ${dealer.license_expiration}`);
      count++;
      continue;
    }

    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [dealer.email] },
        ReplyToAddresses: [REPLY_TO],
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Html: { Data: html, Charset: 'UTF-8' }, Text: { Data: text, Charset: 'UTF-8' } },
        },
      }));
      logSent(dealer.email, sent);
      console.log(`  ✓ ${dealer.email} — ${dealer.business_name}`);
      count++;
      await new Promise(r => setTimeout(r, RATE_MS));
    } catch (e) {
      console.error(`  ✗ ${dealer.email}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\n[GDN Blast] Done. Sent: ${count} | Skipped: ${skipped} | Errors: ${errors}`);
}

main().catch(console.error);
