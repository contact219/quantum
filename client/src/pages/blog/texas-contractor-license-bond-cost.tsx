import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, User } from "lucide-react";

export default function TexasContractorLicenseBondCost() {
  useSEO({
    title: "How Much Does a Texas Contractor License Bond Cost? (2026 Guide)",
    description:
      "Find out exactly what a Texas contractor license bond costs in 2026. Rates by trade, credit score, and bond amount. TDLR, city bonds, and electrician/HVAC/plumbing explained.",
    canonical: "/blog/texas-contractor-license-bond-cost",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">License Bonds</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> April 2026</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 7 min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            How Much Does a Texas Contractor License Bond Cost? (2026 Guide)
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Texas contractor bonds are more affordable than most contractors expect. Here's exactly what you'll pay — broken down by trade, bond amount, and credit score.
          </p>
          <div className="flex items-center gap-2 mt-4 text-indigo-300 text-sm">
            <User className="w-3 h-3" />
            <span>Quantum Surety — TDI Licensed Agency #3480229</span>
          </div>
        </div>
      </section>

      {/* TL;DR */}
      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-900 text-sm font-medium">
            <strong>TL;DR:</strong> Most Texas contractor license bonds cost $100–$300/year for a $10,000 bond. Auto dealer bonds ($25,000) run $250–$500/year. You pay a small annual premium — not the full bond amount.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-gray max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Key Distinction: Bond Amount vs. Bond Premium</h2>
            <p className="text-gray-700 leading-relaxed">
              When contractors see "you need a $10,000 bond," they sometimes assume they need to write a $10,000 check. That's not how surety bonds work.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              The <strong>bond amount</strong> (also called the penal sum) is the maximum a claimant can recover if they make a claim against your bond. You're not paying that amount — you're paying a <strong>premium</strong> for the surety company to back that guarantee.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Think of it like car insurance: your policy covers up to $100,000 in liability, but you pay $800/year for that coverage. Same concept.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Contractor Bond Costs by Trade (2026)</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm mt-4">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Trade / License</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Bond Amount</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Annual Cost (Good Credit)</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Annual Cost (Lower Credit)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Electrician (TDLR)", "$10,000", "$100–$150", "$200–$300"],
                    ["HVAC / AC Technician (TDLR)", "$10,000", "$100–$150", "$200–$300"],
                    ["Plumber (TSBPE)", "$10,000", "$100–$150", "$200–$300"],
                    ["Irrigator (TDLR)", "$10,000", "$100–$150", "$200–$300"],
                    ["Dallas City Contractor", "$10,000–$25,000", "$100–$250", "$250–$500"],
                    ["Houston City Contractor", "$10,000–$25,000", "$100–$250", "$250–$500"],
                    ["Auto Dealer (TxDMV)", "$25,000", "$250–$350", "$400–$600"],
                  ].map(([trade, amount, good, lower]) => (
                    <tr key={trade} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border border-gray-200 text-gray-700">{trade}</td>
                      <td className="p-3 border border-gray-200 text-gray-700 font-medium">{amount}</td>
                      <td className="p-3 border border-gray-200 text-teal-700 font-medium">{good}</td>
                      <td className="p-3 border border-gray-200 text-gray-600">{lower}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-2">Rates are estimates. Your exact premium is based on your credit profile and the specific bond program.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Affects Your Bond Premium?</h2>
            <p className="text-gray-700 leading-relaxed">Several factors determine your annual bond cost:</p>
            <div className="space-y-4 mt-4">
              {[
                {
                  factor: "Credit score",
                  detail: "The most significant factor. Applicants with scores above 680 typically get the best rates. Lower scores mean higher premiums but almost never result in denial for standard $10,000 bonds.",
                },
                {
                  factor: "Bond amount",
                  detail: "Higher bond amounts mean higher premiums. A $25,000 bond costs roughly 2–2.5x more than a $10,000 bond for the same applicant.",
                },
                {
                  factor: "Bond type / license program",
                  detail: "Some TDLR programs carry more historical claim activity than others, which can affect rates slightly.",
                },
                {
                  factor: "Years in business",
                  detail: "For standard $10,000 bonds, business history typically doesn't affect pricing. Larger bonds may consider your track record.",
                },
              ].map((item) => (
                <div key={item.factor} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.factor}</p>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Do I Pay the Full Bond Amount if There's a Claim?</h2>
            <p className="text-gray-700 leading-relaxed">
              Not directly — but you could ultimately be responsible. Here's how it works:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 mt-4">
              <li>A consumer or agency files a claim against your bond.</li>
              <li>The surety company investigates and, if the claim is valid, pays the claimant (up to the bond amount).</li>
              <li>The surety company then seeks reimbursement from you — the principal — for the amount paid.</li>
            </ol>
            <p className="text-gray-700 leading-relaxed mt-4">
              This is why the bond isn't "insurance" in the traditional sense — it's more like a line of credit that the surety extends on your behalf. Maintaining clean licensing and completing your work as contracted is the best way to avoid claims.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">City Bond vs. TDLR Bond — Do I Need Both?</h2>
            <p className="text-gray-700 leading-relaxed">
              Many Texas contractors need more than one bond. Here's why:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>TDLR bond</strong> — required for your state-issued contractor license (electrician, HVAC, irrigator, etc.)</li>
              <li><strong>City bond</strong> — required by Dallas, Houston, Austin, San Antonio, or Fort Worth for city-specific contractor licenses and permit-pulling</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you work primarily in one city, you may need both. We issue both types and can process them together. Combined annual cost typically runs $200–$400 for contractors carrying both a TDLR bond and one city bond.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Get the Lowest Rate on Your Texas Contractor Bond</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Check your credit score before applying — a score above 680 gets you tier-1 pricing.</li>
              <li>Apply through a TDI-licensed agency that works with multiple surety markets (not a single carrier).</li>
              <li>Don't let your bond lapse — renewal mid-term often costs more than continuous annual renewal.</li>
              <li>Buy only the bond amount required — don't overbuy coverage you don't need.</li>
            </ul>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-14 bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Contractor Bond — From $100/yr</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All trades · TDLR & city bonds · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My License Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related pages</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/tdlr-bond-texas", title: "TDLR Contractor Bond", tag: "Get Bonded" },
              { href: "/bonds/license-bond-texas", title: "All Texas License Bonds", tag: "Hub Page" },
              { href: "/blog/texas-tdlr-contractor-bond-2026", title: "TDLR Bond Guide 2026", tag: "Blog" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-1 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
