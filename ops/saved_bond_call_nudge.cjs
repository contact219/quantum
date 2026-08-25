#!/usr/bin/env node
/**
 * saved_bond_call_nudge.cjs — voice nudge for saved/abandoned notary bond applications.
 *
 * WHO IT CALLS: people who started a notary bond application through us (bk_bonds rows
 * synced from RLI/mybondapp with status saved / saved_empty / abandoned) and either
 *   (a) typed a phone number into that application (insured_phone), or
 *   (b) gave us a phone on their own get-bond form submission (matched by email) —
 *       wave 2, approved by Ted 2026-08-25.
 * Do NOT widen the cohort beyond these two consent paths.
 *
 * WHAT IT DOES: enqueues calls on the voice-agent outbound queue with
 * agent_kind='followup' (the "QS Application Follow-up" Retell agent). The queue
 * enforces the shared daily cap, business hours, 2-attempt max, and 7-day phone
 * dedupe; this script enforces the cohort rules and its own once-ever dedupe.
 *
 * Keep --limit small: the outbound queue is FIFO, so flooding it makes fresh
 * same-day form leads wait behind backlog. Leave headroom under OUTBOUND_DAILY_CAP.
 *
 * Usage:  node saved_bond_call_nudge.cjs            # dry run — prints who it would call
 *         node saved_bond_call_nudge.cjs --send      # actually enqueue
 *         node saved_bond_call_nudge.cjs --send --limit 5
 * Env:    CRM_DB_PASSWORD (PG), OUTBOUND_SECRET (voice-agent shared secret)
 */
const { Client } = require('pg');

const SEND  = process.argv.includes('--send');
const limIx = process.argv.indexOf('--limit');
const LIMIT = limIx > -1 ? parseInt(process.argv[limIx + 1], 10) || 3 : 3;
const VOICE_URL = 'https://voice-agent.permitpilot.online/outbound-call';
const SECRET = process.env.OUTBOUND_SECRET || '';

function reasonLine(status) {
  return status === 'abandoned'
    ? 'you started a Texas notary bond application with us that did not get finished'
    : 'you started a Texas notary bond application with us and saved it before finishing';
}

function priceLine(premium) {
  const p = Number(premium);
  // RLI auto-creates a $21.00 draft on checkout page load — that is machine noise,
  // not a price anyone was quoted (observed real premiums start at $71). Never
  // speak a price unless it is clearly a real saved quote.
  if (!p || p <= 25) return '';
  return `Your saved quote came to $${p.toFixed(2)} for the full four-year term.`;
}

