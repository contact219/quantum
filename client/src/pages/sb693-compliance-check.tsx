import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

const QUESTIONS = [
  {
    id: "course",
    text: "Have you completed the required 2-hour SB693 notary training course?",
    options: ["Yes", "No", "Not yet"],
    passingAnswer: "Yes",
  },
  {
    id: "bond",
    text: "Is your current notary bond active (not expired)?",
    options: ["Yes", "No", "Not sure"],
    passingAnswer: "Yes",
  },
  {
    id: "journal",
    text: "Do you maintain an electronic or paper notary journal?",
    options: ["Yes", "No", "Not yet"],
    passingAnswer: "Yes",
  },
  {
    id: "renewal",
    text: "Is your commission renewal date within the next 6 months?",
    options: ["Yes", "No"],
    passingAnswer: "Yes",
  },
  {
    id: "seal",
    text: "Have you reviewed your notary seal/stamp requirements under SB693?",
    options: ["Yes", "No", "Not sure"],
    passingAnswer: "Yes",
  },
];

export default function SB693ComplianceCheck() {
  useSEO({
    title: "SB693 Notary Compliance Checker — Is Your Texas Commission Ready? (2026)",
    description:
      "Free interactive SB693 compliance checker for Texas notaries. Answer 5 questions to see if your commission meets the new 2026 SB693 requirements — training course, bond, journal, and more.",
    canonical: "/sb693-compliance-check",
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", expiry: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const answered = Object.keys(answers).length;
  const passing = QUESTIONS.filter((q) => answers[q.id] === q.passingAnswer).length;

  const getResult = () => {
    if (answered < 5) return null;
    if (passing === 5) return "ready";
    if (passing >= 3) return "almost";
    return "action";
  };

  const result = getResult();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: "",
          bond_type: "notary",
          source: "sb693-compliance-checker",
          notes: `Commission expires: ${form.expiry || "not provided"}. Compliance score: ${passing}/5`,
        }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block bg-amber-500 text-amber-950 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            SB693 · Effective 2026
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Is My Texas Notary Commission SB693-Ready?
          </h1>
          <p className="text-indigo-200 text-lg">
            Answer 5 quick questions to check your compliance with Texas Senate Bill 693 — the new 2026 notary law.
          </p>
        </div>
      </section>

      <div className="bg-amber-50 border-y border-amber-200 py-3 px-4">
        <div className="max-w-2xl mx-auto text-sm text-amber-900">
          <strong>SB693 at a glance:</strong> All Texas notary commissions renewed after Jan 1, 2026 require a 2-hour training course ($20 at sos.texas.gov/notary), a maintained journal (5-year retention), and compliance with new penalty rules ($500–$10,000 for violations).
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your SB693 Compliance Checklist</h2>

        <div className="space-y-6 mb-10">
          {QUESTIONS.map((q, i) => (
            <div key={q.id} className="border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-3">
                <span className="text-indigo-600 mr-2">{i + 1}.</span>
                {q.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt;
                  const isPass = opt === q.passingAnswer;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selected
                          ? isPass
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-red-100 text-red-800 border-red-300"
                          : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {result && (
          <div
            className={`rounded-xl p-6 mb-8 border-2 ${
              result === "ready"
                ? "bg-green-50 border-green-400"
                : result === "almost"
                ? "bg-amber-50 border-amber-400"
                : "bg-red-50 border-red-400"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {result === "ready" && <CheckCircle className="w-6 h-6 text-green-600" />}
              {result === "almost" && <AlertTriangle className="w-6 h-6 text-amber-600" />}
              {result === "action" && <XCircle className="w-6 h-6 text-red-600" />}
              <span
                className={`text-lg font-bold ${
                  result === "ready"
                    ? "text-green-800"
                    : result === "almost"
                    ? "text-amber-800"
                    : "text-red-800"
                }`}
              >
                {result === "ready" && "You're SB693 Ready"}
                {result === "almost" && `Almost There — ${5 - passing} item${5 - passing > 1 ? "s" : ""} to address`}
                {result === "action" && "Action Required"}
              </span>
            </div>
            <p
              className={`text-sm ${
                result === "ready"
                  ? "text-green-700"
                  : result === "almost"
                  ? "text-amber-700"
                  : "text-red-700"
              }`}
            >
              {result === "ready" &&
                "Your commission appears to meet all SB693 requirements. Keep your bond active and journal up to date."}
              {result === "almost" &&
                "You're close — review the unchecked items above before your next renewal. The training course and bond are the two most time-sensitive."}
              {result === "action" &&
                "Several critical SB693 requirements are unmet. Complete the training course and renew your bond before your next commission renewal."}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-12">
          <a
            href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX"
            target="_blank"
            rel="noreferrer"
          >
            <Button>
              Renew Your Bond — $50 Same Day <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
          <Link href="/blog/texas-notary-bond-sb693-2026-requirements">
            <Button variant="outline">Read the Full SB693 Guide</Button>
          </Link>
        </div>

        <div className="border border-indigo-200 rounded-xl p-6 bg-indigo-50">
          <h3 className="text-lg font-bold text-indigo-900 mb-1">Get a Renewal Reminder</h3>
          <p className="text-sm text-indigo-700 mb-4">
            We'll email you 60 days before your commission expires with a renewal checklist and bond link.
          </p>
          {submitted ? (
            <p className="text-green-700 font-semibold">Got it — we'll send your reminder.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="text"
                placeholder="Commission expiry date (MM/YYYY)"
                value={form.expiry}
                onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Saving..." : "Set My Reminder"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
