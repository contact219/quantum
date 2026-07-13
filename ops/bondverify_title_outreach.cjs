#!/usr/bin/env node
/**
 * bondverify_title_outreach.cjs — B2B outreach to TX title companies pitching
 * the Bond Verify API (real-time notary bond verification, free tier + paid).
 *
 * Cold commercial email — CAN-SPAM compliant: real physical address, working
 * unsubscribe, accurate from/subject, honors opt-outs. Only sends to
 * hand-verified business emails (no guessed addresses — protects SES rep).
 * One send per address ever (bondverify_outreach_sends), skips unsubscribes.
 *
 * Usage: node bondverify_title_outreach.cjs --dry-run | node ...
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const DRY_RUN = process.argv.includes('--dry-run');
const RATE_MS = 400;
const ses = new SESClient({ region: 'us-east-2', credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET } });

const FROM = 'Ted Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const DOCS = 'https://verify.quantumsurety.bond/api-docs.html';
const ADDR = 'Quantum Surety LLC · 1416 Bessie Drive, Wylie, TX 75098';

// Hand-verified title-company contacts only (email_verified=yes in the lead list).
const CONTACTS = [
  { first: 'Justin', company: 'Independence Title',   email: 'Justin.Williams@IndependenceTitle.com' },
  { first: '',       company: 'Ghrist Law & Title',   email: 'closing@ghrist.law' },
  { first: '',       company: 'Valero Title',         email: 'Houston@valerotitle.com' },
  { first: 'Ashley', company: 'Declaration Title',    email: 'Ashley@declarationtitle.com' },
  { first: '',       company: 'CLOSED Texas',         email: 'sbush@closedtitle.com' },
];

function buildEmail(c) {
  const hi = c.first ? `Hi ${c.first},` : `Hi ${c.company} team,`;
  const subject = c.first
    ? `${c.first} — a faster notary-bond check before closings`
    : `A faster notary-bond check before closings`;
  const unsub = `https://quantumsurety.bond/api/unsubscribe?e=${encodeURIComponent(c.email)}`;

  const html = `<div style="font-family:-apple-system,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.65;font-size:14px">
<p>${hi}</p>
<p>Quick question &mdash; when your team confirms a notary's bond and commission are current before a closing, are they still doing it by hand on the Texas SOS site, one name at a time?</p>
<p>I run Quantum Surety, and we built <strong>Bond Verify</strong> to close that gap: a real-time API over <strong>558,000+ Texas notary bond records</strong> pulled directly from the Secretary of State. One call returns commission dates, expiration, and current status &mdash; active, expiring, or expired &mdash; so a lapsed bond gets caught <em>before</em> closing, not after.</p>
<p style="color:#475569">Why it matters for ${c.company}: if a notary's bond has quietly lapsed and it's missed at the table, that E&amp;O exposure ends up on your file, not theirs.</p>
<p style="text-align:center;margin:26px 0"><a href="${DOCS}" style="background:#2563eb;color:#fff;text-decoration:none;padding:13px 30px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">Get a free API key &rarr;</a></p>
<p>It's free to start &mdash; 1,000 lookups/day, key in your inbox in under a minute. If you verify at real volume, there are paid tiers ($49/mo Starter, $149/mo Pro with status-change webhook alerts), but I'd rather you try the free one first and see if it saves your team time.</p>
<p>Happy to do a quick 10-minute call if it's easier to talk through how it'd fit your closing workflow &mdash; just reply, or call me directly.</p>
<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:22px">Ted Sparks &middot; Quantum Surety LLC &middot; TDI License #3480229<br><a href="tel:+12146668718" style="color:#2563eb">(214) 666-8718</a> &middot; ted@quantumsurety.bond</p>
<p style="color:#94a3b8;font-size:11px;margin-top:12px">${ADDR}<br>You received this as a Texas title professional. <a href="${unsub}" style="color:#94a3b8">Unsubscribe</a>, or just reply "no thanks" and I'll take you off the list.</p>
</div>`;

  const text = `${hi}

When your team confirms a notary's bond and commission are current before a closing, are they still doing it by hand on the Texas SOS site?

We built Bond Verify to close that gap: a real-time API over 558,000+ Texas notary bond records straight from the Secretary of State. One call returns commission dates, expiration, and current status (active/expiring/expired) -- so a lapsed bond gets caught before closing, not after.

Free to start (1,000 lookups/day), key in under a minute: ${DOCS}
Paid tiers for volume: $49/mo Starter, $149/mo Pro (webhook alerts).

Happy to do a 10-minute call -- just reply or call (214) 666-8718.

Ted Sparks -- Quantum Surety LLC -- TDI #3480229
${ADDR}
Unsubscribe: ${unsub} (or reply "no thanks")`;

  return { subject, html, text };
}

async function main() {
  const db = new Client({ host: 'localhost', port: 5433, database: 'quantum_surety', user: 'quantum_user', password: process.env.CRM_DB_PASSWORD });
  await db.connect();
  await db.query(`CREATE TABLE IF NOT EXISTS bondverify_outreach_sends (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, company TEXT, sent_at TIMESTAMPTZ DEFAULT NOW())`);

  console.log(`[BondVerifyTitleOutreach] ${CONTACTS.length} verified contacts${DRY_RUN ? ' (DRY RUN)' : ''}`);
  let sent = 0;
  for (const c of CONTACTS) {
    const key = c.email.trim().toLowerCase();
    const already = await db.query(`SELECT 1 FROM bondverify_outreach_sends WHERE lower(email)=$1`, [key]);
    if (already.rows.length) { console.log(`  - skip (already sent): ${c.email}`); continue; }
    const unsub = await db.query(`SELECT 1 FROM unsubscribes WHERE lower(email)=$1`, [key]);
    if (unsub.rows.length) { console.log(`  - skip (unsubscribed): ${c.email}`); continue; }

    const { subject, html, text } = buildEmail(c);
    if (DRY_RUN) { console.log(`  [DRY] ${c.company} <${c.email}> | "${subject}"`); sent++; continue; }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [c.email.trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        Tags: [{ Name: 'campaign', Value: 'bondverify-title-outreach' }],
      }));
      await db.query(`INSERT INTO bondverify_outreach_sends (email, company) VALUES ($1,$2) ON CONFLICT (email) DO NOTHING`, [c.email.trim(), c.company]);
      console.log(`  ✓ ${c.company} <${c.email}>`);
      sent++;
    } catch (e) { console.error(`  ✗ ${c.email}: ${e.message}`); }
    await new Promise(r => setTimeout(r, RATE_MS));
  }
  await db.end();
  console.log(`[BondVerifyTitleOutreach] Done. ${sent}/${CONTACTS.length} ${DRY_RUN ? 'previewed' : 'sent'}.`);
}
main().catch(e => { console.error(e); process.exit(1); });