async function main() {
  if (SEND && !SECRET) {
    console.error('[Nudge] OUTBOUND_SECRET not set — refusing to run with --send');
    process.exit(1);
  }
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();

  await db.query(`CREATE TABLE IF NOT EXISTS saved_bond_call_nudges (
    id SERIAL PRIMARY KEY,
    bond_id INTEGER NOT NULL UNIQUE REFERENCES bk_bonds(id),
    phone TEXT NOT NULL,
    queued BOOLEAN NOT NULL,
    queue_reason TEXT,
    enqueued_at TIMESTAMPTZ DEFAULT NOW()
  )`);

  // Cohort + exclusions:
  //  - notary saved/abandoned bonds, named (nameless = RLI auto-draft junk)
  //  - phone from the application itself, else from the person's own form lead
  //  - once ever per bond (nudge table), no unsubscribed emails, nobody who later
  //    got an issued bond, no leads marked no_follow_up, no email-recovery touch
  //    in the last 7 days, and nobody whose CRM lead was touched in the last
  //    7 days (manual call sheet, auto-followup, second-touch) — do not robo-call
  //    on top of a live human/email conversation.
  const { rows } = await db.query(`
    WITH candidates AS (
      SELECT b.id, b.insured_name, b.insured_email, b.status, b.premium, b.created_at,
             COALESCE(NULLIF(trim(b.insured_phone), ''), lp.phone) AS phone,
             CASE WHEN NULLIF(trim(b.insured_phone), '') IS NULL
                  THEN 'leads-join' ELSE 'application' END AS phone_source
      FROM bk_bonds b
      LEFT JOIN LATERAL (
        SELECT l.phone FROM leads l
        WHERE lower(l.email) = lower(coalesce(b.insured_email, ''))
          AND l.phone IS NOT NULL AND l.phone != ''
        ORDER BY l.created_at DESC LIMIT 1
      ) lp ON NULLIF(trim(b.insured_phone), '') IS NULL
      WHERE lower(b.bond_type) LIKE '%notary%'
        AND b.status IN ('saved', 'saved_empty', 'abandoned')
        AND b.insured_name IS NOT NULL AND length(trim(b.insured_name)) > 2
    )
    SELECT c.id, c.insured_name, c.insured_email, c.phone, c.phone_source, c.status, c.premium
    FROM candidates c
    WHERE c.phone IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM saved_bond_call_nudges n WHERE n.bond_id = c.id)
      AND NOT EXISTS (SELECT 1 FROM unsubscribes u
                      WHERE lower(u.email) = lower(coalesce(c.insured_email, '')))
      AND NOT EXISTS (SELECT 1 FROM bk_bonds done
                      WHERE done.status = 'issued'
                        AND lower(trim(done.insured_name)) = lower(trim(c.insured_name)))
      AND NOT EXISTS (SELECT 1 FROM leads l
                      WHERE lower(l.email) = lower(coalesce(c.insured_email, ''))
                        AND l.status = 'no_follow_up')
      AND NOT EXISTS (SELECT 1 FROM saved_bond_recovery_sends s
                      WHERE s.bond_id = c.id AND s.sent_at > NOW() - INTERVAL '7 days')
      AND NOT EXISTS (SELECT 1 FROM abandoned_bond_recovery_sends a
                      WHERE a.bond_id = c.id AND a.sent_at > NOW() - INTERVAL '7 days')
      AND NOT EXISTS (SELECT 1 FROM leads l2
                      WHERE (lower(l2.email) = lower(coalesce(c.insured_email, ''))
                             OR (l2.phone IS NOT NULL AND l2.phone != '' AND
                                 regexp_replace(l2.phone, '\\D', '', 'g') != '' AND
                                 regexp_replace(l2.phone, '\\D', '', 'g') =
                                 regexp_replace(c.phone, '\\D', '', 'g')))
                        AND l2.updated_at > NOW() - INTERVAL '7 days')
    ORDER BY c.created_at DESC
    LIMIT $1
  `, [LIMIT]);

  console.log(`[Nudge] ${rows.length} candidate(s)${SEND ? '' : ' (DRY RUN — pass --send to enqueue)'}`);
  let queued = 0;
  const seenPhones = new Set();

  for (const b of rows) {
    const phone = String(b.phone).trim();
    if (seenPhones.has(phone)) { console.log(`  - skip dup phone this run: ${phone}`); continue; }
    seenPhones.add(phone);
    const ctx = { call_reason_line: reasonLine(b.status), price_line: priceLine(b.premium) };
    console.log(`  - bond ${b.id} [${b.status}/${b.phone_source}] ${b.insured_name} ${phone}` +
                (ctx.price_line ? ` (quote $${Number(b.premium).toFixed(2)})` : ''));
    if (!SEND) continue;

    try {
      const res = await fetch(VOICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Outbound-Secret': SECRET },
        body: JSON.stringify({
          name: b.insured_name, email: b.insured_email || '', phone,
          bond_type: 'notary', agent_kind: 'followup', context: ctx,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && data.queued === true;
      // Record every attempt (queued or refused) so a refused row is not retried
      // forever; a 'recently queued' refusal means the queue already owns this phone.
      await db.query(
        `INSERT INTO saved_bond_call_nudges (bond_id, phone, queued, queue_reason)
         VALUES ($1, $2, $3, $4) ON CONFLICT (bond_id) DO NOTHING`,
        [b.id, phone, ok, ok ? null : (data.reason || `http ${res.status}`)]
      );
      if (ok) { queued++; console.log(`    queued`); }
      else console.log(`    NOT queued: ${data.reason || res.status}`);
    } catch (err) {
      console.error(`    enqueue error (will retry next run): ${err.message}`);
    }
  }
  console.log(`[Nudge] done — ${queued} call(s) enqueued`);
  await db.end();
}

main().catch((e) => { console.error('[Nudge] fatal:', e.message); process.exit(1); });
