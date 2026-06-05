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
  Calculator,
  Zap,
  Phone,
  MapPin,
  Star,
} from "lucide-react";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How fast can I get a Texas title bond from Quantum Surety?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Same day. Once you apply through the direct apply link, Quantum Surety issues the bond certificate digitally the same business day. You receive a printable bond certificate in the VTR-130-SB format that TxDMV and your county tax office will accept.",
      },
    },
    {
      "@type": "Question",
      name: "Is Quantum Surety licensed to issue title bonds in Texas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Quantum Surety is licensed by the Texas Department of Insurance (TDI) as a surety agent, license #3480229. We are authorized to issue certificate of title bonds for all 254 Texas counties.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Texas Title Rescue Wizard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Texas Title Rescue Wizard at quantumsurety.bond/texas-title-rescue is a free, 5-step eligibility tool. It asks about your vehicle and how you obtained it, determines whether you qualify for a bonded title, and generates a personalized document checklist. No login or email is required.",
      },
    },
    {
      "@type": "Question",
      name: "What does the Title Bond Calculator do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Title Bond Calculator at quantumsurety.bond/title-bond-calculator lets you enter your vehicle's value (or decode by VIN) and instantly shows the required bond amount under TxDMV's 1.5x rule, along with Quantum Surety's flat-rate premium. It prevents you from buying the wrong bond amount or overpaying.",
      },
    },
    {
      "@type": "Question",
      name: "Does Quantum Surety serve my Texas county?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Quantum Surety serves all 254 Texas counties. We have dedicated county-specific title bond guides for Harris, Dallas, Bexar, Tarrant, Travis, El Paso, Collin, Denton, Fort Bend, and Nueces counties, and serve every other Texas county as well.",
      },
    },
  ],
};

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Texas Title Bond in Minutes: Free Tools, Same-Day Bond & Direct Apply",
  description:
    "Quantum Surety built three free tools for Texas vehicle title problems. Here's a full walkthrough of the Title Rescue Wizard, Title Bond Calculator, and same-day direct apply — get bonded today.",
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

