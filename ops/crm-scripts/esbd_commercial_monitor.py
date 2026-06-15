#!/usr/bin/env python3
"""
ESBD Commercial Bond Monitor — uses USASpending.gov federal TX construction contracts.
Federal contracts >$150K require performance/payment bonds (Miller Act).
Matches awarded contractor names against TDLR licenses, creates leads, sends emails.

Usage: esbd_commercial_monitor.py [--dry-run]
Cron: 0 7 * * 1-5
"""

import os, sys, json, ssl, re, urllib.request
from datetime import datetime, date, timedelta

import psycopg2
import boto3


def _load_env(path="/usr/local/etc/qs-crm.env"):
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
    except OSError:
        pass


_load_env()

DB_URL = ("postgresql://quantum_user:" + os.environ["CRM_DB_PASSWORD"]
          + "@localhost:5433/quantum_surety")
DRY_RUN = "--dry-run" in sys.argv
CTX = ssl.create_default_context()

MILLER_ACT_THRESHOLD = 150_000
MAX_CONTRACT = 5_000_000
DAILY_EMAIL_CAP = 50

ENSURE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS esbd_processed (
    id SERIAL PRIMARY KEY,
    award_key TEXT UNIQUE,
    vendor_name TEXT,
    award_amount NUMERIC,
    award_date DATE,
    agency TEXT,
    description TEXT,
    lead_created BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
"""


def fetch_tx_construction_awards(start_date: str, end_date: str, page: int = 1):
    payload = json.dumps({
        "filters": {
            "time_period": [{"start_date": start_date, "end_date": end_date}],
            "award_type_codes": ["A", "B", "C", "D"],
            "place_of_performance_locations": [{"country": "USA", "state": "TX"}],
            "award_amounts": [{"lower_bound": float(MILLER_ACT_THRESHOLD), "upper_bound": float(MAX_CONTRACT)}]
        },
        "fields": [
            "Award ID", "Recipient Name", "Award Amount",
            "Description", "Awarding Agency", "Place of Performance City Name",
            "Start Date", "generated_internal_id"
        ],
        "sort": "Award Amount",
        "order": "desc",
        "limit": 100,
        "page": page
    }).encode()
    req = urllib.request.Request(
        "https://api.usaspending.gov/api/v2/search/spending_by_award/",
        data=payload,
        headers={"Content-Type": "application/json", "User-Agent": "QuantumSuretyMonitor/1.0"}
    )
    with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
        return json.loads(r.read())


def normalize_name(name: str) -> str:
    name = name.upper()
    for suffix in [" LLC", " INC", " CORP", " CO", " LTD", " LP", " L.L.C.", " INC.", ",", "."]:
        name = name.replace(suffix, "")
    return re.sub(r"\s+", " ", name).strip()


def find_tdlr_match(cur, vendor_name: str):
    norm = normalize_name(vendor_name)
    words = [w for w in norm.split() if len(w) > 3]
    if not words:
        return None
    like_clause = " AND ".join(f"UPPER(business_name) LIKE %s" for _ in words[:3])
    params = [f"%{w}%" for w in words[:3]]
    cur.execute(
        f"""SELECT business_name, business_phone, business_city, business_county,
                   license_type, license_number
            FROM tdlr_licenses
            WHERE {like_clause}
              AND business_phone IS NOT NULL AND business_phone <> ''
            LIMIT 1""",
        params,
    )
    return cur.fetchone()


def send_email(ses, recipient_name: str, phone: str, city: str, county: str,
               agency: str, description: str, amount: float):
    city_str = city or county or "Texas"
    bond_pct = "2–5%"
    bond_est = amount * 0.03
    subject = f"Federal contract in {city_str} — do you have your performance bond?"
    body = f"""Hi {recipient_name},

A recent federal contract was awarded in {city_str}, Texas:

Agency: {agency or 'Federal Agency'}
Project: {description or 'Construction/Renovation'}
Contract Value: ${amount:,.0f}

Federal contracts over $150,000 require a performance bond and payment bond under the Miller Act (equal to the full contract value). If you haven't arranged bonding yet, we can move fast.

Performance & Payment Bond Quote — Same Day:
https://quantumsurety.bond/get-bond?type=performance&utm_source=usaspending&utm_medium=email&utm_campaign=federal-contract

Estimated bond premium for this contract: ~${bond_est:,.0f} ({bond_pct} of contract value).

Questions? Call (214) 666-8718 — we're available 24/7 and can typically issue bonds same day for contracts up to $500,000.

— Quantum Surety Bonds
Texas Licensed Surety Agency #3480229
Unsubscribe: https://quantumsurety.bond/unsubscribe"""

    ses.send_email(
        Source="nice.shotwell-sparks@quantumsurety.bond",
        Destination={"ToAddresses": [phone]},  # placeholder — phone used for lead, no email available
        Message={
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {"Text": {"Data": body, "Charset": "UTF-8"}},
        },
    )


def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute(ENSURE_TABLE_SQL)
    conn.commit()

    end_date = date.today().isoformat()
    start_date = (date.today() - timedelta(days=30)).isoformat()

    print(f"[{datetime.now()}] Fetching TX federal construction awards "
          f"${MILLER_ACT_THRESHOLD:,}–${MAX_CONTRACT:,} ({start_date} to {end_date})"
          + (" [DRY RUN]" if DRY_RUN else ""))

    try:
        data = fetch_tx_construction_awards(start_date, end_date)
    except Exception as e:
        print(f"[{datetime.now()}] USASpending API error: {e}")
        cur.close(); conn.close()
        return

    CONSTRUCTION_KEYWORDS = {
        "construct", "building", "renovation", "repair", "electrical", "hvac",
        "plumbing", "roofing", "paving", "infrastructure", "facility", "civil",
        "bridge", "road", "highway", "utility", "mechanical", "demolition",
        "remodel", "installation", "contractor", "grading", "excavat",
    }

    all_awards = data.get("results", [])
    awards = [
        a for a in all_awards
        if any(kw in (a.get("Description") or "").lower() for kw in CONSTRUCTION_KEYWORDS)
        or any(kw in (a.get("Recipient Name") or "").lower() for kw in {"construct", "electric", "hvac", "plumb", "build"})
    ]
    total = data.get("page_metadata", {}).get("total", len(all_awards))
    print(f"[{datetime.now()}] {len(all_awards)} awards fetched, {len(awards)} construction-related (total matching amount filter: {total})")

    ses = boto3.client(
        "ses",
        region_name="us-east-2",
        aws_access_key_id=os.environ.get("QS_AWS_KEY"),
        aws_secret_access_key=os.environ.get("QS_AWS_SECRET"),
    )

    leads_created = 0
    emails_sent = 0
    skipped_dedup = 0

    for award in awards:
        award_id = str(award.get("generated_internal_id") or award.get("Award ID") or "")
        vendor = (award.get("Recipient Name") or "").strip()
        amount = float(award.get("Award Amount") or 0)
        agency = (award.get("Awarding Agency") or "").strip()
        desc = (award.get("Description") or "").strip()[:200]
        city = (award.get("Place of Performance City Name") or "").strip()
        award_date_str = (award.get("Start Date") or end_date)

        if not vendor or amount < MILLER_ACT_THRESHOLD:
            continue

        # Dedup
        cur.execute("SELECT id FROM esbd_processed WHERE award_key = %s", (award_id,))
        if cur.fetchone():
            skipped_dedup += 1
            continue

        # Try to match TDLR license
        match = find_tdlr_match(cur, vendor)

        if DRY_RUN:
            match_str = f"→ TDLR match: {match[0]}" if match else "→ no TDLR match"
            print(f"  DRY: {vendor[:40]} | ${amount:,.0f} | {city} | {match_str}")
            cur.execute("""INSERT INTO esbd_processed (award_key, vendor_name, award_amount, award_date, agency, description, lead_created, email_sent)
                           VALUES (%s,%s,%s,%s,%s,%s,FALSE,FALSE)
                           ON CONFLICT (award_key) DO NOTHING""",
                        (award_id, vendor, amount, award_date_str, agency, desc))
            conn.commit()
            leads_created += 1
            continue

        try:
            award_date = datetime.strptime(award_date_str[:10], "%Y-%m-%d").date()
        except Exception:
            award_date = date.today()

        notes = (f"Federal contract: {desc}\nAgency: {agency}\n"
                 f"Contract value: ${amount:,.0f}\nCity: {city}\n"
                 f"USASpending award ID: {award_id}\n"
                 f"Requires performance+payment bond (Miller Act)")

        tdlr_name = match[0] if match else vendor
        tdlr_phone = match[1] if match else ""
        tdlr_city = match[2] if match else city

        cur.execute("""INSERT INTO leads (name, email, phone, bond_type, source, status, notes, created_at, updated_at)
                       VALUES (%s, '', %s, 'Texas Performance & Payment Bond', 'ESBD Monitor', 'new', %s, NOW(), NOW())""",
                    (tdlr_name, tdlr_phone, notes))
        conn.commit()
        leads_created += 1

        cur.execute("""INSERT INTO esbd_processed (award_key, vendor_name, award_amount, award_date, agency, description, lead_created, email_sent)
                       VALUES (%s,%s,%s,%s,%s,%s,TRUE,FALSE)
                       ON CONFLICT (award_key) DO NOTHING""",
                    (award_id, vendor, amount, award_date, agency, desc))
        conn.commit()

        # Email only if we have a TDLR phone match (we use it as identifier — no email available from USASpending)
        # Skip email for now; phone-based CRM outreach handles it via lead_intelligence.py
        emails_sent += 0  # Phone leads go through voice/drip, not direct email

    print(f"[{datetime.now()}] Done — leads={'would create' if DRY_RUN else 'created'}: {leads_created}, "
          f"skipped (dedup): {skipped_dedup}, emails: {emails_sent}")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
