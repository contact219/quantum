import { Link } from "wouter";
import { SEO_PAGES, useSEO, useSchema } from "@/hooks/useSEO";
import { ServicesSection } from "@/components/home/ServicesSection";
import { GetBondedStepsSection } from "@/components/home/GetBondedStepsSection";
import { TDIBadge } from "@/components/TDIBadge";
import { CheckCircle, ArrowRight, Clock, Shield } from "lucide-react";

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "InsuranceAgency"],
  "name": "Quantum Surety Bonds",
  "legalName": "Quantum Surety LLC",
  "url": "https://quantumsurety.bond",
  "logo": "https://quantumsurety.bond/QS_Logo.png",
  "image": "https://quantumsurety.bond/QS_OG_2.png",
  "description": "TDI-licensed Texas surety bond agency offering performance bonds, bid bonds, contractor license bonds, payment bonds, and notary bonds with AI-powered fast quotes. Serving Texas and all 50 states.",
  "telephone": "+19723799216",
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

const trustMetrics = [
  { value: "A-rated", label: "Carrier partners" },
  { value: "All 50", label: "States served" },
  { value: "24-hr", label: "Typical filing time" },
  { value: "Texas", label: "Licensed producer" },
];

function PermitPilotBanner() {
  return (
    <section className="bg-[#020816] px-6 pt-8 lg:px-8">
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

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-cyan-100/80 backdrop-blur-md">
              <img src="/QS_Logo.png" alt="Quantum Surety" className="h-4 w-auto object-contain max-w-[80px] brightness-0 invert" />
              Quantum Surety
            </div>

            <h1
              className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
              data-testid="text-hero-headline"
            >
              Quantum Surety Bonds: Your Texas Bond Partner
            </h1>

            <div className="mt-6">
              <TDIBadge size="md" />
            </div>

            <p
              className="mt-8 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl"
              data-testid="text-hero-subheadline"
            >
              Quantum Surety delivers bid bonds, performance bonds, payment bonds, and license bonds — faster than traditional agencies. AI-assisted underwriting, A-rated carriers, licensed in Texas and all 50 states.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://www.mybondapp.com/329034247"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-200"
                data-testid="link-hero-primary-cta"
              >
                Search For A Bond
              </a>
              <a
                href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX"
                target="_blank"
                rel="noreferrer"
                className="notary-bond-cta inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)" }}
                data-testid="link-hero-secondary-cta"
              >
                <span className="text-base">&#9733;</span>
                Get Your SB693 Notary Bond Today
                <span className="text-base">&#9733;</span>
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
            <div className="hero-glass-frame relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(8,17,34,0.92),_rgba(17,25,39,0.72))] p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.15),_transparent_28%),linear-gradient(180deg,_transparent,_rgba(0,0,0,0.2))]" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Placement dashboard</div>
                      <div className="mt-3 text-2xl font-semibold tracking-tight">Carrier-ready workflow</div>
                    </div>
                    <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">Secure intake</div>
                  </div>

                  <div className="relative mt-8 h-[28rem] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.02),_rgba(255,255,255,0.01))]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_18%,_rgba(56,189,248,0.18),_transparent_24%),linear-gradient(180deg,_rgba(2,8,22,0.3),_rgba(2,8,22,0.85))]" />
                    <div className="building-reflection absolute inset-y-0 left-[14%] w-[42%] rounded-t-[1.5rem] border border-cyan-300/10 bg-[linear-gradient(180deg,_rgba(125,211,252,0.22),_rgba(15,23,42,0.08)_20%,_rgba(8,15,29,0.82)_100%)] shadow-[0_0_60px_rgba(34,211,238,0.08)]" />
                    <div className="building-reflection absolute inset-y-[8%] right-[10%] w-[28%] rounded-t-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(148,163,184,0.25),_rgba(15,23,42,0.1)_24%,_rgba(9,12,22,0.9)_100%)]" />
                    <div className="absolute inset-y-0 left-[18%] w-px bg-gradient-to-b from-cyan-200/0 via-cyan-200/70 to-cyan-200/0" />
                    <div className="absolute inset-y-0 left-[27%] w-px bg-gradient-to-b from-cyan-200/0 via-cyan-200/55 to-cyan-200/0" />
                    <div className="absolute inset-y-0 right-[22%] w-px bg-gradient-to-b from-white/0 via-white/35 to-white/0" />
                    <div className="absolute inset-x-[8%] top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                    <div className="absolute inset-x-[12%] top-[36%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute inset-x-[16%] top-[62%] h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(180deg,_transparent,_rgba(2,8,22,0.92))]" />
                    <div className="circuit-arc absolute left-[5%] top-[10%] h-40 w-40 rounded-full border border-cyan-300/20" />
                    <div className="circuit-arc absolute right-[6%] top-[20%] h-56 w-56 rounded-full border border-cyan-300/10" />
                    <div className="circuit-node absolute left-[56%] top-[22%]" />
                    <div className="circuit-node absolute left-[72%] top-[38%]" />
                    <div className="circuit-node absolute left-[48%] top-[58%]" />
                    <div className="absolute left-[48%] top-[24%] h-px w-[24%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                    <div className="absolute left-[50%] top-[40%] h-px w-[22%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
                    <div className="absolute left-[48%] top-[60%] h-px w-[18%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
                    <div className="absolute left-[57%] top-[22%] h-[36%] w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.03))] p-5 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Placement status</div>
                    <div className="mt-4 text-4xl font-semibold tracking-tight text-white">Carrier aligned</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Disciplined submissions prepared for appointed carrier underwriting teams.</p>
                  </div>
                  <div className="rounded-[1.6rem] border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Compliance posture</div>
                    <ul className="mt-4 space-y-3 text-sm text-slate-100/90">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                        <span>Internal review aligned with carrier underwriting standards</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                        <span>Technology-enabled intake built for efficient bond placement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                        <span>Final approval and issuance remain with carrier partners</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-[#081122]/80 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Operational cadence</span>
                      <span className="text-cyan-200">Efficient + controlled</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,_rgba(125,211,252,0.45),_rgba(34,211,238,1),_rgba(147,197,253,0.7))] shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-400">A modern interface style with conservative, compliance-forward messaging for business buyers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PermitPilotBanner />

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
              { href: "/ai-bond-finder", label: "AI Bond Finder", sub: "Find the right bond instantly", icon: "✦", accent: true },
              { href: "/quote", label: "Bond Calculator", sub: "Estimate your premium", icon: "◈", accent: false },
              { href: "/resources/state-requirements", label: "State Requirements", sub: "Requirements by state", icon: "◉", accent: false },
              { href: "/obligee-lookup", label: "Obligee Lookup", sub: "Find the correct obligee name", icon: "⊕", accent: false },
              { href: "/renewals", label: "Renewal Reminders", sub: "Never miss a bond renewal", icon: "◷", accent: false },
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
                <li><strong>Bid Bonds</strong> — Guarantee your bid is serious and backed by a surety.</li>
                <li><strong>Performance Bonds</strong> — Assure project owners that you will complete the contract.</li>
                <li><strong>Payment Bonds</strong> — Protect subcontractors and suppliers from non-payment.</li>
                <li><strong>License &amp; Permit Bonds</strong> — Required by cities and states for contractor licenses.</li>
                <li><strong>Miscellaneous Surety Bonds</strong> — Court bonds, fidelity bonds, and more.</li>
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
    </div>
  );
}
