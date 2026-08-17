import { useState } from "react";

/**
 * DealerRenewalAlert — GDN dealer licence renewal reminders.
 *
 * The notary version of this proved the pattern; dealers are the better market
 * for it. GDN licences renew ANNUALLY (notary commissions run four years), so a
 * dealer subscriber comes back around 4x more often. 18,811 Texas dealers, all
 * with expiration dates on file, and no competitor offers them a reminder.
 *
 * Backed by /api/dealer-search + /api/dealer-alerts/subscribe on the Bond Verify
 * service, which reads the TxDMV mirror.
 */

const API = "https://verify.quantumsurety.bond";

type Dealer = {
  license_number: string;
  business_name: string;
  dba_name: string | null;
  city: string;
  county: string;
  license_status: string;
  license_expiration: string;
  daysLeft: number | null;
};

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function DealerRenewalAlert({
  heading = "When does your GDN licence expire?",
  blurb = "Texas dealer licences renew every year, and a lapsed GDN means you can't legally sell. Look up your dealership and we'll email you a free reminder before it's due.",
}: {
  heading?: string;
  blurb?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Dealer[] | null>(null);
  const [picked, setPicked] = useState<Dealer | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setBusy(true);
    setError("");
    setResults(null);
    try {
      const r = await fetch(`${API}/api/dealer-search?q=${encodeURIComponent(query.trim())}`).then((x) => x.json());
      const found: Dealer[] = r.results || [];
      setResults(found);
      if (!found.length) setError("No Texas GDN licence found under that name. Try a shorter version of the business name.");
    } catch (err) {
      // Do not claim the service is down — from here we cannot tell a network problem
      // from a blocked request from an outage. Say what is true and offer a route that
      // does not depend on the call that just failed.
      console.error("[dealer licence lookup] lookup failed:", err);
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
      const r = await fetch(`${API}/api/dealer-alerts/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_number: picked.license_number, email: email.trim() }),
      }).then((x) => x.json());
      if (r.success) {
        setDone(true);
        if (typeof (window as any).gtag !== "undefined") {
          (window as any).gtag("event", "dealer_alert_signup", { method: "main_site_widget" });
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
        <p className="text-lg font-bold text-emerald-900">Reminder set.</p>
        <p className="mt-2 text-emerald-800">
          We'll email <strong>{email}</strong> before the GDN licence for{" "}
          <strong>{picked.dba_name || picked.business_name}</strong> expires on{" "}
          <strong>{fmtDate(picked.license_expiration)}</strong>. Free, unsubscribe anytime.
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Your dealership name"
            aria-label="Your dealership name"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <button
            type="submit"
            disabled={busy || query.trim().length < 2}
            className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Searching…" : "Look up"}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}

      {results && results.length > 0 && !picked && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-700">Select your dealership:</p>
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {results.map((d) => (
              <li key={d.license_number}>
                <button
                  onClick={() => {
                    setPicked(d);
                    setError("");
                  }}
                  className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left transition hover:bg-amber-50"
                >
                  <span>
                    <span className="font-semibold text-slate-900">{d.dba_name || d.business_name}</span>
                    <span className="ml-2 text-sm text-slate-500">
                      {d.city}
                      {d.county ? `, ${d.county} County` : ""}
                    </span>
                    <span className="ml-2 text-xs text-slate-400">GDN {d.license_number}</span>
                  </span>
                  <span className="text-sm text-slate-600">
                    Expires <strong className="text-slate-900">{fmtDate(d.license_expiration)}</strong>
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
            <p className="font-semibold text-slate-900">{picked.dba_name || picked.business_name}</p>
            <p className="mt-1 text-sm text-slate-600">
              GDN {picked.license_number} · expires{" "}
              <strong className="text-slate-900">{fmtDate(picked.license_expiration)}</strong>
            </p>
            <button
              onClick={() => {
                setPicked(null);
                setError("");
              }}
              className="mt-2 text-sm font-medium text-amber-700 underline hover:text-amber-800"
            >
              Not your dealership? Pick again
            </button>
          </div>

          <form onSubmit={subscribe} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@dealership.com"
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
            Free service. One email before your GDN licence expires. Unsubscribe anytime.
          </p>
        </div>
      )}
    </div>
  );
}
