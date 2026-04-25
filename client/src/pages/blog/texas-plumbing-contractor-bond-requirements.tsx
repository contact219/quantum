import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, User, CheckCircle } from "lucide-react";

export default function TexasPlumbingContractorBondRequirements() {
  useSEO({
    title: "Texas Plumbing Contractor Bond Requirements 2026 | TDLR & City License",
    description:
      "Complete guide to Texas plumbing contractor bond requirements in 2026. TDLR bond, city bonds, how much it costs, and how to get bonded fast.",
    canonical: "/blog/texas-plumbing-contractor-bond-requirements",
  });
  useSchema(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Texas Plumbing Contractor Bond Requirements 2026 | TDLR & City License",
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
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Plumbing Bonds</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> April 2026</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 9 min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Plumbing Contractor Bond Requirements 2026
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Texas plumbing contractors navigate licensing through both the Texas State Board of Plumbing Examiners and individual cities. This guide tells you which bonds you need, what they cost, and how to get them fast.
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
            <strong>TL;DR:</strong> Texas plumbing contractors need a surety bond for their TSBPE or TDLR license, plus city-specific bonds in Houston, Dallas, and other major markets. Annual cost per bond: $100–$300. Same-day issuance available from Quantum Surety.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-gray max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Licenses Plumbers in Texas?</h2>
            <p className="text-gray-700 leading-relaxed">
              Texas plumbing licensing has historically been governed by the Texas State Board of Plumbing Examiners (TSBPE), an independent agency that issues licenses for journeyman plumbers, master plumbers, and plumbing contractors. In recent years, discussions about consolidating TSBPE under TDLR have progressed, but as of 2026, the plumbing contractor license is still administered by TSBPE.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Here is the key point for your bonding: regardless of whether your license is issued by TSBPE or TDLR going forward, the surety bond requirement exists at the licensing level and at the city level. You need to satisfy both.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {[
                {
                  title: "State Level: TSBPE / TDLR",
                  points: [
                    "Issues the Texas Plumbing Contractor License",
                    "Requires a surety bond as part of the license",
                    "Bond filed with initial application and renewals",
                    "Authorizes plumbing contracting statewide",
                  ],
                },
                {
                  title: "City Level: Local License",
                  points: [
                    "Houston, Dallas, and others require city plumbing licenses",
                    "Each city requires a separate city surety bond",
                    "Bond filed with city permitting or development services",
                    "Required to pull plumbing permits within city limits",
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">State Plumbing Contractor Bond Requirements</h2>
            <p className="text-gray-700 leading-relaxed">
              To hold a Texas Plumbing Contractor License, you must maintain an active surety bond on file with the licensing authority. The bond protects the public — if a licensed plumbing contractor fails to complete work or causes financial harm through a violation of licensing standards, the bond provides a mechanism for affected parties to seek compensation.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Bond amount:</strong> $10,000 (verify current amount with TSBPE or TDLR at renewal)</li>
              <li><strong>Bond type:</strong> Surety bond from a TDI-licensed surety agency</li>
              <li><strong>When filed:</strong> With your initial plumbing contractor license application and at each renewal</li>
              <li><strong>Bond term:</strong> Annual — must stay continuously active</li>
              <li><strong>Named obligee:</strong> TSBPE or TDLR, as applicable</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If your bond lapses, your plumbing contractor license will be considered inactive, and you may not legally supervise or perform plumbing work as a licensed contractor. Apply for your <Link href="/bonds/plumbing-contractor-bond-texas" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">Texas plumbing contractor bond</Link> through Quantum Surety — most applicants receive same-day approval and a certificate in their inbox within the hour.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">TDLR and Plumbing: What Contractors Need to Know</h2>
            <p className="text-gray-700 leading-relaxed">
              TDLR has expanded its role in trades licensing across Texas. Whether TSBPE functions fully independently or plumbing oversight migrates to TDLR, the practical impact on your bond requirement is minimal — you still need an active surety bond for your license. The <Link href="/bonds/tdlr-bond-texas" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">TDLR bond process</Link> at Quantum Surety covers both TSBPE and TDLR-issued licenses.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mt-4">
              <p className="font-bold text-indigo-900 mb-2">Practical tip for license renewals</p>
              <p className="text-indigo-800 text-sm leading-relaxed">
                When you renew your plumbing contractor license — whether through TSBPE or TDLR — you will need to provide proof of an active surety bond. Get your renewal bond issued at least 30 days before your license expiration date so there is no gap. Bond certificates are typically issued the same day you apply.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">City-Level Plumbing Bond Requirements in Texas</h2>
            <p className="text-gray-700 leading-relaxed">
              Your state plumbing contractor license does not automatically authorize you to pull plumbing permits in every Texas city. Most major cities require a separate local contractor registration or license — and a separate bond filed with the city. Here is a breakdown of the largest Texas markets:
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
                    ["Houston", "$10,000", "Houston Permitting Center"],
                    ["Dallas", "$10,000", "Dallas Development Services"],
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
            <p className="text-gray-500 text-xs mt-2">Always verify current bond amounts and filing procedures directly with your city's development services or permitting department before submitting applications.</p>

            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Houston Plumbing Bond</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Houston is Texas's largest city by population and construction volume. The Houston Permitting Center requires plumbing contractors to register and post a bond before pulling plumbing permits. Contractors who skip this step face permit rejections on active jobs — a costly delay in Houston's competitive market.
                </p>
                <Link href="/bonds/contractor-bond-houston" className="text-indigo-600 text-sm font-medium underline underline-offset-2 hover:text-indigo-800 mt-2 inline-block">
                  Houston Contractor Bond details →
                </Link>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Dallas Plumbing Bond</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Dallas Development Services requires plumbing contractors to maintain an active city bond to pull plumbing permits within Dallas city limits. The bond is separate from your state license bond and must be renewed independently.
                </p>
                <Link href="/bonds/contractor-bond-dallas" className="text-indigo-600 text-sm font-medium underline underline-offset-2 hover:text-indigo-800 mt-2 inline-block">
                  Dallas Contractor Bond details →
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Much Does a Texas Plumbing Contractor Bond Cost?</h2>
            <p className="text-gray-700 leading-relaxed">
              For a $10,000 plumbing contractor bond, your annual premium is a small percentage of the bond amount. That percentage is set by the surety company based primarily on your personal credit score. Most Texas plumbing contractors pay between $100 and $300 per bond, per year.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {[
                { credit: "Good credit (680+)", cost: "$100–$150/year" },
                { credit: "Average credit (580–679)", cost: "$150–$250/year" },
                { credit: "Lower credit (below 580)", cost: "$250–$300/year" },
              ].map((tier) => (
                <div key={tier.credit} className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                  <p className="font-bold text-gray-900 text-lg">{tier.cost}</p>
                  <p className="text-gray-500 text-xs mt-1">{tier.credit}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you carry both a state plumbing contractor bond and a city bond (standard for most contractors working in Houston or Dallas), budget $200–$400 per year total. As a business expense, these premiums are fully tax-deductible.
            </p>
            <p className="text-gray-700 leading-relaxed">
              There is no penalty for being a newly formed plumbing business — underwriters at this bond amount focus almost entirely on personal credit, not business history. Even if your business started this year, you can be bonded today.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Get Your Texas Plumbing Contractor Bond</h2>
            <ol className="space-y-4">
              {[
                {
                  n: "1",
                  t: "Determine which bonds apply to you",
                  b: "If you hold or are applying for a Texas plumbing contractor license, you need the state bond. If you pull permits in Houston, Dallas, Austin, or another major city, you also need that city's bond. List every jurisdiction where you work.",
                },
                {
                  n: "2",
                  t: "Apply online — no paperwork required",
                  b: "For standard $10,000 bonds, you only need your name, address, business name, and basic contact info. No financial statements, tax returns, or business documents are required at this bond amount.",
                },
                {
                  n: "3",
                  t: "Get approved and receive your certificate(s)",
                  b: "Most plumbing contractor bond applications are approved instantly. Your bond certificate will arrive by email as a PDF — typically within minutes of approval.",
                },
                {
                  n: "4",
                  t: "File the bond with the licensing authority",
                  b: "Submit your state bond certificate with your plumbing contractor license application or renewal. Submit city bond certificates to each city's development services or permitting department.",
                },
                {
                  n: "5",
                  t: "Set up annual renewal reminders",
                  b: "Both your state and city bonds must be renewed each year. A lapsed bond means a lapsed license. Mark your renewal dates in your calendar 30 days in advance — or sign up for auto-renewal through Quantum Surety.",
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Plumbing Bond vs. General Liability Insurance</h2>
            <p className="text-gray-700 leading-relaxed">
              Many plumbing contractors conflate their surety bond with their general liability policy. They serve entirely different purposes:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">Plumbing Contractor Bond</p>
                <ul className="space-y-2">
                  {[
                    "Required by TSBPE/TDLR for your license",
                    "Required by cities to pull permits",
                    "Protects the public from contractor non-performance",
                    "Claims are repaid by the contractor to the surety",
                    "Typical cost: $100–$300/yr per bond",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">General Liability Insurance</p>
                <ul className="space-y-2">
                  {[
                    "Protects you from third-party injury and property damage claims",
                    "Covers on-the-job incidents (burst pipe floods a kitchen, etc.)",
                    "Pays out from the insurer — does not require contractor repayment",
                    "Often required by commercial general contractors",
                    "Typical cost: $1,000–$5,000+/yr depending on exposure",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              A licensed Texas plumbing contractor typically needs both. The bond keeps your license active and your permits flowing. GL insurance covers you when something goes wrong on the job.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do I need a separate bond for each Texas city I work in?",
                  a: "Yes. If you pull plumbing permits in both Houston and Dallas, for example, you need a separate city bond for each. Your state plumbing contractor bond only satisfies the TSBPE/TDLR requirement — it does not substitute for city bonds.",
                },
                {
                  q: "Can I get bonded with bad credit?",
                  a: "Yes, though the premium will be higher. For a $10,000 bond, even applicants with credit scores below 580 are typically approved — the surety just charges a higher rate to account for the elevated risk. Expect to pay $250–$300/yr at the lower end of the credit spectrum.",
                },
                {
                  q: "What if TSBPE merges with TDLR before my renewal?",
                  a: "If the licensing authority changes, the obligee on your bond will need to be updated at renewal. Quantum Surety will handle that change for you — just renew as normal and we will ensure the bond names the correct licensing agency.",
                },
                {
                  q: "How long does it take to get bonded?",
                  a: "Most plumbing contractor bond applications are approved instantly, and your certificate arrives by email within minutes. Same-day issuance is standard for standard $10,000 bonds.",
                },
                {
                  q: "Does a plumbing contractor bond cover my employees?",
                  a: "Your contractor license bond covers your activities as the licensed contractor of record. It does not automatically extend to cover your employees' independent misconduct. For employee-related coverage, talk to your insurance agent about an employer's liability policy.",
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
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Plumbing Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · TSBPE, TDLR & all Texas cities · From $100/yr · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Plumbing Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related pages</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: "/bonds/plumbing-contractor-bond-texas", title: "Texas Plumbing Contractor Bond", tag: "Get Bonded" },
              { href: "/bonds/tdlr-bond-texas", title: "TDLR Bond Texas", tag: "TDLR License" },
              { href: "/bonds/contractor-bond-houston", title: "Houston Contractor Bond", tag: "Houston" },
              { href: "/bonds/contractor-bond-dallas", title: "Dallas Contractor Bond", tag: "Dallas" },
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
