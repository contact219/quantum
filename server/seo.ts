/**
 * Quantum Surety - SEO Middleware
 * Injects server-side meta tags, structured data, and crawlable HTML
 * into the index.html shell before it reaches the browser / Google crawler.
 *
 * DROP THIS FILE into: server/seo.ts
 * Then wire it into your Express server (see instructions at bottom).
 */

import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// ─── Page metadata map ────────────────────────────────────────────────────────
// Add / edit routes here. Each entry is keyed by the URL path.
// "content" is crawlable HTML injected BEFORE <div id="root">
// so Google can index it even without executing JavaScript.

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  structuredData?: object;
  content?: string; // crawlable static HTML (Google sees this)
}

const BASE_URL = "https://quantumsurety.bond";

const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Quantum Surety | AI-Powered Surety Bonds for Texas Contractors",
    description:
      "Get fast, AI-powered surety bonds for contractors in Texas and nationwide. Bid bonds, performance bonds, payment bonds & license bonds — quotes in minutes.",
    canonical: `${BASE_URL}/`,
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "InsuranceAgency",
      name: "Quantum Surety",
      url: BASE_URL,
      description:
        "AI-powered surety bond agency specializing in construction bonds for contractors nationwide.",
      address: {
        "@type": "PostalAddress",
        addressRegion: "TX",
        addressCountry: "US",
      },
      areaServed: "US",
      serviceType: [
        "Surety Bonds",
        "Construction Bonds",
        "Performance Bonds",
        "Bid Bonds",
        "Payment Bonds",
        "License Bonds",
      ],
    },
    content: `
      <main>
        <h1>AI-Powered Surety Bonds for Contractors</h1>
        <p>Quantum Surety provides fast, intelligent surety bond solutions for construction contractors across Texas and nationwide. Get bid bonds, performance bonds, payment bonds, and license &amp; permit bonds — with AI-assisted underwriting that delivers quotes in minutes, not days.</p>
        <section>
          <h2>Bond Types We Offer</h2>
          <ul>
            <li><strong>Bid Bonds</strong> — Guarantee your bid is serious and backed by a surety.</li>
            <li><strong>Performance Bonds</strong> — Assure project owners that you will complete the contract.</li>
            <li><strong>Payment Bonds</strong> — Protect subcontractors and suppliers from non-payment.</li>
            <li><strong>License &amp; Permit Bonds</strong> — Required by cities and states for contractor licenses.</li>
            <li><strong>Miscellaneous Surety Bonds</strong> — Court bonds, fidelity bonds, and more.</li>
          </ul>
        </section>
        <section>
          <h2>Why Quantum Surety?</h2>
          <ul>
            <li>AI-powered underwriting for faster approvals</li>
            <li>Quotes delivered in minutes, not 24–48 hours</li>
            <li>Serving Texas contractors and nationwide</li>
            <li>Experienced surety professionals backed by top-rated carriers</li>
          </ul>
        </section>
        <a href="/quote">Get a Free Bond Quote</a>
      </main>`,
  },

  "/quote": {
    title: "Get a Surety Bond Quote | Quantum Surety",
    description:
      "Request a free surety bond quote online. Bid bonds, performance bonds, payment bonds and license bonds for contractors. Fast AI-assisted approvals.",
    canonical: `${BASE_URL}/quote`,
    content: `
      <main>
        <h1>Get a Free Surety Bond Quote</h1>
        <p>Fill out our quick online form to receive a surety bond quote. Our AI-powered system evaluates your application and returns competitive bond rates fast. We work with top-rated surety carriers to find the best rate for your bond type and project size.</p>
        <p>We issue quotes for bid bonds, performance bonds, payment bonds, license &amp; permit bonds, and miscellaneous surety bonds for contractors across Texas and all 50 states.</p>
      </main>`,
  },

  "/bonds/contract": {
    title: "Contract Surety Bonds | Bid, Performance & Payment Bonds | Quantum Surety",
    description:
      "Contract surety bonds for construction contractors — bid bonds, performance bonds, and payment bonds. Fast approvals for public and private projects.",
    canonical: `${BASE_URL}/bonds/contract`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Contract Surety Bonds",
      provider: { "@type": "InsuranceAgency", name: "Quantum Surety" },
      description:
        "Bid bonds, performance bonds, and payment bonds for general contractors and subcontractors.",
      areaServed: "US",
    },
    content: `
      <main>
        <h1>Contract Surety Bonds for Construction Contractors</h1>
        <p>Contract surety bonds protect project owners and ensure contractors meet their obligations. Quantum Surety provides all three types of contract bonds required on public and private construction projects.</p>
        <section>
          <h2>Bid Bonds</h2>
          <p>A bid bond guarantees that a contractor will enter into a contract at the bid price if selected. Required on most public construction projects. We issue bid bonds same-day for qualified contractors.</p>
        </section>
        <section>
          <h2>Performance Bonds</h2>
          <p>A performance bond guarantees that a contractor will complete the project according to the contract terms. Required on federal projects over $150,000 under the Miller Act, and on most state and municipal projects.</p>
        </section>
        <section>
          <h2>Payment Bonds</h2>
          <p>A payment bond guarantees that a contractor will pay subcontractors, laborers, and material suppliers. Typically issued alongside a performance bond on public projects.</p>
        </section>
        <a href="/quote">Get a Contract Bond Quote</a>
      </main>`,
  },

  "/bonds/commercial": {
    title: "Commercial Surety Bonds | License & Permit Bonds | Quantum Surety",
    description:
      "Commercial surety bonds including contractor license bonds, permit bonds, and court bonds. Fast online quotes for Texas and nationwide.",
    canonical: `${BASE_URL}/bonds/commercial`,
    content: `
      <main>
        <h1>Commercial Surety Bonds</h1>
        <p>Commercial surety bonds protect consumers, government agencies, and business partners from financial loss. Quantum Surety specializes in license &amp; permit bonds, court bonds, and other commercial surety products for businesses and individuals.</p>
        <section>
          <h2>License &amp; Permit Bonds</h2>
          <p>Most states and municipalities require contractors to hold a surety bond as a condition of licensure. Common types include contractor license bonds, electrician bonds, plumbing bonds, HVAC bonds, and auto dealer bonds.</p>
        </section>
        <section>
          <h2>Court Bonds</h2>
          <p>Court bonds are required by courts to protect parties in legal proceedings. Types include appeal bonds, executor bonds, guardian bonds, and injunction bonds.</p>
        </section>
        <a href="/quote">Get a Commercial Bond Quote</a>
      </main>`,
  },

  "/about": {
    title: "About Quantum Surety | AI-Powered Surety Bond Agency",
    description:
      "Quantum Surety is an AI-first surety bond agency helping contractors get bonds faster. Learn about our technology, team, and mission to modernize the surety industry.",
    canonical: `${BASE_URL}/about`,
    content: `
      <main>
        <h1>About Quantum Surety</h1>
        <p>Quantum Surety is an AI-powered surety bond agency dedicated to making the bonding process faster, smarter, and more accessible for contractors across the United States. We combine deep surety expertise with modern AI technology to deliver quotes and approvals faster than traditional agencies.</p>
        <p>We specialize in construction bonds — bid bonds, performance bonds, and payment bonds — as well as commercial surety products including license &amp; permit bonds and miscellaneous surety.</p>
      </main>`,
  },

  "/resources": {
    title: "Surety Bond Resources & Guides | Quantum Surety",
    description:
      "Free surety bond guides for contractors. Learn about bond requirements, how to qualify, bond costs, and the difference between bond types.",
    canonical: `${BASE_URL}/resources`,
    content: `
      <main>
        <h1>Surety Bond Resources for Contractors</h1>
        <p>Everything you need to understand surety bonds — from what they are, how they work, how much they cost, and how to qualify even with less-than-perfect credit.</p>
      </main>`,
  },

  "/bonds/texas-contractor": {
    title: "Surety Bonds for Texas Contractors | Quantum Surety",
    description:
      "Texas contractor surety bonds issued fast. Bid bonds, performance bonds, payment bonds, and license bonds for TX general contractors and subcontractors.",
    canonical: `${BASE_URL}/bonds/texas-contractor`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Surety Bonds for Texas Contractors",
      provider: { "@type": "InsuranceAgency", name: "Quantum Surety" },
      description: "Bid bonds, performance bonds, payment bonds, and license bonds for Texas contractors.",
      areaServed: { "@type": "State", name: "Texas" },
    },
    content: `
      <main>
        <h1>Surety Bonds for Texas Contractors</h1>
        <p>Quantum Surety provides fast, AI-powered surety bond solutions for general contractors and subcontractors across Texas. We issue bid bonds, performance bonds, payment bonds, and license & permit bonds — with same-day approvals for qualified contractors.</p>
        <section>
          <h2>Texas Contractor Bond Types</h2>
          <ul>
            <li><strong>Bid Bonds</strong> — Required on Texas public projects. Guarantees you will honor your bid price.</li>
            <li><strong>Performance Bonds</strong> — Required on public contracts over $25,000 under Texas Government Code § 2253.</li>
            <li><strong>Payment Bonds</strong> — Protects subcontractors and suppliers. Required alongside performance bonds on Texas public projects.</li>
            <li><strong>License & Permit Bonds</strong> — Required by TDLR and Texas cities for contractor licensing.</li>
          </ul>
        </section>
        <a href="/quote">Get a Texas Bond Quote</a>
      </main>`,
  },

  "/bonds/bid-bond-texas": {
    title: "Bid Bonds Texas | Same-Day Bid Bond for TX Contractors | Quantum Surety",
    description:
      "Get a Texas bid bond fast. Same-day bid bonds for contractors bidding public and private construction projects across Texas. AI-powered approvals.",
    canonical: `${BASE_URL}/bonds/bid-bond-texas`,
    content: `
      <main>
        <h1>Texas Bid Bonds — Same-Day Issuance</h1>
        <p>Quantum Surety issues bid bonds same-day for qualified Texas contractors. A bid bond guarantees that you will enter a contract at your bid price if you are the selected bidder. Required on most Texas public construction projects.</p>
        <section>
          <h2>Texas Bid Bond Cost</h2>
          <p>Most bid bonds are issued at no charge when issued alongside a performance and payment bond. Standalone bid bonds typically cost $100–$250 depending on the bid amount. Get an exact quote in minutes.</p>
        </section>
        <a href="/quote">Get a Bid Bond Quote</a>
      </main>`,
  },

  "/bonds/performance-bond-texas": {
    title: "Performance Bonds Texas | TX Construction Performance Bonds | Quantum Surety",
    description:
      "Texas performance bonds for general contractors and subcontractors. Fast approvals for public and private construction projects statewide. AI-powered underwriting.",
    canonical: `${BASE_URL}/bonds/performance-bond-texas`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Performance Bonds Texas",
      provider: { "@type": "InsuranceAgency", name: "Quantum Surety" },
      description: "Performance bonds for Texas construction contractors on public and private projects.",
      areaServed: { "@type": "State", name: "Texas" },
    },
    content: `
      <main>
        <h1>Texas Performance Bonds for Contractors</h1>
        <p>A performance bond guarantees that a contractor will complete a construction project according to the contract terms. Texas law requires performance bonds on public contracts over $25,000 under Government Code § 2253. Federal projects over $150,000 require them under the Miller Act.</p>
        <section>
          <h2>Texas Performance Bond Cost</h2>
          <p>Most Texas contractors pay 0.5%–3% of the bond amount annually. A $1,000,000 performance bond typically costs $5,000–$30,000 per year depending on your financial strength, years in business, and project type.</p>
        </section>
        <a href="/quote">Get a Performance Bond Quote</a>
      </main>`,
  },

  "/bonds/license-bond-texas": {
    title: "Texas Contractor License Bonds | License & Permit Bonds TX | Quantum Surety",
    description:
      "Texas contractor license bonds issued same-day. TDLR bonds, electrical bonds, plumbing bonds, HVAC bonds, and all license & permit bonds for TX contractors.",
    canonical: `${BASE_URL}/bonds/license-bond-texas`,
    content: `
      <main>
        <h1>Texas Contractor License Bonds</h1>
        <p>Texas contractors in most trades are required to carry a surety bond as a condition of obtaining a state or city license. Quantum Surety issues TDLR bonds, electrical contractor bonds, plumbing bonds, HVAC bonds, general contractor bonds, and all other Texas license & permit bonds — same-day, delivered by email.</p>
        <section>
          <h2>Common Texas License Bond Types</h2>
          <ul>
            <li>TDLR Contractor Bond — Electricians, HVAC, plumbers licensed through TDLR</li>
            <li>Electrical Contractor Bond — Required by Houston, Dallas, Austin, San Antonio city licensing</li>
            <li>Plumbing Contractor Bond — Texas State Board of Plumbing Examiners requirement</li>
            <li>HVAC Contractor Bond — TDLR Air Conditioning & Refrigeration license requirement</li>
            <li>General Contractor Bond — City licensing requirements across major Texas metros</li>
            <li>Auto Dealer Bond — Texas DMV dealer license requirement ($25,000–$50,000)</li>
          </ul>
        </section>
        <a href="/quote">Get My License Bond</a>
      </main>`,
  },

  "/bonds/bmc-84-freight-broker": {
    title: "BMC-84 Freight Broker Bond | $75,000 FMCSA Bond | Quantum Surety",
    description:
      "Get your BMC-84 freight broker surety bond fast. $75,000 FMCSA-required bond for freight brokers and forwarders. Rates from $938/year. Same-day filing with FMCSA. AI-powered approvals.",
    canonical: `${BASE_URL}/bonds/bmc-84-freight-broker`,
    content: `
      <main>
        <h1>BMC-84 Freight Broker Bond</h1>
        <p>The $75,000 FMCSA surety bond every freight broker needs to operate legally. AI-powered approvals, same-day FMCSA filing, rates from $938/year.</p>
        <p>Previously on a BMC-85 trust? New FMCSA rules effective January 2026 — switching to BMC-84 is fast and affordable.</p>
        <section>
          <h2>What is a BMC-84 Bond?</h2>
          <p>A BMC-84 is the surety bond required by the Federal Motor Carrier Safety Administration (FMCSA) for all licensed freight brokers and freight forwarders operating in the United States. The bond amount is $75,000 and it must be on file with the FMCSA before your broker license is activated.</p>
        </section>
        <section>
          <h2>BMC-84 Bond Rates</h2>
          <p>Rates start at $938 per year for freight brokers with good credit and established business history. Electronic FMCSA filing within 24 hours of payment.</p>
        </section>
        <a href="/quote?type=bmc84">Get Your BMC-84 Quote</a>
      </main>`,
  },
};

