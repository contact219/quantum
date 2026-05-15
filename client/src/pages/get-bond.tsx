import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, CheckCircle, Phone } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const DEALER_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX";
const NOTARY_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX";

const BOND_META: Record<string, { label: string; amount: string; from: string; blurb: string }> = {
  dealer: {
    label: "Texas GDN Dealer Bond",
    amount: "$50,000",
    from: "from $100/yr",
    blurb: "Required by TxDMV for all Texas motor vehicle dealer licenses (GDN). Same-day certificate, TxDMV-accepted.",
  },
  notary: {
    label: "Texas Notary Bond",
    amount: "$10,000",
    from: "from $30/yr",
    blurb: "Required by the Texas Secretary of State for all commissioned notaries. Instant PDF certificate, 4-year term available.",
  },
};

export default function GetBond() {
  const [location] = useLocation();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const type = params.get("type")?.startsWith("notary") ? "notary" : "dealer";
  const meta = BOND_META[type];

  useSEO({
    title: type === "notary"
      ? "Get Your Texas Notary Bond | $50 Instant | Quantum Surety"
      : "Get Your Texas GDN Dealer Bond | Same-Day Certificate | Quantum Surety",
    description: type === "notary"
      ? "Apply for your Texas notary bond online. $10,000 bond, $50 flat fee, instant PDF download. SB693 compliant. TDI-licensed agency."
      : "Apply for your Texas GDN dealer bond online. $50,000 bond from $100/yr. Same-day PDF certificate emailed to you. TxDMV-accepted.",
    canonical: `/get-bond`,
  });

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
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
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bond_type: type }),
      });
    } catch (_) {
      // don't block redirect on network error
    }
    window.location.href = type === "notary" ? NOTARY_URL : DEALER_URL;
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
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Prefer to talk?{" "}
          <a href="tel:+19723799216" className="text-indigo-600 font-medium hover:underline">
            972-379-9216
          </a>
        </div>
      </div>
    </div>
  );
}
