import { useState } from "react";
import { Search, Shield, Calendar, AlertTriangle, CheckCircle, Clock, Bell } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const VERIFY_API = "https://verify.quantumsurety.bond";

interface NotaryResult { notary_id: string; first_name: string; last_name: string; city?: string; expire_date: string; days_left?: number; daysLeft?: number; }

function getDaysLeft(d: string) {
  return Math.max(0, Math.floor((new Date(d).getTime() - Date.now()) / 86400000));
}

function StatusBadge({ daysLeft }: { daysLeft: number }) {
  if (daysLeft <= 0) return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"><AlertTriangle className="w-4 h-4" /> Expired</span>;
  if (daysLeft <= 30) return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"><AlertTriangle className="w-4 h-4" /> Expires in {daysLeft} days</span>;
  if (daysLeft <= 90) return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold"><Clock className="w-4 h-4" /> Expires in {daysLeft} days</span>;
  return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold"><CheckCircle className="w-4 h-4" /> Active {daysLeft} days left</span>;
}

function ResultCard({ notary, onSubscribe }: { notary: NotaryResult; onSubscribe: (id: string, email: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState("idle");
  const daysLeft = notary.days_left ?? notary.daysLeft ?? getDaysLeft(notary.expire_date);
  const expStr = new Date(notary.expire_date).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const needsRenewal = daysLeft <= 90;
  const renewUrl = "/renew?nid=" + notary.notary_id + "&utm_source=expiry_tool&utm_medium=lookup";

  async function handleSub(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSub("loading");
    try { await onSubscribe(notary.notary_id, email); setSub("done"); }
    catch { setSub("err"); }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-6">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-white font-bold text-lg">{notary.first_name} {notary.last_name}</p>
          <p className="text-slate-400 text-sm">Notary ID: {notary.notary_id}</p>
        </div>
        <StatusBadge daysLeft={daysLeft} />
      </div>
      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Expires</p>
            <p className="font-semibold text-slate-800 text-sm">{expStr}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Days Left</p>
            <p className={daysLeft <= 30 ? "font-bold text-xl text-red-600" : daysLeft <= 90 ? "font-bold text-xl text-amber-600" : "font-bold text-xl text-emerald-600"}>
              {daysLeft <= 0 ? "Expired" : daysLeft}
            </p>
          </div>
        </div>
        {needsRenewal ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm mb-3 font-medium">
              {daysLeft <= 0 ? "Your bond has lapsed. Renew immediately to restore your commission." : "Your bond is expiring soon. Renew now to avoid any lapse."}
            </p>
            <a href={renewUrl} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">
              <Shield className="w-4 h-4" /> Renew My Bond
            </a>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            {sub === "done" ? (
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                <CheckCircle className="w-5 h-5" /> Set! We will remind you at 90, 60, and 30 days before expiration.
              </div>
            ) : (
              <>
                <p className="text-slate-700 text-sm font-medium mb-3 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-500" /> Get email reminders before your bond expires
                </p>
                <form onSubmit={handleSub} className="flex gap-2">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" required
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  <button type="submit" disabled={sub === "loading"}
                    className="bg-slate-900 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                    {sub === "loading" ? "..." : "Remind Me"}
                  </button>
                </form>
                {sub === "err" && <p className="text-red-500 text-xs mt-1.5">Something went wrong. Try again.</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotaryExpirationCheck() {
  useSEO({
    title: "Texas Notary Bond Expiration Check — Free Lookup Tool",
    description: "Look up your Texas notary bond expiration date instantly. Search 558,000+ records by name, notary ID, or email. Set a free 90-day renewal reminder.",
    canonical: "/notary-expiration-check",
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NotaryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true); setSearched(true);
    try {
      if (q.includes("@")) {
        const res = await fetch(VERIFY_API + "/api/notary-renew?email=" + encodeURIComponent(q));
        const data = await res.json();
        setResults(data.found ? [data] : []);
      } else {
        const res = await fetch(VERIFY_API + "/api/search?q=" + encodeURIComponent(q));
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch { setResults([]); }
    finally { setLoading(false); }
  }

  async function handleSubscribe(notaryId: string, email: string) {
    const res = await fetch(VERIFY_API + "/api/alerts/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notary_id: notaryId, email }),
    });
    if (!res.ok) throw new Error("failed");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Notary Bond Expiration Check</h1>
          <p className="text-slate-500 text-base max-w-sm mx-auto">
            Look up your Texas notary bond expiration date and set a free renewal reminder.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 mb-1">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Name, Notary ID, or email..."
              className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading ? "..." : "Search"}
          </button>
        </form>
        <p className="text-xs text-slate-400 text-center mb-6">Searches 558,000+ Texas notary records from the TX Secretary of State</p>
        {loading && (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}
        {!loading && searched && results.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-600 font-medium mb-1">No records found</p>
            <p className="text-slate-400 text-sm">Try your full name, notary ID, or email from your bond application.</p>
          </div>
        )}
        {!loading && results.slice(0, 3).map(n => (
          <ResultCard key={n.notary_id} notary={n} onSubscribe={handleSubscribe} />
        ))}
        {results.length > 3 && !loading && (
          <p className="text-center text-slate-400 text-sm mt-4">
            Showing top 3 of {results.length}. Use your notary ID for an exact match.
          </p>
        )}
        <div className="mt-10 bg-slate-900 rounded-2xl p-6 text-center">
          <p className="text-white font-semibold mb-1">Ready to renew or get bonded?</p>
          <p className="text-slate-400 text-sm mb-4">$50 flat · Instant PDF · Same-day · TDI-Licensed Agency #3480229</p>
          <a href="/bonds/notary-bond-texas?utm_source=expiry_tool&utm_medium=footer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">
            <Shield className="w-4 h-4" /> Get My Notary Bond
          </a>
        </div>
      </div>
    </div>
  );
}
