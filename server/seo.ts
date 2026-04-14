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
    structuredData: [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["LocalBusiness", "InsuranceAgency", "FinancialService"],
          "@id": `${BASE_URL}/#business`,
          name: "Quantum Surety",
          legalName: "Quantum Surety LLC",
          description:
            "Texas-licensed AI-powered surety bond agency issuing notary bonds, contractor license bonds, freight broker bonds, and commercial surety bonds. TDI-licensed. Instant online issuance. SB693 compliant.",
          url: BASE_URL,
          telephone: "+19723799216",
          email: "info@quantumsurety.bond",
          priceRange: "$",
          currenciesAccepted: "USD",
          paymentAccepted: "Credit Card, Debit Card",
          openingHours: "Mo-Fr 08:00-18:00",
          image: `${BASE_URL}/QS_Logo.png`,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/QS_Logo.png`,
            width: 300,
            height: 300,
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "1416 Bessie Drive",
            addressLocality: "Wylie",
            addressRegion: "TX",
            postalCode: "75098",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 33.036518754008604,
            longitude: -96.58914999489231,
          },
          areaServed: [
            { "@type": "State", name: "Texas" },
            { "@type": "City", name: "Dallas" },
            { "@type": "City", name: "Fort Worth" },
            { "@type": "City", name: "Wylie" },
            { "@type": "City", name: "Plano" },
            { "@type": "City", name: "McKinney" },
            { "@type": "City", name: "Frisco" },
            { "@type": "City", name: "Garland" },
            { "@type": "City", name: "Arlington" },
            { "@type": "City", name: "Houston" },
            { "@type": "City", name: "San Antonio" },
            { "@type": "City", name: "Austin" },
          ],
          serviceArea: { "@type": "State", name: "Texas" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Texas Surety Bond Products",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Texas Notary Bond",
                  description:
                    "$10,000 Texas notary public surety bond. SB693 compliant. $50 flat, instant PDF download, no credit check.",
                  url: `${BASE_URL}/bonds/notary-bond-texas`,
                },
                price: "50.00",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Texas Contractor License Bond",
                  description:
                    "Surety bonds for Texas contractors and tradespeople. Fast approval, same-day issuance.",
                  url: `${BASE_URL}/bonds/license-bond-texas`,
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "BMC-84 Freight Broker Bond",
                  description:
                    "FMCSA-required $75,000 BMC-84 freight broker surety bond with guaranteed FMCSA filing.",
                  url: `${BASE_URL}/bonds/bmc-84-freight-broker-bond`,
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Contract Surety Bonds",
                  description:
                    "Bid bonds, performance bonds, and payment bonds for Texas construction contractors.",
                  url: `${BASE_URL}/bonds/contract`,
                },
              },
            ],
          },
          sameAs: [
            "https://www.linkedin.com/company/quantum-surety-llc",
          ],
          knowsAbout: [
            "Surety Bonds",
            "Texas Notary Bond",
            "SB693 Notary Requirements",
            "BMC-84 Freight Broker Bond",
            "Contractor License Bond",
            "Texas Department of Insurance",
            "FMCSA Bond Filing",
          ],
        },
        {
          "@type": "WebSite",
          "@id": `${BASE_URL}/#website`,
          url: BASE_URL,
          name: "Quantum Surety",
          description: "AI-Powered Texas Surety Bond Agency",
          publisher: { "@id": `${BASE_URL}/#business` },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${BASE_URL}/quote?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does a Texas notary bond cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A Texas notary bond costs $50 for the full 4-year term. There are no annual renewal fees and no credit check is required. The bond amount is $10,000 as required by the Texas Secretary of State.",
          },
        },
        {
          "@type": "Question",
          name: "What is SB693 and how does it affect Texas notaries?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Texas Senate Bill 693 (SB693) took effect January 1, 2026. It requires all new and renewing Texas notary applicants to complete a mandatory 2-hour online education course from the Texas Secretary of State ($20 per attempt, 70% passing score). It also made notary journals legally required with 10-year retention, and created criminal penalties for notarizing without the signer personally present. The $10,000 notary bond requirement is unchanged — still $50 for 4 years.",
          },
        },
        {
          "@type": "Question",
          name: "How quickly can I get a surety bond?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Many bond types — including Texas notary bonds and contractor license bonds — are issued instantly after online purchase. Your bond documents are emailed as a PDF immediately. Larger contract bonds (performance bonds, payment bonds) typically require underwriting and are issued same-day or within 24 hours for qualified contractors.",
          },
        },
        {
          "@type": "Question",
          name: "What surety bonds do Texas contractors need?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Texas contractors typically need one or more of the following: (1) Contractor license bond — required by TDLR and many Texas cities for licensing; (2) Bid bond — required when bidding public construction projects; (3) Performance bond — required on Texas public contracts over $25,000; (4) Payment bond — required alongside performance bonds to protect subcontractors and suppliers. The specific requirements depend on your trade, contract size, and the project owner.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need a surety bond to get a contractor license in Texas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, most contractor trades in Texas require a surety bond as a condition of state or city licensure. TDLR-licensed trades (electricians, HVAC, plumbers) require a bond as part of the licensing process. Many Texas cities — including Dallas, Houston, Austin, and San Antonio — also require a local contractor bond. Bond amounts and requirements vary by trade and jurisdiction.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between a notary bond and E&O insurance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A Texas notary bond protects the public — if a notary makes an error or commits misconduct, the surety pays the damaged party up to $10,000 and then seeks reimbursement from the notary. Errors & Omissions (E&O) insurance protects the notary personally against lawsuits for unintentional mistakes. The bond is required by Texas law; E&O insurance is optional but strongly recommended for mobile notaries and notary signing agents.",
          },
        },
      ],
    },
    ],
    content: `
      <main>
        <h1>Fast, AI-Powered Surety Bonds for Contractors</h1>
        <p>Quantum Surety provides fast, intelligent surety bond solutions for construction contractors across Texas and nationwide. Get bid bonds, performance bonds, payment bonds, and license &amp; permit bonds — with AI-assisted underwriting that delivers quotes in minutes, not days.</p>
        <section>
          <h2>Texas Notary Bond — $50, Instant Download</h2>
          <p>Get your required $10,000 Texas notary public surety bond instantly for $50. No credit check. SB693 compliant for 2026. Issued by Quantum Surety, a TDI-licensed Texas surety agency (License #3480229). Instant PDF delivered by email, ready to file with the Texas Secretary of State.</p>
          <a href="/bonds/notary-bond-texas">Get My Texas Notary Bond — $50</a>
        </section>
        <section>
          <h2>Bond Types We Offer</h2>
          <ul>
            <li><strong>Texas Notary Bond</strong> — $10,000 bond, 4-year term, $50 flat. SB693 compliant. Instant PDF.</li>
            <li><strong>Bid Bonds</strong> — Guarantee your bid is serious and backed by a surety.</li>
            <li><strong>Performance Bonds</strong> — Assure project owners that you will complete the contract.</li>
            <li><strong>Payment Bonds</strong> — Protect subcontractors and suppliers from non-payment.</li>
            <li><strong>License &amp; Permit Bonds</strong> — Required by cities and states for contractor licenses.</li>
            <li><strong>Miscellaneous Surety Bonds</strong> — Court bonds, fidelity bonds, and more.</li>
          </ul>
        </section>
        <section>
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt>How much does a Texas notary bond cost?</dt>
            <dd>A Texas notary bond costs $50 for the full 4-year term — no annual fees, no credit check required.</dd>
            <dt>What is SB693 and how does it affect Texas notaries?</dt>
            <dd>Texas SB693 (effective January 1, 2026) added a mandatory 2-hour education course and 10-year journal retention for all notary applicants and renewals. The $10,000 bond requirement is unchanged at $50.</dd>
            <dt>How quickly can I get a surety bond?</dt>
            <dd>Notary bonds and license bonds are issued instantly. Performance and payment bonds are typically same-day for qualified contractors.</dd>
            <dt>What surety bonds do Texas contractors need?</dt>
            <dd>Most Texas contractors need a license bond for TDLR or city licensing, plus bid, performance, and payment bonds for public construction projects.</dd>
          </dl>
        </section>
        <section>
          <h2>Why Quantum Surety?</h2>
          <ul>
            <li>TDI-licensed Texas surety agency (License #3480229)</li>
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
          <li><a href="/blog/quantum-surety-tdi-licensed-agency-3480229">Quantum Surety Receives TDI Agency License #3480229</a></li>
          <li><a href="/blog/texas-contractor-bond-and-permits">Texas Contractors: Get Your Bond and Pull Your Permits in One Day</a></li>
          <li><a href="/blog/texas-notary-bond-sb693-renewal-2026">Texas Notary Bond Renewal Under SB693 2026: What Every Renewing Notary Must Do</a></li>
          <li><a href="/blog/texas-notary-bond-sb693-2026-requirements">Texas Notary Bond 2026: What SB693 Changes for New and Renewing Notaries</a></li>
          <li><a href="/blog/texas-notary-bond-cost-2026">How Much Does a Texas Notary Bond Cost in 2026?</a></li>
          <li><a href="/blog/texas-notary-vs-notary-signing-agent">Texas Notary vs. Notary Signing Agent: What's the Difference?</a></li>
          <li><a href="/blog/texas-tdlr-contractor-bond-2026">Texas TDLR Contractor Bond 2026: Everything Licensed Tradespeople Need to Know</a></li>
          <li><a href="/blog/texas-contractor-license-bond-cost">How Much Does a Texas Contractor License Bond Cost? (2026 Guide)</a></li>
          <li><a href="/blog/texas-electrical-contractor-bond-requirements">Texas Electrical Contractor Bond Requirements 2026</a></li>
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

  "/blog/texas-contractor-bond-and-permits": {
    title: "Texas Contractors: Get Your Bond and Pull Your Permits in One Day | Quantum Surety",
    description:
      "A practical same-day workflow for DFW contractors: secure your license bond, identify every required permit, and submit with fewer delays.",
    canonical: `${BASE_URL}/blog/texas-contractor-bond-and-permits`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Texas Contractors: Get Your Bond and Pull Your Permits in One Day",
      description:
        "A practical same-day workflow for DFW contractors: secure your license bond, identify every required permit, and submit with fewer delays.",
      datePublished: "2026-04-05",
      dateModified: "2026-04-05",
      author: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      publisher: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/texas-contractor-bond-and-permits` },
    },
    content: `
      <main>
        <h1>Texas Contractors: Get Your Bond and Pull Your Permits in One Day</h1>
        <p>A practical same-day workflow for DFW contractors: secure your license bond, identify every required permit, and submit with fewer delays.</p>
        <section>
          <h2>Step 1: Get your Texas contractor license bond</h2>
          <p>Most Texas cities and TDLR require a surety bond as a condition of contractor licensing. Quantum Surety issues contractor license bonds same-day — instant download, no credit check for standard amounts.</p>
        </section>
        <section>
          <h2>Step 2: Identify required permits for your project</h2>
          <p>Permit requirements vary by city, trade, and project type. DFW contractors should check with the city building department and use Texas's Permit Pilot system where available.</p>
        </section>
        <a href="/quote">Get Your Texas Contractor Bond</a>
      </main>`,
  },

  "/blog/quantum-surety-tdi-licensed-agency-3480229": {
    title: "Quantum Surety Receives TDI Agency License #3480229 | Quantum Surety",
    description:
      "Quantum Surety LLC is now fully licensed by the Texas Department of Insurance (License #3480229) as a General Lines Property & Casualty agency.",
    canonical: `${BASE_URL}/blog/quantum-surety-tdi-licensed-agency-3480229`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Quantum Surety Receives Texas Department of Insurance Agency License #3480229",
      description:
        "Quantum Surety LLC is now fully licensed by the Texas Department of Insurance (License #3480229) as a General Lines Property & Casualty agency.",
      datePublished: "2026-04-07",
      dateModified: "2026-04-07",
      author: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      publisher: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/quantum-surety-tdi-licensed-agency-3480229` },
    },
    content: `
      <main>
        <h1>Quantum Surety Receives Texas Department of Insurance Agency License #3480229</h1>
        <p>Quantum Surety LLC is now fully licensed by the Texas Department of Insurance, operating under full TDI regulatory oversight as a General Lines Property & Casualty agency. License number: 3480229. Effective April 2026.</p>
        <section>
          <h2>What TDI licensure means for clients</h2>
          <p>TDI licensure means Quantum Surety is held to Texas Insurance Code standards for client fund handling, fee disclosure, and record retention. Clients can verify our license status directly through the TDI public lookup at any time.</p>
        </section>
        <a href="/quote">Get a Bond from a TDI-Licensed Agency</a>
      </main>`,
  },

  "/blog/texas-notary-bond-sb693-renewal-2026": {
    title: "Texas Notary Bond Renewal Under SB693 2026: What Every Renewing Notary Must Do | Quantum Surety",
    description:
      "Renewing your Texas notary commission in 2026? SB693 added a mandatory education course and journal requirement that now apply to renewals. Step-by-step checklist plus 5 FAQs.",
    canonical: `${BASE_URL}/blog/texas-notary-bond-sb693-renewal-2026`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Texas Notary Bond Renewal Under SB693 2026: What Every Renewing Notary Must Do",
      description:
        "Renewing your Texas notary commission in 2026? SB693 added a mandatory education course and journal requirement that apply to renewals. Step-by-step checklist plus 5 FAQs.",
      datePublished: "2026-04-09",
      dateModified: "2026-04-09",
      author: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      publisher: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/texas-notary-bond-sb693-renewal-2026` },
      about: { "@type": "Thing", name: "Texas Notary Bond SB693 Renewal 2026" },
    },
    content: `
      <main>
        <h1>Texas Notary Bond Renewal Under SB693 2026: What Every Renewing Notary Must Do</h1>
        <p>If your Texas notary commission expires in 2026, you are renewing under SB693 rules. Senate Bill 693 added a mandatory education course and journal requirement that now apply to all renewals — not just new applicants.</p>
        <section>
          <h2>What SB693 adds for renewing notaries</h2>
          <ul>
            <li><strong>Mandatory education course:</strong> All renewing notaries must complete the 2-hour SOS education course and pass the 20-question assessment (70% minimum, $20 per attempt) before submitting a renewal application.</li>
            <li><strong>Notary journal legally required:</strong> A journal is now mandatory. Records must be retained for 10 years from the date of each notarial act.</li>
            <li><strong>New criminal liability:</strong> Notarizing without the signer personally appearing is now a criminal offense.</li>
          </ul>
        </section>
        <section>
          <h2>The $10,000 bond is still required — still $50</h2>
          <p>The Texas notary surety bond requirement is unchanged under SB693. A new $10,000 bond is required for each 4-year commission term. Cost: $50 flat, no credit check, instant download from Quantum Surety.</p>
        </section>
        <section>
          <h2>Step-by-step renewal checklist under SB693</h2>
          <ol>
            <li>Complete the SOS education course (new in 2026)</li>
            <li>Confirm journal records are compliant</li>
            <li>Purchase a new $10,000 notary surety bond ($50)</li>
            <li>Submit renewal via Texas SOS Portal — upload bond form, pay $21 state fee</li>
            <li>Take oath of office with county clerk</li>
            <li>Order a new notary seal with updated expiration date</li>
          </ol>
        </section>
        <a href="/quote?type=notary">Get My Renewal Bond — $50</a>
      </main>`,
  },

  "/sb-693-notary-bond-requirements-2026": {
    title: "Texas SB693 Notary Bond Requirements 2026 — Complete Guide | Quantum Surety",
    description:
      "Senate Bill 693 took effect January 1, 2026. Complete guide to Texas SB693 notary bond requirements: mandatory education, journal rules, criminal penalties, and how to get your $50 bond.",
    canonical: `${BASE_URL}/sb-693-notary-bond-requirements-2026`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Texas SB693 Notary Bond Requirements 2026 — Complete Guide",
      description:
        "Senate Bill 693 took effect January 1, 2026. Complete guide to Texas SB693 notary bond requirements, including mandatory education, journal rules, and how to get your bond.",
      datePublished: "2026-03-15",
      dateModified: "2026-04-09",
      author: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      publisher: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/sb-693-notary-bond-requirements-2026` },
    },
    content: `
      <main>
        <h1>Texas SB693 Notary Bond Requirements 2026</h1>
        <p>Senate Bill 693 became effective September 1, 2025, with key requirements taking effect January 1, 2026. This guide covers everything Texas notaries need to know about SB693 compliance and the notary bond requirement.</p>
        <section>
          <h2>SB693 key changes</h2>
          <ul>
            <li>Mandatory 2-hour education course from the Texas Secretary of State ($20 per attempt)</li>
            <li>New criminal offense for notarizing without personal appearance</li>
            <li>Notary journal now legally required — 10-year record retention</li>
            <li>Expanded Remote Online Notarization (RON) framework</li>
          </ul>
        </section>
        <section>
          <h2>Texas notary bond — unchanged at $50</h2>
          <p>SB693 did not change the notary bond requirement. The bond is still $10,000 for 4 years and costs $50 flat from a TDI-licensed surety agency like Quantum Surety. No credit check required.</p>
        </section>
        <a href="/quote?type=notary">Get My Texas Notary Bond — $50</a>
        <a href="/bonds/notary-bond-texas">Texas Notary Bond Product Page</a>
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

  "/bonds/tdlr-bond-texas": {
    title: "TDLR Contractor Bond Texas | Electrician, HVAC & License Bonds | Quantum Surety",
    description:
      "Get your Texas TDLR contractor bond same-day. Required for electricians, HVAC techs, irrigators, and other TDLR-licensed trades. Rates from $100/yr. Instant PDF delivery.",
    canonical: `${BASE_URL}/bonds/tdlr-bond-texas`,
    content: `
      <main>
        <h1>Texas TDLR Contractor Bond</h1>
        <p>Required by the Texas Department of Licensing and Regulation (TDLR) for electricians, HVAC technicians, irrigators, boiler inspectors, elevator mechanics, and other licensed trades. Get your bond same-day — delivered by email, ready to file with TDLR.</p>
        <section>
          <h2>TDLR Trades That Require a Bond</h2>
          <ul>
            <li>Electrician — TDLR Electrical Contractor License ($10,000)</li>
            <li>HVAC / AC Technician — TDLR Air Conditioning &amp; Refrigeration ($10,000)</li>
            <li>Plumber — Texas State Board of Plumbing Examiners ($10,000)</li>
            <li>Boiler Inspector — TDLR Boiler Program ($10,000)</li>
            <li>Elevator Mechanic — TDLR Elevator Safety ($10,000)</li>
            <li>Irrigator — TDLR Irrigator License ($10,000)</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My TDLR Bond</a>
      </main>`,
  },

  "/bonds/electrical-contractor-bond-texas": {
    title: "Electrical Contractor Bond Texas | City & TDLR License Bond | Quantum Surety",
    description:
      "Get your Texas electrical contractor bond same-day. Required for city electrical licenses (Dallas, Houston, Austin) and TDLR. $10,000 bond from $100/yr. Instant PDF.",
    canonical: `${BASE_URL}/bonds/electrical-contractor-bond-texas`,
    content: `
      <main>
        <h1>Texas Electrical Contractor Bond</h1>
        <p>Required for licensed electricians operating in Texas at the state (TDLR) and city levels. Get bonded same-day with instant PDF delivery.</p>
        <section>
          <h2>Where Required</h2>
          <ul>
            <li>Dallas — City of Dallas Development Services ($10,000)</li>
            <li>Houston — Houston Permitting Center ($10,000)</li>
            <li>Austin — City of Austin Development Services ($10,000)</li>
            <li>San Antonio — City of San Antonio Development Services ($10,000)</li>
            <li>Fort Worth — City of Fort Worth Development Services ($10,000)</li>
            <li>TDLR (Statewide) — Texas Dept. of Licensing &amp; Regulation ($10,000)</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My Electrical Bond</a>
      </main>`,
  },

  "/bonds/hvac-bond-texas": {
    title: "HVAC Contractor Bond Texas | AC License Bond | TACLA | Quantum Surety",
    description:
      "Get your Texas HVAC contractor bond same-day. Required for TACLA air conditioning licenses and city HVAC permits. $10,000 bond from $100/yr. Instant PDF delivery.",
    canonical: `${BASE_URL}/bonds/hvac-bond-texas`,
    content: `
      <main>
        <h1>Texas HVAC Contractor Bond</h1>
        <p>Required by TDLR for TACLA air conditioning and refrigeration contractor licenses, and by most Texas cities for HVAC permit-pulling. Same-day issuance, instant PDF.</p>
        <section>
          <h2>TACLA License Types Requiring a Bond</h2>
          <ul>
            <li>TACLA Air Conditioning Contractor — TDLR ($10,000)</li>
            <li>TACLA Technician License — TDLR ($10,000)</li>
            <li>City of Dallas HVAC License ($10,000)</li>
            <li>City of Houston HVAC License ($10,000)</li>
            <li>City of Austin HVAC License ($10,000)</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My HVAC Bond</a>
      </main>`,
  },

  "/bonds/plumbing-contractor-bond-texas": {
    title: "Plumbing Contractor Bond Texas | TSBPE License Bond | Quantum Surety",
    description:
      "Get your Texas plumbing contractor bond same-day. Required by TSBPE for Master Plumber licenses and Texas city permits. $10,000 bond from $100/yr. Instant PDF.",
    canonical: `${BASE_URL}/bonds/plumbing-contractor-bond-texas`,
    content: `
      <main>
        <h1>Texas Plumbing Contractor Bond</h1>
        <p>Required by the Texas State Board of Plumbing Examiners (TSBPE) for Master Plumber licenses and by Texas cities for local plumbing permits. Same-day issuance, instant PDF.</p>
        <section>
          <h2>License Types Requiring a Bond</h2>
          <ul>
            <li>Master Plumber — TSBPE ($10,000)</li>
            <li>Journeyman Plumber — TSBPE ($10,000)</li>
            <li>Plumbing Inspector — TSBPE ($10,000)</li>
            <li>Drain Cleaner — TSBPE ($10,000)</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My Plumbing Bond</a>
      </main>`,
  },

  "/bonds/auto-dealer-bond-texas": {
    title: "Texas Auto Dealer Bond | Motor Vehicle Dealer License Bond | Quantum Surety",
    description:
      "Get your Texas auto dealer bond same-day. Required by TxDMV for all motor vehicle dealer licenses. $25,000 bond, rates from $250/yr. Instant PDF delivery.",
    canonical: `${BASE_URL}/bonds/auto-dealer-bond-texas`,
    content: `
      <main>
        <h1>Texas Auto Dealer Bond</h1>
        <p>Required by the Texas Department of Motor Vehicles (TxDMV) for all motor vehicle dealer licenses — independent, franchise, wholesale, and used car dealers. Same-day issuance, instant PDF.</p>
        <section>
          <h2>Dealer Types Requiring a Bond</h2>
          <ul>
            <li>Independent Motor Vehicle Dealer — TxDMV ($25,000)</li>
            <li>Franchised Motor Vehicle Dealer — TxDMV ($25,000)</li>
            <li>Wholesale Motor Vehicle Dealer — TxDMV ($25,000)</li>
            <li>Motorcycle Dealer — TxDMV ($25,000)</li>
            <li>Used Car Dealer — TxDMV ($25,000)</li>
          </ul>
        </section>
        <a href="/quote?type=auto_dealer&amp;state=TX">Get My Dealer Bond</a>
      </main>`,
  },

  "/bonds/contractor-bond-dallas": {
    title: "Contractor Bond Dallas TX | City License Bond | Quantum Surety",
    description:
      "Get your Dallas contractor bond same-day. Required by the City of Dallas for general, electrical, HVAC, plumbing, and roofing contractor licenses. From $100/yr. Instant PDF.",
    canonical: `${BASE_URL}/bonds/contractor-bond-dallas`,
    content: `
      <main>
        <h1>Contractor Bond — Dallas, Texas</h1>
        <p>Required by the City of Dallas Development Services for licensed contractors across all trades. Get bonded same-day with instant PDF delivery.</p>
        <section>
          <h2>Dallas Contractor Bonds by Trade</h2>
          <ul>
            <li>General Contractor Bond — $25,000</li>
            <li>Electrical Contractor Bond — $10,000</li>
            <li>HVAC / AC Contractor Bond — $10,000</li>
            <li>Plumbing Contractor Bond — $10,000</li>
            <li>Roofing Contractor Bond — $10,000</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My Dallas Bond</a>
      </main>`,
  },

  "/bonds/contractor-bond-houston": {
    title: "Contractor Bond Houston TX | City License Bond | Quantum Surety",
    description:
      "Get your Houston contractor bond same-day. Required by the City of Houston for general, electrical, HVAC, plumbing, and roofing contractor licenses. From $100/yr. Instant PDF.",
    canonical: `${BASE_URL}/bonds/contractor-bond-houston`,
    content: `
      <main>
        <h1>Contractor Bond — Houston, Texas</h1>
        <p>Required by the Houston Permitting Center for licensed contractors across all trades. Get bonded same-day with instant PDF delivery.</p>
        <section>
          <h2>Houston Contractor Bonds by Trade</h2>
          <ul>
            <li>General Contractor Bond — $25,000</li>
            <li>Electrical Contractor Bond — $10,000</li>
            <li>HVAC / AC Contractor Bond — $10,000</li>
            <li>Plumbing Contractor Bond — $10,000</li>
            <li>Fire Suppression Contractor Bond — $10,000</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My Houston Bond</a>
      </main>`,
  },

  "/bonds/contractor-bond-austin": {
    title: "Contractor Bond Austin TX | City License Bond | Quantum Surety",
    description:
      "Get your Austin contractor bond same-day. Required by the City of Austin for general, electrical, HVAC, plumbing, and irrigation contractor licenses. From $100/yr. Instant PDF.",
    canonical: `${BASE_URL}/bonds/contractor-bond-austin`,
    content: `
      <main>
        <h1>Contractor Bond — Austin, Texas</h1>
        <p>Required by the City of Austin Development Services for licensed contractors across all trades. Get bonded same-day with instant PDF delivery.</p>
        <section>
          <h2>Austin Contractor Bonds by Trade</h2>
          <ul>
            <li>General Contractor Bond — $25,000</li>
            <li>Electrical Contractor Bond — $10,000</li>
            <li>HVAC / AC Contractor Bond — $10,000</li>
            <li>Plumbing Contractor Bond — $10,000</li>
            <li>Irrigation Contractor Bond — $10,000</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My Austin Bond</a>
      </main>`,
  },

  "/bonds/contractor-bond-san-antonio": {
    title: "Contractor Bond San Antonio TX | City License Bond | Quantum Surety",
    description:
      "Get your San Antonio contractor bond same-day. Required by the City of San Antonio for general, electrical, HVAC, plumbing, and roofing contractor licenses. From $100/yr. Instant PDF.",
    canonical: `${BASE_URL}/bonds/contractor-bond-san-antonio`,
    content: `
      <main>
        <h1>Contractor Bond — San Antonio, Texas</h1>
        <p>Required by San Antonio Development Services for licensed contractors across all trades. Get bonded same-day with instant PDF delivery.</p>
        <section>
          <h2>San Antonio Contractor Bonds by Trade</h2>
          <ul>
            <li>General Contractor Bond — $25,000</li>
            <li>Electrical Contractor Bond — $10,000</li>
            <li>HVAC / AC Contractor Bond — $10,000</li>
            <li>Plumbing Contractor Bond — $10,000</li>
            <li>Roofing Contractor Bond — $10,000</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My San Antonio Bond</a>
      </main>`,
  },

  "/bonds/contractor-bond-fort-worth": {
    title: "Contractor Bond Fort Worth TX | City License Bond | Quantum Surety",
    description:
      "Get your Fort Worth contractor bond same-day. Required by the City of Fort Worth for general, electrical, HVAC, plumbing, and mechanical contractor licenses. From $100/yr. Instant PDF.",
    canonical: `${BASE_URL}/bonds/contractor-bond-fort-worth`,
    content: `
      <main>
        <h1>Contractor Bond — Fort Worth, Texas</h1>
        <p>Required by Fort Worth Development Services for licensed contractors across all trades. Get bonded same-day with instant PDF delivery.</p>
        <section>
          <h2>Fort Worth Contractor Bonds by Trade</h2>
          <ul>
            <li>General Contractor Bond — $25,000</li>
            <li>Electrical Contractor Bond — $10,000</li>
            <li>HVAC / AC Contractor Bond — $10,000</li>
            <li>Plumbing Contractor Bond — $10,000</li>
            <li>Mechanical Contractor Bond — $10,000</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My Fort Worth Bond</a>
      </main>`,
  },

  "/bonds/notary-eo-insurance": {
    title: "Notary E&O Insurance Texas | Errors & Omissions vs. Bond | Quantum Surety",
    description:
      "Understand the difference between a Texas notary bond and E&O insurance. Learn what E&O insurance covers, whether it's required, and how to protect yourself as a Texas notary public.",
    canonical: `${BASE_URL}/bonds/notary-eo-insurance`,
    content: `
      <main>
        <h1>Notary E&amp;O Insurance in Texas — What It Is and Why It Matters</h1>
        <p>Your Texas notary bond protects the public. Errors &amp; Omissions (E&amp;O) insurance protects you. Understand the difference and make sure you have the right coverage.</p>
        <section>
          <h2>Notary Bond vs. E&O Insurance</h2>
          <ul>
            <li>Notary bond: required by law, protects the public, $10,000 for $50/4 years</li>
            <li>E&amp;O insurance: optional but recommended, protects you personally from claims</li>
            <li>Both recommended for notary signing agents and mobile notaries</li>
          </ul>
        </section>
        <a href="/bonds/notary-bond-texas">Get My Texas Notary Bond — $50</a>
      </main>`,
  },

  "/blog/texas-tdlr-contractor-bond-2026": {
    title: "Texas TDLR Contractor Bond 2026 — What Every Licensed Trade Needs to Know | Quantum Surety",
    description:
      "Complete guide to Texas TDLR contractor bonds in 2026. Which trades require a bond, how much it costs, how to file, and what changes are coming. Updated for 2026.",
    canonical: `${BASE_URL}/blog/texas-tdlr-contractor-bond-2026`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Texas TDLR Contractor Bond 2026: Everything Licensed Tradespeople Need to Know",
      description: "Complete guide to Texas TDLR contractor bonds in 2026. Which trades require a bond, how much it costs, how to file, and what changes are coming.",
      datePublished: "2026-04-09",
      dateModified: "2026-04-09",
      author: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      publisher: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/texas-tdlr-contractor-bond-2026` },
    },
    content: `
      <main>
        <h1>Texas TDLR Contractor Bond 2026: Everything Licensed Tradespeople Need to Know</h1>
        <p>TDLR requires a $10,000 surety bond for most contractor license types. It costs $100–$300/year. You get it from a licensed surety agency, file the certificate with TDLR, and you're done.</p>
        <section>
          <h2>TDLR Trades Requiring a Bond in 2026</h2>
          <ul>
            <li>Electrician / Electrical Contractor — $10,000</li>
            <li>HVAC / AC Technician (TACLA) — $10,000</li>
            <li>Irrigator — $10,000</li>
            <li>Boiler Inspector — $10,000</li>
            <li>Elevator Mechanic — $10,000</li>
          </ul>
        </section>
        <a href="/bonds/tdlr-bond-texas">Get My TDLR Bond</a>
      </main>`,
  },

  "/blog/texas-contractor-license-bond-cost": {
    title: "How Much Does a Texas Contractor License Bond Cost? (2026 Guide) | Quantum Surety",
    description:
      "Find out exactly what a Texas contractor license bond costs in 2026. Rates by trade, credit score, and bond amount. TDLR, city bonds, and electrician/HVAC/plumbing explained.",
    canonical: `${BASE_URL}/blog/texas-contractor-license-bond-cost`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How Much Does a Texas Contractor License Bond Cost? (2026 Guide)",
      description: "Texas contractor license bond costs broken down by trade, bond amount, and credit score for 2026.",
      datePublished: "2026-04-09",
      dateModified: "2026-04-09",
      author: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      publisher: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/texas-contractor-license-bond-cost` },
    },
    content: `
      <main>
        <h1>How Much Does a Texas Contractor License Bond Cost? (2026 Guide)</h1>
        <p>Most Texas contractor license bonds cost $100–$300/year for a $10,000 bond. Auto dealer bonds ($25,000) run $250–$500/year. You pay a small annual premium — not the full bond amount.</p>
        <section>
          <h2>Texas Contractor Bond Costs by Trade (2026)</h2>
          <ul>
            <li>Electrician (TDLR) — $10,000 bond, $100–$300/year</li>
            <li>HVAC / AC (TDLR) — $10,000 bond, $100–$300/year</li>
            <li>Plumber (TSBPE) — $10,000 bond, $100–$300/year</li>
            <li>General Contractor (City) — $25,000 bond, $250–$500/year</li>
            <li>Auto Dealer (TxDMV) — $25,000 bond, $250–$600/year</li>
          </ul>
        </section>
        <a href="/quote?type=license&amp;state=TX">Get My Bond Quote</a>
      </main>`,
  },

  "/blog/texas-electrical-contractor-bond-requirements": {
    title: "Texas Electrical Contractor Bond Requirements 2026 | TDLR & City License | Quantum Surety",
    description:
      "Everything Texas electricians need to know about surety bond requirements in 2026. TDLR bond, city bonds (Dallas, Houston, Austin), costs, and how to file. Updated guide.",
    canonical: `${BASE_URL}/blog/texas-electrical-contractor-bond-requirements`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Texas Electrical Contractor Bond Requirements 2026",
      description: "Everything Texas electricians need to know about surety bond requirements in 2026 — TDLR and city-level bonds.",
      datePublished: "2026-04-09",
      dateModified: "2026-04-09",
      author: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      publisher: { "@type": "Organization", name: "Quantum Surety", url: BASE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/texas-electrical-contractor-bond-requirements` },
    },
    content: `
      <main>
        <h1>Texas Electrical Contractor Bond Requirements 2026</h1>
        <p>Texas electricians face bond requirements at two levels: the state (TDLR) and individual cities. This guide breaks down what you need, where to file, and how much it costs.</p>
        <section>
          <h2>TDLR vs. City Bond Requirements</h2>
          <ul>
            <li>TDLR: $10,000 bond required for state electrical contractor license</li>
            <li>Dallas: $10,000 city bond for local electrical contractor license</li>
            <li>Houston: $10,000 city bond for local electrical contractor license</li>
            <li>Austin: $10,000 city bond for local electrical contractor license</li>
            <li>San Antonio: $10,000 city bond for local electrical contractor license</li>
          </ul>
        </section>
        <a href="/bonds/electrical-contractor-bond-texas">Get My Electrical Bond</a>
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
    <meta property="og:image" content="${BASE_URL}/QS_OG_2.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${BASE_URL}/QS_OG_2.png" />
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
