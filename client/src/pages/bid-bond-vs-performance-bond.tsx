import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, XCircle, Phone } from "lucide-react";

const comparisonRows = [
  { feature: "When required", bid: "At time of bid submission", performance: "Upon contract award" },
  { feature: "Purpose", bid: "Guarantees bidder will enter contract if awarded", performance: "Guarantees contractor will complete the project" },
  { feature: "Bond amount", bid: "Typically 5–10% of bid amount", performance: "Typically 100% of contract value" },
  { feature: "Who is protected", bid: "Project owner (obligee)", performance: "Project owner (obligee)" },
  { feature: "When it's triggered", bid: "Bidder withdraws or fails to sign the contract", performance: "Contractor defaults on the contract" },
  { feature: "Premium cost", bid: "Often no charge (absorbed by surety)", performance: "1–3% of contract value annually" },
  { feature: "Required by Texas law", bid: "Yes, on most public projects over $25,000", performance: "Yes, on most public projects over $25,000" },
];

const faqs = [
  {
    q: "What is a bid bond?",
    a: "A bid bond is a surety bond submitted with a construction bid that guarantees the contractor will honor the bid price and enter into a contract if awarded. If the contractor backs out after winning the bid, the surety compensates the project owner — typically the difference between the winning bid and the next lowest bid.",
  },
  {
    q: "What is a performance bond?",
    a: "A performance bond is a surety bond that guarantees a contractor will complete a construction project according to the contract terms. If the contractor defaults, the surety steps in to either complete the project, hire a replacement contractor, or compensate the project owner up to the bond amount.",
  },
  {
    q: "Which bond comes first — bid bond or performance bond?",
    a: "The bid bond comes first. It is submitted with the initial bid proposal. If the contractor wins the bid and signs the contract, the bid bond is replaced by a performance bond (and often a payment bond) before construction begins.",
  },
  {
    q: "Are both bonds required on Texas public projects?",
    a: "Yes. Under the Texas Little Miller Act (Government Code §2253), public construction projects over $25,000 require both a performance bond (100% of contract value) and a payment bond (100% of contract value). Bid bonds are required by most public agencies as part of the competitive bidding process.",
  },
  {
    q: "What is a payment bond — is it the same as a performance bond?",
    a: "No. A payment bond guarantees that the contractor will pay subcontractors, suppliers, and laborers. A performance bond guarantees the contractor will complete the work. Most public projects in Texas require both bonds at 100% of the contract value.",
  },
  {
    q: "How much does a performance bond cost in Texas?",
    a: "Performance bond premiums in Texas typically range from 1–3% of the contract value for well-qualified contractors. Factors include credit score, financial statements, years in business, and the size/type of project. A $500,000 contract might require a $5,000–$15,000 premium.",
  },
];

export default function BidBondVsPerformanceBond() {
  useSEO({
    title: "Bid Bond vs Performance Bond | Texas Construction Bond Guide | Quantum Surety",
    description:
      "Bid bond vs performance bond — what's the difference? Texas contractors: learn when each bond is required, what they cost, and how to get both for public and private projects.",
    canonical: "/bonds/bid-bond-vs-performance-bond",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/construction">
              <span className="hover:text-white cursor-pointer">Construction Bonds</span>
            </Link>
            <span className="text-indigo-500">/</span>
            <span>Bid Bond vs Performance Bond</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Bid Bond vs Performance Bond:<br />What's the Difference?
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Texas contractors need both. Here's when each bond is required, what it protects, and how they work together on public and private construction projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/construction">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get Construction Bonds <ArrowRight className="w-4 h-4 ml-2" />
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

        {/* Quick summary cards */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-900 mb-3">Bid Bond</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              A bid bond protects the project owner during the bidding process. It guarantees that if you win the bid, you will sign the contract at your bid price. If you back out, the surety compensates the owner for the cost of going to the next bidder.
            </p>
            <ul className="space-y-2">
              {[
                "Submitted with your bid proposal",
                "Typically 5–10% of your bid amount",
                "Often free (included in the bid process)",
                "Replaced by performance bond at contract signing",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
            <h2 className="text-xl font-bold text-teal-900 mb-3">Performance Bond</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              A performance bond protects the project owner during construction. It guarantees that you will complete the project according to the contract terms. If you default, the surety steps in to finish the work or compensate the owner.
            </p>
            <ul className="space-y-2">
              {[
                "Required at contract signing",
                "Typically 100% of the contract value",
                "Premium: 1–3% of contract value",
                "Covers the full construction period",
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
                  <th className="text-left px-4 py-3 font-semibold text-indigo-700">Bid Bond</th>
                  <th className="text-left px-4 py-3 font-semibold text-teal-700">Performance Bond</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-700 border-b border-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{row.bid}</td>
                    <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{row.performance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Texas requirements */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Texas Public Project Bond Requirements</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            The Texas Little Miller Act (Government Code §2253) governs construction bond requirements on public projects. Understanding these thresholds helps Texas contractors prepare the right bonds before bidding.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Projects over $25,000", desc: "Performance bond AND payment bond required at 100% of contract value" },
              { title: "Competitive bid projects", desc: "Bid bond typically required — usually 5% of bid amount" },
              { title: "State agency projects", desc: "Texas Building and Procurement Commission (TBPC) may have additional requirements" },
              { title: "City/county projects", desc: "Most Texas municipalities follow the Little Miller Act thresholds for bonding" },
              { title: "Private projects", desc: "No statutory requirement but most commercial owners require performance bonds" },
              { title: "Federal projects in Texas", desc: "Miller Act applies — performance and payment bonds at 100% for contracts over $150,000" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-indigo-100">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Don't confuse with payment bond */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't Forget the Payment Bond</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Most Texas public projects require three bonds: a bid bond (at bidding), a performance bond (at contract signing), and a payment bond (at contract signing). The payment bond guarantees that subcontractors and suppliers get paid — it protects your supply chain, not the project owner.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Bid Bond", when: "At bid submission", protects: "Owner — bid integrity", color: "border-indigo-200 bg-indigo-50" },
              { title: "Performance Bond", when: "At contract signing", protects: "Owner — project completion", color: "border-teal-200 bg-teal-50" },
              { title: "Payment Bond", when: "At contract signing", protects: "Subs & suppliers — payment", color: "border-amber-200 bg-amber-50" },
            ].map((item) => (
              <div key={item.title} className={`rounded-xl p-4 border ${item.color}`}>
                <p className="font-bold text-gray-900 text-sm mb-2">{item.title}</p>
                <p className="text-xs text-gray-600"><span className="font-medium">When:</span> {item.when}</p>
                <p className="text-xs text-gray-600 mt-1"><span className="font-medium">Protects:</span> {item.protects}</p>
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
          <h2 className="text-2xl font-bold mb-2">Need a Bid Bond or Performance Bond?</h2>
          <p className="text-indigo-200 mb-6">Fast quotes · Texas construction specialists · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/construction">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get Construction Bonds <ArrowRight className="w-4 h-4 ml-2" />
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">More construction bond resources</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/bid-bond-texas", title: "Texas Bid Bonds", sub: "Public project bid bonds" },
              { href: "/bonds/performance-bond-texas", title: "Texas Performance Bonds", sub: "Contract completion guarantee" },
              { href: "/construction", title: "All Construction Bonds", sub: "Bid, performance, payment" },
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
