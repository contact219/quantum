#!/usr/bin/env python3
"""
Quantum Surety daily report — rebuilt 2026-06-10 (original lost to /tmp cleanup).
Leads, email activity, and outbound AI call stats for the last 24h.
Runs daily 8 AM via cron. Sends via AWS SES.
"""

import json
import os
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

DB = dict(host="127.0.0.1", port=5433, dbname="quantum_surety",
          user="quantum_user", password=os.environ["CRM_DB_PASSWORD"])

SES_REGION = "us-east-2"
AWS_KEY    = os.environ["QS_AWS_KEY"]
AWS_SECRET = os.environ["QS_AWS_SECRET"]
FROM_EMAIL = "nice.shotwell-sparks@quantumsurety.bond"
TO_EMAILS  = ["contact219@gmail.com"]

OUTBOUND_STATS_URL = ("https://voice-agent.permitpilot.online/outbound-stats"
                      "?secret=" + os.environ.get("OUTBOUND_SECRET", ""))


def q(cur, sql, params=()):
    cur.execute(sql, params)
    return cur.fetchall()


def fetch_outbound_stats():
    try:
        with urllib.request.urlopen(OUTBOUND_STATS_URL, timeout=20) as r:
            return json.loads(r.read())
    except Exception as e:
        return {"error": str(e)}


