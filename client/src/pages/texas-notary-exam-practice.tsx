import { useState } from "react";
import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { track } from "@/hooks/useTracker";
import { CheckCircle, XCircle, RotateCcw, ArrowRight, ShieldAlert } from "lucide-react";

/**
 * Free practice assessment for the Texas notary education requirement (SB 693).
 *
 * WHY THIS PAGE EXISTS. From 1 January 2026 every new AND renewing Texas notary must
 * complete a two-hour Secretary of State course and pass a 20-question assessment at 70%,
 * paying $20 per attempt with three attempts allowed in three months. That is roughly
 * 143,000 people a year meeting a brand-new exam, with money and a delayed commission
 * riding on it. It is the highest-intent moment in this category and it is seven weeks old.
 *
 * WHAT THIS IS NOT, AND THE PAGE SAYS SO PROMINENTLY. These are not the real questions.
 * The official assessment is drawn from four SOS instructional videos we do not control
 * and have no access to. Publishing invented questions as though they were the exam would
 * be a lie, and a page that exists to prepare people cannot be built on one.
 *
 * WHAT IT IS. Twenty questions drawn from the Texas law the course covers -- the fee
 * schedule in Gov't Code 406.024, the SB 693 changes, and the acknowledgment/jurat
 * distinction -- each with an explanation and the source. Same format and same 70% bar as
 * the real thing, so the practice run feels like the real one.
 *
 * EVERY FEE HERE WAS VERIFIED against the Texas fee schedule, August 2026. If the
 * legislature changes them, this page becomes actively harmful and must be updated.
 */

type Q = {
  q: string;
  options: string[];
  answer: number;
  why: string;
  source: string;
};

