import { useState, useRef } from "react";
import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { track } from "@/hooks/useTracker";
import { Button } from "@/components/ui/button";
import NotaryRenewalAlert from "@/components/NotaryRenewalAlert";
import {
  CheckCircle, ArrowRight, ArrowDown, Shield, AlertTriangle, Phone,
  GraduationCap, FileText, Stamp, BookOpen, Search, ClipboardCheck,
  RefreshCw, Scale, ExternalLink,
} from "lucide-react";

/**
 * /become-a-texas-notary — the head of the journey.
 *
 * Positioning note (2026-08-18). The site that owns positions 1–2 for
 * "texas notary bond" does NOT lead with the bond. Its Texas hub leads with a
 * step-by-step "become a notary" journey and sells the bond as step 3 of a
 * process it owns from the first search. We had strong mid-journey pages —
 * the money page, the free practice test, the free record book, the
 * verification portal — and NOTHING at the head. Someone searching "how to
 * become a notary in Texas" could not land on us. This page is that landing.
 *
 * The strategy is the same one that won the money page its blind critic test:
 * help first, sell once, and be more honest about money than anyone else on
 * the results page. Specifically:
 *
 *  1. The full cost of becoming a notary is itemized WITH the payee for every
 *     line. Required state + bond spend is $91 (bond $50 + SOS filing fee $21
 *     + $20 assessment). The seal is required but is a commodity (~$15–30
 *     from any office supplier). The record-keeping requirement can be met
 *     free with our digital record book. We never present $50 as a total and
 *     never claim to be cheapest — $50 is the standard market rate.
 *
 *  2. Since SB 693, the required education course is delivered ONLY by the
 *     Secretary of State. Nobody can sell it — including us. Saying so
 *     plainly, with the disclosure that we are a bond agency and not a state
 *     training provider, is the honesty wedge against providers whose
 *     "become a notary" funnels bundle their own training.
 *
 *  3. Every step links the free tool that helps at that step: practice test
 *     before the assessment, record book at record-keeping, the verification
 *     portal after commissioning, the renewal reminder at the end.
 *
 * MIRRORED IN server/seo.ts under "/become-a-texas-notary". The page that
 * ranks is the one in seo.ts — this site has already once had two divergent
 * versions of its most important page and the thin one ranked. If you change
 * facts or structure here, change them there in the same commit.
 */

/** Verification portal size — floor, not exact count. See notary-bond-texas.tsx
 *  for why (monthly import makes exact figures silently false). */
const PORTAL_RECORDS = "more than 570,000";

