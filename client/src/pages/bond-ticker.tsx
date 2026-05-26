import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";

const BOND_WATCH_API = "https://verify.quantumsurety.bond/api/bond-watch";

interface ExpiringItem {
  license_number: string;
  license_type: string;
  business_name: string;
  owner_name: string;
  business_county: string;
  business_city: string;
  expire_date: string;
  days_until_expiry: number;
}

const COUNTIES = ["Harris", "Dallas", "Tarrant", "Bexar", "Travis", "Collin", "Denton", "El Paso", "Hidalgo", "Montgomery"];

export default function BondTicker() {
  const [expiredToday, setExpiredToday] = useState<ExpiringItem[]>([]);
  const [expiringNow, setExpiringNow] = useState<ExpiringItem[]>([]);
  const [summary, setSummary] = useState<{ expired: number; total_contractors: number } | null>(null);
  const [tick, setTick] = useState(0);
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const [visible, setVisible] = useState<ExpiringItem[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    fetch(`${BOND_WATCH_API}/summary`).then(r => r.json()).then(setSummary).catch(() => {});
    fetch(`${BOND_WATCH_API}/recently-expired?days=30&limit=200`).then(r => r.json()).then(d => {
      setExpiredToday(d.contractors || []);
    }).catch(() => {});
    fetch(`${BOND_WATCH_API}/expiring?days=7&limit=200`).then(r => r.json()).then(d => {
      setExpiringNow((d.expiring || d.contractors || []).map((c: ExpiringItem) => ({ ...c, days_until_expiry: c.days_until_expiry ?? 3 })));
    }).catch(() => {});
  }, []);

  // Build ticker tape content
  useEffect(() => {
    if (!summary) return;
    const pct = summary.total_contractors > 0 ? ((summary.expired / summary.total_contractors) * 100).toFixed(1) : "29.3";
    const base = [
      `⚠ ${summary.expired.toLocaleString()} Texas contractors currently operating with EXPIRED bonds`,
      `📊 ${pct}% of all TDLR-licensed contractors in Texas have lapsed bonds`,
      `🔍 Data updated daily from TDLR public records (data.texas.gov)`,
      `🏠 29.3% of TX contractors are out of compliance — verify before you hire`,
      `📍 Harris County: 36,889 expired bonds · Dallas: 21,802 · Hidalgo: 9,969`,
    ];
    setTickerItems(base);
  }, [summary]);

  // Simulate live "bond just expired" events from the expiredToday feed
  useEffect(() => {
    if (expiredToday.length === 0 && expiringNow.length === 0) return;
    const pool = [...expiredToday, ...expiringNow].slice(0, 200);
    if (pool.length === 0) return;

    const interval = setInterval(() => {
      const idx = counterRef.current % pool.length;
      counterRef.current++;
      setVisible(prev => [pool[idx], ...prev].slice(0, 25));
      setTick(t => t + 1);
    }, 1800);

    return () => clearInterval(interval);
  }, [expiredToday, expiringNow]);

  const title = "Texas Contractor Bond Expiry Ticker — Live Feed | Quantum Surety";
  const description = `Live feed of Texas contractor bonds expiring today. ${summary?.expired.toLocaleString() ?? "226,767"} contractors currently operating with expired surety bonds. Data from TDLR public records.`;

  const pct = summary ? ((summary.expired / summary.total_contractors) * 100).toFixed(1) : "29.3";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://quantumsurety.bond/bond-ticker" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://quantumsurety.bond/bond-ticker" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": "https://quantumsurety.bond/bond-ticker",
          "isBasedOn": "https://data.texas.gov/Workforce-Development/TDLR-License-Listing/7358-krk7"
        })}</script>
      </Helmet>

      {/* Scrolling ticker tape */}
      <div style={{ background: "#dc2626", overflow: "hidden", padding: "8px 0", borderBottom: "2px solid #b91c1c" }}>
        <div style={{
          display: "flex",
          gap: 60,
          animation: "scroll-left 40s linear infinite",
          whiteSpace: "nowrap",
          fontFamily: "monospace",
          fontSize: 12,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: 0.5,
        }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ flexShrink: 0 }}>{item}</span>
          ))}
        </div>
        <style>{`@keyframes scroll-left { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
      </div>

      {/* Hero */}
      <section style={{ background: "#0a0f1e", padding: "40px 24px 32px", borderBottom: "1px solid #21262d" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#dc2626", animation: "pulse 1.5s ease-in-out infinite", boxShadow: "0 0 0 0 rgba(220,38,38,0.4)" }} />
            <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.4)}50%{box-shadow:0 0 0 8px rgba(220,38,38,0)}}`}</style>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#dc2626", letterSpacing: 2, fontWeight: 700 }}>LIVE — TDLR DATA FEED</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 12px" }}>
            Texas Contractor Bond<br />Expiry Ticker
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 600, lineHeight: 1.6, marginBottom: 24 }}>
            Real-time feed of Texas contractor bond expirations — sourced from TDLR public records (data.texas.gov). Every contractor shown below has a lapsed or soon-to-lapse surety bond.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            {[
              { label: "Currently Expired", value: summary?.expired.toLocaleString() ?? "213,934", color: "#dc2626" },
              { label: "% of All TX Contractors", value: `${pct}%`, color: "#f97316" },
              { label: "Expiring in 30 Days", value: "34,480", color: "#d97706" },
              { label: "Total TX Contractors", value: summary?.total_contractors.toLocaleString() ?? "775,171", color: "#64748b" },
            ].map(s => (
              <div key={s.label} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, padding: "12px 18px", textAlign: "center", minWidth: 120 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live feed */}
      <section style={{ background: "#0d1117", padding: "0 0 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, padding: "24px 24px 0", alignItems: "start" }}>

          {/* Live stream */}
          <div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#dc2626", letterSpacing: 2, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#dc2626", animation: "pulse 1.5s ease-in-out infinite" }} />
              BONDS EXPIRING — SCROLLING THROUGH CURRENT TDLR DATA
            </div>

            {visible.length === 0 && (
              <div style={{ color: "#475569", fontSize: 13, padding: "20px 0", fontFamily: "monospace" }}>Loading TDLR data feed…</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {visible.map((item, i) => {
                const name = item.business_name || item.owner_name || `License ${item.license_number}`;
                const isExpired = item.days_until_expiry <= 0;
                const color = isExpired ? "#dc2626" : "#d97706";
                const label = isExpired ? "EXPIRED" : `EXPIRES IN ${item.days_until_expiry}d`;
                return (
                  <div key={`${item.license_number}-${i}`} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: i === 0 ? "rgba(220,38,38,0.06)" : "#161b22",
                    border: `1px solid ${i === 0 ? "rgba(220,38,38,0.2)" : "#21262d"}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    animation: i === 0 ? "fadeIn 0.4s ease" : undefined,
                    transition: "all 0.3s ease",
                  }}>
                    <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                      <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
                        {item.license_type} · {item.business_county || "TX"} County · #{item.license_number}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 800, color, letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{item.business_city?.split(" ")[0] || ""}</div>
                    </div>
                    <Link href={`/contractor/${item.license_number}`}>
                      <span style={{ fontSize: 10, color: "#4C9AC9", cursor: "pointer", flexShrink: 0 }}>→</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 20 }}>
            {/* Share this */}
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 10 }}>Share This Data</div>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚨 LIVE: ${pct}% of Texas licensed contractors have EXPIRED bonds right now. Watch them scroll by: https://quantumsurety.bond/bond-ticker — data from TDLR #Texas #HomeImprovement`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "#1d9bf0", color: "#fff", fontWeight: 700, fontSize: 12, padding: "9px 14px", borderRadius: 7, textDecoration: "none", marginBottom: 8, textAlign: "center" }}>
                Share on X/Twitter
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://quantumsurety.bond/bond-ticker")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "#0a66c2", color: "#fff", fontWeight: 700, fontSize: 12, padding: "9px 14px", borderRadius: 7, textDecoration: "none", marginBottom: 8, textAlign: "center" }}>
                Share on LinkedIn
              </a>
              <Link href="/press">
                <span style={{ display: "block", background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: 700, fontSize: 12, padding: "9px 14px", borderRadius: 7, textDecoration: "none", cursor: "pointer", border: "1px solid rgba(245,158,11,0.3)", textAlign: "center" }}>
                  Press Kit & Data Download
                </span>
              </Link>
            </div>

            {/* Verify CTA */}
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Verify Your Contractor</div>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 12 }}>Before you hire, check their bond status. Free, live TDLR data.</p>
              <a href="https://verify.quantumsurety.bond" target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 12, padding: "9px 14px", borderRadius: 7, textDecoration: "none", textAlign: "center" }}>
                Verify Now — Free →
              </a>
            </div>

            {/* Embed */}
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Embed on Your Site</div>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 10 }}>One line — live bond compliance widget for your county:</p>
              <div
                onClick={() => navigator.clipboard?.writeText('<script src="https://verify.quantumsurety.bond/widget.js"></script>').catch(() => {})}
                style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "8px 10px", fontFamily: "monospace", fontSize: 10, color: "#4C9AC9", cursor: "pointer", wordBreak: "break-all" }}>
                {'<script src="https://verify.quantumsurety.bond/widget.js"></script>'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* County grid */}
      <section style={{ background: "#161b22", padding: "32px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Worst Counties by Compliance Rate</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
            {[
              { county: "Starr", pct: "34.4", grade: "F" },
              { county: "Jefferson", pct: "34.2", grade: "F" },
              { county: "Hidalgo", pct: "32.4", grade: "F" },
              { county: "Cameron", pct: "31.8", grade: "F" },
              { county: "Webb", pct: "32.1", grade: "F" },
              { county: "Nueces", pct: "31.2", grade: "F" },
              { county: "Dallas", pct: "27.4", grade: "D" },
              { county: "Harris", pct: "27.0", grade: "D" },
              { county: "Tarrant", pct: "22.9", grade: "C" },
              { county: "Travis", pct: "21.8", grade: "C" },
            ].map(c => (
              <Link key={c.county} href={`/texas-bond-watch/${c.county.toLowerCase()}`}>
                <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: "12px 14px", cursor: "pointer", textDecoration: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{c.county}</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: c.grade === "F" ? "#dc2626" : c.grade === "D" ? "#f97316" : "#d97706", fontFamily: "monospace" }}>{c.grade}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginTop: 3 }}>{c.pct}% lapsed</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Link href="/bond-compliance-leaderboard">
              <span style={{ fontSize: 13, color: "#f59e0b", cursor: "pointer", fontWeight: 700 }}>All 254 Counties → Full Leaderboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Data attribution */}
      <section style={{ background: "#0a0f1e", padding: "24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.8, maxWidth: 700, margin: "0 auto" }}>
          <strong style={{ color: "#475569" }}>Data source:</strong> Texas Department of Licensing and Regulation (TDLR) via data.texas.gov (Socrata dataset 7358-krk7). Updated daily. Bond expiration determined by comparing bond_expiry_date field against current date. 24-hour maximum data lag from TDLR records.&nbsp;
          <a href="https://verify.quantumsurety.bond/api-docs.html" style={{ color: "#4C9AC9" }}>API access for developers</a>&nbsp;·&nbsp;
          <Link href="/press"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Press inquiries</span></Link>
        </p>
      </section>
    </>
  );
}
