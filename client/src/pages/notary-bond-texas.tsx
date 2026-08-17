import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import NotaryRenewalAlert from "@/components/NotaryRenewalAlert";
import {
  CheckCircle, ArrowRight, Clock, FileText, Shield, XCircle,
  AlertTriangle, Phone, Search, ExternalLink, Scale, ListChecks,
} from "lucide-react";

/**
 * /bonds/notary-bond-texas — the money page for "texas notary bond".
 *
 * Positioning note (2026-08-16). We do not rank page one. The pages that do —
 * notarypublicunderwriters.com in particular — are not deeper or better built
 * than ours. They win by OWNING THE QUESTIONS a buyer asks around the purchase:
 * the head term AND a separately-ranking "bond versus E&O" page. So this page is
 * structured as an answer set, not a brochure, and every question a newly
 * commissioned Texas notary asks gets a direct answer with a jump link.
 *
 * Two hard rules, both learned the expensive way:
 *
 *  1. $50 is NEVER presented as the total. The Texas SOS filing fee is $21 on
 *     top and nobody can waive it. $71 is what it costs to be commissioned. This
 *     was corrected across 46 places on 2026-08-14 and must not creep back.
 *  2. No "cheapest" / "lowest price" claim. $50 for the 4-year term is the
 *     STANDARD market rate — SuretyBonds.com, the NNA and BondExchange all
 *     charge it. We match the market. Claiming otherwise is false and was
 *     removed site-wide.
 *
 * Removed 2026-08-16: three testimonials ("Maria T., Dallas TX" et al) that
 * appear nowhere else in this repo, in the CRM, or in any review platform. They
 * had no provenance and read as invented. They are replaced by the one trust
 * signal on this page no competitor can copy — our own transaction record.
 */

/**
 * Verification portal size. Stated as a floor, not an exact count, on purpose.
 *
 * The precise figure was 571,021 at the August 2026 import, and it was hardcoded
 * in three places. scripts/import-notaries.py upserts the table on the 1st of
 * every month, so an exact number here becomes false the next time cron runs and
 * nothing on this page would ever tell us. A number that drifts silently is worse
 * than an honest approximation. Round DOWN so the claim stays true as it ages.
 *
 * For a live figure: GET https://verify.quantumsurety.bond/api/v1/status
 */
const PORTAL_RECORDS = "more than 570,000";

/**
 * Market price check. Date-stamped because it has a shelf life — competitor
 * pricing is not ours to keep current, and an undated "they all charge $50"
 * quietly becomes a false claim about named third parties. Re-check or drop the
 * names; do not leave it undated.
 */
const PRICE_CHECK_DATE = "August 2026";

/** Our own book. Last 45 issued Texas notary bonds. Do not round or embellish. */
const BOOK = {
  count: 45,
  min: "$71.00",
  median: "$107.56",
  max: "$195.56",
  eoAttached: 42,
  eoAvg: "$46.85",
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Notary Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/notary-bond-texas",
  "provider": {
    "@type": "InsuranceAgency",
    "name": "Quantum Surety Bonds",
    "url": "https://quantumsurety.bond",
    "telephone": "+1-214-666-8718",
    "areaServed": { "@type": "State", "name": "Texas" },
    "identifier": "Texas Department of Insurance license #3480229",
  },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description":
    "Texas notary surety bond — $10,000 coverage for the full 4-year commission term. The bond premium is $50. The Texas Secretary of State charges a separate $21 filing fee, so being commissioned costs $71. Errors & Omissions coverage is optional and priced separately.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "50",
    "description":
      "Bond premium for the full 4-year term. Does not include the Texas Secretary of State's separate $21 filing fee, which is charged by the state and cannot be waived by any provider.",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a Texas notary bond cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The bond premium is $50 for the full 4-year term. The Texas Secretary of State charges a separate $21 filing fee that no provider can waive, so becoming commissioned costs $71 at minimum. $50 is the standard market rate for this bond — several national providers charge the same. Errors & Omissions coverage is optional and costs extra.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between a Texas notary bond and notary E&O insurance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The notary bond protects the public; errors and omissions insurance protects you, the notary. Texas requires the $10,000 bond before it will commission you. If someone is harmed by your notarial error, they claim against the bond, the surety pays them up to $10,000, and then the surety has the right to seek that money back from you personally. E&O is optional, is not required by Texas, and is the coverage that pays your own defense costs and settlements so you are not personally out of pocket.",
      },
    },
    {
      "@type": "Question",
      "name": "Is E&O insurance required for Texas notaries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Texas does not require notary E&O insurance. Only the $10,000 surety bond is required. E&O is a business decision, not a compliance one. Of our last 45 issued Texas notary bonds, 42 buyers chose to add E&O coverage.",
      },
    },
    {
      "@type": "Question",
      "name": "Does the notary bond cover me if I make a mistake?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. This is the most common and most expensive misunderstanding in Texas notary work. The bond pays the harmed party, not you, and the surety may then pursue you for reimbursement of what it paid. Holding a bond does not mean you are insured.",
      },
    },
    {
      "@type": "Question",
      "name": "What is a Texas notary bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Texas notary bond is a $10,000 surety bond required by the Texas Secretary of State before it will issue a notary public commission. It is a financial guarantee to the public that money is available if a notary's misconduct or error causes someone a loss. It runs for the same 4 years as the commission.",
      },
    },
    {
      "@type": "Question",
      "name": "What changed in 2026 for Texas notaries (SB693)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Senate Bill 693 is a 2025 law that took effect on September 1, 2025 and applies to notary applications submitted on or after January 1, 2026. It requires applicants to complete a 2-hour education course from the Texas Secretary of State and pass an assessment. The $20 is the assessment fee; you may retake the assessment up to three times within three months. The law also extended record retention to 10 years and created criminal penalties for improper notarizations. SB693 did not change the commission term and did not change the bond requirement — still a $10,000 bond for the 4-year term at $50.",
      },
    },
    {
      "@type": "Question",
      "name": "Is there a credit check for a Texas notary bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Texas notary bonds are issued without a credit check. Anyone who meets the state's eligibility requirements can buy one.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get a notary bond as a remote online notary (RON)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Every Texas notary, including remote online notaries, carries the same $10,000 bond. RON authorization is a separate application to the Secretary of State made after your notary commission is granted.",
      },
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Quantum Surety", "item": "https://quantumsurety.bond" },
    { "@type": "ListItem", "position": 2, "name": "Surety Bonds", "item": "https://quantumsurety.bond" },
    { "@type": "ListItem", "position": 3, "name": "Texas Notary Bond", "item": "https://quantumsurety.bond/bonds/notary-bond-texas" },
  ],
};

