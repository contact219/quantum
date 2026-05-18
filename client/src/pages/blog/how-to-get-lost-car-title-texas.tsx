import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { CheckCircle, AlertCircle, FileText, Car, Clock, ArrowRight, ExternalLink, Shield, ChevronRight } from "lucide-react";

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get a Lost Car Title in Texas in 5 Easy Steps",
  "description": "Complete guide to getting a replacement or bonded title for a lost car title in Texas, including when you need a surety bond and how to get one from Quantum Surety.",
  "totalTime": "P14D",
  "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": "50-220" },
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Determine which title path you need", "text": "Decide if you need a simple duplicate title (Form VTR-34, $2) or a bonded title (Form VTR-130-SOF, $15). If you're the original owner and your Texas title is just lost, use VTR-34. If you bought a car without a title or can't prove ownership, you'll need a bonded title." },
    { "@type": "HowToStep", "position": 2, "name": "Get a simple duplicate title (if applicable)", "text": "If you held a Texas title that is now lost or destroyed, complete Form VTR-34 (Application for Certified Copy of Title) and submit it by mail with $2 or in person at a TxDMV Regional Service Center for $5.45." },
    { "@type": "HowToStep", "position": 3, "name": "Apply for a bonded title determination", "text": "If a bonded title is needed, complete Form VTR-130-SOF and submit to TxDMV with the $15 fee. TxDMV will send you a Notice of Determination with the required bond amount (1.5x vehicle value)." },
    { "@type": "HowToStep", "position": 4, "name": "Purchase your surety bond from Quantum Surety", "text": "Purchase a Texas title bond from Quantum Surety equal to 1.5x the vehicle's appraised value. Quantum Surety is a TDI-licensed agency (#3480229) — same-day approval, flat-rate pricing, and the bond is delivered ready to file with TxDMV." },
    { "@type": "HowToStep", "position": 5, "name": "File with your county tax office and get your title", "text": "Within 30 days of receiving your bond, submit the original surety bond (VTR-130-SB), Form 130-U, and VTR-130-SOF to your county tax assessor-collector. TxDMV will issue a bonded title. After 3 years with no claims, it converts to a clean regular title." },
  ],
  "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is the difference between a duplicate title and a bonded title in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "A duplicate title (Form VTR-34) is a copy of a title you already held — used when your existing Texas title is lost or destroyed. A bonded title is required when you never had clear ownership documentation in the first place, such as buying a car with no title. The bonded title requires a surety bond equal to 1.5x the vehicle's value." } },
    { "@type": "Question", "name": "How much does it cost to get a lost car title in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "A duplicate title costs $2 by mail or $5.45 in person. A bonded title costs $15 for the TxDMV application plus the surety bond premium (typically $50–$200 for personal vehicles at Quantum Surety) plus county registration fees." } },
    { "@type": "Question", "name": "How long does it take to get a replacement car title in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "A duplicate title by mail typically takes 2–4 weeks. An in-person appointment at a TxDMV Regional Service Center can provide same-day processing. A bonded title takes longer — 2 to 6 weeks after you have the bond and file with your county." } },
    { "@type": "Question", "name": "What is the bond amount for a Texas bonded title?", "acceptedAnswer": { "@type": "Answer", "text": "The bond must equal 1.5 times the vehicle's value as determined by TxDMV. For example, a $10,000 car requires a $15,000 bond. Quantum Surety's premium for a $15,000 bond is typically around $100–$150 flat." } },
    { "@type": "Question", "name": "Can I sell a car with a bonded title in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Generally no — most buyers, lenders, and dealers will not accept a vehicle with a bonded title during the 3-year bonding period. After 3 years with no claims filed against the bond, TxDMV removes the bonded notation and issues a clean, transferable title." } },
    { "@type": "Question", "name": "What forms do I need for a Texas bonded title?", "acceptedAnswer": { "@type": "Answer", "text": "You need Form VTR-130-SOF (Statement of Fact, submitted to TxDMV with $15 fee), Form VTR-130-SB (the surety bond itself, purchased from a licensed agency like Quantum Surety), and Form 130-U (Application for Texas Title, filed with your county tax office)." } },
  ],
};

