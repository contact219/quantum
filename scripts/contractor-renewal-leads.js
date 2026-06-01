// contractor-renewal-leads.js
// Finds Texas contractors expiring in 60 days and creates CRM leads
// for the drip campaign system to handle outreach.
require('dotenv').config({ path: '/var/www/bondverify/.env' });
const mysql = require('mysql2/promise');
const https = require('https');

const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASS, database: process.env.DB_NAME,
  waitForConnections: true, connectionLimit: 5, timezone: '+00:00'
});

// Bond type map from TDLR license types
function bondType(licenseType) {
  const lt = (licenseType || '').toLowerCase();
  if (lt.includes('electrical')) return 'contractor';
  if (lt.includes('plumb')) return 'contractor';
  if (lt.includes('hvac') || lt.includes('air condition')) return 'contractor';
  if (lt.includes('general') || lt.includes('builder')) return 'construction';
  return 'contractor';
}

async function createCRMLead(lead) {
  return new Promise((resolve) => {
    const data = JSON.stringify(lead);
    const req = https.request({
      hostname: 'quantumsurety.bond',
      path: '/api/leads',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', () => resolve(0));
    req.write(data);
    req.end();
  });
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  // Get contractors expiring in 60 days with phone numbers
  const [rows] = await pool.execute(`
    SELECT
      c.license_number, c.license_type, c.business_name, c.owner_name,
      c.business_phone, c.owner_phone, c.business_city, c.business_county, c.expire_date
    FROM contractors c
    WHERE c.expire_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
      AND (c.business_phone IS NOT NULL OR c.owner_phone IS NOT NULL)
      AND NOT EXISTS (
        SELECT 1 FROM renewal_outreach r
        WHERE r.recipient_type = 'contractor'
          AND r.recipient_id = c.license_number
          AND r.days_before = 60
          AND r.bond_expire_date = c.expire_date
      )
    LIMIT 500
  `);

  console.log(`Found ${rows.length} contractors to pipeline`);
  let created = 0;

  for (const row of rows) {
    const phone = row.business_phone || row.owner_phone;
    const name = row.business_name || row.owner_name || 'Texas Contractor';
    const city = row.business_city || row.business_county || 'Texas';

    const status = await createCRMLead({
      name,
      email: `${row.license_number.toLowerCase().replace(/[^a-z0-9]/g,'.')}@contractor.tdlr.texas.gov`,
      phone,
      bond_type: bondType(row.license_type),
      source: 'tdlr_renewal',
      notes: `TDLR License: ${row.license_number} | Type: ${row.license_type} | Expires: ${row.expire_date} | City: ${city} | Auto-generated renewal lead`
    });

    if (status === 200 || status === 201) {
      await pool.execute(`
        INSERT IGNORE INTO renewal_outreach (recipient_type, recipient_id, email, days_before, bond_expire_date)
        VALUES ('contractor', ?, ?, 60, ?)
      `, [row.license_number, phone, row.expire_date]);
      created++;
    }

    if (created % 50 === 0 && created > 0) {
      console.log(`  Pipelined ${created} contractor leads`);
      await sleep(1000);
    }
  }

  console.log(`Contractor renewal pipeline: ${created} leads created`);
  await pool.end();
  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
