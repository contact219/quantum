import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import NotaryRenewalAlert from "@/components/NotaryRenewalAlert";
import DealerRenewalAlert from "@/components/DealerRenewalAlert";

/**
 * Texas Bond Data Hub — the interactive view.
 *
 * The crawlable version of this page is rendered server-side in server/seo.ts
 * (_bondDataSSR) so Google and LLMs see real numbers in the HTML. This component
 * is what a human gets once React hydrates: same data, live, with charts.
 */

const API = "https://verify.quantumsurety.bond/api/v1/stats";

type Overview = {
  as_of: string;
  notaries: { total: number; active: number; expired: number; last_updated: string };
  gdn_dealers: { total: number; active: number; expired: number };
  contractors: { total: number };
};
type MonthRow = { month: string; expiring: number };
type CityRow = { city: string; notaries: number; active: number };
type CountyRow = { county: string; dealers: number; active: number };

const n = (v: number | undefined) => (v ?? 0).toLocaleString("en-US");

function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function BarChart({ rows, label }: { rows: MonthRow[]; label: string }) {
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => r.expiring));
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[560px] items-end gap-2" style={{ height: 200 }}>
        {rows.map((r) => (
          <div key={r.month} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[11px] font-semibold tabular-nums text-slate-600">{n(r.expiring)}</span>
            <div
              className="w-full rounded-t bg-amber-400"
              style={{ height: `${Math.max(4, (r.expiring / max) * 150)}px` }}
              title={`${r.month}: ${n(r.expiring)} ${label}`}
            />
            <span className="text-[11px] text-slate-500">{monthLabel(r.month)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-3xl font-bold tabular-nums text-slate-900">{value}</p>
      <p className="mt-1 font-semibold text-slate-700">{label}</p>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}

export default function TexasBondData() {
  useSEO({
    title: "Texas Bond Data | Live Notary, Dealer & Contractor Counts",
    description:
      "Live counts of Texas notary commissions, GDN dealer licences, and TDLR contractor licences. Updated monthly from state public records. Free CSV downloads.",
    canonical: "/texas-bond-data",
  });

  const [ov, setOv] = useState<Overview | null>(null);
  const [nExp, setNExp] = useState<MonthRow[]>([]);
  const [dExp, setDExp] = useState<MonthRow[]>([]);
  const [cities, setCities] = useState<CityRow[]>([]);
  const [counties, setCounties] = useState<CountyRow[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/overview`).then((r) => r.json()),
      fetch(`${API}/notary-expirations`).then((r) => r.json()),
      fetch(`${API}/dealer-expirations`).then((r) => r.json()),
      fetch(`${API}/notary-by-city`).then((r) => r.json()),
      fetch(`${API}/dealer-by-county`).then((r) => r.json()),
    ])
      .then(([o, ne, de, c, co]) => {
        setOv(o);
        setNExp(ne || []);
        setDExp(de || []);
        setCities((c || []).slice(0, 15));
        setCounties((co || []).slice(0, 15));
      })
      .catch(() => setFailed(true));
  }, []);

  const nextWave = nExp.length > 1 ? nExp[1] : nExp[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Public data</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">Texas Bond Data</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Live counts of every Texas notary commission, GDN dealer licence, and TDLR contractor licence — pulled from
            state public records and refreshed monthly. The state publishes these one search at a time. We publish the
            totals.
          </p>
          {ov && (
            <p className="mt-4 text-sm text-slate-400">
              Current as of {ov.as_of} · Free to use and cite
            </p>
          )}
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {failed && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
              Live figures are temporarily unavailable. Please refresh in a moment.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard value={n(ov?.notaries.total)} label="Notary commissions" sub={`${n(ov?.notaries.active)} currently active`} />
            <StatCard value={n(ov?.gdn_dealers.total)} label="GDN dealers" sub={`${n(ov?.gdn_dealers.active)} currently active`} />
            <StatCard value={n(ov?.contractors.total)} label="TDLR contractor licences" />
          </div>

          {nextWave && (
            <p className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-lg text-slate-800">
              <strong className="text-slate-900">{n(nextWave.expiring)}</strong> Texas notary commissions expire in{" "}
              <strong className="text-slate-900">
                {new Date(Number(nextWave.month.split("-")[0]), Number(nextWave.month.split("-")[1]) - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </strong>
              . Every one needs a $10,000 surety bond to renew.
            </p>
          )}

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Notary commissions expiring by month</h2>
          <p className="mt-2 text-slate-600">
            Texas notary commissions run four-year terms. This is the renewal curve for the next twelve months.
          </p>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <BarChart rows={nExp} label="commissions" />
          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">GDN dealer licences expiring by month</h2>
          <p className="mt-2 text-slate-600">
            Texas GDN licences renew annually and require a $25,000 dealer bond.
          </p>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <BarChart rows={dExp} label="licences" />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top cities by notary count</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
                    <tr>
                      <th className="px-4 py-2">City</th>
                      <th className="px-4 py-2 text-right">Commissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cities.map((c) => (
                      <tr key={c.city}>
                        <td className="px-4 py-2 text-slate-800">{c.city}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-700">{n(c.notaries)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top counties by GDN dealers</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
                    <tr>
                      <th className="px-4 py-2">County</th>
                      <th className="px-4 py-2 text-right">Dealers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {counties.map((c) => (
                      <tr key={c.county}>
                        <td className="px-4 py-2 text-slate-800">{c.county}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-700">{n(c.dealers)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Download the data</h2>
          <p className="mt-2 text-slate-600">
            Free for any use, including commercial and editorial. Attribution to Quantum Surety appreciated.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ["Notary expirations by month", "notary-expirations.csv"],
              ["Notary commissions by city", "notary-by-city.csv"],
              ["GDN expirations by month", "dealer-expirations.csv"],
              ["GDN dealers by county", "dealer-by-county.csv"],
            ].map(([label, file]) => (
              <li key={file}>
                <a href={`${API}/${file}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 font-medium text-slate-800 transition hover:border-amber-400 hover:bg-amber-50">
                  {label} <span className="text-xs font-semibold text-amber-700">CSV</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-6">
            <NotaryRenewalAlert />
            <DealerRenewalAlert />
          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Methodology</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Notary records come from the Texas Secretary of State's published notary file, GDN dealer records from
            TxDMV, and contractor licences from TDLR. Each dataset is re-imported monthly and counts are computed
            directly against those mirrors — no sampling or estimation. "Active" means the commission or licence
            expiration date is today or later. Records the state publishes without a city or county are excluded from
            the geographic breakdowns but counted in statewide totals, so those tables sum to slightly less than the
            total.
          </p>
          <p className="mt-3 text-slate-700">
            Need a cut we don't publish, or programmatic access?{" "}
            <a href="mailto:api@quantumsurety.bond" className="font-semibold text-amber-700 underline">
              api@quantumsurety.bond
            </a>{" "}
            — or see the{" "}
            <Link href="/bonds/notary-bond-texas" className="font-semibold text-amber-700 underline">
              Texas notary bond page
            </Link>{" "}
            if you need a bond rather than the data.
          </p>
        </div>
      </section>
    </div>
  );
}
