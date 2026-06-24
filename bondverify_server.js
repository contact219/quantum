require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'bondverify',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'bondverify',
  waitForConnections: true, connectionLimit: 10, timezone: '+00:00'
});

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET }
});

function statusInfo(expireDate) {
  if (!expireDate) return { status: 'unknown', label: 'Unknown', daysLeft: null };
  const now = new Date();
  const exp = new Date(expireDate);
  const daysLeft = Math.floor((exp - now) / 86400000);
  if (daysLeft < 0) return { status: 'expired', label: 'Expired', daysLeft };
  if (daysLeft <= 60) return { status: 'expiring', label: `Expiring in ${daysLeft} days`, daysLeft };
  return { status: 'active', label: 'Active', daysLeft };
}

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


async function sendEmail(to, subject, html) {
  try {
    await ses.send(new SendEmailCommand({
      Source: 'alerts@quantumsurety.bond',
      Destination: { ToAddresses: [to] },
      Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } }
    }));
  } catch(e) { console.error('SES:', e.message); }
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Notary endpoints Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

app.get('/api/search', async (req, res) => {
  try {
    const { q, city, notary_id } = req.query;
    if (!q && !notary_id) return res.json({ results: [], total: 0 });
    let sql, params;
    if (notary_id) {
      sql = 'SELECT * FROM notaries WHERE notary_id = ? LIMIT 1';
      params = [notary_id.trim()];
    } else {
      const terms = q.trim().split(/\s+/);
      if (terms.length >= 2) {
        sql = 'SELECT * FROM notaries WHERE first_name LIKE ? AND last_name LIKE ?';
        params = [`${terms[0]}%`, `${terms[terms.length-1]}%`];
      } else {
        sql = 'SELECT * FROM notaries WHERE first_name LIKE ? OR last_name LIKE ?';
        params = [`${q}%`, `${q}%`];
      }
      if (city) { sql += ' AND city LIKE ?'; params.push(`${city}%`); }
      sql += ' ORDER BY expire_date DESC LIMIT 50';
    }
    const [rows] = await pool.execute(sql, params);
    res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date), ...(r.license_type !== undefined ? calculateQSScore(r,'contractor') : calculateQSScore(r,'notary')) })), total: rows.length });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Search failed' }); }
});

app.post('/api/alerts/subscribe', async (req, res) => {
  try {
    const { notary_id, email } = req.body;
    if (!notary_id || !email) return res.status(400).json({ error: 'notary_id and email required' });
    const [rows] = await pool.execute('SELECT * FROM notaries WHERE notary_id = ?', [notary_id]);
    if (!rows.length) return res.status(404).json({ error: 'Notary ID not found' });
    const n = rows[0];
    await pool.execute('INSERT IGNORE INTO alert_subscriptions (notary_id, email) VALUES (?, ?)', [notary_id, email.toLowerCase()]);
    const expStr = n.expire_date ? new Date(n.expire_date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : 'N/A';
    await sendEmail(email, 'Bond Renewal Alert Confirmed Ã¢â‚¬â€ Quantum Surety',
      `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <img src="https://quantumsurety.bond/QS_Logo.png" width="40" style="margin-bottom:16px">
        <h2 style="color:#0f172a;margin:0 0 8px">You're set, ${n.first_name}!</h2>
        <p style="color:#475569">We'll remind you before your Texas notary bond expires.</p>
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0">
          <p style="margin:0;font-size:14px;color:#64748b">Notary ID: <strong style="color:#0f172a">${n.notary_id}</strong></p>
          <p style="margin:6px 0 0;font-size:14px;color:#64748b">Bond expires: <strong style="color:#0f172a">${expStr}</strong></p>
        </div>
        <p style="color:#475569;font-size:14px">When it's time to renew, we'll send a link to renew instantly at <strong>$50</strong>.</p>
        <a href="https://quantumsurety.bond/bonds/notary-bond-texas" style="display:inline-block;margin-top:16px;background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;font-weight:700;text-decoration:none">Renew Now Ã¢â‚¬â€ $50 Instant</a>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">Quantum Surety Ã‚Â· <a href="https://quantumsurety.bond" style="color:#94a3b8">quantumsurety.bond</a></p>
      </div>`
    );
    res.json({ success: true });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Subscription failed' }); }
});

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Contractor endpoints Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

// Public contractor search Ã¢â‚¬â€ no key required
app.get('/api/contractor-search', async (req, res) => {
  try {
    const { q, county, type } = req.query;
    if (!q) return res.json({ results: [], total: 0 });
    const terms = q.trim().split(/\s+/);
    const conditions = [];
    const params = [];

    if (terms.length >= 2) {
      // Likely "first last" Ã¢â‚¬â€ try owner name split
      conditions.push('(owner_name LIKE ? OR business_name LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    } else {
      conditions.push('(owner_name LIKE ? OR business_name LIKE ? OR license_number = ?)');
      params.push(`%${q}%`, `%${q}%`, q.trim());
    }
    if (county) { conditions.push('business_county LIKE ?'); params.push(`${county}%`); }
    if (type)   { conditions.push('license_type LIKE ?');    params.push(`%${type}%`); }
    params.push(50);

    const [rows] = await pool.execute(
      `SELECT * FROM contractors WHERE ${conditions.join(' AND ')} ORDER BY expire_date DESC LIMIT ?`, params
    );
    res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date), ...(r.license_type !== undefined ? calculateQSScore(r,'contractor') : calculateQSScore(r,'notary')) })), total: rows.length });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Search failed' }); }
});

