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
synthetic events. That happened once during the 2026-08-10 verification and
again on 2026-08-23, and both rows had to be deleted by hand.

This also checks quantumcrm.bond, the CRM dashboard. Note it does NOT go through
the tunnel: Caddy on this host terminates TLS on :443 and reverse-proxies to
localhost:8095. So a dashboard failure points at Caddy or the frontend container,
NOT at cloudflared. (crm.permitpilot.online briefly served the same dashboard via
the tunnel on 2026-08-22 and was retired the same day as redundant.)

Port 8095 is bound to loopback, so quantumcrm.bond is the only route in -- there
is no direct-IP fallback if it breaks.

AUTH MODEL (changed 2026-08-22, commit 4f83db8 in /usr/quantum-surety-crm):
nginx basic auth is GONE. The React shell at "/" is served to anyone (it is a
login page and contains no data); every /api/* route is gated by a JWT
middleware in backend/src/index.js (jwtGuard + PUBLIC_PATHS), and the only
unauthenticated /api paths are /api/auth/login, the tracking pixel/click, and
unsubscribe -- all of which must be public to work.

So the dashboard check is TWO probes, each two-sided:
  "/"          must be 200 -- anything else means Caddy/frontend is down.
  "/api/leads" with no credentials must be 401 -- a 200 means the JWT gate has
               been removed or bypassed and the lead database is public; a 5xx
               or timeout means the backend is down.
Until 2026-08-23 this script asserted the OLD model (401 at "/") and fired a
false "leads are public" CRITICAL the morning after basic auth was retired.
If the auth model changes again, change these assertions in the same commit.

/api/leads is safe to probe: the JWT middleware rejects the request before it
reaches the router, so nothing is read or written.

ALERTS (email to administrator@) when:
  CRITICAL - /health is unreachable or does not return HTTP 200
  CRITICAL - quantumcrm.bond/ does not return HTTP 200
  CRITICAL - quantumcrm.bond/api/leads returns anything but 401 without a token
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
DASH_URL    = "https://quantumcrm.bond/"
DASH_EXPECT = 200          # React login shell; see AUTH MODEL in module docstring
API_URL     = "https://quantumcrm.bond/api/leads"
API_EXPECT  = 401          # JWT gate must reject an unauthenticated request
UNIT    = "cloudflared-crm"
TUNNEL  = "quantum-crm"
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


def fetch(url):
    """GET url with no credentials. Returns (status_code, body_head) or raises
    on a transport-level failure. HTTP error statuses are returned, not raised."""
    req = urllib.request.Request(url, headers={"User-Agent": "qs-health/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.getcode(), r.read(200).decode("utf-8", "replace").strip()
    except urllib.error.HTTPError as e:
        try:
            body = e.read(200).decode("utf-8", "replace").strip()
        except Exception:
            body = ""
        return e.code, body


DASH_DOWN_HINT = (
    "Port 8095 is bound to loopback, so this hostname is the only way in and the "
    "CRM is unreachable for everyone while this persists.\n"
    "  systemctl status caddy\n"
    "  docker ps --filter name=qs-crm-frontend\n"
    "  curl -sI http://localhost:8095/\n"
    "Reach it meanwhile over SSH:\n"
    "  ssh -L 8095:localhost:8095 root@130.51.22.226   then http://localhost:8095")


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
        code, body = fetch(URL)
        if code == 200:
            print("[ok] %s -> %s %s" % (URL, code, body))
        else:
            problems.append(
                "CRITICAL: %s returned HTTP %s (expected 200). Body: %s\n\nThis is how "
                "the June-August 2026 outage looked: the CRM itself works, campaigns "
                "still send, but every open and click goes unrecorded. Check the tunnel "
                "AND the DNS record -- in that incident an orphaned tunnel and a stale "
                "plain A record were both wrong, and fixing only one did nothing."
                % (URL, code, body))
    except Exception as e:
        problems.append(
            "CRITICAL: %s is unreachable: %s\n\nDrip email open/click tracking is "
            "dead while this persists." % (URL, e))

    # 3. The CRM dashboard shell. Served by Caddy on this host (:443 ->
    #    localhost:8095), NOT by the tunnel -- so a failure here is Caddy or the
    #    frontend container. "/" is the public React login page: 200 is healthy.
    try:
        code, body = fetch(DASH_URL)
        if code == DASH_EXPECT:
            print("[ok] %s -> %s (login shell served)" % (DASH_URL, code))
        else:
            problems.append(
                "CRITICAL: %s returned HTTP %s (expected %s). %s"
                % (DASH_URL, code, DASH_EXPECT, DASH_DOWN_HINT))
    except Exception as e:
        problems.append(
            "CRITICAL: %s is unreachable: %s\n\n%s" % (DASH_URL, e, DASH_DOWN_HINT))

    # 4. The auth gate. An unauthenticated GET on a real data route must be
    #    refused by the JWT middleware. This is the assertion that actually
    #    protects the lead database -- the login page being public is fine, the
    #    API being public is not. Rejected before the router, so this writes and
    #    reads nothing.
    try:
        code, body = fetch(API_URL)
        if code == API_EXPECT:
            print("[ok] %s -> %s (JWT gate intact)" % (API_URL, code))
        elif code == 200:
            problems.append(
                "CRITICAL: %s returned HTTP 200 with no credentials sent. The JWT gate "
                "in front of the CRM API is gone or bypassed, which means every lead "
                "name, email and phone in the CRM is readable by anyone on the "
                "internet. Body starts: %r\n"
                "  grep -n 'jwtGuard\\|PUBLIC_PATHS' /usr/quantum-surety-crm/backend/src/index.js\n"
                "  docker exec qs-crm-frontend cat /etc/nginx/conf.d/default.conf\n"
                "  docker logs qs-crm-backend --tail 50"
                % (API_URL, body[:120]))
        else:
            problems.append(
                "CRITICAL: %s returned HTTP %s (expected %s). The frontend is up but "
                "the backend behind nginx's /api/ proxy is not answering properly.\n"
                "  docker ps --filter name=qs-crm-backend\n"
                "  docker logs qs-crm-backend --tail 50\n"
                "  cd /usr/quantum-surety-crm && docker compose up -d"
                % (API_URL, code, API_EXPECT))
    except Exception as e:
        problems.append(
            "CRITICAL: %s is unreachable: %s\n\nThe dashboard shell may load but "
            "nothing behind it works while this persists." % (API_URL, e))

    if not problems:
        print("[ok] crm-api + dashboard + auth gate healthy")
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

    send_alert("CRM tunnel health — attention needed",
               "\n\n".join(problems) +
               "\n\n--\nAutomated check on crm-api.permitpilot.online (drip "
               "open/click tracking, via the quantum-crm tunnel) and quantumcrm.bond "
               "(CRM dashboard + API auth gate, via Caddy). Runs 2x daily on the CRM VPS.\n"
               "/usr/local/bin/crm_api_health.py")


if __name__ == "__main__":
    main()
