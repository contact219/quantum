# CLAUDE.md

This file provides guidance to Claude Code when working with the Quantum Surety codebase and infrastructure.

---

## Quick Reference — All Systems

| System | URL / Access | Notes |
|--------|-------------|-------|
| Main site | https://quantumsurety.bond | VPS 130.51.23.147, PM2 `quantumsurety`, dir `/var/www/quantumsurety/` |
| Bond Verify portal | https://verify.quantumsurety.bond | VPS 130.51.23.147, Node.js + Caddy |
| Partner Portal | https://partners.quantumsurety.bond | VPS 130.51.23.147, PM2 `partner-portal` port 3002 |
| Voice Agent | https://voice-agent.permitpilot.online | VPS 130.51.23.147, PM2 `voice-agent` port 3003 + Cloudflare named tunnel on CRM VPS 130.51.22.226 |
| Permit Pilot | https://permitpilot.online | VPS 130.51.23.147, Docker Compose port 7842 |
| CRM dashboard | http://130.51.22.226:8095 | VPS (CRM VPS), Docker Compose |
| GitHub repo | github.com/contact219/quantum | Main site source |

---

## Infrastructure

### 1. quantumsurety.bond — Main Public Website
- **Stack:** React/TypeScript SPA — Vite + Wouter + Shadcn/ui + Express.js + Drizzle ORM + Neon (serverless PostgreSQL)
- **Deployment:** VPS 130.51.23.147, PM2 `quantumsurety`, dir `/var/www/quantumsurety/`
  - Deploy: `git pull && npm run build && pm2 restart quantumsurety` (run on VPS)
  - GitHub remote is configured on VPS — push to GitHub, then pull on VPS to deploy
- **GitHub:** `contact219/quantum`
- **Token:** stored in local Claude memory (`project_quantum_surety_server.md`)
- **Remote:** `https://<token>@github.com/contact219/quantum.git`

