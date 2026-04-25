import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, AlertCircle, Building2, Users } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Payment Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/payment-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas payment bonds for contractors — guarantees payment to subcontractors and suppliers on public and private construction projects. Required alongside performance bonds under Texas Government Code § 2253 for public contracts over $25,000.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "0.5", "maxPrice": "3", "unitText": "percent of bond amount annually" } }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a Texas payment bond?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas payment bond is a surety bond that guarantees a general contractor will pay subcontractors, laborers, and material suppliers on a construction project. If the GC fails to pay, the bond provides a legal claim mechanism for those parties to recover what they're owed." } },
    { "@type": "Question", "name": "Who is protected by a payment bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Payment bonds protect subcontractors and suppliers — not the project owner. The owner is protected by the performance bond. Subcontractors and suppliers who have not been paid can make a claim against the payment bond to recover their costs." } },
    { "@type": "Question", "name": "When is a payment bond required on Texas public projects?", "acceptedAnswer": { "@type": "Answer", "text": "Texas Government Code § 2253 requires payment bonds on state and local public contracts over $25,000. The federal Miller Act (40 U.S.C. § 3131) requires them on federal contracts over $150,000. Both require the bond at 100% of the contract amount." } },
    { "@type": "Question", "name": "What is a P&P bond and why are performance and payment bonds issued together?", "acceptedAnswer": { "@type": "Answer", "text": "A P&P bond (Performance and Payment bond) combines both bonds into a single instrument issued simultaneously. Texas law typically requires both on the same public project, and carriers issue them together under a single premium calculation, making the combined cost no more than issuing them separately." } },
    { "@type": "Question", "name": "How much does a Texas payment bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "Payment bond rates match performance bond rates: typically 0.5%–3% of the bond amount annually. A $500,000 payment bond costs approximately $2,500–$15,000 depending on credit, financial strength, and project type. When issued as a P&P bond, the combined premium is not doubled." } }
  ]
};

