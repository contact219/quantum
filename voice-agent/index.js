require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3003;
const RETELL_API_KEY = process.env.RETELL_API_KEY || '';
const RETELL_PHONE_NUMBER = process.env.RETELL_PHONE_NUMBER || '';

// ── Outbound sales agent config ──────────────────────────────────────────────
const OUTBOUND_AGENT_ID     = process.env.OUTBOUND_AGENT_ID || 'agent_952262db704690480e5edf526e';
const OUTBOUND_SECRET       = process.env.OUTBOUND_SECRET || '';
const OUTBOUND_DAILY_CAP    = parseInt(process.env.OUTBOUND_DAILY_CAP || '10', 10);
const OUTBOUND_MAX_ATTEMPTS = 2;
const OUTBOUND_RETRY_HOURS  = 3;

// Business hours: Mon-Fri 9 AM - 6 PM America/Chicago
function isBusinessHours() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', hour12: false, weekday: 'short', hour: 'numeric'
  }).formatToParts(new Date());
  const get = t => (parts.find(p => p.type === t) || {}).value;
  const day = get('weekday');
  const hour = parseInt(get('hour'), 10);
  return day !== 'Sat' && day !== 'Sun' && hour >= 9 && hour < 18;
}

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  return null;
}

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'bondverify',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'bondverify',
  waitForConnections: true, connectionLimit: 5, queueLimit: 0
};
let dbPool;

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const ADMIN_EMAIL = 'administrator@quantumsurety.bond';
const FROM_EMAIL  = 'alerts@quantumsurety.bond';

async function initDB() {
  dbPool = mysql.createPool(DB_CONFIG);
  console.log('[DB] Bond Verify DB pool initialized');
  await dbPool.execute(`
    CREATE TABLE IF NOT EXISTS outbound_call_queue (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(20) NOT NULL,
      name VARCHAR(255),
      email VARCHAR(255),
      bond_type VARCHAR(50),
      attempts INT DEFAULT 0,
      status VARCHAR(20) DEFAULT 'pending',
      last_call_id VARCHAR(64),
      last_attempt_at DATETIME NULL,
      next_attempt_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_obq_status (status),
      INDEX idx_obq_phone (phone)
    )
  `);
  console.log('[DB] outbound_call_queue ready');
}

function detectBondType(text) {
  if (!text) return 'general';
  const t = text.toLowerCase();
  if (t.includes('notary')) return 'notary';
  if (t.includes('dealer') || t.includes('gdn') || t.includes('auto dealer') || t.includes('motor vehicle')) return 'dealer';
  if (t.includes('contractor') || t.includes('hvac') || t.includes('plumber') || t.includes('electrician') || t.includes('roofer') || t.includes('tdlr')) return 'contractor';
  if (t.includes('mortgage')) return 'mortgage';
  if (t.includes('collection agency')) return 'collection_agency';
  if (t.includes('credit access')) return 'credit_access_business';
  if (t.includes('property tax consultant')) return 'property_tax_consultant';
  return 'general';
}

async function logCallToDB(callData) {
  if (!dbPool) return;
  try {
    await dbPool.execute(
      `INSERT INTO call_logs
        (call_id, direction, from_number, to_number, agent_id, call_status,
         duration_seconds, call_cost, transcript, recording_url, call_summary,
         user_sentiment, call_successful, bond_type, disconnection_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         call_status=VALUES(call_status), duration_seconds=VALUES(duration_seconds),
         call_cost=VALUES(call_cost), transcript=VALUES(transcript),
         recording_url=VALUES(recording_url), call_summary=VALUES(call_summary),
         user_sentiment=VALUES(user_sentiment), call_successful=VALUES(call_successful),
         bond_type=VALUES(bond_type), disconnection_reason=VALUES(disconnection_reason)`,
      [
        callData.call_id, callData.direction, callData.from_number, callData.to_number,
        callData.agent_id, callData.call_status, callData.duration_seconds || 0,
        callData.call_cost || 0,
        callData.transcript ? callData.transcript.substring(0, 65000) : null,
        callData.recording_url || null, callData.call_summary || null,
        callData.user_sentiment || null, callData.call_successful ? 1 : 0,
        callData.bond_type || 'general', callData.disconnection_reason || null
      ]
    );
    console.log(`[DB] Logged: ${callData.call_id} | ${callData.bond_type} | ${callData.from_number}`);
  } catch (err) {
    console.error('[DB] Failed to log call:', err.message);
  }
}

