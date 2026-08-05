/**
 * Notary Income Campaign — Wave 3
 * Subject: Make your bond pay for itself 20x (+ renewal reminder)
 * Audience: Same notary list — closes with bond renewal hook
 * Send: July 6, 2026 @ 9:00 AM CDT (scheduled via cron)
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const FROM = 'Theodore Sparks <administrator@quantumsurety.bond>';
const BLOG_URL = 'https://quantumsurety.bond/blog/texas-notary-bond-income-side-hustle-2026';
const BOND_URL = 'https://quantumsurety.bond/bonds/notary-bond-texas?src=email-wave3-renewal';

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

const subject = l => `${l.name} — last note on this, then I'll leave you alone`;

const buildHtml = l => `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">

<p>Hi ${l.name},</p>

<p>Last email in this series — I promise.</p>

<p>Over the past week I've shared two things:</p>
<ol style="color:#334155;line-height:2.2;padding-left:20px;">
  <li>Seven ways Texas notaries earn $1,000+/month with their existing bond</li>
  <li>A step-by-step breakdown of the highest-paying path: Loan Signing Agent</li>
</ol>

<p>If you haven't had a chance to read the full guide yet, here it is:</p>
<p><a href="${BLOG_URL}?src=email-wave3" style="color:#2563eb;font-weight:600;">Texas Notary Bond Income Guide 2026 →</a></p>

<p>One quick practical note before I go: <strong>an expired bond kills all of this</strong>.</p>

<p>Title companies verify your bond is active before assigning you a signing. Signing services check it automatically. Nursing facilities ask to see your certificate. A lapsed bond — even by a day — means you can't work until it's reinstated, and you lose your place in the queue on platforms like Snapdocs and Notary Rotary.</p>

<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:14px 18px;margin:20px 0;">
  <p style="margin:0;color:#991b1b;font-weight:600;">If you're not 100% sure your bond is current:</p>
  <p style="margin:8px 0 0;color:#7f1d1d;font-size:13px;">Check your commission certificate from the Texas SOS. Your bond term matches your commission term. If you're within 6 months of expiration — or if you're not sure — renewing now costs $50 and takes 5 minutes. Your bond certificate arrives by email instantly.</p>
</div>

<p style="text-align:center;margin:28px 0;">
  <a href="${BOND_URL}" style="background:#dc2626;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">Renew My Texas Notary Bond — $50 →</a>
</p>

<p style="color:#475569;">Once your bond is confirmed active, the income guide has everything you need to start generating income from your credential this month. Questions? Just reply — I read every email.</p>

<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:24px;">Theodore Sparks · Principal, Quantum Surety LLC<br>TDI License #3480229 · <a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> · ted@quantumsurety.bond<br>
RLI Insurance (A+ rated) · Texas statewide · Instant issuance</p>

</div>`;

const buildText = l => `Hi ${l.name},

Last email in this series.

Over the past week: 7 income streams for Texas notaries, and the loan signing agent deep dive. Full guide: ${BLOG_URL}?src=email-wave3

One practical note: an expired bond shuts all of this down. Title companies verify your bond before every assignment. If you're not 100% sure your bond is current — renew now. $50, 5 minutes, instant certificate.

Renew: ${BOND_URL}

Questions? Just reply.

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
        Tags: [{ Name: 'campaign', Value: 'notary-income-wave3' }]
      }));
      console.log(`✓ ${l.name} (${l.email})`);
      sent++;
    } catch (e) {
      console.error(`✗ ${l.name} (${l.email}): ${e.message}`);
      errors++;
    }
    await new Promise(r => setTimeout(r, 900));
  }
  console.log(`\nWave 3 done. ${sent} sent, ${errors} errors.`);
}

run();
