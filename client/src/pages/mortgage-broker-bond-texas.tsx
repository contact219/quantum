import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertTriangle, DollarSign, Clock, Shield } from "lucide-react";
import { Link } from "wouter";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Mortgage Company Surety Bond",
  "description": "TDSML-required surety bond for Texas mortgage company license applicants. $50,000–$250,000 bond, instant approval, same-day certificate.",
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
    "price": "500",
    "description": "Starting from $500/year for a $50,000 bond (1% rate for qualified applicants)"
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What bond is required for a Texas mortgage company license?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Texas Finance Code Chapter 156 and TDSML rules require mortgage company licensees to file a surety bond. The required amount is $50,000 for companies funding up to $3 million annually, scaling up to $250,000 for companies funding over $25 million per year."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a Texas mortgage company bond cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Premium rates are typically 1%–3% of the bond amount per year. A $50,000 bond costs $500–$1,500/year. A $100,000 bond costs $1,000–$3,000/year. Exact rate depends on the principal's personal credit and business financials."
      }
    },
    {
      "@type": "Question",
      "name": "Does the bond amount change based on loan volume?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. TDSML uses a tiered schedule: $50,000 bond for up to $3M annual origination; $75,000 for $3M–$10M; $100,000 for $10M–$25M; $250,000 for over $25M. You must maintain the correct tier as your volume changes."
      }
    },
    {
      "@type": "Question",
      "name": "Who is the obligee on a Texas mortgage company bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The obligee is the Texas Department of Savings and Mortgage Lending (TDSML), 2601 North Lamar Blvd., Suite 201, Austin, TX 78705. The bond protects consumers who suffer losses from mortgage company misconduct."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to get the bond certificate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most applicants receive their bond certificate the same day after completing our online application and payment. We email the signed PDF immediately and can overnight the original if TDSML requires a wet signature."
      }
    }
  ]
};

export default function MortgageBrokerBondTexas() {
  useSEO({
    title: "Texas Mortgage Company Bond | TDSML Required | $500/yr | Quantum Surety",
    description: "Get your Texas mortgage company surety bond required by TDSML (Finance Code Ch. 156). $50K–$250K bonds from $500/year. Instant approval, same-day certificate.",
    canonical: "https://quantumsurety.bond/bonds/mortgage-broker-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Shield className="w-4 h-4" /> TDSML Required Bond
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Texas Mortgage Company Bond</h1>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            TDSML-required surety bond for Texas mortgage company license applicants. $50,000–$250,000 bonds. Same-day certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-bond?type=mortgage">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Mortgage Bond <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-indigo-50 border-b border-indigo-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <DollarSign className="w-5 h-5" />, label: "Starting at", value: "$500/yr" },
            { icon: <Clock className="w-5 h-5" />, label: "Certificate", value: "Same day" },
            { icon: <Shield className="w-5 h-5" />, label: "Bond amounts", value: "$50K–$250K" },
            { icon: <CheckCircle className="w-5 h-5" />, label: "Obligee", value: "TDSML" },
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
        {/* Bond amount tiers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bond Amount by Annual Origination Volume</h2>
          <p className="text-gray-600 mb-6">
            Texas Finance Code § 156.302 and TDSML rules set the required bond amount based on your company's annual mortgage origination volume. You must upgrade your bond tier as volume grows.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-900">Annual Origination</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Required Bond</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Est. Annual Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { vol: "Up to $3 million", bond: "$50,000", prem: "$500 – $1,500" },
                  { vol: "$3M – $10 million", bond: "$75,000", prem: "$750 – $2,250" },
                  { vol: "$10M – $25 million", bond: "$100,000", prem: "$1,000 – $3,000" },
                  { vol: "Over $25 million", bond: "$250,000", prem: "$2,500 – $7,500" },
                ].map((r) => (
                  <tr key={r.vol} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{r.vol}</td>
                    <td className="p-3 font-semibold text-gray-900">{r.bond}</td>
                    <td className="p-3 text-indigo-600 font-medium">{r.prem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">Rates shown are estimates. Final premium depends on personal credit score and business history. Most applicants with good credit qualify for the 1% rate.</p>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Texas Mortgage Company License Requirements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "TDSML Surety Bond", desc: "Filed directly with TDSML. Bond must name TDSML as obligee and remain in force while license is active." },
              { title: "NMLS Application", desc: "Texas mortgage company licenses are applied for through NMLS (Nationwide Mortgage Licensing System). Bond is uploaded as part of the application." },
              { title: "Net Worth Requirement", desc: "TDSML requires a minimum net worth of $25,000 for mortgage company applicants, in addition to the bond." },
              { title: "Annual Renewal", desc: "Bonds renew annually. TDSML requires continuous bond coverage — a lapse in coverage results in license suspension." },
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
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">Bond Tier Must Match Actual Volume</h3>
            <p className="text-amber-800 text-sm">
              TDSML requires you to increase your bond amount when your annual origination volume crosses a tier threshold. Failing to upgrade your bond while exceeding the threshold is a license violation. Monitor your origination volume quarterly and upgrade proactively.
            </p>
          </div>
        </div>

        {/* How to get bond */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Get Your Mortgage Company Bond</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Apply Online (5 minutes)", desc: "Complete our secure online application. We ask for your business name, NMLS ID, projected origination volume, and basic personal/credit information." },
              { step: "2", title: "Same-Day Approval", desc: "Most applicants receive an instant approval decision. We review credit and business history to determine your exact premium rate." },
              { step: "3", title: "Receive Bond Certificate", desc: "We email your signed bond certificate immediately after payment. Upload the PDF to NMLS or email it directly to TDSML as required." },
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

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is this bond required for individual loan officers?",
                a: "No. Individual residential mortgage loan originators (RMLOs) are licensed separately through NMLS under Finance Code Chapter 157 and are not required to carry a company bond. The bond under Chapter 156 applies to the mortgage company entity, not individual originators."
              },
              {
                q: "What happens if a claim is filed against the bond?",
                a: "If a Texas consumer or TDSML files a valid claim for borrower harm caused by your company's mortgage activities, the surety pays the claimant up to the bond amount. You are then obligated to reimburse the surety. This is why it's critical to operate in compliance with TDSML regulations."
              },
              {
                q: "Can I get a bond with less-than-perfect credit?",
                a: "Yes. We work with multiple surety markets and can typically get coverage for applicants with credit scores in the mid-600s. Applicants with lower scores may pay a higher premium rate (up to 3–5%). We'll give you a free quote with no commitment."
              },
              {
                q: "Does the bond cover all my branch locations?",
                a: "Yes. One TDSML bond covers your principal office and all branch locations operating under the same license. If you hold multiple separate licenses (e.g., different entities), each entity needs its own bond."
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
        <section className="bg-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Mortgage Company Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day certificate. Upload to NMLS and file with TDSML immediately.</p>
          <Link href="/get-bond?type=mortgage">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8">
              Apply Now — Takes 5 Minutes <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Related bonds */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond", desc: "$50 — 4-year term" },
              { href: "/bonds/auto-dealer-bond-texas", label: "GDN / Auto Dealer Bond", desc: "$25,000 dealer bond" },
              { href: "/bonds/freight-broker-bond-texas", label: "Freight Broker Bond", desc: "$75,000 BMC-84 bond" },
              { href: "/bonds/license-bond-texas", label: "License & Permit Bond", desc: "General business license bonds" },
              { href: "/bonds/auctioneer-bond-texas", label: "Auctioneer Bond", desc: "$10,000 TDLR bond" },
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
