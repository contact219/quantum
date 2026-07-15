/**
 * mybondapp_sync.cjs — RLI BondList → CRM Bookkeeping sync
 *
 * Usage:
 *   node mybondapp_sync.cjs              # normal run
 *   node mybondapp_sync.cjs --dry-run    # parse only, no API writes
 *   node mybondapp_sync.cjs --visible    # show browser window
 *   node mybondapp_sync.cjs --all        # include expired/cancelled bonds
 */

const puppeteer = require('/usr/local/lead-gen/node_modules/puppeteer-core');
const http      = require('http');
const fs        = require('fs');
const path      = require('path');

const CHROMIUM      = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';
const SESSION_FILE  = path.join(__dirname, '.rli_session.json');
const SURETY_URL    = 'https://myportal.rlicorp.com/en/surety/overview';
const BOND_LIST_URL = 'https://rlisurety.rlicorp.com/Agency/BondList';
const RLI_USERNAME  = process.env.RLI_USERNAME || 'nice.shotwell-sparks@quantumsurety.bond';
const RLI_PASSWORD  = process.env.RLI_PASSWORD;
const CRM_API       = 'http://localhost:4001/api/bookkeeping';

const DRY_RUN = process.argv.includes('--dry-run');
const VISIBLE  = process.argv.includes('--visible');
const ALL      = process.argv.includes('--all');

// ── Bond type map ─────────────────────────────────────────────────────────────
function mapBondType(description) {
  const d = (description || '').toLowerCase();
  if (d.includes('notary'))                        return 'notary';
  if (d.includes('dealer') || d.includes('gdn'))  return 'dealer_gdn';
  if (d.includes('contractor'))                    return 'contractor';
  if (d.includes('mortgage'))                      return 'mortgage';
  if (d.includes('collection'))                    return 'collection-agency';
  if (d.includes('credit access'))                return 'credit-access-business';
  if (d.includes('property tax'))                 return 'property-tax-consultant';
  return 'notary';
}

const BOND_AMOUNTS = {
  notary: 10000, dealer_gdn: 25000, contractor: 10000, mortgage: 50000,
  'collection-agency': 10000, 'credit-access-business': 10000, 'property-tax-consultant': 5000,
};
const STANDARD_PREMIUMS = {
  notary: 50, dealer_gdn: 300, contractor: 100, mortgage: 250,
  'collection-agency': 100, 'credit-access-business': 150, 'property-tax-consultant': 100,
};
const RLI_COMMISSION = 0.20;
const COMMISSION_RATES = {
  notary:    0.55,  // Notary bonds: 55% of premium
  dealer_gdn: 0.30,  // GDN bonds: 30% of $250 = $75
};

// ── HTTP helper ───────────────────────────────────────────────────────────────
function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost', port: 4001,
      path: `/api/bookkeeping${urlPath}`, method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Carrier setup ─────────────────────────────────────────────────────────────
async function ensureRliCarrier() {
  const carriers = await apiRequest('GET', '/carriers');
  const rli = (Array.isArray(carriers) ? carriers : []).find(c =>
    c.name.toLowerCase().includes('rli')
  );
  if (rli) { console.log(`✓ RLI carrier (id=${rli.id})`); return rli.id; }

  const created = await apiRequest('POST', '/carriers', {
    name: 'RLI Insurance Company', naic_code: '13056',
    contact_email: 'suretyinfo@rli.com', remittance_schedule: 'monthly', remittance_day: 15,
  });
  for (const bond_type of Object.keys(STANDARD_PREMIUMS)) {
    await apiRequest('POST', `/carriers/${created.id}/rates`, { bond_type, commission_pct: RLI_COMMISSION });
  }
  console.log(`✓ RLI carrier created (id=${created.id})`);
  return created.id;
}

// ── Cookie helpers ─────────────────────────────────────────────────────────────
const COOKIE_ALLOWED = new Set(['name','value','domain','path','expires','httpOnly','secure','sameSite','url']);
function cleanCookies(raw) {
  return raw
    .filter(c => !c.partitionKey)
    .map(c => Object.fromEntries(Object.entries(c).filter(([k]) => COOKIE_ALLOWED.has(k))));
}

