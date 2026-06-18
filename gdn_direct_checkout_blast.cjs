#!/usr/bin/env node
/**
 * Direct checkout blast to contacted GDN dealer bond leads.
 * These people showed interest but never completed the purchase.
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

const CHECKOUT = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX&utm_source=crm-direct&utm_campaign=gdn-second-touch';
const FROM = 'Theodore Sparks <ted@quantumsurety.bond>';
const DRY_RUN = process.argv.includes('--dry-run');

// Load already-sent log
const SENT_LOG = require('path').join(__dirname, 'gdn_direct_checkout_sent.json');
function loadSent() { try { return new Set(JSON.parse(require('fs').readFileSync(SENT_LOG,'utf8'))); } catch { return new Set(); } }
function logSent(e, s) { s.add(e); require('fs').writeFileSync(SENT_LOG, JSON.stringify([...s])); }

function firstName(raw) {
  const name = (raw || '').trim();
  if (!name) return 'there';
  const words = name.split(/\s+/);
  const first = words[0];
  if (first.length < 2) return 'there';
  if (/^[A-Z]{3,}$/.test(first)) return first.charAt(0) + first.slice(1).toLowerCase();
  if (/^[A-Za-z]/.test(first)) return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  return 'there';
}

function buildEmail(name, email) {
  const fn = firstName(name);
  const isCompany = /llc|inc|corp|motors|auto|sales|center|group|associates/i.test(name);
  const greeting = isCompany ? `Hi there` : `Hi ${fn}`;
  const subject = isCompany
    ? `Your Texas GDN Dealer Bond — complete it today (same-day certificate)`
    : `${fn} — your Texas GDN Dealer Bond is still available (same-day cert)`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 8px">${greeting},</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    You requested a Texas GDN Dealer Bond through Quantum Surety. TxDMV requires this $50,000 bond for your dealer license — complete it now and get your certificate today:
  </p>
  <a href="${CHECKOUT}" style="display:block;background:#f59e0b;color:#000;padding:16px 0;border-radius:8px;font-weight:800;text-decoration:none;font-size:16px;text-align:center;margin-bottom:16px">
    Get My GDN Dealer Bond →
  </a>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:16px">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      ✓ $50,000 bond · TxDMV-accepted · Competitive rates<br>
      ✓ Same-day PDF certificate delivered by email<br>
      ✓ Annual renewable term · Fast online application<br>
      ✓ RLI Insurance Company (A-rated underwriter)
    </p>
  </div>
  <p style="color:#64748b;font-size:13px;margin:0">
    Call or text me directly at <strong>(214) 666-8718</strong> with any questions — I can have you bonded today.
  </p>
  <p style="color:#475569;font-size:13px;margin-top:16px">
    — Ted Sparks<br>
    <span style="color:#94a3b8;font-size:11px">Quantum Surety LLC · TDI License #3480229 · quantumsurety.bond</span>
  </p>
  <p style="color:#94a3b8;font-size:11px;margin-top:8px">
    <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(email)}" style="color:#94a3b8">Unsubscribe</a>
  </p>
</div>`;

  const text = `${greeting},\n\nYou requested a Texas GDN Dealer Bond through Quantum Surety. TxDMV requires this bond for your dealer license.\n\nComplete it now:\n${CHECKOUT}\n\nSame-day certificate. Call/text (214) 666-8718 with questions.\n\nTed Sparks · Quantum Surety LLC · TDI #3480229`;
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
    WHERE status = 'contacted'
      AND (bond_type ILIKE '%dealer%' OR bond_type ILIKE '%gdn%')
      AND email IS NOT NULL AND email != '' AND email NOT LIKE '%noemail%'
    ORDER BY email, updated_at DESC
  `);
  await db.end();

  console.log(`Found ${rows.length} unique GDN contacted leads`);
  const sent = loadSent();
  let count = 0;

  for (const r of rows) {
    const email = r.email.toLowerCase().trim();
    if (sent.has(email)) { console.log(`  SKIP ${email}`); continue; }
    const { subject, html, text } = buildEmail(r.name, email);
    if (DRY_RUN) { console.log(`  [DRY] ${email} | ${r.name}`); continue; }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: ['contact@quantumsurety.bond'],
        Destination: { ToAddresses: [email] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } }
      }));
      logSent(email, sent);
      console.log(`  Sent → ${r.name} <${email}>`);
      count++;
    } catch (e) {
      console.error(`  FAIL ${email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`Done. Sent: ${count}`);
}
main().catch(e => { console.error(e); process.exit(1); });
