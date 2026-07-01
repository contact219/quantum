import puppeteer from 'puppeteer-core';

const TX_CITIES = ['houston','dallas','sanantonio','austin','fortworth','elpaso','beaumont'];
const QUERIES   = ['no title','bonded title','lost title','title bond'];
const CHROME    = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';

function extractPhone(text) {
  const m = text.match(/\b(\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})\b/);
  if (!m) return null;
  const digits = m[1].replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : null;
}

export async function searchCraigslistTitleListings({ cities = TX_CITIES.slice(0,4) } = {}) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],
    headless: true
  });
  const leads = [];
  try {
    for (const city of cities) {
      for (const query of QUERIES.slice(0,2)) {
        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
        );
        try {
          const url = 'https://' + city + '.craigslist.org/search/cta?query='
            + encodeURIComponent(query) + '&sort=date';
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
          await new Promise(r => setTimeout(r, 2000));

          // Craigslist 2024 layout: listing titles are in <a class="posting-title ...">
          const listings = await page.evaluate(function() {
            var links = Array.from(document.querySelectorAll('a.posting-title'));
            var seen = new Set();
            return links
              .filter(function(a) {
                if (seen.has(a.href)) return false;
                seen.add(a.href);
                return a.textContent.trim().length > 3;
              })
              .slice(0, 6)
              .map(function(a) {
                return { title: a.textContent.trim().slice(0, 120), href: a.href };
              });
          });

          for (const listing of listings.slice(0,4)) {
            try {
              const dp = await browser.newPage();
              await dp.setUserAgent(
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
              );
              await dp.goto(listing.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
              await new Promise(r => setTimeout(r, 800));
              const detail = await dp.evaluate(function() {
                var body = document.body ? document.body.innerText : '';
                var priceEl = document.querySelector('.price, .priceinfo, [class*=\"price\"]');
                return {
                  body: body.slice(0, 1000),
                  price: priceEl ? priceEl.textContent.trim() : ''
                };
              });
              await dp.close();
              leads.push({
                title: listing.title,
                phone: extractPhone(detail.body),
                price: detail.price,
                city: city,
                source: 'craigslist-title',
                url: listing.href,
                notes: 'CL ' + city + ' "' + query + '"'
                       + (detail.price ? ' ' + detail.price : '')
              });
            } catch (_) {
              leads.push({
                title: listing.title,
                city: city,
                source: 'craigslist-title',
                url: listing.href,
                notes: 'CL ' + city + ' "' + query + '"'
              });
            }
            await new Promise(r => setTimeout(r, 500));
          }
        } catch (_) { /* skip */ }
        await page.close();
        await new Promise(r => setTimeout(r, 800));
      }
    }
  } finally {
    await browser.close();
  }
  return leads;
}
