#!/usr/bin/env node
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
  }
});

const CHECKOUT = 'https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX&utm_source=crm-personal&utm_campaign=notary-voicemail-followup';

const html = `<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="28" style="margin-bottom:14px">
  <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 8px">Hi Cristina,</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 16px">
    This is Ted Sparks at Quantum Surety — I just left you a voicemail about your Texas Notary Bond.
    You can skip the phone tag and complete the whole thing online in about 2 minutes:
  </p>
  <a href="${CHECKOUT}" style="display:block;background:#f59e0b;color:#000;padding:16px 0;border-radius:8px;font-weight:800;text-decoration:none;font-size:16px;text-align:center;margin-bottom:16px">
    Complete My Texas Notary Bond — $50 →
  </a>
  <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:16px">
    <p style="margin:0;font-size:12px;color:#475569;line-height:1.9">
      ✓ $10,000 bond · TX SOS compliant<br>
      ✓ $50 total for the full 4-year term<br>
      ✓ Instant PDF certificate — arrives same day<br>
      ✓ Underwritten by RLI Insurance (A-rated)
    </p>
  </div>
  <p style="color:#64748b;font-size:13px;margin:0">
    Any questions, just reply to this email or call me directly at <strong>(214) 666-8718</strong>. Happy to help.
  </p>
  <p style="color:#475569;font-size:13px;margin-top:16px">
    — Ted Sparks<br>
    <span style="color:#94a3b8;font-size:11px">Quantum Surety LLC · TDI License #3480229 · Wylie, TX</span>
  </p>
  <p style="color:#94a3b8;font-size:11px;margin-top:12px">
    <a href="https://quantumsurety.bond/unsubscribe?email=cristina.nino%40marsh.com" style="color:#94a3b8">Unsubscribe</a>
  </p>
</div>`;

const text = `Hi Cristina,\n\nThis is Ted Sparks at Quantum Surety — I just left you a voicemail about your Texas Notary Bond.\n\nYou can complete it online in about 2 minutes:\n${CHECKOUT}\n\n$50 flat for the full 4-year term. PDF certificate arrives same day.\n\nAny questions, reply here or call (214) 666-8718.\n\n— Ted Sparks\nQuantum Surety LLC · TDI #3480229`;

ses.send(new SendEmailCommand({
  Source: 'Theodore Sparks <ted@quantumsurety.bond>',
  ReplyToAddresses: ['contact@quantumsurety.bond'],
  Destination: { ToAddresses: ['cristina.nino@marsh.com'] },
  Message: {
    Subject: { Data: 'Cristina — left you a voicemail (Texas Notary Bond, $50 same-day)' },
    Body: { Html: { Data: html }, Text: { Data: text } }
  }
})).then(r => {
  console.log('Sent to Cristina! MessageId:', r.MessageId);
}).catch(e => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
