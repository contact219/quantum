import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Arlington Development Services" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Arlington Development Services" },
  { type: "HVAC / AC Contractor Bond", amount: "$10,000", authority: "City of Arlington Development Services" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Arlington Development Services" },
  { type: "Roofing Contractor Bond", amount: "$10,000", authority: "City of Arlington Development Services" },
  { type: "Sign Contractor Bond", amount: "$10,000", authority: "City of Arlington Development Services" },
];

const faqs = [
  {
    q: "Does Arlington require a contractor bond?",
    a: "Yes. The City of Arlington requires licensed contractors to carry a surety bond as a condition of holding a city contractor license or pulling building permits. Bond requirements vary by trade and license type, and are administered through Arlington Development Services.",
  },
  {
    q: "What is the bond amount for a general contractor in Arlington?",
    a: "General contractors in Arlington typically require a $25,000 surety bond. Trade contractors (electrical, HVAC, plumbing, roofing) typically require $10,000. Check your specific license type with Arlington Development Services for the exact requirement.",
  },
  {
    q: "How much does an Arlington contractor bond cost?",
    a: "For a $10,000 bond, most Arlington contractors pay $100–$250/year. For a $25,000 bond, expect $250–$500/year. Rates are based on your credit score. Same-day approval for most applicants.",
  },
  {
    q: "Do I need a separate bond if I already have a TDLR license?",
    a: "Possibly. A TDLR license covers your state-level credentials. However, to pull permits in the City of Arlington or operate under an Arlington city license, many trades need a separate Arlington-specific surety bond in addition to their TDLR bond. We can issue both.",
  },
  {
    q: "How do I file my contractor bond with the City of Arlington?",
    a: "After purchasing your bond, you'll receive a PDF certificate. Submit it to Arlington Development Services as part of your contractor license application or renewal. Quantum Surety provides filing instructions with every bond.",
  },
];

export default function ContractorBondArlington() {
  useSEO({
    title: "Contractor Bond Arlington TX | City License Bond | Quantum Surety",
    description:
      "Get your Arlington contractor bond same-day. Required by the City of Arlington for general, electrical, HVAC, plumbing, and roofing contractor licenses. From $100/yr.",
    canonical: "/bonds/contractor-bond-arlington",
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
            <span>Arlington Contractor Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3" /> Arlington, TX</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Contractor Bond — Arlington, Texas
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by the City of Arlington for licensed contractors in Tarrant County. Same-day bonding, instant PDF.
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
            { label: "Bond amounts", value: "$10K–$25K", sub: "Varies by trade & license type" },
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

        {/* Bond types */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Arlington Contractor License Bonds by Trade</h2>
          <p className="text-gray-600 text-sm mb-6">The City of Arlington requires surety bonds for contractor licenses across multiple trades. Bond amounts are set by Arlington Development Services.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {bondTypes.map((b) => (
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

        {/* Why Arlington contractors need bonds */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Does Arlington Require a Contractor Bond?</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Arlington contractor bonds protect homeowners, businesses, and the City of Arlington from financial harm caused by a licensed contractor's failure to perform work, violate building codes, or abandon a project. The bond is a financial guarantee — not insurance for the contractor, but a promise backed by a licensed surety company.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              "Incomplete or abandoned construction projects",
              "Violations of Arlington building codes",
              "Failure to obtain required permits",
              "Consumer financial losses from contractor default",
              "Unpaid subcontractors or suppliers",
              "Licensing rule violations by the contractor",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your Arlington Contractor Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Tell us your trade", body: "Select your contractor license type and bond amount required by Arlington Development Services. Takes 2 minutes." },
              { step: "2", title: "Instant approval", body: "Most Arlington contractors are approved immediately. No financial statements required for standard bond amounts." },
              { step: "3", title: "File with Arlington", body: "Bond certificate emailed instantly as a PDF. Submit to Arlington Development Services with your license application." },
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
          <h2 className="text-2xl font-bold mb-2">Get Your Arlington Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All Arlington trades · From $100/yr · TDI Licensed Agency #3480229</p>
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">Other Texas cities</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/contractor-bond-fort-worth", title: "Fort Worth Contractor Bond", tag: "Fort Worth, TX" },
              { href: "/bonds/contractor-bond-dallas", title: "Dallas Contractor Bond", tag: "Dallas, TX" },
              { href: "/bonds/contractor-bond-dallas", title: "Grand Prairie Contractor Bond", tag: "Grand Prairie, TX" },
            ].map((item) => (
              <Link key={item.title} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-1 block flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.tag}</span>
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