// ─── Fallback meta ────────────────────────────────────────────────────────────

function getMetaForPath(urlPath: string): PageMeta {
  // Exact match first
  if (PAGE_META[urlPath]) return PAGE_META[urlPath];
  // Prefix match (e.g. /admin/*)
  for (const key of Object.keys(PAGE_META)) {
    if (key !== "/" && urlPath.startsWith(key)) return PAGE_META[key];
  }
  // Default fallback
  return {
    title: "Quantum Surety | AI-Powered Surety Bonds",
    description:
      "Fast, AI-powered surety bonds for contractors — bid bonds, performance bonds, payment bonds, and license bonds nationwide.",
    canonical: `${BASE_URL}${urlPath}`,
  };
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

function buildMetaTags(meta: PageMeta): string {
  const sd = meta.structuredData
    ? `<script type="application/ld+json">${JSON.stringify(meta.structuredData)}</script>`
    : "";

  return `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${meta.canonical}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="${meta.canonical}" />
    <meta property="og:type" content="${meta.ogType ?? "website"}" />
    <meta property="og:site_name" content="Quantum Surety" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="robots" content="index, follow" />
    ${sd}
  `.trim();
}

// ─── Sitemap generator ────────────────────────────────────────────────────────

export function generateSitemap(): string {
  const today = new Date().toISOString().split("T")[0];
  const urls = Object.entries(PAGE_META)
    .map(
      ([path, meta]) => `
  <url>
    <loc>${meta.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// ─── Robots.txt ───────────────────────────────────────────────────────────────

export const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Sitemap: ${BASE_URL}/sitemap.xml
`;

// ─── Main middleware ───────────────────────────────────────────────────────────
// Reads the built index.html and injects SEO content before serving.

export function seoMiddleware(distDir: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const urlPath = req.path;

    // ── Sitemap & robots MUST come before the dot-extension skip ──
    // (sitemap.xml and robots.txt contain dots and would be skipped otherwise)
    if (urlPath === "/sitemap.xml") {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex");
      return res.send(generateSitemap());
    }

    if (urlPath === "/robots.txt") {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.send(ROBOTS_TXT);
    }

    // Skip API routes and all other static assets (js, css, png, ico, etc.)
    if (
      urlPath.startsWith("/api/") ||
      urlPath.startsWith("/assets/") ||
      urlPath.includes(".")
    ) {
      return next();
    }

    // Read the built index.html
    const indexPath = path.join(distDir, "index.html");
    if (!fs.existsSync(indexPath)) {
      return next(); // In dev mode, Vite handles this
    }

    let html = fs.readFileSync(indexPath, "utf-8");
    const meta = getMetaForPath(urlPath);

    // 1. Replace/inject <title> and add meta tags into <head>
    const metaTags = buildMetaTags(meta);
    html = html.replace(
      /<title>.*?<\/title>/,
      "" // remove existing title (we add it in metaTags)
    );
    html = html.replace("</head>", `${metaTags}\n</head>`);

    // 2. Inject crawlable static content BEFORE <div id="root">
    // React will hydrate over it — users see the React app,
    // Google crawlers see real HTML content.
    if (meta.content) {
      const staticBlock = `
        <div id="seo-content" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;">
          ${meta.content}
        </div>`;
      html = html.replace('<div id="root">', `${staticBlock}\n<div id="root">`);
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  };
}
