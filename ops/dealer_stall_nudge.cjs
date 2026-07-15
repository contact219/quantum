#!/usr/bin/env node
/**
 * dealer_stall_nudge.cjs — targeted second-touch to GDN dealer-bond applicants
 * who filled out the whole mybondapp form and stalled at the final step.
 *
 * These are high-value ($250-300 premium, ~$75-90 commission) vs the generic
 * saved-bond recovery email, which isn't tuned for dealers. This one addresses
 * the two things that stall a dealer at the finish: the price and the TxDMV
 * timing. Hand-verified emails only (deduped, no typo'd addresses). One send
 * per address (dealer_stall_nudge_sends), skips unsubscribes. CAN-SPAM footer.
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { Client } = require('pg');

const DRY_RUN = process.argv.includes('--dry-run');
const RATE_MS = 400;
const ses = new SESClient({ region: 'us-east-2', credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SES_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SES_SECRET } });

const FROM = 'Ted Sparks <ted@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const RESUME = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX';
const ADDR = 'Quantum Surety LLC · 1416 Bessie Drive, Wylie, TX 75098';

// The 9 dealer stalls deduped to 5 unique dealerships w/ verified emails.
const CONTACTS = [
  { dealer: 'Turner Chevrolet',      email: 'kmunk@turnerchevroletcrosby.com', premium: 300 },
  { dealer: 'Valley Diesel Truck Sales', email: 'valleydieselts@yahoo.com',    premium: 300 },
  { dealer: 'Nobel Motors',          email: 'motors@nobelplus.com',            premium: 300 },
  { dealer: 'Texas Discount Tire',   email: 'texasdiscounttire@yahoo.com',     premium: 250 },
  { dealer: 'US Gulf Coast Auto Sales', email: 'alliedcenter2011@yahoo.com',   premium: 250 },
];

function buildEmail(c) {
  const subject = `${c.dealer} — your Texas dealer bond is one step from done`;
  const unsub = `https://quantumsurety.bond/api/unsubscribe?e=${encodeURIComponent(c.email)}`;
  const html = `<div style="font-family:-apple-system,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.65;font-size:14px">
<p>Hi there,</p>
<p>You started a <strong>Texas GDN Dealer Bond</strong> for ${c.dealer} with us, and got all the way through the application &mdash; but the last step never got finished. Your info is saved, so picking it back up takes about 2 minutes.</p>
<p>I wanted to reach out personally, because a dealer bond is a bigger commitment than most, and the finish line is where people usually pause. Two things that tend to help:</p>
<ul style="color:#334155;padding-left:20px;margin:0 0 4px">
<li>The <strong>$${c.premium}</strong> is the annual premium for your <strong>$25,000 TxDMV-required GDN bond</strong> &mdash; the standard rate, written by RLI Insurance (A+ rated). No surprises at checkout.</li>
<li>Your bond certificate is emailed the <strong>same day</strong> you finish, accepted by TxDMV for your dealer license &mdash; no waiting on us.</li>
</ul>
<p style="text-align:center;margin:26px 0"><a href="${RESUME}" style="background:#2563eb;color:#fff;text-decoration:none;padding:13px 30px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">Finish My Dealer Bond &rarr;</a></p>
<p>If something gave you pause &mdash; the price, a question about the bond amount, or the paperwork &mdash; just reply, or call me directly at <strong>(214) 666-8718</strong>. Happy to walk you through it and get your license moving.</p>
<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:22px">Ted Sparks &middot; Quantum Surety LLC &middot; TDI License #3480229<br><a href="tel:+12146668718" style="color:#2563eb">(214) 666-8718</a> &middot; ted@quantumsurety.bond</p>
<p style="color:#94a3b8;font-size:11px;margin-top:12px">${ADDR}<br><a href="${unsub}" style="color:#94a3b8">Unsubscribe</a>, or reply "no thanks" and I'll take you off the list.</p>
</div>`;
  const text = `Hi there,

You started a Texas GDN Dealer Bond for ${c.dealer} and got through the whole application, but the last step never got finished. Your info is saved -- picking it back up takes about 2 minutes.

Two things that tend to help at the finish:
- The $${c.premium} is the annual premium for your $25,000 TxDMV-required GDN bond -- the standard rate, written by RLI Insurance (A+ rated).
- Your certificate is emailed the same day you finish, accepted by TxDMV -- no waiting.

Finish here: ${RESUME}

Gave you pause on price, the bond amount, or paperwork? Reply or call me at (214) 666-8718 and I'll walk you through it.

Ted Sparks -- Quantum Surety LLC -- TDI #3480229
${ADDR}
Unsubscribe: ${unsub} (or reply "no thanks")`;
  return { subject, html, text };
}

async function main() {
  const db = new Client({ host: 'localhost', port: 5433, database: 'quantum_surety', user: 'quantum_user', password: process.env.CRM_DB_PASSWORD });
  await db.connect();
  await db.query(`CREATE TABLE IF NOT EXISTS dealer_stall_nudge_sends (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, dealer TEXT, sent_at TIMESTAMPTZ DEFAULT NOW())`);

  console.log(`[DealerStallNudge] ${CONTACTS.length} dealer stalls${DRY_RUN ? ' (DRY RUN)' : ''}`);
  let sent = 0;
  for (const c of CONTACTS) {
    const key = c.email.trim().toLowerCase();
    if ((await db.query(`SELECT 1 FROM dealer_stall_nudge_sends WHERE lower(email)=$1`, [key])).rows.length) { console.log(`  - skip (already sent): ${c.email}`); continue; }
    if ((await db.query(`SELECT 1 FROM unsubscribes WHERE lower(email)=$1`, [key])).rows.length) { console.log(`  - skip (unsubscribed): ${c.email}`); continue; }
    const { subject, html, text } = buildEmail(c);
    if (DRY_RUN) { console.log(`  [DRY] ${c.dealer} <${c.email}> $${c.premium} | "${subject}"`); sent++; continue; }
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [c.email.trim()] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        Tags: [{ Name: 'campaign', Value: 'dealer-stall-nudge' }],
      }));
      await db.query(`INSERT INTO dealer_stall_nudge_sends (email, dealer) VALUES ($1,$2) ON CONFLICT (email) DO NOTHING`, [c.email.trim(), c.dealer]);
      console.log(`  ✓ ${c.dealer} <${c.email}>`);
      sent++;
    } catch (e) { console.error(`  ✗ ${c.email}: ${e.message}`); }
    await new Promise(r => setTimeout(r, RATE_MS));
  }
  await db.end();
  console.log(`[DealerStallNudge] Done. ${sent}/${CONTACTS.length} ${DRY_RUN ? 'previewed' : 'sent'}.`);
}
main().catch(e => { console.error(e); process.exit(1); });
