import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, AlertTriangle, CheckCircle, Clock,
  BookOpen, FileText, Shield, Phone, ChevronRight
} from "lucide-react";

export default function BlogSB693() {
  useSEO({
    title: "Texas Notary Bond 2026: What SB693 Changes for New & Renewing Notaries | Quantum Surety",
    description:
      "Senate Bill 693 took effect Jan 1, 2026 — mandatory 2-hour education, new criminal penalties, 10-year record retention. Here's exactly what changes, what stays the same, and how to get your notary bond today.",
    canonical: "/blog/texas-notary-bond-sb693-2026-requirements",
    ogType: "article",
  });

  const tocItems = [
    { id: "what-is-sb693", label: "What is SB693?" },
    { id: "what-changed", label: "What changed on January 1, 2026" },
    { id: "bond-unchanged", label: "What did NOT change (the bond)" },
    { id: "how-to-apply", label: "How to apply step-by-step" },
    { id: "eo-insurance", label: "Do you need E&O insurance too?" },
    { id: "get-your-bond", label: "Get your bond today" },
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
            <span>Texas Notary</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
              Texas Notary
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> 7 min read
            </span>
            <span className="text-indigo-300 text-sm">March 15, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Texas Notary Bond Requirements 2026: What SB693 Changes for New and Renewing Notaries
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Senate Bill 693 became law on September 1, 2025, with key requirements kicking in January 1, 2026.
            If you're a Texas notary — or about to become one — here's what changed, what didn't, and what
            you need to do right now.
          </p>
        </div>
      </section>

      {/* Quick answer banner */}
      <section className="bg-amber-50 border-b border-amber-200 py-5 px-4">
        <div className="max-w-3xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">TL;DR — The short version</p>
            <p className="text-amber-800 text-sm mt-1">
              Your <strong>notary bond is still $10,000 for 4 years, still costs $50</strong>, and is still
              required. What changed: new notaries and renewing notaries must now complete a mandatory 2-hour
              online education course from the Texas Secretary of State ($20 fee) before applying. Plus new
              criminal penalties and a 10-year journal retention rule.
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
          <section id="what-is-sb693" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Texas SB693?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Texas Senate Bill 693 (89th Legislature, 2025) is a comprehensive update to the Texas notary
              public statutes. Governor Abbott signed it into law in May 2025, with an effective date of
              September 1, 2025. The most significant consumer-facing changes — particularly the mandatory
              education requirement — took effect <strong>January 1, 2026</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The bill was designed to professionalize Texas notaries and reduce fraud. Texas previously had
              no education or testing requirement to become a notary — one of only a handful of states with
              that gap. SB693 closes it.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The Texas Secretary of State is updating the Texas Administrative Code (TAC) to implement the
              new education standards and SOS Portal submission process changes that SB693 requires.
            </p>
          </section>

          {/* Section 2 */}
          <section id="what-changed" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What changed on January 1, 2026</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Here are the four major changes from SB693 that affect Texas notaries:
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
                  title: "1. Mandatory education before applying",
                  body: "All new notary applicants and renewing notaries must now complete an online education course from the Texas Secretary of State. The course covers notary duties, legal requirements, and proper notarization procedures. A 20-question assessment follows, requiring a minimum score of 70% to pass. You have up to three attempts within 90 days — each attempt costs a $20 non-refundable fee paid to the SOS. The course itself is provided exclusively through the SOS Portal; third-party courses do not satisfy the requirement.",
                  note: "Previously, Texas had zero education requirements. This is a significant change.",
                },
                {
                  icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
                  title: "2. New criminal offense for improper notarization",
                  body: "SB693 creates a new criminal offense for any notary who notarizes a document without the signer personally appearing before them. The classification of the offense scales with intent and harm. This is the most significant change for practicing notaries — the legal exposure for shortcut practices (common in remote or mail-away signings that bypass RON rules) is now a criminal matter, not just a civil one.",
                  note: "This applies to traditional notaries. Remote Online Notarization (RON) has a separate, legal framework.",
                },
                {
                  icon: <FileText className="w-5 h-5 text-teal-600" />,
                  title: "3. Journal is now required — 10-year retention",
                  body: "A notary journal (record book) is now legally required for all Texas notaries, and completed journal entries must be retained for 10 years from the date of the notarial act. Previously, Texas notaries were encouraged but not required to keep a journal. If you're renewing, your old records must also now be kept for the full 10-year window going forward. If you do not renew your commission, old records must be turned over to your county clerk.",
                  note: "Journal destruction is no longer legal after your commission expires — records go to the county clerk.",
                },
                {
                  icon: <Shield className="w-5 h-5 text-green-600" />,
                  title: "4. Expanded Remote Online Notarization (RON)",
                  body: "SB693 expands and clarifies the legal framework for Remote Online Notarization in Texas. RON-authorized notaries can perform notarizations via audiovisual technology without the signer being physically present. RON requires separate authorization from the SOS after your traditional commission is granted, plus an approved RON platform. The $10,000 surety bond requirement applies to all notaries regardless of RON status.",
                  note: null,
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed ml-8 mb-3">{item.body}</p>
                  {item.note && (
                    <div className="ml-8 bg-amber-50 border-l-2 border-amber-300 pl-3 py-2 rounded-r">
                      <p className="text-amber-800 text-xs font-medium">{item.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section id="bond-unchanged" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What did NOT change — the notary bond
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              With all the attention SB693 is getting, one important thing is worth repeating clearly:
              <strong> the notary bond requirement is completely unchanged.</strong>
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Texas Notary Bond — Still the same in 2026
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Bond amount", value: "$10,000" },
                  { label: "Bond term", value: "4 years (concurrent with commission)" },
                  { label: "Bond cost", value: "$50 flat — no credit check" },
                  { label: "Issuing authority", value: "TDI-licensed surety company" },
                  { label: "Filing location", value: "Texas SOS Portal Notary System" },
                  { label: "Credit check required", value: "No" },
                ].map((row) => (
                  <div key={row.label} className="bg-white rounded-lg p-4 border border-green-100">
                    <p className="text-xs text-gray-500 mb-1">{row.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              The bond must still be issued by a surety company licensed to do business in Texas as a surety.
              It must be approved by the Office of the Texas Secretary of State, payable to the governor,
              and conditioned on faithful performance of notary duties. None of that changed.
            </p>
          </section>

          {/* Section 4 */}
          <section id="how-to-apply" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to become a Texas notary in 2026 — step by step
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Here is the complete process under SB693 rules, in order:
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Complete the SOS Education Course",
                  body: "Log in to the Texas SOS Portal and complete the mandatory education course. This covers notary law, duties, and proper practices. After the course, pass the 20-question assessment with a 70%+ score. Each attempt costs $20 (non-refundable). You have up to 3 attempts within 90 days.",
                  tag: "New in 2026",
                  tagColor: "bg-amber-100 text-amber-700",
                },
                {
                  step: "2",
                  title: "Get your $10,000 notary surety bond",
                  body: "Purchase a 4-year, $10,000 Texas notary bond from a TDI-licensed surety company. At Quantum Surety, this takes under 5 minutes and costs $50 flat — no credit check, instant download.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "3",
                  title: "Submit your application via SOS Portal",
                  body: "Log in to the Texas SOS Portal Notary System and submit your application. You'll upload your completed bond form (Form 2301-B, completed and signed by the surety company) as part of the application. The applicant name on the bond must exactly match the name on the SOS application.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "4",
                  title: "Pay the state application fee",
                  body: "The Texas Secretary of State charges a $21 application fee. This is separate from your bond premium and is paid directly to the state through the SOS Portal.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "5",
                  title: "Receive your commission and take oath",
                  body: "Once approved, you'll receive your notary commission. You then need to take your oath of office, which is administered by your county clerk. Some counties charge a small fee for this.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "6",
                  title: "Purchase your notary seal and journal",
                  body: "Your notary seal must meet Texas specifications. Your journal (record book) is now legally required under SB693. Keep all records for 10 years from the date of each notarial act.",
                  tag: "Now required",
                  tagColor: "bg-amber-100 text-amber-700",
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

          {/* Section 5 */}
          <section id="eo-insurance" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Do you need E&O insurance in addition to the bond?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The notary bond protects the <em>public</em> — not you. If a claim is filed against your bond
              (because of an error, omission, or misconduct), the surety company pays the claimant up to
              $10,000. Then they come to <em>you</em> for reimbursement.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Errors & Omissions (E&O) insurance protects <em>you personally</em> against lawsuits for
              unintentional mistakes — missed details, incorrect acknowledgments, improper procedure. For
              notaries who handle high volumes, mobile signings, loan documents, or real estate closings,
              E&O coverage is strongly recommended.
            </p>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notary Bond ($50/4 yr)</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[
                      "Required by Texas law",
                      "Protects the public",
                      "You reimburse the surety if a claim pays",
                      "$10,000 coverage",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">E&O Insurance (add-on)</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[
                      "Strongly recommended",
                      "Protects you from lawsuits",
                      "Covers legal defense costs",
                      "$5,000–$100,000+ coverage available",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Quantum Surety lets you add E&O insurance at checkout alongside your notary bond — one
              transaction, one download, everything you need to start notarizing legally.
            </p>
          </section>

          {/* Section 6 — CTA */}
          <section id="get-your-bond" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get your Texas notary bond today</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Quantum Surety is a TDI-licensed Texas surety bond agency. We issue Texas notary bonds
              for $50 — instant download, no credit check, 24/7 availability. The bond is SB693-compliant
              and includes step-by-step instructions for uploading to the Texas SOS Portal Notary System.
            </p>
          </section>
        </article>

        {/* Final CTA card */}
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-5">
            <Clock className="w-4 h-4" /> Instant download — available 24/7
          </div>
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Notary Bond — $50</h2>
          <p className="text-indigo-200 mb-6">
            $10,000 bond · 4-year term · No credit check · SB693 compliant · Instant PDF
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: "/blog/texas-notary-bond-cost-2026",
                title: "How Much Does a Texas Notary Bond Cost in 2026?",
                tag: "Texas Notary",
              },
              {
                href: "/bonds/notary-bond-texas",
                title: "Texas Notary Bond — $50 Instant Online",
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
