#!/usr/bin/env node
/**
 * Did the 2026-08-28 outbound cap fix hold?
 *
 * Two defects were fixed that day (voice-agent 0f68999):
 *   1. the daily cap counted queue ROWS attempted today, so retries were invisible --
 *      a cap of 15 produced 25/25/20 real calls on Aug 25-27;
 *   2. placeOutboundCall dialled Retell BEFORE claiming the row, so overlapping
 *      processOutboundQueue() runs dialled the same person repeatedly -- 11 rows blew
 *      past the 2-attempt limit and one number took 5 calls in 7 seconds.
 *
 * The fix is only exercised when a nudge script pushes several enqueues at once, i.e.
 * on a weekday nudge run. This asserts the three things that must now be true and mails
 * a PASS/FAIL. Reads only; changes nothing.
 *
 * Usage: NODE_PATH=/var/www/bondverify/node_modules node outbound_cap_verdict.cjs [--days N]
 */
require('dotenv').config({ path: '/var/www/bondverify/.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const CAP = parseInt(process.env.OUTBOUND_DAILY_CAP_EXPECTED || '8', 10);
const MAX_ATTEMPTS = 2;
const TO = process.env.VERDICT_TO || 'contact219@gmail.com';
const FROM = 'alerts@quantumsurety.bond';
const ERRLOG = '/root/.pm2/logs/voice-agent-error.log';
const FIX_AT = '2026-08-28 17:00:00'; // restart that deployed the fix

const argDays = process.argv.indexOf('--days');
const DAYS = argDays > -1 ? parseInt(process.argv[argDays + 1], 10) : 1;

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

(async () => {
  const db = await mysql.createConnection({
    host: '127.0.0.1', // never 'localhost' -- mysql2 resolves it to ::1, MariaDB is IPv4 only
    user: process.env.DB_USER || 'bondverify',
    password: process.env.DB_PASS || process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'bondverify',
  });

  const q = async (sql, p = []) => (await db.execute(sql, p))[0];
  const fails = [];
  const notes = [];

  // 1. cap held -- dials per day, from the ledger the cap now counts.
  //    Bounded by FIX_AT as well as the window: 2026-08-28's dials were placed under the
  //    old code and backfilled from call_logs, so they exceed the new cap by design and
  //    must never be read as a breach of it.
  const dials = await q(
    `SELECT DATE(placed_at) d, COUNT(*) n FROM outbound_dials
     WHERE placed_at >= CURDATE() - INTERVAL ? DAY AND placed_at >= ?
     GROUP BY 1 ORDER BY 1 DESC`, [DAYS, FIX_AT]);
  for (const r of dials) {
    if (r.n > CAP) fails.push(`cap breached ${r.d.toISOString().slice(0, 10)}: ${r.n} dials > ${CAP}`);
  }
  if (!dials.length) notes.push('no dials in window -- fix NOT yet exercised, re-run after a weekday nudge run');

  // 2. race fixed -- no row may exceed MAX_ATTEMPTS, and none may be dialled twice within
  //    a few seconds (the actual signature of the bug: 2-14s spans, not the 3h retry)
  const over = await q(
    `SELECT id, phone, attempts FROM outbound_call_queue
     WHERE last_attempt_at >= ? AND attempts > ? ORDER BY attempts DESC`, [FIX_AT, MAX_ATTEMPTS]);
  for (const r of over) fails.push(`queue ${r.id} (${r.phone}) at ${r.attempts} attempts > ${MAX_ATTEMPTS}`);

  const burst = await q(
    `SELECT queue_id, COUNT(*) n, TIMESTAMPDIFF(SECOND, MIN(placed_at), MAX(placed_at)) span
     FROM outbound_dials WHERE placed_at >= ? AND queue_id > 0
     GROUP BY queue_id HAVING n > 1 AND span < 600`, [FIX_AT]);
  for (const r of burst) fails.push(`queue ${r.queue_id} dialled ${r.n}x within ${r.span}s -- race is back`);

  // 3. Retell no longer rejecting our own concurrent requests
  let concurrency = 0;
  try {
    const log = fs.readFileSync(ERRLOG, 'utf8');
    const stat = fs.statSync(ERRLOG);
    // Only meaningful if the log has been written since the fix; pm2 does not timestamp
    // these lines, so mtime is the only handle we have.
    if (stat.mtime >= new Date(FIX_AT)) {
      concurrency = (log.match(/Concurrency limit reached/g) || []).length;
      if (concurrency) notes.push(`error log has ${concurrency} 'Concurrency limit' lines (may predate fix -- log is not rotated)`);
    }
    if (/Payment overdue/.test(log) && stat.mtime >= new Date(FIX_AT)) {
      notes.push("error log mentions 'Payment overdue' -- check Retell billing");
    }
  } catch (_) { notes.push('could not read pm2 error log'); }

  // context: spend and what the calls actually did
  const [spend] = await q(
    `SELECT COUNT(*) calls, ROUND(SUM(duration_seconds)/60,1) mins, ROUND(SUM(call_cost)/100,2) usd
     FROM call_logs WHERE direction='outbound' AND created_at >= CURDATE() - INTERVAL ? DAY`, [DAYS]);
  const outcomes = await q(
    `SELECT disconnection_reason r, user_sentiment s, COUNT(*) n FROM call_logs
     WHERE direction='outbound' AND created_at >= CURDATE() - INTERVAL ? DAY
     GROUP BY 1,2 ORDER BY n DESC`, [DAYS]);

  await db.end();

  const pass = fails.length === 0 && dials.length > 0;
  const subject = `[Voice] outbound cap fix: ${pass ? 'PASS' : (dials.length ? 'FAIL' : 'NOT YET EXERCISED')}`;

  const L = [];
  L.push(subject.replace('[Voice] ', ''), '');
  L.push(`Window: last ${DAYS} day(s). Cap expected: ${CAP}/day. Max attempts: ${MAX_ATTEMPTS}.`, '');
  L.push('DIALS PER DAY (from outbound_dials -- what the cap now counts):');
  if (dials.length) for (const r of dials) L.push(`  ${r.d.toISOString().slice(0, 10)}  ${r.n} dials${r.n > CAP ? '  <-- OVER CAP' : ''}`);
  else L.push('  (none)');
  L.push('');
  if (fails.length) { L.push('FAILURES:'); for (const f of fails) L.push('  ! ' + f); L.push(''); }
  if (notes.length) { L.push('NOTES:'); for (const n of notes) L.push('  - ' + n); L.push(''); }
  L.push(`SPEND: ${spend.calls || 0} calls, ${spend.mins || 0} min, $${spend.usd || '0.00'}`);
  L.push('  (call_cost is Retell combined_cost in CENTS; divided by 100 above)');
  L.push('');
  L.push('OUTCOMES:');
  for (const r of outcomes) L.push(`  ${(r.r || 'null').padEnd(18)} ${(r.s || 'null').padEnd(10)} ${r.n}`);
  L.push('');
  L.push("Judge engagement by disconnection_reason, never duration -- 'inactivity' is the");
  L.push('agent monologuing at voicemail and those calls are long.');
  L.push('');
  L.push('If FAIL: /var/www/voice-agent/index.js -- claim UPDATE in placeOutboundCall and');
  L.push('the queueRunning guard in processOutboundQueue. Rollback: git revert 0f68999.');

  const body = L.join('\n');
  console.log(body);

  if (process.argv.includes('--no-email')) return;
  await ses.send(new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: [TO] },
    Message: { Subject: { Data: subject }, Body: { Text: { Data: body } } },
  }));
  console.log('\n[sent to ' + TO + ']');
})().catch(e => { console.error('verdict failed:', e.message); process.exit(1); });
