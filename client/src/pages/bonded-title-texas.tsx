import { Link } from "wouter";
import { useState } from "react";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, AlertCircle, FileText, Car, Clock, Phone, Calculator, Scan } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Bonded Title Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/bonded-title-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas bonded title surety bonds for vehicles without a clear title. Required by TxDMV when original title is lost, unavailable, or has a lien dispute. Bond equals 1.5x the vehicle's appraised value. TDI-licensed agency.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "50", "maxPrice": "500", "unitText": "flat fee" } }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a Texas bonded title?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas bonded title (officially called a 'Certificate of Title — Surety Bond') is a vehicle title issued by TxDMV when the original title is unavailable. The vehicle owner purchases a surety bond equal to 1.5 times the vehicle's appraised value. If a prior owner later claims the vehicle, the bond compensates them up to the bond amount." } },
    { "@type": "Question", "name": "Who needs a bonded title in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "You may need a bonded title if you purchased a vehicle without receiving the title, inherited a vehicle with no title, lost your original title, bought a vehicle at auction without proper documentation, or have a title with a lien that cannot be released." } },
    { "@type": "Question", "name": "How much does a Texas bonded title bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "The bond amount is 1.5 times the vehicle's appraised value as determined by TxDMV. Quantum Surety's premium is typically $50–$200 for most personal vehicles, depending on the bond amount required. Commercial or high-value vehicles may cost more." } },
    { "@type": "Question", "name": "How long does a bonded title last in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "The bond must remain in force for 3 years. After 3 years with no title claims filed against the bond, TxDMV will remove the bonded notation and issue a clear, regular title. You cannot sell the vehicle with a bonded title in most cases until the 3-year period is complete." } },
    { "@type": "Question", "name": "What is the process to get a bonded title in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Step 1: Get the vehicle appraised by a TxDMV-approved appraiser. Step 2: Purchase a surety bond for 1.5x the appraised value from a TDI-licensed agency like Quantum Surety. Step 3: File Form VTR-130-SOF with TxDMV along with the bond, appraisal, and application fee. TxDMV will issue a title with a bonded notation." } },
    { "@type": "Question", "name": "Can I sell a car with a bonded title in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Generally no — most buyers and lenders will not accept a vehicle with a bonded title during the 3-year bonding period. After 3 years, TxDMV removes the bonded notation and issues a clear title that can be transferred normally." } }
  ]
};

const faqs = [
  { q: "What is a Texas bonded title?", a: "A Texas bonded title (officially called a 'Certificate of Title — Surety Bond') is a vehicle title issued by TxDMV when the original title is unavailable. The vehicle owner purchases a surety bond equal to 1.5 times the vehicle's appraised value. If a prior owner later claims the vehicle, the bond compensates them up to the bond amount." },
  { q: "Who needs a bonded title in Texas?", a: "You may need a bonded title if you purchased a vehicle without receiving the title, inherited a vehicle with no title, lost your original title, bought a vehicle at auction without proper documentation, or have a title with a lien that cannot be released." },
  { q: "How much does a Texas bonded title bond cost?", a: "The bond amount is 1.5 times the vehicle's appraised value as determined by TxDMV. Quantum Surety's premium is typically $50–$200 for most personal vehicles, depending on the bond amount required. Commercial or high-value vehicles may cost more." },
  { q: "How long does a bonded title last in Texas?", a: "The bond must remain in force for 3 years. After 3 years with no title claims filed against the bond, TxDMV will remove the bonded notation and issue a clear, regular title. You cannot sell the vehicle with a bonded title in most cases until the 3-year period is complete." },
  { q: "What is the process to get a bonded title in Texas?", a: "Step 1: Get the vehicle appraised by a TxDMV-approved appraiser. Step 2: Purchase a surety bond for 1.5x the appraised value from a TDI-licensed agency like Quantum Surety. Step 3: File Form VTR-130-SOF with TxDMV along with the bond, appraisal, and application fee. TxDMV will issue a title with a bonded notation." },
  { q: "Can I sell a car with a bonded title in Texas?", a: "Generally no — most buyers and lenders will not accept a vehicle with a bonded title during the 3-year bonding period. After 3 years, TxDMV removes the bonded notation and issues a clear title that can be transferred normally." },
];

