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

async function sendEmail(to, subject, html) {
  try {
    await ses.send(new SendEmailCommand({
      Source: 'alerts@quantumsurety.bond',
      Destination: { ToAddresses: [to] },
      Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } }
    }));
  } catch(e) { console.error('SES:', e.message); }
}

// ─── Notary endpoints ────────────────────────────────────────────────────────

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
    res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date) })), total: rows.length });
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
    await sendEmail(email, 'Bond Renewal Alert Confirmed — Quantum Surety',
      `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <img src="https://quantumsurety.bond/QS_Logo.png" width="40" style="margin-bottom:16px">
        <h2 style="color:#0f172a;margin:0 0 8px">You're set, ${n.first_name}!</h2>
        <p style="color:#475569">We'll remind you before your Texas notary bond expires.</p>
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0">
          <p style="margin:0;font-size:14px;color:#64748b">Notary ID: <strong style="color:#0f172a">${n.notary_id}</strong></p>
          <p style="margin:6px 0 0;font-size:14px;color:#64748b">Bond expires: <strong style="color:#0f172a">${expStr}</strong></p>
        </div>
        <p style="color:#475569;font-size:14px">When it's time to renew, we'll send a link to renew instantly at <strong>$50</strong>.</p>
        <a href="https://quantumsurety.bond/bonds/notary-bond" style="display:inline-block;margin-top:16px;background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;font-weight:700;text-decoration:none">Renew Now — $50 Instant</a>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">Quantum Surety · <a href="https://quantumsurety.bond" style="color:#94a3b8">quantumsurety.bond</a></p>
      </div>`
    );
    res.json({ success: true });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Subscription failed' }); }
});

// ─── Contractor endpoints ─────────────────────────────────────────────────────

// Public contractor search — no key required
app.get('/api/contractor-search', async (req, res) => {
  try {
    const { q, county, type } = req.query;
    if (!q) return res.json({ results: [], total: 0 });
    const terms = q.trim().split(/\s+/);
    const conditions = [];
    const params = [];

    if (terms.length >= 2) {
      // Likely "first last" — try owner name split
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
    res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date) })), total: rows.length });
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
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">Quantum Surety API · <a href="https://verify.quantumsurety.bond" style="color:#94a3b8">verify.quantumsurety.bond</a></p>
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

// ─── API v1 — notary ──────────────────────────────────────────────────────────

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
  res.json({ ...r, ...statusInfo(r.expire_date), api_requests_remaining: 1000 - req.apiKey.requests_today });
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
  res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date) })), total: rows.length,
    api_requests_remaining: 1000 - req.apiKey.requests_today });
});

// ─── API v1 — contractor ──────────────────────────────────────────────────────

app.get('/api/v1/contractor/lookup/:license_number', requireKey, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contractors WHERE license_number = ?', [req.params.license_number]);
    if (!rows.length) return res.status(404).json({ error: 'License not found' });
    const r = rows[0];
    res.json({ ...r, ...statusInfo(r.expire_date), api_requests_remaining: 1000 - req.apiKey.requests_today });
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
    res.json({ results: rows.map(r => ({ ...r, ...statusInfo(r.expire_date) })), total: rows.length,
      api_requests_remaining: 1000 - req.apiKey.requests_today });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Search failed' }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '127.0.0.1', () => console.log(`Bond Verify running on port ${PORT}`));

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
