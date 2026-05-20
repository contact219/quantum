# CLAUDE.md

This file provides guidance to Claude Code when working with the Quantum Surety codebase and infrastructure.

---

## Quick Reference — All Systems

| System | URL / Access | Notes |
|--------|-------------|-------|
| Main site | https://quantumsurety.bond | Replit Autoscale, auto-deploys from GitHub |
| Bond Verify portal | https://verify.quantumsurety.bond | VPS 130.51.23.147, Node.js + Caddy |
| CRM dashboard | http://192.168.4.122:8095 | Local network only, Docker Compose |
| GitHub repo | github.com/contact219/quantum | Main site source |

---

## Infrastructure

### 1. quantumsurety.bond — Main Public Website
- **Stack:** React/TypeScript SPA — Vite + Wouter + Shadcn/ui + Express.js + Drizzle ORM + Neon (serverless PostgreSQL)
- **Deployment:** Replit Autoscale — push to GitHub → Replit auto-deploys
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
docker compose -f /var/www/permitpilot/docker-compose.yml ps   # Permit Pilot status
docker compose -f /var/www/permitpilot/docker-compose.yml restart  # Restart Permit Pilot
systemctl reload caddy              # Reload Caddy config
mysql -u bondverify -pBondVerify2026! bondverify   # DB shell (Bond Verify / Partners)
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

### 3. quantum-surety-crm — Internal CRM Dashboard
- **Server:** 192.168.4.122 (local network only)
- **SSH:** `tsparks` / `zadoL4cu!` (sudo password same)
- **Access:** http://192.168.4.122:8095
- **Stack:** React JSX (Vite) frontend + Node.js Express backend, Docker Compose
- **Project dir:** `/usr/quantum-surety-crm/`
- **Rebuild:** `cd /usr/quantum-surety-crm && sudo docker compose up -d --build --force-recreate`
- **Note:** Files are root-owned. Write to `/tmp/` first, then `sudo tee` to destination.

**CRM containers:**
| Container | Port | Purpose |
|-----------|------|---------|
| `qs-crm-frontend` | 8095 | React JSX UI (Vite) |
| `qs-crm-backend` | 4001 | Node.js Express API |
| `scraper-postgres` | 5433 | PostgreSQL — db: `quantum_surety`, user: `quantum_user`, pass: `Qs2024Secure!` |

**Key CRM file paths:**
- Frontend pages: `/usr/quantum-surety-crm/frontend/src/pages/`
- Backend routes: `/usr/quantum-surety-crm/backend/src/routes/`
- App entry: `/usr/quantum-surety-crm/frontend/src/App.jsx`

**CRM cron jobs (tsparks):**
```
15 18 * * *  curl -s -X POST http://localhost:4001/api/drip/auto-pipeline >> /home/tsparks/crm-autopipeline.log 2>&1
45 1 * * *   curl -s -X POST http://localhost:4001/api/drip/auto-pipeline >> /home/tsparks/crm-autopipeline.log 2>&1
0 7 1 * *    python3 /tmp/refresh_notaries.py >> /tmp/refresh_notaries.log 2>&1
0 9 2 * *    python3 /tmp/tdlr_monitor.py >> /tmp/tdlr_monitor.log 2>&1
0 8 * * *    python3 /tmp/daily_report.py >> /tmp/daily_report.log 2>&1
0 8 * * 6    python3 /tmp/weekly_report.py >> /tmp/weekly_report.log 2>&1
```

**CRM scripts:**
| Script | Purpose |
|--------|---------|
| `/tmp/refresh_notaries.py` | Downloads TX SOS notary CSV → upserts PostgreSQL `notaries` table |
| `/tmp/tdlr_monitor.py` | Downloads TDLR data from Socrata, finds recently-issued contractor licenses, inserts as leads. Source: `TDLR Monitor`, bond_type: `Texas Contractor License Bond` |
| `/tmp/daily_report.py` | Daily leads report via SES → contact219@gmail.com |
| `/tmp/weekly_report.py` | Weekly revenue/leads summary via SES |

**Connect to CRM DB:**
```bash
plink -batch -pw "zadoL4cu!" tsparks@192.168.4.122 "echo 'zadoL4cu!' | sudo -S docker exec scraper-postgres psql -U quantum_user -d quantum_surety -c \"<SQL>\""
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
