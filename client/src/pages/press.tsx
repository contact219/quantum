import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

const BOND_WATCH_API = "https://verify.quantumsurety.bond/api/bond-watch";

interface Summary {
  total_contractors: number;
  expired: number;
  expiring_30d: number;
  expiring_90d: number;
  last_updated: string;
}

export default function Press() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch(`${BOND_WATCH_API}/summary`)
      .then(r => r.json())
      .then(d => setSummary(d))
      .catch(() => {});
  }, []);

  const total = summary?.total_contractors?.toLocaleString() ?? "775,000+";
  const expired = summary?.expired?.toLocaleString() ?? "226,767";
  const pct = summary ? ((summary.expired / summary.total_contractors) * 100).toFixed(1) : "29.3";

  const title = "Press Kit — Texas Contractor Bond Compliance Data | Quantum Surety";
  const description = "Press kit, data downloads, API access, and media contact for Quantum Surety's Texas contractor bond compliance research. Live data from TDLR updated daily.";

  const worstCounties = [
    { county: "Starr", pct: "34.4", n: "1,021" },
    { county: "Jefferson", pct: "34.2", n: "2,557" },
    { county: "Presidio", pct: "34.1", n: "122" },
    { county: "San Patricio", pct: "33.8", n: "590" },
    { county: "Bailey", pct: "33.6", n: "47" },
    { county: "Hidalgo", pct: "32.4", n: "9,969" },
    { county: "Webb", pct: "32.1", n: "2,107" },
    { county: "Cameron", pct: "31.8", n: "5,344" },
  ];

  const tweetText = `🚨 ${pct}% of Texas licensed contractors have EXPIRED surety bonds — public TDLR data. See every county ranked: https://quantumsurety.bond/bond-compliance-leaderboard #Texas #HomeImprovement`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://quantumsurety.bond/press" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://quantumsurety.bond/press" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "52px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            FOR JOURNALISTS & RESEARCHERS
          </div>
          <h1 style={{ fontSize: "clamp(24px,4.5vw,40px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 14px" }}>
            Press Kit & Data Resources
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Live data, API access, methodology, and media contact for coverage of Texas contractor bond compliance.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:contact@quantumsurety.bond" style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>
              Media Contact →
            </a>
            <a href="https://verify.quantumsurety.bond/api/bond-watch/counties" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
              Download County Data (JSON) →
            </a>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section style={{ background: "#0d1117", padding: "40px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Key Statistics (Updated Daily)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Texas Contractors Tracked", value: total, note: "TDLR-licensed trades" },
              { label: "Currently Expired Bonds", value: expired, note: "Out of compliance today", color: "#dc2626" },
              { label: "Overall Lapsed Rate", value: `${pct}%`, note: "Of all Texas licensees", color: "#f97316" },
              { label: "Expiring in 30 Days", value: summary?.expiring_30d?.toLocaleString() ?? "~18,000", note: "Additional risk window", color: "#d97706" },
            ].map(s => (
              <div key={s.label} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color || "#e2e8f0", fontFamily: "monospace" }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.note}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Worst-Performing Counties by Lapsed Rate</h2>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, overflow: "hidden", marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "8px 16px", fontSize: 10, fontFamily: "monospace", color: "#475569", letterSpacing: 2, borderBottom: "1px solid #21262d" }}>
              <span>COUNTY</span><span style={{ textAlign: "right" }}>EXPIRED</span><span style={{ textAlign: "right" }}>% LAPSED</span>
            </div>
            {worstCounties.map((c, i) => (
              <div key={c.county} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "10px 16px", borderBottom: i < worstCounties.length - 1 ? "1px solid #0d1117" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{c.county} County</span>
                <span style={{ textAlign: "right", fontSize: 13, fontFamily: "monospace", color: "#dc2626", fontWeight: 700 }}>{c.n}</span>
                <span style={{ textAlign: "right", fontSize: 14, fontFamily: "monospace", fontWeight: 800, color: "#dc2626" }}>{c.pct}%</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Story Angles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 32 }}>
            {[
              {
                headline: "Homeowner Risk",
                body: `Nearly 1-in-3 TDLR-licensed contractors in Texas has a lapsed surety bond. Homeowners who hire them have no bonded recourse if the contractor walks off the job or causes property damage.`
              },
              {
                headline: "TDLR Enforcement Gap",
                body: `TDLR issues and renews licenses without validating bond currency. A contractor can let their bond lapse the day after renewal and remain on the licensed-contractor database for years.`
              },
              {
                headline: "Geographic Disparity",
                body: `Border counties (Hidalgo, Cameron, Webb) and East Texas counties (Jefferson) show lapsed rates above 32% — significantly higher than Austin metro (Travis ~22%) or Dallas (~27%).`
              },
              {
                headline: "Consumer Verification Gap",
                body: `Texas has no centralized consumer tool to verify contractor bond status in real-time. Homeowners must navigate separate TDLR, SOS, and insurance databases — or use quantumsurety.bond.`
              },
            ].map(a => (
              <div key={a.headline} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b", marginBottom: 8 }}>{a.headline}</div>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API section */}
      <section style={{ background: "#161b22", padding: "40px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Live Public API — No Auth Required</h2>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Pull fresh data for your story directly. No key required. Updated daily from TDLR.</p>
          {[
            { label: "Statewide summary", url: "GET https://verify.quantumsurety.bond/api/bond-watch/summary" },
            { label: "All 254 counties ranked", url: "GET https://verify.quantumsurety.bond/api/bond-watch/counties" },
            { label: "Expiring soon in a county", url: "GET https://verify.quantumsurety.bond/api/bond-watch/expiring?county=Harris&days=30&limit=50" },
          ].map(e => (
            <div key={e.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>{e.label}</div>
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "#4C9AC9", cursor: "pointer", wordBreak: "break-all" }}
                onClick={() => navigator.clipboard?.writeText(e.url.replace("GET ", "")).catch(() => {})}>
                {e.url}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>curl example</div>
            <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "#4C9AC9" }}>
              curl https://verify.quantumsurety.bond/api/bond-watch/summary | jq .
            </div>
          </div>
        </div>
      </section>

      {/* Share / interactive tools */}
      <section style={{ background: "#0d1117", padding: "40px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Interactive Tools for Your Coverage</h2>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Link, embed, or share these tools alongside your story.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { label: "County Leaderboard", href: "https://quantumsurety.bond/bond-compliance-leaderboard", desc: "All 254 counties ranked — shareable, sortable, live data" },
              { label: "Texas Bond Watch", href: "https://quantumsurety.bond/texas-bond-watch", desc: "Searchable county-by-county breakdown tool" },
              { label: "Contractor Verifier", href: "https://verify.quantumsurety.bond", desc: "Public search: look up any TDLR contractor's bond status" },
            ].map(t => (
              <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer"
                style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "16px 18px", textDecoration: "none", display: "block" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>{t.label} →</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{t.desc}</div>
              </a>
            ))}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Ready-to-Share Tweet</h3>
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6, margin: "0 0 12px", fontStyle: "italic" }}>
              "{tweetText}"
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", background: "#1d9bf0", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 7, textDecoration: "none" }}>
                Post on X →
              </a>
              <button onClick={() => navigator.clipboard?.writeText(tweetText).catch(() => {})}
                style={{ background: "#161b22", border: "1px solid #30363d", color: "#94a3b8", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 7, cursor: "pointer" }}>
                Copy Text
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section style={{ background: "#161b22", padding: "40px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Methodology & Data Source</h2>
          <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>
            <p><strong style={{ color: "#e2e8f0" }}>Primary source:</strong> Texas Department of Licensing and Regulation (TDLR) public dataset via data.texas.gov (Socrata dataset ID: 7358-krk7). This dataset includes all TDLR-licensed trades — electrical, HVAC, plumbing, AC/refrigeration, and others — covering 816,000+ active license records.</p>
            <p><strong style={{ color: "#e2e8f0" }}>Bond expiration:</strong> Each license record includes a bond expiration date. We flag a contractor as "expired" when <code style={{ background: "#0d1117", padding: "1px 5px", borderRadius: 3, color: "#4C9AC9" }}>bond_expiry_date &lt; TODAY()</code> and the license status is still active or pending renewal. Contractors without a bond expiry date on file are excluded from the expired count.</p>
            <p><strong style={{ color: "#e2e8f0" }}>Update frequency:</strong> Data is re-downloaded from TDLR's Socrata API daily. There is a maximum 24-hour lag between TDLR's records and what appears on this site.</p>
            <p><strong style={{ color: "#e2e8f0" }}>County assignment:</strong> Based on the county field in the TDLR license record (business address county of record).</p>
            <p><strong style={{ color: "#e2e8f0" }}>Not included:</strong> Contractors licensed under other state agencies (TREC, TSBPE, TCEQ) who are not TDLR licensees. The 29.3% figure applies only to the TDLR universe.</p>
            <p><strong style={{ color: "#e2e8f0" }}>Data requests:</strong> County-level CSV exports, time-series data, or custom cuts available on request — email contact@quantumsurety.bond.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ background: "#0a0f1e", padding: "40px 24px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Media Contact</h2>
            <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 2 }}>
              <div><strong style={{ color: "#e2e8f0" }}>Quantum Surety LLC</strong></div>
              <div>Texas-Licensed Surety Bond Agency</div>
              <div>TDI License #3480229</div>
              <div style={{ marginTop: 8 }}><a href="mailto:contact@quantumsurety.bond" style={{ color: "#f59e0b", textDecoration: "none" }}>contact@quantumsurety.bond</a></div>
              <div>(214) 666-8718</div>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Quick Links</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "County Leaderboard", href: "/bond-compliance-leaderboard" },
                { label: "Texas Bond Watch", href: "/texas-bond-watch" },
                { label: "Contractor Verifier", href: "https://verify.quantumsurety.bond" },
                { label: "API Documentation", href: "https://verify.quantumsurety.bond/api-docs.html" },
              ].map(l => (
                l.href.startsWith("http") ?
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#4C9AC9", textDecoration: "none" }}>{l.label} →</a> :
                  <Link key={l.label} href={l.href}><span style={{ fontSize: 13, color: "#4C9AC9", cursor: "pointer" }}>{l.label} →</span></Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
