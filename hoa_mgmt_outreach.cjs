#!/usr/bin/env node
/**
 * HOA Management Company Outreach
 * Sends personalized emails to HOA/property management company contacts
 * pitching the free Vendor Compliance Portal.
 *
 * Usage: node hoa_mgmt_outreach.js [--dry-run] [--limit N]
 * CSV: hoa_contacts.csv (name, company, email, city, communities)
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT_IDX = process.argv.indexOf('--limit');
const LIMIT = LIMIT_IDX >= 0 ? parseInt(process.argv[LIMIT_IDX + 1]) : Infinity;

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

const FROM = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const SENT_LOG = path.join(__dirname, 'hoa_outreach_sent.json');

function loadSent() {
  try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'))); }
  catch { return new Set(); }
}
function logSent(email, sent) {
  sent.add(email);
  fs.writeFileSync(SENT_LOG, JSON.stringify([...sent]));
}

function buildEmail(row) {
  const firstName = (row.name || '').split(' ')[0] || 'there';
  const company = row.company || 'your organization';
  const city = row.city ? ` in ${row.city}` : '';
  const commStr = row.communities ? ` (${row.communities} communities)` : '';

  const subject = `Free tool: see which of your vendors has an expired bond`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1e293b;font-size:15px;line-height:1.7">

<p>Hi ${firstName},</p>

<p>Quick question: does ${company} have a way to monitor your contractors' surety bond expiration dates across your managed communities${commStr}?</p>

<p>If not — this is a bigger exposure than most management companies realize. <strong>Texas TDLR data shows 29.3% of licensed contractors are currently operating with expired bonds.</strong> When one of those contractors causes damage to a community you manage, the HOA — and sometimes the management company — faces liability, especially if bond status wasn't checked before the work was authorized.</p>

<p>We built a free tool specifically for this:</p>

<table style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin:20px 0;width:100%;border-collapse:collapse">
  <tr><td style="padding:8px 0">
    <strong style="font-size:16px;color:#0a0f1e">Vendor Bond Compliance Portal</strong><br>
    <span style="font-size:12px;color:#059669;font-weight:700">FREE — No credit card required</span>
  </td></tr>
  <tr><td style="padding:4px 0;font-size:14px;color:#334155">
    ✅ Upload your full vendor list (CSV or license-by-license)<br>
    ✅ Live bond status + <strong>QS Score™</strong> for every contractor<br>
    ✅ Automatic email alerts when any vendor's bond expires<br>
    ✅ One-click renewal link to send to lapsed vendors<br>
    ✅ Works across all 816,000+ TDLR-licensed contractors in Texas
  </td></tr>
</table>

<p>Setup takes under 2 minutes:</p>
<p style="margin:0">
  <a href="https://quantumsurety.bond/hoa-portal" style="display:inline-block;background:#0a0f1e;color:#f59e0b;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:800;font-size:15px">
    Open Free Vendor Portal →
  </a>
</p>

<p style="margin-top:24px">We make money when contractors renew their bonds — not from management companies. The portal is completely free for you.</p>

<p>Happy to show you how it works for your portfolio${city} on a quick 10-minute call. Just reply or call me at (214) 666-8718.</p>

<p>Best,<br>
<strong>Theodore Sparks</strong><br>
Quantum Surety LLC<br>
TDI License #3480229 | (214) 666-8718<br>
<a href="https://quantumsurety.bond" style="color:#2563eb">quantumsurety.bond</a></p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
<p style="font-size:11px;color:#94a3b8">
  Quantum Surety LLC · 1416 Bessie Drive, Wylie, TX 75098 · TDI #3480229<br>
  Texas contractor bond data sourced from TDLR public records (data.texas.gov).<br>
  <a href="mailto:contact@quantumsurety.bond?subject=Unsubscribe" style="color:#94a3b8">Unsubscribe</a>
</p>

</body>
</html>`;

  const text = `Hi ${firstName},

Quick question: does ${company} have a way to monitor your contractors' surety bond expiration dates across your managed communities?

Texas TDLR data shows 29.3% of licensed contractors are currently operating with expired bonds. When one of those contractors causes damage to a community you manage, the HOA (and sometimes the management company) faces liability if bond status wasn't verified before work was authorized.

We built a free Vendor Bond Compliance Portal specifically for this:
https://quantumsurety.bond/hoa-portal

- Upload your vendor list (CSV or one-by-one)
- Live bond status + QS Score for every contractor
- Automatic email alerts when any vendor's bond expires
- One-click renewal link for lapsed vendors
- Covers all 816,000+ TDLR-licensed contractors in Texas

Setup takes 2 minutes. No credit card, no contract.

Happy to show you how it works — just reply or call (214) 666-8718.

Theodore Sparks
Quantum Surety LLC | TDI #3480229
quantumsurety.bond`;

  return { subject, html, text };
}

async function send(row, sesClient) {
  const { subject, html, text } = buildEmail(row);
  const cmd = new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: [row.email] },
    ReplyToAddresses: [REPLY_TO],
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: html, Charset: 'UTF-8' },
        Text: { Data: text, Charset: 'UTF-8' },
      },
    },
  });
  await sesClient.send(cmd);
}

async function main() {
  // Read contacts CSV
  if (!fs.existsSync('hoa_contacts.csv')) {
    console.error('hoa_contacts.csv not found. Create it first.');
    process.exit(1);
  }
  const lines = fs.readFileSync('hoa_contacts.csv', 'utf8').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    return obj;
  }).filter(r => r.email && r.email.includes('@'));

  console.log(`[HOA Outreach] ${rows.length} contacts loaded.`);
  if (DRY_RUN) console.log('[DRY RUN] Not sending.');

  const sent = loadSent();
  let count = 0;

  for (const row of rows) {
    if (count >= LIMIT) break;
    if (sent.has(row.email)) {
      console.log(`  SKIP (already sent): ${row.email}`);
      continue;
    }

    if (DRY_RUN) {
      const { subject } = buildEmail(row);
      console.log(`  [DRY] → ${row.email} | ${row.company} | Subject: ${subject}`);
      count++;
      continue;
    }

    try {
      await send(row, ses);
      logSent(row.email, sent);
      console.log(`  ✓ Sent → ${row.email} (${row.company})`);
      count++;
      await new Promise(r => setTimeout(r, 200)); // rate limit
    } catch (e) {
      console.error(`  ✗ FAILED ${row.email}: ${e.message}`);
    }
  }

  console.log(`\n[HOA Outreach] Done. Sent: ${count}`);
}

main().catch(console.error);
