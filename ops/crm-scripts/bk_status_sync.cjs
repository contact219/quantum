#!/usr/bin/env node
/**
 * bk_status_sync.cjs — Daily bond status sync + KPI cache write
 * 1. Auto-expires issued bonds past their expiration date
 * 2. Syncs abandoned status from RLI CSV
 * 3. Writes today's KPI snapshot to bk_kpi_cache
 * 4. Logs portfolio summary
 */
'use strict';
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'quantum_surety',
  user: 'quantum_user',
  password: process.env.CRM_DB_PASSWORD || 'QsCRMV8yNgKOoaNPu67JF!',
});

async function run() {
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const year  = today.slice(0, 4);
  console.log(`[${new Date().toISOString()}] Bond status sync starting — ${today}`);

  // 1. Auto-expire issued bonds past expiration date
  const { rowCount: expired } = await pool.query(`
    UPDATE bk_bonds SET status='expired', updated_at=NOW()
    WHERE status='issued' AND expiration_date < CURRENT_DATE
  `);
  console.log(`  Expired: ${expired} bonds moved issued→expired`);

  // 2. Sync abandoned status from RLI CSV if available
  const csvPath = path.join('/opt/quantum-ops', 'rli_abandoned_bonds.csv');
  let abandonedSynced = 0;
  if (fs.existsSync(csvPath)) {
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n').slice(1).filter(Boolean);
    const abandonedNums = new Set();
    for (const line of lines) {
      const cols = line.split(',');
      if (cols[0]) abandonedNums.add(cols[0].trim().replace(/^"|"$/g, ''));
    }
    if (abandonedNums.size > 0) {
      const nums = Array.from(abandonedNums);
      const placeholders = nums.map((_, i) => `$${i + 1}`).join(',');
      const { rowCount } = await pool.query(
        `UPDATE bk_bonds SET status='abandoned', updated_at=NOW()
         WHERE bond_number IN (${placeholders}) AND status='issued'`,
        nums
      );
      abandonedSynced = rowCount;
      console.log(`  Abandoned sync from CSV: ${rowCount} updated (${nums.length} in CSV)`);
    }
  } else {
    console.log('  No RLI abandoned CSV found — skipping abandoned sync');
  }

  // 3. Expiring soon
  const { rows: expiringSoon } = await pool.query(`
    SELECT id, bond_number, insured_name, expiration_date,
           (expiration_date - CURRENT_DATE) AS days_left
    FROM bk_bonds WHERE status='issued'
      AND expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30
    ORDER BY expiration_date
  `);
  console.log(`  Expiring within 30 days: ${expiringSoon.length} bonds`);
  expiringSoon.forEach(b => console.log(`    - ${b.bond_number} | ${b.insured_name} | expires ${b.expiration_date} (${b.days_left}d)`));

  // 4. Compute KPIs
  const [mtdR, ytdR, activeR, expiringR, billsR, expensesR] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS bonds, COALESCE(SUM(premium),0) AS premium, COALESCE(SUM(commission_amt),0) AS commission
                FROM bk_bonds WHERE to_char(effective_date,'YYYY-MM')=$1 AND status='issued'`, [month]),
    pool.query(`SELECT COUNT(*) AS bonds, COALESCE(SUM(premium),0) AS premium, COALESCE(SUM(commission_amt),0) AS commission
                FROM bk_bonds WHERE EXTRACT(YEAR FROM effective_date)=$1 AND status='issued'`, [year]),
    pool.query(`SELECT COUNT(*) AS count FROM bk_bonds WHERE status='issued'`),
    pool.query(`SELECT COUNT(*) AS count FROM bk_bonds WHERE status='issued' AND expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30`),
    pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM bk_bills WHERE status='unpaid'`),
    pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM bk_expenses WHERE EXTRACT(YEAR FROM expense_date)=$1`, [year]),
  ]);

  const mtd = mtdR.rows[0];
  const ytd = ytdR.rows[0];
  const ytdCommission = parseFloat(ytd.commission);
  const ytdExpenses = parseFloat(expensesR.rows[0].total);
  const netIncomeYtd = ytdCommission - ytdExpenses;

  // 5. Upsert KPI cache
  await pool.query(`
    INSERT INTO bk_kpi_cache
      (snapshot_date, active_bonds, mtd_commission, ytd_commission,
       mtd_premium, ytd_premium, mtd_bonds, ytd_bonds,
       expiring_30d, unpaid_bills, total_expenses_ytd, net_income_ytd)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (snapshot_date) DO UPDATE SET
      active_bonds       = EXCLUDED.active_bonds,
      mtd_commission     = EXCLUDED.mtd_commission,
      ytd_commission     = EXCLUDED.ytd_commission,
      mtd_premium        = EXCLUDED.mtd_premium,
      ytd_premium        = EXCLUDED.ytd_premium,
      mtd_bonds          = EXCLUDED.mtd_bonds,
      ytd_bonds          = EXCLUDED.ytd_bonds,
      expiring_30d       = EXCLUDED.expiring_30d,
      unpaid_bills       = EXCLUDED.unpaid_bills,
      total_expenses_ytd = EXCLUDED.total_expenses_ytd,
      net_income_ytd     = EXCLUDED.net_income_ytd,
      created_at         = NOW()
  `, [
    today,
    parseInt(activeR.rows[0].count),
    parseFloat(mtd.commission),
    ytdCommission,
    parseFloat(mtd.premium),
    parseFloat(ytd.premium),
    parseInt(mtd.bonds),
    parseInt(ytd.bonds),
    parseInt(expiringR.rows[0].count),
    parseFloat(billsR.rows[0].total),
    ytdExpenses,
    netIncomeYtd,
  ]);
  console.log(`  KPI cache written for ${today}`);
  console.log(`    MTD: ${mtd.bonds} bonds | $${parseFloat(mtd.commission).toFixed(2)} commission`);
  console.log(`    YTD: ${ytd.bonds} bonds | $${parseFloat(ytd.commission).toFixed(2)} commission | Net: $${netIncomeYtd.toFixed(2)}`);

  // 6. Portfolio summary
  const { rows: summary } = await pool.query(`
    SELECT status, COUNT(*) AS count,
      ROUND(SUM(premium),2) AS total_premium,
      ROUND(SUM(commission_amt),2) AS total_commission
    FROM bk_bonds GROUP BY status ORDER BY count DESC
  `);
  console.log('\n  Bond portfolio:');
  summary.forEach(r => console.log(`    ${r.status.padEnd(12)} ${String(r.count).padStart(4)} bonds | $${parseFloat(r.total_premium||0).toFixed(2)} premium | $${parseFloat(r.total_commission||0).toFixed(2)} commission`));
  console.log(`[${new Date().toISOString()}] Bond status sync complete`);

  await pool.end();
}

run().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
