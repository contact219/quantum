#!/usr/bin/env python3
"""One-off post-run check: did the SB693-bearing campaigns send today, and do
their bodies still carry the block? Emails a report, then removes its own cron."""
import os
import subprocess

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
IDS = [2, 3, 5, 8, 11, 12, 13, 14, 15, 39, 40, 46, 51, 54, 55, 56, 57, 58, 59, 60]

conn = psycopg2.connect(**DB)
cur = conn.cursor()

cur.execute("""
    SELECT s.drip_id, MAX(ds.name), COUNT(*)
    FROM notary_campaign_sends s JOIN drip_schedules ds ON ds.id = s.drip_id
    WHERE s.sent_at >= CURRENT_DATE AND s.status = 'sent' AND s.drip_id = ANY(%s)
    GROUP BY s.drip_id ORDER BY s.drip_id
""", (IDS,))
sends = cur.fetchall()

cur.execute("SELECT id FROM drip_schedules WHERE id = ANY(%s) AND body NOT ILIKE '%%sb693%%'", (IDS,))
missing_block = [r[0] for r in cur.fetchall()]

total = sum(r[2] for r in sends)
rows = "".join(
    f"<tr><td style='padding:4px 12px 4px 0;color:#555;'>#{i} {n}</td>"
    f"<td style='padding:4px 0;font-weight:600;'>{c}</td></tr>"
    for i, n, c in sends) or "<tr><td style='color:#b91c1c;'>NO SENDS RECORDED from SB693 campaigns today</td></tr>"
block_line = ("All campaign bodies still contain the SB693 block."
              if not missing_block else
              f"<span style='color:#b91c1c;'>WARNING: block missing from campaigns {missing_block}</span>")

html = f"""
<div style="font-family:Arial,sans-serif;max-width:620px;color:#1f2937;">
  <h2 style="margin:0 0 6px;">SB693 Drip Verification — first run after rollout</h2>
  <p style="margin:0 0 16px;color:#6b7280;font-size:13px;">Automatic one-time check, 12:30 PM CT</p>
  <p style="font-size:14px;">Total emails sent today by SB693-bearing campaigns: <strong>{total}</strong></p>
  <table style="font-size:13px;border-collapse:collapse;">{rows}</table>
  <p style="font-size:14px;margin-top:16px;">{block_line}</p>
  <p style="font-size:12px;color:#9ca3af;margin-top:20px;">Every email from these campaigns includes the SB693 callout
  (render-verified pre-send on June 11). Click stats on the SB693 blog link will appear in the Monday growth brief.</p>
</div>"""

ses = boto3.client("ses", region_name="us-east-2",
                   aws_access_key_id=os.environ["QS_AWS_KEY"],
                   aws_secret_access_key=os.environ["QS_AWS_SECRET"])
ses.send_email(
    Source='"Quantum Surety Reports" <nice.shotwell-sparks@quantumsurety.bond>',
    Destination={"ToAddresses": ["contact219@gmail.com"]},
    Message={"Subject": {"Data": "SB693 drip verification — sends confirmed" if sends and not missing_block
                                 else "SB693 drip verification — ATTENTION NEEDED", "Charset": "UTF-8"},
             "Body": {"Html": {"Data": html, "Charset": "UTF-8"}}},
)
print(f"report sent: {total} sends, missing_block={missing_block}")
cur.close(); conn.close()

# self-remove the one-off cron entry
current = subprocess.run(["crontab", "-l"], capture_output=True, text=True).stdout
cleaned = "\n".join(l for l in current.splitlines() if "SB693-VERIFY-ONEOFF" not in l) + "\n"
subprocess.run(["crontab", "-"], input=cleaned, text=True)
print("one-off cron removed")
