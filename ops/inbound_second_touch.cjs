#!/usr/bin/env node
/**
 * inbound_second_touch.cjs — follow-up sequence for warm inbound get-bond form
 * leads (the only channel that has ever converted).
 *
 * Touch 0 is the instant site email + crm_daily_auto_followup (within 96h).
 * This script sends the next two, once each per lead:
 *
 *   Step 1 (day 3+)  personal note from Ted offering help. Tracked in
 *                    inbound_second_touch_sends (unchanged since 2026-07-07).
 *   Step 2 (day 10+) short last note, 7+ days after step 1, then we stop.
 *                    Tracked in inbound_third_touch_sends (added 2026-10-04).
 *
 * Both steps require: get-bond form source, valid email, status new/contacted,
 * no matching RLI bond in bk_bonds, no sold lead on the same email, not
 * unsubscribed, no "replied" in the lead notes, not a title lead.
 * Step 1 only picks up leads created in the last 45 days and step 2 only
 * follows a step 1 sent in the last 30 days, so a deploy never reaches back
 * into the old backlog. Marks the lead 'contacted' on send. Dedupes by email
 * within a run, and step 2 runs first so nobody gets both on one day.
 *
 * Runs weekdays (was Mondays only, which left a 4-10 day gap after touch 0).
 *
 * Usage:
 *   node inbound_second_touch.cjs --dry-run
 *   node inbound_second_touch.cjs
 *   node inbound_second_touch.cjs --step 1   (or --step 2: run one step only)
 */
const { SESClient, SendEmailCommand, unsubUrl } = require('/root/lib/qs_ses.cjs');  // signed one-click unsubscribe (2026-09-26)
const { Client } = require('pg');

const DRY_RUN = process.argv.includes('--dry-run');
const LIM_IDX = process.argv.indexOf('--limit');
const LIMIT   = LIM_IDX >= 0 ? parseInt(process.argv[LIM_IDX + 1]) : 200;
const STEP_IDX = process.argv.indexOf('--step');
const ONLY_STEP = STEP_IDX >= 0 ? parseInt(process.argv[STEP_IDX + 1]) : 0;
const RATE_MS = 250;

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET,
  },
});

const FROM     = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

function firstName(full) {
  const w = (full || '').trim().split(/\s+/)[0] || '';
  return /^[A-Za-z]{2,}$/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : 'there';
}

function signature(lead) {
  return `<p style="margin-top:20px;">&mdash; Ted</p>
<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:8px;">Theodore Sparks &middot; Quantum Surety LLC &middot; TDI License #3480229<br><a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> &middot; ted@quantumsurety.bond</p>
<p style="font-size:11px;color:#94a3b8;margin-top:10px;">Don't want these emails? <a href="${unsubUrl(lead.email)}" style="color:#94a3b8;">Unsubscribe</a></p>`;
}
const SIGNATURE_TEXT = `-- Ted
Theodore Sparks -- Quantum Surety LLC -- TDI #3480229
(214) 666-8718 -- ted@quantumsurety.bond`;

