#!/usr/bin/env node
/**
 * inbound_second_touch.cjs — personal second-touch to warm inbound get-bond
 * form leads that the automation left behind.
 *
 * Targets leads that:
 *   - came in through the website get-bond form (highest-converting channel),
 *   - have a valid email,
 *   - EITHER status='new' and older than 48h (aged past crm_daily_auto_followup,
 *     which only looks back 48h), OR status='contacted' but gone cold for 7+
 *     days (got a single touch, then abandoned — nothing else revisits these),
 *   - do NOT already have a matching RLI bond in bk_bonds (genuinely open, not
 *     someone who already bought / is in the saved/abandoned recovery flow),
 *   - are not unsubscribed and haven't already gotten this second touch.
 *
 * Different angle from the first touch (which was a price-forward blast): a
 * personal note from Ted acknowledging they started, offering human help.
 *
 * One email per lead, ever (tracked in inbound_second_touch_sends). Marks the
 * lead 'contacted' on send. Dedupes by email within a run.
 *
 * Usage:
 *   node inbound_second_touch.cjs --dry-run
 *   node inbound_second_touch.cjs
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const DRY_RUN = process.argv.includes('--dry-run');
const LIM_IDX = process.argv.indexOf('--limit');
const LIMIT   = LIM_IDX >= 0 ? parseInt(process.argv[LIM_IDX + 1]) : 200;
const RATE_MS = 250;

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET,
  },
});

const FROM     = 'Theodore Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';

function firstName(full) {
  const w = (full || '').trim().split(/\s+/)[0] || '';
  return /^[A-Za-z]{2,}$/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : 'there';
}

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

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">
<p>${hi}</p>
<p>A little while back you started getting a ${label} with us, but it looks like it never got finished. I wanted to check in personally in case something got in the way.</p>
<p>If you still need to get bonded &mdash; or you're renewing &mdash; ${valueLine}</p>
<p style="text-align:center;margin:28px 0;"><a href="${url}" style="background:#f59e0b;color:#000;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">${cta} &rarr;</a></p>
<p>If you got stuck on something, or you'd just rather I walk you through it, reply to this email or call or text me directly at <strong>(214) 666-8718</strong>. Happy to help either way.</p>
<p style="margin-top:20px;">&mdash; Ted</p>
<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:8px;">Theodore Sparks &middot; Quantum Surety LLC &middot; TDI License #3480229<br><a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> &middot; ted@quantumsurety.bond</p>
<p style="font-size:11px;color:#94a3b8;margin-top:10px;">Don't want these emails? <a href="https://quantumsurety.bond/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color:#94a3b8;">Unsubscribe</a></p>
</div>`;

  const text = `${hi}

A little while back you started getting a ${label} with us, but it looks like it never got finished. I wanted to check in personally in case something got in the way.

If you still need to get bonded -- or you're renewing -- ${valueLineText}

${cta}: ${url}

Got stuck, or would rather I walk you through it? Reply here or call/text me directly at (214) 666-8718. Happy to help either way.

-- Ted
Theodore Sparks -- Quantum Surety LLC -- TDI #3480229
(214) 666-8718 -- ted@quantumsurety.bond`;

  return { subject, html, text };
}

async function main() {
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();

  await db.query(`CREATE TABLE IF NOT EXISTS inbound_second_touch_sends (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL UNIQUE,
    email TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
  )`);

  // Warm inbound form leads the automation left behind — 'new' aged past the 48h
  // daily followup, or 'contacted' gone cold 7+ days — that don't already have a
  // matching RLI bond (name-normalized), never second-touched.
  const { rows } = await db.query(`
    WITH form_open AS (
      SELECT id, name, email, bond_type,
             lower(regexp_replace(name, '[^a-zA-Z ]', '', 'g')) AS nname
      FROM leads
      WHERE source = 'get-bond form'
        AND email ~ '@' AND email !~ 'placeholder|example|noemail'
        AND (
          -- 'new' leads the 48h daily auto-followup has aged past
          (status = 'new' AND created_at < NOW() - INTERVAL '48 hours')
          -- 'contacted' leads that got one touch, then went cold 7+ days ago
          -- (the daily followup only revisits <48h; nothing re-engages these)
          OR (status = 'contacted' AND updated_at < NOW() - INTERVAL '7 days')
        )
        AND NOT EXISTS (SELECT 1 FROM unsubscribes u WHERE lower(u.email) = lower(leads.email))
        AND NOT EXISTS (SELECT 1 FROM inbound_second_touch_sends s WHERE s.lead_id = leads.id)
    ),
    norm_bonds AS (
      SELECT lower(regexp_replace(insured_name,'[^a-zA-Z ]','','g')) AS bname,
             split_part(lower(regexp_replace(insured_name,'[^a-zA-Z ]','','g')),' ',1) AS bfirst,
             reverse(split_part(reverse(lower(regexp_replace(insured_name,'[^a-zA-Z ]','','g'))),' ',1)) AS blast
      FROM bk_bonds
    )
    SELECT f.id, f.name, f.email, f.bond_type
    FROM form_open f
    WHERE NOT EXISTS (
      SELECT 1 FROM norm_bonds nb
      WHERE nb.bname = f.nname
         OR (split_part(f.nname,' ',1) = nb.bfirst AND reverse(split_part(reverse(f.nname),' ',1)) = nb.blast)
    )
    ORDER BY f.id
    LIMIT $1
  `, [LIMIT]);

  console.log(`[InboundSecondTouch] ${rows.length} warm open inbound leads${DRY_RUN ? ' (DRY RUN)' : ''}`);
  let sent = 0;
  const seen = new Set();

  for (const lead of rows) {
    const key = lead.email.trim().toLowerCase();
    if (seen.has(key)) {
      console.log(`  - skip (dup email this run): ${lead.email}`);
      if (!DRY_RUN) await db.query(`INSERT INTO inbound_second_touch_sends (lead_id, email) VALUES ($1,$2) ON CONFLICT (lead_id) DO NOTHING`, [lead.id, lead.email.trim()]);
      continue;
    }
    seen.add(key);

    const { subject, html, text } = buildEmail(lead);
    if (DRY_RUN) {
      console.log(`  [DRY] ${lead.name} <${lead.email}> | ${lead.bond_type} | "${subject}"`);
      sent++; continue;
    }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [lead.email.trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        Tags: [{ Name: 'campaign', Value: 'inbound-second-touch' }],
      }));
      await db.query(`INSERT INTO inbound_second_touch_sends (lead_id, email) VALUES ($1,$2) ON CONFLICT (lead_id) DO NOTHING`, [lead.id, lead.email.trim()]);
      await db.query(`UPDATE leads SET status='contacted', notes=COALESCE(notes||' | ','')||'Inbound second-touch sent '||CURRENT_DATE WHERE id=$1`, [lead.id]);
      console.log(`  ✓ ${lead.name} <${lead.email}>`);
      sent++;
    } catch (e) {
      console.error(`  ✗ ${lead.email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, RATE_MS));
  }

  await db.end();
  console.log(`[InboundSecondTouch] Done. ${sent}/${rows.length} ${DRY_RUN ? 'previewed' : 'sent'}.`);
}
main().catch(e => { console.error(e); process.exit(1); });
