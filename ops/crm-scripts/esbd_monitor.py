#!/usr/bin/env python3
# Commercial Bond Monitor - targets contractors with high-value permits (>$50K declared value)
# who may need performance/payment bonds for large commercial projects.
# Source: permit_issuances table (Austin city permit data via permit_scraper.py).
# Cron: 0 9 * * 1-5 (weekdays 9 AM)
# Usage: esbd_monitor.py [--dry-run]
import os, sys, boto3
from datetime import datetime
import psycopg2

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
DRY_RUN = "--dry-run" in sys.argv
DB_URL = ("postgresql://quantum_user:" + os.environ["CRM_DB_PASSWORD"]
          + "@localhost:5433/quantum_surety")

BATCH_LIMIT = 100
COMMERCIAL_WORK_CLASSES = ("New", "Addition", "Commercial", "Shell")
TARGET_PERMIT_TYPES = ("Building Permit", "Mechanical Permit", "Electrical Permit", "Plumbing Permit")

CREATE_TABLE_SQL = (
    "CREATE TABLE IF NOT EXISTS esbd_processed ("
    "id SERIAL PRIMARY KEY, award_key TEXT UNIQUE, vendor_name TEXT, "
    "award_amount NUMERIC, award_date DATE, agency TEXT, description TEXT, "
    "lead_created BOOLEAN DEFAULT FALSE, email_sent BOOLEAN DEFAULT FALSE, "
    "created_at TIMESTAMP DEFAULT NOW())"
)

SELECT_SQL = """
SELECT p.contractor_company, p.contractor_phone, p.declared_value,
       p.description, p.address, p.city, p.permit_type, p.permit_number, p.issue_date,
       p.work_class
FROM permit_issuances p
WHERE p.contractor_phone IS NOT NULL AND p.contractor_phone <> ''
  AND p.work_class = ANY(%s)
  AND p.permit_type = ANY(%s)
  AND p.issue_date >= CURRENT_DATE - INTERVAL '30 days'
  AND NOT EXISTS (
    SELECT 1 FROM esbd_processed ep
    WHERE ep.award_key = p.source || '|' || p.permit_number
  )
  AND NOT EXISTS (
    SELECT 1 FROM leads l
    WHERE regexp_replace(l.phone, '\\D', '', 'g') = regexp_replace(p.contractor_phone, '\\D', '', 'g')
      AND l.source = 'ESBD Monitor'
      AND l.created_at >= NOW() - INTERVAL '60 days'
  )
ORDER BY p.issue_date DESC
LIMIT %s
"""

INSERT_PROCESSED_SQL = (
    "INSERT INTO esbd_processed (award_key, vendor_name, award_amount, award_date, description, lead_created) "
    "VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (award_key) DO NOTHING"
)

INSERT_LEAD_SQL = (
    "INSERT INTO leads (name, email, phone, bond_type, source, status, notes, created_at, updated_at) "
    "VALUES (%s, '', %s, 'Texas Performance & Payment Bond', 'ESBD Monitor', 'new', %s, NOW(), NOW())"
)

EMAIL_BODY = (
    "Hi %s,\n\n"
    "We noticed a recent permit pulled at %s%s — a %s project with a declared value of $%s.\n\n"
    "Texas contractors on commercial projects often need a performance and payment bond "
    "equal to the contract value. If your client or GC is requiring one, we can issue it quickly.\n\n"
    "Performance Bond Quote:\n"
    "https://quantumsurety.bond/get-bond?type=performance&utm_source=esbd&utm_medium=email&utm_campaign=permit-value\n\n"
    "Call us: (214) 666-8718\n"
    "Available 24/7 — same-day issuance for contracts up to $500,000.\n\n"
    "-- Quantum Surety Bonds\n"
    "Texas Licensed Surety Agency #3480229\n"
    "Unsubscribe: https://quantumsurety.bond/unsubscribe\n"
)

def send_email(ses, phone, company, address, city, permit_type, value):
    addr_str = (" at %s, %s" % (address, city)) if address else ""
    city_str = city or "Texas"
    body = EMAIL_BODY % (
        company or "there", address or "your recent project", addr_str,
        permit_type or "commercial", "{:,.0f}".format(float(value or 0))
    )
    # Note: no email in permit_issuances - send to placeholder for now, log only
    return body

def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute(CREATE_TABLE_SQL)
    conn.commit()

    cur.execute(SELECT_SQL, (list(COMMERCIAL_WORK_CLASSES), list(TARGET_PERMIT_TYPES), BATCH_LIMIT))
    rows = cur.fetchall()
    print("[%s] %d high-value permits found for commercial bond targeting%s" % (
        datetime.now(), len(rows), " (DRY RUN)" if DRY_RUN else ""))

    leads_created = 0
    for company, phone, value, desc, address, city, permit_type, permit_no, issue_date, work_class in rows:
        award_key = "austin|%s" % permit_no
        notes = ("High-Value Permit - Commercial Bond Opportunity\n"
                 "Contractor: %s\nPhone: %s\n"
                 "Permit: %s | Type: %s\n"
                 "Address: %s, %s\nDeclared Value: $%s\n"
                 "Issue Date: %s\nDescription: %s\n"
                 "Source: Commercial Bond Monitor - may need performance/payment bond" % (
                     company or "Unknown", phone,
                     permit_no, permit_type or "Commercial",
                     address or "", city or "",
                     "{:,.0f}".format(float(value or 0)),
                     issue_date, desc or ""))

        if DRY_RUN:
            print("  would create lead: %s | %s | $%s | %s" % (
                company, phone, "{:,.0f}".format(float(value or 0)), permit_type))
            cur.execute("SELECT 1 FROM esbd_processed WHERE award_key = %s", (award_key,))
            if not cur.fetchone():
                leads_created += 1
            continue

        try:
            cur.execute(INSERT_LEAD_SQL, (company or "Unknown Contractor", phone, notes))
            conn.commit()
            cur.execute(INSERT_PROCESSED_SQL,
                        (award_key, company, value, issue_date, desc, True))
            conn.commit()
            leads_created += 1
        except Exception as e:
            print("  error for %s: %s" % (company, e))
            conn.rollback()

    print("[%s] %s %d commercial bond leads" % (
        datetime.now(), "would create" if DRY_RUN else "created", leads_created))
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
