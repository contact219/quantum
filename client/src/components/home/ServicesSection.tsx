import { Link } from "wouter";
import { ArrowRight, Building2, FileText, Truck, Shield, Award, Gavel } from "lucide-react";

const services = [
  {
    icon: Building2,
    category: "Construction",
    title: "Contract Surety Bonds",
    description:
      "Bid bonds, performance bonds, and payment bonds for general contractors and subcontractors. Required on Texas public projects over $25,000 and federal projects over $150,000. Same-day bid bonds for qualified contractors.",
    bullets: ["Bid bonds", "Performance bonds", "Payment bonds"],
    href: "/construction",
    cta: "Construction bonds",
    highlight: false,
  },
  {
    icon: Award,
    category: "License & Permit",
    title: "License & Permit Bonds",
    description:
      "TDLR bonds, contractor license bonds, electrical bonds, plumbing bonds, HVAC bonds, and city permit bonds across Texas. Most license bonds issued same-day with instant approval for good-credit applicants.",
    bullets: ["TDLR contractor bonds", "Electrical & plumbing bonds", "City permit bonds"],
    href: "/bonds/license-bond-texas",
    cta: "License bonds",
    highlight: false,
  },
  {
    icon: Shield,
    category: "Commercial Surety",
    title: "Commercial Surety Bonds",
    description:
      "License & permit bonds, court bonds, fidelity bonds, and miscellaneous surety for businesses and professionals. We place commercial surety through appointed A-rated carrier relationships.",
    bullets: ["Court & judicial bonds", "Fidelity & crime bonds", "Miscellaneous surety"],
    href: "/quote",
    cta: "Get a quote",
    highlight: false,
  },
  {
    icon: Truck,
    category: "Freight & Transportation",
    title: "BMC-84 Freight Broker Bond",
    description:
      "The $75,000 FMCSA-required surety bond for all licensed freight brokers and freight forwarders. Rates from $938/year. Electronic FMCSA filing within 24 hours. Switching from a BMC-85 trust? We make the transition fast and simple.",
    bullets: ["$75,000 FMCSA requirement", "Rates from $938/year", "24-hr FMCSA e-filing"],
    href: "/bonds/bmc-84-freight-broker",
    cta: "Freight broker bond",
    highlight: true,
    badge: "New service",
  },
  {
    icon: Gavel,
    category: "Court & Judicial",
    title: "Court Bonds",
    description:
      "Appeal bonds, executor bonds, guardian bonds, conservatorship bonds, and other judicial surety bonds required by Texas courts. Fast approvals, competitive rates, all Texas counties served.",
    bullets: ["Appeal & supersedeas bonds", "Probate & estate bonds", "Guardian & conservatorship"],
    href: "/quote",
    cta: "Get a quote",
    highlight: false,
  },
  {
    icon: FileText,
    category: "Specialty",
    title: "Miscellaneous Surety",
    description:
      "Auto dealer bonds (Texas DMV), notary bonds, lost instrument bonds, utility bonds, and other specialty surety bonds for businesses and individuals across Texas and nationwide.",
    bullets: ["Auto dealer bonds (TxDMV)", "Notary & utility bonds", "Lost instrument bonds"],
    href: "/quote",
    cta: "Get a quote",
    highlight: false,
  },
];

export function ServicesSection() {
  return (
    <section className="bg-[#f5f7fb] py-20 px-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-2">
            <img src="/QS_Logo.png" alt="Quantum Surety" className="w-6 h-6 object-contain" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
              Services
            </p>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
            Surety Bond Solutions for Every Need
          </h2>
          <p className="text-lg text-slate-600">
            From construction bid bonds to freight broker bonds, we place surety across every major
            bond category — with AI-powered underwriting that delivers faster approvals than
            traditional agencies. All bonds placed through appointed A-rated carrier partners.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.title} href={service.href}>
              <div
                className={`group relative flex flex-col h-full rounded-2xl border p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  service.highlight
                    ? "border-indigo-200 bg-white ring-1 ring-indigo-100"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Badge for new services */}
                {service.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {service.badge}
                    </span>
                  </div>
                )}

                {/* Icon + category */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    service.highlight ? "bg-indigo-100" : "bg-slate-100"
                  }`}>
                    <service.icon className={`w-5 h-5 ${service.highlight ? "text-indigo-600" : "text-slate-600"}`} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {service.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-snug">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>

                {/* Bullet points */}
                <ul className="space-y-1.5 mb-5">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  service.highlight
                    ? "text-indigo-600 group-hover:text-indigo-700"
                    : "text-cyan-700 group-hover:text-cyan-800"
                }`}>
                  {service.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-indigo-900 to-teal-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-semibold text-lg mb-1">
              Don't see the bond you need?
            </p>
            <p className="text-indigo-200 text-sm">
              We place surety across hundreds of bond types in all 50 states. Tell us what you need
              and we'll find the right carrier and rate.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/ai-bond-finder">
              <button className="bg-white text-indigo-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors">
                Use AI Bond Finder
              </button>
            </Link>
            <Link href="/quote">
              <button className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors border border-indigo-500">
                Get a Quote
              </button>
            </Link>
          </div>
        </div>

        {/* Compliance note */}
        <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
          Bond placement services are provided through appointed A-rated carrier partners and are subject
          to carrier underwriting and approval. Quantum Surety is a licensed insurance producer in Texas
          and other states where authorized.
        </p>
      </div>
    </section>
  );
}
