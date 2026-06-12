#!/usr/bin/env python3
"""
Permit-moment bond outreach.
Daily: (1) queue new permit contractors from permit_issuances, (2) enrich up to
ENRICH_CAP with emails via Google Places -> website scrape, (3) email up to
SEND_CAP contractors a same-day bond offer referencing their fresh permit.
Cron: 0 7 * * 1-5  (after the 6:30 scraper)
"""
import json
import os
import re
import time
import urllib.parse
import urllib.request

import boto3
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
PLACES_KEY = os.environ["PLACES_KEY"]
ENRICH_CAP = 30
SEND_CAP = 30

DDL = """
CREATE TABLE IF NOT EXISTS permit_outreach (
  id SERIAL PRIMARY KEY,
  contractor_phone TEXT UNIQUE NOT NULL,
  company TEXT,
  city TEXT,
  sample_address TEXT,
  permit_type TEXT,
  issue_date DATE,
  email TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',          -- pending -> enriched|no_email -> emailed
  enriched_at TIMESTAMPTZ,
  emailed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
"""

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
SKIP_DOMAINS = {"example.com", "sentry.io", "wixpress.com", "squarespace.com",
                "shopify.com", "wordpress.com", "godaddy.com"}


def places_website(company, city):
    q = urllib.parse.quote(f"{company} {city} TX")
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={q}&key={PLACES_KEY}"
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            res = json.loads(r.read()).get("results", [])
        if not res:
            return None
        pid = res[0].get("place_id")
        det = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={pid}&fields=website&key={PLACES_KEY}"
        with urllib.request.urlopen(det, timeout=10) as r:
            return json.loads(r.read()).get("result", {}).get("website")
    except Exception:
        return None


def scrape_email(url):
    if not url:
        return None
    try:
        if not url.startswith("http"):
            url = "https://" + url
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=8) as r:
            html = r.read(60000).decode("utf-8", "ignore")
        for e in EMAIL_RE.findall(html):
            dom = e.split("@")[-1].lower()
            if dom not in SKIP_DOMAINS and not re.search(r"\.(png|jpg|gif|webp)$", dom):
                return e.lower()
    except Exception:
        return None
    return None


def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute(DDL)
    conn.commit()

    # 1. queue new contractors seen in the last 14 days
    cur.execute("""
        INSERT INTO permit_outreach (contractor_phone, company, city, sample_address, permit_type, issue_date)
        SELECT DISTINCT ON (contractor_phone) contractor_phone, contractor_company, city,
               address, permit_type, issue_date
        FROM permit_issuances
        WHERE contractor_phone <> '' AND contractor_company <> ''
          AND issue_date > CURRENT_DATE - 14
        ORDER BY contractor_phone, issue_date DESC
        ON CONFLICT (contractor_phone) DO NOTHING
    """)
    print(f"[outreach] queued {cur.rowcount} new contractors")
    conn.commit()

    # 1b. borrow emails we already have (contractors table phone match)
    cur.execute("""
        UPDATE permit_outreach po SET email = c.email, status = 'enriched', enriched_at = NOW()
        FROM contractors c
        WHERE po.status = 'pending' AND c.email <> ''
          AND regexp_replace(c.phone, '\\D', '', 'g') LIKE '%' || po.contractor_phone
    """)
    print(f"[outreach] matched {cur.rowcount} from contractors table")
    conn.commit()

    # 2. enrich
    cur.execute("SELECT id, company, city FROM permit_outreach WHERE status='pending' ORDER BY id LIMIT %s", (ENRICH_CAP,))
    found = 0
    for pid, company, city in cur.fetchall():
        email = scrape_email(places_website(company, city))
        if email:
            cur.execute("UPDATE permit_outreach SET email=%s, status='enriched', enriched_at=NOW() WHERE id=%s", (email, pid))
            found += 1
        else:
            cur.execute("UPDATE permit_outreach SET status='no_email', enriched_at=NOW() WHERE id=%s", (pid,))
        conn.commit()
        time.sleep(0.5)
    print(f"[outreach] enriched {found} new emails")

    # 3. send
    ses = boto3.client("ses", region_name="us-east-2",
                       aws_access_key_id=os.environ["QS_AWS_KEY"],
                       aws_secret_access_key=os.environ["QS_AWS_SECRET"])
    cur.execute("""
        SELECT po.id, po.company, po.city, po.sample_address, po.email
        FROM permit_outreach po
        WHERE po.status = 'enriched' AND po.email <> ''
          AND po.email NOT IN (SELECT email FROM unsubscribes)
        ORDER BY po.id LIMIT %s
    """, (SEND_CAP,))
    sent = 0
    for pid, company, city, address, email in cur.fetchall():
        first = company.split()[0].title() if company else "there"
        html = f"""
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937;padding:24px;">
  <p style="font-size:16px;line-height:1.6;">Hi {company.title()},</p>
  <p style="font-size:16px;line-height:1.6;">Congrats on the new permit at <strong>{address}, {city}</strong> — we watch
  Texas permit filings, and busy crews like yours are exactly who we work with.</p>
  <p style="font-size:16px;line-height:1.6;">Quantum Surety is a TDI-licensed Texas bond agency (License #3480229).
  If you need a <strong>city contractor registration bond, license bond, or bid/performance bond</strong> for an upcoming
  job, we issue most of them <strong>same day, online</strong> — certificate by email.</p>
  <p style="margin:26px 0;text-align:center;">
    <a href="https://quantumsurety.bond/get-bond?type=contractor&utm_source=permit-moment&utm_campaign=austin"
       style="background:#1e40af;color:#ffffff;padding:13px 30px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Get a Bond Quote — Same Day &rarr;</a>
  </p>
  <p style="font-size:16px;line-height:1.6;">Questions? Call <a href="tel:+12146668718" style="color:#1e40af;font-weight:bold;text-decoration:none;">(214) 666-8718</a> — answered 24/7.</p>
  <p style="font-size:13px;color:#6b7280;line-height:1.6;margin-top:22px;">Quantum Surety &middot; TDI #3480229 &middot; Wylie, TX<br/>
  <a href="https://quantumsurety.bond" style="color:#6b7280;">quantumsurety.bond</a></p>
  <p style="font-size:11px;color:#9ca3af;">You're receiving this one-time note because your company appears on a public
  permit record. <a href="https://quantumsurety.bond/api/unsubscribe?email={urllib.parse.quote(email)}" style="color:#9ca3af;">Unsubscribe</a></p>
</div>"""
        try:
            ses.send_email(
                Source='"Quantum Surety" <info@quantumsurety.bond>',
                Destination={"ToAddresses": [email]},
                Message={"Subject": {"Data": f"Saw your new {city} permit — same-day contractor bonds when you need them", "Charset": "UTF-8"},
                         "Body": {"Html": {"Data": html, "Charset": "UTF-8"}}},
            )
            cur.execute("UPDATE permit_outreach SET status='emailed', emailed_at=NOW() WHERE id=%s", (pid,))
            conn.commit()
            sent += 1
            time.sleep(0.3)
        except Exception as e:
            print(f"[outreach] send error {email}: {e}")
    print(f"[outreach] sent {sent} permit-moment emails")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
