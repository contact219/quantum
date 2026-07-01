#!/usr/bin/env python3
"""
qs_lead_gen_report.py
Sends a daily leads report for the MCP lead-gen agent to administrator@quantumsurety.bond.
Run after the agent completes, or standalone for a manual on-demand report.

Usage:
  python3 /usr/local/lead-gen/report.py            # last 24h
  python3 /usr/local/lead-gen/report.py --all      # all time totals
"""
import os, sys, json
from datetime import datetime, timedelta, timezone
import psycopg2
import boto3
from botocore.exceptions import ClientError

# ── Config ─────────────────────────────────────────────────────────────────
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
_load_env("/usr/local/lead-gen/.env")

DB_URL      = os.environ["CRM_DB_URL"]
SES_KEY     = os.environ["QS_AWS_KEY"]
SES_SECRET  = os.environ["QS_AWS_SECRET"]
FROM_ADDR   = "nice.shotwell-sparks@quantumsurety.bond"
TO_ADDR     = "administrator@quantumsurety.bond"
ALL_TIME    = "--all" in sys.argv

AGENT_SOURCES = ("tdlr_urgent_renewals", "gdn_urgent_renewals",
                 "craigslist-title", "txsos-new-filing")

SOURCE_LABELS = {
    "tdlr_urgent_renewals": "TDLR Contractor",
    "gdn_urgent_renewals":  "GDN Auto Dealer",
    "craigslist-title":     "Craigslist Title",
    "txsos-new-filing":     "TX SOS New Filing",
}

BOND_COLORS = {
    "contractor": "#1e40af",
    "dealer":     "#92400e",
    "title":      "#065f46",
    "notary":     "#4c1d95",
}

# ── DB helpers ──────────────────────────────────────────────────────────────
def fetch_leads(since_dt=None):
    conn = psycopg2.connect(DB_URL)
    cur  = conn.cursor()
    if since_dt:
        cur.execute("""
            SELECT id, name, phone, email, bond_type, source, notes, created_at
            FROM   leads
            WHERE  source = ANY(%s)
              AND  created_at >= %s
            ORDER  BY created_at DESC
        """, (list(AGENT_SOURCES), since_dt))
    else:
        cur.execute("""
            SELECT id, name, phone, email, bond_type, source, notes, created_at
            FROM   leads
            WHERE  source = ANY(%s)
            ORDER  BY created_at DESC
            LIMIT  500
        """, (list(AGENT_SOURCES),))
    rows = cur.fetchall()
    cols = [d[0] for d in cur.description]
    conn.close()
    return [dict(zip(cols, r)) for r in rows]

def fetch_totals():
    conn = psycopg2.connect(DB_URL)
    cur  = conn.cursor()
    cur.execute("""
        SELECT source, bond_type, COUNT(*) AS n
        FROM   leads
        WHERE  source = ANY(%s)
        GROUP  BY source, bond_type
        ORDER  BY n DESC
    """, (list(AGENT_SOURCES),))
    rows = cur.fetchall()
    conn.close()
    return rows

# ── HTML builder ────────────────────────────────────────────────────────────
def build_html(leads, totals, since_label):
    total = len(leads)
    by_type = {}
    for l in leads:
        by_type[l["bond_type"]] = by_type.get(l["bond_type"], 0) + 1

    stat_cards = ""
    for bt, n in sorted(by_type.items(), key=lambda x: -x[1]):
        color = BOND_COLORS.get(bt, "#374151")
        stat_cards += f"""
        <div style="background:{color};color:#fff;padding:16px 24px;border-radius:8px;
                    display:inline-block;margin:6px;min-width:130px;text-align:center;">
          <div style="font-size:32px;font-weight:700;">{n}</div>
          <div style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;">{bt}</div>
        </div>"""

    rows_html = ""
    for l in leads[:100]:  # cap table at 100 rows
        bt    = l.get("bond_type") or ""
        color = BOND_COLORS.get(bt, "#374151")
        src   = SOURCE_LABELS.get(l.get("source",""), l.get("source",""))
        phone = l.get("phone") or "—"
        email = l.get("email") or "—"
        notes = (l.get("notes") or "")[:80]
        ts    = l["created_at"].strftime("%m/%d %I:%M %p") if l.get("created_at") else ""
        rows_html += f"""
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:8px 10px;font-weight:600;">{l.get("name","")[:40]}</td>
          <td style="padding:8px 10px;">{phone}</td>
          <td style="padding:8px 10px;color:#6b7280;font-size:13px;">{email}</td>
          <td style="padding:8px 10px;">
            <span style="background:{color};color:#fff;padding:2px 8px;border-radius:12px;
                         font-size:11px;font-weight:600;">{bt.upper()}</span>
          </td>
          <td style="padding:8px 10px;font-size:13px;color:#6b7280;">{src}</td>
          <td style="padding:8px 10px;font-size:12px;color:#9ca3af;">{notes}</td>
          <td style="padding:8px 10px;font-size:12px;color:#9ca3af;white-space:nowrap;">{ts}</td>
        </tr>"""

    all_time_rows = ""
    for src, bt, n in totals:
        color = BOND_COLORS.get(bt, "#374151")
        lbl   = SOURCE_LABELS.get(src, src)
        all_time_rows += f"""
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:6px 10px;">{lbl}</td>
          <td style="padding:6px 10px;">
            <span style="background:{color};color:#fff;padding:2px 8px;border-radius:12px;
                         font-size:11px;font-weight:600;">{(bt or "?").upper()}</span>
          </td>
          <td style="padding:6px 10px;font-weight:700;">{n}</td>
        </tr>"""

    overflow_note = (f'<p style="color:#6b7280;font-size:13px;">'
                     f'Showing first 100 of {total} leads.</p>') if total > 100 else ""

    now_str = datetime.now().strftime("%B %d, %Y %I:%M %p CDT")

    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
             background:#f9fafb;margin:0;padding:20px;">