/** The cost table. One place, so the React page and the totals never drift. */
const COSTS = {
  bond: 50, // full 4-year term, standard market rate — never present as total
  filing: 21, // TX SOS filing fee, unavoidable
  assessment: 20, // per attempt, paid to the state
  requiredSpend: 91, // bond + filing + assessment
  sealLow: 15,
  sealHigh: 30,
  allInLow: 106, // requiredSpend + sealLow
  allInHigh: 121, // requiredSpend + sealHigh
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Become a Notary Public in Texas",
  description:
    "The complete 2026 process for becoming a Texas notary public: eligibility, the Secretary of State education course and assessment required by SB 693, the $10,000 surety bond, filing at the SOS portal, the seal, record-keeping, and renewal.",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "91",
  },
  step: [
    {
      "@type": "HowToStep",
      name: "Confirm you are eligible",
      text: "You must be at least 18 years old, a Texas resident, and have no conviction for a felony or a crime involving moral turpitude.",
    },
    {
      "@type": "HowToStep",
      name: "Complete the Secretary of State education course and pass the assessment",
      text: "For applications submitted on or after January 1, 2026, SB 693 requires an education course of up to 2 hours delivered only by the Texas Secretary of State at notarytraining.sos.texas.gov, followed by a 20-question assessment with a hard 30-minute time limit. 70% is passing. The $20 covers the course sitting and its assessment — failing means paying it again, up to three attempts within three months — and the course must be completed within 90 days of payment.",
    },
    {
      "@type": "HowToStep",
      name: "Buy your $10,000 Texas notary bond",
      text: "Texas requires a $10,000 surety bond covering the full 4-year commission term. The premium is $50 — the standard market rate. No credit check. Exception: notaries acting primarily as officers or employees of Texas state agencies are exempt and do not need a bond.",
    },
    {
      "@type": "HowToStep",
      name: "Apply and file your bond at the SOS portal",
      text: "Submit your application with the executed bond through the Texas Secretary of State's SOS Portal Notary System and pay the $21 state filing fee there.",
    },
    {
      "@type": "HowToStep",
      name: "Receive your commission, take the oath of office, and verify it",
      text: "The Secretary of State issues your 4-year commission, and the certificate arrives with an oath of office form. Take the oath before notarizing anything: any current Texas notary can administer it and notarize the form. Then confirm your record and expiry date on a public notary verification portal before you rely on it.",
    },
    {
      "@type": "HowToStep",
      name: "Get your seal and set up your record book",
      text: "Order your seal after you have the commission so the name and dates are right — any office supplier sells one for roughly $15–30, made to the specification in Texas Government Code §406.013. Set up a record book: records must be kept until the 10th anniversary of the notarization (Gov't Code §406.014(b)), and must not contain identification numbers or biometric data (1 TAC §87.40). A free digital record book meets the requirement.",
    },
    {
      "@type": "HowToStep",
      name: "Start notarizing — and know the rules that changed",
      text: "The signer must personally appear before you: SB 693 made notarizing without personal appearance a Class A misdemeanor, and a state jail felony where real property is involved. Keep every record for 10 years from the date of notarization, and post your fee schedule conspicuously as Gov't Code §406.024 requires.",
    },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does it cost to become a notary in Texas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The required spend is $91: a $10,000 surety bond at $50 for the full 4-year term, the Texas Secretary of State's $21 filing fee, and the $20 fee covering the state education course and its assessment. Texas.gov adds small card-processing surcharges to the state payments — call it about $93–94 in practice, assuming you pass the assessment first time; each extra attempt is another $20. A seal is also required and costs roughly $15–30 from any office supplier, putting the realistic all-in total at about $106–121 before those surcharges. The record-keeping requirement can be met with a free digital record book, and E&O insurance is optional. Packages priced near $170–195 include a provider's own training, seal and journal — none of which has to be bought from them.",
      },
    },
    {
      "@type": "Question",
      name: "Who is eligible to become a Texas notary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You must be at least 18 years old, a resident of Texas, and have no conviction for a felony or a crime involving moral turpitude. One narrow exception to residency: an escrow officer residing in a state adjacent to Texas may qualify without Texas residency (1 TAC §87.70).",
      },
    },
    {
      "@type": "Question",
      name: "Do I have to take a course to become a Texas notary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, for applications for appointment or reappointment submitted on or after January 1, 2026. SB 693 (effective September 1, 2025) requires an education course of up to 2 hours delivered only by the Texas Secretary of State at notarytraining.sos.texas.gov, followed by an assessment: 20 questions, 70% to pass, with a hard 30-minute time limit. The $20 covers the course sitting and its assessment — failing means paying it again, up to three attempts within three months — and the course must be completed within 90 days of payment. No third party can sell you the required course — the only course that counts is the state's own.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I fail the notary assessment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You may attempt the assessment up to three times within three months, and each new attempt costs another $20. The assessment is timed — 30 minutes, hard cutoff; run over and the attempt fails. A free practice test in the same 20-question, 70%-to-pass format lets you find out where you stand before an attempt costs you anything.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a Texas notary commission last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Four years. The $10,000 bond runs concurrent with the commission — one $50 premium covers the whole term, with no annual renewal. SB 693 did not change the commission term or the bond.",
      },
    },
    {
      "@type": "Question",
      name: "Do Texas notaries need a journal or record book?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Texas notaries must keep records of their notarial acts until the 10th anniversary of the notarization (Texas Government Code §406.014(b)). The record must NOT contain identification numbers — driver's license, Social Security, or passport numbers — or biometric data (1 TAC §87.40). The requirement can be met at no cost with a free digital record book that captures every field §406.014 requires and exports to CSV.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a credit check for a Texas notary bond?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Texas notary bonds are issued without a credit check. Anyone who meets the state's eligibility requirements can buy one. The premium is $50 for the full 4-year term — the standard market rate — plus the state's separate $21 filing fee.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my Texas notary commission?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You reapply before your 4-year commission expires — the renewal window opens 90 days before your expiry date, and no sooner. Reappointment counts as an application, so from January 1, 2026 it carries the same education and assessment requirement, plus a new bond and the state filing fee. A lapsed commission cannot be renewed: if it expires, you start the application over. A free reminder emailed 60 days before expiry — inside the renewal window — is the cheapest insurance against that.",
      },
    },
    {
      "@type": "Question",
      name: "What did SB 693 change for Texas notaries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SB 693 (2025 session, effective September 1, 2025, applying to applications from January 1, 2026) added a mandatory education course delivered only by the Secretary of State with a $20-per-attempt assessment, set record retention at 10 years from the date of notarization, and made notarizing without the signer personally present a crime — a Class A misdemeanor, rising to a state jail felony where real property is involved. It did not change the 4-year commission term and did not change the $10,000 bond requirement.",
      },
    },
    {
      "@type": "Question",
      name: "What can a Texas notary charge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Texas Government Code §406.024 sets maximum fees: $10 for the first signature on an acknowledgment and $1 for each additional signature, $10 for administering an oath, $1 per page for certifying a copy, and $1 per 100 words for a deposition. These are maximums — you may charge less, or nothing at all — and you must post your fee schedule conspicuously. The posting is a free printout you make yourself.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need E&O insurance to become a Texas notary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Texas requires only the $10,000 surety bond, which protects the public — not you. Errors & omissions insurance is the optional product that protects the notary personally. You are fully commissioned without it.",
      },
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Quantum Surety", item: "https://quantumsurety.bond" },
    { "@type": "ListItem", position: 2, name: "Become a Texas Notary", item: "https://quantumsurety.bond/become-a-texas-notary" },
  ],
};

/** The journey. Order is the order the state imposes, not the order we sell in. */
const STEPS = [
  { id: "step-eligibility", n: 1, short: "Check you're eligible", cost: "Free" },
  { id: "step-course", n: 2, short: "State course + assessment", cost: "$20/attempt" },
  { id: "step-bond", n: 3, short: "Buy your $10,000 bond", cost: "$50" },
  { id: "step-apply", n: 4, short: "Apply at the SOS portal", cost: "$21" },
  { id: "step-commission", n: 5, short: "Commission + oath + verify", cost: "Free" },
  { id: "step-seal", n: 6, short: "Seal + record book", cost: "~$15–30" },
  { id: "step-notarize", n: 7, short: "Start notarizing", cost: "—" },
];

