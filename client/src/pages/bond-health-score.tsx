import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

const VERIFY_API = "https://verify.quantumsurety.bond/api";

const TX_COUNTIES = [
  "", "Harris","Dallas","Tarrant","Bexar","Travis","Collin","Hidalgo","El Paso","Denton","Fort Bend",
  "Montgomery","Williamson","Cameron","Nueces","Brazoria","Bell","Galveston","Lubbock","Webb",
  "Jefferson","McLennan","Smith","Brazos","Hays","Ellis","Midland","Ector","Johnson","Guadalupe",
];

const GRADE_META: Record<string, { color: string; bg: string; label: string }> = {
  "A+": { color: "#059669", bg: "rgba(5,150,105,0.12)", label: "QS Verified™" },
  "A":  { color: "#16a34a", bg: "rgba(22,163,74,0.12)",   label: "Trusted" },
  "B":  { color: "#2563eb", bg: "rgba(37,99,235,0.12)",   label: "Active" },
  "C":  { color: "#d97706", bg: "rgba(217,119,6,0.12)",   label: "Compliant" },
  "D":  { color: "#ea580c", bg: "rgba(234,88,12,0.12)",   label: "At Risk" },
  "F":  { color: "#dc2626", bg: "rgba(220,38,38,0.12)",   label: "Non-Compliant" },
};

function ScoreBadge({ score, grade }: { score?: number; grade?: string }) {
  const g = grade || "F";
  const meta = GRADE_META[g] || GRADE_META["F"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: meta.bg, border: `2px solid ${meta.color}`,
      }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: meta.color, lineHeight: 1 }}>{g}</div>
        <div style={{ fontSize: 10, color: meta.color, fontWeight: 700 }}>{score ?? "–"}</div>
      </div>
      <div style={{ fontSize: 12, color: meta.color, fontWeight: 700 }}>{meta.label}</div>
    </div>
  );
}

