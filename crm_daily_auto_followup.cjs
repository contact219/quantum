#!/usr/bin/env node
/**
 * CRM Daily Auto-Followup — runs via cron every morning
 * Emails new leads that arrived yesterday (or within last 24-48hrs) that haven't been contacted yet.
 * This ensures every TDLR, form, and voice lead gets a personalized email within 24 hours of entering CRM.
 *
 * Add to cron (runs at 8:30 AM CDT = 13:30 UTC):
 *   30 13 * * *  cd /path/to/quantum && SES_KEY=... SES_SECRET=... CRM_DB_PASS=... node crm_daily_auto_followup.cjs >> /var/log/crm-daily-followup.log 2>&1
 *
 * Usage:
 *   node crm_daily_auto_followup.cjs              -- normal run (last 24–48hrs)
 *   node crm_daily_auto_followup.cjs --dry-run    -- preview only
 *   node crm_daily_auto_followup.cjs --hours 72   -- extend lookback window
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const DRY_RUN  = process.argv.includes('--dry-run');
const HRS_IDX  = process.argv.indexOf('--hours');
const LOOKBACK = HRS_IDX >= 0 ? parseInt(process.argv[HRS_IDX + 1]) : 48;
const RATE_MS  = 150;

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM     = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const BIZ_SUFFIXES = new Set(['llc','inc','corp','co','ltd','services','construction','group','solutions','consulting','management','associates','enterprises','company','industries','systems','technologies','contractors']);
const KNOWN_NAMES  = new Set('james,john,robert,michael,william,david,richard,joseph,thomas,charles,christopher,daniel,matthew,anthony,mark,donald,steven,paul,andrew,joshua,kenneth,kevin,brian,george,edward,ronald,timothy,jason,jeffrey,ryan,gary,jacob,nicholas,eric,jonathan,stephen,larry,justin,scott,brandon,benjamin,samuel,frank,raymond,gregory,alexander,patrick,jack,dennis,jerry,tyler,henry,aaron,jose,adam,nathan,zachary,douglas,peter,kyle,noah,ethan,jeremy,walter,christian,keith,roger,terry,austin,sean,gerald,carl,harold,dylan,arthur,lawrence,jordan,jesse,bryan,billy,joe,bruce,gabriel,logan,albert,willie,alan,juan,wayne,elijah,randy,roy,vincent,ralph,eugene,russell,bobby,mason,philip,louis,omar,liam,oliver'.split(','));
const KNOWN_NAMES_F = new Set('mary,patricia,jennifer,linda,barbara,elizabeth,susan,jessica,sarah,karen,lisa,nancy,betty,margaret,sandra,ashley,emily,kimberly,donna,carol,michelle,amanda,melissa,deborah,stephanie,dorothy,sharon,amy,anna,helen,kathleen,angela,brenda,pamela,emma,nicole,ruth,samantha,rachel,carolyn,virginia,maria,heather,diane,julie,joyce,victoria,kelly,christina,lauren,joan,evelyn,olivia,judy,cheryl,megan,andrea,hannah,jacqueline,martha,gloria,teresa,ann,sara,madison,frances,kathryn,janice,jean,abigail,alice,julia,jill,grace,denise,amber,marilyn,beverly,danielle,theresa,sophia,marie,diana,brittany,natalie,isabella,charlotte,rose,alexis,tiffany,kayla,crystal,brianna,janet,cathy,debra,lynn,claire,paula,dawn'.split(','));

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
  const GENERIC = new Set(['info','contact','admin','office','sales','billing','hello','team','mail','support','inquiry','service','general','accounting','estimate','operations','utility']);
  if (GENERIC.has(prefix)) return 'there';
  const clean = prefix.replace(/[._+\-]/g, '');
  if ((KNOWN_NAMES.has(clean) || KNOWN_NAMES_F.has(clean)) && clean.length >= 3) return clean.charAt(0).toUpperCase() + clean.slice(1);
  return 'there';
}

function buildEmail(lead) {
  const name    = firstName(lead);
  const bt      = (lead.bond_type || '').toLowerCase();
  const hi      = name === 'there' ? 'Hi,' : `Hi ${name},`;
  const noName  = name === 'there';

  if (bt.includes('notary')) {
    const url = `https://quantumsurety.bond/get-bond?type=notary&utm_source=crm-daily&utm_campaign=notary-auto`;
    return {
      subject: noName ? 'Your Texas notary bond — from $27.50, instant certificate' : `${name}, your Texas notary bond — from $27.50, instant certificate`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">You looked into a Texas notary bond. We haven't heard back — if you're still getting bonded, it takes under 5 minutes and your certificate is emailed instantly.</p>
  <div style="background:#f8fafc;border-left:4px solid #f59e0b;padding:16px;margin:0 0 20px;border-radius:4px">
    <strong style="color:#0f172a">From $27.50 · 4-year term · Instant PDF · TX SOS compliant</strong>
  </div>
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:13px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px">Get My Notary Bond →</a>
  <p style="color:#64748b;font-size:13px;margin-top:20px">Questions? Reply here or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
      text: `${hi}\n\nYou looked into a Texas notary bond. From $27.50 for a 4-year term — certificate emailed instantly.\n\nGet bonded: ${url}\n\nQuestions? Reply or call (214) 666-8718.\n\nQuantum Surety | TDI #3480229`,
    };
  }

  if (bt.includes('contractor')) {
    const url = `https://quantumsurety.bond/get-bond?type=contractor&utm_source=crm-daily&utm_campaign=contractor-auto`;
    return {
      subject: noName ? 'Your TDLR contractor bond — same-day approval' : `${name}, your TDLR contractor bond — same-day approval`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">Your TDLR contractor license requires an active surety bond. Without it, you're technically non-compliant — TDLR can suspend your license at any time.</p>
  <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;margin:0 0 20px;border-radius:4px">
    <strong style="color:#92400e">Same-day approval · Starting at $75/yr · Instant digital certificate</strong>
  </div>
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:13px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px">Get Compliant Today →</a>
  <p style="color:#64748b;font-size:13px;margin-top:20px">Questions? Reply or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
      text: `${hi}\n\nYour TDLR contractor license requires a surety bond. Without it, TDLR can suspend your license.\n\nSame-day approval, starting at $75/yr.\n\nGet bonded: ${url}\n\nQuantum Surety | TDI #3480229`,
    };
  }

  if (bt.includes('dealer') || bt === 'dealer') {
    const url = `https://quantumsurety.bond/get-bond?type=dealer&utm_source=crm-daily&utm_campaign=dealer-auto`;
    return {
      subject: noName ? 'Your Texas GDN dealer bond — from $100/yr' : `${name}, your Texas GDN dealer bond — from $100/yr`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">Your Texas GDN dealer license requires a $25,000 surety bond — TxDMV won't activate your license without it. We specialize in dealer bonds and can get you approved fast.</p>
  <div style="background:#f8fafc;border-left:4px solid #f59e0b;padding:16px;margin:0 0 20px;border-radius:4px">
    <strong style="color:#0f172a">$25,000 bond · From $100/yr · 24-hr turnaround · TxDMV accepted</strong>
  </div>
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:13px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px">Apply Now →</a>
  <p style="color:#64748b;font-size:13px;margin-top:20px">Questions? Reply or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
      text: `${hi}\n\nYour Texas GDN dealer license needs a $25,000 surety bond. From $100/yr, 24-hr approval.\n\nApply: ${url}\n\nQuantum Surety | TDI #3480229`,
    };
  }

  // Generic fallback
  const url = `https://quantumsurety.bond/get-bond?utm_source=crm-daily&utm_campaign=general-auto`;
  return {
    subject: noName ? 'Your surety bond — ready when you are' : `${name}, your surety bond — ready when you are`,
    html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">You recently looked into a Texas surety bond. We're here when you're ready — same-day approval for most bond types, TDI-licensed, instant certificates.</p>
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:13px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px">Get My Free Quote →</a>
  <p style="color:#64748b;font-size:13px;margin-top:20px">Questions? Reply or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
    text: `${hi}\n\nYou looked into a Texas surety bond. Same-day approval, instant certificates.\n\nGet a quote: ${url}\n\nQuantum Surety | TDI #3480229`,
  };
}

async function main() {
  const db = new Client({
    host: '192.168.4.122', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS || 'QsCRMV8yNgKOoaNPu67JF!',
  });
  await db.connect();

  const { rows: leads } = await db.query(`
    SELECT id, name, email, bond_type, source
    FROM leads
    WHERE status = 'new'
      AND email IS NOT NULL AND email != ''
      AND email NOT LIKE '%noemail.quantumsurety%'
      AND source NOT IN ('TxSmartBuy Bid Monitor', 'TxSmartBuy Monitor', 'ESBD Monitor')
      AND created_at >= NOW() - INTERVAL '${LOOKBACK} hours'
      AND created_at < NOW() - INTERVAL '4 hours'
    ORDER BY created_at ASC
  `);

  console.log(`[${new Date().toISOString()}] Auto-followup: ${leads.length} new leads to contact`);

  let sent = 0, failed = 0;
  for (const lead of leads) {
    const { subject, html, text } = buildEmail(lead);

    if (DRY_RUN) {
      console.log(`  [DRY] → ${lead.email} | ${lead.bond_type} | "${subject}"`);
      sent++; continue;
    }

    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [lead.email.toLowerCase().trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
      }));
      await db.query(
        `UPDATE leads SET status='contacted', notes=COALESCE(notes||' | ','')|| $1 WHERE id=$2`,
        [`auto-followup ${new Date().toISOString().slice(0,10)}`, lead.id]
      );
      sent++;
      await sleep(RATE_MS);
    } catch (e) {
      console.error(`  FAIL ${lead.email}: ${e.message}`);
      failed++;
    }
  }

  await db.end();
  console.log(`[${new Date().toISOString()}] Done. Sent: ${sent} | Failed: ${failed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