// Step 1: personal check-in.
function buildEmail(lead) {
  const name = firstName(lead.name);
  const hi = name === 'there' ? 'Hi there,' : `Hi ${name},`;
  const isNotary = (lead.bond_type || '').toLowerCase().includes('notary');
  const url = isNotary
    ? 'https://quantumsurety.bond/get-bond?type=notary&utm_source=crm&utm_campaign=inbound-2ndtouch'
    : 'https://quantumsurety.bond/get-bond?utm_source=crm&utm_campaign=inbound-2ndtouch';

  const label = isNotary ? 'Texas notary bond' : 'Texas surety bond';
  const subject = name === 'there'
    ? `Did you get your ${label} sorted?`
    : `${name} — did you get your ${label} sorted?`;

  const valueLine = isNotary
    ? `it's genuinely quick: <strong>$50 flat, covers the full 4-year term, and your certificate is emailed the moment you check out.</strong> That's everything the county and the Texas Secretary of State need to swear you in or keep your commission active.`
    : `it's genuinely quick, and your certificate is emailed the moment you check out &mdash; everything you need to stay compliant.`;
  const valueLineText = isNotary
    ? `it's quick: $50 flat, covers the full 4-year term, and your certificate is emailed the moment you check out -- everything the county and Texas SOS need.`
    : `it's quick, and your certificate is emailed the moment you check out.`;
  const cta = isNotary ? 'Finish My Notary Bond' : 'Finish My Bond';

  // 666-8718 is the automated assistant line, so no "call or text me directly".
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">
<p>${hi}</p>
<p>A little while back you started getting a ${label} with us, but it looks like it never got finished. I wanted to check in personally in case something got in the way.</p>
<p>If you still need to get bonded &mdash; or you're renewing &mdash; ${valueLine}</p>
<p style="text-align:center;margin:28px 0;"><a href="${url}" style="background:#f59e0b;color:#000;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">${cta} &rarr;</a></p>
<p>If you got stuck on something, or you'd just rather I walk you through it, reply to this email or call our line at <strong>(214) 666-8718</strong>. Happy to help either way.</p>
${signature(lead)}
</div>`;

  const text = `${hi}

A little while back you started getting a ${label} with us, but it looks like it never got finished. I wanted to check in personally in case something got in the way.

If you still need to get bonded -- or you're renewing -- ${valueLineText}

${cta}: ${url}

Got stuck, or would rather I walk you through it? Reply here or call our line at (214) 666-8718. Happy to help either way.

${SIGNATURE_TEXT}`;

  return { subject, html, text };
}

// Step 2: short last note. No new factual claims, no urgency, no "Re:" subject,
// and no promise that their earlier application is saved (it usually isn't).
function buildLastEmail(lead) {
  const name = firstName(lead.name);
  const hi = name === 'there' ? 'Hi there,' : `Hi ${name},`;
  const isNotary = (lead.bond_type || '').toLowerCase().includes('notary');
  const url = isNotary
    ? 'https://quantumsurety.bond/get-bond?type=notary&utm_source=crm&utm_campaign=inbound-3rdtouch'
    : 'https://quantumsurety.bond/get-bond?utm_source=crm&utm_campaign=inbound-3rdtouch';
  const label = isNotary ? 'Texas notary bond' : 'Texas surety bond';
  const subject = `Last note on your ${label}`;

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">
<p>${hi}</p>
<p>I haven't heard back about your ${label}, so this is my last follow-up. I don't want to crowd your inbox.</p>
<p>If you still need it, you can apply here whenever it suits you: <a href="${url}" style="color:#2563eb;">${isNotary ? 'get my notary bond' : 'get my bond'}</a>.</p>
<p>And if you already took care of it somewhere else, no problem at all. A one-word reply lets me close your file.</p>
${signature(lead)}
</div>`;

  const text = `${hi}

I haven't heard back about your ${label}, so this is my last follow-up. I don't want to crowd your inbox.

If you still need it, you can apply here whenever it suits you: ${url}

And if you already took care of it somewhere else, no problem at all. A one-word reply lets me close your file.

${SIGNATURE_TEXT}`;

  return { subject, html, text };
}

// Normalize names: non-alpha -> space, collapse whitespace, trim. (Trailing
// spaces / punctuation previously defeated the bond-match exclusion.)
const NNAME = `trim(regexp_replace(regexp_replace(lower(l.name), '[^a-z ]', ' ', 'g'), '\\s+', ' ', 'g')) AS nname`;
const NORM_BONDS = `
    norm_bonds AS (
      SELECT bname,
             split_part(bname,' ',1) AS bfirst,
             reverse(split_part(reverse(bname),' ',1)) AS blast
      FROM (
        SELECT trim(regexp_replace(regexp_replace(lower(insured_name), '[^a-z ]', ' ', 'g'), '\\s+', ' ', 'g')) AS bname
        FROM bk_bonds
      ) b
      WHERE bname <> ''
    )`;

// Shared exclusions for both steps; f is the candidate CTE.
const STILL_OPEN = `
        f.source = 'get-bond form'
        AND f.status IN ('new','contacted')
        AND f.email ~ '@' AND f.email !~ 'placeholder|example|noemail'
        AND coalesce(f.notes,'') !~* 'replied'
        AND coalesce(f.bond_type,'') NOT ILIKE '%title%'  -- title leads: handled by title_inbound_followup.cjs on the main VPS (2026-09-27)
        AND NOT EXISTS (SELECT 1 FROM unsubscribes u WHERE lower(u.email) = lower(f.email))
        AND NOT EXISTS (SELECT 1 FROM leads l2 WHERE lower(l2.email) = lower(f.email) AND l2.status = 'sold')
        AND NOT EXISTS (SELECT 1 FROM revenue_events r WHERE lower(r.email) = lower(trim(f.email)))
        AND NOT (lower(coalesce(f.bond_type,'')) LIKE '%dealer%' AND EXISTS (SELECT 1 FROM auto_dealers d WHERE lower(d.email) = lower(f.email) AND d.license_type ILIKE '%franchise%') AND NOT EXISTS (SELECT 1 FROM auto_dealers d WHERE lower(d.email) = lower(f.email) AND d.license_type NOT ILIKE '%franchise%'))  -- franchise-pause 2026-09-26, same rule as crm_daily_auto_followup
        AND f.nname <> '' AND NOT EXISTS (
          SELECT 1 FROM norm_bonds nb
          WHERE nb.bname = f.nname
             OR (split_part(f.nname,' ',1) = nb.bfirst AND reverse(split_part(reverse(f.nname),' ',1)) = nb.blast)
        )`;

