import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Fort Worth Development Services" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Fort Worth Development Services" },
  { type: "HVAC / AC Contractor Bond", amount: "$10,000", authority: "City of Fort Worth Development Services" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Fort Worth Development Services" },
  { type: "Mechanical Contractor Bond", amount: "$10,000", authority: "City of Fort Worth Development Services" },
  { type: "Roofing Contractor Bond", amount: "$10,000", authority: "City of Fort Worth Development Services" },
];

const faqs = [
  {
    q: "Does Fort Worth require a contractor bond?",
    a: "Yes. The City of Fort Worth requires licensed contractors to carry a surety bond as part of the city contractor licensing process. Bond requirements are administered through Fort Worth Development Services.",
  },
  {
    q: "What is the bond amount for contractors in Fort Worth?",
    a: "General contractors in Fort Worth typically require a $25,000 surety bond. Trade contractors (electrical, HVAC, plumbing) typically require $10,000. Verify your exact bond requirement with Fort Worth Development Services.",
  },
  {
    q: "How much does a Fort Worth contractor bond cost?",
    a: "For a $10,000 bond, most Fort Worth contractors pay $100–$250/year. For a $25,000 bond, expect $250–$500/year. Rates depend on your credit profile. Most applicants are approved same-day.",
  },
  {
    q: "Do Fort Worth contractors also need a Tarrant County bond?",
    a: "Generally, city bonds cover work within city limits. If you're working in unincorporated Tarrant County, check with the county for any applicable bond or registration requirements. For city of Fort Worth work, the city bond is your primary requirement.",
  },
  {
    q: "I already have a TDLR bond — do I still need a Fort Worth city bond?",
    a: "Likely yes. Your TDLR bond covers your state-issued license. The City of Fort Worth requires its own bond for city licensing and permit-pulling. Many contractors carry both. We can issue both types simultaneously.",
  },
];

export default function ContractorBondFortWorth() {
  useSEO({
    title: "Contractor Bond Fort Worth TX | City License Bond | Quantum Surety",
    description:
      "Get your Fort Worth contractor bond same-day. Required by the City of Fort Worth for general, electrical, HVAC, plumbing, and mechanical contractor licenses. From $100/yr. Instant PDF.",
    canonical: "/bonds/contractor-bond-fort-worth",
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
            <span>Fort Worth Contractor Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3" /> Fort Worth, TX</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Contractor Bond — Fort Worth, Texas
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by the City of Fort Worth Development Services for contractor licenses across all trades — electrical, HVAC, plumbing, mechanical, and general contracting. Get bonded same-day.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fort Worth Contractor License Bonds by Trade</h2>
          <p className="text-gray-600 text-sm mb-6">Fort Worth Development Services requires surety bonds for contractor licenses across multiple trades. Bonds must be filed before permits are issued.</p>
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

        {/* How to get bonded */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your Fort Worth Contractor Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Tell us your trade", body: "Select your contractor license type and bond amount required by Fort Worth Development Services. Takes 2 minutes." },
              { step: "2", title: "Instant approval", body: "Most Fort Worth contractors are approved same-day. No financial statements needed for standard bond amounts." },
              { step: "3", title: "File with Fort Worth", body: "Bond certificate emailed instantly as a PDF. Submit to Fort Worth Development Services with your license application." },
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
          <h2 className="text-2xl font-bold mb-2">Get Your Fort Worth Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All Fort Worth trades · From $100/yr · TDI Licensed Agency #3480229</p>
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
              { href: "/bonds/contractor-bond-dallas", title: "Dallas Contractor Bond", tag: "Dallas, TX" },
              { href: "/bonds/contractor-bond-houston", title: "Houston Contractor Bond", tag: "Houston, TX" },
              { href: "/bonds/contractor-bond-austin", title: "Austin Contractor Bond", tag: "Austin, TX" },
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