export default function QuantumSuretyTexasTitleBondTools2026() {
  useSEO({
    title:
      "Texas Title Bond in Minutes: Free Tools, Same-Day Bond & Direct Apply | Quantum Surety",
    description:
      "Quantum Surety's free Texas title bond tools: Title Rescue Wizard, Title Bond Calculator, county guides, and same-day direct apply. TDI-licensed #3480229. No credit check.",
    canonical: "/blog/quantum-surety-texas-title-bond-tools-2026",
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
            Texas Title Bond in Minutes — Quantum Surety's Free Tools
          </h1>
          <p className="text-indigo-100 text-lg mb-6">
            Quantum Surety built three free tools specifically for Texas vehicle
            title problems. Here's what each one does and how they work together
            to get you bonded same day.
          </p>
          <div className="flex items-center gap-4 text-sm text-indigo-300 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> 5 min read
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
          Getting a Texas bonded title used to mean wading through TxDMV's
          website, guessing at bond amounts, calling around to insurance brokers,
          waiting days for quotes, and hoping you filled out the right forms.
          Quantum Surety built a set of free online tools to eliminate every one
          of those friction points.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          This article is a complete walkthrough of every tool — what it does,
          what you see when you use it, and how they fit together into a seamless
          path from "I have no title" to "I'm bonded and registered."
        </p>

        {/* Tool 1: Title Rescue Wizard */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Tool 1: The Texas Title Rescue Wizard
        </h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-600" />
              <p className="font-semibold text-indigo-900">
                quantumsurety.bond/texas-title-rescue
              </p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              FREE · No Login
            </span>
          </div>
          <p className="text-indigo-800 text-sm leading-relaxed">
            A 5-step interactive eligibility wizard. Takes about 2 minutes.
            Tells you whether you qualify for a bonded title and generates a
            personalized checklist of exactly which documents to bring to TxDMV
            and your county tax office.
          </p>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4">
          Here's what you see when you use the Wizard — step by step:
        </p>
        <div className="space-y-3 mb-6">
          {[
            {
              num: "Step 1",
              title: "About Your Vehicle",
              desc: "Enter the year, make, model, and VIN. The wizard pre-fills the vehicle description and checks NMVTIS status in the background to warn you if the VIN shows as salvage or stolen.",
            },
            {
              num: "Step 2",
              title: "How Did You Get the Vehicle?",
              desc: "Choose from: private purchase, inheritance, auction, mechanic's lien situation, or other. Your answer routes you to the correct TxDMV form path — not all situations use VTR-130-SOF.",
            },
            {
              num: "Step 3",
              title: "What Documentation Do You Have?",
              desc: "Check which documents you currently have: bill of sale, payment receipts, prior registration, estate documents, repair invoices, etc. The wizard notes any red flags if required documentation is missing.",
            },
            {
              num: "Step 4",
              title: "Lien and Ownership History Check",
              desc: "Answer questions about known liens, out-of-state titles, and whether the prior owner is reachable. The wizard flags if a duplicate title from another state might be faster than a bonded title.",
            },
            {
              num: "Step 5",
              title: "Your Personalized Result",
              desc: "The wizard tells you: (a) whether you qualify for a bonded title, (b) which TxDMV process applies, (c) a printable document checklist tailored to your answers, and (d) a direct link to apply for your bond with Quantum Surety.",
            },
          ].map((item) => (
            <div
              key={item.num}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-4"
            >
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded h-fit flex-shrink-0">
                {item.num}
              </span>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  {item.title}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/texas-title-rescue">
          <button className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors mb-8 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Use the Texas Title Rescue Wizard{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>

        {/* Tool 2: Title Bond Calculator */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Tool 2: The Texas Title Bond Calculator
        </h2>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-teal-600" />
              <p className="font-semibold text-teal-900">
                quantumsurety.bond/title-bond-calculator
              </p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              FREE · Instant Results
            </span>
          </div>
          <p className="text-teal-800 text-sm leading-relaxed">
            Enter your vehicle's estimated value (or decode by VIN for an
            automatic NADA-based lookup) and the calculator instantly shows the
            required bond amount under TxDMV's 1.5x rule and Quantum Surety's
            flat-rate premium.
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          The calculator solves two real problems:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Problem: Overbonding
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Some applicants guess their vehicle is worth more than TxDMV will
              assign, and buy a higher bond than required — wasting money. The
              calculator uses realistic valuation guides to prevent this.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Problem: Wrong Bond
              Amount
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Buying a bond for the wrong face value means your county tax
              office will reject it. The calculator applies the exact TxDMV
              formula so you buy the right bond the first time.
            </p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          What you see in the calculator interface:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            "Vehicle value input (manual entry or VIN decode)",
            "Calculated bond amount (vehicle value × 1.5, min $5,000)",
            "Quantum Surety's flat-rate premium for that bond amount",
            "Total estimated cost including TxDMV and county fees",
            "One-click button to apply directly",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 mb-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed text-sm">{item}</span>
            </li>
          ))}
        </ul>
        <Link href="/title-bond-calculator">
          <button className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors mb-8 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculate My Bond Cost <ArrowRight className="w-4 h-4" />
          </button>
        </Link>

        {/* Tool 3: County guides */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Tool 3: Texas County-Specific Title Bond Guides
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          TxDMV sets the statewide rules, but the actual title application is
          filed at your <em>county</em> tax assessor-collector's office. Each
          county has different hours, addresses, accepted payment methods, and
          sometimes different local requirements. Quantum Surety built
          county-specific bonded title pages for the 10 most populous Texas
          counties:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { name: "Harris County", slug: "harris" },
            { name: "Dallas County", slug: "dallas" },
            { name: "Bexar County", slug: "bexar" },
            { name: "Tarrant County", slug: "tarrant" },
            { name: "Travis County", slug: "travis" },
            { name: "El Paso County", slug: "el-paso" },
            { name: "Collin County", slug: "collin" },
            { name: "Denton County", slug: "denton" },
            { name: "Fort Bend County", slug: "fort-bend" },
            { name: "Nueces County", slug: "nueces" },
          ].map((county) => (
            <Link
              key={county.slug}
              href={`/bonds/bonded-title-${county.slug}-county`}
              className="bg-white border border-indigo-200 rounded-lg p-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {county.name}
            </Link>
          ))}
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          Each county page includes:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            "Local tax assessor-collector name and main office address",
            "Office hours and appointment information",
            "Accepted payment methods for title fees",
            "County-specific notes (e.g., Harris County's online appointment system)",
            "Direct link to apply for your bond",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 mb-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed text-sm">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-700 leading-relaxed mb-6">
          For the complete statewide overview, see the{" "}
          <Link
            href="/bonds/bonded-title-texas"
            className="text-indigo-600 hover:text-indigo-800 underline font-medium"
          >
            Texas Bonded Title main guide
          </Link>
          .
        </p>

        {/* Tool 4: Direct Apply */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Tool 4: Direct Apply — Bond in 2 Minutes
        </h2>
        <div className="bg-white border-2 border-teal-400 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 text-teal-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-gray-900 text-lg mb-2">
                Skip the form. Apply in 2 minutes.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Already know your required bond amount from the TxDMV
                determination letter or the calculator? Use the direct apply
                link to skip intake forms and go straight to the bond
                application. No account creation. No uploading documents.
              </p>
              <ul className="space-y-1 mb-4 text-sm text-gray-700">
                {[
                  "Takes approximately 2 minutes to complete",
                  "No credit check — flat-rate pricing",
                  "Bond certificate delivered digitally same day",
                  "Printable VTR-130-SB format accepted by all Texas counties",
                  "Secure application via mybondapp.com",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-500 transition-colors flex items-center gap-2">
                  Apply for My Texas Title Bond{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* About Quantum Surety */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          About Quantum Surety
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Quantum Surety is a Texas-based surety agency licensed by the Texas
          Department of Insurance. We specialize in Texas vehicle title bonds
          and built every tool on this page specifically for Texas applicants
          navigating the bonded title process.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            {
              icon: <Shield className="w-5 h-5 text-indigo-600" />,
              title: "TDI-Licensed #3480229",
              desc: "Licensed by the Texas Department of Insurance to write surety bonds in all 254 Texas counties.",
            },
            {
              icon: <Zap className="w-5 h-5 text-teal-600" />,
              title: "Same-Day Bond Issuance",
              desc: "Bond certificates issued digitally the same business day you apply. No waiting for mail.",
            },
            {
              icon: <Calculator className="w-5 h-5 text-amber-600" />,
              title: "$50 Minimum, Flat-Rate Pricing",
              desc: "No credit check. No income verification. Pricing is flat-rate starting at $50 for the most common vehicle values.",
            },
            {
              icon: <Phone className="w-5 h-5 text-green-600" />,
              title: "Live Voice Support",
              desc: "Call 214-666-8718 to speak with our AI-assisted receptionist or get connected to an agent. Available during business hours.",
            },
            {
              icon: <MapPin className="w-5 h-5 text-red-500" />,
              title: "All 254 Texas Counties",
              desc: "Serving the entire state of Texas — from Harris County to rural Loving County. One agency, statewide coverage.",
            },
            {
              icon: <FileText className="w-5 h-5 text-indigo-600" />,
              title: "3-Year Bond Term",
              desc: "Our bonds cover the full 3-year TxDMV bonded title period with no annual renewal fees.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <p className="font-semibold text-gray-800 text-sm">
                  {item.title}
                </p>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          Quantum Surety vs. Going to an Insurance Broker
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Most Texans who need a title bond don't know where to start — many end
          up calling a general insurance broker, which is slower, more expensive,
          and unnecessarily complex for this type of bond. Here's how the two
          options compare:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full bg-white border border-gray-200 rounded-xl text-sm shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">
                  Feature
                </th>
                <th className="text-left p-3 font-semibold text-indigo-700 border-b border-gray-200">
                  Quantum Surety
                </th>
                <th className="text-left p-3 font-semibold text-gray-600 border-b border-gray-200">
                  General Insurance Broker
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-600 font-medium">
                  Time to get bond
                </td>
                <td className="p-3 text-green-700 font-semibold">
                  Same day
                </td>
                <td className="p-3 text-gray-500">2–5 business days</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-3 text-gray-600 font-medium">Credit check</td>
                <td className="p-3 text-green-700 font-semibold">
                  No credit check
                </td>
                <td className="p-3 text-gray-500">Often required</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-600 font-medium">
                  Minimum premium
                </td>
                <td className="p-3 text-green-700 font-semibold">$50</td>
                <td className="p-3 text-gray-500">$75–200+ (varies)</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-3 text-gray-600 font-medium">
                  Knows TX title bond process
                </td>
                <td className="p-3 text-green-700 font-semibold">
                  Yes — specialized
                </td>
                <td className="p-3 text-gray-500">
                  Varies; often unfamiliar
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-600 font-medium">
                  Online application
                </td>
                <td className="p-3 text-green-700 font-semibold">
                  Yes — 2 minutes
                </td>
                <td className="p-3 text-gray-500">Usually requires calls</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-3 text-gray-600 font-medium">
                  Same-day digital certificate
                </td>
                <td className="p-3 text-green-700 font-semibold">Yes</td>
                <td className="p-3 text-gray-500">
                  Rarely — often mailed
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 text-gray-600 font-medium">
                  Free eligibility tools
                </td>
                <td className="p-3 text-green-700 font-semibold">
                  Yes — Wizard + Calculator
                </td>
                <td className="p-3 text-gray-500">No</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 text-gray-600 font-medium">
                  County-specific guides
                </td>
                <td className="p-3 text-green-700 font-semibold">
                  Yes — 10 Texas counties
                </td>
                <td className="p-3 text-gray-500">No</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* How the tools work together */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
          How the Tools Work Together: Your Complete Path
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The three tools are designed to work as a pipeline — not three
          separate things:
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
            <div className="bg-indigo-100 text-indigo-800 font-semibold px-4 py-2 rounded-lg text-center">
              Title Rescue Wizard
              <p className="text-xs font-normal mt-0.5">Eligibility check</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 sm:rotate-0 flex-shrink-0" />
            <div className="bg-teal-100 text-teal-800 font-semibold px-4 py-2 rounded-lg text-center">
              Bond Calculator
              <p className="text-xs font-normal mt-0.5">Exact cost</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 sm:rotate-0 flex-shrink-0" />
            <div className="bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-lg text-center">
              Direct Apply
              <p className="text-xs font-normal mt-0.5">Bond in 2 min</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 sm:rotate-0 flex-shrink-0" />
            <div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg text-center">
              County Guide
              <p className="text-xs font-normal mt-0.5">File locally</p>
            </div>
          </div>
        </div>
        <ol className="space-y-2 mb-6 text-gray-700 text-sm">
          <li className="flex items-start gap-2">
            <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <span>
              <strong>Title Rescue Wizard</strong> — confirms you qualify and
              tells you which documents to gather
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <span>
              <strong>Bond Calculator</strong> — shows exact bond amount and
              Quantum Surety's premium before you apply
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <span>
              <strong>Direct Apply</strong> — purchase the bond in 2 minutes,
              receive certificate same day
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </span>
            <span>
              <strong>County Guide</strong> — find your local tax
              assessor-collector office to file, with hours and address
            </span>
          </li>
        </ol>

        {/* Apply mid-article CTA */}
        <div className="bg-teal-700 rounded-xl p-6 mb-6 text-white">
          <p className="font-bold text-lg mb-2">
            Ready to get bonded today?
          </p>
          <p className="text-teal-100 text-sm mb-4">
            Apply directly in 2 minutes. Same-day bond certificate. No credit
            check. TDI-licensed Texas agency #3480229.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/texas-title-rescue">
              <button className="bg-white text-teal-800 font-semibold px-5 py-2 rounded-lg hover:bg-teal-50 transition-colors text-sm">
                Free Eligibility Check{" "}
                <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </Link>
            <a
              href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-teal-500 border border-teal-300 text-white font-semibold px-5 py-2 rounded-lg hover:bg-teal-400 transition-colors text-sm">
                Apply Now <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </a>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 mb-10">
          {[
            {
              q: "How fast can I get a Texas title bond from Quantum Surety?",
              a: "Same day. Once you complete the online application, Quantum Surety issues your bond certificate digitally the same business day. The certificate is in the VTR-130-SB format required by TxDMV and accepted at all Texas county tax offices.",
            },
            {
              q: "Is Quantum Surety licensed to issue title bonds in Texas?",
              a: "Yes. Quantum Surety is licensed by the Texas Department of Insurance (TDI) as a surety agent, license #3480229. We are authorized to issue certificate of title bonds for all 254 Texas counties.",
            },
            {
              q: "What is the Texas Title Rescue Wizard?",
              a: "The Texas Title Rescue Wizard (quantumsurety.bond/texas-title-rescue) is a free 5-step eligibility tool. It asks about your vehicle and how you obtained it, determines whether you qualify for a bonded title, and generates a personalized document checklist — all in about 2 minutes with no login required.",
            },
            {
              q: "What does the Title Bond Calculator do?",
              a: "The Title Bond Calculator (quantumsurety.bond/title-bond-calculator) lets you enter your vehicle's value (or decode by VIN) and instantly shows the required bond amount under TxDMV's 1.5x rule along with Quantum Surety's flat-rate premium. It prevents overbonding and ensures you buy the correct bond amount the first time.",
            },
            {
              q: "Does Quantum Surety serve my Texas county?",
              a: "Yes — Quantum Surety serves all 254 Texas counties. We have dedicated county-specific guides for Harris, Dallas, Bexar, Tarrant, Travis, El Paso, Collin, Denton, Fort Bend, and Nueces counties, and issue bonds to applicants in every other Texas county as well.",
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
                Texas Title Rescue Wizard
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
              <Link
                href="/bonds/bonded-title-texas"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Texas Bonded Title — Complete Guide
              </Link>
            </li>
            <li>
              <Link
                href="/quote"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Get a Quote
              </Link>
            </li>
            <li>
              <a
                href="https://www.txdmv.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                TxDMV Official Website ↗
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
            #3480229. Serving all 254 Texas counties.
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
          <p className="text-indigo-400 text-sm mt-4">
            Questions? Call{" "}
            <a
              href="tel:2146668718"
              className="underline hover:text-indigo-200 transition-colors"
            >
              214-666-8718
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
