#!/usr/bin/env python3
"""
Daily TX SOS notary refresh — rebuilt 2026-06-10 (original lost to /tmp cleanup).
Downloads the Texas notary database from data.texas.gov and upserts into
CRM PostgreSQL notaries table (unique key: notary_id).
Cron: 0 7 * * *
"""

import csv
import re
import sys
import urllib.request
from datetime import datetime

import psycopg2
from psycopg2.extras import execute_values

URL = "https://data.texas.gov/api/views/gmd3-bnrd/rows.csv?accessType=DOWNLOAD"
TMP_FILE = "/var/tmp/notaries_crm.csv"
BATCH = 5000

import os


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

UPSERT_SQL = """
INSERT INTO notaries (notary_id, first_name, last_name, email, address, city,
                      state, zip, effective_date, expire_date, surety_company,
                      agency, updated_at)
VALUES %s
ON CONFLICT (notary_id) DO UPDATE SET
  first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name,
  email = EXCLUDED.email, address = EXCLUDED.address, city = EXCLUDED.city,
  state = EXCLUDED.state, zip = EXCLUDED.zip,
  effective_date = EXCLUDED.effective_date, expire_date = EXCLUDED.expire_date,
  surety_company = EXCLUDED.surety_company, agency = EXCLUDED.agency,
  updated_at = NOW()
"""


def parse_date(s):
    s = (s or "").strip()
    for fmt in ("%m/%d/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def parse_address(raw):
    # TX SOS format is usually "street line(s)\nCity, TX 77001" — newlines inside
    # the field, and the street may itself contain commas/suite parts. Parse from
    # the end: state+zip, then city = the last newline/comma-delimited token.
    raw = (raw or "").strip()
    if not raw:
        return "", "", "TX", ""
    m = re.search(r"[,\s]+([A-Za-z]{2})\s+(\d{5})(?:-\d{4})?\s*$", raw)
    if not m:
        return re.sub(r"\s+", " ", raw), "", "TX", ""
    state, zip_code = m.group(1).upper(), m.group(2)
    head = raw[: m.start()].strip()
    parts = [p.strip() for p in re.split(r"[\n,]", head) if p.strip()]
    city = parts[-1] if parts else ""
    street = re.sub(r"\s+", " ", " ".join(parts[:-1])).strip(" ,")
    # suite/floor fragments that still leak into the city slot
    city = re.sub(r"^(suite|ste\.?|apt\.?|unit|bldg\.?|floor|fl\.?|#)\s*\S*\s*", "", city, flags=re.I).strip()
    return street, city.title(), state, zip_code


def main():
    print(f"[{datetime.now()}] downloading TX SOS notary CSV ...")
    urllib.request.urlretrieve(URL, TMP_FILE)

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    batch, total = [], 0

    with open(TMP_FILE, newline="", encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            nid = (row.get("Notary ID") or "").strip()
            if not nid:
                continue
            address, city, state, zip_code = parse_address(row.get("Address", ""))
            batch.append((
                nid,
                (row.get("First Name") or "").strip(),
                (row.get("Last Name") or "").strip(),
                (row.get("Email Address") or "").strip().lower(),
                address, city, state, zip_code,
                parse_date(row.get("Effective Date")),
                parse_date(row.get("Expire Date")),
                (row.get("Surety Company") or "").strip(),
                (row.get("Agency") or "").strip(),
                datetime.now(),
            ))
            if len(batch) >= BATCH:
                execute_values(cur, UPSERT_SQL, batch)
                conn.commit()
                total += len(batch)
                batch = []

    if batch:
        execute_values(cur, UPSERT_SQL, batch)
        conn.commit()
        total += len(batch)

    print(f"[{datetime.now()}] upserted {total} notaries")
    cur.close()
    conn.close()


if __name__ == "__main__":
    sys.exit(main())