async function createCRMLead(callData) {
  if (!callData.from_number) return;
  const bondLabels = {
    notary: 'Texas Notary Bond', dealer: 'Texas GDN Dealer Bond',
    contractor: 'Texas Contractor License Bond', mortgage: 'Texas Mortgage Broker Bond',
    collection_agency: 'Texas Collection Agency Bond',
    credit_access_business: 'Texas Credit Access Business Bond',
    property_tax_consultant: 'Texas Property Tax Consultant Bond',
    general: 'Texas Notary Bond'
  };
  try {
    const phoneTag = (callData.from_number || 'unknown').replace(/\D/g, '');
    const res = await fetch('https://quantumsurety.bond/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Voice Caller ${callData.from_number}`,
        email: `voice-${phoneTag}@noemail.quantumsurety.bond`,
        phone: callData.from_number,
        bond_type: bondLabels[callData.bond_type] || 'Texas Notary Bond',
        source: 'voice-agent',
        notes: callData.call_summary
          ? `${callData.call_summary}\n\nCall ID: ${callData.call_id} | Duration: ${callData.duration_seconds}s | Outcome: ${callData.call_successful ? 'Successful' : 'Unsuccessful'}`
          : `Inbound voice call. Call ID: ${callData.call_id}. Duration: ${callData.duration_seconds}s.`
      })
    });
    console.log(`[CRM] Lead created: HTTP ${res.status} for ${callData.from_number}`);
  } catch (err) {
    console.error('[CRM] Failed to create lead:', err.message);
  }
}

