# Quantum Surety — AI-Powered Texas Surety Bond Platform

**Live site:** [quantumsurety.bond](https://quantumsurety.bond)

Quantum Surety is an AI-first full-stack web application that simplifies surety bond issuance for contractors, notaries, and small business owners in Texas. The platform combines rapid AI-assisted underwriting, instant online issuance, and intelligent customer workflows.

## Features

- **Instant bond issuance** — Texas notary bonds ($50), license bonds, and contractor bonds issued online in minutes
- **AI-assisted underwriting** — GPT-powered bond finder and quote generation
- **SB693 compliant** — Up-to-date with 2026 Texas notary law changes
- **TDI-licensed agency** — Texas Department of Insurance License #3480229
- **Construction bonds** — Bid bonds, performance bonds, payment bonds for TX public and private projects
- **Blog & SEO content** — Server-side rendered meta tags and structured data (schema.org) for all routes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Shadcn/ui, Vite |
| Backend | Express.js, TypeScript |
| ORM | Drizzle ORM |
| Database | Neon serverless PostgreSQL |
| AI | OpenAI GPT (bond finder chatbot) |
| Email | SendGrid |
| Hosting | Google Cloud Platform |

## Project Structure

```
├── client/          # React 18 SPA (Vite + Wouter routing)
│   ├── src/pages/   # Public pages and admin screens
│   └── src/components/
├── server/          # Express.js API + SSR SEO middleware
│   ├── seo.ts       # Server-side meta tags, structured data, sitemap
│   ├── routes.ts    # All API routes
│   └── storage.ts   # Drizzle ORM data layer
├── shared/          # Drizzle schema + Zod validators (shared by client & server)
└── CLAUDE.md        # Development documentation
```

## Getting Started

```bash
# Install dependencies
npm install

# Development (Express + Vite HMR)
npm run dev

# Production build
npm run build
npm run start

# Type check
npm run check

# Push database schema changes
npm run db:push
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `OPENAI_API_KEY` | GPT for AI bond finder |
| `SENDGRID_API_KEY` | Transactional email |
| `SESSION_SECRET` | Express session signing |

## SEO Architecture

All public routes receive server-side injected meta tags via `server/seo.ts`:
- Per-page `<title>`, `<meta name="description">`, and `<link rel="canonical">`
- Open Graph and Twitter Card tags with OG image
- `schema.org` JSON-LD structured data (LocalBusiness, FAQPage, Product, Article, BreadcrumbList)
- `sitemap.xml` and `robots.txt` generated dynamically

## License

Proprietary — Quantum Surety LLC. All rights reserved.