const QUESTIONS: Q[] = [
  {
    q: "What is the maximum fee a Texas notary may charge for taking an acknowledgment, for the first signature?",
    options: ["$6", "$10", "$15", "$25"],
    answer: 1,
    why: "$10 for the first signature. These are maximums — you may charge less, or nothing.",
    source: "Tex. Gov't Code § 406.024",
  },
  {
    q: "On that same acknowledgment, what is the maximum fee for each additional signature?",
    options: ["$1", "$5", "$10", "The same as the first"],
    answer: 0,
    why: "$1 per additional signature. A four-signature acknowledgment therefore caps at $13, not $40.",
    source: "Tex. Gov't Code § 406.024",
  },
  {
    q: "What is the maximum fee for administering an oath or affirmation with a certificate and seal?",
    options: ["$1", "$4", "$10", "$20"],
    answer: 2,
    why: "$10 — the same cap as an acknowledgment.",
    source: "Tex. Gov't Code § 406.024",
  },
  {
    q: "A client asks for a certified copy of a document in your notary records. Maximum fee per page?",
    options: ["$1", "$5", "$10", "Copies may not be charged for"],
    answer: 0,
    why: "$1 per page.",
    source: "Tex. Gov't Code § 406.024",
  },
  {
    q: "What is the maximum a Texas online notary may charge for the online notarization, on top of the regular notarial fee?",
    options: ["$10", "$15", "$25", "There is no additional fee"],
    answer: 2,
    why: "Up to $25 in addition to the regular fee. It is an addition, not a replacement.",
    source: "Tex. Gov't Code § 406.111",
  },
  {
    q: "Under SB 693, how long must a Texas notary retain their records?",
    options: ["3 years", "5 years", "10 years", "For the life of the commission"],
    answer: 2,
    why: "Ten years from the date of notarization. SB 693 doubled the previous five-year requirement.",
    source: "SB 693 (89th Leg., 2025)",
  },
  {
    q: "A regular customer asks you to notarize a document. They are not with you, but they signed it earlier and you recognise the signature. What must you do?",
    options: [
      "Notarize it — you recognise the signature",
      "Notarize it if they confirm by phone",
      "Refuse. The signer must personally appear before you",
      "Notarize it and note the absence in your journal",
    ],
    answer: 2,
    why: "Refuse. SB 693 made notarizing when the signer is not personally present a criminal offence. Familiarity, a phone call and a journal note are all irrelevant.",
    source: "SB 693 (89th Leg., 2025)",
  },
  {
    q: "Under SB 693, notarizing a document when the signer is not personally present is generally what level of offence?",
    options: [
      "A civil penalty only",
      "A Class C misdemeanour",
      "A Class A misdemeanour",
      "Always a felony",
    ],
    answer: 2,
    why: "A Class A misdemeanour — but it rises to a state jail felony where the document transfers real property.",
    source: "SB 693 (89th Leg., 2025)",
  },
  {
    q: "What is the essential difference between an acknowledgment and a jurat?",
    options: [
      "An acknowledgment requires an oath; a jurat does not",
      "A jurat requires the signer to swear the contents are true and to sign in your presence; an acknowledgment does not involve an oath",
      "They are two names for the same act",
      "A jurat is only used for real property documents",
    ],
    answer: 1,
    why: "In a jurat the signer swears or affirms the document's contents are true and signs in front of you. In an acknowledgment the signer confirms the signature is theirs and was made willingly — no oath, and it may have been signed earlier.",
    source: "Tex. Gov't Code Ch. 406; Civ. Prac. & Rem. Code Ch. 121",
  },
  {
    q: "How long is a Texas notary commission?",
    options: ["1 year", "2 years", "4 years", "5 years"],
    answer: 2,
    why: "Four years. SB 693 did not change this — the term was already four years.",
    source: "Tex. Gov't Code § 406.005",
  },
  {
    q: "What is the required amount of a Texas notary surety bond?",
    options: ["$5,000", "$10,000", "$25,000", "$50,000"],
    answer: 1,
    why: "$10,000, filed with the Secretary of State before the commission is issued.",
    source: "Tex. Gov't Code § 406.010",
  },
  {
    q: "Who does the notary bond protect?",
    options: [
      "The notary",
      "The notary's employer",
      "The public",
      "The Secretary of State",
    ],
    answer: 2,
    why: "The public. If a claim is paid from your bond, the surety can seek that money back from you personally. Errors & omissions insurance is the separate, optional product that protects you.",
    source: "Tex. Gov't Code § 406.010",
  },
  {
    q: "Is errors & omissions insurance required to hold a Texas notary commission?",
    options: [
      "Yes, at a minimum of $10,000",
      "Yes, but only for online notaries",
      "No — it is optional",
      "Only if your employer does not carry it",
    ],
    answer: 2,
    why: "No. Texas does not require it and does not ask about it. You are fully commissioned without it.",
    source: "Tex. Gov't Code Ch. 406",
  },
  {
    q: "What fee does the Secretary of State charge to file a notary application?",
    options: ["$11", "$21", "$50", "There is no state fee"],
    answer: 1,
    why: "$21, paid to the state and separate from what you pay for the bond. No provider can waive it.",
    source: "Texas Secretary of State",
  },
  {
    q: "Texas law requires a notary to display their fees. Where?",
    options: [
      "Nowhere — display is not required",
      "Conspicuously, in the place of business",
      "On a website only",
      "On each notarial certificate",
    ],
    answer: 1,
    why: "Conspicuously in the place of business.",
    source: "Tex. Gov't Code § 406.024",
  },
  {
    q: "Under SB 693, which of these is now expressly 'good cause' for suspending or revoking a commission?",
    options: [
      "Charging less than the maximum fee",
      "Failing to keep the required record of notarizations",
      "Notarizing for a family member",
      "Moving to another county",
    ],
    answer: 1,
    why: "Failing to maintain the required journal. SB 693 added this to the statutory description of good cause.",
    source: "SB 693 (89th Leg., 2025); Gov't Code § 406.014",
  },
  {
    q: "What is the maximum fee for taking a deposition?",
    options: ["$1 per 100 words", "$10 flat", "$1 per page", "$4 flat"],
    answer: 0,
    why: "$1 for each 100 words.",
    source: "Tex. Gov't Code § 406.024",
  },
  {
    q: "May a Texas notary notarize their own signature?",
    options: [
      "Yes, if no fee is charged",
      "Yes, for personal documents",
      "No, never",
      "Only with a second notary present",
    ],
    answer: 2,
    why: "Never. A notary cannot act as the impartial witness to their own signature.",
    source: "Tex. Gov't Code Ch. 406",
  },
  {
    q: "May a Texas notary decline to perform a notarization?",
    options: [
      "No — a commission obliges you to serve any request",
      "Yes, and you must refuse where the signer is absent, the document is incomplete, or you doubt the signer's willingness or identity",
      "Only if you are off duty",
      "Only with written reasons",
    ],
    answer: 1,
    why: "You may decline, and in several situations you must — absent signer, blank spaces, doubts about identity, understanding or willingness.",
    source: "Tex. Gov't Code Ch. 406",
  },
  {
    q: "Who provides the education course required before a Texas notary commission is issued or renewed?",
    options: [
      "Any approved private training provider",
      "The Texas Secretary of State only",
      "The county clerk",
      "Your bonding agency",
    ],
    answer: 1,
    why: "Only the Secretary of State. Courses elsewhere — including this practice test — are preparation, not the requirement itself.",
    source: "SB 693 (89th Leg., 2025)",
  },
];

const PASS_MARK = 0.7; // the real assessment: 20 questions, 70%, so 6 wrong is a fail

