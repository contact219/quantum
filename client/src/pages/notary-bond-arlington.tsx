import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Shield, MapPin, FileText } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Arlington Texas Notary Bond",
  "description": "Texas notary bond for Arlington notaries. $50 for a 4-year $10,000 bond. SB693 compliant. Instant online purchase and same-day certificate.",
  "provider": {
    "@type": "Organization",
    "name": "Quantum Surety",
    "url": "https://quantumsurety.bond"
  },
  "areaServed": [
    { "@type": "State", "name": "Texas" },
    { "@type": "City", "name": "Arlington" }
  ],
  "serviceType": "Surety Bond",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "50",
    "description": "$50 for a 4-year $10,000 Texas notary bond"
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I get a notary bond in Arlington, Texas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Apply online at Quantum Surety, pay $50, and receive your signed bond certificate by email immediately. Arlington notaries must file the bond with their county clerk — the Tarrant County District Clerk — and must also complete the Texas Secretary of State's online notary application."
      }
    },
    {
      "@type": "Question",
      "name": "How much is a notary bond in Arlington?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Texas notary bond costs $50 from Quantum Surety — regardless of which county you're in. The bond is $10,000 face value, valid for 4 years (matching your notary commission term). The $50 is your total cost for the full 4-year period."
      }
    },
    {
      "@type": "Question",
      "name": "Where do I file my notary bond in Arlington?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "After obtaining your notary commission from the Texas Secretary of State, you file your bond with the Tarrant County District Clerk. The bond must match the exact term and coverage amount shown on your notary commission certificate."
      }
    },
    {
      "@type": "Question",
      "name": "Does SB693 affect Arlington notaries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Senate Bill 693 applies statewide to all Texas notaries. Notary commissions are now 4 years (up from 2), the bond remains $10,000, and the application process has moved fully online. All Arlington notaries renewing or applying for the first time must comply with SB693."
      }
    }
  ]
};

export default function NotaryBondArlington() {
  useSEO({
    title: "Arlington Notary Bond | $50 Texas Notary Bond | Quantum Surety",
    description: "Get your Texas notary bond in Arlington for $50. SB693 compliant $10,000 4-year bond. Instant online purchase, same-day certificate. Serving Tarrant County notaries.",
    canonical: "https://quantumsurety.bond/bonds/notary-bond-arlington",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <MapPin className="w-4 h-4" /> Arlington, Texas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Arlington Notary Bond</h1>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Texas requires a $10,000 surety bond to become a notary public. Get yours for $50 — instant online approval, SB693 compliant, same-day certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-bond?type=notary">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Arlington Notary Bond — $50 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 border-b border-indigo-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <FileText className="w-5 h-5" />, label: "Bond amount", value: "$10,000" },
            { icon: <Clock className="w-5 h-5" />, label: "Term", value: "4 years" },
            { icon: <Shield className="w-5 h-5" />, label: "Total cost", value: "$50" },
            { icon: <CheckCircle className="w-5 h-5" />, label: "Delivery", value: "Same day" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div className="text-indigo-600 mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Arlington Notary Bond Requirements</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every Texas notary public — including the 800+ notaries serving Arlington, Mansfield, and the Mid-Cities — must obtain a surety bond before receiving their commission from the Texas Secretary of State. The bond is a 4-year, $10,000 instrument that protects the public from notarial misconduct.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Under Senate Bill 693 (effective January 1, 2026), Texas notary commissions are now 4 years (previously 2 years). Your bond term must match your commission term exactly. The bond amount remains $10,000. The SoS application process is now fully online.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Become a Notary in Arlington</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Get Your Bond First", desc: "Apply online at Quantum Surety. Pay $50 and receive your signed bond certificate by email in minutes. You'll need this before completing the SoS application." },
              { step: "2", title: "Apply with the Texas Secretary of State", desc: "Complete the online notary application at sos.texas.gov. Upload your bond certificate. The SoS typically processes applications within 2–4 weeks." },
              { step: "3", title: "Receive Your Commission", desc: "The SoS mails your notary commission certificate. Take your oath of office with the Tarrant County District Clerk." },
              { step: "4", title: "Get Your Seal", desc: "Order your official notary seal and journal. You cannot notarize documents until you have your seal and have taken your oath." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I get a notary bond in Arlington, Texas?",
                a: "Apply online at Quantum Surety, pay $50, and receive your signed bond certificate by email immediately. File the bond with the Tarrant County District Clerk after receiving your commission from the Secretary of State."
              },
              {
                q: "Can I get my bond before my commission is approved?",
                a: "Yes — and we recommend it. Your bond certificate is required as part of the SoS application. Get your bond first, then submit it with your application. The bond is valid immediately upon issuance."
              },
              {
                q: "What happens if I lose my bond certificate?",
                a: "Contact Quantum Surety and we'll email you a duplicate copy at no charge. Keep a digital copy saved to your cloud storage so you always have it accessible when needed."
              },
              {
                q: "Do Arlington notaries need E&O insurance?",
                a: "The state doesn't require Errors & Omissions (E&O) insurance, but many notary signing agents working with title companies in Tarrant County are asked to carry it. Quantum Surety can add E&O coverage to your bond purchase for an additional fee."
              },
            ].map((faq) => (
              <details key={faq.q} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <summary className="font-semibold text-gray-900 cursor-pointer">{faq.q}</summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Arlington Notary Bond — $50</h2>
          <p className="text-indigo-200 mb-6">Instant approval. Same-day certificate. SB693 compliant.</p>
          <Link href="/get-bond?type=notary">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8">
              Apply Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Texas Notary Bond by City</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/bonds/notary-bond-dallas", city: "Dallas" },
              { href: "/bonds/notary-bond-houston", city: "Houston" },
              { href: "/bonds/notary-bond-san-antonio", city: "San Antonio" },
              { href: "/bonds/notary-bond-austin", city: "Austin" },
              { href: "/bonds/notary-bond-fort-worth", city: "Fort Worth" },
              { href: "/bonds/notary-bond-el-paso", city: "El Paso" },
              { href: "/bonds/notary-bond-arlington", city: "Arlington" },
              { href: "/bonds/notary-bond-plano", city: "Plano" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 text-sm">{item.city} Notary Bond</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond", desc: "Statewide guide — $50" },
              { href: "/bonds/notary-bond-renewal-texas", label: "Notary Bond Renewal", desc: "Renewing your commission" },
              { href: "/bonds/notary-eo-insurance", label: "Notary E&O Insurance", desc: "Add errors & omissions coverage" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
