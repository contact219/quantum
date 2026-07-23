import { Link } from "wouter";
import { BlogAuthor } from "@/components/BlogAuthor";
import { useSEO, useSchema } from "@/hooks/useSEO";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Car,
  Clock,
  ArrowRight,
  Shield,
  Calculator,
} from "lucide-react";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a Texas title bond cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Texas title bonds start at $50 from Quantum Surety. The premium is based on the required bond amount, which equals 1.5 times TxDMV's appraised vehicle value. Vehicles valued at $3,334 or less still require the $5,000 minimum bond, and Quantum Surety's minimum premium is $50 regardless.",
      },
    },
    {
      "@type": "Question",
      name: "Why does TxDMV require a bond at 1.5 times vehicle value?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 1.5x multiplier ensures that if someone makes a valid claim on the vehicle during the 3-year bonded period, the bond provides enough coverage to compensate them for the vehicle's full value plus any incidental costs. It's a consumer protection measure built into Texas Transportation Code.",
      },
    },
    {
      "@type": "Question",
      name: "How does TxDMV determine my vehicle's value for the bond?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TxDMV assigns a value based on published guides such as NADA or Kelley Blue Book, adjusted for the vehicle's condition. They determine this value during their review of your VTR-130-SOF application. You do not get to choose the value yourself.",
      },
    },
    {
      "@type": "Question",
      name: "Are there other fees besides the bond premium?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. In addition to the bond premium, you'll pay a $15 TxDMV application fee (VTR-130-SOF), a state title fee of approximately $28–33 (Form 130-U), and county registration fees which vary by county and vehicle weight, typically $50–$100. Total costs for most vehicles are $140–$220.",
      },
    },
    {
      "@type": "Question",
      name: "Does my credit score affect the cost of a Texas title bond?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Quantum Surety does not run a credit check for Texas certificate of title bonds. The pricing is flat-rate based solely on the required bond amount. Your credit history has no effect on approval or cost.",
      },
    },
  ],
};

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "How Much Does a Texas Certificate of Title Bond Cost? (2026 Pricing)",
  description:
    "Texas title bond cost explained: the 1.5x rule, example prices for common vehicle values, and why most bonds start at $50 from Quantum Surety. No credit check.",
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

