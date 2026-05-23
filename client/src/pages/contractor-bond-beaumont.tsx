import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin } from "lucide-react";

const GET_LINK = "/get-bond?type=contractor";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Contractor Bond — Beaumont",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/contractor-bond-beaumont",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": [{ "@type": "City", "name": "Beaumont" }, { "@type": "State", "name": "Texas" }],
  "description": "Texas contractor license bond for Beaumont businesses — meet TDLR and city licensing requirements quickly. Instant approval, same-day certificate.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do contractors in Beaumont need a surety bond?", "acceptedAnswer": { "@type": "Answer", "text": "Most Texas contractors must carry a surety bond to obtain or renew a license through TDLR or their local municipality. Beaumont contractors should verify requirements with Jefferson County and TDLR before beginning licensed work." } },
    { "@type": "Question", "name": "How much does a contractor bond cost in Beaumont?", "acceptedAnswer": { "@type": "Answer", "text": "Contractor bond premiums start from $100 per year depending on bond amount and credit. Quantum Surety offers instant quotes and same-day certificate issuance." } },
    { "@type": "Question", "name": "What bond amount do Beaumont contractors need?", "acceptedAnswer": { "@type": "Answer", "text": "TDLR-licensed contractors in Texas typically need bonds ranging from $5,000 to $25,000 depending on license type. Contact Quantum Surety to confirm the exact requirement for your trade." } },
    { "@type": "Question", "name": "How fast can I get a contractor bond in Beaumont?", "acceptedAnswer": { "@type": "Answer", "text": "Most approvals are instant. Your bond certificate can be emailed within minutes of application — ready to submit to TDLR or your local licensing authority the same day." } }
  ]
};

const faqs = [
  { q: "Do contractors in Beaumont need a surety bond?", a: "Most Texas contractors must carry a surety bond to obtain or renew a license through TDLR or their local municipality. Beaumont contractors should verify requirements with Jefferson County and TDLR before beginning licensed work." },
  { q: "How much does a contractor bond cost in Beaumont?", a: "Contractor bond premiums start from $100 per year depending on bond amount and credit. Quantum Surety offers instant quotes and same-day certificate issuance." },
  { q: "What bond amount do Beaumont contractors need?", a: "TDLR-licensed contractors in Texas typically need bonds ranging from $5,000 to $25,000 depending on license type. Contact Quantum Surety to confirm the exact requirement for your trade." },
  { q: "How fast can I get a contractor bond in Beaumont?", a: "Most approvals are instant. Your bond certificate can be emailed within minutes of application — ready to submit to TDLR or your local licensing authority the same day." }
];

export default function ContractorBondBeaumont() {
  useSEO({
    title: "Texas Contractor Bond — Beaumont | From $100 | Texas Surety Bond | Quantum Surety",
    description: "Texas contractor license bond for Beaumont businesses — meet TDLR and city licensing requirements quickly. Instant approval, same-day certificate.",
    canonical: "/bonds/contractor-bond-beaumont",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/contractor-bond-texas">
              <span className="hover:text-white cursor-pointer">Texas Contractor Bond</span>
            </Link>
            <ChevronRight className="w-4 h-4" /><span>Beaumont</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Beaumont, TX
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Instant certificate</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Shield className="w-3 h-3" /> TDI Licensed</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Contractor Bond — Beaumont</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Texas contractor license bond for Beaumont businesses — meet TDLR and city licensing requirements quickly. Instant approval, same-day certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={GET_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond — From $100 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Coverage", value: "Up to $25K", sub: "Meets TDLR requirements" },
            { label: "Starting at", value: "$100/yr", sub: "Instant approval available" },
            { label: "Turnaround", value: "Same day", sub: "Certificate emailed instantly" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-indigo-900">{item.value}</div>
              <div className="text-sm font-medium text-gray-700 mt-1">{item.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Beaumont businesses choose Quantum Surety</h2>
          <ul className="space-y-3 text-gray-700 text-sm">
              <li key="TDLR-compliant coverage" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>TDLR-compliant coverage</span></li>
              <li key="Instant approval available" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>Instant approval available</span></li>
              <li key="Same-day certificate" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>Same-day certificate</span></li>
              <li key="All contractor trades covered" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>All contractor trades covered</span></li>
              <li key="TDI Licensed #3480229" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>TDI Licensed #3480229</span></li>
              <li key="No hidden fees" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>No hidden fees</span></li>
          </ul>
          <div className="mt-6">
            <a href={GET_LINK}>
              <Button className="bg-indigo-700 hover:bg-indigo-800 text-white px-6">
                Get Bonded Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
        <div className="bg-indigo-50 rounded-xl p-6">
          <h3 className="font-bold text-indigo-900 mb-4">Serving Southeast Texas</h3>
          <p className="text-sm text-gray-600 mb-4">
            Quantum Surety serves Beaumont and surrounding Jefferson County communities. As a TDI-licensed Texas surety agency (#3480229), we issue bonds that meet all state and local requirements.
          </p>
          <p className="text-sm text-gray-600">
            Beaumont is home to over 113,000 residents in the Southeast Texas region. Our online platform means you never need to visit an office — apply, pay, and receive your bond certificate entirely online.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo-700 text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Ready to get bonded in Beaumont?</h2>
          <p className="text-indigo-200 mb-6">Apply online in minutes. Certificate emailed instantly.</p>
          <a href={GET_LINK}>
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
              Get My Bond Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