// API key registration
app.post('/api/keys/register', async (req, res) => {
  try {
    const { name, email, company, use_case } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });
    const key = 'qsb_' + crypto.randomBytes(24).toString('hex');
    await pool.execute(
      'INSERT INTO api_keys (api_key, name, email, company, use_case) VALUES (?, ?, ?, ?, ?)',
      [key, name, email, company || '', use_case || '']
    );
    await sendEmail(email, 'Your Quantum Surety Bond API Key',
      `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <img src="https://quantumsurety.bond/QS_Logo.png" width="40" style="margin-bottom:16px">
        <h2 style="color:#0f172a">Your API Key is Ready</h2>
        <p style="color:#475569">Hi ${name}, here is your Quantum Surety Bond API key:</p>
        <div style="background:#0f172a;border-radius:8px;padding:16px;margin:20px 0;word-break:break-all">
          <code style="color:#f59e0b;font-size:14px">${key}</code>
        </div>
        <p style="color:#475569;font-size:14px"><strong>Free tier:</strong> 1,000 requests/day</p>
        <p style="color:#475569;font-size:14px">Pass as header: <code>X-API-Key: ${key}</code></p>
        <a href="https://verify.quantumsurety.bond/api-docs.html" style="display:inline-block;margin-top:16px;background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;font-weight:700;text-decoration:none">View API Docs</a>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">Quantum Surety API Ã‚Â· <a href="https://verify.quantumsurety.bond" style="color:#94a3b8">verify.quantumsurety.bond</a></p>
      </div>`
    );
    res.json({ success: true, api_key: key, plan: 'free', daily_limit: 1000 });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Registration failed' }); }
});

// API key middleware
async function requireKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key) return res.status(401).json({ error: 'API key required', docs: 'https://verify.quantumsurety.bond/api-docs.html' });
  const [rows] = await pool.execute('SELECT * FROM api_keys WHERE api_key = ?', [key]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid API key' });
  const k = rows[0];
  const today = new Date().toISOString().split('T')[0];
  if (k.last_reset !== today) {
    await pool.execute('UPDATE api_keys SET requests_today=0, last_reset=? WHERE api_key=?', [today, key]);
    k.requests_today = 0;
  }
  if (k.plan === 'free' && k.requests_today >= 1000)
    return res.status(429).json({ error: 'Daily limit of 1,000 requests reached', upgrade: 'api@quantumsurety.bond' });
  await pool.execute('UPDATE api_keys SET requests_today=requests_today+1 WHERE api_key=?', [key]);
  req.apiKey = k;
  next();
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ API v1 Ã¢â‚¬â€ notary Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

app.get('/api/v1/status', async (req, res) => {
  try {
    const [[nr]] = await pool.execute('SELECT COUNT(*) as total, MAX(updated_at) as last_updated FROM notaries');
    const [[cr]] = await pool.execute('SELECT COUNT(*) as total, MAX(updated_at) as last_updated FROM contractors');
    res.json({
      status: 'ok',
      notaries: { total: nr.total, last_updated: nr.last_updated },
      contractors: { total: cr.total, last_updated: cr.last_updated },
      version: '1.1'
    });
  } catch(e) { res.status(500).json({ status: 'error' }); }
});

app.get('/api/v1/lookup/:notary_id', requireKey, async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM notaries WHERE notary_id = ?', [req.params.notary_id]);
  if (!rows.length) return res.status(404).json({ error: 'Notary not found' });
  const r = rows[0];
  res.json({ ...r, ...statusInfo(r.expire_date), ...calculateQSScore(r, r.license_type !== undefined ? 'contractor' : 'notary'), api_requests_remaining: 1000 - req.apiKey.requests_today });
});

app.get('/api/v1/search', requireKey, async (req, res) => {
  const { first_name, last_name, city, zip, notary_id } = req.query;
  const conditions = [], params = [];
  if (notary_id)   { conditions.push('notary_id = ?');     params.push(notary_id); }
  if (first_name)  { conditions.push('first_name LIKE ?'); params.push(`${first_name}%`); }
  if (last_name)   { conditions.push('last_name LIKE ?');  params.push(`${last_name}%`); }
  if (city)        { conditions.push('city LIKE ?');       params.push(`${city}%`); }
  if (zip)         { conditions.push('zip = ?');           params.push(zip); }
  if (!conditions.length) return res.status(400).json({ error: 'At least one parameter required' });
  params.push(100);
  const [rows] = await pool.execute(
    `SELECT * FROM notaries WHERE ${conditions.join(' AND ')} ORDER BY expire_date DESC LIMIT ?`, params
  );
  res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date), ...(r.license_type !== undefined ? calculateQSScore(r,'contractor') : calculateQSScore(r,'notary')) })), total: rows.length,
    api_requests_remaining: 1000 - req.apiKey.requests_today });
});

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ API v1 Ã¢â‚¬â€ contractor Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