async function saveAllCookies(page) {
  const client = await page.target().createCDPSession();
  const { cookies } = await client.send('Network.getAllCookies');
  await client.detach();
  fs.writeFileSync(SESSION_FILE, JSON.stringify(cookies, null, 2));
  console.log(`  → Session saved (${cookies.length} cookies)`);
}

// ── MFA handler ───────────────────────────────────────────────────────────────
async function handleMfa(page) {
  console.log('  → MFA screen. Selecting Phone (SMS) factor...');

  // Log all Select buttons with surrounding context to identify phone numbers
  const mfaInfo = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, [role="button"], a'))
      .filter(b => b.textContent.trim() === 'Select');
    return {
      count: btns.length,
      pageText: document.body.innerText.substring(0, 800),
    };
  }).catch(() => ({ count: 0, pageText: '' }));
  console.log(`  MFA Select buttons: ${mfaInfo.count}`);
  console.log(`  MFA page preview: ${mfaInfo.pageText.replace(/\s+/g, ' ').substring(0, 300)}`);

  // Click the last Select button (Phone factor — Email is first)
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, [role="button"], a'))
      .filter(b => b.textContent.trim() === 'Select');
    const phone = btns[btns.length - 1];
    if (phone) { phone.click(); return true; }
    return false;
  });
  console.log(`  → Phone Select clicked: ${clicked}`);
  if (!clicked) throw new Error('MFA: no Select button found');

  // Wait for SMS send page ("voice call" text confirms it loaded)
  await page.waitForFunction(
    () => document.body.innerText.includes('voice call') || document.body.innerText.includes('Send code'),
    { timeout: 30000 }
  ).catch(() => {});

  // Click Submit to actually SEND the SMS
  const sentSms = await page.evaluate(() => {
    const btn = document.querySelector('input[type="submit"], button[type="submit"]');
    if (btn) { btn.click(); return btn.value || btn.textContent.trim(); }
    return null;
  });
  console.log(`  → Send SMS button: ${sentSms}`);
  await new Promise(r => setTimeout(r, 5000));

  // Broad OTP input selector
  const otpSel = [
    'input[name="answer"]', 'input[name="passcode"]', 'input[name="code"]',
    'input[name="credentials.passcode"]', 'input[autocomplete="one-time-code"]',
    'input[type="tel"]', 'input[type="number"]', 'input[type="text"]',
  ].join(', ');

  const hasOtp = await page.waitForSelector(otpSel, { timeout: 30000 })
    .then(() => true).catch(() => false);

  const inputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input'))
      .filter(i => i.type !== 'hidden')
      .map(i => `${i.type}[name=${i.name}]`)
  ).catch(() => []);
  console.log(`  Inputs after SMS: ${inputs.join(', ') || 'none'}`);

  if (!hasOtp) {
    // Check if redirect already happened (magic link auto-approved?)
    if (page.url().includes('myportal.rlicorp.com')) {
      console.log('  → Already on myportal — MFA bypassed');
      return;
    }
    throw new Error('MFA: no OTP input appeared after Send SMS — check phone number config');
  }

  const OTP_FILE = '/tmp/rli_otp.txt';
  if (fs.existsSync(OTP_FILE)) fs.unlinkSync(OTP_FILE);

  console.log('');
  console.log('  ══════════════════════════════════════════════════════');
  console.log('  SMS sent. Enter the code in a NEW SSH window:');
  console.log(`    echo "123456" > ${OTP_FILE}`);
  console.log('  Waiting up to 10 minutes...');
  console.log('  ══════════════════════════════════════════════════════');
  console.log('');

  let otp = null;
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    if (page.url().includes('myportal.rlicorp.com')) {
      console.log('  → Redirected to myportal (magic link / auto-auth)');
      return;
    }
    if (fs.existsSync(OTP_FILE)) {
      otp = fs.readFileSync(OTP_FILE, 'utf8').trim().replace(/\D/g, '');
      fs.unlinkSync(OTP_FILE);
      break;
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  if (!otp) throw new Error('MFA timeout: no code provided in /tmp/rli_otp.txt within 10 minutes');

  console.log(`  → Entering OTP (${otp.length} digits)...`);
  const otpEl = await page.$(otpSel);
  if (otpEl) {
    await otpEl.click({ clickCount: 3 });
    await otpEl.type(otp, { delay: 80 });
  }

  // Tick "remember device"
  await page.evaluate(() => {
    const cb = document.querySelector('input[name="rememberDevice"], input[type="checkbox"]');
    if (cb && !cb.checked) cb.click();
  }).catch(() => {});

  // Submit
  await page.evaluate(() => {
    const btn = [
      document.querySelector('input[value="Verify"]'),
      document.querySelector('button[type="submit"]'),
      ...Array.from(document.querySelectorAll('button')).filter(b => /verify|submit/i.test(b.textContent)),
    ].filter(Boolean)[0];
    if (btn) btn.click();
  });
  try { await page.keyboard.press("Enter"); } catch(_) {}

  console.log('  → OTP submitted — waiting for myportal redirect...');
  await page.waitForFunction(
    () => window.location.href.includes('myportal.rlicorp.com'),
    { timeout: 45000 }
  );
  console.log('  ✓ MFA complete — on myportal');
}

