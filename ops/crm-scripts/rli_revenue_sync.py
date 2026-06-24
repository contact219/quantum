#!/usr/bin/env python3
"""
RLI MyBondApp weekly report -> revenue ledger.
Fetches 'MyBondApp Weekly Report' emails from administrator@ (Zoho IMAP),
parses the .xls attachment, upserts revenue_events (idempotent by bond_no),
marks matching CRM leads sold, and sends review-request emails (via SES)
for any newly inserted bonds whose email wasn't caught by the daily scraper.
Cron: 0 6 * * 2  (Tuesdays 6 AM CT; reports arrive Monday evenings)
"""
import email
import imaplib
import json
import os
import re
from datetime import datetime, timezone

import boto3
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

GOOGLE_REVIEW   = "https://g.page/r/CaL6vCTM_zl7EAE/review"
SES_FROM        = "Nice Shotwell-Sparks <nice.shotwell-sparks@quantumsurety.bond>"
SES_REPLY       = "nice.shotwell-sparks@quantumsurety.bond"
# Path to the seen-bonds list maintained by rli_review_trigger.cjs
SEEN_BONDS_FILE = "/var/www/bondverify/rli_seen_bonds.json"

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


def send_review_email(ses_client, bond_no, principal_name, recipient_email, bond_type):
    first = (principal_name or "there").split()[0].capitalize()
    bond_label = bond_type or "Texas Notary Bond"
    subject = f"Thanks for your bond, {first} — one quick favor"

    html = f"""<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;color:#1e293b;line-height:1.7;font-size:14px;">
  <p style="font-size:15px;">Hi {first},</p>
  <p>Thank you for choosing Quantum Surety for your {bond_label}. Your bond certificate was just issued — you're all set and protected.</p>
  <p>I have one small favor to ask. If the process was smooth and you'd recommend us, would you mind leaving a quick Google review? It takes about 60 seconds and makes a real difference for a small business like ours.</p>
  <p style="text-align:center;margin:32px 0;">
    <a href="{GOOGLE_REVIEW}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">Leave a Google Review &#9733;</a>
  </p>
  <p style="color:#475569;">Either way — it was a pleasure earning your business. If you ever need another bond or have questions, I'm always reachable at <a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> or just reply to this email.</p>
  <p style="margin-top:28px;">Warm regards,<br><strong>Nice Shotwell-Sparks</strong><br>
  <span style="color:#64748b;font-size:13px;">Quantum Surety LLC · TDI License #3480229<br>
  <a href="tel:+12146668718" style="color:#2563eb;">(214) 666-8718</a> · nice.shotwell-sparks@quantumsurety.bond</span></p>
  <div style="border-top:1px solid #e2e8f0;margin-top:24px;padding-top:14px;font-size:11px;color:#94a3b8;">
    Quantum Surety LLC · <a href="https://quantumsurety.bond" style="color:#94a3b8;">quantumsurety.bond</a>
  </div>
</div>"""

    text = (
        f"Hi {first},\n\nThank you for choosing Quantum Surety for your {bond_label}. "
        f"Your bond certificate was just issued — you're all set.\n\n"
        f"One small favor: if the process was smooth, would you mind leaving a quick Google review?\n\n"
        f"{GOOGLE_REVIEW}\n\n"
        f"Either way — pleasure earning your business.\n\n"
        f"Nice Shotwell-Sparks\nQuantum Surety LLC · TDI License #3480229\n(214) 666-8718 · nice.shotwell-sparks@quantumsurety.bond"
    )

    ses_client.send_email(
        Source=SES_FROM,
        Destination={"ToAddresses": [recipient_email]},
        ReplyToAddresses=[SES_REPLY],
        Message={
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {
                "Html": {"Data": html, "Charset": "UTF-8"},
                "Text": {"Data": text, "Charset": "UTF-8"},
            },
        },
        Tags=[{"Name": "campaign", "Value": "review-request-xls"}],
    )


def load_seen_bonds():
    """Load bond IDs already handled by the daily puppeteer scraper."""
    try:
        with open(SEEN_BONDS_FILE) as f:
            return set(json.load(f))
    except Exception:
        return set()


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
    newly_inserted = []
    for b in rows.values():
        cur.execute("""
            INSERT INTO revenue_events (bond_no, principal_name, email, phone, bond_type,
                coverage, bond_amount, premium, commission, effective_date, expiry_date)
            VALUES (%(bond_no)s, %(principal_name)s, %(email)s, %(phone)s, %(bond_type)s,
                %(coverage)s, %(bond_amount)s, %(premium)s, %(commission)s,
                %(effective_date)s, %(expiry_date)s)
            ON CONFLICT (bond_no) DO NOTHING
        """, b)
        if cur.rowcount:
            inserted += 1
            newly_inserted.append(b)
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

    # Send review emails for newly inserted bonds not already caught by the daily scraper
    if not newly_inserted:
        print("[rli-sync] no new bonds — skipping review emails")
        return

    seen_bonds = load_seen_bonds()
    ses_client = boto3.client(
        "ses",
        region_name="us-east-2",
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    )

    review_sent = 0
    for b in newly_inserted:
        if b["bond_no"] in seen_bonds:
            print(f"[rli-sync] {b['bond_no']} already handled by scraper — skipping review email")
            continue
        if not b.get("email"):
            print(f"[rli-sync] {b['bond_no']} has no email — skipping")
            continue
        try:
            send_review_email(ses_client, b["bond_no"], b["principal_name"], b["email"], b["bond_type"])
            print(f"[rli-sync] review email → {b['principal_name']} <{b['email']}>")
            review_sent += 1
            import time; time.sleep(0.9)
        except Exception as e:
            print(f"[rli-sync] review email error for {b['bond_no']}: {e}")

    print(f"[rli-sync] {review_sent} review email(s) sent via XLS backstop")


if __name__ == "__main__":
    main()
