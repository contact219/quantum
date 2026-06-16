#!/usr/bin/env node
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const leads = [
  { name: 'Maria Elvira Trevino',      email: 'trevinoinsurance23@gmail.com',  phone: '195-689-0038',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '8:08 PM' },
  { name: 'Mechell Favors',            email: 'hefavorsme2@yahoo.com',          phone: '214-356-7262',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '7:39 PM' },
  { name: 'Samantha Cantu',            email: 'samantha@apc-law.com',           phone: '195-620-3655',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '3:53 PM' },
  { name: 'Nancy Zapata-Meandro',      email: 'nrzrealestate@sbcglobal.net',    phone: '830-591-3958',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '3:32 PM' },
  { name: 'Voice Caller +14324664170', email: '+1 (432) 466-4170',              phone: '+14324664170',  bond: 'Texas Notary Bond', source: 'voice-inbound', time: '1:12 PM' },
  { name: 'Dale Evers',                email: 'dale.evers@yahoo.com',           phone: '254-722-2157',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '1:08 PM' },
  { name: 'Voice Caller +14142439422', email: '+1 (414) 243-9422',              phone: '+14142439422',  bond: 'Texas Notary Bond', source: 'voice-inbound', time: '11:54 AM' },
  { name: 'Karla Nix',                 email: 'nixkarla@yahoo.com',             phone: '432-466-4170',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '11:48 AM' },
  { name: 'Vivian Carranza',           email: 'vivianm330@sbcglobal.net',       phone: '832-563-2557',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '11:00 AM' },
  { name: 'Ramona Norris',             email: 'ramona.norris@yahoo.com',        phone: '512-810-3949',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '9:36 AM' },
  { name: 'PATRICIA RODRIGUEZ',        email: 'par1211@yahoo.com',              phone: '143-277-0356',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '9:32 AM' },
  { name: 'BERNADINE ORTIZ',           email: 'dinaortiz80@yahoo.com',          phone: '361-660-0456',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '9:24 AM' },
  { name: 'Imelda Duran',              email: 'imeyduran@ymail.com',            phone: '713-245-6579',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '9:23 AM' },
  { name: 'Priscilla Granado Rubio',   email: 'priscillamnz2020@icloud.com',   phone: '432-307-8847',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '8:53 AM' },
  { name: 'Amanda Garcia',             email: 'amanda.garcia@mhshealth.com',   phone: '210-838-6015',  bond: 'Texas Notary Bond', source: 'get-bond form', time: '8:38 AM' },
];

const total      = leads.length;
const notary     = leads.filter(l => l.bond.includes('Notary')).length;
const contractor = leads.filter(l => l.bond.includes('Contractor')).length;
const voice      = leads.filter(l => l.source === 'voice-inbound').length;
const form       = leads.filter(l => l.source === 'get-bond form').length;
const pipeline   = leads.filter(l => l.source === 'auto-pipeline').length;

function sourceBadge(s) {
  if (s === 'voice-inbound') return `<span style="background:#fce7f3;color:#9d174d;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700">📞 VOICE</span>`;
  if (s === 'auto-pipeline') return `<span style="background:#ede9fe;color:#5b21b6;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700">🤖 PIPELINE</span>`;
  return `<span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700">WEB</span>`;
}

function bondBadge(b) {
  if (b.includes('Contractor')) return `<span style="color:#92400e;font-size:12px">Contractor</span>`;
  return `<span style="color:#1d4ed8;font-size:12px">Notary</span>`;
}

const rows = leads.map(l => `
  <tr style="border-bottom:1px solid #f1f5f9">
    <td style="padding:9px 12px;font-size:13px;font-weight:600;color:#0f172a">${l.name}</td>
    <td style="padding:9px 12px;font-size:12px"><a href="mailto:${l.email}" style="color:#2563eb;text-decoration:none">${l.source === 'voice-inbound' ? l.phone : l.email}</a></td>
    <td style="padding:9px 12px;font-size:12px;color:#334155">${l.source === 'voice-inbound' ? '—' : l.phone}</td>
    <td style="padding:9px 12px">${bondBadge(l.bond)}</td>
    <td style="padding:9px 12px">${sourceBadge(l.source)}</td>
    <td style="padding:9px 12px;font-size:12px;color:#64748b">${l.time}</td>
  </tr>`).join('');

const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24px;color:#1e293b;font-size:14px;background:#f8fafc">

<table style="width:100%;background:linear-gradient(135deg,#0a0f1e 0%,#1e3a5f 100%);border-radius:12px;margin-bottom:24px;border-collapse:collapse">
  <tr><td style="padding:24px 28px">
    <div style="color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">Quantum Surety</div>
    <div style="color:#fff;font-size:22px;font-weight:800">24-Hour Leads Report</div>
    <div style="color:#94a3b8;font-size:13px;margin-top:4px">${today} &nbsp;·&nbsp; All times CDT &nbsp;·&nbsp; Last 24 hours</div>
  </td></tr>
</table>

<!-- Stats -->
<table style="width:100%;border-collapse:collapse;margin-bottom:20px">
  <tr>
    <td style="width:20%;padding-right:8px"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center">
      <div style="font-size:34px;font-weight:800;color:#0a0f1e">${total}</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px">Total Leads</div>
    </div></td>
    <td style="width:20%;padding-right:8px"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center">
      <div style="font-size:34px;font-weight:800;color:#1d4ed8">${form}</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px">Web Form</div>
    </div></td>
    <td style="width:20%;padding-right:8px"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center">
      <div style="font-size:34px;font-weight:800;color:#9d174d">${voice}</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px">Voice Calls</div>
    </div></td>
    <td style="width:20%;padding-right:8px"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center">
      <div style="font-size:34px;font-weight:800;color:#5b21b6">${pipeline}</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px">Auto-Pipeline</div>
    </div></td>
    <td style="width:20%"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center">
      <div style="font-size:34px;font-weight:800;color:#92400e">${contractor}</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px">Contractor</div>
    </div></td>
  </tr>
</table>

<!-- Table -->
<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px">
  <div style="padding:14px 20px;border-bottom:1px solid #e2e8f0;background:#f8fafc">
    <span style="font-size:13px;font-weight:700;color:#0f172a">All Leads — Last 24 Hours</span>
    <span style="font-size:12px;color:#64748b;margin-left:8px">${total} records · newest first</span>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0">
        <th style="padding:9px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Name</th>
        <th style="padding:9px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Email / Contact</th>
        <th style="padding:9px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Phone</th>
        <th style="padding:9px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Bond</th>
        <th style="padding:9px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Source</th>
        <th style="padding:9px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Time</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</div>

<p style="font-size:11px;color:#94a3b8;text-align:center">
  Quantum Surety LLC · Generated ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' })} CT<br>
  <a href="http://192.168.4.122:8095" style="color:#94a3b8">Open CRM</a>
</p>
</body></html>`;

async function main() {
  await ses.send(new SendEmailCommand({
    Source: 'Quantum Surety Reports <nice.shotwell-sparks@quantumsurety.bond>',
    Destination: { ToAddresses: ['nice.shotwell-sparks@quantumsurety.bond'] },
    ReplyToAddresses: ['contact@quantumsurety.bond'],
    Message: {
      Subject: { Data: `24-Hour Leads Report — ${total} leads · ${today}`, Charset: 'UTF-8' },
      Body: { Html: { Data: html, Charset: 'UTF-8' } },
    },
  }));
  console.log(`✓ Report sent — ${total} leads`);
}

main().catch(e => { console.error('✗', e.message); process.exit(1); });
