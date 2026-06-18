import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { AlertTriangle, Shield, Search, TrendingUp, MapPin, ArrowRight, ExternalLink } from "lucide-react";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Texas Contractor Bond Crisis: 240,627 Expired Bonds — June 2026 Data",
  "description": "Quantum Surety's analysis of 775,173 Texas TDLR contractor license records reveals 31% — 240,627 contractors — are operating with expired surety bonds as of June 2026. Full county breakdown inside.",
  "datePublished": "2026-06-18",
  "dateModified": "2026-06-18",
  "author": { "@type": "Person", "name": "Theodore Sparks", "jobTitle": "Founder, Quantum Surety LLC" },
  "publisher": {
    "@type": "Organization",
    "name": "Quantum Surety LLC",
    "url": "https://quantumsurety.bond",
    "logo": { "@type": "ImageObject", "url": "https://quantumsurety.bond/QS_Logo.png" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://quantumsurety.bond/blog/texas-contractor-bond-crisis-june-2026" },
  "image": "https://quantumsurety.bond/QS_OG_2.png",
  "keywords": "texas contractor bond expired, TDLR bond compliance, surety bond expired texas, contractor license bond, texas contractor bond check",
  "about": {
    "@type": "Dataset",
    "name": "Texas TDLR Contractor Bond Compliance — June 2026",
    "url": "https://quantumsurety.bond/bond-compliance-by-trade",
    "creator": { "@type": "Organization", "name": "Quantum Surety LLC" }
  }
};

const COUNTY_DATA = [
  { county: "Harris (Houston)", expired: "41,799", total: "136,406", pct: "30.6%" },
  { county: "Dallas", expired: "24,604", total: "79,704", pct: "30.9%" },
  { county: "Tarrant (Fort Worth)", expired: "14,190", total: "54,081", pct: "26.2%" },
  { county: "Bexar (San Antonio)", expired: "13,812", total: "47,298", pct: "29.2%" },
  { county: "Hidalgo (McAllen)", expired: "11,172", total: "30,779", pct: "36.3%" },
  { county: "Travis (Austin)", expired: "9,011", total: "34,693", pct: "26.0%" },
  { county: "Jefferson (Beaumont)", expired: "2,831", total: "7,487", pct: "37.8%" },
  { county: "Starr", expired: "941", total: "2,110", pct: "44.6%" },
];

export default function TexasContractorBondCrisisJune2026() {
  useSchema(SCHEMA);
  useSEO({
    title: "Texas Contractor Bond Crisis: 240,627 Expired Bonds — June 2026 Data | Quantum Surety",
    description: "31% of Texas TDLR contractors have expired surety bonds as of June 2026. Quantum Surety analyzed 775,173 records. Full county breakdown, live verification tool, and renewal options.",
    canonical: "/blog/texas-contractor-bond-crisis-june-2026",
    ogImage: "/QS_OG_2.png",
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Byline */}
        <div className="text-sm text-slate-500 mb-4">
          <span className="font-medium text-amber-600 uppercase tracking-wide text-xs">Data Investigation</span>
          <span className="mx-2">·</span>
          June 18, 2026
          <span className="mx-2">·</span>
          By <span className="font-medium">Theodore Sparks</span>, Quantum Surety LLC
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
          Texas Contractor Bond Crisis: We Checked 775,173 TDLR Records. 31% Have Expired Bonds.
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-8 border-l-4 border-amber-400 pl-4">
          240,627 Texas-licensed contractors are currently operating with expired surety bonds — and the state lists them as "licensed" anyway.
        </p>

        {/* Live stat box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-10 flex flex-col sm:flex-row gap-6">
          <div className="text-center">
            <div className="text-5xl font-black text-red-600">31%</div>
            <div className="text-sm text-red-700 mt-1">of TX TDLR contractors</div>
            <div className="text-xs text-slate-500">have expired surety bonds</div>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-sm text-slate-700">
            <div className="flex justify-between border-b border-red-100 pb-1">
              <span>Total TDLR contractor records analyzed</span>
              <strong>775,173</strong>
            </div>
            <div className="flex justify-between border-b border-red-100 pb-1">
              <span>Expired bonds confirmed</span>
              <strong className="text-red-600">240,627</strong>
            </div>
            <div className="flex justify-between border-b border-red-100 pb-1">
              <span>Expiring within 30 days</span>
              <strong className="text-amber-600">33,442</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Source</span>
              <span>TDLR via data.texas.gov · updated daily</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="prose prose-slate max-w-none">

          <h2>What We Found</h2>
          <p>
            Quantum Surety maintains the largest publicly accessible database of Texas contractor bond status,
            covering all 775,173 active TDLR-issued licenses. As of June 18, 2026, our daily analysis of
            TDLR public records reveals that <strong>240,627 Texas contractors — 31.0% of all licensees — are
            operating with expired surety bonds.</strong>
          </p>
          <p>
            A surety bond is a consumer protection tool: it's the financial instrument a homeowner can make
            a claim against when a licensed contractor causes damage or abandons a job. When the bond lapses,
            the legal protection lapses with it — even though the contractor's license number remains valid.
          </p>
          <p>
            <strong>The Texas Department of Licensing and Regulation (TDLR) continues to list these
            contractors as "licensed" after their bond expires.</strong> There is no public-facing alert.
            A homeowner searching the TDLR database has no way to distinguish between a contractor with an
            active bond and one whose bond lapsed two years ago.
          </p>

          <h2>County-by-County Breakdown</h2>
          <p>
            The compliance gap is not uniform. Some of the worst-affected counties serve Texas's most
            vulnerable homeowners — border regions and rural areas with fewer competing contractors.
          </p>
        </div>

        {/* County table */}
        <div className="overflow-x-auto my-6 rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">County</th>
                <th className="px-4 py-3 text-right">Expired Bonds</th>
                <th className="px-4 py-3 text-right">Total Licensed</th>
                <th className="px-4 py-3 text-right">Non-Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COUNTY_DATA.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {row.county}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 font-semibold">{row.expired}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.total}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                      parseFloat(row.pct) >= 35 ? "bg-red-100 text-red-700" :
                      parseFloat(row.pct) >= 30 ? "bg-amber-100 text-amber-700" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>{row.pct}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-slate-400 px-4 py-2 bg-slate-50 border-t border-slate-100">
            Source: Quantum Surety analysis of TDLR public records via data.texas.gov (Socrata 7358-krk7). Updated daily. Full 254-county data at{" "}
            <Link href="/bond-compliance-leaderboard" className="text-blue-600 underline">bond-compliance-leaderboard</Link>.
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2>The Worst-Affected Trades</h2>
          <p>
            Non-compliance is not evenly distributed by trade. Among the license types with the highest
            lapse rates:
          </p>
          <ul>
            <li><strong>Apprentice Electricians:</strong> 46.9% expired bonds — nearly half of the 199,435 licensed</li>
            <li><strong>A/C Technicians:</strong> 38.9% expired — 82,244 out of 211,431 licensed</li>
            <li><strong>Consent Tow Truck Operators:</strong> 44.8% expired</li>
            <li><strong>Electrical Contractors:</strong> 29.1% expired — these are the businesses homeowners hire</li>
          </ul>
          <p>
            The full trade-by-trade compliance grade report (A through F) is published at{" "}
            <Link href="/bond-compliance-by-trade" className="text-blue-600 underline font-medium">
              quantumsurety.bond/bond-compliance-by-trade
            </Link>.
          </p>

          <h2>How Quantum Surety Built This Database</h2>
          <p>
            Quantum Surety indexes the complete TDLR licensing dataset — 775,173 records — from Texas's
            open data portal (data.texas.gov, Socrata dataset 7358-krk7) on a daily basis. Bond expiration
            dates are matched against license records to generate real-time compliance status for every
            contractor, by trade and by county.
          </p>
          <p>
            This database powers:
          </p>
          <ul>
            <li>
              <strong>The Bond Verify Portal</strong> — free public lookup tool at{" "}
              <a href="https://verify.quantumsurety.bond" className="text-blue-600 underline font-medium" target="_blank" rel="noopener noreferrer">
                verify.quantumsurety.bond
              </a>
              , covering all 775,173+ TDLR records and 558,000+ Texas notary commissions
            </li>
            <li>
              <strong>The Bond Ticker</strong> — a live feed of bonds expiring in real time at{" "}
              <Link href="/bond-ticker" className="text-blue-600 underline font-medium">quantumsurety.bond/bond-ticker</Link>
            </li>
            <li>
              <strong>The County Leaderboard</strong> — all 254 Texas counties ranked by compliance rate at{" "}
              <Link href="/bond-compliance-leaderboard" className="text-blue-600 underline font-medium">bond-compliance-leaderboard</Link>
            </li>
            <li>
              <strong>A Public API</strong> — accessible by researchers, journalists, and developers at no cost:
              <code className="text-sm bg-slate-100 px-2 py-0.5 rounded ml-1">verify.quantumsurety.bond/api/bond-watch/summary</code>
            </li>
          </ul>
          <p>
            No other Texas surety agency has built or published this level of contractor compliance data.
          </p>

          <h2>What This Means for Texas Homeowners</h2>
          <p>
            Texas law requires TDLR contractors to maintain a continuous surety bond as a condition of
            licensure. The bond exists specifically to compensate homeowners for losses caused by the
            contractor — including abandoned jobs, property damage, and fraud. When the bond expires,
            the contractor is technically out of compliance, but the license number remains searchable and
            appears valid on TDLR's public database.
          </p>
          <p>
            <strong>Our recommendation for any Texas homeowner:</strong> Before hiring, verify the contractor's
            bond status directly at <a href="https://verify.quantumsurety.bond" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">verify.quantumsurety.bond</a>.
            Enter the license number or business name. The result shows the current bond expiration date
            from TDLR's own records.
          </p>

          <h2>What Contractors with Expired Bonds Should Do</h2>
          <p>
            If your TDLR bond has expired — or is expiring in the next 30 days — you can renew instantly
            online. Quantum Surety issues Texas contractor license bonds starting at $75/year with
            same-day certificates.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <div className="font-bold text-slate-900 text-lg mb-1">Renew Your Texas Contractor Bond — Same Day</div>
              <p className="text-slate-600 text-sm mb-4">
                Instant online process. TDI-licensed Texas agency. Underwritten by A-rated carriers.
                Certificate emailed same day.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/get-bond?type=contractor" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">
                  Get Contractor Bond <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="https://verify.quantumsurety.bond" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                  Verify My Bond Status <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2>About This Analysis</h2>
          <p>
            <strong>Data source:</strong> Texas Department of Licensing and Regulation (TDLR) public contractor
            licensing dataset, accessed via the Texas Open Data Portal (data.texas.gov, Socrata dataset ID
            7358-krk7). This dataset is public domain under Texas Government Code § 552.
          </p>
          <p>
            <strong>Methodology:</strong> All 775,173 active license records were downloaded and compared against
            their bond expiration date fields. Records where the bond expiration date is in the past are classified
            as "expired." Records where no bond date is recorded are classified separately and excluded from
            the compliance percentage calculation.
          </p>
          <p>
            <strong>Update frequency:</strong> Quantum Surety's database is refreshed daily from the TDLR source.
            The figures in this article reflect the dataset as of June 18, 2026.
          </p>
          <p>
            <strong>Press and researcher inquiries:</strong> Full data exports, county-level breakdowns by
            trade, and API access are available. Contact{" "}
            <a href="mailto:contact@quantumsurety.bond" className="text-blue-600 underline">contact@quantumsurety.bond</a> or
            visit <Link href="/press" className="text-blue-600 underline">quantumsurety.bond/press</Link>.
          </p>
        </div>

        {/* Author box */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">TS</div>
          <div>
            <div className="font-semibold text-slate-900">Theodore Sparks</div>
            <div className="text-sm text-slate-500">Founder, Quantum Surety LLC · TDI License #3480229 · Wylie, TX</div>
            <div className="text-sm text-slate-500 mt-1">
              Quantum Surety is a Texas-licensed surety bond agency that built and maintains the largest
              publicly accessible Texas contractor and notary bond compliance database, covering 1.37 million
              TDLR and Texas SOS licensee records.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