/** The question set. Order = the order a newly commissioned notary asks them. */
const QUESTIONS = [
  { id: "cost", q: "What does it actually cost?" },
  { id: "bond-vs-eo", q: "Bond vs. E&O — what's the difference?" },
  { id: "what-i-paid", q: "What do other Texas notaries actually pay?" },
  { id: "price-honesty", q: "Is $50 a good price, or a gimmick?" },
  { id: "steps", q: "What's the full order of operations?" },
  { id: "requirements", q: "What are the 2026 requirements?" },
  { id: "sb693", q: "What did SB693 change?" },
  { id: "verify", q: "How do I check my commission or expiry date?" },
  { id: "who-we-are", q: "Who am I buying from?" },
];

export default function NotaryBondTexas() {
  useSEO({
    title: "Texas Notary Bond — $50 Bond + $21 State Fee | Bond vs E&O Explained | Quantum Surety",
    description:
      "Texas notary bond: $50 for the full 4-year term, plus the state's unavoidable $21 filing fee — $71 commissioned. What the bond does and does not cover, how it differs from E&O insurance, and what our last 45 Texas notaries actually paid. TDI licensed agency #3480229.",
    canonical: "/bonds/notary-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");
  useSchema(BREADCRUMB_SCHEMA, "ld-json-Breadcrumb");

  const faqs = [
    {
      q: "What is a Texas notary bond?",
      a: "A $10,000 surety bond the Texas Secretary of State requires before it will issue your notary commission. It is a financial guarantee to the public — it puts money on the table if your misconduct or error costs somebody money. It runs for the same four years as your commission.",
    },
    {
      q: "How much does a Texas notary bond cost?",
      a: "The bond premium is $50 for the whole 4-year term — not per year. The Secretary of State charges its own $21 filing fee on top, which no provider can waive or discount. $71 is the realistic floor to be commissioned. If SB693 applies to your application, budget $20 more for the assessment fee.",
    },
    {
      q: "What is the difference between a Texas notary bond and notary E&O insurance?",
      a: "The notary bond protects the public; errors & omissions insurance protects you, the notary. Texas requires the $10,000 bond before it will commission you — if someone is harmed by your notarial error they claim against the bond, the surety pays them up to $10,000, and the surety then has the right to seek that money back from you personally. E&O is optional, is not required by Texas, and is the coverage that pays your own defense costs and settlements so you are not personally out of pocket.",
    },
    {
      q: "Does the bond protect me if I make a mistake?",
      a: "No, and this is the single most costly misunderstanding in Texas notary work. If a claim is paid from your bond, the surety pays the harmed party and then has the right to come to you for reimbursement of what it paid. Having a bond does not mean you are insured. E&O insurance is the product that protects you.",
    },
    {
      q: "Is E&O insurance required in Texas?",
      a: "No. Texas requires the bond only. E&O is optional. It is a business judgment about your own exposure, not a compliance step — nobody at the state will ask whether you have it.",
    },
    {
      q: "How long does a Texas notary bond last?",
      a: "It runs concurrent with your 4-year commission. There is no annual renewal and no annual premium. You buy a new bond when you renew your commission.",
    },
    {
      q: "What changed in 2026 for Texas notaries? (SB693)",
      a: "SB693 is a 2025 law. It took effect on September 1, 2025 and applies to notary applications submitted on or after January 1, 2026. Applicants must complete a 2-hour education course from the Texas Secretary of State and pass an assessment — the $20 is the assessment fee, and you can retake it up to three times within three months. The law also extended record retention to 10 years and created criminal penalties for improper notarizations. It did not change the commission term and it did not change the bond requirement.",
    },
    {
      q: "How do I file my notary bond with the state?",
      a: "You upload the executed bond through the Texas Secretary of State's SOS Portal Notary System along with your application and pay the $21 fee there. We send step-by-step instructions with every bond at no charge, and if the portal rejects something you can call us.",
    },
    {
      q: "Can I get a notary bond as a remote online notary (RON)?",
      a: "Yes — same $10,000 bond, no different product. RON authorization is a separate application you make to the Secretary of State after your notary commission is granted.",
    },
    {
      q: "Is there a credit check?",
      a: "No. Texas notary bonds are issued without a credit check. Anyone who meets the state's eligibility requirements can buy one.",
    },
    {
      q: "What happens if my commission lapses before I renew?",
      a: "You cannot legally notarize during the gap, and a lapsed commission means starting the application over rather than renewing. This is the failure mode we see most, which is why we run a free reminder service — look yourself up further down this page and we will email you 60 days before your expiry date.",
    },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────────
          The headline states the price the way it is actually paid. A visitor
          who arrives, reads "$50", buys, and then meets a $21 state fee at the
          SOS portal has been misled — and tells people so. */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs mb-6">
            <Shield className="w-3.5 h-3.5" />
            Texas Department of Insurance licensed agency #3480229
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
            Texas Notary Bond — $50 for the Full 4-Year Term
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl leading-relaxed">
            The $10,000 bond the Secretary of State requires before it will commission you.
            The state charges its own <strong className="text-white">$21 filing fee</strong> on top,
            so being commissioned costs <strong className="text-white">$71</strong>. We say so up front
            because you will meet that fee anyway.
          </p>

          {/* Price breakdown — the number nobody else on page one shows you. */}
          <div className="grid sm:grid-cols-3 gap-3 mb-8 max-w-2xl">
            {[
              { amt: "$50", label: "Bond premium", sub: "Whole 4-year term, paid to us" },
              { amt: "$21", label: "State filing fee", sub: "Paid to the TX SOS. Unavoidable." },
              { amt: "$71", label: "Commissioned", sub: "The realistic floor, all in", accent: true },
            ].map((c) => (
              <div
                key={c.label}
                className={`rounded-xl p-4 border ${c.accent ? "bg-white/15 border-white/40" : "bg-white/5 border-white/15"}`}
              >
                <p className="text-2xl font-bold">{c.amt}</p>
                <p className="text-sm font-semibold text-indigo-100">{c.label}</p>
                <p className="text-xs text-indigo-200/80 mt-1 leading-snug">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/get-bond?type=notary">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8 w-full sm:w-auto">
                Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 w-full sm:w-auto">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
          <p className="text-indigo-200 text-xs mt-4">
            No credit check · Checkout is open 24/7 · Texas only, so we only track one state's rules
          </p>
        </div>
      </section>

      {/* ── The 30-second answer ────────────────────────────────────────────
          Written for the reader who will not scroll. Everything below is
          elaboration on this box. */}

      {/* ── Transaction block ───────────────────────────────────────────────
          Added 2026-08-16 after a blind critic read: "a very good essay wearing
          the costume of a product page." It was right. The only CTA sat below
          ten city links, and the three facts that actually close a sale — no
          credit check, checkout always open, PDF emailed — were buried in step 3
          of section 5, doing no work.

          The page must be readable in eight seconds AND rewarding for eight
          minutes. Everything below this block serves the second job. This block
          is the entire first job. Do not push it down the page again. */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-indigo-600 bg-white shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-6 md:p-7">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Get your Texas notary bond
                </h2>
                <ul className="space-y-3">
                  {[
                    { t: "No credit check", d: "No underwriting, no questions about your finances. Eligibility is the state's list, not ours." },
                    { t: "Open 24/7", d: "Apply at 2am on a Sunday. You are not waiting for an office to open on Monday." },
                    { t: "Executed bond PDF emailed to you", d: "Typically within minutes — ready to upload to the SOS portal." },
                    { t: "Filing instructions included", d: "Free, with every bond. Call us if the portal rejects something." },
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
                    <span>TX state filing fee</span>
                    <span className="font-semibold text-gray-900">$21</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3 leading-snug">Paid to the SOS. Nobody can waive it.</p>
                  <div className="flex items-baseline justify-between border-t border-gray-300 pt-3">
                    <span className="text-sm font-semibold text-gray-900">Commissioned</span>
                    <span className="text-2xl font-bold text-indigo-700">$71</span>
                  </div>
                </div>
                <a href="/get-bond?type=notary" className="block">
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
        </div>
      </section>

      {/* ── The one line that matters ───────────────────────────────────────
          Stolen, deliberately, from the competitor that outranks us. Their one
          genuine advantage is compression: they reach "the notary bond DOES NOT
          protect the notary" in a single unmissable line, where we took four
          paragraphs to say it more accurately. Accuracy was never the problem.
          This is the emotional core of the page, so it gets typographic weight
          instead of word count — and our better explanation sits directly
          underneath for the reader who wants to know why. */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 md:p-8 text-center">
            <p className="text-xl md:text-3xl font-bold text-amber-950 leading-snug">
              Your notary bond does not protect you.<br className="hidden sm:block" /> It protects the public.
            </p>
            <p className="text-amber-900 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
              If a claim is paid from your bond, the surety can come after <em>you</em> for the money.
              Being bonded is not being covered.
            </p>
            <a href="#bond-vs-eo" className="inline-block mt-4 text-sm font-semibold text-amber-900 underline underline-offset-4">
              Here is exactly how that works ↓
            </a>
          </div>
        </div>
      </section>

      <section className="pb-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              If you read nothing else on this page
            </h2>
            <div className="space-y-3 text-[15px] text-gray-800 leading-relaxed">
              <p>
                Texas will not commission you as a notary until you file a <strong>$10,000 surety bond</strong>.
                The bond costs <strong>$50 for the full four years</strong> — not per year — and the Secretary of State
                adds a <strong>$21 filing fee</strong> you pay directly to the state. That is <strong>$71</strong>.
              </p>
              <p>
                The bond does <strong>not</strong> protect you. It protects the public. If your error costs somebody
                money, they claim on your bond, the surety pays them up to $10,000, and then the surety
                can come to you for that money back. <strong>Errors &amp; Omissions insurance</strong> is the separate,
                optional product that protects you. Texas does not require it and never asks about it.
              </p>
              <p>
                So: the bond is compliance, E&amp;O is protection. Most working notaries buy both —
                of our last {BOOK.count} Texas notary bonds, {BOOK.eoAttached} buyers added E&amp;O.
                But you are legally commissioned with the bond alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Question index ─────────────────────────────────────────────────
          The competing page that outranks us wins by owning the question set.
          This makes ours explicit and jumpable rather than making the reader
          scroll to find out whether we answer it. */}
      <section className="py-10 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">
              Every question a new Texas notary asks — answered on this page
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {QUESTIONS.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-start gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
              >
                <span className="text-indigo-400 font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-snug">{item.q}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 01. Cost ────────────────────────────────────────────────────── */}
      <section id="cost" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">01</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            What a Texas notary bond actually costs
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Four numbers. Two are fixed by the state, one is the market rate, one is your choice.
          </p>

          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {[
              {
                item: "Notary surety bond ($10,000, 4-year term)",
                amt: "$50",
                who: "Paid to us",
                note: "One payment covering the entire commission period. Not annual.",
                required: true,
              },
              {
                item: "Texas Secretary of State filing fee",
                amt: "$21",
                who: "Paid to the state",
                note: "Charged at the SOS portal. No provider can waive or discount it — if someone implies they can, that is a reason to leave.",
                required: true,
              },
              {
                item: "SB693 assessment fee",
                amt: "$20",
                who: "Paid to the state",
                note: "Applies to applications submitted on or after January 1, 2026. The course is 2 hours; the $20 is the assessment fee, retakeable up to three times within three months.",
                required: true,
              },
              {
                item: "Errors & Omissions insurance",
                amt: "Optional",
                who: "Your choice",
                note: `Not required by Texas. When our buyers add it, it has averaged ${BOOK.eoAvg} on the order.`,
                required: false,
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
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded ${row.required ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                  {row.required ? "REQUIRED" : "OPTIONAL"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Watch for "$50" quoted as the total.</strong> Several sites advertise the bond
              premium as though it were the cost of becoming a notary. It is not — the $21 state fee
              lands on you at the SOS portal regardless of who sold you the bond. Budget $71 minimum,
              $91 if you still owe the education course.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02. Bond vs E&O ─────────────────────────────────────────────────
          The competitor that outranks us has a SEPARATE page for this question
          holding its own first-page slot. We cede that entirely today. This
          section is the on-page answer; /bonds/notary-eo-insurance is the
          long-form page that targets the standalone query. */}
      <section id="bond-vs-eo" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">02</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Texas notary bond vs. E&amp;O insurance
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl leading-relaxed">
            This is the question that trips up almost every new Texas notary, and getting it
            wrong is expensive. In one line: <strong>the bond protects the public, and errors
            &amp; omissions insurance protects you.</strong> They are not versions of the same thing
            and one does not substitute for the other.
          </p>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <div className="border-2 border-indigo-200 rounded-2xl p-6 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-indigo-900">Notary Surety Bond</h3>
              </div>
              <span className="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded mb-4">REQUIRED BY TEXAS LAW</span>
              <ul className="space-y-2.5 text-sm text-gray-700">
                {[
                  ["Protects", "the public — anyone harmed by your notarial error"],
                  ["Amount", "$10,000, set by Texas statute, not by you"],
                  ["Cost", "$50 for the entire 4-year term"],
                  ["If a claim is paid", "the surety pays the claimant, then may seek that money back from you"],
                  ["Do you need it", "yes — you cannot be commissioned without it"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span><strong className="text-gray-900">{k}:</strong> {v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-teal-200 rounded-2xl p-6 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-teal-900">E&amp;O Insurance</h3>
              </div>
              <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded mb-4">OPTIONAL — NOT REQUIRED IN TEXAS</span>
              <ul className="space-y-2.5 text-sm text-gray-700">
                {[
                  ["Protects", "you personally, and your own money"],
                  ["Amount", "you choose the limit"],
                  ["Cost", `separate and variable — averaged ${BOOK.eoAvg} on our recent orders`],
                  ["If a claim is paid", "the insurer pays your defense and settlement; no reimbursement from you"],
                  ["Do you need it", "not to be commissioned. It is a judgment about your own exposure"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                    <span><strong className="text-gray-900">{k}:</strong> {v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The mechanism, walked through. Most competitor pages assert the
              distinction; almost none show how the money actually moves. */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Scale className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">What actually happens when there is a claim</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Say you notarize a signature without properly verifying identity, and the document
              turns out to be fraudulent. Someone loses $8,000. Here is where the money goes.
            </p>
            <div className="space-y-4">
              {[
                {
                  n: "1",
                  t: "The claimant files against your bond",
                  d: "Not against you directly. Your bond is a public record naming the surety, and that is who they pursue.",
                },
                {
                  n: "2",
                  t: "The surety investigates and, if the claim is valid, pays up to $10,000",
                  d: "The claimant is made whole. This is the entire purpose of the bond — the state wants the public covered, not you.",
                },
                {
                  n: "3",
                  t: "The surety then has the right to seek reimbursement from you",
                  d: "This is the part people do not expect. A surety bond is a guarantee, not insurance. You remain financially responsible for what the surety paid out on your behalf.",
                  warn: true,
                },
                {
                  n: "4",
                  t: "If you carry E&O, this is where it works",
                  d: "E&O responds to your own liability and legal defense costs for unintentional errors, up to your policy limit. Without it, step 3 is money out of your pocket.",
                  good: true,
                },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    s.warn ? "bg-red-100 text-red-700" : s.good ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-700"
                  }`}>{s.n}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{s.t}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">
                <strong>So "I'm bonded" does not mean "I'm covered."</strong> If you take one thing
                from this page, take that.
              </p>
            </div>
          </div>

          {/* Honest guidance including the case for NOT buying E&O. A page that
              recommends its own upsell to everyone reads as a sales page. */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Do you personally need E&amp;O?</h3>
            <div className="space-y-3">
              {[
                {
                  who: "Notary signing agents (loan closings, real estate)",
                  verdict: "Yes",
                  color: "red",
                  why: "You are handling deeds of trust and promissory notes. A single error touches a six-figure transaction. Look for limits of $100,000 or more, not the minimum.",
                },
                {
                  who: "Mobile notaries running their own business",
                  verdict: "Yes",
                  color: "red",
                  why: "No employer is standing behind you. Volume is high and the documents are unpredictable.",
                },
                {
                  who: "High-volume notaries (dozens a month)",
                  verdict: "Probably",
                  color: "amber",
                  why: "Your exposure scales with the number of signatures you witness, whoever employs you.",
                },
                {
                  who: "You notarize occasionally for your employer",
                  verdict: "Maybe not",
                  color: "green",
                  why: "Check first — many employers carry coverage that extends to notarizations you perform in the course of your job. If they do, buying your own may be duplicative. Ask before you spend.",
                },
              ].map((r) => (
                <div key={r.who} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">{r.who}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                      r.color === "red" ? "bg-red-100 text-red-700"
                        : r.color === "amber" ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}>{r.verdict.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.why}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/bonds/notary-eo-insurance">
                <Button variant="outline" className="w-full sm:w-auto">
                  Full guide: notary E&amp;O insurance in Texas <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="/get-bond?type=notary">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                  Start with the required bond <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03. Our own book ────────────────────────────────────────────────
          The single thing on this page no competitor can copy: what we actually
          charged. Published with the awkward parts intact — the mean sits above
          the median, and saying why is the whole point of publishing it. */}
      <section id="what-i-paid" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">03</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            What our last {BOOK.count} Texas notaries actually paid
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Every other page you will read today quotes a price. This is our order book instead —
            the real spread across the last {BOOK.count} Texas notary bonds we issued, including the
            optional coverage buyers chose to add. We have not found another Texas bond provider
            that publishes this.
          </p>

          {/* Order matters here. Leading with the median re-anchored price from
              $71 to $107.56 and read, to a suspicious buyer, as the upsell
              arriving in a lab coat. Same facts, honest order: the floor and the
              people who paid it come first. */}
          <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/50 p-6 mb-5">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {BOOK.count - BOOK.eoAttached} of {BOOK.count} paid {BOOK.min}.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              The bond and the state fee, nothing else added. They are fully and validly
              commissioned Texas notaries — identical bond, identical legal standing to everyone
              else on this list. <strong>{BOOK.min} is a complete answer</strong>, and if that is
              all you want, that is all you need to buy.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-5">
            <p className="text-lg font-bold text-gray-900 mb-2">
              The other {BOOK.eoAttached} chose to add E&amp;O, averaging {BOOK.eoAvg}.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Optional coverage, bought by people who decided the bond alone did not protect them
              enough — which, as the box above explains, it does not. That choice is the only
              reason any order here costs more than {BOOK.min}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { v: BOOK.min, l: "Lowest", s: "Bond + state fee, nothing added", accent: true },
              { v: BOOK.median, l: "Median", s: "Typical, most added E&O" },
              { v: BOOK.max, l: "Highest", s: "Higher E&O limits chosen" },
            ].map((s) => (
              <div key={s.l} className={`rounded-xl p-4 text-center border ${s.accent ? "bg-teal-50 border-teal-200" : "bg-gray-50 border-gray-200"}`}>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{s.v}</p>
                <p className="text-xs font-semibold text-gray-700 mt-1">{s.l}</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">{s.s}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Do not read the median as the price.</strong> The
              price is {BOOK.min}. The median order is {BOOK.median} only because most buyers
              added optional cover on top of it. And the {BOOK.eoAvg} average E&amp;O add sits
              above what a typical buyer spends, because a handful of signing agents bought high
              limits and pulled it up — the same reason the top of the range reaches {BOOK.max}.
            </p>
            <p className="text-xs text-gray-500 border-t border-gray-200 pt-4">
              Basis: the last {BOOK.count} Texas notary bonds issued by Quantum Surety, measured
              August 2026. Totals include the $21 Texas Secretary of State filing fee. A sample of{" "}
              {BOOK.count} is our whole recent book, not a survey — treat it as what we see, not as
              a statewide statistic.
            </p>
          </div>
        </div>
      </section>

      {/* ── 04. Price honesty ───────────────────────────────────────────────
          We match the market, we do not beat it. Saying so is a stronger trust
          play than a "lowest price" badge, and unlike the badge it is true. */}
      <section id="price-honesty" className="py-16 px-4 bg-indigo-50/50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">04</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Is $50 a good price? It is the going rate — and we will not pretend otherwise
          </h2>
          <div className="space-y-4 text-[15px] text-gray-800 leading-relaxed">
            <p>
              $50 for the full four-year term is the standard market price for a Texas notary bond.
              When we last checked in {PRICE_CHECK_DATE}, SuretyBonds.com, the National Notary
              Association and BondExchange were all charging it. We charge it too.{" "}
              <strong>We are not cheaper than the market and we do not claim to be.</strong>{" "}
              <span className="text-gray-600">
                (Their prices are theirs to change — if you are reading this long after{" "}
                {PRICE_CHECK_DATE}, check for yourself rather than take our word for it.)
              </span>
            </p>
            <p>
              This matters because the notary bond is a commodity: the coverage amount is set by
              statute, the form is set by the state, and the bond you file is legally identical
              whoever sells it to you. Anyone advertising a dramatically lower price is either
              excluding the $21 state fee from the comparison, or selling you something and
              recovering it elsewhere.
            </p>
            <p>
              So price is not the reason to choose a provider on this one. What actually differs is
              how fast you get the document, whether a human answers when the SOS portal rejects
              your filing, and whether anyone tells you before your commission lapses in four years.
              Those are the things we compete on, and they are all further down this page.
            </p>
          </div>
        </div>
      </section>

      {/* ── 05. Steps ───────────────────────────────────────────────────── */}
      <section id="steps" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">05</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            The full order of operations
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Most pages show you a three-step checkout. This is the whole sequence, including the
            parts that happen at the state and not with us — because doing them out of order is
            what causes rejected applications.
          </p>
          <ol className="space-y-5">
            {[
              {
                t: "Confirm you are eligible",
                d: "18 or older, a Texas resident, no felony conviction or crime of moral turpitude. The state checks this; there is no point buying a bond first if you will not clear it.",
                us: false,
              },
              {
                t: "Complete the SB693 course and assessment",
                d: "A 2-hour course through the Texas Secretary of State, followed by an assessment. The $20 is the assessment fee and you can retake it up to three times within three months. Applies to applications submitted on or after January 1, 2026.",
                us: false,
              },
              {
                t: "Buy your $10,000 notary bond",
                d: "This is our part. No credit check, no underwriting questions, and the checkout is open at 2am on a Sunday. Your executed bond PDF is emailed to you.",
                us: true,
              },
              {
                t: "File the bond with your application at the SOS portal",
                d: "Upload the bond through the Texas SOS Portal Notary System with your application and pay the $21 filing fee there. We send written instructions with every bond, and if the portal rejects something you can call us at (214) 666-8718 rather than starting a support ticket.",
                us: true,
              },
              {
                t: "Receive your commission and order your seal",
                d: "The Secretary of State issues the commission. Your seal must show your name as commissioned and your expiry date — order it after you have the commission, not before, or you may be ordering the wrong date.",
                us: false,
              },
              {
                t: "Record your expiry date somewhere you will actually see it",
                d: "Four years is long enough to forget. A lapsed commission cannot be renewed — you start the application over. Our free reminder service below exists because this is the failure we see most often.",
                us: true,
              },
            ].map((s, i) => (
              <li key={s.t} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900">{s.t}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${s.us ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                      {s.us ? "WE HELP" : "AT THE STATE"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <a href="/get-bond?type=notary">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                Get My Notary Bond — $50 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <p className="text-xs text-gray-500 mt-2">Plus the state's $21 filing fee, paid to the SOS at the portal.</p>
          </div>
        </div>
      </section>

      {/* ── 06. Requirements table ─────────────────────────────────────── */}
      <section id="requirements" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">06</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Texas notary commission requirements (2026)
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {[
              { label: "Bond amount", value: "$10,000" },
              { label: "Bond term", value: "4 years, concurrent with your commission" },
              { label: "Bond premium", value: "$50 for the full term (not annual)" },
              { label: "State filing fee", value: "$21, paid to the Secretary of State" },
              { label: "Minimum to be commissioned", value: "$71" },
              { label: "Education (SB693)", value: "2-hour TX SOS course + assessment, $20 assessment fee" },
              { label: "Minimum age", value: "18" },
              { label: "Residency", value: "Texas resident" },
              { label: "Criminal record", value: "No felony conviction or crime of moral turpitude" },
              { label: "Record retention", value: "10 years from date of notarization (new for 2026)" },
              { label: "E&O insurance", value: "Not required by Texas" },
              { label: "Credit check", value: "None" },
              { label: "Where you file", value: "Texas SOS Portal Notary System" },
            ].map((row, i) => (
              <div key={row.label} className={`flex items-start gap-4 px-5 py-3.5 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/70"}`}>
                <span className="w-1/2 text-sm text-gray-600">{row.label}</span>
                <span className="w-1/2 text-sm font-semibold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07. SB693 ──────────────────────────────────────────────────── */}
      <section id="sb693" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">07</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            What SB693 changed for Texas notaries
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900 leading-relaxed space-y-2">
                <p className="font-semibold">A 2025 law that bites on your 2026 application</p>
                <p>
                  Senate Bill 693 took effect on <strong>September 1, 2025</strong> and applies to
                  notary applications submitted <strong>on or after January 1, 2026</strong>. It
                  added a mandatory <strong>2-hour education course</strong> from the Texas
                  Secretary of State followed by an assessment. The <strong>$20 is the assessment
                  fee</strong>, not a course fee — and if you do not pass, you can retake it up to
                  three times within three months.
                </p>
                <p>
                  It also extended record retention to <strong>10 years</strong> from the date of
                  notarization, and created criminal penalties for improper notarizations.
                </p>
                <p>
                  <strong>SB693 did not change your commission term and did not change your
                  bond.</strong> Still a $10,000 bond, still the 4-year term, still $50. If a
                  provider is charging you more and citing SB693 as the reason, that is not what
                  the bill did.
                </p>
              </div>
            </div>
          </div>
          <Link href="/sb-693-notary-bond-requirements-2026">
            <Button variant="outline">
              Full SB693 breakdown <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── 08. Verification portal + renewal capture ──────────────────────
          The genuinely uncopyable asset. Nothing on the current first page of
          results for this term offers a public record lookup at all. */}
      <section id="verify" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">08</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Look up any Texas notary — including yourself — free
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl leading-relaxed">
            We run a public bond verification portal covering <strong>{PORTAL_RECORDS} Texas notary
            records</strong> sourced from the Secretary of State. No account, no payment, no
            obligation to buy anything from us. Use it to confirm your own commission status and
            expiry date, or to check a notary before you rely on their seal.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
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
              <p className="text-sm text-gray-600">Search {PORTAL_RECORDS} Texas notary records by name or city.</p>
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

          <NotaryRenewalAlert
            heading="Not buying today? Find out exactly when your commission expires."
            blurb="Look up your Texas commission below and we'll email you a free reminder 60 days before it expires — so you never end up unable to notarize while you wait on paperwork. A lapsed commission cannot be renewed; you start over."
          />
        </div>
      </section>

      {/* ── 09. Who we are ──────────────────────────────────────────────── */}
      <section id="who-we-are" className="py-16 px-4 bg-white scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-indigo-500 mb-2">09</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Who you are buying from
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                icon: <Shield className="w-5 h-5 text-indigo-600" />,
                t: "Licensed in Texas",
                d: "Quantum Surety Bonds is a Texas Department of Insurance licensed agency, license #3480229. You can verify that with the TDI directly.",
              },
              {
                icon: <FileText className="w-5 h-5 text-indigo-600" />,
                t: "Texas only",
                d: "We do not sell in fifty states. One state's statute, one set of forms, one SOS portal to know. That is the whole reason we can answer a filing question on the phone.",
              },
              {
                icon: <Clock className="w-5 h-5 text-indigo-600" />,
                t: "Checkout open 24/7",
                d: "The bond application does not keep business hours. Your executed bond PDF is emailed to you — you are not waiting for an office to open on Monday.",
              },
              {
                icon: <Phone className="w-5 h-5 text-indigo-600" />,
                t: "A real number",
                d: "(214) 666-8718 reaches us, including after your purchase when the SOS portal is the thing giving you trouble.",
              },
            ].map((c) => (
              <div key={c.t} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  {c.icon}
                  <p className="font-semibold text-gray-900">{c.t}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
            <strong className="text-gray-900">What we are not:</strong> we are not the biggest notary
            supplier in the country and we do not sell seals, stamps, journals or training. If you
            want a single vendor for all of that, the national associations do it well. We do Texas
            bonds, the filing that follows, and the record-keeping that keeps you from lapsing.
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 px-4 bg-gray-50 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Texas notary bond — frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Removed 2026-08-16: a "Notary Bonds in Neighboring States" block linking
          to /bonds/notary-bond-{oklahoma,louisiana,arkansas,new-mexico}. None of
          those routes exist — App.tsx falls through to CityBondPage, whose slug
          parser does not match them, so all four rendered "Page not found" on the
          site's highest-traffic page. It also contradicted the Texas-only
          positioning that is the actual differentiator. Do not restore it without
          building the pages first. */}

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Get your Texas notary bond</h2>
          <p className="text-indigo-200 mb-2">
            $10,000 bond · $50 for the full 4-year term · no credit check
          </p>
          <p className="text-indigo-300 text-sm mb-8">
            Plus the Texas Secretary of State's $21 filing fee, paid to the state at the portal. $71 commissioned.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/get-bond?type=notary">
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
            Quantum Surety Bonds · Texas Department of Insurance licensed agency #3480229
          </p>
        </div>
      </section>

      {/* ── City links, demoted to a footer strip ───────────────────────────
          Moved here 2026-08-16. These were a ten-card grid sitting BETWEEN the
          FAQ and the only call to action, which a blind critic correctly called
          "the exact structural tell of a content farm." The links are worth
          keeping for internal linking; they are not worth standing between a
          decided buyer and the button. Do not promote them back up the page. */}
      <section className="py-8 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-500 mb-2">
            Texas notary bond by city — the bond, the price and the requirements are identical
            statewide; these pages carry local commission counts and county filing detail.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {[
              { city: "Dallas", slug: "notary-bond-dallas" },
              { city: "Houston", slug: "notary-bond-houston" },
              { city: "San Antonio", slug: "notary-bond-san-antonio" },
              { city: "Austin", slug: "notary-bond-austin" },
              { city: "Fort Worth", slug: "notary-bond-fort-worth" },
              { city: "El Paso", slug: "notary-bond-el-paso" },
              { city: "Arlington", slug: "notary-bond-arlington" },
              { city: "Plano", slug: "notary-bond-plano" },
              { city: "Corpus Christi", slug: "notary-bond-corpus-christi" },
              { city: "Lubbock", slug: "notary-bond-lubbock" },
            ].map((c, i, arr) => (
              <span key={c.city}>
                <Link href={`/bonds/${c.slug}`}>
                  <span className="text-indigo-600 hover:underline cursor-pointer">{c.city}</span>
                </Link>
                {i < arr.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

    </div>
  );
}
