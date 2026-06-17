#!/usr/bin/env node
/**
 * Notary Direct Checkout — second touch for contacted notary leads
 * Sends a short, urgent email with a DIRECT link to mybondapp checkout.
 * No form, no redirect, no friction — one click to purchase.
 *
 * Targets: status='contacted', bond_type notary, contacted 2-14 days ago
 * Skips anyone already in review_ask_sent.json (existing customers)
 *
 * Usage:
 *   SES_KEY=... SES_SECRET=... CRM_DB_PASS=... node notary_direct_checkout.cjs
 *   node notary_direct_checkout.cjs --dry-run
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DRY_RUN  = process.argv.includes('--dry-run');
const SENT_LOG = path.join(__dirname, 'notary_direct_checkout_sent.json');
const CHECKOUT_URL = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX&utm_source=crm-second-touch&utm_campaign=notary-direct';

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});
const FROM     = 'Theodore Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

function loadSent() { try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG,'utf8'))); } catch { return new Set(); } }
function logSent(e, s) { s.add(e); fs.writeFileSync(SENT_LOG, JSON.stringify([...s])); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const BIZ_SUFFIXES = new Set(['llc','inc','corp','co','ltd','services','group','solutions','management','associates','company']);
const KNOWN_NAMES  = new Set('james,john,robert,michael,william,david,richard,joseph,thomas,charles,christopher,daniel,matthew,anthony,mark,donald,steven,paul,andrew,joshua,kenneth,kevin,brian,george,edward,jason,jeffrey,ryan,jacob,nicholas,eric,jonathan,stephen,scott,brandon,samuel,frank,raymond,tyler,henry,aaron,jose,adam,nathan,zachary,jordan,jesse,kyle,noah,ethan,liam,oliver'.split(','));
const KNOWN_NAMES_F = new Set('mary,patricia,jennifer,linda,barbara,elizabeth,susan,jessica,sarah,karen,lisa,nancy,betty,margaret,sandra,ashley,emily,kimberly,donna,carol,michelle,amanda,melissa,deborah,stephanie,dorothy,sharon,amy,anna,helen,kathleen,angela,brenda,pamela,emma,nicole,ruth,samantha,rachel,carolyn,virginia,maria,heather,diane,julie,victoria,kelly,christina,lauren,evelyn,olivia,cheryl,megan,andrea,hannah,jacqueline,martha,gloria,teresa,ann,sara,madison,kathryn,janice,jean,abigail,julia,grace,danielle,sophia,marie,diana,brittany,natalie,isabella,charlotte,alexis,tiffany,kayla,crystal,brianna'.split(','));

function firstName(lead) {
  const raw = (lead.name || '').trim();
  if (raw) {
    const words = raw.split(/\s+/);
    const first = words[0];
    const lowerWords = words.map(w => w.toLowerCase());
    const hasBizSuffix = lowerWords.some(w => BIZ_SUFFIXES.has(w.replace(/[^a-z]/g, '')));
    if (raw !== raw.toUpperCase() && !/\d/.test(raw) && !/[&\/\\]/.test(raw) && !hasBizSuffix && /^[A-Z][a-z]/.test(first) && first.length >= 2) return first;
  }
  const prefix = (lead.email || '').split('@')[0].toLowerCase();
  if (!prefix || /\d/.test(prefix) || prefix.length > 10) return 'there';
  const GENERIC = new Set(['info','contact','admin','office','sales','billing','hello','team','mail','support']);
  if (GENERIC.has(prefix)) return 'there';
  const clean = prefix.replace(/[._+\-]/g, '');
  if ((KNOWN_NAMES.has(clean) || KNOWN_NAMES_F.has(clean)) && clean.length >= 3) return clean.charAt(0).toUpperCase() + clean.slice(1);
  return 'there';
}

function buildEmail(lead) {
  const name   = firstName(lead);
  const noName = name === 'there';
  const subject = noName
    ? 'One click to get your Texas notary bond — $50, instant certificate'
    : `${name} — your Texas notary bond is one click away ($50, instant)`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 6px">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    You showed interest in a Texas Notary Bond earlier. Your bond is still waiting — $50 flat, 4-year term, and your certificate arrives by email the same day.
  </p>
  <p style="color:#475569;line-height:1.7;margin:0 0 20px">
    Click below to complete your purchase in about 2 minutes:
  </p>
  <a href="${CHECKOUT_URL}" style="display:block;background:#f59e0b;color:#000;padding:15px 0;border-radius:8px;font-weight:800;text-decoration:none;font-size:16px;text-align:center;margin-bottom:16px">
    Get My $50 Notary Bond →
  </a>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:16px">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.7">
      ✓ $10,000 bond · TX SOS compliant<br>
      ✓ $50 total for the full 4-year term<br>
      ✓ Instant PDF certificate emailed to you<br>
      ✓ RLI Insurance (A-rated underwriter)
    </p>
  </div>
  <p style="color:#64748b;font-size:13px;margin:0">
    Questions? Reply here or call <strong>(214) 666-8718</strong> — I'm a real person.
  </p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">
    Quantum Surety LLC · TDI #3480229 · Wylie, TX ·
    <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a>
  </p>
</div>`;

  const text = `Hi ${name},\n\nYour Texas Notary Bond is waiting — $50 flat, 4-year term, instant PDF.\n\nGet it now (2 minutes): ${CHECKOUT_URL}\n\nQuestions? Reply or call (214) 666-8718.\n\nQuantum Surety LLC · TDI #3480229`;
  return { subject, html, text };
}

async function main() {
  const db = new Client({
    host: '192.168.4.122', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS || 'Qs2024Secure!',
  });
  await db.connect();

  const { rows } = await db.query(`
    SELECT DISTINCT ON (email) id, name, email, bond_type
    FROM leads
    WHERE status = 'contacted'
      AND (bond_type ILIKE '%notary%' OR bond_type = 'notary')
      AND email IS NOT NULL AND email != ''
      AND email NOT LIKE '%noemail%'
      AND updated_at >= NOW() - INTERVAL '14 days'
      AND updated_at <= NOW() - INTERVAL '2 days'
    ORDER BY email, updated_at DESC
  `);

  await db.end();
  console.log(`Found ${rows.length} contacted notary leads for direct checkout`);

  const sent  = loadSent();
  let count   = 0;
  let skipped = 0;

  for (const lead of rows) {
    const email = lead.email.toLowerCase().trim();
    if (sent.has(email)) { skipped++; continue; }

    const { subject, html, text } = buildEmail(lead);
    if (DRY_RUN) {
      console.log(`  [DRY] → ${email} | "${subject.slice(0,55)}"`);
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
      if (count % 25 === 0) console.log(`  ${count} sent…`);
      await sleep(120); // ~8/sec — well within SES limits
    } catch(e) {
      console.error(`  FAIL ${email}: ${e.message}`);
    }
  }
  console.log(`Done. Sent: ${count} | Skipped: ${skipped}`);
}
main().catch(e => { console.error(e); process.exit(1); });
