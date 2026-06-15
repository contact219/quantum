import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, AlertTriangle, XCircle, ExternalLink } from "lucide-react";

const TX_COUNTIES = [
  "Harris","Dallas","Tarrant","Bexar","Travis","Collin","Denton","El Paso","Fort Bend",
  "Hidalgo","Montgomery","Williamson","Cameron","Brazoria","Bell","Galveston","Lubbock",
  "Webb","Jefferson","McLennan","Smith","Brazos","Hays","Ellis","Midland","Ector",
  "Johnson","Guadalupe","Comal","Parker","Randall","Taylor","Grayson","Wichita","Gregg",
  "Potter","Kaufman","Rockwall","Tom Green","Bowie","Victoria","Angelina","Hunt",
  "Orange","Bastrop","Liberty","Henderson","Coryell","Walker","Nacogdoches","Harrison",
  "San Patricio","Starr","Wise","Anderson","Hardin","Hood","Van Zandt","Cherokee",
  "Rusk","Maverick","Waller","Medina","Val Verde","Atascosa","Burnet","Wilson",
  "Polk","Kerr","Wood","Erath","Jim Wells","Caldwell","Navarro","Upshur","Brown",
  "Chambers","Cooke","Matagorda","Hopkins","Kendall","Jasper","Hale","Howard",
  "Hill","Washington","Fannin","Titus","Bee","Kleberg","Cass","Austin","Palo Pinto",
  "Grimes","Uvalde","Shelby","Aransas","Milam","Panola","Gillespie",
];

interface Contractor {
  license_number: string;
  business_name: string;
  license_type: string;
  business_county: string;
  expire_date: string;
  business_phone?: string;
}

function getDaysRemaining(expireDate: string) {
  const exp = new Date(expireDate);
  const now = new Date();
  return Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function StatusBadge({ expireDate }: { expireDate: string }) {
  const days = getDaysRemaining(expireDate);
  if (days > 90)
    return <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>;
  if (days > 0)
    return <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800">Expiring Soon</span>;
  return <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-800">Expired</span>;
}

function QSScoreBadge({ expireDate }: { expireDate: string }) {
  const days = getDaysRemaining(expireDate);
  if (days > 90) return <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-600 text-white">A+</span>;
  if (days > 0) return <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-600 text-white">B</span>;
  return <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-600 text-white">F</span>;
}

export default function VerifyContractor() {
  useSEO({
    title: "Verify Texas Contractor License & Bond — Free TDLR Lookup | Quantum Surety",
    description:
      "Free instant lookup: verify any Texas TDLR-licensed contractor's license status and surety bond before you hire. Search by name or license number. Powered by public TDLR data.",
    canonical: "/verify-contractor",
  });

  const [query, setQuery] = useState("");
  const [county, setCounty] = useState("");
  const [results, setResults] = useState<Contractor[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ q: query });
      if (county) params.set("county", county);
      const res = await fetch(
        `https://verify.quantumsurety.bond/api/contractor-search?${params.toString()}`
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-gray-900 via-indigo-950 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            <ShieldCheck className="w-3 h-3" /> Free · Instant · No Account Required
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Verify Any Texas Contractor Instantly — Free
          </h1>
          <p className="text-indigo-200 text-lg mb-8">
            Check if your contractor is licensed by TDLR and has an active surety bond before work begins.
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contractor name or license number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-44"
              >
                <option value="">All counties</option>
                {TX_COUNTIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Searching..." : "Search Texas TDLR Database"}
            </Button>
          </form>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Searching TDLR database...</p>
          </div>
        )}

        {!loading && searched && results !== null && results.length === 0 && (
          <div className="text-center py-12">
            <XCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Texas TDLR contractor found</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Try a shorter search term or check for spelling. If you're a contractor looking to get licensed and bonded, we can help.
            </p>
            <Link href="/get-bond?type=contractor">
              <Button>Get Your Contractor Bond →</Button>
            </Link>
          </div>
        )}

        {!loading && results && results.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-5">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="space-y-4 mb-8">
              {results.map((c) => (
                <div key={c.license_number} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{c.business_name || "—"}</h3>
                      <p className="text-sm text-gray-500">{c.license_type} · #{c.license_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">QS Score</span>
                      <QSScoreBadge expireDate={c.expire_date} />
                      <StatusBadge expireDate={c.expire_date} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1 mb-3">
                    <span><strong>County:</strong> {c.business_county || "—"}</span>
                    <span><strong>Bond expires:</strong> {c.expire_date ? new Date(c.expire_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                    {c.business_phone && <span><strong>Phone:</strong> {c.business_phone}</span>}
                  </div>
                  <Link href={`/contractor/${c.license_number}`}>
                    <span className="inline-flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline cursor-pointer">
                      View Full Profile <ExternalLink className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 text-sm text-gray-600">
              <AlertTriangle className="w-4 h-4 text-amber-500 inline mr-1" />
              Only hire bonded contractors. Hiring an unbonded contractor exposes you to financial risk if work is incomplete or defective.{" "}
              <Link href="/get-bond?type=contractor">
                <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Get Verified as a Bonded Contractor →</span>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 border-t border-gray-100 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Why bonding matters for homeowners</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "Financial protection",
                desc: "A surety bond guarantees that if a contractor fails to complete the work or causes damage, you have a financial recourse path — unlike hiring an unlicensed worker.",
              },
              {
                icon: "📋",
                title: "License verification",
                desc: "TDLR-licensed contractors have passed background checks and trade exams required by Texas law. Unlicensed work on plumbing, electrical, and HVAC is illegal and may void your homeowner's insurance.",
              },
              {
                icon: "⚠️",
                title: "Red flags to watch for",
                desc: "A contractor who can't provide their TDLR license number, has an expired bond, or asks for full payment upfront are warning signs. Verify before you sign any contract.",
              },
            ].map((item) => (
              <div key={item.title} className="p-5 bg-white border border-gray-200 rounded-xl">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-indigo-900 text-white rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Are you a Texas contractor?</h2>
          <p className="text-indigo-300 text-sm mb-4">
            Get your TDLR contractor bond same-day. Active bond = higher QS Score = more homeowner trust.
          </p>
          <Link href="/get-bond?type=contractor">
            <Button variant="secondary">Get Your Contractor Bond — Same Day</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
