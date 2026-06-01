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
  waitForConnections: true, connectionLimit: 10
});

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET }
});

const ADMIN_PASS = process.env.ADMIN_PASS || 'QSAdmin2026!';
const BASE_URL = 'https://partners.quantumsurety.bond';

async function sendEmail(to, subject, html) {
  try {
    await ses.send(new SendEmailCommand({
      Source: 'alerts@quantumsurety.bond',
      Destination: { ToAddresses: [to] },
      Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } }
    }));
  } catch(e) { console.error('SES:', e.message); }
}

function makeCode(name) {
  const base = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `QS-${base}${rand}`;
}

function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}
const BOND_TYPE_KEYS = {
  'Texas Notary Bond': 'notary',
  'Texas GDN Dealer Bond': 'dealer',
  'Texas Contractor License Bond': 'contractor',
  'Texas Construction Bond': 'construction',
  'Texas Performance Bond': 'performance',
  'Texas Performance & Payment Bond': 'performance',
  'Texas Bid Bond': 'bid',
  'Texas Mortgage Broker Bond': 'mortgage',
  'Texas License & Permit Bond': 'license',
  'Texas Credit Access Business Bond': 'credit-access-business',
  'Texas Collection Agency Bond': 'collection-agency',
  'Texas Property Tax Consultant Bond': 'property-tax-consultant',
};



// Middleware: require partner session token (any non-suspended partner)
async function requirePartner(req, res, next) {
  const token = req.headers['x-partner-token'] || req.query.token;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  const [rows] = await pool.execute(
    'SELECT * FROM partners WHERE token = ? AND token_expires > NOW()',
    [token]
  );
  if (!rows.length) return res.status(401).json({ error: 'Login link expired. Request a new one from the partner portal.' });
  const p = rows[0];
  if (p.status === 'suspended') return res.status(403).json({ error: 'Account suspended. Contact partners@quantumsurety.bond' });
  req.partner = p;
  next();
}

// Middleware: require admin
function requireAdmin(req, res, next) {
  const pass = req.headers['x-admin-pass'] || req.body?.admin_pass;
  if (pass !== ADMIN_PASS) return res.status(401).json({ error: 'Admin access required' });
  next();
}

// ── Public routes ──────────────────────────────────────────────────────────────

// Partner registration — auto-activates immediately, sends dashboard link
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, company, phone } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

    const [existing] = await pool.execute('SELECT id FROM partners WHERE email = ?', [email.toLowerCase()]);
    if (existing.length) return res.status(409).json({ error: 'Email already registered. Use Partner Login to access your dashboard.' });

    const code = makeCode(name);
    const token = makeToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day welcome token

    await pool.execute(
      'INSERT INTO partners (name, email, company, phone, referral_code, status, token, token_expires) VALUES (?, ?, ?, ?, ?, "active", ?, ?)',
      [name.trim(), email.toLowerCase(), company || '', phone || '', code, token, expires]
    );

    const refLink = `https://quantumsurety.bond/get-bond?ref=${code}`;
    const dashLink = `${BASE_URL}/dashboard.html?token=${token}`;

    // Notify admin of new partner
    await sendEmail('contact219@gmail.com', `New Partner Signup — ${name}`,
      `<p><strong>New partner registered:</strong><br>
       Name: ${name}<br>Email: ${email}<br>Company: ${company || '—'}<br>Phone: ${phone || '—'}<br>
       Referral code: ${code}</p>`
    );

    // Welcome email with immediate dashboard access
    await sendEmail(email, 'Welcome to the Quantum Surety Partner Program — You\'re Active!',
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff">
        <img src="https://quantumsurety.bond/QS_Logo.png" width="40" style="margin-bottom:16px">
        <h2 style="color:#0f172a">Welcome, ${name}! You're all set.</h2>
        <p style="color:#475569">Your Quantum Surety partner account is <strong>active</strong>. Start sharing your referral link right now to earn commissions on every bond sold.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.04em">Your Referral Code</p>
          <code style="font-size:24px;color:#f59e0b;font-weight:800;letter-spacing:.05em">${code}</code>
          <p style="margin:14px 0 4px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.04em">Your Referral Link</p>
          <a href="${refLink}" style="color:#3b82f6;font-size:14px;word-break:break-all">${refLink}</a>
          <p style="margin:10px 0 0;font-size:13px;color:#94a3b8">Share this link anywhere — when clients buy a bond, you earn up to 25% commission based on your sales volume.</p>
        </div>
        <a href="${dashLink}" style="display:inline-block;margin:4px 0 20px;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px">Open My Dashboard &rarr;</a>
        <p style="color:#94a3b8;font-size:12px">This link logs you in for 7 days. After that, request a new login link from the partner portal.<br>
        Questions? <a href="mailto:partners@quantumsurety.bond" style="color:#94a3b8">partners@quantumsurety.bond</a></p>
      </div>`
    );

    res.json({ success: true, referral_code: code, referral_link: refLink, dashboard_link: dashLink });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Registration failed' }); }
});

// Magic link login request
app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const [rows] = await pool.execute('SELECT * FROM partners WHERE email = ?', [email.toLowerCase()]);
    if (!rows.length) return res.json({ success: true }); // silent — don't reveal existence
    const p = rows[0];
    if (p.status === 'suspended') return res.status(403).json({ error: 'Account suspended. Contact partners@quantumsurety.bond' });

    const token = makeToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await pool.execute('UPDATE partners SET token = ?, token_expires = ? WHERE id = ?', [token, expires, p.id]);

    const loginUrl = `${BASE_URL}/dashboard.html?token=${token}`;
    await sendEmail(email, 'Your Quantum Surety Partner Login Link',
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://quantumsurety.bond/QS_Logo.png" width="40" style="margin-bottom:16px">
        <h2 style="color:#0f172a">Your Partner Dashboard Login</h2>
        <p style="color:#475569">Click the button below to access your partner dashboard. This link expires in 24 hours.</p>
        <a href="${loginUrl}" style="display:inline-block;margin:20px 0;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px">Open My Dashboard &rarr;</a>
        <p style="color:#94a3b8;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>`
    );
    res.json({ success: true });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Login failed' }); }
});

