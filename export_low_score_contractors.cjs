#!/usr/bin/env node
/**
 * Export Low-QS-Score Contractors from the VPS bondverify database.
 * Outputs contractor_blast_list.csv — then enrich with email addresses
 * before running contractor_score_blast.cjs.
 *
 * Usage: node export_low_score_contractors.cjs [--max-score N] [--limit N] [--county COUNTY]
 *
 * Enrichment options (pick one):
 *   1. Apollo.io free tier — search by business name + city
 *   2. Hunter.io domain search — if you know their website domain
 *   3. Google "[business name] [city] TX email contact"
 *   4. LinkedIn Sales Navigator (paid)
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_SCORE_IDX = process.argv.indexOf('--max-score');
const MAX_SCORE = MAX_SCORE_IDX >= 0 ? parseInt(process.argv[MAX_SCORE_IDX + 1]) : 54;
const LIMIT_IDX = process.argv.indexOf('--limit');
const LIMIT = LIMIT_IDX >= 0 ? parseInt(process.argv[LIMIT_IDX + 1]) : 5000;
const COUNTY_IDX = process.argv.indexOf('--county');
const COUNTY = COUNTY_IDX >= 0 ? process.argv[COUNTY_IDX + 1] : null;

const VPS_HOST = 'root@130.51.23.147';
const VPS_PW   = process.env.VPS_PASSWORD;
const DB_USER  = 'bondverify';
const DB_PW    = process.env.BONDVERIFY_DB_PASS;
const DB_NAME  = 'bondverify';
const OUT_FILE = path.join(__dirname, 'contractor_blast_list.csv');

// QS Score logic (mirrors server.js calculateQSScore)
function calculateQSScore(row) {
  let score = 0;

  // Bond Health (0-60 pts)
  const now = new Date();
  const exp = row.expire_date ? new Date(row.expire_date) : null;
  if (!exp) {
    score += 0;
  } else if (exp > now) {
    const daysLeft = (exp - now) / 86400000;
    if (daysLeft > 365)      score += 60;
    else if (daysLeft > 180) score += 55;
    else if (daysLeft > 90)  score += 50;
    else if (daysLeft > 30)  score += 40;
    else                     score += 25;
  } else {
    const daysExpired = (now - exp) / 86400000;
    if (daysExpired <= 7)   score += 10;
    else if (daysExpired <= 30) score += 5;
    else                    score += 0;
  }

  // License Type rigor (0-20 pts)
  const licType = (row.license_type || '').toLowerCase();
  if (licType.includes('master') || licType.includes('journeyman')) score += 20;
  else if (licType.includes('contractor') || licType.includes('responsible')) score += 15;
  else if (licType.includes('apprentice') || licType.includes('student')) score += 10;
  else score += 12;

  // Profile completeness (0-20 pts)
  let prof = 0;
  if (row.owner_name)       prof += 5;
  if (row.business_name)    prof += 5;
  if (row.business_city)    prof += 5;
  if (row.business_county)  prof += 5;
  score += prof;

  score = Math.min(100, Math.max(0, Math.round(score)));

  let grade, label;
  if (score >= 85)      { grade = 'A+'; label = 'QS Verified'; }
  else if (score >= 70) { grade = 'A';  label = 'Trusted'; }
  else if (score >= 55) { grade = 'B';  label = 'Active'; }
  else if (score >= 40) { grade = 'C';  label = 'Compliant'; }
  else if (score >= 25) { grade = 'D';  label = 'At Risk'; }
  else                  { grade = 'F';  label = 'Non-Compliant'; }

  return { qs_score: score, qs_grade: grade, qs_label: label };
}

function ssh(cmd) {
  const plinkExe = process.platform === 'win32'
    ? 'C:\\Program Files\\PuTTY\\plink.exe'
    : 'plink';
  const result = spawnSync(plinkExe, ['-batch', '-pw', VPS_PW, VPS_HOST, cmd], {
    encoding: 'utf8',
    timeout: 60000,
  });
  if (result.error) {
    console.error('SSH spawn error:', result.error.message);
    throw result.error;
  }
  if (result.status !== 0) {
    const msg = result.stderr || `exit code ${result.status}`;
    console.error('SSH error:', msg);
    throw new Error(msg);
  }
  return result.stdout;
}

function escapeCSV(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function main() {
  console.log('[Export] Querying VPS bondverify database...');

  const countyFilter = COUNTY ? `AND business_county LIKE '%${COUNTY}%'` : '';

  // Pull contractors with expired or soon-expiring bonds
  // We calculate QS score locally since we can't call the API in bulk
  const query = `
    SELECT license_number, license_type, business_name, owner_name,
           business_city, business_county, expire_date
    FROM contractors
    WHERE expire_date < DATE_ADD(NOW(), INTERVAL 90 DAY)
      AND (business_county IS NULL OR business_county != 'Out Of State')
      ${countyFilter}
    ORDER BY expire_date ASC
    LIMIT ${LIMIT}
  `.replace(/\s+/g, ' ').trim();

  const mysqlCmd = `mysql -u${DB_USER} -p${DB_PW} ${DB_NAME} -e "${query}" --batch --skip-column-names`;
  const output = ssh(mysqlCmd);

  const lines = output.trim().split('\n').filter(Boolean);
  console.log(`[Export] Got ${lines.length} rows from DB.`);

  const rows = lines.map(line => {
    const [license_number, license_type, business_name, owner_name,
           business_city, business_county, expire_date] = line.split('\t');
    return { license_number, license_type, business_name, owner_name,
             business_city, business_county, expire_date };
  });

  // Calculate QS scores and filter
  const scored = rows
    .map(r => ({ ...r, ...calculateQSScore(r) }))
    .filter(r => r.qs_score <= MAX_SCORE)
    .sort((a, b) => a.qs_score - b.qs_score);

  console.log(`[Export] ${scored.length} contractors with QS Score ≤ ${MAX_SCORE}.`);

  // Write CSV (email column blank — needs enrichment)
  const headers = ['name', 'business_name', 'email', 'license_number', 'license_type',
                   'city', 'qs_score', 'qs_grade', 'qs_label', 'expire_date', 'county'];
  const csvLines = [
    headers.join(','),
    ...scored.map(r => [
      escapeCSV(r.owner_name),
      escapeCSV(r.business_name),
      '',  // email — fill in before blasting
      escapeCSV(r.license_number),
      escapeCSV(r.license_type),
      escapeCSV(r.business_city),
      r.qs_score,
      r.qs_grade,
      r.qs_label,
      escapeCSV(r.expire_date ? new Date(r.expire_date).toISOString().split('T')[0] : ''),
      escapeCSV(r.business_county),
    ].join(','))
  ];

  fs.writeFileSync(OUT_FILE, csvLines.join('\n'));
  console.log(`\n[Export] Written to: ${OUT_FILE}`);
  console.log(`         ${scored.length} contractors exported.`);
  console.log('\nNext steps:');
  console.log('  1. Open contractor_blast_list.csv in Excel/Sheets');
  console.log('  2. Fill in the "email" column (Apollo.io free tier is fastest)');
  console.log('  3. Delete rows without emails');
  console.log('  4. Run: node contractor_score_blast.cjs --dry-run');
  console.log('  5. Run: node contractor_score_blast.cjs');

  // Print grade breakdown
  const grades = scored.reduce((acc, r) => { acc[r.qs_grade] = (acc[r.qs_grade] || 0) + 1; return acc; }, {});
  console.log('\nGrade breakdown:');
  ['F', 'D', 'C', 'B'].forEach(g => {
    if (grades[g]) console.log(`  ${g}: ${grades[g].toLocaleString()} contractors`);
  });
}

main().catch(console.error);
