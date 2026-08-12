#!/usr/bin/env python3
"""
Cron health check — Quantum Surety ops VPS (130.51.22.226)

Built 2026-07-21 after four scheduled jobs were found dead for ~4 weeks. The
June 24 migration off 192.168.4.122 broke them in two ways that both looked
identical from the outside: the job ran on schedule, exited nonzero, and wrote
its complaint into a log nobody read.

Two failure modes, both checked here:
  STALE  — log has not been written inside the job's expected window
           (job isn't running at all, or its log was cleaned out of /tmp)
  ERROR  — log's recent output matches a known failure signature
           (ETIMEDOUT / can't open file / Traceback / etc.)

Emails only when something is wrong, plus a full all-clear digest on Mondays.
Silence on Tue-Sun means everything is healthy; a Monday with no email at all
means THIS script has died, which is the one gap a self-check cannot close.

Cron (11am CDT = 16:00 UTC daily, after the morning jobs have all finished):
  0 16 * * *  python3 /usr/local/bin/cron_health_check.py >> /var/log/cron-health.log 2>&1
"""
import os, time, json, datetime, boto3

# Byte offset per log, so each run inspects ONLY output written since the last
# check. Without this, an error line stays in the tail forever and the job keeps
# alerting long after it was fixed — the check would cry wolf until you stopped
# reading it, which is exactly how the June 24 breakage survived four weeks.
STATE_FILE = "/var/lib/quantum-ops/cron_health_offsets.json"

# Credentials come from the environment only -- never hardcoded, so this file
# is safe to track in the public repo. The cron entry supplies both; AWS_* are
# accepted as aliases to match voice_line_health.py and crm_api_health.py.
SES_KEY    = os.environ.get("SES_KEY") or os.environ.get("AWS_ACCESS_KEY_ID", "")
SES_SECRET = os.environ.get("SES_SECRET") or os.environ.get("AWS_SECRET_ACCESS_KEY", "")
SES_REGION = "us-east-2"
ALERT_TO   = "contact219@gmail.com"
ALERT_FROM = "Quantum Surety Ops <nice.shotwell-sparks@quantumsurety.bond>"

HOURS = 3600

# Error signatures. Case-insensitive substring match against the log tail.
ERROR_SIGS = [
    "etimedout",              # stale DB host (the June 24 breakage)
    "can't open file",        # cron pointing at a deleted /tmp script
    "econnrefused",
    "traceback (most recent",
    "authentication failed",
    "password authentication",
    "command not found",
    "no such file or directory",
    "modulenotfounderror",
    "cannot find module",
    "access denied",
]

# Lines matching these are noise, not failures — checked before ERROR_SIGS.
IGNORE_SIGS = [
    "deprecationwarning",
    "pythondeprecationwarning",
    "nodeversionsupportwarning",
    "will no longer support",
    "will require node",
    "more information can be found",
    "trace-warnings",
    "warnings.warn",
]

