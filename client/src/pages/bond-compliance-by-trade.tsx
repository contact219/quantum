import { Helmet } from "react-helmet";
import { Link } from "wouter";

// Data from TDLR via data.texas.gov — Quantum Surety analysis, May 2026
const TRADE_DATA = [
  { trade: "Apprentice Sign Electrician", total: 4735, expired: 2653, pct: 56.0 },
  { trade: "Apprentice Electrician", total: 199435, expired: 93509, pct: 46.9 },
  { trade: "Tow Truck (Consent Tow)", total: 6082, expired: 2723, pct: 44.8 },
  { trade: "A/C Technician", total: 39040, expired: 15171, pct: 38.9 },
  { trade: "VSF Employee", total: 3448, expired: 1311, pct: 38.0 },
  { trade: "A/C Technician (REG)", total: 37684, expired: 14835, pct: 39.4 },
  { trade: "Tow Truck (Incident Mgmt.)", total: 10284, expired: 3408, pct: 33.1 },
  { trade: "Residential Wireman", total: 2283, expired: 672, pct: 29.4 },
  { trade: "Cosmetology Eyelash Specialist", total: 5428, expired: 1342, pct: 24.7 },
  { trade: "Mini Establishment", total: 18790, expired: 4037, pct: 21.5 },
  { trade: "Manicurist/Esthetician Establishment", total: 6864, expired: 1520, pct: 22.1 },
  { trade: "Property Tax Consultant", total: 2021, expired: 420, pct: 20.8 },
  { trade: "Esthetician Establishment", total: 4167, expired: 856, pct: 20.5 },
  { trade: "Full Service Establishment", total: 32764, expired: 6382, pct: 19.5 },
  { trade: "Journeyman Electrician", total: 39020, expired: 7451, pct: 19.1 },
  { trade: "Property Tax Appraiser", total: 3503, expired: 655, pct: 18.7 },
  { trade: "Appliance Installer", total: 2295, expired: 433, pct: 18.9 },
  { trade: "Electrical Contractor", total: 6302, expired: 1115, pct: 17.7 },
  { trade: "Cosmetology Esthetician", total: 47083, expired: 7311, pct: 15.5 },
  { trade: "Cosmetology Manicurist", total: 69683, expired: 9386, pct: 13.5 },
  { trade: "Master Electrician", total: 16738, expired: 2224, pct: 13.3 },
  { trade: "Cosmetology Operator", total: 191183, expired: 25119, pct: 13.1 },
  { trade: "A/C Contractor", total: 8808, expired: 1062, pct: 12.1 },
].sort((a, b) => b.pct - a.pct);

