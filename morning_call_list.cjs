#!/usr/bin/env node
/**
 * Morning Contractor Call List — emails Ted at 8am CDT with
 * all warm contractor leads from the last 48 hours, ranked by recency.
 *
 * Cron (M-F 8am CDT = 13:00 UTC):
 *   0 13 * * 1-5  cd /home/tsparks && SES_KEY=... SES_SECRET=... CRM_DB_PASS=... node morning_call_list.cjs >> /tmp/morning-calllist.log 2>&1
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const TO   = 'contact219@gmail.com';
const FROM = 'Quantum Surety CRM <ted@quantumsurety.bond>';

function formatPhone(p) {
  if (!p) return '—';
  const d = p.replace(/\D/g, '');
  if (d.length === 11 && d[0] === '1') return `(${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  return p;
}

function ageLabel(created) {
  const hrs = Math.round((Date.now() - new Date(created).getTime()) / 3600000);
  if (hrs < 2) return `${hrs}h ago 🔥`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs/24)}d ago`;
}

async function main() {
  const db = new Client({
    host: '192.168.4.122', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS || 'Qs2024Secure!',
  });
  await db.connect();

  // Warm contractor leads: form submitters (get-bond form) within 72 hours, all statuses
  const { rows: formLeads } = await db.query(`
    SELECT id, name, phone, email, bond_type, source, status, created_at
    FROM leads
    WHERE bond_type ILIKE '%contractor%'
      AND source ILIKE '%get-bond%'
      AND phone IS NOT NULL AND phone != ''
      AND created_at >= NOW() - INTERVAL '72 hours'
    ORDER BY created_at DESC
    LIMIT 30
  `);

  // High-value pipeline: contacted contractor leads that have NOT replied/sold (follow-up targets)
  const { rows: pipeLeads } = await db.query(`
    SELECT id, name, phone, email, bond_type, source, status, created_at, updated_at
    FROM leads
    WHERE bond_type ILIKE '%contractor%'
      AND status = 'contacted'
      AND phone IS NOT NULL AND phone != ''
      AND updated_at >= NOW() - INTERVAL '7 days'
      AND updated_at < NOW() - INTERVAL '1 day'
    ORDER BY updated_at DESC
    LIMIT 20
  `);

  // Today's TDLR monitor leads (fresh targets)
  const { rows: tdlrLeads } = await db.query(`
    SELECT id, name, phone, email, bond_type, source, status, created_at
    FROM leads
    WHERE source ILIKE '%TDLR%'
      AND status = 'new'
      AND phone IS NOT NULL AND phone != ''
      AND created_at >= NOW() - INTERVAL '24 hours'
    ORDER BY created_at DESC
    LIMIT 20
  `);

  await db.end();

  const totalWarm = formLeads.length + pipeLeads.length;
  const totalNew  = tdlrLeads.length;

  function renderRow(l, badge = '') {
    const phone = formatPhone(l.phone);
    const tel   = l.phone ? l.phone.replace(/\D/g,'') : '';
    return `<tr style="border-bottom:1px solid #e2e8f0">
      <td style="padding:10px 12px;font-weight:600;color:#0f172a">${l.name || '—'} ${badge}</td>
      <td style="padding:10px 12px">
        <a href="tel:+1${tel}" style="color:#f59e0b;font-weight:700;text-decoration:none">${phone}</a>
      </td>
      <td style="padding:10px 12px;color:#64748b;font-size:12px">${l.source || '—'}</td>
      <td style="padding:10px 12px;color:#94a3b8;font-size:12px">${ageLabel(l.created_at)}</td>
    </tr>`;
  }

  const formSection = formLeads.length > 0 ? `
    <h3 style="color:#0f172a;margin:24px 0 8px;font-size:15px">🔥 WARM — Get-Bond Form Submitters (${formLeads.length})</h3>
    <p style="color:#64748b;font-size:12px;margin:0 0 10px">These people filled out the form — highest intent. Call within 1 hour if possible.</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#fef3c7">
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#92400e">NAME</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#92400e">PHONE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#92400e">SOURCE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#92400e">AGE</th>
      </tr></thead>
      <tbody>${formLeads.map(l => renderRow(l, '<span style="font-size:10px;background:#fef3c7;color:#92400e;padding:1px 5px;border-radius:3px">FORM</span>')).join('')}</tbody>
    </table>` : '';

  const pipeSection = pipeLeads.length > 0 ? `
    <h3 style="color:#0f172a;margin:24px 0 8px;font-size:15px">📞 FOLLOW-UP — Contacted, No Response (${pipeLeads.length})</h3>
    <p style="color:#64748b;font-size:12px;margin:0 0 10px">Got our email, not yet sold. One call can close these.</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#f1f5f9">
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#475569">NAME</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#475569">PHONE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#475569">SOURCE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#475569">AGE</th>
      </tr></thead>
      <tbody>${pipeLeads.map(l => renderRow(l)).join('')}</tbody>
    </table>` : '';

  const tdlrSection = tdlrLeads.length > 0 ? `
    <h3 style="color:#0f172a;margin:24px 0 8px;font-size:15px">📋 FRESH TDLR — New Today (${tdlrLeads.length})</h3>
    <p style="color:#64748b;font-size:12px;margin:0 0 10px">Just issued licenses. Cold but compliant — a one-minute call can set them up before a competitor finds them.</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#f0fdf4">
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#166534">NAME</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#166534">PHONE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#166534">SOURCE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#166534">AGE</th>
      </tr></thead>
      <tbody>${tdlrLeads.map(l => renderRow(l)).join('')}</tbody>
    </table>` : '';

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#fff">
  <div style="background:#0f172a;border-radius:10px;padding:18px 24px;margin-bottom:20px;display:flex;align-items:center;gap:16px">
    <div>
      <p style="margin:0;color:#94a3b8;font-size:11px;letter-spacing:2px">QUANTUM SURETY — DAILY CALL LIST</p>
      <p style="margin:4px 0 0;color:#fff;font-size:22px;font-weight:800">${totalWarm} Warm · ${totalNew} Fresh TDLR</p>
      <p style="margin:4px 0 0;color:#64748b;font-size:12px">${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',timeZone:'America/Chicago'})}, 8:00 AM CDT</p>
    </div>
  </div>
  <p style="color:#475569;font-size:14px;margin:0 0 4px"><strong>Pitch:</strong> "Hi [name], this is Ted at Quantum Surety — I saw your TDLR contractor license requires a surety bond. We do same-day approvals, starting at $75/yr. Want me to pull a quote for you right now?"</p>
  <p style="color:#94a3b8;font-size:11px;margin:0 0 20px">Average sale: $75–$150 · Close rate target: 5% of calls = ~$375 per hour of calls</p>
  ${formSection}
  ${pipeSection}
  ${tdlrSection}
  ${totalWarm === 0 && totalNew === 0 ? '<p style="color:#64748b;text-align:center;padding:40px 0">No new leads in the last 72 hours.</p>' : ''}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="color:#94a3b8;font-size:11px;text-align:center">
    Quantum Surety CRM · <a href="http://192.168.4.122:8095" style="color:#f59e0b">Open CRM Dashboard</a> · Auto-sent 8am CDT
  </p>
</div>`;

  const text = `QUANTUM SURETY — MORNING CALL LIST\n${totalWarm} warm leads, ${totalNew} fresh TDLR\n\nPitch: "Hi [name], this is Ted at Quantum Surety — your TDLR contractor license requires a surety bond. Same-day, $75/yr. Want a quote?"\n\nView full list in CRM: http://192.168.4.122:8095`;

  const subject = `📞 Call List: ${totalWarm} warm + ${totalNew} TDLR contractor leads — ${new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}`;

  console.log(`[${new Date().toISOString()}] Sending call list: ${totalWarm} warm, ${totalNew} TDLR fresh`);

  if (totalWarm === 0 && totalNew === 0) {
    console.log('No leads to report. Skipping email.');
    return;
  }

  try {
    await ses.send(new SendEmailCommand({
      Source: FROM, Destination: { ToAddresses: [TO] },
      Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
    }));
    console.log('Sent call list email to', TO);
  } catch(e) {
    console.error('FAIL:', e.message);
    process.exit(1);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
