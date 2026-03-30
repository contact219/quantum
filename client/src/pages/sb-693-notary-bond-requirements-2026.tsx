import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Download, ExternalLink, FileText } from "lucide-react";

const checklistItems = [
  "Confirm you are at least 18 and a legal Texas resident.",
  "Complete the required Texas notary training course if SB-693 applies to you.",
  "Pass the state notary exam if required by your applicant category.",
  "Purchase your $10,000 four-year Texas notary bond from an authorized surety agency.",
  "Submit your application and filing fee through the Texas Secretary of State portal.",
  "Keep your journal and required records for the current retention period.",
  "Download and save your SB-693 compliance checklist for renewal tracking.",
];

export default function SB693NotaryBondRequirements2026() {
  useSEO({
    title: "SB-693 Notary Bond Requirements 2026 Guide | Texas",
    description:
      "Understand SB-693 notary bond requirements for 2026 in Texas. See deadlines, documents, and mistakes to avoid. Download the compliance checklist.",
    canonical: "/sb-693-notary-bond-requirements-2026",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Badge className="bg-white/10 text-white border-white/20 mb-5">Texas Compliance Guide</Badge>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl">
            SB-693 Notary Bond Requirements 2026: Texas Compliance Guide
          </h1>
          <p className="mt-6 text-indigo-100 text-lg max-w-3xl">
            If you are preparing to become a Texas notary or renew your commission, these SB-693 notary bond requirements for 2026 should be your first checklist. Texas still requires a $10,000 notary surety bond for a four-year commission term, but SB-693 adds new compliance obligations around education, exam readiness, and recordkeeping. This guide explains exactly what to prepare, when to file, and where applicants lose time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-indigo-100">
            <span className="rounded-full bg-white/10 px-3 py-1">Updated for 2026 applicants</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Built for Texas notaries</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Practical filing checklist included</span>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">What SB-693 changes in 2026</h2>
            <p className="mt-4 text-slate-700 leading-7">
              Texas notary bond amounts are unchanged under SB-693: applicants still need a <strong>$10,000 surety bond</strong> aligned to the
              state commission term. The major update is process compliance. New and renewing applicants should expect additional training and
              documentation expectations before final state approval. In practical terms, SB-693 means applicants who start late risk delayed
              commissioning even when their bond is already issued.
            </p>
            <p className="mt-4 text-slate-700 leading-7">
              Use this page with the official state notices and application instructions, and treat it as your implementation playbook:
              prepare education proof, secure your bond early, confirm filing deadlines, and preserve records correctly from day one.
            </p>
          </div>
          <div className="w-full lg:w-[360px] bg-slate-900 text-white rounded-2xl p-6">
            <p className="text-sm uppercase tracking-wider text-slate-300">Downloadable resource</p>
            <h3 className="mt-2 text-xl font-semibold">SB-693 2026 Notary Checklist (PDF)</h3>
            <p className="mt-3 text-sm text-slate-300">
              Save this file for onboarding, renewals, and internal training with your office or signing team.
            </p>
            <a
              href="/downloads/sb-693-notary-bond-checklist-2026.pdf"
              download
              className="inline-flex mt-5 items-center gap-2 rounded-lg bg-cyan-400 text-slate-900 font-semibold px-4 py-2 hover:bg-cyan-300"
            >
              <Download className="w-4 h-4" /> Download PDF checklist
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          <article>
            <h2 className="text-3xl font-bold text-slate-900">Eligibility and application readiness</h2>
            <p className="mt-4 text-slate-700 leading-7">
              Before you submit anything, confirm baseline eligibility: age, residency, and legal status. Even straightforward applications can be
              stalled by mismatched names, incomplete disclosures, or missing attachments. Build a single digital packet with identity details,
              contact information, and your supporting compliance documents so you can upload everything in one pass.
            </p>
            <p className="mt-4 text-slate-700 leading-7">
              Most applicants should sequence work in this order: complete training requirements, pass any required exam, secure bond,
              then submit filing package. That order reduces rework and avoids paying for rushed corrections. If your commission timeline
              is tied to a closing schedule or onboarding date, start 30-45 days earlier than you think you need.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-10">Required documents for SB-693 filing</h2>
            <p className="mt-4 text-slate-700 leading-7">
              Keep all records in both PDF and cloud storage so you can respond quickly if the state requests clarification. Your core package
              usually includes your bond form, application, payment confirmation, and SB-693 education/exam evidence where applicable.
              Add a short naming standard for files (LastName_DocumentType_Date) to avoid upload confusion.
            </p>
            <ul className="mt-6 space-y-3">
              {checklistItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Deadlines to track</h3>
              <p className="mt-3 text-slate-700 leading-7">
                Your bond term and commission dates must stay aligned. Set calendar reminders for filing milestones, expected approval windows,
                and renewal preparation dates. Late renewals can interrupt notarization authority and affect business continuity.
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-amber-900">Common pitfalls in 2026</h3>
                  <ul className="mt-3 space-y-2 text-amber-900/90 text-sm leading-6">
                    <li>Uploading a bond form that does not match applicant legal name exactly.</li>
                    <li>Assuming education completion alone satisfies filing requirements.</li>
                    <li>Submitting near deadline without buffer for portal corrections.</li>
                    <li>Failing to maintain records for the required retention period.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-2xl p-6">
              <h3 className="text-xl font-semibold">Official source links</h3>
              <p className="mt-3 text-slate-300 text-sm leading-6">
                Always validate final details against current state instructions before filing.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.sos.state.tx.us/statdoc/notary-public.shtml"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
                  >
                    Texas Secretary of State notary resources <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tdi.texas.gov/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
                  >
                    Texas Department of Insurance <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-14 px-4 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">How to use this guide for lead-ready execution</h2>
          <p className="mt-4 text-slate-700 leading-7">
            If you manage notary onboarding for a business, law firm, title team, or mobile signing operation, turn this guide into an internal
            workflow. Assign a checklist owner, centralize every renewal date, and keep a standard document packet for all new notaries.
            This makes compliance predictable and shortens issuance timelines.
          </p>
          <p className="mt-4 text-slate-700 leading-7">
            For individual notaries, the fastest path is simple: review the state guidance, complete SB-693 prerequisites, purchase your bond,
            and file immediately. Then archive your bond and compliance records where you can access them for audits, renewals, and client requests.
          </p>

          <div className="mt-8 p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-slate-500">Next step</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">Start your Texas notary bond request online</p>
            </div>
            <div className="flex gap-3">
              <Link href="/quote?type=notary">
                <Button>Get My Notary Bond</Button>
              </Link>
              <Link href="/bonds/notary-bond-texas">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" /> View Texas notary bond page
                </Button>
              </Link>
            </div>
          </div>

          <figure className="mt-10">
            <img
              src="/QS_OG_2.png"
              alt="SB-693 notary bond requirements 2026 guide by Quantum Surety"
              className="w-full max-w-3xl rounded-2xl border border-slate-200"
            />
          </figure>
        </div>
      </section>
    </div>
  );
}