// ── Partner-authenticated routes ──────────────────────────────────────────────


// Commission tier auto-upgrade
async function upgradeTierIfEarned(partnerId) {
  const [rows] = await pool.execute('SELECT total_referrals, commission_rate FROM partners WHERE id = ?', [partnerId]);
  if (!rows.length) return;
  const { total_referrals: sales, commission_rate: current } = rows[0];
  let newRate = parseFloat(current);
  if (sales >= 100 && newRate < 25) newRate = 25;
  else if (sales >= 25 && newRate < 20) newRate = 20;
  else if (newRate < 15) newRate = 15;
  if (newRate !== parseFloat(current)) {
    await pool.execute('UPDATE partners SET commission_rate = ? WHERE id = ?', [newRate, partnerId]);
  }
}

// Marketing assets
app.get('/api/assets', async (req, res) => {
  const token = req.headers['x-partner-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const [rows] = await pool.execute('SELECT * FROM partners WHERE token = ? AND token_expires > NOW()', [token]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid or expired token' });
  const p = rows[0];
  const refLink = 'https://quantumsurety.bond/?ref=' + p.referral_code;
  res.json({
    referral_link: refLink,
    commission_rate: p.commission_rate,
    tier: p.commission_rate >= 25 ? 'Gold' : p.commission_rate >= 20 ? 'Silver' : 'Standard',
    assets: [
      { type: 'email', name: 'Notary Bond Referral Email', subject: 'Quick way to protect your notary commission', body: 'Hi [Name], wanted to share a resource — Quantum Surety lets Texas notaries get bonded in minutes for 0. I refer my clients there. Here is the link: ' + refLink },
      { type: 'email', name: 'Contractor Bond Referral Email', subject: 'Texas contractor bond — fast and affordable', body: 'Hi [Name], if you or someone you know needs a Texas contractor bond, Quantum Surety handles it same-day. Get a quote here: ' + refLink },
      { type: 'badge', name: 'Website Badge HTML', code: '<a href="' + refLink + '"><img src="https://quantumsurety.bond/partner-badge.png" alt="Quantum Surety Partner" width="180"/></a>' },
      { type: 'social', name: 'LinkedIn Post', text: 'Need a Texas surety bond? Quantum Surety issues bonds in minutes — notary, contractor, dealer and more. Check it out: ' + refLink },
      { type: 'social', name: 'Short Post', text: 'Get your Texas surety bond in minutes ' + refLink }
    ],
    tiers: [
      { tier: 'Standard', min_sales: 0, rate: 15 },
      { tier: 'Silver', min_sales: 25, rate: 20 },
      { tier: 'Gold', min_sales: 100, rate: 25 }
    ]
  });
});

app.get('/api/me', requirePartner, async (req, res) => {
  const p = req.partner;
  const [refs] = await pool.execute('SELECT * FROM referrals WHERE partner_id = ? ORDER BY created_at DESC LIMIT 50', [p.id]);
  const refLink = `https://quantumsurety.bond/get-bond?ref=${p.referral_code}`;
  res.json({
    id: p.id, name: p.name, email: p.email, company: p.company,
    referral_code: p.referral_code, referral_link: refLink,
    commission_rate: p.commission_rate, status: p.status,
    total_referrals: p.total_referrals, total_earned: p.total_earned,
    referrals: refs
  });
});

