#!/usr/bin/env node
/**
 * Immediate checkout email to all new, uncontacted notary form leads.
 * Skips test/duplicate emails.
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
  }
});

const CHECKOUT = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX&utm_source=crm-batch&utm_campaign=notary-new-batch';
const FROM = 'Theodore Sparks <ted@quantumsurety.bond>';
const SKIP_EMAILS = new Set(['contact219@gmail.com', 'julie.gonzalez@rivnet.com']);
const DRY_RUN = process.argv.includes('--dry-run');

function firstName(name) {
  const raw = (name || '').trim();
  if (!raw) return 'there';
  const words = raw.split(/\s+/);
  const first = words[0];
  if (/^[A-Z]{2,}$/.test(first)) {
    return first.charAt(0) + first.slice(1).toLowerCase();
  }
  if (/^[A-Za-z][a-z]+$/.test(first)) return first;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function buildEmail(name, email) {
  const fn = firstName(name);
  const subject = `${fn} — your Texas Notary Bond is waiting ($50, same-day certificate)`;
  const html = `<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 8px">Hi ${fn},</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    You recently requested your Texas Notary Bond through Quantum Surety. It's still waiting for you — click below to complete your purchase in about 2 minutes:
  </p>
  <a href="${CHECKOUT}" style="display:block;background:#f59e0b;color:#000;padding:16px 0;border-radius:8px;font-weight:800;text-decoration:none;font-size:16px;text-align:center;margin-bottom:16px">
    Get My $50 Notary Bond →
  </a>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:16px">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      ✓ $10,000 bond · TX SOS compliant<br>
      ✓ $50 total for the full 4-year term — no annual renewals<br>
      ✓ Instant PDF certificate emailed to you today<br>
      ✓ RLI Insurance (A-rated underwriter)
    </p>
  </div>
  <p style="color:#64748b;font-size:13px;margin:0">
    Questions? Call or text <strong>(214) 666-8718</strong> — I'm a real person, happy to help.
  </p>
  <p style="color:#475569;font-size:13px;margin-top:16px">— Ted Sparks, Quantum Surety LLC · TDI #3480229</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:8px">
    <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(email)}" style="color:#94a3b8">Unsubscribe</a>
  </p>
</div>`;
  const text = `Hi ${fn},\n\nYou recently requested your Texas Notary Bond through Quantum Surety. Complete it here:\n${CHECKOUT}\n\n$50 flat, 4-year term, instant PDF certificate.\n\nQuestions? (214) 666-8718\n\nTed Sparks · Quantum Surety LLC · TDI #3480229`;
  return { subject, html, text };
}

async function main() {
  const db = new Client({
    host: '192.168.4.122', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS || 'Qs2024Secure!'
  });
  await db.connect();

  const { rows } = await db.query(`
    SELECT DISTINCT ON (email) id, name, email
    FROM leads
    WHERE status = 'new'
      AND source ILIKE '%get-bond%'
      AND (bond_type ILIKE '%notary%' OR bond_type = 'notary' OR bond_type = 'Texas Notary Bond')
      AND email IS NOT NULL AND email != '' AND email NOT LIKE '%noemail%'
    ORDER BY email, created_at DESC
  `);

  console.log(`Found ${rows.length} new notary form leads`);
  const ids = [];
  let sent = 0;

  for (const r of rows) {
    const email = r.email.toLowerCase().trim();
    if (SKIP_EMAILS.has(email)) { console.log(`  SKIP ${email}`); continue; }
    const { subject, html, text } = buildEmail(r.name, email);
    if (DRY_RUN) { console.log(`  [DRY] ${email} | ${subject.slice(0,50)}`); ids.push(r.id); continue; }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: ['contact@quantumsurety.bond'],
        Destination: { ToAddresses: [email] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } }
      }));
      console.log(`  Sent → ${email}`);
      ids.push(r.id);
      sent++;
    } catch (e) {
      console.error(`  FAIL ${email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 150));
  }

  if (!DRY_RUN && ids.length > 0) {
    await db.query(
      `UPDATE leads SET status='contacted', notes='Batch checkout email sent', updated_at=NOW() WHERE id = ANY($1)`,
      [ids]
    );
    console.log(`Updated ${ids.length} leads to contacted`);
  }
  await db.end();
  console.log(`Done. Sent: ${sent}`);
}
main().catch(e => { console.error(e); process.exit(1); });
