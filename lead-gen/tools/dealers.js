import pg from 'pg';
const { Pool } = pg;

export async function getDealerUrgentRenewals({ days_ahead = 60, limit = 50 } = {}) {
  const pool = new Pool({ connectionString: process.env.CRM_DB });
  try {
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
       WHERE d.license_expiration BETWEEN CURRENT_DATE
             AND CURRENT_DATE + ($1 || ' days')::INTERVAL
         AND d.license_status = 'Active'
         AND (d.phone IS NOT NULL OR d.email IS NOT NULL)
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
