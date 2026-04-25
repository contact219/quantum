import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight } from "lucide-react";

const licenses = [
  { type: "TACLA (Air Conditioning Contractor)", amount: "$10,000", authority: "TDLR – Air Conditioning & Refrigeration" },
  { type: "TACLA (Technician License)", amount: "$10,000", authority: "TDLR – Air Conditioning & Refrigeration" },
  { type: "Residential A/C & Heating Contractor", amount: "$10,000", authority: "TDLR" },
  { type: "City of Dallas HVAC License", amount: "$10,000", authority: "City of Dallas Development Services" },
  { type: "City of Houston HVAC License", amount: "$10,000", authority: "Houston Permitting Center" },
  { type: "City of Austin HVAC License", amount: "$10,000", authority: "City of Austin Development Services" },
];

const faqs = [
  {
    q: "What is a Texas HVAC contractor bond?",
    a: "A Texas HVAC contractor bond (also called an AC contractor bond) is a surety bond required by TDLR or a Texas city as a condition of obtaining your air conditioning and refrigeration contractor license. It protects homeowners and businesses if you fail to complete work, violate licensing rules, or cause damage.",
  },
  {
    q: "Do HVAC technicians need a bond if they work for a company?",
    a: "If you're an employee of a licensed HVAC company, the company's bond typically covers your work. If you're operating your own AC contracting business and pulling permits in your name, you'll need your own surety bond and license.",
  },
  {
    q: "How much does an HVAC contractor bond cost in Texas?",
    a: "Most Texas HVAC contractor bonds cost $100–$250 per year for a $10,000 bond amount. Your premium is based on your credit profile. Approval is typically instant with no financial statements required.",
  },
  {
    q: "What is the TACLA license and does it require a bond?",
    a: "TACLA stands for Texas Air Conditioning Contractor License — issued by TDLR. Both contractor-level and technician-level TACLA licenses may require a surety bond depending on the specific license type and bond amount set by TDLR.",
  },
  {
    q: "Can I get bonded with a new HVAC business and no prior history?",
    a: "Yes. New HVAC businesses are routinely approved for standard $10,000 bonds. Credit score is the primary factor; business history is not required for standard bond amounts.",
  },
];

export default function HVACBondTexas() {
  useSEO({
    title: "HVAC Contractor Bond Texas | AC License Bond | TACLA | Quantum Surety",
    description:
      "Get your Texas HVAC contractor bond same-day. Required for TACLA air conditioning licenses and city HVAC permits. $10,000 bond from $100/yr. Instant PDF delivery.",
    canonical: "/bonds/hvac-bond-texas",
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
            <Link href="/bonds/tdlr-bond-texas">
              <span className="hover:text-white cursor-pointer">TDLR Bond</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>HVAC Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">TACLA / TDLR License Bond</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas HVAC Contractor Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by TDLR for TACLA air conditioning and refrigeration contractor licenses, and by most Texas cities for HVAC permit-pulling privileges. Get bonded same-day — instant PDF delivery.
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
            { label: "Bond amount", value: "$10,000", sub: "Standard TDLR & city requirement" },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">HVAC License Types That Require a Bond in Texas</h2>
          <p className="text-gray-600 text-sm mb-6">TDLR issues multiple TACLA license classes for HVAC contractors and technicians. Texas cities may also require a separate local bond.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {licenses.map((l) => (
              <div key={l.type} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{l.type}</p>
                  <p className="text-xs text-gray-500">{l.authority}</p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">Bond amount: {l.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What it covers */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Does an HVAC Contractor Bond Protect Against?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Incomplete or abandoned HVAC installations",
              "Violations of TDLR TACLA licensing rules",
              "Refrigerant handling violations (EPA 608)",
              "Consumer losses due to contractor default",
              "Failure to meet city inspection standards",
              "Warranty work abandonment after equipment failure",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your HVAC Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Tell us your license type", body: "Select Texas HVAC contractor bond and specify if it's for TDLR (TACLA), a specific city, or both. Takes 2 minutes." },
              { step: "2", title: "Instant approval", body: "Most HVAC contractors are approved immediately. No financial statements required for standard $10,000 bonds." },
              { step: "3", title: "File and get licensed", body: "Bond PDF emailed instantly. Submit to TDLR or your city licensing office with your TACLA application." },
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
          <h2 className="text-2xl font-bold mb-2">Get Your Texas HVAC Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · TACLA & all Texas cities · From $100/yr · TDI Licensed Agency #3480229</p>
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
              { href: "/bonds/tdlr-bond-texas", title: "TDLR Contractor Bond", tag: "TDLR License" },
              { href: "/bonds/electrical-contractor-bond-texas", title: "Electrical Contractor Bond", tag: "City License" },
              { href: "/bonds/plumbing-contractor-bond-texas", title: "Plumbing Contractor Bond", tag: "Plumbing License" },
              { href: "/bonds/license-bond-texas", title: "All Texas License Bonds", tag: "Hub Page" },
              { href: "/blog/texas-hvac-contractor-bond-requirements", title: "HVAC Bond Requirements Guide 2026", tag: "Blog" },
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
