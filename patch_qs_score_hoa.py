#!/usr/bin/env python3
"""
Patches bondverify server.js to add:
1. calculateQSScore() function
2. qs_score in all lookup responses
3. HOA portal DB tables
4. HOA portal API routes
"""
import subprocess, sys, textwrap

HOST = "root@130.51.23.147"
PW = "W573zI2qnY1HmBs"

def ssh(cmd):
    result = subprocess.run(
        ["plink", "-batch", "-pw", PW, HOST, cmd],
        capture_output=True, text=True, timeout=30
    )
    return result.stdout, result.stderr

def ssh_write(remote_path, content):
    import tempfile, os
    tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8')
    tmp.write(content)
    tmp.close()
    result = subprocess.run(
        ["pscp", "-batch", "-pw", PW, tmp.name, f"{HOST}:/tmp/_patch_upload.tmp"],
        capture_output=True, text=True, timeout=30
    )
    os.unlink(tmp.name)
    stdout, stderr = ssh(f"echo '{PW}' | sudo -S cp /tmp/_patch_upload.tmp {remote_path} && echo OK")
    return "OK" in stdout

# --- Read current server.js ---
print("[1/5] Reading server.js...")
out, err = ssh("cat /var/www/bondverify/server.js")
if not out:
    print("ERROR: could not read server.js:", err)
    sys.exit(1)

server_js = out
print(f"  Read {len(server_js)} chars, {server_js.count(chr(10))} lines")

# --- Check if already patched ---
if 'calculateQSScore' in server_js:
    print("  Already patched (calculateQSScore found). Skipping score patch.")
    score_patched = True
else:
    score_patched = False

if 'hoa_accounts' in server_js:
    print("  Already patched (hoa_accounts found). Skipping HOA patch.")
    hoa_patched = True
else:
    hoa_patched = False

# --- Inject calculateQSScore after statusInfo function ---
QS_SCORE_FN = r"""
function calculateQSScore(row, type) {
  const expDate = row.expire_date ? new Date(row.expire_date) : null;
  const now = new Date();
  const daysLeft = expDate ? Math.floor((expDate - now) / 86400000) : -9999;

  // Bond health: 0-60 pts (primary factor)
  let bondPts;
  if (daysLeft > 180) bondPts = 60;
  else if (daysLeft > 90) bondPts = 55;
  else if (daysLeft > 60) bondPts = 50;
  else if (daysLeft > 30) bondPts = 42;
  else if (daysLeft >= 0) bondPts = 35;
  else if (daysLeft >= -30) bondPts = 20;
  else if (daysLeft >= -90) bondPts = 10;
  else if (daysLeft >= -365) bondPts = 5;
  else bondPts = 0;

  // Type/credential pts: 0-20
  let typePts = 12;
  if (type === 'contractor') {
    const lt = (row.license_type || '').toLowerCase();
    if (/master electrician|electrical contractor|master plumber|plumbing contractor|hvac contractor|general contractor/.test(lt)) typePts = 20;
    else if (/journeyman|a\/c|refrigeration|hvac tech|air condition/.test(lt)) typePts = 15;
    else if (/apprentice|inspector/.test(lt)) typePts = 10;
  } else {
    const effDate = row.effective_date ? new Date(row.effective_date) : null;
    if (effDate) {
      const yrs = (now - effDate) / (365.25 * 86400000);
      if (yrs >= 8) typePts = 20;
      else if (yrs >= 4) typePts = 15;
      else if (yrs >= 2) typePts = 12;
      else typePts = 10;
    }
  }

  // Profile completeness: 0-20 pts
  let completePts = 0;
  if (type === 'contractor') {
    if (row.business_name) completePts += 5;
    if (row.business_phone) completePts += 5;
    if (row.business_city) completePts += 5;
    if (row.business_address) completePts += 5;
  } else {
    if (row.surety_company) completePts += 7;
    if (row.agency) completePts += 5;
    if (row.city || row.address) completePts += 8;
  }

  const score = Math.min(100, bondPts + typePts + completePts);
  let grade, label, color;
  if (score >= 85) { grade = 'A+'; label = 'QS Verified'; color = '#059669'; }
  else if (score >= 70) { grade = 'A'; label = 'Trusted'; color = '#16a34a'; }
  else if (score >= 55) { grade = 'B'; label = 'Active'; color = '#2563eb'; }
  else if (score >= 40) { grade = 'C'; label = 'Compliant'; color = '#d97706'; }
  else if (score >= 25) { grade = 'D'; label = 'At Risk'; color = '#ea580c'; }
  else { grade = 'F'; label = 'Non-Compliant'; color = '#dc2626'; }

  return { qs_score: score, qs_grade: grade, qs_label: label, qs_color: color };
}
"""

