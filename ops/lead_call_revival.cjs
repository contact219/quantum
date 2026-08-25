#!/usr/bin/env node
/**
 * lead_call_revival.cjs — voice follow-up for aged, unsold get-bond form leads.
 *
 * WHO IT CALLS: people who asked for a quote through the get-bond form (the only
 * channel that has ever produced a sale), left a phone number in that form, never
 * bought, and have gone quiet: lead is 8–90 days old and untouched for 7+ days.
 * They gave us their number while asking about this exact product — that is the
 * consent basis. Do NOT widen this to scraped lists (txsos, TDLR): those numbers
 * were never given to us and AI cold calls there are a TCPA problem.
 *
 * WHAT IT DOES: enqueues calls on the voice-agent outbound queue with
 * agent_kind='followup' (the "QS Application Follow-up" Retell agent). The queue
 * enforces the shared daily cap, business hours, 2-attempt max, and 7-day phone
 * dedupe; this script enforces cohort rules and its own once-ever-per-lead dedupe.
 *
 * Keep --limit small: the queue is FIFO — flooding it makes fresh same-day form
 * leads wait behind backlog. Leave headroom under OUTBOUND_DAILY_CAP.
 *
 * Usage:  node lead_call_revival.cjs             # dry run
 *         node lead_call_revival.cjs --send       # actually enqueue
 *         node lead_call_revival.cjs --send --limit 5
 * Env:    CRM_DB_PASSWORD (PG), OUTBOUND_SECRET (voice-agent shared secret)
 */
const { Client } = require('pg');

const SEND  = process.argv.includes('--send');
const limIx = process.argv.indexOf('--limit');
const LIMIT = limIx > -1 ? parseInt(process.argv[limIx + 1], 10) || 5 : 5;
const VOICE_URL = 'https://voice-agent.permitpilot.online/outbound-call';
const SECRET = process.env.OUTBOUND_SECRET || '';

// Normalize the leads table's mixed bond_type values to the queue's short keys
// (drives the agent's {{bond_type_label}}) and to a human phrase for the reason line.
function normalizeBond(raw) {
  const t = (raw || '').toLowerCase();
  if (t.includes('notary')) return { key: 'notary', phrase: 'a Texas notary bond' };
  if (t.includes('dealer') || t.includes('gdn')) return { key: 'dealer', phrase: 'a Texas dealer bond' };
  if (t.includes('title')) return { key: 'bonded-title', phrase: 'a Texas bonded title' };
  if (t.includes('contractor')) return { key: 'contractor', phrase: 'a Texas contractor bond' };
  if (t.includes('mortgage')) return { key: 'mortgage', phrase: 'a Texas mortgage broker bond' };
  return { key: t.slice(0, 40) || 'notary', phrase: 'a Texas surety bond' };
}

async function main() {
  if (SEND && !SECRET) {
    console.error('[Revival] OUTBOUND_SECRET not set — refusing to run with --send');
    process.exit(1);
  }
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();

  await db.query(`CREATE TABLE IF NOT EXISTS lead_call_revivals (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL UNIQUE REFERENCES leads(id),
    phone TEXT NOT NULL,
    queued BOOLEAN NOT NULL,
    queue_reason TEXT,
    enqueued_at TIMESTAMPTZ DEFAULT NOW()
  )`);

  // Cohort: aged unsold form leads. Exclusions: once ever per lead, unsubscribed
  // emails, anyone with an issued bond (bought already — by email or exact name),
  // and anyone with ANY lead row (same email or phone) touched in the last 7 days
  // (they're being worked by a human, the auto-followup, or another caller).
  const { rows } = await db.query(`
    SELECT l.id, l.name, l.email, l.phone, l.bond_type, l.status, l.created_at::date AS asked_on
    FROM leads l
    WHERE l.source = 'get-bond form'
      AND l.phone IS NOT NULL AND l.phone != ''
      AND l.name IS NOT NULL AND length(trim(l.name)) > 2
      AND l.status IN ('new', 'contacted')
      AND l.created_at BETWEEN NOW() - INTERVAL '90 days' AND NOW() - INTERVAL '8 days'
      AND NOT EXISTS (SELECT 1 FROM lead_call_revivals r WHERE r.lead_id = l.id)
      AND NOT EXISTS (SELECT 1 FROM unsubscribes u
                      WHERE lower(u.email) = lower(coalesce(l.email, '')))
      AND NOT EXISTS (SELECT 1 FROM bk_bonds bought
                      WHERE bought.status = 'issued'
                        AND (lower(coalesce(bought.insured_email, '')) = lower(coalesce(l.email, ''))
                             OR lower(trim(bought.insured_name)) = lower(trim(l.name))))
      AND NOT EXISTS (SELECT 1 FROM leads l2
                      WHERE (lower(l2.email) = lower(coalesce(l.email, ''))
                             OR (l2.phone IS NOT NULL AND l2.phone != '' AND
                                 regexp_replace(l2.phone, '\\D', '', 'g') != '' AND
                                 regexp_replace(l2.phone, '\\D', '', 'g') =
                                 regexp_replace(l.phone, '\\D', '', 'g')))
                        AND (l2.updated_at > NOW() - INTERVAL '7 days'
                             OR l2.status IN ('sold', 'no_follow_up')))
    ORDER BY l.created_at DESC
    LIMIT $1
  `, [LIMIT]);

  console.log(`[Revival] ${rows.length} candidate(s)${SEND ? '' : ' (DRY RUN — pass --send to enqueue)'}`);
  let queued = 0;
  const seenPhones = new Set();
  const seenEmails = new Set();

  for (const l of rows) {
    const phone = String(l.phone).trim();
    const emailKey = (l.email || '').trim().toLowerCase();
    if (seenPhones.has(phone) || (emailKey && seenEmails.has(emailKey))) {
      console.log(`  - skip dup this run: ${l.name}`); continue;
    }
    seenPhones.add(phone);
    if (emailKey) seenEmails.add(emailKey);
    const bond = normalizeBond(l.bond_type);
    const ctx = {
      call_reason_line: `you asked us for a quote on ${bond.phrase} at quantumsurety dot bond a little while back`,
      price_line: '',
    };
    console.log(`  - lead ${l.id} [${bond.key}, asked ${l.asked_on}] ${l.name} ${phone}`);
    if (!SEND) continue;

    try {
      const res = await fetch(VOICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Outbound-Secret': SECRET },
        body: JSON.stringify({
          name: l.name, email: l.email || '', phone,
          bond_type: bond.key, agent_kind: 'followup', context: ctx,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && data.queued === true;
      await db.query(
        `INSERT INTO lead_call_revivals (lead_id, phone, queued, queue_reason)
         VALUES ($1, $2, $3, $4) ON CONFLICT (lead_id) DO NOTHING`,
        [l.id, phone, ok, ok ? null : (data.reason || `http ${res.status}`)]
      );
      if (ok) { queued++; console.log(`    queued`); }
      else console.log(`    NOT queued: ${data.reason || res.status}`);
    } catch (err) {
      console.error(`    enqueue error (will retry next run): ${err.message}`);
    }
  }
  console.log(`[Revival] done — ${queued} call(s) enqueued`);
  await db.end();
}

main().catch((e) => { console.error('[Revival] fatal:', e.message); process.exit(1); });
