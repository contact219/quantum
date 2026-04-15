import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight } from "lucide-react";

const dealerTypes = [
  { type: "Independent Motor Vehicle Dealer", amount: "$25,000", authority: "Texas DMV – Motor Vehicle Division" },
  { type: "Franchised Motor Vehicle Dealer", amount: "$25,000", authority: "Texas DMV – Motor Vehicle Division" },
  { type: "Wholesale Motor Vehicle Dealer", amount: "$25,000", authority: "Texas DMV – Motor Vehicle Division" },
  { type: "Motorcycle Dealer", amount: "$25,000", authority: "Texas DMV – Motor Vehicle Division" },
  { type: "Used Car Dealer", amount: "$25,000", authority: "Texas DMV – Motor Vehicle Division" },
  { type: "Salvage Dealer / Rebuilder", amount: "$25,000", authority: "Texas DMV – Motor Vehicle Division" },
];

const faqs = [
  {
    q: "What is a Texas auto dealer bond?",
    a: "A Texas auto dealer bond (also called a motor vehicle dealer bond) is a surety bond required by the Texas Department of Motor Vehicles (TxDMV) as a condition of obtaining a dealer license. It protects consumers, lenders, and the state if a dealer commits fraud, misrepresents a vehicle, fails to transfer titles, or violates dealer licensing rules.",
  },
  {
    q: "How much does a Texas auto dealer bond cost?",
    a: "For a $25,000 auto dealer bond, most applicants pay $250–$500 per year. Your premium is based primarily on your credit score. Dealers with good credit typically pay about 1–2% of the bond amount annually.",
  },
  {
    q: "What is the required bond amount for a Texas auto dealer?",
    a: "The Texas DMV requires a $25,000 surety bond for most motor vehicle dealer licenses, including independent dealers, franchise dealers, wholesale dealers, and used car dealers. The bond amount is set by TxDMV and applies uniformly to most dealer types.",
  },
  {
    q: "Does a Texas auto dealer bond cover my inventory?",
    a: "No. A surety bond is not insurance for your inventory or vehicles. It protects consumers and the public from financial harm caused by the dealer's failure to perform legal obligations — such as delivering clear titles or completing sale paperwork. Inventory should be covered by a separate commercial insurance policy.",
  },
  {
    q: "How quickly can I get my auto dealer bond?",
    a: "Same-day. Once your application is approved, your bond certificate is emailed instantly as a PDF. You can submit it to TxDMV with your dealer license application on the same day.",
  },
  {
    q: "Can I get an auto dealer bond with bad credit?",
    a: "Yes. Texas auto dealer bonds are available to most applicants regardless of credit score. Rates may be slightly higher for lower credit scores, but approval is generally not denied for standard bond amounts.",
  },
];

export default function AutoDealerBondTexas() {
  useSEO({
    title: "Texas Auto Dealer Bond | Motor Vehicle Dealer License Bond | Quantum Surety",
    description:
      "Get your Texas auto dealer bond same-day. Required by TxDMV for all motor vehicle dealer licenses. $25,000 bond, rates from $250/yr. Instant PDF delivery.",
    canonical: "/bonds/auto-dealer-bond-texas",
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
            <span>Auto Dealer Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">TxDMV Dealer License Bond</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Auto Dealer Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by the Texas Department of Motor Vehicles (TxDMV) for all motor vehicle dealer licenses — independent, franchise, wholesale, and used car dealers. Get bonded same-day with instant PDF delivery.
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
            { label: "Bond amount", value: "$25,000", sub: "TxDMV standard requirement" },
            { label: "Annual cost", value: "From $250/yr", sub: "Based on credit profile" },
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

        {/* Dealer types */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Texas Dealer License Types That Require a Bond</h2>
          <p className="text-gray-600 text-sm mb-6">The Texas DMV requires a $25,000 surety bond for all active motor vehicle dealer licenses before a license can be issued or renewed.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {dealerTypes.map((d) => (
              <div key={d.type} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{d.type}</p>
                  <p className="text-xs text-gray-500">{d.authority}</p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">Bond amount: {d.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What it covers */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Does a Texas Auto Dealer Bond Protect Against?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Failure to deliver a clear vehicle title",
              "Misrepresentation of vehicle condition or history",
              "Fraudulent sales practices",
              "Failure to pay off liens before sale",
              "Consumer financial losses from dealer misconduct",
              "Violations of Texas dealer licensing rules",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your Auto Dealer Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Tell us your dealer type", body: "Select Texas auto dealer bond and your license type (independent, franchise, wholesale, used car). Takes 2 minutes." },
              { step: "2", title: "Fast approval", body: "Most dealers are approved same-day. No financial statements required for standard $25,000 bonds." },
              { step: "3", title: "File with TxDMV", body: "Bond certificate emailed instantly as a PDF. Submit to TxDMV with your eLICENSING application." },
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
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Auto Dealer Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All TxDMV dealer types · From $250/yr · TDI Licensed Agency #3480229</p>
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
              { href: "/bonds/notary-bond-texas", title: "Texas Notary Bond", tag: "Notary" },
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
