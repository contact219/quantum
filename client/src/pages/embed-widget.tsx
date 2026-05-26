import { useState } from "react";
import { Helmet } from "react-helmet";

const EMBED_CONTRACTOR = `<!-- Texas Contractor License Verifier by Quantum Surety -->
<div data-qs-widget data-qs-type="contractor"></div>
<script src="https://verify.quantumsurety.bond/widget.js" async></script>`;

const EMBED_NOTARY = `<!-- Texas Notary Commission Verifier by Quantum Surety -->
<div data-qs-widget data-qs-type="notary"></div>
<script src="https://verify.quantumsurety.bond/widget.js" async></script>`;

const EMBED_AUTO = `<!-- Texas License Verifier (Contractor + Notary tabs) -->
<div data-qs-widget></div>
<script src="https://verify.quantumsurety.bond/widget.js" async></script>`;

export default function EmbedWidget() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <Helmet>
        <title>Free Embeddable Texas License Verifier Widget | Quantum Surety</title>
        <meta name="description" content="Add a live Texas contractor bond and notary commission verifier to your website with one line of code. Free, no API key required, covers 1.3M+ Texas licensees." />
        <link rel="canonical" href="https://quantumsurety.bond/embed-widget" />
      </Helmet>

      <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "#f1f5f9" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "60px 24px 40px", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", color: "#f59e0b", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: "0.05em" }}>
            FREE EMBED — NO API KEY
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 16px" }}>
            Add a Live Texas License Verifier to Your Website
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
            One script tag. Zero setup. Your visitors can instantly verify any Texas contractor bond or notary commission status — all 1.37 million licensees, updated daily.
          </p>
        </div>

        {/* Live preview */}
        <div style={{ maxWidth: 560, margin: "0 auto 48px", padding: "0 24px" }}>
          <div style={{ textAlign: "center", fontSize: 12, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Preview</div>
          <div data-qs-widget style={{ borderRadius: 10, overflow: "hidden" }}></div>
          <script src="https://verify.quantumsurety.bond/widget.js" async></script>
        </div>

        {/* Embed options */}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Choose Your Embed</h2>

          {[
            { key: "auto", label: "Contractor + Notary (both tabs)", code: EMBED_AUTO, badge: "Recommended" },
            { key: "contractor", label: "Contractor only", code: EMBED_CONTRACTOR },
            { key: "notary", label: "Notary only", code: EMBED_NOTARY },
          ].map(opt => (
            <div key={opt.key} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1e293b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{opt.label}</span>
                  {opt.badge && (
                    <span style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{opt.badge}</span>
                  )}
                </div>
                <button
                  onClick={() => copy(opt.key, opt.code)}
                  style={{ background: copied === opt.key ? "#16a34a" : "#f59e0b", color: copied === opt.key ? "#fff" : "#0a0f1e", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                >
                  {copied === opt.key ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre style={{ margin: 0, padding: "14px 18px", fontSize: 12, color: "#7dd3fc", overflowX: "auto", background: "transparent", fontFamily: "monospace", lineHeight: 1.6 }}>
                {opt.code}
              </pre>
            </div>
          ))}

          {/* Use cases */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "40px 0 20px" }}>Who Embeds This</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {[
              { icon: "🏠", title: "Real Estate Agents", desc: "Help buyers verify contractors before hiring for repairs or renovations" },
              { icon: "🏢", title: "Property Managers", desc: "Verify vendors and maintenance contractors before approving work orders" },
              { icon: "🔨", title: "HOA Websites", desc: "Give homeowners a one-click way to check any contractor working in the community" },
              { icon: "📰", title: "Local News Sites", desc: "Consumer tool for readers — 'Is your contractor bonded?' segment companion" },
              { icon: "⚖️", title: "Legal / Title Sites", desc: "Verify notary commissions for document execution and real estate closings" },
              { icon: "📋", title: "Contractor Directories", desc: "Display live bond status badges alongside contractor listings" },
            ].map(uc => (
              <div key={uc.title} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: "16px" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{uc.icon}</div>
                <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 14, marginBottom: 4 }}>{uc.title}</div>
                <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{uc.desc}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "40px 0 20px" }}>What the Widget Does</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              "Covers 558K+ Texas notaries",
              "Covers 816K+ TDLR contractors",
              "Live data — updated daily",
              "No API key required",
              "Zero backend setup",
              "Mobile-responsive",
              "Isolated CSS — won't break your site styles",
              "Links to full verification pages",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "#94a3b8", fontSize: 13 }}>
                <span style={{ color: "#22c55e", marginTop: 1 }}>✓</span>
                {f}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "28px 24px", marginTop: 48, textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Need a custom integration?</div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 18 }}>
              We offer a free API, bulk data exports, and white-label options for high-volume platforms.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/api-docs" style={{ background: "#f59e0b", color: "#0a0f1e", borderRadius: 7, padding: "10px 20px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                View API Docs
              </a>
              <a href="mailto:contact@quantumsurety.bond" style={{ background: "rgba(255,255,255,0.06)", color: "#e2e8f0", borderRadius: 7, padding: "10px 20px", fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1px solid #334155" }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
