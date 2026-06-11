# Voice Agent Service

Deployed at `/var/www/voice-agent/` on VPS 130.51.23.147 (PM2 `voice-agent`, port 3003).
Public URL: https://voice-agent.permitpilot.online (Cloudflare named tunnel running on the
LOCAL server 192.168.4.122, forwarding to the VPS — see project memory).

## Inbound (since May 2026)
- Retell webhook `POST /webhook/retell` — logs calls to `call_logs` (bondverify MariaDB),
  creates CRM leads, emails call summaries on `call_analyzed`.
- `POST /api/send-link-email` — Retell custom tool, emails bond application links.
- Inbound agent: `agent_c69a15d6f2117a9d62903402b7` on +1-214-666-8718.

## Outbound sales calling (added 2026-06-10)
Speed-to-lead: quantumsurety.bond `POST /api/leads` notifies `POST /outbound-call`
(header `X-Outbound-Secret`), which queues and places a Retell call to the new lead.

- Outbound agent: `agent_952262db704690480e5edf526e` / LLM `llm_1c73e0dda830a78cb3f7fc3c300f`
- Guardrails: `OUTBOUND_DAILY_CAP` (default 10/day; 0 = kill switch), max 2 attempts/lead,
  Mon–Fri 9 AM–6 PM CT only (queued otherwise; processor every 5 min), 6-min max call,
  7-day phone dedup, voice-originated leads never called.
- Queue: `outbound_call_queue` table (bondverify MariaDB). No-answer retries +3h.
- `GET /outbound-stats?secret=...` — consumed by the CRM daily/weekly reports.

Env (`/var/www/voice-agent/.env`): `OUTBOUND_SECRET`, `OUTBOUND_AGENT_ID`, `OUTBOUND_DAILY_CAP`.

Deploy: copy `index.js` to `/var/www/voice-agent/index.js`, then `pm2 restart voice-agent --update-env`.
