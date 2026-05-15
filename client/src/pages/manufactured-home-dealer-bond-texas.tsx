import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, AlertTriangle } from "lucide-react";

const QUOTE_LINK = "/quote?type=license&bond=manufactured-home-dealer";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Manufactured Home Dealer Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/manufactured-home-dealer-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas manufactured home dealer surety bond required by TDHCA under Occupations Code Ch. 1201. $10,000–$100,000 depending on volume. Instant online issuance.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "price": "100", "priceValidUntil": "2027-12-31", "availability": "https://schema.org/InStock" }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What bond do manufactured home dealers need in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Texas manufactured home dealers must obtain a surety bond as required by the Texas Department of Housing and Community Affairs (TDHCA) under Texas Occupations Code Chapter 1201. The bond amount is $10,000 for standard retailers, $50,000 for retailers selling more than 25 homes per year, and $100,000 for developers with more than 50 lots." } },
    { "@type": "Question", "name": "How much does a Texas manufactured home dealer bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "A $10,000 manufactured home dealer bond typically costs $100–$250 per year. A $50,000 bond costs $200–$600/year, and a $100,000 bond costs $500–$1,500/year. Actual premium depends on credit score and business history." } },
    { "@type": "Question", "name": "Who regulates manufactured home dealers in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "The Texas Department of Housing and Community Affairs (TDHCA) Manufactured Housing Division licenses and regulates all manufactured home retailers, installers, and developers in Texas under Texas Occupations Code Chapter 1201. The bond must be filed with TDHCA as part of the license application." } },
    { "@type": "Question", "name": "Do manufactured home installers need a bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Texas manufactured home installers are also required to maintain a $10,000 surety bond with TDHCA under Texas Occupations Code §1201.104. The bond is a condition of the installer license and must be maintained throughout the license term." } },
    { "@type": "Question", "name": "How long is a Texas manufactured home dealer license?", "acceptedAnswer": { "@type": "Answer", "text": "Texas manufactured home dealer and installer licenses are issued for one-year terms and must be renewed annually with TDHCA. Your surety bond must remain active and on file with TDHCA throughout the license period." } }
  ]
};

const faqs = [
  { q: "What bond do manufactured home dealers need in Texas?", a: "Texas manufactured home dealers must obtain a surety bond as required by the Texas Department of Housing and Community Affairs (TDHCA) under Texas Occupations Code Chapter 1201. The bond amount is $10,000 for standard retailers, $50,000 for retailers selling more than 25 homes per year, and $100,000 for developers with more than 50 lots." },
  { q: "How much does a Texas manufactured home dealer bond cost?", a: "A $10,000 manufactured home dealer bond typically costs $100–$250 per year. A $50,000 bond costs $200–$600/year, and a $100,000 bond costs $500–$1,500/year. Actual premium depends on credit score and business history." },
  { q: "Who regulates manufactured home dealers in Texas?", a: "The Texas Department of Housing and Community Affairs (TDHCA) Manufactured Housing Division licenses and regulates all manufactured home retailers, installers, and developers in Texas under Texas Occupations Code Chapter 1201. The bond must be filed with TDHCA as part of the license application." },
  { q: "Do manufactured home installers need a bond in Texas?", a: "Yes. Texas manufactured home installers are also required to maintain a $10,000 surety bond with TDHCA under Texas Occupations Code §1201.104. The bond is a condition of the installer license and must be maintained throughout the license term." },
  { q: "How long is a Texas manufactured home dealer license?", a: "Texas manufactured home dealer and installer licenses are issued for one-year terms and must be renewed annually with TDHCA. Your surety bond must remain active and on file with TDHCA throughout the license period." },
];

export default function ManufacturedHomeDealerBondTexas() {
  useSEO({
    title: "Texas Manufactured Home Dealer Bond | TDHCA License Bond | Quantum Surety",
    description: "Texas manufactured home dealer surety bond required by TDHCA. $10,000–$100,000 depending on sales volume. Instant online issuance. From $100/yr. TDI-licensed agency.",
    canonical: "/bonds/manufactured-home-dealer-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/license-bond-texas"><span className="hover:text-white cursor-pointer">Texas License Bonds</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Manufactured Home Dealer Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Occupations Code Ch. 1201</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Manufactured Home Dealer Bond — TDHCA Requirement</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            The Texas Department of Housing and Community Affairs (TDHCA) requires all manufactured home retailers, installers, and developers to maintain a surety bond under Texas Occupations Code Chapter 1201. Get bonded same-day — instant PDF certificate accepted by TDHCA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Dealer Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (972) 379-9216</Button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Bond amount", value: "$10K–$100K", sub: "Based on sales volume" },
            { label: "Annual cost", value: "From $100/yr", sub: "Credit-based pricing" },
            { label: "Delivery", value: "Same-day", sub: "TDHCA-accepted PDF" }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Manufactured Home Dealer Bond Requirements</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The <strong>Texas Department of Housing and Community Affairs (TDHCA)</strong> Manufactured Housing Division licenses and regulates all manufactured home retailers, installers, and developers under <strong>Texas Occupations Code Chapter 1201</strong>. A surety bond is required as a condition of licensure and must remain active throughout the license term.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Bond amounts vary based on your license category and annual sales volume. Quantum Surety issues all three tiers same-day with instant PDF delivery accepted by TDHCA.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">License Type</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Bond Amount</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Annual Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Retailer (standard)", amount: "$10,000", cost: "From $100/yr" },
                  { type: "Retailer (25+ homes/year)", amount: "$50,000", cost: "From $200/yr" },
                  { type: "Developer (50+ lots)", amount: "$100,000", cost: "From $500/yr" },
                  { type: "Installer", amount: "$10,000", cost: "From $100/yr" },
                ].map((row) => (
                  <tr key={row.type} className="even:bg-gray-50">
                    <td className="p-3 border border-gray-200 text-gray-700">{row.type}</td>
                    <td className="p-3 border border-gray-200 font-semibold text-gray-900">{row.amount}</td>
                    <td className="p-3 border border-gray-200 text-teal-700">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Bond required before TDHCA issues your license</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Under Texas Occupations Code §1201.104, TDHCA will not issue or renew a manufactured home retailer, installer, or developer license without a valid surety bond on file. The bond protects consumers from financial harm caused by dealer misconduct, fraud, or failure to complete transactions. A lapsed bond results in automatic license suspension.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What the Bond Covers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Consumer protection", detail: "Protects buyers from fraud, misrepresentation, or failure to deliver a manufactured home" },
              { title: "Contract performance", detail: "Covers losses if a dealer fails to complete a purchase contract or installation agreement" },
              { title: "Down payment security", detail: "Consumers can recover down payments if a dealer closes or fails to honor the contract" },
              { title: "Title issues", detail: "Covers losses from title defects or failure to properly transfer ownership" },
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

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Manufactured Home Dealer Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · TDHCA-accepted · $10K–$100K bonds · From $100/yr · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (972) 379-9216</Button>
            </a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related Texas license bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/gdn-bond-texas", title: "Texas GDN Dealer Bond", tag: "TxDMV Required" },
              { href: "/bonds/license-bond-texas", title: "All Texas License Bonds", tag: "Hub Page" },
              { href: "/bonds/commercial", title: "Commercial Surety Bonds", tag: "Business Bonds" },
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
