#!/usr/bin/env node
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
  },
});

const leads = [
  { id: 10041, name: 'ROOF PORTFOLIO MANAGEMENT, LLC', email: 'tye@roofpm.com', phone: '214-454-5485', bond_type: 'Texas Contractor License Bond', source: 'auto-pipeline — drip open/click', status: 'new', notes: 'HUB certified, WYLIE TX', created_at: '2026-05-27 06:45' },
  { id: 10040, name: 'WELDING AND SPECIALTY PIPING SERVICE LLC', email: 'jzendejo@waspsvcs.com', phone: '832-983-3087', bond_type: 'Texas Contractor License Bond', source: 'auto-pipeline — drip open/click', status: 'new', notes: 'HUB certified, PASADENA TX', created_at: '2026-05-27 06:45' },
  { id: 8347, name: 'Wendy J Zambrano', email: 'wzambrano03@yahoo.com', phone: '832-732-3338', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-22 04:10' },
  { id: 7279, name: 'BRIDGETT WALKER', email: 'bwalker2510@gmail.com', phone: '469-990-8915', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-21 20:05' },
  { id: 7248, name: 'Ruth Ann Coveney', email: 'ruthanncoveney@yahoo.com', phone: '830-281-1990', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-21 19:50' },
  { id: 6599, name: 'Sylvia Casarez', email: 'isb.work@yahoo.com', phone: '956-279-0028', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-21 13:50' },
  { id: 5542, name: 'Alexandra Phillips', email: 'alex.phillips09@yahoo.com', phone: '817-789-5972', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-21 02:50' },
  { id: 5289, name: 'Sugey Martinez', email: 'sugeyrmartinez@aol.com', phone: '956-793-0316', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-20 23:50' },
  { id: 5222, name: 'Brianna Samaniego', email: 'samaniego_brianna505@yahoo.com', phone: '915-478-9140', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-20 22:55' },
  { id: 5221, name: 'Bob Nguyen', email: 'bobnguyenaccounting@comcast.net', phone: '832-488-0857', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-20 22:55' },
  { id: 5067, name: 'Jodie Lee Taylor', email: 'dispatch@aimrecyclingco.com', phone: '903-515-0161', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'contacted', notes: '', created_at: '2026-05-20 19:45' },
  { id: 5068, name: 'Brian Keith Moore', email: 'brianmoore65@att.net', phone: '210-268-5901', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'contacted', notes: '', created_at: '2026-05-20 19:45' },
  { id: 5056, name: 'Jessica Trejo', email: 'jtrejo@enterpriseelectricalco.com', phone: '713-824-0270', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'contacted', notes: '', created_at: '2026-05-20 19:20' },
  { id: 5013, name: 'Kristie Kay Delgado', email: 'kristie_delgado@yahoo.com', phone: '817-507-6932', bond_type: 'Texas Notary Bond', source: 'get-bond form', status: 'new', notes: '', created_at: '2026-05-20 15:50' },
];

const total = leads.length;
const byType = leads.reduce((a, l) => { a[l.bond_type] = (a[l.bond_type] || 0) + 1; return a; }, {});
const byStatus = leads.reduce((a, l) => { a[l.status] = (a[l.status] || 0) + 1; return a; }, {});
const newCount = byStatus['new'] || 0;
const contactedCount = byStatus['contacted'] || 0;
const soldCount = byStatus['sold'] || 0;

function statusBadge(s) {
  const styles = {
    new:      'background:#dbeafe;color:#1d4ed8',
    contacted:'background:#fef9c3;color:#854d0e',
    sold:     'background:#dcfce7;color:#166534',
    no_follow_up: 'background:#f1f5f9;color:#475569',
  };
  const st = styles[s] || styles.new;
  return `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;${st}">${s.replace(/_/g,' ').toUpperCase()}</span>`;
}

function sourceBadge(s) {
  const isPipeline = s.includes('pipeline') || s.includes('drip');
  return isPipeline
    ? `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;background:#fce7f3;color:#9d174d">🤖 ${s}</span>`
    : `<span style="font-size:12px;color:#64748b">${s}</span>`;
}

const tableRows = leads.map(l => `
  <tr style="border-bottom:1px solid #f1f5f9">
    <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#0f172a;max-width:180px">${l.name}<br><span style="font-size:11px;font-weight:400;color:#64748b">${l.created_at} UTC</span></td>
    <td style="padding:10px 12px;font-size:12px;color:#334155"><a href="mailto:${l.email}" style="color:#2563eb;text-decoration:none">${l.email}</a><br>${l.phone}</td>
    <td style="padding:10px 12px;font-size:12px;color:#334155">${l.bond_type.replace('Texas ','')}</td>
    <td style="padding:10px 12px">${sourceBadge(l.source)}</td>
    <td style="padding:10px 12px">${statusBadge(l.status)}</td>
    <td style="padding:10px 12px;font-size:11px;color:#64748b">${l.notes || '—'}</td>
  </tr>`).join('');

const typeBreakdown = Object.entries(byType).map(([t, n]) =>
  `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f1f5f9"><span style="font-size:13px;color:#334155">${t.replace('Texas ','')}</span><strong style="font-size:13px">${n}</strong></div>`
).join('');

const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24px;color:#1e293b;font-size:14px;background:#f8fafc">

<!-- Header -->
<table style="width:100%;background:linear-gradient(135deg,#0a0f1e 0%,#1e3a5f 100%);border-radius:12px;padding:0;margin-bottom:24px;border-collapse:collapse">
  <tr>
    <td style="padding:24px 28px">
      <div style="color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">Quantum Surety</div>
      <div style="color:#ffffff;font-size:22px;font-weight:800">Leads Report — Last 7 Days</div>
      <div style="color:#94a3b8;font-size:13px;margin-top:4px">May 20 – May 27, 2026 &nbsp;·&nbsp; quantum-surety-crm</div>
    </td>
  </tr>
</table>

<!-- Stats row -->
<table style="width:100%;border-collapse:collapse;margin-bottom:20px">
  <tr>
    <td style="width:25%;padding-right:8px">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;text-align:center">
        <div style="font-size:32px;font-weight:800;color:#0a0f1e">${total}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Total Leads</div>
      </div>
    </td>
    <td style="width:25%;padding-right:8px">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;text-align:center">
        <div style="font-size:32px;font-weight:800;color:#1d4ed8">${newCount}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">New</div>
      </div>
    </td>
    <td style="width:25%;padding-right:8px">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;text-align:center">
        <div style="font-size:32px;font-weight:800;color:#854d0e">${contactedCount}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Contacted</div>
      </div>
    </td>
    <td style="width:25%">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;text-align:center">
        <div style="font-size:32px;font-weight:800;color:#166534">${soldCount}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Sold</div>
      </div>
    </td>
  </tr>
</table>

<!-- Bond type breakdown -->
<table style="width:100%;border-collapse:collapse;margin-bottom:20px">
  <tr>
    <td style="vertical-align:top;width:35%;padding-right:12px">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px">
        <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">By Bond Type</div>
        ${typeBreakdown}
      </div>
    </td>
    <td style="vertical-align:top;width:65%">
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 20px">
        <div style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">🤖 Auto-Pipeline Highlights</div>
        <p style="font-size:13px;color:#92400e;margin:0">2 contractor leads added automatically from drip email engagement (opened/clicked). Both are HUB-certified businesses — warm prospects actively looking at contractor bond options.</p>
      </div>
    </td>
  </tr>
</table>

<!-- Full leads table -->
<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px">
  <div style="padding:14px 20px;border-bottom:1px solid #e2e8f0;background:#f8fafc">
    <span style="font-size:13px;font-weight:700;color:#0f172a">All Leads</span>
    <span style="font-size:12px;color:#64748b;margin-left:8px">${total} records</span>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0">
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Name</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Contact</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Bond Type</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Source</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Status</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Notes</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>

<!-- Footer -->
<p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:24px">
  Quantum Surety LLC · quantum-surety-crm · Generated ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' })} CT<br>
  <a href="http://192.168.4.122:8095" style="color:#94a3b8">Open CRM Dashboard</a>
</p>

</body>
</html>`;

async function main() {
  const cmd = new SendEmailCommand({
    Source: 'Quantum Surety Reports <nice.shotwell-sparks@quantumsurety.bond>',
    Destination: { ToAddresses: ['nice.shotwell-sparks@quantumsurety.bond'] },
    ReplyToAddresses: ['contact@quantumsurety.bond'],
    Message: {
      Subject: { Data: `Leads Report: ${total} leads in the last 7 days (May 20–27)`, Charset: 'UTF-8' },
      Body: { Html: { Data: html, Charset: 'UTF-8' } },
    },
  });

  try {
    await ses.send(cmd);
    console.log(`✓ Report sent to nice.shotwell-sparks@quantumsurety.bond`);
    console.log(`  ${total} leads · ${newCount} new · ${contactedCount} contacted · ${soldCount} sold`);
  } catch (e) {
    console.error('✗ Failed:', e.message);
    process.exit(1);
  }
}

main();
