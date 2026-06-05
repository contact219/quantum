import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle, ArrowRight, Zap, Shield, Database, Code } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    limit: "500 lookups/month",
    features: ["Notary bond status", "Contractor license status", "JSON response", "X-API-Key auth"],
    cta: "Get Free Key",
    ctaStyle: "border border-gray-300 text-gray-900 hover:bg-gray-50",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$99",
    per: "/ month",
    limit: "10,000 lookups/month",
    features: ["Everything in Free", "10,000 lookups/month", "SLA: 99.9% uptime", "Email support"],
    cta: "Start Free Trial",
    ctaStyle: "bg-amber-500 text-black hover:bg-amber-400 font-bold",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$299",
    per: "/ month",
    limit: "100,000 lookups/month",
    features: ["Everything in Starter", "100,000 lookups/month", "Webhook notifications", "Priority support"],
    cta: "Get Pro",
    ctaStyle: "bg-indigo-600 text-white hover:bg-indigo-500 font-bold",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    limit: "Unlimited",
    features: ["Unlimited lookups", "Dedicated SLA", "Custom data exports", "Account manager"],
    cta: "Contact Sales",
    ctaStyle: "border border-indigo-300 text-indigo-700 hover:bg-indigo-50",
    highlight: false,
  },
];

const SAMPLE = `// Verify a Texas notary bond
const res = await fetch(
  'https://verify.quantumsurety.bond/api/v1/notary/133749167',
  { headers: { 'X-API-Key': 'qsb_your_key_here' } }
);
const bond = await res.json();

// Response:
{
  "notary_id": "133749167",
  "name": "Jane Smith",
  "status": "ACTIVE",
  "expire_date": "2028-03-15",
  "days_remaining": 651,
  "surety_company": "RLI Insurance",
  "city": "Austin",
  "qs_score": 94,
  "api_requests_remaining": 9847
}`;

export default function ApiAccess() {
  const [form, setForm] = useState({ name: "", email: "", company: "", use_case: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://verify.quantumsurety.bond/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
    } catch (_) {}
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Bond Verification API — Texas Notary & Contractor Data | Quantum Surety</title>
        <meta name="description" content="Real-time Texas notary and contractor bond verification API. 504,000+ notaries, 19,000+ contractors. Used by title companies, lenders, and background check firms. Free tier available." />
        <link rel="canonical" href="https://quantumsurety.bond/api-access" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            BOND VERIFICATION API
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Real-Time Texas Bond<br />Verification API
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 32px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Instantly verify notary bonds and contractor licenses against live TX SOS and TDLR records.
            504,000+ notaries · 19,000+ contractors · Updated daily.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#get-key" style={{ background: "#f59e0b", color: "#000", padding: "14px 32px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              Get Free API Key →
            </a>
            <a href="#docs" style={{ background: "transparent", color: "#e2e8f0", padding: "14px 32px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1px solid #334155" }}>
              View Docs
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#161b22", borderBottom: "1px solid #21262d", padding: "32px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 24, textAlign: "center" }}>
          {[
            { v: "504,678", l: "TX Notaries" },
            { v: "19,000+", l: "TX Contractors" },
            { v: "Daily", l: "Data Refresh" },
            { v: "<100ms", l: "Avg Response" },
            { v: "99.9%", l: "Uptime SLA" },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{s.v}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section style={{ padding: "64px 24px", background: "#0a0f1e" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 40 }}>Built for Texas Title &amp; Mortgage</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {[
              { icon: "🏠", title: "Title Companies", body: "Verify notary bonds on every closing automatically. Flag expired or expiring bonds before documents are signed." },
              { icon: "🏦", title: "Mortgage Servicers", body: "Confirm loan signing agents hold active bonds. Integrate into your closing workflow via REST API." },
              { icon: "🔍", title: "Background Check Firms", body: "Add Texas bond verification to your screening reports. One API covers notaries and TDLR contractors." },
              { icon: "🏗️", title: "General Contractors", body: "Verify subcontractor bonds before hiring. Automated checks via webhook on bond expiry." },
            ].map(u => (
              <div key={u.title} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{u.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{u.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code sample */}
      <section id="docs" style={{ padding: "64px 24px", background: "#161b22" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Simple REST API</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>One endpoint. Pass your API key as a header. Get bond status in milliseconds.</p>
          <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: 24, overflowX: "auto" }}>
            <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "#4C9AC9", whiteSpace: "pre-wrap" }}>{SAMPLE}</pre>
          </div>
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[
              { e: "GET /api/v1/notary/:id", d: "Notary bond by TX SOS ID" },
              { e: "GET /api/v1/contractor/:num", d: "Contractor by TDLR license #" },
              { e: "GET /api/v1/status", d: "API health + record counts" },
            ].map(ep => (
              <div key={ep.e} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: 12 }}>
                <code style={{ fontSize: 11, color: "#f59e0b", display: "block", marginBottom: 4 }}>{ep.e}</code>
                <span style={{ fontSize: 12, color: "#64748b" }}>{ep.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "64px 24px", background: "#0a0f1e" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 8 }}>Simple Pricing</h2>
          <p style={{ color: "#64748b", textAlign: "center", marginBottom: 40 }}>Start free. Scale as your lookup volume grows.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                background: plan.highlight ? "#1e2a3a" : "#161b22",
                border: plan.highlight ? "2px solid #f59e0b" : "1px solid #21262d",
                borderRadius: 12, padding: 24,
                position: "relative"
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#000", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 20, letterSpacing: 1 }}>MOST POPULAR</div>
                )}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", margin: "0 0 8px" }}>{plan.name}</h3>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>{plan.price}<span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>{plan.per}</span></div>
                <div style={{ fontSize: 12, color: "#f59e0b", marginBottom: 20 }}>{plan.limit}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#22c55e", marginTop: 1 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={plan.name === "Enterprise" ? "mailto:api@quantumsurety.bond" : "#get-key"}
                  style={{ display: "block", textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 14, textDecoration: "none", background: plan.highlight ? "#f59e0b" : "transparent", color: plan.highlight ? "#000" : "#e2e8f0", border: plan.highlight ? "none" : "1px solid #334155" }}>
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-up form */}
      <section id="get-key" style={{ padding: "64px 24px", background: "#161b22" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Get Your Free API Key</h2>
          <p style={{ color: "#64748b", marginBottom: 32 }}>500 free lookups/month. No credit card required. Key delivered by email in seconds.</p>
          {submitted ? (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <h3 style={{ color: "#22c55e", marginBottom: 8 }}>Check your email</h3>
              <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>Your API key is on its way. If you need higher limits, reply to that email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { name: "name",     label: "YOUR NAME",    placeholder: "Jane Smith",           required: true },
                { name: "email",    label: "WORK EMAIL",   placeholder: "jane@titleco.com",     required: true },
                { name: "company",  label: "COMPANY",      placeholder: "First American Title", required: false },
                { name: "use_case", label: "HOW YOU'LL USE IT", placeholder: "Verify notary bonds at closing", required: false },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ display: "block", fontSize: 10, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{field.label}</label>
                  <input
                    type={field.name === "email" ? "email" : "text"}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={(form as any)[field.name]}
                    onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                    style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "12px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ background: "#f59e0b", color: "#000", border: "none", borderRadius: 8, padding: "14px 0", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Sending..." : "Get My Free API Key →"}
              </button>
              <p style={{ fontSize: 11, color: "#475569", textAlign: "center", margin: 0 }}>
                No spam. No credit card. Upgrade anytime to remove limits.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
