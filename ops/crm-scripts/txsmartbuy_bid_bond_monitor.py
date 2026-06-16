#!/usr/bin/env python3
"""
TxSmartBuy Bid Bond Monitor
Scrapes active construction solicitations from txsmartbuy.gov/esbd
Visits detail pages for contact info, county, estimated cost
Inserts bid bond leads into CRM PostgreSQL
Cron: 0 7 * * 1-5  (weekdays 7 AM)
"""

import os, re, time, logging, psycopg2
from datetime import datetime, date
from playwright.sync_api import sync_playwright

logging.basicConfig(format="[%(asctime)s] %(message)s", level=logging.INFO, datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger(__name__)

DB = dict(host="localhost", port=5433, dbname="quantum_surety", user="quantum_user", password=os.environ["CRM_DB_PASS"])
ESBD_URL = "https://www.txsmartbuy.gov/esbd"
PLAYWRIGHT_PATH = "/home/tsparks/.playwright"
MAX_LIST_PAGES = 15       # ~300 solicitations scanned per run
ACTIVE_STATUSES = {"posted", "addendum posted"}

CONSTRUCTION_KEYWORDS = [
    "construction", "renovation", "remodel", "roofing", "roof",
    "hvac", "mechanical", "plumbing", "electrical", "wiring",
    "concrete", "paving", "pavement", "asphalt", "grading",
    "demolition", "infrastructure", "utility", "structural",
    "flooring", "painting", "waterproof", "foundation",
    "retaining wall", "fence", "fencing", "parking lot",
    "building repair", "facility repair", "restroom",
    "generator", "elevator", "fire suppression", "sprinkler",
    "landscape", "drainage", "storm drain", "sewer",
    "water line", "pipeline", "bridge", "culvert",
    "roadway", "highway", "maintenance contract", "rehabilitation",
    "let maintenance", "let contract",
]


def is_construction(text: str) -> bool:
    t = text.lower()
    return any(kw in t for kw in CONSTRUCTION_KEYWORDS)


def parse_date(s: str):
    for fmt in ("%m/%d/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(s.strip(), fmt).date()
        except (ValueError, AttributeError):
            pass
    return None


def scrape_list_page(page, page_num: int) -> list[dict]:
    url = f"{ESBD_URL}?page={page_num}" if page_num > 1 else ESBD_URL
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_selector(".esbd-result-row", timeout=15000)
    rows = page.query_selector_all(".esbd-result-row")
    results = []
    for row in rows:
        title_el = row.query_selector(".esbd-result-title a")
        if not title_el:
            continue
        title = title_el.inner_text().strip()
        href = title_el.get_attribute("href") or ""
        sol_id = href.split("/esbd/")[-1] if "/esbd/" in href else ""

        fields = {}
        for p in row.query_selector_all("p"):
            strong = p.query_selector("strong")
            if not strong:
                continue
            key = strong.inner_text().strip().rstrip(":").strip()
            full = p.inner_text().strip()
            val = full[len(strong.inner_text()):].strip().lstrip(":").strip()
            fields[key] = val

        status = fields.get("Status", "").lower()
        due_date_str = fields.get("Due Date", "")
        due_date = parse_date(due_date_str)

        results.append({
            "sol_id": sol_id,
            "title": title,
            "status": status,
            "due_date": due_date,
            "due_date_str": due_date_str,
            "agency_num": fields.get("Agency/Texas SmartBuy Member Number", ""),
        })
    return results


def scrape_detail_page(page, sol_id: str) -> dict:
    url = f"https://www.txsmartbuy.gov/esbd/{sol_id}"
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)

    fields = {}
    for cell in page.query_selector_all(".esbd-result-cell"):
        strong = cell.query_selector("strong")
        p = cell.query_selector("p")
        if strong and p:
            key = strong.inner_text().strip().replace(" ", "").rstrip(":").strip()
            val = p.inner_text().strip()
            fields[key] = val

    desc_el = page.query_selector(".rich-text-editor-content")
    description = desc_el.inner_text().strip() if desc_el else ""

    # Parse EST. COST from description
    cost_match = re.search(r"EST\.\s*COST:\s*\$?([\d,]+(?:\.\d+)?)", description, re.IGNORECASE)
    estimated_cost = float(cost_match.group(1).replace(",", "")) if cost_match else None

    # Parse COUNTY from description
    county_match = re.search(r"COUNTY:\s*([A-Z ]+)", description, re.IGNORECASE)
    county = county_match.group(1).strip() if county_match else ""

    return {
        "contact_name": fields.get("Contact Name", ""),
        "contact_phone": fields.get("Contact Number", ""),
        "contact_email": fields.get("Contact Email", ""),
        "class_item": fields.get("Class/Item Code", ""),
        "description": description,
        "estimated_cost": estimated_cost,
        "county": county,
        "detail_url": f"https://www.txsmartbuy.gov/esbd/{sol_id}",
    }


def ensure_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS txsmartbuy_bids_processed (
            sol_id TEXT PRIMARY KEY,
            title TEXT,
            agency_num TEXT,
            due_date DATE,
            estimated_cost NUMERIC,
            county TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)


def run():
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = PLAYWRIGHT_PATH
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()
    ensure_table(cur)
    conn.commit()

    cur.execute("SELECT sol_id FROM txsmartbuy_bids_processed")
    seen = {row[0] for row in cur.fetchall()}
    log.info(f"Already processed: {len(seen)} solicitations")

    leads_inserted = 0
    skipped_dedup = 0
    skipped_filter = 0
    today = date.today()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page()

        for page_num in range(1, MAX_LIST_PAGES + 1):
            log.info(f"Scraping list page {page_num}/{MAX_LIST_PAGES}")
            try:
                items = scrape_list_page(page, page_num)
            except Exception as e:
                log.warning(f"List page {page_num} failed: {e}")
                break

            if not items:
                log.info("No rows — stopping")
                break

            for item in items:
                sol_id = item["sol_id"]

                if not sol_id or sol_id in seen:
                    skipped_dedup += 1
                    continue

                # Must be active status
                if item["status"] not in ACTIVE_STATUSES:
                    skipped_filter += 1
                    seen.add(sol_id)
                    continue

                # Must be future due date
                if item["due_date"] and item["due_date"] < today:
                    skipped_filter += 1
                    seen.add(sol_id)
                    continue

                # Must match construction keywords
                if not is_construction(item["title"]):
                    skipped_filter += 1
                    seen.add(sol_id)
                    continue

                # Fetch detail page
                log.info(f"  Detail: {sol_id} — {item['title'][:60]}")
                try:
                    detail = scrape_detail_page(page, sol_id)
                    time.sleep(1)
                except Exception as e:
                    log.warning(f"  Detail failed for {sol_id}: {e}")
                    detail = {"contact_name": "", "contact_phone": "", "contact_email": "",
                              "class_item": "", "description": "", "estimated_cost": None,
                              "county": "", "detail_url": f"https://www.txsmartbuy.gov/esbd/{sol_id}"}

                # Skip if estimated cost < $25K (below bid bond threshold)
                if detail["estimated_cost"] and detail["estimated_cost"] < 25000:
                    skipped_filter += 1
                    seen.add(sol_id)
                    cur.execute(
                        "INSERT INTO txsmartbuy_bids_processed (sol_id, title, agency_num, due_date, estimated_cost, county) VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING",
                        (sol_id, item["title"], item["agency_num"], item["due_date"], detail["estimated_cost"], detail["county"])
                    )
                    continue

                # Build notes
                cost_str = f"${detail['estimated_cost']:,.2f}" if detail["estimated_cost"] else "Unknown"
                notes = (
                    f"TxSmartBuy Bid Solicitation\n"
                    f"ID: {sol_id}\n"
                    f"Agency: {item['agency_num']}\n"
                    f"Description: {item['title']}\n"
                    f"County: {detail['county']}\n"
                    f"Estimated Cost: {cost_str}\n"
                    f"Due Date: {item['due_date_str']}\n"
                    f"Class/Item: {detail['class_item']}\n"
                    f"Contact: {detail['contact_name']} {detail['contact_phone']} {detail['contact_email']}\n"
                    f"URL: {detail['detail_url']}\n"
                    f"Bid bond typically required at 5% of contract value under TX Gov Code §2253"
                )

                cur.execute("""
                    INSERT INTO txsmartbuy_bids_processed (sol_id, title, agency_num, due_date, estimated_cost, county)
                    VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (sol_id) DO NOTHING
                """, (sol_id, item["title"], item["agency_num"], item["due_date"], detail["estimated_cost"], detail["county"]))

                cur.execute("""
                    INSERT INTO leads (name, email, phone, bond_type, source, status, notes, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
                """, (
                    item["title"][:200],
                    detail["contact_email"] or None,
                    detail["contact_phone"] or None,
                    "bid",
                    "TxSmartBuy Bid Monitor",
                    "new",
                    notes,
                ))

                seen.add(sol_id)
                leads_inserted += 1
                conn.commit()

            time.sleep(1.5)

        browser.close()

    cur.close()
    conn.close()
    log.info(f"Done — leads inserted: {leads_inserted}, deduped: {skipped_dedup}, filtered: {skipped_filter}")


if __name__ == "__main__":
    run()
