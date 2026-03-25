/**
 * ADD THESE 4 ENTRIES to the PAGE_META object in server/seo.ts
 * Paste them just before the closing  };  of PAGE_META
 */

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
