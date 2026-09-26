import { useState } from "react";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Calculator, DollarSign, ArrowRight, Info, CheckCircle } from "lucide-react";
import { Link } from "wouter";

// ─── Pricing models ───────────────────────────────────────────────────────────
// Every figure here must be traceable (see "Verify Before Publishing Claims"):
//   notary  — $50 premium for the 4-year term; $21 SOS filing fee (vetted on /bonds/notary-bond-texas)
//   dealer  — TxDMV: $50,000 bond since 2021-09-01, 2-year term; $250 = RLI minimum premium,
//             and what both 2026 dealer bonds we wrote cost (revenue_events)
//   title   — 1.5x vehicle value, 3-year term, $100 RLI minimum; RLI charged $136 on a $9,075
//             bond (Aug 2026) = 1.5% of the bond amount, so that is the estimate above the minimum
//   contractor — $100 RLI minimum premium (bk_carrier_rates); no published rate above it
//   bid / performance — no rate card and no sales yet: we show the arithmetic of a quoted rate,
//             never a claimed "typical" rate. SBA fee facts from sba.gov.
type BondKey = "any" | "notary" | "dealer" | "title" | "contractor" | "bid" | "performance";

interface BondModel {
  label: string;
  needsAmount: boolean;
  needsRate?: boolean;
  amountLabel?: string;
  amountHint?: string;
  estimate: (amount: number, ratePct: number) => { premium: string; detail: string };
  applyType: string;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const TITLE_MIN = 100;
const TITLE_RATE = 0.015;

const BOND_MODELS: Record<BondKey, BondModel> = {
  any: {
    label: "Any bond (amount + rate)",
    needsAmount: true,
    needsRate: true,
    amountLabel: "Bond amount (penal sum)",
    amountHint: "The amount the obligee requires, not what you pay",
    estimate: (v, r) => ({
      premium: fmt(v * (r / 100)),
      detail: `${r}% of a ${fmt(v)} bond. Your rate comes from the surety's underwriting, and most bonds also carry a minimum premium.`,
    }),
    applyType: "",
  },
  notary: {
    label: "Texas Notary Bond",
    needsAmount: false,
    estimate: () => ({
      premium: "$50",
      detail: "Covers the full 4-year term of the $10,000 bond the Texas Secretary of State requires. The state charges its own $21 filing fee when you apply, so being commissioned costs $71.",
    }),
    applyType: "notary",
  },
  dealer: {
    label: "GDN Dealer Bond",
    needsAmount: false,
    estimate: () => ({
      premium: "from $250",
      detail: "For the whole 2-year term of the $50,000 bond TxDMV has required for independent dealers since September 1, 2021. $250 is RLI's minimum premium, and it is what both dealer bonds we wrote in 2026 cost.",
    }),
    applyType: "dealer",
  },
  title: {
    label: "Vehicle Title Bond",
    needsAmount: true,
    amountLabel: "Vehicle value",
    amountHint: "Bond amount = 1.5× the vehicle's value",
    estimate: (v) => {
      const bond = Math.ceil(v * 1.5);
      const p = Math.max(TITLE_MIN, Math.round(bond * TITLE_RATE));
      return {
        premium: fmt(p),
        detail: `Bond amount ${fmt(bond)} (1.5× vehicle value), 3-year term. Estimate: 1.5% of the bond amount with a $100 minimum, based on the title bonds we have written. Your exact price is confirmed before you pay.`,
      };
    },
    applyType: "title",
  },
  contractor: {
    label: "Contractor License Bond",
    needsAmount: true,
    needsRate: true,
    amountLabel: "Required bond amount",
    amountHint: "Set by the city or agency that licenses you",
    estimate: (v, r) => {
      const p = Math.max(100, v * (r / 100));
      return {
        premium: fmt(p),
        detail: `At a ${r}% rate on a ${fmt(v)} bond, with RLI's $100 minimum premium applied. The actual rate is set by underwriting; we confirm it before you pay.`,
      };
    },
    applyType: "contractor",
  },
  bid: {
    label: "Bid Bond",
    needsAmount: true,
    amountLabel: "Your bid amount",
    amountHint: "The bid documents state the bond amount, often as a % of the bid",
    estimate: (v) => ({
      premium: "Quoted",
      detail: `If the documents call for 5%, the bond amount on a ${fmt(v)} bid is ${fmt(v * 0.05)}; at 10%, ${fmt(v * 0.1)}. The premium is quoted by the surety, and the SBA charges no fee on bid bonds it guarantees.`,
    }),
    applyType: "bid",
  },
  performance: {
    label: "Performance & Payment Bond",
    needsAmount: true,
    needsRate: true,
    amountLabel: "Contract price",
    amountHint: "The bond amount is usually the full contract price",
    estimate: (v, r) => ({
      premium: fmt(v * (r / 100)),
      detail: `At a ${r}% rate on a ${fmt(v)} contract. Contract bonds are underwritten on your financials and job history, so the rate is quoted, not published. On SBA-guaranteed bonds you also pay the SBA 0.6% of the contract price (${fmt(v * 0.006)}).`,
    }),
    applyType: "performance",
  },
};

// Worked examples for the most-searched amounts. Arithmetic only: the rate is
// whatever underwriting quotes, so we show each rate rather than claim one.
const EXAMPLE_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];
const EXAMPLE_RATES = [0.5, 1, 2, 3];

