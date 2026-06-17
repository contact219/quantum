import { useSEO, useSchema } from "@/hooks/useSEO";
import { Link } from "wouter";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Quantum Surety vs SuretyBonds.com — Texas Bond Comparison 2026",
  date: "2026-06-17",
  slug: "compare-suretybonds",
  description: "SuretyBonds.com vs Quantum Surety for Texas bonds. Compare notary, contractor, and dealer bond pricing, speed, and customer service.",
};

const COMPARISON = [
  { feature: "Texas Notary Bond",        qs: "$50 flat (4-yr)",    them: "$65–$79 (variable)",  winner: "qs" },
  { feature: "TDLR Contractor Bond",     qs: "$75/yr same-day",   them: "$99–$150/yr",          winner: "qs" },
  { feature: "TX GDN Dealer Bond",       qs: "$100/yr",            them: "$150–$250/yr",         winner: "qs" },
  { feature: "Texas-Specific Expertise", qs: "HQ in Wylie, TX",   them: "Missouri-based",       winner: "qs" },
  { feature: "Certificate Speed",        qs: "Instant PDF",        them: "1–3 business days",    winner: "qs" },
  { feature: "TDI Licensed",             qs: "#3480229",           them: "Not TX-licensed",      winner: "qs" },
  { feature: "Live Texas Agent",         qs: "(214) 666-8718",     them: "Call center",          winner: "qs" },
  { feature: "Bond Verify Portal",       qs: "Free public lookup", them: "None",                 winner: "qs" },
  { feature: "Online Checkout",          qs: "Yes",                them: "Yes",                  winner: "tie" },
  { feature: "BBB Accredited",           qs: "Pending",            them: "Yes",                  winner: "them" },
];

const FAQS = [
  {
    q: "Is SuretyBonds.com licensed to sell bonds in Texas?",
    a: "SuretyBonds.com is a national broker headquartered in Missouri. They work with various sureties but are not a Texas-licensed insurance agency. Quantum Surety is TDI-licensed (#3480229) specifically to sell surety bonds in Texas.",
  },
  {
    q: "Why does Quantum Surety charge less for Texas notary bonds?",
    a: "Quantum Surety focuses exclusively on Texas bonds, which lets us negotiate better rates with underwriters. Our notary bond is $50 flat for a 4-year term — no add-ons, no upsells.",
  },
  {
    q: "Does SuretyBonds.com offer instant certificates?",
    a: "Their processing typically takes 1–3 business days. Quantum Surety issues instant PDF certificates on checkout — most customers have their bond document within 5 minutes.",
  },
  {
    q: "What if I need help with a TDLR compliance question?",
    a: "Quantum Surety agents are familiar with TDLR licensing requirements and can advise on bond amounts, timing, and certificate submission. National brokers typically only process the transaction.",
  },
];

export default function CompareSuretyBonds() {
  useSEO({
    title: metadata.title,
    description: metadata.description,
    canonical: "https://quantumsurety.bond/compare-suretybonds",
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
            Quantum Surety vs SuretyBonds.com
          </h1>
          <p className="text-slate-600 text-lg">
            Texas professionals deserve a local agency. Here's how we compare on price, speed, and service.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto mb-12 rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-slate-700 font-semibold">Feature</th>
                <th className="text-center px-4 py-3 text-amber-700 font-bold">Quantum Surety</th>
                <th className="text-center px-4 py-3 text-slate-500 font-semibold">SuretyBonds.com</th>
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
          <p className="text-xl font-bold text-slate-900 mb-2">Ready to get bonded the Texas way?</p>
          <p className="text-slate-600 mb-6">TDI-licensed. Instant certificates. Lowest prices in Texas.</p>
          <Link href="/get-bond" className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg">
            Get My Texas Bond →
          </Link>
          <p className="text-slate-500 text-sm mt-3">Or call (214) 666-8718 — real Texas agent, no call center</p>
        </div>

        {/* Why choose QS over SuretyBonds.com */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Texas Professionals Choose Quantum Surety</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Texas-Only Focus", body: "We don't sell bonds in 50 states — we specialize in Texas. That means we know TDLR, TxDMV, and TX SOS requirements by heart." },
              { title: "No National Broker Markup", body: "SuretyBonds.com is a broker that adds a margin on top of the underwriter price. As a direct TDI-licensed agency, we cut out that middleman." },
              { title: "Instant Certificates, Always", body: "Our checkout issues a PDF bond certificate immediately. No waiting 1–3 days while your license application sits pending." },
              { title: "Real Local Support", body: "Call (214) 666-8718 and reach someone who understands Texas licensing. Not a call center reading from a script." },
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
          <p>Pricing based on publicly available rates as of June 2026. Texas bonds only. Not affiliated with SuretyBonds.com.</p>
          <p className="mt-1">
            <Link href="/compare-tool" className="text-amber-600 underline">Compare all surety companies →</Link>
          </p>
        </div>
    </main>
  );
}
