#!/usr/bin/env node
/**
 * second_touch_reconcile.cjs — did the inbound second-touch convert?
 *
 * Of the leads emailed by inbound_second_touch.cjs (tracked in
 * inbound_second_touch_sends), how many are now marked sold or have a matching
 * issued RLI bond in bk_bonds. Read-only; emails the result. Runs on the CRM
 * VPS (leads + bk_bonds live in the same Postgres — no cross-DB needed).
 *
 * Usage: node second_touch_reconcile.cjs [--dry-run]
 * Env: CRM_DB_PASSWORD, SES_KEY/SES_SECRET (or AWS_*), optional REPORT_TO.
 */
const { Client } = require('pg');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: 'us-east-2', credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET } });
const REPORT_TO = (process.env.REPORT_TO || 'contact219@gmail.com').split(',').map(s => s.trim());
const FROM = 'Quantum Surety Metrics <alerts@quantumsurety.bond>';
const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  const db = new Client({ host: 'localhost', port: 5433, database: 'quantum_surety', user: 'quantum_user', password: process.env.CRM_DB_PASSWORD });
  await db.connect();
  const { rows } = await db.query(`
    WITH recips AS (
      SELECT s.lead_id, s.sent_at, l.name, l.email, l.status,
             -- normalize: non-alpha -> space, collapse whitespace, trim (so trailing
             -- spaces / punctuation don't defeat the name match against bonds)
             trim(regexp_replace(regexp_replace(lower(l.name),'[^a-z ]',' ','g'),'\\s+',' ','g')) AS nname
      FROM inbound_second_touch_sends s JOIN leads l ON l.id = s.lead_id
    )
    SELECT r.name, r.email, r.status, r.sent_at::date AS sent_on,
      b.commission_amt AS bond_comm, b.effective_date AS bond_effective,
      -- a NEW conversion = matching issued bond whose term starts on/after the day
      -- we sent the second-touch (i.e. they got bonded after the nudge, not before).
      (b.effective_date IS NOT NULL AND b.effective_date >= r.sent_at::date) AS new_conversion
    FROM recips r
    LEFT JOIN LATERAL (
      SELECT commission_amt, effective_date FROM bk_bonds b
      WHERE b.status='issued' AND r.nname <> ''
        AND trim(regexp_replace(regexp_replace(lower(b.insured_name),'[^a-z ]',' ','g'),'\\s+',' ','g')) = r.nname
      ORDER BY effective_date DESC NULLS LAST LIMIT 1
    ) b ON true
    ORDER BY r.name
  `);
  await db.end();

  const withConv = rows.map(r => {
    const hasBond = r.bond_effective != null;
    const isNew = r.new_conversion === true;          // bond effective on/after send
    const preExisting = hasBond && !isNew;             // had a bond before the nudge
    const revenue = isNew ? Number(r.bond_comm || 0) : 0;
    return { ...r, isNew, preExisting, revenue };
  });

  const converted = withConv.filter(r => r.isNew);
  const preExisting = withConv.filter(r => r.preExisting);
  const total = withConv.length;
  const uniqueEmails = new Set(withConv.map(r => (r.email || '').toLowerCase())).size;
  const revenue = converted.reduce((s, r) => s + r.revenue, 0);
  const rate = total ? (100 * converted.length / total).toFixed(1) : '0.0';

  const summary = `[SecondTouchReconcile] cohort=${total} (unique emails ${uniqueEmails}) | NEW conversions (bond on/after send)=${converted.length} (${rate}%) revenue=$${revenue.toFixed(2)} | pre-existing excluded=${preExisting.length}`;
  console.log(summary);
  converted.forEach(c => console.log(`  ✓ NEW: ${c.name} — bond effective ${new Date(c.bond_effective).toISOString().slice(0, 10)} — $${c.revenue.toFixed(2)}`));
  preExisting.forEach(c => console.log(`  · pre-existing (excluded): ${c.name} — bond effective ${new Date(c.bond_effective).toISOString().slice(0, 10)}`));

  const convRows = converted.length
    ? converted.map(c => `<tr><td>${c.name}</td><td>${new Date(c.bond_effective).toISOString().slice(0, 10)}</td><td style="text-align:right">$${c.revenue.toFixed(2)}</td></tr>`).join('')
    : `<tr><td colspan="3" style="color:#94a3b8">No new conversions attributable to the campaign yet.</td></tr>`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
<h2 style="color:#0f172a">Inbound Second-Touch — Conversion Recheck</h2>
<p style="color:#475569">Of the leads emailed by the second-touch campaign (sent 2026-07-07), how many got bonded <em>after</em> the nudge — i.e. a matching issued RLI bond whose term starts on/after the send date. Conversions that predate the campaign are excluded so this reflects only campaign-attributable sales.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px;margin:12px 0">
<tr><td><strong>Cohort</strong></td><td style="text-align:right">${total} lead records (${uniqueEmails} unique emails)</td></tr>
<tr><td><strong>New conversions (bond on/after send)</strong></td><td style="text-align:right"><strong>${converted.length} (${rate}%)</strong></td></tr>
<tr><td>Revenue (new)</td><td style="text-align:right">$${revenue.toFixed(2)}</td></tr>
<tr><td>Pre-existing bonds (excluded)</td><td style="text-align:right">${preExisting.length}</td></tr>
</table>
<table style="border-collapse:collapse;width:100%;font-size:13px">
<tr style="color:#64748b"><th style="text-align:left">New conversion</th><th style="text-align:left">Bond effective</th><th style="text-align:right">Revenue</th></tr>
${convRows}
</table>
<p style="color:#94a3b8;font-size:12px;margin-top:16px">Still correlation, not proof — a post-send bond could also be a coincidental self-serve purchase. But excluding pre-dated bonds removes the biggest false signal. Baseline: inbound get-bond form is the only channel that converts.</p>
</div>`;

  if (DRY_RUN) { console.log('(dry-run — no email sent)'); return; }
  await ses.send(new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: REPORT_TO },
    Message: { Subject: { Data: `Second-touch recheck: ${converted.length}/${total} converted → $${revenue.toFixed(2)}` }, Body: { Html: { Data: html } } },
  }));
  console.log(`Report emailed to ${REPORT_TO.join(', ')}`);
}
main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