const whoNeeds = [
  "Purchased a vehicle but the seller never provided the title",
  "Inherited a vehicle with no title documentation",
  "Lost or destroyed original title and cannot get a replacement",
  "Bought a vehicle at auction or estate sale without title",
  "Vehicle has an old lien that cannot be released",
  "Bought from a dealer who went out of business before titling",
  "Received a vehicle as a gift without title transfer",
  "Vehicle was abandoned and obtained through legal process",
];

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Quantum Surety", "item": "https://quantumsurety.bond" },
    { "@type": "ListItem", "position": 2, "name": "Surety Bonds", "item": "https://quantumsurety.bond" },
    { "@type": "ListItem", "position": 3, "name": "Texas Bonded Title Bond", "item": "https://quantumsurety.bond/bonds/bonded-title-texas" },
  ],
};

export default function BondedTitleTexas() {
  useSEO({
    title: "Texas Certificate of Title Bond | Bonded Title | Quantum Surety",
    description: "Get a Texas certificate of title bond (bonded title) when your vehicle title is lost or unavailable. Bond = 1.5x vehicle value. Same-day issuance. TDI-licensed agency #3480229.",
    canonical: "/bonds/bonded-title-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");
  useSchema(BREADCRUMB_SCHEMA, "ld-json-Breadcrumb");

  const [bondForm, setBondForm] = useState({ name: "", email: "", phone: "", vehicle: "", value: "", scenario: "" });
  const [bondSubmitted, setBondSubmitted] = useState(false);
  const [bondSubmitting, setBondSubmitting] = useState(false);

  async function handleBondSubmit(e) {
    e.preventDefault();
    setBondSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bondForm.name,
          email: bondForm.email,
          phone: bondForm.phone,
          bond_type: "bonded-title",
          source: "bonded-title-page-form",
          notes: "Vehicle: " + bondForm.vehicle + ", Value: $" + bondForm.value + ", Scenario: " + bondForm.scenario,
        }),
      });
      setBondSubmitted(true);
    } catch (_) {
      setBondSubmitted(true);
    } finally {
      setBondSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Car className="w-4 h-4" />
            Texas Certificate of Title Bond
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Texas Bonded Title Bond
          </h1>
          <p className="text-xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            Get a Texas vehicle title when the original is lost, unavailable, or missing.
            Fast approval from a TDI-licensed surety agency.
          </p>
          <p className="text-indigo-200 text-sm mb-8">
            Bond = 1.5× vehicle appraised value · TxDMV Form VTR-130-SOF · 3-year bond term
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Bonded Title Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "Bond amount", value: "1.5× value" },
            { label: "Typical cost", value: "$50–$200" },
            { label: "Bond term", value: "3 years" },
            { label: "Texas Cert. of Title Bond", value: "TxDMV accepted" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 border border-teal-100">
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is a bonded title */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Is a Texas Bonded Title?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A <strong>Texas bonded title</strong> — officially a "Certificate of Title — Surety Bond" — is a vehicle title issued by the Texas Department of Motor Vehicles (TxDMV) when you cannot produce the original title. It allows you to legally own and register a vehicle even when normal title documentation is unavailable.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              To receive a bonded title, you purchase a surety bond equal to <strong>1.5 times the vehicle's appraised value</strong>. The bond stays in force for <strong>3 years</strong>. During this period, any person with a valid claim to the vehicle (a prior owner, lienholder, or creditor) can file a claim against the bond.
            </p>
            <p className="text-gray-600 leading-relaxed">
              After 3 years with no claims, TxDMV removes the "bonded" notation and issues you a <strong>clean, unrestricted title</strong>. Quantum Surety is a TDI-licensed surety agency that issues bonded title bonds through A-rated carriers accepted by TxDMV.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <AlertCircle className="w-6 h-6 text-amber-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-3">Important: Not a Replacement for a Lost Title</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              If you simply <em>lost</em> your title for a vehicle you already own and have records for, you can get a duplicate title directly from TxDMV using Form VTR-34 — a faster and cheaper option.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              A bonded title is specifically for situations where you have <em>no</em> title documentation and cannot obtain one through normal TxDMV processes.
            </p>
          </div>
        </div>
      </section>

      {/* Who needs it */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Needs a Texas Bonded Title?</h2>
          <p className="text-gray-600 mb-8">You may need a bonded title bond if any of the following apply to your situation:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {whoNeeds.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the process works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            How to Get a Texas Bonded Title — Step by Step
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Determine if you qualify for a bonded title",
                body: "TxDMV requires that you've made a good-faith effort to obtain the title normally (duplicate title, contacting the prior owner, etc.). Contact Quantum Surety to discuss your specific situation — we'll confirm if a bonded title is the right path.",
              },
              {
                step: "2",
                title: "Get the vehicle appraised",
                body: "TxDMV requires an appraisal from a licensed vehicle appraiser to determine the market value. The bond amount will be 1.5× this appraised value. For example, a vehicle appraised at $10,000 requires a $15,000 bond.",
              },
              {
                step: "3",
                title: "Purchase your surety bond from Quantum Surety",
                body: "Provide the vehicle details, appraisal, and your contact information. Quantum Surety issues the bond through an A-rated carrier accepted by TxDMV. Typical premium for most personal vehicles: $50–$200 depending on the bond amount.",
              },
              {
                step: "4",
                title: "File Form VTR-130-SOF with TxDMV",
                body: "Submit the completed Statement of Fact (VTR-130-SOF), the original surety bond, the vehicle appraisal, and the applicable TxDMV title fee to your local county tax assessor-collector's office.",
              },
              {
                step: "5",
                title: "Receive your bonded title",
                body: "TxDMV issues a title with a 'Bonded' notation. After 3 years with no claims, you can request TxDMV remove the bonded notation and issue a clean title.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 mt-1">{s.step}</div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost section */}
      <section className="py-12 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Texas Bonded Title Bond Cost</h2>
          <p className="text-gray-600 text-sm mb-8">Bond amount = 1.5× vehicle appraised value. Quantum Surety's premium is typically a small percentage of the bond amount.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { appraised: "$5,000 vehicle", bond: "$7,500 bond", premium: "~$50–$75" },
              { appraised: "$15,000 vehicle", bond: "$22,500 bond", premium: "~$100–$150" },
              { appraised: "$30,000 vehicle", bond: "$45,000 bond", premium: "~$150–$300" },
            ].map((item) => (
              <div key={item.appraised} className="bg-white rounded-lg p-5 border border-indigo-200 text-left">
                <p className="text-sm text-gray-500 mb-1">{item.appraised}</p>
                <p className="text-sm font-semibold text-gray-700 mb-1">{item.bond}</p>
                <p className="text-lg font-bold text-indigo-700">{item.premium}</p>
                <p className="text-xs text-gray-400">Quantum Surety premium</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Exact pricing provided after reviewing vehicle appraisal. No credit check required for most vehicles.</p>
        </div>
      </section>

      {/* Forms and requirements */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Texas Bonded Title — Required Documents</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { doc: "Completed Form VTR-130-SOF", note: "Statement of Fact — available at TxDMV or county tax office" },
              { doc: "Original surety bond certificate", note: "Issued by Quantum Surety through an A-rated TxDMV-accepted carrier" },
              { doc: "Vehicle appraisal", note: "From a TxDMV-approved appraiser — determines bond amount" },
              { doc: "Proof of vehicle identification", note: "VIN inspection by law enforcement or TxDMV agent" },
              { doc: "TxDMV application fee", note: "Title fee paid to your county tax assessor-collector" },
              { doc: "Photo ID", note: "Government-issued ID for the applicant" },
            ].map((item) => (
              <div key={item.doc} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.doc}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Free Title Tools */}
      <section className="py-14 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Free Texas Title Bond Tools</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Use these free tools to analyze your document, check eligibility, and calculate your bond &#8212; before you pay anything.</p>
          <div className="grid sm:grid-cols-3 gap-5">

            {/* Card 1: AI Analyzer */}
            <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-200 rounded-2xl p-6 flex flex-col">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <Scan className="w-5 h-5 text-violet-600" />
              </div>
              <p className="font-bold text-gray-900 mb-1">AI Document Analyzer</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">Upload a bill of sale, old title, or auction receipt. AI extracts vehicle details, calculates bond amount, flags missing documents, and identifies red flags &#8212; in seconds. Free, no login.</p>
              <Link href="/title-document-analyzer">
                <button className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Scan className="w-4 h-4" /> Analyze My Document
                </button>
              </Link>
            </div>

            {/* Card 2: Title Rescue Wizard */}
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-2xl p-6 flex flex-col">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="font-bold text-gray-900 mb-1">Title Rescue Wizard</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">5-step eligibility check. Enter your vehicle and situation &#8212; get a yes/no result plus a personalized TxDMV document checklist in under 2 minutes. No login required.</p>
              <Link href="/texas-title-rescue">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> Check My Eligibility
                </button>
              </Link>
            </div>

            {/* Card 3: Bond Calculator */}
            <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-2xl p-6 flex flex-col">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5 text-teal-600" />
              </div>
              <p className="font-bold text-gray-900 mb-1">Title Bond Calculator</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">Enter your vehicle value (or decode by VIN) and instantly see the exact TxDMV bond amount and Quantum Surety's flat-rate premium. Prevents overbonding and county office rejection.</p>
              <Link href="/title-bond-calculator">
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Calculator className="w-4 h-4" /> Calculate My Cost
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>
      {/* Wizard CTA */}
      <section className="py-10 px-4 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div>
            <p className="font-semibold text-gray-900 mb-1">Not sure if your situation qualifies?</p>
            <p className="text-gray-600 text-sm">Answer 4 questions to get your eligibility result and a personalized document checklist for your county.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/texas-title-rescue">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap">
                Use the Title Rescue Wizard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-md whitespace-nowrap transition-colors"
            >
              Apply Directly <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Inline lead form */}
      <section id="apply" className="py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your Certificate of Title Bond in 24 Hours</h2>
          <p className="text-gray-500 text-sm mb-6">Tell us about your vehicle and we will confirm your bond amount and have your certificate ready same-day.</p>
          {bondSubmitted ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
              <CheckCircle className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-2">Request Received!</h3>
              <p className="text-gray-600 text-sm mb-1">We will email your bond details within 1 hour.</p>
              <p className="text-gray-500 text-sm">Need it faster? Call <a href="tel:2146668718" className="text-indigo-600 underline">(214) 666-8718</a></p>
            </div>
          ) : (
            <form onSubmit={handleBondSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input required className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Your full name" value={bondForm.name} onChange={e => setBondForm({...bondForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="your@email.com" value={bondForm.email} onChange={e => setBondForm({...bondForm, email: e.target.value})} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input required type="tel" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="(555) 000-0000" value={bondForm.phone} onChange={e => setBondForm({...bondForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                  <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="e.g. 2015 Ford F-150" value={bondForm.vehicle} onChange={e => setBondForm({...bondForm, vehicle: e.target.value})} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ($)</label>
                  <input type="number" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="12000" value={bondForm.value} onChange={e => setBondForm({...bondForm, value: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you get this vehicle?</label>
                  <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white" value={bondForm.scenario} onChange={e => setBondForm({...bondForm, scenario: e.target.value})}>
                    <option value="">Select situation</option>
                    <option value="private-sale">Bought from private seller</option>
                    <option value="auction">Won at auction</option>
                    <option value="inherited">Inherited</option>
                    <option value="dealer-closed">Dealer went out of business</option>
                    <option value="rejected">Title rejected at tax office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={bondSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-sm">
                {bondSubmitting ? "Submitting..." : "Request My Certificate of Title Bond"}
              </button>
              <p className="text-center text-xs text-gray-400">No credit check for most vehicles. TDI License #3480229.</p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Texas Bonded Title FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{faq.q}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* County pages grid */}
      <section className="py-14 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Find Your County</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Get county-specific tax office info, filing details, and a lead form for your area.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { name: "Harris County", city: "Houston", slug: "harris" },
              { name: "Dallas County", city: "Dallas", slug: "dallas" },
              { name: "Bexar County", city: "San Antonio", slug: "bexar" },
              { name: "Tarrant County", city: "Fort Worth", slug: "tarrant" },
              { name: "Travis County", city: "Austin", slug: "travis" },
              { name: "El Paso County", city: "El Paso", slug: "el-paso" },
              { name: "Collin County", city: "Plano/Frisco", slug: "collin" },
              { name: "Denton County", city: "Denton", slug: "denton" },
              { name: "Fort Bend County", city: "Sugar Land", slug: "fort-bend" },
              { name: "Nueces County", city: "Corpus Christi", slug: "nueces" },
            ].map((county) => (
              <Link key={county.slug} href={`/bonds/bonded-title-${county.slug}-county`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer text-center">
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{county.name}</p>
                  <p className="text-xs text-gray-400">{county.city}</p>
                  <p className="text-indigo-500 text-xs font-medium mt-2">View details →</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">Don't see your county? <a href="tel:2146668718" className="text-indigo-600 underline">Call (214) 666-8718</a> — we serve all 254 Texas counties.</p>
          </div>
        </div>
      </section>

      {/* Related pages */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Texas Bond Pages</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "Texas GDN Dealer Bond", slug: "gdn-bond-texas", desc: "Required for Texas motor vehicle dealer licenses." },
              { name: "Auto Dealer Bond Texas", slug: "auto-dealer-bond-texas", desc: "TxDMV-required dealer license bonds." },
              { name: "License Bond Texas", slug: "license-bond-texas", desc: "Texas license and permit bonds overview." },
            ].map((b) => (
              <Link key={b.name} href={`/bonds/${b.slug}`}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{b.name}</p>
                  <p className="text-gray-500 text-xs mb-2">{b.desc}</p>
                  <p className="text-indigo-600 text-xs font-medium">View details →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Clock className="w-8 h-8 text-indigo-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Get Your Texas Bonded Title Bond</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Fast approval · No credit check for most vehicles · TDI Licensed #3480229 · TxDMV-accepted carriers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
                Get a Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> Call (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
