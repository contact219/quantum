const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const DRY_RUN = process.argv.includes('--dry-run');
const ses = new SESClient({ region: 'us-east-2', credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET } });
const FROM = 'contact@quantumsurety.bond';
const TARGETS = [
  { name: 'ProPublica Texas Data Team', email: 'texas@propublica.org', org: 'ProPublica Texas' },
  { name: 'Texas Tribune Data Desk', email: 'data@texastribune.org', org: 'Texas Tribune' },
  { name: 'NPR KUT Austin', email: 'news@kut.org', org: 'KUT/NPR Austin' },
  { name: 'KERA News Dallas', email: 'news@kera.org', org: 'KERA Dallas' },
  { name: 'Houston Public Media', email: 'tips@houstonpublicmedia.org', org: 'Houston Public Media' },
  { name: 'San Antonio Report', email: 'tips@sareport.org', org: 'San Antonio Report' },
  { name: 'Dallas Observer', email: 'news@dallasobserver.com', org: 'Dallas Observer' },
  { name: 'Houston Press', email: 'tips@houstonpress.com', org: 'Houston Press' },
  { name: 'Texas Monthly', email: 'editor@texasmonthly.com', org: 'Texas Monthly' },
];
const subject = 'Data tip + live API: 240,627 Texas contractors with expired bonds — TDLR public data';
function buildEmail(t) {
  const html = `<div style="font-family:-apple-system,sans-serif;max-width:640px;color:#1e293b;line-height:1.7;"><p>Hi ${t.name},</p><p>I'm passing along a data tip for ${t.org} — with a live public API so your team can pull fresh data directly.</p><p><strong>The story:</strong> Per TDLR public records, <strong>240,627 Texas licensed contractors (31.0%)</strong> are currently operating with expired surety bonds — out of compliance but still advertising and taking jobs from homeowners.</p><ul style="padding-left:20px;margin:8px 0 16px;"><li>Harris County: 41,799 expired (30.6%)</li><li>Dallas County: 24,604 expired (30.9%)</li><li>Jefferson County: 2,831 expired (37.8% — worst large county)</li><li>Hidalgo County: 11,172 expired (36.3%)</li></ul><p><strong>Live API (no auth required):</strong></p><div style="background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:14px;margin-bottom:16px;font-family:monospace;font-size:12px;color:#4C9AC9;line-height:1.9;">GET https://verify.quantumsurety.bond/api/bond-watch/summary<br>GET https://verify.quantumsurety.bond/api/bond-watch/counties<br>GET https://verify.quantumsurety.bond/api/bond-watch/expiring?county=Harris&days=30</div><p>County leaderboard (all 254 TX counties ranked): <a href="https://quantumsurety.bond/bond-compliance-leaderboard">quantumsurety.bond/bond-compliance-leaderboard</a></p><p>Data source: TDLR Socrata dataset (data.texas.gov, 7358-krk7), updated daily. Happy to provide exports, methodology, or a county-specific cut.</p><p><strong>Quantum Surety LLC</strong> · (214) 666-8718 · TDI License #3480229</p><p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;">One-time tip. Not seeking paid coverage. Data is public record.</p></div>`;
  const text = `Hi ${t.name},\n\nData tip for ${t.org}: 240,627 Texas contractors (31.0%) have expired bonds.\n\nHarris: 41,799 | Dallas: 24,604 | Jefferson: 2,831 (37.8% worst) | Hidalgo: 11,172\n\nLive API: https://verify.quantumsurety.bond/api/bond-watch/summary\nCounty leaderboard: https://quantumsurety.bond/bond-compliance-leaderboard\nData: TDLR Socrata 7358-krk7, updated daily.\n\nQuantum Surety LLC · (214) 666-8718 · TDI #3480229`;
  return { html, text };
}
async function run() {
  console.log(`[DataPress] targets=${TARGETS.length} dry=${DRY_RUN}`);
  let sent = 0;
  for (const t of TARGETS) {
    if (DRY_RUN) { console.log(`DRY ${t.email}`); continue; }
    try {
      const { html, text } = buildEmail(t);
      await ses.send(new SendEmailCommand({ Source: FROM, Destination: { ToAddresses: [t.email] }, Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } }, ReplyToAddresses: ['contact@quantumsurety.bond'] }));
      console.log(`Sent -> ${t.org} (${t.email})`);
      sent++;
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) { console.error(`Error ${t.email}: ${e.message}`); }
  }
  console.log(`Done. Sent=${sent}/${TARGETS.length}`);
}
run().catch(e => { console.error(e); process.exit(1); });
