import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

const ROWS = [
  { label: "Bond amount (set by Texas law)", western: "$10,000", quantum: "$10,000" },
  { label: "Accepted by the Texas Secretary of State", western: "Yes", quantum: "Yes" },
  { label: "Term", western: "4 years", quantum: "4 years" },
  { label: "Price", western: "Varies by vendor package — check your renewal notice", quantum: "$50 flat, total" },
  { label: "Certificate delivery", western: "Varies by vendor", quantum: "Instant PDF by email, usually same day" },
  { label: "Required add-ons", western: "Often bundled with supplies/memberships", quantum: "None — the bond only" },
  { label: "Underwriter", western: "Western Surety Company (CNA)", quantum: "RLI Insurance Company (A-rated)" },
];

export default function CompareWesternSurety() {
  useSEO({
    title: "Western Surety Notary Bond Renewal in Texas: Compare First (2026)",
    description:
      "Renewing a Western Surety notary bond in Texas? The state-required $10,000 bond is identical from every surety — compare price and delivery before you renew. $50 flat for 4 years through Quantum Surety.",
    canonical: "/compare/western-surety-notary-bond",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Article", "headline": "Western Surety Notary Bond Renewal in Texas: Compare Before You Renew", "publisher": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" } }, "ld-json-Article");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Renewing a Western Surety Notary Bond in Texas? Compare First.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            About 44% of Texas notaries carry a Western Surety bond — most got it bundled inside an application
            package and have never seen a price comparison. Here's what's actually identical, and what isn't.
          </p>
        </div>
      </section>

      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-900 text-sm font-medium">
            <strong>TL;DR:</strong> Texas law sets the notary bond at $10,000 no matter who writes it — the Secretary
            of State accepts every licensed surety equally. The only real differences at renewal are price, speed,
            and what else is bundled into the bill.
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
                <th className="py-2 pr-4">Western Surety (via vendor packages)</th>
                <th className="py-2">Quantum Surety</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-gray-200 align-top">
                  <td className="py-3 pr-4 font-medium text-gray-900">{r.label}</td>
                  <td className="py-3 pr-4 text-gray-600">{r.western}</td>
                  <td className="py-3 font-semibold text-indigo-800">{r.quantum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mb-4">How to switch at renewal (5 minutes)</h2>
        <ol className="list-decimal pl-6 text-gray-700 leading-relaxed mb-8 space-y-2">
          <li>Apply online — name, commission details, payment. <strong>$50 total for the 4-year term.</strong></li>
          <li>Your bond certificate (underwritten by A-rated RLI Insurance) arrives by email, usually same day.</li>
          <li>File your renewal application with the Texas Secretary of State as usual — the SOS treats every licensed surety's bond identically. Don't forget the state's required SB693 course at sos.texas.gov ($20, paid to the state).</li>
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
            <h3 className="font-semibold text-gray-900 mb-1">Is it legal to switch sureties when my commission renews?</h3>
            <p className="text-gray-700 leading-relaxed">Yes. Each 4-year commission requires a new bond, and you may buy it from any surety licensed in Texas. The Secretary of State does not favor any carrier.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Do I lose any coverage by switching?</h3>
            <p className="text-gray-700 leading-relaxed">No. The $10,000 bond amount and what it covers are set by Texas Government Code §406.010 — identical from every surety. (Optional E&amp;O insurance is a separate product you can add with any carrier.)</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">What if I already got a renewal notice from my old vendor?</h3>
            <p className="text-gray-700 leading-relaxed">A renewal notice is an offer, not an obligation. Compare the total on that notice — including any bundled supplies or memberships — against $50 flat for the bond alone.</p>
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
          Western Surety Company is a CNA company; the name is used here for identification and comparison only.
          Quantum Surety is not affiliated with or endorsed by Western Surety or CNA. Verify your current renewal
          pricing with your vendor — bundled package prices vary. Related reading:{" "}
          <Link href="/blog/texas-notary-expiration-data-2026" className="text-indigo-600 hover:underline">our 2026 Texas notary market data study</Link>.
        </p>
      </article>
    </div>
  );
}
