'use strict';
/**
 * Agency Procurement Officer Outreach
 * One-time email to ~20 major TxSmartBuy member agency procurement contacts
 * introducing Bond Verify as a free contractor vetting tool.
 * Run from VPS: cd /var/www/bondverify && node agency_procurement_outreach.js
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs = require('fs');

// Credentials loaded from environment — on VPS run from /var/www/bondverify where .env sets SES_KEY/SES_SECRET
const ses = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET,
  },
});

const FROM = 'alerts@quantumsurety.bond';
const VERIFY_URL = 'https://verify.quantumsurety.bond';
const AGENCY_PAGE = 'https://quantumsurety.bond/for-agencies';

// Major TxSmartBuy member agencies — procurement contacts from public directories
const AGENCIES = [
  { name: 'Texas Department of Transportation', contact: 'Procurement Division', email: 'procurement@txdot.gov' },
  { name: 'Texas Health and Human Services Commission', contact: 'Procurement', email: 'procurement@hhs.texas.gov' },
  { name: 'Texas Department of Criminal Justice', contact: 'Purchasing', email: 'purchasing@tdcj.texas.gov' },
  { name: 'Texas Department of Public Safety', contact: 'Procurement', email: 'procurementDPS@dps.texas.gov' },
  { name: 'University of Texas at Austin', contact: 'Purchasing Office', email: 'purchasing@austin.utexas.edu' },
  { name: 'Texas A&M University', contact: 'Procurement Services', email: 'procurement@tamu.edu' },
  { name: 'Texas Education Agency', contact: 'Procurement', email: 'purchasing@tea.texas.gov' },
  { name: 'Texas Department of Agriculture', contact: 'Procurement', email: 'procurement@texasagriculture.gov' },
  { name: 'Texas Military Department', contact: 'Contracting Office', email: 'ng.tx.txarng.list.contracting-office@army.mil' },
  { name: 'Texas Water Development Board', contact: 'Procurement', email: 'procurement@twdb.texas.gov' },
  { name: 'Texas Commission on Environmental Quality', contact: 'Procurement', email: 'contracts@tceq.texas.gov' },
  { name: 'Texas Department of Licensing and Regulation', contact: 'Purchasing', email: 'purchasing@tdlr.texas.gov' },
  { name: 'Texas Comptroller of Public Accounts', contact: 'Procurement', email: 'purchasing@cpa.texas.gov' },
  { name: 'Railroad Commission of Texas', contact: 'Procurement', email: 'purchasing@rrc.texas.gov' },
  { name: 'Texas General Land Office', contact: 'Procurement', email: 'procurement@glo.texas.gov' },
  { name: 'Texas Parks and Wildlife Department', contact: 'Procurement', email: 'procurement@tpwd.texas.gov' },
  { name: 'City of Austin — Purchasing', contact: 'Purchasing Office', email: 'purchasing@austintexas.gov' },
  { name: 'City of Houston — Strategic Procurement', contact: 'Strategic Procurement', email: 'purchasing@houstontx.gov' },
  { name: 'Dallas County Purchasing', contact: 'Purchasing Department', email: 'purchasing@dallascounty.org' },
  { name: 'Harris County Purchasing', contact: 'Purchasing Department', email: 'purchasing@harriscountytx.gov' },
];

function buildEmail(agency) {
  const subject = `Free contractor bond verification tool for ${agency.name}`;

  const html = `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f8f9fa;margin:0;padding:20px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
  <div style="font-size:10px;letter-spacing:3px;color:#f59e0b;font-weight:700;margin-bottom:16px">QUANTUM SURETY</div>
  <p style="color:#374151;font-size:15px;margin:0 0 16px">Dear ${agency.contact},</p>
  <p style="color:#374151;font-size:15px;margin:0 0 16px;line-height:1.6">
    We wanted to introduce a free tool that may be useful for your team: the
    <strong>Quantum Surety Bond Verify portal</strong> at
    <a href="${VERIFY_URL}" style="color:#f59e0b">${VERIFY_URL}</a>.
    It provides instant lookup of license status, bond coverage, and a contractor trust score
    for all 816,000+ TDLR-licensed contractors in Texas &mdash; at no cost, with no account required.
  </p>
  <p style="color:#374151;font-size:15px;margin:0 0 20px;line-height:1.6">
    We also offer a free REST API for teams who want to automate contractor verification
    in a vendor portal or procurement system. Full documentation and API key registration
    are available at <a href="${VERIFY_URL}/api-docs.html" style="color:#f59e0b">${VERIFY_URL}/api-docs.html</a>.
  </p>
  <div style="text-align:center;margin:24px 0">
    <a href="${AGENCY_PAGE}" style="display:inline-block;background:#0f172a;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none">
      Learn More &rarr;
    </a>
  </div>
  <p style="color:#6b7280;font-size:13px;margin:0 0 4px">
    If you have questions or would like to set up API access for ${agency.name},
    please reply to this email or contact us at <a href="mailto:api@quantumsurety.bond" style="color:#6b7280">api@quantumsurety.bond</a>.
  </p>
  <div style="border-top:1px solid #e5e7eb;margin-top:24px;padding-top:16px;font-size:11px;color:#9ca3af">
    Quantum Surety &middot; TDI-Licensed Agency #3480229 &middot; (214) 666-8718<br>
    1416 Bessie Drive, Wylie TX 75098
  </div>
</div>
</body></html>`;

  const text = `Dear ${agency.contact},\n\nWe wanted to introduce a free tool that may be useful for your team: the Quantum Surety Bond Verify portal at ${VERIFY_URL}. It provides instant lookup of license status, bond coverage, and a contractor trust score for all 816,000+ TDLR-licensed contractors in Texas — at no cost, with no account required.\n\nWe also offer a free REST API for teams who want to automate contractor verification. Full documentation at ${VERIFY_URL}/api-docs.html.\n\nLearn more: ${AGENCY_PAGE}\n\nQuestions? Reply to this email or contact api@quantumsurety.bond.\n\nQuantum Surety · TDI-Licensed Agency #3480229 · (214) 666-8718`;

  return { subject, html, text };
}

async function run() {
  const log = [];
  let sent = 0, failed = 0;

  console.log(`Sending to ${AGENCIES.length} agencies...`);

  for (const agency of AGENCIES) {
    const { subject, html, text } = buildEmail(agency);
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [agency.email] },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: html, Charset: 'UTF-8' },
            Text: { Data: text, Charset: 'UTF-8' },
          },
        },
      }));
      sent++;
      log.push(`OK | ${agency.name} | ${agency.email}`);
      console.log(`Sent: ${agency.name}`);
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      failed++;
      log.push(`FAIL | ${agency.name} | ${agency.email} | ${e.message}`);
      console.error(`Failed: ${agency.name} — ${e.message}`);
    }
  }

  fs.writeFileSync('/tmp/agency_outreach_log.txt', log.join('\n'));
  console.log(`\nDone — sent: ${sent}, failed: ${failed}`);
  console.log('Log: /tmp/agency_outreach_log.txt');
}

run().catch(console.error);
