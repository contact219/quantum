import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Shield, Bell, FileText, ArrowRight, Star } from "lucide-react";

const FEATURES = [
  { icon: Bell,     title: "9-Touch Reminder Sequence",  body: "Alerts at 90, 60, 45, 30, 21, 14, 7, 3, and 1 day before expiry. No more scrambling at the last minute." },
  { icon: Shield,   title: "Live Bond Status Dashboard", body: "Personal URL showing your bond status, carrier, and days remaining — updated daily from TX SOS records." },
  { icon: FileText, title: "One-Click Renewal",          body: "Direct link to renew your exact bond type in one click. No searching, no re-entering your info." },
  { icon: Star,     title: "Priority Email Support",     body: "Questions about your bond? Skip the queue. Bond Guard subscribers get same-day responses." },
];

export default function BondGuard() {
  const [plan, setPlan]     = useState<"monthly" | "annual">("annual");
  const [form, setForm]     = useState({ name: "", email: "", notary_id: "", bond_type: "notary" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.name) { setError("Name and email are required."); return; }
    setLoading(true);
    try {
      const res = await fetch("https://verify.quantumsurety.bond/bond-guard/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error — please try again.");
    }
    setLoading(false);
  }

  const price    = plan === "annual" ? "$49" : "$5.99";
  const per      = plan === "annual" ? "/ year"  : "/ month";
  const savings  = plan === "annual" ? "Save 32% vs monthly" : null;

  return (
    <>
      <Helmet>
        <title>Bond Guard — Automated Texas Bond Renewal Monitoring | Quantum Surety</title>
        <meta name="description" content="Never miss a Texas bond renewal again. Bond Guard monitors your notary or contractor bond and sends 9 reminders before expiry. $49/year or $5.99/month." />
        <link rel="canonical" href="https://quantumsurety.bond/bond-guard" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 20, padding: "4px 16px", fontSize: 12, color: "#4ade80", marginBottom: 24 }}>
            <Shield size={12} /> BOND GUARD — RENEWAL PROTECTION
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
            Never Miss a Bond<br />Renewal Again
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, margin: "0 auto 36px", maxWidth: 520 }}>
            Bond Guard monitors your Texas notary or contractor bond and sends 9 automated alerts
            before expiry — so you renew on time, every time.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#subscribe" style={{ background: "#22c55e", color: "#000", padding: "15px 36px", borderRadius: 8, fontWeight: 800, fontSize: 16, textDecoration: "none" }}>
              Protect My Bond — {price}{per} →
            </a>
          </div>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 16 }}>30-day money-back guarantee · Cancel anytime</p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "64px 24px", background: "#0f172a" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 40 }}>Everything included</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 24 }}>
                <f.icon size={24} color="#22c55e" style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare */}
      <section style={{ padding: "48px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 32 }}>Free reminders vs. Bond Guard</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#64748b", fontWeight: 600 }}></th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "#64748b", fontWeight: 600 }}>Free drip emails</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "#22c55e", fontWeight: 700, background: "rgba(34,197,94,0.08)", borderRadius: 8 }}>Bond Guard</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Reminder emails", "Generic batch", "9 personalized alerts"],
                  ["Timing", "90 / 30 days", "90/60/45/30/21/14/7/3/1 days"],
                  ["Personal dashboard", "✕", "✓ Live bond status URL"],
                  ["One-click renewal", "✕", "✓ Direct to your bond"],
                  ["Priority support", "✕", "✓ Same-day response"],
                  ["Bond certificate backup", "✕", "✓ On-demand status card"],
                ].map(([feat, free, paid]) => (
                  <tr key={feat} style={{ borderBottom: "1px solid #334155" }}>
                    <td style={{ padding: "12px 16px", color: "#e2e8f0" }}>{feat}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#64748b" }}>{free}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#4ade80", fontWeight: 600, background: "rgba(34,197,94,0.05)" }}>{paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sign-up */}
      <section id="subscribe" style={{ padding: "64px 24px", background: "#0f172a" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8, textAlign: "center" }}>Subscribe to Bond Guard</h2>
          <p style={{ color: "#64748b", textAlign: "center", marginBottom: 32 }}>Starts protecting your bond immediately.</p>

          {/* Plan toggle */}
          <div style={{ display: "flex", background: "#1e293b", borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(["annual", "monthly"] as const).map(p => (
              <button key={p} onClick={() => setPlan(p)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                background: plan === p ? "#22c55e" : "transparent",
                color: plan === p ? "#000" : "#64748b",
                transition: "all 0.2s",
              }}>
                {p === "annual" ? `Annual — $49/yr ${savings ? "(Save 32%)" : ""}` : "Monthly — $5.99/mo"}
              </button>
            ))}
          </div>

          <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "name",      label: "YOUR NAME",     type: "text",   placeholder: "Jane Smith",          required: true },
              { key: "email",     label: "EMAIL ADDRESS", type: "email",  placeholder: "jane@email.com",       required: true },
              { key: "notary_id", label: "NOTARY ID (OPTIONAL — for instant setup)", type: "text", placeholder: "Your TX SOS notary ID", required: false },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 10, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.placeholder} required={f.required}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "12px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div>
              <label style={{ display: "block", fontSize: 10, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>BOND TYPE</label>
              <select value={form.bond_type} onChange={e => setForm(p => ({ ...p, bond_type: e.target.value }))}
                style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "12px 14px", color: "#f1f5f9", fontSize: 14, outline: "none" }}>
                <option value="notary">Texas Notary Bond</option>
                <option value="contractor">Texas Contractor License Bond</option>
                <option value="dealer">Texas GDN Dealer Bond</option>
                <option value="mortgage">Texas Mortgage Broker Bond</option>
                <option value="hvac">Texas HVAC Contractor Bond</option>
                <option value="plumber">Texas Plumbing Contractor Bond</option>
              </select>
            </div>

            {error && <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              background: "#22c55e", color: "#000", border: "none", borderRadius: 8,
              padding: "15px 0", fontWeight: 800, fontSize: 16, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? "Redirecting to checkout..." : `Subscribe — ${price}${per}`}
              {!loading && <ArrowRight size={18} />}
            </button>
            <p style={{ fontSize: 11, color: "#475569", textAlign: "center", margin: 0 }}>
              Powered by Stripe · 30-day money-back guarantee · Cancel anytime
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
