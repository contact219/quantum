#!/usr/bin/env node
/**
 * abandoned_bond_recovery.cjs — recover RLI bonds stuck in "Abandoned" status.
 *
 * Two distinct situations, two messages:
 *   - Real bond number (MBS...) = an existing customer's RENEWAL stalled after
 *     RLI staff created the rider on their behalf. Framing: "your renewal is
 *     one step from done."
 *   - "ABANDON-" synthetic key = a fresh application that never finished.
 *     Framing: "you started an application that didn't get completed."
 *
 * One email per bond, ever (tracked in abandoned_bond_recovery_sends). Skips
 * unsubscribed addresses. Dedupes by email within a single run.
 *
 * Usage:
 *   node abandoned_bond_recovery.cjs --dry-run
 *   node abandoned_bond_recovery.cjs
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const DRY_RUN = process.argv.includes('--dry-run');
const LIM_IDX = process.argv.indexOf('--limit');
const LIMIT   = LIM_IDX >= 0 ? parseInt(process.argv[LIM_IDX + 1]) : 40;
const RATE_MS = 200;

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET,
  },
});

const FROM     = 'Theodore Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const RESUME_URL = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX';

function firstName(full) {
  const w = (full || '').trim().split(/\s+/)[0] || '';
  return /^[A-Za-z]{2,}$/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : 'there';
}

function buildEmail(b) {
  const name = firstName(b.insured_name);
  const isRenewal = !b.bond_number.startsWith('ABANDON-');
  const subject = isRenewal
    ? 'Your Texas Notary Bond renewal is almost done — one step left'
    : 'Your Texas Notary Bond application — let\'s finish it';

  const introRenewal = `You have an active Texas Notary Bond with us, and we started processing your renewal — but it never got finished on our end. Nothing was your fault; this happens when a renewal sits without the last details confirmed.`;
  const introFresh = `You started a Texas Notary Bond application with us but it didn't get completed. Your info is saved — picking it back up takes about 2 minutes.`;

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">
<p>Hi ${name === 'there' ? 'there' : name},</p>
<p>${isRenewal ? introRenewal : introFresh}</p>
<p style="text-align:center;margin:28px 0;"><a href="${RESUME_URL}" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">Finish My Bond &rarr;</a></p>
<p style="color:#475569;">Your bond certificate is emailed immediately after checkout &mdash; written by RLI Insurance (A+ rated), accepted statewide by the Texas SOS.</p>
<p style="color:#64748b;font-size:13px;">💡 <strong>Tip:</strong> add <strong>Errors &amp; Omissions coverage</strong> at checkout &mdash; your bond protects the public, E&amp;O protects <em>you</em>. A few dollars more per year; most Texas notaries add it.</p>
<p style="color:#475569;">Questions, or would rather do this over the phone? Just reply, or call me directly &mdash; happy to walk through it with you.</p>
<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:24px;">Theodore Sparks &middot; Quantum Surety LLC &middot; TDI License #3480229<br><a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> &middot; ted@quantumsurety.bond</p>
<p style="font-size:11px;color:#94a3b8;margin-top:10px;">Don't want these emails? <a href="https://quantumsurety.bond/api/unsubscribe?e=${encodeURIComponent(b.insured_email)}" style="color:#94a3b8;">Unsubscribe</a></p>
</div>`;

  const text = `Hi ${name},

${isRenewal ? introRenewal : introFresh}

Finish here (takes about 2 minutes): ${RESUME_URL}

Questions? Reply to this email or call (214) 666-8718.

Theodore Sparks -- Quantum Surety LLC -- TDI #3480229`;

  return { subject, html, text };
}

async function main() {
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();

  await db.query(`CREATE TABLE IF NOT EXISTS abandoned_bond_recovery_sends (
    id SERIAL PRIMARY KEY,
    bond_id INTEGER NOT NULL UNIQUE REFERENCES bk_bonds(id),
    email TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
  )`);

  const { rows } = await db.query(`
    SELECT b.id, b.bond_number, b.insured_name, b.insured_email, b.premium, b.commission_amt
    FROM bk_bonds b
    WHERE b.status = 'abandoned'
      AND b.insured_email IS NOT NULL AND b.insured_email != ''
      AND NOT EXISTS (SELECT 1 FROM abandoned_bond_recovery_sends s WHERE s.bond_id = b.id)
      AND NOT EXISTS (SELECT 1 FROM unsubscribes u WHERE lower(u.email) = lower(b.insured_email))
    ORDER BY b.commission_amt DESC NULLS LAST
    LIMIT $1
  `, [LIMIT]);

  console.log(`[AbandonedBondRecovery] ${rows.length} recoverable bonds${DRY_RUN ? ' (DRY RUN)' : ''}`);
  let sent = 0;
  const seenEmails = new Set();

  for (const b of rows) {
    const key = b.insured_email.trim().toLowerCase();
    if (seenEmails.has(key)) {
      console.log(`  - skip (already emailed this run): ${b.insured_email}`);
      if (!DRY_RUN) {
        await db.query(
          `INSERT INTO abandoned_bond_recovery_sends (bond_id, email) VALUES ($1, $2) ON CONFLICT (bond_id) DO NOTHING`,
          [b.id, b.insured_email.trim()]
        );
      }
      continue;
    }
    seenEmails.add(key);

    const { subject, html, text } = buildEmail(b);
    const isRenewal = !b.bond_number.startsWith('ABANDON-');

    if (DRY_RUN) {
      console.log(`  [DRY] ${b.insured_name} <${b.insured_email}> | ${isRenewal ? 'renewal' : 'fresh'} | comm $${b.commission_amt}`);
      sent++; continue;
    }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [b.insured_email.trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        Tags: [{ Name: 'campaign', Value: 'abandoned-bond-recovery' }],
      }));
      await db.query(
        `INSERT INTO abandoned_bond_recovery_sends (bond_id, email) VALUES ($1, $2) ON CONFLICT (bond_id) DO NOTHING`,
        [b.id, b.insured_email.trim()]
      );
      console.log(`  ✓ ${b.insured_name} <${b.insured_email}> | ${isRenewal ? 'renewal' : 'fresh'}`);
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