/** Eligibility self-check. Three requirements, three checkboxes. The first
 *  interaction fires form_start — this is the page's "meaningful engagement"
 *  signal, chosen because ticking an eligibility box is the moment a reader
 *  becomes a would-be applicant rather than a browser. */
function EligibilityCheck() {
  const [checks, setChecks] = useState({ age: false, resident: false, record: false });
  const fired = useRef(false);

  const items = [
    { key: "age" as const, label: "I am at least 18 years old" },
    { key: "resident" as const, label: "I am a resident of Texas" },
    { key: "record" as const, label: "I have no conviction for a felony or a crime involving moral turpitude" },
  ];

  const allChecked = checks.age && checks.resident && checks.record;

  function toggle(key: keyof typeof checks) {
    if (!fired.current) {
      fired.current = true;
      track({ type: "form_start", element: "become_notary_eligibility", value: "notary" });
    }
    setChecks((c) => ({ ...c, [key]: !c[key] }));
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-white p-6">
      <p className="font-semibold text-gray-900 mb-4">The whole eligibility test, self-serve:</p>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checks[item.key]}
              onChange={() => toggle(item.key)}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
            />
            <span className="text-sm text-gray-800 leading-relaxed group-hover:text-gray-900">{item.label}</span>
          </label>
        ))}
      </div>
      <div
        className={`mt-5 rounded-xl border p-4 text-sm leading-relaxed transition-colors ${
          allChecked ? "border-teal-300 bg-teal-50 text-teal-900" : "border-gray-200 bg-gray-50 text-gray-600"
        }`}
      >
        {allChecked ? (
          <span>
            <strong>You meet the baseline requirements.</strong> That is the entire list — no exam
            of your typing speed, no degree, no employer sign-off. The state verifies these when
            you apply; the next step is the education course.
          </span>
        ) : (
          <span>
            Tick each box that applies. All three are required — they are the state's list,
            and the state checks them when you apply.
          </span>
        )}
      </div>
    </div>
  );
}

