import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, XCircle, Phone } from "lucide-react";

const comparisonRows = [
  { feature: "Who is protected", bond: "Third parties (clients, government, public)", insurance: "The policyholder (you/your business)" },
  { feature: "What it covers", bond: "Your obligations and legal compliance", insurance: "Losses, damages, liability claims" },
  { feature: "Who pays on a claim", bond: "Surety pays, then seeks repayment from you", insurance: "Insurer pays — no repayment required" },
  { feature: "Premium refunded after claims?", bond: "No — and you owe reimbursement", insurance: "No — but you don't owe anything back" },
  { feature: "Typical cost", bond: "1–3% of bond amount per year", insurance: "Varies widely by coverage type and risk" },
  { feature: "Required by law/license?", bond: "Often yes — licensing or contract requirement", insurance: "Sometimes (workers' comp, auto) but not always" },
  { feature: "Underwriting basis", bond: "Your financial strength and credit", insurance: "Risk profile and loss history" },
];

const faqs = [
  {
    q: "What is a surety bond?",
    a: "A surety bond is a three-party agreement between you (the principal), your client or a government agency (the obligee), and the surety company. The bond guarantees that you will fulfill a specific obligation — like completing a construction project or following licensing regulations. If you fail, the surety compensates the obligee, then seeks reimbursement from you.",
  },
  {
    q: "What is insurance?",
    a: "Insurance is a two-party agreement between you and an insurance company. You pay premiums, and if a covered loss occurs, the insurer pays you (or a third party on your behalf). Unlike a surety bond, you are not expected to repay the insurer after a claim. Insurance is designed to spread risk — bonds are designed to guarantee performance.",
  },
  {
    q: "Do I need both a surety bond and insurance?",
    a: "Very often, yes. Most Texas contractors need both a surety bond (required for the license or contract) and general liability insurance (required for most commercial work). They serve different purposes: the bond protects your clients and the public; insurance protects your business from claims, accidents, and losses.",
  },
  {
    q: "What happens if there is a claim on my surety bond?",
    a: "If a valid claim is filed against your bond, the surety pays the obligee (your client or the government agency). However — unlike insurance — you are then obligated to reimburse the surety for the full amount paid. This is why bonds are underwritten based on your financial strength rather than just your risk profile.",
  },
  {
    q: "Is a surety bond the same as E&O insurance?",
    a: "No. Errors & Omissions (E&O) insurance protects your business from claims that your professional services caused a client financial harm. A surety bond is a licensing or contract requirement that guarantees your performance or compliance. Home inspectors, for example, are required to carry a TREC surety bond AND should carry E&O insurance for additional protection.",
  },
  {
    q: "Which types of Texas contractors need a surety bond?",
    a: "Texas contractors who need a surety bond include: general contractors bidding on public projects (bid bonds), licensed HVAC and plumbing contractors (TDLR bonds), licensed electricians, irrigators, home inspectors (TREC bond), locksmiths (DPS bond), pest control operators (TDA bond), and notaries. Most licensing requirements come from TDLR, TREC, TDA, or Texas DPS.",
  },
];