export default function SuretyBondCalculator() {
  useSEO({
    title: "Surety Bond Cost Calculator — Premium by Bond Amount & Type",
    description:
      "Estimate a surety bond premium from the bond amount and rate. What a $10,000, $100,000 or $500,000 bond costs, plus real prices for Texas notary, dealer and title bonds.",
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

  const [bondKey, setBondKey] = useState<BondKey>("any");
  const [amountRaw, setAmountRaw] = useState("");
  const [rateRaw, setRateRaw] = useState("1");
  const model = BOND_MODELS[bondKey];
  const amount = parseFloat(amountRaw.replace(/[^0-9.]/g, "")) || 0;
  const rate = Math.min(20, Math.max(0, parseFloat(rateRaw.replace(/[^0-9.]/g, "")) || 0));
  const showResult = (!model.needsAmount || amount > 0) && (!model.needsRate || rate > 0);
  const result = showResult ? model.estimate(amount, rate) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", padding: "48px 16px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "#6366f1", marginBottom: 16 }}>
            <Calculator size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f8fafc", margin: 0 }}>Surety Bond Cost Calculator</h1>
          <p style={{ color: "#94a3b8", marginTop: 10, fontSize: 16 }}>
            You pay a premium, not the bond amount. Enter the bond amount and the rate you were quoted,
            or pick a Texas bond we write to see what it actually costs.
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
            {model.needsRate && (
              <>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#cbd5e1", margin: "18px 0 8px" }}>
                  Premium rate (%)
                </label>
                <input
                  inputMode="decimal"
                  value={rateRaw}
                  onChange={(e) => setRateRaw(e.target.value)}
                  placeholder="1"
                  style={{
                    width: 140, padding: "12px", borderRadius: 8, fontSize: 18,
                    background: "#0f172a", border: "1px solid #334155", color: "#f1f5f9", outline: "none",
                  }}
                />
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>
                  Use the rate on your quote. Don't have one yet? The table below shows what common rates work out to.
                </p>
              </>
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
              href={model.applyType ? `/get-bond?type=${model.applyType}&utm_source=calculator` : "/get-bond?utm_source=calculator"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18,
                background: "#6366f1", color: "#fff", fontWeight: 700, fontSize: 16,
                padding: "14px 32px", borderRadius: 10, textDecoration: "none",
              }}
            >
              Get My Exact Quote <ArrowRight size={18} />
            </Link>
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 12 }}>
              An estimate, not a quote. The final premium is confirmed before you pay. No obligation.
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

        {/* SEO copy — mirrors the crawler version in server/seo.ts; keep the two in step */}
        <div style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.75 }}>
          <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 700 }}>What a surety bond costs at common bond amounts</h2>
          <p>
            Premium = bond amount × rate. The rate is set by the surety's underwriting, so this table shows what each
            rate works out to rather than guessing yours. Most bonds also have a minimum premium.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, margin: "8px 0 24px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #334155", color: "#e2e8f0" }}>Bond amount</th>
                  {EXAMPLE_RATES.map((r) => (
                    <th key={r} style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #334155", color: "#e2e8f0" }}>at {r}%</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_AMOUNTS.map((a) => (
                  <tr key={a}>
                    <td style={{ padding: 8, borderBottom: "1px solid #1e293b" }}>{fmt(a)}</td>
                    {EXAMPLE_RATES.map((r) => (
                      <td key={r} style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #1e293b" }}>{fmt((a * r) / 100)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 700 }}>What we actually charge in Texas</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li><Link href="/bonds/notary-bond-texas" style={{ color: "#818cf8" }}>Texas notary bond</Link>: $50 for the full 4-year term of the $10,000 bond, plus the Secretary of State's $21 filing fee.</li>
            <li><Link href="/bonds/gdn-bond-texas" style={{ color: "#818cf8" }}>GDN dealer bond</Link>: $50,000 bond, 2-year term, from $250 for the term.</li>
            <li>Vehicle title bond: 1.5× the vehicle's value, 3-year term, $100 minimum. A $9,075 title bond we wrote in August 2026 cost $136. See the <Link href="/title-bond-calculator" style={{ color: "#818cf8" }}>title bond calculator</Link>.</li>
            <li>Contractor license bond: $100 minimum premium; above that, the rate is set by underwriting.</li>
          </ul>

          <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 700 }}>Bid, performance and payment bonds</h2>
          <p>
            These are priced per contractor from financial statements and job history, so there is no published rate.
            The bid documents set the bond amounts: a bid bond is often a percentage of your bid, and performance and
            payment bonds are usually the full contract price. If your bond is guaranteed through the SBA's Surety Bond
            Guarantee Program, the SBA charges 0.6% of the contract price on performance and payment bonds and nothing
            on bid bonds.
          </p>
        </div>
      </div>
    </div>
  );
}