# (label, log path, max age in hours before STALE)
# Weekday-only jobs get 80h so a normal weekend gap never alerts.
# Weekly jobs get 8 days.
JOBS = [
    ("Neon lead sync (hourly)",        "/tmp/neon_sync.log",               3),
    ("Drip auto-pipeline (2x daily)",  "/root/crm-autopipeline.log",      26),
    ("Sale alert monitor (30 min)",    "/tmp/sale_alert_monitor.log",      2),
    ("Daily leads report",             "/tmp/daily_report.log",           26),
    ("Daily revenue report",           "/tmp/daily_revenue_report.log",   26),
    ("Bookkeeping status sync",        "/tmp/bk-status-sync.log",         26),
    ("Bookkeeping revenue report",     "/tmp/bk-revenue-report.log",      26),
    ("Recurring expenses",             "/tmp/recurring-expenses.log",     26),
    ("MyBondApp sync + enrich",        "/var/log/mybondapp-sync.log",     26),
    # Review requests (send_review_ask.cjs) recronned 2026-07-30, weekly
    # (Mon 10:30am CDT) -- was fully offline since before 07-21, and separately
    # was pointed at the retired 192.168.4.122 host, so it had never actually
    # run successfully post-migration. Fixed host to localhost and widened the
    # "don't review a bond that never delivered" guard from cancelled-only to
    # any non-issued/expired status (a pre-cron dry-run caught it about to ask
    # three people with abandoned/saved bonds for a review).
    ("Review requests (weekly, Mon)",  "/tmp/review-ask.log",            192),
    # RLI revenue sync recronned 2026-08-07: was writing revenue_events + marking
    # leads sold, but had been missing from crontab entirely since the June 24
    # migration -- ran once on 2026-06-12 and never again, frozen for ~2 months
    # with nothing here to catch it. Weekly Tue 11:00 UTC (6am CT).
    ("RLI revenue sync (weekly, Tue)", "/tmp/rli-revenue-sync.log",      192),
    ("Weekly report (Sat)",            "/tmp/weekly_report.log",         192),
    ("Auto-followup (M-F)",            "/tmp/crm-daily-followup.log",     80),
    ("Morning call list (M-F)",        "/tmp/morning-calllist.log",       80),
    ("Lead-gen agent (M-F)",           "/var/log/qs-lead-gen.log",        80),
    ("ESBD commercial monitor (M-F)",  "/tmp/esbd_commercial.log",        80),
    ("Notary wave (M-F)",              "/tmp/notary-wave.log",            80),
    ("Hub contractor blast (M-F)",     "/tmp/hub-contractor-blast.log",   80),
    ("GDN bond blast (M-F)",           "/tmp/gdn-blast.log",              80),
    # "Saved bond recovery" removed 2026-07-30: both saved_bond_recovery.cjs and
    # .._v2.cjs were commented out of crontab on 2026-07-27 (0/39 email
    # conversion, replaced by phone outreach -- see call sheet from that date).
    # Re-add here if a saved-bond email path is ever recronned.
    ("Abandoned bond recovery (M-F)",  "/tmp/abandoned-bond-recovery.log",80),
    # crm-api tunnel probe, added 2026-08-10. Runs 2x daily; 26h window.
    ("crm-api health (2x daily)",     "/var/log/crm-api-health.log",     26),
    ("Re-engagement blast (Mon)",      "/tmp/crm-reengagement.log",      192),
    ("Inbound second touch (Mon)",     "/tmp/inbound-second-touch.log",  192),
    ("TDLR renewal target (Mon)",      "/tmp/tdlr_renewal.log",          192),
]

MAX_READ = 200_000  # cap per log, in case something spews


def load_offsets():
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except Exception:
        return {}


def save_offsets(offsets):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(offsets, f, indent=1)


def read_since(path, offsets):
    """Return log content written since the last check, updating the offset.

    First time a log is seen we record its size and return nothing — we have no
    way to date pre-existing lines, so we baseline from now rather than alert on
    history. A job that is genuinely dead still gets caught by the staleness
    check, which reads mtime and does not care about content.
    """
    size = os.path.getsize(path)
    prev = offsets.get(path)

    if prev is None:
        offsets[path] = size
        return ""

    if prev > size:          # log was rotated or truncated
        prev = 0

    with open(path, "rb") as f:
        f.seek(prev)
        data = f.read(MAX_READ)

    offsets[path] = size
    return data.decode("utf-8", "replace")


def check(label, path, max_age_h, offsets):
    """Return (state, detail). state is OK | STALE | ERROR | MISSING."""
    if not os.path.exists(path):
        return "MISSING", "log file does not exist — job has likely never run since last cleanup"

    age_h = (time.time() - os.path.getmtime(path)) / HOURS
    body  = read_since(path, offsets)

    # Error signatures win over staleness: a job writing errors on schedule is
    # worse than one that is merely late, and reporting it as STALE would hide why.
    for line in reversed(body.splitlines()):
        low = line.lower()
        if not low.strip():
            continue
        if any(s in low for s in IGNORE_SIGS):
            continue
        if any(s in low for s in ERROR_SIGS):
            return "ERROR", line.strip()[:200]

    if age_h > max_age_h:
        return "STALE", f"last wrote {age_h:.1f}h ago (expected within {max_age_h}h)"

    return "OK", f"last wrote {age_h:.1f}h ago"


