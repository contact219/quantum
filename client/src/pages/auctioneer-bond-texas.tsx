import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, AlertTriangle } from "lucide-react";

const QUOTE_LINK = "/quote?type=license&bond=auctioneer";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Auctioneer Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/auctioneer-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas auctioneer license surety bond required by TDLR. $10,000 bond for licensed auctioneers. Instant online issuance.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "price": "100", "priceValidUntil": "2027-12-31", "availability": "https://schema.org/InStock" }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a Texas auctioneer bond?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas auctioneer bond is a $10,000 surety bond required by the Texas Department of Licensing and Regulation (TDLR) for all licensed auctioneers under the Texas Occupation Code Chapter 1802. It protects consumers and clients from financial harm caused by auctioneer misconduct, fraud, or failure to remit sale proceeds." } },
    { "@type": "Question", "name": "How much does a Texas auctioneer bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "Most Texas auctioneers pay $100–$250 per year for a $10,000 auctioneer bond. The exact premium depends on your credit profile. Well-qualified applicants typically pay around $100/year." } },
    { "@type": "Question", "name": "Is an auctioneer bond required in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Texas Department of Licensing and Regulation (TDLR) requires all licensed auctioneers to maintain a $10,000 surety bond under Texas Occupations Code §1802.254 as a condition of licensure." } },
    { "@type": "Question", "name": "How long does the Texas auctioneer license last?", "acceptedAnswer": { "@type": "Answer", "text": "Texas auctioneer licenses are issued for 2-year terms and must be renewed biennially with TDLR. Your auctioneer bond must remain active throughout the license term." } }
  ]
};

const faqs = [
  { q: "What is a Texas auctioneer bond?", a: "A Texas auctioneer bond is a $10,000 surety bond required by the Texas Department of Licensing and Regulation (TDLR) for all licensed auctioneers under Texas Occupations Code Chapter 1802. It protects consumers and clients from financial harm caused by auctioneer misconduct, fraud, or failure to remit sale proceeds." },
  { q: "How much does a Texas auctioneer bond cost?", a: "Most Texas auctioneers pay $100–$250 per year for a $10,000 auctioneer bond. The exact premium depends on your credit profile. Well-qualified applicants typically pay around $100/year." },
  { q: "Is an auctioneer bond required in Texas?", a: "Yes. TDLR requires all licensed auctioneers to maintain a $10,000 surety bond under Texas Occupations Code §1802.254 as a condition of licensure. Operating without a valid bond is a violation that can result in license suspension or revocation." },
  { q: "How long does the Texas auctioneer license last?", a: "Texas auctioneer licenses are issued for 2-year terms and must be renewed biennially with TDLR. Your auctioneer bond must remain active throughout the license term." },
  { q: "Do apprentice auctioneers need a bond?", a: "Yes. Both licensed auctioneers and apprentice auctioneers in Texas are required to hold a surety bond under TDLR rules. The bond amount is the same — $10,000." },
];

export default function AuctioneerBondTexas() {
  useSEO({
    title: "Texas Auctioneer Bond | $10,000 TDLR Bond | Instant Online | Quantum Surety",
    description: "Get your Texas auctioneer license bond instantly — $10,000 coverage required by TDLR under Texas Occupations Code §1802. From $100/yr. Instant PDF certificate. TDI-licensed.",
    canonical: "/bonds/auctioneer-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/tdlr-bond-texas"><span className="hover:text-white cursor-pointer">TDLR Bonds</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Auctioneer Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Occupations Code §1802.254</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Auctioneer Bond — TDLR License Requirement</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            All Texas-licensed auctioneers must maintain a $10,000 surety bond with TDLR under Texas Occupations Code §1802.254. Get bonded same-day — instant PDF certificate, accepted by the Texas Department of Licensing and Regulation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Auctioneer Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Bond amount", value: "$10,000", sub: "Required under §1802.254" },
            { label: "Annual cost", value: "From $100/yr", sub: "Credit-based pricing" },
            { label: "Delivery", value: "Same-day", sub: "Instant PDF by email" }
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
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Auctioneer Bond Requirements</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            The <strong>Texas Department of Licensing and Regulation (TDLR)</strong> requires all licensed auctioneers and apprentice auctioneers to maintain a $10,000 surety bond under <strong>Texas Occupations Code §1802.254</strong>. The bond must be filed with TDLR as part of your auctioneer license application or renewal. It remains a continuous requirement throughout your license term.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Bond amount", detail: "$10,000 required by TDLR" },
              { title: "License term", detail: "2-year license, renewed biennially" },
              { title: "Applies to", detail: "Licensed auctioneers & apprentice auctioneers" },
              { title: "Regulatory authority", detail: "Texas TDLR — Auctioneer program" },
              { title: "Annual cost", detail: "From $100/yr — credit-based" },
              { title: "Delivery", detail: "Instant PDF, TDLR-accepted" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Bond required before TDLR will issue your auctioneer license</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Under Texas Occupations Code §1802.254, TDLR will not issue or renew an auctioneer license without a valid $10,000 surety bond on file. The bond protects consumers against financial harm from auctioneer misconduct, fraud, or failure to remit proceeds from auctions. Operating as an auctioneer without a valid license and bond is a Class A misdemeanor.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions — Texas Auctioneer Bond</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2"><Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{item.q}</p>
                </div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{item.a}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Auctioneer Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · $10,000 TDLR-accepted bond · From $100/yr · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Auctioneer Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button>
            </a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related TDLR license bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/tdlr-bond-texas", title: "TDLR License Bonds — All Types", tag: "Hub Page" },
              { href: "/bonds/home-inspector-bond-texas", title: "Home Inspector Bond (TREC)", tag: "TREC License" },
              { href: "/bonds/pest-control-bond-texas", title: "Pest Control Bond (TPCL)", tag: "TPCL License" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-1 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 flex items-center gap-1">View page <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
