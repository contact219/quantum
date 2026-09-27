require('dotenv').config({ path: '/var/www/bondverify/.env' });
const fs = require('fs');
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const nodemailer = require('/var/www/quantumsurety/node_modules/nodemailer');
const { SESClient, SendEmailCommand, unsubUrl } = require('../lib/qs_ses.cjs');

/**
 * Title bond inbound follow-up: 3 touches for people who asked us for a Texas certificate of title
 * bond (site form or title calculator) and haven't bought. Outreach gauntlet 2026-09-27 (title piece,
 * won blind; critic's gaps closed).
 *
 * Why: 9 inbound title people in 90 days, 5 bought, all 5 after talking to a person. The 4 who didn't
 * got only the generic "free quote" email, and the calculator promised a certificate email nothing
 * sent. This replaces the generic next-day email for title leads.
 *
 *   touch 1  day 1   SES (signed one-click unsubscribe)  what finishing means, 1.5x value, 3-yr term,
 *                                                         premium ESTIMATE, RLI link, "just reply"
 *   touch 2  day 5   Zoho, one-to-one plain text         saved-draft variant (reply and I'll finish it
 *                                                         from my side) or "anything holding you up?"
 *   touch 3  day 21  Zoho, one-to-one plain text         last note
 * Three emails per person, ever (title_followup_sends, UNIQUE(lead_email, touch_number)).
 *
 * Stops when: an issued/pending/converted RLI bond matches (email or normalised name); the lead is
 * sold / no_follow_up; its notes contain "replied" (add that word to the lead's notes when someone
 * replies); the address is in EITHER unsubscribe table. A 'stop' reply to a Zoho touch must be added
 * to the unsubscribe tables by hand.
 *
 * No phone number anywhere: (214) 666-8718 is the automated AI line, and its live transfer failed on
 * two title calls. Replies go to administrator@ (Ted).
 *
 * Sources: 1.5x value and 3-year term, Tex. Transp. Code 501.053. Premium: every priced title bond in
 * our RLI book is 1.5% of the bond amount, $100 minimum (shared/title-bond-pricing.ts); RLI publishes
 * no rate card to us, so the copy says "estimate" and that RLI shows the exact premium before payment.
 *
 * Usage: node title_inbound_followup.cjs [--send] [--limit N]   (dry run by default)
 */

const SEND = process.argv.includes('--send');
const LI = process.argv.indexOf('--limit');
const LIMIT = LI !== -1 ? parseInt(process.argv[LI + 1], 10) : 10;
const FROM = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY = 'administrator@quantumsurety.bond';
const APPLY = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX';
const DAY = 86400000;
// Leads never to follow up, with the reason. 56829 (Lorenzo) probably bought as Izayuri, bond
// MBS0063746 issued 2026-09-24, under a different name and no phone, so no match catches it. Remove
// once Ted confirms and marks the lead sold.
const EXCLUDE_LEAD_IDS = new Set([56829]);

// Zoho credentials live in the main site's .env (same mailbox the site's instant email uses).
const siteEnv = {};
for (const line of fs.readFileSync('/var/www/quantumsurety/.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
  if (m) siteEnv[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1');
}

const pool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASS, database: process.env.DB_NAME, connectionLimit: 2, timezone: '+00:00' });
const ses = new SESClient({ region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET } });

const money = n => '$' + Math.round(n).toLocaleString('en-US');
const premiumEstimate = bond => Math.max(100, Math.round(bond * 0.015));
const firstName = name => {
  const f = String(name || '').trim().split(/\s+/)[0] || '';
  return /^[a-z][a-z'-]*$/i.test(f) ? f.charAt(0).toUpperCase() + f.slice(1).toLowerCase() : '';
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => String(s || '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();

function touch1(lead) {
  const n = firstName(lead.name);
  const m = String(lead.notes || '').match(/Bond Amount:\s*\$([\d,]+(?:\.\d+)?)/i);
  const bond = m ? parseFloat(m[1].replace(/,/g, '')) : null;
  const link = APPLY + '&utm_source=email&utm_medium=title-followup&utm_campaign=title-t1';
  const valueLine = bond
    ? `Using the value you entered, the bond would be about ${money(bond)}. If TxDMV's value differs, the bond changes with it. Our estimate for the premium is 1.5% of the bond amount, $100 minimum, paid once, so about ${money(premiumEstimate(bond))}.`
    : `Our estimate for the premium is 1.5% of the bond amount, $100 minimum, paid once.`;
  const paras = [
    `You asked about a Texas certificate of title bond on our site. One thing to know first: sending the form doesn't buy the bond. It is issued once the application with our carrier, RLI, is finished.`,
    `Texas sets the bond at 1.5 times the vehicle's value as determined by TxDMV, and the bond runs 3 years. ${valueLine} The exact premium is shown on the application before you pay anything.`,
  ];
  const unsub = unsubUrl(lead.email);
  const subject = n ? `${n}, finishing your Texas title bond` : 'Finishing your Texas title bond';
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:15px">
<p>Hi ${esc(n || 'there')},</p>${paras.map(p => `<p style="color:#334155">${esc(p)}</p>`).join('')}
<p style="margin:24px 0"><a href="${link}" style="background:#0d9488;color:#fff;padding:12px 26px;border-radius:6px;text-decoration:none;font-weight:700">Finish my title bond application</a></p>
<p style="color:#334155">Questions first? Just reply to this email. It comes to me.</p>
<p style="color:#334155">&mdash; Ted</p>
<p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:24px">Theodore Sparks · Quantum Surety LLC · TDI #3480229 · 1416 Bessie Drive, Wylie, TX 75098 · <a href="${unsub}" style="color:#94a3b8">Unsubscribe</a></p></div>`;
  const text = `Hi ${n || 'there'},\n\n${paras.join('\n\n')}\n\nFinish my title bond application: ${link}\n\nQuestions first? Just reply to this email. It comes to me.\n\n- Ted\nTheodore Sparks, Quantum Surety LLC, TDI #3480229, 1416 Bessie Drive, Wylie, TX 75098\nUnsubscribe: ${unsub}\n`;
  return { subject, html, text };
}

function touch2(lead, draft) {
  const n = firstName(lead.name) || 'there';
  const stop = `(If you'd rather not hear from me again, reply "stop" and I won't.)`;
  if (draft) {
    const prem = Number(draft.premium) > 0 ? ` The application showed a premium of ${money(Number(draft.premium))}, paid once, for a bond that runs 3 years.` : '';
    return { subject: 'Your title bond application', text:
`Hi ${n},

You started your title bond application with RLI, but it wasn't submitted. A saved application can't be reopened from an email link. If you reply to this email, I'll open it from my side and we can finish it together over email, so you don't have to start over.${prem}

- Ted
${stop}` };
  }
  return { subject: 'Anything holding up your title bond?', text:
`Hi ${n},

Checking in on your certificate of title bond. People usually get stuck on one of three things: the vehicle value TxDMV uses, the paperwork the county asks for, or the price. If it's any of those, reply with your question and I'll answer it.

If you're ready, the application is here: ${APPLY}&utm_source=email&utm_medium=title-followup&utm_campaign=title-t2
The exact premium is shown before you pay.

- Ted
${stop}` };
}

function touch3(lead) {
  const n = firstName(lead.name) || 'there';
  return { subject: 'Last note on your title bond', text:
`Hi ${n}, this is my last email about it. If you still need the bond, the application is here: ${APPLY}&utm_source=email&utm_medium=title-followup&utm_campaign=title-t3
Or reply and I'll help you finish it. If you've already sorted it out, no reply needed.

- Ted
(If you'd rather not hear from me again, reply "stop" and I won't.)` };
}

async function main() {
  await pool.query(`CREATE TABLE IF NOT EXISTS title_followup_sends (
    id INT AUTO_INCREMENT PRIMARY KEY, lead_id INT NOT NULL, lead_email VARCHAR(255) NOT NULL,
    touch_number TINYINT NOT NULL, channel VARCHAR(10) NOT NULL, subject VARCHAR(255),
    sent_at DATETIME NOT NULL DEFAULT UTC_TIMESTAMP(),
    UNIQUE KEY one_touch (lead_email, touch_number)) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci`);

  const pg = new Client({ host: process.env.CRM_PG_HOST, port: parseInt(process.env.CRM_PG_PORT || '5433', 10),
    database: process.env.CRM_PG_DB, user: process.env.CRM_PG_USER, password: process.env.CRM_PG_PASS,
    connectionTimeoutMillis: 15000, statement_timeout: 30000 });
  await pg.connect();
  let leads, bonds, crmUnsub;
  try {
    ({ rows: leads } = await pg.query(`
      SELECT DISTINCT ON (lower(trim(email))) id, name, lower(trim(email)) AS email, notes, status, created_at,
             right(regexp_replace(coalesce(phone,''), '[^0-9]', '', 'g'), 10) AS phone10
        FROM leads
       WHERE bond_type IN ('title','bonded-title','vehicle-title') AND source <> 'craigslist-title'
         AND email ~ '@' AND email !~* 'placeholder|example|noemail'
         AND status NOT IN ('sold','no_follow_up')
         AND coalesce(notes,'') !~* 'replied'
         AND created_at > now() - interval '35 days' AND created_at < now() - interval '4 hours'
       ORDER BY lower(trim(email)), created_at ASC`));
    ({ rows: bonds } = await pg.query(`
      SELECT lower(trim(coalesce(insured_email,''))) AS email, insured_name, status, premium,
             right(regexp_replace(coalesce(insured_phone,''), '[^0-9]', '', 'g'), 10) AS phone10
        FROM bk_bonds WHERE bond_type IN ('unknown','title')
          AND status IN ('issued','pending','converted','saved')`));
    ({ rows: crmUnsub } = await pg.query(`SELECT lower(trim(email)) e FROM unsubscribes`));
  } finally { await pg.end(); }

  const [bvUnsub] = await pool.query('SELECT LOWER(TRIM(email)) e FROM unsubscribes');
  const suppressed = new Set([...crmUnsub.map(r => r.e), ...bvUnsub.map(r => r.e)]);
  const [sentRows] = await pool.query('SELECT lead_email, touch_number, sent_at FROM title_followup_sends');
  const sent = new Map();   // email -> {1: date, 2: date, 3: date}
  for (const r of sentRows) { const k = r.lead_email.toLowerCase(); sent.set(k, { ...(sent.get(k) || {}), [r.touch_number]: new Date(r.sent_at) }); }

  const zoho = nodemailer.createTransport({ host: 'smtp.zoho.com', port: 465, secure: true,
    auth: { user: siteEnv.ZOHO_EMAIL, pass: siteEnv.ZOHO_APP_PASSWORD } });

  const now = Date.now();
  let done = 0, skipped = 0, failed = 0;
  console.log(`[title-followup] ${leads.length} open inbound title leads (last 35 days) | ${SEND ? 'SEND' : 'DRY RUN'}`);
  for (const lead of leads) {
    if (done >= LIMIT) break;
    const nn = norm(lead.name);
    const nFirst = nn.split(' ')[0], nLast = nn.split(' ').slice(-1)[0];
    if (EXCLUDE_LEAD_IDS.has(lead.id)) { skipped++; continue; }
    const mine = bonds.filter(b => (b.email && b.email === lead.email) ||
      (lead.phone10 && lead.phone10.length === 10 && b.phone10 === lead.phone10) ||
      (nn && norm(b.insured_name) && (norm(b.insured_name) === nn ||
        (norm(b.insured_name).split(' ')[0] === nFirst && norm(b.insured_name).split(' ').slice(-1)[0] === nLast))));
    if (mine.some(b => b.status !== 'saved')) { skipped++; continue; }         // bought (or in progress with RLI)
    if (suppressed.has(lead.email)) { skipped++; continue; }
    const draft = mine.find(b => b.status === 'saved') || null;
    const s = sent.get(lead.email) || {};
    const age = (now - new Date(lead.created_at).getTime()) / DAY;
    const since = t => (s[t] ? (now - s[t].getTime()) / DAY : null);

    let touch = null;
    if (!s[1] && !s[2] && age < 4) touch = 1;
    // Touch 2 runs to day 35 (the query window) so people who were already past day 21 when this
    // started, e.g. the saved-draft drop-offs, still get one personal note; touch 3 follows 10+ days later.
    else if (!s[2] && age >= 5 && (since(1) === null || since(1) >= 4)) touch = 2;
    else if (s[2] && !s[3] && age >= 21 && since(2) >= 10) touch = 3;
    if (!touch) continue;

    const msg = touch === 1 ? touch1(lead) : touch === 2 ? touch2(lead, draft) : touch3(lead);
    const channel = touch === 1 ? 'ses' : 'zoho';
    if (!SEND) {
      console.log(`  [DRY] lead ${lead.id} | age ${age.toFixed(1)}d | touch ${touch} via ${channel}${touch === 2 ? (draft ? ' (draft)' : ' (no draft)') : ''} | "${msg.subject}"`);
      done++; continue;
    }
    try {
      // Reserve the slot first so a crash between send and log can't produce a second send.
      const [ins] = await pool.execute('INSERT IGNORE INTO title_followup_sends (lead_id, lead_email, touch_number, channel, subject) VALUES (?,?,?,?,?)',
        [lead.id, lead.email, touch, channel, msg.subject]);
      if (ins.affectedRows !== 1) { skipped++; continue; }
      if (channel === 'ses') {
        await ses.send(new SendEmailCommand({ Source: FROM, ReplyToAddresses: [REPLY], Destination: { ToAddresses: [lead.email] },
          Message: { Subject: { Data: msg.subject }, Body: { Html: { Data: msg.html }, Text: { Data: msg.text } } },
          Tags: [{ Name: 'campaign', Value: 'title-followup-t1' }] }));
      } else {
        await zoho.sendMail({ from: FROM, to: lead.email, replyTo: REPLY, subject: msg.subject, text: msg.text });
      }
      console.log(`  sent touch ${touch} (${channel}) to lead ${lead.id}`);
      done++;
    } catch (e) {
      failed++;
      console.error(`  FAIL lead ${lead.id} touch ${touch}: ${e.message}`);
      await pool.execute('DELETE FROM title_followup_sends WHERE lead_email = ? AND touch_number = ?', [lead.email, touch]).catch(() => {});
    }
    if (channel === 'zoho') await new Promise(r => setTimeout(r, 20000));   // one at a time, spaced
  }
  console.log(`[title-followup] ${SEND ? 'sent' : 'would send'} ${done} | skipped ${skipped} | failed ${failed}`);
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
