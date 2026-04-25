import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, User, CheckCircle } from "lucide-react";

export default function TexasHvacContractorBondRequirements() {
  useSEO({
    title: "Texas HVAC Contractor Bond Requirements 2026 | TDLR & City License",
    description:
      "Everything Texas HVAC contractors need to know about surety bond requirements in 2026. TDLR bond amounts, city bonds, how to apply, and what it costs.",
    canonical: "/blog/texas-hvac-contractor-bond-requirements",
  });
  useSchema(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Texas HVAC Contractor Bond Requirements 2026 | TDLR & City License",
      "datePublished": "2026-04-25",
      "publisher": {
        "@type": "Organization",
        "name": "Quantum Surety Bonds",
        "url": "https://quantumsurety.bond",
      },
    },
    "ld-json-Article"
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">HVAC Bonds</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> April 2026</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 8 min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas HVAC Contractor Bond Requirements 2026
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Texas HVAC contractors must meet bond requirements at the state (TDLR) level and often at the city level as well. This guide explains exactly what bonds you need, where to file them, and what you should expect to pay.
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
            <strong>TL;DR:</strong> Texas HVAC contractors need a $10,000 TDLR surety bond for their state license. Dallas, Houston, Austin, and San Antonio also require separate city bonds to pull local permits. Annual cost per bond: $100–$300. Same-day issuance available.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-gray max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">HVAC Licensing in Texas: Two Levels, Two Bonds</h2>
            <p className="text-gray-700 leading-relaxed">
              If you run an HVAC contracting business in Texas, you need to think about bonding at two separate levels. The Texas Department of Licensing and Regulation (TDLR) governs statewide air conditioning and refrigeration licensing. On top of that, most major Texas cities maintain their own local contractor licensing programs — each with its own bond requirement.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Failing to carry the right bonds can delay your license application, prevent you from pulling permits, or expose you to fines. Here is exactly what each level requires.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {[
                {
                  title: "State Level: TDLR",
                  points: [
                    "Issues the Air Conditioning and Refrigeration Contractor (ACRC) license",
                    "Requires a $10,000 surety bond",
                    "Bond filed with initial application and renewals",
                    "Covers statewide contracting authorization",
                  ],
                },
                {
                  title: "City Level: Local License",
                  points: [
                    "Each major city has its own HVAC contractor license",
                    "Requires a separate city surety bond",
                    "Bond filed with city development or permitting department",
                    "Required to pull mechanical permits within city limits",
                  ],
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">TDLR HVAC Contractor Bond Requirements</h2>
            <p className="text-gray-700 leading-relaxed">
              TDLR issues the Air Conditioning and Refrigeration Contractor (ACRC) license, which is required for any business that installs, maintains, or services HVAC equipment in Texas. As of 2026, TDLR requires every ACRC licensee to maintain an active surety bond.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Bond amount:</strong> $10,000</li>
              <li><strong>Bond type:</strong> Surety bond from a TDI-licensed surety agency</li>
              <li><strong>When filed:</strong> With your initial license application and at each annual renewal</li>
              <li><strong>Bond term:</strong> Annual — must remain active throughout your license period</li>
              <li><strong>Who is covered:</strong> The licensed HVAC contractor of record</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              The TDLR bond protects consumers — if a licensed contractor fails to complete work, violates the terms of a contract, or causes financial harm, the bond provides a mechanism for the harmed party to file a claim. TDLR can place your license on inactive status if your bond lapses, so keep renewal dates on your calendar.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can apply for and manage your <Link href="/bonds/tdlr-bond-texas" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">TDLR bond through Quantum Surety</Link>. Most standard TDLR bonds are issued the same day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">City-Level HVAC Bond Requirements in Texas</h2>
            <p className="text-gray-700 leading-relaxed">
              In addition to TDLR, each major Texas city requires HVAC contractors to hold a local contractor license and post a city-specific bond to pull mechanical permits. Here is a breakdown of the four largest Texas markets:
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
            <p className="text-gray-500 text-xs mt-2">Bond amounts and requirements can change. Always verify current requirements directly with your city's development services or permitting department before submitting.</p>

            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Dallas HVAC Bond</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Dallas requires HVAC contractors to hold a Mechanical Contractor License before pulling mechanical permits. The city bond is filed through Dallas Development Services. Contractors performing work in Dallas without the proper city bond risk permit rejections and job-site stop-work orders.
                </p>
                <Link href="/bonds/contractor-bond-dallas" className="text-indigo-600 text-sm font-medium underline underline-offset-2 hover:text-indigo-800 mt-2 inline-block">
                  Dallas Contractor Bond details →
                </Link>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Houston HVAC Bond</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Houston's Permitting Center requires HVAC contractors to be registered with the city and post a surety bond before mechanical permits are issued. Houston's construction volume is among the highest in the country, so carrying the correct bond is critical to keeping jobs moving.
                </p>
                <Link href="/bonds/contractor-bond-houston" className="text-indigo-600 text-sm font-medium underline underline-offset-2 hover:text-indigo-800 mt-2 inline-block">
                  Houston Contractor Bond details →
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Much Does a Texas HVAC Contractor Bond Cost?</h2>
            <p className="text-gray-700 leading-relaxed">
              The annual premium for a $10,000 HVAC contractor bond is small relative to the value it provides. Your premium is calculated as a percentage of the bond amount, and that percentage depends primarily on your personal credit score.
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
              If you need both a TDLR bond and a city bond (which most HVAC contractors operating in a major Texas city do), budget approximately $200–$400 per year total for both. The cost is fully deductible as a business expense.
            </p>
            <p className="text-gray-700 leading-relaxed">
              New HVAC businesses are routinely approved. For a standard $10,000 bond, underwriters focus primarily on your personal credit — your business revenue and years in operation carry minimal weight at this bond amount. You can see your rate instantly when you <Link href="/bonds/hvac-bond-texas" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">apply for your Texas HVAC bond</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step: How to Get Your HVAC Contractor Bond</h2>
            <ol className="space-y-4">
              {[
                {
                  n: "1",
                  t: "Identify which bonds you need",
                  b: "You will need the TDLR bond for your state ACRC license. If you pull permits in Dallas, Houston, Austin, or San Antonio, you also need a city bond. Each is a separate bond with a separate filing.",
                },
                {
                  n: "2",
                  t: "Apply online",
                  b: "Submit your application through a TDI-licensed surety agency. For $10,000 bonds, you only need basic personal and business information. No financial statements or business tax returns are required.",
                },
                {
                  n: "3",
                  t: "Receive your bond certificate(s)",
                  b: "After approval — which is typically instant for applicants with satisfactory credit — your bond certificate arrives by email as a PDF. Same-day issuance is standard.",
                },
                {
                  n: "4",
                  t: "File with TDLR and/or your city",
                  b: "Upload your TDLR bond certificate with your ACRC license application at tdlr.texas.gov. For city bonds, submit the certificate to your city's development services or permitting department.",
                },
                {
                  n: "5",
                  t: "Renew annually",
                  b: "Both the TDLR bond and city bonds must be renewed each year. A lapsed bond will result in a license hold or permit denial. Set a calendar reminder 30 days before your renewal date.",
                },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What the Bond Actually Covers — and What It Doesn't</h2>
            <p className="text-gray-700 leading-relaxed">
              A contractor license bond is not insurance — it is a guarantee. Here is a plain-English breakdown of what the bond does:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <p className="font-bold text-green-900 mb-3">What the bond covers</p>
                <ul className="space-y-2">
                  {[
                    "Failure to complete contracted HVAC work",
                    "Violation of TDLR licensing standards",
                    "Certain financial losses suffered by the project owner",
                    "Third-party claims resulting from failure to perform",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-green-800">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                <p className="font-bold text-red-900 mb-3">What the bond does NOT cover</p>
                <ul className="space-y-2">
                  {[
                    "Property damage caused during installation (get general liability for this)",
                    "Personal injury to workers or bystanders",
                    "Equipment breakdowns after job completion",
                    "Warranty claims on equipment you installed",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-red-800">
                      <ArrowRight className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              Most HVAC contractors carry both a contractor license bond (for licensing compliance) and general liability insurance (for on-the-job property and injury claims). The bond satisfies your TDLR and city licensing requirements; the GL policy protects you from day-to-day job-site exposure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Does my TDLR HVAC bond cover work in all Texas cities?",
                  a: "No. Your TDLR bond satisfies your state ACRC license requirement only. Each city that requires a local HVAC or mechanical contractor license will require a separate city-specific bond. You need a Dallas bond to pull permits in Dallas, a Houston bond for Houston, and so on.",
                },
                {
                  q: "Can I get bonded if I just started my HVAC business?",
                  a: "Yes. New HVAC businesses qualify routinely. For $10,000 bonds, underwriters primarily review your personal credit score, not your years in business or annual revenue. As long as you have no major adverse credit events, expect same-day approval.",
                },
                {
                  q: "What happens if a claim is filed against my bond?",
                  a: "If a valid claim is paid by the surety company, you are obligated to reimburse the surety for the full amount paid. Unlike insurance, a surety bond is not designed to absorb your losses — it is a financial guarantee backed by your creditworthiness. Claims are uncommon for HVAC contractors with good practices.",
                },
                {
                  q: "Does my HVAC bond replace general liability insurance?",
                  a: "No. Your contractor license bond satisfies the licensing requirement imposed by TDLR or your city. General liability insurance covers property damage and bodily injury claims arising from your work. Most HVAC contractors need both.",
                },
                {
                  q: "How far in advance should I renew my bond?",
                  a: "Renew at least 30 days before your expiration date. TDLR processes renewal applications and requires an active bond in your file. If your bond lapses — even for a day — your license may be placed on inactive status, which can prevent you from legally operating or pulling permits.",
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
          <h2 className="text-2xl font-bold mb-2">Get Your Texas HVAC Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · TDLR & all Texas cities · From $100/yr · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My HVAC Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related pages</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: "/bonds/hvac-bond-texas", title: "Texas HVAC Contractor Bond", tag: "Get Bonded" },
              { href: "/bonds/tdlr-bond-texas", title: "TDLR Bond Texas", tag: "TDLR License" },
              { href: "/bonds/contractor-bond-dallas", title: "Dallas Contractor Bond", tag: "Dallas" },
              { href: "/bonds/contractor-bond-houston", title: "Houston Contractor Bond", tag: "Houston" },
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
