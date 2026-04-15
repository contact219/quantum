import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, User, CheckCircle } from "lucide-react";

export default function TexasElectricalContractorBondRequirements() {
  useSEO({
    title: "Texas Electrical Contractor Bond Requirements 2026 | TDLR & City License",
    description:
      "Everything Texas electricians need to know about surety bond requirements in 2026. TDLR bond, city bonds (Dallas, Houston, Austin), costs, and how to file. Updated guide.",
    canonical: "/blog/texas-electrical-contractor-bond-requirements",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Electrical Bonds</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> April 2026</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 8 min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Electrical Contractor Bond Requirements 2026
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Texas electricians face bond requirements at two levels: the state (TDLR) and individual cities. This guide breaks down exactly what you need, where to file it, and how much it costs.
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
            <strong>TL;DR:</strong> Texas electricians need a $10,000 TDLR bond for their state license. Many cities require a separate city bond to pull permits. Total annual cost: $100–$300 per bond. Same-day issuance available.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-gray max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Electrical Licensing: A Two-Level System</h2>
            <p className="text-gray-700 leading-relaxed">
              In Texas, electrical contractors operate under two separate licensing systems — one at the state level and one at the city level. Each has its own bond requirement:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {[
                {
                  title: "State Level: TDLR",
                  points: ["Issues the Texas Electrical Contractor License", "Requires a $10,000 surety bond", "Bond filed with TDLR application", "Covers statewide licensing authorization"],
                },
                {
                  title: "City Level: Local License",
                  points: ["Each major city has its own contractor license", "Requires a separate city surety bond", "Bond filed with city development services", "Required to pull permits within city limits"],
                },
              ].map((col) => (
                <div key={col.title} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <p className="font-bold text-gray-900 mb-3">{col.title}</p>
                  <ul className="space-y-2">
                    {col.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">TDLR Electrical Contractor Bond Requirements</h2>
            <p className="text-gray-700 leading-relaxed">
              The Texas Department of Licensing and Regulation (TDLR) issues the Texas Electrical Contractor License (TECL). As of 2026, TDLR requires:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Bond amount:</strong> $10,000</li>
              <li><strong>Bond type:</strong> Surety bond from a TDI-licensed agency</li>
              <li><strong>When filed:</strong> With initial license application and at each renewal</li>
              <li><strong>Term:</strong> Annual (must be kept active)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              The bond must be in effect throughout the term of your license. If the bond lapses, TDLR may place your license on inactive status.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">City-Level Electrical Bond Requirements in Texas</h2>
            <p className="text-gray-700 leading-relaxed">
              In addition to TDLR, major Texas cities require their own electrical contractor bonds for local licensing and permit-pulling. Here's what the top 5 cities require:
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">City</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Bond Amount</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Filing Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Dallas", "$10,000", "Dallas Development Services"],
                    ["Houston", "$10,000", "Houston Permitting Center"],
                    ["Austin", "$10,000", "Austin Development Services"],
                    ["San Antonio", "$10,000", "SA Development Services"],
                    ["Fort Worth", "$10,000", "Fort Worth Development Services"],
                  ].map(([city, amount, authority]) => (
                    <tr key={city} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border border-gray-200 text-gray-700 font-medium">{city}</td>
                      <td className="p-3 border border-gray-200 text-gray-700">{amount}</td>
                      <td className="p-3 border border-gray-200 text-gray-500 text-xs">{authority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-2">Requirements vary — verify with your specific city's development services department before applying.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Much Does a Texas Electrical Contractor Bond Cost?</h2>
            <p className="text-gray-700 leading-relaxed">
              For a $10,000 electrical contractor bond:
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {[
                { credit: "Good credit (680+)", cost: "$100–$150/year", color: "teal" },
                { credit: "Average credit (580–679)", cost: "$150–$250/year", color: "amber" },
                { credit: "Lower credit (below 580)", cost: "$250–$300/year", color: "gray" },
              ].map((tier) => (
                <div key={tier.credit} className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                  <p className="font-bold text-gray-900 text-lg">{tier.cost}</p>
                  <p className="text-gray-500 text-xs mt-1">{tier.credit}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you need both a TDLR bond and a city bond, budget approximately $200–$400/year total. Most electricians operating in a single city carry both.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step: Getting Your Electrical Contractor Bond</h2>
            <ol className="space-y-4">
              {[
                { n: "1", t: "Identify what bonds you need", b: "Determine if you need just the TDLR bond, a city bond, or both. If you pull permits in a specific city, you likely need both." },
                { n: "2", t: "Apply online", b: "Submit your application to a TDI-licensed surety agency. For standard $10,000 bonds, you only need basic personal and business information — no financials required." },
                { n: "3", t: "Receive your bond certificate(s)", b: "After approval (usually instant), receive your bond certificate(s) by email as PDF files." },
                { n: "4", t: "File with TDLR and/or your city", b: "Upload or mail the TDLR bond certificate with your TECL application. Submit the city bond certificate to the city's development services department." },
                { n: "5", t: "Renew annually", b: "Keep both bonds active. Lapses can result in license suspension or inability to pull permits." },
              ].map((s) => (
                <li key={s.n} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200 list-none">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.n}</div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{s.t}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Does my TDLR electrical bond cover all Texas cities?",
                  a: "No. Your TDLR bond satisfies your state licensing requirement. Each city that requires a local electrical contractor license will require a separate city-specific bond.",
                },
                {
                  q: "Can I get an electrical contractor bond if my business is new?",
                  a: "Yes. New electrical contracting businesses are routinely approved for standard $10,000 bonds. Business history is not a significant factor for these bond amounts.",
                },
                {
                  q: "What happens to my bond if I hire employees?",
                  a: "Your bond covers your activities as the licensed electrical contractor of record. It doesn't automatically extend to cover employee misconduct. You may also need general liability insurance to cover on-the-job incidents.",
                },
              ].map((item) => (
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
        <div className="mt-14 bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Electrical Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · TDLR & all Texas cities · From $100/yr · TDI Licensed Agency #3480229</p>
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
              { href: "/bonds/electrical-contractor-bond-texas", title: "Electrical Contractor Bond TX", tag: "Get Bonded" },
              { href: "/bonds/tdlr-bond-texas", title: "TDLR Bond", tag: "TDLR License" },
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
