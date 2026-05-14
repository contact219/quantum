import { useSEO, useSchema } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertTriangle, DollarSign, Clock, Shield, FileText } from "lucide-react";
import { Link } from "wouter";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Property Tax Consultant Bond",
  "description": "TDLR-required $5,000 surety bond for Texas property tax consultant license applicants. Instant approval, same-day certificate, $50/year.",
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
    "price": "50",
    "description": "$50/year for a $5,000 bond — instant online approval"
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What bond is required for a Texas property tax consultant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Texas Occupations Code Chapter 1152 and TDLR rules require every licensed property tax consultant to carry a $5,000 surety bond or certificate of deposit. The bond protects property owners from losses caused by a consultant's dishonest, fraudulent, or negligent acts."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a Texas property tax consultant bond cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The annual premium is typically $50 for a $5,000 bond (1% rate). Most applicants qualify at this rate regardless of credit score because the bond amount is small and the risk is low."
      }
    },
    {
      "@type": "Question",
      "name": "How long does the property tax consultant license term last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TDLR property tax consultant licenses are 2 years. Your bond must remain active for the full license term. You can choose to purchase a 2-year bond upfront (typically $90–$100) or renew annually."
      }
    },
    {
      "@type": "Question",
      "name": "Who is the obligee on the property tax consultant bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Texas Department of Licensing and Regulation (TDLR) is the obligee. The bond form must reference TDLR and be signed by a surety company licensed to do business in Texas."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use a certificate of deposit instead of a bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Texas Occupations Code § 1152.153 allows a CD as an alternative to a surety bond. However, a surety bond is far more practical — a CD requires you to lock up $5,000 in cash, while a bond typically costs only $50/year."
      }
    }
  ]
};

export default function PropertyTaxConsultantBondTexas() {
  useSEO({
    title: "Texas Property Tax Consultant Bond | $50/yr | TDLR Required | Quantum Surety",
    description: "Get your TDLR-required $5,000 Texas property tax consultant surety bond for $50/year. Instant online approval, same-day certificate. Covers full 2-year license term.",
    canonical: "https://quantumsurety.bond/bonds/property-tax-consultant-bond-texas",
  });
  useSchema([SERVICE_SCHEMA, FAQ_SCHEMA]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Shield className="w-4 h-4" /> TDLR Required — Chapter 1152
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Texas Property Tax Consultant Bond</h1>
          <p className="text-xl text-emerald-200 mb-8 max-w-2xl mx-auto">
            TDLR requires a $5,000 surety bond to obtain your Texas property tax consultant license. Get yours for $50/year — instant approval and same-day certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-bond?type=property-tax-consultant">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold px-8">
                Get My Bond — $50/yr <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-emerald-50 border-b border-emerald-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <DollarSign className="w-5 h-5" />, label: "Annual premium", value: "$50/yr" },
            { icon: <FileText className="w-5 h-5" />, label: "Bond amount", value: "$5,000" },
            { icon: <Clock className="w-5 h-5" />, label: "Certificate", value: "Same day" },
            { icon: <Shield className="w-5 h-5" />, label: "Regulator", value: "TDLR" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div className="text-emerald-600 mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* What it is */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is the Texas Property Tax Consultant Bond?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Texas Occupations Code Chapter 1152 requires anyone who represents property owners in ad valorem tax matters — filing protests, negotiating with appraisal districts, appearing at hearings — to hold a TDLR license as a <strong>Registered Property Tax Consultant</strong> (RPTC) or <strong>Senior Property Tax Consultant</strong> (SPTC).
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            As part of the licensing requirements, every consultant must maintain a <strong>$5,000 surety bond</strong> for the duration of their license. The bond is a financial guarantee: if you cause a loss to a property owner through fraud, negligence, or a breach of fiduciary duty, the surety company pays the claim — and you must then reimburse the surety.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With over 3,700 licensed property tax consultants in Texas — and more entering the field as property values rise — this is one of TDLR's most active licensing categories.
          </p>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">TDLR Licensing Requirements at a Glance</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "$5,000 Surety Bond", desc: "Must be on file with TDLR before your license is issued. Bond must name TDLR as obligee and be signed by a licensed Texas surety." },
              { title: "2-Year License Term", desc: "RPTC and SPTC licenses are valid for 2 years. Your bond must remain continuous for the full term — a lapse suspends your license." },
              { title: "Education Requirements", desc: "Registered consultants: 15 hours of TDLR-approved education. Senior consultants: additional qualifying experience plus the Certified Property Tax Consultant (CPTC) designation." },
              { title: "Background Check", desc: "TDLR performs a criminal history review. Certain convictions may disqualify an applicant; the board reviews each case individually." },
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

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Bond Must Be Continuous — No Gaps</h3>
            <p className="text-blue-800 text-sm">
              TDLR requires uninterrupted bond coverage. If your bond lapses — even for a single day — TDLR can suspend your license and require you to stop representing clients until coverage is restored. Renew your bond 30 days before expiration to avoid any gap.
            </p>
          </div>
        </div>

        {/* Steps */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Get Your Bond in 3 Steps</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Apply Online — 5 Minutes", desc: "Enter your name, license type (RPTC or SPTC), and contact information. No credit check required for the standard $50/year rate." },
              { step: "2", title: "Pay Securely Online", desc: "Pay $50 by credit or debit card. We accept all major cards. Your payment is processed immediately and securely." },
              { step: "3", title: "Receive Certificate — Same Day", desc: "Your signed bond certificate is emailed as a PDF immediately. Download it and upload directly to TDLR's online licensing portal." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{s.step}</div>
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
                q: "Do I need a separate bond for each client I represent?",
                a: "No. One $5,000 TDLR bond covers all your client relationships for the duration of your license term. The bond is a license bond, not a per-client bond."
              },
              {
                q: "What happens if my bond expires before my license does?",
                a: "TDLR will be notified by the surety company of a pending cancellation (usually 30 days' advance notice). If you don't renew before the expiration date, TDLR will suspend your license. You cannot legally represent clients until the bond is reinstated. Renewal takes minutes online and costs $50."
              },
              {
                q: "I'm an employee at a property tax consulting firm — do I need my own bond?",
                a: "Yes, if you hold an individual RPTC or SPTC license in your name. Individual licensee bonds are separate from any bond the firm may carry. Each licensed individual consultant must maintain their own bond."
              },
              {
                q: "Can I get the bond before I complete all the licensing requirements?",
                a: "Yes. In fact, many applicants get their bond first, since it's the fastest step. You can apply for and receive your bond today and include it with your TDLR application packet. The bond is valid immediately upon issuance."
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
        <section className="bg-emerald-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Property Tax Consultant Bond — $50</h2>
          <p className="text-emerald-200 mb-6">Instant approval. Same-day certificate. File with TDLR today.</p>
          <Link href="/get-bond?type=property-tax-consultant">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8">
              Get My TDLR Bond <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Related bonds */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: "/bonds/tdlr-bond-texas", label: "TDLR License Bond", desc: "General TDLR surety bond guide" },
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond", desc: "$50 — 4-year term" },
              { href: "/bonds/auctioneer-bond-texas", label: "Auctioneer Bond", desc: "$10,000 TDLR bond" },
              { href: "/bonds/home-inspector-bond-texas", label: "Home Inspector Bond", desc: "TREC home inspector license bond" },
              { href: "/bonds/mortgage-broker-bond-texas", label: "Mortgage Company Bond", desc: "$50K–$250K TDSML bond" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  <p className="text-emerald-600 text-xs mt-2 font-medium flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