export default function BondHealthScore() {
  const [query, setQuery] = useState("");
  const [county, setCounty] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [topRated, setTopRated] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${VERIFY_API}/qs-leaderboard?type=contractor&county=Harris&limit=5`)
      .then(r => r.json())
      .then(d => setTopRated(d.results || []))
      .catch(() => {});
  }, []);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ q: query });
      if (county) params.set("county", county);
      const r = await fetch(`${VERIFY_API}/contractor-search?${params}`);
      const d = await r.json();
      setResults(d.contractors || d.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Texas Contractor Bond Health Score — Free QS Score Lookup | Quantum Surety</title>
        <meta name="description" content="Check the Bond Health Score for any Texas TDLR-licensed contractor. Free public QS Score™ — 0 to 100 — based on bond status, license type, and profile completeness. Updated daily." />
        <link rel="canonical" href="https://quantumsurety.bond/bond-health-score" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Texas Contractor Bond Health Score",
          "url": "https://quantumsurety.bond/bond-health-score",
          "description": "Free public QS Score™ for every Texas TDLR-licensed contractor. Check bond status, license health, and trust rating before hiring.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "provider": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 60%,#1e1b4b 100%)", padding: "64px 24px 56px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, color: "#f59e0b", letterSpacing: 2, marginBottom: 20 }}>
            FREE PUBLIC TOOL
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Texas Contractor Bond Health Score
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px" }}>
            The QS Score™ is a free public 0–100 trust rating for every Texas TDLR-licensed contractor — based on bond status, license type, and profile completeness. Updated daily.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Contractor name or license number..."
                style={{ flex: 1, minWidth: 200, padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 15, outline: "none" }}
              />
              <select
                value={county}
                onChange={e => setCounty(e.target.value)}
                style={{ padding: "14px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: county ? "#fff" : "#64748b", fontSize: 14 }}
              >
                {TX_COUNTIES.map(c => <option key={c} value={c} style={{ background: "#1e293b" }}>{c || "All Counties"}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "14px 24px", borderRadius: 10, background: "#f59e0b", color: "#0a0f1e", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Searching…" : "Check Bond Health Score →"}
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section style={{ background: "#0f172a", padding: "32px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            {loading ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 32 }}>Checking scores…</div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32 }}>
                <div style={{ fontSize: 18, color: "#94a3b8", marginBottom: 12 }}>No Texas TDLR contractor found for "{query}"</div>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Try a different spelling or search by license number. TDLR records include contractors, electricians, HVAC techs, plumbers, and more.</p>
                <a href="/get-bond?type=contractor" style={{ display: "inline-block", background: "#f59e0b", color: "#0a0f1e", fontWeight: 800, padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14 }}>Get Bonded — Improve Your Score →</a>
              </div>
            ) : (
              <>
                <div style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>{results.length} contractor{results.length !== 1 ? "s" : ""} found</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {results.map((r: any) => {
                    const grade = r.qs_grade || (r.status === "active" ? "A" : r.status === "expiring" ? "C" : "F");
                    const score = r.qs_score ?? (r.status === "active" ? 78 : r.status === "expiring" ? 42 : 15);
                    const meta = GRADE_META[grade] || GRADE_META["F"];
                    const expDate = r.expire_date ? new Date(r.expire_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
                    return (
                      <div key={r.license_number} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <ScoreBadge score={score} grade={grade} />
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 15 }}>{r.business_name || r.name || r.license_number}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{r.license_type} · {r.business_city || r.city || r.business_county || ""} · #{r.license_number}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Bond expires {expDate}</div>
                          <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 700, border: `1px solid ${meta.color}40` }}>{meta.label}</div>
                        </div>
                        <Link href={`/contractor/${r.license_number}`}>
                          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#94a3b8", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.1)" }}>
                            Full Profile →
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                {results.some((r: any) => r.status === "expired" || r.qs_grade === "D" || r.qs_grade === "F") && (
                  <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 10, fontSize: 13, color: "#fca5a5" }}>
                    ⚠️ One or more contractors above have expired bonds. Hiring an unbonded contractor puts you at financial risk if work is incomplete or defective.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#1e293b" }}>

        {/* Why it matters — two columns */}
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Why Bond Health Scores Matter</h2>
        <p style={{ color: "#475569", marginBottom: 28, lineHeight: 1.7 }}>Texas has 816,000+ licensed contractors. Most homeowners hire based on word of mouth — with no idea whether the contractor's bond is active or expired. The QS Score makes that information searchable in seconds.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 48 }}>
          {[
            { icon: "🏠", title: "For Homeowners", body: "Before signing a contract, check the QS Score. An active bond means the contractor is licensed and financially accountable if work is left incomplete or defective." },
            { icon: "🏗️", title: "For Property Managers", body: "Quickly screen your entire vendor list. HOAs and property managers use the leaderboard to maintain compliant contractor rosters without manual TDLR lookups." },
            { icon: "⚡", title: "For Contractors", body: "Your QS Score is visible to every homeowner who searches your name. A score above 70 signals trust. The single fastest way to raise it: keep your surety bond active." },
          ].map(c => (
            <div key={c.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 20px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15, marginBottom: 8 }}>{c.title}</div>
              <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>{c.body}</div>
            </div>
          ))}
        </div>

        {/* Top rated preview */}
        {topRated.length > 0 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Top-Rated Contractors in Harris County</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>Highest QS Scores in Houston's largest county — updated daily from TDLR public records.</p>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
              {topRated.map((r, i) => {
                const meta = GRADE_META[r.qs_grade] || GRADE_META["A"];
                return (
                  <div key={r.id || i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < topRated.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                    <div style={{ fontWeight: 800, color: "#cbd5e1", fontSize: 14, width: 24 }}>#{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name || r.id}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.license_type || "Contractor"}</div>
                    </div>
                    <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: meta.bg, color: meta.color, fontWeight: 800, fontSize: 13, border: `1px solid ${meta.color}40` }}>{r.qs_grade} — {r.qs_score}/100</div>
                  </div>
                );
              })}
            </div>
            <Link href="/qs-leaderboard">
              <span style={{ display: "inline-block", fontSize: 13, color: "#2563eb", fontWeight: 600, cursor: "pointer", marginBottom: 48 }}>See full leaderboard by city/county →</span>
            </Link>
          </>
        )}

        {/* Score explained */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>How the QS Score Is Calculated</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginBottom: 16 }}>
          {[
            { label: "Bond Health", weight: "0–60 pts", desc: "Active bond with 6+ months left = full points. Drops as expiration approaches, falls sharply on expiry." },
            { label: "License Type", weight: "0–20 pts", desc: "Master Electrician, HVAC Contractor, and Plumbing Contractor earn full marks. Higher credential complexity = higher score." },
            { label: "Profile Completeness", weight: "0–20 pts", desc: "Business name, phone, city, and address each add 5 pts. Incomplete records lower the score." },
          ].map(f => (
            <div key={f.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{f.label}</div>
                <div style={{ background: "#0f172a", color: "#f59e0b", borderRadius: 12, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>{f.weight}</div>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <Link href="/qs-score">
          <span style={{ display: "inline-block", fontSize: 13, color: "#2563eb", fontWeight: 600, cursor: "pointer", marginBottom: 48 }}>Full methodology →</span>
        </Link>

        {/* Contractor CTA */}
        <div style={{ background: "#0a0f1e", borderRadius: 14, padding: "32px 28px", marginBottom: 48, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, color: "#f59e0b", fontSize: 18, marginBottom: 8 }}>Contractors: Raise Your Score</div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>An expired bond drops your QS Score by up to 60 points and flags you as non-compliant to every homeowner who searches your name. Renew in under 10 minutes.</p>
          </div>
          <a href="/get-bond?type=contractor&utm_source=bond-health-score&utm_medium=cta" style={{ display: "inline-block", background: "#f59e0b", color: "#0a0f1e", fontWeight: 800, fontSize: 14, padding: "13px 24px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
            Renew Bond — Raise Your Score →
          </a>
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>Frequently Asked Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 48 }}>
          {[
            { q: "Is the QS Score free to check?", a: "Yes — completely free, no account needed. The QS Score is calculated from TDLR and Texas Secretary of State public records and published by Quantum Surety as a consumer protection tool." },
            { q: "How often does the score update?", a: "Bond status is checked daily. TDLR license data refreshes monthly when the state updates its public dataset. Scores reflect the most recent available data." },
            { q: "What does a score below 40 mean?", a: "A score below 40 (grade D or F) typically means the contractor's surety bond has expired or lapsed. Texas law requires most licensed contractors to maintain an active bond. We recommend not starting work until the bond is reinstated." },
            { q: "Can a contractor improve their score?", a: "Yes. The biggest impact is keeping the surety bond active — that's 60 of the 100 possible points. Completing profile information in the TDLR system and holding a higher-tier license also contribute." },
            { q: "Is Quantum Surety affiliated with TDLR?", a: "No. Quantum Surety is a Texas-licensed surety bond agency (TDI #3480229) that publishes this score as a public service. We are not affiliated with TDLR or the Texas Secretary of State." },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 6 }}>{faq.q}</div>
              <div style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 24, fontSize: 12, color: "#94a3b8" }}>
          Data sources: TDLR via data.texas.gov (dataset 7358-krk7) · Texas SOS public records · Scores updated daily · Quantum Surety LLC, TDI Licensed Agency #3480229
        </div>
      </div>
    </>
  );
}
