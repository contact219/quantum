import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Phone, ChevronRight } from "lucide-react";

export default function BlogNotaryBondCost() {
  useSEO({
    title: "How Much Does a Texas Notary Bond Cost in 2026? | Quantum Surety",
    description:
      "A Texas notary bond costs $50 for the full 4-year term — no credit check, no annual renewal. Here's the complete cost breakdown including SOS fees, education, seal, and optional E&O insurance.",
    canonical: "/blog/texas-notary-bond-cost-2026",
    ogType: "article",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog">
              <span className="hover:text-white cursor-pointer">Blog</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas Notary</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
              Texas Notary
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> 4 min read
            </span>
            <span className="text-indigo-300 text-sm">March 20, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            How Much Does a Texas Notary Bond Cost in 2026?
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Short answer: <strong>$50 for the full 4-year term.</strong> But there are other costs
            involved in becoming a Texas notary. Here's the complete picture.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <article>

          {/* Cost table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Texas notary cost breakdown (2026)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Getting your Texas notary commission involves several separate fees. Here's every one of them,
              in order:
            </p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {[
                { item: "Education course (SOS, new in 2026)", cost: "$20", notes: "Per attempt, up to 3 attempts in 90 days", highlight: true },
                { item: "Texas notary bond — 4-year, $10,000", cost: "$50", notes: "One-time flat fee, no credit check", highlight: false },
                { item: "State application fee (SOS)", cost: "$21", notes: "Paid via SOS Portal to Secretary of State", highlight: false },
                { item: "Notary seal / stamp", cost: "$17–$35", notes: "Required — must meet TX specs", highlight: false },
                { item: "Notary journal (record book)", cost: "$8–$20", notes: "Now legally required under SB693", highlight: true },
                { item: "E&O insurance (recommended)", cost: "$40–$100", notes: "Protects you personally; 4-year term", highlight: false },
                { item: "Oath of office (county clerk)", cost: "Varies by county", notes: "Some counties charge $0–$10", highlight: false },
              ].map((row, i) => (
                <div
                  key={row.item}
                  className={`flex items-center px-6 py-4 border-b border-gray-100 last:border-0 ${row.highlight ? "bg-amber-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{row.item}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{row.notes}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className="font-bold text-gray-900 text-sm">{row.cost}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center px-6 py-4 bg-indigo-50 border-t border-indigo-200">
                <p className="flex-1 font-bold text-indigo-900 text-sm">Minimum total (bond + SOS fees only)</p>
                <p className="font-bold text-indigo-900">$91</p>
              </div>
              <div className="flex items-center px-6 py-4 bg-indigo-100 border-t border-indigo-200">
                <p className="flex-1 font-bold text-indigo-900 text-sm">Typical total (bond + all required items + E&O)</p>
                <p className="font-bold text-indigo-900">$150–$200</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why the notary bond costs $50 (not more, not less)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Texas notary bonds are what the industry calls "flat-rate" bonds — the premium is not tied to
              credit score, income, or any underwriting factors. The $10,000 bond amount is low enough and
              the risk profile of notaries is consistent enough that carriers charge a standard flat fee.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              There is no annual renewal fee. You pay $50 once, and the bond covers you for the full 4-year
              commission. When you renew your commission, you'll purchase a new bond — again, $50.
            </p>
            <p className="text-gray-700 leading-relaxed">
              There is no credit check. Unlike contractor bonds or dealer bonds, which can cost hundreds or
              thousands based on credit and bond amount, notary bonds are available to anyone who meets Texas
              eligibility requirements — no financial history required.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What's new in 2026 that costs money
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "The SOS education course — $20 per attempt",
                  body: "Before January 2026, becoming a Texas notary had no education requirement. SB693 changed that. The mandatory 2-hour online course is provided exclusively by the Texas Secretary of State through the SOS Portal. You pay $20 each time you attempt the 20-question assessment. You need a 70% to pass. Most applicants pass on the first attempt — but budget for one $20 fee.",
                },
                {
                  title: "The notary journal — now legally required",
                  body: "A notary journal (record book) was previously strongly recommended but not required by Texas law. SB693 made it a legal requirement. Journals cost $8–$20 from office supply stores or notary supply vendors. You need to keep completed journals for 10 years from the date of the notarial act — not just the duration of your commission.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-bold text-amber-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-amber-800 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Should you add E&O insurance?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your $50 notary bond protects the public — not you. If someone files a claim on your bond
              and the surety pays it, you're personally on the hook to reimburse the surety company.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Errors & Omissions (E&O) insurance protects you from lawsuits for honest mistakes — a missed
              detail, an improper acknowledgment, a procedural error. Coverage ranges from $5,000 to
              $100,000+ and costs $40–$100 for a 4-year term alongside your bond.
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
              <p className="text-teal-900 text-sm font-medium">
                <CheckCircle className="w-4 h-4 text-teal-600 inline mr-2" />
                E&O insurance is especially important if you're a <strong>mobile notary</strong>,{" "}
                <strong>notary signing agent</strong>, or if you handle <strong>real estate documents</strong>,{" "}
                <strong>loan closings</strong>, or <strong>legal filings</strong>. One lawsuit from a
                procedural error can cost far more than $40.
              </p>
            </div>
          </section>
        </article>

        {/* CTA */}
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Notary Bond — $50</h2>
          <p className="text-indigo-200 mb-6">
            $10,000 · 4-year term · No credit check · Instant download · Add E&O at checkout
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote?type=notary">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: "/blog/texas-notary-bond-sb693-2026-requirements", title: "Texas Notary Bond 2026: What SB693 Changes", tag: "SB693 Guide" },
              { href: "/bonds/notary-bond-texas", title: "Texas Notary Bond — Instant Online", tag: "Product Page" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-2 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
