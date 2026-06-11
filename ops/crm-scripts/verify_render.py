#!/usr/bin/env python3
"""Simulate drip.js send-time rendering (interpolation + click-link wrapping)
for any set of campaigns. Run before trusting body edits — catches unrendered
{{variables}} and broken/untracked links without sending anything.

Usage: verify_render.py [id id ...]   (defaults to the notary campaign set)
"""
import os
import re
import sys

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
DB = dict(host="127.0.0.1", port=5433, dbname="quantum_surety",
          user="quantum_user", password=os.environ["CRM_DB_PASSWORD"])

VARS = {
    "{{first_name}}": "Maria", "{{name}}": "Maria Garcia",
    "{{expire_date}}": "September 15, 2026",
    "{{surety_company}}": "Western Surety Company c/o CNA",
    "{{unsubscribe_url}}": "https://quantumsurety.bond/api/unsubscribe?email=t",
    "{{verify_url}}": "https://verify.quantumsurety.bond/verify/notary/123",
}

def render(body, drip_id):
    for k, v in VARS.items():
        body = body.replace(k, v)
    # replicate drip.js universal link wrapper
    def wrap(m):
        u = m.group(1)
        if "/unsubscribe" in u or "/api/tracking/" in u:
            return m.group(0)
        return f'href="https://crm-api.permitpilot.online/api/tracking/click?drip={drip_id}&url={u}"'
    return re.sub(r'href="(https?://[^"]+)"', wrap, body)

DEFAULT_IDS = [2, 3, 5, 8, 11, 12, 13, 14, 15, 39, 40, 46, 51, 54, 55, 56, 57, 58, 59, 60]
IDS = [int(a) for a in sys.argv[1:]] or DEFAULT_IDS

conn = psycopg2.connect(**DB)
cur = conn.cursor()
problems = 0
for cid in IDS:
    cur.execute("SELECT body FROM drip_schedules WHERE id=%s", (cid,))
    row = cur.fetchone()
    if not row:
        print(f"#{cid}: NOT FOUND")
        problems += 1
        continue
    html = render(row[0], cid)
    untracked = [u for u in re.findall(r'href="(https?://[^"]+)"', html)
                 if "/api/tracking/" not in u and "/unsubscribe" not in u]
    leftover_vars = re.findall(r"\{\{\w+\}\}", html)
    ok = not untracked and not leftover_vars
    if not ok:
        problems += 1
    print(f"#{cid}: untracked-links={untracked or 'none'} unrendered-vars={leftover_vars or 'none'} -> {'OK' if ok else 'PROBLEM'}")
print(f"\n{len(IDS) - problems}/{len(IDS)} campaigns render correctly")
cur.close(); conn.close()