const steps = [
  {
    num: "1",
    title: "Determine Which Path You Need — Duplicate or Bonded Title",
    icon: FileText,
    color: "from-blue-500 to-indigo-600",
    body: `Not every lost title situation is the same. Texas offers two separate routes, and choosing the right one from the start saves weeks of back-and-forth.`,
    sections: [
      {
        heading: "Simple Duplicate Title (Form VTR-34)",
        badge: "Best if: You already held a Texas title that was lost or destroyed",
        content: `If you're the original titleholder and the document is simply missing or damaged, you need a **certified copy** — not a bonded title. This is the faster, cheaper path.

**Use Form VTR-34 if:**
- You previously held a Texas title for this vehicle
- Your title was lost in a move, flood, fire, or just misplaced
- You need a lender copy (for refinancing or trade-in)
- The title was damaged and is illegible

The fee is just **$2 by mail** or **$5.45 in person** at a TxDMV Regional Service Center.`,
        form: { name: "Form VTR-34 — Application for Certified Copy of Title", url: "https://www.txdmv.gov/sites/default/files/form_files/VTR-34.pdf" },
      },
      {
        heading: "Bonded Title (Form VTR-130-SOF)",
        badge: "Required if: You never had a title or can't prove ownership",
        content: `If you bought a vehicle without receiving the title, inherited a car with no paperwork, or bought at auction and ownership is unclear, a bonded title is the legal path to establishing ownership.

**You need a bonded title if:**
- You bought the vehicle but the seller never gave you a title
- You inherited a vehicle and there's no title in the estate
- You bought at auction, estate sale, or from a dealer who went out of business
- Your vehicle was abandoned and you obtained it through a legal process
- The title has an unresolvable lien from a company or lender that no longer exists`,
        form: { name: "Form VTR-130-SOF — Bonded Title Application / Statement of Fact", url: "https://www.txdmv.gov/sites/default/files/form_files/VTR-130-SOF.pdf" },
      },
    ],
  },
  {
    num: "2",
    title: "Get Your Duplicate Title (If That's Your Route)",
    icon: Car,
    color: "from-teal-500 to-green-600",
    body: `If you determined in Step 1 that you need a simple duplicate title, here's the complete process.`,
    sections: [
      {
        heading: "By Mail (Processing: 2–4 weeks)",
        badge: "$2 fee",
        content: `1. Download and complete **Form VTR-34** — all recorded owners must sign
2. Attach a legible photocopy of each owner's photo ID
3. Write a **check or money order for $2** payable to "Texas Department of Motor Vehicles"
4. If a lien is recorded on the title, you must also include the **original lien release letter** from the lienholder
5. Mail everything to: **Texas Department of Motor Vehicles, 1601 Southwest Parkway, Suite A, Wichita Falls, TX 76302**

**Important:** TxDMV enforces a **30-day waiting period** from when the last title was issued. If your original title was issued less than 30 days ago, you must wait before requesting a copy.`,
        form: null,
      },
      {
        heading: "In Person at a TxDMV Regional Service Center",
        badge: "$5.45 fee — same-day processing",
        content: `Schedule an appointment at your nearest [TxDMV Regional Service Center](https://www.txdmv.gov/regional-service-centers). Bring:
- Completed Form VTR-34 (signed by all owners)
- Photo ID for each owner
- $5.45 (cash, check, or credit card — note a convenience fee applies for cards)
- Original lien release if a lien is on record

Same-day processing is available with an appointment. Walk-ins may face delays.`,
        form: null,
      },
    ],
    note: "**Already done? Great — you're finished.** The steps below are for the bonded title process only.",
  },
  {
    num: "3",
    title: "Apply for a Bonded Title and Get Your Vehicle Appraised",
    icon: FileText,
    color: "from-amber-500 to-orange-600",
    body: `The bonded title process starts with an application to TxDMV, who will tell you the exact bond amount required. You'll also need to establish your vehicle's value.`,
    sections: [
      {
        heading: "Step 3A: Submit Form VTR-130-SOF to TxDMV",
        badge: "$15 non-refundable application fee",
        content: `Complete **both pages** of Form VTR-130-SOF (Bonded Title Application or Tax Collector Hearing Statement of Fact). Submit to your **TxDMV Regional Service Center** with:

- **$15 non-refundable processing fee** (check or money order)
- Evidence of ownership you do have (bill of sale, canceled check, auction receipt, insurance records, etc.)
- Copy of your Texas driver's license or government photo ID
- Answer all questions about the vehicle's history, possession, and any known liens

TxDMV will review your application and mail you a **Notice of Determination** that specifies the required bond amount. You then have **1 year** from that date to purchase your bond.`,
        form: { name: "Form VTR-130-SOF — Bonded Title Application", url: "https://www.txdmv.gov/sites/default/files/form_files/VTR-130-SOF.pdf" },
      },
      {
        heading: "Step 3B: Establish Your Vehicle's Value",
        badge: "Determines your bond amount",
        content: `TxDMV uses a **three-tier hierarchy** to establish your vehicle's value:

**1st — Standard Presumptive Value (SPV):** TxDMV's official lookup tool. Free and available for most vehicles. This is the most common method.

**2nd — NADA Guide:** Used if SPV is unavailable for your vehicle type.

**3rd — Certified Appraisal (Form VTR-125):** Only required if SPV and NADA are unavailable. Must be completed by a licensed Texas motor vehicle dealer or insurance adjuster who physically inspects the vehicle.

**Special rules:**
- Vehicles **25+ years old**: Minimum value of $4,000 (or appraised value if higher)
- **Trailers under 20 ft**: $4,000 minimum
- **Trailers 20 ft or longer**: $7,000 minimum

Your **bond amount = vehicle value × 1.5**. A $10,000 vehicle requires a $15,000 bond.`,
        form: { name: "Form VTR-125 — Motor Vehicle Appraisal (if needed)", url: "https://www.txdmv.gov/sites/default/files/form_files/VTR-125.pdf" },
      },
    ],
  },
  {
    num: "4",
    title: "Purchase Your Surety Bond from Quantum Surety",
    icon: Shield,
    color: "from-indigo-600 to-purple-700",
    body: `Once TxDMV gives you your Notice of Determination with the required bond amount, you purchase your title bond from a TDI-licensed surety agency like Quantum Surety. This is the step where we come in.`,
    sections: [
      {
        heading: "What Is a Title Bond?",
        badge: "Protects the true owner — and proves yours",
        content: `A Texas title surety bond (filed on **Form VTR-130-SB**) is a financial guarantee to TxDMV and any potential prior owner of the vehicle. Here's how it works:

- **You** are the principal — you're asserting rightful ownership
- **Quantum Surety** is the surety — we back the bond
- **TxDMV** (and any legitimate prior owner) are the beneficiaries

If someone later proves a legitimate ownership claim on the vehicle within 3 years, the bond pays them up to the bond amount. In the vast majority of cases, no claim is ever filed — and after 3 years, your title is clean.`,
        form: { name: "Form VTR-130-SB — Certificate of Title Surety Bond", url: "https://content.govdelivery.com/attachments/TXDMV/2016/09/14/file_attachments/621023/Form+VTR-130-SB.pdf" },
      },
      {
        heading: "How to Get Bonded with Quantum Surety",
        badge: "TDI License #3480229 · Same-day approval",
        content: `Getting your title bond from Quantum Surety is straightforward:

**1. Get a quote** — Visit [quantumsurety.bond/bonds/bonded-title-texas](/bonds/bonded-title-texas) or click "Get Your Bond" below. Enter the bond amount from your TxDMV Notice of Determination.

**2. Flat-rate pricing** — We price title bonds at a flat rate based on the bond amount. Most personal vehicles ($10,000–$30,000 value) result in bonds of $15,000–$45,000, with premiums typically ranging from **$50 to $200**.

**3. Same-day approval** — No credit check delays. Most title bonds are approved and issued the same day you apply.

**4. Bond delivered ready to file** — We provide the completed Form VTR-130-SB with our TDI-licensed agent signature, surety seal, and all required information filled in and ready to file with your county tax office.

**What we need from you:**
- Vehicle year, make, model, body style, and VIN
- Your name and address (as the bond principal)
- The bond amount from your TxDMV Notice of Determination`,
        cta: true,
      },
    ],
  },
  {
    num: "5",
    title: "File with Your County Tax Office and Receive Your Title",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-600",
    body: `You're in the home stretch. Within 30 days of receiving your surety bond, you must file with your county tax assessor-collector's office to complete the bonded title process.`,
    sections: [
      {
        heading: "What to Bring to Your County Tax Office",
        badge: "File within 30 days of bond issuance",
        content: `Bring all of the following to your **county tax assessor-collector's** office:

✅ **Original surety bond** (Form VTR-130-SB from Quantum Surety)
✅ **Form 130-U** (Application for Texas Title and/or Registration)
✅ **Both pages of Form VTR-130-SOF** (your bonded title application)
✅ **VIN inspection certificate** (if required by TxDMV for your vehicle)
✅ **Weight certificate** (if required)
✅ **Original lien release or letter of no interest** (required if any lien under 10 years old is recorded on the vehicle)
✅ **Payment for title and registration fees**

**Critical deadline:** The bond must be filed within **30 days of issuance** or it will not be accepted by TxDMV. Don't delay after receiving your bond.`,
        form: { name: "Form 130-U — Application for Texas Title and/or Registration", url: "https://www.txdmv.gov/sites/default/files/form_files/130-U.pdf" },
      },
      {
        heading: "Your Bonded Title: What Happens Next",
        badge: "3-year bond term → clean title",
        content: `After filing, TxDMV issues you a **bonded title** — a real, valid Texas vehicle title that says "bonded" on its face. Here's the timeline:

**During the 3-year bonding period:**
- Your title is valid and you can register, insure, and drive the vehicle
- The bond must remain in force — do not let it lapse
- Most buyers, lenders, and dealers will not accept transfer during this period
- If a legitimate prior owner files a claim, the bond pays them up to the bond amount

**After 3 years with no claims:**
- The bonded notation is automatically removed
- TxDMV issues a clean, unencumbered title
- You can now sell, finance, or trade the vehicle with a standard Texas title
- No action needed on your part — the bond expires automatically`,
        form: null,
      },
    ],
  },
];

