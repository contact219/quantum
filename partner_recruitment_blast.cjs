#!/usr/bin/env node
/**
 * Partner Recruitment Blast — targets CPAs, title companies, mortgage brokers,
 * insurance agents, and notary training schools in Texas to join the QS partner program.
 *
 * Usage:
 *   SES_KEY=... SES_SECRET=... node partner_recruitment_blast.cjs
 *   node partner_recruitment_blast.cjs --dry-run
 *
 * Add new partners to PROSPECTS array below.
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs = require('fs');
const path = require('path');

const DRY_RUN  = process.argv.includes('--dry-run');
const SENT_LOG = path.join(__dirname, 'partner_recruitment_sent.json');

const ses = new SESClient({
  region: 'us-east-2',
  credentials: { accessKeyId: process.env.SES_KEY, secretAccessKey: process.env.SES_SECRET },
});

const FROM     = 'Theodore Sparks <administrator@quantumsurety.bond>';
const REPLY_TO = 'contact@quantumsurety.bond';
const JOIN_URL  = 'https://partners.quantumsurety.bond/?utm_source=partner-blast&utm_campaign=recruitment';

function loadSent() { try { return new Set(JSON.parse(fs.readFileSync(SENT_LOG,'utf8'))); } catch { return new Set(); } }
function logSent(e, s) { s.add(e); fs.writeFileSync(SENT_LOG, JSON.stringify([...s])); }

// Target partners: CPAs, insurance agents, title companies, notary schools, RE attorneys
// These send 2-3 referrals/mo × $35 commission = $70-105/mo per active partner
const PROSPECTS = [
  // Texas Notary Training Schools
  { name: 'National Notary Association',        email: 'membership@nationalnotary.org',  role: 'notary_school'  },
  { name: 'American Society of Notaries',       email: 'info@asnnotary.org',             role: 'notary_school'  },
  // TX CPA / accounting
  { name: 'Texas Society of CPAs',              email: 'cpacenter@tscpa.net',            role: 'cpa'            },
  // Title company associations
  { name: 'Texas Land Title Association',       email: 'info@tlta.com',                  role: 'title'          },
  // Insurance agent associations
  { name: 'Independent Insurance Agents of TX', email: 'info@iiat.org',                  role: 'insurance'      },
  { name: 'Texas Association of Insurance',     email: 'info@texasinsurance.org',         role: 'insurance'      },
  // Mortgage / real estate
  { name: 'Texas Mortgage Bankers Association', email: 'info@texasmba.org',               role: 'mortgage'       },
  // Contractor / trade associations
  { name: 'Associated Builders and Contractors TX', email: 'info@abctx.org',             role: 'contractor'     },
  { name: 'Texas Electrical Contractors Assoc', email: 'info@teca.org',                   role: 'contractor'     },
  { name: 'Texas Plumbing Association',         email: 'info@txplumbing.org',             role: 'contractor'     },
  { name: 'HVAC Excellence Texas',              email: 'info@hvacexcellence.org',          role: 'contractor'     },
  // Bookkeeping / business services (they onboard new LLCs that need bonds)
  { name: 'Texas Association of Business',      email: 'info@txbiz.org',                  role: 'business'       },
];

function buildEmail(prospect) {
  const orgName    = prospect.name;
  const isContractor = prospect.role === 'contractor';
  const isNotary   = prospect.role === 'notary_school';
  const isCpa      = prospect.role === 'cpa';
  const isTitle    = prospect.role === 'title';
  const isMortgage = prospect.role === 'mortgage';

  let angle, memberType;
  if (isContractor)  { angle = 'TDLR-licensed contractors who need a surety bond to stay compliant'; memberType = 'contractor members'; }
  else if (isNotary) { angle = 'newly commissioned notaries who need a $10,000 notary bond ($50 flat, 4-year term)'; memberType = 'students and members'; }
  else if (isCpa)    { angle = 'business clients who need bonds for licensing, permits, or compliance'; memberType = 'clients'; }
  else if (isTitle)  { angle = 'title agents and real estate professionals who need surety bonds'; memberType = 'members'; }
  else if (isMortgage){ angle = 'mortgage brokers in Texas who need a $50,000 mortgage broker bond'; memberType = 'members'; }
  else               { angle = 'professionals and businesses that need Texas surety bonds'; memberType = 'clients and members'; }

  const subject = `Partner with Quantum Surety — earn commissions on every bond referral`;
  const html = `<div style="font-family:-apple-system,sans-serif;max-width:540px;margin:0 auto;padding:28px;background:#fff">
  <img src="https://quantumsurety.bond/QS_Logo.png" width="32" style="margin-bottom:16px">
  <p style="font-size:16px;color:#0f172a;font-weight:700;margin:0 0 6px">Hi ${orgName} team,</p>
  <p style="color:#475569;line-height:1.7;margin:0 0 14px">
    I'm Theodore Sparks, founder of <strong>Quantum Surety LLC</strong> — a TDI-licensed Texas surety agency specializing in fast, affordable bonds.
  </p>
  <p style="color:#475569;line-height:1.7;margin:0 0 14px">
    I'm reaching out because your organization works with <strong>${memberType}</strong> who regularly need ${angle}. Our partner program pays a <strong>$35 referral commission</strong> on every bond sold — no licensing required, no paperwork, just a unique referral link.
  </p>
  <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:4px;margin:0 0 20px">
    <p style="margin:0 0 6px;font-weight:700;color:#92400e">Partner Program Highlights</p>
    <ul style="margin:0;padding-left:20px;color:#78350f;line-height:1.8">
      <li>$35 commission per bond sold (notary bonds: $50, contractor: $75–$150+)</li>
      <li>Real-time dashboard — track clicks, leads, commissions</li>
      <li>Your branded referral link — members go straight to checkout</li>
      <li>Monthly payouts via ACH or check</li>
      <li>Free compliance resources your members can use</li>
    </ul>
  </div>
  <a href="${JOIN_URL}" style="display:inline-block;background:#f59e0b;color:#000;padding:13px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;margin-bottom:20px">
    Join the Partner Program →
  </a>
  <p style="color:#475569;line-height:1.6;font-size:14px;margin:0 0 14px">
    Setup takes 2 minutes. If you'd prefer to discuss a co-branded or custom arrangement (resource page listing, newsletter inclusion, member discount), I'm happy to talk — just reply to this email.
  </p>
  <p style="color:#64748b;font-size:13px">
    Theodore Sparks<br>
    Founder, Quantum Surety LLC · TDI #3480229<br>
    (214) 666-8718 · <a href="https://quantumsurety.bond" style="color:#f59e0b">quantumsurety.bond</a>
  </p>
  <p style="color:#94a3b8;font-size:11px;margin-top:20px">Quantum Surety LLC · Wylie, TX 75098 · TDI License #3480229</p>
</div>`;

  const text = `Hi ${orgName} team,

I'm Theodore Sparks, founder of Quantum Surety LLC — a TDI-licensed Texas surety agency.

Your members regularly need ${angle}. Our partner program pays $35 per bond sold, no licensing required.

Join here: ${JOIN_URL}

Questions? Just reply.

Theodore Sparks
Founder, Quantum Surety LLC
(214) 666-8718`;

  return { subject, html, text };
}

async function main() {
  const sent  = loadSent();
  let count   = 0;

  for (const p of PROSPECTS) {
    const email = p.email.toLowerCase().trim();
    if (sent.has(email)) { console.log(`  skip (already sent): ${email}`); continue; }
    const { subject, html, text } = buildEmail(p);

    if (DRY_RUN) {
      console.log(`  [DRY] → ${email} [${p.role}] | "${subject.slice(0,60)}"`);
      count++; continue;
    }

    try {
      await ses.send(new SendEmailCommand({
        Source: FROM, ReplyToAddresses: [REPLY_TO],
        Destination: { ToAddresses: [email] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } },
      }));
      logSent(email, sent);
      count++;
      console.log(`  Sent → ${p.name} <${email}> [${p.role}]`);
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(`  FAIL ${email}: ${e.message}`);
    }
  }
  console.log(`\nDone. Sent: ${count} / ${PROSPECTS.length}`);
}
main().catch(e => { console.error(e); process.exit(1); });
