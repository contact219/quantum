import { useSEO, useSchema } from "@/hooks/useSEO";
import { Link } from "wouter";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Quantum Surety vs BondExchange — Texas Surety Bond Comparison 2026",
  date: "2026-06-17",
  slug: "compare-bondexchange",
  description: "BondExchange vs Quantum Surety for Texas bonds. Compare pricing, licensing, and support for notary, contractor, and dealer bonds.",
};

const COMPARISON = [
  { feature: "Texas Notary Bond",          qs: "$50 flat (4-yr)",    them: "$60–$80/yr",           winner: "qs" },
  { feature: "TDLR Contractor Bond",       qs: "$75/yr",             them: "$99–$175/yr",          winner: "qs" },
  { feature: "TX GDN Dealer Bond",         qs: "$100/yr",            them: "$150–$299/yr",         winner: "qs" },
  { feature: "Texas TDI Licensed",         qs: "Yes — #3480229",     them: "Agent network only",   winner: "qs" },
  { feature: "Certificate Delivery",       qs: "Instant PDF",        them: "Email, 24–48 hrs",     winner: "qs" },
  { feature: "Bond Lookup Portal",         qs: "Free public lookup", them: "None",                 winner: "qs" },
  { feature: "Texas Compliance Guidance",  qs: "Included — TX focus",them: "Generic info",         winner: "qs" },
  { feature: "Agent-to-Agent Platform",    qs: "Not applicable",     them: "Yes (agencies only)",  winner: "them" },
  { feature: "Online Application",         qs: "Yes",                them: "Yes",                  winner: "tie" },
  { feature: "Phone Support",              qs: "(214) 666-8718",     them: "Agent dependent",      winner: "qs" },
];

const FAQS = [
  {
    q: "What is BondExchange and who is it for?",
    a: "BondExchange is a wholesale surety platform primarily designed for independent insurance agents, not end consumers. Individual contractors and notaries looking for direct bonding are better served by a consumer-facing agency like Quantum Surety.",
  },
  {
    q: "Can a Texas contractor buy a bond directly from BondExchange?",
    a: "Not directly — BondExchange requires going through a licensed agent. Quantum Surety lets contractors apply and purchase online in minutes, with instant certificate delivery.",
  },
  {
    q: "Is Quantum Surety more expensive than BondExchange?",
    a: "No. Quantum Surety's direct pricing is lower than what most agents charge through BondExchange for Texas bonds. Our notary bond is $50 flat; TDLR contractor bonds start at $75/yr.",
  },
  {
    q: "Does Quantum Surety work with other agents?",
    a: "Yes — Quantum Surety has a partner program at partners.quantumsurety.bond where agents, CPAs, and title companies can earn $35 per bond referral.",
  },
];

export default function CompareBondExchange() {
  useSEO({
    title: metadata.title,
    description: metadata.description,
    canonical: "https://quantumsurety.bond/compare-bondexchange",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">Side-by-Side Comparison</span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Quantum Surety vs BondExchange
          </h1>
          <p className="text-slate-600 text-lg">
            BondExchange is a wholesale platform for agents. Quantum Surety is built for Texas professionals who want to buy a bond directly — fast, cheap, and without a middleman.
          </p>
        </div>

        {/* Key differentiator callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
          <strong>Important:</strong> BondExchange is a <em>wholesale platform for licensed insurance agents</em> — not a direct consumer service. If you're a notary, contractor, or dealer who wants to buy a bond online right now, Quantum Surety is the direct route.
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto mb-12 rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-slate-700 font-semibold">Feature</th>
                <th className="text-center px-4 py-3 text-amber-700 font-bold">Quantum Surety</th>
                <th className="text-center px-4 py-3 text-slate-500 font-semibold">BondExchange</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                  <td className="px-4 py-3 text-slate-700 font-medium">{row.feature}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 font-semibold ${row.winner === "qs" ? "text-green-700" : "text-slate-600"}`}>
                      {row.winner === "qs" && <CheckCircle className="h-4 w-4" />}
                      {row.qs}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 ${row.winner === "them" ? "text-green-700 font-semibold" : "text-slate-500"}`}>
                      {row.winner === "them" && <CheckCircle className="h-4 w-4" />}
                      {row.winner === "qs" && <XCircle className="h-4 w-4 text-red-400" />}
                      {row.winner === "tie" && <AlertCircle className="h-4 w-4 text-slate-400" />}
                      {row.them}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center mb-12">
          <p className="text-xl font-bold text-slate-900 mb-2">Buy your Texas bond directly — no agent required</p>
          <p className="text-slate-600 mb-6">Instant PDF certificate. TDI-licensed. Lowest Texas rates.</p>
          <Link href="/get-bond" className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg">
            Get My Texas Bond →
          </Link>
          <p className="text-slate-500 text-sm mt-3">Or call (214) 666-8718 — real Texas agent, no broker required</p>
        </div>

        {/* Why direct beats wholesale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Go Direct Instead of Through a Broker?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "No Agent Markup", body: "When you buy through BondExchange, an agent sets the final price. Buying from Quantum Surety directly means you pay our rate — no hidden margin." },
              { title: "Faster Turnaround", body: "Agent-based workflows add 24–48 hours. Quantum Surety issues your PDF certificate at checkout, the moment you pay." },
              { title: "Texas Expertise Built In", body: "Our agents know TDLR renewal dates, TxDMV dealer requirements, and TX SOS notary rules — not as a lookup exercise, but from daily specialization." },
              { title: "Real Support Line", body: "Call (214) 666-8718 and reach a Texas-based agent directly. No waiting for your assigned agent to call back." },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center text-sm text-slate-400">
          <p>Pricing estimates based on publicly available market rates, June 2026. Not affiliated with BondExchange.</p>
          <p className="mt-1">
            <Link href="/compare-tool" className="text-amber-600 underline">Compare all surety companies →</Link>
          </p>
        </div>
    </main>
  );
}
