import { Link } from "wouter";
import { BlogAuthor } from "@/components/BlogAuthor";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight, Clock, ChevronRight, Shield, CheckCircle } from "lucide-react";

export default function BlogWhatIsASuretyBond() {
  useSEO({
    title: "What Is a Surety Bond? Texas Plain-Language Guide (2026) | Quantum Surety",
    description: "A surety bond is a 3-party guarantee — not insurance. Learn what a surety bond is, how it works, who needs one in Texas, and what it costs. Plain-language guide with examples.",
    canonical: "/blog/what-is-a-surety-bond-texas",
    ogType: "article",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is a Surety Bond? Texas Plain-Language Guide",
    "description": "Plain-language explanation of surety bonds: how they work, the three parties involved, how they differ from insurance, and when you need one in Texas.",
    "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  }, "ld-json-Article");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is a surety bond in simple terms?", "acceptedAnswer": { "@type": "Answer", "text": "A surety bond is a written promise from a licensed insurance company (the surety) that you will fulfill a specific obligation — usually a legal or contractual requirement. If you fail, the surety pays claims up to the bond amount, and you're obligated to repay the surety." } },
      { "@type": "Question", "name": "Is a surety bond the same as insurance?", "acceptedAnswer": { "@type": "Answer", "text": "No. Insurance protects you (the policyholder) against unexpected losses. A surety bond protects the person requiring the bond (the obligee) against your failure to perform. If a bond claim is paid, you owe the money back to the surety." } },
      { "@type": "Question", "name": "Who are the three parties in a surety bond?", "acceptedAnswer": { "@type": "Answer", "text": "1) Principal — the person or business required to obtain the bond (you). 2) Obligee — the party requiring the bond (a government agency, project owner, or licensing authority). 3) Surety — the licensed insurance company that issues the bond and pays valid claims." } },
    ],
  }, "ld-json-FAQ");

  const bondTypes = [
    { type: "License & Permit Bonds", who: "Contractors, auto dealers, notaries, mortgage brokers", obligee: "TDLR, TxDMV, TxSOS, TABC, cities", example: "$10,000 notary bond; $50,000 GDN dealer bond" },
    { type: "Construction Bonds", who: "General contractors and subcontractors", obligee: "Project owners, public agencies", example: "Bid bond, performance bond, payment bond" },
    { type: "Court / Probate Bonds", who: "Executors, guardians, trustees, court-appointed receivers", obligee: "Texas courts", example: "Executor bond, guardian bond" },
    { type: "Fidelity Bonds", who: "Employers protecting against employee theft", obligee: "The employer (business owner)", example: "Janitorial bond, dishonesty bond" },
  ];

  const faqs = [
    { q: "What is a surety bond in simple terms?", a: "A surety bond is a written promise from a licensed insurance company (the surety) that you will fulfill a specific obligation. If you fail, the surety pays the injured party up to the bond amount — and you're then obligated to repay the surety." },
    { q: "Is a surety bond the same as insurance?", a: "No, and this is the most important distinction. Insurance protects you from unexpected losses (fire, accident, liability). A surety bond protects the party requiring it (the obligee) from your failure to perform. If a bond claim is paid, you owe that money back to the surety — it's more like a credit facility than insurance." },
    { q: "How much does a surety bond cost in Texas?", a: "Bond premiums are a percentage of the total bond amount. Simple license bonds (notary, contractor) typically cost $50–$300/year. Construction bonds run 0.5%–3% of the contract value. The exact rate depends on the bond type, your credit score, and the bond amount." },
    { q: "What happens if a claim is filed against my bond?", a: "The surety investigates the claim. If valid, the surety pays the claimant up to the bond's penal sum. You are then legally obligated to reimburse the surety. Unpaid indemnity claims can result in legal action and affect your ability to get bonded in the future." },
    { q: "Do I need a surety bond or liability insurance?", a: "Often both. A surety bond satisfies a legal or licensing requirement (the law says you must have it). Liability insurance protects your business from accidents, property damage, and negligence claims. Most contractors carry both a license bond and general liability insurance." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Surety Basics</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Surety Basics</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 6 min read</span>
            <span className="text-indigo-300 text-sm">May 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            What Is a Surety Bond? Texas Plain-Language Guide
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            A surety bond is not insurance — it's a legally binding guarantee backed by a licensed carrier. Here's what it is, how it works, and when Texas law requires you to have one.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The 30-Second Explanation</h2>
          <p className="text-gray-700 leading-relaxed mb-4">A surety bond is a three-party contract between:</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { party: "Principal", who: "You", desc: "The business or individual required to obtain the bond as a condition of a license, permit, or contract." },
              { party: "Obligee", who: "The requirer", desc: "The government agency, project owner, or licensing authority that requires the bond as protection." },
              { party: "Surety", who: "The insurer", desc: "The licensed insurance company (like RLI Insurance) that issues the bond and pays valid claims." },
            ].map((p) => (
              <div key={p.party} className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs font-bold uppercase text-indigo-600 mb-1">{p.party}</p>
                <p className="font-semibold text-gray-900 text-sm mb-2">{p.who}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">The bond says: <em>"If the principal fails to meet their obligation, the surety will pay the obligee up to the bond amount."</em> The principal must then repay the surety — which is why a bond is more like a credit guarantee than insurance.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Surety Bond vs. Insurance: Key Difference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-indigo-50"><th className="text-left p-3 border border-gray-200 font-semibold">Factor</th><th className="text-left p-3 border border-gray-200 font-semibold">Surety Bond</th><th className="text-left p-3 border border-gray-200 font-semibold">Insurance</th></tr></thead>
              <tbody>
                {[
                  ["Who is protected", "The obligee (third party)", "You (the policyholder)"],
                  ["Who pays if claimed", "Surety pays, you repay surety", "Insurer pays, no repayment"],
                  ["Premium reflects", "Your creditworthiness & track record", "Statistical risk of loss"],
                  ["Required by", "Law or contract", "Business need or lender"],
                  ["Texas example", "$10,000 notary bond ($50/yr)", "General liability ($500–$2,000/yr)"],
                ].map(([f, b, i]) => (
                  <tr key={f} className="border-b border-gray-100">
                    <td className="p-3 border border-gray-200 font-medium text-gray-900">{f}</td>
                    <td className="p-3 border border-gray-200 text-gray-700">{b}</td>
                    <td className="p-3 border border-gray-200 text-gray-700">{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Surety Bonds in Texas</h2>
          <div className="space-y-4">
            {bondTypes.map((b) => (
              <div key={b.type} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{b.type}</p>
                    <p className="text-xs text-gray-500 mb-1"><strong>Who needs it:</strong> {b.who}</p>
                    <p className="text-xs text-gray-500 mb-1"><strong>Required by:</strong> {b.obligee}</p>
                    <p className="text-xs text-indigo-700"><strong>Examples:</strong> {b.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Much Does a Texas Surety Bond Cost?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Bond premiums are a small percentage of the total bond amount. Because bonds require repayment if claimed, the surety evaluates your creditworthiness — not just statistical risk — to set your rate.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { type: "Notary Bond ($10,000)", cost: "$50 flat / 4 years", note: "No credit check" },
              { type: "GDN Dealer Bond ($50,000)", cost: "$100–$300/yr", note: "Credit-based" },
              { type: "Contractor License Bond ($10K–$25K)", cost: "$75–$300/yr", note: "Credit-based" },
              { type: "Construction Bond ($500K contract)", cost: "$2,500–$15,000", note: "Full underwriting" },
            ].map((r) => (
              <div key={r.type} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">{r.type}</p>
                <p className="text-indigo-700 font-bold">{r.cost}</p>
                <p className="text-xs text-gray-500 mt-1">{r.note}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Find Your Texas Bond</h2>
          <p className="text-indigo-200 mb-5">Notary bonds, GDN dealer bonds, contractor bonds, construction bonds — Quantum Surety covers all of them. TDI Licensed #3480229.</p>
          <Link href="/quote">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Find My Bond <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200"><p className="font-semibold text-gray-900 text-sm">{f.q}</p></div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond — $50" },
              { href: "/bonds/gdn-bond-texas", label: "Texas GDN Dealer Bond" },
              { href: "/bonds/construction-bond-texas", label: "Texas Construction Bonds" },
              { href: "/bonds/license-permit-bond-texas", label: "Texas License & Permit Bonds" },
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
        <BlogAuthor updated="June 2026" />
    </div>
  );
}
