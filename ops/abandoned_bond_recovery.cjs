#!/usr/bin/env node
/**
 * abandoned_bond_recovery.cjs — recover RLI bonds stuck in "Abandoned" or
 * "Cancelled" status, via a 3-touch escalating sequence.
 *
 * WHY a sequence, not one email: measured against the original one-shot
 * version's first 30 sends, 47% (14/30) ended up cancelled anyway and only
 * ~1/30 showed a plausible real conversion (the rest of the "issued" hits
 * predated the email and weren't caused by it). One soft email with no
 * mention of the actual consequence wasn't enough of a nudge.
 *
 *   Touch 1 (day 0)  — soft, informative. Now names the consequence once,
 *                      lightly, instead of leaving it unsaid.
 *   Touch 2 (day 4+) — direct: this is heading toward cancellation. For
 *                      bonds already 'cancelled' by then, leads with the
 *                      refund (matches the cancelled-bond winback framing
 *                      that tested well) instead of restating bad news.
 *   Touch 3 (day 8+) — final notice, phone number front and center.
 *
 * Re-checks bk_bonds.status live on every run, so the message always matches
 * current reality even if a bond flips abandoned -> cancelled between
 * touches. Stops immediately if status leaves ('abandoned','cancelled') --
 * i.e. it converted -- or the address unsubscribes.
 *
 * Three underlying situations, unchanged from v1:
 *   - status='abandoned' + real bond number (MBS...) = RENEWAL stalled after
 *     RLI staff created the rider on the customer's behalf.
 *   - status='abandoned' + "ABANDON-" synthetic key = FRESH application that
 *     never finished.
 *   - status='cancelled' = RLI voided the bond retroactive to its term start;
 *     it never actually went live and the premium was refunded.
 *
 * One row per (bond, touch) in abandoned_bond_recovery_sends -- v1's table,
 * migrated in place (existing single-touch sends become touch_number=1 so
 * nobody gets touch 1 twice). Dedupes within a run by email. Skips
 * unsubscribed addresses, rechecked every run.
 *
 * Usage:
 *   node abandoned_bond_recovery.cjs --dry-run
 *   node abandoned_bond_recovery.cjs
 */
const { SESClient, SendEmailCommand, unsubUrl } = require('/root/lib/qs_ses.cjs');  // signed one-click unsubscribe (2026-09-26)
const { Client } = require('pg');

const DRY_RUN = process.argv.includes('--dry-run');
const LIM_IDX = process.argv.indexOf('--limit');
const LIMIT   = LIM_IDX >= 0 ? parseInt(process.argv[LIM_IDX + 1]) : 40;
const RATE_MS = 200;

const MAX_TOUCHES   = 3;
const STEP_DAYS     = 4; // minimum days between touches (and before touch 1 is "due" -- touch 1 has no prior touch, so it's always due)

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET,
  },
});

const FROM     = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const RESUME_URL = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX';

function firstName(full) {
  const w = (full || '').trim().split(/\s+/)[0] || '';
  return /^[A-Za-z]{2,}$/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : 'there';
}

function classify(b) {
  if (b.status === 'cancelled') return 'cancelled';
  return b.bond_number.startsWith('ABANDON-') ? 'fresh' : 'renewal';
}

