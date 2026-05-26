import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";

const BOND_WATCH_API = "https://verify.quantumsurety.bond/api/bond-watch";

const COUNTY_SLUGS: Record<string, string> = {
  harris: "Harris", dallas: "Dallas", tarrant: "Tarrant", bexar: "Bexar",
  travis: "Travis", collin: "Collin", denton: "Denton", "fort-bend": "Fort Bend",
  williamson: "Williamson", montgomery: "Montgomery", "el-paso": "El Paso",
  hidalgo: "Hidalgo", cameron: "Cameron", lubbock: "Lubbock", nueces: "Nueces",
};
const SLUG_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTY_SLUGS).map(([k, v]) => [v.toLowerCase(), k])
);

interface CountyRow {
  county: string;
  total: number;
  expired: number;
  expiring_30d: number;
  expiring_90d: number;
}

function pct(expired: number, total: number) {
  return total > 0 ? ((expired / total) * 100).toFixed(1) : "0.0";
}

function grade(p: number): { letter: string; color: string } {
  if (p < 15) return { letter: "A", color: "#059669" };
  if (p < 20) return { letter: "B", color: "#10b981" };
  if (p < 25) return { letter: "C", color: "#d97706" };
  if (p < 30) return { letter: "D", color: "#f97316" };
  return { letter: "F", color: "#dc2626" };
}