HOA_ROUTES = r"""
// ─── HOA / Vendor Compliance Portal ───────────────────────────────────────────
const hoaPool = pool; // same DB

async function hoaAccount(token) {
  if (!token) return null;
  const [rows] = await hoaPool.execute(
    'SELECT * FROM hoa_accounts WHERE token = ? AND token_expires > NOW()', [token]
  );
  return rows[0] || null;
}

// Register / get magic link
app.post('/api/hoa/register', async (req, res) => {
  try {
    const { email, org_name, contact_name } = req.body || {};
    if (!email || !org_name) return res.status(400).json({ error: 'email and org_name required' });
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await hoaPool.execute(
      `INSERT INTO hoa_accounts (email, org_name, contact_name, token, token_expires)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE org_name=VALUES(org_name), contact_name=VALUES(contact_name),
         token=VALUES(token), token_expires=VALUES(token_expires)`,
      [email.toLowerCase().trim(), org_name.trim(), (contact_name || '').trim(), token, expires]
    );
    const loginUrl = `https://quantumsurety.bond/hoa-portal?token=${token}`;
    await sendEmail(
      email,
      'Your Quantum Surety Vendor Portal Access',
      `<p>Hello${contact_name ? ' ' + contact_name : ''},</p>
<p>Click the link below to access your <strong>free HOA/Property Manager Vendor Compliance Portal</strong>.</p>
<p><a href="${loginUrl}" style="background:#0a0f1e;color:#f59e0b;padding:12px 24px;border-radius:7px;text-decoration:none;font-weight:bold;display:inline-block;">Open My Vendor Dashboard →</a></p>
<p style="font-size:12px;color:#64748b">Link expires in 7 days. If you didn't request this, ignore this email.</p>
<p style="font-size:12px;color:#64748b">Quantum Surety LLC · (214) 666-8718 · quantumsurety.bond</p>`
    );
    res.json({ ok: true, message: 'Check your email for the login link.' });
  } catch (e) {
    console.error('[HOA register]', e.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Validate token (called by frontend after redirect)
app.get('/api/hoa/auth', async (req, res) => {
  const account = await hoaAccount(req.query.token);
  if (!account) return res.status(401).json({ error: 'Invalid or expired token' });
  res.json({ ok: true, account: { id: account.id, email: account.email, org_name: account.org_name, contact_name: account.contact_name } });
});

// Dashboard — get all vendors with live bond status
app.get('/api/hoa/dashboard', async (req, res) => {
  const token = req.headers['x-hoa-token'] || req.query.token;
  const account = await hoaAccount(token);
  if (!account) return res.status(401).json({ error: 'unauthorized' });
  const [vendors] = await hoaPool.execute('SELECT * FROM hoa_vendors WHERE account_id = ? ORDER BY added_at DESC', [account.id]);
  const enriched = await Promise.all(vendors.map(async (v) => {
    try {
      if (v.license_type === 'notary') {
        const [rows] = await hoaPool.execute('SELECT * FROM notaries WHERE notary_id = ?', [v.license_number]);
        if (rows[0]) {
          const r = rows[0];
          return { ...v, name: (r.first_name + ' ' + r.last_name).trim(), ...statusInfo(r.expire_date), ...calculateQSScore(r, 'notary'), expire_date: r.expire_date };
        }
      } else {
        const [rows] = await hoaPool.execute('SELECT * FROM contractors WHERE license_number = ?', [v.license_number]);
        if (rows[0]) {
          const r = rows[0];
          return { ...v, name: r.business_name || r.owner_name || v.license_number, license_type_detail: r.license_type, ...statusInfo(r.expire_date), ...calculateQSScore(r, 'contractor'), expire_date: r.expire_date };
        }
      }
    } catch (e) {}
    return { ...v, status: 'not_found', label: 'Not Found', qs_score: 0, qs_grade: 'F', qs_label: 'Not Found', qs_color: '#6b7280' };
  }));
  res.json({ vendors: enriched, account: { org_name: account.org_name, email: account.email } });
});

// Add a vendor
app.post('/api/hoa/vendors', async (req, res) => {
  const token = req.headers['x-hoa-token'] || req.query.token;
  const account = await hoaAccount(token);
  if (!account) return res.status(401).json({ error: 'unauthorized' });
  const { license_number, license_type = 'contractor', vendor_label } = req.body || {};
  if (!license_number) return res.status(400).json({ error: 'license_number required' });
  await hoaPool.execute(
    'INSERT IGNORE INTO hoa_vendors (account_id, license_number, license_type, vendor_label) VALUES (?, ?, ?, ?)',
    [account.id, license_number.trim().toUpperCase(), license_type, (vendor_label || '').trim()]
  );
  res.json({ ok: true });
});

// Bulk add vendors from CSV data
app.post('/api/hoa/vendors/bulk', async (req, res) => {
  const token = req.headers['x-hoa-token'] || req.query.token;
  const account = await hoaAccount(token);
  if (!account) return res.status(401).json({ error: 'unauthorized' });
  const { vendors } = req.body || {};
  if (!Array.isArray(vendors) || !vendors.length) return res.status(400).json({ error: 'vendors[] required' });
  let added = 0;
  for (const v of vendors.slice(0, 500)) {
    if (!v.license_number) continue;
    try {
      await hoaPool.execute(
        'INSERT IGNORE INTO hoa_vendors (account_id, license_number, license_type, vendor_label) VALUES (?, ?, ?, ?)',
        [account.id, v.license_number.trim().toUpperCase(), v.license_type || 'contractor', (v.vendor_label || '').trim()]
      );
      added++;
    } catch(e) {}
  }
  res.json({ ok: true, added });
});

// Remove vendor
app.delete('/api/hoa/vendors/:id', async (req, res) => {
  const token = req.headers['x-hoa-token'] || req.query.token;
  const account = await hoaAccount(token);
  if (!account) return res.status(401).json({ error: 'unauthorized' });
  await hoaPool.execute('DELETE FROM hoa_vendors WHERE id = ? AND account_id = ?', [req.params.id, account.id]);
  res.json({ ok: true });
});

// Alert check — expose for cron: GET /api/hoa/send-alerts?secret=xxx
app.get('/api/hoa/send-alerts', async (req, res) => {
  if (req.query.secret !== process.env.HOA_ALERT_SECRET) return res.status(403).json({ error: 'forbidden' });
  const [accounts] = await hoaPool.execute('SELECT * FROM hoa_accounts');
  let sent = 0;
  for (const account of accounts) {
    const [vendors] = await hoaPool.execute('SELECT * FROM hoa_vendors WHERE account_id = ?', [account.id]);
    const expiring = [];
    for (const v of vendors) {
      let row;
      try {
        if (v.license_type === 'notary') {
          const [rows] = await hoaPool.execute('SELECT * FROM notaries WHERE notary_id = ?', [v.license_number]);
          row = rows[0];
        } else {
          const [rows] = await hoaPool.execute('SELECT * FROM contractors WHERE license_number = ?', [v.license_number]);
          row = rows[0];
        }
        if (row) {
          const info = statusInfo(row.expire_date);
          if (info.status === 'expiring' || info.status === 'expired') {
            const name = row.business_name || row.owner_name || (row.first_name + ' ' + row.last_name).trim() || v.license_number;
            expiring.push({ name, license_number: v.license_number, license_type: v.license_type, status: info.status, label: info.label, expire_date: row.expire_date });
          }
        }
      } catch(e) {}
    }
    if (expiring.length > 0) {
      const rows = expiring.map(v =>
        `<tr><td style="padding:8px 12px">${v.name}</td><td style="padding:8px 12px">${v.license_number}</td><td style="padding:8px 12px;color:${v.status==='expired'?'#dc2626':'#d97706'}">${v.label}</td><td style="padding:8px 12px">${v.expire_date ? v.expire_date.toString().slice(0,10) : 'N/A'}</td></tr>`
      ).join('');
      const loginUrl = `https://quantumsurety.bond/hoa-portal?token=${account.token}`;
      await sendEmail(account.email,
        `⚠️ ${expiring.length} vendor bond(s) need attention — ${account.org_name}`,
        `<p>Hello${account.contact_name ? ' ' + account.contact_name : ''},</p>
<p>The following vendors in your <strong>${account.org_name}</strong> compliance list have expiring or expired bonds:</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">
<thead><tr style="background:#0a0f1e;color:#f59e0b"><th style="padding:8px 12px;text-align:left">Vendor</th><th style="padding:8px 12px;text-align:left">License #</th><th style="padding:8px 12px;text-align:left">Status</th><th style="padding:8px 12px;text-align:left">Expires</th></tr></thead>
<tbody>${rows}</tbody></table>
<p style="margin-top:20px"><a href="${loginUrl}" style="background:#0a0f1e;color:#f59e0b;padding:12px 24px;border-radius:7px;text-decoration:none;font-weight:bold;display:inline-block;">View Full Vendor Dashboard →</a></p>
<p style="font-size:12px;color:#64748b">Quantum Surety LLC · quantumsurety.bond</p>`
      );
      sent++;
    }
  }
  res.json({ ok: true, accounts_alerted: sent });
});
"""

