import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const VERIFY_BASE = "https://verify.quantumsurety.bond/api";
const LOOKUP_EMAIL = `${VERIFY_BASE}/notary-renew`;
const LOOKUP_NID = `${VERIFY_BASE}/notary/lookup`;
const NOTARY_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function daysFrom(d?: string) {
  if (!d) return null;
  return Math.max(0, Math.floor((new Date(d).getTime() - Date.now()) / 86400000));
}

function parseCity(city?: string, address?: string) {
  if (city && city.trim()) return city.trim();
  if (!address) return "";
  const lines = address.split("\n");
  const last = lines[lines.length - 1] || "";
  const m = last.match(/^([^,]+),\s*TX/);
  return m ? m[1].trim() : "";
}

const COMPETITORS = ["western", "merchants", "travelers", "st. paul", "st paul", "markel", "harco", "surety one", "philadelphia"];
function isCompetitor(surety?: string) {
  if (!surety) return false;
  const s = surety.toLowerCase();
  return COMPETITORS.some(c => s.includes(c)) && !s.includes("rli") && !s.includes("quantum");
}

interface NotaryData {
  found: boolean;
  notary_id?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  address?: string;
  expire_date?: string;
  days_left?: number;
  days_until_expiry?: number;
  surety_company?: string;
}

