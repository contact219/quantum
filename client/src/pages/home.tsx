import { Link } from "wouter";
import { useEffect, useState } from "react";
import { SEO_PAGES, useSEO, useSchema } from "@/hooks/useSEO";
import { ServicesSection } from "@/components/home/ServicesSection";
import { GetBondedStepsSection } from "@/components/home/GetBondedStepsSection";
import { TDIBadge } from "@/components/TDIBadge";
import { CheckCircle, ArrowRight, Clock, Shield, MapPin, Zap, Star, Award } from "lucide-react";

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "InsuranceAgency"],
  "name": "Quantum Surety Bonds",
  "legalName": "Quantum Surety LLC",
  "url": "https://quantumsurety.bond",
  "logo": "https://quantumsurety.bond/QS_Logo.png",
  "image": "https://quantumsurety.bond/QS_OG_2.png",
  "description": "TDI-licensed Texas surety bond agency offering performance bonds, bid bonds, contractor license bonds, payment bonds, and notary bonds with AI-powered fast quotes. Serving Texas and all 50 states.",
  "telephone": "+12146668718",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "TX",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "State", "name": "Texas" },
    { "@type": "Country", "name": "United States" }
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "Texas Department of Insurance License",
    "credentialCategory": "Insurance Agency License",
    "recognizedBy": { "@type": "Organization", "name": "Texas Department of Insurance" },
    "identifier": "3480229"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Surety Bond Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Texas Notary Bond", "url": "https://quantumsurety.bond/bonds/notary-bond-texas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Performance Bond Texas", "url": "https://quantumsurety.bond/bonds/performance-bond-texas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bid Bond Texas", "url": "https://quantumsurety.bond/bonds/bid-bond-texas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Payment Bond Texas", "url": "https://quantumsurety.bond/bonds/payment-bond-texas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Contractor License Bond Texas", "url": "https://quantumsurety.bond/bonds/license-bond-texas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "TDLR Contractor Bond", "url": "https://quantumsurety.bond/bonds/tdlr-bond-texas" } }
    ]
  }
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Quantum Surety Bonds",
  "url": "https://quantumsurety.bond",
  "description": "TDI-licensed Texas surety bond agency. Fast quotes for contractor license bonds, performance bonds, bid bonds, payment bonds, and notary bonds.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://quantumsurety.bond/ai-bond-finder?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const trustMetrics = [
  { value: "$50 flat", label: "Notary bond — instant PDF" },
  { value: "From $100", label: "GDN dealer bond / yr" },
  { value: "Same-day", label: "Most bonds issued" },
];

const TRUST_ITEMS = [
  {
    icon: Award,
    headline: "TDI Licensed Agency",
    sub: "License #3480229",
    href: "https://www.tdi.texas.gov/agent/agentlookup.html",
    external: true,
    accent: "text-emerald-400",
  },
  {
    icon: Shield,
    headline: "A-Rated Carrier",
    sub: "RLI Insurance",
    href: null,
    external: false,
    accent: "text-cyan-400",
  },
  {
    icon: MapPin,
    headline: "254 Texas Counties",
    sub: "All counties covered",
    href: null,
    external: false,
    accent: "text-indigo-400",
  },
  {
    icon: Zap,
    headline: "Instant PDF Delivery",
    sub: "Bonds issued in minutes",
    href: null,
    external: false,
    accent: "text-amber-400",
  },
  {
    icon: Star,
    headline: "No Credit Check",
    sub: "Notary & standard bonds",
    href: null,
    external: false,
    accent: "text-rose-400",
  },
];