if not score_patched:
    print("[2/5] Injecting calculateQSScore()...")
    # Insert QS score function after statusInfo function
    marker = "function statusInfo(expireDate) {"
    if marker not in server_js:
        print("  ERROR: statusInfo marker not found!")
        sys.exit(1)
    idx = server_js.find(marker)
    # Find end of statusInfo function (closing brace)
    brace_count = 0
    i = idx
    for i in range(idx, len(server_js)):
        if server_js[i] == '{': brace_count += 1
        elif server_js[i] == '}':
            brace_count -= 1
            if brace_count == 0: break
    insert_pos = i + 1
    server_js = server_js[:insert_pos] + "\n" + QS_SCORE_FN + server_js[insert_pos:]

    # Add qs_score to contractor lookup responses
    server_js = server_js.replace(
        "rows.map(r => ({ ...r, ...statusInfo(r.expire_date) }))",
        "rows.map(r => ({ ...r, ...statusInfo(r.expire_date), ...(r.license_type !== undefined ? calculateQSScore(r,'contractor') : calculateQSScore(r,'notary')) }))"
    )
    # Fix specific contractor endpoint that returns single record
    # Update single record responses
    # These appear as: res.json({ ...r, ...statusInfo(r.expire_date), ... })
    server_js = server_js.replace(
        "res.json({ ...r, ...statusInfo(r.expire_date), api_requests_remaining: 1000 - req.apiKey.requests_today });",
        "res.json({ ...r, ...statusInfo(r.expire_date), ...calculateQSScore(r, r.license_type !== undefined ? 'contractor' : 'notary'), api_requests_remaining: 1000 - req.apiKey.requests_today });"
    )
    print("  Score function injected.")
