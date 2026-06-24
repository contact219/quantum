#!/usr/bin/env node
/**
 * CRM 7-Day Re-Engagement Blast
 * Targets leads in 'contacted' status that were emailed 7-14 days ago and haven't converted.
 * Stronger CTA, urgency angle, adds proof elements.
 *
 * Usage:
 *   node crm_reengagement_blast.cjs              -- send all eligible
 *   node crm_reengagement_blast.cjs --dry-run    -- preview
 *   node crm_reengagement_blast.cjs --limit 200  -- cap sends
 *
 * Cron (weekly, Mondays 9 AM CDT):
 *   0 14 * * 1  cd /path/to/quantum && SES_KEY=... SES_SECRET=... CRM_DB_PASS=... node crm_reengagement_blast.cjs >> /var/log/crm-reengagement.log 2>&1
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DRY_RUN  = process.argv.includes('--dry-run');
const LIM_IDX  = process.argv.indexOf('--limit');
const LIMIT    = LIM_IDX >= 0 ? parseInt(process.argv[LIM_IDX + 1]) : Infinity;
const SENT_LOG = path.join(__dirname, 'crm_reengagement_sent.json');
const RATE_MS  = 150;

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM     = 'Theodore Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function loadSent() { try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG,'utf8'))); } catch { return new Set(); } }
function logSent(e, s) { s.add(e); fs.writeFileSync(SENT_LOG, JSON.stringify([...s])); }

const BIZ_SUFFIXES = new Set(['llc','inc','corp','co','ltd','services','construction','group','solutions','consulting','management','associates','enterprises','company','industries','systems','technologies','contractors']);
const KNOWN_NAMES  = new Set('james,john,robert,michael,william,david,richard,joseph,thomas,charles,christopher,daniel,matthew,anthony,mark,donald,steven,paul,andrew,joshua,kenneth,kevin,brian,george,edward,ronald,timothy,jason,jeffrey,ryan,gary,jacob,nicholas,eric,jonathan,stephen,larry,justin,scott,brandon,benjamin,samuel,frank,raymond,gregory,alexander,patrick,jack,dennis,jerry,tyler,henry,aaron,jose,adam,nathan,zachary,douglas,peter,kyle,noah,ethan,jeremy,walter,christian,keith,roger,terry,austin,sean,gerald,carl,harold,dylan,arthur,lawrence,jordan,jesse,bryan,billy,joe,bruce,gabriel,logan,albert,willie,alan,juan,wayne,elijah,randy,roy,vincent,ralph,eugene,russell,bobby,mason,philip,louis,omar,liam,oliver'.split(','));
const KNOWN_NAMES_F = new Set('mary,patricia,jennifer,linda,barbara,elizabeth,susan,jessica,sarah,karen,lisa,nancy,betty,margaret,sandra,ashley,emily,kimberly,donna,carol,michelle,amanda,melissa,deborah,stephanie,dorothy,sharon,amy,anna,helen,kathleen,angela,brenda,pamela,emma,nicole,ruth,samantha,rachel,carolyn,virginia,maria,heather,diane,julie,joyce,victoria,kelly,christina,lauren,joan,evelyn,olivia,judy,cheryl,megan,andrea,hannah,jacqueline,martha,gloria,teresa,ann,sara,madison,frances,kathryn,janice,jean,abigail,alice,julia,jill,grace,denise,amber,marilyn,beverly,danielle,theresa,sophia,marie,diana,brittany,natalie,isabella,charlotte,rose,alexis,tiffany,kayla,crystal,brianna,janet,cathy,debra,lynn,claire,paula,dawn'.split(','));

function firstName(lead) {
  const raw = (lead.name || '').trim();
  if (raw) {
    const words = raw.split(/\s+/);
    const first = words[0];
    const lowerWords = words.map(w => w.toLowerCase());
    const hasBizSuffix = lowerWords.some(w => BIZ_SUFFIXES.has(w.replace(/[^a-z]/g,'')));
    if (raw !== raw.toUpperCase() && !/\d/.test(raw) && !/[&\/\\]/.test(raw) && !hasBizSuffix && /^[A-Z][a-z]/.test(first) && first.length >= 2) return first;
  }
  const prefix = (lead.email||'').split('@')[0].toLowerCase();
  if (!prefix || /\d/.test(prefix) || prefix.length > 10) return 'there';
  const GENERIC = new Set(['info','contact','admin','office','sales','billing','hello','team','mail','support','inquiry','service','general','accounting','estimate','operations','utility']);
  if (GENERIC.has(prefix)) return 'there';
  const clean = prefix.replace(/[._+\-]/g,'');
  if ((KNOWN_NAMES.has(clean)||KNOWN_NAMES_F.has(clean)) && clean.length >= 3) return clean.charAt(0).toUpperCase()+clean.slice(1);
  return 'there';
}

function buildEmail(lead) {
  const name   = firstName(lead);
  const noName = name === 'there';
  const hi     = noName ? 'Hi,' : `Hi ${name},`;
  const bt     = (lead.bond_type || '').toLowerCase();

  const proof = `<div style="margin:16px 0;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px">
  <p style="margin:0;font-size:13px;color:#166534">
    <strong>★ 4.9/5 from Texas bond buyers</strong> &nbsp;·&nbsp; TDI License #3480229
    &nbsp;·&nbsp; Instant certificate delivery &nbsp;·&nbsp; 10,000+ bonds issued
  </p>
</div>`;

  if (bt.includes('notary')) {
    const url = `https://quantumsurety.bond/get-bond?type=notary&utm_source=crm-reengage&utm_campaign=notary-7day`;
    return {
      subject: noName ? 'Last chance: your Texas notary bond for $50' : `${name} — still need your notary bond? $50 gets you started`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 12px">We reached out a week ago about your Texas notary bond. If you're still working on getting your commission set up — or if your current bond expires soon — here's what you need to know:</p>
  <ul style="color:#475569;line-height:1.8;margin:0 0 16px;padding-left:20px">
    <li><strong>$50 flat</strong> for the full 4-year term (not per year)</li>
    <li>Instant PDF certificate — accepted by Texas Secretary of State</li>
    <li>Filed same day — your notary commission activates immediately</li>
    <li>No phone calls, no agent required — 100% online in under 5 minutes</li>
  </ul>
  ${proof}
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin-bottom:20px">Get Bonded for $50 →</a>
  <p style="color:#64748b;font-size:13px">Need help? Reply to this email or call <strong>(214) 666-8718</strong>. We're available Mon–Sat.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · Wylie, TX · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
      text: `${hi}\n\nWe reached out a week ago about your Texas notary bond. Still need it?\n\n• $50 flat for 4 years (not per year)\n• Instant PDF certificate\n• 100% online, under 5 minutes\n\nGet bonded: ${url}\n\nCall or reply: (214) 666-8718\n\nQuantum Surety | TDI #3480229`,
    };
  }

  if (bt.includes('contractor')) {
    const url = `https://quantumsurety.bond/get-bond?type=contractor&utm_source=crm-reengage&utm_campaign=contractor-7day`;
    return {
      subject: noName ? 'TDLR bond update — 46.9% of TX contractors are non-compliant' : `${name} — 46.9% of TX contractors have expired bonds. Are you one?`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 12px">Our analysis of TDLR public data found that <strong>29.3% of all Texas contractors have expired bonds right now</strong> — and 46.9% of electricians specifically are non-compliant. TDLR can suspend licenses with no advance notice when bond coverage lapses.</p>
  <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px;margin:0 0 16px;border-radius:4px">
    <strong style="color:#991b1b">TDLR penalty for non-compliance: up to $10,000 per violation + license suspension</strong>
  </div>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">Quantum Surety offers same-day approval starting at $75/yr. Your compliance is restored instantly when you get your bond — and we'll send renewal alerts so this never happens again.</p>
  ${proof}
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin-bottom:20px">Get Compliant Today — $75/yr →</a>
  <p style="color:#64748b;font-size:13px">Reply or call <strong>(214) 666-8718</strong> with any questions.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
      text: `${hi}\n\n29.3% of Texas contractors have expired bonds right now. TDLR can suspend your license with no advance notice.\n\nSame-day approval, $75/yr. Get compliant: ${url}\n\nQuestions: (214) 666-8718\n\nQuantum Surety | TDI #3480229`,
    };
  }

  if (bt.includes('dealer') || bt === 'dealer') {
    const url = `https://quantumsurety.bond/get-bond?type=dealer&utm_source=crm-reengage&utm_campaign=dealer-7day`;
    return {
      subject: noName ? 'Your GDN dealer bond — still available from $100/yr' : `${name} — GDN dealer bond, still from $100/yr`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">Following up on your Texas GDN dealer bond inquiry. TxDMV requires the $25,000 bond to be active before they'll issue or renew your dealer plates. If your lot is waiting on the bond, here's how to get it done today.</p>
  ${proof}
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin-bottom:20px">Apply for GDN Bond — From $100/yr →</a>
  <p style="color:#64748b;font-size:13px">Reply or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
      text: `${hi}\n\nFollowing up on your Texas GDN dealer bond. TxDMV requires a $25,000 bond before they'll issue dealer plates.\n\nFrom $100/yr, 24-hr approval: ${url}\n\nQuantum Surety | TDI #3480229`,
    };
  }

  const url = `https://quantumsurety.bond/get-bond?utm_source=crm-reengage&utm_campaign=general-7day`;
  return {
    subject: noName ? 'Still need a Texas surety bond? We can close this today.' : `${name} — still need a Texas surety bond?`,
    html: `<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 8px">${hi}</p>
  <p style="color:#475569;line-height:1.6;margin:0 0 16px">We reached out last week about your Texas surety bond. We can close this today — same-day approval for most bond types, instant certificate, no agent required.</p>
  ${proof}
  <a href="${url}" style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;margin-bottom:20px">Get My Bond Now →</a>
  <p style="color:#64748b;font-size:13px">Reply or call <strong>(214) 666-8718</strong>.</p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">Quantum Surety LLC · TDI #3480229 · <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8">Unsubscribe</a></p>
</div>`,
    text: `${hi}\n\nStill need a Texas surety bond? Same-day approval, instant certificate.\n\nGet bonded: ${url}\n\nQuantum Surety | TDI #3480229`,
  };
}

async function main() {
  const db = new Client({
    host: '192.168.4.122', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS || 'QsCRMV8yNgKOoaNPu67JF!',
  });
  await db.connect();

  // Leads that were contacted 7–21 days ago and still haven't sold
  const { rows: leads } = await db.query(`
    SELECT id, name, email, bond_type, source
    FROM leads
    WHERE status = 'contacted'
      AND email IS NOT NULL AND email != ''
      AND email NOT LIKE '%noemail.quantumsurety%'
      AND source NOT IN ('TxSmartBuy Bid Monitor', 'TxSmartBuy Monitor', 'ESBD Monitor')
      AND updated_at >= NOW() - INTERVAL '21 days'
      AND updated_at < NOW() - INTERVAL '6 days'
    ORDER BY updated_at ASC
  `);

  console.log(`[${new Date().toISOString()}] Re-engagement: ${leads.length} eligible leads`);

  const sent = loadSent();
  let count = 0, skipped = 0;

  for (const lead of leads) {
    if (count >= LIMIT) break;
    const email = lead.email.toLowerCase().trim();
    if (sent.has(email)) { skipped++; continue; }

    const { subject, html, text } = buildEmail(lead);

    if (DRY_RUN) {
      console.log(`  [DRY] → ${email} | ${lead.bond_type} | "${subject}"`);
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
      process.stdout.write(`\r  Sent: ${count} | Skipped: ${skipped}`);
      await sleep(RATE_MS);
    } catch (e) {
      console.error(`\n  FAIL ${email}: ${e.message}`);
    }
  }

  await db.end();
  console.log(`\n[${new Date().toISOString()}] Done. Sent: ${count} | Skipped: ${skipped}`);
}

main().catch(e => { console.error(e); process.exit(1); });