function TrustBar() {
  return (
    <div className="bg-slate-900/80 border-y border-white/[0.06] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap items-stretch justify-between divide-x divide-white/[0.06]">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-3 px-5 py-5 flex-1 min-w-[160px] group">
                <div className={`shrink-0 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-white/20 transition-colors`}>
                  <Icon className={`w-4 h-4 ${item.accent}`} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{item.headline}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            );
            if (item.href) {
              return (
                <a key={item.headline} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className="flex-1 hover:bg-white/[0.03] transition-colors cursor-pointer">
                  {content}
                </a>
              );
            }
            return <div key={item.headline} className="flex-1">{content}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

function LiveBondPulse() {
  const [expiring30d, setExpiring30d] = useState<number | null>(null);
  const [samples, setSamples] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const api = "https://verify.quantumsurety.bond/api/bond-watch";
    fetch(`${api}/summary`)
      .then((r) => r.json())
      .then((d) => {
        const n = parseInt(d?.notaries?.expiring_30d || "0", 10);
        const c = parseInt(d?.contractors?.expiring_30d || "0", 10);
        if (n + c > 0) setExpiring30d(n + c);
      })
      .catch(() => {});
    fetch(`${api}/recently-expired?days=3&limit=25`)
      .then((r) => r.json())
      .then((d) => {
        const items = (d?.contractors || [])
          .map((it: any) => {
            const rawName = it.owner_name || it.business_name || "";
            const m = rawName.match(/^([A-Z'-]+),\s*([A-Z'-]+)/i);
            if (!m) return null;
            const first = m[2].charAt(0) + m[2].slice(1).toLowerCase();
            const lastInitial = m[1].charAt(0).toUpperCase();
            const city = (it.business_city || "").split(/\s+TX\b/)[0].trim().toLowerCase()
              .replace(/(^|\s)\S/g, (s: string) => s.toUpperCase());
            const kind = (it.license_type || "license").replace(/\s*\(.*\)$/, "");
            const ago = it.days_since_expiry === 0 ? "expired today"
              : it.days_since_expiry === 1 ? "expired yesterday"
              : `expired ${it.days_since_expiry} days ago`;
            return `${first} ${lastInitial}.${city ? ` (${city})` : ""} — ${kind} bond ${ago}`;
          })
          .filter(Boolean);
        setSamples(items.slice(0, 15));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (samples.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % samples.length), 4500);
    return () => clearInterval(t);
  }, [samples]);

  if (expiring30d === null) return null;

  return (
    <div className="bg-[#060c1a] border-b border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-1 px-6 py-2.5 text-sm lg:px-8">
        <Link href="/bond-ticker" className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-1 hover:opacity-90">
          <span className="flex shrink-0 items-center gap-2 font-semibold text-red-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            LIVE
          </span>
          <span className="shrink-0 text-slate-300">
            <span className="font-semibold text-white">{expiring30d.toLocaleString()}</span> Texas bonds expire in the next 30 days
          </span>
          {samples.length > 0 && (
            <span className="hidden min-w-0 truncate text-slate-400 md:inline" key={idx}>
              {samples[idx]}
            </span>
          )}
        </Link>
        <a
          href="https://verify.quantumsurety.bond"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Is yours next? Check free →
        </a>
      </div>
    </div>
  );
}

