import { useState } from "react";
import { Helmet } from "react-helmet-async";

const VERIFY_BASE = "https://verify.quantumsurety.bond";

export default function BadgePage() {
  const [tab, setTab] = useState<"notary" | "contractor">("notary");
  const [id, setId] = useState("");
  const [preview, setPreview] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    if (!id.trim()) return;
    setChecking(true);
    const type = tab;
    const badgeUrl = `${VERIFY_BASE}/api/badge/${type}/${encodeURIComponent(id.trim())}`;
    setPreview(badgeUrl);
    setChecking(false);
  }

  const embedCode = preview
    ? `<a href="${VERIFY_BASE}/verify/${tab}/${encodeURIComponent(id.trim())}" target="_blank" rel="noopener">\n  <img src="${preview}" alt="Bond Verified by Quantum Surety" width="280" height="56">\n</a>`
    : "";

  return (
    <>
      <Helmet>
        <title>Free Bond Verification Badge — Texas Contractors & Notaries | Quantum Surety</title>
        <meta name="description" content="Get a free live bond status badge for your Texas contractor or notary website. Updates daily from TDLR and TX SOS — shows your bond as Active, Expiring, or Lapsed." />
        <link rel="canonical" href="https://quantumsurety.bond/badge" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            FREE FOR ALL TEXAS LICENSEES
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Show Your Bond Status<br />on Your Website
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.6 }}>
            One line of code. Live data from TDLR and Texas SOS. Any licensed Texas contractor or notary can embed this free badge — it updates automatically when your bond status changes.
          </p>
          {/* Live badge preview */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            <img src={`${VERIFY_BASE}/api/badge/notary/10000125`} alt="Active badge example" width={280} height={56} style={{ borderRadius: 6 }} />
          </div>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>Live badge — updates daily</div>
        </div>
      </section>

      {/* Generator */}
      <section style={{ background: "#0d1117", padding: "48px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 24, textAlign: "center" }}>Get Your Badge</h2>

          {/* Tab switch */}
          <div style={{ display: "flex", background: "#161b22", borderRadius: 8, padding: 4, marginBottom: 24 }}>
            {(["notary", "contractor"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setPreview(""); setId(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                  background: tab === t ? "#f59e0b" : "transparent",
                  color: tab === t ? "#000" : "#8b949e" }}>
                {t === "notary" ? "Texas Notary" : "Texas Contractor"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <input
              type="text"
              value={id}
              onChange={e => setId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder={tab === "notary" ? "Enter your Notary ID (e.g. 10000125)" : "Enter your TDLR License # (e.g. TACL12345)"}
              style={{ flex: 1, background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "12px 16px", color: "#e6edf3", fontSize: 14 }}
            />
            <button onClick={handleCheck} disabled={checking || !id.trim()}
              style={{ background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
              {checking ? "Loading…" : "Get Badge →"}
            </button>
          </div>

          {preview && (
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: 24 }}>
              <div style={{ fontSize: 11, color: "#8b949e", fontFamily: "monospace", marginBottom: 12 }}>PREVIEW</div>
              <div style={{ marginBottom: 20 }}>
                <img src={preview} alt="Your bond badge" width={280} height={56} style={{ borderRadius: 6 }} />
              </div>
              <div style={{ fontSize: 11, color: "#8b949e", fontFamily: "monospace", marginBottom: 8 }}>EMBED CODE — paste into your website</div>
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "12px 16px", fontFamily: "monospace", fontSize: 11, color: "#4C9AC9", whiteSpace: "pre-wrap", wordBreak: "break-all", cursor: "pointer" }}
                onClick={() => navigator.clipboard?.writeText(embedCode).catch(() => {})}
                title="Click to copy">
                {embedCode}
              </div>
              <p style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>Click the code to copy · Badge updates daily from state databases</p>
              <div style={{ marginTop: 16 }}>
                <a href={`${VERIFY_BASE}/verify/${tab}/${encodeURIComponent(id.trim())}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(245,158,11,0.3)" }}>
                  View Verification Page →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#161b22", padding: "48px 24px", borderTop: "1px solid #30363d" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 24, textAlign: "center" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { n: "1", title: "Enter your ID", body: "Type your Texas Notary ID or TDLR license number above. No account required." },
              { n: "2", title: "Copy the embed code", body: "One snippet of HTML. Paste it anywhere on your website, email signature, or Linktree." },
              { n: "3", title: "Your badge updates automatically", body: "We pull data daily from TDLR and Texas SOS. Your badge always shows your current bond status." },
            ].map(s => (
              <div key={s.n} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#f59e0b", fontFamily: "monospace", marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Website Widget for third-party sites */}
      <section style={{ background: "#0a0f1e", padding: "56px 24px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 16 }}>
            FOR WEBSITES & LISTING PLATFORMS
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Embed a Live Bond Lookup on Your Site</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, marginBottom: 28, maxWidth: 620 }}>
            Real estate agents, HOA boards, permit offices, and property managers can embed a live Texas bond verification widget — one line of code, searches all 775,000+ licensed contractors and notaries in real time.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 20, marginBottom: 32 }}>
            {[
              { icon: "🏘️", title: "HOA Websites", body: "Let homeowners verify contractor bonds before approving work on common areas." },
              { icon: "🏡", title: "Realtor & Title Sites", body: "Add instant bond verification for contractors involved in transactions." },
              { icon: "🏛️", title: "City & County Offices", body: "Give permit applicants a one-click bond status check." },
              { icon: "🔨", title: "Contractor Platforms", body: "Thumbtack, Angi, and marketplace sites can show live bond status next to every listing." },
            ].map(item => (
              <div key={item.title} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{item.body}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#8b949e", fontFamily: "monospace", marginBottom: 10 }}>EMBED CODE — paste anywhere on your website:</div>
            <div style={{ background: "#010409", border: "1px solid #21262d", borderRadius: 6, padding: "14px 16px", fontFamily: "monospace", fontSize: 12, color: "#4C9AC9", cursor: "pointer", wordBreak: "break-all" }}
              onClick={() => navigator.clipboard?.writeText('<script src="https://verify.quantumsurety.bond/widget.js"></script>').catch(() => {})}
              title="Click to copy">
              {'<script src="https://verify.quantumsurety.bond/widget.js"></script>'}
            </div>
            <p style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>Click to copy · No API key required · CORS-enabled · Works on any site</p>
          </div>
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#8b949e", fontFamily: "monospace", marginBottom: 8 }}>OPTIONAL ATTRIBUTES:</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#4C9AC9", lineHeight: 1.8 }}>
              {'data-type="notary"        — show only notary search'}<br />
              {'data-type="contractor"    — show only contractor search'}<br />
              {'data-type="both"          — show both (default)'}<br />
              {'data-theme="light"        — use light color scheme'}
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#475569" }}>
            Want to add a county-level stats widget instead? Use:{" "}
            <code style={{ color: "#4C9AC9" }}>{'<script src="https://verify.quantumsurety.bond/county-stats.js?county=harris"></script>'}</code>
          </p>
        </div>
      </section>

      {/* Why contractors use it */}
      <section style={{ background: "#0d1117", padding: "48px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Why Licensed Contractors & Notaries Use It</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              "Instantly proves compliance to clients who ask",
              "Shows up on your Google Business Profile",
              "Builds trust on contractor listing sites (Thumbtack, Angi, HomeAdvisor)",
              "Alerts you when your bond is expiring so you never lapse",
              "Free forever — data is public record from TX state databases",
            ].map(b => (
              <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#059669", fontSize: 16, marginTop: 2 }}>✓</span>
                <span style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: "20px 24px", background: "#161b22", border: "1px solid #30363d", borderRadius: 10 }}>
            <p style={{ color: "#8b949e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Bond expired or expiring? <a href="https://quantumsurety.bond/get-bond" style={{ color: "#f59e0b", fontWeight: 600 }}>Renew in 2 minutes for $50 →</a>
              <span style={{ color: "#64748b" }}> — Texas Notary Bond · 4-year term · RLI Insurance (A-rated) · Same-day PDF</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
