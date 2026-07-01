import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertTriangle, DollarSign, Clock, Shield, FileText } from "lucide-react";
import { Link } from "wouter";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Collection Agency Bond",
  "description": "OCCC-required surety bond for Texas collection agency license applicants. $10,000 bond, instant approval, same-day certificate.",
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
    "price": "100",
    "description": "Starting from $100/year for a $10,000 bond"
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What bond is required for a Texas collection agency license?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Texas Finance Code Chapter 392 and OCCC rules require every licensed third-party debt collection agency to maintain a $10,000 surety bond payable to the State of Texas. The bond protects consumers from losses caused by unlawful collection practices."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a Texas collection agency bond cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The annual premium is typically $100–$300 for a $10,000 bond (1%–3% rate). Applicants with good credit (700+) usually qualify for the 1% rate at $100/year. Rates may be higher for applicants with credit challenges or recent business issues."
      }
    },
    {
      "@type": "Question",
      "name": "Who regulates collection agencies in Texas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Texas Office of Consumer Credit Commissioner (OCCC) licenses and regulates third-party debt collectors under Finance Code Chapter 392. Debt buyers are separately regulated. The OCCC bond must be filed as part of the license application through NMLS."
      }
    },
    {
      "@type": "Question",
      "name": "Does a first-party collector (collecting own debts) need this bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The OCCC collection agency license (and the associated bond) applies to third-party collectors — companies that collect debts on behalf of creditors. First-party collectors who collect only their own company's debts are generally exempt from the third-party collection agency license requirement."
      }
    }
  ]
};

export default function CollectionAgencyBondTexas() {
  useSEO({
    title: "Texas Collection Agency Bond | $100/yr | OCCC Required | Quantum Surety",
    description: "Get your OCCC-required $10,000 Texas collection agency surety bond for $100/year. Instant online approval, same-day certificate. File with OCCC through NMLS.",
    canonical: "https://quantumsurety.bond/bonds/collection-agency-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Shield className="w-4 h-4" /> OCCC Required — Finance Code Ch. 392
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Texas Collection Agency Bond</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            The OCCC requires a $10,000 surety bond to license your Texas collection agency. Get yours for $100/year — instant approval, same-day certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-bond?type=collection-agency">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-50 font-semibold px-8">
                Get My Collection Agency Bond <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <DollarSign className="w-5 h-5" />, label: "Annual premium", value: "$100/yr" },
            { icon: <FileText className="w-5 h-5" />, label: "Bond amount", value: "$10,000" },
            { icon: <Clock className="w-5 h-5" />, label: "Certificate", value: "Same day" },
            { icon: <Shield className="w-5 h-5" />, label: "Regulator", value: "OCCC" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div className="text-slate-600 mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* What it is */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Collection Agency Bond — What You Need to Know</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Any business that operates as a <strong>third-party debt collector</strong> in Texas — collecting debts owed to another party — must hold a collection agency license from the Office of Consumer Credit Commissioner (OCCC) under Texas Finance Code Chapter 392. A $10,000 surety bond is a mandatory component of that license.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            The bond protects Texas consumers from financial losses caused by unlawful collection practices: harassment, false representations, unauthorized fees, or misapplication of payments. If a valid claim is filed and proven, the surety pays up to $10,000 to the claimant — and then seeks reimbursement from the bonded agency.
          </p>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">OCCC Collection Agency License Requirements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "$10,000 Surety Bond", desc: "Filed with OCCC through NMLS. Bond must name the State of Texas as obligee and be maintained continuously while the license is active." },
              { title: "NMLS Application", desc: "Texas collection agency licenses are applied for through NMLS. The bond certificate is uploaded as part of the licensing application." },
              { title: "Annual Renewal", desc: "Licenses and bonds renew annually. Lapsed bond coverage results in license suspension and requires reinstatement before you can resume operations." },
              { title: "Branch Locations", desc: "If your agency has multiple Texas branch locations, each branch that independently engages in collection activities may require its own license and bond." },
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
            <h3 className="font-semibold text-amber-900 mb-2">Operating Without a License Is a Criminal Offense</h3>
            <p className="text-amber-800 text-sm">
              Under Texas Finance Code § 392.101, operating as a third-party debt collector without a license is a Class A misdemeanor — punishable by up to a year in jail and a $4,000 fine. Each violation is a separate offense. Secure your license and bond before contacting any Texas debtor on behalf of a third-party creditor.
            </p>
          </div>
        </div>

        {/* Steps */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your Bond in 3 Steps</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Apply Online — 5 Minutes", desc: "Complete our secure online form with your agency name, NMLS ID, and basic information. No in-person visit required." },
              { step: "2", title: "Instant Approval", desc: "Most applicants receive an instant decision. Pay $100 by credit or debit card online." },
              { step: "3", title: "Receive Certificate — Same Day", desc: "We email your signed PDF bond certificate immediately. Upload it directly to your NMLS collection agency application." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{s.step}</div>
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
                q: "Does a debt buyer need this bond?",
                a: "Debt buyers who purchase debts and collect for their own account may be subject to a separate OCCC license type depending on the debt type and collection methods. Contact OCCC directly to determine whether your specific business model requires the collection agency license or a different license category."
              },
              {
                q: "What if I only collect medical debts?",
                a: "The OCCC collection agency license covers third-party collection of most consumer debt types, including medical debt. If your agency collects medical debts owed by Texas consumers to third-party healthcare providers, you likely need the OCCC license and associated bond."
              },
              {
                q: "Can I get coverage with a prior judgment or tax lien?",
                a: "Possibly. We work with multiple surety underwriters and can often find coverage for applicants with challenging credit histories. Premium rates will be higher (3%–5%), but coverage is usually available. Apply online for a free quote."
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
        <section className="bg-slate-800 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Collection Agency Bond — $100/yr</h2>
          <p className="text-slate-300 mb-6">Same-day certificate. File through NMLS with your OCCC application today.</p>
          <Link href="/get-bond?type=collection-agency">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8">
              Apply Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Related */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: "/bonds/mortgage-broker-bond-texas", label: "Mortgage Company Bond", desc: "$50K–$250K TDSML bond" },
              { href: "/bonds/credit-access-business-bond-texas", label: "Credit Access Business Bond", desc: "OCCC CAB license bond" },
              { href: "/bonds/license-bond-texas", label: "License & Permit Bond", desc: "General business license bonds" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  <p className="text-slate-600 text-xs mt-2 font-medium flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
