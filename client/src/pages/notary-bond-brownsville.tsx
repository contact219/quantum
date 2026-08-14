import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin, FileText } from "lucide-react";

const NOTARY_LINK = "/get-bond?type=notary";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Notary Bond — Brownsville",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/notary-bond-brownsville",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": [{ "@type": "City", "name": "Brownsville" }, { "@type": "State", "name": "Texas" }],
  "description": "Texas notary surety bond for Brownsville-area notaries. $10,000 coverage, $50 flat, instant PDF. SB693 compliant. No credit check.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "price": "50", "priceValidUntil": "2027-12-31", "availability": "https://schema.org/InStock" }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do Brownsville notaries need a surety bond?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every Texas notary public — including those commissioned in Cameron County and the Brownsville–Harlingen metro area — must obtain a $10,000 surety bond under Texas Government Code §406.010 before the Texas Secretary of State will issue or renew a notary commission." } },
    { "@type": "Question", "name": "How much does a notary bond cost in Brownsville?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas notary bond costs $50 for the full 4-year commission term from Quantum Surety — no annual renewals, no credit check, no hidden fees." } },
    { "@type": "Question", "name": "How fast can I get a notary bond in Brownsville?", "acceptedAnswer": { "@type": "Answer", "text": "Instantly. Apply online at quantumsurety.bond, pay $50, and your bond certificate PDF is emailed within minutes — ready to file with the Texas Secretary of State the same day." } },
    { "@type": "Question", "name": "What changed for Brownsville notaries under SB693?", "acceptedAnswer": { "@type": "Answer", "text": "Senate Bill 693 (effective January 1, 2026) added a mandatory education course requirement. The $10,000 bond requirement is unchanged and Quantum Surety's bond is fully SB693 compliant." } }
  ]
};

const faqs = [
  { q: "Do Brownsville notaries need a surety bond?", a: "Yes. Every Texas notary public — including those commissioned in Cameron County and the Brownsville–Harlingen metro area — must obtain a $10,000 surety bond under Texas Government Code §406.010 before the Texas Secretary of State will issue or renew a notary commission." },
  { q: "How much does a notary bond cost in Brownsville?", a: "A Texas notary bond costs $50 for the full 4-year commission term from Quantum Surety — no annual renewals, no credit check, no hidden fees. That's just $12.50 per year." },
  { q: "How fast can I get a notary bond in Brownsville?", a: "Instantly. Apply online, pay $50, and your bond certificate PDF is emailed within minutes — ready to file with the Texas Secretary of State the same day." },
  { q: "Do I need to visit an office in Brownsville to get a notary bond?", a: "No. The entire process is 100% online. No office visit, no fax, no waiting for mail. Your bond PDF is emailed within minutes of payment." },
  { q: "What changed for Brownsville notaries under SB693?", a: "Senate Bill 693 (effective January 1, 2026) added a mandatory education course and a $20 fee per attempt. The $10,000 bond requirement is unchanged — Quantum Surety's $50 bond meets all SB693 requirements." },
];

export default function NotaryBondBrownsville() {
  useSEO({
    title: "Notary Bond Brownsville TX | $50 Instant | Texas Notary Surety Bond | Quantum Surety",
    description: "Get your Texas notary bond in Brownsville instantly — $50 flat, $10,000 coverage, SB693 compliant. No credit check. Instant PDF. TDI-licensed agency #3480229.",
    canonical: "/bonds/notary-bond-brownsville",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/notary-bond-texas"><span className="hover:text-white cursor-pointer">Texas Notary Bond</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Brownsville</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3" /> Brownsville, TX</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Instant certificate</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><FileText className="w-3 h-3" /> SB693 compliant</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Notary Bond — Brownsville</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Brownsville and Cameron County notaries: get your required $10,000 Texas notary surety bond in minutes. $50 flat for the full 4-year term — instant PDF certificate ready to file.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={NOTARY_LINK}><Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Notary Bond — $50 <ArrowRight className="w-4 h-4 ml-2" /></Button></a>
            <a href="tel:2146668718"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button></a>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[{ label: "Bond amount", value: "$10,000", sub: "Required by Texas SOS" }, { label: "Total cost", value: "$50 + $21 state fee", sub: "$71 to be commissioned, full 4-year term" }, { label: "Delivery", value: "Instant PDF", sub: "Email within minutes" }].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-teal-100">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className="text-xs text-teal-700 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Notary Bond Requirements for Brownsville Notaries</h2>
          <p className="text-gray-600 leading-relaxed mb-6">All Texas notary commissions — whether your county of appointment is Cameron County or any other Texas county — require the same $10,000 surety bond under <strong>Texas Government Code §406.010</strong>. The bond must be filed with the Texas Secretary of State before your commission is issued.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ title: "Bond amount", detail: "$10,000 required coverage" }, { title: "Term", detail: "4 years — matches your commission period" }, { title: "Cost", detail: "$50 flat — no annual renewal fee" }, { title: "Carrier", detail: "RLI Insurance — A-rated, SOS-accepted" }, { title: "Credit check", detail: "None required" }, { title: "Processing", detail: "Instant — PDF in minutes" }].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                <div><p className="font-semibold text-gray-900 text-sm">{item.title}</p><p className="text-xs text-gray-600 mt-0.5">{item.detail}</p></div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions — Brownsville Notary Bond</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200"><p className="font-semibold text-gray-900 text-sm flex items-start gap-2"><Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{item.q}</p></div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{item.a}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Brownsville Notary Bond Today</h2>
          <p className="text-indigo-200 mb-6">$50 flat · $10,000 coverage · Instant PDF · SB693 compliant · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={NOTARY_LINK}><Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" /></Button></a>
            <a href="tel:2146668718"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button></a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related pages</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[{ href: "/bonds/notary-bond-mcallen", title: "Notary Bond — McAllen", tag: "McAllen" }, { href: "/bonds/notary-bond-texas", title: "Texas Notary Bond Overview", tag: "Statewide" }, { href: "/bonds/notary-bond-renewal-texas", title: "Notary Bond Renewal", tag: "Renewal" }].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-1 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 flex items-center gap-1">View page <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
