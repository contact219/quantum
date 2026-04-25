import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight } from "lucide-react";

const requirements = [
  { type: "TREC Inspector Bond", amount: "$10,000", authority: "Texas Real Estate Commission (TREC)" },
  { type: "Professional Inspector Bond", amount: "$10,000", authority: "TREC – Professional Inspector License" },
  { type: "Real Estate Inspector Bond", amount: "$10,000", authority: "TREC – Real Estate Inspector License" },
  { type: "Apprentice Inspector Bond", amount: "$10,000", authority: "TREC – Apprentice Inspector License" },
];

const faqs = [
  {
    q: "Do Texas home inspectors need a surety bond?",
    a: "Yes. The Texas Real Estate Commission (TREC) requires all licensed home inspectors to carry a $10,000 surety bond as a condition of obtaining and maintaining their inspector license. The bond must be issued by a Texas-licensed surety company.",
  },
  {
    q: "What does a Texas home inspector bond cover?",
    a: "The TREC inspector bond protects homeowners and clients against financial loss caused by an inspector's violation of TREC rules, failure to perform services, or misconduct. It does not protect the inspector personally — for personal liability protection, inspectors should also carry E&O insurance.",
  },
  {
    q: "How much does a Texas home inspector bond cost?",
    a: "A $10,000 Texas home inspector bond typically costs $100–$200 per year. Your premium is based primarily on your credit score. Most inspectors are approved same-day with no financial statements required.",
  },
  {
    q: "Is the home inspector bond the same as E&O insurance?",
    a: "No. The TREC surety bond is a licensing requirement that protects your clients. E&O (Errors & Omissions) insurance protects you personally if a client sues you for mistakes in your inspection report. Both are strongly recommended — the bond is required by TREC, and E&O is standard industry practice.",
  },
  {
    q: "How long is a Texas home inspector bond term?",
    a: "Texas home inspector bonds are typically issued for a 1-year term and renewed annually. Quantum Surety sends renewal reminders so you never miss a renewal and risk a TREC license suspension.",
  },
  {
    q: "Can I get bonded if I am a new inspector with no inspection history?",
    a: "Yes. New inspectors are routinely approved for the standard $10,000 TREC bond. Credit score is the primary underwriting factor. There is no minimum years-in-business requirement for standard bond amounts.",
  },
];

export default function HomeInspectorBondTexas() {
  useSEO({
    title: "Texas Home Inspector Bond | TREC Inspector Surety Bond | Quantum Surety",
    description:
      "Get your Texas home inspector bond same-day. Required by TREC for all licensed professional, real estate, and apprentice inspectors. $10,000 bond from $100/yr. Instant PDF.",
    canonical: "/bonds/home-inspector-bond-texas",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Service", "serviceType": "Surety Bond", "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" }, "areaServed": { "@type": "State", "name": "Texas" } }, "ld-json-Service");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/license-bond-texas">
              <span className="hover:text-white cursor-pointer">License Bonds</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Home Inspector Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">TREC Required</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Home Inspector Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by the Texas Real Estate Commission (TREC) for all licensed professional, real estate, and apprentice home inspectors. $10,000 bond — get yours same-day with instant PDF delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Inspector Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Bond amount", value: "$10,000", sub: "Required by TREC for all inspector licenses" },
            { label: "Annual cost", value: "From $100/yr", sub: "Based on credit profile" },
            { label: "Delivery", value: "Same-day", sub: "Instant PDF by email" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-teal-100">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className="text-xs text-teal-700 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* License types */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">TREC Inspector License Types Requiring a Bond</h2>
          <p className="text-gray-600 text-sm mb-6">The Texas Real Estate Commission requires a $10,000 surety bond for each of the following inspector license levels.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {requirements.map((b) => (
              <div key={b.type} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.type}</p>
                  <p className="text-xs text-gray-500">{b.authority}</p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">Bond amount: {b.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why required */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Does TREC Require a Home Inspector Bond?</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            The TREC inspector bond protects homebuyers and real estate clients from financial harm caused by a licensed inspector's violation of TREC standards, negligent inspections, or professional misconduct. Texas Occupations Code §1102 governs the home inspection industry and its bonding requirements.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              "TREC standards of practice violations",
              "Failure to disclose material defects",
              "Professional misconduct complaints",
              "Negligent or fraudulent inspection reports",
              "Failure to complete contracted services",
              "Violations of Texas Occupations Code §1102",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to get bonded */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your TREC Inspector Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Select your license type", body: "Choose your TREC inspector license level — Professional Inspector, Real Estate Inspector, or Apprentice Inspector." },
              { step: "2", title: "Instant approval", body: "Most Texas home inspectors are approved immediately online. No financial statements required for the standard $10,000 bond." },
              { step: "3", title: "File with TREC", body: "Receive your bond certificate via email as a PDF. Upload it to the TREC online license portal as part of your application or renewal." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{item.q}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Home Inspector Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · TREC compliant · From $100/yr · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Inspector Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related Texas license bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/tdlr-bond-texas", title: "TDLR Contractor Bond", sub: "Electricians, HVAC, irrigators" },
              { href: "/bonds/license-bond-texas", title: "All License Bonds", sub: "Every Texas trade bond" },
              { href: "/bonds/notary-bond-texas", title: "Notary Bond — $50", sub: "Texas Secretary of State" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">View page <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