function PermitPilotBanner() {
  return (
    <section className="bg-[#020816] px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-slate-800 to-slate-900 p-6 md:p-8 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏗️</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                Sister Product
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">
              Need to know which permits your project requires?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Permit Pilot is our free AI-powered permit tool for DFW contractors. Identify every required permit
              across all 24 DFW jurisdictions — before you break ground.
            </p>
            <p className="mt-3 text-xs text-slate-400 italic">
              Permit Pilot provides AI-generated permit guidance for informational purposes. Always verify requirements
              directly with your local building department before submitting applications.
            </p>
          </div>
          <a
            href="https://permitpilot.online?utm_source=quantumsurety&utm_medium=banner&utm_campaign=cross-promo"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-sm hover:opacity-90 transition"
          >
            Try Permit Pilot Free
          </a>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  useSEO(SEO_PAGES.home);
  useSchema(LOCAL_BUSINESS_SCHEMA, "ld-json-LocalBusiness");
  useSchema(WEBSITE_SCHEMA, "ld-json-WebSite");
  return (
    <div className="bg-[#020816] text-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.16),_transparent_30%),linear-gradient(135deg,_#020816_0%,_#07111f_38%,_#0f1724_68%,_#161b28_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        </div>

        <div className="quantum-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="quantum-filaments pointer-events-none absolute inset-0 opacity-80" />
        <div className="flash-motion-left pointer-events-none absolute -left-24 top-24 h-[28rem] w-48 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="flash-motion-right pointer-events-none absolute -right-20 bottom-10 h-[24rem] w-44 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-cyan-100/80 backdrop-blur-md">
              <img src="/QS_Logo.png" alt="Quantum Surety" className="h-4 w-auto object-contain max-w-[80px] brightness-0 invert" />
              Quantum Surety
            </div>

            <h1
              className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
              data-testid="text-hero-headline"
            >
              Texas Surety Bonds, Issued Same Day
            </h1>

            <div className="mt-6">
              <TDIBadge size="md" />
            </div>

            <p
              className="mt-8 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl"
              data-testid="text-hero-subheadline"
            >
              Notary bonds $50 flat for the full 4-year term. Bonded titles from $50. Dealer bonds from $100/yr. TDI-licensed, A-rated carriers, no credit check on standard bonds.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/get-bond"
                className="inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-200"
                data-testid="link-hero-primary-cta"
              >
                Get My Bond — Same Day
              </Link>
              <a
                href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX"
                target="_blank"
                rel="noreferrer"
                className="notary-bond-cta inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)" }}
                data-testid="link-hero-secondary-cta"
              >
                Notary Bond — $50, Apply Direct
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {trustMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <div className="text-2xl font-semibold tracking-tight text-white">{metric.value}</div>
                  <div className="mt-2 text-sm text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>

            <p
              className="mt-8 max-w-2xl text-sm leading-6 text-slate-400"
              data-testid="text-hero-disclaimer"
            >
              All bonds are underwritten and approved by appointed insurance carriers. Quantum Surety does not issue bonds independently.
            </p>
          </div>

          <div className="relative lg:pl-10">
            <div className="absolute -left-12 top-8 hidden h-40 w-40 rounded-full border border-cyan-300/10 bg-cyan-300/10 blur-2xl lg:block" />
            <div className="hero-glass-frame relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-8">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
              <h2 className="text-xl font-semibold text-white md:text-2xl">What do you need a bond for?</h2>
              <p className="mt-2 text-sm text-slate-400">Pick your bond — most are issued the same day.</p>
              <div className="mt-6 grid gap-3">
                <Link
                  href="/get-bond?type=notary"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  data-testid="link-picker-notary"
                >
                  <div>
                    <div className="font-semibold text-white">Texas Notary Bond</div>
                    <div className="text-sm text-slate-400">$50 flat — full 4-year term, instant PDF</div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-cyan-300 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/title-bond-calculator"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  data-testid="link-picker-title"
                >
                  <div>
                    <div className="font-semibold text-white">Bonded Title (Lost Vehicle Title)</div>
                    <div className="text-sm text-slate-400">From $50 — calculate your exact cost in 60 seconds</div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-cyan-300 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/get-bond?type=dealer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  data-testid="link-picker-dealer"
                >
                  <div>
                    <div className="font-semibold text-white">Auto Dealer (GDN) Bond</div>
                    <div className="text-sm text-slate-400">From $100/yr — $50,000 TxDMV-required bond</div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-cyan-300 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/get-bond?type=contractor"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  data-testid="link-picker-contractor"
                >
                  <div>
                    <div className="font-semibold text-white">Contractor &amp; Construction Bonds</div>
                    <div className="text-sm text-slate-400">License, bid, performance &amp; payment bonds</div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-cyan-300 transition group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-5 text-center text-sm text-slate-400">
                Not sure? Call <a href="tel:+12146668718" className="font-semibold text-cyan-200 hover:underline">(214) 666-8718</a> — answered 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <LiveBondPulse />

      {/* ── Notary Bond Callout ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 px-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-800 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch">

              {/* Left — content */}
              <div className="flex-1 p-8 lg:p-12">
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Texas Notary Bond
                  </span>
                  <span className="bg-teal-400/20 text-teal-200 text-xs font-semibold px-3 py-1 rounded-full border border-teal-400/30">
                    SB693 Compliant · 2026
                  </span>
                  <span className="bg-white/10 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Instant Download
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Texas Notary Bond — $50
                </h2>
                <p className="text-indigo-100 text-lg leading-relaxed mb-7 max-w-xl">
                  Get your required $10,000 notary surety bond in minutes. No credit check,
                  no waiting — instant PDF delivered by email, ready to file with the
                  Texas Secretary of State.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "$10,000 bond · 4-year term · $50 flat — no annual fees",
                    "SB693 compliant — valid for 2026 new applications and renewals",
                    "No credit check required — available to any eligible Texas applicant",
                    "TDI-licensed agency — Quantum Surety License #3480229",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-indigo-100 text-sm">
                      <CheckCircle className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX" target="_blank" rel="noreferrer">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-indigo-900 font-semibold px-7 py-3 text-sm hover:bg-indigo-50 transition-colors">
                      Get My Notary Bond <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>
                  <Link href="/blog/texas-notary-bond-sb693-2026-requirements">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 text-white font-semibold px-7 py-3 text-sm hover:bg-white/20 transition-colors">
                      SB693 Guide
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right — price card */}
              <div className="lg:w-72 bg-white/10 border-t border-white/10 lg:border-t-0 lg:border-l p-8 lg:p-10 flex flex-col justify-center gap-6">
                <div className="text-center">
                  <p className="text-indigo-300 text-sm font-medium mb-1">One-time price</p>
                  <p className="text-6xl font-bold text-white tracking-tight">$50</p>
                  <p className="text-indigo-200 text-sm mt-1">for the full 4-year term</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Bond amount", value: "$10,000" },
                    { label: "Term", value: "4 years" },
                    { label: "Credit check", value: "None" },
                    { label: "Delivery", value: "Instant PDF" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm border-b border-white/10 pb-2">
                      <span className="text-indigo-300">{row.label}</span>
                      <span className="text-white font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                  <Shield className="w-4 h-4 text-teal-300 shrink-0" />
                  <p className="text-indigo-100 text-xs leading-snug">
                    Issued by a TDI-licensed Texas surety agency
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── GDN / Auto Dealer Bond Callout ─────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 px-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden border border-indigo-500/20">
            <div className="flex flex-col lg:flex-row items-stretch">

              {/* Left — content */}
              <div className="flex-1 p-8 lg:p-12">
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  <span className="bg-indigo-500/20 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-400/30">
                    Texas GDN Bond
                  </span>
                  <span className="bg-amber-400/15 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/25">
                    §503.033 Required
                  </span>
                  <span className="bg-white/10 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Same-Day Issuance
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Texas Auto Dealer GDN Bond — From $100/yr
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-7 max-w-xl">
                  Every Texas motor vehicle dealer license requires a $50,000 GDN surety bond under Texas Occupations Code §503.033. Quantum Surety gets you bonded same-day with instant PDF delivery — accepted by TxDMV.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "$50,000 GDN bond — covers all 6 dealer license types (new, used, wholesale, motorcycle, BHPH, lease/finance)",
                    "Operating without a valid bond is a Class A misdemeanor under Texas law",
                    "Same-day certificate — apply online, receive your PDF bond within minutes",
                    "Renewal reminders included — never risk a lapsed license",
                    "TDI-licensed agency — Quantum Surety License #3480229",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-200 text-sm">
                      <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX" target="_blank" rel="noreferrer">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 text-white font-semibold px-7 py-3 text-sm hover:bg-indigo-400 transition-colors">
                      Get My GDN Bond <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>
                  <Link href="/bonds/gdn-bond-texas">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 text-white font-semibold px-7 py-3 text-sm hover:bg-white/20 transition-colors">
                      Learn About GDN Bonds
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right — price card */}
              <div className="lg:w-72 bg-white/5 border-t border-white/10 lg:border-t-0 lg:border-l border-indigo-500/20 p-8 lg:p-10 flex flex-col justify-center gap-6">
                <div className="text-center">
                  <p className="text-slate-400 text-sm font-medium mb-1">Starting at</p>
                  <p className="text-6xl font-bold text-white tracking-tight">$100</p>
                  <p className="text-slate-300 text-sm mt-1">per year</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Bond amount", value: "$50,000" },
                    { label: "License types", value: "All 6 GDN" },
                    { label: "Authority", value: "§503.033" },
                    { label: "Delivery", value: "Instant PDF" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm border-b border-white/10 pb-2">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="text-white font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3">
                  <Shield className="w-4 h-4 text-amber-300 shrink-0" />
                  <p className="text-amber-100 text-xs leading-snug">
                    Required by TxDMV before your dealer license can be issued or renewed
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <GetBondedStepsSection />


      {/* ── Certificate of Title Bond Callout ────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 px-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden" style={{background: "linear-gradient(135deg, #0f172a 0%, #431407 40%, #1c0a04 100%)", border: "1px solid rgba(251,146,60,0.2)"}}>
            <div className="flex flex-col lg:flex-row items-stretch">

              {/* Left content */}
              <div className="flex-1 p-8 lg:p-12">
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background: "rgba(251,146,60,0.15)", color: "#fdba74", border: "1px solid rgba(251,146,60,0.25)"}}>
                    Certificate of Title Bond
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background: "rgba(255,255,255,0.08)", color: "#e2e8f0"}}>
                    Same-Day Issuance
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1" style={{background: "rgba(255,255,255,0.06)", color: "#94a3b8"}}>
                    All 254 TX Counties
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Vehicle With No Title?<br />
                  <span style={{color: "#fb923c"}}>We Fix That.</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-xl">
                  Got a car, truck, or trailer with a missing or rejected title? A Texas Certificate of Title Bond
                  lets you legally own and register it through TxDMV — same-day issuance from a TDI-licensed agency.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Works for auction buys, private sales, inherited vehicles, and rejected titles",
                    "Bond = 1.5x vehicle appraised value — premiums start at $50",
                    "Free eligibility wizard — find out if you qualify in 2 minutes",
                    "County-specific guidance for all 10 major Texas metros",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-200 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{color: "#fb923c"}} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/texas-title-rescue">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full font-semibold px-7 py-3 text-sm transition-all hover:-translate-y-0.5" style={{background: "#fb923c", color: "#0f172a"}}>
                      Check My Eligibility <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/bonds/bonded-title-texas">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full font-semibold px-7 py-3 text-sm transition-colors" style={{background: "rgba(255,255,255,0.08)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)"}}>
                      Full Bond Guide
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right — stat card */}
              <div className="lg:w-72 p-8 lg:p-10 flex flex-col justify-center gap-5" style={{background: "rgba(255,255,255,0.05)", borderLeft: "1px solid rgba(255,255,255,0.07)"}}>
                <div className="text-center">
                  <p className="text-sm font-medium mb-1" style={{color: "#fb923c"}}>Premium starts at</p>
                  <p className="text-6xl font-bold text-white tracking-tight">$50</p>
                  <p className="text-slate-400 text-sm mt-1">for most personal vehicles</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Bond amount", value: "1.5x value" },
                    { label: "Bond term", value: "3 years" },
                    { label: "Credit check", value: "None" },
                    { label: "Delivery", value: "Same-day" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm pb-2" style={{borderBottom: "1px solid rgba(255,255,255,0.07)"}}>
                      <span className="text-slate-400">{row.label}</span>
                      <span className="text-white font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/title-bond-calculator">
                  <button className="w-full rounded-xl py-3 text-sm font-semibold transition-colors" style={{background: "rgba(251,146,60,0.12)", color: "#fdba74", border: "1px solid rgba(251,146,60,0.2)"}}>
                    Calculate My Bond Amount
                  </button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      <ServicesSection />

      {/* Quick Tools */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <img src="/QS_Logo.png" alt="Quantum Surety" className="h-8 w-auto object-contain max-w-[160px]" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">Free Tools</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Tools for Contractors &amp; Bond Buyers
            </h2>
            <a href="/resources" className="text-sm font-medium text-cyan-700 hover:text-cyan-800 whitespace-nowrap">
              View all resources →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { href: "/bond-ticker", label: "🔴 Bond Ticker", sub: "Live TX bond expirations scrolling now", icon: "", accent: true },
              { href: "/hoa-portal", label: "HOA Vendor Portal", sub: "Monitor all your contractors free", icon: "🏠", accent: false },
              { href: "/qs-score", label: "QS Score™", sub: "0–100 trust rating for every TX contractor", icon: "◉", accent: false },
              { href: "/ai-bond-finder", label: "AI Bond Finder", sub: "Find the right bond instantly", icon: "✦", accent: false },
              { href: "/quote", label: "Bond Calculator", sub: "Estimate your premium", icon: "◈", accent: false },
              { href: "/sb-693-notary-bond-requirements-2026", label: "SB-693 2026 Guide", sub: "Texas notary bond compliance", icon: "◎", accent: false },
            ].map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className={`group flex flex-col gap-2 rounded-2xl border p-5 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 ${
                  tool.accent ? "border-indigo-200 bg-indigo-50 ring-1 ring-indigo-100" : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className={`text-xl font-light select-none ${tool.accent ? "text-indigo-500" : "text-slate-400"}`}>
                  {tool.icon}
                </span>
                <p className={`text-sm font-semibold leading-snug ${tool.accent ? "text-indigo-800" : "text-slate-800"}`}>
                  {tool.label}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">{tool.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-[#eef4f8] py-20 text-slate-900">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <img src="/QS_Logo.png" alt="Quantum Surety" className="h-10 w-auto object-contain max-w-[200px]" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">Why choose us</p>
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight" data-testid="text-about-headline">
            About Quantum Surety
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700" data-testid="text-about-body-primary">
            Quantum Surety is a licensed Texas insurance producer and surety bond agency specializing in placement for contractors, freight brokers, and businesses across Texas and all 50 states.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600" data-testid="text-about-body-secondary">
            We combine AI-powered underwriting technology with deep surety expertise to deliver faster bond approvals than traditional agencies. Our carrier network includes A-rated, T-listed companies authorized to issue bonds on federal and public projects nationwide. From a $5,000 license bond to a $10 million performance bond — we handle it.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Quantum Surety provides fast, intelligent surety bond solutions for construction contractors across Texas and nationwide. Get bid bonds, performance bonds, payment bonds, and license &amp; permit bonds — with AI-assisted underwriting that delivers quotes in minutes, not days.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Bond Types We Offer</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-7 text-slate-700">
                <li><Link href="/bonds/bid-bond-texas"><strong className="text-indigo-700 hover:underline cursor-pointer">Bid Bonds</strong></Link> — Guarantee your bid is serious and backed by a surety.</li>
                <li><Link href="/bonds/performance-bond-texas"><strong className="text-indigo-700 hover:underline cursor-pointer">Performance Bonds</strong></Link> — Assure project owners that you will complete the contract.</li>
                <li><Link href="/bonds/payment-bond-texas"><strong className="text-indigo-700 hover:underline cursor-pointer">Payment Bonds</strong></Link> — Protect subcontractors and suppliers from non-payment.</li>
                <li><Link href="/bonds/license-bond-texas"><strong className="text-indigo-700 hover:underline cursor-pointer">License &amp; Permit Bonds</strong></Link> — Required by cities and states for contractor licenses.</li>
                <li><Link href="/bonds/texas-contractor"><strong className="text-indigo-700 hover:underline cursor-pointer">All Contractor Bonds</strong></Link> — Full overview of every bond type for TX contractors.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Why Quantum Surety?</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-7 text-slate-700">
                <li>AI-powered underwriting for faster approvals</li>
                <li>Quotes delivered in minutes, not 24–48 hours</li>
                <li>Serving Texas contractors and nationwide</li>
                <li>Experienced surety professionals backed by top-rated carriers</li>
              </ul>
            </div>
          </div>
          <a
            href="/quote"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Get a Free Bond Quote
          </a>
        </div>
      </section>

      <PermitPilotBanner />
    </div>
  );
}
