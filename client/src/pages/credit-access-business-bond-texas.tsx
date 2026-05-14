import { useSEO, useSchema } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertTriangle, DollarSign, Clock, Shield, FileText } from "lucide-react";
import { Link } from "wouter";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Credit Access Business (CAB) Bond",
  "description": "OCCC-required surety bond for Texas credit access business (payday/title loan) license applicants. Per-location bond, instant approval.",
  "provider": {
    "@type": "Organization",
    "name": "Quantum Surety",
    "url": "https://quantumsurety.bond"
  },
  "areaServed": { "@type": "State", "name": "Texas" },
  "serviceType": "Surety Bond",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "250",
    "description": "Starting from $250/year per location"
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What bond is required for a Texas credit access business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Texas Finance Code Chapter 393 requires credit access businesses (CABs) — payday loan and auto title loan companies — to post a surety bond with OCCC as part of their per-location license. The bond amount is set by OCCC rule and is currently $25,000 per licensed location."
      }
    },
    {
      "@type": "Question",
      "name": "Who is a credit access business in Texas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A credit access business (CAB) is a company that arranges or obtains extensions of credit for consumers in amounts of $1,500 or less — primarily payday lenders and auto title lenders. These businesses must register with OCCC under Finance Code Chapter 393 and post a bond for each licensed location."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a Texas CAB bond cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Premium rates are typically 1%–3% of the $25,000 bond amount per location per year. A single-location CAB operator would pay $250–$750 per year. Multi-location operators pay per location. Exact rates depend on personal credit and business financial history."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need a separate bond for each location?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Each licensed CAB location in Texas requires its own OCCC license and its own surety bond. If you operate 5 locations, you need 5 separate bonds — one for each licensed site."
      }
    }
  ]
};

export default function CreditAccessBusinessBondTexas() {
  useSEO({
    title: "Texas Credit Access Business (CAB) Bond | OCCC Required | Quantum Surety",
    description: "Get your OCCC-required Texas credit access business (CAB) surety bond for payday and title loan companies. $25,000 per-location bond, instant approval, same-day certificate.",
    canonical: "https://quantumsurety.bond/bonds/credit-access-business-bond-texas",
  });
  useSchema([SERVICE_SCHEMA, FAQ_SCHEMA]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Shield className="w-4 h-4" /> OCCC Required — Finance Code Ch. 393
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Texas Credit Access Business Bond</h1>
          <p className="text-xl text-orange-200 mb-8 max-w-2xl mx-auto">
            OCCC requires a $25,000 surety bond per licensed location for Texas payday and title loan companies. Get yours quickly — instant approval, same-day certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-bond?type=credit-access-business">
              <Button size="lg" className="bg-white text-orange-900 hover:bg-orange-50 font-semibold px-8">
                Get My CAB Bond <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-orange-50 border-b border-orange-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <DollarSign className="w-5 h-5" />, label: "Starting premium", value: "$250/yr" },
            { icon: <FileText className="w-5 h-5" />, label: "Bond amount", value: "$25,000" },
            { icon: <Clock className="w-5 h-5" />, label: "Certificate", value: "Same day" },
            { icon: <Shield className="w-5 h-5" />, label: "Per", value: "Location" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div className="text-orange-600 mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* What it is */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Credit Access Business Bond — Overview</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            A <strong>Credit Access Business (CAB)</strong> in Texas is any entity that — for compensation — obtains or arranges consumer credit in amounts of $1,500 or less. This covers payday lenders (cash advances), auto title loan companies, and similar short-term lenders. Texas Finance Code Chapter 393 governs CABs.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every CAB must register each physical location with OCCC. As part of that registration, a <strong>$25,000 surety bond</strong> is required per location. The bond protects Texas consumers from losses caused by unlawful practices — misrepresentation of fees, unauthorized charges, or failure to comply with Chapter 393 disclosure requirements.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Texas has thousands of licensed CAB locations statewide. Whether you're opening a new location or renewing an existing one, Quantum Surety can issue your bond the same day.
          </p>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">OCCC CAB License Requirements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "$25,000 Surety Bond per Location", desc: "Each licensed location needs its own bond. Multi-location operators must bond each site separately. Bond must name OCCC/State of Texas as obligee." },
              { title: "Annual Registration Renewal", desc: "CAB registrations and bonds renew annually. A bond lapse results in automatic registration suspension for that location." },
              { title: "Chapter 393 Disclosures", desc: "CABs must provide OCCC-mandated disclosures to borrowers before each transaction. The bond protects consumers from losses from disclosure failures." },
              { title: "Local Ordinance Compliance", desc: "Cities including Austin, Dallas, Houston, San Antonio, and others have enacted local CAB ordinances with additional requirements. Check local rules for each location." },
            ].map((r) => (
              <div key={r.title} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{r.title}</h3>
                    <p className="text-sm text-gray-600">{r.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Operating Without Registration Is a Violation</h3>
            <p className="text-red-800 text-sm">
              An unregistered CAB is subject to OCCC enforcement action, cease and desist orders, and civil penalties up to $1,000 per violation per day. Each day of unlicensed operation is a separate violation. Ensure every location is registered and bonded before opening.
            </p>
          </div>
        </div>

        {/* Steps */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your CAB Bond Today</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Apply Online", desc: "Provide your business name, location address, and basic underwriting information. Multi-location operators can apply for all locations in one session." },
              { step: "2", title: "Approve and Pay", desc: "Most applicants get an instant decision. Pay online by credit or debit card. Volume discounts may apply for operators with 5+ locations." },
              { step: "3", title: "Receive Certificate", desc: "Your signed bond certificate is emailed as a PDF immediately. Submit it with your OCCC CAB registration for each location." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Does an online-only payday lender need this bond?",
                a: "If your business originates or arranges payday or title loans to Texas residents online — even without a physical Texas presence — you may still be subject to OCCC's CAB requirements. OCCC has taken the position that internet-based lenders serving Texas customers fall under Chapter 393. Consult legal counsel if you're operating in this area."
              },
              {
                q: "What's the difference between the bond and the CAB registration fee?",
                a: "The OCCC registration fee is paid directly to OCCC as a government fee (typically $200–$500 per location per year). The bond is a separate obligation — a contract between you, the surety company, and the State of Texas. The premium you pay for the bond goes to Quantum Surety, not to OCCC."
              },
              {
                q: "Can I get multi-location discounts?",
                a: "Yes. Contact us if you're bonding 5 or more locations — we can often negotiate a better blended rate from the surety underwriter for volume business."
              },
            ].map((faq) => (
              <details key={faq.q} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <summary className="font-semibold text-gray-900 cursor-pointer">{faq.q}</summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-orange-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your CAB Bond — Same Day</h2>
          <p className="text-orange-200 mb-6">Instant approval. Certificate emailed immediately. File with OCCC today.</p>
          <Link href="/get-bond?type=credit-access-business">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 font-semibold px-8">
              Get My CAB Bond <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Related */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: "/bonds/collection-agency-bond-texas", label: "Collection Agency Bond", desc: "$10,000 OCCC bond" },
              { href: "/bonds/mortgage-broker-bond-texas", label: "Mortgage Company Bond", desc: "$50K–$250K TDSML bond" },
              { href: "/bonds/license-bond-texas", label: "License & Permit Bond", desc: "General business license bonds" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  <p className="text-orange-600 text-xs mt-2 font-medium flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
