import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

interface Carrier {
  name: string;
  marketShare: string;
  price: string;
  delivery: string;
  addons: string;
  underwriter: string;
  comparePage: string | null;
}

const CARRIERS: Record<string, Carrier> = {
  "western-surety": {
    name: "Western Surety Company",
    marketShare: "~44%",
    price: "$65–85 (via vendor packages)",
    delivery: "Varies by vendor — often 3–5 days",
    addons: "Frequently bundled with supplies/memberships",
    underwriter: "Western Surety Company (CNA Financial)",
    comparePage: "/compare/western-surety-notary-bond",
  },
  "merchants-bonding": {
    name: "Merchants Bonding Company",
    marketShare: "~12%",
    price: "$65–85 (via notary supply vendors)",
    delivery: "3–5 business days by mail",
    addons: "Often bundled with supply packages",
    underwriter: "Merchants Bonding Company (Iowa)",
    comparePage: "/compare/merchants-bonding-notary-bond",
  },
  "travelers": {
    name: "Travelers / St. Paul Fire",
    marketShare: "~8%",
    price: "$75–100 through broker channels",
    delivery: "3–7 business days via broker",
    addons: "Requires agent/broker — not direct",
    underwriter: "St. Paul Fire and Marine Insurance",
    comparePage: "/compare/travelers-notary-bond",
  },
  "markel": {
    name: "Markel Insurance",
    marketShare: "~5%",
    price: "Varies — typically $60–90",
    delivery: "Varies by agent",
    addons: "Often sold through independent agents",
    underwriter: "Markel Insurance Company",
    comparePage: null,
  },
  "harco": {
    name: "Harco National Insurance",
    marketShare: "~4%",
    price: "Varies",
    delivery: "Varies by vendor",
    addons: "Varies",
    underwriter: "Harco National Insurance Company",
    comparePage: null,
  },
  "suretybonds": {
    name: "SuretyBonds.com",
    marketShare: "National broker",
    price: "$50 flat 4-yr (notary), $99–150 (contractor)",
    delivery: "1–3 business days",
    addons: "None, but not TX-licensed",
    underwriter: "Various via Missouri broker",
    comparePage: "/compare-suretybonds",
  },
  "bondexchange": {
    name: "BondExchange",
    marketShare: "Wholesale platform",
    price: "$50 flat 4-yr (notary), $99–175 (contractor)",
    delivery: "24–48 hrs via agent",
    addons: "Agent required — no direct purchase",
    underwriter: "Various wholesale carriers",
    comparePage: "/compare-bondexchange",
  },
  "other": {
    name: "Another Carrier",
    marketShare: "—",
    price: "Check your renewal notice",
    delivery: "Varies",
    addons: "Varies",
    underwriter: "Varies",
    comparePage: null,
  },
};

const ROWS: Array<{ label: string; key: keyof Carrier; quantum: string }> = [
  { label: "Bond amount (set by Texas law)", key: "price", quantum: "$10,000" },
  { label: "Accepted by Texas Secretary of State", key: "marketShare", quantum: "Yes" },
  { label: "Term", key: "delivery", quantum: "4 years" },
  { label: "Price", key: "price", quantum: "$50 bond + $21 state fee = $71" },
  { label: "Certificate delivery", key: "delivery", quantum: "Instant PDF by email, same day" },
  { label: "Required add-ons", key: "addons", quantum: "None — bond only" },
  { label: "Underwriter", key: "underwriter", quantum: "RLI Insurance Company (A-rated)" },
];

const TABLE_ROWS = [
  { label: "Bond amount (set by Texas law)", getTheirs: () => "$10,000", quantum: "$10,000" },
  { label: "Accepted by Texas Secretary of State", getTheirs: () => "Yes", quantum: "Yes" },
  { label: "Term", getTheirs: () => "4 years", quantum: "4 years" },
  { label: "Price", getTheirs: (c: Carrier) => c.price, quantum: "$50 bond + $21 state fee = $71" },
  { label: "Certificate delivery", getTheirs: (c: Carrier) => c.delivery, quantum: "Instant PDF by email, same day" },
  { label: "Required add-ons", getTheirs: (c: Carrier) => c.addons, quantum: "None — bond only" },
  { label: "Underwriter", getTheirs: (c: Carrier) => c.underwriter, quantum: "RLI Insurance Company (A-rated)" },
];

