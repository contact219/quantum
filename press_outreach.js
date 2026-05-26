// Press outreach to Texas business journalists
// Run: node press_outreach.js [--dry-run]
require('dotenv').config();
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const DRY_RUN = process.argv.includes('--dry-run');

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM = 'contact@quantumsurety.bond';

// Texas business journalists and news desks — verified public contact addresses
const TARGETS = [
  { name: 'Dallas Morning News Business Desk', email: 'business@dallasnews.com', outlet: 'Dallas Morning News' },
  { name: 'Houston Chronicle Business Desk', email: 'business@houstonchronicle.com', outlet: 'Houston Chronicle' },
  { name: 'Austin American-Statesman Business', email: 'business@statesman.com', outlet: 'Austin American-Statesman' },
  { name: 'Dallas Business Journal', email: 'dallas@bizjournals.com', outlet: 'Dallas Business Journal' },
  { name: 'Houston Business Journal', email: 'houston@bizjournals.com', outlet: 'Houston Business Journal' },
  { name: 'San Antonio Business Journal', email: 'sanantonio@bizjournals.com', outlet: 'San Antonio Business Journal' },
  { name: 'Austin Business Journal', email: 'austin@bizjournals.com', outlet: 'Austin Business Journal' },
  { name: 'Texas Tribune Economy', email: 'tips@texastribune.org', outlet: 'Texas Tribune' },
  { name: 'Fort Worth Star-Telegram Business', email: 'business@star-telegram.com', outlet: 'Fort Worth Star-Telegram' },
  { name: 'San Antonio Express-News Business', email: 'business@express-news.net', outlet: 'San Antonio Express-News' },
];

const SUBJECT = 'STORY TIP: Nearly 1 in 3 Texas Licensed Contractors Operating With Expired Bonds — New Database';

function buildEmail(target) {
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;color:#1e293b;line-height:1.7;">
  <p>Hi ${target.name},</p>

  <p>I'm reaching out from Quantum Surety LLC, a Texas-licensed surety bond agency. We just launched a free public compliance database that uncovered a significant consumer protection story I thought your readers would find compelling.</p>

  <p><strong>The short version:</strong> Nearly 1 in 3 Texas licensed contractors (226,767 of 775,171 total) are currently operating with expired surety bonds — meaning they are legally required to carry a bond but don't. An additional 34,480 have bonds expiring in the next 30 days.</p>

  <p><strong>Why this matters to ${target.outlet} readers:</strong></p>
  <ul style="padding-left:20px;margin:8px 0 16px;">
    <li>Texas homeowners routinely hire contractors assuming "licensed = bonded and insured"</li>
    <li>A license doesn't expire when a bond does — contractors can keep advertising as "licensed" after their bond lapses</li>
    <li>Without an active bond, consumers have no financial recourse if a project goes wrong</li>
    <li>Harris County: 6,282 contractors with bonds expiring in the next 30 days alone</li>
  </ul>

  <p><strong>What we built:</strong> Texas Bond Watch (<a href="https://quantumsurety.bond/texas-bond-watch">quantumsurety.bond/texas-bond-watch</a>) — a free real-time tracker pulling daily data from TDLR (775K contractors) and the Texas Secretary of State (558K notaries). Anyone can search their county and see which contractors' bonds are lapsed or expiring.</p>

  <p>We're happy to provide:</p>
  <ul style="padding-left:20px;margin:8px 0 16px;">
    <li>Full data export for your county or metro area</li>
    <li>Expert comment / interview on Texas contractor bond compliance</li>
    <li>Data visualizations broken down by trade type, county, or city</li>
  </ul>

  <p>Live data is at <a href="https://quantumsurety.bond/texas-bond-watch">quantumsurety.bond/texas-bond-watch</a>. The raw API is at <a href="https://verify.quantumsurety.bond/api/bond-watch/summary">verify.quantumsurety.bond/api/bond-watch/summary</a>.</p>

  <p>Happy to answer any questions or set up a call. Thank you for your time.</p>

  <p style="margin-top:20px;">Best,<br>
  <strong>Quantum Surety LLC</strong><br>
  (214) 666-8718<br>
  contact@quantumsurety.bond<br>
  <a href="https://quantumsurety.bond">quantumsurety.bond</a></p>

  <p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:20px;">
    Quantum Surety LLC · Texas-Licensed Surety Bond Agency · TDLR data refreshed daily from data.texas.gov · TX SOS data refreshed monthly
  </p>
</div>`;

  const text = `Hi ${target.name},

I'm reaching out from Quantum Surety LLC, a Texas-licensed surety bond agency. We just launched a free public compliance database that uncovered a significant consumer protection story.

Nearly 1 in 3 Texas licensed contractors (226,767 of 775,171) are operating with expired surety bonds. An additional 34,480 have bonds expiring in the next 30 days.

Harris County: 6,282 contractors with bonds expiring this month alone.

Texas Bond Watch: https://quantumsurety.bond/texas-bond-watch

We're happy to provide data exports, expert comment, or an interview. Please reach out.

Quantum Surety LLC
(214) 666-8718
contact@quantumsurety.bond`;

  return { html, text };
}

async function run() {
  console.log(`[Press] Starting journalist outreach | dry_run=${DRY_RUN} | targets=${TARGETS.length}`);

  for (const target of TARGETS) {
    if (DRY_RUN) {
      console.log(`[Press] DRY RUN — would send to: ${target.email} (${target.outlet})`);
      continue;
    }
    try {
      const { html, text } = buildEmail(target);
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [target.email] },
        Message: {
          Subject: { Data: SUBJECT },
          Body: { Html: { Data: html }, Text: { Data: text } },
        },
        ReplyToAddresses: ['contact@quantumsurety.bond'],
      }));
      console.log(`[Press] Sent to ${target.outlet} (${target.email})`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(`[Press] Error for ${target.email}:`, e.message);
    }
  }

  console.log('[Press] Done.');
}

run().catch(e => { console.error(e); process.exit(1); });
