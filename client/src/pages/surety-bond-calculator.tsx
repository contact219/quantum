import { useState } from "react";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Calculator, DollarSign, ArrowRight, Info, CheckCircle } from "lucide-react";
import { Link } from "wouter";

// ─── Pricing models (estimates; final premium subject to underwriting) ───────
type BondKey = "notary" | "dealer" | "title" | "contractor" | "bid" | "performance";

interface BondModel {
  label: string;
  needsAmount: boolean;
  amountLabel?: string;
  amountHint?: string;
  estimate: (amount: number) => { premium: string; detail: string };
  applyType: string;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function titlePremium(bondAmount: number): number | null {
  if (bondAmount <= 7500) return 50;
  if (bondAmount <= 15000) return 75;
  if (bondAmount <= 22500) return 100;
  if (bondAmount <= 37500) return 150;
  if (bondAmount <= 75000) return 250;
  if (bondAmount <= 150000) return 400;
  return null;
}

const BOND_MODELS: Record<BondKey, BondModel> = {
  notary: {
    label: "Texas Notary Bond",
    needsAmount: false,
    estimate: () => ({
      premium: "$50 flat",
      detail: "4-year term, $10,000 bond required by the Texas SOS. Add E&O coverage for a few dollars more per year.",
    }),
    applyType: "notary",
  },
  dealer: {
    label: "GDN Dealer Bond",
    needsAmount: false,
    estimate: () => ({
      premium: "from $250/yr",
      detail: "$25,000 bond required by TxDMV for GDN dealer licenses. Rate depends on credit; most dealers pay $250–$500/yr.",
    }),
    applyType: "dealer",
  },
  title: {
    label: "Vehicle Title Bond",
    needsAmount: true,
    amountLabel: "Vehicle value",
    amountHint: "Bond amount = 1.5× appraised vehicle value",
    estimate: (v) => {
      const bond = Math.ceil(v * 1.5);
      const p = titlePremium(bond);
      return {
        premium: p ? fmt(p) : "Call for quote",
        detail: `Bond amount: ${fmt(bond)} (1.5× vehicle value), 3-year term filed with TxDMV.`,
      };
    },
    applyType: "title",
  },
  contractor: {
    label: "Contractor License Bond",
    needsAmount: true,
    amountLabel: "Required bond amount",
    amountHint: "Set by your city/county — commonly $5,000–$25,000",
    estimate: (v) => {
      const lo = Math.max(75, Math.round(v * 0.01));
      const hi = Math.max(100, Math.round(v * 0.03));
      return {
        premium: `${fmt(lo)}–${fmt(hi)}/yr`,
        detail: "Texas contractor license bonds typically run 1–3% of the bond amount per year, depending on credit.",
      };
    },
    applyType: "contractor",
  },
  bid: {
    label: "Bid Bond",
    needsAmount: true,
    amountLabel: "Bid amount",
    amountHint: "Bid bonds are usually 5–10% of your bid",
    estimate: (v) => {
      const penal = Math.round(v * 0.1);
      return {
        premium: "from $100",
        detail: `A 10% bid bond on a ${fmt(v)} bid has a ${fmt(penal)} penal sum. Bid bonds are usually flat-fee or free when bundled with the performance bond commitment.`,
      };
    },
    applyType: "bid",
  },
  performance: {
    label: "Performance & Payment Bond",
    needsAmount: true,
    amountLabel: "Contract value",
    amountHint: "Bond equals 100% of the contract price",
    estimate: (v) => {
      const lo = Math.round(v * 0.01);
      const hi = Math.round(v * 0.03);
      return {
        premium: `${fmt(lo)}–${fmt(hi)}`,
        detail: "Performance bonds typically cost 1–3% of the contract value; larger contracts get lower tiered rates. Underwritten case-by-case.",
      };
    },
    applyType: "performance",
  },
};

export default function SuretyBondCalculator() {
  useSEO({
    title: "Surety Bond Cost Calculator | Instant Texas Estimates | Quantum Surety",
    description:
      "Free surety bond calculator — estimate the cost of Texas notary, dealer, title, contractor, bid, and performance bonds in seconds. TDI-licensed agency.",
    canonical: "/surety-bond-calculator",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Surety Bond Cost Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://quantumsurety.bond/surety-bond-calculator",
    provider: { "@type": "InsuranceAgency", name: "Quantum Surety", url: "https://quantumsurety.bond" },
  });

  const [bondKey, setBondKey] = useState<BondKey>("notary");
  const [amountRaw, setAmountRaw] = useState("");
  const model = BOND_MODELS[bondKey];
  const amount = parseFloat(amountRaw.replace(/[^0-9.]/g, "")) || 0;
  const showResult = !model.needsAmount || amount > 0;
  const result = showResult ? model.estimate(amount) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", padding: "48px 16px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "#6366f1", marginBottom: 16 }}>
            <Calculator size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f8fafc", margin: 0 }}>Surety Bond Cost Calculator</h1>
          <p style={{ color: "#94a3b8", marginTop: 10, fontSize: 16 }}>
            Estimate your Texas surety bond premium in seconds — notary, dealer, title, contractor, bid, and performance bonds.
          </p>
        </div>

        {/* Bond type selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 28 }}>
          {(Object.entries(BOND_MODELS) as [BondKey, BondModel][]).map(([key, m]) => (
            <button
              key={key}
              onClick={() => { setBondKey(key); setAmountRaw(""); }}
              style={{
                padding: "14px 12px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600,
                background: key === bondKey ? "#6366f1" : "#1e293b",
                border: `1px solid ${key === bondKey ? "#818cf8" : "#334155"}`,
                color: key === bondKey ? "#fff" : "#cbd5e1",
                transition: "all 0.15s",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Amount input */}
        {model.needsAmount && (
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#cbd5e1", marginBottom: 8 }}>
              {model.amountLabel}
            </label>
            <div style={{ position: "relative" }}>
              <DollarSign size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                inputMode="numeric"
                value={amountRaw}
                onChange={(e) => setAmountRaw(e.target.value)}
                placeholder="25,000"
                style={{
                  width: "100%", padding: "12px 12px 12px 38px", borderRadius: 8, fontSize: 18,
                  background: "#0f172a", border: "1px solid #334155", color: "#f1f5f9", outline: "none",
                }}
              />
            </div>
            {model.amountHint && (
              <p style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13, marginTop: 8 }}>
                <Info size={14} /> {model.amountHint}
              </p>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ background: "linear-gradient(135deg,#1e293b,#172033)", border: "1px solid #6366f1", borderRadius: 12, padding: 28, marginBottom: 28, textAlign: "center" }}>
            <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "#818cf8", fontWeight: 700, marginBottom: 6 }}>
              Estimated premium
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#f8fafc" }}>{result.premium}</div>
            <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 10, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>{result.detail}</p>
            <Link
              href={`/get-bond?type=${model.applyType}&utm_source=calculator`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18,
                background: "#6366f1", color: "#fff", fontWeight: 700, fontSize: 16,
                padding: "14px 32px", borderRadius: 10, textDecoration: "none",
              }}
            >
              Get My Exact Quote <ArrowRight size={18} />
            </Link>
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 12 }}>
              Estimates only — final premium confirmed at checkout or by a licensed agent. No obligation.
            </p>
          </div>
        )}

        {/* Trust row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", color: "#94a3b8", fontSize: 13, marginBottom: 40 }}>
          {["TDI-licensed agency #3480229", "Bonds written by RLI (A+ rated)", "Same-day certificates"].map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle size={14} color="#4ade80" /> {t}
            </span>
          ))}
        </div>

        {/* SEO copy */}
        <div style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.75 }}>
          <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 700 }}>How surety bond costs are calculated</h2>
          <p>
            A surety bond premium is a percentage of the bond amount (the "penal sum"), not the full amount. Simple
            license bonds like the <Link href="/bonds/notary-bond-texas" style={{ color: "#818cf8" }}>Texas notary bond</Link> are
            flat-rate — $50 for four years. Credit-underwritten bonds like the{" "}
            <Link href="/bonds/gdn-bond-texas" style={{ color: "#818cf8" }}>GDN dealer bond</Link> typically run 1–2% of the bond
            amount per year, and <Link href="/bonds/performance-bond-texas" style={{ color: "#818cf8" }}>performance bonds</Link> run
            1–3% of the contract value with tiered rates for larger jobs.
          </p>
          <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 700 }}>Need a vehicle title bond instead?</h2>
          <p>
            Texas bonded titles have their own rules — the bond is 1.5× the vehicle's appraised value. Use our dedicated{" "}
            <Link href="/title-bond-calculator" style={{ color: "#818cf8" }}>title bond calculator</Link> to decode your VIN and
            get an exact figure.
          </p>
        </div>
      </div>
    </div>
  );
}
