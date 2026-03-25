import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, Clock, Award } from "lucide-react";

export default function TexasContractorBonds() {
  useSEO({
    title: "Surety Bonds for Texas Contractors | Quantum Surety",
    description:
      "Texas contractor surety bonds issued fast. Bid bonds, performance bonds, payment bonds, and license bonds for TX general contractors and subcontractors. AI-assisted approvals.",
    canonical: "/bonds/texas-contractor",
  });

  const bondTypes = [
    {
      name: "Bid Bonds",
      description:
        "Required on most Texas public construction projects. Guarantees you will enter the contract at your bid price if selected. We issue bid bonds same-day for qualified Texas contractors.",
      href: "/quote",
    },
    {
      name: "Performance Bonds",
      description:
        "Required on Texas public projects over $25,000 and most private commercial projects. Guarantees you will complete the project per the contract terms.",
      href: "/quote",
    },
    {
      name: "Payment Bonds",
      description:
        "Protects your subcontractors and suppliers from non-payment. Required alongside performance bonds on most Texas public work under the Government Code.",
      href: "/quote",
    },
    {
      name: "License & Permit Bonds",
      description:
        "Required by Texas cities and counties to obtain contractor licenses. Common bonds include TDLR bonds, electrical contractor bonds, plumbing bonds, and HVAC bonds.",
      href: "/quote",
    },
  ];

  const texasRequirements = [
    "Texas public projects over $25,000 require performance and payment bonds under Texas Government Code § 2253",
    "Federal projects over $150,000 require bonds under the Miller Act",
    "TDLR regulates many contractor license bond requirements statewide",
    "Houston, Dallas, Austin, and San Antonio all have local bonding requirements for permits",
    "Most general contractors require subcontractors to carry bonds on commercial projects",
  ];

  const whyQuantum = [
    { icon: Clock, title: "Quotes in minutes", body: "AI-assisted underwriting delivers bond quotes faster than traditional agencies — often the same day." },
    { icon: Shield, title: "Top-rated carriers", body: "We work with A-rated surety carriers so your bonds are accepted on any Texas public or private project." },
    { icon: Award, title: "Texas licensed", body: "Licensed surety bond producer in Texas. We know state and local requirements across all 254 Texas counties." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Shield className="w-4 h-4" />
            Texas Licensed Surety Bond Producer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Surety Bonds for Texas Contractors
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Fast, AI-powered bond approvals for general contractors and subcontractors across Texas.
            Bid bonds, performance bonds, payment bonds, and license bonds — issued same-day for qualified contractors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Texas Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ai-bond-finder">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Find My Bond Type
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bond types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Texas Contractor Bond Types
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We issue all bond types required for construction work in Texas — from small subcontractor bids to multi-million dollar public projects.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {bondTypes.map((bond) => (
              <div key={bond.name} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{bond.name}</h3>
                <p className="text-gray-600 mb-4">{bond.description}</p>
                <Link href={bond.href}>
                  <Button variant="outline" size="sm">
                    Get a {bond.name} Quote <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Texas requirements */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Texas Surety Bond Requirements
          </h2>
          <p className="text-gray-600 mb-8">
            Texas has specific bonding requirements for public and private construction work. Here's what contractors need to know:
          </p>
          <ul className="space-y-4">
            {texasRequirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Quantum */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Texas Contractors Choose Quantum Surety
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyQuantum.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Bonded in Texas?</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Submit your information and get a bond quote in minutes. No obligation, no paperwork — just fast answers.
          </p>
          <Link href="/quote">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
              Start Your Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