export default function CompareTool() {
  const [selected, setSelected] = useState<string>("");
  const carrier = selected ? CARRIERS[selected] : null;

  return (
    <>
      <Helmet>
        <title>Compare Texas Notary Bond Prices — Switch &amp; Save | Quantum Surety</title>
        <meta name="description" content="Compare your Texas notary bond renewal price side-by-side. Western Surety, Merchants, Travelers, Markel, and more. $50 flat through Quantum Surety — instant same-day certificate." />
        <link rel="canonical" href="https://quantumsurety.bond/compare" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Can I switch surety companies when my Texas notary bond renews?", acceptedAnswer: { "@type": "Answer", text: "Yes. Each 4-year Texas notary commission requires a new bond, and you may buy it from any surety licensed in Texas. The Secretary of State treats every licensed carrier identically." } },
            { "@type": "Question", name: "How much is a Texas notary bond through Quantum Surety?", acceptedAnswer: { "@type": "Answer", text: "$50 flat for the full 4-year term, underwritten by A-rated RLI Insurance Company. Certificate delivered by email, usually same day." } },
            { "@type": "Question", name: "Is the Texas notary bond amount the same with every company?", acceptedAnswer: { "@type": "Answer", text: "Yes. Texas law sets the bond amount at $10,000 regardless of provider. The only differences are price, delivery speed, and what else is bundled into the purchase." } },
          ],
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Compare Your Texas Notary Bond
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-xl mx-auto">
            Texas law sets the $10,000 bond amount for everyone. The only real differences are price, speed, and what's bundled into the bill.
          </p>
        </div>
      </section>

      {/* TL;DR bar */}
      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-amber-900 text-sm font-medium">
            <strong>Bottom line:</strong> The Secretary of State accepts a bond from every licensed surety equally. At renewal you can switch — the only question is whether your current carrier's price, speed, and bundled add-ons are worth it.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Step 1 — carrier picker */}
        <div className="mb-10">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Step 1</div>
          <label className="block text-lg font-bold text-gray-900 mb-3">Who is your current bond with?</label>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">— Select your current carrier —</option>
            {Object.entries(CARRIERS).map(([key, c]) => (
              <option key={key} value={key}>{c.name} {c.marketShare !== "—" ? `(${c.marketShare} TX market share)` : ""}</option>
            ))}
          </select>
        </div>

        {/* Step 2 — comparison table */}
        {carrier && (
          <div className="mb-10">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Step 2</div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{carrier.name} vs. Quantum Surety</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="py-3 px-4 text-left text-gray-500 font-semibold w-1/3"></th>
                    <th className="py-3 px-4 text-left text-gray-700 font-bold">{carrier.name}</th>
                    <th className="py-3 px-4 text-left text-indigo-700 font-bold">Quantum Surety</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row, i) => (
                    <tr key={row.label} className={`border-b border-gray-100 align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="py-3 px-4 font-medium text-gray-700">{row.label}</td>
                      <td className="py-3 px-4 text-gray-500">{row.getTheirs(carrier)}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-800">{row.quantum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {carrier.comparePage && (
              <p className="text-sm text-gray-500 mb-6">
                Want the full breakdown?{" "}
                <Link href={carrier.comparePage}>
                  <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                    See the detailed {carrier.name} comparison →
                  </span>
                </Link>
              </p>
            )}

            {/* Switch CTA */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Step 3</div>
              <h3 className="font-bold text-gray-900 text-base mb-4">Switch in 5 minutes</h3>
              <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2 mb-5">
                <li>Click below — apply online with your name, commission details, and payment. <strong>$50 for 4 years, plus the $21 state filing fee.</strong></li>
                <li>Your bond certificate (RLI Insurance, A-rated) arrives by email, usually same day.</li>
                <li>File your renewal with the Texas Secretary of State as usual — don't forget the SB693 course ($20 at sos.texas.gov/notary).</li>
              </ol>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-lg text-sm transition-colors"
                >
                  Switch for $50 — Same Day →
                </a>
                <a
                  href="https://verify.quantumsurety.bond"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-5 py-3 rounded-lg text-sm transition-colors"
                >
                  Not due yet? Set a free reminder
                </a>
              </div>
              <p className="text-gray-500 text-xs mt-4">📞 Questions? (214) 666-8718 — answered 24/7.</p>
            </div>
          </div>
        )}

        {/* Why notaries switch — always visible */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Why Texas Notaries Switch at Renewal</h2>
          <div className="grid gap-4">
            {[
              { icon: "💰", title: "Price", body: "Most carrier packages charge $65–100 for the same $10,000 bond Texas law mandates. At Quantum Surety it's $50 flat — no supplies, no memberships tacked on." },
              { icon: "⚡", title: "Speed", body: "Traditional providers mail certificates in 3–7 days. Your bond arrives by email the same day you apply — no waiting on mail." },
              { icon: "📦", title: "No bundling", body: "Some vendors bundle notary stamps, journals, or membership fees into the renewal. Our $50 is the bond only — buy supplies wherever you like." },
            ].map(r => (
              <div key={r.title} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="text-2xl">{r.icon}</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{r.title}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{r.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["TDI-licensed Texas agency #3480229", "Underwriter: RLI Insurance (A-rated)", "No credit check for notary bonds"].map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {t}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400">
          Carrier names are used here for identification and comparison only. Quantum Surety is not affiliated with or endorsed by any carrier listed above. Verify your current renewal pricing directly with your vendor — bundled package prices vary. Texas law (Gov't Code §406.010) sets the notary bond at $10,000 regardless of provider.
        </p>
      </div>
    </>
  );
}
