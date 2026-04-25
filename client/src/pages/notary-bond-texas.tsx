import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, ArrowRight, Clock, FileText, Shield,
  AlertTriangle, BookOpen, Star, Phone
} from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Notary Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/notary-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas notary surety bond — $10,000 coverage, $50 flat fee, instant download. SB693 compliant. No credit check. Required for all Texas notary public commissions.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "price": "50", "priceValidUntil": "2027-12-31", "availability": "https://schema.org/InStock" }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a Texas notary bond?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas notary bond is a $10,000 surety bond required by the Texas Secretary of State for all notary public commissions. It protects the public from financial loss caused by notary misconduct or errors." } },
    { "@type": "Question", "name": "How much does a Texas notary bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas notary bond costs $50 for the full 4-year term from Quantum Surety. There are no annual renewal fees — it's a one-time $50 payment covering your entire commission period." } },
    { "@type": "Question", "name": "What changed in 2026 for Texas notaries (SB693)?", "acceptedAnswer": { "@type": "Answer", "text": "Starting January 1, 2026, Senate Bill 693 requires all new and renewing Texas notary applicants to complete a mandatory education course (up to 2 hours) provided by the Texas Secretary of State. A $20 fee applies per attempt. The $10,000 bond requirement is unchanged." } },
    { "@type": "Question", "name": "Is there a credit check for a Texas notary bond?", "acceptedAnswer": { "@type": "Answer", "text": "No. Texas notary bonds are issued without a credit check. Anyone who meets the state's eligibility requirements can purchase a bond instantly." } },
    { "@type": "Question", "name": "Can I get a notary bond if I'm a remote online notary (RON)?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All Texas notaries — including Remote Online Notaries — are required to hold the same $10,000 notary surety bond." } }
  ]
};