// ── Session establishment ─────────────────────────────────────────────────────
// Returns with page on myportal.rlicorp.com
async function ensureSession(page) {
  // Step 1: try saved cookies first
  if (fs.existsSync(SESSION_FILE)) {
    const cookies = cleanCookies(JSON.parse(fs.readFileSync(SESSION_FILE)));
    if (cookies.length > 0) await page.setCookie(...cookies);
    await page.goto(SURETY_URL, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await new Promise(r => setTimeout(r, 2000));
    if (page.url().includes('myportal.rlicorp.com')) {
      console.log('  ✓ Resumed saved session');
      await saveAllCookies(page);
      return;
    }
    console.log(`  ✗ Session expired (at ${page.url().substring(0, 60)})`);
  }

  // Step 2: fill credentials
  console.log('  → Logging in (SP-initiated SSO)...');
  // Navigate to protected resource → triggers SAML → lands on Okta login
  const onAuthPage = page.url().includes('auth.rlicorp.com') || page.url().includes('okta');
  if (!onAuthPage) {
    await page.goto(SURETY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  // The new Okta widget can swallow the first keystrokes while the field
  // animates in — always type with length verification and retry.
  async function typeVerified(sel, value, label) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      await page.click(sel, { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise(r => setTimeout(r, 500));
      await page.type(sel, value, { delay: 70 });
      const len = await page.$eval(sel, el => el.value.length).catch(() => -1);
      if (len === value.length) return;
      console.log(`  ! ${label} field has ${len} chars, expected ${value.length} — retry ${attempt}`);
      await new Promise(r => setTimeout(r, 800));
    }
    throw new Error(`Could not reliably type ${label}`);
  }

  const emailSel = '#okta-signin-username, input[name="identifier"], input[type="email"]';
  await page.waitForSelector(emailSel, { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500)); // let the widget settle before first keystroke
  await typeVerified(emailSel, RLI_USERNAME, 'username');

  const nextBtn = await page.$('input[value="Next"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 2000));
  }

  const passSel = '#okta-signin-password, input[type="password"]';
  await page.waitForSelector(passSel, { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));
  await typeVerified(passSel, RLI_PASSWORD, 'password');

  // Click whichever submit button the Okta page uses (legacy or new sign-in screen)
  await page.evaluate(() => {
    const btn =
      document.querySelector('#okta-signin-submit') ||
      document.querySelector('input[value="Verify"]') ||
      document.querySelector('input[value="Sign in"]') ||
      document.querySelector('button[type="submit"]') ||
      Array.from(document.querySelectorAll('button')).find(b => /^(verify|sign in)$/i.test(b.textContent.trim()));
    if (btn) btn.click();
  });
  // Fallback: press Enter in case button click did not trigger submission
  try { await page.keyboard.press('Enter'); } catch (_) {}
  console.log('  → Credentials submitted');

  // Step 3: poll for myportal or MFA screen (up to 8 minutes)
  const deadline = Date.now() + 8 * 60 * 1000;
  let pollCount = 0;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 3000));
    pollCount++;
    const url = page.url();
    if (pollCount === 1) {
      try { await page.screenshot({ path: '/tmp/rli_login_debug.png', fullPage: true }); } catch(_) {}
    }

    if (url.includes('myportal.rlicorp.com')) {
      console.log('  ✓ Login complete (no MFA)');
      break;
    }

    let btns = [];
    try {
      btns = await page.evaluate(() =>
        Array.from(document.querySelectorAll('button, [role="button"], a'))
          .map(x => x.textContent.trim())
      );
    } catch (_) {}

    console.log(`  Poll: ${url.substring(8, 58)} | ${btns.slice(0, 5).join(', ') || 'loading...'}`);

    if (btns.some(b => b === 'Select')) {
      await handleMfa(page);
      // handleMfa throws if it fails, so we're on myportal if we reach here
      break;
    }
  }

  // Confirm we're on myportal
  const finalUrl = page.url();
  if (!finalUrl.includes('myportal.rlicorp.com')) {
    throw new Error(`Login failed: expected myportal, at ${finalUrl}`);
  }

  await saveAllCookies(page);
}