export default function Renew() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const emailParam = params.get("email") || "";
  const nidParam = params.get("nid") || params.get("notary_id") || "";

  const [data, setData] = useState<NotaryData | null>(null);
  const [loading, setLoading] = useState(!!emailParam || !!nidParam);
  const [form, setForm] = useState({ name: "", email: emailParam, phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (nidParam) {
      fetch(`${LOOKUP_NID}/${encodeURIComponent(nidParam)}`)
        .then(r => (r.status === 404 ? { found: false } : r.json()))
        .then((d: any) => {
          if (d && d.notary_id) {
            const n: NotaryData = { ...d, found: true, days_left: d.days_until_expiry ?? daysFrom(d.expire_date) ?? undefined };
            setData(n);
            setForm(f => ({ ...f, name: `${d.first_name || ""} ${d.last_name || ""}`.trim(), email: d.email || f.email }));
          } else {
            setData({ found: false });
          }
        })
        .catch(() => setData({ found: false }))
        .finally(() => setLoading(false));
      return;
    }
    if (emailParam) {
      fetch(`${LOOKUP_EMAIL}?email=${encodeURIComponent(emailParam)}`)
        .then(r => r.json())
        .then((d: NotaryData) => { setData(d); if (d.found && d.first_name) setForm(f => ({ ...f, name: `${d.first_name} ${d.last_name || ""}`.trim() })); })
        .catch(() => setData({ found: false }))
        .finally(() => setLoading(false));
    }
  }, [emailParam, nidParam]);

  const daysLeft = data?.found ? (data.days_left ?? data.days_until_expiry ?? null) : null;
  const urgent = daysLeft !== null && daysLeft <= 7;
  const warning = daysLeft !== null && daysLeft <= 30;
  const city = parseCity(data?.city, data?.address);
  const switching = isCompetitor(data?.surety_company);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const notes = data?.found
      ? `Pre-filled renewal. Commission #${data.notary_id || nidParam}. Expires ${data.expire_date || "?"}. Current surety: ${data.surety_company || "unknown"}.`
      : "Renewal page submission.";
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bond_type: "notary",
          source: nidParam ? "renew-prefilled" : "renew-page",
          notes,
        }),
      });
    } catch (_) {}
    setSubmitted(true);
    const ref = data?.notary_id || nidParam;
    window.location.href = ref ? `${NOTARY_URL}&ref=${encodeURIComponent(ref)}` : NOTARY_URL;
  }

  const greeting = data?.found && data.first_name ? `Hi ${data.first_name}, your renewal is ready.` : "Renew Your Texas Notary Bond";

  return (
    <>
      <Helmet>
        <title>Renew Your Texas Notary Bond — $50 Flat | Quantum Surety</title>
        <meta name="description" content="Your Texas Notary Bond renewal, pre-filled and ready. $50 flat for a 4-year bond. RLI Insurance, same-day PDF certificate. No forms to fill out." />
        <link rel="canonical" href="https://quantumsurety.bond/renew" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f59e0b", fontFamily: "monospace", marginBottom: 8 }}>QUANTUM SURETY — TEXAS BOND RENEWAL</div>
            <h1 style={{ fontSize: 27, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
              {loading ? "Looking up your commission…" : greeting}
            </h1>
            {!loading && data?.found && data.expire_date && (
              <div style={{ fontSize: 15, color: urgent ? "#f87171" : warning ? "#fbbf24" : "#94a3b8", marginTop: 8, lineHeight: 1.5 }}>
                {urgent && "⚠️ URGENT — "}
                Your commission expires <strong style={{ color: urgent ? "#f87171" : warning ? "#fbbf24" : "#e2e8f0" }}>{fmtDate(data.expire_date)}</strong>
                {daysLeft !== null && daysLeft <= 90 && <span> — <strong>{daysLeft} days</strong> remaining</span>}
              </div>
            )}
            {!loading && !data?.found && (
              <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 8 }}>Renew your 4-year Texas Notary Bond in under 2 minutes.</p>
            )}
          </div>

          {/* Pre-filled commission card — the "only we can do" moment */}
          {!loading && data?.found && (
            <div style={{ background: "#0d1117", border: "1px solid #1f6feb", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#58a6ff", letterSpacing: 2, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                ✓ WE PULLED YOUR COMMISSION DETAILS FROM TEXAS SOS RECORDS
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="NAME" value={`${data.first_name || ""} ${data.last_name || ""}`.trim()} />
                <Field label="COMMISSION #" value={data.notary_id || nidParam} />
                {city && <Field label="CITY" value={city} />}
                {data.expire_date && <Field label="EXPIRES" value={new Date(data.expire_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />}
              </div>
              {switching && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#fbbf24", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                  Your current bond is with {data.surety_company}. Switching to Quantum Surety is free, legal, and the Texas SOS treats every surety identically — you just save on price and get same-day delivery.
                </div>
              )}
            </div>
          )}

          {/* Pricing card */}
          <div style={{ background: "#fefce8", border: "2px solid #f59e0b", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
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

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 24 }}>
              {data?.found && (
                <p style={{ fontSize: 12, color: "#8b949e", marginTop: 0, marginBottom: 16, lineHeight: 1.5 }}>
                  We've filled in what we have. Just confirm your contact info and we'll take you straight to checkout — no application to fill out.
                </p>
              )}
              <FormField label="Full Name" type="text" value={form.name} placeholder="Jane Smith"
                onChange={v => setForm(f => ({ ...f, name: v }))} prefilled={!!(data?.found && form.name)} />
              <FormField label="Email" type="email" value={form.email} placeholder="jane@example.com"
                onChange={v => setForm(f => ({ ...f, email: v }))} prefilled={!!(data?.found && form.email)} />
              <FormField label="Phone" type="tel" value={form.phone} placeholder="(214) 000-0000"
                onChange={v => setForm(f => ({ ...f, phone: v }))} />
              <button type="submit" disabled={submitting}
                style={{ width: "100%", background: "#f59e0b", color: "#000", fontWeight: 800, fontSize: 16, padding: "14px", borderRadius: 8, border: "none", cursor: "pointer", letterSpacing: 1, marginTop: 4 }}>
                {submitting ? "Redirecting…" : data?.found ? "CONFIRM & RENEW — $50 →" : "RENEW MY BOND — $50 →"}
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "#6e7681", letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, color: "#e6edf3", fontWeight: 600 }}>{value || "—"}</div>
    </div>
  );
}

function FormField({ label, type, value, placeholder, onChange, prefilled }: {
  label: string; type: string; value: string; placeholder: string; onChange: (v: string) => void; prefilled?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#8b949e", marginBottom: 6 }}>
        <span>{label}</span>
        {prefilled && <span style={{ color: "#3fb950", fontSize: 10, fontWeight: 700 }}>✓ pre-filled</span>}
      </label>
      <input type={type} required value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: "#0d1117", border: `1px solid ${prefilled ? "#238636" : "#30363d"}`, borderRadius: 8, padding: "10px 12px", color: "#e6edf3", fontSize: 14, boxSizing: "border-box" }} />
    </div>
  );
}
