#!/usr/bin/env node
/**
 * CRM New-Lead Follow-Up Blast
 * Emails all 'new' status leads that have valid emails and haven't been followed up.
 * Segments by bond type for personalized messaging.
 * Also exports phone-only contractor leads to CSV for call list.
 *
 * Usage:
 *   node crm_followup_blast.cjs              -- send all
 *   node crm_followup_blast.cjs --dry-run    -- preview only, no sends
 *   node crm_followup_blast.cjs --limit 50   -- cap sends
 *   node crm_followup_blast.cjs --export-phones  -- just export phone CSV, no emails
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DRY_RUN      = process.argv.includes('--dry-run');
const EXPORT_PHONES = process.argv.includes('--export-phones');
const LIMIT_IDX    = process.argv.indexOf('--limit');
const LIMIT        = LIMIT_IDX >= 0 ? parseInt(process.argv[LIMIT_IDX + 1]) : Infinity;
const SENT_LOG     = path.join(__dirname, 'crm_followup_sent.json');
const RATE_MS      = 120; // ~8/sec, well within SES 14/sec sandbox limit

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
  },
});

const FROM     = 'Theodore Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

function loadSent() {
  try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'))); }
  catch { return new Set(); }
}
function logSent(email, sent) {
  sent.add(email);
  fs.writeFileSync(SENT_LOG, JSON.stringify([...sent]));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Email builders ─────────────────────────────────────────────────────────────

// Common first names for sanity-checking email prefixes (top 200 US names)
const KNOWN_NAMES = new Set('james,john,robert,michael,william,david,richard,joseph,thomas,charles,christopher,daniel,matthew,anthony,mark,donald,steven,paul,andrew,joshua,kenneth,kevin,brian,george,edward,ronald,timothy,jason,jeffrey,ryan,gary,jacob,nicholas,eric,jonathan,stephen,larry,justin,scott,brandon,benjamin,samuel,frank,raymond,gregory,frank,alexander,patrick,jack,dennis,jerry,tyler,henry,aaron,jose,adam,nathan,henry,zachary,douglas,peter,kyle,noah,ethan,jeremy,walter,christian,keith,roger,terry,austin,sean,gerald,carl,harold,dylan,arthur,lawrence,jordan,jesse,bryan,billy,joe,bruce,gabriel,logan,albert,willie,alan,juan,wayne,elijah,randy,roy,vincent,ralph,eugene,russell,bobby,mason,philip,louis,phillip,omar,liam,oliver,james'.split(','));
const KNOWN_NAMES_F = new Set('mary,patricia,jennifer,linda,barbara,elizabeth,susan,jessica,sarah,karen,lisa,nancy,betty,margaret,sandra,ashley,emily,kimberly,donna,carol,michelle,amanda,melissa,deborah,stephanie,dorothy,sharon,amy,anna,helen,kathleen,angela,brenda,pamela,emma,nicole,helen,samantha,katherine,ruth,rebecca,laura,sharon,cynthia,kathleen,amy,angela,shirley,anna,brenda,pamela,emma,nicole,ruth,samantha,rachel,carolyn,virginia,maria,heather,diane,julie,joyce,victoria,kelly,christina,lauren,joan,evelyn,olivia,judy,cheryl,megan,andrea,hannah,jacqueline,martha,gloria,teresa,ann,sara,madison,frances,kathryn,janice,jean,abigail,alice,julia,jill,grace,denise,amber,marilyn,beverly,danielle,theresa,sophia,marie,diana,brittany,natalie,isabella,charlotte,rose,alexis,tiffany,kayla,crystal,brianna,autumn,janet,cathy,debra,lynn,claire,paula,dawn'.split(','));

const BIZ_SUFFIXES = new Set(['llc','inc','corp','co','ltd','services','construction','group','solutions','consulting','management','associates','enterprises','company','industries','systems','technologies','contractors','electric','plumbing','hvac','roofing','painting']);

function firstName(lead) {
  const raw = (lead.name || '').trim();

  if (raw) {
    const words = raw.split(/\s+/);
    const first = words[0];
    const lowerWords = words.map(w => w.toLowerCase());

    // Reject if any word is a biz suffix, or name contains non-name chars
    const hasBizSuffix = lowerWords.some(w => BIZ_SUFFIXES.has(w.replace(/[^a-z]/g,'')));
    const looksLikePerson = raw !== raw.toUpperCase()   // not all-caps
      && !/\d/.test(raw)                                // no digits
      && !/[&\/\\]/.test(raw)                           // no business punctuation
      && !hasBizSuffix
      && /^[A-Z][a-z]/.test(first)                     // first word starts Capital+lower
      && first.length >= 2;

    if (looksLikePerson) return first;
  }

  // Fall back to email prefix — only accept known first names
  const prefix = (lead.email || '').split('@')[0].toLowerCase();
  if (!prefix || /\d/.test(prefix) || prefix.length > 10) return 'there';
  const GENERIC = new Set(['info','contact','admin','office','sales','billing','hello','team','mail','support','inquiry','service','general','accounting','estimate','operations','utility']);
  if (GENERIC.has(prefix)) return 'there';
  const clean = prefix.replace(/[._+\-]/g, '');
  if ((KNOWN_NAMES.has(clean) || KNOWN_NAMES_F.has(clean)) && clean.length >= 3) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return 'there';
}

function buildNotaryEmail(lead) {
  const name = firstName(lead);
  const applyUrl = `https://quantumsurety.bond/get-bond?type=notary&utm_source=crm-followup&utm_campaign=notary-new`;
  const subject  = name === 'there'
    ? `Your Texas notary bond is ready — $50, instant certificate`
    : `${name}, your Texas notary bond is ready — $50, instant certificate`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;padding:32px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="36" style="margin-bottom:20px">
  <h2 style="color:#0f172a;margin:0 0 12px">Hi ${name}, still need your Texas notary bond?</h2>
  <p style="color:#475569;line-height:1.6">Your notary commission requires a surety bond before you can start notarizing. We make it fast — most applicants are bonded in under 5 minutes.</p>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Bond amount:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">$10,000 (TX SOS required)</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Your cost:</td><td style="padding:6px 0;font-weight:700;color:#059669;font-size:18px">$50 flat</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Certificate:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">Instant PDF — ready to file today</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Term:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">4 years</td></tr>
    </table>
  </div>

  <a href="${applyUrl}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin-bottom:24px">Get Bonded Now — $50 &rarr;</a>

  <p style="color:#64748b;font-size:13px;line-height:1.6">We're licensed in Texas (TDI #3480229) and have bonded thousands of Texas notaries. Questions? Just reply to this email or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:12px;margin-top:20px">Quantum Surety LLC &bull; Wylie, TX &bull; <a href="https://quantumsurety.bond" style="color:#94a3b8">quantumsurety.bond</a><br>
  <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`;

  const text = `Hi ${name},\n\nStill need your Texas notary bond? We make it fast.\n\n• Bond amount: $10,000 (TX SOS required)\n• Your cost: $50 flat\n• Certificate: Instant PDF — ready to file today\n• Term: 4 years\n\nGet bonded now: ${applyUrl}\n\nQuestions? Reply or call (214) 666-8718.\n\nQuantum Surety LLC | TDI #3480229 | Wylie, TX`;

  return { subject, html, text };
}

function buildContractorEmail(lead) {
  const name = firstName(lead);
  const applyUrl = `https://quantumsurety.bond/get-bond?type=contractor&utm_source=crm-followup&utm_campaign=contractor-new`;
  const subject  = name === 'there'
    ? `Your TDLR contractor license requires a surety bond`
    : `${name}, your TDLR license requires a surety bond`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;padding:32px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="36" style="margin-bottom:20px">
  <h2 style="color:#0f172a;margin:0 0 12px">Hi ${name} — your contractor license needs a bond</h2>
  <p style="color:#475569;line-height:1.6">Texas law requires a surety bond with your TDLR contractor license. Without it, your license isn't complete and you can't legally operate. We can get you bonded today.</p>

  <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:20px 0">
    <p style="margin:0;color:#92400e;font-size:14px;font-weight:600">Operating without a bond can result in TDLR fines, license suspension, and personal liability.</p>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:16px 0">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Bond amount:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">$10,000–$25,000 (license dependent)</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Annual cost:</td><td style="padding:6px 0;font-weight:700;color:#059669;font-size:18px">Starting at $100/yr</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Approval:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">Same day in most cases</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Certificate:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">Filed directly with TDLR</td></tr>
    </table>
  </div>

  <a href="${applyUrl}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin-bottom:24px">Get My Bond Today &rarr;</a>

  <p style="color:#64748b;font-size:13px;line-height:1.6">Questions? Reply here or call <strong>(214) 666-8718</strong>. We specialize in Texas contractor bonds and can answer any TDLR compliance questions.</p>
  <p style="color:#94a3b8;font-size:12px;margin-top:20px">Quantum Surety LLC &bull; TDI Licensed #3480229 &bull; Wylie, TX<br>
  <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`;

  const text = `Hi ${name},\n\nYour Texas TDLR contractor license requires a surety bond to be complete. Without it you can't legally operate.\n\n• Bond amount: $10,000–$25,000\n• Annual cost: Starting at $100/yr\n• Approval: Same day in most cases\n\nGet bonded today: ${applyUrl}\n\nQuestions? Reply or call (214) 666-8718.\n\nQuantum Surety LLC | TDI #3480229 | Wylie, TX`;

  return { subject, html, text };
}

function buildDealerEmail(lead) {
  const name = firstName(lead);
  const applyUrl = `https://quantumsurety.bond/get-bond?type=dealer&utm_source=crm-followup&utm_campaign=gdn-new`;
  const subject  = name === 'there'
    ? `Your Texas GDN dealer bond — fast approval`
    : `${name}, your Texas GDN dealer bond — fast approval`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;padding:32px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="36" style="margin-bottom:20px">
  <h2 style="color:#0f172a;margin:0 0 12px">Hi ${name} — still need your GDN dealer bond?</h2>
  <p style="color:#475569;line-height:1.6">TxDMV requires a $25,000 surety bond with your GDN dealer license. We specialize in Texas auto dealer bonds and can get you approved fast.</p>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Required bond:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">$25,000 (TxDMV GDN)</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Annual premium:</td><td style="padding:6px 0;font-weight:700;color:#059669;font-size:18px">$100–$300/yr</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Approval:</td><td style="padding:6px 0;font-weight:700;color:#0f172a">24–48 hours</td></tr>
    </table>
  </div>

  <a href="${applyUrl}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin-bottom:24px">Apply for My Dealer Bond &rarr;</a>

  <p style="color:#64748b;font-size:13px">Questions? Reply or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:12px;margin-top:20px">Quantum Surety LLC &bull; TDI Licensed #3480229 &bull; Wylie, TX<br>
  <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`;

  const text = `Hi ${name},\n\nStill need your Texas GDN dealer bond? TxDMV requires a $25,000 bond with your license.\n\n• Annual cost: $100–$300/yr\n• Approval: 24–48 hours\n\nApply now: ${applyUrl}\n\nQuestions? Reply or call (214) 666-8718.\n\nQuantum Surety LLC | TDI #3480229 | Wylie, TX`;

  return { subject, html, text };
}

function buildGenericEmail(lead) {
  const name = firstName(lead);
  const applyUrl = `https://quantumsurety.bond/get-bond?utm_source=crm-followup&utm_campaign=general-new`;
  const subject  = name === 'there'
    ? `Your surety bond quote from Quantum Surety`
    : `${name}, your surety bond quote from Quantum Surety`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;padding:32px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="36" style="margin-bottom:20px">
  <h2 style="color:#0f172a;margin:0 0 12px">Hi ${name} — ready to get bonded?</h2>
  <p style="color:#475569;line-height:1.6">You recently expressed interest in a Texas surety bond. We're here to help — Quantum Surety specializes in fast, affordable Texas bonds with same-day approval for most applicants.</p>
  <a href="${applyUrl}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin:20px 0 24px">Get My Free Quote &rarr;</a>
  <p style="color:#64748b;font-size:13px">Questions? Reply here or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:12px;margin-top:20px">Quantum Surety LLC &bull; TDI Licensed #3480229 &bull; Wylie, TX<br>
  <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`;

  const text = `Hi ${name},\n\nYou recently expressed interest in a Texas surety bond. We're here to help — same-day approval for most applicants.\n\nGet your free quote: ${applyUrl}\n\nQuestions? Reply or call (214) 666-8718.\n\nQuantum Surety LLC | TDI #3480229 | Wylie, TX`;

  return { subject, html, text };
}

function buildEmail(lead) {
  const bt = (lead.bond_type || '').toLowerCase();
  if (bt.includes('notary'))     return buildNotaryEmail(lead);
  if (bt.includes('contractor')) return buildContractorEmail(lead);
  if (bt.includes('dealer') || bt === 'dealer') return buildDealerEmail(lead);
  return buildGenericEmail(lead);
}

// ── Phone-only export ──────────────────────────────────────────────────────────

async function exportPhoneList(db) {
  const { rows } = await db.query(`
    SELECT id, name, phone, bond_type, source, created_at::date as date_added
    FROM leads
    WHERE status = 'new'
      AND (email IS NULL OR email = '' OR email LIKE '%noemail.quantumsurety%')
      AND phone IS NOT NULL AND phone != ''
    ORDER BY created_at DESC
  `);

  const csv = ['id,name,phone,bond_type,source,date_added',
    ...rows.map(r => [r.id, `"${(r.name||'').replace(/"/g,'""')}"`, r.phone,
      `"${(r.bond_type||'').replace(/"/g,'""')}"`,
      `"${(r.source||'').replace(/"/g,'""')}"`, r.date_added].join(','))
  ].join('\n');

  const outFile = path.join(__dirname, 'phone_followup_leads.csv');
  fs.writeFileSync(outFile, csv);
  console.log(`\nPhone list exported: ${outFile} (${rows.length} leads)`);
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const db = new Client({
    host: '192.168.4.122',
    port: 5433,
    database: 'quantum_surety',
    user: 'quantum_user',
    password: process.env.CRM_DB_PASS || 'QsCRMV8yNgKOoaNPu67JF!',
  });
  await db.connect();
  console.log('Connected to CRM DB');

  if (EXPORT_PHONES || !DRY_RUN) {
    await exportPhoneList(db);
    if (EXPORT_PHONES) { await db.end(); return; }
  }

  // Fetch emailable new leads (exclude procurement contacts and fake voice emails)
  const { rows: leads } = await db.query(`
    SELECT id, name, email, phone, bond_type, source
    FROM leads
    WHERE status = 'new'
      AND email IS NOT NULL AND email != ''
      AND email NOT LIKE '%noemail.quantumsurety%'
      AND source NOT IN ('TxSmartBuy Bid Monitor', 'TxSmartBuy Monitor', 'ESBD Monitor')
    ORDER BY created_at ASC
  `);

  console.log(`Found ${leads.length} emailable new leads`);

  const sent = loadSent();
  let count = 0;
  let skipped = 0;

  for (const lead of leads) {
    if (count >= LIMIT) break;

    const email = lead.email.toLowerCase().trim();
    if (sent.has(email)) { skipped++; continue; }

    const { subject, html, text } = buildEmail(lead);

    if (DRY_RUN) {
      console.log(`[DRY-RUN] → ${email} | ${lead.bond_type} | "${subject}"`);
      count++;
      continue;
    }

    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: html }, Text: { Data: text } },
        },
      }));

      // Mark as contacted in CRM
      await db.query(
        `UPDATE leads SET status = 'contacted', notes = COALESCE(notes || ' | ', '') || $1 WHERE id = $2`,
        [`follow-up email sent ${new Date().toISOString().slice(0,10)}`, lead.id]
      );

      logSent(email, sent);
      count++;
      process.stdout.write(`\r  Sent: ${count} | Skipped: ${skipped}`);
      await sleep(RATE_MS);
    } catch (err) {
      console.error(`\nFailed ${email}:`, err.message);
    }
  }

  await db.end();
  console.log(`\n\nDone. Sent: ${count} | Skipped (already sent): ${skipped}`);
}

main().catch(e => { console.error(e); process.exit(1); });