const faqs = [
  {
    q: "What's the difference between a duplicate title and a bonded title in Texas?",
    a: "A duplicate title (Form VTR-34, $2–$5.45) is a replacement copy of a title you already held — used when your existing Texas title is simply lost or destroyed. A bonded title is required when you never had clear ownership documentation — for example, buying a car without a title or inheriting one with no paperwork. The bonded title requires a surety bond equal to 1.5x the vehicle's value.",
  },
  {
    q: "How much does it cost to replace a lost car title in Texas?",
    a: "A duplicate title costs $2 by mail or $5.45 in person. A bonded title involves the $15 TxDMV application fee, a surety bond premium (typically $50–$200 for personal vehicles through Quantum Surety), and your county's registration fees. The bond amount itself (1.5x vehicle value) is not a cost — it's a guarantee.",
  },
  {
    q: "How long do I have to file a bonded title after getting the bond?",
    a: "You must file your surety bond with your county tax assessor-collector within 30 days of the bond's issuance date. If you miss this window, the bond will not be accepted and you'll need to restart the process.",
  },
  {
    q: "Can I register and drive a car with a bonded title in Texas?",
    a: "Yes — a bonded title is a valid Texas title. You can register, insure, and drive the vehicle normally. However, most buyers, lenders, and dealers will not accept a vehicle transfer while the bonded notation is active. After 3 years with no claims, the notation is removed and you'll have a clean title.",
  },
  {
    q: "What vehicles are not eligible for a bonded title?",
    a: "A vehicle is not eligible for a bonded title if it has been declared junked or nonrepairable, if the frame, body, or motor is not intact, or if you are not a Texas resident (or military stationed in Texas). Vehicles with recorded liens under 10 years old require an original lien release or letter of no interest before proceeding.",
  },
  {
    q: "How do I get a bonded title bond fast?",
    a: "Quantum Surety provides same-day approval for Texas title bonds. Visit quantumsurety.bond/bonds/bonded-title-texas or call us, provide your vehicle information and bond amount from your TxDMV Notice of Determination, and we'll issue the completed Form VTR-130-SB ready to file the same day.",
  },
];

