# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Express + Vite HMR via tsx)

# Production
npm run build        # Vite build (client) + esbuild (server) → dist/
npm run start        # Run production build

# Type checking
npm run check        # Run tsc (no emit)

# Database
npm run db:push      # Push schema changes to Neon DB (requires DATABASE_URL)
```

There is no test runner configured.

## Architecture

This is a monorepo with three top-level directories:

- `client/` — React 18 SPA (Vite, Wouter, TanStack Query, Shadcn/ui, Tailwind)
- `server/` — Express.js API + session/auth server
- `shared/` — Drizzle ORM schema and Zod validators shared by both sides

### Path aliases
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Frontend
- **Routing**: Wouter (`client/src/App.tsx`). Public pages get `<Navbar>/<Footer>`; `/portal/*` and `/admin/*` render without the shell layout.
- **Auth guard**: `<ProtectedRoute>` (requires `requireAdmin` prop for admin routes) wraps protected pages.
- **Server state**: TanStack Query with a shared `queryClient` in `client/src/lib/queryClient.ts`.
- **Forms**: React Hook Form + Zod via `@hookform/resolvers/zod`.
- **UI**: Shadcn/ui components in `client/src/components/ui/`, Radix UI primitives underneath.

### Backend
- **Entry points**: `server/index-dev.ts` (tsx, no build) and `server/index-prod.ts` (compiled ESM).
- **Routes**: All API routes registered in `server/routes.ts` via `registerRoutes(app)`.
- **Storage interface**: `server/storage.ts` exports a single `storage` object implementing `IStorage`. The implementation uses Drizzle ORM against Neon PostgreSQL; an in-memory fallback exists for development without a database.
- **Auth**: Two parallel auth systems:
  - *Client auth*: Replit Auth (OpenID Connect via Passport.js) in `server/replitAuth.ts` — used for `/portal` routes.
  - *Admin auth*: Username/password (bcrypt) with session persistence — `/admin-login` and `/admin-setup`.
  - Route middleware `isAuthenticated` and `isAdmin` from `replitAuth.ts` guard API endpoints.
- **AI**: `server/openai.ts` wraps OpenAI (GPT-5) for the bond finder chatbot.
- **Email**: `server/email.ts` uses SendGrid for transactional emails and admin notifications.
- **Risk scoring**: `server/risk-scoring.ts` evaluates underwriting rules and generates synthetic credit scores.

### Database
- ORM: Drizzle ORM (`shared/schema.ts` is the single source of truth for all tables and Zod insert schemas).
- DB: Neon serverless PostgreSQL. Requires `DATABASE_URL` env var.
- Migrations output to `./migrations/`; apply with `npm run db:push`.
- Key tables: `users`, `quotes`, `bonds`, `projects`, `surety_applications`, `application_documents`, `credit_pulls`, `carriers`, `carrier_rules`, `email_notifications`.

### Environment variables required
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `OPENAI_API_KEY` | GPT-5 for AI bond finder |
| `SENDGRID_API_KEY` | Transactional email |
| `SESSION_SECRET` | Express session signing |
| `REPLIT_*` | Replit Auth OIDC (set automatically on Replit) |

## Key Design Decisions

- **Dual auth**: Clients authenticate via Replit OAuth; admins use a separate username/password flow to avoid OIDC dependency for internal tools.
- **Shared schema**: `shared/schema.ts` exports both Drizzle table definitions and `drizzle-zod` insert schemas — always derive Zod types from the schema rather than writing them manually.
- **Storage abstraction**: Code always interacts with `storage` (the `IStorage` interface), never with Drizzle directly in route handlers. New data operations go into `storage.ts`.
- **SEO pages**: Texas-specific landing pages (`/bonds/texas-*`) and blog posts (`/blog/*`) are static React components with no data fetching, added purely for SEO.

## Blog posts 
- Stored in: src/pages/blog/ (or wherever your route is — verify after /init) 
- Format: TSX React components 
- Layout wrapper: check existing posts for the BlogPost/ArticleLayout component name 
- Frontmatter pattern: exported const metadata = { title, date, slug, description, tags } 
- Deploy: node deploy_all.js