### 2. verify.quantumsurety.bond — Bond Verify Portal + API
- **VPS IP:** 130.51.23.147
- **SSH:** `root` / stored in local memory
- **Web server:** Caddy (auto-HTTPS via Let's Encrypt)
- **Caddyfile:** `/etc/caddy/Caddyfile`
- **MariaDB:** host `127.0.0.1`, db `bondverify`, user `bondverify` — pass in memory

**PM2 processes on VPS:**
| Process | Port | App dir |
|---------|------|---------|
| `bond-verify` | 3001 | `/var/www/bondverify/` |
| `partner-portal` | 3002 | `/var/www/partners/` |
| `voice-agent` | 3003 | `/var/www/voice-agent/` |

**Docker processes on VPS (Permit Pilot):**
| Container | Port | Purpose |
|-----------|------|---------|
| `permitpilot-app-1` | 7842 | Node.js app |
| `permitpilot-scraper-1` | — | Scraper worker |
| `permitpilot-postgres-1` | — | PostgreSQL (db: permitpilot, user: permitpilot) |
| `permitpilot-redis-1` | — | Redis |
- **App dir:** `/var/www/permitpilot/`
- **Compose file:** `/var/www/permitpilot/docker-compose.yml`
- **Restart:** `docker compose -f /var/www/permitpilot/docker-compose.yml restart`
- **Logs:** `docker logs permitpilot-app-1 --tail 50`

**Useful commands on VPS:**
```bash
pm2 status                          # Check all app status
pm2 restart bond-verify             # Restart Bond Verify
pm2 restart partner-portal          # Restart Partner Portal
pm2 restart voice-agent             # Restart Voice Agent
docker compose -f /var/www/permitpilot/docker-compose.yml ps   # Permit Pilot status
docker compose -f /var/www/permitpilot/docker-compose.yml restart  # Restart Permit Pilot
systemctl reload caddy              # Reload Caddy config
mysql -u bondverify -pBondVerify2026! bondverify   # DB shell (Bond Verify / Partners / Voice Agent)
docker exec permitpilot-postgres-1 psql -U permitpilot permitpilot  # Permit Pilot DB shell
```

**Bond Verify key files:**
| File | Purpose |
|------|---------|
| `/var/www/bondverify/server.js` | Express app — notary search, contractor search, alerts, API key auth, /api/v1/ |
| `/var/www/bondverify/.env` | DB creds, SES keys, port |
| `/var/www/bondverify/public/index.html` | Public portal — Notary Bond Lookup + Contractor License Lookup tabs |
| `/var/www/bondverify/public/api-docs.html` | API docs + key registration |
| `/var/www/bondverify/public/style.css` | Shared styles |
| `/var/www/bondverify/scripts/import-notaries.py` | Downloads TX SOS CSV → upserts MariaDB |
| `/var/www/bondverify/scripts/import-contractors.py` | Downloads TX TDLR CSV → upserts MariaDB (816K+ records) |
| `/var/www/bondverify/scripts/send-alerts.js` | Daily SES renewal alert emails |

**Partner Portal key files:**
| File | Purpose |
|------|---------|
| `/var/www/partners/server.js` | Express app — registration, magic-link login, referral tracking, admin API |
| `/var/www/partners/.env` | DB creds, SES keys, admin password |
| `/var/www/partners/public/index.html` | Partner registration + login page |
| `/var/www/partners/public/dashboard.html` | Partner dashboard — referrals, stats, referral link |

**Bond Verify DB tables:** `notaries`, `contractors`, `alert_subscriptions`, `api_keys`, `partners`, `referrals`

**Bond Verify API endpoints (verify.quantumsurety.bond):**
- `GET /api/search?q=&city=` — public notary bond search (no key)
- `GET /api/contractor-search?q=&county=&type=` — public TDLR contractor search (no key)
- `POST /api/alerts/subscribe` — notary renewal alert signup (no key)
- `POST /api/keys/register` — self-serve API key registration (no key)
- `GET /api/v1/status` — public stats (notaries + contractors counts)
- `GET /api/v1/lookup/:notary_id` — requires `X-API-Key` header
- `GET /api/v1/search?first_name=&last_name=&city=&zip=` — requires `X-API-Key` header
- `GET /api/v1/contractor/lookup/:license_number` — requires `X-API-Key` header
- `GET /api/v1/contractor/search?name=&county=&type=` — requires `X-API-Key` header
- Free tier: 1,000 req/day. Enterprise: api@quantumsurety.bond

**Partner Portal API endpoints (partners.quantumsurety.bond):**
- `POST /api/register` — partner self-registration (sends welcome email with referral code)
- `POST /api/login` — request magic login link (email-based, 24h token)
- `GET /api/me` — partner dashboard data (requires `X-Partner-Token` header)
- `POST /api/referrals` — submit a referral manually (requires `X-Partner-Token`)
- `GET /api/admin/partners` — list all partners (requires `X-Admin-Pass` header)
- `PATCH /api/admin/partners/:id` — update partner status/commission (admin)
- `GET /api/admin/referrals` — list all referrals (admin)
- `PATCH /api/admin/referrals/:id` — mark sold + record commission (admin)
- Admin password: stored in local memory. Default: `QSAdmin2026!`

**VPS cron jobs (root):**
```
0 13 * * *   node /var/www/bondverify/scripts/send-alerts.js >> /var/log/bondverify-alerts.log 2>&1
0 7 1 * *    python3 /var/www/bondverify/scripts/import-notaries.py >> /var/log/bondverify-import.log 2>&1
0 8 1 * *    python3 /var/www/bondverify/scripts/import-contractors.py >> /var/log/bondverify-contractors-import.log 2>&1
```

### 3. Voice Agent — voice-agent.permitpilot.online

- **Phone:** +1-214-666-8718 (inbound, Retell AI)
- **Public URL:** https://voice-agent.permitpilot.online
- **VPS process:** PM2 `voice-agent`, port 3003, dir `/var/www/voice-agent/`
- **App file:** `/var/www/voice-agent/index.js` (v3.0) — webhook receiver, DB logging, SES email, CRM lead creation
- **Retell LLM ID:** `llm_d524048e266596071e10ce98ec26`
- **Transfer to live agent:** +1-214-506-7373 (cold transfer on request)

**Cloudflare tunnel routing:**
Traffic for `voice-agent.permitpilot.online` routes via a **named Cloudflare tunnel on CRM VPS 130.51.22.226** (migrated from local 192.168.4.122 on 2026-06-24).
- Tunnel config: `/root/.cloudflared/voice-agent.yml` (CRM VPS)
- Systemd service: `cloudflared-voice.service` (CRM VPS, runs as root)
- Tunnel ID: `afbf0154-520c-41fc-b4b7-ffcdeb16708b`
- Tunnel forwards to: `http://130.51.23.147:3003` (voice agent VPS)
- Restart tunnel: `plink -batch -pw "6sCgf4H80nPM5kQ" root@130.51.22.226 "systemctl restart cloudflared-voice"`

**Post-call pipeline (fires once per call on `call_analyzed` event):**
1. `call_logs` table in MariaDB `bondverify` (ON DUPLICATE KEY UPDATE)
2. `POST quantumsurety.bond/api/leads` — CRM lead with placeholder email
3. SES email to `administrator@quantumsurety.bond` from `alerts@quantumsurety.bond`

**Call Logs API:** `GET https://voice-agent.permitpilot.online/api/calls` — returns last 200 calls with CORS `*`

**CRM Call Logs page:** `/usr/quantum-surety-crm/frontend/src/pages/CallLogs.jsx` — fetches from the API above, shown in CRM nav for admin/sales roles.

---

### 4. quantum-surety-crm — CRM Dashboard
- **Server:** 130.51.22.226 (CRM VPS — migrated from local 2026-06-24)
- **SSH:** `root` / `6sCgf4H80nPM5kQ`
- **Access:** http://130.51.22.226:8095
- **Stack:** React JSX (Vite) frontend + Node.js Express backend, Docker Compose
- **Project dir:** `/usr/quantum-surety-crm/`
- **Rebuild:** `cd /usr/quantum-surety-crm && docker compose up -d --build --force-recreate`
- **Operational scripts:** `/opt/quantum-ops/` (432 .cjs + 22 .py), `/usr/local/bin/*.py`, `/root/*.cjs`, `/tmp/*.py`
- **Quantum repo clone:** `/opt/quantum/` (git pull to update)

**CRM containers:**
| Container | Port | Purpose |
|-----------|------|---------|
| `qs-crm-frontend` | 8095 | React JSX UI (Vite) |
| `qs-crm-backend` | 4001 | Node.js Express API |
| `scraper-postgres` | 5433 | PostgreSQL — db: `quantum_surety`, user: `quantum_user`, pass: `QsCRMV8yNgKOoaNPu67JF!` |

**Key CRM file paths:**
- Frontend pages: `/usr/quantum-surety-crm/frontend/src/pages/`
- Backend routes: `/usr/quantum-surety-crm/backend/src/routes/`
- App entry: `/usr/quantum-surety-crm/frontend/src/App.jsx`

**CRM cron jobs (root on 130.51.22.226):**
```
0 * * * *      sync_neon_leads.py (hourly Neon→CRM sync)
15 18 * * *    drip auto-pipeline
45 1 * * *     drip auto-pipeline
0 8 * * *      daily_report.py
0 8 * * 6      weekly_report.py
5 8 * * *      daily_revenue_report.py
*/30 * * * *   sale_alert_monitor.py
0 15 * * *     send_review_requests.py
30 13 * * 1-5  crm_daily_auto_followup.cjs
0 14 * * 1     crm_reengagement_blast.cjs
0 13 * * 1-5   morning_call_list.cjs
0 8 * * 1      tdlr_renewal_target.py
0 7 * * 1-5    esbd_commercial_monitor.py
30 12 * * 1-5  lead-gen agent + report
```

**CRM scripts:**
| Script | Purpose |
|--------|---------|
| `/usr/local/bin/daily_report.py` | Daily leads report via SES → contact219@gmail.com |
| `/usr/local/bin/weekly_report.py` | Weekly revenue/leads summary via SES |
| `/usr/local/bin/tdlr_monitor.py` | TDLR data → contractor license leads |
| `/usr/local/bin/sync_neon_leads.py` | Hourly Neon (main site) → CRM lead sync |
| `/usr/local/lead-gen/agent.js` | Lead gen agent (7:30 AM CDT weekdays) |

**Connect to CRM DB:**
```bash
plink -batch -pw "6sCgf4H80nPM5kQ" root@130.51.22.226 "docker exec scraper-postgres psql -U quantum_user -d quantum_surety -c \"<SQL>\""
```

---

## AWS SES (Email — all systems)
- **Key ID / Secret:** stored in local Claude memory (`project_quantum_surety_server.md`)
- **Region:** `us-east-2`
- **From addresses:** `nice.shotwell-sparks@quantumsurety.bond` (reports), `alerts@quantumsurety.bond` (Bond Verify)

---

## Bond Types Supported

| Key | Label |
|-----|-------|
| `notary` | Texas Notary Bond |
| `dealer` / `gdn` | Texas GDN Dealer Bond |
| `contractor` | Texas Contractor License Bond |
| `construction` | Texas Construction Bond |
| `bid` | Texas Bid Bond |
| `performance` | Texas Performance & Payment Bond |
| `payment` | Texas Payment Bond |
| `mortgage` | Texas Mortgage Broker Bond |
| `credit-access-business` | Texas Credit Access Business Bond |
| `collection-agency` | Texas Collection Agency Bond |
| `property-tax-consultant` | Texas Property Tax Consultant Bond |

Bond labels are defined in **three places** that must stay in sync:
1. `server/routes.ts` — `BOND_LABELS` map
2. `client/src/pages/get-bond.tsx` — `BOND_META`
3. `/usr/quantum-surety-crm/backend/src/routes/leads.js` — `BOND_LABELS`

---

## Main Site — Commands

```bash
npm run dev          # Dev server (Express + Vite HMR via tsx)
npm run build        # Vite build (client) + esbuild (server) → dist/
npm run start        # Run production build
npm run check        # TypeScript check (no emit)
npm run db:push      # Push schema to Neon DB (requires DATABASE_URL)
```

No test runner configured.

## Main Site — Architecture

Monorepo with three top-level directories:
- `client/` — React 18 SPA (Vite, Wouter, TanStack Query, Shadcn/ui, Tailwind)
- `server/` — Express.js API + session/auth server
- `shared/` — Drizzle ORM schema and Zod validators shared by both sides

### Path aliases
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Frontend
- **Routing:** Wouter (`client/src/App.tsx`). Public pages get `<Navbar>/<Footer>`; `/portal/*` and `/admin/*` render without the shell layout.
- **Auth guard:** `<ProtectedRoute>` (requires `requireAdmin` prop for admin routes).
- **Server state:** TanStack Query with shared `queryClient` in `client/src/lib/queryClient.ts`.
- **Forms:** React Hook Form + Zod via `@hookform/resolvers/zod`.
- **UI:** Shadcn/ui components in `client/src/components/ui/`.

### Backend
- **Entry points:** `server/index-dev.ts` (tsx, no build) and `server/index-prod.ts` (compiled ESM).
- **Routes:** All API routes registered in `server/routes.ts` via `registerRoutes(app)`.
- **Storage interface:** `server/storage.ts` exports a single `storage` object implementing `IStorage`. Uses Drizzle ORM against Neon PostgreSQL.
- **Auth:** Two parallel auth systems:
  - *Client auth:* Replit Auth (OpenID Connect via Passport.js) in `server/replitAuth.ts` — used for `/portal` routes.
  - *Admin auth:* Username/password (bcrypt) — `/admin-login` and `/admin-setup`.
- **AI:** `server/openai.ts` wraps OpenAI (GPT-5) for the bond finder chatbot.
- **Email:** `server/email.ts` uses SendGrid for transactional emails.
- **Risk scoring:** `server/risk-scoring.ts` evaluates underwriting rules and generates synthetic credit scores.

### Database
- ORM: Drizzle ORM (`shared/schema.ts` is the single source of truth).
- DB: Neon serverless PostgreSQL. Requires `DATABASE_URL` env var.
- Key tables: `users`, `quotes`, `bonds`, `projects`, `surety_applications`, `leads`.

### Environment variables (main site)
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `OPENAI_API_KEY` | GPT-5 for AI bond finder |
| `SENDGRID_API_KEY` | Transactional email |
| `SESSION_SECRET` | Express session signing |
| `REPLIT_*` | Replit Auth OIDC (set automatically on Replit) |

## Key Design Decisions

- **Dual auth:** Clients authenticate via Replit OAuth; admins use a separate username/password flow.
- **Shared schema:** `shared/schema.ts` exports both Drizzle table definitions and `drizzle-zod` insert schemas — always derive Zod types from the schema rather than writing them manually.
- **Storage abstraction:** Code always interacts with `storage` (the `IStorage` interface), never with Drizzle directly in route handlers.
- **SEO pages:** Texas-specific landing pages (`/bonds/texas-*`) and blog posts (`/blog/*`) are static React components added purely for SEO.
- **Bond Verify** is a separate standalone Node.js app on the VPS — not part of this repo.

## Blog Posts
- Stored in: `client/src/pages/blog/`
- Format: TSX React components
- Frontmatter pattern: `export const metadata = { title, date, slug, description, tags }`
- Deploy: `node deploy_all.js`

## Leads System

### quantumsurety.bond (Neon DB)
- Table: `leads` — id, name, email, phone, bond_type, source, status, notes, sale_amount, lead_time, created_at, updated_at
- Status values: `new`, `contacted`, `sold`, `no_follow_up`
- `POST /api/leads` — public form submission
- `GET /api/admin/leads` — admin only
- `PATCH /api/admin/leads/:id` — admin only

### quantum-surety-crm (PostgreSQL)
- Table: `leads` (same columns, integer id)
- `POST /api/leads`, `GET /api/leads`, `GET /api/leads/stats`, `PATCH /api/leads/:id`
- Auto-pipeline endpoint: `POST /api/drip/auto-pipeline` — converts email opens/clicks into leads (runs via cron at 1:15 PM and 8:45 PM CDT daily)

## Critical Notes

- **SQL format strings in psycopg2:** Never use `%-d` or `%-I` in PostgreSQL `to_char()` when also using `%s` params — psycopg2 treats `%-d` as a format specifier. Use `FMDD` and `FMHH12` instead.
- **Bond Verify DB host:** Must use `127.0.0.1` not `localhost` — mysql2 resolves `localhost` to IPv6 (`::1`) but MariaDB only listens on IPv4.
- **CRM file ownership:** Files in `/usr/quantum-surety-crm/` are root-owned. Always write to `/tmp/` first, then `sudo tee` to destination.
- **Notary CSV column headers:** Texas SOS CSV uses title case — `"Notary ID"`, `"First Name"`, `"Last Name"`, etc. (not snake_case).
