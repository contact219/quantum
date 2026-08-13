import { useEffect, useRef, useState } from "react";
import { Shield, CheckCircle, ArrowLeft, Search, Phone, AlertTriangle, ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { track } from "@/hooks/useTracker";
import CarrierCheckoutPreview from "@/components/get-bond/CarrierCheckoutPreview";

const DEALER_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX";
const NOTARY_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX";
// Certificate/Defective Title Bond (TX DMV) — R42DA. Verified 2026-07-02: this is the
// vehicle TITLE bond product, so only title bond types may redirect to it. RLI has no
// generic TX contractor/mortgage/property-tax product — those types stay lead-only
// (no redirectUrl) and get a personal follow-up instead of a wrong-product checkout.
const TITLE_URL = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX";

const PHONE_DISPLAY = "(214) 666-8718";
const PHONE_HREF = "tel:+12146668718";

type Price = { headline: string; detail: string };

type BondMeta = {
  label: string;
  amount: string;
  /** Who requires the bond. Named on-screen so a stranger can check it against their letter. */
  obligee: string;
  /** Only set where we can state the term honestly. Omitted rather than guessed. */
  term?: string;
  price: Price;
  blurb: string;
  redirectUrl?: string;
  /** Extra search terms for the picker. */
  keywords?: string;
};

// Price copy policy — read before editing.
//
// This page used to advertise "$50 Instant" (title) and "from $27.50" (price block).
// Against 45 notary bonds this agency has actually issued, the observed distribution is
// min $71.00, median $107.56, max $195.56. ZERO bonds were issued at or below $50, and
// ZERO at or below $27.50. Both numbers described a transaction that has never happened,
// and a customer who arrived at RLI's checkout expecting $27.50 and saw ~$108 had a
// concrete reason to close the tab on a screen we cannot instrument.
//
// Rule now: only quote a number we can source to bonds we actually issued. Where we have
// no such data (dealer, title), say the carrier prices it and show no number at all.
// Never re-introduce a "from $X" figure that isn't backed by issued-bond data.
//
// On $27.50 specifically: the arithmetic was probably fine and the label was the lie.
// $107.56 median / 4-year term = $26.89/yr, so $27.50 reads as a per-year figure — but it
// sat under the words "Your Cost" with no "per year" anywhere on the page. Kept below as
// an explicitly-labelled per-year restatement of the median, never as the headline.
const NOTARY_PRICE: Price = {
  headline: "Most pay about $108",
  detail:
    "Across the last 45 Texas notary bonds we issued, customers paid between $71 and $196 for the full 4-year term. The typical $108 works out to roughly $27 a year — but it is charged once, up front, not annually. RLI sets your exact figure and shows it before you enter a card; we don't set it and can't see it in advance.",
};

const CARRIER_PRICED: Price = {
  headline: "Priced by the carrier",
  detail:
    "We don't have issued-bond data to quote a range for this one, so we won't invent one. RLI shows your exact total on their page before you enter any payment details.",
};

const AGENT_QUOTED: Price = {
  headline: "Quoted by an agent",
  detail:
    "This bond isn't sold instantly. A licensed agent prices it against the bond amount your obligee actually requires, then calls you with the number.",
};

const BOND_META: Record<string, BondMeta> = {
  notary: {
    label: "Texas Notary Bond",
    amount: "$10,000",
    obligee: "Texas Secretary of State, Notary Public Unit",
    term: "4-year term",
    price: NOTARY_PRICE,
    blurb: "Required by the Texas Secretary of State for every commissioned Texas notary.",
    redirectUrl: NOTARY_URL,
    keywords: "notary public commission sos sb693 stamp seal",
  },
  // UNRESOLVED, 2026-08-13 — do not change this figure without checking TxDMV.
  // This page has advertised the GDN bond at $50,000 for as long as it has existed, but
  // every dealer bond in our own book (all 15, issued and saved) is $25,000 with premiums
  // of $250–$300. Either Texas raised the statutory amount and our book is legacy, or this
  // number is simply wrong. Left as-is deliberately rather than silently "corrected";
  // flagged for Ted to confirm against the current TxDMV requirement.
  dealer: {
    label: "Texas GDN Dealer Bond",
    amount: "$50,000",
    obligee: "Texas Dept. of Motor Vehicles (TxDMV)",
    price: CARRIER_PRICED,
    blurb: "Required by TxDMV for a Texas motor vehicle dealer (GDN) license.",
    redirectUrl: DEALER_URL,
    keywords: "gdn dealer car auto motor vehicle txdmv lot",
  },
  gdn: {
    label: "Texas GDN Dealer Bond",
    amount: "$50,000",
    obligee: "Texas Dept. of Motor Vehicles (TxDMV)",
    price: CARRIER_PRICED,
    blurb: "Required by TxDMV for a Texas motor vehicle dealer (GDN) license.",
    redirectUrl: DEALER_URL,
  },
  contractor: {
    label: "Texas Contractor License Bond",
    amount: "$10,000+",
    obligee: "TDLR, or your city or county licensing office",
    price: AGENT_QUOTED,
    blurb: "Required for Texas contractor and trade licenses. The amount is set by whoever licenses you.",
    keywords: "contractor trade license tdlr city county electrician plumber hvac",
  },
  construction: {
    label: "Texas Construction Bond",
    amount: "Project-based",
    obligee: "The project owner or public entity awarding the contract",
    term: "Per project",
    price: AGENT_QUOTED,
    blurb: "Bid, performance, and payment bonds for Texas construction projects.",
    keywords: "construction project owner general contractor",
  },
  bid: {
    label: "Texas Bid Bond",
    amount: "Project-based",
    obligee: "The project owner or public entity taking bids",
    term: "Per project",
    price: AGENT_QUOTED,
    blurb: "Guarantees you'll honour your bid if the project is awarded to you.",
    keywords: "bid proposal tender public works",
  },
  performance: {
    label: "Texas Performance & Payment Bond",
    amount: "Project-based",
    obligee: "The project owner or public entity awarding the contract",
    term: "Per project",
    price: AGENT_QUOTED,
    blurb: "Guarantees you'll finish the contract and pay your subs and suppliers.",
    keywords: "performance payment subcontractor supplier public works",
  },
  mortgage: {
    label: "Texas Mortgage Broker Bond",
    amount: "$50,000",
    obligee: "Texas Dept. of Savings & Mortgage Lending (SML)",
    price: AGENT_QUOTED,
    blurb: "Required for Texas mortgage broker and residential loan originator licences.",
    keywords: "mortgage broker loan originator sml tdhca nmls",
  },
  "credit-access-business": {
    label: "Texas Credit Access Business Bond",
    amount: "$10,000",
    obligee: "The Texas city that licenses your CAB",
    price: AGENT_QUOTED,
    blurb: "Required by Texas municipalities for credit access businesses (CABs).",
    keywords: "cab credit access payday title loan municipal",
  },
  "collection-agency": {
    label: "Texas Collection Agency Bond",
    amount: "$10,000",
    obligee: "Texas Secretary of State",
    price: AGENT_QUOTED,
    blurb: "Required of third-party debt collectors operating in Texas.",
    keywords: "collection agency debt collector sos",
  },
  "property-tax-consultant": {
    label: "Texas Property Tax Consultant Bond",
    amount: "$5,000",
    obligee: "Texas Dept. of Licensing & Regulation (TDLR)",
    price: AGENT_QUOTED,
    blurb: "Required for registered property tax consultants in Texas.",
    keywords: "property tax consultant tdlr appraisal protest",
  },
  "oversize-permit": {
    label: "Texas Oversize/Overweight Permit Bond",
    amount: "$15,000",
    obligee: "Texas Dept. of Motor Vehicles (TxDMV)",
    price: AGENT_QUOTED,
    blurb: "Required under Transportation Code Ch. 623 for many oversize/overweight hauling permits.",
    keywords: "oversize overweight permit hauling trucking 623",
  },
  title: {
    label: "Texas Vehicle Title Bond",
    amount: "1.5× the appraised vehicle value",
    obligee: "Texas Dept. of Motor Vehicles (TxDMV)",
    price: CARRIER_PRICED,
    blurb: "Required by TxDMV when the original title is lost, missing, or unavailable.",
    redirectUrl: TITLE_URL,
    keywords: "bonded title vehicle car lost title defective certificate txdmv",
  },
  "bonded-title": {
    label: "Texas Vehicle Title Bond",
    amount: "1.5× the appraised vehicle value",
    obligee: "Texas Dept. of Motor Vehicles (TxDMV)",
    price: CARRIER_PRICED,
    blurb: "Required by TxDMV when the original title is lost, missing, or unavailable.",
    redirectUrl: TITLE_URL,
  },
  "vehicle-title": {
    label: "Texas Vehicle Title Bond",
    amount: "1.5× the appraised vehicle value",
    obligee: "Texas Dept. of Motor Vehicles (TxDMV)",
    price: CARRIER_PRICED,
    blurb: "Required by TxDMV when the original title is lost, missing, or unavailable.",
    redirectUrl: TITLE_URL,
  },
  // Jet Surety's flow has a "Not really, help me out" escape on its bond picker. This is
  // ours. It has no redirectUrl on purpose — an unidentified bond must never be sent to a
  // checkout for the wrong product. It lands on the "Application received" branch.
  other: {
    label: "Not sure which bond I need",
    amount: "—",
    obligee: "We'll work it out from your licence letter",
    price: {
      headline: "An agent identifies it free",
      detail:
        "Tell us how to reach you and forward the letter or application that asked for a bond. A licensed agent names the exact bond and amount, then quotes it.",
    },
    blurb: "Someone asked you for a bond and you're not sure which one. That's normal — most bond names come from a statute, not from plain English.",
    keywords: "help unsure dont know other",
  },
};

/** Canonical entries shown in the picker. Aliases (gdn, bonded-title, vehicle-title) are hidden. */
const PICKER_ORDER = [
  "notary",
  "dealer",
  "title",
  "contractor",
  "construction",
  "bid",
  "performance",
  "mortgage",
  "oversize-permit",
  "collection-agency",
  "credit-access-business",
  "property-tax-consultant",
  "other",
];

// Two paths, deliberately different shapes.
//
//   instant  (has redirectUrl):  confirm → handoff → carrier's tab
//   agent    (no redirectUrl):   confirm → details → received
//
// The instant path has NO standalone details step. An earlier build put one there and a
// blind critic named it correctly: "a lead-capture gate wearing a service explanation" —
// three mandatory fields whose stated justification ("so we can reopen your application")
// only makes sense *after* you know a handoff is coming, which you didn't yet. The fields
// now live at the bottom of the handoff screen, below the paragraph that earns them, and
// the checkout link is a plain anchor that our form does not stand in front of.
type Step = "confirm" | "picker" | "details" | "handoff" | "received";

function resolveInitialType(raw: string): { type: string; assumed: boolean } {
  if (raw in BOND_META) return { type: raw, assumed: false };
  if (raw.startsWith("dealer") || raw.startsWith("gdn")) return { type: "dealer", assumed: false };
  // 97.7% of get-bond traffic arrives with no `type` (10,536 of 10,788 views in the 90 days
  // to 2026-08-13). Notary is the only product with sales history, so it's the sensible
  // opening guess — but it is a *guess*, and `assumed` makes the page say so out loud
  // instead of silently selling a stranger the wrong bond.
  return { type: "notary", assumed: true };
}

export default function GetBond() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const rawType = (params.get("type") || "").toLowerCase().split("?")[0];
  const initial = resolveInitialType(rawType);

  const [type, setType] = useState(initial.type);
  const [assumed, setAssumed] = useState(initial.assumed);
  const [step, setStep] = useState<Step>("confirm");
  const meta = BOND_META[type];

  useSEO({
    title:
      type === "notary"
        ? "Texas Notary Bond — Apply Online | Quantum Surety"
        : type === "dealer" || type === "gdn"
        ? "Texas GDN Dealer Bond — Apply Online | Quantum Surety"
        : `${meta.label} — Apply Online | Quantum Surety`,
    description:
      type === "notary"
        ? "Apply for your $10,000 Texas notary bond, 4-year term. Recent customers paid $71–$196, most about $108. TDI-licensed agency, bonds written by RLI (A+ rated)."
        : `Apply for your ${meta.label} online. ${meta.blurb}`,
    canonical: `/get-bond`,
  });

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [openedCheckout, setOpenedCheckout] = useState(false);
  const [query, setQuery] = useState("");

  // Funnel diagnostics: fire once on first keystroke so we can separate
  // "landed and left without touching the form" from "started but abandoned it".
  // Pairs with lead_submit / checkout_click to locate the real drop-off.
  const startedRef = useRef(false);
  const leadSentRef = useRef(false);
  const redirectFiredRef = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  // `mybondapp_redirect` now fires on ARRIVAL at the handoff screen, not on form submit.
  // Same event name, same payload, better meaning: it used to be a duplicate of
  // lead_submit (both fired on the same click), so the pair could never tell us anything.
  // Reaching the handoff is the moment a customer first sees the cliff, which makes
  // mybondapp_redirect → checkout_click the number that actually matters.
  useEffect(() => {
    if (step === "handoff" && !redirectFiredRef.current) {
      redirectFiredRef.current = true;
      track({ type: "mybondapp_redirect", element: "lead_form", value: type });
    }
  }, [step, type]);

  function goto(next: Step) {
    setStep(next);
  }

  function chooseType(next: string) {
    setType(next);
    setAssumed(false);
    setQuery("");
    track({ type: "bond_select", element: "picker", value: next });
    goto("confirm");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!startedRef.current) {
      startedRef.current = true;
      track({ type: "form_start", element: e.target.name, value: type });
    }
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFieldErrors(errs => (errs[name as keyof typeof errs] ? { ...errs, [name]: undefined } : errs));
  }

  // `phoneRequired` is true only on the agent path, where the deliverable IS a phone call
  // and the screen says so. On the instant path the phone buys the customer nothing they
  // can't get by dialling us themselves, so making it mandatory there would be a toll.
  function validate(phoneRequired: boolean) {
    const errs: { name?: string; email?: string; phone?: string } = {};
    if (!form.name.trim()) errs.name = "Needed to match you to your application.";
    if (!form.email.trim()) errs.email = "Where we'd send anything you ask us for.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      errs.email = "That doesn't look like a complete email address.";
    const digits = form.phone.replace(/\D/g, "");
    if (phoneRequired && !digits) errs.phone = "We're promising you a call, so we need a number.";
    else if (digits && digits.length < 10)
      errs.phone = `That's short for a US number — 10 digits${phoneRequired ? "" : ", or leave it blank"}.`;
    setFieldErrors(errs);
    const first = errs.name ? nameRef : errs.email ? emailRef : errs.phone ? phoneRef : null;
    first?.current?.focus();
    return Object.keys(errs).length === 0;
  }

  function postLead() {
    // keepalive so the request survives the browser handing focus to the carrier's tab.
    return fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        bond_type: type,
        ...(type === "other"
          ? { notes: "Customer selected 'not sure which bond' on /get-bond — needs identification." }
          : {}),
      }),
      keepalive: true,
    }).catch(() => {});
  }

  // Instant path. The CTA is a real <a target="_blank">, so the new tab is opened by the
  // browser's own click handling — never by JS after an await, which pop-up blockers eat.
  // We only preventDefault when the two fields we genuinely need are unusable.
  function handleCheckoutClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!validate(false)) {
      e.preventDefault();
      return;
    }
    if (!leadSentRef.current) {
      leadSentRef.current = true;
      track({ type: "lead_submit", element: "cta_button", value: type });
      postLead();
    }
    track({ type: "checkout_click", element: "submitted_link", value: type });
    setOpenedCheckout(true);
  }

  // Agent path — no navigation to race, so this stays a plain awaited submit.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(true)) return;
    setSubmitting(true);
    leadSentRef.current = true;
    track({ type: "lead_submit", element: "cta_button", value: type });
    await postLead();
    setSubmitting(false);
    goto("received");
  }

  const stepIndex = step === "confirm" || step === "picker" ? 0 : 1;
  const wide = step === "handoff";

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-8 pb-20">
      <div className={`mx-auto w-full ${wide ? "max-w-2xl" : "max-w-lg"}`}>
        {/* Brand strip */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full">
            <Shield className="w-4 h-4 text-white" />
          </span>
          <span className="text-sm font-semibold text-gray-700">Quantum Surety</span>
          <span className="text-xs text-gray-400">· TDI-licensed Texas surety agency</span>
        </div>

        {step !== "received" && <Stepper current={stepIndex} instant={!!meta.redirectUrl} />}

        {step === "confirm" && (
          <ConfirmScreen
            meta={meta}
            assumed={assumed}
            onContinue={() => goto(meta.redirectUrl ? "handoff" : "details")}
            onChange={() => {
              track({ type: "bond_picker_open", element: "confirm", value: type });
              goto("picker");
            }}
          />
        )}

        {step === "picker" && (
          <PickerScreen
            query={query}
            setQuery={setQuery}
            onPick={chooseType}
            onBack={() => goto("confirm")}
            current={type}
          />
        )}

        {step === "details" && (
          <DetailsScreen
            meta={meta}
            form={form}
            errors={fieldErrors}
            submitting={submitting}
            refs={{ nameRef, emailRef, phoneRef }}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onBack={() => goto("confirm")}
          />
        )}

        {step === "handoff" && (
          <HandoffScreen
            meta={meta}
            type={type}
            checkoutUrl={meta.redirectUrl!}
            opened={openedCheckout}
            form={form}
            errors={fieldErrors}
            refs={{ nameRef, emailRef, phoneRef }}
            onChange={handleChange}
            onCheckoutClick={handleCheckoutClick}
            onBack={() => goto("confirm")}
          />
        )}

        {step === "received" && <ReceivedScreen meta={meta} type={type} />}

        <div className="mt-6 text-center text-sm text-gray-500">
          Questions before you start?{" "}
          <a
            href={PHONE_HREF}
            className="text-indigo-600 font-medium hover:underline"
            onClick={() => track({ type: "phone_click", element: "phone_link", value: PHONE_DISPLAY })}
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── Stepper ────────────────────────────── */

function Stepper({ current, instant }: { current: number; instant: boolean }) {
  // Two segments, not three. The instant path really is two screens now, and a stepper
  // that promises fewer steps than the flow delivers is the only kind worth having.
  const labels = ["Your bond", instant ? "Before you go" : "Your details"];
  return (
    <ol className="flex items-center gap-2 mb-5" aria-label="Progress">
      {labels.map((label, i) => (
        <li key={label} className="flex-1">
          <div
            className={`h-1 rounded-full ${i <= current ? "bg-indigo-600" : "bg-gray-200"}`}
            aria-hidden="true"
          />
          <span
            className={`mt-1.5 block text-[11px] ${i === current ? "text-indigo-700 font-semibold" : "text-gray-400"}`}
            aria-current={i === current ? "step" : undefined}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">{children}</div>;
}

function BackLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {children}
    </button>
  );
}

/* ────────────────────────── 1. Confirm the bond ────────────────────────── */

function ConfirmScreen({
  meta,
  assumed,
  onContinue,
  onChange,
}: {
  meta: BondMeta;
  assumed: boolean;
  onContinue: () => void;
  onChange: () => void;
}) {
  return (
    <Card>
      {assumed ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">
          Our best guess — check it before you continue
        </p>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">You're applying for</p>
      )}
      <h1 className="text-xl font-bold text-gray-900">{meta.label}</h1>
      <p className="mt-1.5 text-sm text-gray-500">{meta.blurb}</p>

      <dl className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
        <div className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="text-xs text-gray-500 shrink-0">Required by</dt>
          <dd className="text-sm font-medium text-gray-900 text-right">{meta.obligee}</dd>
        </div>
        {meta.amount !== "—" && (
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-xs text-gray-500 shrink-0">Bond amount</dt>
            <dd className="text-sm font-medium text-gray-900 text-right">{meta.amount}</dd>
          </div>
        )}
        {meta.term && (
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-xs text-gray-500 shrink-0">Term</dt>
            <dd className="text-sm font-medium text-gray-900 text-right">{meta.term}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4">
        <p className="text-base font-bold text-gray-900">{meta.price.headline}</p>
        <p className="mt-1 text-xs text-gray-600 leading-relaxed">{meta.price.detail}</p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-lg transition-colors text-base"
      >
        {assumed ? "Yes — this is my bond →" : "Continue →"}
      </button>

      <button
        type="button"
        onClick={onChange}
        className={`mt-2 w-full rounded-lg py-2.5 px-4 text-sm font-medium transition-colors ${
          assumed
            ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        {assumed ? "No — show me the other Texas bonds" : "This isn't the right bond"}
      </button>

      <p className="mt-4 text-[11px] text-gray-400 text-center leading-relaxed">
        Nothing is charged on this page. We ask for your details on the next screen, then hand you to the carrier's
        checkout.
      </p>
    </Card>
  );
}

/* ───────────────────────── 1b. Bond picker ───────────────────────── */

function PickerScreen({
  query,
  setQuery,
  onPick,
  onBack,
  current,
}: {
  query: string;
  setQuery: (v: string) => void;
  onPick: (key: string) => void;
  onBack: () => void;
  current: string;
}) {
  const q = query.trim().toLowerCase();
  const results = PICKER_ORDER.filter(key => {
    if (!q) return true;
    const m = BOND_META[key];
    return `${m.label} ${m.obligee} ${m.keywords || ""} ${m.blurb}`.toLowerCase().includes(q);
  });

  return (
    <Card>
      <BackLink onClick={onBack}>Back</BackLink>
      <h1 className="text-xl font-bold text-gray-900">Which Texas bond do you need?</h1>
      <p className="mt-1.5 text-sm text-gray-500">
        Every bond below shows who requires it and how large it is. Match those to the letter or application that
        asked you for a bond — that's the reliable way to tell them apart.
      </p>

      <div className="relative mt-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search — e.g. notary, dealer, TDLR, lost title"
          aria-label="Search bond types"
          className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <ul className="mt-3 divide-y divide-gray-100">
        {results.map(key => {
          const m = BOND_META[key];
          const isOther = key === "other";
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onPick(key)}
                className={`w-full text-left py-3 px-2 -mx-2 rounded-lg hover:bg-indigo-50/60 transition-colors ${
                  key === current ? "bg-indigo-50/60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${isOther ? "text-indigo-700" : "text-gray-900"}`}>
                      {isOther ? "Not sure — help me work it out" : m.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isOther ? "An agent identifies the bond from your paperwork, free." : `Required by: ${m.obligee}`}
                    </p>
                  </div>
                  {!isOther && (
                    <span className="text-xs font-medium text-gray-700 whitespace-nowrap shrink-0 pt-0.5">
                      {m.amount}
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="py-6 text-center">
            <p className="text-sm text-gray-500">No match for “{query}”.</p>
            <button
              type="button"
              onClick={() => onPick("other")}
              className="mt-2 text-sm font-medium text-indigo-600 hover:underline"
            >
              Have an agent identify it for you →
            </button>
          </li>
        )}
      </ul>

      <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">
        Texas bonds only. If your obligee is outside Texas, call {PHONE_DISPLAY} — we'll tell you honestly whether we
        can write it.
      </p>
    </Card>
  );
}

/* ───────────────────── Shared contact fields ───────────────────── */

type FieldRefs = {
  nameRef: React.RefObject<HTMLInputElement>;
  emailRef: React.RefObject<HTMLInputElement>;
  phoneRef: React.RefObject<HTMLInputElement>;
};
type FormShape = { name: string; email: string; phone: string };
type FieldErrors = { name?: string; email?: string; phone?: string };

function Field({
  label,
  hint,
  name,
  type,
  autoComplete,
  placeholder,
  value,
  error,
  inputRef,
  onChange,
  inputMode,
  required = true,
}: {
  label: string;
  hint?: string;
  name: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  error?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: "text" | "email" | "tel";
  required?: boolean;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {!required && <span className="text-[11px] text-gray-400">optional</span>}
      </label>
      <input
        id={id}
        ref={inputRef}
        name={name}
        type={type}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full rounded-lg border px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
          error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500 leading-snug">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function ContactFields({
  form,
  errors,
  refs,
  onChange,
  phoneRequired,
  phoneHint,
}: {
  form: FormShape;
  errors: FieldErrors;
  refs: FieldRefs;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  phoneRequired: boolean;
  phoneHint?: string;
}) {
  return (
    <div className="space-y-4">
      <Field
        label="Full name"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Jane Smith"
        value={form.name}
        error={errors.name}
        inputRef={refs.nameRef}
        onChange={onChange}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="jane@example.com"
        value={form.email}
        error={errors.email}
        inputRef={refs.emailRef}
        onChange={onChange}
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="(555) 000-0000"
        value={form.phone}
        error={errors.phone}
        inputRef={refs.phoneRef}
        onChange={onChange}
        required={phoneRequired}
        hint={phoneHint}
      />
    </div>
  );
}

/* ─────────────── 2. Your details — agent path only ─────────────── */

function DetailsScreen({
  meta,
  form,
  errors,
  submitting,
  refs,
  onChange,
  onSubmit,
  onBack,
}: {
  meta: BondMeta;
  form: FormShape;
  errors: FieldErrors;
  submitting: boolean;
  refs: FieldRefs;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <BackLink onClick={onBack}>{meta.label}</BackLink>
      <h1 className="text-xl font-bold text-gray-900">Where should the agent call you?</h1>
      <p className="mt-1.5 text-sm text-gray-500">
        {meta.label === BOND_META.other.label
          ? "Forward us the letter that asked for a bond and an agent will name it, or just describe it on the call."
          : `A ${meta.label} is priced by hand against what your obligee requires, so the next step is a person, not a checkout.`}
      </p>

      <form onSubmit={onSubmit} className="space-y-4 mt-5" noValidate>
        <ContactFields form={form} errors={errors} refs={refs} onChange={onChange} phoneRequired />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-lg transition-colors text-base"
        >
          {submitting ? "Sending…" : "Request a call back →"}
        </button>

        <p className="text-[11px] text-gray-400 leading-snug">
          By submitting, you agree that Quantum Surety may contact you about your request by phone, text, or email.
          Nothing is charged here.
        </p>
      </form>
    </Card>
  );
}

/* ─────────────────────── 3. The handoff ─────────────────────── */

function HandoffScreen({
  meta,
  type,
  checkoutUrl,
  opened,
  form,
  errors,
  refs,
  onChange,
  onCheckoutClick,
  onBack,
}: {
  meta: BondMeta;
  type: string;
  checkoutUrl: string;
  opened: boolean;
  form: FormShape;
  errors: FieldErrors;
  refs: FieldRefs;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckoutClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <BackLink onClick={onBack}>{meta.label}</BackLink>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">Last step</p>
        <h1 className="text-xl font-bold text-gray-900">
          Your bond is issued on RLI's site — here's exactly what you'll see
        </h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          We're a licensed agency; <strong>RLI Insurance</strong> (A+ rated) is the carrier that actually writes the
          bond, and their checkout runs at <strong>mybondapp.com</strong>. It carries our name, so it won't look like
          you've left — the header reads <em>Quantum Surety LLC · Simplifying Surety</em> and the footer reads{" "}
          <em>Powered by MyBondApp</em>. That's the right page.
        </p>

        <div className="mt-4">
          <CarrierCheckoutPreview />
        </div>

        <ol className="mt-5 space-y-4">
          <HandoffStep n={1} title="A near-empty page with one small box">
            The first screen loads almost blank, with a box asking you to tick <em>“I'm not a robot”</em> and agree to
            the Terms of Use. It is supposed to look like that. Nothing is broken, and nothing is charged for ticking
            it. Press <strong>Agree &amp; Continue</strong> and the application appears.
          </HandoffStep>
          <HandoffStep n={2} title="You'll type your details again — about two minutes">
            None of what you just entered carries across. RLI's form doesn't accept a handoff from ours, so you'll
            re-enter your name, address, and email there. We'd pass it if we could.
          </HandoffStep>
          <HandoffStep n={3} title="Your price appears before you pay">
            {meta.redirectUrl && type === "notary" ? (
              <>
                RLI shows the exact total on that page before any card details are taken. Across the last 45 notary
                bonds we issued, that number came out between <strong>$71 and $196</strong> — most often around{" "}
                <strong>$108</strong>, for the full four-year term. If what you see is outside that, stop and call us
                before paying.
              </>
            ) : (
              <>
                RLI shows the exact total on that page before any card details are taken. If it isn't what you
                expected, close the tab — nothing is charged until you enter a card.
              </>
            )}
          </HandoffStep>
          <HandoffStep n={4} title="The certificate is emailed by RLI">
            Once the bond is issued, RLI emails the certificate PDF to the address you give them — same day for
            instantly-issued bonds. If nothing has arrived by the next business day, call us and we'll chase it.
          </HandoffStep>
        </ol>
      </Card>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          One thing worth knowing before you click
        </p>
        <p className="mt-1.5 text-xs text-amber-900 leading-relaxed">
          <strong>There is no save-and-come-back link.</strong> If you close that tab halfway, you can't reopen it
          yourself — you'd start from the beginning. But once you've put your name on their form, that part-finished
          application is visible to us. Call{" "}
          <a href={PHONE_HREF} className="underline font-semibold">
            {PHONE_DISPLAY}
          </a>{" "}
          and a licensed agent can pull it up and finish it with you on the phone.
        </p>
      </div>

      {type === "notary" && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">One decision you'll have to make on that page: E&amp;O</p>
          <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
            RLI's form offers Errors &amp; Omissions coverage as an add-on. It's worth understanding before you're
            asked: the bond protects the <em>public</em> from your mistakes — it doesn't protect{" "}
            <em>you</em>, and if the bond pays a claim, you repay it. E&amp;O is what covers you personally. Adding it
            is the main reason a notary's total lands at the top of the $71–$196 range rather than the bottom. Your
            call — the bond alone satisfies the Secretary of State.
          </p>
        </div>
      )}

      {/* The ask, placed here on purpose: directly under the paragraph that explains why a
          record on our side is worth anything to the customer. Two required fields, not
          three — the phone is genuinely optional and says what it buys. */}
      <Card>
        <h2 className="text-sm font-bold text-gray-900">Leave us a copy first</h2>
        <p className="mt-1 text-xs text-gray-600 leading-relaxed">
          Yes — you'll type these again on RLI's page, and no, we can't pass them through. The difference is that ours
          is the copy an agent can pull up after the carrier's tab is gone.
        </p>
        <div className="mt-4">
          <ContactFields
            form={form}
            errors={errors}
            refs={refs}
            onChange={onChange}
            phoneRequired={false}
            phoneHint="The only way we can reach out first if your application stalls. Skip it and you can always call us instead."
          />
        </div>
      </Card>

      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCheckoutClick}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-lg transition-colors text-base text-center"
      >
        Open RLI checkout <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </a>
      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Opens in a new tab. <strong>Leave this tab open</strong> — the steps above stay here if you need to check
        something mid-application. By continuing you agree that Quantum Surety may contact you about this request.
      </p>

      {opened && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
          <p className="text-sm font-semibold text-indigo-900">Back already, or stuck on something?</p>
          <p className="mt-1 text-xs text-indigo-900/80 leading-relaxed">
            A blank screen, a captcha that won't tick, a price that surprised you — all of it is fixable on the phone,
            and we can see the application you started.
          </p>
          <a
            href={PHONE_HREF}
            onClick={() => track({ type: "phone_click", element: "handoff_rescue", value: type })}
            className="mt-3 inline-flex items-center justify-center gap-2 bg-white border border-indigo-300 text-indigo-800 font-semibold py-2.5 px-4 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Call {PHONE_DISPLAY}
          </a>
        </div>
      )}
    </div>
  );
}

function HandoffStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
        {n}
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{children}</p>
      </div>
    </li>
  );
}

/* ─────────────────── 3b. Lead-only "received" branch ─────────────────── */

function ReceivedScreen({ meta, type }: { meta: BondMeta; type: string }) {
  return (
    <Card>
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
          <CheckCircle className="w-6 h-6 text-green-600" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Got it — a licensed agent has this now</h1>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            {type === "other" ? (
              <>
                There's no instant checkout for a bond we haven't identified yet, and we won't guess. An agent will
                call you within one business hour (Mon–Fri, 8am–6pm CT) to work out exactly which bond your obligee
                wants and what it costs.
              </>
            ) : (
              <>
                A {meta.label} isn't sold instantly — the amount depends on what {meta.obligee} requires of you
                specifically, so we quote it by hand rather than sell you the wrong product. An agent will call within
                one business hour (Mon–Fri, 8am–6pm CT) with your rate.
              </>
            )}
          </p>
        </div>
        <a
          href={PHONE_HREF}
          onClick={() => track({ type: "phone_click", element: "received_cta", value: type })}
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-lg transition-colors text-base text-center"
        >
          In a hurry? Call {PHONE_DISPLAY} now
        </a>
        <p className="text-xs text-gray-400 text-center">
          TDI-licensed agency · Bonds written by RLI Insurance (A+ rated)
        </p>
      </div>
    </Card>
  );
}