export default function TexasTitleBondCost2026() {
  useSEO({
    title:
      "How Much Does a Texas Certificate of Title Bond Cost? 2026 Pricing | Quantum Surety",
    description:
      "Texas title bond cost guide: the 1.5x rule, pricing examples for common vehicle values, total cost breakdown, and why most title bonds start at $50. No credit check.",
    canonical: "/blog/texas-certificate-of-title-bond-cost",
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
            Texas Certificate of Title Bond Cost: 2026 Pricing Guide
          </h1>
          <p className="text-indigo-100 text-lg mb-6">
            The 1.5x rule explained, example costs for common vehicle values,
            and why most Texas title bonds start at just $50 from Quantum
            Surety.
          </p>
          <div className="flex items-center gap-4 text-sm text-indigo-300 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> 6 min read
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
          One of the first questions Texans ask when they find out they need a
          bonded title is: <em>"How much is this going to cost me?"</em> The
          answer depends on your vehicle's value — but for most common cars and
          trucks, the surety bond premium alone is surprisingly affordable,
          starting at just $50.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          In this guide we break down exactly how TxDMV calculates the required
          bond amount, show you a full pricing table, and walk through everything
          that goes into the total cost of getting a Texas bonded title.
        </p>

        {/* The 1.5x rule */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          The 1.5x Rule: How TxDMV Calculates Your Required Bond Amount
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Texas law (Transportation Code §501.053) requires that the certificate
          of title bond be set at{" "}
          <strong>1.5 times the appraised value of the vehicle</strong> as
          determined by TxDMV. This is not a rule you can negotiate — TxDMV
          assigns the value when they review your VTR-130-SOF application.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <Calculator className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 mb-2">
                The Formula
              </p>
              <p className="text-blue-800 text-base leading-relaxed font-mono bg-blue-100 rounded-lg p-3">
                Required Bond Amount = Vehicle Value × 1.5
              </p>
              <p className="text-blue-700 text-sm mt-3">
                <strong>Example:</strong> If TxDMV values your vehicle at
                $12,000, your required bond amount is $12,000 × 1.5 ={" "}
                <strong>$18,000</strong>. You then pay a premium (a percentage
                of the bond amount) to the surety company — not the full $18,000.
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          The minimum bond amount under Texas law is <strong>$5,000</strong>,
          regardless of vehicle value. So even if your vehicle is worth only
          $1,500, you still need a $5,000 bond. Quantum Surety's minimum premium
          is $50 for any bond up to $5,000.
        </p>

        {/* How vehicle value is determined */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          How TxDMV Determines Your Vehicle's Value
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          TxDMV doesn't send out an appraiser to inspect your car. Instead,
          they use published valuation guides — primarily{" "}
          <strong>NADA (National Automobile Dealers Association)</strong> and
          Kelley Blue Book — based on the year, make, model, and mileage you
          provide on Form VTR-130-SOF.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          TxDMV typically uses the vehicle's "average trade-in value" or a
          comparable figure from these guides. If your vehicle is older, a
          classic, or has significant modifications, the value determination may
          differ from online estimates. The value assigned appears in TxDMV's
          determination letter, along with the required bond amount.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">
                You Can't Choose Your Vehicle Value
              </p>
              <p className="text-amber-800 text-sm leading-relaxed">
                TxDMV assigns the vehicle value — you cannot select a lower
                number to reduce your bond amount. However, you can provide
                documentation of condition issues (salvage, flood damage, high
                mileage) that may reduce TxDMV's assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing table */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Texas Title Bond Cost Examples — 2026 Pricing Table
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Below are real-world examples showing the relationship between vehicle
          value, required bond amount, and Quantum Surety's flat-rate premium:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full bg-white border border-gray-200 rounded-xl text-sm shadow-sm">
            <thead>
              <tr className="bg-indigo-50">
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">
                  TxDMV Vehicle Value
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">
                  Required Bond Amount
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">
                  Quantum Surety Premium
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-700">$1,500</td>
                <td className="p-3 text-gray-700">$5,000 (min)</td>
                <td className="p-3 font-bold text-teal-700">$50</td>
                <td className="p-3 text-gray-500 text-xs">Min bond applies</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-3 text-gray-700">$3,334</td>
                <td className="p-3 text-gray-700">$5,001 → $5,000 min</td>
                <td className="p-3 font-bold text-teal-700">$50</td>
                <td className="p-3 text-gray-500 text-xs">
                  Tipping point for min bond
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-700">$5,000</td>
                <td className="p-3 text-gray-700">$7,500</td>
                <td className="p-3 font-bold text-teal-700">$50</td>
                <td className="p-3 text-gray-500 text-xs">
                  Still at minimum premium
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-3 text-gray-700">$8,000</td>
                <td className="p-3 text-gray-700">$12,000</td>
                <td className="p-3 font-bold text-teal-700">$60–75</td>
                <td className="p-3 text-gray-500 text-xs">
                  Rate scales with bond amount
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-700">$10,000</td>
                <td className="p-3 text-gray-700">$15,000</td>
                <td className="p-3 font-bold text-teal-700">$75–100</td>
                <td className="p-3 text-gray-500 text-xs">Common sedan range</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-3 text-gray-700">$15,000</td>
                <td className="p-3 text-gray-700">$22,500</td>
                <td className="p-3 font-bold text-teal-700">$112–150</td>
                <td className="p-3 text-gray-500 text-xs">
                  Mid-range truck/SUV
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-700">$20,000</td>
                <td className="p-3 text-gray-700">$30,000</td>
                <td className="p-3 font-bold text-teal-700">$150–200</td>
                <td className="p-3 text-gray-500 text-xs">
                  Higher-value vehicles
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 text-gray-700">$30,000+</td>
                <td className="p-3 text-gray-700">$45,000+</td>
                <td className="p-3 font-bold text-teal-700">Quote-based</td>
                <td className="p-3 text-gray-500 text-xs">
                  Call 214-666-8718
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm italic mb-6">
          Quantum Surety premiums shown are estimates. Use the calculator for
          your exact quote.
        </p>

        {/* Calculator CTA */}
        <div className="bg-teal-700 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <Calculator className="w-8 h-8 text-teal-200 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-lg mb-1">
                Free Texas Title Bond Calculator
              </p>
              <p className="text-teal-100 text-sm mb-4">
                Enter your vehicle's value (or decode by VIN) and instantly see
                your required bond amount and Quantum Surety's flat-rate premium.
                No login. No email required.
              </p>
              <Link href="/title-bond-calculator">
                <button className="bg-white text-teal-800 font-semibold px-6 py-2 rounded-lg hover:bg-teal-50 transition-colors text-sm">
                  Calculate My Bond Cost{" "}
                  <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Total cost breakdown */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Total Cost: Everything You'll Pay to Get a Texas Bonded Title
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The bond premium is just one piece of the total cost. Here is a
          complete breakdown of every fee involved in the bonded title process:
        </p>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="divide-y divide-gray-100">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    1. Surety Bond Premium
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Paid once to Quantum Surety. Covers the full 3-year bond
                    term. Not a recurring annual fee.
                  </p>
                </div>
                <span className="font-bold text-teal-700 ml-4">$50+</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    2. VTR-130-SOF Application Fee
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Paid to TxDMV when you submit your Statement of Facts.
                    Required to start the bonded title determination review.
                  </p>
                </div>
                <span className="font-bold text-gray-700 ml-4">$15</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    3. State Title Application Fee (Form 130-U)
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Paid at your county tax office when you file for the title.
                    This is the standard Texas title fee, same as any other
                    title transfer.
                  </p>
                </div>
                <span className="font-bold text-gray-700 ml-4">$28–33</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    4. County Registration Fees
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Varies by county and vehicle type. Includes registration fee,
                    local county road and bridge fees, and inspection fee. Ranges
                    from about $50 in rural counties to $100+ in metro counties.
                  </p>
                </div>
                <span className="font-bold text-gray-700 ml-4">$50–100+</span>
              </div>
            </div>
            <div className="p-4 bg-indigo-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-indigo-900">
                    Typical Total (vehicle under $10,000)
                  </p>
                  <p className="text-sm text-indigo-700 mt-1">
                    Bond premium $50 + VTR fee $15 + title fee $30 + county
                    fees ~$75
                  </p>
                </div>
                <span className="font-bold text-indigo-700 text-lg ml-4">
                  ~$170
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Quantum Surety starts at $50 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Why Quantum Surety's Title Bonds Start at $50
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Traditional surety bonds from insurance brokers or agents typically go
          through underwriting processes involving credit checks, income
          verification, and sometimes waiting periods of days or weeks. For a
          Texas certificate of title bond — which carries relatively low risk on
          small vehicle values — this process is excessive.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Quantum Surety has streamlined Texas title bonds specifically. Our
          pricing is flat-rate:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            "No credit check — approval is based on the bond amount, not your credit score",
            "No income verification or financial statements",
            "Same-day bond certificate delivery (digital, printable)",
            "Online application takes 2–3 minutes",
            "TDI-licensed Texas agency #3480229 — legally authorized to write this bond",
            "$50 minimum covers bonds up to $5,000 (most vehicles under $7,500 value)",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 mb-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed text-sm">{item}</span>
            </li>
          ))}
        </ul>

        {/* Apply CTA */}
        <div className="bg-indigo-800 rounded-xl p-6 mb-6 text-white">
          <p className="font-bold text-lg mb-2">
            Ready to apply? Know your vehicle's value?
          </p>
          <p className="text-indigo-200 text-sm mb-4">
            Skip the form and apply in 2 minutes directly. Same-day bond
            certificate. No credit check.
          </p>
          <a
            href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-400 transition-colors text-sm">
              Apply for My Bond Now{" "}
              <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </a>
        </div>

        {/* What's NOT included */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          What's Not Included in the Bond Premium
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          It's important to understand what the bond premium covers and what it
          doesn't:
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Included:</strong> 3-year bond coverage, bond
                certificate (VTR-130-SB format), same-day digital delivery,
                customer support
              </span>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Not included:</strong> TxDMV fees ($15 VTR-130-SOF),
                county tax office fees, title search, VIN verification (if
                required), notary fees (if required by your county)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Not included:</strong> Annual renewal — Texas title
                bonds are issued for the full 3-year period. No annual
                renewal fees.
              </span>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">
          Frequently Asked Questions About Texas Title Bond Cost
        </h2>
        <div className="space-y-4 mb-10">
          {[
            {
              q: "How much does a Texas title bond cost?",
              a: "Texas title bonds start at $50 from Quantum Surety. The bond premium scales with the required bond amount (1.5x vehicle value). Most vehicles under $10,000 in value will have a bond premium of $50–$100. Use the Title Bond Calculator at quantumsurety.bond/title-bond-calculator for your exact quote.",
            },
            {
              q: "Why does TxDMV require a bond at 1.5 times vehicle value?",
              a: "The 1.5x multiplier ensures that if someone makes a valid prior claim on the vehicle during the 3-year bonded period, the bond provides enough coverage to compensate them for the vehicle's value plus associated costs. This requirement is set by Texas Transportation Code §501.053.",
            },
            {
              q: "How does TxDMV determine my vehicle's value for the bond?",
              a: "TxDMV uses published guides like NADA and Kelley Blue Book, adjusted for the vehicle's year, make, model, and mileage as reported on your VTR-130-SOF. You receive the assigned value in TxDMV's determination letter, which also specifies the exact bond amount required.",
            },
            {
              q: "Are there other fees besides the bond premium?",
              a: "Yes. Total bonded title costs include: bond premium ($50+), VTR-130-SOF application fee ($15), state title fee ($28–33 via Form 130-U), and county registration fees ($50–100+). Total for most vehicles is approximately $140–220.",
            },
            {
              q: "Does my credit score affect the cost of a Texas title bond?",
              a: "No. Quantum Surety does not run a credit check for Texas certificate of title bonds. Pricing is flat-rate based on the bond amount only. Your credit history has no effect on approval or cost.",
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
                href="/title-bond-calculator"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Texas Title Bond Calculator — Enter your vehicle value for exact pricing
              </Link>
            </li>
            <li>
              <Link
                href="/texas-title-rescue"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Texas Title Rescue Wizard — 5-step eligibility check
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
              <a
                href="https://www.txdmv.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                TxDMV Official — Download VTR-130-SOF ↗
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
    <BlogAuthor />
    </div>
  );
}