// ── Navigate to BondList (handles SSO redirect from myportal) ─────────────────
async function navigateToBondList(page) {
  // Direct navigation — rlisurety will accept our myportal session cookie via SAML
  console.log('  → Navigating to BondList...');
  await page.goto(BOND_LIST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  let url = page.url();
  console.log(`  BondList nav result: ${url.substring(0, 70)}`);

  if (url.includes('rlisurety.rlicorp.com')) {
    // Already there — wait for AJAX to settle
    await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
    return;
  }

  // If landed on myportal (SP-initiated SSO may have fired + returned us there),
  // click "My Bond Center" to trigger the proper portal-to-rlisurety handoff
  if (url.includes('myportal.rlicorp.com')) {
    console.log('  → On myportal — waiting for SPA then clicking My Bond Center...');
    await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));

    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, [role="button"], a'))
        .find(b => b.textContent.trim() === 'My Bond Center');
      if (btn) { btn.click(); return true; }
      return false;
    });
    console.log(`  → My Bond Center clicked: ${clicked}`);

    if (clicked) {
      // Wait for navigation (may open in same tab or new tab)
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 3000));
      url = page.url();
      console.log(`  After click: ${url.substring(0, 70)}`);
    }

    if (!url.includes('rlisurety.rlicorp.com')) {
      // Try navigating to surety overview first to trigger SSO
      console.log('  → Trying surety overview → BondList path...');
      await page.goto('https://myportal.rlicorp.com/en/surety/overview', { waitUntil: 'domcontentloaded', timeout: 20000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.goto(BOND_LIST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
      url = page.url();
      console.log(`  Final URL: ${url.substring(0, 70)}`);
    }
  }

  if (!url.includes('rlisurety.rlicorp.com')) {
    throw new Error(`Could not reach BondList — at ${url}`);
  }
  await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
}

// ── Bond card parser ──────────────────────────────────────────────────────────
function toIso(dateStr) {
  const [m, d, y] = dateStr.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function parseBondCards(text) {
  const bonds = [];
  const seen  = new Set();

  for (const card of text.split(/(?:^|\n)MBA\n/)) {
    const lines = card.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    const statusLine = lines.find(l =>
      /(?:Rider|Bond)\s*-\s*(Active|Issued|Abandoned|Cancelled|Expired|Pending|Saved)/i.test(l)
    );
    if (!statusLine) continue;

    const bondNoLine = lines.find(l => /^Bond No:/i.test(l));
    let bondNumber = bondNoLine ? bondNoLine.replace(/^Bond No:\s*/i, '').trim() : null;
    const isSaved = /Saved/i.test(statusLine||'');
    if (!bondNumber || bondNumber.startsWith('\u2014')) {
      if (!isSaved) continue; // non-saved bonds require a real bond number
      // Saved/draft bonds: build a stable synthetic key
      const submLine = lines.find(l => /^Subm(?:ission)?\s*No[:.]/i.test(l));
      const submNo = submLine ? submLine.replace(/^Subm(?:ission)?\s*No[:.]/i, '').trim() : null;
      // insuredName and effectiveDate not yet declared here - extract inline
      const _pIdx = lines.findIndex(l => /^Principal Address:/i.test(l));
      const _rawN = (_pIdx > 0 ? lines[_pIdx - 1] : '') || '';
      const nameSlug = _rawN.replace(/[^A-Za-z0-9]/g, '').slice(0, 10).toUpperCase() || 'UNKNOWN';
      const _tLine = lines.find(l => /^Term:/i.test(l));
      const _tMatch = _tLine ? _tLine.match(/(\d{1,2}\/\d{1,2}\/\d{4})/) : null;
      const _effD = _tMatch ? toIso(_tMatch[1]) : new Date().toISOString().slice(0, 10);
      const _dk = _effD.replace(/-/g, '');
      bondNumber = submNo ? 'DRAFT-' + submNo : 'DRAFT-' + nameSlug + '-' + _dk;
    }

    let insuredName = '—';
    const paIdx = lines.findIndex(l => /^Principal Address:/i.test(l));
    if (paIdx > 0) {
      const candidate = lines[paIdx - 1];
      if (!/^(MBA|Quantum Surety|J\d{4}|Subm No)/i.test(candidate)) insuredName = candidate;
    }

    const descLine = lines.find(l => /^Bond Description:/i.test(l));
    const description = descLine ? descLine.replace(/^Bond Description:\s*/i, '').split(',')[0].trim() : 'Notary Bond (TX)';

    let effectiveDate = null, expirationDate = null;
    const termLine = lines.find(l => /^Term:/i.test(l));
    if (termLine) {
      const dm = termLine.match(/(\d{1,2}\/\d{1,2}\/\d{4})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (dm) { effectiveDate = toIso(dm[1]); expirationDate = toIso(dm[2]); }
    }
    const riderLine = lines.find(l => /^Rider Effective:/i.test(l));
    if (riderLine) {
      const dm = riderLine.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (dm) effectiveDate = toIso(dm[1]);
    }

    let premium = null;
    const premLine = lines.find(l => /^(Bond\s+)?Premium:\s*\$[\d.,]+/i.test(l));
    if (premLine) {
      const m = premLine.match(/\$([\d.,]+)/);
      if (m) premium = parseFloat(m[1].replace(/,/g, ''));
    }

    if (!effectiveDate || !expirationDate) continue;
    const seenKey = bondNumber || `NONUM-${insuredName}-${effectiveDate||''}`;
    if (seen.has(seenKey)) continue;
    seen.add(seenKey);

    const bondType = mapBondType(description);
    bonds.push({
      bond_number:     bondNumber,
      insured_name:    insuredName,
      description,
      bond_type:       bondType,
      bond_amount:     BOND_AMOUNTS[bondType] || 10000,
      premium:         premium || STANDARD_PREMIUMS[bondType] || 50,
      commission_rate: COMMISSION_RATES[bondType] || RLI_COMMISSION,
      effective_date:  effectiveDate,
      expiration_date: expirationDate,
      status:          /Expired/i.test(statusLine)   ? 'expired'
                     : /Abandoned/i.test(statusLine) ? 'abandoned'
                     : /Cancelled/i.test(statusLine) ? 'cancelled'
                     : /Saved/i.test(statusLine)     ? ((insuredName === '—' && premium === 21) ? 'saved_empty' : 'saved')
                     : /Pending/i.test(statusLine)   ? 'pending'
                     : 'issued',
      status_detail:   statusLine,
    });
  }
  return bonds;
}

// ── Paginated BondList scraper ────────────────────────────────────────────────
async function scrapeAllBonds(bondPage) {
  const allBonds = [];
  let pageNum = 1;

  // Apply Issued Bonds filter
  const hasFilter = await bondPage.$('#submissionTypeFilter').then(el => !!el).catch(() => false);
  if (hasFilter) {
    await bondPage.select('#submissionTypeFilter', 'all_bonds');
    console.log('  → Applied All Bonds filter — waiting for AJAX...');
    // Wait for network then extra time for DOM update
    await bondPage.waitForNetworkIdle({ timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 5000));
  } else {
    console.log('  ⚠ #submissionTypeFilter not found — scraping all bonds');
  }

  while (true) {
    console.log(`  Scanning page ${pageNum}...`);
    await bondPage.waitForNetworkIdle({ timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    const text = await bondPage.evaluate(() => document.body.innerText);

    if (pageNum === 1) {
      // Log count and filter value to confirm AJAX applied
      const countLine = text.split('\n').find(l => /\d+ - \d+ of \d+ Items/i.test(l));
      console.log(`  Count: ${countLine || 'not found'}`);
      const filterVal = await bondPage.evaluate(() => {
        const s = document.querySelector('#submissionTypeFilter');
        return s ? s.value : 'N/A';
      }).catch(() => 'err');
      console.log(`  Filter value: ${filterVal}`);
    }

    if (pageNum === 1) { require("fs").writeFileSync("/tmp/rli_page1.txt", text); }
    const bonds = parseBondCards(text);
    allBonds.push(...bonds);
    console.log(`    Found ${bonds.length} bonds on page ${pageNum} (total: ${allBonds.length})`);

    // Find and click next-page button
    const pagResult = await bondPage.evaluate(() => {
      // Log all pagination-related elements
      const paginationEls = Array.from(document.querySelectorAll('li.pagination, li.pagination *'))
        .map(el => `${el.tagName}[${el.className}]="${el.textContent.trim()}"`);

      const nextEl = Array.from(document.querySelectorAll('a'))
        .find(a => {
          const t = a.textContent.trim();
          return t === '›' || t === '»' || t === 'Next';
        });

      if (!nextEl) return { found: false, reason: 'no <a> with › text', paginationEls };
      const li = nextEl.closest('li');
      if (li && (li.classList.contains('disabled') || li.classList.contains('inactive'))) {
        return { found: false, reason: 'li.disabled', paginationEls };
      }
      nextEl.click();
      return { found: true, paginationEls };
    });

    if (pageNum === 1 || !pagResult.found) {
      console.log(`  Pagination els: ${(pagResult.paginationEls || []).join(' | ').substring(0, 200)}`);
    }
    console.log(`  Pagination: ${pagResult.found ? 'next clicked' : pagResult.reason}`);

    if (!pagResult.found || pageNum >= 20) break;
    pageNum++;
    await new Promise(r => setTimeout(r, 4000));
    await bondPage.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
  }

  return allBonds;
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('═══ mybondapp → CRM Bookkeeping Sync ═══');
  console.log(`  Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'} | All: ${ALL}`);

  let carrierId;
  if (!DRY_RUN) carrierId = await ensureRliCarrier();

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    headless: !VISIBLE,
    defaultViewport: VISIBLE ? null : { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  let allBonds = [];
  try {
    const page = await browser.newPage();

    // Also listen for new tabs opened by "My Bond Center" click
    let newTabPage = null;
    browser.on('targetcreated', async target => {
      if (target.type() === 'page') newTabPage = await target.page();
    });

    await ensureSession(page);

    // Try direct BondList navigation; if a new tab was opened use that
    await navigateToBondList(page);

    let bondPage = newTabPage || page;
    // Prefer whichever tab actually sits on the BondList — the My Bond Center
    // click can open a new tab that lands on /Agency (New Bond catalog) instead.
    if (!bondPage.url().includes('/Agency/BondList')) {
      if (page.url().includes('/Agency/BondList')) {
        bondPage = page;
      } else {
        await bondPage.goto(BOND_LIST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 4000));
        await bondPage.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
      }
    }
    const bondUrl = bondPage.url();
    console.log(`  Active bond page: ${bondUrl.substring(0, 70)}`);

    if (!bondUrl.includes('rlisurety.rlicorp.com')) {
      throw new Error(`Bond page is not rlisurety: ${bondUrl}`);
    }

    // Save all cookies (myportal + rlisurety) for next run
    await saveAllCookies(page);

    allBonds = await scrapeAllBonds(bondPage);
  } catch (err) {
    console.error('✗ Error:', err.message);
  } finally {
    await browser.close();
  }

  console.log(`\n  Total bonds scraped: ${allBonds.length}`);
  if (!allBonds.length) { console.log('  Nothing to sync.'); return; }

  if (DRY_RUN) {
    console.log('\n── DRY RUN — bonds that would be upserted ──');
    allBonds.forEach((b, i) =>
      console.log(`  ${i+1}. ${b.bond_number} | ${b.insured_name} | ${b.bond_type} | $${b.premium} prem | ${b.effective_date}→${b.expiration_date} | ${b.status}`)
    );
    console.log('\n(Remove --dry-run to sync)');
    return;
  }

  const payload = allBonds.map(b => ({ ...b, carrier_id: carrierId, source: 'mybondapp' }));
  console.log(`\n  Upserting ${payload.length} bonds...`);
  const result = await apiRequest('POST', '/bonds/upsert-from-scraper', payload);
  console.log(`  ✓ Upserted: ${result.upserted} | Flagged: ${result.flagged}`);

  const renewal = await apiRequest('POST', '/jobs/renewal-scan', {});
  if (renewal.count > 0) console.log(`  ✓ ${renewal.count} renewal alerts generated`);

  console.log('\n═══ Sync complete ═══');
})();
