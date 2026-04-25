import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import {
  ArrowRight, CheckCircle, Clock, BookOpen,
  MapPin, Building2, Shield, ChevronRight, AlertTriangle
} from "lucide-react";

export default function BlogTexasContractorBondRequirementsByCity() {
  useSEO({
    title: "Texas Contractor Bond Requirements by City (2026) | Quantum Surety Blog",
    description:
      "Contractor bond requirements for every major Texas city in 2026. Dallas, Houston, Austin, San Antonio, Fort Worth, and more — bond amounts, licensing agencies, and how to get bonded fast.",
    canonical: "/blog/texas-contractor-bond-requirements-by-city",
    ogType: "article",
  });
  useSchema(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "publisher": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
    },
    "ld-json-Article"
  );

  const tocItems = [
    { id: "why-vary", label: "Why bond requirements vary by city in Texas" },
    { id: "city-breakdown", label: "City-by-city bond requirements" },
    { id: "tdlr-statewide", label: "TDLR statewide trades — state bonds regardless of city" },
    { id: "multi-city", label: "How to get bonded across multiple Texas cities" },
    { id: "faq", label: "Frequently asked questions" },
  ];

  const cities = [
    {
      city: "Dallas",
      agency: "City of Dallas Development Services",
      trades: "General contractor, electrical (separate TDLR), plumbing, mechanical, roofing",
      bondAmount: "$15,000–$25,000 depending on trade and scope",
      applyAt: "Dallas Development Services, online via Dallas PermitCenter",
      link: "/bonds/contractor-bond-dallas",
      note: "Dallas requires a separate bond for each licensed trade classification.",
    },
    {
      city: "Houston",
      agency: "City of Houston Permits & Development",
      trades: "General contractor, house mover, electrical contractor, fire sprinkler",
      bondAmount: "$10,000–$20,000 (varies by trade category)",
      applyAt: "City of Houston One-Stop shop, online portal",
      link: "/bonds/contractor-bond-houston",
      note: "Houston has its own licensing divisions for specialized trades. TDLR licenses also required for electrical and HVAC.",
    },
    {
      city: "Austin",
      agency: "City of Austin Development Services Department (DSD)",
      trades: "General contractor registration, electrical (TDLR), plumbing (TSBPE), mechanical",
      bondAmount: "$25,000 for registered general contractors",
      applyAt: "Austin DSD online portal (Austin Build + Connect)",
      link: "/bonds/contractor-bond-austin",
      note: "Austin requires contractor registration (not a full license) for GCs. Bond is required at registration.",
    },
    {
      city: "San Antonio",
      agency: "City of San Antonio Development Services Department",
      trades: "General contractor, plumbing, mechanical, roofing, electrical (TDLR)",
      bondAmount: "$15,000–$20,000 depending on trade",
      applyAt: "City of San Antonio Development Services, online or in person",
      link: "/bonds/contractor-bond-san-antonio",
      note: "San Antonio updates its bond requirements periodically — confirm the current amount when applying.",
    },
    {
      city: "Fort Worth",
      agency: "City of Fort Worth Development Services",
      trades: "General contractor, electrical (TDLR), plumbing, roofing, irrigation",
      bondAmount: "$10,000–$15,000 for most trade registrations",
      applyAt: "Fort Worth Development Services, online or at the permit counter",
      link: "/bonds/contractor-bond-fort-worth",
      note: "Fort Worth has a streamlined online registration process for most trades.",
    },
    {
      city: "El Paso",
      agency: "City of El Paso Development Services",
      trades: "General contractor, electrical (TDLR), plumbing, mechanical, roofing",
      bondAmount: "$10,000 standard for most contractor licenses",
      applyAt: "El Paso Development Services Department, in person or by mail",
      link: "/bonds/contractor-bond-el-paso",
      note: "El Paso accepts bonds from any TDI-licensed surety company.",
    },
    {
      city: "Corpus Christi",
      agency: "City of Corpus Christi Development Services",
      trades: "General contractor, roofing, plumbing, mechanical, electrical (TDLR)",
      bondAmount: "$5,000–$15,000 depending on trade and license class",
      applyAt: "Corpus Christi Development Services, permit office",
      link: "/bonds/contractor-bond-corpus-christi",
      note: "Corpus Christi has several contractor license tiers with different bond amounts.",
    },
    {
      city: "Plano",
      agency: "City of Plano Building Inspections",
      trades: "Electrical (TDLR), plumbing, mechanical, roofing contractor registration",
      bondAmount: "$10,000 for roofing and specialty contractor registration",
      applyAt: "Plano Building Inspections online or in person",
      link: "/bonds/contractor-bond-dallas",
      note: "Most Plano contractors also need Dallas or Collin County bonds for broader work coverage.",
    },
    {
      city: "Arlington",
      agency: "City of Arlington Development Services",
      trades: "General contractor, roofing, electrical (TDLR), plumbing, mechanical",
      bondAmount: "$10,000–$15,000 for most registrations",
      applyAt: "Arlington Development Services, online registration portal",
      link: "/bonds/contractor-bond-fort-worth",
      note: "Arlington is in Tarrant County. Contractors working both Arlington and Fort Worth may be able to use the same bond.",
    },
    {
      city: "McKinney",
      agency: "City of McKinney Development Services",
      trades: "Electrical (TDLR), plumbing, mechanical, roofing registration",
      bondAmount: "$10,000 for most specialty contractor registrations",
      applyAt: "McKinney Development Services, online portal",
      link: "/bonds/contractor-bond-dallas",
      note: "McKinney is in Collin County and has grown rapidly — verify current requirements as the city updates licensing periodically.",
    },
    {
      city: "Frisco",
      agency: "City of Frisco Building Inspections",
      trades: "Roofing, electrical (TDLR), plumbing, mechanical contractor registration",
      bondAmount: "$10,000 standard for most specialty trades",
      applyAt: "Frisco Building Inspections online",
      link: "/bonds/contractor-bond-dallas",
      note: "Frisco is one of the fastest-growing cities in Texas. Requirements have expanded — always check the current fee schedule.",
    },
    {
      city: "Lubbock",
      agency: "City of Lubbock Planning & Development Services",
      trades: "General contractor, electrical (TDLR), plumbing, mechanical, roofing",
      bondAmount: "$5,000–$10,000 depending on trade",
      applyAt: "Lubbock Planning & Development Services, in person",
      link: "/bonds/contractor-bond-lubbock",
      note: "Lubbock bond requirements are generally lower than major metros — check the current fee schedule on the city website.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog">
              <span className="hover:text-white cursor-pointer">Blog</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas Contractors</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
              Texas Contractors
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> 10 min read
            </span>
            <span className="text-indigo-300 text-sm">April 25, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Texas Contractor Bond Requirements by City (2026)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Texas has no statewide general contractor license — which means bonding requirements
            are set city by city. Dallas is different from Houston. Austin differs from San Antonio.
            Here is the complete breakdown for every major Texas market, so you know exactly what
            you need before you apply.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-12">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> In this guide
          </p>
          <ol className="space-y-2">
            {tocItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-2"
                >
                  <span className="text-gray-400 font-mono text-xs w-4">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <article>

          {/* Section 1 — Why vary */}
          <section id="why-vary" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why contractor bond requirements vary by city in Texas</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike states such as California or Florida, Texas does not issue a statewide general
              contractor license. The Texas Legislature has largely left contractor licensing and
              bonding to individual municipalities. This means the city where you work — not the
              state — sets the bond amount, the licensing agency, and the application requirements.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The result is a patchwork of requirements. A roofing contractor working in Dallas,
              Arlington, and Plano may need separate bonds and registrations in each city. A GC
              expanding from Houston to Austin faces entirely different requirements in each market.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                The core structure you will find in most Texas cities
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Who regulates GCs",
                    value: "The city — no state license exists for GCs",
                  },
                  {
                    label: "Who regulates licensed trades",
                    value: "TDLR (electrical, HVAC, plumbing, others) — statewide",
                  },
                  {
                    label: "Bond issuer",
                    value: "Any TDI-licensed surety company, such as Quantum Surety",
                  },
                  {
                    label: "Bond beneficiary",
                    value: "The city, county, or licensing authority (the obligee)",
                  },
                ].map((row) => (
                  <div key={row.label} className="bg-white rounded-lg p-4 border border-indigo-100">
                    <p className="text-xs text-gray-500 mb-1">{row.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The practical advice: always verify current requirements directly with the city before
              applying. Bond amounts and licensing fees change. The information below is accurate
              as of early 2026 but cities update their requirements periodically.
            </p>
          </section>

          {/* Section 2 — City breakdown */}
          <section id="city-breakdown" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">City-by-city contractor bond requirements</h2>
            <div className="space-y-6">
              {cities.map((c) => (
                <div key={c.city} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-indigo-900 text-white px-6 py-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-300" />
                    <h3 className="font-bold text-lg">{c.city}, Texas</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      {[
                        { label: "Licensing agency", value: c.agency },
                        { label: "Bond amount", value: c.bondAmount },
                        { label: "Trades requiring bonds", value: c.trades },
                        { label: "How to apply", value: c.applyAt },
                      ].map((row) => (
                        <div key={row.label}>
                          <p className="text-xs text-gray-500 mb-0.5">{row.label}</p>
                          <p className="text-sm text-gray-800 font-medium">{row.value}</p>
                        </div>
                      ))}
                    </div>
                    {c.note && (
                      <div className="bg-amber-50 border-l-2 border-amber-400 pl-3 py-2 rounded-r mt-2">
                        <p className="text-amber-800 text-xs leading-relaxed">{c.note}</p>
                      </div>
                    )}
                    <div className="mt-4">
                      <Link href={c.link}>
                        <span className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer">
                          Get bonded in {c.city} <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 — TDLR */}
          <section id="tdlr-statewide" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">TDLR statewide trades — state bonds regardless of city</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              While Texas cities regulate general contractors locally, the Texas Department of
              Licensing and Regulation (TDLR) handles statewide licensing for several trades.
              If your trade falls under TDLR, you need a state-level license and bond regardless
              of which city you work in — and you may <em>also</em> need a separate city bond.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-5">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                TDLR-licensed trades with statewide bond requirements
              </h3>
              <div className="space-y-3">
                {[
                  {
                    trade: "Electrical Contractor",
                    license: "Texas Electrical Contractor License (TECL)",
                    bond: "$10,000 surety bond required by TDLR",
                    note: "Cities may require additional local registration.",
                  },
                  {
                    trade: "HVAC Contractor",
                    license: "TDLR Air Conditioning and Refrigeration License",
                    bond: "$10,000 surety bond required by TDLR",
                    note: "Residential HVAC contractors have a separate license tier.",
                  },
                  {
                    trade: "Plumbing Contractor",
                    license: "Texas State Board of Plumbing Examiners (TSBPE) License",
                    bond: "Bond requirements set by TSBPE — verify current amount",
                    note: "TSBPE is separate from TDLR but similarly statewide.",
                  },
                  {
                    trade: "Irrigator / Irrigation Contractor",
                    license: "TDLR Irrigator License",
                    bond: "$25,000 surety bond required by TDLR",
                    note: "One of the higher bond amounts among TDLR trades.",
                  },
                  {
                    trade: "Water Well Driller / Pump Installer",
                    license: "Texas Department of Licensing and Regulation",
                    bond: "Bond required — amount set by TDLR",
                    note: "Check TDLR website for current bond amount and approved forms.",
                  },
                  {
                    trade: "Boiler Inspector / Contractor",
                    license: "TDLR Boiler Safety Program",
                    bond: "Bond required — verify with TDLR",
                    note: "Applies to contractors installing or maintaining high-pressure boilers.",
                  },
                ].map((row) => (
                  <div key={row.trade} className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{row.trade}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{row.license}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                        {row.bond}
                      </span>
                    </div>
                    {row.note && (
                      <p className="text-xs text-amber-700 mt-2 border-l-2 border-amber-300 pl-2">{row.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you hold a TDLR license, Quantum Surety can issue your state bond and any
              required city bonds through a single application. Work with one agent, get all
              your bonds in one place.
            </p>
          </section>

          {/* Section 4 — Multi-city */}
          <section id="multi-city" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to get bonded quickly when you work across multiple Texas cities</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Contractors who work across DFW, Houston, or other multi-city metro areas often need
              bonds in several jurisdictions simultaneously. Here is how to manage it efficiently.
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Identify every city where you pull permits",
                  body: "List all jurisdictions where you currently work or plan to work. Check each city's contractor registration or licensing page to identify the specific bond requirements. Note the required bond amount, obligee name, and form.",
                },
                {
                  step: "2",
                  title: "Work with a single surety agent for all bonds",
                  body: "Rather than getting each city bond from a different source, use a single surety agent like Quantum Surety who can issue bonds in any Texas city. One application, one relationship, all bonds in one place.",
                },
                {
                  step: "3",
                  title: "Get TDLR bonds first",
                  body: "If your trade requires a TDLR license, get the state bond first. This often satisfies the surety's underwriting for city bonds in the same application — you're not underwritten multiple times.",
                },
                {
                  step: "4",
                  title: "Set renewal reminders",
                  body: "City contractor bonds typically run one year and require annual renewal. Staggered renewal dates across multiple cities create administrative headaches. Ask Quantum Surety to align renewal dates where possible.",
                },
                {
                  step: "5",
                  title: "Maintain continuous coverage",
                  body: "A lapse in bond coverage means your contractor registration is suspended — which means you can't pull permits. Set calendar reminders 60 days before each bond expires and renew early. Quantum Surety sends renewal notices automatically.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-900 text-white font-bold text-sm flex items-center justify-center">
                    {item.step}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-indigo-600" />
                Common mistakes contractors make with city bonds
              </h3>
              <ul className="space-y-2">
                {[
                  "Assuming one bond covers multiple cities — it does not. Each city requires its own bond naming that city as obligee.",
                  "Using the wrong bond form. Each city specifies an acceptable form — some require their own; others accept standard ACORD or ConsensusDocs forms.",
                  "Letting a bond lapse while waiting for renewal. Your permit-pulling authority expires the day the bond lapses.",
                  "Naming the wrong obligee on the bond. The bond must name the correct city agency, not just 'City of [Name]' generically.",
                  "Not obtaining separate TDLR state bonds in addition to city bonds for licensed trades.",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-indigo-800">
                    <span className="text-indigo-400 font-bold mt-0.5 shrink-0">—</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 — FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: "Do I need a new bond every time I work in a different Texas city?",
                  a: "Generally, yes — each city where you hold a contractor registration or license requires its own bond naming that city as obligee. However, if you work primarily in one city and occasionally do work in neighboring jurisdictions under a subcontract, the primary city bond may satisfy the requirement. Always verify with the specific city.",
                },
                {
                  q: "How long does a contractor bond last in Texas cities?",
                  a: "Most Texas city contractor bonds run for one year and must be renewed annually to maintain your contractor registration. Some cities align bond expiration with the license renewal date; others require calendar-year renewal. Quantum Surety tracks your renewal dates and sends advance notices.",
                },
                {
                  q: "Can one surety bond cover both my TDLR license and my city registration?",
                  a: "No — they are separate bonds with different obligees. Your TDLR bond names the State of Texas (or TDLR) as obligee. Your city bond names the specific city. You need both. However, Quantum Surety can issue both bonds in a single application process.",
                },
                {
                  q: "What happens if I let my city contractor bond lapse?",
                  a: "Your contractor registration is suspended, which means you cannot legally pull permits in that city. Any work done without an active bond and registration exposes you to fines and potential license revocation. Reinstatement typically requires a new bond and a reinstatement fee to the city.",
                },
                {
                  q: "Are the bond requirements listed here guaranteed to be accurate?",
                  a: "The information in this guide is based on research current as of early 2026, but Texas cities update their requirements independently. Bond amounts, forms, and licensing agencies can change. Always verify current requirements directly with the city's development services or permitting department before submitting an application.",
                },
              ].map((item) => (
                <div key={item.q} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

        </article>

        {/* CTA card */}
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-5">
            <MapPin className="w-4 h-4" /> All Texas cities covered — one application
          </div>
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">
            Dallas · Houston · Austin · San Antonio · Fort Worth · All Texas cities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/quote">
              <span className="inline-flex items-center justify-center rounded-lg bg-white text-indigo-900 font-semibold px-8 py-3 hover:bg-indigo-50 transition-colors cursor-pointer">
                Start My Application <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
            <Link href="/bonds/contractor-bond-dallas">
              <span className="inline-flex items-center justify-center rounded-lg border border-white text-white font-semibold px-6 py-3 hover:bg-white/10 transition-colors cursor-pointer">
                Dallas Contractor Bond
              </span>
            </Link>
            <Link href="/bonds/contractor-bond-houston">
              <span className="inline-flex items-center justify-center rounded-lg border border-white text-white font-semibold px-6 py-3 hover:bg-white/10 transition-colors cursor-pointer">
                Houston Contractor Bond
              </span>
            </Link>
          </div>
        </div>

        {/* City quick links */}
        <div className="mt-2 mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Get bonded in your city</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { city: "Dallas", href: "/bonds/contractor-bond-dallas" },
              { city: "Houston", href: "/bonds/contractor-bond-houston" },
              { city: "Austin", href: "/bonds/contractor-bond-austin" },
              { city: "San Antonio", href: "/bonds/contractor-bond-san-antonio" },
              { city: "Fort Worth", href: "/bonds/contractor-bond-fort-worth" },
              { city: "El Paso", href: "/bonds/contractor-bond-el-paso" },
              { city: "Corpus Christi", href: "/bonds/contractor-bond-corpus-christi" },
              { city: "Lubbock", href: "/bonds/contractor-bond-lubbock" },
              { city: "All Texas Cities", href: "/quote" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer text-center">
                  <p className="text-gray-900 font-semibold text-sm flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    {item.city}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: "/blog/texas-contractor-bond-and-permits",
                title: "Get Your Bond and Pull Your Permits in One Day",
                tag: "Contractor Workflow",
              },
              {
                href: "/blog/texas-performance-bond-guide-2026",
                title: "Texas Performance Bond Requirements & Cost Guide (2026)",
                tag: "Construction Bonds",
              },
              {
                href: "/blog/texas-bid-bond-requirements-2026",
                title: "Texas Bid Bond Requirements 2026",
                tag: "Construction Bonds",
              },
              {
                href: "/bonds/contractor-bond-texas",
                title: "Texas Contractor License Bond — Instant Quote",
                tag: "Product Page",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-2 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">
                    Read more <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