def main():
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    total_leads   = q(cur, "SELECT COUNT(*) FROM leads")[0][0]
    new_24h       = q(cur, "SELECT COUNT(*) FROM leads WHERE created_at > NOW() - INTERVAL '24 hours'")[0][0]
    by_source     = q(cur, """SELECT COALESCE(source,'(none)'), COUNT(*) FROM leads
                              WHERE created_at > NOW() - INTERVAL '24 hours'
                              GROUP BY 1 ORDER BY 2 DESC LIMIT 10""")
    by_type       = q(cur, """SELECT COALESCE(bond_type,'(none)'), COUNT(*) FROM leads
                              WHERE created_at > NOW() - INTERVAL '24 hours'
                              GROUP BY 1 ORDER BY 2 DESC LIMIT 10""")
    by_status     = q(cur, "SELECT status, COUNT(*) FROM leads GROUP BY 1 ORDER BY 2 DESC")
    email_24h     = q(cur, """SELECT event_type, COUNT(*) FROM email_events
                              WHERE created_at > NOW() - INTERVAL '24 hours'
                              GROUP BY 1 ORDER BY 2 DESC""")
    followups_24h = q(cur, """SELECT COUNT(*) FROM lead_activity
                              WHERE action='followup_email_sent'
                              AND created_at > NOW() - INTERVAL '24 hours'""")[0][0]

    ob = fetch_outbound_stats()

    # Revenue scoreboard (from RLI weekly report sync -> revenue_events)
    rev_mtd  = q(cur, """SELECT COALESCE(SUM(commission),0), COUNT(*) FROM revenue_events
                         WHERE effective_date >= date_trunc('month', CURRENT_DATE)""")[0]
    rev_30d  = q(cur, """SELECT COALESCE(SUM(commission),0), COUNT(*) FROM revenue_events
                         WHERE effective_date > CURRENT_DATE - 30""")[0]
    rev_7d   = q(cur, """SELECT COALESCE(SUM(commission),0), COUNT(*) FROM revenue_events
                         WHERE effective_date > CURRENT_DATE - 7""")[0]
    TARGET = 20000.0
    pct = min(100.0, float(rev_mtd[0]) / TARGET * 100)

    def rows_html(rows):
        return "".join(
            f"<tr><td style='padding:4px 12px 4px 0;color:#555;'>{a}</td>"
            f"<td style='padding:4px 0;font-weight:600;'>{b}</td></tr>"
            for a, b in rows) or "<tr><td style='color:#999;'>none</td></tr>"

    if "error" in ob:
        ob_html = f"<p style='color:#b91c1c;'>Outbound stats unavailable: {ob['error']}</p>"
    else:
        days = ob.get("calls_by_day", [])
        today = days[0] if days else {"calls": 0, "seconds": 0, "cost_units": 0}
        mins = round(int(today.get("seconds", 0)) / 60, 1)
        queue = ", ".join(f"{r['status']}: {r['n']}" for r in ob.get("queue_by_status", [])) or "empty"
        ob_html = (
            f"<table style='font-size:14px;border-collapse:collapse;'>"
            f"<tr><td style='padding:4px 12px 4px 0;color:#555;'>Calls (latest day)</td><td style='font-weight:600;'>{today.get('calls', 0)} / cap {ob.get('daily_cap')}</td></tr>"
            f"<tr><td style='padding:4px 12px 4px 0;color:#555;'>Minutes</td><td style='font-weight:600;'>{mins}</td></tr>"
            f"<tr><td style='padding:4px 12px 4px 0;color:#555;'>Queue</td><td style='font-weight:600;'>{queue}</td></tr>"
            f"</table>")

    html = f"""
<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1f2937;">
  <h2 style="margin:0 0 4px;">Quantum Surety — Daily Report</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:13px;">Last 24 hours</p>

  <h3 style="margin:20px 0 8px;font-size:15px;">Revenue (commission, from RLI weekly reports)</h3>
  <table style="font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:4px 12px 4px 0;color:#555;">Month to date</td><td style="font-weight:600;">${float(rev_mtd[0]):,.2f} ({rev_mtd[1]} bonds)</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;">Last 7 days</td><td style="font-weight:600;">${float(rev_7d[0]):,.2f} ({rev_7d[1]} bonds)</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;">Last 30 days</td><td style="font-weight:600;">${float(rev_30d[0]):,.2f} ({rev_30d[1]} bonds)</td></tr>
  </table>
  <div style="margin:10px 0 0;max-width:420px;">
    <div style="font-size:12px;color:#6b7280;margin-bottom:3px;">Progress to $20,000/mo goal: {pct:.1f}%</div>
    <div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
      <div style="height:8px;width:{pct:.1f}%;background:#1e40af;border-radius:4px;"></div>
    </div>
  </div>

  <h3 style="margin:20px 0 8px;font-size:15px;">Leads</h3>
  <table style="font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:4px 12px 4px 0;color:#555;">New (24h)</td><td style="font-weight:600;">{new_24h}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;">Total all-time</td><td style="font-weight:600;">{total_leads}</td></tr>
  </table>
  <h4 style="margin:14px 0 4px;font-size:13px;color:#6b7280;">By source (24h)</h4>
  <table style="font-size:13px;border-collapse:collapse;">{rows_html(by_source)}</table>
  <h4 style="margin:14px 0 4px;font-size:13px;color:#6b7280;">By bond type (24h)</h4>
  <table style="font-size:13px;border-collapse:collapse;">{rows_html(by_type)}</table>
  <h4 style="margin:14px 0 4px;font-size:13px;color:#6b7280;">Pipeline status (all-time)</h4>
  <table style="font-size:13px;border-collapse:collapse;">{rows_html(by_status)}</table>

  <h3 style="margin:24px 0 8px;font-size:15px;">Email activity (24h)</h3>
  <table style="font-size:13px;border-collapse:collapse;">{rows_html(email_24h)}</table>
  <p style="font-size:13px;color:#555;margin:8px 0 0;">Lead follow-up emails sent: <strong>{followups_24h}</strong></p>

  <h3 style="margin:24px 0 8px;font-size:15px;">Outbound AI sales calls</h3>
  {ob_html}

  <p style="font-size:11px;color:#9ca3af;margin-top:28px;">Generated by /usr/local/bin/daily_report.py on 192.168.4.122</p>
</div>"""

    ses = boto3.client("ses", region_name=SES_REGION,
                       aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET)
    ses.send_email(
        Source=f'"Quantum Surety Reports" <{FROM_EMAIL}>',
        Destination={"ToAddresses": TO_EMAILS},
        Message={"Subject": {"Data": "Quantum Surety Daily Report", "Charset": "UTF-8"},
                 "Body": {"Html": {"Data": html, "Charset": "UTF-8"}}},
    )
    print("daily report sent")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
