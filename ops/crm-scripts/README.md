# CRM Server Ops Scripts (192.168.4.122)

Deployed to `/usr/local/bin/` on the CRM server. **Never deploy cron scripts to /tmp**
— the originals were lost to /tmp cleanup in June 2026 and had to be rebuilt.

| Script | Cron | Purpose |
|--------|------|---------|
| `daily_report.py` | `0 8 * * *` | Daily email: leads, email funnel, outbound AI call stats |
| `weekly_report.py` | `0 8 * * 6` | Saturday rollup: 7-day leads/email/top campaigns/calls |
| `refresh_notaries.py` | `0 7 * * *` | TX SOS notary CSV (data.texas.gov gmd3-bnrd) → upsert CRM `notaries` |
| `sync_site_events.py` | `*/2 * * * *` | quantumsurety.bond `/api/events-log` → CRM `site_events` |
| `tdlr_monitor.py` | `0 9 2 * *` | New/renewed Electrical Contractor licenses → CRM leads (supports `--dry-run`) |

Also on this server (pre-existing, not in this directory):
`/usr/local/bin/lead_followup.py`, `/usr/local/bin/lead_intelligence.py`,
`/usr/local/bin/sync_leads_from_site.py`.

Deploy: `scp` (or cat-pipe) to `/tmp`, then `sudo cp /tmp/<script> /usr/local/bin/ && sudo chmod +x`.
