import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

const GRADES = [
  { range: "85–100", grade: "A+", label: "QS Verified™", color: "#059669", bg: "rgba(5,150,105,0.08)", desc: "Active bond with 90+ days remaining, complete profile, licensed trade." },
  { range: "70–84",  grade: "A",  label: "Trusted",       color: "#16a34a", bg: "rgba(22,163,74,0.08)",   desc: "Active bond, strong profile. Recommended for most projects." },
  { range: "55–69",  grade: "B",  label: "Active",        color: "#2563eb", bg: "rgba(37,99,235,0.08)",   desc: "Active bond with some profile gaps. Acceptable." },
  { range: "40–54",  grade: "C",  label: "Compliant",     color: "#d97706", bg: "rgba(217,119,6,0.08)",   desc: "Bond expiring within 60 days or minor profile issues. Verify before hiring." },
  { range: "25–39",  grade: "D",  label: "At Risk",       color: "#ea580c", bg: "rgba(234,88,12,0.08)",   desc: "Bond expired recently. Contractor should renew immediately." },
  { range: "0–24",   grade: "F",  label: "Non-Compliant", color: "#dc2626", bg: "rgba(220,38,38,0.08)",   desc: "Bond long-expired or missing. Do not hire without verification." },
];

const FACTORS = [
  {
    icon: "🔒",
    label: "Bond Health",
    weight: "0–60 pts",
    desc: "Primary factor. A fully active bond with 6+ months remaining earns full points. Points decrease as expiration approaches, drop sharply on expiry.",
    detail: [
      ">180 days remaining: 60 pts",
      "91–180 days: 55 pts",
      "61–90 days: 50 pts",
      "31–60 days: 42 pts",
      "1–30 days: 35 pts",
      "Expired ≤30 days: 20 pts",
      "Expired 31–90 days: 10 pts",
      "Expired 91–365 days: 5 pts",
      "Expired 1+ years: 0 pts",
    ],
  },
  {
    icon: "🏅",
    label: "License Type",
    weight: "0–20 pts",
    desc: "Reflects the rigor of the credential. Higher-complexity licenses (Master Electrician, HVAC Contractor) earn more points than entry-level permits.",
    detail: [
      "Master Electrician / Electrical Contractor: 20 pts",
      "HVAC / Plumbing Contractor: 20 pts",
      "Journeyman / A/C Tech: 15 pts",
      "Apprentice / Inspector: 10 pts",
      "Other: 12 pts",
    ],
  },
  {
    icon: "📋",
    label: "Profile Completeness",
    weight: "0–20 pts",
    desc: "Contractors with complete business information (name, phone, address, city) earn up to 20 points. Incomplete records suggest less-established operations.",
    detail: [
      "Business name on file: +5 pts",
      "Business phone on file: +5 pts",
      "City on file: +5 pts",
      "Business address on file: +5 pts",
    ],
  },
];

