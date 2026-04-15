import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight } from "lucide-react";

const licenseTypes = [
  { type: "Master Plumber", amount: "$10,000", authority: "Texas State Board of Plumbing Examiners (TSBPE)" },
  { type: "Journeyman Plumber", amount: "$10,000", authority: "Texas State Board of Plumbing Examiners (TSBPE)" },
  { type: "Plumbing Inspector", amount: "$10,000", authority: "TSBPE" },
  { type: "Drain Cleaner", amount: "$10,000", authority: "TSBPE" },
  { type: "City of Houston Plumbing License", amount: "$10,000", authority: "Houston Permitting Center" },
  { type: "City of Dallas Plumbing License", amount: "$10,000", authority: "City of Dallas Development Services" },
];

const faqs = [
  {
    q: "What is a Texas plumbing contractor bond?",
    a: "A Texas plumbing contractor bond is a surety bond required by the Texas State Board of Plumbing Examiners (TSBPE) and some Texas cities as a condition of obtaining a plumbing license. It protects property owners and the public if a licensed plumber fails to complete work, violates code, or abandons a job.",
  },
  {
    q: "Does every plumber in Texas need a surety bond?",
    a: "Most licensed plumbers in Texas are required to carry a surety bond. TSBPE requires bonds for Master Plumbers operating their own contracting businesses. Journeyman plumbers working under a licensed master typically rely on the master's bond.",
  },
  {
    q: "What is the TSBPE and how does it relate to my bond?",
    a: "The Texas State Board of Plumbing Examiners (TSBPE) is the state agency that licenses and regulates plumbers in Texas. Your bond is filed with TSBPE when you apply for or renew your plumbing license. The bond amount is set by TSBPE — typically $10,000.",
  },
  {
    q: "How much does a Texas plumbing contractor bond cost?",
    a: "For a standard $10,000 plumbing contractor bond, most applicants pay $100–$250 per year. Rates are based on your credit profile. Most plumbers are approved same-day without financial statements.",
  },
  {
    q: "Can I get a plumbing bond with no prior business history?",
    a: "Yes. New plumbing businesses qualify for standard $10,000 bonds based primarily on credit score. No years-in-business requirement applies to most standard TSBPE bonds.",
  },
];

export default function PlumbingContractorBondTexas() {
  useSEO({
    title: "Plumbing Contractor Bond Texas | TSBPE License Bond | Quantum Surety",
    description:
      "Get your Texas plumbing contractor bond same-day. Required by TSBPE for Master Plumber licenses and Texas city permits. $10,000 bond from $100/yr. Instant PDF.",
    canonical: "/bonds/plumbing-contractor-bond-texas",
  });

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
            <span>Plumbing Contractor Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">TSBPE License Bond</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Plumbing Contractor Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by the Texas State Board of Plumbing Examiners (TSBPE) for Master Plumber licenses and by Texas cities for local plumbing permits. Get bonded same-day with instant PDF delivery.
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
            { label: "Bond amount", value: "$10,000", sub: "Standard TSBPE requirement" },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Texas Plumbing License Types That Require a Bond</h2>
          <p className="text-gray-600 text-sm mb-6">TSBPE issues several plumbing license classes. Most active plumbing contractors and master plumbers need a surety bond to obtain or renew their license.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {licenseTypes.map((l) => (
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Does a Plumbing Contractor Bond Cover?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Failure to complete licensed plumbing work",
              "Violations of the Texas Plumbing License Law",
              "Work that fails to meet code and is abandoned",
              "Consumer financial losses due to contractor default",
              "Unpaid suppliers or subcontractors",
              "License rule violations investigated by TSBPE",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your Plumbing Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Submit your request", body: "Select Texas plumbing contractor bond and your license type (Master Plumber, Journeyman, etc.). Takes 2 minutes." },
              { step: "2", title: "Instant approval", body: "Most plumbers are approved immediately. No financial statements or business records required for standard $10,000 bonds." },
              { step: "3", title: "File with TSBPE", body: "Bond certificate emailed instantly. Submit to TSBPE with your license application or renewal, or to your city permitting office." },
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
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Plumbing Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · TSBPE & all Texas cities · From $100/yr · TDI Licensed Agency #3480229</p>
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
