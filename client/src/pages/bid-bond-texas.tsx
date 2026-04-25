import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, FileText, DollarSign } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Bid Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/bid-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Same-day Texas bid bonds for general contractors and subcontractors bidding on public and private construction projects. Required on public projects over $25,000 under Texas Government Code § 2253.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "0", "maxPrice": "250", "unitText": "per bond" } }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a bid bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "A bid bond is a guarantee that a contractor will enter into a contract at the bid price if awarded the project. If the contractor fails to do so, the surety pays the difference between the bid and the next lowest bid, up to the bond penalty." } },
    { "@type": "Question", "name": "How much does a Texas bid bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "Most bid bonds are issued at no charge — the cost is built into the performance and payment bond premium if you win the project. For standalone bid bonds, typical cost is $100–$250 depending on the bid amount." } },
    { "@type": "Question", "name": "How quickly can I get a bid bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Quantum Surety issues bid bonds same-day for most qualified contractors. Submit before noon and receive your bond documents the same business day in most cases." } },
    { "@type": "Question", "name": "What projects require bid bonds in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Texas public projects over $25,000 generally require bid bonds under state law. Federal projects over $150,000 require them under the Miller Act. Many private owners and general contractors also require bid bonds from subcontractors." } },
    { "@type": "Question", "name": "What information do I need to get a bid bond?", "acceptedAnswer": { "@type": "Answer", "text": "You'll need your company name, years in business, the project name and owner, the bid amount, and the bid due date. For larger bids (over $500k), we may request financial statements." } }
  ]
};

export default function BidBondTexas() {
  useSEO({
    title: "Bid Bonds Texas | Same-Day Bid Bond for TX Contractors | Quantum Surety",
    description:
      "Texas bid bonds for public and private construction projects. Same-day issuance, all bond amounts. Required on public projects over $25,000. TDI-licensed agency. Free quote.",
    canonical: "/bonds/bid-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  const steps = [
    { step: "1", title: "Submit your info", body: "Tell us about your company, the project, and the bid amount. Takes under 5 minutes." },
    { step: "2", title: "AI underwriting", body: "Our AI analyzes your submission and matches it to the right carrier instantly." },
    { step: "3", title: "Receive your bond", body: "Bond documents delivered same-day via email. Print or submit electronically." },
  ];

  const faqs = [
    {
      q: "What is a bid bond in Texas?",
      a: "A bid bond is a guarantee that a contractor will enter into a contract at the bid price if awarded the project. If the contractor fails to do so, the surety pays the difference between the bid and the next lowest bid, up to the bond penalty.",
    },
    {
      q: "How much does a Texas bid bond cost?",
      a: "Most bid bonds are issued at no charge — the cost is built into the performance and payment bond premium if you win the project. For standalone bid bonds, typical cost is $100–$250 depending on the bid amount.",
    },
    {
      q: "How quickly can I get a bid bond in Texas?",
      a: "Quantum Surety issues bid bonds same-day for most qualified contractors. Submit before noon and receive your bond documents the same business day in most cases.",
    },
    {
      q: "What projects require bid bonds in Texas?",
      a: "Texas public projects over $25,000 generally require bid bonds under state law. Federal projects over $150,000 require them under the Miller Act. Many private owners and general contractors also require bid bonds from subcontractors.",
    },
    {
      q: "What information do I need to get a bid bond?",
      a: "You'll need your company name, years in business, the project name and owner, the bid amount, and the bid due date. For larger bids (over $500k), we may request financial statements.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Clock className="w-4 h-4" />
            Same-Day Bid Bond Issuance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Texas Bid Bonds — Fast, Simple, Reliable
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Need a bid bond for a Texas construction project? Quantum Surety issues bid bonds
            same-day for qualified contractors. No delays, no runaround — just fast answers.
          </p>
          <Link href="/quote">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
              Get My Bid Bond Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Get a Bid Bond in Texas
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Texas Bid Bond Key Facts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: DollarSign, label: "Typical cost", value: "$0–$250", note: "Most bids are free" },
              { icon: Clock, label: "Turnaround", value: "Same day", note: "For qualified contractors" },
              { icon: FileText, label: "Typical penalty", value: "5–10%", note: "Of the bid amount" },
            ].map((fact) => (
              <div key={fact.label} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <fact.icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-1">{fact.label}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{fact.value}</div>
                <div className="text-sm text-gray-500">{fact.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Bid Bond FAQ — Texas</h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related bonds */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Texas Construction Bonds</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "Performance Bond", desc: "Win the bid? A performance bond guarantees you'll complete the project.", slug: "performance-bond-texas" },
              { name: "Payment Bond", desc: "Issued with performance bonds — protects your subs and suppliers.", slug: "payment-bond-texas" },
              { name: "All Contractor Bonds", desc: "See every bond type available for Texas contractors.", slug: "texas-contractor" },
            ].map((b) => (
              <Link key={b.name} href={`/bonds/${b.slug}`}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 mb-1">{b.name}</p>
                  <p className="text-gray-500 text-xs mb-2">{b.desc}</p>
                  <p className="text-indigo-600 text-xs font-medium">View details →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Texas Bid Bond?</h2>
          <p className="text-indigo-200 mb-8">
            Get your bid bond quote in minutes. Bid due today? Call us — we handle rush requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Bid Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
