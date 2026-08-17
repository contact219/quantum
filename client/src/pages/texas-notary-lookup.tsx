import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import NotaryRenewalAlert from "@/components/NotaryRenewalAlert";

/**
 * Texas Notary Lookup — front door on the main domain for the notary search.
 *
 * The search itself has existed for months on verify.quantumsurety.bond, which gets
 * almost no human traffic (~71 visits/log period, and 90%+ of requests there are our
 * own scripts). Meanwhile Search Console shows a live "surety bond lookup" query
 * cluster earning impressions and zero clicks on the main domain, which holds all the
 * authority. The tool was on the wrong side of the wall; this is the door.
 *
 * Results deliberately lead with the expiration date rather than a sales pitch — the
 * question people arrive with is "when does mine expire?", and answering it is what
 * earns the renewal-alert signup underneath.
 */

const API = "https://verify.quantumsurety.bond";

type Notary = {
  notary_id: string;
  first_name: string;
  last_name: string;
  city: string;
  county?: string;
  expire_date: string;
  daysLeft: number;
  status: string;
  qs_grade?: string;
};

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function StatusPill({ daysLeft }: { daysLeft: number }) {
  const [bg, fg, label] =
    daysLeft < 0
      ? ["bg-red-100", "text-red-800", "Expired"]
      : daysLeft <= 60
      ? ["bg-amber-100", "text-amber-900", `Expires in ${daysLeft} days`]
      : ["bg-emerald-100", "text-emerald-800", "Active"];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${bg} ${fg}`}>{label}</span>;
}

export default function TexasNotaryLookup() {
  useSEO({
    title: "Texas Notary Lookup — Search 558,898 Commissions | Quantum Surety",
    description:
      "Free Texas notary lookup. Search 558,898 notary commissions from Secretary of State records by name or city. See commission status and expiration date instantly.",
    canonical: "/texas-notary-lookup",
  });

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<Notary[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() && !city.trim()) return;
    setBusy(true);
    setError("");
    setResults(null);
    try {
      const qs = new URLSearchParams();
      if (name.trim()) qs.set("q", name.trim());
      if (city.trim()) qs.set("city", city.trim());
      const r = await fetch(`${API}/api/search?${qs}`).then((x) => x.json());
      const found: Notary[] = r.results || [];
      setResults(found);
      if (!found.length) setError("No Texas notary commission found. Check the spelling, or try searching without a city.");
    } catch (err) {
      // Do not claim the service is down — from here we cannot tell a network problem
      // from a blocked request from an outage. Say what is true and offer a route that
      // does not depend on the call that just failed.
      console.error("[notary lookup page] lookup failed:", err);
      setError(
        typeof navigator !== "undefined" && navigator.onLine === false
          ? "You appear to be offline. Reconnect and try again."
          : "We couldn't reach the lookup just now. You can search directly at verify.quantumsurety.bond, or call (214) 666-8718 and we'll check it for you."
      );

    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Texas Notary Lookup</h1>
          <p className="mt-4 max-w-2xl text-lg text-indigo-100">
            Search 558,898 Texas notary commissions from Secretary of State public records. See status
            and expiration date instantly — free, no account needed.
          </p>

          <form onSubmit={search} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Notary name"
              aria-label="Notary name"
              className="flex-1 rounded-lg px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (optional)"
              aria-label="City, optional"
              className="rounded-lg px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:w-52"
            />
            <button
              type="submit"
              disabled={busy || (!name.trim() && !city.trim())}
              className="rounded-lg bg-amber-500 px-8 py-3.5 font-bold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Searching…" : "Search"}
            </button>
          </form>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {error && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 font-medium text-amber-900">{error}</p>
          )}

          {results && results.length > 0 && (
            <>
              <p className="mb-3 text-sm font-semibold text-slate-600">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <ul className="divide-y divide-slate-200">
                  {results.map((n) => (
                    <li key={n.notary_id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {n.first_name} {n.last_name}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {n.city} · Notary ID {n.notary_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusPill daysLeft={n.daysLeft} />
                        <p className="mt-1 text-sm text-slate-600">
                          Expires <strong className="text-slate-900">{fmtDate(n.expire_date)}</strong>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Showing up to 50 matches. Narrow by city if you don't see the record you want.
              </p>
            </>
          )}

          <div className="mt-10">
            <NotaryRenewalAlert
              heading="Want a reminder before yours expires?"
              blurb="We'll email you 60 days before your Texas commission lapses — free, and it takes one search. Most notaries find out they've expired only when a signing falls through."
            />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">About this data</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Records come from the Texas Secretary of State's published notary file and are
                re-imported monthly. Of 558,898 commissions on record, 445,100 are currently active.
                "Expired" reflects the commission expiration date only — it doesn't account for
                voluntary resignation or administrative action.
              </p>
              <p className="mt-3 text-slate-700">
                See statewide totals and expiration trends on the{" "}
                <Link href="/texas-bond-data" className="font-semibold text-amber-700 underline">
                  Texas Bond Data hub
                </Link>
                .
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Need a notary bond?</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Every Texas notary needs a $10,000 surety bond for a four-year term. Ours run about
                <strong> $50 for the full term</strong>, issued same day through an A+ rated carrier
                with the certificate emailed immediately.
              </p>
              <Link
                href="/bonds/notary-bond-texas"
                className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                Texas notary bonds
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
