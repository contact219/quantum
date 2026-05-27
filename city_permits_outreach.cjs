#!/usr/bin/env node
/**
 * City Permitting Office Outreach
 * Pitches the free contractor bond verification widget for permit portals.
 *
 * Usage: node city_permits_outreach.js [--dry-run] [--limit N]
 * CSV: city_permits_contacts.csv (city, state, department, contact_name, email, portal_url)
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT_IDX = process.argv.indexOf('--limit');
const LIMIT = LIMIT_IDX >= 0 ? parseInt(process.argv[LIMIT_IDX + 1]) : Infinity;

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

const FROM = 'Theodore Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const SENT_LOG = path.join(__dirname, 'city_outreach_sent.json');

function loadSent() {
  try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'))); }
  catch { return new Set(); }
}
function logSent(email, sent) {
  sent.add(email);
  fs.writeFileSync(SENT_LOG, JSON.stringify([...sent]));
}

function buildEmail(row) {
  const city = row.city || 'your city';
  const dept = row.department || 'Building Permit Office';
  const firstName = row.contact_name ? row.contact_name.split(' ')[0] : null;
  const greeting = firstName ? `Hi ${firstName},` : `Hello,`;

  const subject = `Free contractor bond widget for ${city}'s permit portal — zero cost`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1e293b;font-size:15px;line-height:1.7">

<p>${greeting}</p>

<p>I'm reaching out from Quantum Surety LLC about a free tool we've built that could benefit ${city} residents who apply for building permits.</p>

<p>Here's the problem: <strong>Texas TDLR data shows nearly 1 in 3 licensed contractors — 29.3% — is currently operating with an expired surety bond.</strong> When a homeowner hires one and damage occurs, they often have no recourse even if the contractor had a valid license number. Most residents don't know to check bond status separately from license status.</p>

<p>We've built a free embeddable contractor bond verification widget that ${city}'s ${dept} could display at the point of permit application, letting any homeowner instantly see their contractor's real-time TDLR bond status.</p>

<table style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin:20px 0;width:100%;border-collapse:collapse">
  <tr><td style="padding:6px 0">
    <strong style="color:#0a0f1e">What it looks like:</strong>
    <a href="https://quantumsurety.bond/embed-widget" style="color:#2563eb"> quantumsurety.bond/embed-widget</a>
  </td></tr>
  <tr><td style="padding:6px 0;font-size:14px;color:#334155">
    ✅ <strong>Zero cost</strong> to ${city} — no contract, no maintenance<br>
    ✅ One embed code — works in any web portal or CMS<br>
    ✅ Live data from TDLR public records, updated daily<br>
    ✅ Covers all 816,000+ licensed contractors in Texas<br>
    ✅ Shows bond status, expiry date, and license type instantly
  </td></tr>
</table>

<p>This is a consumer protection tool. We're not asking for payment or a partnership agreement — just trying to get better information in front of Texas homeowners at the moment it matters most: <strong>before the permit is issued</strong>.</p>

<p>Are you the right person to connect with about this, or could you point me to the appropriate department? I'm happy to provide a live demo, documentation, or a technical contact for your web team.</p>

<p>Best,<br>
<strong>Theodore Sparks</strong><br>
Quantum Surety LLC<br>
TDI License #3480229 | (214) 666-8718<br>
<a href="https://quantumsurety.bond" style="color:#2563eb">quantumsurety.bond</a></p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">

<p style="font-size:12px;color:#94a3b8;margin-bottom:4px"><strong>About the data:</strong> Bond status data is pulled daily from the Texas Department of Licensing and Regulation (TDLR) public records at data.texas.gov, dataset 7358-krk7. Quantum Surety LLC is licensed by the Texas Department of Insurance (TDI #3480229) as a surplus lines agent.</p>

<p style="font-size:11px;color:#94a3b8">
  Quantum Surety LLC · Dallas, TX · (214) 666-8718<br>
  <a href="mailto:contact@quantumsurety.bond?subject=Unsubscribe" style="color:#94a3b8">Unsubscribe</a>
</p>

</body>
</html>`;

  const text = `${greeting}

I'm reaching out from Quantum Surety LLC about a free tool we've built that could benefit ${city} residents applying for building permits.

Texas TDLR data shows nearly 1 in 3 licensed contractors (29.3%) is currently operating with an expired surety bond. Most residents don't know to check bond status separately from license status.

We've built a free embeddable contractor bond verification widget that ${city}'s ${dept} could display at the point of permit application.

What it looks like: https://quantumsurety.bond/embed-widget

- Zero cost to ${city} — no contract, no maintenance
- One embed code, works in any web portal or CMS
- Live TDLR public data updated daily
- Covers all 816,000+ licensed Texas contractors

Are you the right person to connect with about this, or could you point me to the right department?

Theodore Sparks
Quantum Surety LLC | TDI #3480229
(214) 666-8718 | quantumsurety.bond`;

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
  if (!fs.existsSync('city_permits_contacts.csv')) {
    console.error('city_permits_contacts.csv not found.');
    process.exit(1);
  }
  const lines = fs.readFileSync('city_permits_contacts.csv', 'utf8').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    return obj;
  }).filter(r => r.email && r.email.includes('@'));

  console.log(`[City Permits Outreach] ${rows.length} contacts loaded.`);
  if (DRY_RUN) console.log('[DRY RUN] Not sending.');

  const sent = loadSent();
  let count = 0;

  for (const row of rows) {
    if (count >= LIMIT) break;
    if (sent.has(row.email)) {
      console.log(`  SKIP: ${row.email}`);
      continue;
    }

    if (DRY_RUN) {
      const { subject } = buildEmail(row);
      console.log(`  [DRY] → ${row.email} | ${row.city}, TX | Subject: ${subject}`);
      count++;
      continue;
    }

    try {
      await send(row, ses);
      logSent(row.email, sent);
      console.log(`  ✓ Sent → ${row.email} (${row.city}, TX)`);
      count++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(`  ✗ FAILED ${row.email}: ${e.message}`);
    }
  }

  console.log(`\n[City Permits Outreach] Done. Sent: ${count}`);
}

main().catch(console.error);
