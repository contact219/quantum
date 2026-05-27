import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const LOOKUP_API = "https://verify.quantumsurety.bond/api/notary-renew";
const APPLY_BASE = "https://quantumsurety.bond/get-bond?type=notary&src=renew-page";
const NOTARY_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

interface NotaryData {
  found: boolean;
  first_name?: string;
  last_name?: string;
  city?: string;
  expire_date?: string;
  days_left?: number;
}

export default function Renew() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const emailParam = params.get("email") || "";

  const [data, setData] = useState<NotaryData | null>(null);
  const [loading, setLoading] = useState(!!emailParam);
  const [form, setForm] = useState({ name: "", email: emailParam, phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!emailParam) return;
    fetch(`${LOOKUP_API}?email=${encodeURIComponent(emailParam)}`)
      .then(r => r.json())
      .then((d: NotaryData) => { setData(d); if (d.found && d.first_name) setForm(f => ({ ...f, name: `${d.first_name} ${d.last_name || ""}`.trim() })); })
      .catch(() => setData({ found: false }))
      .finally(() => setLoading(false));
  }, [emailParam]);

  const urgent = data?.found && (data.days_left ?? 999) <= 7;
  const warning = data?.found && (data.days_left ?? 999) <= 14;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bond_type: "notary", source: "renew-page" }),
      });
    } catch (_) {}
    setSubmitted(true);
    window.location.href = NOTARY_URL;
  }

  const greeting = data?.found ? `Hi ${data.first_name || "Texas Notary"},` : "Renew Your Texas Notary Bond";
  const expDisplay = data?.found && data.expire_date ? fmtDate(data.expire_date) : null;
  const daysLeft = data?.found ? data.days_left : null;

  return (
    <>
      <Helmet>
        <title>Renew Your Texas Notary Bond — $50 Flat | Quantum Surety</title>
        <meta name="description" content="Renew your Texas Notary Public Bond online in under 2 minutes. $50 flat for a 4-year bond. RLI Insurance, same-day PDF certificate." />
        <link rel="canonical" href="https://quantumsurety.bond/renew" />
      </Helmet>

      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f59e0b", fontFamily: "monospace", marginBottom: 8 }}>QUANTUM SURETY — TEXAS BOND RENEWAL</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
              {loading ? "Looking up your bond…" : greeting}
            </h1>
            {!loading && expDisplay && (
              <div style={{ fontSize: 15, color: urgent ? "#f87171" : warning ? "#fbbf24" : "#94a3b8", marginTop: 8, lineHeight: 1.5 }}>
                {urgent && "⚠️ URGENT — "}
                Your bond expires <strong style={{ color: urgent ? "#f87171" : warning ? "#fbbf24" : "#e2e8f0" }}>{expDisplay}</strong>
                {daysLeft !== null && daysLeft <= 14 && <span> — <strong>{daysLeft} days</strong> remaining</span>}
              </div>
            )}
            {!loading && !expDisplay && (
              <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 8 }}>Renew your 4-year Texas Notary Bond in under 2 minutes.</p>
            )}
          </div>

          {/* Pricing card */}
          <div style={{ background: "#fefce8", border: "2px solid #f59e0b", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", letterSpacing: 2, marginBottom: 12 }}>YOUR RENEWAL</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 15, color: "#1e293b", fontWeight: 600 }}>4-Year Texas Notary Bond</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#059669" }}>$50</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: "#475569" }}>
              {["✅ RLI Insurance (A-rated)", "✅ Same-day issuance", "✅ Instant PDF certificate", "✅ Paper copy by mail"].map(f => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#8b949e", marginBottom: 6 }}>Full Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "10px 12px", color: "#e6edf3", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#8b949e", marginBottom: 6 }}>Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "10px 12px", color: "#e6edf3", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#8b949e", marginBottom: 6 }}>Phone</label>
                <input
                  type="tel" required value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(214) 000-0000"
                  style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "10px 12px", color: "#e6edf3", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <button
                type="submit" disabled={submitting}
                style={{ width: "100%", background: "#f59e0b", color: "#000", fontWeight: 800, fontSize: 16, padding: "14px", borderRadius: 8, border: "none", cursor: "pointer", letterSpacing: 1 }}
              >
                {submitting ? "Redirecting…" : "RENEW MY BOND — $50 →"}
              </button>
              <p style={{ fontSize: 11, color: "#8b949e", textAlign: "center", marginTop: 10 }}>Takes less than 2 minutes. No phone call needed.</p>
            </form>
          ) : (
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ color: "#e6edf3", fontWeight: 600 }}>Redirecting to secure application…</p>
            </div>
          )}

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#64748b" }}>
            Questions? Call <a href="tel:+12146668718" style={{ color: "#f59e0b" }}>(214) 666-8718</a> · <a href="https://quantumsurety.bond" style={{ color: "#64748b" }}>quantumsurety.bond</a>
          </div>
        </div>
      </div>
    </>
  );
}
