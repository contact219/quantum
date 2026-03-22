/**
 * client/src/hooks/useSEO.ts
 * ===========================
 * Drop-in hook that updates <title> and meta tags on every client-side
 * route change. Works alongside the server-side injection in seo.ts.
 *
 * Usage:
 *   import { useSEO } from "@/hooks/useSEO";
 *   // Inside any page component:
 *   useSEO({
 *     title: "Get a Bond Quote | Quantum Surety",
 *     description: "Fast surety bond quotes for Texas contractors.",
 *   });
 */

import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
}

const BASE_URL = "https://quantumsurety.bond";

export function useSEO({ title, description, canonical, noIndex = false }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper: upsert a <meta> tag
    function setMeta(selector: string, attr: string, value: string) {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    }

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[name="twitter:title"]', "content", title);

    if (canonical) {
      const fullUrl = canonical.startsWith("http")
        ? canonical
        : `${BASE_URL}${canonical}`;
      setMeta('meta[property="og:url"]', "content", fullUrl);
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = fullUrl;
    }

    if (noIndex) {
      setMeta('meta[name="robots"]', "content", "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "content", "index, follow");
    }
  }, [title, description, canonical, noIndex]);
}

// ─── Pre-built page SEO configs ───────────────────────────────────────────────
// Import the one you need in each page component.

export const SEO_PAGES = {
  home: {
    title: "Quantum Surety | AI-Powered Surety Bonds for Texas Contractors",
    description:
      "Get fast, AI-powered surety bonds for contractors in Texas and nationwide. Bid bonds, performance bonds, payment bonds & license bonds — quotes in minutes.",
    canonical: "/",
  },
  quote: {
    title: "Get a Surety Bond Quote | Quantum Surety",
    description:
      "Request a free surety bond quote online. Bid bonds, performance bonds, payment bonds and license bonds for contractors. Fast AI-assisted approvals.",
    canonical: "/quote",
  },
  contractBonds: {
    title: "Contract Surety Bonds | Bid, Performance & Payment Bonds | Quantum Surety",
    description:
      "Contract surety bonds for construction contractors — bid bonds, performance bonds, and payment bonds. Fast approvals for public and private projects.",
    canonical: "/bonds/contract",
  },
  commercialBonds: {
    title: "Commercial Surety Bonds | License & Permit Bonds | Quantum Surety",
    description:
      "Commercial surety bonds including contractor license bonds, permit bonds, and court bonds. Fast online quotes for Texas and nationwide.",
    canonical: "/bonds/commercial",
  },
  about: {
    title: "About Quantum Surety | AI-Powered Surety Bond Agency",
    description:
      "Quantum Surety is an AI-first surety bond agency helping contractors get bonds faster. Learn about our technology and mission.",
    canonical: "/about",
  },
  resources: {
    title: "Surety Bond Resources & Guides | Quantum Surety",
    description:
      "Free surety bond guides for contractors — requirements, costs, qualification tips, and bond type comparisons.",
    canonical: "/resources",
  },
  admin: {
    title: "Admin | Quantum Surety",
    description: "Quantum Surety admin dashboard.",
    canonical: "/admin",
    noIndex: true, // Never index admin pages
  },
} as const;