async function sendCallSummaryEmail(callData) {
  const bondLabel = callData.bond_type
    ? callData.bond_type.charAt(0).toUpperCase() + callData.bond_type.slice(1).replace(/_/g, ' ')
    : 'Unknown';
  const outcome   = callData.call_successful ? '&#x2705; Successful' : '&#x274C; Unsuccessful';
  const sentiment = callData.user_sentiment || 'Unknown';
  const mins      = Math.floor((callData.duration_seconds || 0) / 60);
  const secs      = (callData.duration_seconds || 0) % 60;
  const duration  = callData.duration_seconds ? `${mins}m ${secs}s` : 'Unknown';
  const recording = callData.recording_url
    ? `<a href="${callData.recording_url}" style="color:#f59e0b;">Listen to Recording</a>`
    : 'Not available';

  const html = `
<div style="font-family:sans-serif;max-width:600px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:8px;border:1px solid #30363d;">
  <div style="font-size:10px;letter-spacing:4px;color:#f59e0b;font-family:monospace;">QUANTUM SURETY</div>
  <h2 style="margin:4px 0 0;font-size:22px;letter-spacing:2px;">${callData.direction === 'outbound' ? 'OUTBOUND SALES CALL SUMMARY' : 'INBOUND CALL SUMMARY'}</h2>
  <hr style="border:none;border-top:2px solid #f59e0b;width:64px;margin:12px 0 20px 0;">
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr style="border-bottom:1px solid #21262d;"><td style="padding:8px 0;color:#8b949e;width:140px;">${callData.direction === 'outbound' ? 'Lead Number' : 'Caller Number'}</td><td style="padding:8px 0;font-weight:600;">${(callData.direction === 'outbound' ? callData.to_number : callData.from_number) || 'Unknown'}</td></tr>
    <tr style="border-bottom:1px solid #21262d;"><td style="padding:8px 0;color:#8b949e;">Bond Type</td><td style="padding:8px 0;color:#f59e0b;font-weight:600;">${bondLabel}</td></tr>
    <tr style="border-bottom:1px solid #21262d;"><td style="padding:8px 0;color:#8b949e;">Outcome</td><td style="padding:8px 0;">${outcome}</td></tr>
    <tr style="border-bottom:1px solid #21262d;"><td style="padding:8px 0;color:#8b949e;">Caller Sentiment</td><td style="padding:8px 0;">${sentiment}</td></tr>
    <tr style="border-bottom:1px solid #21262d;"><td style="padding:8px 0;color:#8b949e;">Duration</td><td style="padding:8px 0;">${duration}</td></tr>
    <tr><td style="padding:8px 0;color:#8b949e;">Recording</td><td style="padding:8px 0;">${recording}</td></tr>
  </table>
  <div style="margin-top:20px;">
    <div style="font-size:10px;letter-spacing:2px;color:#8b949e;font-family:monospace;margin-bottom:8px;">CALL SUMMARY</div>
    <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px;font-size:13px;line-height:1.6;">
      ${callData.call_summary || 'No summary available.'}
    </div>
  </div>
  <div style="margin-top:16px;font-size:10px;color:#484f58;font-family:monospace;">Call ID: ${callData.call_id}</div>
</div>`;

  const text = `QUANTUM SURETY - INBOUND CALL SUMMARY\nCaller: ${callData.from_number || 'Unknown'}\nBond Type: ${bondLabel}\nOutcome: ${callData.call_successful ? 'Successful' : 'Unsuccessful'}\nSentiment: ${sentiment}\nDuration: ${duration}\nRecording: ${callData.recording_url || 'Not available'}\n\nSummary: ${callData.call_summary || 'No summary available.'}\nCall ID: ${callData.call_id}`;

  try {
    await sesClient.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [ADMIN_EMAIL] },
      Message: {
        Subject: { Data: callData.direction === 'outbound'
          ? `Outbound Sales Call: ${bondLabel} lead ${callData.to_number || 'Unknown'}`
          : `Inbound Call: ${bondLabel} inquiry from ${callData.from_number || 'Unknown'}` },
        Body: { Html: { Data: html }, Text: { Data: text } }
      }
    }));
    console.log(`[Email] Summary sent to ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error('[Email] Failed to send:', err.message);
  }
}

// ── Outbound sales calling (speed-to-lead) ──────────────────────────────────

const OUTBOUND_BOND_LABELS = {
  notary: 'Texas Notary Public Bond', dealer: 'Texas Auto Dealer Bond', gdn: 'Texas Auto Dealer Bond',
  title: 'Texas Certificate of Title Bond', 'bonded-title': 'Texas Certificate of Title Bond',
  contractor: 'Texas Contractor License Bond', mortgage: 'Texas Mortgage Broker Bond',
};

async function callsPlacedToday() {
  const [rows] = await dbPool.execute(
    `SELECT COUNT(*) AS c FROM outbound_call_queue WHERE last_attempt_at >= CURDATE()`
  );
  return rows[0].c;
}

async function placeOutboundCall(row) {
  const label = OUTBOUND_BOND_LABELS[(row.bond_type || '').toLowerCase()] || 'Texas Surety Bond';
  try {
    const resp = await fetch('https://api.retellai.com/v2/create-phone-call', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RETELL_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_number: RETELL_PHONE_NUMBER,
        to_number: row.phone,
        override_agent_id: OUTBOUND_AGENT_ID,
        retell_llm_dynamic_variables: {
          customer_name: row.name || 'there',
          bond_type_label: label,
          customer_email: row.email || 'the email you provided',
        },
        metadata: { queue_id: String(row.id) },
      }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.call_id) {
      console.error('[Outbound] create-phone-call failed:', JSON.stringify(data).substring(0, 300));
      await dbPool.execute(
        `UPDATE outbound_call_queue SET status='failed', attempts=attempts+1, last_attempt_at=NOW() WHERE id=?`, [row.id]
      );
      return;
    }
    await dbPool.execute(
      `UPDATE outbound_call_queue SET status='calling', attempts=attempts+1, last_attempt_at=NOW(), last_call_id=? WHERE id=?`,
      [data.call_id, row.id]
    );
    console.log(`[Outbound] Call placed: ${data.call_id} -> ${row.phone} (queue ${row.id}, attempt ${row.attempts + 1})`);
  } catch (err) {
    console.error('[Outbound] Call error:', err.message);
  }
}

async function processOutboundQueue() {
  if (!dbPool || !isBusinessHours()) return;
  try {
    const placed = await callsPlacedToday();
    let remaining = OUTBOUND_DAILY_CAP - placed;
    if (remaining <= 0) return;
    const [rows] = await dbPool.execute(
      `SELECT * FROM outbound_call_queue
       WHERE status='pending' AND attempts < ? AND next_attempt_at <= NOW()
       ORDER BY created_at ASC LIMIT ${parseInt(remaining, 10)}`,
      [OUTBOUND_MAX_ATTEMPTS]
    );
    for (const row of rows) await placeOutboundCall(row);
  } catch (err) {
    console.error('[Outbound] Queue error:', err.message);
  }
}
setInterval(processOutboundQueue, 5 * 60 * 1000);

// Called by quantumsurety.bond when a web lead is submitted
app.post('/outbound-call', async (req, res) => {
  if (!OUTBOUND_SECRET || req.headers['x-outbound-secret'] !== OUTBOUND_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  if (!dbPool) return res.status(503).json({ error: 'db unavailable' });
  const { name, email, bond_type } = req.body || {};
  const phone = normalizePhone(req.body && req.body.phone);
  if (!phone) return res.json({ queued: false, reason: 'invalid phone' });
  // Never call back leads that originated from an inbound voice call
  if (/@noemail\.quantumsurety\.bond$/i.test(email || '') || (req.body.source || '') === 'voice-agent') {
    return res.json({ queued: false, reason: 'voice-originated lead' });
  }
  try {
    // Dedupe: skip if this phone was queued in the last 7 days
    const [dupes] = await dbPool.execute(
      `SELECT id FROM outbound_call_queue WHERE phone=? AND created_at > NOW() - INTERVAL 7 DAY LIMIT 1`, [phone]
    );
    if (dupes.length) return res.json({ queued: false, reason: 'recently queued' });
    await dbPool.execute(
      `INSERT INTO outbound_call_queue (phone, name, email, bond_type) VALUES (?, ?, ?, ?)`,
      [phone, (name || '').substring(0, 255), (email || '').substring(0, 255), (bond_type || '').substring(0, 50)]
    );
    // Try to call right away if we're inside business hours and under cap
    processOutboundQueue().catch(() => {});
    res.json({ queued: true });
  } catch (err) {
    console.error('[Outbound] Enqueue error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Stats for the daily report
app.get('/outbound-stats', async (req, res) => {
  if (!OUTBOUND_SECRET || req.query.secret !== OUTBOUND_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  if (!dbPool) return res.status(503).json({ error: 'db unavailable' });
  try {
    const [calls] = await dbPool.execute(
      `SELECT DATE(created_at) AS day, COUNT(*) AS calls,
              COALESCE(SUM(duration_seconds),0) AS seconds, COALESCE(SUM(call_cost),0) AS cost_units
       FROM call_logs WHERE direction='outbound' AND created_at >= CURDATE() - INTERVAL 7 DAY
       GROUP BY DATE(created_at) ORDER BY day DESC`
    );
    const [queue] = await dbPool.execute(
      `SELECT status, COUNT(*) AS n FROM outbound_call_queue GROUP BY status`
    );
    res.json({ daily_cap: OUTBOUND_DAILY_CAP, calls_by_day: calls, queue_by_status: queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function updateOutboundQueue(call, callData) {
  if (!dbPool) return;
  try {
    const queueId = call.metadata && call.metadata.queue_id ? parseInt(call.metadata.queue_id, 10) : null;
    const where = queueId ? 'id=?' : 'last_call_id=?';
    const param = queueId || callData.call_id;
    const noAnswer = ['dial_no_answer', 'dial_busy', 'dial_failed'].includes(callData.disconnection_reason || '');
    if (noAnswer) {
      // Retry later if attempts remain; otherwise give up
      await dbPool.execute(
        `UPDATE outbound_call_queue
         SET status = IF(attempts < ${OUTBOUND_MAX_ATTEMPTS}, 'pending', 'exhausted'),
             next_attempt_at = NOW() + INTERVAL ${OUTBOUND_RETRY_HOURS} HOUR
         WHERE ${where}`, [param]
      );
    } else {
      await dbPool.execute(`UPDATE outbound_call_queue SET status='done' WHERE ${where}`, [param]);
    }
  } catch (err) {
    console.error('[Outbound] Queue update error:', err.message);
  }
}

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Quantum Surety Voice Agent', version: '3.0.0',
    retell: { configured: !!RETELL_API_KEY, phone: RETELL_PHONE_NUMBER }, timestamp: new Date().toISOString() });
});

// Retell AI webhook — receives call events
app.post('/webhook/retell', async (req, res) => {
  res.sendStatus(200); // respond immediately before processing

  const event = req.body;
  const call  = event.call || event;
  console.log(`[Retell] call_id=${call.call_id} status=${call.call_status}`);

  try {
    const analysis = call.call_analysis || {};
    const combined = `${analysis.call_summary || ''} ${call.transcript || ''}`;

    const callData = {
      call_id:              call.call_id || null,
      direction:            call.direction || 'inbound',
      from_number:          call.from_number || null,
      to_number:            call.to_number || null,
      agent_id:             call.agent_id || null,
      call_status:          call.call_status || 'unknown',
      duration_seconds:     call.call_cost?.total_duration_seconds || call.duration_seconds || 0,
      call_cost:            call.call_cost?.combined_cost || 0,
      transcript:           typeof call.transcript === 'string' ? call.transcript : null,
      recording_url:        call.recording_url || null,
      call_summary:         analysis.call_summary || null,
      user_sentiment:       analysis.user_sentiment || null,
      call_successful:      analysis.call_successful || false,
      bond_type:            detectBondType(combined),
      disconnection_reason: call.disconnection_reason || null
    };

    if (callData.call_id) await logCallToDB(callData);

    // Outbound calls: keep the queue in sync on every terminal event
    // (no-answer calls never reach call_analyzed, only call_ended)
    if (callData.direction === 'outbound' && callData.call_id &&
        (call.call_status === 'ended' || call.call_status === 'error')) {
      await updateOutboundQueue(call, callData);
    }

    // Fire post-call actions only on the call_analyzed event (has call_summary).
    // call_ended fires first with recording_url but no summary — skip it to avoid
    // duplicate emails/CRM leads. call_analyzed has both.
    const isComplete = !!callData.call_summary;
    if (isComplete && callData.call_id) {
      if (callData.direction === 'outbound') {
        // Lead already exists in CRM (they submitted the form) — just send the summary
        await sendCallSummaryEmail(callData);
      } else {
        await Promise.all([createCRMLead(callData), sendCallSummaryEmail(callData)]);
      }
    }
  } catch (err) {
    console.error('[Webhook] Error:', err.message);
  }
});

// Call log API — consumed by CRM Call Logs page
app.get('/api/calls', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (!dbPool) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const limit = Math.min(parseInt(req.query.limit) || 200, 500);
    const [rows] = await dbPool.execute(
      `SELECT id, call_id, direction, from_number, to_number, call_status,
              duration_seconds, call_cost, recording_url, call_summary,
              user_sentiment, call_successful, bond_type, disconnection_reason, created_at
       FROM call_logs ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    res.json({ count: rows.length, calls: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.options('/api/calls/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

app.delete('/api/calls/:id', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (!dbPool) return res.status(503).json({ error: 'Database unavailable' });
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  try {
    const [result] = await dbPool.execute('DELETE FROM call_logs WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send bond application link email — called by Retell custom tool
app.post('/api/send-link-email', async (req, res) => {
  console.log('[Email Tool] body:', JSON.stringify(req.body));
  // Retell may nest args under "args" key or send flat
  const body = req.body?.args || req.body || {};
  const email      = body.email      || req.body.email;
  const bond_type  = body.bond_type  || req.body.bond_type;
  const caller_phone = body.caller_phone || req.body.caller_phone;
  if (!email) return res.status(400).json({ success: false, error: 'email is required' });

  const BOND_LINKS = {
    notary:                  'https://quantumsurety.bond/get-bond?type=notary',
    dealer:                  'https://quantumsurety.bond/get-bond?type=dealer',
    contractor:              'https://quantumsurety.bond/get-bond?type=contractor',
    mortgage:                'https://quantumsurety.bond/get-bond?type=mortgage',
    collection_agency:       'https://quantumsurety.bond/get-bond?type=collection-agency',
    credit_access_business:  'https://quantumsurety.bond/get-bond?type=credit-access-business',
    property_tax_consultant: 'https://quantumsurety.bond/get-bond?type=property-tax-consultant',
  };
  const BOND_LABELS = {
    notary: 'Texas Notary Public Bond', dealer: 'Texas Auto Dealer (GDN) Bond',
    contractor: 'Texas Contractor License Bond', mortgage: 'Texas Mortgage Broker Bond',
    collection_agency: 'Texas Collection Agency Bond',
    credit_access_business: 'Texas Credit Access Business Bond',
    property_tax_consultant: 'Texas Property Tax Consultant Bond',
  };

  const key   = (bond_type || 'general').toLowerCase();
  const link  = BOND_LINKS[key] || 'https://quantumsurety.bond';
  const label = BOND_LABELS[key] || 'Texas Surety Bond';

  const html = `
<div style="font-family:sans-serif;max-width:600px;background:#0d1117;color:#e6edf3;padding:32px;border-radius:8px;border:1px solid #30363d;">
  <div style="font-size:10px;letter-spacing:4px;color:#f59e0b;font-family:monospace;">QUANTUM SURETY</div>
  <h2 style="margin:4px 0 0;font-size:26px;letter-spacing:2px;color:white;">YOUR BOND APPLICATION LINK</h2>
  <hr style="border:none;border-top:2px solid #f59e0b;width:64px;margin:12px 0 24px 0;">
  <p style="font-size:14px;color:#c9d1d9;line-height:1.6;margin:0 0 20px;">
    Thank you for calling Quantum Surety! Below is your application link for the
    <strong style="color:#f59e0b;">${label}</strong>.
  </p>
  <div style="text-align:center;margin:28px 0;">
    <a href="${link}" style="display:inline-block;background:#f59e0b;color:#000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:6px;text-decoration:none;letter-spacing:1px;font-family:monospace;">
      APPLY NOW →
    </a>
  </div>
  <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:14px 16px;font-size:12px;color:#8b949e;font-family:monospace;word-break:break-all;">
    ${link}
  </div>
  <p style="font-size:12px;color:#8b949e;margin-top:24px;line-height:1.5;">
    Questions? Call us at <strong style="color:#e6edf3;">+1 (214) 666-8718</strong> or visit
    <a href="https://quantumsurety.bond" style="color:#f59e0b;">quantumsurety.bond</a>.
    Same-day issuance available for most bonds.
  </p>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #21262d;font-size:10px;color:#484f58;font-family:monospace;">
    Quantum Surety · Texas-Licensed Surety Bond Agency
  </div>
</div>`;

  const text = `QUANTUM SURETY — YOUR BOND APPLICATION LINK\n\nThank you for calling Quantum Surety!\n\nHere is your application link for the ${label}:\n${link}\n\nQuestions? Call us at +1 (214) 666-8718 or visit quantumsurety.bond.\nSame-day issuance available for most bonds.`;

  try {
    await sesClient.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: `Your ${label} Application Link — Quantum Surety` },
        Body: { Html: { Data: html }, Text: { Data: text } }
      }
    }));
    console.log(`[Email] Application link sent to ${email} for ${key}`);
    res.json({ success: true, message: `Application link sent to ${email}` });
  } catch (err) {
    console.error('[Email] Failed to send link email:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test outbound call

// Callback request from voice agent when live transfer fails
app.post('/api/request-callback', async (req, res) => {
  const body = req.body?.args || req.body || {};
  const name  = body.name  || 'Unknown caller';
  const phone = body.phone || '(not provided)';
  const bond  = body.bond_type || 'general';

  console.log(`[Callback] Request from ${name} | ${phone} | ${bond}`);

  const html = `<div style="font-family:sans-serif;max-width:560px;background:#fff;padding:28px;border:1px solid #e5e7eb;border-radius:8px;">
  <div style="background:#ef4444;color:#fff;padding:14px 18px;border-radius:6px;margin-bottom:20px;">
    <strong style="font-size:16px;">LIVE AGENT CALLBACK NEEDED</strong>
  </div>
  <p style="font-size:15px;color:#111;">A caller requested to speak with a live agent but the transfer failed. Please call them back.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px;font-weight:600;color:#374151;">Name:</td><td style="padding:8px;color:#111;">${name}</td></tr>
    <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:600;color:#374151;">Phone:</td><td style="padding:8px;color:#111;font-size:16px;"><strong>${phone}</strong></td></tr>
    <tr><td style="padding:8px;font-weight:600;color:#374151;">Bond type:</td><td style="padding:8px;color:#111;">${bond}</td></tr>
  </table>
  <p style="font-size:13px;color:#6b7280;">Quantum Surety Voice Agent - ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CDT</p>
</div>`;

  try {
    await sesClient.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: ['administrator@quantumsurety.bond'] },
      Message: {
        Subject: { Data: `CACLLBACK NEEDED: ${name} (${phone}) - ${bond}` },
        Body: {
          Html: { Data: html },
          Text: { Data: `CALLBAACK REQUEST\nName: ${name}\nPhone: ${phone}\nBond: ${bond}` }
        }
      }
    }));
    console.log(`[Callback] Alert sent for ${name} / ${phone}`);
  } catch (e) {
    console.error('[Callback] Email failed:', e.message);
  }

  res.json({ success: true, message: 'Got it. A specialist will call you back shortly.' });
});

app.post('/api/call/test', async (req, res) => {
  if (!RETELL_API_KEY) return res.status(500).json({ error: 'Retell API key not configured' });
  const { to, task } = req.body;
  if (!to) return res.status(400).json({ error: 'to is required' });
  try {
    const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RETELL_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_number: RETELL_PHONE_NUMBER, to_number: to,
        agent_id: 'agent_c69a15d6f2117a9d62903402b7',
        task: task || 'This is a test call from Quantum Surety.',
        webhook_callback_url: `${process.env.WEBHOOK_BASE_URL}/webhook/retell`
      })
    });
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Voice agent v3.0 running on port ${PORT}`);
    console.log(`Retell webhook: POST /webhook/retell`);
    console.log(`Webhook base: ${process.env.WEBHOOK_BASE_URL || 'not set'}`);
  });
}).catch(err => {
  console.error('[Init] DB init failed:', err.message);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Voice agent v3.0 running on port ${PORT} (DB unavailable)`);
  });
});