export default function BecomeATexasNotary() {
  useSEO({
    title: "How to Become a Notary in Texas (2026) — Every Step, Every Dollar | Quantum Surety",
    description:
      "The complete 2026 guide to becoming a Texas notary: eligibility, the SB 693 state course and $20 assessment, the $50 bond plus the $21 state fee, the seal, the 10-year record rule, and renewal. Required spend: $91 — itemized with who each dollar goes to.",
    canonical: "/become-a-texas-notary",
  });
  useSchema(HOWTO_SCHEMA, "ld-json-HowTo");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");
  useSchema(BREADCRUMB_SCHEMA, "ld-json-Breadcrumb");

  const faqs = [
    {
      q: "How much does it cost to become a notary in Texas?",
      a: `$91 in required spend: the $10,000 bond at $50 for the full 4-year term, the state's $21 filing fee, and the $20 fee covering the course and its assessment. Texas.gov adds small card-processing surcharges to the state payments — call it about $93–94 in practice, assuming you pass first time; each extra attempt is another $20. Add a seal at roughly $15–30 from any office supplier and the realistic all-in total is about $106–121 before those surcharges. The record book requirement can be met free, and E&O insurance is optional. Packages priced near $170–195 include a provider's own training, seal and journal — none of which has to be bought from them.`,
    },
    {
      q: "Who is eligible?",
      a: "18 or older, a Texas resident, and no conviction for a felony or a crime involving moral turpitude. That is the entire list. (One narrow exception to residency: an escrow officer residing in a state adjacent to Texas may qualify — 1 TAC §87.70.)",
    },
    {
      q: "Do I have to take a course?",
      a: "Yes, if your application (new or renewal) is submitted on or after January 1, 2026. The course is up to 2 hours and is delivered only by the Texas Secretary of State at notarytraining.sos.texas.gov — nobody else can sell you the required course, including us. The assessment that follows is 20 questions, 70% to pass, with a hard 30-minute time limit. The $20 covers the course sitting and its assessment — failing means paying it again — and the course must be completed within 90 days of payment.",
    },
    {
      q: "What if I fail the assessment?",
      a: "You get up to three attempts within three months, at $20 each. The assessment is timed — 30 minutes, hard cutoff; run over and the attempt fails. Our free practice test uses the same 20-question, 70% format, so you can find out where you stand before an attempt costs you anything.",
    },
    {
      q: "How long does a commission last?",
      a: "Four years. The bond runs concurrent — one $50 premium covers the whole term, no annual renewal. SB 693 changed neither the term nor the bond.",
    },
    {
      q: "Do I need a journal or record book?",
      a: "You must keep records of your notarial acts until the 10th anniversary of the notarization (Gov't Code §406.014(b)). The record must NOT contain identification numbers — driver's license, Social Security, or passport — or biometric data (1 TAC §87.40). Our free digital record book captures every field §406.014 requires and exports to CSV — the requirement can be met without buying anything.",
    },
    {
      q: "What can I charge as a notary?",
      a: "Gov't Code §406.024 sets the maximums: $10 for the first signature on an acknowledgment and $1 for each additional signature, $10 for an oath, $1 per page for certifying a copy, $1 per 100 words for a deposition. They are maximums — you may charge less, or nothing — and you must post your fee schedule conspicuously. The posting is a free printout you make yourself.",
    },
    {
      q: "Is there a credit check for the bond?",
      a: "No. Texas notary bonds are issued without a credit check or underwriting questions. $50 is the standard market rate for the 4-year term — several national providers charge the same — plus the state's separate $21 filing fee. Note: if you will act primarily as an officer or employee of a Texas state agency, you are exempt from the bond requirement entirely.",
    },
    {
      q: "How do I renew?",
      a: "Reapply before your commission expires — the renewal window opens 90 days before your expiry date, no sooner. Reappointment counts as an application, so from January 1, 2026 it carries the same course and assessment requirement, plus a new bond and the filing fee. A lapsed commission cannot be renewed — you start over. We email a free reminder 60 days before expiry, inside the renewal window.",
    },
    {
      q: "Do I need E&O insurance?",
      a: "Not to be commissioned. The required bond protects the public, not you — if a claim is paid from your bond, the surety can seek that money back from you personally. E&O is the optional product that protects the notary. It is a business judgment, not a compliance step.",
    },
    {
      q: "Can I do this all online?",
      a: "Almost all of it. The state course, the assessment, the bond purchase, and the application filing all happen online. The seal is the one physical object, and it ships from whichever office supplier you order it from.",
    },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────────
          A journey page, so the hero promises the journey, not the product.
          The one number in the hero is the honest floor for the WHOLE process,
          not our $50 slice of it. */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs">
              <Shield className="w-3.5 h-3.5" />
              Texas Department of Insurance licensed agency #3480229
            </div>
            <span className="text-xs text-indigo-200">Last updated: August 18, 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
            How to Become a Notary in Texas
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-4 max-w-2xl leading-relaxed">
            Seven steps, in the order the state imposes them. Required spend:{" "}
            <strong className="text-white">${COSTS.requiredSpend}</strong> — a $50 bond, the
            state's $21 filing fee, and the $20 assessment fee. Every other dollar on this
            page is optional or a commodity, and we say which is which.
          </p>
          <p className="text-sm text-indigo-200 mb-8 max-w-2xl leading-relaxed">
            Updated for SB 693, which applies to every application from January 1, 2026. We are a
            Texas bond agency — step 3 is ours. The rest of this page exists so you get steps 1,
            2, and 4 through 7 right without paying anyone who says you must.
          </p>

          {/* The journey, mapped. Every chip jumps to its step. */}
          <div className="flex flex-wrap gap-2 mb-8">
            {STEPS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full pl-2 pr-3 py-1.5 text-xs transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">{s.n}</span>
                <span>{s.short}</span>
                <span className="text-indigo-200/80">{s.cost}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#step-eligibility">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8 w-full sm:w-auto">
                Start at step 1 <ArrowDown className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#cost-table">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 w-full sm:w-auto">
                See every cost first
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── The 30-second version ──────────────────────────────────────────── */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">The 30-second version</h2>
            <div className="space-y-3 text-[15px] text-gray-800 leading-relaxed">
              <p>
                To become a Texas notary you must be <strong>18+, a Texas resident, with no
                felony or moral-turpitude conviction</strong>. Since January 1, 2026 you complete a{" "}
                <strong>short education course from the Secretary of State</strong> — only the
                state delivers it — and pass a <strong>20-question assessment</strong> ($20 per
                attempt, 70% to pass). You file a <strong>$10,000 surety bond</strong> ($50 for
                the full 4-year term) with your application at the SOS portal and pay the
                state's <strong>$21 filing fee</strong>. Commission in hand, you buy a seal from
                any office supplier and keep records of every notarization for <strong>10
                years</strong>.
              </p>
              <p>
                Required spend: <strong>${COSTS.requiredSpend}</strong> — call it about
                $93–94 in practice once Texas.gov's small card-processing surcharges land on
                the two state payments, assuming you pass the assessment first time. With a
                seal, about <strong>${COSTS.allInLow}–${COSTS.allInHigh}</strong> all-in.
                Anything above that is optional coverage or bundled extras you could have
                bought separately — or not at all.
              </p>
            </div>
          </div>

          {/* Start here — the two real state resources, explicitly ordered.
              Added after a blind critic round: the page explained everything and
              never said where to actually begin. These are the only two portal
              URLs on the page; do not add others without verifying them live. */}
          <div className="mt-5 rounded-2xl border-2 border-teal-300 bg-teal-50/60 p-6 md:p-7">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Start here — the state's own two links</h2>
            <ol className="space-y-3 text-sm text-gray-800 leading-relaxed list-none">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <span>
                  Read{" "}
                  <a
                    href="https://www.sos.state.tx.us/statdoc/guides/TraditionalNotaryApplication.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-800 font-semibold underline underline-offset-2"
                  >
                    the state's own step-by-step application guide (PDF)
                  </a>{" "}
                  — the Secretary of State's official walkthrough, revised December 2025. Ten
                  minutes, and every form name below will make sense.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <span>
                  When you reach step 2, the required course lives at{" "}
                  <a
                    href="https://notarytraining.sos.texas.gov"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-800 font-semibold underline underline-offset-2"
                  >
                    notarytraining.sos.texas.gov
                  </a>{" "}
                  — the Secretary of State's training site, the only place the required course
                  exists.
                </span>
              </li>
            </ol>
            <p className="text-xs text-gray-600 mt-4">
              Everything below is our plain-English walkthrough of the same process, with the
              costs itemized and the free tools that help at each step.
            </p>
          </div>
        </div>
      </section>

      {/* ── Step 1: Eligibility ───────────────────────────────────────────── */}
      <section id="step-eligibility" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Free · at the state's rules</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Check you're eligible
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Texas keeps this list short. There is no education prerequisite before the state
            course, no minimum employment, and no requirement that anyone sponsors you.
          </p>
          <EligibilityCheck />
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            "Moral turpitude" is the statute's phrase, not ours — it covers crimes of dishonesty
            such as fraud or theft. If you have a record and are unsure how it reads, resolve
            that question before spending anything on the steps below. One narrow exception to
            the residency rule: an escrow officer residing in a state adjacent to Texas may
            qualify without Texas residency (1 TAC &sect;87.70).
          </p>
        </div>
      </section>

      {/* ── Step 2: Course + assessment ───────────────────────────────────── */}
      <section id="step-course" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">$20 per assessment attempt · paid to the state</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Take the state's course and pass the assessment
          </h2>
          <div className="space-y-4 text-[15px] text-gray-800 leading-relaxed mb-6">
            <p>
              SB 693 — passed in the 2025 session, effective September 1, 2025 — requires every
              applicant whose application is submitted on or after January 1, 2026 to complete an
              education course of <strong>up to 2 hours</strong>, and it is delivered{" "}
              <strong>only by the Texas Secretary of State</strong>, at{" "}
              <a
                href="https://notarytraining.sos.texas.gov"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-700 font-semibold underline underline-offset-2"
              >
                notarytraining.sos.texas.gov
              </a>. That "only" matters:
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Nobody can sell you the required course — including us.</strong> If a
              provider offers "Texas notary training" as part of a package, it is their own
              material, not the course the state requires. The only course that counts toward
              your application is the Secretary of State's. For the avoidance of doubt: Quantum
              Surety is a bond agency, not a state training provider, and we are not affiliated
              with the Secretary of State.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <p className="font-semibold text-gray-900">The course</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Up to 2 hours",
                  "Delivered only by the Texas Secretary of State",
                  "Required for applications (new and renewal) from January 1, 2026",
                  "Must be completed within 90 days of paying for it",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                <p className="font-semibold text-gray-900">The assessment</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "20 questions, 70% to pass",
                  "Hard 30-minute time limit — run over and the attempt fails",
                  "The $20 covers the course sitting and its assessment; failing means paying it again",
                  "Up to 3 attempts within 3 months",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/50 p-6">
            <p className="font-bold text-gray-900 mb-2">
              Before you pay for an attempt: take our free practice test
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Twenty questions in the same format — 70% to pass, every answer sourced to the
              statute. The real assessment costs $20 per attempt, you only get three, and it
              runs on a hard 30-minute clock — so it is worth knowing where you stand before
              any of that is on the line. Free, no account, no email required.
            </p>
            <Link href="/texas-notary-exam-practice">
              <Button variant="outline" className="border-teal-600 text-teal-800 hover:bg-teal-100">
                Take the free practice test <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Step 3: The bond — our step, and the one CTA before the end ───── */}
      <section id="step-bond" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">$50 · this is our step</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Buy your $10,000 notary bond
          </h2>
          <div className="space-y-4 text-[15px] text-gray-800 leading-relaxed mb-6">
            <p>
              Texas will not commission you until you file a <strong>$10,000 surety bond</strong>{" "}
              covering the full 4-year term. The bond protects the public, not you — if your
              error costs someone money, they claim against the bond, and the surety can then
              seek that money back from you personally. It is a compliance requirement, not
              insurance for you.
            </p>
            <p>
              The premium is <strong>$50 for the entire four years</strong> — and to be clear,
              that is the <strong>standard market rate</strong>, charged by the national
              providers too. The bond is a commodity: the amount is fixed by statute and the
              bond you file is legally identical whoever sells it. We are not cheaper than the
              market and do not claim to be. What differs between providers is speed, and
              whether a human answers when the SOS portal rejects your filing.
            </p>
            <p>
              <strong>$50 is not the total cost of becoming a notary.</strong> The state's $21
              filing fee lands on you at the SOS portal in step 4 regardless of who sold you the
              bond, and the $20 assessment came in step 2. Any page presenting $50 as the whole
              answer is setting you up for a surprise.
            </p>
          </div>

          {/* The case where our product is unnecessary. A page that itemizes what
              you don't have to buy from bundlers has to apply the same standard
              to itself, or the whole honesty position collapses. */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
            <p className="text-sm text-teal-950 leading-relaxed">
              <strong>One case where you don't need us — or any bond at all:</strong> notaries
              who act primarily as officers or employees of Texas <strong>state
              agencies</strong> are exempt from the bond requirement. If that is you, confirm
              it with your agency before buying anything — do not pay $50 for a bond the state
              does not require of you.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-indigo-600 bg-white shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-6 md:p-7">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Get the bond from us</h3>
                <ul className="space-y-3">
                  {[
                    { t: "No credit check", d: "No underwriting, no questions about your finances." },
                    { t: "Open 24/7", d: "Apply at 2am on a Sunday; the executed bond PDF is emailed to you, typically within minutes." },
                    { t: "Filing instructions included", d: "Free with every bond — and a real phone number if the portal rejects something." },
                    { t: "Texas only", d: "One state's statute, one set of forms, one portal to know." },
                  ].map((f) => (
                    <li key={f.t} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700 leading-snug">
                        <strong className="text-gray-900">{f.t}</strong> — {f.d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-6 md:p-7 flex flex-col justify-center">
                <div className="mb-4">
                  <div className="flex items-baseline justify-between text-sm text-gray-700 mb-1.5">
                    <span>Bond premium</span>
                    <span className="font-semibold text-gray-900">$50</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3 leading-snug">$10,000 coverage, full 4-year term</p>
                  <div className="flex items-baseline justify-between text-sm text-gray-700 mb-1.5">
                    <span>State filing fee (step 4)</span>
                    <span className="font-semibold text-gray-900">$21</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3 leading-snug">Paid to the SOS. Nobody can waive it.</p>
                  <div className="flex items-baseline justify-between border-t border-gray-300 pt-3">
                    <span className="text-sm font-semibold text-gray-900">Bond + filing</span>
                    <span className="text-2xl font-bold text-indigo-700">$71</span>
                  </div>
                </div>
                <a
                  href="/get-bond?type=notary"
                  className="block"
                  onClick={() => track({ type: "checkout_click", element: "become_notary_step3", value: "notary" })}
                >
                  <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="tel:2146668718" className="block mt-2">
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Want the deep dive — bond vs. E&amp;O, what our last 73 buyers actually paid?{" "}
            <Link href="/bonds/notary-bond-texas">
              <span className="text-indigo-600 hover:underline cursor-pointer">The full Texas notary bond page</span>
            </Link>{" "}
            covers it.
          </p>
        </div>
      </section>

      {/* ── Step 4: Apply + file ──────────────────────────────────────────── */}
      <section id="step-apply" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">4</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">$21 · paid to the state</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Apply and file your bond at the SOS portal
          </h2>
          <div className="space-y-4 text-[15px] text-gray-800 leading-relaxed">
            <p>
              With the course passed and the executed bond PDF in hand, you submit your
              application through the Texas Secretary of State's <strong>SOS Portal Notary
              System</strong>: upload the bond, complete the application, and pay the{" "}
              <strong>$21 state filing fee</strong> there. The fee goes to the state — no bond
              provider can waive, discount, or absorb it, and a provider implying otherwise is a
              reason to shop elsewhere.
            </p>
            <p>
              Every bond we issue ships with step-by-step filing instructions, and if the portal
              rejects something, (214) 666-8718 reaches a person rather than a ticket queue.
              The most common rejection we see is avoidable: details on the application not
              matching the bond exactly. Use the same legal name on both.
            </p>
            <p className="text-sm text-gray-600">
              How long until you hear back? The parts you control — course, assessment, bond,
              filing — can all be done in a day. The remaining wait is the state's review of
              your application, which no provider controls. Be wary of any site promising a
              specific number of days; that is the state's timeline to give, not theirs.
            </p>
          </div>
        </div>
      </section>

      {/* ── Step 5: Commission + verify ───────────────────────────────────── */}
      <section id="step-commission" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">5</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Free</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Receive your commission, take the oath — then verify it
          </h2>
          <div className="space-y-4 text-[15px] text-gray-800 leading-relaxed mb-6">
            <p>
              The Secretary of State issues your commission for a <strong>4-year term</strong>{" "}
              and sends your commission certificate with an oath of office form. One step
              remains before you may notarize anything: <strong>take the oath</strong>. Bring
              the form to any current Texas notary, swear the oath, and have it notarized —
              the state supplies the form with your commission, so there is nothing to buy and
              nothing to download. Skip this and every notarization you perform is done
              without authority.
            </p>
            <p>
              Then, before you order anything with your name and dates on it, confirm the record: we
              run a free public verification portal covering <strong>{PORTAL_RECORDS} Texas
              notary records</strong> sourced from the Secretary of State. Look yourself up,
              check the spelling of your name and your exact expiry date, and screenshot it.
              Your seal and your renewal calendar both depend on those details being right.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://verify.quantumsurety.bond"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-indigo-600" />
                <p className="font-semibold text-gray-900">Bond verification portal</p>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 ml-auto" />
              </div>
              <p className="text-sm text-gray-600">Search {PORTAL_RECORDS} Texas notary records by name or city. No account, no payment.</p>
            </a>
            <Link href="/texas-notary-lookup">
              <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer h-full">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <p className="font-semibold text-gray-900">Texas notary lookup</p>
                </div>
                <p className="text-sm text-gray-600">Search from this site and open a full record page.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Step 6: Seal + record book ────────────────────────────────────── */}
      <section id="step-seal" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">6</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">~${COSTS.sealLow}–{COSTS.sealHigh} for the seal · record book free</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Get your seal and set up your record book
          </h2>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Stamp className="w-5 h-5 text-indigo-600" />
                <p className="font-semibold text-gray-900">The seal — required, and a commodity</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                You need one, but you do not need anyone's branded one. Any office supply
                company makes Texas notary seals, typically for around{" "}
                <strong>${COSTS.sealLow}–{COSTS.sealHigh}</strong>. Order it{" "}
                <strong>after</strong> your commission arrives — the seal must match your
                commissioned name and dates, and ordering early is how people end up paying
                twice. We do not sell seals, so take this as disinterested advice.
              </p>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-3">
                <strong className="text-gray-800">Check any seal against the legal spec</strong>{" "}
                (Gov't Code &sect;406.013): circular no larger than 2&Prime; across or
                rectangular no larger than 1&Prime;&nbsp;&times;&nbsp;2.5&Prime;, with a
                serrated or milled edge border, containing "Notary Public, State of Texas"
                around a five-pointed star, plus your name, your notary ID number, and your
                commission expiration date. Any seal meeting that spec is legal, whoever made it.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <p className="font-semibold text-gray-900">The record book — required, and free</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                You must keep records of your notarial acts until the{" "}
                <strong>10th anniversary of the notarization</strong> (Gov't Code
                &sect;406.014(b)). Our free digital record book captures every field
                &sect;406.014 requires and exports to CSV. Entries stay on your own device — we
                never see them. Prefer paper? Bound record books are sold widely; the
                requirement is the records, not any particular book.
              </p>
              <p className="text-xs text-amber-900 leading-relaxed bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <strong>As important as what goes in: what must stay out.</strong> The record
                must <strong>not</strong> contain identification numbers — driver's license,
                Social Security, or passport numbers — or any biometric data (1 TAC
                &sect;87.40). Record the issuing agency of the ID, never the number on it.
              </p>
              <Link href="/texas-notary-journal">
                <Button variant="outline" size="sm">
                  Open the free record book <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Step 7: Start notarizing ──────────────────────────────────────── */}
      <section id="step-notarize" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">7</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">You're commissioned</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Start notarizing — knowing the two rules that changed
          </h2>
          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 mb-6">
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-amber-700 mt-1 shrink-0" />
              <div className="text-sm text-amber-950 leading-relaxed space-y-3">
                <p>
                  <strong>The signer must personally appear before you.</strong> SB 693 made
                  notarizing a document without the signer personally present a{" "}
                  <strong>Class A misdemeanor</strong> — and a <strong>state jail felony</strong>{" "}
                  where real property is involved. "They'll sign it later" or "their spouse
                  vouched for them" is now a criminal matter, not a shortcut.
                </p>
                <p>
                  <strong>Every record, kept 10 years from the date of notarization</strong>{" "}
                  (Gov't Code &sect;406.014(b)). Your record book from step 6 is how you comply
                  without thinking about it.
                </p>
              </div>
            </div>
          </div>
          <div className="text-[15px] text-gray-800 leading-relaxed space-y-4">
            <p>
              And one housekeeping rule before your first paying customer:{" "}
              <strong>post your fees conspicuously.</strong> Gov't Code &sect;406.024 requires a
              notary who charges to display the fee schedule. It is a piece of paper you print
              yourself, for free — worth knowing, because "fee schedule" also appears as a paid
              line item in some become-a-notary bundles. What you may charge is capped by the
              same statute; the maximums are in the FAQ below.
            </p>
            <p>
              One more decision, and it is genuinely optional: <strong>errors &amp; omissions
              insurance</strong>. Your bond protects the public — if a claim is paid from it,
              the surety can pursue you for the money. E&amp;O is the product that protects{" "}
              <em>you</em>, and unlike the bond, you never repay a claim it pays. Texas does not
              require it and never asks. It appears as an option inside the same checkout as the
              bond; about 1 in 3 of our buyers takes it, typically $35&ndash;$40 for the full
              four-year term — under $9 a year. Signing agents and mobile notaries usually want
              it; someone notarizing occasionally for an employer often does not — check whether
              your employer's coverage extends to you before spending.{" "}
              <Link href="/bonds/notary-eo-insurance">
                <span className="text-indigo-600 hover:underline cursor-pointer">Full E&amp;O guide here</span>
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cost table — the whole point of the page ──────────────────────── */}
      <section id="cost-table" className="py-16 px-4 bg-indigo-50/50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            What becoming a Texas notary costs — every line, and who gets it
          </h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Three of these dollars amounts are fixed, one is a commodity, and two are optional.
            No other arrangement of this table is honest.
          </p>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-6">
            {[
              {
                item: "SOS education course + assessment",
                amt: "$20",
                who: "Paid to the state",
                note: "The course is delivered only by the Secretary of State; the $20 is the assessment fee, per attempt (up to 3 attempts in 3 months). Practice free first.",
                tag: "REQUIRED",
                tagColor: "bg-red-50 text-red-700",
              },
              {
                item: "Notary surety bond — $10,000, 4-year term",
                amt: "$50",
                who: "Paid to a bond agency",
                note: "The standard market rate, whoever you buy from. One payment for the whole commission. No credit check.",
                tag: "REQUIRED",
                tagColor: "bg-red-50 text-red-700",
              },
              {
                item: "Texas Secretary of State filing fee",
                amt: "$21",
                who: "Paid to the state",
                note: "Charged at the SOS portal with your application. No provider can waive it.",
                tag: "REQUIRED",
                tagColor: "bg-red-50 text-red-700",
              },
              {
                item: "Notary seal",
                amt: `~$${COSTS.sealLow}–${COSTS.sealHigh}`,
                who: "Any office supplier",
                note: "Required, but a commodity — no reason to pay a bundle price for a branded one. Order after your commission arrives.",
                tag: "REQUIRED · SHOP AROUND",
                tagColor: "bg-amber-50 text-amber-700",
              },
              {
                item: "Record book (10-year retention)",
                amt: "$0",
                who: "Free with our digital record book",
                note: "The requirement is the records, not a particular book. Ours captures every §406.014 field and exports CSV, free. Paper books are sold widely if you prefer one.",
                tag: "REQUIREMENT MET FREE",
                tagColor: "bg-teal-50 text-teal-700",
              },
              {
                item: "Fee schedule posting (§406.024)",
                amt: "$0",
                who: "A printout you make yourself",
                note: "If you charge fees, you must post your fee schedule conspicuously. It is a free piece of paper — even where it appears as a paid line item in bundles.",
                tag: "REQUIREMENT MET FREE",
                tagColor: "bg-teal-50 text-teal-700",
              },
              {
                item: "Errors & Omissions insurance",
                amt: "Optional",
                who: "Your choice",
                note: "Not required by Texas. Protects you; the bond does not.",
                tag: "OPTIONAL",
                tagColor: "bg-gray-100 text-gray-600",
              },
            ].map((row, i) => (
              <div key={row.item} className={`px-5 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 last:border-0`}>
                <div className="flex items-start justify-between gap-4 mb-1">
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{row.item}</p>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">{row.amt}</p>
                    <p className="text-[11px] text-gray-500">{row.who}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pr-16">{row.note}</p>
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded ${row.tagColor}`}>{row.tag}</span>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border-2 border-indigo-200 bg-white p-5 text-center">
              <p className="text-3xl font-bold text-indigo-700">${COSTS.requiredSpend}</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">Required state + bond spend</p>
              <p className="text-xs text-gray-500 mt-1">Assessment $20 + bond $50 + filing $21</p>
            </div>
            <div className="rounded-xl border-2 border-teal-200 bg-white p-5 text-center">
              <p className="text-3xl font-bold text-teal-700">${COSTS.allInLow}–${COSTS.allInHigh}</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">Realistic all-in</p>
              <p className="text-xs text-gray-500 mt-1">With a seal from any office supplier; record book free</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 -mt-2 mb-6 leading-relaxed">
            Fine print on the ${COSTS.requiredSpend}: Texas.gov adds small card-processing
            surcharges to the two state payments — roughly $2–3 across both — so call it about
            $93–94 in practice, assuming you pass the assessment first time. Each extra attempt
            is another $20.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-700 leading-relaxed space-y-3">
            <p>
              <strong className="text-gray-900">Why you may have seen totals near $170–195.</strong>{" "}
              Some providers bundle their own training, a branded seal, and a journal into a
              single "become a notary" package at that price. There is nothing wrong with
              wanting one vendor for everything — but you should know that since SB 693 the only
              course that satisfies the state requirement is the Secretary of State's own, the
              seal is a ${COSTS.sealLow}–{COSTS.sealHigh} commodity, and the record-keeping
              requirement can be met free. Buy a bundle because you want the convenience, not
              because you think you must.
            </p>
          </div>
        </div>
      </section>

      {/* ── SB 693 summary ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            SB 693 in one box — what changed, what didn't
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5">
              <p className="font-bold text-amber-950 mb-3">Changed (applications from Jan 1, 2026)</p>
              <ul className="space-y-2.5 text-sm text-amber-950">
                {[
                  "Mandatory education course, up to 2 hours, delivered only by the Secretary of State",
                  "Assessment: 20 questions, 70% to pass, on a hard 30-minute timer — $20 per attempt, 3 attempts in 3 months",
                  "Record retention: 10 years from the date of notarization (Gov't Code §406.014(b))",
                  "Notarizing without the signer personally present is a crime — Class A misdemeanor; state jail felony for real property",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-5">
              <p className="font-bold text-teal-950 mb-3">Did not change</p>
              <ul className="space-y-2.5 text-sm text-teal-950">
                {[
                  "The commission term — still 4 years",
                  "The bond — still $10,000, still $50 for the full term",
                  "Eligibility — still 18+, Texas resident, clean record",
                  "The $21 state filing fee",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            If a provider charges more "because of SB 693," that is not what the bill did.{" "}
            <Link href="/sb-693-notary-bond-requirements-2026">
              <span className="text-indigo-600 hover:underline cursor-pointer">Full SB 693 breakdown</span>
            </Link>.
          </p>
        </div>
      </section>

      {/* ── Renewal ───────────────────────────────────────────────────────── */}
      <section id="renewal" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Four years from now</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Renewing — and the mistake that cannot be undone
          </h2>
          <div className="space-y-4 text-[15px] text-gray-800 leading-relaxed mb-8">
            <p>
              Your commission runs four years. Renewal means <strong>reapplying before it
              expires</strong> — and because reappointment counts as an application, from
              January 1, 2026 it carries the same course-and-assessment requirement, a new
              bond, and the state filing fee again. The window is fixed: <strong>renewal opens
              90 days before your expiry date, and no sooner</strong> — you cannot get ahead of
              it, which is exactly why our reminder below fires at 60 days, inside the window
              with time to spare.
            </p>
            <p>
              The unforgiving part: <strong>a lapsed commission cannot be renewed.</strong> If
              your expiry date passes, you do not renew — you start the whole application over,
              and you cannot legally notarize in the gap. Four years is exactly long enough to
              forget. This is the single most common way Texas notaries lose the ability to
              notarize, which is why the reminder below exists and is free.
            </p>
          </div>
          <NotaryRenewalAlert
            heading="Put your expiry date somewhere that will remember for you."
            blurb="Look up your Texas commission below and we'll email you a free reminder 60 days before it expires. A lapsed commission cannot be renewed — you start over."
          />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Becoming a Texas notary — frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready for step 3?</h2>
          <p className="text-indigo-200 mb-2">
            $10,000 bond · $50 for the full 4-year term · no credit check
          </p>
          <p className="text-indigo-300 text-sm mb-8">
            Plus the state's $21 filing fee at the portal, and the $20 assessment if you still
            owe the course. ${COSTS.requiredSpend} covers everything the state and the bond require.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/get-bond?type=notary"
              onClick={() => track({ type: "checkout_click", element: "become_notary_final", value: "notary" })}
            >
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10 w-full sm:w-auto">
                Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 w-full sm:w-auto">
                <Phone className="w-4 h-4 mr-2" /> Call (214) 666-8718
              </Button>
            </a>
          </div>
          <p className="text-indigo-300/80 text-xs mt-8">
            Quantum Surety Bonds · Texas Department of Insurance licensed agency #3480229 ·
            a bond agency, not a state training provider, and not affiliated with the Texas
            Secretary of State
          </p>
        </div>
      </section>

    </div>
  );
}
