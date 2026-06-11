#!/usr/bin/env python3
"""
Site events sync — rebuilt 2026-06-10 (original lost to /tmp cleanup).
Pulls events from quantumsurety.bond /api/events-log into CRM site_events.
The site keeps events in memory (last 5000), so frequent polling matters.
Cron: */5 * * * *
"""

import json
import urllib.parse
import urllib.request

import psycopg2

import os

EVENTS_URL = "https://quantumsurety.bond/api/events-log"
STATE_FILE = "/var/tmp/site_events_last_sync.txt"


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


def load_last():
    try:
        with open(STATE_FILE) as f:
            return f.read().strip()
    except OSError:
        return None


def save_last(ts):
    with open(STATE_FILE, "w") as f:
        f.write(ts)


def main():
    last = load_last()
    url = EVENTS_URL + "?limit=1000"
    if last:
        url += "&since=" + urllib.parse.quote(last)

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "CRM-Sync/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f"[events-sync] fetch error: {e}")
        return

    events = data.get("events", [])
    if not events:
        print("[events-sync] no new events")
        return

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    inserted = 0
    newest = last or ""

    for ev in events:
        try:
            cur.execute(
                """INSERT INTO site_events
                   (session_id, event_type, page, element, value,
                    utm_source, utm_campaign, referrer, ip, created_at)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (
                    (ev.get("session_id") or "")[:64],
                    (ev.get("event_type") or "")[:50],
                    (ev.get("page") or "")[:255],
                    (ev.get("element") or "")[:255],
                    ev.get("value") or "",
                    (ev.get("utm_source") or "")[:100],
                    (ev.get("utm_campaign") or "")[:200],
                    ev.get("referrer") or "",
                    (ev.get("ip") or "")[:64],
                    ev.get("time"),
                ),
            )
            inserted += 1
            if ev.get("time", "") > newest:
                newest = ev["time"]
        except Exception as e:
            print(f"[events-sync] insert error: {e}")
            conn.rollback()
        else:
            conn.commit()

    if newest:
        save_last(newest)
    print(f"[events-sync] inserted {inserted} events")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
