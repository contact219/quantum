#!/usr/bin/env node
/**
 * Instant outreach to the two new GDN dealer bond leads.
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
  }
});

const CHECKOUT = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX&utm_source=crm-instant&utm_campaign=gdn-new-lead';
const FROM = 'Theodore Sparks <administrator@quantumsurety.bond>';

const leads = [
  { name: 'Zamarai', email: 'alpha4su@gmail.com', phone: '18329193000' },
  { name: 'Jorge', email: 'jorge.uribe@sjautosa.com', phone: '2107632444' },
];

function buildEmail(name) {
  const subject = `${name} — your Texas GDN Dealer Bond is ready (same-day certificate)`;
  const html = `<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 8px">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    Thanks for requesting your Texas GDN Dealer Bond — I'm Ted at Quantum Surety.
    Your $50,000 TxDMV bond is ready. You can complete the application online and get your certificate today:
  </p>
  <a href="${CHECKOUT}" style="display:block;background:#f59e0b;color:#000;padding:16px 0;border-radius:8px;font-weight:800;text-decoration:none;font-size:16px;text-align:center;margin-bottom:16px">
    Get My GDN Dealer Bond →
  </a>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:16px">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      ✓ $50,000 bond · TxDMV-accepted<br>
      ✓ Competitive rates — 1-year renewable term<br>
      ✓ Same-day PDF certificate delivered by email<br>
      ✓ RLI Insurance (A-rated underwriter)
    </p>
  </div>
  <p style="color:#64748b;font-size:13px;margin:0 0 6px">
    TxDMV requires this bond for all GDN (General Distinguishing Number) motor vehicle dealer licenses in Texas.
  </p>
  <p style="color:#64748b;font-size:13px;margin:0">
    Questions? Call or text me at <strong>(214) 666-8718</strong> — I'm a real person, happy to help.
  </p>
  <p style="color:#475569;font-size:13px;margin-top:16px">
    — Ted Sparks<br>
    <span style="color:#94a3b8;font-size:11px">Quantum Surety LLC · TDI License #3480229 · Wylie, TX</span>
  </p>
</div>`;

  const text = `Hi ${name},\n\nThanks for requesting your Texas GDN Dealer Bond — I'm Ted at Quantum Surety.\n\nYour $50,000 TxDMV bond is ready. Complete it online:\n${CHECKOUT}\n\nSame-day certificate, competitive rates.\n\nQuestions? Call/text (214) 666-8718.\n\nTed Sparks\nQuantum Surety LLC · TDI #3480229`;
  return { subject, html, text };
}

async function main() {
  for (const lead of leads) {
    const { subject, html, text } = buildEmail(lead.name);
    try {
      const r = await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: ['contact@quantumsurety.bond'],
        Destination: { ToAddresses: [lead.email] },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: html }, Text: { Data: text } }
        }
      }));
      console.log(`Sent to ${lead.name} (${lead.email}) — ${r.MessageId}`);
    } catch (e) {
      console.error(`FAIL ${lead.email}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}
main();
