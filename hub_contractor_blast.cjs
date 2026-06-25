#!/usr/bin/env node
/**
 * HUB Contractor Bond Campaign
 * Targets Texas HUB-certified contractors from the `contractors` table.
 * Pitch: Your HUB certification + an active surety bond = more state contract wins.
 *
 * Usage:
 *   node hub_contractor_blast.cjs --dry-run        preview only
 *   node hub_contractor_blast.cjs --limit 50       send max 50
 *   node hub_contractor_blast.cjs                  run (default 750/day)
 *
 * Cron: 0 10 * * 1-5  (10 AM Mon–Fri)
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const DRY_RUN     = process.argv.includes('--dry-run');
const LIMIT_IDX   = process.argv.indexOf('--limit');
const DAILY_LIMIT = LIMIT_IDX !== -1 ? parseInt(process.argv[LIMIT_IDX + 1], 10) : 750;
const RATE_MS     = 200;

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

const FROM     = 'Theodore Sparks <nice.shotwell-sparks@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

const DB = {
  host: 'localhost',
  port: 5433,
  database: 'quantum_surety',
  user: 'quantum_user',
  password: process.env.CRM_DB_PASSWORD || 'QsCRMV8yNgKOoaNPu67JF!',
};

async function ensureTable(pg) {
  await pg.query(`
    CREATE TABLE IF NOT EXISTS contractor_hub_sends (
      id SERIAL PRIMARY KEY,
      contractor_id INTEGER,
      email TEXT NOT NULL,
      company_name TEXT,
      status TEXT DEFAULT 'sent',
      sent_at TIMESTAMPTZ DEFAULT NOW(),
      error TEXT
    )
  `);
  await pg.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS contractor_hub_sends_email_idx
    ON contractor_hub_sends (LOWER(email))
  `);
}

function buildEmail(c) {
  const biz  = c.company_name || 'there';
  const city = c.city ? ` in ${c.city}` : '';
  const quoteUrl = [
    'https://quantumsurety.bond/get-bond?type=contractor',
    `&company=${encodeURIComponent(c.company_name || '')}`,
    '&utm_source=hub_blast&utm_medium=email&utm_campaign=hub_contractor_jun2026',
  ].join('');

  const subject = `Your HUB certification is only half the equation`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;font-size:15px;line-height:1.75;background:#fff">

<div style="border-bottom:3px solid #C9A84C;padding-bottom:12px;margin-bottom:24px">
  <p style="margin:0;font-size:18px;font-weight:800;color:#0A0A0F">QUANTUM SURETY</p>
  <p style="margin:2px 0 0;font-size:11px;color:#888;letter-spacing:2px">TEXAS CONTRACTOR BOND SPECIALIST</p>
</div>

<p>Hi ${biz},</p>

<p>Congratulations on your <strong>HUB certification</strong> — that opens the door to state and local government contracts most contractors can't even bid on.</p>

<p>But there's one thing that quietly disqualifies HUB vendors from contracts faster than anything else: <strong>no active surety bond.</strong></p>

<div style="background:#f0f9ff;border-left:4px solid #0369a1;padding:16px 20px;margin:20px 0;border-radius:0 6px 6px 0">
  <p style="margin:0 0 6px;font-weight:700;color:#0c4a6e;font-size:15px">Why bonding matters for HUB vendors${city}:</p>
  <ul style="margin:6px 0 0;padding-left:20px;color:#0c4a6e;font-size:14px;line-height:2">
    <li>TxDOT, TXCPA, and most state agencies require bonded contractors</li>
    <li>City and county contracts typically require a $10,000–$25,000 surety bond</li>
    <li>Bonded vendors rank higher in CMBL and HUB portal searches</li>
    <li>Buyers check bond status at <strong>verify.quantumsurety.bond</strong> before awarding</li>
  </ul>
</div>

<p>We've helped dozens of Texas HUB contractors get bonded the same day — no collateral, no office visit, certificate delivered by email.</p>

<div style="background:#f9f6ef;border-left:4px solid #C9A84C;padding:18px 22px;margin:24px 0">
  <p style="margin:0 0 8px;font-weight:700;color:#0A0A0F">What you get with Quantum Surety:</p>
  <ul style="margin:0;padding-left:20px;color:#333;font-size:14px;line-height:2">
    <li>Texas Contractor License Bond ($10,000) — starts at ~$100/year</li>
    <li>Instant quote, same-day issuance</li>
    <li>TDI-licensed, Texas-based agency (License #3480229)</li>
    <li>Digital bond certificate ready for bid submissions</li>
  </ul>
</div>

<p style="margin:28px 0">
  <a href="${quoteUrl}" style="display:inline-block;background:#0a0f1e;color:#f59e0b;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:800;font-size:16px">
    Get My Bond Quote →
  </a>
</p>

<p style="font-size:14px;color:#64748b">Takes about 10 minutes. Questions? Call me at <a href="tel:2146668718" style="color:#2563eb">(214) 666-8718</a></p>

<p>Best,<br>
<strong>Theodore Sparks</strong><br>
Quantum Surety LLC<br>
TDI License #3480229 | (214) 666-8718<br>
<a href="https://quantumsurety.bond" style="color:#2563eb">quantumsurety.bond</a></p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0">
<p style="font-size:11px;color:#94a3b8">
  Quantum Surety LLC · 1910 Pacific Ave Ste 8090, Dallas TX 75201 · TDI #3480229<br>
  You are receiving this because ${biz} appears in the Texas HUB/CMBL directory as an active certified vendor.<br>
  <a href="mailto:contact@quantumsurety.bond?subject=Unsubscribe&body=Please unsubscribe ${c.email}" style="color:#94a3b8">Unsubscribe</a>
</p>
</body>
</html>`;

  const text = `Hi ${biz},

Congratulations on your HUB certification — that opens the door to state and local government contracts most contractors can't even bid on.

But there's one thing that quietly disqualifies HUB vendors faster than anything: no active surety bond.

Why bonding matters for HUB vendors${city}:
• TxDOT, TXCPA, and most state agencies require bonded contractors
• City/county contracts typically require a $10,000–$25,000 surety bond
• Bonded vendors rank higher in CMBL/HUB portal searches
• Buyers check bond status at verify.quantumsurety.bond before awarding

We've helped dozens of Texas HUB contractors get bonded the same day — no collateral, no office visit.

Get your quote (10 minutes):
${quoteUrl}

Or call me at (214) 666-8718.

Theodore Sparks
Quantum Surety LLC | TDI #3480229 | quantumsurety.bond`;

  return { subject, html, text };
}

async function main() {
  const pg = new Client(DB);
  await pg.connect();
  await ensureTable(pg);

  const { rows } = await pg.query(`
    SELECT c.id, c.company_name, c.email, c.city, c.phone, c.certification_type
    FROM contractors c
    WHERE c.email IS NOT NULL AND c.email <> ''
      AND NOT EXISTS (
        SELECT 1 FROM contractor_hub_sends s WHERE LOWER(s.email) = LOWER(c.email)
      )
      AND NOT EXISTS (
        SELECT 1 FROM unsubscribes u WHERE LOWER(u.email) = LOWER(c.email)
      )
    ORDER BY c.id
    LIMIT $1
  `, [DAILY_LIMIT]);

  console.log(`[HUB Contractor Blast] ${rows.length} to send (limit: ${DAILY_LIMIT})`);
  if (DRY_RUN) console.log('[DRY RUN] No emails sent.');

  let count = 0;
  for (const c of rows) {
    const { subject, html, text } = buildEmail(c);

    if (DRY_RUN) {
      console.log(`  [DRY] → ${c.email} | ${c.company_name} | ${subject}`);
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
          Body: {
            Html: { Data: html, Charset: 'UTF-8' },
            Text: { Data: text, Charset: 'UTF-8' },
          },
        },
      }));

      await pg.query(`
        INSERT INTO contractor_hub_sends (contractor_id, email, company_name, status)
        VALUES ($1, $2, $3, 'sent')
        ON CONFLICT DO NOTHING
      `, [c.id, c.email.toLowerCase(), c.company_name]);

      await pg.query(`
        INSERT INTO leads (name, email, phone, bond_type, source, status, notes, lead_time, created_at, updated_at)
        SELECT $1, $2, $3, 'contractor', 'hub_blast', 'contacted', $4, NOW(), NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM leads WHERE LOWER(email) = LOWER($2::text))
      `, [
        c.company_name || 'HUB Contractor',
        c.email.toLowerCase(),
        c.phone || null,
        `HUB Certified | ${c.city || ''} | ${c.certification_type || 'HUB'} | CMBL vendor`,
      ]);

      console.log(`  ✓ ${c.email} | ${c.company_name}`);
      count++;
      await new Promise(r => setTimeout(r, RATE_MS));
    } catch (e) {
      console.error(`  ✗ FAIL ${c.email}: ${e.message}`);
      await pg.query(`
        INSERT INTO contractor_hub_sends (contractor_id, email, company_name, status, error)
        VALUES ($1, $2, $3, 'error', $4)
        ON CONFLICT DO NOTHING
      `, [c.id, c.email.toLowerCase(), c.company_name, e.message]);
    }
  }

  await pg.end();
  console.log(`\n[HUB Contractor Blast] Done. Sent: ${count}`);
}

main().catch(console.error);