app.get('/api/v1/contractor/lookup/:license_number', requireKey, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contractors WHERE license_number = ?', [req.params.license_number]);
    if (!rows.length) return res.status(404).json({ error: 'License not found' });
    const r = rows[0];
    res.json({ ...r, ...statusInfo(r.expire_date), ...calculateQSScore(r, r.license_type !== undefined ? 'contractor' : 'notary'), api_requests_remaining: 1000 - req.apiKey.requests_today });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Lookup failed' }); }
});

app.get('/api/v1/contractor/search', requireKey, async (req, res) => {
  try {
    const { name, county, type, license_number } = req.query;
    const conditions = [], params = [];
    if (license_number) { conditions.push('license_number = ?');        params.push(license_number); }
    if (name)           { conditions.push('(owner_name LIKE ? OR business_name LIKE ?)'); params.push(`%${name}%`, `%${name}%`); }
    if (county)         { conditions.push('business_county LIKE ?');    params.push(`${county}%`); }
    if (type)           { conditions.push('license_type LIKE ?');       params.push(`%${type}%`); }
    if (!conditions.length) return res.status(400).json({ error: 'At least one parameter required' });
    params.push(100);
    const [rows] = await pool.execute(
      `SELECT * FROM contractors WHERE ${conditions.join(' AND ')} ORDER BY expire_date DESC LIMIT ?`, params
    );
    res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date), ...(r.license_type !== undefined ? calculateQSScore(r,'contractor') : calculateQSScore(r,'notary')) })), total: rows.length,
      api_requests_remaining: 1000 - req.apiKey.requests_today });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Search failed' }); }
});

const PORT = process.env.PORT || 3001;

// â”€â”€â”€ HOA / Vendor Compliance Portal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
<p><a href="${loginUrl}" style="background:#0a0f1e;color:#f59e0b;padding:12px 24px;border-radius:7px;text-decoration:none;font-weight:bold;display:inline-block;">Open My Vendor Dashboard â†’</a></p>
<p style="font-size:12px;color:#64748b">Link expires in 7 days. If you didn't request this, ignore this email.</p>
<p style="font-size:12px;color:#64748b">Quantum Surety LLC Â· (214) 666-8718 Â· quantumsurety.bond</p>`
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

// Dashboard â€” get all vendors with live bond status
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

// Alert check â€” expose for cron: GET /api/hoa/send-alerts?secret=xxx
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
        `âš ï¸ ${expiring.length} vendor bond(s) need attention â€” ${account.org_name}`,
        `<p>Hello${account.contact_name ? ' ' + account.contact_name : ''},</p>
