#!/usr/bin/env python3
"""
Neon → CRM Lead Sync
Pulls new leads from quantumsurety.bond admin API and inserts them into CRM PostgreSQL.
Runs hourly via cron. Deduplicates using neon_sync_log table.
Cron: 0 * * * *  /usr/bin/python3 /usr/local/bin/sync_neon_leads.py >> /tmp/neon_sync.log 2>&1
"""

import requests, psycopg2, logging
from datetime import datetime

logging.basicConfig(format="[%(asctime)s] %(message)s", level=logging.INFO, datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger(__name__)

ADMIN_LOGIN_URL = "https://quantumsurety.bond/api/admin/login"
ADMIN_LEADS_URL = "https://quantumsurety.bond/api/admin/leads"
ADMIN_CREDS = {"username": "quantumadmin", "password": "zadoL121cu!"}

DB = dict(host="localhost", port=5433, dbname="quantum_surety",
          user="quantum_user", password="Qs2024Secure!")


def ensure_sync_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS neon_sync_log (
            neon_id TEXT PRIMARY KEY,
            synced_at TIMESTAMP DEFAULT NOW()
        )
    """)


def fetch_neon_leads(session):
    r = session.post(ADMIN_LOGIN_URL, json=ADMIN_CREDS, timeout=15)
    r.raise_for_status()
    if not r.json().get("success"):
        raise RuntimeError(f"Login failed: {r.text}")

    r = session.get(ADMIN_LEADS_URL, timeout=15)
    r.raise_for_status()
    return r.json()


def run():
    session = requests.Session()
    session.headers["User-Agent"] = "QS-CRM-Sync/1.0"

    try:
        leads = fetch_neon_leads(session)
    except Exception as e:
        log.error(f"Failed to fetch Neon leads: {e}")
        return

    log.info(f"Fetched {len(leads)} leads from Neon")

    conn = psycopg2.connect(**DB)
    cur = conn.cursor()
    ensure_sync_table(cur)
    conn.commit()

    # Load already-synced IDs
    cur.execute("SELECT neon_id FROM neon_sync_log")
    synced = {row[0] for row in cur.fetchall()}

    inserted = 0
    skipped = 0

    for lead in leads:
        neon_id = str(lead.get("id", ""))
        if not neon_id or neon_id in synced:
            skipped += 1
            continue

        name    = lead.get("name") or ""
        email   = lead.get("email") or ""
        phone   = lead.get("phone") or None
        bond_type = lead.get("bondType") or lead.get("bond_type") or None
        source  = lead.get("source") or "quantumsurety.bond"
        status  = lead.get("status") or "new"
        notes   = lead.get("notes") or None

        try:
            cur.execute("""
                INSERT INTO leads (name, email, phone, bond_type, source, status, notes, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """, (name, email, phone, bond_type, source, status, notes))

            cur.execute("INSERT INTO neon_sync_log (neon_id) VALUES (%s)", (neon_id,))
            synced.add(neon_id)
            inserted += 1
        except Exception as e:
            log.warning(f"Failed to insert lead {neon_id} ({name}): {e}")
            conn.rollback()
            continue

    conn.commit()
    cur.close()
    conn.close()
    log.info(f"Done — inserted: {inserted}, skipped (already synced): {skipped}")


if __name__ == "__main__":
    run()