else:
    print("[2/5] Score already patched, skipping.")

if not hoa_patched:
    print("[3/5] Injecting HOA routes...")
    # Insert before app.listen
    listen_marker = "app.listen("
    if listen_marker not in server_js:
        print("  ERROR: app.listen marker not found!")
        sys.exit(1)
    idx = server_js.rfind(listen_marker)
    server_js = server_js[:idx] + HOA_ROUTES + "\n" + server_js[idx:]
    print("  HOA routes injected.")
else:
    print("[3/5] HOA already patched, skipping.")

# Write updated server.js
print("[4/5] Writing patched server.js to VPS...")
ok = ssh_write("/var/www/bondverify/server.js", server_js)
if not ok:
    print("  ERROR writing server.js!")
    sys.exit(1)
print("  Written OK.")

# Create HOA tables
print("[4b/5] Creating HOA DB tables...")
sql = """
CREATE TABLE IF NOT EXISTS hoa_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  org_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) DEFAULT '',
  token VARCHAR(64) UNIQUE,
  token_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hoa_vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  license_type ENUM('contractor','notary') DEFAULT 'contractor',
  vendor_label VARCHAR(255) DEFAULT '',
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES hoa_accounts(id) ON DELETE CASCADE,
  UNIQUE KEY uq_account_license (account_id, license_number)
);
"""
sql_escaped = sql.replace("'", "'\\''")
db_cmd = f"mysql -u bondverify -pBondVerify2026! bondverify -e '{sql_escaped}'"
out, err = ssh(db_cmd)
if err and 'error' in err.lower():
    print("  DB error:", err[:200])
else:
    print("  DB tables created/verified OK.")

# Restart PM2
print("[5/5] Restarting bond-verify PM2 process...")
out, err = ssh("pm2 restart bond-verify 2>&1 | tail -5")
print("  PM2:", out.strip() or err.strip())

print("\nDone! VPS patched with QS Score + HOA portal backend.")