export default function QSScore() {
  return (
    <>
      <Helmet>
        <title>QS Score™ Methodology — Texas Contractor Trust Rating | Quantum Surety</title>
        <meta name="description" content="How the QS Score works: a 0–100 trust rating for every Texas TDLR-licensed contractor. Based on bond health, license type, and profile completeness. Updated daily from public records." />
        <link rel="canonical" href="https://quantumsurety.bond/qs-score" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "60px 24px 50px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 14px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            METHODOLOGY
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            QS Score™ — The Contractor Trust Rating
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 28px" }}>
            A public 0–100 score for every Texas TDLR-licensed contractor and notary. Calculated daily from TDLR and Texas SOS public records.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/texas-bond-watch">
              <span style={{ display: "inline-block", background: "#f59e0b", color: "#0a0f1e", fontWeight: 800, fontSize: 14, padding: "11px 24px", borderRadius: 8, cursor: "pointer" }}>
                Check a Contractor's Score →
              </span>
            </Link>
            <Link href="/hoa-portal">
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.07)", color: "#e2e8f0", fontWeight: 700, fontSize: 14, padding: "11px 24px", borderRadius: 8, cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)" }}>
                HOA Vendor Portal →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 80px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#1e293b", lineHeight: 1.8 }}>

        {/* What it is */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>What is the QS Score?</h2>
        <p style={{ color: "#334155", marginBottom: 32 }}>
          The QS Score is the first publicly available trust rating for Texas licensed contractors and notaries. It's a single number — 0 to 100 — that lets homeowners, HOAs, property managers, and businesses quickly assess how "compliance-ready" a contractor is before hiring.
        </p>
        <p style={{ color: "#334155", marginBottom: 40 }}>
          Unlike a simple license lookup that only tells you whether a license exists, the QS Score reflects <strong>bond health, credential rigor, and profile completeness</strong> in a single at-a-glance rating. Scores update daily from Texas Department of Licensing and Regulation (TDLR) public records.
        </p>

        {/* Score table */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>Score Grades</h2>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 48 }}>
          {GRADES.map((g, i) => (
            <div key={g.grade} style={{ display: "grid", gridTemplateColumns: "80px 64px 140px 1fr", gap: 0, background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: i < GRADES.length - 1 ? "1px solid #e2e8f0" : "none", alignItems: "center" }}>
              <div style={{ padding: "14px 16px", fontWeight: 800, fontSize: 13, color: "#475569", fontFamily: "monospace" }}>{g.range}</div>
              <div style={{ padding: "14px 8px" }}>
                <span style={{ display: "inline-block", background: g.bg, color: g.color, border: `1px solid ${g.color}40`, borderRadius: 20, padding: "3px 12px", fontWeight: 800, fontSize: 14 }}>{g.grade}</span>
              </div>
              <div style={{ padding: "14px 8px", fontWeight: 700, color: g.color, fontSize: 13 }}>{g.label}</div>
              <div style={{ padding: "14px 16px 14px 4px", fontSize: 13, color: "#475569" }}>{g.desc}</div>
            </div>
          ))}
        </div>

        {/* Factors */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>How the Score is Calculated</h2>
        <p style={{ color: "#334155", marginBottom: 28 }}>Three factors, each weighted to reflect what actually matters for consumer protection:</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
          {FACTORS.map(f => (
            <div key={f.label} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 24px", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{f.icon} {f.label}</div>
                <div style={{ background: "#0a0f1e", color: "#f59e0b", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800, fontFamily: "monospace" }}>{f.weight}</div>
              </div>
              <p style={{ color: "#475569", fontSize: 14, marginBottom: 12 }}>{f.desc}</p>
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 16px" }}>
                {f.detail.map(d => (
                  <div key={d} style={{ fontSize: 13, color: "#334155", padding: "3px 0", borderBottom: "1px solid #f1f5f9", lineHeight: 1.5 }}>
                    · {d}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* For contractors */}
        <div style={{ background: "#0a0f1e", borderRadius: 14, padding: "32px 28px", marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b", margin: "0 0 12px" }}>For Contractors: Improve Your Score</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            The single biggest impact on your QS Score is keeping your surety bond active. An expired bond drops your score by up to 60 points and flags your profile as non-compliant to any homeowner or property manager who looks you up.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/get-bond?type=contractor">
              <span style={{ display: "inline-block", background: "#f59e0b", color: "#0a0f1e", fontWeight: 800, fontSize: 14, padding: "11px 24px", borderRadius: 8, cursor: "pointer" }}>
                Renew Bond — Raise Your Score →
              </span>
            </Link>
          </div>
        </div>

        {/* For consumers */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>For Homeowners & Property Managers</h2>
        <p style={{ color: "#334155", marginBottom: 16 }}>
          Before hiring any Texas contractor, check their QS Score at the free live lookup tool. Scores update daily from TDLR public records — so you always have the latest bond status, not a cached screenshot.
        </p>
        <p style={{ color: "#334155", marginBottom: 36 }}>
          Managing multiple vendors? The <Link href="/hoa-portal"><span style={{ color: "#2563eb", cursor: "pointer" }}>HOA Vendor Compliance Portal</span></Link> lets HOAs and property managers upload their entire vendor list and get automatic email alerts when any contractor's bond expires.
        </p>

        {/* Data note */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 28, fontSize: 13, color: "#64748b" }}>
          <strong style={{ color: "#334155" }}>Data sources:</strong> Texas Department of Licensing and Regulation (TDLR) via data.texas.gov (dataset 7358-krk7) for contractor licenses. Texas Secretary of State public records for notary commissions. Data refreshed monthly; bond status calculated daily. Quantum Surety LLC is licensed by TDI (#3480229).
        </div>
      </div>
    </>
  );
}
