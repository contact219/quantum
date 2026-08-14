import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { track } from "@/hooks/useTracker";
import { CheckCircle, Shield, ArrowRight, ArrowLeft, Phone } from "lucide-react";

/**
 * Contract surety qualification intake.
 *
 * WHY THIS EXISTS. Bid, performance and payment bonds previously landed on the generic
 * "an agent will call you" branch after collecting name, email and phone. Contract surety
 * cannot be quoted from that: an underwriter needs the project (obligee, contract amount,
 * duration) and the contractor's financial position before the conversation is worth
 * having. Ted was taking calls with nothing and starting from zero.
 *
 * It is also shaped around SBA Form 994. An agency cannot join the SBA Surety Bond
 * Guarantee programme directly -- authorisation comes through a participating surety --
 * but the data the SBA wants is the data an underwriter wants, so collecting it once
 * serves both routes.
 *
 * ORDER IS DELIBERATE. The project comes first and asks for nothing personal; contact
 * details come last, after the visitor has been told what they qualify for. A contractor
 * should never type a field whose purpose they do not already understand. This is the
 * same lesson the /get-bond rebuild learned the hard way.
 *
 * Deliberately a separate page rather than an extension of /get-bond: that file is being
 * rebuilt on a held branch and is the subject of a live conversion experiment.
 */

const BOND_KINDS = [
  { id: "bid", label: "Bid bond", hint: "Required to submit a bid on a public project" },
  { id: "performance", label: "Performance & payment", hint: "Required after you win, before work starts" },
  { id: "both", label: "Both", hint: "You are bidding and expect to be awarded" },
  { id: "unsure", label: "Not sure yet", hint: "We will work it out from the solicitation" },
];

const AMOUNTS = [
  { id: "under-100k", label: "Under $100,000", sba: "90% SBA guarantee band" },
  { id: "100k-500k", label: "$100,000 – $500,000", sba: "SBA Quick Bond Guarantee band" },
  { id: "500k-2m", label: "$500,000 – $2 million", sba: "" },
  { id: "2m-9m", label: "$2 million – $9 million", sba: "" },
  { id: "over-9m", label: "Over $9 million", sba: "" },
];

const REVENUE = ["Under $250k", "$250k – $1M", "$1M – $5M", "$5M – $15M", "Over $15M"];

const BONDED_BEFORE = [
  { id: "current", label: "Yes — we have a surety now" },
  { id: "past", label: "Yes — but not currently" },
  { id: "never", label: "No — this would be our first bond" },
];

// These drive a 90% SBA guarantee regardless of contract size, so they are worth asking.
const SET_ASIDES = [
  "Veteran-owned",
  "Service-disabled veteran-owned",
  "HUBZone",
  "8(a) certified",
  "Woman-owned",
  "Economically disadvantaged",
];

type Step = 1 | 2 | 3 | 4 | 5;