def main():
    offsets = load_offsets()
    results = [(label,) + check(label, path, age, offsets) for label, path, age in JOBS]
    save_offsets(offsets)
    bad = [r for r in results if r[1] != "OK"]

    is_monday = datetime.datetime.now().weekday() == 0
    if not bad and not is_monday:
        print(f"[{datetime.datetime.now().isoformat()}] All {len(results)} jobs healthy. No email sent.")
        return

    COLORS = {"OK": "#166534", "STALE": "#b45309", "ERROR": "#b91c1c", "MISSING": "#b91c1c"}
    BGS    = {"OK": "#f0fdf4", "STALE": "#fffbeb", "ERROR": "#fef2f2", "MISSING": "#fef2f2"}

    def row(label, state, detail):
        return f"""<tr style="border-bottom:1px solid #e2e8f0;background:{BGS[state]}">
      <td style="padding:9px 12px;font-size:13px;font-weight:600;color:#0f172a">{label}</td>
      <td style="padding:9px 12px;font-size:12px;font-weight:800;color:{COLORS[state]}">{state}</td>
      <td style="padding:9px 12px;font-size:12px;color:#475569;font-family:ui-monospace,monospace">{detail}</td>
    </tr>"""

    shown  = results if is_monday else bad
    n_bad  = len(bad)
    banner = "#b91c1c" if n_bad else "#166534"
    headline = (f"{n_bad} job needs attention" if n_bad == 1
                else f"{n_bad} jobs need attention") if n_bad else "All jobs healthy"

    html = f"""<div style="font-family:-apple-system,sans-serif;max-width:720px;margin:0 auto;padding:24px;background:#fff">
  <div style="background:{banner};border-radius:10px;padding:18px 24px;margin-bottom:18px">
    <p style="margin:0;color:#fff;opacity:.75;font-size:11px;letter-spacing:2px">QUANTUM SURETY — CRON HEALTH</p>
    <p style="margin:5px 0 0;color:#fff;font-size:22px;font-weight:800">{headline}</p>
    <p style="margin:4px 0 0;color:#fff;opacity:.75;font-size:12px">{len(results)} scheduled jobs checked · {datetime.datetime.now().strftime('%A, %B %-d')}</p>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:#f1f5f9">
      <th style="text-align:left;padding:8px 12px;font-size:11px;color:#475569">JOB</th>
      <th style="text-align:left;padding:8px 12px;font-size:11px;color:#475569">STATE</th>
      <th style="text-align:left;padding:8px 12px;font-size:11px;color:#475569">DETAIL</th>
    </tr></thead>
    <tbody>{''.join(row(*r) for r in shown)}</tbody>
  </table>
  <p style="color:#64748b;font-size:12px;margin-top:16px">
    <strong>STALE</strong> = the job has not written to its log inside the expected window; it may not be running at all.<br>
    <strong>ERROR</strong> = the job ran but its recent output matches a known failure signature.<br>
    <strong>MISSING</strong> = the log file is gone entirely — usually cron pointing at a deleted script.
  </p>
  <p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:16px">
    Alerts fire only when something is wrong. A full digest goes out every Monday —
    if a Monday passes with no email at all, this health check itself has stopped.<br>
    /usr/local/bin/cron_health_check.py on 130.51.22.226
  </p>
</div>"""

    text_lines = "\n".join(f"  [{s}] {l} — {d}" for l, s, d in shown)
    text = f"QUANTUM SURETY — CRON HEALTH\n{headline} ({len(results)} jobs checked)\n\n{text_lines}\n"

    subject = f"{'⚠️' if n_bad else '✅'} Cron health: {headline} — {datetime.datetime.now().strftime('%a %b %-d')}"

    # A health monitor that cannot alert fails the same way the outages it
    # watches for fail: quietly, while appearing fine. Say so and exit non-zero
    # rather than let a missing credential look like a clean run.
    if not SES_KEY or not SES_SECRET:
        print("[FATAL] SES_KEY/SES_SECRET not set - cannot send the alert below.")
        print("        Findings were still computed and are printed here:")
        print(text)
        raise SystemExit(1)

    ses = boto3.client("ses", region_name=SES_REGION,
                       aws_access_key_id=SES_KEY, aws_secret_access_key=SES_SECRET)
    ses.send_email(
        Source=ALERT_FROM,
        Destination={"ToAddresses": [ALERT_TO]},
        Message={"Subject": {"Data": subject},
                 "Body": {"Html": {"Data": html}, "Text": {"Data": text}}},
    )
    print(f"[{datetime.datetime.now().isoformat()}] Sent: {subject}")
    for l, s, d in bad:
        print(f"  [{s}] {l} — {d}")


if __name__ == "__main__":
    main()
