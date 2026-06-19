import { useState } from "react";
import { Shield, CheckCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { track } from "@/hooks/useTracker";

const DEALER_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX";
const NOTARY_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX";
// License/contractor bonds — same URL used across all site trade/license bond pages
const LICENSE_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX";

const BOND_META: Record<string, { label: string; amount: string; from: string; blurb: string; redirectUrl?: string }> = {
  notary: {
    label: "Texas Notary Bond",
    amount: "$10,000",
    from: "$50 flat (4-year)",
    blurb: "Required by the Texas Secretary of State for all commissioned notaries. $50 flat for a 4-year bond — instant PDF certificate, same-day issuance.",
    redirectUrl: NOTARY_URL,
  },
  dealer: {
    label: "Texas GDN Dealer Bond",
    amount: "$50,000",
    from: "from $100/yr",
    blurb: "Required by TxDMV for all Texas motor vehicle dealer licenses (GDN). Same-day certificate, TxDMV-accepted.",
    redirectUrl: DEALER_URL,
  },
  gdn: {
    label: "Texas GDN Dealer Bond",
    amount: "$50,000",
    from: "from $100/yr",
    blurb: "Required by TxDMV for all Texas motor vehicle dealer licenses (GDN). Same-day certificate, TxDMV-accepted.",
    redirectUrl: DEALER_URL,
  },
  contractor: {
    label: "Texas Contractor License Bond",
    amount: "$10,000+",
    from: "from $75/yr",
    blurb: "Required for Texas contractor and trade licenses (TDLR, City, County). Fast approval and same-day certificate available.",
    redirectUrl: LICENSE_URL,
  },
  construction: {
    label: "Texas Construction Bond",
    amount: "Project-Based",
    from: "Custom Rate",
    blurb: "Bid, performance, and payment bonds for Texas construction projects. TDI-licensed, fast turnaround.",
    redirectUrl: LICENSE_URL,
  },
  bid: {
    label: "Texas Bid Bond",
    amount: "Project-Based",
    from: "Custom Rate",
    blurb: "Bid bonds for Texas public and private construction projects. TDI-licensed surety agency.",
    redirectUrl: LICENSE_URL,
  },
  performance: {
    label: "Texas Performance & Payment Bond",
    amount: "Project-Based",
    from: "Custom Rate",
    blurb: "Performance and payment bonds for Texas construction contracts. TDI-licensed, competitive rates.",
    redirectUrl: LICENSE_URL,
  },
  mortgage: {
    label: "Texas Mortgage Broker Bond",
    amount: "$50,000",
    from: "from $150/yr",
    blurb: "Required for Texas mortgage brokers and loan officers (TDHCA/SML). Same-day certificate available.",
    redirectUrl: LICENSE_URL,
  },
  "credit-access-business": {
    label: "Texas Credit Access Business Bond",
    amount: "$10,000",
    from: "from $75/yr",
    blurb: "Required by Texas municipalities for credit access businesses (CABs). Fast approval, TDI-licensed.",
    redirectUrl: LICENSE_URL,
  },
  "collection-agency": {
    label: "Texas Collection Agency Bond",
    amount: "$10,000",
    from: "from $75/yr",
    blurb: "Required for Texas collection agency licenses. TDI-licensed surety agency, fast turnaround.",
    redirectUrl: LICENSE_URL,
  },
  "property-tax-consultant": {
    label: "Texas Property Tax Consultant Bond",
    amount: "$5,000",
    from: "from $50/yr",
    blurb: "Required for registered property tax consultants in Texas. Instant approval available.",
    redirectUrl: LICENSE_URL,
  },
  "oversize-permit": {
    label: "Texas Oversize/Overweight Permit Bond",
    amount: "$15,000",
    from: "from $100/yr",
    blurb: "Required by TxDMV under Transportation Code Ch. 623 for many oversize/overweight hauling permits. Annual term, same-day issuance.",
    redirectUrl: LICENSE_URL,
  },
};

export default function GetBond() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const rawType = (params.get("type") || "").toLowerCase().split("?")[0];
  const type = rawType in BOND_META ? rawType : (rawType.startsWith("notary") ? "notary" : "dealer");
  const meta = BOND_META[type];

  useSEO({
    title: type === "notary"
      ? "Get Your Texas Notary Bond | $50 Instant | Quantum Surety"
      : type === "dealer" || type === "gdn"
      ? "Get Your Texas GDN Dealer Bond | Same-Day Certificate | Quantum Surety"
      : `Get Your ${meta.label} | Same-Day Certificate | Quantum Surety`,
    description: type === "notary"
      ? "Apply for your Texas notary bond online. $10,000 bond, $50 flat fee, instant PDF download. SB693 compliant. TDI-licensed agency."
      : type === "dealer" || type === "gdn"
      ? "Apply for your Texas GDN dealer bond online. $50,000 bond from $100/yr. Same-day PDF certificate emailed to you. TxDMV-accepted."
      : `Apply for your ${meta.label} online. ${meta.blurb}`,
    canonical: `/get-bond`,
  });

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    setSubmitting(true);
    track({ type: "lead_submit", element: "cta_button", value: type });
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bond_type: type }),
      });
    } catch (_) {
      // don't block redirect on network error
    }
    track({ type: "mybondapp_redirect", element: "lead_form", value: type });
    const dest = meta.redirectUrl || DEALER_URL;
    setCheckoutUrl(dest);
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Get Your {meta.label}</h1>
          <p className="mt-2 text-gray-500 text-sm">{meta.blurb}</p>
        </div>

        {/* Bond summary */}
        <div className="flex gap-4 mb-6 justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{meta.amount}</div>
            <div className="text-xs text-gray-500">Bond Amount</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{meta.from}</div>
            <div className="text-xs text-gray-500">Your Cost</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">Same Day</div>
            <div className="text-xs text-gray-500">Certificate</div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">One more step — complete your payment</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Click the button below to open your secure bond application and receive your certificate instantly.
                </p>
              </div>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track({ type: "checkout_click", element: "submitted_link", value: type })}
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-lg transition-colors text-base text-center"
              >
                Complete Your Purchase →
              </a>
              <p className="text-xs text-gray-400 text-center">
                Secure checkout · Certificate emailed instantly · Need help? (214) 666-8718
              </p>
            </div>
          ) : (
          <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm"
            >
              {submitting ? "Redirecting…" : "Continue to Application →"}
            </button>

            <p className="text-[11px] text-gray-400 leading-snug">
              By submitting, you agree that Quantum Surety may contact you about your request by phone, text, or email.
            </p>
          </form>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              No obligation — view your rate instantly
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              Certificate emailed same day after approval
            </div>
          </div>
          </>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Prefer to talk?{" "}
          <a href="tel:+12146668718" className="text-indigo-600 font-medium hover:underline" onClick={() => track({ type: "phone_click", element: "phone_link", value: "(214) 666-8718" })}>
            (214) 666-8718
          </a>
        </div>
      </div>
    </div>
  );
}
