#!/usr/bin/env node
/**
 * saved_bond_recovery.cjs — recover abandoned RLI bond applications.
 *
 * Emails people with a 'saved' (incomplete) application in bk_bonds, nudging
 * them to finish checkout on mybondapp. One email per bond, ever (tracked in
 * saved_bond_recovery_sends). Skips unsubscribed addresses and anyone who
 * later completed a bond under the same name.
 *
 * Usage:
 *   node saved_bond_recovery.cjs --dry-run     preview
 *   node saved_bond_recovery.cjs               send (default cap 40/day)
 *   node saved_bond_recovery.cjs --limit 10
 *
 * Cron (9:30 AM CDT = 14:30 UTC, weekdays):
 *   30 14 * * 1-5  cd /root && NODE_PATH=/root/node_modules AWS_...=... node /opt/quantum-ops/saved_bond_recovery.cjs >> /tmp/saved-bond-recovery.log 2>&1
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

const RESUME_URLS = {
  notary:     'https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX',
  dealer_gdn: 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX',
};
const LABELS = { notary: 'Texas Notary Bond', dealer_gdn: 'Texas GDN Dealer Bond' };

function firstName(full) {
  const w = (full || '').trim().split(/\s+/)[0] || '';
  return /^[A-Za-z]{2,}$/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : 'there';
}

function buildEmail(b) {
  const name  = firstName(b.insured_name);
  const label = LABELS[b.bond_type] || 'Texas Surety Bond';
  const url   = RESUME_URLS[b.bond_type] || 'https://www.mybondapp.com/329034247';
  const isNotary = b.bond_type === 'notary';
  const subject = `Your ${label} application is saved — finish in 2 minutes`;
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">
<p>Hi ${name === 'there' ? 'there' : name},</p>
<p>You started a <strong>${label}</strong> application with us but didn't get to finish checkout. Good news: your application is saved, and picking it back up takes about 2 minutes.</p>
<p style="text-align:center;margin:28px 0;"><a href="${url}" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">Finish My Application &rarr;</a></p>
${isNotary
  ? `<p style="color:#475569;">Your bond certificate is emailed <strong>immediately</strong> after checkout — $50 for the full 4-year term, written by RLI Insurance (A+ rated), accepted statewide by the Texas SOS.</p>
<p style="color:#64748b;font-size:13px;">💡 <strong>Tip:</strong> add <strong>Errors &amp; Omissions coverage</strong> at checkout &mdash; your bond protects the public, E&amp;O protects <em>you</em>. A few dollars more per year; most Texas notaries add it.</p>`
  : `<p style="color:#475569;">Your bond certificate is emailed the <strong>same day</strong> — written by RLI Insurance (A+ rated) and accepted by TxDMV for your GDN license.</p>`}
<p style="color:#475569;">Hit a snag or have a question? Just reply, or call me directly — I'll walk you through it in a couple of minutes.</p>
<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:24px;">Theodore Sparks &middot; Quantum Surety LLC &middot; TDI License #3480229<br><a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> &middot; ted@quantumsurety.bond</p>
<p style="font-size:11px;color:#94a3b8;margin-top:10px;">Don't want these emails? <a href="https://quantumsurety.bond/api/unsubscribe?e=${encodeURIComponent(b.insured_email)}" style="color:#94a3b8;">Unsubscribe</a></p>
</div>`;
  const text = `Hi ${name},

You started a ${label} application but didn't finish checkout. Your application is saved — finishing takes about 2 minutes:

${url}

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

  await db.query(`CREATE TABLE IF NOT EXISTS saved_bond_recovery_sends (
    id SERIAL PRIMARY KEY,
    bond_id INTEGER NOT NULL UNIQUE REFERENCES bk_bonds(id),
    email TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
  )`);

  const { rows } = await db.query(`
    SELECT b.id, b.insured_name, b.insured_email, b.bond_type, b.premium, b.commission_amt
    FROM bk_bonds b
    WHERE b.status = 'saved'
      AND b.insured_email IS NOT NULL AND b.insured_email != ''
      AND NOT EXISTS (SELECT 1 FROM saved_bond_recovery_sends s WHERE s.bond_id = b.id)
      AND NOT EXISTS (SELECT 1 FROM unsubscribes u WHERE lower(u.email) = lower(b.insured_email))
      AND NOT EXISTS (
        SELECT 1 FROM bk_bonds done
        WHERE done.status = 'issued'
          AND lower(trim(done.insured_name)) = lower(trim(b.insured_name))
      )
    ORDER BY b.commission_amt DESC NULLS LAST
    LIMIT $1
  `, [LIMIT]);

  console.log(`[SavedBondRecovery] ${rows.length} recoverable applications${DRY_RUN ? ' (DRY RUN)' : ''}`);
  let sent = 0;
  const seenEmails = new Set();

  for (const b of rows) {
    const key = b.insured_email.trim().toLowerCase();
    if (seenEmails.has(key)) {
      console.log(`  - skip (already emailed this run): ${b.insured_email}`);
      if (!DRY_RUN) {
        await db.query(
          `INSERT INTO saved_bond_recovery_sends (bond_id, email) VALUES ($1, $2) ON CONFLICT (bond_id) DO NOTHING`,
          [b.id, b.insured_email.trim()]
        );
      }
      continue;
    }
    seenEmails.add(key);
    const { subject, html, text } = buildEmail(b);
    if (DRY_RUN) {
      console.log(`  [DRY] ${b.insured_name} <${b.insured_email}> | ${b.bond_type} | comm $${b.commission_amt}`);
      sent++; continue;
    }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [b.insured_email.trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        Tags: [{ Name: 'campaign', Value: 'saved-bond-recovery' }],
      }));
      await db.query(
        `INSERT INTO saved_bond_recovery_sends (bond_id, email) VALUES ($1, $2) ON CONFLICT (bond_id) DO NOTHING`,
        [b.id, b.insured_email.trim()]
      );
      console.log(`  ✓ ${b.insured_name} <${b.insured_email}> | ${b.bond_type}`);
      sent++;
    } catch (e) {
      console.error(`  ✗ ${b.insured_email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, RATE_MS));
  }

  await db.end();
  console.log(`[SavedBondRecovery] Done. ${sent}/${rows.length} ${DRY_RUN ? 'previewed' : 'sent'}.`);
}
main().catch(e => { console.error(e); process.exit(1); });
