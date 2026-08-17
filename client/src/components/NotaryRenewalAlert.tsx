import { useState } from "react";

/**
 * NotaryRenewalAlert — free renewal-reminder capture.
 *
 * Placed on high-traffic reference pages (SB-693 guide, notary bond pages) rather
 * than on verify.quantumsurety.bond, which gets ~71 human visits per log period.
 *
 * Friction note: the /api/alerts/subscribe endpoint requires a notary_id, which
 * almost nobody knows off-hand. So this widget looks the person up by name first
 * and hands them their own record — which doubles as the hook ("when does mine
 * expire?") and removes the need for them to know anything.
 *
 * Every subscriber is a future inbound lead timed to the only moment this
 * business has ever converted: renewal.
 */

const API = "https://verify.quantumsurety.bond";

type Notary = {
  notary_id: string;
  first_name: string;
  last_name: string;
  city: string;
  expire_date: string;
  daysLeft: number;
  status: string;
};

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NotaryRenewalAlert({
  heading = "When does your notary commission expire?",
  blurb = "Look up your Texas commission and we'll email you a free reminder before it lapses — 60 days out, so you have time to renew without a gap.",
}: {
  heading?: string;
  blurb?: string;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<Notary[] | null>(null);
  const [picked, setPicked] = useState<Notary | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    setResults(null);
    try {
      const qs = new URLSearchParams({ q: name.trim() });
      if (city.trim()) qs.set("city", city.trim());
      const r = await fetch(`${API}/api/search?${qs}`).then((x) => x.json());
      const found: Notary[] = (r.results || []).slice(0, 8);
      setResults(found);
      if (!found.length) setError("No Texas commission found under that name. Check the spelling, or try without a city.");
    } catch (err) {
      // Do not claim the service is down — from here we cannot tell a network problem
      // from a blocked request from an outage. Say what is true and offer a route that
      // does not depend on the call that just failed.
      console.error("[notary commission lookup] lookup failed:", err);
      setError(
        typeof navigator !== "undefined" && navigator.onLine === false
          ? "You appear to be offline. Reconnect and try again."
          : "We couldn't reach the lookup just now. You can search directly at verify.quantumsurety.bond, or call (214) 666-8718 and we'll check it for you."
      );

    } finally {
      setBusy(false);
    }
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!picked || !email.trim()) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`${API}/api/alerts/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notary_id: picked.notary_id, email: email.trim() }),
      }).then((x) => x.json());
      if (r.success) {
        setDone(true);
        if (typeof (window as any).gtag !== "undefined") {
          (window as any).gtag("event", "alert_signup", { method: "main_site_widget" });
        }
      } else {
        setError(r.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not set up your reminder. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (done && picked) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <p className="text-lg font-bold text-emerald-900">You're set, {picked.first_name}.</p>
        <p className="mt-2 text-emerald-800">
          We'll email <strong>{email}</strong> before your commission expires on{" "}
          <strong>{fmtDate(picked.expire_date)}</strong>. Free, and you can unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">{heading}</h3>
      <p className="mt-2 text-slate-600">{blurb}</p>

      {!picked && (
        <form onSubmit={search} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your last name"
            aria-label="Your last name"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (optional)"
            aria-label="City, optional"
            className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:w-44"
          />
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Searching…" : "Look up"}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}

      {results && results.length > 0 && !picked && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-700">Select your record:</p>
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {results.map((n) => (
              <li key={n.notary_id}>
                <button
                  onClick={() => {
                    setPicked(n);
                    setError("");
                  }}
                  className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left transition hover:bg-amber-50"
                >
                  <span>
                    <span className="font-semibold text-slate-900">
                      {n.first_name} {n.last_name}
                    </span>
                    <span className="ml-2 text-sm text-slate-500">{n.city}</span>
                  </span>
                  <span className="text-sm text-slate-600">
                    Expires <strong className="text-slate-900">{fmtDate(n.expire_date)}</strong>
                    {n.daysLeft > 0 && (
                      <span className="ml-2 text-slate-400">({n.daysLeft.toLocaleString()} days)</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {picked && (
        <div className="mt-5">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">
              {picked.first_name} {picked.last_name}
              <span className="ml-2 font-normal text-slate-500">{picked.city}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Commission expires <strong className="text-slate-900">{fmtDate(picked.expire_date)}</strong>
            </p>
            <button
              onClick={() => {
                setPicked(null);
                setError("");
              }}
              className="mt-2 text-sm font-medium text-amber-700 underline hover:text-amber-800"
            >
              Not you? Pick again
            </button>
          </div>

          <form onSubmit={subscribe} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Your email address"
              required
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Setting up…" : "Email me a reminder"}
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-500">
            Free service. One email before your commission expires. Unsubscribe anytime.
          </p>
        </div>
      )}
    </div>
  );
}
