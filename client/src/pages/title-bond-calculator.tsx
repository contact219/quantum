import { useState, useRef } from "react";
import { useSEO } from "@/hooks/useSEO";
import {
  Car,
  Search,
  CheckCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  Mail,
  Phone,
  ClipboardList,
  ArrowRight,
  Info,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  type: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function getBondAmount(vehicleValue: number): number {
  return Math.ceil(vehicleValue * 1.5);
}

function getPremium(bondAmount: number): string | number {
  if (bondAmount <= 7500)   return 50;
  if (bondAmount <= 15000)  return 75;
  if (bondAmount <= 22500)  return 100;
  if (bondAmount <= 37500)  return 150;
  if (bondAmount <= 75000)  return 250;
  if (bondAmount <= 150000) return 400;
  return "Call for quote";
}

function parseDollarInput(raw: string): number {
  return parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Decode VIN" },
    { n: 2, label: "Vehicle Value" },
    { n: 3, label: "Request Bond" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, margin: "0 auto 40px", maxWidth: 480 }}>
      {steps.map((s, i) => {
        const done    = s.n < current;
        const active  = s.n === current;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 15,
                background: done ? "#22c55e" : active ? "#6366f1" : "#1e293b",
                border: `2px solid ${done ? "#22c55e" : active ? "#6366f1" : "#334155"}`,
                color: done || active ? "#fff" : "#475569",
                transition: "all 0.25s",
              }}>
                {done ? <CheckCircle size={18} /> : s.n}
              </div>
              <span style={{
                fontSize: 11, marginTop: 6, fontWeight: active ? 700 : 500,
                color: active ? "#c7d2fe" : done ? "#4ade80" : "#475569",
                whiteSpace: "nowrap",
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 4px", marginBottom: 22,
                background: done ? "#22c55e" : "#1e293b",
                transition: "background 0.25s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── VehicleCard ──────────────────────────────────────────────────────────────
function VehicleCard({ vehicle }: { vehicle: VehicleInfo }) {
  return (
    <div style={{
      background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.35)",
      borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 14,
      marginBottom: 24,
    }}>
      <CheckCircle size={22} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#f1f5f9" }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </div>
        <div style={{ fontSize: 13, color: "#4ade80", marginTop: 2 }}>{vehicle.type}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TitleBondCalculator() {
  useSEO({
    title: "Texas Title Bond Calculator | Instant Bond Amount & Price",
    description:
      "Enter your VIN to instantly calculate your Texas bonded title bond amount and price. 1.5× vehicle value. Same-day certificate. TDI-licensed agency.",
    canonical: "/title-bond-calculator",
  });

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [vin, setVin]               = useState("");
  const [vinError, setVinError]     = useState("");
  const [vinLoading, setVinLoading] = useState(false);
  const [vehicle, setVehicle]       = useState<VehicleInfo | null>(null);

  // Step 2
  const [valueInput, setValueInput] = useState("");

  // Step 3
  const [form, setForm]             = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess]       = useState(false);

  // Suppress unused-variable warning for inputRef while keeping the ref available
  const inputRef = useRef<HTMLInputElement>(null);
  void inputRef;

  // ── Derived values ──────────────────────────────────────────────────────────
  const vehicleValue = parseDollarInput(valueInput);
  const bondAmount   = vehicleValue > 0 ? getBondAmount(vehicleValue) : 0;
  const premium      = bondAmount   > 0 ? getPremium(bondAmount)      : null;

  // ── Step 1: Decode VIN ──────────────────────────────────────────────────────
  async function decodeVIN() {
    const cleaned = vin.trim().replace(/\s+/g, "").toUpperCase();
    if (cleaned.length !== 17) {
      setVinError("Please enter a valid 17-character VIN.");
      return;
    }
    setVinError("");
    setVinLoading(true);
    setVehicle(null);
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${cleaned}?format=json`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const r = data?.Results?.[0];
      if (!r || r.ErrorCode !== "0") {
        setVinError(r?.ErrorText || "VIN not found. Please check the number and try again.");
        setVinLoading(false);
        return;
      }
      setVehicle({
        year:  r.ModelYear   || "Unknown",
        make:  r.Make        || "Unknown",
        model: r.Model       || "Unknown",
        type:  r.VehicleType || "Vehicle",
      });
    } catch {
      setVinError("Could not reach the VIN decoder. Please check your connection and try again.");
    }
    setVinLoading(false);
  }

  function handleVinKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") decodeVIN();
  }

  function goToStep2() {
    if (!vehicle) return;
    setForm(f => ({
      ...f,
      notes: `Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.type})\nVIN: ${vin.trim().toUpperCase()}`,
    }));
    setStep(2);
  }

  // ── Step 2: Value input ─────────────────────────────────────────────────────
  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setValueInput(raw);
  }

  function goToStep3() {
    if (vehicleValue <= 0) return;
    const bondNote = `\nBond Amount: ${formatCurrency(bondAmount)}\nEstimated Premium: ${typeof premium === "number" ? formatCurrency(premium) : premium}`;
    setForm(f => ({
      ...f,
      notes: f.notes + bondNote,
    }));
    setStep(3);
  }

  // ── Step 3: Submit lead ─────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!form.name || !form.email || !form.phone) {
      setSubmitError("Please fill in your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:      form.name,
          email:     form.email,
          phone:     form.phone,
          bond_type: "bonded-title",
          source:    "title-bond-calculator",
          notes:     form.notes,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setSuccess(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or call us directly.");
    }
    setSubmitting(false);
  }

  // ── Shared styles ───────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#1e293b", border: "1px solid #334155",
    borderRadius: 8, padding: "12px 14px", color: "#f1f5f9", fontSize: 15,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, color: "#64748b",
    fontFamily: "monospace", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase",
  };
  const backButtonStyle: React.CSSProperties = {
    background: "transparent", color: "#475569", border: "1px solid #334155",
    borderRadius: 8, padding: "11px 0", fontWeight: 600, fontSize: 14, cursor: "pointer",
    width: "100%",
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#0f172a 0%,#1a2e5a 45%,#0e4d4d 100%)",
        padding: "64px 24px 56px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.45)",
            borderRadius: 20, padding: "4px 16px", fontSize: 12, color: "#a5b4fc", marginBottom: 24,
          }}>
            <Car size={12} /> TEXAS BONDED TITLE — FREE INSTANT CALCULATOR
          </div>
          <h1 style={{
            fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#fff",
            lineHeight: 1.1, margin: "0 0 20px",
          }}>
            Texas Title Bond<br />Calculator
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, margin: "0 auto 12px", maxWidth: 560 }}>
            Enter your VIN, confirm your vehicle, enter its value — and get your exact bond
            amount and price in seconds. No other surety company offers this.
          </p>
          <p style={{ fontSize: 13, color: "#4ade80", marginBottom: 0 }}>
            TDI-Licensed Agency &middot; Same-Day Certificate &middot; No Credit Check
          </p>
        </div>
      </section>

      {/* ── Calculator card ───────────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px 64px", background: "#0f172a", minHeight: 480 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <StepIndicator current={step} />

          {/* ════════════ STEP 1 ════════════ */}
          {step === 1 && (
            <div style={{
              background: "#1e293b", border: "1px solid #334155",
              borderRadius: 16, padding: "32px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Search size={20} color="#6366f1" />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
                  Step 1 &mdash; Enter Your VIN
                </h2>
              </div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
                Your 17-character Vehicle Identification Number is on your dashboard, door jamb sticker, or prior title.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>VIN (17 characters)</label>
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={17}
                  placeholder="e.g. 1HGCM82633A123456"
                  value={vin}
                  onChange={e => { setVin(e.target.value.toUpperCase()); setVehicle(null); setVinError(""); }}
                  onKeyDown={handleVinKeyDown}
                  style={{
                    ...inputStyle,
                    fontFamily: "monospace", fontSize: 17, letterSpacing: 2,
                    border: vinError ? "1px solid #f87171" : "1px solid #334155",
                  }}
                  autoCapitalize="characters"
                  spellCheck={false}
                />
                <div style={{ textAlign: "right", fontSize: 12, color: vin.length === 17 ? "#4ade80" : "#475569", marginTop: 4 }}>
                  {vin.length} / 17
                </div>
              </div>

              {vinError && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                }}>
                  <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "#f87171" }}>{vinError}</span>
                </div>
              )}

              {vehicle && <VehicleCard vehicle={vehicle} />}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  onClick={decodeVIN}
                  disabled={vinLoading || vin.replace(/\s/g, "").length !== 17}
                  style={{
                    background: "#6366f1", color: "#fff", border: "none", borderRadius: 8,
                    padding: "13px 0", fontWeight: 700, fontSize: 15, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: vinLoading || vin.replace(/\s/g, "").length !== 17 ? 0.5 : 1,
                    transition: "opacity 0.15s",
                    width: "100%",
                  }}
                >
                  {vinLoading
                    ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Decoding VIN&hellip;</>
                    : <><Search size={17} /> Decode VIN</>
                  }
                </button>

                {vehicle && (
                  <button
                    onClick={goToStep2}
                    style={{
                      background: "#22c55e", color: "#000", border: "none", borderRadius: 8,
                      padding: "13px 0", fontWeight: 800, fontSize: 15, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%",
                    }}
                  >
                    Continue &mdash; Enter Vehicle Value <ChevronRight size={18} />
                  </button>
                )}
              </div>

              <div style={{
                marginTop: 20, padding: "12px 14px",
                background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start",
              }}>
                <Info size={14} color="#a5b4fc" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                  VIN decoded via the free NHTSA database. Your data is never stored during this step.
                </span>
              </div>
            </div>
          )}

          {/* ════════════ STEP 2 ════════════ */}
          {step === 2 && vehicle && (
            <div style={{
              background: "#1e293b", border: "1px solid #334155",
              borderRadius: 16, padding: "32px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <DollarSign size={20} color="#6366f1" />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
                  Step 2 &mdash; Enter Vehicle Value
                </h2>
              </div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
                Enter the appraised or fair-market value of your vehicle.
              </p>

              <VehicleCard vehicle={vehicle} />

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Vehicle Value (USD)</label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: "#64748b", fontSize: 16, fontWeight: 600, pointerEvents: "none",
                  }}>$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="15000"
                    value={valueInput}
                    onChange={handleValueChange}
                    style={{ ...inputStyle, paddingLeft: 28 }}
                    autoFocus
                  />
                </div>
                <div style={{
                  marginTop: 8, fontSize: 12, color: "#475569",
                  display: "flex", alignItems: "flex-start", gap: 6,
                }}>
                  <Info size={12} color="#475569" style={{ flexShrink: 0, marginTop: 1 }} />
                  Use NADA Guides or a licensed appraiser for the exact value TxDMV requires on Form VTR-130-SOF.
                </div>
              </div>

              {/* Live calculation card */}
              {vehicleValue > 0 && (
                <div style={{
                  background: "#0f172a", border: "1px solid #334155",
                  borderRadius: 12, padding: "20px 22px", marginBottom: 24,
                }}>
                  <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", letterSpacing: 1, marginBottom: 14 }}>
                    INSTANT CALCULATION
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Bond Amount Required</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#c7d2fe" }}>
                        {formatCurrency(bondAmount)}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>= 1.5 &times; vehicle value</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Estimated Premium</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: typeof premium === "number" ? "#4ade80" : "#fb923c" }}>
                        {typeof premium === "number" ? formatCurrency(premium as number) : premium}
                      </div>
                      {typeof premium === "number" && (
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>one-time payment</div>
                      )}
                    </div>
                  </div>
                  <div style={{
                    marginTop: 16, padding: "10px 12px",
                    background: "rgba(99,102,241,0.08)", borderRadius: 8, fontSize: 12, color: "#64748b",
                  }}>
                    Exact pricing confirmed after reviewing your vehicle details. No credit check required.
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  onClick={goToStep3}
                  disabled={vehicleValue <= 0}
                  style={{
                    background: "#22c55e", color: "#000", border: "none", borderRadius: 8,
                    padding: "13px 0", fontWeight: 800, fontSize: 15, cursor: vehicleValue <= 0 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: vehicleValue <= 0 ? 0.4 : 1, transition: "opacity 0.15s",
                    width: "100%",
                  }}
                >
                  Get My Bond <ChevronRight size={18} />
                </button>
                <button onClick={() => setStep(1)} style={backButtonStyle}>
                  &larr; Back
                </button>
              </div>
            </div>
          )}

          {/* ════════════ STEP 3 ════════════ */}
          {step === 3 && vehicle && !success && (
            <div style={{
              background: "#1e293b", border: "1px solid #334155",
              borderRadius: 16, padding: "32px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <FileText size={20} color="#6366f1" />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
                  Step 3 &mdash; Request Your Bond
                </h2>
              </div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
                We&rsquo;ll review your vehicle details and send your bond certificate within 1 business day.
              </p>

              {/* Summary card */}
              <div style={{
                background: "#0f172a", border: "1px solid #334155",
                borderRadius: 12, padding: "18px 20px", marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", letterSpacing: 1, marginBottom: 12 }}>
                  YOUR BOND SUMMARY
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9", marginBottom: 4 }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>{vehicle.type}</div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Bond Amount</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#c7d2fe" }}>{formatCurrency(bondAmount)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Estimated Premium</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: typeof premium === "number" ? "#4ade80" : "#fb923c" }}>
                      {typeof premium === "number" ? formatCurrency(premium as number) : premium}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>
                    <User size={10} style={{ display: "inline", marginRight: 4 }} />Full Name *
                  </label>
                  <input
                    type="text" required placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    <Mail size={10} style={{ display: "inline", marginRight: 4 }} />Email Address *
                  </label>
                  <input
                    type="email" required placeholder="jane@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    <Phone size={10} style={{ display: "inline", marginRight: 4 }} />Phone Number *
                  </label>
                  <input
                    type="tel" required placeholder="(555) 555-5555"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    <ClipboardList size={10} style={{ display: "inline", marginRight: 4 }} />Additional Notes (optional)
                  </label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 90 } as React.CSSProperties}
                  />
                </div>

                {submitError && (
                  <div style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
                    borderRadius: 8, padding: "10px 14px",
                  }}>
                    <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "#f87171" }}>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit" disabled={submitting}
                  style={{
                    background: "#6366f1", color: "#fff", border: "none", borderRadius: 8,
                    padding: "15px 0", fontWeight: 800, fontSize: 16,
                    cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: submitting ? 0.7 : 1, transition: "opacity 0.15s",
                    width: "100%",
                  }}
                >
                  {submitting
                    ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Submitting&hellip;</>
                    : <><ArrowRight size={17} /> Request My Title Bond</>
                  }
                </button>
                <div style={{display:"flex", alignItems:"center", gap:10, margin:"4px 0"}}>
                  <div style={{flex:1, height:1, background:"#334155"}}/>
                  <span style={{fontSize:12, color:"#64748b", whiteSpace:"nowrap"}}>or skip the form</span>
                  <div style={{flex:1, height:1, background:"#334155"}}/>
                </div>
                <a
                  href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    background:"rgba(20,184,166,0.1)", border:"1px solid rgba(20,184,166,0.35)",
                    color:"#5eead4", borderRadius:8, padding:"13px 0", fontWeight:700,
                    fontSize:14, textDecoration:"none", width:"100%",
                  }}
                >
                  Apply Directly Online <ArrowRight size={15} />
                </a>
                <button type="button" onClick={() => setStep(2)} style={backButtonStyle}>
                  &larr; Back
                </button>
              </form>
            </div>
          )}

          {/* ════════════ SUCCESS ════════════ */}
          {step === 3 && success && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: 16, padding: "40px 28px", textAlign: "center",
            }}>
              <CheckCircle size={52} color="#4ade80" style={{ margin: "0 auto 20px" }} />
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", marginBottom: 8 }}>
                Request Received!
              </h2>
              <p style={{ fontSize: 15, color: "#94a3b8", marginBottom: 32 }}>
                We&rsquo;ll be in touch shortly. Here&rsquo;s what happens next:
              </p>
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                {[
                  { n: 1, text: "We'll email your bond certificate within 1 business day." },
                  { n: 2, text: "Gather your vehicle appraisal for TxDMV Form VTR-130-SOF." },
                  { n: 3, text: "File at your county tax assessor-collector's office." },
                ].map(item => (
                  <div key={item.n} style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 10, padding: "14px 16px",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: "#22c55e",
                      color: "#000", fontWeight: 800, fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{item.n}</div>
                    <span style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:12}}>
                <a
                  href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    background:"#0d9488", color:"#fff", padding:"14px 36px",
                    borderRadius:8, fontWeight:800, fontSize:16, textDecoration:"none",
                  }}
                >
                  <ArrowRight size={18} /> Apply Directly Now
                </a>
                <a href="/" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: "#64748b", padding: "10px 20px",
                  borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none",
                }}>
                  Back to Quantum Surety
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Premium rate table ────────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", textAlign: "center", marginBottom: 8 }}>
            Texas Bonded Title Premium Schedule
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 28 }}>
            Bond amount = 1.5&times; vehicle value. Premium is a one-time payment &mdash; no annual renewal.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #334155" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left",   color: "#94a3b8", fontWeight: 600 }}>Vehicle Value</th>
                  <th style={{ padding: "10px 16px", textAlign: "center", color: "#94a3b8", fontWeight: 600 }}>Bond Amount</th>
                  <th style={{ padding: "10px 16px", textAlign: "right",  color: "#94a3b8", fontWeight: 600 }}>Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { value: "Up to $5,000",        bond: "Up to $7,500",        premium: "$50" },
                  { value: "$5,001 – $10,000",   bond: "$7,501 – $15,000",   premium: "$75" },
                  { value: "$10,001 – $15,000",  bond: "$15,001 – $22,500",  premium: "$100" },
                  { value: "$15,001 – $25,000",  bond: "$22,501 – $37,500",  premium: "$150" },
                  { value: "$25,001 – $50,000",  bond: "$37,501 – $75,000",  premium: "$250" },
                  { value: "$50,001 – $100,000", bond: "$75,001 – $150,000", premium: "$400" },
                  { value: "Over $100,000",         bond: "Over $150,000",      premium: "Call for quote" },
                ].map((row, i) => (
                  <tr key={i} style={{
                    borderBottom: "1px solid #334155",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  }}>
                    <td style={{ padding: "12px 16px", color: "#e2e8f0" }}>{row.value}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#c7d2fe" }}>{row.bond}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#4ade80", fontWeight: 700 }}>{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Callout + FAQ ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px 64px", background: "#0f172a" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(6,182,212,0.08))",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "28px 32px",
            marginBottom: 40,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Star size={18} color="#a5b4fc" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: 1 }}>
                Who uses this calculator
              </span>
            </div>
            <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
              Used by{" "}
              <strong style={{ color: "#f1f5f9" }}>Copart &amp; auction buyers</strong>,{" "}
              <strong style={{ color: "#f1f5f9" }}>estate administrators</strong>, and anyone who bought a
              vehicle without a title. A Texas Certificate of Title (bonded title) bond lets you register
              and title a vehicle when you can&rsquo;t obtain a standard title from the previous owner.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                q: "What is a bonded title?",
                a: "A bonded title (Certificate of Title Bond) is a surety bond filed with TxDMV that allows you to legally title and register a vehicle when you don’t have the original title document.",
              },
              {
                q: "How long does TxDMV take to issue the title?",
                a: "After you file Form VTR-130-SOF with your county tax assessor-collector’s office, TxDMV typically issues the bonded title within 2–4 weeks.",
              },
              {
                q: "How long does the bond last?",
                a: "Texas bonded title bonds are valid for 3 years. After 3 years, TxDMV converts the title to a standard clear title — the bond is then released.",
              },
              {
                q: "Do I need good credit?",
                a: "No credit check is required for standard bonded title bonds. Premium is a fixed amount based solely on the vehicle value.",
              },
            ].map(item => (
              <div key={item.q} style={{ borderLeft: "3px solid #6366f1", paddingLeft: 18 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{item.q}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spin animation keyframes ──────────────────────────────────────────── */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