export default function SuretyBondVsInsurance() {
  useSEO({
    title: "Surety Bond vs Insurance | What's the Difference? | Quantum Surety",
    description:
      "Surety bond vs insurance — what's the difference and do you need both? Texas contractors and license holders: understand how bonds and insurance work together to protect your business.",
    canonical: "/bonds/surety-bond-vs-insurance",
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
            <span className="text-indigo-500">/</span>
            <span>Surety Bond vs Insurance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Surety Bond vs Insurance:<br />What's the Difference?
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Texas contractors and license holders often need both — but they serve completely different purposes. Here's how surety bonds and insurance work, how they differ, and why you probably need both.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/bonds/license-bond-texas">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Surety Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* Quick summary */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-900 mb-3">Surety Bond</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              A surety bond is a guarantee — it protects your clients and the public, not your business. The surety company backs your promise to comply with regulations or fulfill a contract. If there is a claim, the surety pays and then comes after you for reimbursement.
            </p>
            <ul className="space-y-2">
              {[
                "Protects third parties (clients, public, government)",
                "Often required for licensing or contracts",
                "Surety can seek repayment from you after a claim",
                "Underwritten on your financial strength",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
            <h2 className="text-xl font-bold text-teal-900 mb-3">Insurance</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Insurance protects your business from unexpected losses. You pay premiums to pool risk with others. If a covered event happens, the insurer pays — and does not seek reimbursement from you. It is designed to absorb losses you could not afford to pay on your own.
            </p>
            <ul className="space-y-2">
              {[
                "Protects your business from losses and liability",
                "Insurer absorbs the loss — no repayment required",
                "Required for some coverages (workers' comp, auto)",
                "Underwritten on your risk profile and history",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 w-1/3">Feature</th>
                  <th className="text-left px-4 py-3 font-semibold text-indigo-700">Surety Bond</th>
                  <th className="text-left px-4 py-3 font-semibold text-teal-700">Insurance</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-700 border-b border-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{row.bond}</td>
                    <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{row.insurance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* The key difference */}
        <section className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">The Key Difference: Who Bears the Loss</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            The most important difference is what happens after a claim. With insurance, the insurer absorbs the loss — that is what you are paying for. With a surety bond, the surety is essentially co-signing for you. If you fail to meet your obligations, they step in and pay, but they expect to be fully reimbursed. The bond guarantees your performance — it is not a safety net for your mistakes.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-amber-100">
              <p className="font-semibold text-gray-900 text-sm mb-2">After an insurance claim:</p>
              <p className="text-gray-600 text-sm">Insurer pays the claim. Your premium may increase at renewal. You do not owe the insurer money back.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-amber-100">
              <p className="font-semibold text-gray-900 text-sm mb-2">After a surety bond claim:</p>
              <p className="text-gray-600 text-sm">Surety pays the obligee. You must reimburse the surety in full. Future bonding becomes very difficult and more expensive.</p>
            </div>
          </div>
        </section>

        {/* When you need both */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">When Texas License Holders Need Both</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">Most Texas contractors and licensed trades need both a surety bond and insurance. The bond satisfies the licensing or contract requirement; the insurance protects your business operations.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { trade: "HVAC / Plumbing Contractor", bond: "TDLR license bond", insurance: "General liability + workers' comp" },
              { trade: "Electrician", bond: "TDLR license bond", insurance: "General liability + workers' comp" },
              { trade: "Home Inspector", bond: "TREC $10,000 bond", insurance: "E&O (errors & omissions)" },
              { trade: "Locksmith", bond: "Texas DPS $10,000 bond", insurance: "General liability" },
              { trade: "Pest Control", bond: "TDA/SPCS bond", insurance: "General liability + commercial auto" },
              { trade: "General Contractor", bond: "Bid/performance bonds", insurance: "General liability + builders risk" },
            ].map((item) => (
              <div key={item.trade} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 text-sm mb-2">{item.trade}</p>
                <p className="text-xs text-gray-600"><span className="text-indigo-600 font-medium">Bond required:</span> {item.bond}</p>
                <p className="text-xs text-gray-600 mt-1"><span className="text-teal-600 font-medium">Insurance recommended:</span> {item.insurance}</p>
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
                  <p className="font-semibold text-gray-900 text-sm">{item.q}</p>
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
          <h2 className="text-2xl font-bold mb-2">Ready to Get Your Texas Surety Bond?</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All Texas license bonds · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bonds/license-bond-texas">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                View All Surety Bonds <ArrowRight className="w-4 h-4 ml-2" />
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Texas surety bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/notary-bond-texas", title: "Texas Notary Bond", sub: "From $50 — instant PDF" },
              { href: "/bonds/license-bond-texas", title: "License Bonds", sub: "TDLR, TREC, and more" },
              { href: "/bonds/bid-bond-vs-performance-bond", title: "Bid vs Performance Bond", sub: "Construction bond guide" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
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
