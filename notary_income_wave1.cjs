/**
 * Notary Income Campaign — Wave 1
 * Subject: Your notary bond can make you $1,000+/month
 * Audience: All notary bond leads in CRM
 * Send: June 29, 2026 @ 9:00 AM CDT (scheduled via cron)
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

const subject = l => `${l.name}, your notary bond can make you $1,000+/month`;

const buildHtml = l => `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">

<p>Hi ${l.name},</p>

<p>You have a Texas notary commission and a $10,000 surety bond. Most notaries use that credential for the occasional favor — a neighbor's signature, a document at work — and earn exactly <strong>$0</strong> from it.</p>

<p>That's a mistake worth fixing.</p>

<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:14px 18px;border-radius:4px;margin:20px 0;">
  <p style="margin:0;color:#1e40af;font-weight:600;font-size:15px;">Here's what active Texas notaries are earning with the same bond you already have:</p>
  <ul style="margin:10px 0 0;padding-left:18px;color:#1e40af;">
    <li><strong>Loan Signing Agent</strong> — $75–$200 per mortgage closing (2–3/day for full-time agents)</li>
    <li><strong>Mobile notary route</strong> — hospitals, nursing homes, law firms, car dealerships</li>
    <li><strong>Remote Online Notarization</strong> — notarize from home, no travel, flexible volume</li>
    <li><strong>I-9 employment verification</strong> — $25–$75 per hire (verify remote hires' ID as an employer's authorized rep)</li>
    <li><strong>Corporate retainer</strong> — $75–$200/month per client for recurring notary access</li>
  </ul>
</div>

<p>I put together a full income guide walking through each of these — what they pay, what you need to get started, and the fastest path to your first client in Texas.</p>

<p style="text-align:center;margin:28px 0;">
  <a href="${BLOG_URL}?src=email-wave1" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">Read: 7 Ways to Earn $1,000+/Month with Your Notary Bond →</a>
</p>

<p>One more thing: if your bond is coming up on renewal (or if you're unsure when it expires), the Texas SOS renewal clock starts the day your commission was issued. Renewing before it lapses keeps your income streams uninterrupted. Bond renewal is $50 for a full 4-year term — instant certificate by email.</p>

<p style="color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:24px;">Theodore Sparks · Principal, Quantum Surety LLC<br>TDI License #3480229 · <a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> · ted@quantumsurety.bond<br>
<a href="${BOND_URL}" style="color:#2563eb;">Renew your notary bond — $50</a></p>

</div>`;

const buildText = l => `Hi ${l.name},

You have a Texas notary commission and a $10,000 surety bond. Most notaries use that for the occasional favor and earn $0 from it.

Here's what active Texas notaries are earning with the same credential:

• Loan Signing Agent — $75–$200 per mortgage closing
• Mobile notary route — hospitals, nursing homes, law firms, dealerships
• Remote Online Notarization (RON) — notarize from home
• I-9 employment verification — $25–$75 per hire (verify remote hires' ID as an authorized rep)
• Corporate retainer — $75–$200/month per client

Full income guide with step-by-step paths for each:
${BLOG_URL}?src=email-wave1

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
        Tags: [{ Name: 'campaign', Value: 'notary-income-wave1' }]
      }));
      console.log(`✓ ${l.name} (${l.email})`);
      sent++;
    } catch (e) {
      console.error(`✗ ${l.name} (${l.email}): ${e.message}`);
      errors++;
    }
    await new Promise(r => setTimeout(r, 900));
  }
  console.log(`\nWave 1 done. ${sent} sent, ${errors} errors.`);
}

run();
