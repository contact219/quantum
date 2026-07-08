#!/usr/bin/env node
/**
 * voice_call_outcome_report.cjs — how did today's outbound dealer calls land?
 *
 * Summarizes today's outbound GDN-dealer batch: joins outbound_call_queue
 * (who we queued) to call_logs (outcome per call) and emails a per-lead
 * breakdown — answered vs voicemail/no-answer, duration, sentiment, and the
 * AI call summary. This is call-*outcome* (did they pick up / how did it go),
 * not conversion; conversion is measured separately over 2 weeks.
 *
 * Runs on the voice-agent VPS (local MariaDB). Env: DB_PASS, SES_KEY/SES_SECRET,
 * optional REPORT_TO.
 */
const mysql = require('mysql2/promise');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: 'us-east-2', credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET } });
const REPORT_TO = (process.env.REPORT_TO || 'contact219@gmail.com').split(',').map(s => s.trim());
const FROM = 'Quantum Surety Metrics <alerts@quantumsurety.bond>';
const DRY_RUN = process.argv.includes('--dry-run');

const esc = s => String(s == null ? '' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

async function main() {
  const my = await mysql.createConnection({ host: '127.0.0.1', user: 'bondverify', password: process.env.DB_PASS, database: 'bondverify' });
  const [rows] = await my.execute(`
    SELECT q.name, q.phone, q.status AS queue_status, q.attempts,
           c.call_status, c.duration_seconds, c.call_successful, c.user_sentiment,
           c.disconnection_reason, c.call_summary
    FROM outbound_call_queue q
    LEFT JOIN call_logs c ON c.call_id = q.last_call_id
    WHERE q.created_at >= CURDATE() AND q.bond_type = 'dealer'
    ORDER BY q.name
  `);
  await my.end();

  const answered = rows.filter(r => (r.duration_seconds || 0) >= 15);
  const noAnswer = rows.filter(r => (r.duration_seconds || 0) < 15 && r.queue_status !== 'pending' && r.queue_status !== 'calling');
  const pending = rows.filter(r => r.queue_status === 'pending' || r.queue_status === 'calling');
  const positive = rows.filter(r => (r.user_sentiment || '').toLowerCase() === 'positive');

  const summary = `[VoiceCallOutcome] dealer batch: ${rows.length} queued | answered(>=15s)=${answered.length} no-answer=${noAnswer.length} still-pending/calling=${pending.length} positive-sentiment=${positive.length}`;
  console.log(summary);

  const tr = rows.map(r => {
    const dur = r.duration_seconds || 0;
    const outcome = r.queue_status === 'pending' || r.queue_status === 'calling' ? 'in progress'
      : dur >= 15 ? `answered ${dur}s` : (r.queue_status === 'failed' ? 'failed/no-answer' : (r.call_status || 'no pickup'));
    return `<tr>
<td>${esc(r.name)}</td>
<td>${esc(outcome)}</td>
<td>${esc(r.user_sentiment || '—')}</td>
<td style="font-size:12px;color:#475569">${esc((r.call_summary || '').slice(0, 160)) || '—'}</td>
</tr>`;
  }).join('');

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:680px;margin:0 auto;color:#1e293b">
<h2 style="color:#0f172a">Outbound Dealer Calls — Today</h2>
<p style="color:#475569">The ~9 warm GDN dealer leads queued today (they'd missed their speed-to-lead call during the June outage). This is how the calls <em>landed</em> — pickup / duration / sentiment. Conversion is tracked separately.</p>
<table style="border-collapse:collapse;width:100%;font-size:13px;margin:8px 0">
<tr><td><strong>Queued</strong></td><td style="text-align:right"><strong>${rows.length}</strong></td></tr>
<tr><td>Answered (≥15s)</td><td style="text-align:right">${answered.length}</td></tr>
<tr><td>No answer / voicemail</td><td style="text-align:right">${noAnswer.length}</td></tr>
<tr><td>Still pending / in progress</td><td style="text-align:right">${pending.length}</td></tr>
<tr><td>Positive sentiment</td><td style="text-align:right">${positive.length}</td></tr>
</table>
<table style="border-collapse:collapse;width:100%;font-size:13px">
<tr style="color:#64748b"><th style="text-align:left">Lead</th><th style="text-align:left">Outcome</th><th style="text-align:left">Sentiment</th><th style="text-align:left">AI summary</th></tr>
${tr}
</table>
<p style="color:#94a3b8;font-size:12px;margin-top:14px">Reminder: voice is 0-for-281 and dealer/GDN is 0-sales historically — this is the measured experiment. Real signal is conversions over ~2 weeks (see the weekly voice report + the 2026-07-21 checkpoint), not today's pickups.</p>
</div>`;

  if (DRY_RUN) { console.log('(dry-run — no email sent)'); rows.forEach(r => console.log(`  ${r.name}: q=${r.queue_status} dur=${r.duration_seconds || 0}s sent=${r.user_sentiment || '-'}`)); return; }
  await ses.send(new SendEmailCommand({
    Source: FROM, Destination: { ToAddresses: REPORT_TO },
    Message: { Subject: { Data: `Dealer calls today: ${answered.length}/${rows.length} answered` }, Body: { Html: { Data: html } } },
  }));
  console.log(`Emailed to ${REPORT_TO.join(', ')}`);
}
main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
