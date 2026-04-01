/**
 * Quantum Surety - SEO Middleware
 * Injects server-side meta tags, structured data, and crawlable HTML
 * into the index.html shell before it reaches the browser / Google crawler.
 */

import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// ─── Page metadata map ────────────────────────────────────────────────────────

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  structuredData?: object | object[];
  content?: string; // crawlable static HTML (Google sees this)
  noIndex?: boolean;
}

const BASE_URL = "https://quantumsurety.bond";

const NOINDEX_PREFIXES = ["/admin", "/portal", "/api"];
const NOINDEX_EXACT = new Set(["/admin-login", "/admin-setup", "/application", "/chatbot"]);

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


  "/construction": {
    title: "Construction Surety Bonds | Bid, Performance & Payment Bonds | Quantum Surety",
    description:
      "Explore construction surety bond options for contractors, including bid, performance, and payment bonds with fast AI-assisted approvals.",
    canonical: `${BASE_URL}/construction`,
    content: `
      <main>
        <h1>Construction Surety Bonds</h1>
        <p>Learn how bid bonds, performance bonds, and payment bonds protect project owners and contractors across public and private construction projects.</p>
      </main>`,
  },

  "/ai-bond-finder": {
    title: "AI Bond Finder | Match the Right Surety Bond | Quantum Surety",
    description:
      "Use the Quantum Surety AI Bond Finder to identify the right bond type and requirements for your project, trade, and jurisdiction.",
    canonical: `${BASE_URL}/ai-bond-finder`,
    content: `
      <main>
        <h1>AI Bond Finder</h1>
        <p>Answer a few questions and get matched to the right surety bond program, filing requirement, and next steps.</p>
      </main>`,
  },

  "/faq": {
    title: "Surety Bond FAQ | Common Questions Answered | Quantum Surety",
    description:
      "Get answers to common surety bond questions, including costs, approvals, credit requirements, and timelines for contractors.",
    canonical: `${BASE_URL}/faq`,
  },

  "/resources/state-requirements": {
    title: "State Surety Bond Requirements | Quantum Surety",
    description:
      "Review state-by-state surety bond requirements and filing guidance for contractors and licensed businesses.",
    canonical: `${BASE_URL}/resources/state-requirements`,
  },

  "/glossary": {
    title: "Surety Bond Glossary | Terms for Contractors | Quantum Surety",
    description:
      "Definitions of common surety bond terms, underwriting language, and construction bond concepts in plain English.",
    canonical: `${BASE_URL}/glossary`,
  },

  "/renewals": {
    title: "Surety Bond Renewals | Keep Coverage Active | Quantum Surety",
    description:
      "Renew your surety bond on time with renewal reminders, updated terms, and quick online processing.",
    canonical: `${BASE_URL}/renewals`,
  },

  "/obligee-lookup": {
    title: "Obligee Lookup Tool | Verify Bond Obligee Details | Quantum Surety",
    description:
      "Find and verify obligee naming details to reduce bond filing errors and avoid delays in project award or licensing.",
    canonical: `${BASE_URL}/obligee-lookup`,
  },

  "/privacy": {
    title: "Privacy Policy | Quantum Surety",
    description:
      "Read Quantum Surety's privacy policy, including how we collect, use, and protect personal information.",
    canonical: `${BASE_URL}/privacy`,
  },

  "/terms": {
    title: "Terms of Service | Quantum Surety",
    description:
      "Review Quantum Surety's terms of service for website usage, quote requests, and service limitations.",
    canonical: `${BASE_URL}/terms`,
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

  "/bonds/notary-bond-texas": {
    title: "Texas Notary Bond | $50 Instant Online | SB693 Compliant | Quantum Surety",
    description:
      "Get your Texas notary bond instantly online — $50 for the required 4-year, $10,000 bond. 2026 SB693 compliant. TDI-licensed Texas agency. Add E&O insurance. Download and file today.",
    canonical: `${BASE_URL}/bonds/notary-bond-texas`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Texas Notary Public Surety Bond",
        description: "Required 4-year $10,000 Texas notary surety bond. Instant online purchase and download. SB693 compliant.",
        offers: {
          "@type": "Offer",
          price: "50.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Quantum Surety",
            url: BASE_URL,
          },
        },
        brand: { "@type": "Brand", name: "Quantum Surety" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a Texas notary bond?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A Texas notary bond is a $10,000 surety bond required by the Texas Secretary of State for all notary public commissions. It protects the public from financial loss caused by notary misconduct. The bond costs $50 for the full 4-year term.",
            },
          },
          {
            "@type": "Question",
            name: "How much does a Texas notary bond cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A Texas notary bond costs $50 for the full 4-year term. There are no annual renewal fees — it is a one-time payment. No credit check is required.",
            },
          },
          {
            "@type": "Question",
            name: "What changed for Texas notaries in 2026 under SB693?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Effective January 1, 2026, Senate Bill 693 requires all new and renewing Texas notary applicants to complete a mandatory 2-hour education course from the Texas Secretary of State ($20 fee per attempt, 70% passing score). The law also created a new criminal offense for notarizing without personal appearance, made notary journals legally required, and increased record retention to 10 years. The bond requirement is unchanged — still $10,000 for $50.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need E&O insurance in addition to a notary bond?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The notary bond is required by law but protects the public, not you. Errors and Omissions (E&O) insurance protects you personally against lawsuits for unintentional mistakes. Most mobile notaries and signing agents carry both. E&O insurance is available to add at checkout.",
            },
          },
          {
            "@type": "Question",
            name: "How do I file my Texas notary bond?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "After purchasing your bond, you upload the completed Form 2301-B through the Texas Secretary of State SOS Portal Notary System as part of your notary application. Quantum Surety provides step-by-step filing instructions with every bond purchase.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a credit check for a Texas notary bond?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Texas notary bonds are issued without a credit check. Anyone who meets Texas eligibility requirements can purchase a bond instantly.",
            },
          },
        ],
      },
    ],
    content: `
      <main>
        <h1>Texas Notary Bond — $50, Instant Online</h1>
        <p>Get your required 4-year, $10,000 Texas notary public surety bond instantly. Quantum Surety issues Texas notary bonds for $50 — no credit check, instant download, 24/7 availability. File today with the Texas Secretary of State.</p>
        <section>
          <h2>What is a Texas Notary Bond?</h2>
          <p>A Texas notary bond is a $10,000 surety bond required by the Texas Secretary of State for all notary public commissions. It protects the public from financial loss caused by notary errors or misconduct. The bond costs $50 for the full 4-year term and runs concurrent with your notary commission.</p>
        </section>
        <section>
          <h2>2026 Texas Notary Law Changes (Senate Bill 693)</h2>
          <p>Effective January 1, 2026, Texas Senate Bill 693 requires all new and renewing Texas notary applicants to complete a mandatory education course provided by the Texas Secretary of State (up to 2 hours, $20 fee per attempt). The bond requirement is unchanged — still a 4-year $10,000 bond for $50. New criminal penalties apply for improper notarizations. Record retention increased to 10 years.</p>
        </section>
        <section>
          <h2>Texas Notary Bond Requirements</h2>
          <ul>
            <li>Bond amount: $10,000</li>
            <li>Bond term: 4 years (concurrent with commission)</li>
            <li>Bond cost: $50 flat — no credit check required</li>
            <li>Must be issued by a surety company licensed in Texas</li>
            <li>Filed via the Texas SOS Portal Notary System</li>
          </ul>
        </section>
        <section>
          <h2>Notary Bond vs E&O Insurance</h2>
          <p>The notary bond protects the public — not the notary. Errors and Omissions (E&O) insurance protects the notary against personal liability for unintentional mistakes. Most mobile notaries and signing agents carry both. E&O insurance is available to add at checkout alongside your bond.</p>
        </section>
        <section>
          <h2>Notary Bonds in Neighboring States</h2>
          <ul>
            <li><a href="/bonds/notary-bond-oklahoma">Oklahoma Notary Bond</a> — $1,000 bond, 4-year term</li>
            <li><a href="/bonds/notary-bond-louisiana">Louisiana Notary Bond</a> — $10,000–$50,000 depending on parish</li>
            <li><a href="/bonds/notary-bond-arkansas">Arkansas Notary Bond</a> — $7,500 bond, 10-year term</li>
            <li><a href="/bonds/notary-bond-new-mexico">New Mexico Notary Bond</a> — $10,000 bond, 4-year term</li>
          </ul>
        </section>
        <a href="/quote?type=notary">Get My Texas Notary Bond — $50</a>
      </main>`,
  },

  "/blog": {
    title: "Texas Surety Bond Blog | Guides & Requirements | Quantum Surety",
    description:
      "Texas surety bond guides, notary bond requirements, SB693 2026 law changes, and licensing tips for Texas small business owners. Written by a TDI-licensed Texas surety agency.",
    canonical: `${BASE_URL}/blog`,
    ogType: "website",
    content: `
      <main>
        <h1>Texas Surety Bond Blog</h1>
        <p>Straight-talk guides on Texas bond requirements, law changes, and licensing — written by Quantum Surety, a TDI-licensed Texas surety bond agency.</p>
        <ul>
          <li><a href="/blog/texas-notary-bond-sb693-2026-requirements">Texas Notary Bond 2026: What SB693 Changes for New and Renewing Notaries</a></li>
          <li><a href="/blog/texas-notary-bond-cost-2026">How Much Does a Texas Notary Bond Cost in 2026?</a></li>
          <li><a href="/blog/texas-notary-vs-notary-signing-agent">Texas Notary vs. Notary Signing Agent: What's the Difference?</a></li>
        </ul>
      </main>`,
  },

  "/blog/texas-notary-bond-sb693-2026-requirements": {
    title: "Texas Notary Bond 2026: What SB693 Changes for New & Renewing Notaries | Quantum Surety",
    description:
      "Senate Bill 693 took effect Jan 1, 2026 — mandatory 2-hour education, new criminal penalties, 10-year record retention. Here's exactly what changes, what stays the same, and how to get your bond.",
    canonical: `${BASE_URL}/blog/texas-notary-bond-sb693-2026-requirements`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Texas Notary Bond Requirements 2026: What SB693 Changes for New and Renewing Notaries",
      description:
        "Senate Bill 693 took effect January 1, 2026 and changed Texas notary law significantly — mandatory education, new criminal penalties, 10-year record retention.",
      datePublished: "2026-03-15",
      dateModified: "2026-03-15",
      author: {
        "@type": "Organization",
        name: "Quantum Surety",
        url: "https://quantumsurety.bond",
      },
      publisher: {
        "@type": "Organization",
        name: "Quantum Surety",
        url: "https://quantumsurety.bond",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/blog/texas-notary-bond-sb693-2026-requirements`,
      },
      about: {
        "@type": "Thing",
        name: "Texas Notary Bond SB693 2026",
      },
    },
    content: `
      <main>
        <h1>Texas Notary Bond Requirements 2026: What SB693 Changes for New and Renewing Notaries</h1>
        <p>Senate Bill 693 became law on September 1, 2025, with key requirements effective January 1, 2026. If you are a Texas notary — or about to become one — here is what changed, what did not, and what you need to do right now.</p>
        <section>
          <h2>What is Texas SB693?</h2>
          <p>Texas Senate Bill 693 (89th Legislature, 2025) is a comprehensive update to Texas notary public statutes. It created mandatory education requirements, new criminal penalties for improper notarization, a 10-year journal retention requirement, and expanded Remote Online Notarization (RON) authorization.</p>
        </section>
        <section>
          <h2>What changed on January 1, 2026</h2>
          <ul>
            <li><strong>Mandatory education:</strong> All new and renewing notary applicants must complete a 2-hour education course from the Texas Secretary of State ($20 per attempt, 70% passing score required).</li>
            <li><strong>New criminal offense:</strong> Notarizing a document without the signer personally appearing is now a criminal offense.</li>
            <li><strong>Journal now required:</strong> A notary journal is legally required and records must be kept for 10 years from the date of each notarial act.</li>
            <li><strong>Expanded RON:</strong> Remote Online Notarization framework expanded and clarified.</li>
          </ul>
        </section>
        <section>
          <h2>What did NOT change — the notary bond</h2>
          <p>The Texas notary bond requirement is unchanged. The bond is still $10,000 for 4 years and costs $50 flat. No credit check required. Must be issued by a TDI-licensed surety company and filed via the Texas SOS Portal Notary System.</p>
        </section>
        <section>
          <h2>How to become a Texas notary in 2026</h2>
          <ol>
            <li>Complete the SOS education course and assessment ($20 fee)</li>
            <li>Purchase your $10,000 Texas notary surety bond ($50 at Quantum Surety)</li>
            <li>Submit your application via the Texas SOS Portal, uploading the completed bond form</li>
            <li>Pay the $21 state application fee</li>
            <li>Take your oath of office with your county clerk</li>
            <li>Purchase your notary seal and journal (now legally required)</li>
          </ol>
        </section>
        <a href="/quote?type=notary">Get My Texas Notary Bond — $50</a>
        <a href="/bonds/notary-bond-texas">Texas Notary Bond Product Page</a>
      </main>`,
  },

  "/blog/texas-notary-bond-cost-2026": {
    title: "How Much Does a Texas Notary Bond Cost in 2026? | Quantum Surety",
    description:
      "A Texas notary bond costs $50 for the full 4-year term — no credit check, no annual renewal. Complete cost breakdown including SOS fees, education, seal, journal, and E&O insurance.",
    canonical: `${BASE_URL}/blog/texas-notary-bond-cost-2026`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How Much Does a Texas Notary Bond Cost in 2026?",
      description:
        "A Texas notary bond costs $50 for the full 4-year term. Complete cost breakdown for 2026 including SOS fees, education requirement, and E&O insurance.",
      datePublished: "2026-03-20",
      dateModified: "2026-03-20",
      author: {
        "@type": "Organization",
        name: "Quantum Surety",
        url: "https://quantumsurety.bond",
      },
      publisher: {
        "@type": "Organization",
        name: "Quantum Surety",
        url: "https://quantumsurety.bond",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/blog/texas-notary-bond-cost-2026`,
      },
    },
    content: `
      <main>
        <h1>How Much Does a Texas Notary Bond Cost in 2026?</h1>
        <p>A Texas notary bond costs $50 for the full 4-year commission term. There is no credit check and no annual renewal — $50 is a one-time payment covering your entire commission period.</p>
        <section>
          <h2>Complete Texas notary cost breakdown (2026)</h2>
          <ul>
            <li>Education course (SOS, new in 2026): $20 per attempt</li>
            <li>Texas notary bond (4-year, $10,000): $50</li>
            <li>State application fee (SOS): $21</li>
            <li>Notary seal / stamp: $17–$35</li>
            <li>Notary journal (now legally required): $8–$20</li>
            <li>E&O insurance (recommended): $40–$100 for 4 years</li>
          </ul>
          <p>Minimum total (bond + SOS fees only): approximately $91. Typical total with all required items and E&O: $150–$200.</p>
        </section>
        <section>
          <h2>Why E&O insurance matters</h2>
          <p>The notary bond protects the public — not you. E&amp;O insurance protects you personally against lawsuits for unintentional mistakes. Especially important for mobile notaries and notary signing agents handling loan closings or real estate documents.</p>
        </section>
        <a href="/quote?type=notary">Get My Texas Notary Bond — $50</a>
      </main>`,
  },

  "/blog/texas-notary-vs-notary-signing-agent": {
    title: "Texas Notary vs. Notary Signing Agent: What's the Difference? | Quantum Surety",
    description:
      "A Texas notary public and a notary signing agent (NSA) are not the same thing. Learn what each role requires, what bonds and insurance you need, and which path makes sense for your business.",
    canonical: `${BASE_URL}/blog/texas-notary-vs-notary-signing-agent`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Texas Notary vs. Notary Signing Agent: What's the Difference?",
      description:
        "A Texas notary public and a notary signing agent (NSA) are two distinct roles with different training, income potential, and insurance requirements. Here's how they compare.",
      datePublished: "2026-03-25",
      dateModified: "2026-03-25",
      author: {
        "@type": "Organization",
        name: "Quantum Surety",
        url: "https://quantumsurety.bond",
      },
      publisher: {
        "@type": "Organization",
        name: "Quantum Surety",
        url: "https://quantumsurety.bond",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/blog/texas-notary-vs-notary-signing-agent`,
      },
    },
    content: `
      <main>
        <h1>Texas Notary vs. Notary Signing Agent: What's the Difference?</h1>
        <p>Many people use "Texas notary" and "notary signing agent" interchangeably — but they are two distinct roles with different training requirements, income potential, and insurance needs.</p>
        <section>
          <h2>What is a Texas Notary Public?</h2>
          <p>A Texas notary public is a state-commissioned official authorized by the Texas Secretary of State to take acknowledgments, administer oaths, certify copies, take depositions, and perform jurats. The commission lasts 4 years and requires a $10,000 surety bond. Under SB693 (effective January 1, 2026), applicants must also complete a 2-hour education course and pass a 20-question assessment.</p>
        </section>
        <section>
          <h2>What is a Notary Signing Agent (NSA)?</h2>
          <p>A notary signing agent is a notary public with specialized training to handle loan document signings — mortgage closings, refinances, and real estate transactions. NSAs must hold a valid Texas notary commission, complete NSA-specific training, pass a background screening, and typically carry $100,000+ in E&amp;O insurance coverage.</p>
        </section>
        <section>
          <h2>Key differences: Texas Notary vs. Notary Signing Agent</h2>
          <ul>
            <li>Texas notary: general notarizations at $6 per act; NSA: loan signings at $75–$200 per signing</li>
            <li>Both require the $10,000 surety bond ($50 flat, 4-year term)</li>
            <li>NSA requires additional certification, background screen, and higher E&amp;O coverage</li>
            <li>Every NSA must first obtain a Texas notary commission</li>
          </ul>
        </section>
        <section>
          <h2>Bond and insurance requirements</h2>
          <p>Both roles require the same $10,000 Texas notary surety bond — $50 for the full 4-year term, no credit check. E&amp;O insurance is recommended for notaries and typically contractually required for NSAs working with title companies (often $100,000 minimum coverage).</p>
        </section>
        <a href="/bonds/notary-bond-texas">Get your Texas Notary Bond — $50, instant PDF</a>
      </main>`,
  },
};

// ─── Fallback meta ────────────────────────────────────────────────────────────

function getMetaForPath(urlPath: string): PageMeta {
  if (PAGE_META[urlPath]) return PAGE_META[urlPath];
  for (const key of Object.keys(PAGE_META)) {
    if (key !== "/" && urlPath.startsWith(key)) return PAGE_META[key];
  }
  return {
    title: "Quantum Surety | AI-Powered Surety Bonds",
    description:
      "Fast, AI-powered surety bonds for contractors — bid bonds, performance bonds, payment bonds, and license bonds nationwide.",
    canonical: `${BASE_URL}${urlPath}`,
    noIndex: true,
  };
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

function buildMetaTags(meta: PageMeta): string {
  let sd = "";
  if (meta.structuredData) {
    const items = Array.isArray(meta.structuredData)
      ? meta.structuredData
      : [meta.structuredData];
    sd = items
      .map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`)
      .join("\n    ");
  }

  return `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${meta.canonical}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="${meta.canonical}" />
    <meta property="og:type" content="${meta.ogType ?? "website"}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Quantum Surety" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="robots" content="${meta.noIndex ? "noindex, nofollow" : "index, follow"}" />
    ${sd}
  `.trim();
}

