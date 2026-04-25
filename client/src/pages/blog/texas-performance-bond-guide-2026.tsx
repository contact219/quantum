import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import {
  ArrowRight, CheckCircle, Clock, BookOpen,
  FileText, Shield, ChevronRight, DollarSign, Users
} from "lucide-react";

export default function BlogTexasPerformanceBondGuide2026() {
  useSEO({
    title: "Texas Performance Bond Requirements & Cost Guide 2026 | Quantum Surety Blog",
    description:
      "Complete guide to Texas performance bonds in 2026: who needs them, how much they cost (0.5%–3%), legal requirements under Texas Gov. Code § 2253 and the Miller Act, and how to get approved fast.",
    canonical: "/blog/texas-performance-bond-guide-2026",
    ogType: "article",
  });
  useSchema(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "publisher": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
    },
    "ld-json-Article"
  );

  const tocItems = [
    { id: "what-is", label: "What is a Texas performance bond?" },
    { id: "who-needs", label: "Who needs a performance bond in Texas?" },
    { id: "cost", label: "Performance bond cost breakdown" },
    { id: "rate-factors", label: "5 factors that affect your rate" },
    { id: "how-to-get", label: "How to get a Texas performance bond" },
    { id: "vs-payment-bond", label: "Performance bond vs. payment bond" },
    { id: "vs-bid-bond", label: "Performance bond vs. bid bond" },
    { id: "faq", label: "Frequently asked questions" },
  ];

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
            <span>Construction Bonds</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
              Construction Bonds
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> 10 min read
            </span>
            <span className="text-indigo-300 text-sm">April 25, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Texas Performance Bond Requirements &amp; Cost Guide (2026)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Whether you&apos;re bidding on a TxDOT project, a school district contract, or a large private
            commercial build, a performance bond protects the project owner and proves your capacity to
            deliver. Here&apos;s everything Texas contractors need to know in 2026.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-12">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> In this guide
          </p>
          <ol className="space-y-2">
            {tocItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-2"
                >
                  <span className="text-gray-400 font-mono text-xs w-4">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <article>

          {/* Section 1 — What is */}
          <section id="what-is" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a Texas performance bond?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A performance bond is a three-party surety agreement that guarantees a contractor will
              complete a construction project according to the contract terms. If the contractor
              defaults — stops work, misses milestones, or fails to perform — the surety company steps
              in to ensure the project is completed, either by financing the contractor, hiring a
              replacement contractor, or paying the project owner up to the bond amount.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              The three parties to every performance bond are:
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: <Users className="w-5 h-5 text-indigo-600" />,
                  title: "Principal",
                  body: "The contractor who purchases the bond and is obligated to complete the project.",
                },
                {
                  icon: <Shield className="w-5 h-5 text-teal-600" />,
                  title: "Surety",
                  body: "The insurance or bonding company that backs the guarantee. Quantum Surety works with multiple A-rated carriers.",
                },
                {
                  icon: <FileText className="w-5 h-5 text-amber-600" />,
                  title: "Obligee",
                  body: "The project owner (public agency, school district, or private developer) protected by the bond.",
                },
              ].map((card) => (
                <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-2">{card.icon}</div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed">
              Unlike a letter of credit or a cash deposit, a performance bond does not tie up your
              working capital. You pay a small annual premium — typically 0.5%–3% of the contract
              value — and the surety provides the full guarantee. If no claim is ever made, that
              premium is all you pay.
            </p>
          </section>

          {/* Section 2 — Who needs */}
          <section id="who-needs" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who needs a performance bond in Texas?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Performance bonds are mandatory for most Texas public construction projects and strongly
              recommended — or contractually required — for many private ones.
            </p>
            <div className="space-y-5">
              {[
                {
                  title: "Texas Government Code § 2253 — State and Local Public Projects",
                  body: "Texas Gov. Code § 2253.021 requires both a performance bond and a payment bond for any public works contract of $25,000 or more. This covers contracts with the State of Texas, counties, municipalities, school districts, water districts, and other political subdivisions. Subcontractors on covered projects are also affected: payment bond protections flow down to subcontractors and suppliers.",
                  tag: "State Law",
                  tagColor: "bg-blue-100 text-blue-700",
                },
                {
                  title: "Miller Act — Federal Projects ($150,000+)",
                  body: "For construction contracts with the federal government valued at $150,000 or more, the Miller Act (40 U.S.C. §§ 3131–3134) mandates both a performance bond and a payment bond. Federal contractors in Texas working on military bases, federal courthouses, VA facilities, or other federal properties must comply. The bond amount equals 100% of the contract price.",
                  tag: "Federal Law",
                  tagColor: "bg-red-100 text-red-700",
                },
                {
                  title: "TxDOT Projects — All Sizes",
                  body: "The Texas Department of Transportation requires performance bonds on all highway, bridge, and transportation infrastructure contracts, regardless of project size. TxDOT has its own prequalification process and specific bonding requirements outlined in its Standard Specifications for Construction and Maintenance of Highways.",
                  tag: "TxDOT",
                  tagColor: "bg-orange-100 text-orange-700",
                },
                {
                  title: "School Districts and Universities",
                  body: "Texas school districts and public universities are subject to § 2253 and often require bonds on projects well below the statutory threshold. Bond requirements are set in each district's procurement policy. The Texas Education Agency recommends bonds on all construction contracts to protect taxpayer funds.",
                  tag: "Education",
                  tagColor: "bg-green-100 text-green-700",
                },
                {
                  title: "Private Projects — Owner-Required",
                  body: "Private developers frequently require performance bonds for large commercial, industrial, or multifamily construction projects, even though there is no statutory mandate. Lenders may require performance bonds as a condition of construction financing. Large national retailers, REITs, and institutional owners routinely specify bonding requirements in their contract documents.",
                  tag: "Private",
                  tagColor: "bg-purple-100 text-purple-700",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 — Cost */}
          <section id="cost" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance bond cost breakdown</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Performance bond premiums are expressed as a percentage of the total contract (bond) amount.
              The rate you receive depends on your credit score, company financials, project type, and
              the surety carrier. Most qualified Texas contractors pay between 0.5% and 3% of the
              contract value.
            </p>
            <div className="overflow-x-auto not-prose mb-6">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-gray-700">Bond Amount</th>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-gray-700">0.5% Rate (Best)</th>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-gray-700">1.5% Rate (Standard)</th>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-gray-700">3% Rate (Higher Risk)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["$100,000", "$500", "$1,500", "$3,000"],
                    ["$500,000", "$2,500", "$7,500", "$15,000"],
                    ["$1,000,000", "$5,000", "$15,000", "$30,000"],
                    ["$5,000,000", "$25,000", "$75,000", "$150,000"],
                  ].map(([amount, low, mid, high]) => (
                    <tr key={amount} className="hover:bg-slate-50">
                      <td className="p-3 border-b border-slate-100 font-semibold text-gray-900">{amount}</td>
                      <td className="p-3 border-b border-slate-100 text-green-700 font-medium">{low}</td>
                      <td className="p-3 border-b border-slate-100 text-blue-700 font-medium">{mid}</td>
                      <td className="p-3 border-b border-slate-100 text-orange-700 font-medium">{high}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Note: These are annual premiums for the first year. Multi-year project bonds may be priced
              differently. Final rates depend on underwriting review. Contact Quantum Surety for a
              precise quote for your project.
            </p>
          </section>

          {/* Section 4 — Rate factors */}
          <section id="rate-factors" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5 factors that affect your performance bond rate</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Surety underwriters evaluate your ability and willingness to complete the contracted work.
              Here are the five factors that most directly influence the rate you&apos;re quoted:
            </p>
            <div className="space-y-4">
              {[
                {
                  num: "1",
                  title: "Personal and business credit score",
                  body: "A credit score above 700 typically qualifies contractors for the best rates (0.5%–1%). Scores in the 600s may still qualify, but at higher rates. Below 600, some carriers may decline; others offer specialty programs. Quantum Surety works with carriers across the spectrum.",
                },
                {
                  num: "2",
                  title: "Years in business and project history",
                  body: "Contractors with 5+ years of experience and a clean completion record are lower risk. Newer contractors with less track record should expect higher rates or additional collateral requirements. Documenting past project completions — especially similar scope — strengthens your application.",
                },
                {
                  num: "3",
                  title: "Financial statements",
                  body: "For bonds over $500,000, most sureties require CPA-prepared financial statements — either reviewed or audited. Your working capital ratio, net worth relative to the bond amount, and debt levels are all evaluated. A strong balance sheet directly translates to lower rates.",
                },
                {
                  num: "4",
                  title: "Project type and complexity",
                  body: "Ground-up commercial construction, infrastructure (roads, utilities), and specialty trades carry different risk profiles. A $1M interior renovation is viewed differently than a $1M bridge rehabilitation. Public projects are often viewed more favorably because payment is more predictable.",
                },
                {
                  num: "5",
                  title: "Surety carrier and program",
                  body: "Not all carriers price the same risk identically. Quantum Surety accesses multiple A-rated carriers and can shop your application to find the most competitive rate for your specific profile and project type.",
                },
              ].map((item) => (
                <div key={item.num} className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-900 text-white font-bold text-sm flex items-center justify-center">
                    {item.num}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 — How to get */}
          <section id="how-to-get" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to get a Texas performance bond</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The process at Quantum Surety is designed to move fast — because you often have a bid
              deadline to meet. Here&apos;s how it works:
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Submit your application",
                  body: "Complete our online form at quantumsurety.bond/quote. Provide basic information about your company, the project, and the bond amount required. For bonds under $250,000, this is usually all we need.",
                  tag: "5 minutes",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "2",
                  title: "AI-assisted underwriting review",
                  body: "Our platform runs an AI-assisted credit and risk evaluation. For straightforward applications, this happens automatically. Larger bonds trigger a human underwriter review, which we complete as fast as possible — often same day.",
                  tag: "Fast review",
                  tagColor: "bg-teal-100 text-teal-700",
                },
                {
                  step: "3",
                  title: "Receive your quote",
                  body: "You&apos;ll receive a firm quote with the premium amount, bond terms, and any conditions. For complex projects, we may shop your application across multiple carriers to find the best rate.",
                  tag: "Transparent pricing",
                  tagColor: "bg-green-100 text-green-700",
                },
                {
                  step: "4",
                  title: "Pay your premium",
                  body: "Pay securely online. For standard bonds, the premium is due in full at issuance. Larger programs may allow installment arrangements — ask your Quantum Surety representative.",
                  tag: "Secure checkout",
                  tagColor: "bg-blue-100 text-blue-700",
                },
                {
                  step: "5",
                  title: "Download your bond documents",
                  body: "Your signed performance bond is delivered as a PDF immediately after payment. We also prepare any required riders, exhibits, or dual-obligee endorsements your project owner requires. Bond originals can be mailed same day on request.",
                  tag: "Instant delivery",
                  tagColor: "bg-purple-100 text-purple-700",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-900 text-white font-bold text-sm flex items-center justify-center">
                    {item.step}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-base">{item.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 — vs payment bond */}
          <section id="vs-payment-bond" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance bond vs. payment bond</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Texas Gov. Code § 2253 and the Miller Act require <em>both</em> bonds on covered public
              projects — but they protect different parties and different risks.
            </p>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-gray-700">Feature</th>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-indigo-700">Performance Bond</th>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-teal-700">Payment Bond</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Who is protected", "Project owner (obligee)", "Subcontractors and suppliers"],
                    ["What is guaranteed", "Project completion per contract", "Payment to subs and material suppliers"],
                    ["Who files a claim", "The project owner", "Unpaid subcontractors or suppliers"],
                    ["Bond amount", "Typically 100% of contract", "Typically 100% of contract"],
                    ["Texas statute", "§ 2253.021", "§ 2253.021"],
                    ["Required together?", "Yes — on public projects over $25K", "Yes — on public projects over $25K"],
                  ].map(([feature, perf, pay]) => (
                    <tr key={feature} className="hover:bg-slate-50">
                      <td className="p-3 border-b border-slate-100 font-medium text-gray-700">{feature}</td>
                      <td className="p-3 border-b border-slate-100 text-gray-600">{perf}</td>
                      <td className="p-3 border-b border-slate-100 text-gray-600">{pay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              Most surety companies issue performance and payment bonds together, often on the same
              bond form. At Quantum Surety, both can be included in a single application and quote.
              See our{" "}
              <Link href="/bonds/performance-bond-texas">
                <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Texas performance bond page</span>
              </Link>{" "}
              for details.
            </p>
          </section>

          {/* Section 7 — vs bid bond */}
          <section id="vs-bid-bond" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance bond vs. bid bond — when you need each</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A bid bond and a performance bond serve different phases of the contracting process.
              Understanding the sequence helps you avoid surprises at award time.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h3 className="font-bold text-amber-900 mb-2">Bid Bond</h3>
                <ul className="space-y-2 text-sm text-amber-800">
                  {[
                    "Required at the time of bid submission",
                    "Guarantees you will honor your bid price",
                    "Protects owner if low bidder walks away",
                    "Typically 5% or 10% of the bid amount",
                    "Usually free when a surety relationship exists",
                    "Expires when contract is executed",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                <h3 className="font-bold text-indigo-900 mb-2">Performance Bond</h3>
                <ul className="space-y-2 text-sm text-indigo-800">
                  {[
                    "Required at contract execution (after award)",
                    "Guarantees you will complete the project",
                    "Protects owner throughout construction",
                    "Typically 100% of the contract value",
                    "Premium is 0.5%–3% of bond amount",
                    "Remains in force through project completion",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              When you are awarded a contract, the bid bond is replaced by the performance bond (and
              payment bond). Getting pre-qualified with a surety before bidding means this transition
              is seamless — no delays at award time.
            </p>
          </section>

          {/* Section 8 — FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: "How long does it take to get a performance bond in Texas?",
                  a: "For bonds under $250,000, qualified contractors can often receive a bond within a few hours of submitting their application. Larger bonds require financial statement review and carrier underwriting — typically 1–3 business days. Quantum Surety uses AI-assisted underwriting to accelerate the process.",
                },
                {
                  q: "Can I get a performance bond with bad credit?",
                  a: "Yes, though your options and rates will be more limited. Some surety carriers specialize in non-standard or higher-risk accounts. You may be asked to provide collateral (such as a letter of credit or cash deposit) to secure the bond. Quantum Surety works with multiple carriers and can match your application to the right program.",
                },
                {
                  q: "What happens if a claim is filed on my performance bond?",
                  a: "If the project owner declares you in default and makes a demand on the bond, the surety investigates the claim. If valid, the surety may complete the project by financing your work, hiring a completion contractor, or paying the owner up to the bond penal sum. The surety then has a right of indemnification — meaning they can seek reimbursement from you for any amount they paid.",
                },
                {
                  q: "Do I need a separate performance bond for each project?",
                  a: "Generally, yes — each public project requiring a bond will have its own bond form specific to that contract. However, once you are prequalified with a surety for a certain bonding capacity (e.g., $5M per project, $10M aggregate), obtaining bonds for new projects is much faster.",
                },
                {
                  q: "What is bonding capacity and how is it set?",
                  a: "Bonding capacity is the maximum bond amount (or total bonds outstanding) a surety will issue for a given contractor. It is set based on your net worth, working capital, experience, and credit. Most sureties will bond up to 10–15x your working capital as a starting rule of thumb. Growing your financial strength is the most reliable way to increase bonding capacity.",
                },
                {
                  q: "Is a performance bond the same as insurance?",
                  a: "No. Insurance protects the insured (the contractor) against unforeseen losses. A surety bond protects the obligee (the project owner) against contractor default. The key difference: if a claim is paid on a bond, the surety expects to be reimbursed by the contractor. Bonds are a credit product, not an insurance product.",
                },
              ].map((item) => (
                <div key={item.q} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

        </article>

        {/* CTA card */}
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-5">
            <DollarSign className="w-4 h-4" /> Fast quotes — same-day approval available
          </div>
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Performance Bond Quote</h2>
          <p className="text-indigo-200 mb-6">
            0.5%–3% rates · A-rated carriers · AI-assisted underwriting · Instant PDF delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <span className="inline-flex items-center justify-center rounded-lg bg-white text-indigo-900 font-semibold px-8 py-3 hover:bg-indigo-50 transition-colors cursor-pointer">
                Start My Application <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
            <Link href="/bonds/performance-bond-texas">
              <span className="inline-flex items-center justify-center rounded-lg border border-white text-white font-semibold px-8 py-3 hover:bg-white/10 transition-colors cursor-pointer">
                Learn About Performance Bonds
              </span>
            </Link>
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: "/blog/texas-bid-bond-requirements-2026",
                title: "Texas Bid Bond Requirements 2026: What Every Contractor Needs to Know",
                tag: "Construction Bonds",
              },
              {
                href: "/blog/texas-contractor-bond-requirements-by-city",
                title: "Texas Contractor Bond Requirements by City (2026)",
                tag: "Texas Contractors",
              },
              {
                href: "/bonds/performance-bond-texas",
                title: "Texas Performance Bond — Instant Quote",
                tag: "Product Page",
              },
              {
                href: "/blog/texas-contractor-bond-and-permits",
                title: "Get Your Bond and Pull Your Permits in One Day",
                tag: "Contractor Workflow",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-2 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">
                    Read more <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