export default function NotaryBondTexas() {
  useSEO({
    title: "Texas Notary Bond | $50 Instant Online | SB693 Compliant | Quantum Surety",
    description:
      "Texas notary bond — $50, instant download, SB693 compliant. $10,000 coverage, no credit check. Get bonded in minutes. TDI-licensed agency (license #3480229).",
    canonical: "/bonds/notary-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  const steps = [
    { step: "1", title: "Enter your info", body: "Your name, county, and commission details. Takes under 2 minutes." },
    { step: "2", title: "Pay securely online", body: "$50 flat. No hidden fees. No credit check needed." },
    { step: "3", title: "Download instantly", body: "Your $10,000 notary bond is emailed immediately — ready to file with the Texas Secretary of State." },
  ];

  const faqs = [
    {
      q: "What is a Texas notary bond?",
      a: "A Texas notary bond is a $10,000 surety bond required by the Texas Secretary of State for all notary public commissions. It protects the public — not the notary — from financial loss caused by notary misconduct or errors. If a claim is made, the surety pays up to $10,000 and then seeks reimbursement from the notary.",
    },
    {
      q: "How much does a Texas notary bond cost?",
      a: "A Texas notary bond costs $50 for the full 4-year term. There are no annual renewal fees — it's a one-time $50 payment that covers your entire commission period.",
    },
    {
      q: "How long does a Texas notary bond last?",
      a: "Your Texas notary bond runs concurrent with your 4-year notary commission. You'll need a new bond each time you renew your commission.",
    },
    {
      q: "What changed in 2026 for Texas notaries? (SB693)",
      a: "Starting January 1, 2026, Senate Bill 693 requires all new and renewing Texas notary applicants to complete a mandatory education course (up to 2 hours) provided by the Texas Secretary of State. A $20 fee applies per attempt. Notaries commissioned before September 1, 2025 are exempt from the initial education requirement. The law also increased record retention to 10 years and created criminal penalties for improper notarizations.",
    },
    {
      q: "Do I need E&O insurance in addition to a notary bond?",
      a: "The bond is required by law but it protects the public, not you. Errors & Omissions (E&O) insurance protects you personally against lawsuits for unintentional mistakes. Most practicing notaries — especially mobile notaries and signing agents — strongly benefit from carrying E&O coverage alongside their bond.",
    },
    {
      q: "How do I file my Texas notary bond?",
      a: "After purchasing your bond, you'll upload it through the Texas Secretary of State's SOS Portal Notary System along with your application. Quantum Surety provides step-by-step instructions with every bond purchase.",
    },
    {
      q: "Can I get a notary bond if I'm a remote online notary (RON)?",
      a: "Yes. All Texas notaries — including Remote Online Notaries — are required to hold the same $10,000 notary surety bond. RON authorization requires a separate application to the Secretary of State after your notary commission is granted.",
    },
    {
      q: "Is there a credit check for a Texas notary bond?",
      a: "No. Texas notary bonds are issued without a credit check. Anyone who meets the state's eligibility requirements can purchase a bond instantly.",
    },
  ];

  const stateLinks = [
    { state: "Oklahoma", slug: "notary-bond-oklahoma", req: "$1,000 bond, 4-year term" },
    { state: "Louisiana", slug: "notary-bond-louisiana", req: "$10,000–$50,000 bond depending on parish" },
    { state: "Arkansas", slug: "notary-bond-arkansas", req: "$7,500 bond, 10-year term" },
    { state: "New Mexico", slug: "notary-bond-new-mexico", req: "$10,000 bond, 4-year term" },
  ];

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Clock className="w-4 h-4" />
            Instant Download — Available 24/7
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Texas Notary Bond — $50, Instant Online
          </h1>
          <p className="text-xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            Get your required 4-year, $10,000 Texas notary surety bond in minutes.
            Download immediately and file with the Secretary of State today.
          </p>
          <p className="text-indigo-200 text-sm mb-8">
            ✓ No credit check &nbsp;&nbsp; ✓ No hidden fees &nbsp;&nbsp; ✓ 2026 SB693 compliant &nbsp;&nbsp; ✓ E&O insurance available
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 2026 SB693 Alert Banner */}
      <section className="bg-amber-50 border-b border-amber-200 py-5 px-4">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">2026 Texas Notary Law Update (SB693)</p>
            <p className="text-amber-800 text-sm mt-1">
              Effective January 1, 2026, all new and renewing Texas notary applicants must complete a mandatory
              education course from the Texas Secretary of State (up to 2 hours, $20 fee). Your notary bond
              requirement is unchanged — still a 4-year, $10,000 bond for $50.{" "}
              <a href="#faq" className="underline font-medium">Learn more below ↓</a>
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What's Included with Your Texas Notary Bond
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-8 h-8 text-indigo-600" />,
                title: "$10,000 Surety Bond",
                body: "The full 4-year bond required by the Texas Secretary of State. Issued by an A-rated carrier authorized in Texas.",
              },
              {
                icon: <Clock className="w-8 h-8 text-indigo-600" />,
                title: "Instant Download",
                body: "Your executed bond document is emailed immediately upon payment — 24 hours a day, 7 days a week.",
              },
              {
                icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
                title: "Filing Instructions",
                body: "Step-by-step guide for uploading your bond to the Texas SOS Portal Notary System included at no charge.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Get Your Texas Notary Bond in 3 Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10">
                Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Bond vs E&O Explainer */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Notary Bond vs. E&O Insurance — What's the Difference?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Texas requires the bond. E&O protects you. Most serious notaries carry both.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-indigo-200 rounded-xl p-6 bg-indigo-50">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-bold text-indigo-900">Notary Surety Bond</h3>
                <span className="ml-auto bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">Required by Law</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Protects the <strong>public</strong> from notary errors</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />$10,000 coverage amount set by Texas law</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />4-year term, $50 flat — no credit check</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Required to receive your notary commission</li>
              </ul>
            </div>
            <div className="border border-teal-200 rounded-xl p-6 bg-teal-50">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-bold text-teal-900">E&O Insurance</h3>
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">Strongly Recommended</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Protects <strong>you</strong> from lawsuits and personal liability</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Coverage from $5,000 to $100,000+</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Especially important for mobile notaries & signing agents</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Available to add at checkout alongside your bond</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Texas Notary Requirements Summary */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Texas Notary Commission Requirements (2026)
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {[
              { label: "Bond Amount", value: "$10,000" },
              { label: "Bond Term", value: "4 years (concurrent with commission)" },
              { label: "Bond Cost", value: "$50 flat — no hidden fees" },
              { label: "Education Requirement (new 2026)", value: "Up to 2 hours via TX Secretary of State ($20 fee)" },
              { label: "Minimum Age", value: "18 years old" },
              { label: "Residency", value: "Must be a Texas resident" },
              { label: "Criminal Record", value: "No felony convictions or crimes of moral turpitude" },
              { label: "Record Retention", value: "10 years from date of notarization (new 2026)" },
              { label: "Filing", value: "Via the Texas SOS Portal Notary System" },
              { label: "State Application Fee", value: "$21 (paid to the Secretary of State)" },
            ].map((row, i) => (
              <div key={row.label} className={`flex items-start px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <span className="w-1/2 text-sm font-medium text-gray-600">{row.label}</span>
                <span className="w-1/2 text-sm font-semibold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Texas Notaries Trust Quantum Surety
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Maria T., Dallas TX",
                text: "Got my notary bond downloaded and filed with the state in under 10 minutes. Instructions were crystal clear. Will use again when I renew!",
              },
              {
                name: "James R., Houston TX",
                text: "I was worried about the new 2026 education requirement. Quantum Surety's site explained everything perfectly and I had my bond in minutes.",
              },
              {
                name: "Sandra K., San Antonio TX",
                text: "As a mobile notary signing agent, I needed both the bond and E&O insurance. Got them both in one checkout. Couldn't be easier.",
              },
            ].map((r) => (
              <div key={r.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(n => <Star key={n} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-sm mb-4 italic">"{r.text}"</p>
                <p className="text-gray-500 text-xs font-medium">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Texas Notary Bond — Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighboring States */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Notary Bonds in Neighboring States
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Quantum Surety issues notary bonds across the South-Central region.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stateLinks.map((s) => (
              <Link key={s.state} href={`/bonds/${s.slug}`}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 mb-1">{s.state} Notary Bond</p>
                  <p className="text-xs text-gray-500">{s.req}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium">Learn more →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Texas Notary Bond?</h2>
          <p className="text-indigo-200 mb-8">
            $50. Instant download. No credit check. File with the Texas Secretary of State today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
                Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> Call (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