const COPY = {
  renewal: {
    subject: [
      'Your Texas Notary Bond renewal is almost done — one step left',
      'Reminder: your notary bond renewal is still incomplete',
      'Last reminder — your notary bond renewal needs to be finished',
    ],
    intro: [
      `You have an active Texas Notary Bond with us, and we started processing your renewal — but it never got finished on our end. Nothing was your fault; this happens when a renewal sits without the last details confirmed. If it isn't finished soon, the renewal will lapse and you'd need to start over.`,
      `Following up on your Texas Notary Bond renewal — it's still showing as incomplete on our end. This one's genuinely quick to finish, and I'd rather close it out than let your commission lapse over a few missing details.`,
      `This is my last reminder about your Texas Notary Bond renewal. If it isn't finished in the next few days, it will lapse and you'll need to start the renewal from scratch. Happy to do this over the phone if that's easier — just call or text.`,
    ],
  },
  fresh: {
    subject: [
      "Your Texas Notary Bond application — let's finish it",
      'Your notary bond application is still open',
      'Last reminder — finish your Texas Notary Bond application',
    ],
    intro: [
      `You started a Texas Notary Bond application with us but it didn't get completed. Your info is saved — picking it back up takes about 2 minutes. If it sits much longer, we'll have to close the application out and you'd need to start again.`,
      `Checking in — your Texas Notary Bond application is still sitting open. Your info is still saved, so finishing it is still about 2 minutes. I'd rather get you bonded than let this go stale.`,
      `Last reminder on this one. Your Texas Notary Bond application is about to be closed out from our side — after that you'd be starting from zero. If you still want the bond, now's the time; otherwise no hard feelings, just let me know.`,
    ],
  },
  cancelled: {
    subject: [
      "Your Texas Notary Bond application — let's finish it",
      "Your Texas Notary Bond didn't go through — you were refunded",
      "Last reminder — let's get your Texas Notary Bond redone",
    ],
    intro: [
      `You started a Texas Notary Bond with us, but it didn't go through — the application never got confirmed on our end, so it fell through the cracks. Nothing was lost on your side; it just needs to be redone.`,
      `Following up on your Texas Notary Bond — it was cancelled on our end because it never got confirmed. You were refunded, so you're not out any money; it just needs to be redone if you still want the bond.`,
      `Last reminder — your Texas Notary Bond was cancelled and refunded, and it's still sitting unredone. If you still want it, it's about 2 minutes to finish; if not, just let me know and I'll stop following up.`,
    ],
  },
};

function buildEmail(b, touchIdx) {
  // touchIdx is 0-based (0 = touch 1, 1 = touch 2, 2 = touch 3)
  const name = firstName(b.insured_name);
  const kind = classify(b);
  const subject = COPY[kind].subject[touchIdx];
  const intro = COPY[kind].intro[touchIdx];
  const isFinal = touchIdx === MAX_TOUCHES - 1;

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">
<p>Hi ${name === 'there' ? 'there' : name},</p>
<p>${intro}</p>
<p style="text-align:center;margin:28px 0;"><a href="${RESUME_URL}" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">Finish My Bond &rarr;</a></p>
<p style="color:#475569;">Your bond certificate is emailed immediately after checkout &mdash; written by RLI Insurance (A+ rated), accepted statewide by the Texas SOS.</p>
${isFinal ? `<p style="color:#475569;">Prefer to talk it through instead? Call or text me directly &mdash; <a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a>.</p>` : `<p style="color:#64748b;font-size:13px;">💡 <strong>Tip:</strong> add <strong>Errors &amp; Omissions coverage</strong> at checkout &mdash; your bond protects the public, E&amp;O protects <em>you</em>. Typically $35–$40 more for the full four-year term — under $9 a year — and unlike the bond, you never repay a claim it pays. About 1 in 3 of our notaries takes it.</p>
<p style="color:#475569;">Questions, or would rather do this over the phone? Just reply, or call me directly &mdash; happy to walk through it with you.</p>`}
<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:24px;">Theodore Sparks &middot; Quantum Surety LLC &middot; TDI License #3480229<br><a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> &middot; ted@quantumsurety.bond</p>
<p style="font-size:11px;color:#94a3b8;margin-top:10px;">Don't want these emails? <a href="${unsubUrl(b.insured_email)}" style="color:#94a3b8;">Unsubscribe</a></p>
</div>`;

  const text = `Hi ${name},

${intro}

Finish here (takes about 2 minutes): ${RESUME_URL}

${isFinal ? 'Prefer to talk it through? Call or text (214) 666-8718.' : 'Questions? Reply to this email or call (214) 666-8718.'}

Theodore Sparks -- Quantum Surety LLC -- TDI #3480229`;

  return { subject, html, text };
}

