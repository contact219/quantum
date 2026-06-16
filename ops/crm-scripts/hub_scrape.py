#!/usr/bin/env python3
"""
HUB Contractor Scraper
Fetches HUB-certified construction vendors from Texas CMBL search
Categories: 1=Heavy Construction, 2=Building Construction, 3=Special Trade
Outputs /tmp/hub_vendors.json for hub_contractor_outreach.js
"""
import os, re, json, logging
from playwright.sync_api import sync_playwright

logging.basicConfig(format='[%(asctime)s] %(message)s', level=logging.INFO, datefmt='%Y-%m-%d %H:%M:%S')
log = logging.getLogger(__name__)

os.environ['PLAYWRIGHT_BROWSERS_PATH'] = '/home/tsparks/.playwright'

URL = 'https://mycpa.cpa.state.tx.us/tpasscmblsearch/tpasscmblsearch.do'
CATEGORIES = [
    ('1', 'Heavy Construction'),
    ('2', 'Building Construction'),
    ('3', 'Special Trade Construction'),
]


def parse_vendors(html: str) -> list[dict]:
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
    data_rows = [r for r in rows if '<td' in r]
    vendors = []
    for row in data_rows:
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        clean = [re.sub(r'<[^>]+>', '', c).strip() for c in cells]
        if len(clean) < 3:
            continue
        # Fields: VendorID+Company, Contact, Address, City, State, Phone, Email
        def strip_label(s, label):
            return re.sub(r'^\s*' + re.escape(label), '', s).strip()

        company = strip_label(clean[1] if len(clean) > 1 else '', 'Company Name')
        contact = strip_label(clean[2] if len(clean) > 2 else '', 'Contact Person')
        city    = strip_label(clean[4] if len(clean) > 4 else '', 'City')
        email_raw = strip_label(clean[8] if len(clean) > 8 else '', 'Email')
        phone   = strip_label(clean[9] if len(clean) > 9 else '', 'Phone')
        emails  = re.findall(r'[\w.+%-]+@[\w.-]+\.\w+', email_raw)
        email   = emails[0] if emails else ''
        if not company or company.startswith('Selection'):
            continue
        vendors.append({'company': company, 'contact': contact, 'city': city, 'phone': phone, 'email': email})
    return vendors


def scrape_category(page, cat_val: str, cat_name: str) -> list[dict]:
    page.goto(URL, wait_until='networkidle', timeout=30000)
    page.evaluate(f'''() => {{
        document.querySelectorAll("input[name=searchType]").forEach(r => r.checked=(r.value==="VetHUBs Only"));
        var cat = document.getElementById("category"); if(cat) cat.value="{cat_val}";
        var sel = document.getElementById("selectedColumns");
        if(sel) Array.from(sel.options).forEach(o=>{{ o.selected=["companyName","contactPerson","phone","email","city"].includes(o.value); }});
        var out = document.getElementById("outputAs"); if(out) out.value="OUTPUT_AS_DETAIL_LIST";
        var inp = document.createElement("input");
        inp.type="hidden"; inp.name="search"; inp.value="search";
        document.querySelector("form").appendChild(inp);
    }}''')
    with page.expect_navigation(wait_until='networkidle', timeout=25000):
        page.evaluate('() => document.querySelector("form").submit()')
    page.wait_for_timeout(1000)
    html = page.content()
    vendors = parse_vendors(html)
    log.info(f'Category {cat_val} ({cat_name}): {len(vendors)} vendors')
    return vendors


def run():
    all_vendors = []
    seen_emails = set()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})

        for cat_val, cat_name in CATEGORIES:
            try:
                vendors = scrape_category(page, cat_val, cat_name)
                for v in vendors:
                    email_key = v['email'].lower() if v['email'] else ''
                    if email_key and email_key not in seen_emails:
                        seen_emails.add(email_key)
                        all_vendors.append(v)
                    elif not email_key:
                        all_vendors.append(v)
            except Exception as e:
                log.error(f'Category {cat_val} failed: {e}')

        browser.close()

    with_email = [v for v in all_vendors if v['email']]
    log.info(f'Total unique vendors: {len(all_vendors)}, with email: {len(with_email)}')
    with open('/tmp/hub_vendors.json', 'w') as f:
        json.dump(all_vendors, f, indent=2)
    log.info('Saved to /tmp/hub_vendors.json')


if __name__ == '__main__':
    run()