<p>The following vendors in your <strong>${account.org_name}</strong> compliance list have expiring or expired bonds:</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">
<thead><tr style="background:#0a0f1e;color:#f59e0b"><th style="padding:8px 12px;text-align:left">Vendor</th><th style="padding:8px 12px;text-align:left">License #</th><th style="padding:8px 12px;text-align:left">Status</th><th style="padding:8px 12px;text-align:left">Expires</th></tr></thead>
<tbody>${rows}</tbody></table>
<p style="margin-top:20px"><a href="${loginUrl}" style="background:#0a0f1e;color:#f59e0b;padding:12px 24px;border-radius:7px;text-decoration:none;font-weight:bold;display:inline-block;">View Full Vendor Dashboard â†’</a></p>
<p style="font-size:12px;color:#64748b">Quantum Surety LLC Â· quantumsurety.bond</p>`
      );
      sent++;
    }
  }
  res.json({ ok: true, accounts_alerted: sent });
});

app.listen(PORT, '127.0.0.1', () => console.log(`Bond Verify running on port ${PORT}`));

// Public embed stats Ã¢â‚¬â€ used for social proof ("X sites embed this widget")
app.get('/api/embed-stats', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const [[totals]] = await pool.execute(
      'SELECT COUNT(DISTINCT referrer_domain) as sites, COUNT(*) as total_loads FROM badge_embed_log'
    );
    const [topDomains] = await pool.execute(
      'SELECT referrer_domain, COUNT(*) as loads FROM badge_embed_log GROUP BY referrer_domain ORDER BY loads DESC LIMIT 10'
    );
    res.json({ sites_embedding: totals.sites, total_badge_loads: totals.total_loads, top_domains: topDomains });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// --- Public Bond Watch API ----------------------------------------------------
// No API key required  used by Texas Bond Watch pages and widget embeds

app.use('/api/bond-watch', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// GET /api/bond-watch/summary  statewide snapshot
app.get('/api/bond-watch/summary', async (req, res) => {
  try {
    const [[notaries]] = await pool.execute(
      "SELECT COUNT(*) AS total, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)) AS expiring_30d, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 90 DAY)) AS expiring_90d, SUM(expire_date < NOW()) AS expired FROM notaries"
    );
    const [[contractors]] = await pool.execute(
      "SELECT COUNT(*) AS total, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)) AS expiring_30d, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 90 DAY)) AS expiring_90d, SUM(expire_date < NOW()) AS expired FROM contractors WHERE business_county IS NULL OR business_county != 'Out Of State'"
    );
    res.json({ notaries, contractors, generated_at: new Date().toISOString() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/bond-watch/counties  contractor expiration counts by county
app.get('/api/bond-watch/counties', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT business_county AS county, COUNT(*) AS total, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)) AS expiring_30d, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 90 DAY)) AS expiring_90d, SUM(expire_date < NOW()) AS expired FROM contractors WHERE business_county IS NOT NULL AND business_county != '' AND business_county != 'Out Of State' GROUP BY business_county ORDER BY expiring_90d DESC LIMIT 30"
    );
    res.json({ counties: rows, generated_at: new Date().toISOString() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/bond-watch/expiring?county=Harris&days=30&limit=20
app.get('/api/bond-watch/expiring', async (req, res) => {
  try {
    const county = req.query.county || '';
    const days   = Math.min(parseInt(req.query.days) || 30, 90);
    const limit  = Math.min(parseInt(req.query.limit) || 20, 50);
    const cond   = county ? 'AND business_county = ?' : '';
    const params = county ? [days, county, limit] : [days, limit];
    let qsql = "SELECT license_number, license_type, business_name, owner_name, business_city, business_county, expire_date FROM contractors WHERE expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)";
    if (county) { qsql += " AND business_county = ?"; }
    qsql += " ORDER BY expire_date ASC LIMIT ?";
    const [rows] = await pool.execute(qsql, params);
    res.json({ expiring: rows, county: county || 'All Texas', days, count: rows.length });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/bond-watch/recently-expired?days=30&limit=50&county=Harris
// Returns contractors whose bonds expired in the last N days (for live ticker)
app.get('/api/bond-watch/recently-expired', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const days  = Math.min(parseInt(req.query.days) || 30, 90);
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const county = req.query.county || '';
    let sql = "SELECT license_number, license_type, license_subtype, business_name, owner_name, business_city, business_county, expire_date, DATEDIFF(CURDATE(), expire_date) AS days_since_expiry FROM contractors WHERE expire_date BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY) AND CURDATE()";
    const params = [days];
    if (county) { sql += " AND business_county = ?"; params.push(county); }
    sql += " ORDER BY expire_date DESC LIMIT ?";
    params.push(limit);
    const [rows] = await pool.execute(sql, params);
    const mapped = rows.map(r => ({ ...r, days_until_expiry: -Math.abs(r.days_since_expiry || 0), status: 'expired' }));
    res.json({ contractors: mapped, county: county || 'All Texas', days, count: mapped.length });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/widget/embed-count -- public metric: how many external sites embed widget
app.get('/api/widget/embed-count', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const fs = require('fs');
  const LOG = '/var/www/bondverify/widget_embeds.log';
  try {
    const lines = fs.existsSync(LOG)
      ? fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean)
      : [];
    const byHost = {};
    for (const line of lines) {
      try {
        const { host } = JSON.parse(line);
        if (host) byHost[host] = (byHost[host] || 0) + 1;
      } catch(e) {}
    }
    const domains = Object.keys(byHost).sort((a, b) => byHost[b] - byHost[a]);
    res.json({
      unique_domains: domains.length,
      total_pings: lines.length,
      domains: domains.slice(0, 50),
    });
  } catch(e) {
    res.json({ unique_domains: 0, total_pings: 0, domains: [] });
  }
});

// GET /api/widget/embed-ping -- tracks external widget installs
app.get('/api/widget/embed-ping', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  const host = (req.query.host || '').slice(0, 200).replace(/[^a-zA-Z0-9._-]/g, '');
  if (host) {
    const fs = require('fs');
    const LOG = '/var/www/bondverify/widget_embeds.log';
    const entry = JSON.stringify({ host, ts: new Date().toISOString() }) + '\n';
    fs.appendFileSync(LOG, entry);
  }
  // Return 1x1 transparent GIF
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.send(gif);
});

// GET /api/notary/lookup/:notary_id - public notary commission lookup
app.get('/api/notary/lookup/:notary_id', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const [rows] = await pool.execute('SELECT * FROM notaries WHERE notary_id = ? LIMIT 1', [req.params.notary_id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const n = rows[0];
    const daysLeft = n.expire_date ? Math.max(0, Math.floor((new Date(n.expire_date) - Date.now()) / 86400000)) : -1;
    const status = daysLeft < 0 ? 'unknown' : daysLeft === 0 ? 'expired' : daysLeft <= 30 ? 'expiring' : 'active';
    res.json({ ...n, days_until_expiry: daysLeft, status });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/notary-renew?email=...  personalized renewal lookup (for campaign landing pages)
app.get('/api/notary-renew', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const email = (req.query.email || '').toLowerCase().trim();
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'invalid email' });
    const [rows] = await pool.execute(
      'SELECT notary_id, first_name, last_name, city, expire_date FROM notaries WHERE LOWER(email) = ? LIMIT 1',
      [email]
    );
    if (!rows.length) return res.json({ found: false });
    const n = rows[0];
    const daysLeft = Math.max(0, Math.floor((new Date(n.expire_date) - Date.now()) / 86400000));
    res.json({ found: true, notary_id: n.notary_id, first_name: n.first_name, last_name: n.last_name, city: n.city, expire_date: n.expire_date, days_left: daysLeft });
  } catch(e) { res.status(500).json({ error: e.message }); }
});


// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Bond Badge + Verification System Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// Contractors/notaries embed our badge on their site Ã¢â€ â€™ backlink + brand exposure

function bondBadgeSVG(name, status, expDate, type) {
  const safe = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const statusColors = { ACTIVE: '#059669', EXPIRING: '#d97706', EXPIRED: '#dc2626', UNKNOWN: '#6b7280' };
  const statusLabels = { ACTIVE: 'Ã¢Å“â€œ BOND ACTIVE', EXPIRING: 'Ã¢Å¡Â  EXPIRING SOON', EXPIRED: 'Ã¢Å“â€¢ BOND LAPSED', UNKNOWN: '? NOT FOUND' };
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
  const statusLabel = status === 'ACTIVE' ? 'Ã¢Å“â€œ BOND ACTIVE' : status === 'EXPIRING' ? 'Ã¢Å¡Â  EXPIRING SOON' : 'Ã¢Å“â€¢ BOND LAPSED';
  const renewHref = `https://quantumsurety.bond/get-bond?type=${type === 'notary' ? 'notary' : 'contractor'}&src=badge-verify`;
  const idLabel = type === 'notary' ? 'NOTARY ID' : 'LICENSE NUMBER';

  let bodyContent;
  if (data) {
    const expDisplay = new Date(data.expire_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const cityRow = data.city ? `<div class="field"><div class="field-label">CITY</div><div class="field-value">${safe(data.city)}</div></div>` : '';
    const daysRow = daysLeft > 0 ? `<div class="field"><div class="field-label">DAYS REMAINING</div><div class="field-value" style="color:${statusColor}">${daysLeft} days</div></div>` : '';
    const renewRow = status !== 'ACTIVE' ? `<div class="cta"><a href="${renewHref}">Renew Bond Now Ã¢â‚¬â€ $50 Ã¢â€ â€™</a></div>` : '';
    bodyContent = `
<div class="status-badge" style="background:${statusColor}1a;border-color:${statusColor}40;color:${statusColor}">${statusLabel}</div>
<div class="field"><div class="field-label">NAME</div><div class="field-value">${safe(name)}</div></div>
<div class="field"><div class="field-label">${idLabel}</div><div class="field-value">${safe(id)}</div></div>
${cityRow}
<div class="field"><div class="field-label">BOND EXPIRATION</div><div class="field-value" style="color:${statusColor}">${expDisplay}</div></div>
${daysRow}
<div class="embed-section">
<div class="embed-label">Share Your Verified Status</div>
<div class="share-row">
<a class="share-btn share-x" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('My bond is current \u2714\uFE0F Verified by @QuantumSurety \u2014 ' + name + ' | ' + 'https://verify.quantumsurety.bond/verify/' + type + '/' + id)}" target="_blank" rel="noopener">Share on X</a>
<a class="share-btn share-li" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://verify.quantumsurety.bond/verify/' + type + '/' + id)}" target="_blank" rel="noopener">Share on LinkedIn</a>
</div>
<div class="embed-label" style="margin-top:16px">Embed on Your Website</div>
<div class="embed-code" id="embedCode" onclick="copyEmbed()">${safe(badgeEmbed)}</div>
<button class="copy-btn" onclick="copyEmbed()">Copy HTML</button>
<script>function copyEmbed(){var c=document.getElementById('embedCode');navigator.clipboard&&navigator.clipboard.writeText(c.innerText).then(function(){document.querySelector('.copy-btn').textContent='Copied!';setTimeout(function(){document.querySelector('.copy-btn').textContent='Copy HTML';},2000);});}</script>
</div>
${renewRow}`;
  } else {
    bodyContent = `
<div class="status-badge" style="color:#6b7280;border-color:#6b7280;background:#6b728019">? NOT FOUND</div>
<p style="color:#8b949e;font-size:14px">No bond record found for ${type} ${safe(id)}.</p>
<div class="cta" style="margin-top:16px"><a href="https://verify.quantumsurety.bond">Search Again Ã¢â€ â€™</a></div>`;
  }

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bond Verification Ã¢â‚¬â€ ${safe(name || id)} | Quantum Surety</title>
<meta name="description" content="Verify the bond status of ${safe(name || id)} Ã¢â‚¬â€ ${type} license ${safe(id)}.">
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
.embed-label{font-size:11px;color:#8b949e;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
.embed-code{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:12px;font-family:monospace;font-size:10px;color:#4C9AC9;white-space:pre-wrap;word-break:break-all;cursor:pointer}
.copy-btn{display:inline-block;margin-top:8px;background:#21262d;border:1px solid #30363d;border-radius:5px;padding:5px 14px;font-size:11px;color:#8b949e;cursor:pointer;font-family:monospace}
.copy-btn:hover{background:#30363d;color:#e2e8f0}
.share-row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
.share-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none}
.share-x{background:#1d9bf0;color:#fff}
.share-li{background:#0a66c2;color:#fff}
.cta{margin-top:20px;text-align:center}
.cta a{display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:6px;font-weight:700;font-size:13px;text-decoration:none}
footer{margin-top:20px;text-align:center;font-size:11px;color:#475569}
footer a{color:#64748b}
</style>
</head><body><div class="card">
<div class="logo">QUANTUM SURETY Ã¢â‚¬â€ BOND VERIFICATION</div>
${bodyContent}
<footer>Verified by <a href="https://quantumsurety.bond">Quantum Surety LLC</a> Ã‚Â· Texas-Licensed Surety Agency Ã‚Â· Data from TX SOS &amp; TDLR</footer>
</div></body></html>`;
}

// Track external domain embeds for measuring widget adoption
async function logBadgeEmbed(notaryId, contractorId, req) {
  try {
    const ref = req.headers['referer'] || req.headers['referrer'] || '';
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.connection.remoteAddress || '';
    if (!ref || ref.includes('quantumsurety.bond') || ref.includes('mail.google') || ref.includes('outlook')) return;
    let domain = '';
    try { domain = new URL(ref).hostname; } catch { return; }
    if (!domain || domain === 'verify.quantumsurety.bond') return;
    await pool.execute(
      'INSERT INTO badge_embed_log (notary_id, contractor_id, referrer_domain, ip) VALUES (?, ?, ?, ?)',
      [notaryId || null, contractorId || null, domain, ip.substring(0, 45)]
    );
  } catch (e) { /* non-critical */ }
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
    logBadgeEmbed(id, null, req);
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
    logBadgeEmbed(null, id, req);
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

// GET /api/contractor/lookup/:license_number  public (no key required)
app.get('/api/contractor/lookup/:license_number', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM contractors WHERE license_number = ? LIMIT 1',
      [req.params.license_number]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const c = rows[0];
    const daysLeft = c.expire_date ? Math.max(0, Math.floor((new Date(c.expire_date) - Date.now()) / 86400000)) : -1;
    const status = daysLeft < 0 ? 'unknown' : daysLeft === 0 ? 'expired' : daysLeft <= 30 ? 'expiring' : 'active';
    res.json({ ...c, days_until_expiry: daysLeft, status });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/verify/contractor/:id', async (req, res) => {
  try {
    const id = req.params.id.replace(/[^A-Za-z0-9\-]/g, '').substring(0, 20);
    const [rows] = await pool.execute('SELECT business_name, owner_name, city, expire_date FROM contractors WHERE license_number = ? LIMIT 1', [id]);
    res.setHeader('Content-Type', 'text/html');
    res.send(verifyPageHTML(rows[0] || null, 'contractor', id));
  } catch (e) { res.status(500).send('Error'); }
});


// --- widget embed route ---

// ============================================================
// EMBEDDABLE COUNTY STATS WIDGET Ã¢â‚¬â€ any site can embed with one line:
// <script src="https://verify.quantumsurety.bond/county-stats.js?county=harris"></script>
// ============================================================
app.get('/county-stats.js', async (req, res) => {
  const county = (req.query.county || '').replace(/[^a-zA-Z\s]/g, '').trim();
  if (!county) return res.status(400).send('// county parameter required');

  try {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total, ' +
      'SUM(CASE WHEN expire_date < CURDATE() THEN 1 ELSE 0 END) as expired, ' +
      'SUM(CASE WHEN expire_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as expiring_30d ' +
      'FROM contractors WHERE LOWER(business_county) = LOWER(?)',
      [county]
    );
    const d = rows[0];
    const pct = d.total > 0 ? ((d.expired / d.total) * 100).toFixed(1) : '0';
    const countyDisplay = county.charAt(0).toUpperCase() + county.slice(1).toLowerCase();
    const verifyLink = 'https://quantumsurety.bond/texas-bond-watch?county=' + encodeURIComponent(county);
    const homeLink = 'https://quantumsurety.bond';

    const js = `(function(){
var d=document,el=d.createElement('div');
el.id='qs-bond-widget';
el.style.cssText='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;border:1px solid #334155;border-radius:10px;padding:16px 20px;max-width:320px;background:#0a0f1e;color:#f1f5f9;';
el.innerHTML='<div style="font-size:10px;letter-spacing:3px;color:#f59e0b;font-family:monospace;margin-bottom:8px;">TEXAS BOND WATCH</div>'
+'<div style="font-size:15px;font-weight:700;margin-bottom:12px;">${countyDisplay} County Contractor Bonds</div>'
+'<div style="display:flex;gap:10px;margin-bottom:12px;">'
+'<div style="flex:1;background:#1e293b;border-radius:8px;padding:10px;text-align:center;">'
+'<div style="font-size:22px;font-weight:800;color:#dc2626;">${d.expired}</div>'
+'<div style="font-size:10px;color:#94a3b8;margin-top:2px;">EXPIRED</div></div>'
+'<div style="flex:1;background:#1e293b;border-radius:8px;padding:10px;text-align:center;">'
+'<div style="font-size:22px;font-weight:800;color:#d97706;">${d.expiring_30d}</div>'
+'<div style="font-size:10px;color:#94a3b8;margin-top:2px;">EXPIRING 30D</div></div>'
+'<div style="flex:1;background:#1e293b;border-radius:8px;padding:10px;text-align:center;">'
+'<div style="font-size:22px;font-weight:800;color:#64748b;">${pct}%</div>'
+'<div style="font-size:10px;color:#94a3b8;margin-top:2px;">LAPSED</div></div>'
+'</div>'
+'<a href="${verifyLink}" target="_blank" style="display:block;text-align:center;background:#f59e0b;color:#000;font-weight:700;font-size:12px;padding:8px;border-radius:6px;text-decoration:none;">Verify a Contractor Ã¢â€ â€™ Texas Bond Watch</a>'
+'<div style="font-size:9px;color:#475569;margin-top:8px;text-align:center;">Live TDLR data Ã‚Â· Updated daily Ã‚Â· <a href="${homeLink}" target="_blank" style="color:#64748b;">quantumsurety.bond</a></div>';
var scripts=document.querySelectorAll('script[src*="widget.js"]');
var s=scripts[scripts.length-1];
if(s&&s.parentNode)s.parentNode.insertBefore(el,s.nextSibling);
else document.body.appendChild(el);
})();`;

    res.set('Content-Type', 'application/javascript');
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Access-Control-Allow-Origin', '*');
    res.send(js);
  } catch(e) {
    console.error('[widget] error:', e.message);
    res.status(500).send('// Error loading bond data');
  }
});

// â”€â”€ GDN Dealer Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/api/dealer-search', async (req, res) => {
  try {
    const { q, city, type, status } = req.query;
    if (!q || q.trim().length < 2) return res.json({ results: [], total: 0 });
    const search = `%${q.trim()}%`;
    const conditions = ['(business_name LIKE ? OR dba_name LIKE ? OR license_number = ?)'];
    const params = [search, search, q.trim()];
    if (city)   { conditions.push('city LIKE ?');         params.push(`%${city}%`); }
    if (type)   { conditions.push('license_type LIKE ?'); params.push(`%${type}%`); }
    if (status) { conditions.push('license_status = ?');  params.push(status); }
    params.push(50);
    const [rows] = await pool.execute(
      `SELECT * FROM auto_dealers WHERE ${conditions.join(' AND ')} ORDER BY license_expiration DESC LIMIT ?`, params
    );
    const results = rows.map(r => {
      const exp = r.license_expiration ? new Date(r.license_expiration) : null;
      const daysLeft = exp ? Math.floor((exp - new Date()) / 86400000) : null;
      let bondStatus = 'unknown';
      if (daysLeft === null) bondStatus = 'unknown';
      else if (daysLeft < 0) bondStatus = 'expired';
      else if (daysLeft <= 60) bondStatus = 'expiring';
      else bondStatus = 'active';
      return { ...r, bondStatus, daysLeft };
    });
    res.json({ results, total: results.length });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Search failed' }); }
});

// GDN dealer verify page (shareable URL)
app.get('/verify/dealer/:license', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM auto_dealers WHERE license_number = ? LIMIT 1', [req.params.license]);
    if (!rows.length) return res.status(404).send('<html><body><h2>Dealer not found</h2><p><a href="/">Search dealers</a></p></body></html>');
    const d = rows[0];
    const exp = d.license_expiration ? new Date(d.license_expiration) : null;
    const daysLeft = exp ? Math.floor((exp - new Date()) / 86400000) : null;
    const isActive = daysLeft !== null && daysLeft >= 0;
    const statusColor = daysLeft === null ? '#94a3b8' : daysLeft < 0 ? '#ef4444' : daysLeft <= 60 ? '#f97316' : '#22c55e';
    const statusText = daysLeft === null ? 'Unknown' : daysLeft < 0 ? 'EXPIRED' : daysLeft <= 60 ? `Expiring in ${daysLeft} days` : 'Active & Bonded';
    const expStr = exp ? exp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown';
    const renewCTA = !isActive
      ? `<a href="https://quantumsurety.bond/get-bond?type=dealer&license=${encodeURIComponent(d.license_number)}" style="display:inline-block;background:#f59e0b;color:#000;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:16px;margin-top:8px">Renew GDN Bond Now â†’</a>`
      : `<a href="https://quantumsurety.bond/get-bond?type=dealer" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;margin-top:8px">Get a Quote from Quantum Surety</a>`;
    res.send(`<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.business_name} â€” Texas GDN Bond Verification | Quantum Surety</title>
<meta name="description" content="Verify the GDN dealer bond status for ${d.business_name} in ${d.city}, Texas. License #${d.license_number}.">
<meta property="og:title" content="${d.business_name} â€” Texas Dealer Bond Status">
<meta property="og:description" content="GDN Bond Status: ${statusText} | License expires ${expStr}">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0f1e;color:#f1f5f9;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:32px 16px}
.card{background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:32px;max-width:580px;width:100%}
.logo{color:#f59e0b;font-size:11px;letter-spacing:3px;font-weight:700;margin-bottom:24px}
.status-badge{display:inline-block;padding:6px 16px;border-radius:9999px;font-size:13px;font-weight:700;letter-spacing:.5px;background:${statusColor}22;color:${statusColor};border:1px solid ${statusColor}44;margin-bottom:20px}
h1{font-size:26px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:6px}
.dba{color:#94a3b8;font-size:14px;margin-bottom:20px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:24px 0}
.field{background:#1e293b;border-radius:10px;padding:14px}
.field-label{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.field-value{font-size:14px;color:#e2e8f0;font-weight:500}
.cta{margin-top:24px;text-align:center;padding-top:20px;border-top:1px solid #1e293b}
.search-link{display:block;text-align:center;margin-top:16px;color:#64748b;font-size:13px;text-decoration:none}
.search-link:hover{color:#94a3b8}
</style>
</head><body>
<div class="card">
  <div class="logo">QUANTUM SURETY Â· TEXAS DEALER BOND VERIFICATION</div>
  <span class="status-badge">${statusText}</span>
  <h1>${d.business_name}</h1>
  ${d.dba_name ? `<div class="dba">DBA: ${d.dba_name}</div>` : ''}
  <div class="grid">
    <div class="field"><div class="field-label">GDN License #</div><div class="field-value">${d.license_number || 'â€”'}</div></div>
    <div class="field"><div class="field-label">Bond Expires</div><div class="field-value" style="color:${statusColor}">${expStr}</div></div>
    <div class="field"><div class="field-label">License Type</div><div class="field-value">${d.license_type || 'â€”'}</div></div>
    <div class="field"><div class="field-label">Status</div><div class="field-value">${d.license_status || 'â€”'}</div></div>
    <div class="field"><div class="field-label">City</div><div class="field-value">${d.city || 'â€”'}, TX</div></div>
    <div class="field"><div class="field-label">County</div><div class="field-value">${d.county || 'â€”'}</div></div>
  </div>
  <div class="cta">
    ${renewCTA}
    <p style="color:#64748b;font-size:12px;margin-top:12px">Data sourced from TxDMV Â· Updated monthly</p>
  </div>
</div>
<a href="https://verify.quantumsurety.bond" class="search-link">â† Search all Texas dealers & notaries</a>
</body></html>`);
  } catch(e) { console.error(e); res.status(500).send('Error'); }
});

// GDN dealer badge (embeddable SVG/JS for dealer websites)
app.get('/api/badge/dealer/:license', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM auto_dealers WHERE license_number = ? LIMIT 1', [req.params.license]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const d = rows[0];
    const exp = d.license_expiration ? new Date(d.license_expiration) : null;
    const daysLeft = exp ? Math.floor((exp - new Date()) / 86400000) : null;
    const isActive = daysLeft !== null && daysLeft >= 0;
    const color = isActive ? '#22c55e' : '#ef4444';
    const label = isActive ? 'GDN Bond Active' : 'GDN Bond Expired';
    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Access-Control-Allow-Origin', '*');
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="32">
  <rect width="200" height="32" rx="4" fill="#0a0f1e"/>
  <rect x="1" y="1" width="198" height="30" rx="3" fill="none" stroke="${color}" stroke-width="1" stroke-opacity="0.6"/>
  <circle cx="16" cy="16" r="5" fill="${color}"/>
  <text x="28" y="12" font-family="Arial,sans-serif" font-size="9" fill="#94a3b8" font-weight="600" letter-spacing="1">QUANTUM SURETY</text>
  <text x="28" y="24" font-family="Arial,sans-serif" font-size="11" fill="${color}" font-weight="700">${label}</text>
</svg>`);
  } catch(e) { res.status(500).send(''); }
});
