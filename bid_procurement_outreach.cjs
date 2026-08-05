#!/usr/bin/env node
/**
 * Outreach to government procurement contacts from TxSmartBuy bid monitor.
 * Pitch: mutual referral — we send contractors to their bids, they mention QS for bonding.
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
  }
});

const FROM = 'Theodore Sparks <administrator@quantumsurety.bond>';

const contacts = [
  {
    name: 'Cynthia',
    email: 'cynthia.greene@jeffersoncountytx.gov',
    agency: 'Jefferson County',
    project: 'Term Contract for Asphalt Products',
  },
  {
    name: 'Alicia',
    email: 'alicia.duke@tdcj.texas.gov',
    agency: 'TDCJ',
    project: 'Garza East Unit HVAC Installation',
  },
];

function buildEmail({ name, agency, project }) {
  const subject = `Texas surety bond resource for ${agency} contractors — Quantum Surety`;

  const html = `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff">
  <p style="font-size:14px;color:#0f172a;margin:0 0 14px">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 12px">
    I'm Ted Sparks, a Texas TDI-licensed surety bond agent (Quantum Surety, License #3480229, Wylie TX).
    I noticed ${agency} has an active bid for <em>${project}</em> on TxSmartBuy.
  </p>
  <p style="color:#475569;line-height:1.7;margin:0 0 12px">
    Many contractors bidding on projects like this ask where to get their bid bond quickly.
    We specialize in Texas construction and contractor bonds — same-day approval, starting at $75/yr.
  </p>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    Would you be open to mentioning Quantum Surety to contractors asking about bonding requirements for your bids?
    In return, when contractors come to us, we can point them to ${agency}'s open opportunities as well.
  </p>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:16px">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      <strong>Quantum Surety LLC</strong><br>
      TDI License #3480229 · Wylie, TX<br>
      Bid bonds · Performance bonds · Contractor license bonds<br>
      Same-day approvals · quantumsurety.bond
    </p>
  </div>
  <p style="color:#64748b;font-size:13px;margin:0">
    Reply to this email or call me at <strong>(214) 666-8718</strong>. Happy to discuss.
  </p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">
    Quantum Surety LLC · TDI #3480229 · 1990 S Ballard Ave, Wylie TX 75098
  </p>
</div>`;

  const text = `Hi ${name},\n\nI'm Ted Sparks, a Texas TDI-licensed surety bond agent (Quantum Surety, License #3480229).\n\nI noticed ${agency} has an active bid for "${project}" on TxSmartBuy. Many contractors bidding on projects like this need bid bonds quickly — we do same-day approvals starting at $75/yr.\n\nWould you be open to mentioning Quantum Surety to contractors asking about bonding? In return, I can refer contractors to your open opportunities.\n\nCall or email me anytime:\nTed Sparks · (214) 666-8718 · ted@quantumsurety.bond\nQuantum Surety LLC · TDI #3480229 · quantumsurety.bond`;

  return { subject, html, text };
}

async function main() {
  for (const contact of contacts) {
    const { subject, html, text } = buildEmail(contact);
    try {
      const r = await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: ['ted@quantumsurety.bond'],
        Destination: { ToAddresses: [contact.email] },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: html }, Text: { Data: text } }
        }
      }));
      console.log(`Sent to ${contact.email} — MessageId: ${r.MessageId}`);
    } catch (e) {
      console.error(`FAIL ${contact.email}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('Done.');
}
main();
