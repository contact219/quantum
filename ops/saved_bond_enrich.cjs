#!/usr/bin/env node
/**
 * saved_bond_enrich.cjs — pull principal contact info from RLI submission
 * detail pages into bk_bonds, for bonds that don't have it yet: saved
 * (draft) applications, abandoned riders/bonds, and cancelled-from-inception
 * bonds. Feeds saved_bond_recovery.cjs and abandoned_bond_recovery.cjs.
 *
 * Real contact info beats guessing: for saved bonds the submission number is
 * encoded in bond_number itself (DRAFT-{submNo}), same for the manually-keyed
 * ABANDON-{submNo} entries. For abandoned/cancelled bonds that carry a real
 * RLI bond number (MBS...), the submission number isn't stored anywhere in
 * bk_bonds, so this script does a fresh BondList scrape first to build a
 * bond_number -> submission_no map, then visits each submission's detail
 * page (/Agency/Bond/Index/{submissionNo}) and reads the values the
 * applicant actually typed in — no name/zip matching against the notary
 * directory required.
 *
 * Session handling borrows the same myportal -> BondList SSO handshake as
 * mybondapp_sync.cjs (the previous version skipped this and just broke
 * whenever cookies didn't already carry an rlisurety-side session).
 *
 * Contact values are written only to the CRM database — the log prints
 * counts and bond ids, not PII.
 *
 * Usage:
 *   node saved_bond_enrich.cjs [--limit N]   (default 200)
 */
