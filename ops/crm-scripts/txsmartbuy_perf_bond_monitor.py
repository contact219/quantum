#!/usr/bin/env python3
"""
TxSmartBuy Performance Bond Monitor
Scrapes awarded contracts from txsmartbuy.gov/esbdawards
Filters for construction/facility work >= $50K (Texas Gov Code 2253 bond threshold)
Inserts leads into CRM PostgreSQL — source: TxSmartBuy Monitor, bond_type: performance
Cron: 0 7 * * 1-5  (weekdays 7 AM)
"""

import os, re, time, logging, psycopg2
from datetime import datetime
from playwright.sync_api import sync_playwright

logging.basicConfig(format="[%(asctime)s] %(message)s", level=logging.INFO, datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger(__name__)

DB = dict(host="localhost", port=5433, dbname="quantum_surety", user="quantum_user", password="Qs2024Secure!")
BASE_URL = "https://www.txsmartbuy.gov/esbdawards"
PLAYWRIGHT_PATH = "/home/tsparks/.playwright"
MIN_AMOUNT = 50_000   # Texas Gov Code 2253: bonds required on public work > $25K; use $50K to target meaningful contracts
MAX_PAGES = 10        # ~200 contracts — captures ~2 weeks of awards at current volume
CONSTRUCTION_KEYWORDS = [
    "construction", "renovation", "remodel", "roofing", "roof",
    "hvac", "mechanical", "plumbing", "electrical", "wiring",
    "concrete", "paving", "pavement", "asphalt", "grading",
    "demolition", "demo ", "infrastructure", "utility install",
    "site work", "sitework", "structural", "flooring", "painting",
    "waterproof", "foundation", "retaining wall", "fence", "fencing",
    "parking lot", "building repair", "facility repair", "restroom",
    "generator install", "elevator install", "fire suppression",
    "sprinkler system", "landscape", "drainage", "storm drain",
    "sewer", "water line", "pipeline", "bridge", "culvert",
]


def parse_amount(text: str) -> float:
    cleaned = re.sub(r"[^\d.]", "", text)
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def is_construction(description: str) -> bool:
    desc = description.lower()
    return any(kw in desc for kw in CONSTRUCTION_KEYWORDS)


def ensure_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS txsmartbuy_processed (
            po_number TEXT PRIMARY KEY,
            vendor TEXT,
            agency TEXT,
            amount NUMERIC,
            award_date DATE,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)


def parse_fields(row_el) -> dict:
    """Extract key:value pairs from <p><strong>Key: </strong> Value </p> elements."""
    fields = {}
    for p in row_el.query_selector_all("p"):
        strong = p.query_selector("strong")
        if not strong:
            continue
        key = strong.inner_text().strip().rstrip(":").strip()
        full = p.inner_text().strip()
        label = strong.inner_text().strip()
        value = full[len(label):].strip().lstrip(":").strip()
        fields[key] = value
    return fields


def scrape_awards(page, page_num: int) -> list[dict]:
    url = f"{BASE_URL}?page={page_num}" if page_num > 1 else BASE_URL
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector(".esbd-result-row", timeout=15000)
    rows = page.query_selector_all(".esbd-result-row")
    awards = []
    for row in rows:
        title_el = row.query_selector(".esbd-result-title a")
        description = title_el.inner_text().strip() if title_el else ""
        fields = parse_fields(row)
        po = fields.get("PO Number", "").strip()
        if not po:
            continue
        awards.append({
            "po_number": po,
            "agency": fields.get("Agency/Texas SmartBuy Member Number", ""),
            "vendor": fields.get("Vendor Name", ""),
            "phone": fields.get("Vendor Contact Number", ""),
            "email": fields.get("Vendor Email", ""),
            "amount": parse_amount(fields.get("PO Amount", "0")),
            "award_date_str": fields.get("Award Date", ""),
            "description": description,
        })
    return awards


def parse_date(s: str):
    for fmt in ("%m/%d/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(s.strip(), fmt).date()
        except ValueError:
            continue
    return None


def run():
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = PLAYWRIGHT_PATH
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()
    ensure_table(cur)
    conn.commit()

    # Load already-processed PO numbers
    cur.execute("SELECT po_number FROM txsmartbuy_processed")
    seen = {row[0] for row in cur.fetchall()}
    log.info(f"Already processed: {len(seen)} PO numbers")

    leads_inserted = 0
    skipped_dedup = 0
    skipped_filter = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page()

        for page_num in range(1, MAX_PAGES + 1):
            log.info(f"Scraping page {page_num}/{MAX_PAGES}")
            try:
                awards = scrape_awards(page, page_num)
            except Exception as e:
                log.warning(f"Page {page_num} failed: {e}")
                break

            if not awards:
                log.info("No rows found — stopping")
                break

            for a in awards:
                po = a["po_number"]

                if po in seen:
                    skipped_dedup += 1
                    continue

                if a["amount"] < MIN_AMOUNT:
                    skipped_filter += 1
                    seen.add(po)
                    continue

                if not is_construction(a["description"]):
                    skipped_filter += 1
                    seen.add(po)
                    continue

                award_date = parse_date(a["award_date_str"])

                # Insert into dedup table
                cur.execute("""
                    INSERT INTO txsmartbuy_processed (po_number, vendor, agency, amount, award_date, description)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (po_number) DO NOTHING
                """, (po, a["vendor"], a["agency"], a["amount"], award_date, a["description"]))

                # Insert CRM lead
                notes = (
                    f"TxSmartBuy Contract Award\n"
                    f"PO: {po}\n"
                    f"Agency: {a['agency']}\n"
                    f"Amount: ${a['amount']:,.2f}\n"
                    f"Award Date: {a['award_date_str']}\n"
                    f"Description: {a['description']}\n"
                    f"Performance bond required under TX Gov Code §2253"
                )
                cur.execute("""
                    INSERT INTO leads (name, email, phone, bond_type, source, status, notes, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
                """, (
                    a["vendor"],
                    a.get("email", "") or None,
                    a.get("phone", "") or None,
                    "performance",
                    "TxSmartBuy Monitor",
                    "new",
                    notes,
                ))
                seen.add(po)
                leads_inserted += 1

            conn.commit()
            time.sleep(1.5)  # polite scraping

        browser.close()

    cur.close()
    conn.close()
    log.info(f"Done — leads inserted: {leads_inserted}, deduped: {skipped_dedup}, filtered (amount/type): {skipped_filter}")


if __name__ == "__main__":
    run()