export default function ContractSuretyApply() {
  useSEO({
    title: "Texas Contract Surety Application — Bid, Performance & Payment Bonds",
    description:
      "Tell us about the project and we will tell you what it takes to get bonded, including whether you qualify for the SBA Surety Bond Guarantee. Texas contractors, TDI-licensed agency.",
    canonical: "/contract-surety",
  });

  const [step, setStep] = useState<Step>(1);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const [kind, setKind] = useState("");
  const [amount, setAmount] = useState("");
  const [obligee, setObligee] = useState("");
  const [needBy, setNeedBy] = useState("");
  const [company, setCompany] = useState("");
  const [years, setYears] = useState("");
  const [revenue, setRevenue] = useState("");
  const [bonded, setBonded] = useState("");
  const [statements, setStatements] = useState("");
  const [setAsides, setSetAsides] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function first() {
    if (!started) {
      setStarted(true);
      track({ type: "form_start", element: "contract_surety", value: "contract" });
    }
  }

  const smallBand = amount === "under-100k" || amount === "100k-500k";
  const sbaFit = smallBand || setAsides.length > 0;
  const tooBig = amount === "over-9m";

  function go(next: Step) {
    setErr("");
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErr("We need all three so an underwriter can reach you.");
      return;
    }
    setBusy(true);
    // Everything the underwriter needs, in one place, so the first call is a real
    // conversation instead of a discovery call.
    const notes = [
      `Bond needed: ${BOND_KINDS.find((b) => b.id === kind)?.label || "unspecified"}`,
      `Contract amount: ${AMOUNTS.find((a) => a.id === amount)?.label || "unspecified"}`,
      `Obligee / project: ${obligee || "not given"}`,
      `Needed by: ${needBy || "not given"}`,
      `Company: ${company || "not given"} — ${years || "?"} years in business`,
      `Annual revenue: ${revenue || "not given"}`,
      `Bonding history: ${BONDED_BEFORE.find((b) => b.id === bonded)?.label || "not given"}`,
      `CPA financial statements: ${statements || "not given"}`,
      `Set-asides: ${setAsides.length ? setAsides.join(", ") : "none stated"}`,
      sbaFit ? "SBA SBG: likely candidate" : "SBA SBG: outside the obvious band",
    ].join(" | ");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          bond_type: kind === "bid" ? "bid" : "performance",
          source: "contract-surety-intake",
          notes,
        }),
      });
    } catch {
      /* never block the applicant on our network */
    }
    track({ type: "lead_submit", element: "contract_surety", value: "contract" });
    setBusy(false);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-8">
          <CheckCircle className="w-10 h-10 text-emerald-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-3">We have what we need to start</h1>
          <p className="text-slate-700 leading-relaxed mb-4">
            A licensed underwriter will review this and come back to you — usually the same business
            day — with exactly what is required to get the bond issued and how long it will take.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            If your bid date is close, call rather than wait. Contract bonds move at the speed of the
            paperwork, and we can start yours while we talk.
          </p>
          <a
            href="tel:+12146668718"
            onClick={() => track({ type: "phone_click", element: "contract_surety_done", value: "contract" })}
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg"
          >
            <Phone className="w-4 h-4" /> (214) 666-8718
          </a>
        </div>
      </div>
    );
  }

  const pct = [0, 20, 45, 70, 100][step];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-slate-600 text-sm">
          <Shield className="w-4 h-4" />
          <span>Quantum Surety · TDI Licensed #3480229</span>
        </div>

        <div className="h-1.5 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-slate-900 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7">
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">What does the project need?</h1>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Nothing personal on this page. We ask about the job first because the contract size
                decides everything else — including whether the SBA can guarantee your bond.
              </p>

              <div className="space-y-2 mb-6">
                {BOND_KINDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { first(); setKind(b.id); }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                      kind === b.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{b.label}</div>
                    <div className="text-sm text-slate-500">{b.hint}</div>
                  </button>
                ))}
              </div>

              <label className="block text-sm font-semibold text-slate-800 mb-2">Contract amount</label>
              <div className="space-y-2 mb-6">
                {AMOUNTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => { first(); setAmount(a.id); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border flex items-center justify-between transition ${
                      amount === a.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <span className="text-slate-900">{a.label}</span>
                    {a.sba && <span className="text-xs text-emerald-700 font-medium">{a.sba}</span>}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={!kind || !amount}
                onClick={() => go(2)}
                className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg disabled:opacity-40 inline-flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Who is requiring the bond?</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                The obligee is whoever demands the bond — a city, a school district, TxDOT, a general
                contractor. It is on the solicitation. A rough answer is fine.
              </p>
              <input
                value={obligee}
                onChange={(e) => { first(); setObligee(e.target.value); }}
                placeholder="e.g. Dallas ISD, City of Plano, TxDOT"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-5"
              />
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                When do you need it?
              </label>
              <input
                value={needBy}
                onChange={(e) => setNeedBy(e.target.value)}
                placeholder="Bid date or start date"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-6"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => go(1)} className="px-4 py-3 rounded-lg border border-slate-300 text-slate-700 inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={() => go(3)} className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-lg inline-flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">About your business</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Underwriting a contract bond is mostly about capacity — whether the job is a
                reasonable size for the company doing it. Ranges are fine.
              </p>
              <input value={company} onChange={(e) => { first(); setCompany(e.target.value); }} placeholder="Business name" className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-3" />
              <input value={years} onChange={(e) => setYears(e.target.value)} placeholder="Years in business" inputMode="numeric" className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-3" />
              <select value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-5 bg-white">
                <option value="">Annual revenue</option>
                {REVENUE.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>

              <label className="block text-sm font-semibold text-slate-800 mb-2">Have you been bonded before?</label>
              <div className="space-y-2 mb-6">
                {BONDED_BEFORE.map((b) => (
                  <button key={b.id} type="button" onClick={() => setBonded(b.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border transition ${bonded === b.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                    <span className="text-slate-900">{b.label}</span>
                  </button>
                ))}
              </div>
              {bonded === "never" && (
                <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mb-6">
                  A first bond is the one most agencies turn away. It is the one we are set up to
                  write — see the next page.
                </p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => go(2)} className="px-4 py-3 rounded-lg border border-slate-300 text-slate-700 inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={() => go(4)} className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-lg inline-flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Two things that change the answer</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                The SBA guarantees 80–90% of contract bonds for small businesses, which is how
                contractors without a bonding history get bonded at all. These two questions decide
                whether that route is open to you.
              </p>

              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Do you have CPA-prepared or reviewed financial statements?
              </label>
              <div className="space-y-2 mb-6">
                {["Yes", "No — internal or tax returns only", "Not sure"].map((s) => (
                  <button key={s} type="button" onClick={() => setStatements(s)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border transition ${statements === s ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                    <span className="text-slate-900">{s}</span>
                  </button>
                ))}
              </div>

              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Does the business hold any of these? <span className="font-normal text-slate-500">Select all that apply</span>
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {SET_ASIDES.map((s) => {
                  const on = setAsides.includes(s);
                  return (
                    <button key={s} type="button"
                      onClick={() => setSetAsides(on ? setAsides.filter((x) => x !== s) : [...setAsides, s])}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition ${on ? "border-slate-900 bg-slate-50 font-medium" : "border-slate-200 hover:border-slate-400"}`}>
                      {s}
                    </button>
                  );
                })}
              </div>

              {sbaFit && !tooBig && (
                <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mb-6">
                  On what you have told us, this looks like an SBA-guaranteed bond
                  {smallBand ? " under the simplified process for contracts below $500,000" : ""}
                  {setAsides.length ? ", at the higher 90% guarantee" : ""}. An underwriter will confirm.
                </p>
              )}
              {tooBig && (
                <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
                  Above $9 million is outside the SBA programme, so this would be written on standard
                  terms. Still worth a conversation — tell us about it below.
                </p>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => go(3)} className="px-4 py-3 rounded-lg border border-slate-300 text-slate-700 inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={() => go(5)} className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-lg inline-flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 5 && (
            <form onSubmit={submit}>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Where do we send the answer?</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                An underwriter reviews what you have entered and comes back with what is required and
                how long it takes. We ask for a phone number because bid dates do not move and email
                is too slow when one is close.
              </p>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-3" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" autoComplete="email" className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-3" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone" autoComplete="tel" className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-4" />
              {err && <p className="text-sm text-red-700 mb-3">{err}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => go(4)} className="px-4 py-3 rounded-lg border border-slate-300 text-slate-700 inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" disabled={busy} className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
                  {busy ? "Sending…" : "Send to an underwriter"}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                No credit is pulled and nothing is charged from this page.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Bid date this week?{" "}
          <a href="tel:+12146668718" onClick={() => track({ type: "phone_click", element: "contract_surety_footer", value: "contract" })} className="text-slate-900 font-semibold underline">
            Call (214) 666-8718
          </a>
        </p>
      </div>
    </div>
  );
}
