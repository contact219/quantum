#!/usr/bin/env node
/**
 * voice_conversion_report.cjs — does the outbound AI sales call actually convert?
 *
 * The voice channel is historically 0-for-281. Now that outbound calls are
 * scoped to high-value bond leads (notary excluded), this measures whether that
 * changes anything. It joins the call queue (MariaDB, local on the voice-agent
 * VPS) against CRM sales (leads + bk_bonds on the CRM Postgres, 130.51.22.226)
 * by normalized phone / email / name, and emails a weekly report.
 *
 * Correlation, not strict attribution: "of the people we dialed, how many later
 * bought?" — enough to decide whether the channel earns its keep.
 *
 * Runs on 130.51.23.147 (local MariaDB + network access to CRM PG:5433).
 * Cron: Mondays 8:15 AM CDT. Env: DB_PASS (MariaDB), CRM_DB_PASSWORD, SES_KEY,
 * SES_SECRET, optional REPORT_TO (comma-separated).
 */
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: 'us-east-2', credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET } });
const REPORT_TO = (process.env.REPORT_TO || 'contact219@gmail.com').split(',').map(s => s.trim());
const FROM = 'Quantum Surety Metrics <alerts@quantumsurety.bond>';
const DRY_RUN = process.argv.includes('--dry-run');

const last10 = p => String(p || '').replace(/\D/g, '').slice(-10);
const normName = n => String(n || '').toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();

