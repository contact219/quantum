#!/usr/bin/env node
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET }
});
const FROM = 'contact@quantumsurety.bond';

// Already sent to these this session
const SKIP = new Set(['tips@texastribune.org','texas@propublica.org','data@texastribune.org','news@kut.org','news@kera.org','tips@houstonpublicmedia.org','tips@sareport.org','news@dallasobserver.com','tips@houstonpress.com','editor@texasmonthly.com']);

const TARGETS = [
  { name: 'Texas Observer Editorial', email: 'editors@texasobserver.org', type: 'investigative', outlet: 'Texas Observer' },
  { name: 'Inman News Tips', email: 'tips@inman.com', type: 'realestate', outlet: 'Inman News' },
  { name: 'HousingWire Editorial', email: 'editorial@housingwire.com', type: 'realestate', outlet: 'HousingWire' },
  { name: 'RealTrends Editorial', email: 'editorial@realtrends.com', type: 'realestate', outlet: 'RealTrends' },
  { name: 'Insurance Journal News Desk', email: 'newstips@insurancejournal.com', type: 'insurance', outlet: 'Insurance Journal' },
  { name: 'Claims Journal Editor', email: 'editor@claimsjournal.com', type: 'insurance', outlet: 'Claims Journal' },
  { name: 'PropertyCasualty360 Editor', email: 'editor@propertycasualty360.com', type: 'insurance', outlet: 'PropertyCasualty360' },
  { name: 'Angi Press Team', email: 'press@angi.com', type: 'homeimprovement', outlet: 'Angi' },
  { name: 'Bob Vila Editorial', email: 'editorial@bobvila.com', type: 'homeimprovement', outlet: 'Bob Vila' },
  { name: 'Consumer Reports PR', email: 'pr@consumer.org', type: 'consumer', outlet: 'Consumer Reports' },
  { name: 'NerdWallet Editorial', email: 'editorial@nerdwallet.com', type: 'consumer', outlet: 'NerdWallet' },
  { name: 'NASBP Communications', email: 'info@nasbp.org', type: 'tradeassoc', outlet: 'NASBP' },
  { name: 'Surety & Fidelity Association', email: 'info@surety.org', type: 'tradeassoc', outlet: 'SFAA' },
];

const SUBJECTS = {
  investigative: 'Story Tip: 31% of Texas Licensed Contractors Have Expired Bonds — Live Data',
  realestate: 'Data: 31% of Texas Contractors Have Expired Bonds — Reader Story',
  insurance: 'Texas Surety Bond Non-Compliance: 240,627 Lapsed Statewide (31%) — Live API',
  homeimprovement: 'Consumer Alert: 1-in-3 Texas Contractors Has Expired Bond — Free Verification Tool',
  consumer: '31% of Texas Licensed Contractors Have Expired Surety Bonds — Consumer Data',
  tradeassoc: 'Texas Surety Bond Compliance Data — Relevant for Member Communications',
};

const PITCHES = {
  investigative: 'I want to flag a Texas consumer protection story not yet covered: nearly 1-in-3 TDLR-licensed contractors in Texas currently operate with an expired surety bond. Free live data tool: quantumsurety.bond/bond-ticker. Some counties are above 37% lapsed. TDLR continues listing these contractors as "licensed" after bonds lapse — homeowners have no way to know.',
  realestate: '31% of TDLR-licensed Texas contractors have expired surety bonds per state public records. A lapsed bond means no bonded recourse for homeowners. Free verification: verify.quantumsurety.bond. For agents who recommend contractors to clients, this is a real liability issue.',
  insurance: '240,627 Texas TDLR contractors (31%) have lapsed surety bonds and remain listed as "licensed." Source: data.texas.gov (TDLR Socrata 7358-krk7). County compliance leaderboard: quantumsurety.bond/bond-compliance-leaderboard. Live API: verify.quantumsurety.bond/api/bond-watch/summary',
  homeimprovement: 'Nearly 1-in-3 Texas licensed contractors operates with an expired surety bond. Free public verification: verify.quantumsurety.bond. This would make a strong "before you hire" checklist item. Happy to provide expert quotes or write a guest post.',
  consumer: '31% of Texas TDLR-licensed contractors have expired surety bonds — no bonded protection for homeowners who hire them. Free verification: verify.quantumsurety.bond. County leaderboard shows worst-affected areas above 37%. Happy to provide data or an interview.',
  tradeassoc: '31% of Texas TDLR-licensed contractors have lapsed surety bonds per public state records. Compliance dashboard for all 254 TX counties: quantumsurety.bond/bond-compliance-leaderboard. May be useful as a reference for members in the Texas market.',
};

