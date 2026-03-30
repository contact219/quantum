import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Clock, ChevronRight, AlertTriangle, Phone } from "lucide-react";

export default function BlogNotaryVsNSA() {
  useSEO({
    title: "Texas Notary vs. Notary Signing Agent: What's the Difference? | Quantum Surety",
    description:
      "A Texas notary public and a notary signing agent (NSA) are not the same thing. Here's what each role requires, what bonds and insurance you need, and which path makes more sense for your business.",
    canonical: "/blog/texas-notary-vs-notary-signing-agent",
    ogType: "article",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog">
              <span className="hover:text-white cursor-pointer">Blog</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas Notary</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-semibold bg-teal-500/30 text-teal-200 px-3 py-1 rounded-full">Texas Notary</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 6 min read</span>
            <span className="text-indigo-300 text-sm">March 25, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Texas Notary vs. Notary Signing Agent: What's the Difference?
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Many people use these terms interchangeably — but they're two distinct roles with different training requirements, income potential, and insurance needs. Here's exactly how they differ and which one is right for you.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 py-12">

        {/* TOC */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-5 mb-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">In this article</p>
          <ol className="space-y-1.5 text-sm">
            {[
              ["#notary-public", "What is a Texas Notary Public?"],
              ["#signing-agent", "What is a Notary Signing Agent (NSA)?"],
              ["#key-differences", "Key differences at a glance"],
              ["#bond-insurance", "Bond and insurance requirements"],
              ["#income", "How much does each role pay?"],
              ["#which-one", "Which one should you become?"],
              ["#get-started", "Get your bond and get started"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-indigo-600 hover:text-indigo-800 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 1 */}
        <section id="notary-public" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What is a Texas Notary Public?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A <strong>Texas notary public</strong> is a state-commissioned official authorized by the Texas Secretary of State (SOS) to perform specific notarial acts. These include:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Taking acknowledgments (verifying that a signer voluntarily signed a document)",
              "Administering oaths and affirmations",
              "Certifying copies of documents",
              "Taking depositions",
              "Performing jurats (certifying that a signer swore to the contents of a document)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-700 leading-relaxed mb-4">
            The commission is issued by the Texas SOS, lasts 4 years, and requires a $10,000 surety bond. Under <strong>SB693 (effective January 1, 2026)</strong>, new applicants must also complete a 2-hour education course and pass a 20-question assessment before their application is accepted.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Being a Texas notary public is a <em>state credential</em>. It does not authorize you to handle loan signings, conduct real estate closings, or act as a closing agent — those roles require additional training and certification.
          </p>
        </section>

        {/* Section 2 */}
        <section id="signing-agent" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What is a Notary Signing Agent (NSA)?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A <strong>notary signing agent</strong> is a notary public who has received additional specialized training to handle loan document signings — specifically mortgage closings, refinances, and real estate transactions. The NSA facilitates the signing of a loan package, explains each document's general purpose (without practicing law), and ensures all signatures are obtained correctly.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            To become an NSA in Texas you must:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Already hold a valid Texas notary commission",
              "Complete NSA training (offered by NNA, Notary2Pro, and others)",
              "Pass a background screening — most title companies and signing services require this",
              "Carry errors & omissions (E&O) insurance — often $100,000+ coverage is required",
              "Pass the NNA Signing Agent certification exam (strongly recommended; required by most hiring companies)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-700 leading-relaxed">
            An NSA is still just a notary — they cannot give legal advice, choose what documents a borrower signs, or act as a title agent. Their job is to witness and authenticate signatures, not to conduct the closing on behalf of a lender.
          </p>
        </section>

        {/* Section 3 */}
        <section id="key-differences" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Key differences at a glance</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold rounded-tl-md">Factor</th>
                  <th className="text-left px-4 py-3 font-semibold">Texas Notary Public</th>
                  <th className="text-left px-4 py-3 font-semibold rounded-tr-md">Notary Signing Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Commission required", "Yes — Texas SOS", "Yes — must be a notary first"],
                  ["Additional certification", "No", "Yes — NSA training + exam"],
                  ["Background check", "SOS checks automatically", "Private background screen required"],
                  ["Surety bond required", "Yes — $10,000, 4 years", "Yes — same bond"],
                  ["E&O insurance", "Recommended", "Usually required (often $100k+)"],
                  ["Typical work", "General notarizations, affidavits, oaths", "Loan closings, mortgage refinances"],
                  ["Average pay per job", "$6–$15 per notarization", "$75–$200 per loan signing"],
                  ["Hiring requirements", "State commission only", "NNA cert + background screen + E&O"],
                ].map(([factor, notary, nsa], i) => (
                  <tr key={factor} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-3 font-medium text-slate-800">{factor}</td>
                    <td className="px-4 py-3 text-slate-700">{notary}</td>
                    <td className="px-4 py-3 text-slate-700">{nsa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section id="bond-insurance" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bond and insurance requirements</h2>

          <h3 className="text-lg font-semibold text-slate-800 mb-3">The notary bond ($10,000 — required for both)</h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every Texas notary — whether they plan to do general notarizations or loan signings — must purchase a <strong>$10,000 surety bond</strong> before the SOS will issue their commission. This bond is required by state law (Texas Government Code §406), costs <strong>$50 for the full 4-year term</strong>, and requires no credit check.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The bond protects the <em>public</em>. If you make a mistake or commit misconduct as a notary, a harmed party can file a claim against your bond. Your bonding company pays the claim up to $10,000 — and then seeks reimbursement from you. The bond does <em>not</em> protect you personally.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mb-3">E&O insurance (strongly recommended for notaries; often required for NSAs)</h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Errors & omissions (E&O) insurance fills the gap the bond leaves. If a borrower sues you for an honest mistake during a loan signing, your E&O policy covers your legal defense and any damages — up to your policy limit. For a general notary, it's a wise add-on. For an NSA working with lenders and title companies, it's almost always <strong>contractually required</strong>.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">Most title companies require $100,000+ E&O coverage for NSAs</p>
                <p className="text-sm text-amber-700">
                  Before you accept your first loan signing, confirm the coverage minimum with your signing service or title company. Many require the NNA certification AND a current background screen to be on file.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-5">
            <p className="font-semibold text-slate-800 mb-3">Coverage cost comparison (4-year term)</p>
            <div className="space-y-2 text-sm">
              {[
                ["Notary bond ($10,000)", "$50", "Required"],
                ["E&O — $25,000 coverage", "~$40", "Recommended for notaries"],
                ["E&O — $100,000 coverage", "~$65–$90", "Required for most NSA work"],
              ].map(([item, cost, note]) => (
                <div key={item} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700 flex-1">{item}</span>
                  <span className="font-semibold text-indigo-700 w-20 text-right">{cost}</span>
                  <span className="text-slate-500 text-xs w-40 text-right hidden sm:block">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="income" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How much does each role pay?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            General notary work pays per notarization. Texas law caps the maximum fee at <strong>$6 per notarial act</strong> for in-person work. Most notaries charge the maximum, which adds up slowly for standalone notarizations.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            NSA work is much more lucrative per job. A single loan signing typically pays <strong>$75–$200</strong>, with complex transactions paying more. Experienced NSAs in active real estate markets like DFW, Houston, or Austin can complete 2–4 signings per day once they build their client roster.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {[
              {
                role: "General Texas Notary",
                perJob: "$6 per notarization",
                monthly: "$50–$300/mo (part-time)",
                fit: "Side income, document authentication, business stamp",
              },
              {
                role: "Notary Signing Agent",
                perJob: "$75–$200 per loan signing",
                monthly: "$2,000–$6,000+/mo (active)",
                fit: "Full-time or serious part-time income",
              },
            ].map(({ role, perJob, monthly, fit }) => (
              <div key={role} className="border border-slate-200 rounded-md p-4">
                <p className="font-semibold text-slate-900 mb-3">{role}</p>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Per job: </span><span className="font-medium text-slate-800">{perJob}</span></div>
                  <div><span className="text-slate-500">Monthly: </span><span className="font-medium text-slate-800">{monthly}</span></div>
                  <div><span className="text-slate-500">Best for: </span><span className="text-slate-700">{fit}</span></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-slate-700 leading-relaxed text-sm">
            Note: NSA income is highly variable. Market conditions, real estate volume, and your local competition all affect how many signings you get. The figures above reflect active agents in mid-to-large Texas markets.
          </p>
        </section>

        {/* Section 6 */}
        <section id="which-one" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Which one should you become?</h2>

          <div className="space-y-4 mb-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-5">
              <p className="font-semibold text-indigo-900 mb-2">Start as a Texas Notary if you:</p>
              <ul className="space-y-1.5">
                {[
                  "Want to add notary services to an existing business (real estate, law, accounting, HR)",
                  "Need a notary stamp for your own documents",
                  "Are testing the waters before committing to NSA training",
                  "Want a simple, low-cost credential with minimal ongoing requirements",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-indigo-800">
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-teal-50 border border-teal-100 rounded-md p-5">
              <p className="font-semibold text-teal-900 mb-2">Pursue NSA certification if you:</p>
              <ul className="space-y-1.5">
                {[
                  "Want meaningful part-time or full-time self-employment income",
                  "Live in a high-volume real estate market (DFW, Houston, Austin, San Antonio)",
                  "Are comfortable driving to signings at banks, title companies, or borrower homes",
                  "Can invest in NSA training (~$200–$400) and higher E&O coverage upfront",
                  "Want to work with professional signing services and title companies",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-teal-800">
                    <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-1">The bottom line</p>
            <p>
              Every NSA must first become a notary. There's no downside to starting with your notary commission — you can always pursue NSA certification afterward. The bond, the SOS application process, and the SB693 education requirement are exactly the same for both paths. The NSA layer adds training, background screening, and higher E&O coverage on top.
            </p>
          </div>
        </section>

        {/* Section 7 — CTA */}
        <section id="get-started" className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get your bond and get started</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Whether you're becoming a general Texas notary or building an NSA business, the first step is the same: purchase your <strong>$10,000 Texas notary bond</strong>. Quantum Surety delivers your bond instantly by email as a PDF — ready to upload to the SOS Portal within minutes. No credit check. No waiting.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Add E&O insurance at checkout to protect yourself from day one. We offer coverage starting at $25,000 up to $100,000+ to meet title company requirements.
          </p>

          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 rounded-md p-6 text-white">
            <p className="text-xl font-bold mb-1">Texas Notary Bond — $50, instant PDF</p>
            <p className="text-indigo-200 text-sm mb-5">
              TDI-licensed surety agency. Includes SOS Portal filing instructions. E&O insurance available at checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/bonds/notary-bond-texas">
                <Button className="bg-teal-400 hover:bg-teal-300 text-slate-900 font-semibold" data-testid="link-get-notary-bond">
                  Get your bond now <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/sb-693-notary-bond-requirements-2026">
                <Button variant="outline" className="border-white/40 text-white bg-white/10" data-testid="link-sb693-guide">
                  Read the SB693 guide
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Related articles */}
        <section className="border-t border-slate-100 pt-8">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Related articles</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: "/blog/texas-notary-bond-sb693-2026-requirements",
                title: "Texas Notary Bond Requirements 2026: What SB693 Changes",
                desc: "Full breakdown of the new education, exam, and record-keeping rules.",
              },
              {
                href: "/blog/texas-notary-bond-cost-2026",
                title: "How Much Does a Texas Notary Bond Cost in 2026?",
                desc: "Complete cost breakdown: bond, SOS fees, seal, journal, and E&O.",
              },
            ].map(({ href, title, desc }) => (
              <Link key={href} href={href}>
                <div className="border border-slate-200 rounded-md p-4 hover-elevate cursor-pointer h-full" data-testid={`link-related-${href.split("/").pop()}`}>
                  <p className="font-semibold text-slate-900 text-sm mb-1">{title}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Author / disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400 space-y-1">
          <p>Published by Quantum Surety — TDI-Licensed Texas Surety Bond Agency | (972) 379-9216</p>
          <p>
            This article is for informational purposes only and does not constitute legal advice.
            Verify current requirements at <a href="https://sos.state.tx.us" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">sos.state.tx.us</a> before applying.
          </p>
        </div>
      </article>

      {/* Bottom CTA */}
      <section className="bg-slate-50 border-t border-slate-200 py-12 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-slate-900 text-lg">Ready to get bonded?</p>
            <p className="text-slate-600 text-sm">$50 · instant PDF · no credit check · TDI-licensed agency</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/bonds/notary-bond-texas">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" data-testid="btn-get-bonded-bottom">
                Get bonded now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="tel:9723799216">
              <Button variant="outline" className="border-slate-300" data-testid="btn-call-bottom">
                <Phone className="w-4 h-4 mr-1" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
