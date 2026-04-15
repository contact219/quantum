import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight } from "lucide-react";

const requirements = [
  { city: "Dallas", amount: "$10,000", authority: "City of Dallas Development Services" },
  { city: "Houston", amount: "$10,000", authority: "Houston Permitting Center" },
  { city: "Austin", amount: "$10,000", authority: "City of Austin Development Services" },
  { city: "San Antonio", amount: "$10,000", authority: "City of San Antonio Development Services" },
  { city: "Fort Worth", amount: "$10,000", authority: "City of Fort Worth Development Services" },
  { city: "TDLR (Statewide)", amount: "$10,000", authority: "Texas Dept. of Licensing & Regulation" },
];

const faqs = [
  {
    q: "What is an electrical contractor bond in Texas?",
    a: "An electrical contractor bond is a surety bond required before a licensed electrician can pull permits or operate as a licensed electrical contractor in Texas. It protects property owners and the municipality if the contractor fails to complete work, violates code, or causes damage.",
  },
  {
    q: "Is the electrical contractor bond different from general liability insurance?",
    a: "Yes. A surety bond protects the public and obligee (city or state agency) — not the contractor. General liability insurance protects your business from third-party claims. Most Texas jurisdictions require both. The bond is a licensing requirement; insurance is a separate coverage.",
  },
  {
    q: "How much does an electrical contractor bond cost in Texas?",
    a: "For a $10,000 bond, most electricians pay $100–$250 per year. Your exact premium is based on your credit profile. Most applicants are approved same-day with no financials required.",
  },
  {
    q: "Do I need a new bond for each city I work in?",
    a: "Possibly. Texas cities each issue their own electrical contractor licenses, and each may require a separate bond. If you hold a TDLR electrical license, that bond covers statewide licensing. City-level bonds are typically required for local permit-pulling privileges. We can issue bonds for all Texas jurisdictions.",
  },
  {
    q: "How quickly can I get my bond?",
    a: "Instantly. Once your application is submitted and approved, your bond certificate is emailed as a PDF — ready to submit with your license application or permit application.",
  },
];

export default function ElectricalContractorBondTexas() {
  useSEO({
    title: "Electrical Contractor Bond Texas | City & TDLR License Bond | Quantum Surety",
    description:
      "Get your Texas electrical contractor bond same-day. Required for city electrical licenses (Dallas, Houston, Austin) and TDLR. $10,000 bond from $100/yr. Instant PDF.",
    canonical: "/bonds/electrical-contractor-bond-texas",
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
            <span>Electrical Contractor Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">City & TDLR License Bond</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Electrical Contractor Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required for licensed electricians operating in Texas — both at the city level (Dallas, Houston, Austin) and through TDLR. Get bonded same-day with instant PDF delivery.
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
            { label: "Bond amount", value: "$10,000", sub: "Standard TX requirement" },
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

        {/* Where required */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Where Electrical Contractor Bonds Are Required in Texas</h2>
          <p className="text-gray-600 text-sm mb-6">Each Texas city issues its own electrical contractor license and may require a separate surety bond. TDLR also requires a bond for the state electrical contractor license.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {requirements.map((r) => (
              <div key={r.city} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.city}</p>
                  <p className="text-xs text-gray-500">{r.authority}</p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">Bond amount: {r.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Don't see your city? <Link href="/quote"><span className="text-indigo-600 hover:underline cursor-pointer">Contact us</span></Link> — we issue bonds for all Texas municipalities.
          </p>
        </section>

        {/* What it covers */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Does an Electrical Contractor Bond Cover?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Failure to complete licensed electrical work",
              "Violations of the National Electrical Code (NEC)",
              "Unpaid subcontractors or material suppliers",
              "Consumer financial losses due to contractor default",
              "Licensing rule violations",
              "Work that fails city inspection and is abandoned",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your Electrical Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Submit your request", body: "Select Texas electrical contractor bond, enter the bond amount required by your city or TDLR. Takes 2 minutes." },
              { step: "2", title: "Instant approval", body: "Most electricians are approved immediately. No financials or business records needed for standard $10,000 bonds." },
              { step: "3", title: "File and get to work", body: "Bond certificate emailed instantly as a PDF. Submit to your city licensing department or TDLR with your application." },
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
          <h2 className="text-2xl font-bold mb-2">Get Your Electrical Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All Texas cities & TDLR · Rates from $100/yr · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote?type=license&state=TX">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
