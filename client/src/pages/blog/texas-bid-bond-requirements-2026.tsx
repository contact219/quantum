import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import {
  ArrowRight, CheckCircle, Clock, BookOpen,
  AlertTriangle, FileText, Shield, ChevronRight, DollarSign
} from "lucide-react";

export default function BlogTexasBidBondRequirements2026() {
  useSEO({
    title: "Texas Bid Bond Requirements 2026: What Contractors Need to Know | Quantum Surety",
    description:
      "Texas bid bond requirements for 2026: who needs one, when it's required, how much it costs, and how to get same-day approval. Complete guide for TX contractors.",
    canonical: "/blog/texas-bid-bond-requirements-2026",
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
    { id: "what-guarantees", label: "What a bid bond guarantees" },
    { id: "when-required", label: "When Texas law requires a bid bond" },
    { id: "amounts", label: "Bid bond amounts (5% and 10%)" },
    { id: "cost", label: "What a bid bond costs" },
    { id: "sequence", label: "The bond-bid-award sequence" },
    { id: "vs-security", label: "Bid bond vs. bid security (certified check)" },
    { id: "win-lose", label: "What happens when you win vs. lose" },
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
              <Clock className="w-3 h-3" /> 8 min read
            </span>
            <span className="text-indigo-300 text-sm">April 25, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Texas Bid Bond Requirements 2026: What Every Contractor Needs to Know
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Bid bonds are the first surety bond most Texas contractors encounter. Miss the requirement
            on a public project and your bid is disqualified before it&apos;s even opened. Here&apos;s everything
            you need to know — before the bid deadline.
          </p>
        </div>
      </section>

      {/* TL;DR Banner */}
      <section className="bg-amber-50 border-b border-amber-200 py-5 px-4">
        <div className="max-w-3xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">TL;DR — The short version</p>
            <p className="text-amber-800 text-sm mt-1">
              Texas law (Gov. Code § 2253) requires a bid bond on most public construction contracts.
              The bond is typically <strong>5% or 10% of the bid amount</strong> and costs{" "}
              <strong>nothing extra</strong> when you have a surety relationship — the premium is rolled
              into your performance bond when you win. No surety relationship yet? Same-day approval
              is available at{" "}
              <Link href="/quote">
                <span className="underline cursor-pointer">quantumsurety.bond/quote</span>
              </Link>
              .
            </p>
          </div>
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

          {/* Section 1 */}
          <section id="what-guarantees" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What a bid bond guarantees</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A bid bond is a surety bond submitted alongside a contractor&apos;s proposal on a construction
              project. It makes a specific guarantee to the project owner: if the contractor is
              awarded the contract but refuses to sign it — or fails to provide the required
              performance and payment bonds — the surety will compensate the owner for the
              difference in cost between the defaulting bidder&apos;s price and the next-lowest bid,
              up to the face amount of the bid bond.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In other words, a bid bond prevents low-ball bids from contractors who have no intention
              of, or capability for, signing the contract. It filters out non-serious bidders and
              protects public agencies from having to re-bid projects when a contractor walks away
              after a low bid.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <FileText className="w-5 h-5 text-indigo-600" />,
                  title: "Principal",
                  body: "The contractor submitting the bid. Obligated to enter the contract at the bid price if awarded.",
                },
                {
                  icon: <Shield className="w-5 h-5 text-teal-600" />,
                  title: "Surety",
                  body: "The bonding company backing the guarantee. Pays the penalty if the contractor defaults post-award.",
                },
                {
                  icon: <CheckCircle className="w-5 h-5 text-amber-600" />,
                  title: "Obligee",
                  body: "The public agency or project owner accepting bids. Protected against bid withdrawal loss.",
                },
              ].map((card) => (
                <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-2">{card.icon}</div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section id="when-required" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When Texas law requires a bid bond</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Texas does not have a single blanket rule that applies to every project — the
              requirement comes from several overlapping statutes and agency procurement rules.
            </p>
            <div className="space-y-5">
              {[
                {
                  title: "Texas Government Code § 2253 — Public Works",
                  body: "Section 2253.021 requires performance and payment bonds on public works contracts of $25,000 or more. While bid bonds are not explicitly mandated in every clause of § 2253, Texas public agencies almost universally include bid bond requirements in their bid specifications for projects at or above this threshold. Failing to include the bond disqualifies the bid.",
                  tag: "State Law",
                  tagColor: "bg-blue-100 text-blue-700",
                },
                {
                  title: "Miller Act — Federal Projects $150,000+",
                  body: "For federal construction contracts over $150,000, the Miller Act (40 U.S.C. § 3131) requires performance and payment bonds. Federal agencies typically require bid bonds as part of their solicitation documents under FAR Part 28. The bond amount is set in the invitation for bids — commonly 20% of the bid price or $3 million, whichever is less.",
                  tag: "Federal Law",
                  tagColor: "bg-red-100 text-red-700",
                },
                {
                  title: "TxDOT Highway Contracts",
                  body: "The Texas Department of Transportation requires bid bonds on all highway and transportation contracts. TxDOT sets its own bonding requirements in the bid documents and Standard Specifications. Contractors must be prequalified with TxDOT, which requires a surety prequalification letter confirming your bonding capacity.",
                  tag: "TxDOT",
                  tagColor: "bg-orange-100 text-orange-700",
                },
                {
                  title: "School Districts and Municipalities",
                  body: "Texas ISDs, cities, and counties set their own bid requirements within the framework of state competitive bidding laws. Most require a bid bond for any project where competitive bids are solicited over a set threshold (often $50,000 or more). Check the specific invitation for bids — the bond amount and form are always specified.",
                  tag: "Local Government",
                  tagColor: "bg-green-100 text-green-700",
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

          {/* Section 3 */}
          <section id="amounts" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bid bond amounts — the 5% and 10% standard</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              The bid bond amount is set by the project owner in the bid specifications, expressed as
              a percentage of the bid price. The two most common amounts in Texas are:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <p className="text-4xl font-bold text-indigo-700 mb-1">5%</p>
                <p className="font-semibold text-indigo-900 mb-2">of the bid amount</p>
                <p className="text-indigo-800 text-sm leading-relaxed">
                  Most common for state and local public works projects in Texas. On a $1,000,000
                  bid, the bond is $50,000 — but you do not pay $50,000. You pay a small premium
                  to the surety (often nothing if rolled into your performance bond).
                </p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                <p className="text-4xl font-bold text-teal-700 mb-1">10%</p>
                <p className="font-semibold text-teal-900 mb-2">of the bid amount</p>
                <p className="text-teal-800 text-sm leading-relaxed">
                  Common on federal projects and some TxDOT contracts. Provides a higher cushion
                  for the project owner. On a $1,000,000 bid, the bond face value is $100,000.
                  Again, cost to the contractor is the small premium.
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Always read the bid specifications carefully — the required percentage and acceptable
              bond forms are stated explicitly in the invitation for bids (IFB) or request for
              proposals (RFP). Using the wrong form or percentage is grounds for bid disqualification.
            </p>
          </section>

          {/* Section 4 */}
          <section id="cost" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What a bid bond costs</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              This surprises many contractors: in most cases, a bid bond costs nothing beyond
              your existing surety relationship.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-5">
              <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Bid bond pricing in practice
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "With an established surety relationship",
                    value: "$0 — free",
                    note: "Surety issues the bid bond as a courtesy. The premium is earned when you win and purchase the performance bond.",
                  },
                  {
                    label: "Without a surety relationship (first-time)",
                    value: "$100–$250 typical",
                    note: "A small flat fee may apply for bid bonds issued without a pre-existing relationship or prequalification.",
                  },
                  {
                    label: "Bond face value (5% on $500K bid)",
                    value: "$25,000 bond — not your cost",
                    note: "The face value is what the owner collects if you default. Your cost is the premium above — not the face amount.",
                  },
                ].map((row) => (
                  <div key={row.label} className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <p className="text-sm text-gray-700 font-medium">{row.label}</p>
                      <p className="text-sm font-bold text-green-700 whitespace-nowrap">{row.value}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{row.note}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              The best way to minimize bid bond friction is to establish a surety relationship before
              you need it. Quantum Surety can set up your surety prequalification and issue bid
              bonds quickly when opportunities arise.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sequence" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The bond-bid-award sequence</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Understanding the timeline keeps you prepared at every stage of the bid process.
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Surety prequalification (before bidding)",
                  body: "Before you bid competitively, get prequalified with a surety. They review your financials, credit, and project history and confirm your bonding capacity. This is what makes bid bonds free and fast.",
                  tag: "Before the bid",
                  tagColor: "bg-gray-100 text-gray-700",
                },
                {
                  step: "2",
                  title: "Request bid bond",
                  body: "When you identify a project to bid, request a bid bond from your surety agent. Provide the project details: owner, bid amount, bond percentage required, and bid date. Quantum Surety can issue bid bonds same day.",
                  tag: "Before bid deadline",
                  tagColor: "bg-amber-100 text-amber-700",
                },
                {
                  step: "3",
                  title: "Submit bid with bond",
                  body: "The signed bid bond (and power of attorney) is submitted with your sealed bid. For many Texas public projects this is now accepted electronically. The bid bond is held by the owner pending award.",
                  tag: "Bid day",
                  tagColor: "bg-blue-100 text-blue-700",
                },
                {
                  step: "4",
                  title: "Award (or not)",
                  body: "If you are the low bidder and awarded the contract: proceed to step 5. If you are not the low bidder: bid bonds are returned and no further action is needed.",
                  tag: "Award decision",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "5",
                  title: "Execute contract & replace with performance bond",
                  body: "Sign the contract and provide the required performance and payment bonds within the specified timeframe (typically 10–15 days after award). The bid bond is replaced and becomes void once the performance bond is in place.",
                  tag: "Post-award",
                  tagColor: "bg-green-100 text-green-700",
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

          {/* Section 6 */}
          <section id="vs-security" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bid bond vs. bid security (certified check alternative)</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Some Texas bid invitations accept either a surety bid bond <em>or</em> a certified
              check or cashier&apos;s check as bid security. Here is why the surety bond is almost
              always the better choice:
            </p>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-gray-700">Factor</th>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-indigo-700">Surety Bid Bond</th>
                    <th className="text-left p-3 border-b border-slate-200 font-semibold text-gray-600">Certified Check</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Cost", "Often $0 (with surety relationship)", "Ties up 5–10% of bid in cash"],
                    ["Cash flow impact", "None", "Significant — funds held until return"],
                    ["Return of funds", "Bond simply expires", "Check returned after award/rejection"],
                    ["Signals to owner", "Professional, pre-qualified", "No prequalification implied"],
                    ["Processing time", "Same day with surety", "Requires bank trip and hold"],
                    ["Multiple bids", "No cash required per bid", "Cash tied up across all active bids"],
                  ].map(([factor, bond, check]) => (
                    <tr key={factor} className="hover:bg-slate-50">
                      <td className="p-3 border-b border-slate-100 font-medium text-gray-700">{factor}</td>
                      <td className="p-3 border-b border-slate-100 text-indigo-700 font-medium">{bond}</td>
                      <td className="p-3 border-b border-slate-100 text-gray-500">{check}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7 */}
          <section id="win-lose" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What happens when you win vs. lose</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  You win the bid
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  {[
                    "Sign the contract within the required timeframe",
                    "Provide performance and payment bonds (Quantum Surety issues these fast)",
                    "Bid bond is replaced and becomes void",
                    "No additional cost for the bid bond itself",
                    "Premium paid is for the performance bond",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-700 mb-3">You do not win the bid</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[
                    "Bid bond is returned or voided — no cost to you",
                    "No claim is filed against the bond",
                    "No mark on your surety record",
                    "Certified checks are physically returned",
                    "You can immediately bid on the next project",
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="w-4 h-4 text-gray-400 mt-0.5 shrink-0 font-bold">–</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                If you win but refuse to sign
              </h3>
              <p className="text-red-800 text-sm leading-relaxed">
                If you are awarded the contract and fail to execute it or fail to provide the required
                performance bonds, the project owner makes a claim on your bid bond. The surety pays
                the difference between your bid and the next-lowest bid, up to the bond amount — and
                then seeks reimbursement from you. This also damages your surety relationship and
                bonding capacity going forward.
              </p>
            </div>
          </section>

          {/* Section 8 — FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: "How quickly can I get a bid bond in Texas?",
                  a: "With Quantum Surety, established accounts can receive a bid bond within hours — often the same morning you request it. New applicants who are well-qualified can typically receive a bid bond the same day they apply. We know bid deadlines don't wait, so we prioritize speed.",
                },
                {
                  q: "Can I get a bid bond if I've never bonded before?",
                  a: "Yes. Quantum Surety works with contractors who are new to bonding. We evaluate your personal credit, business financials, and project history. Smaller projects (under $250,000) are often approvable with minimal documentation. We can set up your prequalification so future bonds are faster.",
                },
                {
                  q: "Do I need a separate bond for each bid?",
                  a: "Yes — each bid requires its own bond document specific to that project and owner. However, once you're prequalified with a surety for a certain bonding capacity, getting individual bid bonds is a quick administrative step, not a full underwriting review each time.",
                },
                {
                  q: "What form do I use for a Texas public bid bond?",
                  a: "Each contracting agency specifies the required bond form in the bid documents. Some require their own agency form; others accept standard AIA or ConsensusDocs forms. Some agencies accept electronic submission. Quantum Surety can prepare the bond on the owner's required form — provide the specifications when you request the bond.",
                },
                {
                  q: "Does getting a bid bond guarantee I'll get the performance bond if I win?",
                  a: "A bid bond from Quantum Surety indicates our preliminary willingness to support your project. If you win, we proceed to full underwriting for the performance and payment bonds. For large or complex projects, final approval may require financial statements. For projects within your established bonding capacity, approval at award time is typically seamless.",
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
            <Clock className="w-4 h-4" /> Same-day bid bond approval available
          </div>
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Bid Bond Today</h2>
          <p className="text-indigo-200 mb-6">
            Established accounts: same-day · New applicants: fast review · All Texas public agencies accepted
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <span className="inline-flex items-center justify-center rounded-lg bg-white text-indigo-900 font-semibold px-8 py-3 hover:bg-indigo-50 transition-colors cursor-pointer">
                Start My Application <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
            <Link href="/bonds/bid-bond-texas">
              <span className="inline-flex items-center justify-center rounded-lg border border-white text-white font-semibold px-8 py-3 hover:bg-white/10 transition-colors cursor-pointer">
                Learn About Bid Bonds
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
                href: "/blog/texas-performance-bond-guide-2026",
                title: "Texas Performance Bond Requirements & Cost Guide (2026)",
                tag: "Construction Bonds",
              },
              {
                href: "/blog/texas-contractor-bond-requirements-by-city",
                title: "Texas Contractor Bond Requirements by City (2026)",
                tag: "Texas Contractors",
              },
              {
                href: "/bonds/bid-bond-texas",
                title: "Texas Bid Bond — Same-Day Approval",
                tag: "Product Page",
              },
              {
                href: "/bonds/performance-bond-texas",
                title: "Texas Performance Bond — Instant Quote",
                tag: "Product Page",
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
