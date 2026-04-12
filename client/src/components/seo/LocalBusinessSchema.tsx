import { useEffect } from "react";

const SCHEMA_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "InsuranceAgency", "FinancialService"],
      "@id": "https://quantumsurety.bond/#business",
      name: "Quantum Surety",
      legalName: "Quantum Surety LLC",
      description:
        "Texas-licensed AI-powered surety bond agency issuing notary bonds, contractor license bonds, freight broker bonds, and commercial surety bonds. TDI-licensed. Instant online issuance. SB693 compliant.",
      url: "https://quantumsurety.bond",
      telephone: "+19723799216",
      email: "info@quantumsurety.bond",
      foundingDate: "2024",
      priceRange: "$",
      currenciesAccepted: "USD",
      paymentAccepted: "Credit Card, Debit Card",
      openingHours: "Mo-Fr 08:00-18:00",
      image: "https://quantumsurety.bond/logo.png",
      logo: {
        "@type": "ImageObject",
        url: "https://quantumsurety.bond/logo.png",
        width: 300,
        height: 100,
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
        { "@type": "City", name: "Dallas", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Fort Worth", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Wylie", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Plano", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "McKinney", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Frisco", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Garland", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Arlington", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Houston", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "San Antonio", containedInPlace: { "@type": "State", name: "Texas" } },
        { "@type": "City", name: "Austin", containedInPlace: { "@type": "State", name: "Texas" } },
      ],
      serviceArea: {
        "@type": "State",
        name: "Texas",
      },
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
                "$10,000 Texas notary public surety bond. SB693 compliant. $50 flat, instant PDF download, no credit check. Required for all Texas notaries.",
              url: "https://quantumsurety.bond/bonds/notary-bond-texas",
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
                "Surety bonds for Texas contractors and tradespeople. Required for city and county licensing. Fast approval, same-day issuance for most bond types.",
              url: "https://quantumsurety.bond/bonds/contractor-license-bond",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "BMC-84 Freight Broker Bond",
              description:
                "FMCSA-required $75,000 BMC-84 freight broker surety bond. Fast issuance with guaranteed FMCSA filing.",
              url: "https://quantumsurety.bond/bonds/bmc-84-freight-broker-bond",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Commercial Surety Bonds",
              description:
                "License and permit bonds, court bonds, fidelity bonds, and specialty commercial surety for Texas businesses. Backed by RLI, A+ rated carrier.",
              url: "https://quantumsurety.bond/quote",
            },
          },
        ],
      },
      knowsAbout: [
        "Surety Bonds",
        "Texas Notary Bond",
        "SB693 Notary Requirements",
        "BMC-84 Freight Broker Bond",
        "Contractor License Bond",
        "Texas Department of Insurance",
        "FMCSA Bond Filing",
      ],
      sameAs: ["https://www.linkedin.com/company/quantum-surety-llc"],
    },
    {
      "@type": "WebSite",
      "@id": "https://quantumsurety.bond/#website",
      url: "https://quantumsurety.bond",
      name: "Quantum Surety",
      description: "AI-Powered Texas Surety Bond Agency",
      publisher: {
        "@id": "https://quantumsurety.bond/#business",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://quantumsurety.bond/quote?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export function LocalBusinessSchema() {
  useEffect(() => {
    const existing = document.getElementById("qs-local-schema");
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = "qs-local-schema";
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA_JSON);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("qs-local-schema");
      if (el) {
        el.remove();
      }
    };
  }, []);

  return null;
}

export default LocalBusinessSchema;
