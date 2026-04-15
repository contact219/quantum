import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, AlertTriangle, CheckCircle, Clock,
  BookOpen, FileText, Shield, Phone, ChevronRight, RefreshCw
} from "lucide-react";

export default function BlogSB693Renewal() {
  useSEO({
    title: "Texas Notary Bond Renewal Under SB693 2026: What Every Renewing Notary Must Do | Quantum Surety",
    description:
      "Renewing your Texas notary commission in 2026? SB693 added a mandatory education course and journal requirement that now apply to renewals. Here's the exact checklist and what hasn't changed.",
    canonical: "/blog/texas-notary-bond-sb693-renewal-2026",
    ogType: "article",
  });

  const tocItems = [
    { id: "who-needs-to-renew", label: "Who needs to renew in 2026" },
    { id: "what-sb693-adds-for-renewals", label: "What SB693 adds for renewing notaries" },
    { id: "bond-still-required", label: "The $10,000 bond — still required, still $50" },
    { id: "renewal-checklist", label: "Step-by-step renewal checklist" },
    { id: "common-mistakes", label: "Common renewal mistakes under SB693" },
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
            <span>Texas Notary</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
              Texas Notary
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> 7 min read
            </span>
            <span className="text-indigo-300 text-sm">April 9, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Texas Notary Bond Renewal Under SB693 2026: What Every Renewing Notary Must Do
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            If your Texas notary commission expires in 2026, you're renewing under new rules.
            Senate Bill 693 added requirements that apply to <em>renewing</em> notaries — not just new applicants.
            Here's exactly what changed, what the process looks like, and how to avoid the most common
            renewal mistakes.
          </p>
        </div>
      </section>

      {/* TL;DR */}
      <section className="bg-amber-50 border-b border-amber-200 py-5 px-4">
        <div className="max-w-3xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">TL;DR — Renewing in 2026?</p>
            <p className="text-amber-800 text-sm mt-1">
              You must now complete the <strong>mandatory 2-hour SOS education course ($20)</strong> before
              renewing — this applies to existing notaries, not just new applicants. Your{" "}
              <strong>$10,000 bond is still required and still costs $50</strong>. A notary journal is now
              legally required. Everything else in the renewal process is the same.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Table of Contents */}
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
          <section id="who-needs-to-renew" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who needs to renew in 2026</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Texas notary commissions run for four years. If you were commissioned in 2022 — or if your
              commission expires any time during calendar year 2026 — you are renewing under SB693 rules.
              The bill became effective September 1, 2025, and its education requirement applied to all new
              applications and renewals starting January 1, 2026.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Texas Secretary of State does not automatically send renewal reminders, though some
              surety companies and notary associations do. Check your commission certificate for your
              exact expiration date. Your bond and commission must be concurrent — both expire on the
              same date — so renewing your bond and renewing your commission happen together.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <p className="text-indigo-900 text-sm font-medium flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span>
                  You can renew your commission up to <strong>90 days before</strong> your current commission
                  expires. Starting your renewal early gives you time to complete the education course without
                  a gap in your commission.
                </span>
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="what-sb693-adds-for-renewals" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What SB693 adds for renewing notaries
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Senate Bill 693 (89th Legislature, signed May 2025) made Texas notary law significantly more
              rigorous. The changes that directly affect renewing notaries are:
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
                  title: "Mandatory education course — now required for renewals",
                  body: "Before 2026, Texas had no education requirement at all — not for new notaries, not for renewals. SB693 changed this for everyone. All renewing notaries must complete the Texas Secretary of State's online education course before submitting their renewal application. The 2-hour course covers notary duties, correct acknowledgment language, prohibited acts, and the new SB693 requirements. After the course, you take a 20-question assessment requiring a 70% passing score. Each attempt costs $20 (non-refundable), and you have up to three attempts within 90 days. The course is only available through the official SOS Portal — third-party providers do not satisfy the requirement.",
                  note: "Build 2–3 days into your renewal timeline to complete this before your bond and commission expire.",
                },
                {
                  icon: <FileText className="w-5 h-5 text-teal-600" />,
                  title: "Notary journal — legally required going forward",
                  body: "If you were a Texas notary before SB693, keeping a notary journal was strongly encouraged but legally optional. As of January 1, 2026, it's a legal requirement. Upon renewal, you are expected to maintain a journal for all notarial acts and retain completed journals for 10 years from the date of the act. If you have old journals from your previous commission, those records must also be kept — 10 years from each entry date, not from the date your commission expires.",
                  note: "If you did not keep a journal before 2026, start one now. Destruction of records after commission expiry is no longer legal — they must be turned over to your county clerk.",
                },
                {
                  icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
                  title: "New criminal liability for improper notarization",
                  body: "This isn't a renewal-specific requirement, but it's essential context for every practicing notary. SB693 created a new criminal offense for notarizing a document without the signer personally appearing before you. The classification scales with intent and harm. This was previously a civil matter. If you've been handling mail-away signings or other shortcuts that bypass proper personal appearance requirements, stop immediately. Remote Online Notarization (RON) has a separate, legal framework — traditional notarizations require physical presence.",
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
          <section id="bond-still-required" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              The $10,000 bond — still required, still $50
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              One question we hear constantly from renewing notaries: <em>did SB693 change the bond requirement?</em>{" "}
              No. The notary surety bond is completely unchanged.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Texas Notary Bond — Renewal terms in 2026
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Bond amount", value: "$10,000" },
                  { label: "Bond term", value: "4 years (concurrent with new commission)" },
                  { label: "Bond cost", value: "$50 flat" },
                  { label: "Credit check", value: "None required" },
                  { label: "Issuing authority", value: "TDI-licensed surety company" },
                  { label: "Filing", value: "Upload via Texas SOS Portal" },
                ].map((row) => (
                  <div key={row.label} className="bg-white rounded-lg p-4 border border-green-100">
                    <p className="text-xs text-gray-500 mb-1">{row.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              When you renew your commission, your old bond expires with it. You purchase a new $10,000
              bond for the new 4-year term — again at $50, no credit check. The bond must be issued by
              a surety company licensed by the Texas Department of Insurance (TDI), payable to the governor,
              and conditioned on faithful performance of notary duties. None of that changed under SB693.
            </p>
          </section>

          {/* Section 4 */}
          <section id="renewal-checklist" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step-by-step renewal checklist under SB693
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Follow these steps in order. Steps 1 and 2 are new as of 2026; steps 3–6 are unchanged.
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Complete the SOS education course",
                  body: "Log in to the Texas SOS Portal and complete the mandatory 2-hour online education course. Pass the 20-question assessment with a 70% or higher score. Each attempt costs $20. Allow yourself time to complete this before your commission expiry — the course is required before you can submit a renewal application.",
                  tag: "New in 2026",
                  tagColor: "bg-amber-100 text-amber-700",
                },
                {
                  step: "2",
                  title: "Confirm your journal records are compliant",
                  body: "Ensure you have a notary journal and that all notarial acts are recorded. Review SB693's 10-year retention rule. If you have completed journals from your outgoing commission, archive them — do not discard them.",
                  tag: "New in 2026",
                  tagColor: "bg-amber-100 text-amber-700",
                },
                {
                  step: "3",
                  title: "Purchase a new $10,000 notary surety bond",
                  body: "Buy a new 4-year, $10,000 Texas notary bond from a TDI-licensed surety agency. At Quantum Surety, this takes under 5 minutes at $50 flat — instant download, no credit check. Your bond form (Form 2301-B, completed and signed by the surety) will be uploaded during the SOS Portal renewal application.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "4",
                  title: "Submit your renewal via SOS Portal",
                  body: "Log in to the Texas Secretary of State's Notary System and complete your renewal application. Upload your bond form. The name on the bond must match exactly the name on your SOS application. Pay the $21 state application fee to the Secretary of State.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "5",
                  title: "Take oath of office (county clerk)",
                  body: "Once your renewed commission is approved, you must take your oath of office again at your county clerk's office. Some counties charge a small fee. You cannot notarize after your old commission expires until your oath is taken and your new commission is active.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
                },
                {
                  step: "6",
                  title: "Update your notary seal",
                  body: "Your new commission has a new expiration date. Texas notary seals must include your commission expiration date, so your old seal is no longer valid for the new commission term. Order a new seal that reflects the new 4-year expiration.",
                  tag: "Required",
                  tagColor: "bg-indigo-100 text-indigo-700",
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
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Common renewal mistakes under SB693
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The biggest renewal errors we see — and how to avoid each one:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Skipping the education course because you're renewing, not new",
                  body: "The SOS education course is mandatory for all renewals submitted on or after January 1, 2026 — even if you've been a notary for 20 years. There is no grandfathering exception. The SOS Portal will not allow you to submit a renewal application without a passing course completion on file.",
                },
                {
                  title: "Letting the commission lapse before renewing",
                  body: "If your commission expires before your renewal is approved, you lose your authority to notarize. You cannot notarize on an expired commission and then retroactively apply. Start your renewal up to 90 days before expiration — this gives you time for the education course and any processing delays.",
                },
                {
                  title: "Using the same bond for a new commission term",
                  body: "A notary surety bond is issued for a specific 4-year term, concurrent with your commission. When your commission expires, your bond expires with it. You need a new bond for each commission term. Attempting to file an existing bond for a new term will be rejected by the SOS.",
                },
                {
                  title: "Name mismatch between bond and SOS application",
                  body: "The name on your surety bond must exactly match the name on your SOS renewal application — including middle names, suffixes, and any legal name changes since your last commission. A mismatch is the single most common reason for renewal delays. If your legal name has changed, update your SOS records first.",
                },
                {
                  title: "Discarding old journals when commission expires",
                  body: "Under SB693, notary journals must be retained for 10 years from the date of each notarial act — not from when your commission expires. If you stop renewing, completed journals must be delivered to your county clerk. Do not throw them away.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 — FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: "Do I have to take the SOS education course even though I've been a notary for years?",
                  a: "Yes. SB693 does not include an experience exemption. The mandatory 2-hour education course and 20-question assessment apply to all renewals submitted on or after January 1, 2026, regardless of how many previous commissions you've held. The Texas Legislature's intent was to ensure all practicing notaries — new and existing — are familiar with the updated statutes and proper procedures.",
                },
                {
                  q: "Can I notarize during the gap while my renewal is being processed?",
                  a: "Only if your current commission is still active. You can submit your renewal application before your commission expires and continue notarizing on your existing commission while the renewal is pending. If your commission lapses before the renewal is approved, you must stop notarizing until your new commission is issued and your oath of office is taken.",
                },
                {
                  q: "Does my old notary bond cover me until the renewal is approved?",
                  a: "Your existing bond remains valid until your current commission expires — both run concurrent. For the new commission term, you need a new bond. Purchase the new bond when you submit your renewal application. The new bond's effective date should align with your new commission start date.",
                },
                {
                  q: "I changed my name since my last commission. What do I need to do before renewing?",
                  a: "Update your legal name with the Texas Secretary of State before purchasing your renewal bond. Your surety bond will be issued in the name you provide — if that name doesn't match SOS records, your application will be rejected. Contact the SOS Notary Unit to process a name change first, then purchase a bond in the updated name.",
                },
                {
                  q: "Is an E&O policy required for renewal under SB693?",
                  a: "No. Errors & Omissions insurance is not required by Texas law for any notary — new or renewing. However, it is strongly recommended, especially if you're a mobile notary, notary signing agent, or handle real estate or loan documents. E&O protects you personally from lawsuit costs; the $10,000 bond only protects the public. You can add E&O alongside your renewal bond at checkout with Quantum Surety.",
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900 text-sm leading-snug flex items-start gap-2">
                      <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      {item.q}
                    </p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </article>

        {/* CTA Card */}
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-5">
            <Clock className="w-4 h-4" /> Instant download — available 24/7
          </div>
          <h2 className="text-2xl font-bold mb-2">Get Your Renewal Bond — $50</h2>
          <p className="text-indigo-200 mb-6">
            $10,000 bond · 4-year term · No credit check · SB693 compliant · Instant PDF · Add E&O at checkout
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
                href: "/blog/texas-notary-bond-sb693-2026-requirements",
                title: "Texas Notary Bond 2026: What SB693 Changes for New & Renewing Notaries",
                tag: "SB693 Guide",
              },
              {
                href: "/blog/texas-notary-bond-cost-2026",
                title: "How Much Does a Texas Notary Bond Cost in 2026?",
                tag: "Cost Breakdown",
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
