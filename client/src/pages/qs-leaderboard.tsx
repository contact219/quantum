import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

const CITIES = ["Houston","San Antonio","Dallas","Austin","Fort Worth","El Paso","Arlington","Corpus Christi","Plano","Laredo"];
const COUNTIES = ["Harris","Bexar","Dallas","Travis","Tarrant","El Paso","Collin","Nueces","Denton","Fort Bend"];

export default function QSLeaderboard() {
  const [type, setType] = useState("contractor");
  const [location, setLocation] = useState("Harris");
  const [locType, setLocType] = useState("county");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadLeaderboard(); }, [type, location, locType]);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const param = locType === "city" ? `city=${encodeURIComponent(location)}` : `county=${encodeURIComponent(location)}`;
      const r = await fetch(`https://verify.quantumsurety.bond/api/qs-leaderboard?type=${type}&${param}&limit=25`);
      const d = await r.json();
      setResults(d.results || []);
    } catch { setResults([]); }
    setLoading(false);
  }

  const gradeColor: Record<string,string> = {
    "A+": "#059669", "A": "#16a34a", "B": "#2563eb",
    "C": "#d97706", "D": "#ea580c", "F": "#dc2626"
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>Texas {type === "notary" ? "Notary" : "Contractor"} Bond Leaderboard — QS Score Rankings | Quantum Surety</title>
        <meta name="description" content={`See the top-rated Texas ${type}s by QS Score in ${location}. Quantum Surety's free bond compliance leaderboard for Texas businesses.`}/>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-800 rounded-full px-4 py-1 text-sm text-blue-300 mb-4">
            Free Public Tool
          </div>
          <h1 className="text-4xl font-bold mb-3">Texas Bond Compliance Leaderboard</h1>
          <p className="text-gray-400 text-lg">See how Texas businesses rank on bond health, license status, and profile completeness.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div>
            <label className="text-xs text-gray-500 uppercase mb-1 block">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="contractor">Contractors</option>
              <option value="notary">Notaries</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase mb-1 block">Filter by</label>
            <select value={locType} onChange={e => setLocType(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="county">County</option>
              <option value="city">City</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase mb-1 block">{locType === "city" ? "City" : "County"}</label>
            <select value={location} onChange={e => setLocation(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
              {(locType === "city" ? CITIES : COUNTIES).map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading leaderboard...</div>
        ) : (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={r.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-600 transition-colors">
                <div className="text-2xl font-bold text-gray-600 w-8 text-center">#{i+1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{r.name || r.id}</div>
                  <div className="text-sm text-gray-400">{r.city || ""} {r.license_type ? `· ${r.license_type}` : ""}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{color: gradeColor[r.qs_grade] || "#fff"}}>{r.qs_grade}</div>
                  <div className="text-xs text-gray-500">{r.qs_score}/100</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${r.bond_status === "active" ? "bg-green-900 text-green-300" : r.bond_status === "expiring" ? "bg-yellow-900 text-yellow-300" : "bg-red-900 text-red-300"}`}>
                  {r.bond_status}
                </div>
              </div>
            ))}
            {!results.length && <div className="text-center py-12 text-gray-400">No results found.</div>}
          </div>
        )}

        <div className="mt-10 bg-blue-900/20 border border-blue-800 rounded-xl p-6 text-center">
          <p className="text-gray-300 mb-3">Is your business on the leaderboard? Get bonded or renew your bond today.</p>
          <a href="/get-bond" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Get Your Bond — Instant Quote</a>
        </div>
      </div>
    </div>
  );
}