export default function PaymentBondTexas() {
  useSEO({
    title: "Payment Bonds Texas | TX Construction Payment Bonds | Quantum Surety",
    description:
      "Texas payment bonds for contractors — guarantees payment to subcontractors and suppliers. Required alongside performance bonds on public projects over $25,000. TDI-licensed. Free quote.",
    canonical: "/bonds/payment-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  const requirements = [
    { type: "Texas public contracts ($25K+)", req: "Texas Government Code § 2253 requires payment bonds on all public contracts over $25,000 at 100% of contract value." },
    { type: "Federal projects in Texas ($150K+)", req: "The Miller Act (40 U.S.C. § 3131) mandates payment bonds on federal construction contracts over $150,000." },
    { type: "TxDOT highway projects", req: "All Texas Department of Transportation contracts require payment bonds alongside performance bonds regardless of size." },
    { type: "Texas school districts", req: "Public school district construction projects in Texas are subject to § 2253 and require payment bonds." },
    { type: "Municipal and county projects", req: "Cities, counties, and other political subdivisions require payment bonds on qualifying public work." },
    { type: "Private owners and lenders", req: "Many private owners and construction lenders require payment bonds on larger commercial projects as a condition of financing." },
  ];

  const howItWorks = [
    {
      title: "Who is protected",
      body: "Unlike a performance bond — which protects the project owner — a payment bond protects subcontractors, laborers, and material suppliers. If the general contractor fails to pay, these parties can file a claim against the bond.",
    },
    {
      title: "The claim process",
      body: "Unpaid subs and suppliers must provide written notice of non-payment within 90 days of last furnishing labor or materials (Texas Gov Code § 2253). They then have one year to bring a lawsuit on the bond.",
    },
    {
      title: "Cost — same as performance bond",
      body: "Payment bond rates run 0.5%–3% of the bond amount, identical to performance bond rates. When issued together as a P&P bond, contractors pay a single combined premium — not double.",
    },
    {
      title: "Always issued with performance bonds",
      body: "Texas law requires both bonds simultaneously on qualifying public projects. Quantum Surety writes both in a single application and issues the combined P&P bond under one instrument.",
    },
  ];

  const vsPerformance = [
    { feature: "Protects", payment: "Subcontractors & suppliers", performance: "Project owner / obligee" },
    { feature: "Triggered by", payment: "Contractor fails to pay subs/suppliers", performance: "Contractor fails to complete project" },
    { feature: "Required under § 2253", payment: "Yes — over $25,000", performance: "Yes — over $25,000" },
    { feature: "Required under Miller Act", payment: "Yes — over $150,000", performance: "Yes — over $150,000" },
    { feature: "Typical rate", payment: "0.5%–3% of contract", performance: "0.5%–3% of contract" },
    { feature: "Issued together", payment: "Always — as P&P bond", performance: "Always — as P&P bond" },
  ];

  const faqs = [
    {
      q: "What is a Texas payment bond?",
      a: "A Texas payment bond is a surety bond that guarantees a general contractor will pay subcontractors, laborers, and material suppliers. If the GC fails to pay, the bond creates a legal claim mechanism for those parties to recover what they're owed — up to the full bond amount.",
    },
    {
      q: "Who is protected by a payment bond in Texas?",
      a: "Payment bonds protect subcontractors and suppliers — not the project owner. The owner is protected by the performance bond. This distinction matters: subs and suppliers who have not been paid can make a claim against the payment bond even if the project is completed on time and on budget.",
    },
    {
      q: "When is a payment bond required on Texas public projects?",
      a: "Texas Government Code § 2253 requires payment bonds on state and local public contracts over $25,000. The federal Miller Act (40 U.S.C. § 3131) requires them on federal contracts over $150,000. Both require the bond at 100% of the contract amount.",
    },
    {
      q: "What is a P&P bond and why are performance and payment bonds issued together?",
      a: "A P&P bond (Performance and Payment bond) combines both bonds into a single instrument issued simultaneously. Texas law typically requires both on the same public project, and carriers issue them together under a single premium. This means contractors pay one combined rate — not two separate premiums.",
    },
    {
      q: "How much does a Texas payment bond cost?",
      a: "Payment bond rates match performance bond rates: typically 0.5%–3% of the bond amount annually. A $500,000 payment bond costs approximately $2,500–$15,000 depending on credit, financial strength, and project type. Call us at (972) 379-9216 for an exact quote.",
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
            Texas Payment Bonds for Contractors
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Protect your subcontractors and suppliers — and stay compliant with Texas
            Government Code § 2253. Payment bonds issued alongside performance bonds
            in a single application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Payment Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
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
            When Are Payment Bonds Required in Texas?
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Texas statutes and federal law both mandate payment bonds on construction projects above certain dollar thresholds. Here are the most common scenarios:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {requirements.map((p) => (
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
            How Texas Payment Bonds Work
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

      {/* Payment vs Performance comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Bond vs. Performance Bond in Texas
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            These two bonds are always required together on Texas public projects, but they serve different purposes and protect different parties.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 border border-gray-200 rounded-tl-lg">Feature</th>
                  <th className="text-left p-4 text-sm font-semibold text-indigo-700 border border-gray-200">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Payment Bond</div>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-teal-700 border border-gray-200 rounded-tr-lg">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Performance Bond</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {vsPerformance.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-4 text-sm font-medium text-gray-700 border border-gray-200">{row.feature}</td>
                    <td className="p-4 text-sm text-gray-600 border border-gray-200">{row.payment}</td>
                    <td className="p-4 text-sm text-gray-600 border border-gray-200">{row.performance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cost callout */}
      <section className="py-12 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Texas Payment Bond Cost Estimates
          </h2>
          <p className="text-gray-600 mb-6 text-sm max-w-xl mx-auto">
            Payment bond rates are the same as performance bond rates. When issued together as a P&P bond, contractors pay a single combined premium.
          </p>
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
            Rates vary based on credit, years in business, and project type. Get an exact quote in minutes or call{" "}
            <a href="tel:+19723799216" className="text-indigo-600 font-medium">(972) 379-9216</a>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Texas Payment Bond FAQ
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

      {/* Related bonds */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Texas Construction Bonds</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "Performance Bond", desc: "Issued with payment bonds — guarantees project completion.", slug: "performance-bond-texas" },
              { name: "Bid Bond", desc: "Required at the bidding stage before your P&P bond.", slug: "bid-bond-texas" },
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
          <h2 className="text-3xl font-bold mb-4">Get Your Texas Payment Bond</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Submit your project details and get a payment bond quote in minutes.
            TDI-licensed, A-rated carriers, fast approvals — P&amp;P bonds issued in a single application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
                Start My Bond Application <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:+19723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Call (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