export default function TexasNotaryExamPractice() {
  useSEO({
    title: "Free Texas Notary Exam Practice Test (SB 693) — 20 Questions | Quantum Surety",
    description:
      "Free practice questions for the Texas notary education assessment required from January 2026. Same format as the real thing: 20 questions, 70% to pass. Every answer explained and sourced to the statute. No signup.",
    canonical: "/texas-notary-exam-practice",
  });
  useSchema(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: QUESTIONS.slice(0, 6).map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: `${x.options[x.answer]}. ${x.why}` },
      })),
    },
    "ld-json-notary-practice"
  );

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const correct = QUESTIONS.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const passed = correct / QUESTIONS.length >= PASS_MARK;

  function choose(qi: number, oi: number) {
    if (submitted) return;
    if (!started) {
      setStarted(true);
      track({ type: "form_start", element: "notary_practice_exam", value: "notary" });
    }
    setAnswers({ ...answers, [qi]: oi });
  }

  function submit() {
    setSubmitted(true);
    track({ type: "lead_submit", element: "notary_practice_exam", value: String(correct) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setStarted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            Free · No signup
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Notary Exam Practice Test
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            From 1 January 2026 every new and renewing Texas notary must pass a 20-question
            assessment after the Secretary of State's course. You need 70% — six wrong and you
            resit, at $20 an attempt. These 20 questions cover the same law, in the same format,
            so you know where you stand before it costs you anything.
          </p>
        </div>
      </section>

      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-amber-900 text-sm leading-relaxed">
            <strong>These are not the real exam questions.</strong> The official assessment is
            drawn from four Secretary of State instructional videos that we do not control and
            have no access to. Quantum Surety is a licensed bond agency, not a state training
            provider, and we are not affiliated with the Secretary of State. What follows is
            practice on the Texas law the course covers — every answer is sourced to the statute
            so you can check it yourself. The course and the assessment themselves are available
            only from the Secretary of State.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10">
        {submitted && (
          <div
            className={`rounded-2xl border p-6 mb-8 ${
              passed ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {passed ? (
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              ) : (
                <XCircle className="w-7 h-7 text-red-600" />
              )}
              <h2 className="text-2xl font-bold text-slate-900">
                {correct} of {QUESTIONS.length} — {passed ? "you'd pass" : "you'd resit"}
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {passed
                ? "That is above the 70% mark the real assessment uses. Read the explanations on anything you missed — the official questions come from the SOS videos, so watch those too."
                : `The real assessment needs 14 of 20. You missed ${QUESTIONS.length - correct}. Every question below shows the right answer and why, with the statute to check. A resit costs $20, so it is worth another pass through these first.`}
            </p>
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-2 text-slate-900 font-semibold underline"
            >
              <RotateCcw className="w-4 h-4" /> Try again
            </button>
          </div>
        )}

        <ol className="space-y-7">
          {QUESTIONS.map((q, qi) => {
            const picked = answers[qi];
            return (
              <li key={qi} className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="font-semibold text-slate-900 mb-3">
                  <span className="text-slate-400 mr-2">{qi + 1}.</span>
                  {q.q}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isPicked = picked === oi;
                    const isRight = q.answer === oi;
                    let cls = "border-slate-200 hover:border-slate-400";
                    if (submitted && isRight) cls = "border-emerald-500 bg-emerald-50";
                    else if (submitted && isPicked && !isRight) cls = "border-red-400 bg-red-50";
                    else if (isPicked) cls = "border-slate-900 bg-slate-50";
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => choose(qi, oi)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border transition ${cls}`}
                      >
                        <span className="text-slate-800">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div className="mt-3 text-sm text-slate-700 bg-slate-50 rounded-lg px-4 py-3">
                    {q.why}
                    <span className="block mt-1 text-slate-500 text-xs">{q.source}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {!submitted && (
          <div className="sticky bottom-4 mt-8">
            <button
              onClick={submit}
              disabled={answeredCount === 0}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl disabled:opacity-40 shadow-lg"
            >
              {answeredCount < QUESTIONS.length
                ? `Score me — ${answeredCount} of ${QUESTIONS.length} answered`
                : "Score me"}
            </button>
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Once you pass, you still need the bond
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Texas will not issue your commission until a $10,000 surety bond is on file. It is
            <strong> $50 for the full four-year term</strong>, plus the Secretary of State's own
            <strong> $21 filing fee</strong> — $71 to be commissioned. The education assessment is
            a separate $20 per attempt, paid to the state.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mb-5">
            $50 is the standard market rate rather than a discount — several providers charge it.
            We are a TDI-licensed Texas agency and the bond is legally identical whoever sells it,
            so what differs is speed and what happens afterwards.
          </p>
          <Link href="/bonds/notary-bond-texas">
            <span
              onClick={() => track({ type: "checkout_click", element: "practice_exam_footer", value: "notary" })}
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg cursor-pointer"
            >
              Texas notary bond — what it costs and covers <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
