import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Car,
  Clock,
  ArrowRight,
  Shield,
  XCircle,
} from "lucide-react";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I register a car in Texas if I don't have the title?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not directly — you cannot register a vehicle in Texas without a title or an active title application. However, you can get a bonded title, which allows you to register and drive the vehicle legally. The bonded title process takes 2–6 weeks and starts with submitting Form VTR-130-SOF to TxDMV.",
      },
    },
    {
      "@type": "Question",
      name: "What if the person I bought the car from won't give me a title?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If the seller refuses to cooperate or is unreachable, you have two main options: (1) file a complaint with TxDMV and pursue a bonded title through the standard process, or (2) if the seller gave you a signed bill of sale, TxDMV may accept it as supporting documentation. Either way, a bonded title is typically your path to legal ownership.",
      },
    },
    {
      "@type": "Question",
      name: "Is it illegal to buy a car without a title in Texas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Buying a car without a title is not illegal in Texas, but you cannot legally register or drive it until you obtain a title. The issue is on the registration side, not the sale itself. A bill of sale provides some ownership evidence, but it is not a substitute for a title.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know if the car I bought without a title is stolen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Run the VIN through the National Motor Vehicle Title Information System (NMVTIS) or ask your county tax office to run a title search before you pursue a bonded title. If the vehicle comes back as reported stolen, you cannot get a bonded title and should contact local law enforcement.",
      },
    },
    {
      "@type": "Question",
      name: "Can I sell a car I bought without a title in Texas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You cannot legally sell a vehicle in Texas without transferring a title. Once you obtain a bonded title, you technically can sell the vehicle, but buyers are typically reluctant to purchase a car with a bond notation. The best approach is to wait the full 3 years for the bond notation to be removed and sell with a clean title.",
      },
    },
  ],
};

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Bought a Car With No Title in Texas? Here's Your Legal Path to Ownership (2026)",
  description:
    "Bought a car in Texas without a title? Learn your 3 legal options, what to check before taking action, and how to get a bonded title to register and drive your vehicle.",
  datePublished: "2026-06-05",
  dateModified: "2026-06-05",
  author: {
    "@type": "Organization",
    name: "Quantum Surety",
    url: "https://quantumsurety.bond",
  },
  publisher: {
    "@type": "Organization",
    name: "Quantum Surety",
    url: "https://quantumsurety.bond",
  },
};

