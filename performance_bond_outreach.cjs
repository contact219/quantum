#!/usr/bin/env node
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
  }
});

const FROM = 'Theodore Sparks <administrator@quantumsurety.bond>';

const contractors = [
  {
    name: 'Blackhill Enterprises Team',
    company: 'Blackhill Enterprises, Inc.',
    email: 'office@blackhillrestoration.com',
    type: 'restoration',
  },
  {
    name: 'Dan',
    company: 'Facility Interiors',
    email: 'dstein@fiinc.com',
    type: 'interior construction',
  },
  {
    name: 'Kevin',
    company: 'United Roofing & Sheetmetal',
    email: 'Kevin@united-inc.com',
    type: 'roofing and sheetmetal',
  },
];

function buildEmail({ name, company, type }) {
  const subject = `${company} — Texas Performance & Payment Bonds (fast quotes)`;
  const html = `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 10px">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 12px">
    I'm Ted Sparks at Quantum Surety (TDI License #3480229). We saw your company listed on TxSmartBuy and wanted to reach out directly.
  </p>
  <p style="color:#475569;line-height:1.7;margin:0 0 12px">
    If ${company} is bidding on Texas government contracts, you likely need Performance and Payment Bonds. We specialize in exactly this — fast turnaround, competitive rates, and we work with A-rated carriers.
  </p>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin:16px 0">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      ✓ Performance & Payment Bonds — any size<br>
      ✓ Bid Bonds — same-day issuance available<br>
      ✓ Texas Contractor License Bonds (TDLR)<br>
      ✓ TDI-licensed Texas agency · quantumsurety.bond
    </p>
  </div>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    Want a quick quote for your next project? Just reply with the project amount and I'll get back to you same day.
  </p>
  <p style="color:#64748b;font-size:13px;margin:0">
    — Ted Sparks · <strong>(214) 666-8718</strong> · ted@quantumsurety.bond<br>
    <span style="color:#94a3b8;font-size:11px">Quantum Surety LLC · TDI #3480229 · Wylie, TX</span>
  </p>
</div>`;

  const text = `Hi ${name},\n\nI'm Ted Sparks at Quantum Surety (TDI License #3480229). We saw ${company} on TxSmartBuy.\n\nIf you're bidding on Texas government contracts, you'll need Performance and Payment Bonds. We specialize in fast turnarounds — bid bonds, performance bonds, TDLR contractor bonds.\n\nWant a quick quote? Reply with the project amount and I'll respond same day.\n\nTed Sparks · (214) 666-8718 · ted@quantumsurety.bond\nQuantum Surety LLC · TDI #3480229`;
  return { subject, html, text };
}

async function main() {
  for (const c of contractors) {
    const { subject, html, text } = buildEmail(c);
    try {
      const r = await ses.send(new SendEmailCommand({
        Source: FROM,
        ReplyToAddresses: ['ted@quantumsurety.bond'],
        Destination: { ToAddresses: [c.email] },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: html }, Text: { Data: text } }
        }
      }));
      console.log(`Sent to ${c.company} <${c.email}> — ${r.MessageId}`);
    } catch (e) {
      console.error(`FAIL ${c.email}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('Done.');
}
main();
