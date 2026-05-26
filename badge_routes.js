
// ─── Bond Badge + Verification System ─────────────────────────────────────────
// Contractors/notaries embed our badge on their site → backlink + brand exposure

function bondBadgeSVG(name, status, expDate, type) {
  const safe = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const statusColors = { ACTIVE: '#059669', EXPIRING: '#d97706', EXPIRED: '#dc2626', UNKNOWN: '#6b7280' };
  const statusLabels = { ACTIVE: '✓ BOND ACTIVE', EXPIRING: '⚠ EXPIRING SOON', EXPIRED: '✕ BOND LAPSED', UNKNOWN: '? NOT FOUND' };
  const color = statusColors[status] || '#6b7280';
  const label = statusLabels[status] || 'UNKNOWN';
  const nameText = safe((name || type || 'Texas License').substring(0, 30));
  const expText = expDate ? 'Expires ' + new Date(expDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const w = 280, h = 56;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" role="img" aria-label="Bond status: ${label}">
  <title>Bond status: ${label} | Quantum Surety</title>
  <rect width="${w}" height="${h}" rx="6" fill="#0a0f1e"/>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="5" fill="none" stroke="${color}" stroke-width="1.5"/>
  <text x="12" y="20" font-family="-apple-system,sans-serif" font-size="11" font-weight="700" fill="${color}">${label}</text>
  <text x="12" y="36" font-family="-apple-system,sans-serif" font-size="11" fill="#e2e8f0">${nameText}</text>
  <text x="12" y="50" font-family="-apple-system,sans-serif" font-size="9" fill="#64748b">${expText}</text>
  <text x="${w - 8}" y="20" font-family="monospace" font-size="8" fill="#f59e0b" text-anchor="end">QUANTUM SURETY</text>
  <text x="${w - 8}" y="30" font-family="monospace" font-size="7" fill="#475569" text-anchor="end">quantumsurety.bond</text>
</svg>`;
}

function verifyPageHTML(data, type, id) {
  const safe = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const daysLeft = data ? Math.max(0, Math.floor((new Date(data.expire_date) - Date.now()) / 86400000)) : 0;
  const status = !data ? 'UNKNOWN' : daysLeft <= 0 ? 'EXPIRED' : daysLeft <= 30 ? 'EXPIRING' : 'ACTIVE';
  const statusColor = { ACTIVE: '#059669', EXPIRING: '#d97706', EXPIRED: '#dc2626', UNKNOWN: '#6b7280' }[status];
  const name = data ? (type === 'notary' ? [data.first_name, data.last_name].filter(Boolean).join(' ') : (data.business_name || data.owner_name || '')) : '';
  const badgeEmbed = `<a href="https://verify.quantumsurety.bond/verify/${type}/${id}" target="_blank">\n  <img src="https://verify.quantumsurety.bond/api/badge/${type}/${id}" alt="Bond Verified by Quantum Surety" width="280" height="56">\n</a>`;
  const statusLabel = status === 'ACTIVE' ? '✓ BOND ACTIVE' : status === 'EXPIRING' ? '⚠ EXPIRING SOON' : '✕ BOND LAPSED';
  const renewHref = `https://quantumsurety.bond/get-bond?type=${type === 'notary' ? 'notary' : 'contractor'}&src=badge-verify`;
  const idLabel = type === 'notary' ? 'NOTARY ID' : 'LICENSE NUMBER';

  let bodyContent;
  if (data) {
    const expDisplay = new Date(data.expire_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const cityRow = data.city ? `<div class="field"><div class="field-label">CITY</div><div class="field-value">${safe(data.city)}</div></div>` : '';
    const daysRow = daysLeft > 0 ? `<div class="field"><div class="field-label">DAYS REMAINING</div><div class="field-value" style="color:${statusColor}">${daysLeft} days</div></div>` : '';
    const renewRow = status !== 'ACTIVE' ? `<div class="cta"><a href="${renewHref}">Renew Bond Now — $50 →</a></div>` : '';
    bodyContent = `
<div class="status-badge" style="background:${statusColor}1a;border-color:${statusColor}40;color:${statusColor}">${statusLabel}</div>
<div class="field"><div class="field-label">NAME</div><div class="field-value">${safe(name)}</div></div>
<div class="field"><div class="field-label">${idLabel}</div><div class="field-value">${safe(id)}</div></div>
${cityRow}
<div class="field"><div class="field-label">BOND EXPIRATION</div><div class="field-value" style="color:${statusColor}">${expDisplay}</div></div>
${daysRow}
<div class="embed-section">
<div class="embed-label">EMBED THIS BADGE ON YOUR WEBSITE</div>
<div class="embed-code">${safe(badgeEmbed)}</div>
</div>
${renewRow}`;
  } else {
    bodyContent = `
<div class="status-badge" style="color:#6b7280;border-color:#6b7280;background:#6b728019">? NOT FOUND</div>
<p style="color:#8b949e;font-size:14px">No bond record found for ${type} ${safe(id)}.</p>
<div class="cta" style="margin-top:16px"><a href="https://verify.quantumsurety.bond">Search Again →</a></div>`;
  }

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bond Verification — ${safe(name || id)} | Quantum Surety</title>
<meta name="description" content="Verify the bond status of ${safe(name || id)} — ${type} license ${safe(id)}.">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:#0a0f1e;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{max-width:480px;width:100%;background:#161b22;border:1px solid #30363d;border-radius:12px;padding:32px}
.logo{font-size:10px;letter-spacing:4px;color:#f59e0b;font-family:monospace;margin-bottom:20px}
.status-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid;border-radius:6px;padding:8px 16px;margin-bottom:20px;font-weight:700;font-size:15px}
.field{margin-bottom:12px}
.field-label{font-size:10px;color:#64748b;letter-spacing:1px;font-family:monospace;margin-bottom:2px}
.field-value{font-size:15px;color:#e2e8f0;font-weight:600}
.embed-section{margin-top:24px;padding-top:20px;border-top:1px solid #21262d}
.embed-label{font-size:11px;color:#8b949e;margin-bottom:8px}
.embed-code{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:12px;font-family:monospace;font-size:10px;color:#4C9AC9;white-space:pre-wrap;word-break:break-all}
.cta{margin-top:20px;text-align:center}
.cta a{display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:6px;font-weight:700;font-size:13px;text-decoration:none}
footer{margin-top:20px;text-align:center;font-size:11px;color:#475569}
footer a{color:#64748b}
</style>
</head><body><div class="card">
<div class="logo">QUANTUM SURETY — BOND VERIFICATION</div>
${bodyContent}
<footer>Verified by <a href="https://quantumsurety.bond">Quantum Surety LLC</a> · Texas-Licensed Surety Agency · Data from TX SOS &amp; TDLR</footer>
</div></body></html>`;
}

// SVG badge endpoints
app.get('/api/badge/notary/:id', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const id = req.params.id.replace(/[^0-9]/g, '');
    const [rows] = await pool.execute('SELECT first_name, last_name, expire_date FROM notaries WHERE notary_id = ? LIMIT 1', [id]);
    const n = rows[0];
    const daysLeft = n ? Math.max(0, Math.floor((new Date(n.expire_date) - Date.now()) / 86400000)) : -1;
    const status = !n ? 'UNKNOWN' : daysLeft <= 0 ? 'EXPIRED' : daysLeft <= 30 ? 'EXPIRING' : 'ACTIVE';
    const name = n ? [n.first_name, n.last_name].filter(Boolean).join(' ') : '';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(bondBadgeSVG(name, status, n ? n.expire_date : null, 'Texas Notary'));
  } catch (e) { res.status(500).send(''); }
});

app.get('/api/badge/contractor/:id', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const id = req.params.id.replace(/[^A-Za-z0-9\-]/g, '').substring(0, 20);
    const [rows] = await pool.execute('SELECT business_name, owner_name, expire_date FROM contractors WHERE license_number = ? LIMIT 1', [id]);
    const n = rows[0];
    const daysLeft = n ? Math.max(0, Math.floor((new Date(n.expire_date) - Date.now()) / 86400000)) : -1;
    const status = !n ? 'UNKNOWN' : daysLeft <= 0 ? 'EXPIRED' : daysLeft <= 30 ? 'EXPIRING' : 'ACTIVE';
    const name = n ? (n.business_name || n.owner_name || '') : '';
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(bondBadgeSVG(name, status, n ? n.expire_date : null, 'Texas Contractor'));
  } catch (e) { res.status(500).send(''); }
});

// Verification HTML pages
app.get('/verify/notary/:id', async (req, res) => {
  try {
    const id = req.params.id.replace(/[^0-9]/g, '');
    const [rows] = await pool.execute('SELECT first_name, last_name, city, expire_date FROM notaries WHERE notary_id = ? LIMIT 1', [id]);
    res.setHeader('Content-Type', 'text/html');
    res.send(verifyPageHTML(rows[0] || null, 'notary', id));
  } catch (e) { res.status(500).send('Error'); }
});

app.get('/verify/contractor/:id', async (req, res) => {
  try {
    const id = req.params.id.replace(/[^A-Za-z0-9\-]/g, '').substring(0, 20);
    const [rows] = await pool.execute('SELECT business_name, owner_name, city, expire_date FROM contractors WHERE license_number = ? LIMIT 1', [id]);
    res.setHeader('Content-Type', 'text/html');
    res.send(verifyPageHTML(rows[0] || null, 'contractor', id));
  } catch (e) { res.status(500).send('Error'); }
});