export default function BondComplianceLeaderboard() {
  const [counties, setCounties] = useState<CountyRow[]>([]);
  const [sort, setSort] = useState<"pct" | "expired" | "total" | "expiring">("pct");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(`${BOND_WATCH_API}/counties`)
      .then(r => r.json())
      .then(d => setCounties(d.counties || []))
      .catch(() => {});
  }, []);

  const sorted = [...counties]
    .filter(c => c.county.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sort === "pct") return Number(pct(b.expired, b.total)) - Number(pct(a.expired, a.total));
      if (sort === "expired") return b.expired - a.expired;
      if (sort === "expiring") return b.expiring_30d - a.expiring_30d;
      return b.total - a.total;
    });

  const totalExpired = counties.reduce((s, c) => s + c.expired, 0);
  const totalContractors = counties.reduce((s, c) => s + c.total, 0);
  const overallPct = pct(totalExpired, totalContractors);

  const title = "Texas Contractor Bond Compliance Leaderboard — All 254 Counties Ranked";
  const description = `See how every Texas county ranks on contractor bond compliance. ${overallPct}% of Texas licensed contractors have expired bonds. County-by-county data from TDLR, updated daily.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://quantumsurety.bond/bond-compliance-leaderboard" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://quantumsurety.bond/bond-compliance-leaderboard" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": "Texas Contractor Bond Compliance by County",
          "description": description,
          "url": "https://quantumsurety.bond/bond-compliance-leaderboard",
          "creator": { "@type": "Organization", "name": "Quantum Surety LLC", "url": "https://quantumsurety.bond" },
          "spatialCoverage": "Texas, USA",
          "temporalCoverage": "2024/..",
          "license": "https://data.texas.gov/License",
          "isBasedOn": "https://data.texas.gov/Workforce-Development/TDLR-License-Listing/7358-krk7"
        })}</script>
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "56px 24px 44px", textAlign: "center" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            LIVE TDLR DATA — UPDATED DAILY
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Texas Contractor Bond<br />Compliance Leaderboard
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 580, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Every Texas county ranked by contractor bond compliance. Data from TDLR — the same public records your inspector uses. Know which counties have the highest rate of unlicensed-and-uninsured contractor activity.
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { label: "Texas Contractors Tracked", value: totalContractors > 0 ? totalContractors.toLocaleString() : "775,000+" },
              { label: "Currently Expired", value: totalExpired > 0 ? totalExpired.toLocaleString() : "226,767", color: "#dc2626" },
              { label: "Overall Lapsed Rate", value: `${overallPct}%`, color: "#f97316" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 20px", textAlign: "center", minWidth: 130 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color || "#e2e8f0", fontFamily: "monospace" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
            Source: Texas Department of Licensing and Regulation (TDLR) · data.texas.gov · Updated daily
          </p>
        </div>
      </section>

      {/* Grade scale */}
      <section style={{ background: "#161b22", padding: "20px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, color: "#64748b", marginRight: 8 }}>Compliance Grade:</span>
          {[
            { l: "A", range: "< 15% expired", c: "#059669" },
            { l: "B", range: "15–20%", c: "#10b981" },
            { l: "C", range: "20–25%", c: "#d97706" },
            { l: "D", range: "25–30%", c: "#f97316" },
            { l: "F", range: "> 30% expired", c: "#dc2626" },
          ].map(g => (
            <div key={g.l} style={{ display: "flex", alignItems: "center", gap: 6, background: "#0d1117", borderRadius: 6, padding: "5px 12px", border: "1px solid #21262d" }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: g.c, fontFamily: "monospace" }}>{g.l}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>{g.range}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Table */}
      <section style={{ background: "#0d1117", padding: "32px 16px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Controls */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Filter by county name…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ flex: 1, minWidth: 160, background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "9px 14px", color: "#e6edf3", fontSize: 13 }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              {(["pct", "expired", "expiring", "total"] as const).map(s => (
                <button key={s} onClick={() => setSort(s)}
                  style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #30363d", background: sort === s ? "#f59e0b" : "#161b22", color: sort === s ? "#000" : "#8b949e", fontWeight: 700, fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>
                  {s === "pct" ? "% EXPIRED" : s === "expiring" ? "EXP. 30D" : s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 0.8fr", gap: "0 8px", padding: "8px 12px", fontSize: 10, fontFamily: "monospace", color: "#475569", letterSpacing: 2, borderBottom: "1px solid #21262d" }}>
            <span>COUNTY</span><span style={{ textAlign: "right" }}>TOTAL</span>
            <span style={{ textAlign: "right" }}>EXPIRED</span>
            <span style={{ textAlign: "right" }}>EXP. 30D</span>
            <span style={{ textAlign: "right" }}>% LAPSED</span>
            <span style={{ textAlign: "center" }}>GRADE</span>
          </div>

          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#475569", fontSize: 14 }}>Loading county data…</div>
          )}

          {sorted.map((c, i) => {
            const p = Number(pct(c.expired, c.total));
            const g = grade(p);
            const slug = SLUG_MAP[c.county.toLowerCase()];
            const row = (
              <div key={c.county} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 0.8fr", gap: "0 8px",
                padding: "10px 12px", borderBottom: "1px solid #161b22",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", minWidth: 24, textAlign: "right" }}>{i + 1}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>
                    {slug ? <Link href={`/texas-bond-watch/${slug}`}><span style={{ color: "#e2e8f0", cursor: "pointer", textDecoration: "underline", textDecorationColor: "#334155" }}>{c.county}</span></Link> : c.county}
                  </span>
                </div>
                <span style={{ textAlign: "right", fontSize: 13, color: "#8b949e", fontFamily: "monospace" }}>{c.total.toLocaleString()}</span>
                <span style={{ textAlign: "right", fontSize: 13, color: "#dc2626", fontFamily: "monospace", fontWeight: 700 }}>{c.expired.toLocaleString()}</span>
                <span style={{ textAlign: "right", fontSize: 13, color: "#d97706", fontFamily: "monospace" }}>{c.expiring_30d.toLocaleString()}</span>
                <span style={{ textAlign: "right", fontSize: 14, fontFamily: "monospace", fontWeight: 800, color: p >= 30 ? "#dc2626" : p >= 25 ? "#f97316" : p >= 20 ? "#d97706" : "#64748b" }}>
                  {pct(c.expired, c.total)}%
                </span>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 16, color: g.color }}>{g.letter}</span>
                </div>
              </div>
            );
            return row;
          })}
        </div>
      </section>

      {/* CTA + data note */}
      <section style={{ background: "#0a0f1e", padding: "48px 24px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Verify a Contractor Now</h3>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Check any TDLR-licensed contractor's bond status before signing a contract. Free, live data.</p>
            <a href="https://verify.quantumsurety.bond" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>
              Verify Now →
            </a>
          </div>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Is Your Bond Current?</h3>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Texas contractors: your bond status is public record. Show clients you're compliant with a free verification badge.</p>
            <Link href="/badge">
              <span style={{ display: "inline-block", background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none", cursor: "pointer", border: "1px solid rgba(245,158,11,0.3)" }}>
                Get Free Badge →
              </span>
            </Link>
          </div>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Embed on Your Site</h3>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>HOAs, realtors, and city offices: add live contractor bond verification to your website with one line.</p>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#4C9AC9", background: "#0d1117", borderRadius: 6, padding: "8px 10px", wordBreak: "break-all", cursor: "pointer" }}
              onClick={() => navigator.clipboard?.writeText('<script src="https://verify.quantumsurety.bond/widget.js"></script>').catch(() => {})}>
              {'<script src="https://verify.quantumsurety.bond/widget.js"></script>'}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 820, margin: "24px auto 0", padding: "16px 0", borderTop: "1px solid #1e293b", fontSize: 11, color: "#334155", lineHeight: 1.6 }}>
          <strong style={{ color: "#475569" }}>Data source:</strong> Texas Department of Licensing and Regulation (TDLR) via data.texas.gov (Socrata dataset 7358-krk7), updated daily. Texas Secretary of State notary records. This data is public record. Quantum Surety LLC aggregates and displays it for consumer education. Bond status may have a 24-hour lag from official state records.
          <br />
          <strong style={{ color: "#475569" }}>Press inquiries:</strong> contact@quantumsurety.bond · (214) 666-8718 · Data available for download on request.
        </div>
      </section>
    </>
  );
}