export default function BlogLostCarTitleTexas() {
  useSEO({
    title: "How to Get a Lost Car Title in Texas in 5 Easy Steps (2026) | Quantum Surety",
    description: "Lost your Texas car title? Here are 5 steps to get a replacement — including when you need a bonded title, the TxDMV forms required, and how Quantum Surety can get you bonded same day.",
    canonical: "/blog/how-to-get-lost-car-title-texas",
    ogType: "article",
  });
  useSchema(HOWTO_SCHEMA, "ld-json-HowTo");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-teal-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-teal-300 text-sm font-medium mb-4">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas Vehicle Titles</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-teal-200 mb-6">
            <Car className="w-4 h-4" />
            Texas Vehicle Title Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            How to Get a Lost Car Title in Texas<br className="hidden md:block" /> in 5 Easy Steps
          </h1>
          <p className="text-xl text-slate-300 mb-6 max-w-2xl">
            Whether your title is lost, destroyed, or was never transferred — here's the exact Texas process to get legal ownership of your vehicle, including when a surety bond is required and how to get one fast.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 8 min read</span>
            <span>Updated May 2026</span>
            <span>Source: TxDMV.gov</span>
          </div>
        </div>
      </section>

      {/* Quick nav / TL;DR */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-gray-700">Jump to:</span>
          {steps.map(s => (
            <a key={s.num} href={`#step-${s.num}`}
              className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium">
              Step {s.num}
            </a>
          ))}
          <a href="#faq" className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">FAQ</a>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Intro */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 text-lg leading-relaxed">
            Losing your car title is more common than you might think — and in Texas, getting it back is a well-defined process once you know which path applies to your situation. The Texas Department of Motor Vehicles (TxDMV) offers two distinct routes: a simple <strong>duplicate title</strong> for owners whose title document was lost or destroyed, and a <strong>bonded title</strong> for situations where ownership documentation was never properly transferred. Knowing which one you need is the first step.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This guide walks you through both processes — with direct links to every TxDMV form you'll need, the current fee schedule, and a clear explanation of where Quantum Surety fits into the bonded title process.
          </p>
        </div>

        {/* At-a-glance comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-12 not-prose">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">Duplicate Title</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">You held a Texas title that's now lost or destroyed</p>
            <ul className="space-y-1.5 text-sm text-blue-700">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>Form VTR-34</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>$2 by mail / $5.45 in person</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>No surety bond needed</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>2–4 weeks by mail, same-day in person</span></li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-amber-900">Bonded Title</h3>
            </div>
            <p className="text-sm text-amber-800 mb-3">You never had clear ownership documentation</p>
            <ul className="space-y-1.5 text-sm text-amber-700">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>Forms VTR-130-SOF + VTR-130-SB + 130-U</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>$15 TxDMV fee + surety bond premium</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>Bond = 1.5× vehicle value</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>3-year bond term → clean title</span></li>
            </ul>
          </div>
        </div>

        {/* Steps */}
        {steps.map((step, idx) => (
          <div key={step.num} id={`step-${step.num}`} className="mb-14 scroll-mt-20">
            {/* Step header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg`}>
                {step.num}
              </div>
              <div>
                <div className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-1">Step {step.num} of 5</div>
                <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-base leading-relaxed">{step.body}</p>

            {step.sections.map((sec, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-lg">{sec.heading}</h3>
                  {sec.badge && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">{sec.badge}</span>
                  )}
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{ __html: sec.content
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:underline" target="_blank" rel="noopener">$1</a>')
                    .replace(/\n\n/g, '</p><p class="mt-3">')
                    .replace(/^/, '<p>').replace(/$/, '</p>')
                    .replace(/\n- /g, '</p><p class="mt-1">• ')
                    .replace(/✅/g, '<span class="text-green-600">✅</span>')
                  }}
                />
                {sec.form && (
                  <a href={sec.form.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    <FileText className="w-4 h-4" />
                    Download {sec.form.name}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {sec.cta && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-sm text-indigo-800 font-semibold mb-3">Ready to get your Texas title bond?</p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/bonds/bonded-title-texas"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                        Get Your Bond Now <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link href="/quote"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-indigo-300 text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                        Get a Quote First
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {step.note && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800"
                  dangerouslySetInnerHTML={{ __html: step.note.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Forms summary table */}
        <div className="mb-14 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              All TxDMV Forms at a Glance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Form</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Purpose</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Fee</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Filed With</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { form: "VTR-34", purpose: "Duplicate title (already held TX title)", fee: "$2 mail / $5.45 in person", filed: "TxDMV Regional Service Center", url: "https://www.txdmv.gov/sites/default/files/form_files/VTR-34.pdf" },
                  { form: "VTR-130-SOF", purpose: "Bonded title initial application", fee: "$15 (non-refundable)", filed: "TxDMV Regional Service Center", url: "https://www.txdmv.gov/sites/default/files/form_files/VTR-130-SOF.pdf" },
                  { form: "VTR-130-SB", purpose: "Surety bond document (from Quantum Surety)", fee: "Bond premium (varies)", filed: "County Tax Assessor-Collector", url: "https://content.govdelivery.com/attachments/TXDMV/2016/09/14/file_attachments/621023/Form+VTR-130-SB.pdf" },
                  { form: "130-U", purpose: "Application for TX Title and Registration", fee: "County registration fees", filed: "County Tax Assessor-Collector", url: "https://www.txdmv.gov/sites/default/files/form_files/130-U.pdf" },
                  { form: "VTR-125", purpose: "Vehicle appraisal (only if SPV unavailable)", fee: "Appraiser fee (varies)", filed: "TxDMV Regional Service Center", url: "https://www.txdmv.gov/sites/default/files/form_files/VTR-125.pdf" },
                ].map(row => (
                  <tr key={row.form} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-semibold text-indigo-700">{row.form}</td>
                    <td className="px-5 py-3 text-gray-700">{row.purpose}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{row.fee}</td>
                    <td className="px-5 py-3 text-gray-600">{row.filed}</td>
                    <td className="px-5 py-3">
                      <a href={row.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
                        PDF <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA block */}
        <div className="mb-14 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-indigo-700 to-teal-700 p-8 text-white">
            <div className="flex items-start gap-4">
              <Shield className="w-10 h-10 flex-shrink-0 text-teal-300 mt-1" />
              <div>
                <div className="text-xs font-mono tracking-widest text-teal-300 mb-2">QUANTUM SURETY · TDI LICENSE #3480229</div>
                <h2 className="text-2xl font-bold mb-3">Need a Texas Title Bond? We Make It Fast and Simple.</h2>
                <p className="text-indigo-100 mb-5 max-w-xl">
                  Quantum Surety is a Texas Department of Insurance licensed surety bond agency. We issue title bonds same day — flat-rate pricing, no credit check delays, and the completed Form VTR-130-SB delivered ready to file with your county.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Typical Premium", value: "$50 – $200", sub: "most personal vehicles" },
                    { label: "Approval Time", value: "Same Day", sub: "in most cases" },
                    { label: "Bond Term", value: "3 Years", sub: "as required by TxDMV" },
                  ].map(item => (
                    <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{item.value}</div>
                      <div className="text-xs text-indigo-200 mt-0.5">{item.label}</div>
                      <div className="text-xs text-indigo-300 mt-0.5">{item.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/bonds/bonded-title-texas"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow">
                    Get Your Title Bond <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/quote"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600/50 border border-indigo-400 text-white font-semibold rounded-xl hover:bg-indigo-600/70 transition-colors">
                    Free Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  {item.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official resources */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-slate-500" />
            Official TxDMV Resources
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {[
              { label: "TxDMV — Get a Copy of Your Title", url: "https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle/get-a-copy-of-your-title" },
              { label: "TxDMV — Bought a Vehicle Without a Title?", url: "https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle/bought-a-vehicle-with-no-title" },
              { label: "TxDMV Regional Service Centers", url: "https://www.txdmv.gov/regional-service-centers" },
              { label: "TxDMV Forms Page", url: "https://www.txdmv.gov/forms" },
            ].map(link => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline py-1">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Related links */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="font-semibold text-gray-700 mb-4">Related Guides</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/bonds/bonded-title-texas" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors">Texas Bonded Title Bond →</Link>
            <Link href="/blog/how-to-get-texas-gdn-license" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors">Texas GDN Dealer License →</Link>
            <Link href="/blog/what-is-a-surety-bond-texas" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors">What Is a Surety Bond? →</Link>
            <Link href="/blog" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors">All Blog Posts →</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
