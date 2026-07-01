import pg from 'pg';
const { Pool } = pg;

export async function checkLeadExists({ phone, email, name, source } = {}) {
  const pool = new Pool({ connectionString: process.env.CRM_DB });
  try {
    // No phone/email — fall back to name dedup (used for TX SOS leads)
    if (!phone && !email) {
      if (!name) return false;
      const { rows } = await pool.query(
        `SELECT id FROM leads WHERE lower(name) = lower($1) AND source = $2
         AND created_at > NOW() - INTERVAL '90 days' LIMIT 1`,
        [name.trim(), source || '']
      );
      return rows.length > 0;
    }

    const conditions = [];
    const params = [];
    if (phone) {
      params.push(phone.replace(/\D/g, ''));
      conditions.push(`regexp_replace(leads.phone, '[^0-9]', '', 'g') = $${params.length}`);
    }
    if (email) {
      params.push(email.toLowerCase());
      conditions.push(`lower(leads.email) = $${params.length}`);
    }
    const { rows } = await pool.query(
      `SELECT id FROM leads WHERE (${conditions.join(' OR ')})
       AND created_at > NOW() - INTERVAL '90 days' LIMIT 1`,
      params
    );
    return rows.length > 0;
  } finally {
    await pool.end();
  }
}

export async function insertLead({ name, email, phone, bond_type, source, notes } = {}) {
  // Insert directly into CRM DB — no email required
  const pool = new Pool({ connectionString: process.env.CRM_DB });
  try {
    const { rows } = await pool.query(
      `INSERT INTO leads (name, email, phone, bond_type, source, status, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'new', $6, NOW(), NOW())
       RETURNING id`,
      [name, email || null, phone || null, bond_type, source, notes || null]
    );
    const leadId = rows[0].id;

    // Trigger outbound AI call if lead has a phone number
    if (phone && process.env.OUTBOUND_SECRET) {
      try {
        await fetch('https://voice-agent.permitpilot.online/outbound-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Outbound-Secret': process.env.OUTBOUND_SECRET
          },
          body: JSON.stringify({ name, phone, bond_type, source }),
          signal: AbortSignal.timeout(8000)
        });
      } catch (_) { /* voice agent errors are non-fatal */ }
    }

    return { id: leadId, status: 'inserted' };
  } finally {
    await pool.end();
  }
}
