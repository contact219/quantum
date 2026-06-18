// Outreach to data journalism desks — they can use the API directly, not just visit the page
// Targeted at journalists who regularly cover Texas and publish data-driven investigations
require('dotenv').config();
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const DRY_RUN = process.argv.includes('--dry-run');

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM = 'contact@quantumsurety.bond';

const TARGETS = [
  { name: 'ProPublica Texas Data Team', email: 'texas@propublica.org', org: 'ProPublica Texas' },
  { name: 'Texas Tribune Data Desk', email: 'data@texastribune.org', org: 'Texas Tribune' },
  { name: 'Texas Tribune Tips', email: 'tips@texastribune.org', org: 'Texas Tribune' },
  { name: 'NPR Texas News', email: 'news@kut.org', org: 'KUT/NPR Austin' },
  { name: 'KERA News Data Team', email: 'news@kera.org', org: 'KERA Dallas' },
  { name: 'Houston Public Media', email: 'tips@houstonpublicmedia.org', org: 'Houston Public Media' },
  { name: 'San Antonio Report', email: 'tips@sareport.org', org: 'San Antonio Report' },
  { name: 'Dallas Observer Investigations', email: 'news@dallasobserver.com', org: 'Dallas Observer' },
  { name: 'Houston Press Tips', email: 'tips@houstonpress.com', org: 'Houston Press' },
  { name: 'Texas Monthly Investigations', email: 'editor@texasmonthly.com', org: 'Texas Monthly' },
];

const subject = 'Data tip + live API: 240,627 Texas contractors with expired bonds — TDLR public data';

function buildEmail(target) {
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;color:#1e293b;line-height:1.7;">
  <p>Hi ${target.name},</p>

  <p>I'm passing along a data tip that may be useful for ${target.org}'s investigative or consumer coverage — and providing a live public API so your team can pull fresh data directly.</p>

  <p><strong>The story:</strong> According to TDLR's own public data, <strong>240,627 Texas licensed contractors (31.0%) are currently operating with expired surety bonds</strong> — meaning they're out of compliance but still advertising and taking jobs from homeowners.</p>

  <p><strong>County breakdown (current):</strong></p>
  <ul style="padding-left:20px;margin:8px 0 16px;">
    <li>Harris County: <strong>41,799</strong> contractors with expired bonds (30.6% of Harris licensees)</li>
    <li>Dallas County: <strong>24,604</strong> expired (30.9%)</li>
    <li>Tarrant County: <strong>14,190</strong> expired (26.2%)</li>
    <li>Jefferson County: <strong>2,831</strong> expired (37.8% — worst large county)</li>
    <li>Hidalgo County: <strong>11,172</strong> expired (36.3%)</li>
  </ul>

  <p><strong>Live public API</strong> — your team can query this directly:</p>
  <div style="background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
    <div style="font-size:11px;color:#8b949e;font-family:monospace;margin-bottom:8px;">ENDPOINTS (no auth required):</div>
    <div style="font-family:monospace;font-size:12px;color:#4C9AC9;line-height:1.9;">
      GET https://verify.quantumsurety.bond/api/bond-watch/summary<br>
      GET https://verify.quantumsurety.bond/api/bond-watch/counties<br>
      GET https://verify.quantumsurety.bond/api/bond-watch/expiring?county=Harris&days=30&limit=50
    </div>
  </div>

  <p><strong>Interactive tool + leaderboard:</strong><br>
  <a href="https://quantumsurety.bond/bond-compliance-leaderboard">quantumsurety.bond/bond-compliance-leaderboard</a> — all 254 Texas counties ranked by compliance, with embeddable widget</p>

  <p><strong>Data source &amp; methodology:</strong> We pull from TDLR's public Socrata dataset (data.texas.gov, dataset 7358-krk7) daily. Bond expiration dates are matched against license records. This is the same data TDLR uses for its own compliance dashboard — we've just built a consumer-facing layer on top.</p>

  <p><strong>Potential angles:</strong></p>
  <ul style="padding-left:20px;margin:8px 0 16px;">
    <li>Which Texas counties have the worst contractor compliance rates?</li>
    <li>What recourse does a homeowner have when they hire a contractor whose bond has lapsed?</li>
    <li>Why does TDLR continue issuing licenses to contractors who let their bonds expire?</li>
    <li>How many Texas homeowners have suffered losses from contractors operating without a valid bond?</li>
  </ul>

  <p>Happy to provide a data export, methodology documentation, or connect you with a bond industry expert. I can also generate a county-specific data cut for any market you're covering.</p>

  <p>
    <strong>Quantum Surety LLC</strong><br>
    (214) 666-8718<br>
    contact@quantumsurety.bond<br>
    Texas-Licensed Surety Bond Agency · TDI License #3480229
  </p>

  <p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:20px;">
    This is a one-time tip. We are not seeking paid coverage. Data is public record from data.texas.gov.
  </p>
</div>`;

  const text = `Hi ${target.name},

I'm passing along a data tip for ${target.org} — with a live public API so your team can pull fresh data directly.

STORY: 240,627 Texas licensed contractors (31.0%) are operating with expired surety bonds right now.

County breakdown:
- Harris: 41,799 expired (30.6%)
- Dallas: 24,604 expired (30.9%)
- Jefferson: 2,831 expired (37.8% — worst large county)
- Hidalgo: 11,172 expired (36.3%)

LIVE API (no auth required):
https://verify.quantumsurety.bond/api/bond-watch/summary
https://verify.quantumsurety.bond/api/bond-watch/counties
https://verify.quantumsurety.bond/api/bond-watch/expiring?county=Harris&days=30

LEADERBOARD — all 254 counties ranked:
https://quantumsurety.bond/bond-compliance-leaderboard

Data source: TDLR public Socrata dataset (data.texas.gov, 7358-krk7), updated daily.

Happy to provide data exports, methodology docs, or connect you with industry experts.

(214) 666-8718 · contact@quantumsurety.bond
Quantum Surety LLC · TDI License #3480229`;

  return { html, text };
}

async function run() {
  console.log(`[DataPress] Starting data journalism outreach | dry_run=${DRY_RUN} | targets=${TARGETS.length}`);
  let sent = 0;
  for (const target of TARGETS) {
    if (DRY_RUN) {
      console.log(`[DataPress] DRY — ${target.email} (${target.org})`);
      continue;
    }
    try {
      const { html, text } = buildEmail(target);
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [target.email] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
        ReplyToAddresses: ['contact@quantumsurety.bond'],
      }));
      console.log(`[DataPress] Sent to ${target.org} (${target.email})`);
      sent++;
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(`[DataPress] Error ${target.email}:`, e.message);
    }
  }
  console.log(`[DataPress] Done. Sent=${sent}`);
}

run().catch(e => { console.error(e); process.exit(1); });
