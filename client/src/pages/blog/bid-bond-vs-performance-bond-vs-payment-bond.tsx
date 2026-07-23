import { Link } from "wouter";
import { BlogAuthor } from "@/components/BlogAuthor";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight, Clock, ChevronRight, CheckCircle, Shield } from "lucide-react";

export default function BlogBidVsPerformanceVsPayment() {
  useSEO({
    title: "Bid Bond vs Performance Bond vs Payment Bond: Texas Guide (2026) | Quantum Surety",
    description: "What's the difference between a bid bond, performance bond, and payment bond? When each is required in Texas, what they cost, and why public contracts need all three. Plain-language guide.",
    canonical: "/blog/bid-bond-vs-performance-bond-vs-payment-bond",
    ogType: "article",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Bid Bond vs Performance Bond vs Payment Bond: Texas Guide",
    "description": "Plain-language comparison of Texas construction bond types: bid bonds, performance bonds, and payment bonds — when each is required, what each costs, and how they work together.",
    "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  }, "ld-json-Article");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is the difference between a bid bond and a performance bond?", "acceptedAnswer": { "@type": "Answer", "text": "A bid bond guarantees you'll honor your bid price and sign the contract if selected — it's required before the contract is awarded. A performance bond guarantees you'll complete the project per the contract terms — it's required after you've been awarded the contract." } },
      { "@type": "Question", "name": "Do you need both a performance bond and payment bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, on all Texas public contracts over $25,000. Texas Government Code § 2253 (the Texas Little Miller Act) requires both a performance bond and a payment bond on the same project. They're almost always issued together as a P&P bond." } },
    ],
  }, "ld-json-FAQ");

  const comparison = [
    { factor: "Purpose", bid: "Guarantees you'll sign the contract if you win the bid", perf: "Guarantees you'll complete the project per contract terms", pay: "Guarantees you'll pay subs, labor, and suppliers" },
    { factor: "Who's protected", bid: "Project owner (against bid withdrawal)", perf: "Project owner (against non-completion)", pay: "Subcontractors, suppliers, laborers" },
    { factor: "When required", bid: "At bidding — before award", perf: "At contract execution — after award", pay: "At contract execution — alongside performance bond" },
    { factor: "Bond amount", bid: "5–10% of bid price", perf: "100% of contract value", pay: "100% of contract value" },
    { factor: "Typical cost", bid: "Free–$250 (credited to P&P)", perf: "0.5%–3% of bond amount", pay: "Included with performance bond" },
    { factor: "Required by Texas law", bid: "Common practice; not always legally mandated", perf: "Yes — all public contracts over $25,000", pay: "Yes — all public contracts over $25,000" },
  ];

  const faqs = [
    { q: "What is the difference between a bid bond and a performance bond?", a: "A bid bond is a pre-contract guarantee — it says you'll sign the contract and post the required performance/payment bonds if you're awarded the project. A performance bond is a post-award guarantee — it says you'll complete the project according to the contract terms. Bid bonds are submitted with your bid; performance bonds are submitted at contract signing." },
    { q: "Do you need both a performance bond and payment bond in Texas?", a: "Yes, on all Texas public contracts over $25,000. Texas Government Code § 2253 (the Texas Little Miller Act) requires both a performance bond and a payment bond on the same project. They are almost always issued together as a combined P&P bond under a single premium." },
    { q: "Can I get all three bonds from the same company?", a: "Yes, and that's the standard practice. Quantum Surety issues bid bonds, performance bonds, and payment bonds for the same project. When you apply for a performance and payment bond, we'll issue the bid bond simultaneously — often at no additional cost." },
    { q: "What is a P&P bond?", a: "P&P stands for Performance and Payment — a combined bond that includes both a performance bond and a payment bond in a single instrument. Since Texas law requires both on public contracts, they're almost always issued together. The combined premium is not double the cost of a single bond." },
    { q: "What happens if a contractor defaults on a performance bond in Texas?", a: "If the contractor defaults, the project owner can make a claim on the performance bond. The surety then has options: complete the project using a different contractor, allow the original contractor to finish with surety oversight, or pay the cost of completion up to the bond amount. The original contractor is obligated to repay the surety for any amounts paid." },
    { q: "Are Texas bid bonds required on private projects?", a: "Not by law — Texas § 2253 only applies to public contracts. However, many private project owners require bid bonds as a condition of submitting a bid. Always read the invitation to bid (ITB) or request for proposals (RFP) to see what's required." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Construction Bonds</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Construction Bonds</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 8 min read</span>
            <span className="text-indigo-300 text-sm">May 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Bid Bond vs Performance Bond vs Payment Bond: Texas Contractor Guide (2026)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Texas public projects over $25,000 require all three construction bond types — but each serves a completely different purpose. Here's what each bond does, when it's required, and what it costs.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">The One-Line Explanation for Each</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "Bid Bond", color: "bg-blue-50 border-blue-200", icon: "📋", def: "Guarantees you'll sign the contract if you win the bid." },
              { name: "Performance Bond", color: "bg-indigo-50 border-indigo-200", icon: "🏗️", def: "Guarantees you'll complete the project per the contract." },
              { name: "Payment Bond", color: "bg-teal-50 border-teal-200", icon: "💰", def: "Guarantees you'll pay your subs, laborers, and suppliers." },
            ].map((b) => (
              <div key={b.name} className={`${b.color} border rounded-2xl p-5`}>
                <p className="text-2xl mb-2">{b.icon}</p>
                <p className="font-bold text-gray-900 mb-1">{b.name}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{b.def}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold">Factor</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Bid Bond</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Performance Bond</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Payment Bond</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.factor} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 font-medium text-gray-900">{row.factor}</td>
                    <td className="p-3 border border-gray-200 text-gray-700">{row.bid}</td>
                    <td className="p-3 border border-gray-200 text-gray-700">{row.perf}</td>
                    <td className="p-3 border border-gray-200 text-gray-700">{row.pay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Texas Little Miller Act</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Texas Government Code § 2253 — commonly called the Texas Little Miller Act — mandates performance and payment bonds on all public construction contracts over $25,000. It mirrors the federal Miller Act (which governs federal contracts over $150,000) but applies to all Texas state, county, and municipal projects.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { threshold: "Texas public contracts", amount: "$25,000+", law: "Texas Gov. Code § 2253" },
              { threshold: "Federal contracts in Texas", amount: "$150,000+", law: "Miller Act (40 U.S.C. § 3131)" },
              { threshold: "TxDOT highway projects", amount: "All contracts", law: "TxDOT Standard Specifications" },
              { threshold: "Private commercial projects", amount: "Varies by owner", law: "Contract requirement" },
            ].map((r) => (
              <div key={r.threshold} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">{r.threshold}</p>
                <p className="text-indigo-700 font-bold">{r.amount}</p>
                <p className="text-xs text-gray-500 mt-1">{r.law}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How the Timeline Works on a Texas Public Project</h2>
          <div className="space-y-3">
            {[
              { phase: "Bidding phase", bonds: "Bid bond required with your bid submission" },
              { phase: "Contract award", bonds: "You win — bid bond obligation extinguishes" },
              { phase: "Contract signing", bonds: "Performance bond + payment bond required before work begins" },
              { phase: "Project completion", bonds: "All three bonds expire/close per contract terms" },
            ].map((r) => (
              <div key={r.phase} className="flex items-start gap-3 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.phase}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{r.bonds}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Get All Three Bonds in One Application</h2>
          <p className="text-indigo-200 mb-5">Quantum Surety issues bid bonds, performance bonds, and payment bonds together. A-rated carriers, TDI Licensed #3480229, same-day approval on smaller projects.</p>
          <Link href="/quote?type=bid">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Get a Construction Bond Quote <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{f.q}
                  </p>
                </div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/bonds/construction-bond-texas", label: "Texas Construction Bonds Hub" },
              { href: "/bonds/performance-bond-texas", label: "Texas Performance Bond Guide" },
              { href: "/bonds/bid-bond-texas", label: "Texas Bid Bond Guide" },
              { href: "/bonds/payment-bond-texas", label: "Texas Payment Bond Guide" },
            ].map((r) => (
              <Link key={r.href} href={r.href}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{r.label}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    <BlogAuthor />
    </div>
  );
}
