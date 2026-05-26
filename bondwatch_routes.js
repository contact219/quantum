// Bond Watch API — public endpoints, no API key required

app.use('/api/bond-watch', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

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

app.get('/api/bond-watch/counties', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT business_county AS county, COUNT(*) AS total, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)) AS expiring_30d, SUM(expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 90 DAY)) AS expiring_90d, SUM(expire_date < NOW()) AS expired FROM contractors WHERE business_county IS NOT NULL AND business_county != '' AND business_county != 'Out Of State' GROUP BY business_county ORDER BY expiring_90d DESC LIMIT 30"
    );
    res.json({ counties: rows, generated_at: new Date().toISOString() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/bond-watch/expiring', async (req, res) => {
  try {
    const county = req.query.county || '';
    const days   = Math.min(parseInt(req.query.days) || 30, 90);
    const limit  = Math.min(parseInt(req.query.limit) || 20, 50);
    let sql = "SELECT license_number, license_type, business_name, owner_name, business_city, business_county, expire_date FROM contractors WHERE expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)";
    const params = [days];
    if (county) { sql += " AND business_county = ?"; params.push(county); }
    sql += " ORDER BY expire_date ASC LIMIT ?";
    params.push(limit);
    const [rows] = await pool.execute(sql, params);
    res.json({ expiring: rows, county: county || 'All Texas', days, count: rows.length });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
