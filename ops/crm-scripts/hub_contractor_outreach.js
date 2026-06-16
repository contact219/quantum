#!/usr/bin/env node
/**
 * HUB Contractor Outreach
 * Reads HUB vendor data from /tmp/hub_vendors.json (scraped via hub_scrape.py)
 * Sends targeted bond outreach emails via SES
 * Tracks sent addresses to avoid duplicates
 */
'use strict';

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs = require('fs');

const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
  }
});

const FROM = 'alerts@quantumsurety.bond';
const SENT_LOG = '/tmp/hub_outreach_sent.json';
const VENDOR_FILE = '/tmp/hub_vendors.json';

function buildEmail(vendor) {
  const { company, contact, city } = vendor;
  const firstName = contact ? contact.split(' ')[0].charAt(0).toUpperCase() + contact.split(' ')[0].slice(1).toLowerCase() : '';
  const greeting = firstName ? `Hi ${firstName},` : 'Hello,';
  const cityLine = city ? ` in ${city}` : '';

  const subject = `${company}: get bonded instantly for your next state contract`;

  const html = `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f8f9fa;margin:0;padding:20px">
<div style="max-width:540px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
  <div style="background:#0a0f1e;padding:22px 28px">
    <div style="font-size:10px;letter-spacing:3px;color:#f59e0b;margin-bottom:6px">QUANTUM SURETY — INSTANT BOND ISSUANCE</div>
    <div style="color:#fff;font-size:19px;font-weight:800;line-height:1.3">HUB-certified? Get bonded in minutes.</div>
  </div>
  <div style="padding:24px 28px">
    <p style="color:#374151;font-size:15px;margin:0 0 14px">${greeting}</p>
    <p style="color:#374151;font-size:15px;margin:0 0 18px">
      As a HUB-certified contractor${cityLine}, you have a competitive edge on Texas state contracts. But when bid bonds, performance bonds, or contractor license bonds are required — traditional sureties can take days to respond.
    </p>
    <p style="color:#374151;font-size:15px;margin:0 0 20px">
      <strong>Quantum Surety issues bonds in minutes, not days.</strong> No long applications, no waiting. We're a TDI-licensed Texas agency built specifically for contractors who need to move fast.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:8px">What we offer HUB contractors:</div>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:#374151;line-height:1.8">
        <li>Bid bonds — issued same day for TxSmartBuy and ESBD solicitations</li>
        <li>Performance &amp; payment bonds — required on public contracts over $25K</li>
        <li>Contractor license bonds — TDLR renewal same day</li>
        <li>Notary bonds — $50 flat, instant PDF</li>
      </ul>
    </div>
    <div style="text-align:center;margin:22px 0">
      <a href="https://quantumsurety.bond/bonds/contractor-bond-texas?utm_source=hub_outreach&utm_medium=email&utm_campaign=hub_contractors"
         style="display:inline-block;background:#f59e0b;color:#000;font-weight:800;font-size:15px;padding:13px 28px;border-radius:8px;text-decoration:none">
        Get Bonded Now &rarr;
      </a>
      <div style="font-size:11px;color:#6b7280;margin-top:8px">Or call (214) 666-8718 &middot; Same-day issuance</div>
    </div>
    <div style="border-top:1px solid #e5e7eb;margin-top:18px;padding-top:14px;font-size:11px;color:#9ca3af;text-align:center">
      Quantum Surety &middot; TDI-Licensed Agency #3480229 &middot; quantumsurety.bond<br>
      Reply to this email or call <a href="tel:+12146668718" style="color:#9ca3af">(214) 666-8718</a> with questions.
    </div>
  </div>
</div>
</body></html>`;

  return { subject, html };
}

async function run() {
  if (!fs.existsSync(VENDOR_FILE)) {
    console.error('Vendor file not found:', VENDOR_FILE, '— run hub_scrape.py first');
    process.exit(1);
  }

  const vendors = JSON.parse(fs.readFileSync(VENDOR_FILE, 'utf8'));
  const sent = fs.existsSync(SENT_LOG) ? JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')) : [];
  const sentSet = new Set(sent.map(s => s.email.toLowerCase()));

  const targets = vendors.filter(v => v.email && !sentSet.has(v.email.toLowerCase()));
  console.log(`Vendors loaded: ${vendors.length}, already sent: ${sentSet.size}, targets: ${targets.length}`);

  let success = 0, failed = 0;
  const newSent = [...sent];

  for (const vendor of targets) {
    const { subject, html } = buildEmail(vendor);
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [vendor.email] },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Html: { Data: html, Charset: 'UTF-8' } }
        }
      }));
      success++;
      newSent.push({ email: vendor.email, company: vendor.company, sent_at: new Date().toISOString() });
      if (success % 50 === 0) console.log(`Sent ${success}...`);
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      failed++;
      console.error(`FAIL ${vendor.email}: ${e.message}`);
    }
  }

  fs.writeFileSync(SENT_LOG, JSON.stringify(newSent, null, 2));
  console.log(`Done — sent: ${success}, failed: ${failed}`);
}

run().catch(console.error);
