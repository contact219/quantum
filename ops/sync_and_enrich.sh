#!/bin/bash
# Daily RLI bond sync, then (weekly, Mondays) enrich saved-bond contact info
# WHILE THE SESSION IS STILL FRESH.
#
# Why chained: saved_bond_enrich can only RESUME a live RLI session; it can't
# re-login through MFA headlessly. The RLI/Okta myportal session lapses within
# a few hours, so the old standalone 6am enrich cron routinely hit an expired
# session (5am sync + 1h gap) and failed silently. Running enrich immediately
# after the sync — which just refreshed and re-saved the session cookies —
# gives it the freshest possible session. A FATAL is echoed to the sync log so
# the failure is visible, not silent.
export NODE_PATH=/root/node_modules
export CRM_DB_PASSWORD='QsCRMV8yNgKOoaNPu67JF!'
export CHROMIUM_PATH=/usr/bin/chromium-browser
cd /opt/quantum-ops || exit 1

node mybondapp_sync.cjs >> /var/log/mybondapp-sync.log 2>&1

# Weekly enrichment (Mondays) — runs seconds after the sync, session still valid.
if [ "$(date +%u)" = "1" ]; then
  node saved_bond_enrich.cjs >> /tmp/saved-bond-enrich.log 2>&1
  if tail -5 /tmp/saved-bond-enrich.log | grep -q FATAL; then
    echo "[$(date -u +%Y-%m-%dT%H:%MZ)] saved_bond_enrich FATAL (session likely expired) — see /tmp/saved-bond-enrich.log" >> /var/log/mybondapp-sync.log
  fi
fi