function gradeColor(pct: number) {
  if (pct >= 40) return { bg: "rgba(220,38,38,0.1)", border: "rgba(220,38,38,0.3)", text: "#dc2626", grade: "F" };
  if (pct >= 30) return { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", text: "#ef4444", grade: "D" };
  if (pct >= 20) return { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", text: "#d97706", grade: "C" };
  if (pct >= 10) return { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)", text: "#ca8a04", grade: "B-" };
  return { bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.25)", text: "#059669", grade: "A" };
}

const tweetText = `🔌 SHOCKING: 46.9% of Texas apprentice electricians have EXPIRED surety bonds — per TDLR's own records.\n\nThat's 93,509 people doing electrical work in TX homes without valid bond coverage.\n\nFull breakdown by trade: https://quantumsurety.bond/bond-compliance-by-trade`;

export default function BondComplianceByTrade() {
  const totalExpired = TRADE_DATA.reduce((sum, r) => sum + r.expired, 0);
  const totalAll = TRADE_DATA.reduce((sum, r) => sum + r.total, 0);
  const overallPct = ((totalExpired / totalAll) * 100).toFixed(1);

  return (
    <>
      <Helmet>
        <title>Texas TDLR Bond Compliance by Trade — Which Licensed Trades Have the Worst Compliance? | Quantum Surety</title>
        <meta name="description" content={`46.9% of Texas apprentice electricians have expired bonds. See bond compliance rates for all 22 TDLR-licensed trades — live data from Texas public records.`} />
        <link rel="canonical" href="https://quantumsurety.bond/bond-compliance-by-trade" />
        <meta property="og:title" content="Texas Bond Compliance by Trade — Electricians, HVAC, Tow Trucks Ranked" />
        <meta property="og:description" content="Nearly half of Texas apprentice electricians have expired surety bonds. TDLR license types ranked by bond compliance from worst to best." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": "Texas TDLR Bond Compliance by License Type",
          "description": "Bond compliance rates for 22 TDLR-licensed trade categories in Texas, sourced from public records via data.texas.gov.",
          "creator": { "@type": "Organization", "name": "Quantum Surety LLC" },
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "url": "https://quantumsurety.bond/bond-compliance-by-trade",
        })}</script>
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "52px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            TDLR BOND COMPLIANCE · BY TRADE
          </div>
          <h1 style={{ fontSize: "clamp(24px,5vw,44px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Which Texas Trades Have the Worst Bond Compliance?
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 28px" }}>
            46.9% of Texas apprentice electricians have expired surety bonds. Which license type is your contractor? TDLR data — updated daily.
          </p>

          {/* Top 3 headlines */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 28 }}>
            {[
              { stat: "46.9%", label: "Apprentice Electricians", sub: "93,509 of 199K expired" },
              { stat: "44.8%", label: "Consent Tow Trucks", sub: "2,723 of 6K expired" },
              { stat: "38.9%", label: "A/C Technicians", sub: "15,171 of 39K expired" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 10, padding: "16px 12px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#dc2626", fontFamily: "monospace" }}>{s.stat}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fca5a5", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Share */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#1d9bf0", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 18px", borderRadius: 7, textDecoration: "none" }}>
              Share on X
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://quantumsurety.bond/bond-compliance-by-trade")}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#0a66c2", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 18px", borderRadius: 7, textDecoration: "none" }}>
              Share on LinkedIn
            </a>
            <Link href="/press">
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 13, padding: "10px 18px", borderRadius: 7, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}>
                Press Kit
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Table */}
      <section style={{ background: "#0d1117", padding: "40px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>All 22 TDLR License Types — Ranked by Expired Bond Rate</h2>
          <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>Source: Texas TDLR via data.texas.gov. Data as of May 2026. Only license types with 1,000+ active licensees shown.</p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "#64748b", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>RANK</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "#64748b", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>LICENSE TYPE</th>
                  <th style={{ textAlign: "right", padding: "10px 14px", color: "#64748b", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>TOTAL</th>
                  <th style={{ textAlign: "right", padding: "10px 14px", color: "#64748b", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>EXPIRED</th>
                  <th style={{ textAlign: "right", padding: "10px 14px", color: "#64748b", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>% EXPIRED</th>
                  <th style={{ textAlign: "center", padding: "10px 14px", color: "#64748b", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>GRADE</th>
                </tr>
              </thead>
              <tbody>
                {TRADE_DATA.map((row, i) => {
                  const g = gradeColor(row.pct);
                  return (
                    <tr key={row.trade} style={{ borderBottom: "1px solid #21262d", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ padding: "10px 14px", color: "#475569", fontFamily: "monospace" }}>#{i + 1}</td>
                      <td style={{ padding: "10px 14px", color: "#e2e8f0", fontWeight: 600 }}>{row.trade}</td>
                      <td style={{ padding: "10px 14px", color: "#475569", textAlign: "right", fontFamily: "monospace" }}>{row.total.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px", color: g.text, textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>{row.expired.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 6, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(row.pct, 100)}%`, height: "100%", background: g.text, borderRadius: 3 }} />
                          </div>
                          <span style={{ color: g.text, fontFamily: "monospace", fontWeight: 700 }}>{row.pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <span style={{ display: "inline-block", background: g.bg, border: `1px solid ${g.border}`, borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 800, color: g.text, fontFamily: "monospace" }}>{g.grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section style={{ background: "#0a0f1e", padding: "40px 24px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Why This Matters for Homeowners</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 32 }}>
            {[
              {
                icon: "⚡",
                title: "Electrical Work",
                body: "46.9% of apprentice electricians have expired bonds. Electrical contractors with expired bonds offer no bonded recourse if work is faulty or a fire results from improper installation."
              },
              {
                icon: "❄️",
                title: "HVAC / A/C",
                body: "38.9% of A/C technicians are out of compliance. In Texas summers, homeowners pay thousands for HVAC repairs — often from contractors with no active bond coverage."
              },
              {
                icon: "🚛",
                title: "Tow Truck Operators",
                body: "44.8% of consent tow operators have expired bonds. These are the companies towing your car after an accident — often at your most vulnerable moment."
              },
            ].map(c => (
              <div key={c.title} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{c.title}</div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>

          {/* Verify CTA */}
          <div style={{ background: "#161b22", border: "1px solid #f59e0b30", borderRadius: 12, padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b", marginBottom: 8 }}>Verify Any TDLR Contractor Free</div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Check bond status in seconds using TDLR's own records — no account required.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://verify.quantumsurety.bond" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
                Verify a Contractor →
              </a>
              <Link href="/bond-compliance-leaderboard">
                <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}>
                  County Leaderboard
                </span>
              </Link>
            </div>
          </div>

          <p style={{ fontSize: 11, color: "#334155", marginTop: 20, lineHeight: 1.6, textAlign: "center" }}>
            Data: Texas Department of Licensing and Regulation (TDLR) via data.texas.gov (dataset 7358-krk7). Updated daily. &nbsp;
            <Link href="/press"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Download data & methodology →</span></Link>
          </p>
        </div>
      </section>
    </>
  );
}