async function main() {
  // 1. Who we dialed (local MariaDB). done|failed = actually attempted; cancelled = never dialed.
  const my = await mysql.createConnection({ host: '127.0.0.1', user: 'bondverify', password: process.env.DB_PASS, database: 'bondverify' });
  const [calls] = await my.execute(`SELECT phone, name, email, bond_type, status, created_at FROM outbound_call_queue`);
  await my.end();

  const byStatus = {};
  for (const c of calls) byStatus[c.status] = (byStatus[c.status] || 0) + 1;
  const dialed = calls.filter(c => c.status === 'done' || c.status === 'failed');
  // Dedupe dialed people by phone
  const dialedPeople = new Map();
  for (const c of dialed) { const k = last10(c.phone); if (k) dialedPeople.set(k, c); }

  // 2. CRM sales (remote Postgres)
  const pg = new Client({ host: '130.51.22.226', port: 5433, database: 'quantum_surety', user: 'quantum_user', password: process.env.CRM_DB_PASSWORD });
  await pg.connect();
  const { rows: soldLeads } = await pg.query(`SELECT name, email, phone, bond_type, COALESCE(sale_amount,0) AS sale_amount FROM leads WHERE status='sold'`);
  const { rows: issuedBonds } = await pg.query(`SELECT insured_name, insured_email, COALESCE(commission_amt,0) AS commission_amt FROM bk_bonds WHERE status='issued'`);
  await pg.end();

  const soldPhone = new Map(), soldEmail = new Map(), issuedEmail = new Map(), issuedName = new Map();
  for (const s of soldLeads) { const p = last10(s.phone); if (p) soldPhone.set(p, s); if (s.email) soldEmail.set(s.email.toLowerCase(), s); }
  for (const b of issuedBonds) { if (b.insured_email) issuedEmail.set(b.insured_email.toLowerCase(), b); const n = normName(b.insured_name); if (n) issuedName.set(n, b); }

  // 3. Reconcile: a dialed person converted if they match a sold lead or issued bond by any key.
  const converted = [];
  for (const [phone, c] of dialedPeople) {
    const email = (c.email || '').toLowerCase();
    const name = normName(c.name);
    const hit = soldPhone.get(phone) || (email && (soldEmail.get(email) || issuedEmail.get(email))) || (name && issuedName.get(name));
    if (hit) {
      const revenue = Number(hit.sale_amount ?? hit.commission_amt ?? 0);
      converted.push({ name: c.name, phone, bond_type: c.bond_type, revenue });
    }
  }

  // 4. Break down dialed + converted by bond_type
  const byType = {};
  for (const [, c] of dialedPeople) { const t = (c.bond_type || 'unknown').toLowerCase(); byType[t] = byType[t] || { dialed: 0, converted: 0, revenue: 0 }; byType[t].dialed++; }
  for (const c of converted) { const t = (c.bond_type || 'unknown').toLowerCase(); byType[t] = byType[t] || { dialed: 0, converted: 0, revenue: 0 }; byType[t].converted++; byType[t].revenue += c.revenue; }

  const totalDialed = dialedPeople.size;
  const totalConv = converted.length;
  const totalRev = converted.reduce((s, c) => s + c.revenue, 0);
  const rate = totalDialed ? (100 * totalConv / totalDialed).toFixed(1) : '0.0';

  const rows = Object.entries(byType).sort((a, b) => b[1].dialed - a[1].dialed)
    .map(([t, v]) => `<tr><td>${t}</td><td style="text-align:right">${v.dialed}</td><td style="text-align:right">${v.converted}</td><td style="text-align:right">$${v.revenue.toFixed(2)}</td></tr>`).join('');

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:640px;margin:0 auto;color:#1e293b">
<h2 style="color:#0f172a">Voice Outbound Conversion — Weekly</h2>
<p style="color:#475569">Of the distinct people we placed an outbound AI call to (dialed = done + failed), how many later show up as a sold lead or issued bond in the CRM. Correlation, not strict attribution.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px;margin:16px 0">
<tr><td><strong>Distinct people dialed</strong></td><td style="text-align:right"><strong>${totalDialed}</strong></td></tr>
<tr><td>Converted (sold lead / issued bond)</td><td style="text-align:right">${totalConv}</td></tr>
<tr><td>Conversion rate</td><td style="text-align:right">${rate}%</td></tr>
<tr><td>Revenue (from converted)</td><td style="text-align:right">$${totalRev.toFixed(2)}</td></tr>
</table>
<p style="color:#64748b;font-size:13px">Call queue by status: ${Object.entries(byStatus).map(([s, n]) => `${s} ${n}`).join(' · ')}</p>
<h3 style="color:#0f172a;font-size:15px;margin-top:20px">By bond type</h3>
<table style="border-collapse:collapse;width:100%;font-size:13px">
<tr style="color:#64748b"><th style="text-align:left">Type</th><th style="text-align:right">Dialed</th><th style="text-align:right">Converted</th><th style="text-align:right">Revenue</th></tr>
${rows}
</table>
${converted.length ? `<h3 style="color:#0f172a;font-size:15px;margin-top:20px">Converted</h3><ul style="font-size:13px;color:#475569">${converted.map(c => `<li>${c.name} (${c.bond_type}) — $${c.revenue.toFixed(2)}</li>`).join('')}</ul>` : '<p style="color:#94a3b8;font-size:13px">No conversions in this cohort yet.</p>'}
<p style="color:#94a3b8;font-size:12px;margin-top:20px">Context: the voice channel is 0-for-281 all-time. Calls are now scoped to high-value bond leads only; new calls will accumulate here as they happen. This cohort is dominated by pre-fix bulk dealer calls until new scoped calls build up.</p>
</div>`;

  const summary = `[VoiceConversion] dialed=${totalDialed} converted=${totalConv} (${rate}%) revenue=$${totalRev.toFixed(2)} | queue: ${Object.entries(byStatus).map(([s, n]) => `${s}=${n}`).join(' ')}`;
  console.log(summary);
  converted.forEach(c => console.log(`  ✓ converted: ${c.name} (${c.bond_type}) $${c.revenue.toFixed(2)}`));

  if (DRY_RUN) { console.log('(dry-run — no email sent)'); return; }
  await ses.send(new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: REPORT_TO },
    Message: { Subject: { Data: `Voice conversion: ${totalConv}/${totalDialed} dialed → $${totalRev.toFixed(2)}` }, Body: { Html: { Data: html } } },
  }));
  console.log(`Report emailed to ${REPORT_TO.join(', ')}`);
}
main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
