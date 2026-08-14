import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin } from "lucide-react";

const GET_LINK = "/get-bond?type=notary";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Notary Bond — League City",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/notary-bond-league-city",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": [{ "@type": "City", "name": "League City" }, { "@type": "State", "name": "Texas" }],
  "description": "Get your required $10,000 Texas notary surety bond in League City instantly — $50 flat for the full 4-year term. No credit check, no office visit, instant PDF certificate.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do League City notaries need a surety bond?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every Texas notary public — including those in Galveston County — must obtain a $10,000 surety bond under Texas Government Code §406.010 before the Texas Secretary of State will issue or renew a notary commission." } },
    { "@type": "Question", "name": "How much does a notary bond cost in League City?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas notary bond costs $50 for the full 4-year commission term from Quantum Surety — no annual renewals, no credit check, no hidden fees. That's just $12.50 per year." } },
    { "@type": "Question", "name": "How fast can I get a notary bond in League City?", "acceptedAnswer": { "@type": "Answer", "text": "Instantly. Apply online, pay $50, and your bond certificate PDF is emailed within minutes — ready to file with the Texas Secretary of State the same day." } },
    { "@type": "Question", "name": "Does SB693 affect League City notaries?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Senate Bill 693 (effective January 1, 2026) added a mandatory education requirement for new and renewing Texas notaries. The $10,000 bond requirement is unchanged and Quantum Surety's bond is fully SB693 compliant." } }
  ]
};

const faqs = [
  { q: "Do League City notaries need a surety bond?", a: "Yes. Every Texas notary public — including those in Galveston County — must obtain a $10,000 surety bond under Texas Government Code §406.010 before the Texas Secretary of State will issue or renew a notary commission." },
  { q: "How much does a notary bond cost in League City?", a: "A Texas notary bond costs $50 for the full 4-year commission term from Quantum Surety — no annual renewals, no credit check, no hidden fees. That's just $12.50 per year." },
  { q: "How fast can I get a notary bond in League City?", a: "Instantly. Apply online, pay $50, and your bond certificate PDF is emailed within minutes — ready to file with the Texas Secretary of State the same day." },
  { q: "Does SB693 affect League City notaries?", a: "Yes. Senate Bill 693 (effective January 1, 2026) added a mandatory education requirement for new and renewing Texas notaries. The $10,000 bond requirement is unchanged and Quantum Surety's bond is fully SB693 compliant." }
];

export default function NotaryBondLeagueCity() {
  useSEO({
    title: "Texas Notary Bond — League City | $50 | Texas Surety Bond | Quantum Surety",
    description: "Get your required $10,000 Texas notary surety bond in League City instantly — $50 flat for the full 4-year term. No credit check, no office visit, instant PDF certificate.",
    canonical: "/bonds/notary-bond-league-city",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/notary-bond-texas">
              <span className="hover:text-white cursor-pointer">Texas Notary Bond</span>
            </Link>
            <ChevronRight className="w-4 h-4" /><span>League City</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" /> League City, TX
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Instant certificate</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Shield className="w-3 h-3" /> TDI Licensed</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Notary Bond — League City</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Get your required $10,000 Texas notary surety bond in League City instantly — $50 flat for the full 4-year term. No credit check, no office visit, instant PDF certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={GET_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond — $50 <ArrowRight className="w-4 h-4 ml-2" />
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
            { label: "Bond amount", value: "$10,000", sub: "Required by Texas SOS" },
            { label: "Total cost", value: "$50 + $21 state fee", sub: "$71 to be commissioned, full 4-year term" },
            { label: "Turnaround", value: "Instant", sub: "PDF emailed in minutes" },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why League City businesses choose Quantum Surety</h2>
          <ul className="space-y-3 text-gray-700 text-sm">
              <li key="No credit check required" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>No credit check required</span></li>
              <li key="$10,000 surety bond coverage" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>$10,000 surety bond coverage</span></li>
              <li key="SB693 compliant" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>SB693 compliant</span></li>
              <li key="Instant PDF certificate" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>Instant PDF certificate</span></li>
              <li key="TDI Licensed #3480229" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>TDI Licensed #3480229</span></li>
              <li key="$50 flat — no hidden fees" className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500 shrink-0" /><span>$50 flat — no hidden fees</span></li>
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
          <h3 className="font-bold text-indigo-900 mb-4">Serving Greater Houston</h3>
          <p className="text-sm text-gray-600 mb-4">
            Quantum Surety serves League City and surrounding Galveston County communities. As a TDI-licensed Texas surety agency (#3480229), we issue bonds that meet all state and local requirements.
          </p>
          <p className="text-sm text-gray-600">
            League City is home to over 113,000 residents in the Greater Houston region. Our online platform means you never need to visit an office — apply, pay, and receive your bond certificate entirely online.
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
          <h2 className="text-2xl font-bold mb-3">Ready to get bonded in League City?</h2>
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
