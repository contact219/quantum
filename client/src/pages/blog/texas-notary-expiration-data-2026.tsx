import { Link } from "wouter";
import { BlogAuthor } from "@/components/BlogAuthor";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, User } from "lucide-react";

const MONTHLY = [
  { month: "June 2026", count: 6961 },
  { month: "July 2026", count: 10721 },
  { month: "August 2026", count: 12599 },
  { month: "September 2026", count: 10969 },
  { month: "October 2026", count: 10229 },
  { month: "November 2026", count: 8767 },
  { month: "December 2026", count: 2977 },
];

const CITIES = [
  { city: "Houston", count: 7324 },
  { city: "San Antonio", count: 3489 },
  { city: "Dallas", count: 3105 },
  { city: "Austin", count: 2370 },
  { city: "Fort Worth", count: 1983 },
  { city: "El Paso", count: 1221 },
  { city: "Katy", count: 822 },
  { city: "Spring", count: 804 },
  { city: "Arlington", count: 801 },
  { city: "Plano", count: 704 },
];

const MARKET = [
  { company: "Western Surety Company (incl. c/o CNA)", count: 200093, share: "43.6%" },
  { company: "Merchants Bonding Company", count: 91153, share: "19.9%" },
  { company: "Travelers Casualty and Surety", count: 59984, share: "13.1%" },
  { company: "Universal Surety of America", count: 45441, share: "9.9%" },
  { company: "Notary Public Underwriters of Texas", count: 16244, share: "3.5%" },
  { company: "RLI Insurance Company", count: 12026, share: "2.6%" },
];

export default function TexasNotaryExpirationData2026() {
  useSEO({
    title: "62,623 Texas Notary Commissions Expire by December: 2026 Data Study",
    description:
      "We analyzed all 458,845 active Texas notary commissions (TX SOS data, June 2026). August is the biggest renewal month of the year, and one surety holds 43% of the market. Full data inside.",
    canonical: "/blog/texas-notary-expiration-data-2026",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Article", "headline": "62,623 Texas Notary Commissions Expire by December: 2026 Data Study", "datePublished": "2026-06-11", "publisher": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" } }, "ld-json-Article");

  const peak = Math.max(...MONTHLY.map((m) => m.count));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Data Study</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> June 2026</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            62,623 Texas Notary Commissions Expire by December — Here's the 2026 Renewal Map
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            We analyzed all 458,845 active Texas notary commissions from Texas Secretary of State records.
            The renewal wave peaks in August — and the surety market is far more concentrated than most notaries realize.
          </p>
          <div className="flex items-center gap-2 mt-4 text-indigo-300 text-sm">
            <User className="w-3 h-3" />
            <span>Quantum Surety — TDI Licensed Agency #3480229</span>
          </div>
        </div>
      </section>

      {/* TL;DR */}
      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-900 text-sm font-medium">
            <strong>TL;DR:</strong> Texas has 458,845 active notaries. 33,151 commissions expire within 90 days and
            62,623 by year-end. August 2026 is the single biggest renewal month (12,599 expirations). Western Surety
            holds ~44% of all active notary bonds; renewing with an independent agency costs $50 for the full 4-year term.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12 prose-headings:font-bold">
        <h2 className="text-2xl font-bold mb-4">The dataset</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Every Texas notary public must maintain a $10,000 surety bond for their 4-year commission term, and every
          commission is public record with the Texas Secretary of State. We refreshed the full statewide dataset on
          June 11, 2026 — <strong>458,845 active commissions</strong> — and mapped when they expire and who wrote the bonds.
        </p>

        <h2 className="text-2xl font-bold mb-4">Finding 1: The renewal wave peaks in August</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Expirations are not evenly distributed. The summer surge is real — August alone accounts for 12,599 expiring
          commissions, more than quadruple December's count:
        </p>
        <div className="mb-8 space-y-2">
          {MONTHLY.map((m) => (
            <div key={m.month} className="flex items-center gap-3">
              <span className="w-36 text-sm text-gray-600 shrink-0">{m.month}</span>
              <div className="bg-indigo-600 h-6 rounded" style={{ width: `${(m.count / peak) * 100}%`, minWidth: "2rem" }} />
              <span className="text-sm font-semibold text-gray-900">{m.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">
          If your commission expires in the August wave, expect slower processing at the Secretary of State — that's
          when the queue is longest. Renewing 60–90 days early avoids any gap in your authority to notarize.
        </p>

        <h2 className="text-2xl font-bold mb-4">Finding 2: Where the renewal wave hits hardest</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Of the 62,623 commissions expiring in the next 180 days, these ten cities account for more than a third.
          Houston alone has over twice as many expiring notaries as any other Texas city:
        </p>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-left">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">City</th>
                <th className="py-2 text-right">Commissions expiring by December 2026</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((r, i) => (
                <tr key={r.city} className="border-b border-gray-200">
                  <td className="py-2 pr-4 text-gray-500">{i + 1}</td>
                  <td className="py-2 pr-4 font-medium">{r.city}</td>
                  <td className="py-2 text-right font-semibold">{r.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">
          The suburban pattern is worth noting: Katy, Spring, and Plano each out-rank most mid-size Texas cities,
          reflecting where signing agents and title work actually concentrate — around the Houston and DFW
          mortgage corridors.
        </p>

        <h2 className="text-2xl font-bold mb-4">Finding 3: One company writes almost half of all Texas notary bonds</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The surety side of the market is heavily concentrated. Share of the 458,845 active bonds:
        </p>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-left">
                <th className="py-2 pr-4">Surety</th>
                <th className="py-2 pr-4 text-right">Active bonds</th>
                <th className="py-2 text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {MARKET.map((r) => (
                <tr key={r.company} className="border-b border-gray-200">
                  <td className="py-2 pr-4">{r.company}</td>
                  <td className="py-2 pr-4 text-right">{r.count.toLocaleString()}</td>
                  <td className="py-2 text-right font-semibold">{r.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">
          Most notaries get their bond bundled through whatever vendor handled their application and never compare at
          renewal. Because Texas caps the bond at $10,000 regardless of issuer, the coverage is identical — the only
          differences are price, term handling, and how fast you get your certificate.
        </p>

        <h2 className="text-2xl font-bold mb-4">What this means if you're renewing in 2026</h2>
        <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-8 space-y-2">
          <li><strong>Renew early if you're in the July–September wave</strong> — 34,289 notaries renew in that window.</li>
          <li><strong>Compare before auto-renewing.</strong> The same $10,000 state-mandated bond is $50 flat for the full 4-year term through Quantum Surety, underwritten by RLI Insurance Company.</li>
          <li><strong>Budget for the state's training requirement</strong> — the SB693 course at sos.texas.gov costs $20, paid to the state.</li>
        </ul>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold mb-2">Check your own expiration date</h3>
          <p className="text-gray-700 text-sm mb-4">
            Look up any Texas notary commission free — including your own expiry date — at our public records portal,
            or get renewal reminders before your bond lapses.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://verify.quantumsurety.bond" target="_blank" rel="noreferrer">
              <Button variant="outline">Look Up a Notary</Button>
            </a>
            <Link href="/get-bond?type=notary">
              <Button>Renew My Bond — $50 <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Methodology: Texas Secretary of State notary public dataset (data.texas.gov), full refresh June 11, 2026.
          Counts reflect commissions with expiration dates on or after the refresh date. Surety share combines
          duplicate filing names for the same underwriter. This study may be cited with attribution and a link to this page.
        </p>
      </article>
    <BlogAuthor />
    </div>
  );
}
