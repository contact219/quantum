#!/usr/bin/env node
/**
 * saved_bond_enrich.cjs — pull principal contact info for saved (draft) RLI
 * applications into bk_bonds, so saved_bond_recovery.cjs can email them.
 *
 * Reuses the mybondapp_sync session cookies. Visits each saved bond's detail
 * page (/Agency/Bond/Index/{submissionNo}), reads rendered form field values,
 * extracts an email + phone, and updates bk_bonds. Contact values are written
 * only to the CRM database — the log prints counts and bond ids, not PII.
 *
 * Usage:
 *   node saved_bond_enrich.cjs [--limit N]   (default 200)
 */
const puppeteer = require('/usr/local/lead-gen/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const CHROMIUM     = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';
const SESSION_FILE = path.join('/opt/quantum-ops', '.rli_session.json');
const LIM_IDX = process.argv.indexOf('--limit');
const LIMIT   = LIM_IDX >= 0 ? parseInt(process.argv[LIM_IDX + 1]) : 200;

const COOKIE_ALLOWED = new Set(['name','value','domain','path','expires','httpOnly','secure','sameSite','url']);
function cleanCookies(raw) {
  return raw.filter(c => !c.partitionKey)
    .map(c => Object.fromEntries(Object.entries(c).filter(([k]) => COOKIE_ALLOWED.has(k))));
}

async function main() {
  const db = new Client({
    host: 'localhost', port: 5433, database: 'quantum_surety',
    user: 'quantum_user', password: process.env.CRM_DB_PASSWORD,
  });
  await db.connect();

  const { rows: targets } = await db.query(`
    SELECT id, bond_number FROM bk_bonds
    WHERE status = 'saved' AND bond_number LIKE 'DRAFT-%'
      AND (insured_email IS NULL OR insured_email = '')
    ORDER BY commission_amt DESC NULLS LAST
    LIMIT $1
  `, [LIMIT]);
  console.log(`[Enrich] ${targets.length} saved bonds lacking contact info`);
  if (!targets.length) { await db.end(); return; }

  if (!fs.existsSync(SESSION_FILE)) throw new Error('No session file — run mybondapp_sync.cjs first');

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM, headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  let enriched = 0, noContact = 0, errors = 0;
  try {
    const page = await browser.newPage();
    await page.setCookie(...cleanCookies(JSON.parse(fs.readFileSync(SESSION_FILE))));

    // Establish rlisurety session via the list page first
    await page.goto('https://rlisurety.rlicorp.com/Agency/BondList', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    if (!page.url().includes('rlisurety.rlicorp.com')) {
      throw new Error(`Session not valid for rlisurety (at ${page.url().substring(0, 60)})`);
    }

    for (const t of targets) {
      const submNo = t.bond_number.replace(/^DRAFT-/, '');
      if (!/^\d+$/.test(submNo)) { noContact++; continue; }  // nameSlug fallback keys have no page

      try {
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

        if (contact.email || contact.phone) {
          await db.query(
            `UPDATE bk_bonds SET
               insured_email = COALESCE(NULLIF(insured_email, ''), $1),
               insured_phone = COALESCE(NULLIF(insured_phone, ''), $2),
               updated_at = NOW()
             WHERE id = $3`,
            [contact.email, contact.phone, t.id]
          );
          console.log(`  ✓ bond ${t.id} (${t.bond_number}): email=${contact.email ? 'yes' : 'no'} phone=${contact.phone ? 'yes' : 'no'}`);
          enriched++;
        } else {
          console.log(`  - bond ${t.id} (${t.bond_number}): no contact info entered`);
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
  console.log(`[Enrich] Done. enriched=${enriched} no-contact=${noContact} errors=${errors}`);
}
main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