async function migrateTable(db) {
  await db.query(`CREATE TABLE IF NOT EXISTS abandoned_bond_recovery_sends (
    id SERIAL PRIMARY KEY,
    bond_id INTEGER NOT NULL REFERENCES bk_bonds(id),
    email TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
  )`);
  await db.query(`ALTER TABLE abandoned_bond_recovery_sends ADD COLUMN IF NOT EXISTS touch_number INTEGER NOT NULL DEFAULT 1`);
  // v1 had UNIQUE(bond_id) -- one send ever. Swap it for UNIQUE(bond_id, touch_number)
  // so existing rows (all touch_number=1, migrated in place -- nobody gets touch 1 twice)
  // still block a duplicate touch 1, while touch 2/3 become insertable.
  await db.query(`ALTER TABLE abandoned_bond_recovery_sends DROP CONSTRAINT IF EXISTS abandoned_bond_recovery_sends_bond_id_key`);
  await db.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'abandoned_bond_recovery_sends_bond_touch_key'
      ) THEN
        ALTER TABLE abandoned_bond_recovery_sends
          ADD CONSTRAINT abandoned_bond_recovery_sends_bond_touch_key UNIQUE (bond_id, touch_number);
      END IF;
    END $$;
  `);
}

async function main() {
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();
  await migrateTable(db);

  // For each still-open bond, find the highest touch sent and when, then decide
  // whether the next touch is due. Bonds with zero sends are due for touch 1.
  const { rows } = await db.query(`
    SELECT b.id, b.bond_number, b.insured_name, b.insured_email, b.premium, b.commission_amt, b.status,
           COALESCE(m.max_touch, 0) AS touches_sent,
           m.last_sent_at
    FROM bk_bonds b
    LEFT JOIN (
      SELECT bond_id, MAX(touch_number) AS max_touch, MAX(sent_at) AS last_sent_at
      FROM abandoned_bond_recovery_sends GROUP BY bond_id
    ) m ON m.bond_id = b.id
    WHERE b.status IN ('abandoned', 'cancelled')
      AND b.insured_email IS NOT NULL AND b.insured_email != ''
      AND COALESCE(m.max_touch, 0) < $1
      AND NOT EXISTS (SELECT 1 FROM unsubscribes u WHERE lower(u.email) = lower(b.insured_email))
      AND (m.last_sent_at IS NULL OR m.last_sent_at <= NOW() - ($2 || ' days')::interval)
    ORDER BY b.commission_amt DESC NULLS LAST
    LIMIT $3
  `, [MAX_TOUCHES, STEP_DAYS, LIMIT]);

  console.log(`[AbandonedBondRecovery] ${rows.length} touches due${DRY_RUN ? ' (DRY RUN)' : ''}`);
  let sent = 0;
  const seenEmails = new Set();

  for (const b of rows) {
    const key = b.insured_email.trim().toLowerCase();
    const nextTouch = b.touches_sent + 1; // 1-based
    if (seenEmails.has(key)) {
      console.log(`  - skip (already emailed this run): ${b.insured_email}`);
      continue;
    }
    seenEmails.add(key);

    const { subject, html, text } = buildEmail(b, nextTouch - 1);
    const kind = classify(b);
    const base = kind === 'cancelled' ? 'cancelled-bond-recovery' : 'abandoned-bond-recovery';
    const campaign = `${base}-touch${nextTouch}`;

    if (DRY_RUN) {
      console.log(`  [DRY] ${b.insured_name} <${b.insured_email}> | ${kind} | touch ${nextTouch} | comm $${b.commission_amt}`);
      sent++; continue;
    }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [b.insured_email.trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        Tags: [{ Name: 'campaign', Value: campaign }],
      }));
      await db.query(
        `INSERT INTO abandoned_bond_recovery_sends (bond_id, email, touch_number) VALUES ($1, $2, $3) ON CONFLICT (bond_id, touch_number) DO NOTHING`,
        [b.id, b.insured_email.trim(), nextTouch]
      );
      console.log(`  ✓ ${b.insured_name} <${b.insured_email}> | ${kind} | touch ${nextTouch}`);
      sent++;
    } catch (e) {
      console.error(`  ✗ ${b.insured_email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, RATE_MS));
  }

  await db.end();
  console.log(`[AbandonedBondRecovery] Done. ${sent}/${rows.length} ${DRY_RUN ? 'previewed' : 'sent'}.`);
}
main().catch(e => { console.error(e); process.exit(1); });
