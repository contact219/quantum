import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, AlertCircle, Building2 } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Performance Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/performance-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas performance bonds for contractors on public and private construction projects. Required by Texas Government Code § 2253 for public contracts over $25,000 and the Miller Act for federal projects over $150,000.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "0.5", "maxPrice": "3", "unitText": "percent of bond amount annually" } }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How long does it take to get a performance bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Simple projects under $500,000 can often be approved same-day or next business day. Larger or more complex projects ($1M+) typically take 2–5 business days and require financial statements." } },
    { "@type": "Question", "name": "What do I need to qualify for a Texas performance bond?", "acceptedAnswer": { "@type": "Answer", "text": "Carriers evaluate credit, capacity (your ability to handle the project's size), and character (your track record). For bonds under $350,000, personal credit score and years in business are the main factors. For larger bonds, financial statements are typically required." } },
    { "@type": "Question", "name": "Can I get a performance bond with bad credit in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, but options are more limited. Specialty markets exist for contractors with credit challenges — these bonds typically come at higher rates (2%–5%) and may require collateral." } },
    { "@type": "Question", "name": "What's the difference between a performance bond and a payment bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "A performance bond guarantees you'll complete the project. A payment bond guarantees you'll pay your subcontractors and suppliers. Texas law requires both on public contracts over $25,000." } },
    { "@type": "Question", "name": "How is a Texas performance bond amount determined?", "acceptedAnswer": { "@type": "Answer", "text": "The bond amount equals 100% of the contract value on most Texas public projects. Private projects may require 50%–100% of the contract value depending on the owner's requirements." } }
  ]
};

export default function PerformanceBondTexas() {
  useSEO({
    title: "Performance Bonds Texas | Requirements, Cost & Fast Approval | Quantum Surety",
    description:
      "Texas performance bonds for contractors. Rates from 0.5%–3%. Fast approvals. Required under Texas Gov. Code § 2253 for public projects over $25,000. Free quote from TDI-licensed agency.",
    canonical: "/bonds/performance-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  const projects = [
    { type: "Texas public works", req: "Required on all public contracts over $25,000 under Texas Government Code § 2253" },
    { type: "Federal projects in Texas", req: "Required on federal contracts over $150,000 under the Miller Act (40 U.S.C. § 3131)" },
    { type: "Private commercial projects", req: "Required by most private owners and lenders on projects over $100,000–$500,000" },
    { type: "TX Department of Transportation", req: "Required on all TxDOT highway and infrastructure contracts" },
    { type: "School and municipal projects", req: "Required by Texas school districts and municipalities on construction contracts" },
    { type: "Subcontractor bonds", req: "Many GCs require performance bonds from subs on projects over $50,000–$100,000" },
  ];

  const howItWorks = [
    {
      title: "Three parties",
      body: "A performance bond involves the principal (you, the contractor), the obligee (the project owner), and the surety (Quantum Surety's carrier partner).",
    },
    {
      title: "What it guarantees",
      body: "If you fail to complete the project per the contract, the surety steps in — either completing the project, hiring another contractor, or paying the owner up to the bond amount.",
    },
    {
      title: "Cost in Texas",
      body: "Most Texas contractors pay 0.5%–3% of the bond amount per year. A $1,000,000 performance bond typically costs $5,000–$30,000 depending on your financial strength and project type.",
    },
    {
      title: "Issued alongside payment bonds",
      body: "Texas public projects require both a performance bond and a payment bond simultaneously. Quantum Surety issues both in a single application.",
    },
  ];

  const faqs = [
    {
      q: "How long does it take to get a performance bond in Texas?",
      a: "Simple projects under $500,000 can often be approved same-day or next business day. Larger or more complex projects ($1M+) typically take 2–5 business days and require financial statements. Our AI pre-screening identifies what's needed upfront so there are no surprises.",
    },
    {
      q: "What do I need to qualify for a Texas performance bond?",
      a: "Carriers evaluate the 'three Cs' — credit, capacity (your ability to handle the project's size), and character (your track record). For bonds under $350,000, personal credit score and years in business are the main factors. For larger bonds, financial statements are typically required.",
    },
    {
      q: "Can I get a performance bond with bad credit in Texas?",
      a: "Yes, but options are more limited. Specialty markets exist for contractors with credit challenges — these bonds typically come at higher rates (2%–5%) and may require collateral. Contact us to discuss your specific situation.",
    },
    {
      q: "What's the difference between a performance bond and a payment bond in Texas?",
      a: "A performance bond guarantees you'll complete the project. A payment bond guarantees you'll pay your subcontractors and suppliers. Texas law requires both on public contracts over $25,000, and they're typically issued together at a combined premium.",
    },
    {
      q: "How is a Texas performance bond amount determined?",
      a: "The bond amount (also called the penal sum) equals 100% of the contract value on most Texas public projects. Private projects may require 50%–100% of the contract value depending on the owner's requirements.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Building2 className="w-4 h-4" />
            Texas Construction Bonds
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Texas Performance Bonds for Contractors
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get performance bonds for Texas public and private construction projects.
            AI-assisted underwriting delivers faster decisions — more contractors approved,
            less waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Performance Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ai-bond-finder">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Talk to Our AI Bond Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* When required */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            When Are Performance Bonds Required in Texas?
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Texas law and individual project owners have specific bonding requirements. Here are the most common situations:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.type} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{p.type}</div>
                  <div className="text-sm text-gray-600">{p.req}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            How Texas Performance Bonds Work
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {howItWorks.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost callout */}
      <section className="py-12 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Texas Performance Bond Cost Estimates
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { range: "$100K bond", cost: "$500–$3,000" },
              { range: "$500K bond", cost: "$2,500–$15,000" },
              { range: "$1M bond", cost: "$5,000–$30,000" },
            ].map((item) => (
              <div key={item.range} className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="text-sm text-gray-500 mb-1">{item.range}</div>
                <div className="text-lg font-bold text-indigo-700">{item.cost}</div>
                <div className="text-xs text-gray-400">estimated annual premium</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Rates vary based on credit, years in business, and project type. Get an exact quote in minutes.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Texas Performance Bond FAQ
          </h2>
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

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Your Texas Performance Bond</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Submit your project details and get a performance bond quote in minutes.
            A-rated carriers, fast approvals, competitive rates.
          </p>
          <Link href="/quote">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
              Start My Bond Application <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