export default function BoughtCarNoTitleTexas() {
  useSEO({
    title:
      "Bought a Car With No Title in Texas? Your Legal Path to Ownership 2026 | Quantum Surety",
    description:
      "Bought a car without a title in Texas? Learn your 3 legal options, what to check first to avoid problems, and how a bonded title lets you register and drive legally.",
    canonical: "/blog/bought-car-no-title-texas-bonded-title",
    ogType: "article",
  });
  useSchema(FAQ_SCHEMA);
  useSchema(ARTICLE_SCHEMA);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-teal-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-teal-300 text-sm mb-4">
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span>Texas Vehicle Titles</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Bought a Car With No Title in Texas? Here's How to Fix It
          </h1>
          <p className="text-indigo-100 text-lg mb-6">
            A bonded title is the legal route to owning and registering a
            vehicle in Texas when the seller couldn't provide a title. Here's
            the complete process.
          </p>
          <div className="flex items-center gap-4 text-sm text-indigo-300 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> 7 min read
            </span>
            <span>June 5, 2026</span>
            <span className="bg-teal-700 text-teal-100 px-3 py-1 rounded-full text-xs font-semibold">
              Texas Vehicle Titles
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Intro */}
        <p className="text-gray-700 leading-relaxed mb-4 text-lg">
          It happens more than you'd think. You find a great deal on a used car,
          hand over the cash, and the seller says something like "I lost the
          title but I can get you a duplicate" — and then never does. Or you
          inherit grandpa's truck and realize there's no title anywhere in the
          house. Or you buy an old project car from someone who's been sitting
          on it for years.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          Whatever the reason, you're now stuck with a vehicle you can't legally
          register or drive in Texas. The good news: Texas has a legal process
          specifically for this — the <strong>bonded title</strong> — and it's
          more affordable and accessible than most people expect.
        </p>

        {/* Why it happens */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Why This Happens: Common No-Title Situations
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          There's no single profile for a "no title" vehicle. These are the most
          common scenarios that lead Texans to the bonded title process:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            {
              icon: <Car className="w-5 h-5 text-indigo-600" />,
              title: "Private Sale Gone Wrong",
              desc: "Seller claimed the title was lost, gave only a bill of sale, or said they'd mail it later and never did.",
            },
            {
              icon: <FileText className="w-5 h-5 text-indigo-600" />,
              title: "Inherited Vehicle",
              desc: "Received a vehicle from a deceased family member without the title being transferred, and probate was never opened.",
            },
            {
              icon: <Shield className="w-5 h-5 text-indigo-600" />,
              title: "Auction Purchase",
              desc: "Bought at a storage unit auction, estate sale, or repo auction and received only an auction receipt — not a title.",
            },
            {
              icon: <AlertCircle className="w-5 h-5 text-indigo-600" />,
              title: "Old / Classic Vehicle",
              desc: "Bought a vintage car or project truck that hasn't had a title in years; previous owner chain is broken or unknown.",
            },
            {
              icon: <XCircle className="w-5 h-5 text-indigo-600" />,
              title: "Dealer Out of Business",
              desc: "Bought from a dealer that went out of business before processing the title transfer to your name.",
            },
            {
              icon: <Shield className="w-5 h-5 text-indigo-600" />,
              title: "Lien Never Released",
              desc: "Loan was paid off but the finance company closed or refuses to release the lien, blocking a clean title.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <p className="font-semibold text-gray-800 text-sm">
                  {item.title}
                </p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 3 Questions to ask first */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          3 Critical Questions to Ask Before You Do Anything
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Before you start the bonded title process — or buy a car without a
          title — you need answers to these three questions. Getting them wrong
          can cost you time, money, or worse.
        </p>
        <div className="space-y-4 mb-6">
          <div className="bg-white border-l-4 border-red-400 rounded-xl p-5 shadow-sm">
            <p className="font-bold text-gray-900 mb-2">
              1. Is the vehicle stolen?
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Run the VIN through{" "}
              <a
                href="https://www.vehiclehistory.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                NMVTIS (vehiclehistory.gov) ↗
              </a>{" "}
              or ask your county tax office to run a title search. A stolen
              vehicle will not qualify for a bonded title, and you could face
              criminal liability if you knowingly possess one.
            </p>
            <div className="bg-red-50 rounded-lg px-4 py-3 text-sm text-red-800">
              <strong>If stolen:</strong> Do not proceed with bonded title.
              Contact local law enforcement.
            </div>
          </div>
          <div className="bg-white border-l-4 border-amber-400 rounded-xl p-5 shadow-sm">
            <p className="font-bold text-gray-900 mb-2">
              2. Is there an active lien on the vehicle?
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              A title search will also reveal whether there's a recorded lien. If
              a lender has an active, unpaid lien on the vehicle, the bonded
              title process is more complicated — TxDMV may require you to
              satisfy the lien first, or the lienholder may need to be listed on
              the bond.
            </p>
            <div className="bg-amber-50 rounded-lg px-4 py-3 text-sm text-amber-800">
              <strong>If active lien:</strong> Speak with TxDMV first. May
              complicate or block the bonded title process.
            </div>
          </div>
          <div className="bg-white border-l-4 border-green-400 rounded-xl p-5 shadow-sm">
            <p className="font-bold text-gray-900 mb-2">
              3. Is the title out of state or out of country?
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              If the vehicle was last titled in another state, you may be able
              to obtain a duplicate title from that state's DMV rather than
              going through the bonded title process in Texas. This is often
              faster. However, if that's not possible, a Texas bonded title is
              still available.
            </p>
            <div className="bg-green-50 rounded-lg px-4 py-3 text-sm text-green-800">
              <strong>If out-of-state:</strong> Try duplicate title from prior
              state first. If unavailable, proceed with Texas bonded title.
            </div>
          </div>
        </div>

        {/* Your 3 options */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Your 3 Legal Options When You Bought a Car Without a Title
        </h2>

        {/* Option 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="bg-green-100 text-green-700 font-bold text-sm rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              1
            </span>
            <div>
              <p className="font-bold text-gray-900 mb-1">
                Get the Seller to Provide a Duplicate Title — Easiest, But Not
                Always Possible
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                In Texas, any registered owner can apply for a duplicate title
                using Form VTR-34 (Application for a Certified Copy of Title)
                at their county tax office. The fee is $2. If you can reach the
                seller and they're cooperative, this is by far the fastest path
                — they apply for a duplicate, sign it over to you, and you
                transfer title normally.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <strong>Works best when:</strong> Seller is reachable,
                cooperative, and the title was truly lost — not never issued or
                lien-encumbered.
              </div>
            </div>
          </div>
        </div>

        {/* Option 2 */}
        <div className="bg-white border border-indigo-200 rounded-xl p-6 mb-4 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="bg-indigo-100 text-indigo-700 font-bold text-sm rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              2
            </span>
            <div>
              <p className="font-bold text-gray-900 mb-1">
                Bonded Title — The Standard Legal Route (Most Common Solution)
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                When the duplicate title route isn't available, the bonded title
                is the standard legal process in Texas. You submit a Statement of
                Facts (VTR-130-SOF) to TxDMV, get approved, obtain a surety
                bond from a TDI-licensed agency like Quantum Surety, and file
                for the title at your county tax office. Takes 2–6 weeks total.
                Bond premium starts at $50.
              </p>
              <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">
                <strong>Works best when:</strong> Seller is uncooperative or
                unreachable, vehicle was inherited, title was never issued or is
                otherwise unavailable.
              </div>
            </div>
          </div>
        </div>

        {/* Option 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="bg-amber-100 text-amber-700 font-bold text-sm rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              3
            </span>
            <div>
              <p className="font-bold text-gray-900 mb-1">
                Mechanic's Lien — Specific to Vehicles with Unpaid Repair Bills
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                If you are a mechanic or repair shop that performed work on a
                vehicle and the owner never paid or never returned to claim the
                vehicle, Texas Transportation Code allows you to obtain title
                through a mechanic's lien process (Form VTR-265). This is not
                applicable to standard private purchases.
              </p>
              <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-700">
                <strong>Works best when:</strong> You're a licensed mechanic or
                storage facility with an abandoned vehicle — not for typical
                private buyers.
              </div>
            </div>
          </div>
        </div>

        {/* Bonded title process simple */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          The Bonded Title Process in 6 Steps
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Here's the simplified version of the bonded title process. For a full
          walkthrough with every document listed, see our{" "}
          <Link
            href="/bonds/bonded-title-texas"
            className="text-indigo-600 hover:text-indigo-800 underline font-medium"
          >
            complete Texas bonded title guide
          </Link>
          .
        </p>
        <ol className="space-y-3 mb-6">
          {[
            {
              step: "1",
              title: "Complete Form VTR-130-SOF",
              desc: "Download the Statement of Facts from txdmv.gov, fill it out with the VIN, vehicle info, and how you obtained it. Attach your bill of sale or other proof.",
            },
            {
              step: "2",
              title: "Submit to TxDMV for title determination",
              desc: "File VTR-130-SOF at your regional TxDMV office with the $15 fee. TxDMV reviews and sends you a determination letter (2–4 weeks).",
            },
            {
              step: "3",
              title: "Get your surety bond from Quantum Surety",
              desc: "TxDMV's letter specifies the required bond amount. Apply with Quantum Surety — same-day approval, no credit check, bond starts at $50. You receive the bond certificate (VTR-130-SB format) digitally.",
            },
            {
              step: "4",
              title: "File at your county tax office",
              desc: "Bring your determination letter, bond certificate, Form 130-U (Application for Texas Title), proof of ID, and payment for county fees.",
            },
            {
              step: "5",
              title: "Receive your bonded title",
              desc: "TxDMV mails your bonded title within 2–3 weeks. You can now register the vehicle and drive legally.",
            },
            {
              step: "6",
              title: "After 3 years: get your clean title",
              desc: "If no one makes a valid claim on the bond within 3 years, apply for a clean title using Form VTR-34. The bond notation is removed and you have a standard Texas title.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.step}
              </span>
              <div>
                <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Title Rescue CTA */}
        <div className="bg-teal-700 rounded-xl p-6 mb-6 text-white">
          <p className="font-bold text-lg mb-2">
            Not sure which option applies to your situation?
          </p>
          <p className="text-teal-100 text-sm mb-4">
            Answer 5 quick questions in the Texas Title Rescue Wizard. It checks
            your eligibility, identifies your path, and generates a personalized
            document checklist — free, no login required.
          </p>
          <Link href="/texas-title-rescue">
            <button className="bg-white text-teal-800 font-semibold px-6 py-2 rounded-lg hover:bg-teal-50 transition-colors text-sm">
              Use the Title Rescue Wizard{" "}
              <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </Link>
        </div>

        {/* What you can and can't do */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          What You Can (and Cannot) Do With a Texas Bonded Title
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Once you have your bonded title, life gets much more normal — but
          there are still some restrictions to know about during the 3-year
          bonded period.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> You CAN:
            </p>
            <ul className="space-y-2 text-green-700 text-sm">
              {[
                "Register the vehicle with Texas plates",
                "Drive it legally on public roads",
                "Obtain auto insurance (most insurers will write it)",
                "Pass the Texas annual safety inspection",
                "Renew registration annually",
                "Transfer plates from another vehicle",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="font-bold text-amber-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Restrictions:
            </p>
            <ul className="space-y-2 text-amber-700 text-sm">
              {[
                "Selling is difficult — buyers wary of bond notation",
                "Most banks won't accept as loan collateral",
                "Dealer trade-ins typically refused",
                "Title visibly marked with bond notation",
                "RV parks and border crossings may ask questions",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warning box */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-2">
                Red Flags: When a Bonded Title Won't Work
              </p>
              <p className="text-amber-800 text-sm leading-relaxed mb-3">
                A bonded title is not available in every situation. TxDMV will
                deny your application if:
              </p>
              <ul className="space-y-1 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  The vehicle has been reported stolen (NMVTIS hit)
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  There is an active, unresolved lien on the vehicle
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  The VIN has been altered or is unverifiable
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  The vehicle has an active stop or hold placed by law enforcement
                </li>
              </ul>
              <p className="text-amber-700 text-sm mt-3">
                Always run a title search and NMVTIS check before investing time
                in the bonded title process.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 mb-10">
          {[
            {
              q: "Can I register a car in Texas if I don't have the title?",
              a: "No — Texas requires a title or active title application to register a vehicle. However, obtaining a bonded title gives you a legal path to registration. The bonded title process takes 2–6 weeks and starts with Form VTR-130-SOF submitted to TxDMV.",
            },
            {
              q: "What if the person I bought the car from won't give me a title?",
              a: "If the seller is uncooperative or unreachable, the bonded title process is your solution. You don't need the seller's cooperation to get a bonded title — TxDMV evaluates your application based on the documentation you can provide, including any bill of sale or purchase receipt.",
            },
            {
              q: "Is it illegal to buy a car without a title in Texas?",
              a: "The purchase itself isn't illegal, but you cannot legally register or drive the vehicle on public roads until you have a title. Buying without a title is risky — always run a title search before any purchase to check for liens, salvage history, or theft reports.",
            },
            {
              q: "How do I know if the car I bought without a title is stolen?",
              a: "Run the VIN through NMVTIS (vehiclehistory.gov) or ask your county tax assessor-collector to run a title search. This is the single most important step before pursuing a bonded title. If the vehicle is stolen, stop and contact law enforcement.",
            },
            {
              q: "Can I sell a car I bought without a title in Texas?",
              a: "Once you have a bonded title, you can technically sell the vehicle, but buyers are wary of the bond notation. Most private buyers, dealers, and lenders avoid bonded titles. The ideal approach: get the bonded title, drive it for 3 years, convert to a clean title, then sell.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Related links */}
        <div className="bg-gray-100 rounded-xl p-6 mb-10">
          <p className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Related Resources
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/texas-title-rescue"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Texas Title Rescue Wizard — Free 5-step eligibility check
              </Link>
            </li>
            <li>
              <Link
                href="/bonds/bonded-title-texas"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Texas Bonded Title Complete Guide
              </Link>
            </li>
            <li>
              <Link
                href="/title-bond-calculator"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Texas Title Bond Cost Calculator
              </Link>
            </li>
            <li>
              <a
                href="https://www.txdmv.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                TxDMV Official — Forms VTR-130-SOF, VTR-34 ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.vehiclehistory.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                NMVTIS Vehicle History Check ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="bg-indigo-900 rounded-2xl p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-3">
            Ready to Get Your Texas Title Bond?
          </h2>
          <p className="text-indigo-200 mb-6">
            Same-day issue. No credit check. TDI-licensed Texas agency
            #3480229.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/texas-title-rescue">
              <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
                Check My Eligibility{" "}
                <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </Link>
            <a
              href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-teal-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-400 transition-colors">
                Apply Directly <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
