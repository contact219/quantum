import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

const ROWS = [
  { label: "Bond amount (set by Texas law)", travelers: "$10,000", quantum: "$10,000" },
  { label: "Accepted by the Texas Secretary of State", travelers: "Yes", quantum: "Yes" },
  { label: "Term", travelers: "4 years", quantum: "4 years" },
  { label: "Price", travelers: "Typically $75–100 through broker channels", quantum: "$50 bond + $21 state fee = $71" },
  { label: "Certificate delivery", travelers: "Varies by broker — often 3–7 business days", quantum: "Instant PDF by email, same day" },
  { label: "Required add-ons", travelers: "Often requires an agent/broker — not direct purchase", quantum: "None — bond only" },
  { label: "Underwriter", travelers: "Travelers Insurance / St. Paul Fire and Marine", quantum: "RLI Insurance Company (A-rated)" },
];

export default function CompareTravelers() {
  useSEO({
    title: "Travelers Notary Bond Renewal — Texas Comparison 2026 | Quantum Surety",
    description:
      "Have a Travelers notary bond in Texas? The $10,000 bond is identical from every licensed surety. Compare price and delivery at renewal. $50 flat, same-day PDF through Quantum Surety.",
    canonical: "/compare/travelers-notary-bond",
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Have a Travelers Notary Bond in Texas? Compare at Renewal.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Travelers surety bonds reach Texas notaries primarily through insurance brokers. At renewal, you have the right to shop — here's what changes provider to provider and what stays the same.
          </p>
        </div>
      </section>

      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-900 text-sm font-medium">
            <strong>TL;DR:</strong> Texas law fixes the notary bond at $10,000 — the Secretary of State treats every licensed surety identically. The differences at renewal are price, who you buy from, and how fast you get your certificate.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Side-by-side at renewal</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-left">
                <th className="py-2 pr-4"></th>
                <th className="py-2 pr-4">Travelers (via broker/agent)</th>
                <th className="py-2">Quantum Surety</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-gray-200 align-top">
                  <td className="py-3 pr-4 font-medium text-gray-900">{r.label}</td>
                  <td className="py-3 pr-4 text-gray-600">{r.travelers}</td>
                  <td className="py-3 font-semibold text-indigo-800">{r.quantum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mb-4">How to switch at renewal (5 minutes)</h2>
        <ol className="list-decimal pl-6 text-gray-700 leading-relaxed mb-8 space-y-2">
          <li>Apply online — name, commission details, payment. <strong>$50 for the 4-year term, plus the $21 state filing fee.</strong> No broker or agent required.</li>
          <li>Your bond certificate (underwritten by A-rated RLI Insurance) arrives by email, usually same day.</li>
          <li>File your renewal with the Texas Secretary of State as usual. Remember the SB693 2-hour training course at sos.texas.gov ($20, paid to the state).</li>
        </ol>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-10">
          <div className="flex flex-wrap gap-3">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX" target="_blank" rel="noreferrer">
              <Button>Renew for $50 — Same Day <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </a>
            <a href="https://verify.quantumsurety.bond" target="_blank" rel="noreferrer">
              <Button variant="outline">Not due yet? Set a free renewal reminder</Button>
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-4 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Questions? (214) 666-8718 — answered 24/7.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-5 mb-10">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Can I buy my renewal bond directly without a broker?</h3>
            <p className="text-gray-700 leading-relaxed">Yes. While Travelers typically operates through agents and brokers, you can purchase a Texas notary bond directly online from any licensed surety. Quantum Surety offers direct purchase with same-day certificate delivery — no agent needed.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Is my coverage affected if I switch from Travelers?</h3>
            <p className="text-gray-700 leading-relaxed">No. The $10,000 Texas notary bond amount and coverage scope are set by state law (Texas Government Code §406.010) — every licensed surety provides the same legal protection. Your bond is not "better" because of the carrier name.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Why is the Quantum Surety price lower?</h3>
            <p className="text-gray-700 leading-relaxed">Quantum Surety sells direct and bundles no extras — just the required bond. Broker-channel surety bonds include agent commissions and overhead in the premium. The underlying protection is identical.</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {["TDI-licensed Texas agency #3480229", "Bonds underwritten by RLI Insurance Company (A-rated)", "No credit check for notary bonds"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {t}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400">
          Travelers and St. Paul Fire and Marine Insurance Company are used here for identification and comparison only. Quantum Surety is not affiliated with Travelers. Verify your current renewal pricing with your broker or agent. Related reading:{" "}
          <Link href="/blog/texas-notary-expiration-data-2026" className="text-indigo-600 hover:underline">our 2026 Texas notary market data study</Link>.
        </p>
      </article>
    </div>
  );
}
