import pg from 'pg';
const { Pool } = pg;

export async function getTdlrUrgentRenewals({ days_ahead = 60, limit = 50 } = {}) {
  const pool = new Pool({ connectionString: process.env.CRM_DB });
  try {
    const result = await pool.query(
      `SELECT
         l.business_name AS name,
         COALESCE(l.business_phone, l.owner_phone) AS phone,
         l.owner_name,
         l.license_type,
         l.business_city AS city,
         l.business_county AS county,
         l.expire_date::text AS expire_date
       FROM tdlr_licenses l
       WHERE l.expire_date BETWEEN CURRENT_DATE
             AND CURRENT_DATE + ($1 || ' days')::INTERVAL
         AND l.license_type IN (
           'Electrical Contractor','A/C Contractor','Master Electrician',
           'Journeyman Electrician','Plumbing Contractor','General Contractor',
           'Air Conditioning and Refrigeration Contractor'
         )
         AND (l.business_phone IS NOT NULL OR l.owner_phone IS NOT NULL)
         AND NOT EXISTS (
           SELECT 1 FROM leads
           WHERE leads.phone = COALESCE(l.business_phone, l.owner_phone)
             AND leads.created_at > NOW() - INTERVAL '90 days'
         )
       ORDER BY l.expire_date ASC
       LIMIT $2`,
      [days_ahead, limit]
    );
    return result.rows;
  } finally {
    await pool.end();
  }
}