app.post('/api/referrals', requirePartner, async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, bond_type, notes } = req.body;
    if (!customer_name) return res.status(400).json({ error: 'Customer name required' });
    await pool.execute(
      'INSERT INTO referrals (partner_id, customer_name, customer_email, customer_phone, bond_type, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [req.partner.id, customer_name, customer_email || '', customer_phone || '', bond_type || '', notes || '']
    );
    await pool.execute('UPDATE partners SET total_referrals = total_referrals + 1 WHERE id = ?', [req.partner.id]);
    const typeKey = BOND_TYPE_KEYS[bond_type] || '';
    const applyLink = `https://quantumsurety.bond/get-bond?ref=${req.partner.referral_code}${typeKey ? '&type=' + typeKey : ''}`;

    await sendEmail('contact219@gmail.com', `New Partner Referral — ${req.partner.name}`,
      `<p>Partner: ${req.partner.name} (${req.partner.email})<br>
       Customer: ${customer_name} / ${customer_email} / ${customer_phone}<br>
       Bond type: ${bond_type || 'not specified'}<br>
       Notes: ${notes || ''}<br>
       Apply link: <a href="${applyLink}">${applyLink}</a></p>`
    );

    if (customer_email) {
      await sendEmail(customer_email, `${req.partner.name} referred you to Quantum Surety`,
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff">
          <img src="https://quantumsurety.bond/QS_Logo.png" width="40" style="margin-bottom:16px">
          <h2 style="color:#0f172a">You've been referred for a ${bond_type || 'surety bond'}!</h2>
          <p style="color:#475569">${req.partner.name} referred you to Quantum Surety for a
          <strong>${bond_type || 'surety bond'}</strong>. Click below to get your free quote — no obligation:</p>
          <a href="${applyLink}" style="display:inline-block;margin:20px 0;background:#f59e0b;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px">Get My Free Quote &rarr;</a>
          <p style="color:#64748b;font-size:13px">Questions? Call us at (972) 379-9216 or reply to this email.</p>
          <p style="color:#94a3b8;font-size:12px">Quantum Surety LLC &bull; TDI Licensed #3480229 &bull; Wylie, TX</p>
        </div>`
      );
    }
    res.json({ success: true });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Failed to submit referral' }); }
});

// ── Admin routes ───────────────────────────────────────────────────────────────

app.get('/api/admin/partners', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM partners ORDER BY created_at DESC');
    res.json({ partners: rows });
  } catch(e) { res.status(500).json({ error: 'Failed' }); }
});

app.patch('/api/admin/partners/:id', requireAdmin, async (req, res) => {
  try {
    const { status, commission_rate } = req.body;
    if (status) await pool.execute('UPDATE partners SET status = ? WHERE id = ?', [status, req.params.id]);
    if (commission_rate !== undefined) await pool.execute('UPDATE partners SET commission_rate = ? WHERE id = ?', [commission_rate, req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/admin/referrals', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.*, p.name as partner_name, p.email as partner_email, p.referral_code
       FROM referrals r JOIN partners p ON r.partner_id = p.id ORDER BY r.created_at DESC LIMIT 200`
    );
    res.json({ referrals: rows });
  } catch(e) { res.status(500).json({ error: 'Failed' }); }
});

app.patch('/api/admin/referrals/:id', requireAdmin, async (req, res) => {
  try {
    const { status, sale_amount, notes } = req.body;
    const [existing] = await pool.execute('SELECT * FROM referrals WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: 'Not found' });
    const ref = existing[0];

    if (sale_amount !== undefined) {
      const [prows] = await pool.execute('SELECT commission_rate FROM partners WHERE id = ?', [ref.partner_id]);
      const rate = prows[0]?.commission_rate || 15;
      const commission = (parseFloat(sale_amount) * parseFloat(rate) / 100).toFixed(2);
      await pool.execute(
        'UPDATE referrals SET status = ?, sale_amount = ?, commission_amount = ?, notes = ? WHERE id = ?',
        [status || ref.status, sale_amount, commission, notes || ref.notes, req.params.id]
      );
      if (status === 'sold') {
        await pool.execute('UPDATE partners SET total_earned = total_earned + ? WHERE id = ?', [commission, ref.partner_id]);
      }
    } else {
      await pool.execute('UPDATE referrals SET status = ?, notes = ? WHERE id = ?',
        [status || ref.status, notes || ref.notes, req.params.id]);
    }
    res.json({ success: true });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});

const PORT = process.env.PARTNER_PORT || 3002;
app.listen(PORT, '127.0.0.1', () => console.log(`Partner Portal running on port ${PORT}`));