async function sendStep(db, step, rows, build, table, campaign, note) {
  console.log(`[InboundFollowup] step ${step}: ${rows.length} warm open inbound leads${DRY_RUN ? ' (DRY RUN)' : ''}`);
  let sent = 0;
  const seen = new Set();
  for (const lead of rows) {
    const key = lead.email.trim().toLowerCase();
    if (seen.has(key)) {
      console.log(`  - skip (dup email this run): ${lead.email}`);
      if (!DRY_RUN) await db.query(`INSERT INTO ${table} (lead_id, email) VALUES ($1,$2) ON CONFLICT (lead_id) DO NOTHING`, [lead.id, lead.email.trim()]);
      continue;
    }
    seen.add(key);

    const { subject, html, text } = build(lead);
    if (DRY_RUN) {
      console.log(`  [DRY] ${lead.name} <${lead.email}> | ${lead.bond_type} | "${subject}"`);
      sent++; continue;
    }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [lead.email.trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        Tags: [{ Name: 'campaign', Value: campaign }],
      }));
      await db.query(`INSERT INTO ${table} (lead_id, email) VALUES ($1,$2) ON CONFLICT (lead_id) DO NOTHING`, [lead.id, lead.email.trim()]);
      await db.query(`UPDATE leads SET status='contacted', notes=COALESCE(notes||' | ','')||$2||' '||CURRENT_DATE WHERE id=$1`, [lead.id, note]);
      console.log(`  ✓ ${lead.name} <${lead.email}>`);
      sent++;
    } catch (e) {
      console.error(`  ✗ ${lead.email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, RATE_MS));
  }
  console.log(`[InboundFollowup] step ${step} done. ${sent}/${rows.length} ${DRY_RUN ? 'previewed' : 'sent'}.`);
  return seen;
}

async function main() {
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();

  for (const t of ['inbound_second_touch_sends', 'inbound_third_touch_sends']) {
    await db.query(`CREATE TABLE IF NOT EXISTS ${t} (
      id SERIAL PRIMARY KEY,
      lead_id INTEGER NOT NULL UNIQUE,
      email TEXT NOT NULL,
      sent_at TIMESTAMPTZ DEFAULT NOW()
    )`);
  }

  let mailed = new Set();
  if (ONLY_STEP !== 1) {
    const { rows } = await db.query(`
      WITH f AS (
        SELECT l.*, ${NNAME}
        FROM leads l JOIN inbound_second_touch_sends s ON s.lead_id = l.id
        WHERE s.sent_at < NOW() - INTERVAL '7 days'
          AND s.sent_at > NOW() - INTERVAL '30 days'
          AND NOT EXISTS (SELECT 1 FROM inbound_third_touch_sends t WHERE t.lead_id = l.id)
      ),${NORM_BONDS}
      SELECT f.id, f.name, f.email, f.bond_type FROM f
      WHERE ${STILL_OPEN}
      ORDER BY f.id
      LIMIT $1
    `, [LIMIT]);
    mailed = await sendStep(db, 2, rows, buildLastEmail, 'inbound_third_touch_sends', 'inbound-third-touch', 'Inbound last-touch sent');
  }

  if (ONLY_STEP !== 2) {
    const { rows } = await db.query(`
      WITH f AS (
        SELECT l.*, ${NNAME}
        FROM leads l
        WHERE l.created_at < NOW() - INTERVAL '3 days'
          AND l.created_at > NOW() - INTERVAL '45 days'
          -- 2 quiet days after the auto-followup (a Friday lead's lands Monday). leads has
          -- no updated_at trigger, so read the dated note crm_daily_auto_followup appends.
          AND coalesce(l.notes,'') !~ ('auto-followup (' || to_char(CURRENT_DATE,'YYYY-MM-DD') || '|' || to_char(CURRENT_DATE - 1,'YYYY-MM-DD') || ')')
          AND NOT EXISTS (SELECT 1 FROM inbound_second_touch_sends s WHERE s.lead_id = l.id)
      ),${NORM_BONDS}
      SELECT f.id, f.name, f.email, f.bond_type FROM f
      WHERE ${STILL_OPEN}
      ORDER BY f.id
      LIMIT $1
    `, [LIMIT]);
    await sendStep(db, 1, rows.filter(r => !mailed.has(r.email.trim().toLowerCase())),
      buildEmail, 'inbound_second_touch_sends', 'inbound-second-touch', 'Inbound second-touch sent');
  }

  await db.end();
}
main().catch(e => { console.error(e); process.exit(1); });
