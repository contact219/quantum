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

import { useEffect, useRef } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
}

const BASE_URL = "https://quantumsurety.bond";
const DEFAULT_OG_IMAGE = `${BASE_URL}/QS_OG_2.png`;

export function useSEO({ title, description, canonical, noIndex = false, ogType = "website" }: SEOProps) {
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
      if (selector.includes('name="')) {
        const match = selector.match(/name="([^"]+)"/);
        if (match) el.setAttribute("name", match[1]);
      }
      if (selector.includes('property="')) {
        const match = selector.match(/property="([^"]+)"/);
        if (match) el.setAttribute("property", match[1]);
      }
      el.setAttribute(attr, value);
    }

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:type"]', "content", ogType);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[property="og:image"]', "content", DEFAULT_OG_IMAGE);
    setMeta('meta[name="twitter:image"]', "content", DEFAULT_OG_IMAGE);

    const canonicalPath = canonical ?? window.location.pathname;
    const fullUrl = canonicalPath.startsWith("http")
      ? canonicalPath
      : `${BASE_URL}${canonicalPath}`;

    setMeta('meta[property="og:url"]', "content", fullUrl);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = fullUrl;

    if (noIndex) {
      setMeta('meta[name="robots"]', "content", "noindex, nofollow");
      setMeta('meta[name="googlebot"]', "content", "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "content", "index, follow");
      setMeta('meta[name="googlebot"]', "content", "index, follow");
    }
  }, [title, description, canonical, noIndex, ogType]);
}

// ─── JSON-LD Schema hook ──────────────────────────────────────────────────────
// Injects a <script type="application/ld+json"> into <head> for the lifetime
// of the component. Pass any valid schema.org object.
// Multiple calls on the same page each need a unique `id` prop.
export function useSchema(schema: Record<string, unknown>, id?: string) {
  const scriptId = id ?? `ld-json-${String(schema["@type"] ?? "schema")}`;
  const ref = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    ref.current = el;
    return () => {
      ref.current?.remove();
    };
  }, [scriptId]);
}

// ─── Pre-built page SEO configs ───────────────────────────────────────────────
// Import the one you need in each page component.

export const SEO_PAGES = {
  home: {
    title: "Quantum Surety Bonds | Fast Quotes & Professional Services in Texas",
    description:
      "Quantum Surety Bonds offers fast, reliable surety bond services in Texas. Get bid bonds, performance bonds, and license bonds online. Expert support and competitive rates.",
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
