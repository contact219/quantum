#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
crm-api tunnel health monitor — Quantum Surety.

WHY: crm-api.permitpilot.online is the domain baked into every drip email's
open-tracking pixel and click-through link. It returned 502 from the 2026-06-24
VPS migration until 2026-08-07 -- six weeks -- and nobody noticed, because
nothing watched it. It was found only when a weekly report showed an empty
email funnel. Every open and click in that window is gone.

The failure is invisible from the CRM UI: the app works fine, campaigns send
fine, and only the tracking callbacks break. So this checks the callback path
specifically, from outside.

PROBE: GET /health on the CRM backend -- a read-only route that returns
{"status":"ok"} and touches no table.

Do NOT probe /api/tracking/open or /api/tracking/click. Those are the real
tracking endpoints and they INSERT a row into email_events for whatever they
receive; a health check pointed at them slowly poisons open-rate reporting with
synthetic events. That happened once during the 2026-08-10 verification and the
row had to be deleted by hand.

ALERTS (email to administrator@) when:
  CRITICAL - /health is unreachable or does not return HTTP 200
  CRITICAL - the tunnel systemd unit is not active

Dedupes via a state file so a sustained outage pages once a day, not every run.
"""
import json
import os
import subprocess
import time
import urllib.request
import urllib.error

URL     = "https://crm-api.permitpilot.online/health"
UNIT    = "cloudflared-crm"
TIMEOUT = 20

SES_KEY    = os.environ.get("SES_KEY") or os.environ.get("AWS_ACCESS_KEY_ID", "")
SES_SECRET = os.environ.get("SES_SECRET") or os.environ.get("AWS_SECRET_ACCESS_KEY", "")
TO    = "administrator@quantumsurety.bond"
FROM  = "alerts@quantumsurety.bond"
STATE = "/var/lib/quantum-ops/crm_api_health.json"


def load_state():
    try:
        with open(STATE) as f:
            return json.load(f)
    except Exception:
        return {}


def save_state(s):
    os.makedirs(os.path.dirname(STATE), exist_ok=True)
    with open(STATE, "w") as f:
        json.dump(s, f)


def send_alert(subject, body):
    try:
        import boto3
        boto3.client("ses", region_name="us-east-2",
                     aws_access_key_id=SES_KEY,
                     aws_secret_access_key=SES_SECRET).send_email(
            Source=FROM, Destination={"ToAddresses": [TO]},
            Message={"Subject": {"Data": subject},
                     "Body": {"Text": {"Data": body}}})
        print("[alert] sent:", subject)
    except Exception as e:
        print("[alert] SEND FAILED:", e)
        print(subject)
        print(body)


def unit_active():
    try:
        r = subprocess.run(["systemctl", "is-active", UNIT],
                           capture_output=True, text=True, timeout=15)
        return r.stdout.strip() == "active", r.stdout.strip()
    except Exception as e:
        return False, "check failed: %s" % e


def main():
    problems = []

    # 1. The tunnel process itself. Checked first because if it is down, the
    #    HTTP failure below is a symptom and this is the cause.
    ok, state = unit_active()
    if ok:
        print("[ok] %s active" % UNIT)
    else:
        problems.append(
            "CRITICAL: the %s systemd unit is '%s', not active. The tunnel that "
            "serves crm-api.permitpilot.online is not running, so every drip email "
            "tracking pixel and click-through is dead.\n"
            "  systemctl status %s\n  systemctl restart %s" % (UNIT, state, UNIT, UNIT))

    # 2. End-to-end: does the hostname actually reach the backend? This is the
    #    real test -- on 2026-08-07 the tunnel ran fine while a stale non-tunnel
    #    DNS record kept traffic from ever reaching it, so a live process is not
    #    sufficient evidence.
    try:
        req = urllib.request.Request(URL, headers={"User-Agent": "qs-health/1.0"})
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            code = r.getcode()
            body = r.read(200).decode("utf-8", "replace").strip()
        if code == 200:
            print("[ok] %s -> %s %s" % (URL, code, body))
        else:
            problems.append("CRITICAL: %s returned HTTP %s (expected 200). Body: %s"
                            % (URL, code, body))
    except urllib.error.HTTPError as e:
        problems.append(
            "CRITICAL: %s returned HTTP %s.\n\nThis is how the June-August 2026 outage "
            "looked: the CRM itself works, campaigns still send, but every open and "
            "click goes unrecorded. Check the tunnel AND the DNS record -- in that "
            "incident an orphaned tunnel and a stale plain A record were both wrong, "
            "and fixing only one did nothing." % (URL, e.code))
    except Exception as e:
        problems.append(
            "CRITICAL: %s is unreachable: %s\n\nDrip email open/click tracking is "
            "dead while this persists." % (URL, e))

    if not problems:
        print("[ok] crm-api healthy")
        st = load_state()
        st.pop("last_alert_day", None)
        save_state(st)
        return

    today = time.strftime("%Y-%m-%d")
    st = load_state()
    if st.get("last_alert_day") == today:
        print("[skip] already alerted today")
        for p in problems:
            print("  " + p.splitlines()[0])
        return
    st["last_alert_day"] = today
    save_state(st)

    send_alert("crm-api tracking domain — attention needed",
               "\n\n".join(problems) +
               "\n\n--\nAutomated check on crm-api.permitpilot.online, the drip email "
               "open/click tracking domain. Runs 2x daily on the CRM VPS.\n"
               "/usr/local/bin/crm_api_health.py")


if __name__ == "__main__":
    main()