const puppeteer = require('/usr/local/lead-gen/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const CHROMIUM      = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';
const SESSION_FILE  = path.join('/opt/quantum-ops', '.rli_session.json');
const SURETY_URL    = 'https://myportal.rlicorp.com/en/surety/overview';
const BOND_LIST_URL = 'https://rlisurety.rlicorp.com/Agency/BondList';
const RLI_USERNAME  = process.env.RLI_USERNAME || 'nice.shotwell-sparks@quantumsurety.bond';
const RLI_PASSWORD  = process.env.RLI_PASSWORD;
const LIM_IDX = process.argv.indexOf('--limit');
const LIMIT   = LIM_IDX >= 0 ? parseInt(process.argv[LIM_IDX + 1]) : 200;

const COOKIE_ALLOWED = new Set(['name','value','domain','path','expires','httpOnly','secure','sameSite','url']);
function cleanCookies(raw) {
  return raw.filter(c => !c.partitionKey)
    .map(c => Object.fromEntries(Object.entries(c).filter(([k]) => COOKIE_ALLOWED.has(k))));
}
async function saveAllCookies(page) {
  const client = await page.target().createCDPSession();
  const { cookies } = await client.send('Network.getAllCookies');
  await client.detach();
  fs.writeFileSync(SESSION_FILE, JSON.stringify(cookies, null, 2));
}

// ── Login (full Okta flow — only needed if cookies are stale) ─────────────────
async function handleMfa(page) {
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, [role="button"], a'))
      .filter(b => b.textContent.trim() === 'Select');
    const phone = btns[btns.length - 1];
    if (phone) { phone.click(); return true; }
    return false;
  });
  if (!clicked) throw new Error('MFA: no Select button found');
  await page.waitForFunction(
    () => document.body.innerText.includes('voice call') || document.body.innerText.includes('Send code'),
    { timeout: 30000 }
  ).catch(() => {});
  await page.evaluate(() => {
    const btn = document.querySelector('input[type="submit"], button[type="submit"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 5000));
  const otpSel = 'input[name="answer"], input[name="passcode"], input[autocomplete="one-time-code"], input[type="tel"], input[type="text"]';
  const hasOtp = await page.waitForSelector(otpSel, { timeout: 30000 }).then(() => true).catch(() => false);
  if (!hasOtp) {
    if (page.url().includes('myportal.rlicorp.com')) return;
    throw new Error('MFA: no OTP input appeared');
  }
  const OTP_FILE = '/tmp/rli_otp.txt';
  if (fs.existsSync(OTP_FILE)) fs.unlinkSync(OTP_FILE);
  let otp = null;
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    if (page.url().includes('myportal.rlicorp.com')) return;
    if (fs.existsSync(OTP_FILE)) {
      otp = fs.readFileSync(OTP_FILE, 'utf8').trim().replace(/\D/g, '');
      fs.unlinkSync(OTP_FILE);
      break;
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  if (!otp) throw new Error('MFA timeout: no code provided in /tmp/rli_otp.txt within 10 minutes');
  const otpEl = await page.$(otpSel);
  if (otpEl) { await otpEl.click({ clickCount: 3 }); await otpEl.type(otp, { delay: 80 }); }
  await page.evaluate(() => {
    const btn = [
      document.querySelector('input[value="Verify"]'),
      document.querySelector('button[type="submit"]'),
      ...Array.from(document.querySelectorAll('button')).filter(b => /verify|submit/i.test(b.textContent)),
    ].filter(Boolean)[0];
    if (btn) btn.click();
  });
  try { await page.keyboard.press('Enter'); } catch (_) {}
  await page.waitForFunction(() => window.location.href.includes('myportal.rlicorp.com'), { timeout: 45000 });
}

async function ensureSession(page) {
  if (fs.existsSync(SESSION_FILE)) {
    const cookies = cleanCookies(JSON.parse(fs.readFileSync(SESSION_FILE)));
    if (cookies.length > 0) await page.setCookie(...cookies);
    await page.goto(SURETY_URL, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await new Promise(r => setTimeout(r, 2000));
    if (page.url().includes('myportal.rlicorp.com')) { await saveAllCookies(page); return; }
  }
  if (!RLI_PASSWORD) throw new Error('Session expired and RLI_PASSWORD not set — cannot re-login headlessly');

  await page.goto(SURETY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  async function typeVerified(sel, value, label) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      await page.click(sel, { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise(r => setTimeout(r, 500));
      await page.type(sel, value, { delay: 70 });
      const len = await page.$eval(sel, el => el.value.length).catch(() => -1);
      if (len === value.length) return;
      await new Promise(r => setTimeout(r, 800));
    }
    throw new Error(`Could not reliably type ${label}`);
  }
  const emailSel = '#okta-signin-username, input[name="identifier"], input[type="email"]';
  await page.waitForSelector(emailSel, { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));
  await typeVerified(emailSel, RLI_USERNAME, 'username');
  const nextBtn = await page.$('input[value="Next"]');
  if (nextBtn) { await nextBtn.click(); await new Promise(r => setTimeout(r, 2000)); }
  const passSel = '#okta-signin-password, input[type="password"]';
  await page.waitForSelector(passSel, { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));
  await typeVerified(passSel, RLI_PASSWORD, 'password');
  await page.evaluate(() => {
    const btn = document.querySelector('#okta-signin-submit') || document.querySelector('input[value="Verify"]')
      || document.querySelector('input[value="Sign in"]') || document.querySelector('button[type="submit"]')
      || Array.from(document.querySelectorAll('button')).find(b => /^(verify|sign in)$/i.test(b.textContent.trim()));
    if (btn) btn.click();
  });
  try { await page.keyboard.press('Enter'); } catch (_) {}

  const deadline = Date.now() + 8 * 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 3000));
    if (page.url().includes('myportal.rlicorp.com')) break;
    const hasSelect = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button, [role="button"], a')).some(x => x.textContent.trim() === 'Select')
    ).catch(() => false);
    if (hasSelect) { await handleMfa(page); break; }
  }
  if (!page.url().includes('myportal.rlicorp.com')) throw new Error(`Login failed: at ${page.url()}`);
  await saveAllCookies(page);
}

async function navigateToBondList(page) {
  await page.goto(BOND_LIST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  let url = page.url();
  if (url.includes('rlisurety.rlicorp.com')) { await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {}); return; }

  if (url.includes('myportal.rlicorp.com')) {
    await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, [role="button"], a'))
        .find(b => b.textContent.trim() === 'My Bond Center');
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (clicked) {
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 3000));
      url = page.url();
    }
    if (!url.includes('rlisurety.rlicorp.com')) {
      await page.goto(SURETY_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.goto(BOND_LIST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
      url = page.url();
    }
  }
  if (!url.includes('rlisurety.rlicorp.com')) throw new Error(`Could not reach BondList — at ${url}`);
  await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
}

// ── Lightweight card scan: just bond_number -> submission_no, for every card ──
function scanSubmissionNumbers(text) {
  const map = new Map();
  for (const card of text.split(/(?:^|\n)MBA\n/)) {
    const lines = card.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const bondNoLine = lines.find(l => /^Bond No:/i.test(l));
    const bondNumber = bondNoLine ? bondNoLine.replace(/^Bond No:\s*/i, '').trim() : null;
    const submLine = lines.find(l => /^Subm(?:ission)?\s*No[:.]/i.test(l));
    const submNo = submLine ? submLine.replace(/^Subm(?:ission)?\s*No[:.]/i, '').trim() : null;
    if (bondNumber && !bondNumber.startsWith('—') && submNo) map.set(bondNumber, submNo);
  }
  return map;
}

async function scrapeSubmissionMap(bondPage) {
  const map = new Map();
  const hasFilter = await bondPage.$('#submissionTypeFilter').then(el => !!el).catch(() => false);
  if (hasFilter) {
    await bondPage.select('#submissionTypeFilter', 'all_bonds');
    await bondPage.waitForNetworkIdle({ timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 5000));
  }
  let pageNum = 1;
  while (true) {
    await bondPage.waitForNetworkIdle({ timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));
    const text = await bondPage.evaluate(() => document.body.innerText);
    for (const [k, v] of scanSubmissionNumbers(text)) map.set(k, v);

    const pagResult = await bondPage.evaluate(() => {
      const nextEl = Array.from(document.querySelectorAll('a')).find(a => {
        const t = a.textContent.trim();
        return t === '›' || t === '»' || t === 'Next';
      });
      if (!nextEl) return { found: false };
      const li = nextEl.closest('li');
      if (li && (li.classList.contains('disabled') || li.classList.contains('inactive'))) return { found: false };
      nextEl.click();
      return { found: true };
    });
    if (!pagResult.found || pageNum >= 20) break;
    pageNum++;
    await new Promise(r => setTimeout(r, 4000));
    await bondPage.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
  }
  return map;
}

// ── Detail-page contact extraction ─────────────────────────────────────────────
async function extractContact(page, submNo) {
  await page.goto(`https://rlisurety.rlicorp.com/Agency/Bond/Index/${submNo}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForNetworkIdle({ timeout: 12000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2500));
  const contact = await page.evaluate(() => {
    const vals = [];
    document.querySelectorAll('input, textarea').forEach(el => {
      if (el.type === 'hidden' || el.type === 'checkbox' || el.type === 'radio') return;
      if (el.value && el.value.trim()) vals.push(el.value.trim());
    });
    const blob = vals.join('\n');
    const emailM = blob.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneM = blob.match(/\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/);
    return {
      email: emailM ? emailM[0].toLowerCase() : null,
      phone: phoneM ? `(${phoneM[1]}) ${phoneM[2]}-${phoneM[3]}` : null,
    };
  });
  if (contact.email && /rlicorp|rli\.com|quantumsurety/.test(contact.email)) contact.email = null;
  return contact;
}

async function main() {
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();

  const { rows: targets } = await db.query(`
    SELECT id, bond_number, status FROM bk_bonds
    WHERE status IN ('saved', 'abandoned', 'cancelled')
      AND (insured_email IS NULL OR insured_email = '')
    ORDER BY commission_amt DESC NULLS LAST
    LIMIT $1
  `, [LIMIT]);
  console.log(`[Enrich] ${targets.length} bonds lacking contact info (saved/abandoned/cancelled)`);
  if (!targets.length) { await db.end(); return; }

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM, headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  let enriched = 0, noContact = 0, errors = 0, unresolved = 0;
  try {
    const page = await browser.newPage();
    await ensureSession(page);
    await navigateToBondList(page);
    console.log('  → Building bond_number -> submission_no map (needed for abandoned/cancelled bonds)...');
    const submMap = await scrapeSubmissionMap(page);
    console.log(`  → Map has ${submMap.size} entries`);

    for (const t of targets) {
      let submNo = null;
      const draftMatch = t.bond_number.match(/^(?:DRAFT|ABANDON)-(\d+)$/);
      if (draftMatch) {
        submNo = draftMatch[1];
      } else {
        submNo = submMap.get(t.bond_number) || null;
      }
      if (!submNo) {
        console.log(`  - bond ${t.id} (${t.bond_number}): no submission number resolvable`);
        unresolved++;
        continue;
      }

      try {
        const contact = await extractContact(page, submNo);
        if (contact.email || contact.phone) {
          await db.query(
            `UPDATE bk_bonds SET
               insured_email = COALESCE(NULLIF(insured_email, ''), $1),
               insured_phone = COALESCE(NULLIF(insured_phone, ''), $2),
               updated_at = NOW()
             WHERE id = $3`,
            [contact.email, contact.phone, t.id]
          );
          console.log(`  ✓ bond ${t.id} (${t.bond_number}, ${t.status}): email=${contact.email ? 'yes' : 'no'} phone=${contact.phone ? 'yes' : 'no'}`);
          enriched++;
        } else {
          console.log(`  - bond ${t.id} (${t.bond_number}, ${t.status}): no contact info entered`);
          noContact++;
        }
      } catch (e) {
        console.error(`  ✗ bond ${t.id}: ${e.message.substring(0, 80)}`);
        errors++;
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  } finally {
    await browser.close();
    await db.end();
  }
  console.log(`[Enrich] Done. enriched=${enriched} no-contact=${noContact} unresolved=${unresolved} errors=${errors}`);
}
main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
