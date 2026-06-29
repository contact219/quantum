/**
 * Notary Income Campaign — Wave 2
 * Subject: The loan signing agent path (step-by-step)
 * Audience: Same notary list — deepens the loan signing opportunity
 * Send: July 2, 2026 @ 9:00 AM CDT (scheduled via cron)
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const FROM = 'Theodore Sparks <ted@quantumsurety.bond>';
const BLOG_URL = 'https://quantumsurety.bond/blog/texas-notary-bond-income-side-hustle-2026';
const BOND_URL = 'https://quantumsurety.bond/bonds/notary-bond-texas';

const LEADS = [
  { name: 'Jeana', email: 'JEANAPATE@ATT.NET' },
  { name: 'Alecia', email: 'ialecia83@yahoo.com' },
  { name: 'Laura', email: 'laura.sanchez_99@yahoo.com' },
  { name: 'Pilar', email: 'pilard@att.net' },
  { name: 'Linda', email: 'jane@siteconservices.net' },
  { name: 'Sherman', email: 'seamiami@sbcglobal.net' },
  { name: 'Donald', email: 'doncoyote76@aol.com' },
  { name: 'Leanna', email: 'leannaflores45@gmail.com' },
  { name: 'LyToshia', email: 'wattsl6117@yahoo.com' },
  { name: 'Jenna', email: 'jennah2004@yahoo.com' },
  { name: 'Bill', email: 'bill@vrumc.org' },
  { name: 'Karen', email: 'karen.walker@aaacma.com' },
  { name: 'Kenyetta', email: 'khorsfall2010@yahoo.com' },
  { name: 'Ramona', email: 'ramonacampbell@yahoo.com' },
  { name: 'Princess', email: 'princess.netherly@fletcherfarley.com' },
  { name: 'Hyrme', email: 'bo@ruparsurveying.com' },
  { name: 'Charoletta', email: 'theandersongroup@mcom.com' },
  { name: 'Maria', email: 'mpbarrera@sbcglobal.net' },
  { name: 'Teresa', email: 'teresa@actionrcs.com' },
  { name: 'Traci', email: 'traciparamore@live.com' },
  { name: 'Martha', email: 'Mcasillasgil@gmail.com' },
  { name: 'Jessalyn', email: 'jessalyngeiser@yahoo.com' },
  { name: 'Laura', email: 'lstpwing@hotmail.com' },
  { name: 'Ricardo', email: 'rgainarroyocity@aol.com' },
  { name: 'Martha', email: 'marthacasillas@yahoo.com' },
  { name: 'Romelia', email: 'rmoralesauto@ymail.com' },
  { name: 'Tawana', email: 'Tawanajohnson9902@yahoo.com' },
  { name: 'Jamie', email: 'jamiedhernandez@yahoo.com' },
  { name: 'Cloyde', email: 'cdeanjordan@yahoo.com' },
  { name: 'Karen', email: 'fbcwarren@att.net' },
  { name: 'Paula', email: 'palvarez@raylaw.com' },
  { name: 'Elisa', email: 'elisaperez@comcast.net' },
  { name: 'Melissa', email: 'melissa.bailey1954@gmail.com' },
  { name: 'Sylvia', email: 'saleman176@yahoo.com' },
  { name: 'Christina', email: 'katie.baron@akbllp.com' },
  { name: 'Catalina', email: 'catalina@suntracksupplyservices.com' },
  { name: 'Marisol', email: 'marisol76033@yahoo.com' },
  { name: 'Kimberly', email: 'warhols@sbcglobal.net' },
  { name: 'Bria', email: 'briaholmes03@yahoo.com' },
  { name: 'Todd', email: 'twdeatherage@protonmail.com' },
  { name: 'Ruth', email: 'ruthsmith.lv@yahoo.com' },
  { name: 'Traci', email: 'tpinkerton@paragon-sports.com' },
  { name: 'Cristina', email: 'cristina.nino@marsh.com' },
  { name: 'Antwon', email: 'antwon.storey@yahoo.com' },
  { name: 'Johnisha', email: 'tjohnisha@yahoo.com' },
  { name: 'Julia', email: 'store2516@theupsstore.com' },
  { name: 'Jackqulin', email: 'jaccqque2002@yahoo.com' },
  { name: 'Amanda', email: 'mandyb@conaways.com' },
  { name: 'Darkisha', email: 'darkishabecknell@yahoo.com' },
  { name: 'Bob', email: 'bobnguyenaccounting@comcast.net' },
  { name: 'Rocio', email: 'rocio.castillo523@yahoo.com' },
  { name: 'John', email: 'demdonkey@aol.com' },
  { name: 'Amanda', email: 'amandaragsdale@alphaomegahospice.com' },
  { name: 'Maryanne', email: 'maryannezarac@texashealth.org' },
  { name: 'Sarah', email: 'scavazos1118@yahoo.com' },
  { name: 'Elizabeth', email: 'zstedman@yahoo.com' },
  { name: 'Tabitha', email: 'tabitha.westmoreland@edwardjones.com' },
  { name: 'Ifeyinwa', email: 'ifiloani@yahoo.com' },
  { name: 'Colette', email: 'colette.miller@ldry.com' },
  { name: 'Tara', email: 'leveledassist@gmail.com' },
  { name: 'Vannisha', email: 'nishabarnes13@icloud.com' },
  { name: 'Nikitia', email: 'kita317@gmail.com' },
  { name: 'Reynold', email: 'renberra@sbcglobal.net' },
  { name: 'Steve', email: 'stevenunez@aol.com' },
  { name: 'Brianna', email: 'samaniego_brianna505@yahoo.com' },
  { name: 'Nancy', email: 'nrzrealestate@sbcglobal.net' },
  { name: 'Samantha', email: 'samantha@apc-law.com' },
  { name: 'Sandra', email: 'sgj@atlassiteservices.com' },
  { name: 'Nancy', email: 'nancy@nancid.com' },
  { name: 'Julie', email: 'julie.gonzalez@rivnet.com' },
  { name: 'Ashaun', email: 'Ashaun.sincere@thesincerecorporation.com' },
  { name: 'Vy', email: 'stephanie.pham1998@gmail.com' },
  { name: 'Baily', email: 'baily.dickerson2@dfps.texas.gov' },
  { name: 'Guadalupe', email: 'luper12@aol.com' },
];

const subject = l => `${l.name}, how Texas notaries make $3k–$8k/month (the step-by-step path)`;

const buildHtml = l => `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">

<p>Hi ${l.name},</p>

<p>I sent you an email a few days ago about the 7 ways Texas notaries can earn $1,000+/month with their credential. Today I want to go deeper on the single highest-income path: <strong>Loan Signing Agent</strong>.</p>

<p>A Loan Signing Agent is a notary who notarizes mortgage closing packages — the 100+ documents a borrower signs when closing a home loan. Title companies pay <strong>$75–$200 per signing</strong>. Experienced agents do 2–3 per day.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:20px 0;">
  <p style="margin:0 0 10px;font-weight:700;color:#0f172a;">The 5 things you need to get started:</p>
  <ol style="margin:0;padding-left:18px;color:#334155;line-height:2;">
    <li>Texas notary commission + $10,000 bond — <em>you already have this</em></li>
    <li>NNA Loan Signing Agent certification — <strong>~$65, half-day online course</strong></li>
    <li>Notary E&O insurance — <strong>$25–$65/year</strong> (required by most title companies)</li>
    <li>Laser printer + legal-size paper — <strong>$150–$250 one-time</strong></li>
    <li>Profile on Snapdocs, NotaryGo, Notary Rotary — <strong>free</strong></li>
  </ol>
</div>

<p><strong>Why Texas specifically?</strong> Texas is a title-state — title companies handle all mortgage closings instead of attorneys. That creates massive, distributed demand for notary signers in every metro and suburb. Houston, Dallas, San Antonio, and Austin each have hundreds of active signings every day.</p>

<p>Total startup cost is roughly <strong>$240–$380</strong>. Active loan signing agents typically recoup that in their first 2–3 jobs.</p>

<p style="text-align:center;margin:28px 0;">
  <a href="${BLOG_URL}?src=email-wave2#loan-signing" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">Read the Full Loan Signing Agent Guide →</a>
</p>

<p style="color:#475569;font-size:13px;">One note: most title companies verify your notary bond is active before assigning you a job. If your bond is lapsing soon — or if you're unsure of your expiration date — now is the time to renew. It's $50 for a full 4-year term, instant certificate by email: <a href="${BOND_URL}" style="color:#2563eb;">quantumsurety.bond/bonds/notary-bond-texas</a></p>

<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:24px;">Theodore Sparks · Principal, Quantum Surety LLC<br>TDI License #3480229 · <a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> · ted@quantumsurety.bond</p>

</div>`;

const buildText = l => `Hi ${l.name},

Following up from my last email about notary income. Today: the single highest-paying path — Loan Signing Agent.

A Loan Signing Agent notarizes mortgage closing packages. Title companies pay $75–$200 per signing. Experienced agents do 2–3/day.

To get started:
1. Texas notary commission + bond — you already have this
2. NNA Loan Signing Agent certification — ~$65 online
3. Notary E&O insurance — $25–$65/year
4. Laser printer + legal paper — ~$200 one-time
5. Profile on Snapdocs, NotaryGo, Notary Rotary — free

Total startup cost: $240–$380. Most agents recoup it in their first 2–3 jobs.

Full guide: ${BLOG_URL}?src=email-wave2#loan-signing

— Theodore Sparks
Quantum Surety LLC | TDI License #3480229
(214) 666-8718 | ted@quantumsurety.bond`;

async function run() {
  let sent = 0, errors = 0;
  for (const l of LEADS) {
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [l.email] },
        ReplyToAddresses: ['ted@quantumsurety.bond'],
        Message: {
          Subject: { Data: subject(l) },
          Body: { Html: { Data: buildHtml(l) }, Text: { Data: buildText(l) } }
        },
        Tags: [{ Name: 'campaign', Value: 'notary-income-wave2' }]
      }));
      console.log(`✓ ${l.name} (${l.email})`);
      sent++;
    } catch (e) {
      console.error(`✗ ${l.name} (${l.email}): ${e.message}`);
      errors++;
    }
    await new Promise(r => setTimeout(r, 900));
  }
  console.log(`\nWave 2 done. ${sent} sent, ${errors} errors.`);
}

run();
