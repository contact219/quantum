import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { CheckCircle, ArrowRight, Clock, ChevronRight, AlertTriangle, FileText } from "lucide-react";

export default function BlogHowToBecomeTexasNotary() {
  useSEO({
    title: "How to Become a Texas Notary Public in 2026 (Complete Guide) | Quantum Surety",
    description: "Step-by-step guide to becoming a Texas notary public in 2026. Eligibility, SB693 education requirement, bond, oath of office, and how long it takes. Updated for the latest Texas Secretary of State rules.",
    canonical: "/blog/how-to-become-texas-notary-2026",
    ogType: "article",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Become a Texas Notary Public in 2026",
    "description": "Step-by-step guide to obtaining a Texas notary commission in 2026 under SB693.",
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Meet eligibility requirements", "text": "Be at least 18 years old, a Texas resident, able to read and write English, and have no felony conviction or certain misdemeanors." },
      { "@type": "HowToStep", "position": 2, "name": "Complete SB693 education", "text": "Take the mandatory 2-hour notary education course required by Senate Bill 693 (effective January 1, 2026)." },
      { "@type": "HowToStep", "position": 3, "name": "Obtain your $10,000 notary bond", "text": "Purchase a $10,000 Texas notary surety bond for $50 flat from Quantum Surety — instant PDF delivery." },
      { "@type": "HowToStep", "position": 4, "name": "Submit your application to the Texas SOS", "text": "Apply online at sos.texas.gov with your bond certificate, education completion, and $21 application fee." },
      { "@type": "HowToStep", "position": 5, "name": "Take your oath of office", "text": "After your commission is issued, take your oath before a notary or county clerk. Your commission is not active until the oath is on file." },
    ],
    "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  }, "ld-json-HowTo");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How long does it take to become a Texas notary?", "acceptedAnswer": { "@type": "Answer", "text": "The Texas Secretary of State typically processes notary applications within 2–4 weeks of receiving a complete application. Total time from starting the process to active commission is usually 3–6 weeks." } },
      { "@type": "Question", "name": "How much does it cost to become a Texas notary?", "acceptedAnswer": { "@type": "Answer", "text": "The minimum cost is $71: $50 for the notary bond (Quantum Surety), $21 SOS application fee. Add ~$20 for the required SB693 education course. Optional E&O insurance runs $25–$75/year extra." } },
      { "@type": "Question", "name": "Can a convicted felon become a Texas notary?", "acceptedAnswer": { "@type": "Answer", "text": "No. Texas law disqualifies anyone convicted of a felony or a crime involving moral turpitude from serving as a notary public." } },
      { "@type": "Question", "name": "Do I need to be a US citizen to become a Texas notary?", "acceptedAnswer": { "@type": "Answer", "text": "No. You must be a Texas resident, but US citizenship is not required. Legal permanent residents and other authorized residents may apply." } },
    ],
  }, "ld-json-FAQ");

  const steps = [
    {
      num: "1",
      title: "Meet the Eligibility Requirements",
      body: [
        "Before applying, confirm you meet every Texas notary eligibility requirement:",
        "• Be at least 18 years old",
        "• Be a resident of Texas",
        "• Be able to read and write English",
        "• Have no felony conviction",
        "• Have no conviction for a crime involving moral turpitude",
        "• Not currently have a notary commission that has been revoked",
        "You do not need to be a US citizen, and there is no educational or professional requirement beyond the SB693 course (see Step 2).",
      ],
    },
    {
      num: "2",
      title: "Complete the SB693 Notary Education Course",
      body: [
        "Senate Bill 693, effective January 1, 2026, added a mandatory education requirement for all new Texas notary applicants. You must complete a state-approved 2-hour notary education course before submitting your application.",
        "The course costs approximately $20–$25 and is available from multiple state-approved providers online. Upon completion, you receive a certificate of completion that you include with your application.",
        "Renewing notaries commissioned before January 1, 2026 must also complete the education course on their first renewal under the new law.",
      ],
    },
    {
      num: "3",
      title: "Obtain Your Texas Notary Surety Bond",
      body: [
        "Texas Government Code § 406.010 requires every notary public to obtain a $10,000 surety bond before the Secretary of State will issue a commission. The bond protects the public — not you — if you make an error in your official capacity.",
        "From Quantum Surety, the bond costs $50 flat for the full 4-year commission term. No credit check, no annual renewal fees, and your bond certificate is delivered by email as a PDF within minutes.",
        "Keep your bond certificate — you'll need it for your SOS application.",
      ],
    },
    {
      num: "4",
      title: "Submit Your Application to the Texas Secretary of State",
      body: [
        "Apply online at sos.texas.gov/notary. You'll need:",
        "• Your completed bond certificate (PDF from your bond provider)",
        "• Your SB693 education completion certificate",
        "• The $21 application fee (credit/debit card)",
        "• Basic personal information (name, address, county)",
        "The SOS typically processes applications within 2–4 weeks. You'll receive your commission certificate by mail. Do not perform any notarial acts until you have completed Step 5.",
      ],
    },
    {
      num: "5",
      title: "Take Your Oath of Office",
      body: [
        "After receiving your commission certificate, you must take your official oath of office. In Texas, you take the oath before another notary public or the county clerk in your county of residence.",
        "The oath form is included with your commission packet from the SOS. Your commission does not become active until the signed oath is on file — either returned to the SOS or filed with your county clerk, depending on your county's requirements.",
        "Once your oath is filed, you are an active Texas notary public and may begin performing notarial acts.",
      ],
    },
  ];

  const faqs = [
    { q: "How long does it take to become a Texas notary?", a: "The Texas Secretary of State typically processes notary applications within 2–4 weeks. Total time from starting the process to an active commission — including education, bonding, and oath — is usually 3–6 weeks." },
    { q: "How much does it cost to become a Texas notary?", a: "Minimum cost is $91: $50 for the notary bond, $21 SOS application fee, ~$20 for the SB693 education course. Optional E&O insurance (recommended for signing agents and mobile notaries) runs $25–$75/year extra." },
    { q: "How long is a Texas notary commission?", a: "Texas notary commissions last 4 years. You must renew before your commission expires to maintain continuous authority to notarize. Quantum Surety sends renewal reminders automatically." },
    { q: "Can I notarize documents for family members in Texas?", a: "Technically yes, but it's strongly discouraged. Texas law prohibits notarizing any document in which you have a direct financial or beneficial interest. Notarizing for close family members creates appearance-of-interest problems and most professional guidelines advise against it." },
    { q: "Do I need E&O insurance as a Texas notary?", a: "E&O (Errors & Omissions) insurance is not required by Texas law, but it's highly recommended for notaries who perform high-volume or complex notarizations — particularly notary signing agents working on real estate closings. Your $50 bond protects the public; E&O protects you if you make an honest mistake." },
    { q: "What is the difference between a notary bond and E&O insurance?", a: "The $10,000 notary bond is required by law and protects the public from harm caused by notary misconduct or negligence — claims are paid by the surety, but you must reimburse the surety. E&O insurance is optional and protects you from the cost of honest mistakes. Many active notaries carry both." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Texas Notary</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Notary</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 9 min read</span>
            <span className="text-indigo-300 text-sm">May 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            How to Become a Texas Notary Public in 2026 (Complete Guide)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Updated for Senate Bill 693 — the mandatory education and journal requirements that took effect January 1, 2026. Here's every step from eligibility to your first notarial act.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Quick cost box */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 mb-10 flex flex-wrap gap-6">
          {[
            { label: "Notary bond", value: "$50 flat" },
            { label: "SOS application fee", value: "$21" },
            { label: "SB693 education", value: "~$20" },
            { label: "Commission term", value: "4 years" },
          ].map((i) => (
            <div key={i.label}>
              <p className="text-xs text-gray-500">{i.label}</p>
              <p className="font-bold text-gray-900">{i.value}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-10 mb-14">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-5">
              <div className="shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{s.num}</div>
              <div className="pt-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                {s.body.map((line, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-2 text-sm">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SB693 callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">SB693: What Changed on January 1, 2026</h3>
              <ul className="text-sm text-gray-700 space-y-1 leading-relaxed">
                <li>• <strong>Mandatory education course</strong> (2 hours) required before first commission and first renewal</li>
                <li>• <strong>Notary journal required</strong> for all notarial acts (must be kept 10 years)</li>
                <li>• <strong>Increased criminal penalties</strong> for unauthorized practice and willful misconduct</li>
                <li>• <strong>Bond requirement unchanged</strong> — still $10,000, still $50 from Quantum Surety</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center mb-12">
          <FileText className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Notary Bond — $50</h2>
          <p className="text-indigo-200 mb-5">Instant PDF certificate, 4-year term, no credit check, SB693 compliant. Takes 2 minutes.</p>
          <a href="/get-bond?type=notary">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Get My Notary Bond <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-12">
          {faqs.map((f) => (
            <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">{f.q}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-gray-700 text-sm leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Related */}
        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/blog/texas-notary-bond-sb693-2026-requirements", label: "SB693 Requirements: Full Guide" },
              { href: "/blog/texas-notary-bond-cost-2026", label: "Texas Notary Bond Cost 2026" },
              { href: "/blog/texas-notary-bond-sb693-renewal-2026", label: "Notary Bond Renewal Under SB693" },
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond Page" },
            ].map((r) => (
              <Link key={r.href} href={r.href}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{r.label}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
