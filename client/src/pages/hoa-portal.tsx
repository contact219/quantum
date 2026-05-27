import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

const API = "https://verify.quantumsurety.bond/api";

interface Vendor {
  id: number;
  license_number: string;
  license_type: "contractor" | "notary";
  vendor_label: string;
  name?: string;
  license_type_detail?: string;
  status: string;
  label: string;
  qs_score: number;
  qs_grade: string;
  qs_label: string;
  qs_color: string;
  expire_date?: string;
}

function ScoreBadge({ score, grade, color }: { score: number; grade: string; color: string }) {
  const circumference = 2 * Math.PI * 28;
  const dash = (score / 100) * circumference;
  return (
    <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
      <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="34" cy="34" r="28" fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="34" cy="34" r="28" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 17, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, fontWeight: 800, color, opacity: 0.8 }}>{grade}</div>
      </div>
    </div>
  );
}

function StatusPill({ status, label }: { status: string; label: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    active:   { bg: "#dcfce7", color: "#166534" },
    expiring: { bg: "#fef9c3", color: "#854d0e" },
    expired:  { bg: "#fee2e2", color: "#991b1b" },
  };
  const c = colors[status] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{ display: "inline-block", background: c.bg, color: c.color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
      {label}
    </span>
  );
}

// Dashboard view (after authentication)
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ license_number: "", license_type: "contractor", vendor_label: "" });
  const [adding, setAdding] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvMode, setCsvMode] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "expiring" | "expired">("all");

  async function load() {
    setLoading(true);
    try {
      const resp = await fetch(`${API}/hoa/dashboard`, { headers: { "x-hoa-token": token } });
      const data = await resp.json();
      setVendors(data.vendors || []);
      setOrgName(data.account?.org_name || "");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  async function addVendor(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.license_number.trim()) return;
    setAdding(true);
    await fetch(`${API}/hoa/vendors`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-hoa-token": token },
      body: JSON.stringify(addForm),
    });
    setAddForm({ license_number: "", license_type: "contractor", vendor_label: "" });
    await load();
    setAdding(false);
  }

  async function removeVendor(id: number) {
    await fetch(`${API}/hoa/vendors/${id}`, { method: "DELETE", headers: { "x-hoa-token": token } });
    setVendors(v => v.filter(x => x.id !== id));
  }

  async function bulkImport() {
    const lines = csvText.trim().split("\n").filter(Boolean);
    const vendors = lines.map(line => {
      const [license_number, license_type, ...rest] = line.split(",").map(s => s.trim());
      return { license_number, license_type: (license_type || "contractor") as "contractor" | "notary", vendor_label: rest.join(",").trim() };
    }).filter(v => v.license_number);
    if (!vendors.length) return;
    setAdding(true);
    await fetch(`${API}/hoa/vendors/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-hoa-token": token },
      body: JSON.stringify({ vendors }),
    });
    setCsvText("");
    setCsvMode(false);
    await load();
    setAdding(false);
  }

  const filtered = vendors.filter(v => filter === "all" || v.status === filter);
  const counts = {
    all: vendors.length,
    active: vendors.filter(v => v.status === "active").length,
    expiring: vendors.filter(v => v.status === "expiring").length,
    expired: vendors.filter(v => v.status === "expired").length,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>{orgName} — Vendor Compliance</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Live bond status for all your vendors · Updated daily from TDLR & TX SOS</p>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>Sign Out</button>
      </div>

      {/* Summary stats */}
      {vendors.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { key: "active", label: "Active", color: "#059669", bg: "#dcfce7" },
            { key: "expiring", label: "Expiring Soon", color: "#d97706", bg: "#fef9c3" },
            { key: "expired", label: "Expired", color: "#dc2626", bg: "#fee2e2" },
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(filter === s.key as any ? "all" : s.key as any)}
              style={{ background: filter === s.key ? s.bg : "#fff", border: `1px solid ${filter === s.key ? s.color : "#e2e8f0"}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{counts[s.key as keyof typeof counts]}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Add vendor form */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 22px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Add Vendor</div>
          <button onClick={() => setCsvMode(m => !m)} style={{ background: "none", border: "1px solid #cbd5e1", color: "#475569", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>
            {csvMode ? "Single Add" : "Bulk CSV Import"}
          </button>
        </div>

        {csvMode ? (
          <div>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
              Paste CSV: <code style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: 3 }}>LICENSE_NUMBER, contractor|notary, Optional Label</code> (one per line)
            </p>
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder={"TECL123456, contractor, ABC Electric\nTECL789012, contractor\n10001234, notary, Jane Smith"}
              style={{ width: "100%", height: 100, border: "1px solid #cbd5e1", borderRadius: 7, padding: "8px 12px", fontSize: 13, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
            />
            <button onClick={bulkImport} disabled={adding || !csvText.trim()} style={{ marginTop: 10, background: "#0a0f1e", color: "#f59e0b", border: "none", borderRadius: 7, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {adding ? "Importing…" : "Import All"}
            </button>
          </div>
        ) : (
          <form onSubmit={addVendor} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={addForm.license_number}
              onChange={e => setAddForm(f => ({ ...f, license_number: e.target.value }))}
              placeholder="License # (e.g. TECL123456)"
              style={{ flex: "1 1 160px", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 7, fontSize: 14 }}
            />
            <select
              value={addForm.license_type}
              onChange={e => setAddForm(f => ({ ...f, license_type: e.target.value }))}
              style={{ padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 7, fontSize: 14 }}
            >
              <option value="contractor">Contractor</option>
              <option value="notary">Notary</option>
            </select>
            <input
              value={addForm.vendor_label}
              onChange={e => setAddForm(f => ({ ...f, vendor_label: e.target.value }))}
              placeholder="Label (optional)"
              style={{ flex: "1 1 140px", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 7, fontSize: 14 }}
            />
            <button type="submit" disabled={adding} style={{ background: "#0a0f1e", color: "#f59e0b", border: "none", borderRadius: 7, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {adding ? "Adding…" : "Add"}
            </button>
          </form>
        )}
      </div>

      {/* Vendor list */}
      {loading ? (
        <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>Loading your vendors…</p>
      ) : vendors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", border: "2px dashed #e2e8f0", borderRadius: 12, color: "#64748b" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏠</div>
          <div style={{ fontWeight: 700, color: "#334155", marginBottom: 8 }}>No vendors yet</div>
          <p style={{ fontSize: 14, maxWidth: 340, margin: "0 auto" }}>Add contractor license numbers above to start monitoring their bond compliance.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filter !== "all" && (
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>
              Showing {filtered.length} {filter} vendor{filtered.length !== 1 ? "s" : ""} ·{" "}
              <button onClick={() => setFilter("all")} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0, fontSize: 13 }}>Show all</button>
            </div>
          )}
          {filtered.map(v => (
            <div key={v.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <ScoreBadge score={v.qs_score} grade={v.qs_grade} color={v.qs_color} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{v.vendor_label || v.name || v.license_number}</span>
                  <StatusPill status={v.status} label={v.label} />
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {v.license_type_detail || (v.license_type === "notary" ? "Texas Notary" : "Contractor")} · #{v.license_number}
                  {v.expire_date && ` · Bond expires ${new Date(v.expire_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <a
                  href={`https://quantumsurety.bond/${v.license_type === "notary" ? "notary" : "contractor"}/${v.license_number}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
                  View →
                </a>
                {(v.status === "expiring" || v.status === "expired") && (
                  <a
                    href={`https://quantumsurety.bond/get-bond?type=${v.license_type}&license=${v.license_number}&src=hoa-portal`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ background: "#dc2626", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6, textDecoration: "none" }}>
                    Renew Bond
                  </a>
                )}
                <button onClick={() => removeVendor(v.id)} title="Remove" style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Registration / landing page
function Landing({ onRegister }: { onRegister: (email: string, orgName: string) => void }) {
  const [form, setForm] = useState({ email: "", org_name: "", contact_name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.org_name) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/hoa/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  }

  const FEATURES = [
    { icon: "📋", title: "Upload Your Vendor List", desc: "Paste license numbers one at a time or bulk-import a CSV of all your contractors." },
    { icon: "🔴", title: "Live Bond Status Dashboard", desc: "See every vendor's current bond status and QS Score — updated daily from TDLR public records." },
    { icon: "📧", title: "Automatic Expiry Alerts", desc: "Get email alerts before any vendor's bond expires so you can require renewal before the next job." },
    { icon: "🔗", title: "One-Click Renewal Links", desc: "When a vendor's bond lapses, send them a direct renewal link from your dashboard." },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 14px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            FREE · HOA & PROPERTY MANAGER TOOL
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: "0 0 16px" }}>
            Vendor Bond Compliance Portal
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px" }}>
            Monitor every contractor you hire. Get instant alerts when any vendor's surety bond expires. Free for HOAs, property managers, and title companies.
          </p>

          {/* Registration form */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "28px 28px 24px", maxWidth: 440, margin: "0 auto", textAlign: "left" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 18, marginBottom: 8 }}>Check Your Email</div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                  We sent a login link to <strong style={{ color: "#e2e8f0" }}>{form.email}</strong>. Click it to open your vendor dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 16, marginBottom: 18 }}>Get Free Access</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 5 }}>ORGANIZATION NAME *</label>
                  <input
                    required value={form.org_name}
                    onChange={e => setForm(f => ({ ...f, org_name: e.target.value }))}
                    placeholder="e.g. Lakewood HOA or First Property Mgmt"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 5 }}>YOUR NAME</label>
                  <input
                    value={form.contact_name}
                    onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
                    placeholder="Jane Smith"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 5 }}>EMAIL ADDRESS *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@yourhoa.org"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, boxSizing: "border-box" }}
                  />
                </div>
                <button type="submit" disabled={submitting} style={{ width: "100%", background: "#f59e0b", color: "#0a0f1e", border: "none", borderRadius: 8, padding: "12px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                  {submitting ? "Sending link…" : "Get Free Access →"}
                </button>
                <p style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 12 }}>No credit card. No setup. Instant access via email link.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px 80px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", textAlign: "center", marginBottom: 40 }}>
          The compliance dashboard Texas property managers have been waiting for
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 56 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 24px", background: "#fff" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 8 }}>{f.title}</div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "4px solid #dc2626", borderRadius: "0 12px 12px 0", padding: "22px 28px", marginBottom: 48 }}>
          <div style={{ fontWeight: 800, color: "#dc2626", marginBottom: 8 }}>Why Bond Compliance Matters for HOAs</div>
          <p style={{ fontSize: 14, color: "#7f1d1d", lineHeight: 1.7, margin: 0 }}>
            Texas state data shows <strong>29.3% of all TDLR-licensed contractors are currently operating with expired surety bonds</strong>. When an uninsured contractor causes damage to common areas or a unit, your HOA faces liability exposure — especially if you failed to verify their bond before authorizing the work. This tool puts real-time compliance data in front of your board before it becomes a claim.
          </p>
        </div>

        {/* Who it's for */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 48 }}>
          {[
            { label: "HOA Boards", desc: "Track all approved vendors and get alerts before bond lapses." },
            { label: "Property Managers", desc: "Maintain compliance for every community in your portfolio." },
            { label: "Title Companies", desc: "Verify bond status on any contractor before closing." },
            { label: "Real Estate Agents", desc: "Recommend only bonded contractors to your buyer clients." },
          ].map(i => (
            <div key={i.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 6 }}>{i.label}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{i.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", borderTop: "1px solid #e2e8f0", paddingTop: 32 }}>
          <p style={{ fontSize: 13, color: "#64748b" }}>
            Built by <a href="https://quantumsurety.bond" style={{ color: "#2563eb" }}>Quantum Surety LLC</a> (TDI License #3480229) · Data from TDLR public records ·{" "}
            <Link href="/qs-score"><span style={{ color: "#2563eb", cursor: "pointer" }}>About QS Scores</span></Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default function HOAPortal() {
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check URL for token (magic link redirect)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const stored = localStorage.getItem("hoa_token");
    const candidate = urlToken || stored;

    if (candidate) {
      fetch(`${API}/hoa/auth?token=${candidate}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.ok) {
            localStorage.setItem("hoa_token", candidate);
            setToken(candidate);
            // Clean token from URL
            if (urlToken) {
              window.history.replaceState({}, "", window.location.pathname);
            }
          } else {
            localStorage.removeItem("hoa_token");
          }
          setAuthChecked(true);
        })
        .catch(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  function logout() {
    localStorage.removeItem("hoa_token");
    setToken(null);
  }

  return (
    <>
      <Helmet>
        <title>HOA Vendor Bond Compliance Portal — Free Tool | Quantum Surety</title>
        <meta name="description" content="Free vendor compliance portal for HOAs and property managers. Monitor contractor bond status, get expiry alerts, and send renewal links. Built from Texas TDLR public data." />
        <link rel="canonical" href="https://quantumsurety.bond/hoa-portal" />
        <meta property="og:title" content="HOA Vendor Bond Compliance Portal — Free Tool" />
        <meta property="og:description" content="Monitor all your contractors' bond status in one dashboard. Free for HOAs, property managers, and title companies." />
      </Helmet>

      {!authChecked ? (
        <div style={{ textAlign: "center", padding: "80px 24px", color: "#64748b" }}>Checking access…</div>
      ) : token ? (
        <Dashboard token={token} onLogout={logout} />
      ) : (
        <Landing onRegister={() => {}} />
      )}
    </>
  );
}
