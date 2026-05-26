import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";

const BOND_WATCH_API = "https://verify.quantumsurety.bond/api/bond-watch";

const COUNTIES = [
  { slug: "harris", name: "Harris County (Houston)" },
  { slug: "dallas", name: "Dallas County" },
  { slug: "tarrant", name: "Tarrant County (Fort Worth)" },
  { slug: "bexar", name: "Bexar County (San Antonio)" },
  { slug: "travis", name: "Travis County (Austin)" },
  { slug: "collin", name: "Collin County (McKinney/Plano)" },
  { slug: "denton", name: "Denton County" },
  { slug: "el-paso", name: "El Paso County" },
  { slug: "hidalgo", name: "Hidalgo County (McAllen)" },
  { slug: "fort-bend", name: "Fort Bend County" },
];

const COUNTY_NAME_MAP: Record<string, string> = {
  harris: "Harris", dallas: "Dallas", tarrant: "Tarrant", bexar: "Bexar",
  travis: "Travis", collin: "Collin", denton: "Denton",
  "el-paso": "El Paso", hidalgo: "Hidalgo", "fort-bend": "Fort Bend",
};

function fmt(n: number | string) {
  return Number(n).toLocaleString();
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Summary {
  notaries: { total: number; expiring_30d: number; expiring_90d: number; expired: number };
  contractors: { total: number; expiring_30d: number; expiring_90d: number; expired: number };
  generated_at: string;
}
interface ExpiringRecord {
  license_number: string;
  license_type: string;
  business_name: string;
  owner_name: string;
  business_city: string;
  business_county: string;
  expire_date: string;
}

export default function TexasBondWatch() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [selectedCounty, setSelectedCounty] = useState("harris");
  const [expiring, setExpiring] = useState<ExpiringRecord[]>([]);
  const [loadingExpiring, setLoadingExpiring] = useState(false);
  const week = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  useEffect(() => {
    fetch(`${BOND_WATCH_API}/summary`)
      .then(r => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoadingExpiring(true);
    const county = COUNTY_NAME_MAP[selectedCounty] || "Harris";
    fetch(`${BOND_WATCH_API}/expiring?county=${encodeURIComponent(county)}&days=30&limit=25`)
      .then(r => r.json())
      .then(d => { setExpiring(d.expiring || []); setLoadingExpiring(false); })
      .catch(() => setLoadingExpiring(false));
  }, [selectedCounty]);

  return (
    <>
      <Helmet>
        <title>Texas Bond Watch — Contractor & Notary Bond Expiration Alerts | Quantum Surety</title>
        <meta name="description" content={`Live tracking of Texas contractor and notary bond expirations. ${summary ? fmt(summary.contractors.expiring_30d) + " Texas contractors have bonds expiring in the next 30 days." : "Protect your business — verify bond status before hiring."}`} />
        <meta property="og:title" content="Texas Bond Watch — Live Bond Expiration Tracker" />
        <meta property="og:description" content="Real-time Texas contractor and notary bond status. Updated daily from state licensing databases." />
        <meta property="og:url" content="https://quantumsurety.bond/texas-bond-watch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Texas Bond Watch — Live Bond Expiration Tracker" />
        <meta name="twitter:description" content="Real-time tracking of 775K+ Texas contractor and notary bond expirations. Updated daily from TDLR and Texas SOS." />
        <link rel="canonical" href="https://quantumsurety.bond/texas-bond-watch" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Texas Bond Watch",
          "url": "https://quantumsurety.bond/texas-bond-watch",
          "description": "Free real-time tracker of Texas contractor and notary bond expirations, updated daily from TDLR and Texas Secretary of State databases.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "provider": {
            "@type": "Organization",
            "name": "Quantum Surety LLC",
            "url": "https://quantumsurety.bond",
            "telephone": "+12146668718",
            "address": { "@type": "PostalAddress", "addressState": "TX", "addressCountry": "US" }
          },
          "about": {
            "@type": "Dataset",
            "name": "Texas Contractor & Notary Bond Expiration Data",
            "description": "Bond expiration records for 775,000+ TDLR-licensed Texas contractors and 558,000+ Texas notaries, sourced from public state databases.",
            "creator": { "@type": "Organization", "name": "Quantum Surety LLC" },
            "spatialCoverage": "Texas, USA",
            "temporalCoverage": "2024/..",
            "license": "https://data.texas.gov/License"
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            TEXAS BOND WATCH — LIVE DATA
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Texas Contractor Bond<br />Expiration Tracker
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 600, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Live tracking of Texas contractor and notary bond expirations — updated daily from TDLR and Texas SOS databases.
            Know before you hire.
          </p>
          {summary && (
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "14px 24px", marginBottom: 24, display: "inline-block" }}>
              <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 18 }}>{fmt(summary.contractors.expiring_30d)}</span>
              <span style={{ color: "#94a3b8", fontSize: 14, marginLeft: 8 }}>Texas contractors have bonds expiring in the next 30 days</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/get-bond">
              <a style={{ display: "inline-block", background: "#f59e0b", color: "#000", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: 1 }}>
                Get Bonded Instantly →
              </a>
            </Link>
            <a href="https://verify.quantumsurety.bond" style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              Verify a Bond →
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${summary ? fmt(summary.contractors.expiring_30d) : "34,480"} Texas contractors have bonds expiring in the next 30 days — is yours one of them? Free real-time tracker: https://quantumsurety.bond/texas-bond-watch #Texas #contractors`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#1DA1F2", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}
            >
              𝕏 Share This Data
            </a>
          </div>
        </div>
      </section>

      {/* Statewide stats */}
      <section style={{ background: "#0d1117", padding: "40px 24px", borderBottom: "1px solid #21262d" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20, textAlign: "center" }}>
            STATEWIDE SNAPSHOT — Week of {week}
          </div>
          {summary ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              {[
                { label: "TX Contractors Tracked", value: fmt(summary.contractors.total), color: "#4C9AC9" },
                { label: "Contractor Bonds Expiring (30d)", value: fmt(summary.contractors.expiring_30d), color: "#f59e0b" },
                { label: "Contractor Bonds Expiring (90d)", value: fmt(summary.contractors.expiring_90d), color: "#fbbf24" },
                { label: "TX Notaries Tracked", value: fmt(summary.notaries.total), color: "#4C9AC9" },
                { label: "Notary Bonds Expiring (30d)", value: fmt(summary.notaries.expiring_30d), color: "#f59e0b" },
                { label: "Notary Bonds Expired", value: fmt(summary.notaries.expired), color: "#f87171" },
              ].map(s => (
                <div key={s.label} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color, fontFamily: "'Bebas Neue',cursive", letterSpacing: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#8b949e", marginTop: 4, fontFamily: "monospace", letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#8b949e", padding: 40 }}>Loading statewide data…</div>
          )}
        </div>
      </section>

      {/* County drilldown */}
      <section style={{ background: "#0d1117", padding: "40px 24px 56px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            Bonds Expiring This Month — By County
          </h2>
          <p style={{ color: "#8b949e", fontSize: 14, marginBottom: 24 }}>
            Contractors whose bonds expire in the next 30 days. These businesses need to renew immediately to stay compliant.
          </p>

          {/* County tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {COUNTIES.map(c => (
              <button key={c.slug} onClick={() => setSelectedCounty(c.slug)}
                style={{ padding: "7px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "monospace",
                  background: selectedCounty === c.slug ? "#f59e0b" : "#161b22",
                  color: selectedCounty === c.slug ? "#000" : "#8b949e",
                  border: "1px solid " + (selectedCounty === c.slug ? "#f59e0b" : "#30363d"),
                  fontWeight: selectedCounty === c.slug ? 700 : 400 }}>
                {c.name.split(" (")[0]}
              </button>
            ))}
          </div>

          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #30363d", fontSize: 12, color: "#8b949e", fontFamily: "monospace", display: "flex", justifyContent: "space-between" }}>
              <span>{loadingExpiring ? "Loading…" : `${expiring.length} contractors with bonds expiring in ${COUNTY_NAME_MAP[selectedCounty] || ""} County within 30 days`}</span>
              <Link href="/get-bond?type=contractor"><a style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 700 }}>Renew Your Bond →</a></Link>
            </div>
            {!loadingExpiring && expiring.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#0d1117" }}>
                      {["License #", "Type", "Business / Owner", "City", "Expires"].map(h => (
                        <th key={h} style={{ padding: "8px 14px", textAlign: "left", color: "#8b949e", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expiring.map((r, i) => {
                      const daysLeft = Math.floor((new Date(r.expire_date).getTime() - Date.now()) / 86400000);
                      const urgent = daysLeft <= 7;
                      return (
                        <tr key={r.license_number + i} style={{ borderTop: "1px solid #21262d", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                          <td style={{ padding: "9px 14px", color: "#4C9AC9", fontFamily: "monospace" }}>{r.license_number}</td>
                          <td style={{ padding: "9px 14px", color: "#e6edf3", maxWidth: 180 }}>{r.license_type}</td>
                          <td style={{ padding: "9px 14px", color: "#e6edf3", fontWeight: 600 }}>{r.business_name || r.owner_name}</td>
                          <td style={{ padding: "9px 14px", color: "#8b949e" }}>{r.business_city || "—"}</td>
                          <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
                            <span style={{ color: urgent ? "#f87171" : "#fbbf24", fontFamily: "monospace", fontWeight: 700 }}>{fmtDate(r.expire_date)}</span>
                            {urgent && <span style={{ marginLeft: 6, fontSize: 9, background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 4, padding: "2px 6px" }}>URGENT</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!loadingExpiring && expiring.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", color: "#8b949e", fontSize: 13 }}>No expiring bonds found for this county in the next 30 days.</div>
            )}
          </div>
        </div>
      </section>

      {/* Embed CTA */}
      <section style={{ background: "#161b22", padding: "48px 24px", borderTop: "1px solid #30363d" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 12 }}>FREE TOOL FOR YOUR WEBSITE</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Add Bond Verification to Your Site</h2>
          <p style={{ color: "#8b949e", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            Title companies, real estate offices, and property managers — add a free bond verification widget to your website in 30 seconds. No account required.
          </p>
          <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "16px 20px", textAlign: "left", maxWidth: 560, margin: "0 auto 24px", fontFamily: "monospace", fontSize: 13, color: "#4C9AC9", overflowX: "auto" }}>
            {"<script src=\"https://verify.quantumsurety.bond/widget.js\"></script>"}
          </div>
          <a href="https://verify.quantumsurety.bond" style={{ display: "inline-block", background: "#f59e0b", color: "#000", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Learn More →
          </a>
        </div>
      </section>

      {/* SEO content */}
      <section style={{ background: "#0d1117", padding: "48px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Why Bond Status Matters</h2>
          <p style={{ color: "#8b949e", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            In Texas, most licensed contractors are required to carry a surety bond. A lapsed bond means the contractor is operating
            out of compliance — and you may have no recourse if something goes wrong on your project.
          </p>
          <p style={{ color: "#8b949e", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            Texas Bond Watch tracks over 775,000 licensed contractors and 558,000 commissioned notaries across the state, updated
            daily from TDLR and the Texas Secretary of State office. We surface bonds expiring in the next 30–90 days so contractors
            can renew on time and consumers can hire with confidence.
          </p>
          <p style={{ color: "#8b949e", lineHeight: 1.8, fontSize: 15 }}>
            Need to get or renew a bond? Quantum Surety issues same-day Texas surety bonds starting at $50. No broker, no waiting room.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link href="/get-bond">
              <a style={{ display: "inline-block", background: "#f59e0b", color: "#000", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                Get Bonded Today — Starting at $50 →
              </a>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
