#!/usr/bin/env node
/**
 * Morning Call List — emails Ted at 8am CDT with inbound leads worth a phone call.
 *
 * Rescoped 2026-07-21: was contractor/TDLR-only, a channel retired 2026-07-01, so it
 * returned zero every day. Now scoped to INBOUND leads across all bond types — people
 * who came to us via the get-bond form, the voice agent, renewal pages, or a partner.
 * Cold/scraped sources (hub_blast, GDN blasts, bid monitors) are excluded on purpose:
 * cold outreach has never converted and does not belong on a call list.
 *
 * Amended 2026-08-22: TDLR Renewal Target is readmitted, but ONLY as its own section and
 * ONLY inside an expiry window. The 07-21 exclusion was about cold prospecting, and a
 * licence that dies in three days is not that -- the prospect already has the deadline and
 * the bond is a renewal prerequisite. These rows carry "License expires: YYYY-MM-DD" in
 * notes, so this section sorts by days-to-expiry ascending instead of by recency. The
 * INBOUND filter below is untouched: nothing excluded on 07-21 re-enters the two original
 * sections.
 *
 * Cron (M-F 8am CDT = 13:00 UTC):
 *   0 13 * * 1-5  cd /root && SES_KEY=... SES_SECRET=... CRM_DB_PASS=... node morning_call_list.cjs >> /tmp/morning-calllist.log 2>&1
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

// All operator reporting goes to both the personal inbox and the company address.
const TO   = ['contact219@gmail.com', 'administrator@quantumsurety.bond'];
const FROM = 'Quantum Surety CRM <ted@quantumsurety.bond>';

// Sources that mean "this person contacted us", not "we scraped them".
const INBOUND = `(
  source IN ('get-bond form','voice-agent','renew-page','title-bond-calculator','partner-referral')
  OR source ILIKE 'county-title-bond%'
)`;

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

// TDLR renewal window: from 14 days lapsed (they may still be fixing it) out to 30 days.
const EXPIRY_LAPSED_DAYS = 14;
const EXPIRY_AHEAD_DAYS  = 30;

function daysToExpiry(expires) {
  const d = new Date(String(expires).slice(0, 10) + 'T00:00:00Z');
  const today = new Date();
  const utcToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((d.getTime() - utcToday) / 86400000);
}

function expiryLabel(expires) {
  const n = daysToExpiry(expires);
  if (n < 0)   return 'LAPSED ' + (-n) + 'd';
  if (n === 0) return 'EXPIRES TODAY';
  if (n === 1) return 'expires tomorrow';
  return n + ' days';
}

async function main() {
  const db = new Client({
    host: '127.0.0.1', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASS,
  });
  await db.connect();

  // NEW — inbound, never contacted. Highest intent, zero touches. Call first.
  // DISTINCT ON collapses duplicate lead rows for the same phone number.
  const { rows: newLeads } = await db.query(`
    SELECT DISTINCT ON (regexp_replace(phone, '\\D', '', 'g'))
           id, name, phone, email, bond_type, source, status, created_at
    FROM leads
    WHERE ${INBOUND}
      AND status = 'new'
      AND phone IS NOT NULL AND phone != ''
      AND created_at >= NOW() - INTERVAL '14 days'
    ORDER BY regexp_replace(phone, '\\D', '', 'g'), created_at DESC
    LIMIT 25
  `);

  // FOLLOW-UP — inbound, emailed, never replied, not sold. Email is exhausted; needs a voice.
  const { rows: pipeLeads } = await db.query(`
    SELECT DISTINCT ON (regexp_replace(phone, '\\D', '', 'g'))
           id, name, phone, email, bond_type, source, status, created_at, updated_at
    FROM leads
    WHERE ${INBOUND}
      AND status = 'contacted'
      AND phone IS NOT NULL AND phone != ''
      AND updated_at >= NOW() - INTERVAL '21 days'
      AND updated_at < NOW() - INTERVAL '24 hours'
    ORDER BY regexp_replace(phone, '\\D', '', 'g'), updated_at DESC
    LIMIT 25
  `);

  // EXPIRING section DISABLED 2026-09-26. It listed TDLR licensees near expiry on the premise
  // that "the bond is a prerequisite for renewal". It is not: TDLR (A/C, electrical) and TSBPE
  // (plumbing) licenses require liability insurance, not a surety bond (tdlr.texas.gov,
  // tsbpe.texas.gov), so every call sold a bond the contractor does not need. The query that
  // filled this section is in git history (and morning_call_list.cjs.bak-20260926) if a real,
  // bond-requiring renewal source ever replaces it.
  const EXPIRES_RE = 'License expires:[ ]*(\d{4}-\d{2}-\d{2})';
  const expiringLeads = [];

  await db.end();

  // A lead can only appear once across both sections.
  const newIds = new Set(newLeads.map(l => l.id));
  const pipe   = pipeLeads.filter(l => !newIds.has(l.id));

  // A phone number can only appear once across all three sections.
  const claimed = new Set([...newLeads, ...pipe].map(l => (l.phone || '').replace(/\D/g, '')));
  const expiring = expiringLeads.filter(l => !claimed.has((l.phone || '').replace(/\D/g, '')));

  const totalNew  = newLeads.length;
  const totalWarm = pipe.length;
  const totalExp  = expiring.length;

  function renderRow(l) {
    const phone = formatPhone(l.phone);
    const tel   = l.phone ? l.phone.replace(/\D/g,'') : '';
    return `<tr style="border-bottom:1px solid #e2e8f0">
      <td style="padding:10px 12px;font-weight:600;color:#0f172a">${l.name || '—'}</td>
      <td style="padding:10px 12px">
        <a href="tel:+1${tel}" style="color:#f59e0b;font-weight:700;text-decoration:none">${phone}</a>
      </td>
      <td style="padding:10px 12px;color:#475569;font-size:12px">${l.bond_type || '—'}</td>
      <td style="padding:10px 12px;color:#64748b;font-size:12px">${l.source || '—'}</td>
      <td style="padding:10px 12px;color:#94a3b8;font-size:12px">${ageLabel(l.created_at)}</td>
    </tr>`;
  }

  const head = (color, bg) => `<thead><tr style="background:${bg}">
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:${color}">NAME</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:${color}">PHONE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:${color}">BOND</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:${color}">SOURCE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:${color}">AGE</th>
      </tr></thead>`;

  const newSection = newLeads.length > 0 ? `
    <h3 style="color:#0f172a;margin:24px 0 8px;font-size:15px">🔥 UNCALLED — Inbound, Never Contacted (${newLeads.length})</h3>
    <p style="color:#64748b;font-size:12px;margin:0 0 10px">They came to us and nobody has spoken to them yet. Highest intent on the board — call these first.</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      ${head('#92400e','#fef3c7')}
      <tbody>${newLeads.map(renderRow).join('')}</tbody>
    </table>` : '';

  const pipeSection = pipe.length > 0 ? `
    <h3 style="color:#0f172a;margin:24px 0 8px;font-size:15px">📞 EMAIL EXHAUSTED — Contacted, No Reply (${pipe.length})</h3>
    <p style="color:#64748b;font-size:12px;margin:0 0 10px">Inbound leads who got the auto-followup and the second touch and still haven't converted. Email has done all it can; one call closes these or clears them out.</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      ${head('#475569','#f1f5f9')}
      <tbody>${pipe.map(renderRow).join('')}</tbody>
    </table>` : '';

  function renderExpiryRow(l) {
    const phone = formatPhone(l.phone);
    const tel   = l.phone ? l.phone.replace(/\D/g,'') : '';
    const n     = daysToExpiry(l.expires_str);
    const hot   = n <= 2;
    return `<tr style="border-bottom:1px solid #e2e8f0">
      <td style="padding:10px 12px;font-weight:600;color:#0f172a">${l.name || '—'}</td>
      <td style="padding:10px 12px">
        <a href="tel:+1${tel}" style="color:#f59e0b;font-weight:700;text-decoration:none">${phone}</a>
      </td>
      <td style="padding:10px 12px;color:#475569;font-size:12px">${l.county || '—'}</td>
      <td style="padding:10px 12px;color:#64748b;font-size:12px">${l.expires_str}</td>
      <td style="padding:10px 12px;font-size:12px;font-weight:${hot ? '700' : '400'};color:${hot ? '#b91c1c' : '#94a3b8'}">${expiryLabel(l.expires_str)}</td>
    </tr>`;
  }

  const expiryHead = `<thead><tr style="background:#fee2e2">
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#991b1b">NAME</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#991b1b">PHONE</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#991b1b">COUNTY</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#991b1b">EXPIRES</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;color:#991b1b">URGENCY</th>
      </tr></thead>`;

  const expirySection = expiring.length > 0 ? `
    <h3 style="color:#0f172a;margin:24px 0 8px;font-size:15px">⏳ LICENCE EXPIRING — TDLR Renewals (${expiring.length})</h3>
    <p style="color:#64748b;font-size:12px;margin:0 0 10px">Sorted by how soon the licence dies. They cannot renew without the bond, so the deadline does the selling — lead with the date, not the pitch.</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      ${expiryHead}
      <tbody>${expiring.map(renderExpiryRow).join('')}</tbody>
    </table>` : '';

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#fff">
  <div style="background:#0f172a;border-radius:10px;padding:18px 24px;margin-bottom:20px">
    <p style="margin:0;color:#94a3b8;font-size:11px;letter-spacing:2px">QUANTUM SURETY — DAILY CALL LIST</p>
    <p style="margin:4px 0 0;color:#fff;font-size:22px;font-weight:800">${totalNew} Uncalled · ${totalWarm} Follow-Up · ${totalExp} Expiring</p>
    <p style="margin:4px 0 0;color:#64748b;font-size:12px">${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',timeZone:'America/Chicago'})}, 8:00 AM CDT</p>
  </div>
  <p style="color:#475569;font-size:14px;margin:0 0 4px"><strong>Pitch:</strong> "Hi [name], this is Ted at Quantum Surety — you reached out to us about a bond. I can get it issued today and email you the certificate in about a minute. Want me to take care of it while I have you?"</p>
  <p style="color:#94a3b8;font-size:11px;margin:0 0 20px">Notary ≈ $50 for the full 4-year term · Dealer (GDN) from $100/yr · Same-day issue, RLI A+ rated</p>
  ${expirySection}
  ${newSection}
  ${pipeSection}
  ${totalNew === 0 && totalWarm === 0 && totalExp === 0 ? '<p style="color:#64748b;text-align:center;padding:40px 0">No leads awaiting a call. Nothing to work today.</p>' : ''}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="color:#94a3b8;font-size:11px;text-align:center">
    Quantum Surety CRM · <a href="https://quantumcrm.bond" style="color:#f59e0b">Open CRM Dashboard</a> · Auto-sent 8am CDT
  </p>
</div>`;

  const lines = [
    ...expiring.map(l => `  [EXPIRING] ${l.name || '—'} · ${formatPhone(l.phone)} · ${l.county || '—'} · ${expiryLabel(l.expires_str)}`),
    ...[...newLeads, ...pipe].map(l => `  ${l.name || '—'} · ${formatPhone(l.phone)} · ${l.bond_type || '—'} · ${ageLabel(l.created_at)}`),
  ].join('\n');

  const text = `QUANTUM SURETY — MORNING CALL LIST
${totalNew} uncalled inbound, ${totalWarm} awaiting follow-up, ${totalExp} licence expiring

Pitch: "Hi [name], this is Ted at Quantum Surety — you reached out about a bond. I can get it issued today and email the certificate in about a minute."

${lines || '  (nothing to work today)'}

View full list in CRM: https://quantumcrm.bond`;

  const expUrgent = expiring.filter(l => daysToExpiry(l.expires_str) <= 2).length;
  const subject = `📞 Call List: ${totalNew} uncalled + ${totalWarm} follow-up + ${totalExp} expiring${expUrgent ? ` (${expUrgent} critical)` : ''} — ${new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}`;

  console.log(`[${new Date().toISOString()}] Sending call list: ${totalNew} uncalled, ${totalWarm} follow-up, ${totalExp} expiring`);

  if (totalNew === 0 && totalWarm === 0 && totalExp === 0) {
    console.log('No leads to report. Skipping email.');
    return;
  }

  await ses.send(new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: TO },
    Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
  }));
  console.log('Call list sent.');
}

main().catch(e => { console.error(e); process.exit(1); });
