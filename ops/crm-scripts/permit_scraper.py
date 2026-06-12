#!/usr/bin/env python3
"""
Issued-permit scraper — Texas open-data feeds -> permit_issuances table.
Sources: Austin (Socrata 3syk-w9eu, live), Dallas (e7gq-4sah, text dates).
Runs daily; idempotent on (source, permit_number).
Cron: 30 6 * * *
"""
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import date, timedelta

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
DB_URL = ("postgresql://quantum_user:" + os.environ["CRM_DB_PASSWORD"]
          + "@localhost:5433/quantum_surety")

DDL = """
CREATE TABLE IF NOT EXISTS permit_issuances (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  permit_number TEXT NOT NULL,
  permit_type TEXT,
  work_class TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  zip TEXT,
  issue_date DATE,
  contractor_company TEXT,
  contractor_name TEXT,
  contractor_phone TEXT,
  contractor_trade TEXT,
  declared_value NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (source, permit_number)
);
CREATE INDEX IF NOT EXISTS idx_pi_issue_date ON permit_issuances (issue_date);
CREATE INDEX IF NOT EXISTS idx_pi_phone ON permit_issuances (contractor_phone);
"""


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "QuantumSurety-PermitPilot/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def austin(days=7):
    since = (date.today() - timedelta(days=days)).isoformat()
    params = urllib.parse.urlencode({
        "$where": f"issue_date >= '{since}'",
        "$limit": 5000,
        "$order": "issue_date DESC",
    })
    rows = fetch_json(f"https://data.austintexas.gov/resource/3syk-w9eu.json?{params}")
    out = []
    for r in rows:
        out.append(dict(
            source="austin",
            permit_number=r.get("permit_number", ""),
            permit_type=r.get("permit_type_desc", ""),
            work_class=r.get("work_class", ""),
            description=(r.get("description") or "")[:500],
            address=r.get("permit_location", ""),
            city="Austin",
            zip=(r.get("original_zip") or "")[:10],
            issue_date=(r.get("issue_date") or "")[:10] or None,
            contractor_company=(r.get("contractor_company_name") or "").strip(),
            contractor_name=(r.get("contractor_full_name") or "").strip(),
            contractor_phone=re.sub(r"\D", "", r.get("contractor_phone") or "")[-10:],
            contractor_trade=r.get("contractor_trade", ""),
            declared_value=None,
        ))
    return out


def dallas(days=7):
    # issued_date is a MM/DD/YY string; filter on the recent month patterns
    pats = set()
    d = date.today()
    for i in range(days + 1):
        dd = d - timedelta(days=i)
        pats.add(f"{dd.month:02d}/{dd.day:02d}/{str(dd.year)[2:]}")
    where = " OR ".join(f"issued_date='{p}'" for p in sorted(pats))
    params = urllib.parse.urlencode({"$where": where, "$limit": 5000})
    try:
        rows = fetch_json(f"https://www.dallasopendata.com/resource/e7gq-4sah.json?{params}")
    except Exception as e:
        print(f"[scraper] dallas fetch failed: {e}")
        return []
    out = []
    for r in rows:
        blob = r.get("contractor") or ""
        phone = re.sub(r"\D", "", "".join(re.findall(r"\(\d{3}\)\s*\d{3}-?\d{4}", blob)))[-10:]
        company = re.split(r"\d", blob, 1)[0].strip(" ,")[:120]
        iss = r.get("issued_date") or ""
        m = re.match(r"(\d{2})/(\d{2})/(\d{2})$", iss)
        iso = f"20{m.group(3)}-{m.group(1)}-{m.group(2)}" if m else None
        out.append(dict(
            source="dallas",
            permit_number=r.get("permit_number", ""),
            permit_type=r.get("permit_type", ""),
            work_class="",
            description=(r.get("work_description") or "")[:500],
            address=r.get("street_address", ""),
            city="Dallas",
            zip=(r.get("zip_code") or "")[:10],
            issue_date=iso,
            contractor_company=company,
            contractor_name="",
            contractor_phone=phone,
            contractor_trade="",
            declared_value=None,
        ))
    return out


def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute(DDL)
    conn.commit()
    total = 0
    for src_fn in (austin, dallas):
        try:
            rows = src_fn()
        except Exception as e:
            print(f"[scraper] {src_fn.__name__} failed: {e}")
            continue
        ins = 0
        for p in rows:
            if not p["permit_number"]:
                continue
            cur.execute("""
                INSERT INTO permit_issuances (source, permit_number, permit_type, work_class,
                  description, address, city, zip, issue_date, contractor_company,
                  contractor_name, contractor_phone, contractor_trade, declared_value)
                VALUES (%(source)s, %(permit_number)s, %(permit_type)s, %(work_class)s,
                  %(description)s, %(address)s, %(city)s, %(zip)s, %(issue_date)s,
                  %(contractor_company)s, %(contractor_name)s, %(contractor_phone)s,
                  %(contractor_trade)s, %(declared_value)s)
                ON CONFLICT (source, permit_number) DO NOTHING
            """, p)
            ins += cur.rowcount
        conn.commit()
        total += ins
        print(f"[scraper] {src_fn.__name__}: {len(rows)} fetched, {ins} new")
    print(f"[scraper] total new: {total}")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
