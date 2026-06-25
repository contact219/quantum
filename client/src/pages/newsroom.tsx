import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { FileText, ExternalLink, Phone, Mail } from "lucide-react";

const PRESS_RELEASES = [
  {
    date: "June 24, 2026",
    headline: "More Than 1,700 Texas Auto Dealers Operating With Expired Surety Bonds, Data Analysis Reveals",
    subhead: "Free online database lets Texans verify any dealer's bond status before signing; GDN compliance rates among worst in Texas.",
    url: "/blog/texas-auto-dealer-bond-compliance-jun2026",
    tag: "Consumer Protection",
    tagColor: "#dc2626",
  },
  {
    date: "May 27, 2026",
    headline: "Nearly Half of Texas Apprentice Electricians Have Expired Surety Bonds, TDLR Data Shows",
    subhead: "29.3% of all TDLR licensees found non-compliant statewide. New free tool lets any consumer check contractor bond status before hiring.",
    url: "/blog/texas-contractor-bond-compliance-report-2026",
    tag: "Data Report",
    tagColor: "#2563eb",
  },
];

const KEY_FACTS = [
  { stat: "816,000+", label: "TDLR contractor licenses tracked in real time" },
  { stat: "558,000+", label: "Texas notary commissions in free public database" },
  { stat: "19,700+", label: "Texas auto dealer records monitored" },
  { stat: "TDI #3480229", label: "Active Texas insurance agency license" },
  { stat: "A+ Carrier", label: "Bonds backed by RLI Insurance (A+, S&P)" },
  { stat: "254 counties", label: "All Texas counties served" },
];

const DATA_TOOLS = [
  {
    label: "TDLR Contractor Compliance by Trade",
    sub: "A–F compliance grades for 22 TDLR license categories",
    href: "/bond-compliance-by-trade",
    external: false,
  },
  {
    label: "Free Bond Verification Database",
    sub: "Look up any TX contractor, notary, or dealer bond status",
    href: "https://verify.quantumsurety.bond",
    external: true,
  },
  {
    label: "Live Bond Expiration Ticker",
    sub: "Real-time feed of Texas bonds expiring and recently lapsed",
    href: "/bond-ticker",
    external: false,
  },
  {
    label: "TX Contractor Bond Compliance Report 2026",
    sub: "Full data analysis — 29.3% of all TDLR licensees non-compliant",
    href: "/blog/texas-contractor-bond-compliance-report-2026",
    external: false,
  },
];

export default function Newsroom() {
  return (
    <>
      <Helmet>
        <title>Newsroom — Quantum Surety Press Center | Texas Surety Bond Data & Research</title>
        <meta name="description" content="Press resources, data reports, and research from Quantum Surety — Texas's leading surety bond agency tracking 816,000+ TDLR licenses and 558,000+ notary records." />
        <link rel="canonical" href="https://quantumsurety.bond/newsroom" />
      </Helmet>

      <main style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#1e293b", background: "#fff", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "#020816", color: "#fff", padding: "64px 24px 56px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#67e8f9", marginBottom: 12 }}>Newsroom</p>
            <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15, color: "#fff" }}>
              Quantum Surety Press Center
            </h1>
            <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 640, lineHeight: 1.7, margin: 0 }}>
              Texas's only surety bond agency with a live statewide compliance database —
              816,000+ contractor licenses, 558,000+ notary records, 19,700+ auto dealer records.
              Original data and research available to journalists on request.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* Media Contact */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "24px 28px", marginBottom: 40, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>Media Contact</p>
              <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>Nice Sparks — Quantum Surety LLC</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <a href="tel:2146668718" style={{ display: "flex", alignItems: "center", gap: 6, color: "#2563eb", textDecoration: "none", fontSize: 14 }}>
                <Phone size={14} /> (214) 666-8718
              </a>
              <a href="mailto:nice.shotwell-sparks@quantumsurety.bond" style={{ display: "flex", alignItems: "center", gap: 6, color: "#2563eb", textDecoration: "none", fontSize: 14 }}>
                <Mail size={14} /> nice.shotwell-sparks@quantumsurety.bond
              </a>
            </div>
          </div>

          {/* Key Facts */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#0f172a" }}>Key Facts for Editors</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
              {KEY_FACTS.map((f) => (
                <div key={f.label} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0369a1", marginBottom: 4 }}>{f.stat}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{f.label}</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 14, fontSize: 12, color: "#94a3b8" }}>
              Data sourced from Texas TDLR (data.texas.gov), Texas Secretary of State, and TxDMV public records. Updated daily.
              Raw data available to credentialed journalists on request.
            </p>
          </section>

          {/* Press Releases */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#0f172a" }}>Press Releases</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PRESS_RELEASES.map((pr) => (
                <div key={pr.headline} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 26px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: pr.tagColor, background: `${pr.tagColor}14`, border: `1px solid ${pr.tagColor}30`, borderRadius: 6, padding: "2px 10px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                      {pr.tag}
                    </span>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{pr.date}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.35 }}>{pr.headline}</h3>
                  <p style={{ fontSize: 13, color: "#475569", margin: "0 0 14px", lineHeight: 1.6 }}>{pr.subhead}</p>
                  <Link href={pr.url} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
                    <FileText size={13} /> Read full release →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Data Tools */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#0f172a" }}>Research & Data Tools</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {DATA_TOOLS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  style={{ display: "block", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{item.label}</span>
                    <ExternalLink size={12} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 2 }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{item.sub}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Boilerplate */}
          <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>About Quantum Surety LLC</h2>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75, maxWidth: 720 }}>
              Quantum Surety LLC (TDI License #3480229) is a Texas-based surety bond agency and operator of
              Texas's most comprehensive free public bond verification database. The company issues surety bonds
              same-day for contractors, notaries, auto dealers, and businesses across all 254 Texas counties,
              backed by A-rated carriers including RLI Insurance Company (A+, S&P). Quantum Surety's compliance
              database tracks 816,000+ TDLR contractor licenses, 558,000+ Texas notary commissions, and 19,700+
              Texas auto dealer records, updated daily from public state records.
            </p>
            <p style={{ marginTop: 12, fontSize: 14, color: "#475569" }}>
              <strong>Website:</strong>{" "}
              <a href="https://quantumsurety.bond" style={{ color: "#2563eb" }}>quantumsurety.bond</a>
              {" · "}
              <strong>Bond Lookup:</strong>{" "}
              <a href="https://verify.quantumsurety.bond" style={{ color: "#2563eb" }}>verify.quantumsurety.bond</a>
              {" · "}
              <strong>Phone:</strong>{" "}
              <a href="tel:2146668718" style={{ color: "#2563eb" }}>(214) 666-8718</a>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