// ─── Sitemap generator ────────────────────────────────────────────────────────

export function generateSitemap(): string {
  const today = new Date().toISOString().split("T")[0];

  function getPriority(p: string): string {
    if (p === "/") return "1.0";
    if (p === "/bonds/notary-bond-texas") return "0.9";
    if (p === "/blog") return "0.85";
    if (p.startsWith("/blog/")) return "0.8";
    if (p.startsWith("/bonds/")) return "0.75";
    return "0.6";
  }

  function getChangefreq(p: string): string {
    if (p === "/" || p === "/blog") return "weekly";
    if (p.startsWith("/blog/") || p.startsWith("/bonds/")) return "monthly";
    return "monthly";
  }

  const urls = Object.entries(PAGE_META)
    .map(
      ([p, meta]) => `
  <url>
    <loc>${meta.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getChangefreq(p)}</changefreq>
    <priority>${getPriority(p)}</priority>
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
Disallow: /admin/
Disallow: /admin-login
Disallow: /admin-setup
Disallow: /portal
Disallow: /portal/
Disallow: /application
Disallow: /chatbot
Disallow: /api/
Sitemap: ${BASE_URL}/sitemap.xml
`;

// ─── Main middleware ───────────────────────────────────────────────────────────

export function seoMiddleware(distDir: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const urlPath = req.path;

    if (urlPath === "/sitemap.xml") {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex");
      return res.send(generateSitemap());
    }

    if (urlPath === "/robots.txt") {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.send(ROBOTS_TXT);
    }

    if (
      urlPath.startsWith("/api/") ||
      urlPath.startsWith("/assets/") ||
      urlPath.includes(".")
    ) {
      return next();
    }

    const indexPath = path.join(distDir, "index.html");
    if (!fs.existsSync(indexPath)) {
      return next();
    }

    let html = fs.readFileSync(indexPath, "utf-8");
    const meta = getMetaForPath(urlPath);

    if (NOINDEX_PREFIXES.some((prefix) => urlPath.startsWith(prefix)) || NOINDEX_EXACT.has(urlPath)) {
      meta.noIndex = true;
    }

    // Strip ALL tags the server will re-inject to prevent duplicates.
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, "")
      .replace(/<link\s[^>]*rel=["']canonical["'][^>]*>/gi, "")
      .replace(/<meta\s[^>]*name=["']description["'][^>]*>/gi, "")
      .replace(/<meta\s[^>]*name=["']robots["'][^>]*>/gi, "")
      .replace(/<meta\s[^>]*property=["']og:[^"']*["'][^>]*>/gi, "")
      .replace(/<meta\s[^>]*name=["']twitter:[^"']*["'][^>]*>/gi, "")
      .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, "");

    // Inject fresh, page-specific meta tags before </head>
    const metaTags = buildMetaTags(meta);
    html = html.replace("</head>", `${metaTags}\n</head>`);

    // Inject crawlable static HTML before <div id="root"> (for Google)
    if (meta.content) {
      html = html.replace(
        '<div id="root"></div>',
        `<div id="seo-content" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">${meta.content}</div><div id="root"></div>`
      );
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  };
}
