#!/usr/bin/env python3
"""
RLI MyBondApp weekly report -> revenue ledger.
Fetches 'MyBondApp Weekly Report' emails from administrator@ (Zoho IMAP),
parses the .xls attachment, upserts revenue_events (idempotent by bond_no),
and marks matching CRM leads sold with the commission amount.
Cron: 0 6 * * 2  (Tuesdays 6 AM CT; reports arrive Monday evenings)
"""
import email
import imaplib
import os
import re
from datetime import datetime

import psycopg2
import xlrd


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
DB = dict(host="127.0.0.1", port=5433, dbname="quantum_surety",
          user="quantum_user", password=os.environ["CRM_DB_PASSWORD"])
IMAP_USER = "administrator@quantumsurety.bond"
IMAP_PASS = os.environ["ZOHO_ADMIN_APP_PASSWORD"]

DDL = """
CREATE TABLE IF NOT EXISTS revenue_events (
  id SERIAL PRIMARY KEY,
  bond_no TEXT UNIQUE NOT NULL,
  principal_name TEXT,
  email TEXT,
  phone TEXT,
  bond_type TEXT,
  coverage TEXT,
  bond_amount NUMERIC,
  premium NUMERIC,
  commission NUMERIC,
  effective_date DATE,
  expiry_date DATE,
  source TEXT DEFAULT 'rli_weekly',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
"""


def parse_xls(payload, results):
    wb = xlrd.open_workbook(file_contents=payload)
    sh = wb.sheet_by_index(0)
    headers = [str(sh.cell_value(0, c)).strip() for c in range(sh.ncols)]
    col = {h: i for i, h in enumerate(headers)}

    def cell(r, name):
        i = col.get(name)
        return sh.cell_value(r, i) if i is not None else ""

    def num(v):
        try:
            return round(float(v), 2)
        except (TypeError, ValueError):
            return None

    def xdate(v):
        try:
            return xlrd.xldate_as_datetime(float(v), wb.datemode).date().isoformat()
        except Exception:
            return None

    for r in range(1, sh.nrows):
        bond_no = str(cell(r, "BondNo")).strip()
        if not bond_no:
            continue
        results[bond_no] = dict(
            bond_no=bond_no,
            principal_name=str(cell(r, "PrincipalName")).strip(),
            email=str(cell(r, "EmailAddress")).strip().lower(),
            phone=re.sub(r"\D", "", str(cell(r, "PhoneNumber"))),
            bond_type=str(cell(r, "Description")).strip(),
            coverage=str(cell(r, "TypeofBondCoverage")).strip(),
            bond_amount=num(cell(r, "BondAmount")),
            premium=num(cell(r, "TotalPremium")),
            commission=num(cell(r, "TotalCommission")),
            effective_date=xdate(cell(r, "EffectiveDate")),
            expiry_date=xdate(cell(r, "ExpiryDate")),
        )


def main():
    rows = {}
    m = imaplib.IMAP4_SSL("imap.zoho.com")
    m.login(IMAP_USER, IMAP_PASS)
    m.select("INBOX", readonly=True)
    typ, data = m.search(None, 'SUBJECT "MyBondApp Weekly Report"')
    ids = data[0].split()
    print(f"[rli-sync] {len(ids)} weekly report emails")
    for mid in ids:
        typ, md = m.fetch(mid, "(BODY.PEEK[])")
        msg = email.message_from_bytes(md[0][1])
        for part in msg.walk():
            if part.get_filename() and part.get_filename().lower().endswith(".xls"):
                try:
                    parse_xls(part.get_payload(decode=True), rows)
                except Exception as e:
                    print(f"[rli-sync] parse error {part.get_filename()}: {e}")
    m.logout()
    print(f"[rli-sync] {len(rows)} unique bonds parsed")

    conn = psycopg2.connect(**DB)
    cur = conn.cursor()
    cur.execute(DDL)
    inserted = 0
    for b in rows.values():
        cur.execute("""
            INSERT INTO revenue_events (bond_no, principal_name, email, phone, bond_type,
                coverage, bond_amount, premium, commission, effective_date, expiry_date)
            VALUES (%(bond_no)s, %(principal_name)s, %(email)s, %(phone)s, %(bond_type)s,
                %(coverage)s, %(bond_amount)s, %(premium)s, %(commission)s,
                %(effective_date)s, %(expiry_date)s)
            ON CONFLICT (bond_no) DO NOTHING
        """, b)
        inserted += cur.rowcount
    conn.commit()
    print(f"[rli-sync] {inserted} new revenue events")

    # Mark matching leads sold (email first, then phone, then exact name)
    cur.execute("""
        UPDATE leads l SET status='sold', sale_amount=r.commission, updated_at=NOW()
        FROM revenue_events r
        WHERE l.status <> 'sold' AND (
              (l.email <> '' AND r.email <> '' AND LOWER(l.email) = r.email)
           OR (l.phone <> '' AND r.phone <> '' AND regexp_replace(l.phone,'\\D','','g') = r.phone)
           OR (LOWER(TRIM(l.name)) = LOWER(TRIM(r.principal_name)) AND r.principal_name <> '')
        )
    """)
    print(f"[rli-sync] {cur.rowcount} leads marked sold")
    conn.commit()
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
