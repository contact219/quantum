import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight, Clock, ChevronRight, CheckCircle, Shield } from "lucide-react";

export default function BlogNotaryBondVsEO() {
  useSEO({
    title: "Texas Notary Bond vs E&O Insurance: What's the Difference? (2026) | Quantum Surety",
    description: "Texas notary bond vs E&O insurance — what each covers, which is required by law, who needs both, and how much each costs. Complete comparison for Texas notaries in 2026.",
    canonical: "/blog/texas-notary-bond-vs-eo-insurance",
    ogType: "article",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Texas Notary Bond vs E&O Insurance: What's the Difference?",
    "description": "Comparison of Texas notary surety bonds vs E&O (Errors & Omissions) insurance — required by law vs optional, who is protected, and when notaries should carry both.",
    "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  }, "ld-json-Article");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "Is a notary bond required in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Texas Government Code § 406.010 requires every notary public to obtain a $10,000 surety bond before the Texas Secretary of State will issue a notary commission. The bond is not optional." } },
      { "@type": "Question", "name": "Is E&O insurance required for Texas notaries?", "acceptedAnswer": { "@type": "Answer", "text": "No. E&O (Errors & Omissions) insurance is not required by Texas law. It is highly recommended for notaries who perform high-volume or high-value notarizations — particularly notary signing agents working on real estate closings — but it is purely optional." } },
    ],
  }, "ld-json-FAQ");

  const comparison = [
    { factor: "Required by Texas law?", bond: "Yes — §406.010 Gov. Code", eo: "No — optional" },
    { factor: "What it protects", bond: "The public / claimants (not you)", eo: "You (the notary) from liability" },
    { factor: "Who can make a claim", bond: "Anyone harmed by your notarial act", eo: "You, against your own mistakes" },
    { factor: "Must you repay claims?", bond: "Yes — surety is reimbursed by you", eo: "No — insurer absorbs the loss" },
    { factor: "Coverage amount", bond: "$10,000", eo: "$10,000–$100,000+" },
    { factor: "Typical cost", bond: "$50 for 4 years (Quantum Surety)", eo: "$25–$75/year" },
    { factor: "Credit check?", bond: "None required", eo: "None required" },
    { factor: "Who needs it most", bond: "All commissioned Texas notaries", eo: "Notary signing agents, high-volume notaries" },
  ];

  const scenarios = [
    { scenario: "You stamp a document without verifying the signer's ID, and it's used in fraud", bond: "Claimant may file a claim against your $10,000 bond. Surety investigates and pays if valid — you repay the surety.", eo: "Likely not covered — E&O covers honest mistakes, not willful negligence or fraud." },
    { scenario: "You make an honest error on a loan document that delays a closing and costs the title company $3,000", bond: "No automatic coverage — the $10K bond is for misconduct, not clerical errors.", eo: "E&O covers this — insurer pays the title company's losses without you repaying." },
    { scenario: "A notary signing agent gets sued over an alleged error in a real estate closing", bond: "Limited protection — bond defends against misconduct, not litigation defense costs.", eo: "E&O covers defense costs and settlement — often the most valuable protection for signing agents." },
  ];

  const faqs = [
    { q: "Is a notary bond required in Texas?", a: "Yes. Texas Government Code § 406.010 requires every notary public to obtain a $10,000 surety bond before the Texas Secretary of State will issue a commission. No bond, no commission." },
    { q: "Is E&O insurance required for Texas notaries?", a: "No. E&O insurance is not required by Texas law for notaries public. It is highly recommended for notary signing agents and notaries who perform high-volume or complex notarizations, but it's purely optional." },
    { q: "Does the $10,000 notary bond protect me personally?", a: "No — and this is the most misunderstood aspect of notary bonds. Your $10,000 bond protects the public from harm caused by your notarial acts. If someone files a claim and the surety pays, you're obligated to reimburse the surety. The bond does not protect your personal finances." },
    { q: "How much does E&O insurance cost for a Texas notary?", a: "Notary E&O insurance typically costs $25–$75 per year for $25,000–$100,000 in coverage. Some plans include legal defense costs. Many notary signing agents buy a combined plan that includes both the bond and E&O in one policy for around $60–$90/year total." },
    { q: "Can I get my notary bond and E&O insurance from the same provider?", a: "Yes. Many surety bond agencies (including through our partners) offer combined notary bond + E&O insurance packages. The bond satisfies the Texas SOS legal requirement, while the E&O adds personal protection for your work." },
    { q: "Who most needs E&O insurance as a Texas notary?", a: "Notary signing agents (NSAs) working on real estate loan closings — mortgage signings, refinances, HELOC closings. These transactions involve large dollar amounts and multiple parties, creating significant liability exposure for errors. E&O is standard practice for professional NSAs." },
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
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 7 min read</span>
            <span className="text-indigo-300 text-sm">May 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Texas Notary Bond vs E&amp;O Insurance: What's the Difference?
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Your $10,000 notary bond is required by law — but it protects the public, not you. E&amp;O insurance is optional, but it's what actually protects you personally. Here's how they work and when you need both.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-gray-500 mb-1">Notary bond cost</p>
            <p className="font-bold text-gray-900">$50 flat / 4 years</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">E&O insurance cost</p>
            <p className="font-bold text-gray-900">$25–$75 / year</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Bond required by law?</p>
            <p className="font-bold text-green-700">Yes — §406.010</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">E&O required by law?</p>
            <p className="font-bold text-gray-600">No — optional</p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Complete Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold">Factor</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Notary Bond</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">E&amp;O Insurance</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.factor} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 font-medium text-gray-900">{row.factor}</td>
                    <td className="p-3 border border-gray-200 text-gray-700">{row.bond}</td>
                    <td className="p-3 border border-gray-200 text-gray-700">{row.eo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How Each Responds to Real Scenarios</h2>
          <p className="text-gray-600 text-sm mb-5">The same notary mistake can have different outcomes depending on which coverage you have:</p>
          <div className="space-y-5">
            {scenarios.map((s) => (
              <div key={s.scenario} className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{s.scenario}</p>
                </div>
                <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Notary Bond</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{s.bond}</p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-teal-600 uppercase mb-2">E&amp;O Insurance</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{s.eo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Should Carry Both?</h2>
          <div className="space-y-3">
            {[
              { who: "Notary Signing Agents (NSAs)", why: "Work on loan documents where errors can delay closings and cost title companies thousands. E&O is considered standard practice in the NSA industry." },
              { who: "Mobile notaries with high volume", why: "More transactions = more exposure. E&O provides a legal defense fund if a client sues over an alleged mistake, even a frivolous one." },
              { who: "Notaries handling estate documents", why: "Wills, trusts, and powers of attorney are high-stakes. A mistake could be challenged years later." },
              { who: "Notaries working for law firms or title companies", why: "Employer may require it as a condition of employment or contract." },
            ].map((r) => (
              <div key={r.who} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.who}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{r.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center">
          <Shield className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Get Your Required Texas Notary Bond</h2>
          <p className="text-indigo-200 mb-5">$50 flat, 4-year term, $10,000 coverage, SB693 compliant. Instant PDF — satisfies the Texas Secretary of State bond requirement.</p>
          <a href="/get-bond?type=notary">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Get My Notary Bond — $50 <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{f.q}
                  </p>
                </div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/blog/how-to-become-texas-notary-2026", label: "How to Become a Texas Notary (2026)" },
              { href: "/blog/texas-notary-bond-sb693-2026-requirements", label: "SB693 Notary Requirements Guide" },
              { href: "/blog/texas-notary-bond-cost-2026", label: "Texas Notary Bond Cost 2026" },
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond — Get Yours Now" },
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
