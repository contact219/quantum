import pg from 'pg';
const { Pool } = pg;

// Independent (GDN) dealers whose licence expires 21-90 days out. Retargeted 2026-09-26
// (outreach gauntlet, GDN piece):
//  - 21-90 days, not 0-60: 9 of 12 matchable applicants applied 0-91 days before expiry (median
//    ~45); Expo applied at 67 and the old 60-day window missed it. The bond must start on the 1st
//    of the month and RLI declines about half of priced apps, so under 21 days leaves no time.
//  - independents only: franchised dealers need no GDN bond (Transp. Code 503.033(i)).
//  - email required: this feeds the email follow-up; phone-only rows belong to the call list.
//  - existing customers (issued/pending dealer bonds) excluded.
//  - FRESHNESS GUARD: returns nothing if auto_dealers hasn't been refreshed from TxDMV in 35 days
//    (import_txdmv_dealers.py, daily). The April snapshot sent renewed dealers stale dates.
export async function getDealerUrgentRenewals({ days_ahead = 90, limit = 50 } = {}) {
  const pool = new Pool({ connectionString: process.env.CRM_DB });
  try {
    const fresh = await pool.query(
      `SELECT max(last_refreshed_at) > now() - interval '35 days' AS ok FROM auto_dealers`);
    if (!fresh.rows[0]?.ok) {
      console.error('[dealers] auto_dealers not refreshed from TxDMV in 35 days; returning no dealers');
      return [];
    }
    const result = await pool.query(
      `SELECT
         d.business_name AS name,
         d.phone,
         d.email,
         d.city,
         d.county,
         d.license_type,
         d.license_expiration::text AS expire_date
       FROM auto_dealers d
       WHERE d.license_expiration BETWEEN CURRENT_DATE + INTERVAL '21 days'
             AND CURRENT_DATE + (GREATEST(LEAST($1::int, 90), 21) || ' days')::INTERVAL
         AND d.license_status = 'Active'
         AND d.license_type = 'Used (Independent)'
         AND d.last_refreshed_at > now() - interval '35 days'
         AND d.email IS NOT NULL AND d.email <> ''
         AND NOT EXISTS (
           SELECT 1 FROM auto_dealers f
            WHERE lower(f.email) = lower(d.email) AND f.license_type ILIKE '%franchise%'
              AND NOT EXISTS (SELECT 1 FROM auto_dealers i WHERE lower(i.email) = lower(d.email)
                                AND i.license_type NOT ILIKE '%franchise%'))
         AND NOT EXISTS (
           SELECT 1 FROM bk_bonds b
            WHERE b.bond_type = 'dealer_gdn' AND b.status IN ('issued','pending')
              AND lower(b.insured_email) = lower(d.email))
         AND NOT EXISTS (
           SELECT 1 FROM leads
           WHERE (leads.phone = d.phone
                  OR (d.email IS NOT NULL AND leads.email = d.email))
             AND leads.created_at > NOW() - INTERVAL '90 days'
         )
       ORDER BY d.license_expiration ASC
       LIMIT $2`,
      [days_ahead, limit]
    );
    return result.rows;
  } finally {
    await pool.end();
  }
}