<div style="max-width:900px;margin:0 auto;">

  <div style="background:#1e3a5f;color:#fff;padding:24px 32px;border-radius:10px 10px 0 0;">
    <h1 style="margin:0;font-size:22px;">Quantum Surety — Lead Gen Report</h1>
    <p style="margin:6px 0 0;color:#93c5fd;font-size:14px;">{since_label} &nbsp;|&nbsp; Generated {now_str}</p>
  </div>

  <div style="background:#fff;padding:24px 32px;border-bottom:1px solid #e5e7eb;">
    <div style="text-align:center;">{stat_cards}</div>
    <p style="text-align:center;color:#6b7280;font-size:14px;margin:12px 0 0;">
      <strong style="font-size:20px;color:#111;">{total}</strong> new leads inserted
    </p>
  </div>

  <div style="background:#fff;padding:24px 32px;border-bottom:1px solid #e5e7eb;">
    <h2 style="font-size:16px;margin:0 0 12px;color:#111;">Leads {since_label}</h2>
    {overflow_note}
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f3f4f6;text-align:left;">
          <th style="padding:8px 10px;">Name / Business</th>
          <th style="padding:8px 10px;">Phone</th>
          <th style="padding:8px 10px;">Email</th>
          <th style="padding:8px 10px;">Bond Type</th>
          <th style="padding:8px 10px;">Source</th>
          <th style="padding:8px 10px;">Notes</th>
          <th style="padding:8px 10px;">Time</th>
        </tr>
      </thead>
      <tbody>{rows_html}</tbody>
    </table>
    {'<p style="color:#9ca3af;font-size:13px;margin-top:8px;">No leads in this window.</p>' if not leads else ''}
  </div>

  <div style="background:#fff;padding:24px 32px;border-radius:0 0 10px 10px;">
    <h2 style="font-size:16px;margin:0 0 12px;color:#111;">All-Time Totals by Source</h2>
    <table style="width:50%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:6px 10px;text-align:left;">Source</th>
          <th style="padding:6px 10px;text-align:left;">Type</th>
          <th style="padding:6px 10px;text-align:left;">Total</th>
        </tr>
      </thead>
      <tbody>{all_time_rows}</tbody>
    </table>
  </div>

  <p style="color:#9ca3af;font-size:12px;margin-top:16px;text-align:center;">
    Quantum Surety MCP Lead Gen Agent &nbsp;|&nbsp; 192.168.4.122:/usr/local/lead-gen/
  </p>
</div>
</body></html>"""

# ── SES send ────────────────────────────────────────────────────────────────
def send_email(subject, html_body):
    ses = boto3.client(
        "ses",
        region_name="us-east-2",
        aws_access_key_id=SES_KEY,
        aws_secret_access_key=SES_SECRET,
    )
    ses.send_email(
        Source=FROM_ADDR,
        Destination={"ToAddresses": [TO_ADDR]},
        Message={
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body":    {"Html": {"Data": html_body, "Charset": "UTF-8"}},
        },
    )
    print(f"Sent to {TO_ADDR}: {subject}")

# ── Main ────────────────────────────────────────────────────────────────────
def main():
    if ALL_TIME:
        since_dt    = None
        since_label = "All Time"
        subj_period = "All-Time"
    else:
        since_dt    = datetime.now(timezone.utc) - timedelta(hours=24)
        since_label = "Last 24 Hours"
        subj_period = datetime.now().strftime("%b %d")

    leads  = fetch_leads(since_dt)
    totals = fetch_totals()

    print(f"Leads ({since_label}): {len(leads)}")
    for l in leads[:5]:
        print(f"  [{l['bond_type']}] {l['name']} | {l.get('phone','—')} | {l.get('source','')}")
    if len(leads) > 5:
        print(f"  ... and {len(leads)-5} more")

    html = build_html(leads, totals, since_label)
    subject = f"[QS Lead Gen] {len(leads)} New Leads — {subj_period}"
    send_email(subject, html)

if __name__ == "__main__":
    main()
