#!/usr/bin/env node
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
  }
});

const CHECKOUT = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX&utm_source=crm-instant&utm_campaign=notary-new-lead';

const html = `<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 8px">Hi Traci,</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    Thanks for requesting your Texas Notary Bond — I'm Ted at Quantum Surety. You can complete your purchase right now:
  </p>
  <a href="${CHECKOUT}" style="display:block;background:#f59e0b;color:#000;padding:16px 0;border-radius:8px;font-weight:800;text-decoration:none;font-size:16px;text-align:center;margin-bottom:16px">
    Get My $50 Texas Notary Bond →
  </a>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:16px">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      ✓ $10,000 bond · TX SOS compliant<br>
      ✓ $50 total for the full 4-year term — no annual renewals<br>
      ✓ Instant PDF certificate emailed to you today<br>
      ✓ RLI Insurance (A-rated underwriter)
    </p>
  </div>
  <p style="color:#64748b;font-size:13px;margin:0 0 6px">Takes about 2 minutes. Your certificate arrives by email same day.</p>
  <p style="color:#64748b;font-size:13px;margin:0">
    Want me to walk you through it? Call or text me at <strong>(214) 666-8718</strong>.
  </p>
  <p style="color:#94a3b8;font-size:11px;margin-top:16px">
    Quantum Surety LLC · TDI #3480229 · Wylie, TX ·
    <a href="https://quantumsurety.bond/unsubscribe?email=tpinkerton%40paragon-sports.com" style="color:#94a3b8">Unsubscribe</a>
  </p>
</div>`;

const text = `Hi Traci,\n\nThanks for requesting your Texas Notary Bond — I'm Ted at Quantum Surety.\n\nComplete your purchase here (2 minutes, $50 flat for 4 years):\n${CHECKOUT}\n\nYour PDF certificate arrives same day.\n\nQuestions? Call/text (214) 666-8718.\n\nTed Sparks\nQuantum Surety LLC · TDI #3480229`;

ses.send(new SendEmailCommand({
  Source: 'Theodore Sparks <ted@quantumsurety.bond>',
  ReplyToAddresses: ['contact@quantumsurety.bond'],
  Destination: { ToAddresses: ['tpinkerton@paragon-sports.com'] },
  Message: {
    Subject: { Data: 'Traci — your Texas Notary Bond is ready ($50, same-day certificate)' },
    Body: { Html: { Data: html }, Text: { Data: text } }
  }
})).then(r => {
  console.log('Sent! MessageId:', r.MessageId);
  process.exit(0);
}).catch(e => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
