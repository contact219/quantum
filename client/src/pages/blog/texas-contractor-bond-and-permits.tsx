import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight } from "lucide-react";

export default function BlogTexasContractorBondAndPermits() {
  useSEO({
    title: "Texas Contractors: Get Your Bond and Pull Your Permits in One Day | Quantum Surety",
    description:
      "How DFW contractors can secure a contractor license bond and identify required permits in one day using Quantum Surety and Permit Pilot.",
    canonical: "/blog/texas-contractor-bond-and-permits",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Article", "publisher": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" } }, "ld-json-Article");

  return (
    <article className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-300 text-sm font-medium mb-3 uppercase tracking-widest">Contractor Workflow</p>
          <h1 className="text-4xl font-bold mb-4">Texas Contractors: Get Your Bond and Pull Your Permits in One Day</h1>
          <p className="text-indigo-100 text-lg max-w-3xl">
            If you&apos;re a contractor in DFW, your contractor license bond and permit plan should be handled together. Here&apos;s a practical same-day workflow.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-slate max-w-none">
        <p>
          If you&apos;re a contractor working in the Dallas-Fort Worth area, two things stand between you and a permit: your contractor license bond and a completed permit application.
          The good news is both can now be handled in the same afternoon.
        </p>

        <h2>Step 1 — Get Your Contractor License Bond (15 Minutes)</h2>
        <p>
          Most DFW cities require a contractor license bond on file before they&apos;ll accept a building permit application.
          Getting bonded is faster than most contractors expect.
        </p>
        <ul>
          <li>Apply online at <a href="/quote">quantumsurety.bond/quote</a></li>
          <li>AI-assisted underwriting with fast review for qualified applicants</li>
          <li>Typical annual cost is approximately $175–$250 for many contractors</li>
          <li>Bond certificate delivered quickly after approval</li>
        </ul>

        <h2>Step 2 — Identify Every Permit Your Project Needs (30 Seconds)</h2>
        <p>
          Once you have your bond certificate in hand, you&apos;re ready to apply for permits. Before you submit,
          use Permit Pilot to identify every permit your project requires and avoid correction cycles.
        </p>
        <p>
          <a
            href="https://permitpilot.online?utm_source=quantumsurety&utm_medium=blog&utm_campaign=cross-promo"
            target="_blank"
            rel="noreferrer"
          >
            Permit Pilot
          </a>{" "}
          is our free sister tool for DFW contractors, covering all 24 regional jurisdictions.
        </p>

        <h2>The One-Day Workflow</h2>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 border-b border-slate-200">Time</th>
                <th className="text-left p-3 border-b border-slate-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["9:00 AM", "Apply for contractor bond at quantumsurety.bond"],
                ["9:15 AM", "Bond approved, certificate in hand"],
                ["9:20 AM", "Run permit analysis on permitpilot.online"],
                ["9:30 AM", "Download compliance checklist"],
                ["10:00 AM", "Submit permit application to city"],
              ].map(([time, action]) => (
                <tr key={time}>
                  <td className="p-3 border-b border-slate-100 font-medium">{time}</td>
                  <td className="p-3 border-b border-slate-100">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500 italic">
          Permit Pilot provides AI-generated permit guidance for informational purposes. Always verify requirements directly with your local building department before submitting applications.
        </p>

        <div className="mt-10 not-prose grid sm:grid-cols-2 gap-4">
          <Link href="/quote" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-500 transition-colors">
            Get your contractor bond <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <a
            href="https://permitpilot.online?utm_source=quantumsurety&utm_medium=blog-footer&utm_campaign=cross-promo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-cyan-300 bg-cyan-50 px-5 py-3 text-cyan-800 font-semibold hover:bg-cyan-100 transition-colors"
          >
            Analyze permits free on Permit Pilot <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </article>
  );
}
