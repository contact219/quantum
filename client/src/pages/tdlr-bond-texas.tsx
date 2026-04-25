import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight } from "lucide-react";

const trades = [
  { trade: "Electrician", amount: "$10,000", note: "TDLR Electrical Contractor License" },
  { trade: "HVAC / AC Technician", amount: "$10,000", note: "TDLR Air Conditioning & Refrigeration" },
  { trade: "Plumber", amount: "$10,000", note: "Texas State Board of Plumbing Examiners" },
  { trade: "Boiler Inspector", amount: "$10,000", note: "TDLR Boiler Program" },
  { trade: "Elevator Mechanic", amount: "$10,000", note: "TDLR Elevator Safety" },
  { trade: "Irrigator", amount: "$10,000", note: "TDLR Irrigator License" },
];

const faqs = [
  {
    q: "What is a TDLR contractor bond?",
    a: "A TDLR contractor bond is a surety bond required by the Texas Department of Licensing and Regulation (TDLR) as a condition of obtaining or renewing a contractor license in Texas. It protects consumers and the state if a licensed contractor fails to perform work or violates licensing rules.",
  },
  {
    q: "How much does a TDLR bond cost?",
    a: "Most TDLR contractor bonds cost between $100–$300 per year depending on the bond amount and your credit profile. The bond amount is set by TDLR — typically $10,000 — but your premium is a small percentage of that amount.",
  },
  {
    q: "Which trades require a TDLR bond?",
    a: "TDLR regulates dozens of trades in Texas. Those commonly requiring a surety bond include electricians, HVAC/AC technicians, irrigators, boiler inspectors, and elevator mechanics. Your specific bond requirement will be listed on your TDLR license application.",
  },
  {
    q: "How do I file my TDLR bond?",
    a: "After purchasing your bond, you'll receive a bond certificate. Upload it or mail it to TDLR with your license application. Quantum Surety provides step-by-step filing instructions with every bond purchase.",
  },
  {
    q: "Can I get a TDLR bond with bad credit?",
    a: "Yes. TDLR bonds are available to most applicants regardless of credit score. Rates may be slightly higher for lower credit scores, but approval is generally not denied based on credit alone for standard $10,000 TDLR bonds.",
  },
];

export default function TDLRBondTexas() {
  useSEO({
    title: "TDLR Contractor Bond Texas | Electrician, HVAC & License Bonds | Quantum Surety",
    description:
      "Get your Texas TDLR contractor bond same-day. Required for electricians, HVAC techs, irrigators, and other TDLR-licensed trades. Rates from $100/yr. Instant PDF delivery.",
    canonical: "/bonds/tdlr-bond-texas",
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
            <span>TDLR Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">TDLR License Bond</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas TDLR Contractor Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by the Texas Department of Licensing and Regulation for electricians, HVAC technicians, irrigators, and dozens of other licensed trades. Get your bond same-day — delivered by email, ready to file with TDLR.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My License Bond <ArrowRight className="w-4 h-4 ml-2" />
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
            { label: "Bond amount", value: "$10,000", sub: "Standard TDLR requirement" },
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

        {/* Trades covered */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">TDLR Trades That Require a Bond</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {trades.map((t) => (
              <div key={t.trade} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.trade}</p>
                  <p className="text-xs text-gray-500">{t.note}</p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">Bond amount: {t.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            TDLR regulates 40+ license types. If your trade isn't listed, <Link href="/quote"><span className="text-indigo-600 hover:underline cursor-pointer">contact us</span></Link> — we issue bonds for all TDLR programs.
          </p>
        </section>

        {/* How to get bonded */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How to Get Your TDLR Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Request your bond", body: "Tell us your TDLR license type and the required bond amount. Takes under 2 minutes." },
              { step: "2", title: "Instant approval", body: "Most TDLR bonds are approved immediately. No financial statements or business records required for standard amounts." },
              { step: "3", title: "Receive and file", body: "Bond certificate emailed instantly. Print and submit to TDLR with your license application." },
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
          <h2 className="text-2xl font-bold mb-2">Get Your TDLR Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · Rates from $100/yr · All TDLR trades covered · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My License Bond <ArrowRight className="w-4 h-4 ml-2" />
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/electrical-contractor-bond-texas", title: "Electrical Contractor Bond", tag: "City License" },
              { href: "/bonds/hvac-bond-texas", title: "HVAC Contractor Bond", tag: "TDLR AC" },
              { href: "/bonds/license-bond-texas", title: "All Texas License Bonds", tag: "Hub Page" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-1 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
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