function buildEmail(t) {
  const subject = SUBJECTS[t.type];
  const pitch = PITCHES[t.type];
  const html = `<div style="font-family:-apple-system,sans-serif;max-width:640px;color:#1e293b;line-height:1.7;">
  <p>Hi ${t.name},</p>
  <p>${pitch}</p>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 18px;margin:18px 0;">
    <strong style="color:#dc2626;">Key Data (live as of today):</strong>
    <ul style="margin:8px 0;padding-left:18px;font-size:14px;line-height:2;">
      <li>240,627 TX contractors lapsed statewide (31.0%)</li>
      <li>Harris County (Houston): 41,799 lapsed (30.6%)</li>
      <li>Jefferson County: 2,831 lapsed (37.8%)</li>
      <li>Hidalgo County: 11,172 lapsed (36.3%)</li>
      <li>Source: TDLR via data.texas.gov (public domain)</li>
    </ul>
    <div style="font-size:13px;margin-top:10px;">
      Live ticker: <a href="https://quantumsurety.bond/bond-ticker">quantumsurety.bond/bond-ticker</a><br>
      County leaderboard: <a href="https://quantumsurety.bond/bond-compliance-leaderboard">bond-compliance-leaderboard</a><br>
      Free verify tool: <a href="https://verify.quantumsurety.bond">verify.quantumsurety.bond</a><br>
      Press kit + data: <a href="https://quantumsurety.bond/press">quantumsurety.bond/press</a>
    </div>
  </div>
  <p><strong>Theodore Sparks</strong><br>
  Quantum Surety LLC · TDI License #3480229<br>
  (214) 666-8718 · contact@quantumsurety.bond</p>
  <p style="font-size:11px;color:#94a3b8;">Data: TDLR public domain (data.texas.gov). One-time outreach — not seeking paid coverage.</p>
</div>`;
  const text = `Hi ${t.name},\n\n${pitch}\n\nKey data:\n- 240,627 TX contractors lapsed (31.0% statewide)\n- Harris: 41,799 (30.6%) | Jefferson: 2,831 (37.8%) | Hidalgo: 11,172 (36.3%)\n- Source: TDLR/data.texas.gov\n\nLive ticker: https://quantumsurety.bond/bond-ticker\nCounty leaderboard: https://quantumsurety.bond/bond-compliance-leaderboard\nVerify tool: https://verify.quantumsurety.bond\n\nTheodore Sparks · (214) 666-8718 · contact@quantumsurety.bond\nQuantum Surety LLC · TDI #3480229`;
  return { subject, html, text };
}

async function main() {
  let sent = 0;
  for (const t of TARGETS) {
    if (SKIP.has(t.email)) { console.log('SKIP (already sent)', t.email); continue; }
    const { subject, html, text } = buildEmail(t);
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: ['contact@quantumsurety.bond'],
        Destination: { ToAddresses: [t.email] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } }
      }));
      console.log('Sent ->', t.outlet, '<' + t.email + '>');
      sent++;
    } catch (e) { console.error('FAIL', t.email, e.message); }
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('Done. Sent:', sent, '/', TARGETS.length);
}
main().catch(e => { console.error(e); process.exit(1); });
