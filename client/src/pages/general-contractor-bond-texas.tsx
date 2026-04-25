import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, AlertCircle, Building2, Zap } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas General Contractor Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/general-contractor-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond", "telephone": "+19723799216" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas general contractor bond required for city and county GC licenses. Instant issue available for bonds under $25,000. Competitive rates from a TDI-licensed surety agency.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "50", "maxPrice": "300", "unitText": "USD annually" } }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a Texas general contractor bond?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas general contractor bond (also called a GC license bond) is a surety bond required by cities, counties, or the state as a condition of obtaining or renewing a general contractor license. It protects consumers and the public against contractor misconduct, incomplete work, or failure to follow local building codes." } },
    { "@type": "Question", "name": "Do I need a GC bond to work in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Texas does not have a statewide general contractor license, but many cities and counties require GC registration or licensing with a surety bond. Austin, Dallas, Houston, San Antonio, and Fort Worth all have local requirements. TDLR requires bonds for specific licensed trades (electricians, plumbers, HVAC, etc.)." } },
    { "@type": "Question", "name": "How much does a Texas general contractor bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "For typical GC license bond amounts of $5,000–$25,000, annual premiums range from $50–$300. Most contractors with standard credit qualify at the low end of this range. Bonds under $25,000 can often be issued without a credit check at a flat rate." } },
    { "@type": "Question", "name": "Can I get a Texas GC bond with bad credit?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. For GC license bonds under $25,000, credit is generally not a barrier — many carriers offer instant-issue bonds at a flat rate regardless of credit score. For larger bond amounts, credit is evaluated but options still exist for contractors with challenged credit." } },
    { "@type": "Question", "name": "How fast can I get a general contractor bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "For bonds under $25,000, same-day issuance is standard. Complete the application online and receive your bond document electronically, ready to submit to your city or county licensing office. Call (972) 379-9216 for urgent same-day requests." } }
  ]
};

export default function GeneralContractorBondTexas() {
  useSEO({
    title: "General Contractor Bond Texas | GC License Bond TX | Quantum Surety",
    description:
      "Texas general contractor bond — required for city and county GC licenses. Instant issue available, competitive rates. TDI-licensed surety agency. Get your free quote today.",
    canonical: "/bonds/general-contractor-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  const cityRequirements = [
    { city: "Austin", detail: "Austin requires a contractor registration with a $15,000 surety bond for general building contractors operating within city limits." },
    { city: "Dallas", detail: "Dallas requires GC registration and a surety bond ranging from $10,000–$25,000 depending on scope and license classification." },
    { city: "Houston", detail: "Houston requires a contractor license with a $10,000 bond for general contractors; specialty trades have separate TDLR licensing requirements." },
    { city: "San Antonio", detail: "San Antonio requires contractor registration with a surety bond; amounts vary by license type from $5,000 to $25,000." },
    { city: "Fort Worth", detail: "Fort Worth requires a general contractor license bond of $10,000–$25,000 for GCs performing work within the city." },
    { city: "TDLR licensed trades", detail: "Texas Department of Licensing and Regulation requires bonds for electricians, plumbers, HVAC contractors, and other licensed trades operating statewide." },
  ];

  const howItWorks = [
    {
      title: "What a GC bond guarantees",
      body: "A general contractor license bond protects consumers, cities, and counties against contractor misconduct — including code violations, incomplete work, failure to obtain permits, or fraudulent practices. It is not a performance bond on a specific project.",
    },
    {
      title: "Bond amounts by jurisdiction",
      body: "Typical Texas GC license bond amounts range from $5,000 to $25,000, set by the city or county. TDLR licensed trades may have state-mandated amounts. Contact your local licensing office or call us at (972) 379-9216 to confirm the exact amount required.",
    },
    {
      title: "Cost — as low as $50/year",
      body: "Most Texas GC license bonds cost $50–$300 per year. For bonds under $25,000, many contractors qualify for instant-issue pricing without a credit check. Larger bonds are credit-underwritten but remain competitively priced.",
    },
    {
      title: "No credit check under $25,000",
      body: "Bonds up to $25,000 are commonly available at a flat rate without a credit pull. Approval is same-day. Bonds are issued electronically and can be submitted directly to your licensing authority.",
    },
  ];

  const steps = [
    { step: "1", title: "Confirm your bond amount", body: "Contact your city, county, or TDLR to get the exact bond amount required for your license type. Most amounts are $5,000–$25,000." },
    { step: "2", title: "Apply online", body: "Complete our short application — takes under 5 minutes. For bonds under $25,000, no financial documents or credit check required." },
    { step: "3", title: "Receive your bond", body: "Approved bonds are issued electronically, typically the same day. Print or email the bond form directly to your licensing authority." },
    { step: "4", title: "Renew annually", body: "Most Texas GC license bonds are annual. We'll remind you before your renewal date so your license stays active without interruption." },
  ];

  const faqs = [
    {
      q: "What is a Texas general contractor bond?",
      a: "A Texas general contractor bond (also called a GC license bond) is a surety bond required by cities, counties, or the state as a condition of obtaining or renewing a general contractor license. It protects consumers and the public against contractor misconduct, incomplete work, or failure to follow local building codes.",
    },
    {
      q: "Do I need a GC bond to work in Texas?",
      a: "Texas does not have a statewide general contractor license, but many cities and counties require GC registration or licensing with a surety bond. Austin, Dallas, Houston, San Antonio, and Fort Worth all have local requirements. TDLR requires bonds for specific licensed trades — electricians, plumbers, HVAC contractors, and others operating statewide.",
    },
    {
      q: "How much does a Texas general contractor bond cost?",
      a: "For typical GC license bond amounts of $5,000–$25,000, annual premiums range from $50–$300. Most contractors with standard credit qualify at the low end of this range. Bonds under $25,000 can often be issued without a credit check at a flat rate — call (972) 379-9216 for your exact quote.",
    },
    {
      q: "Can I get a Texas GC bond with bad credit?",
      a: "Yes. For GC license bonds under $25,000, credit is generally not a barrier — many carriers offer instant-issue bonds at a flat rate regardless of credit score. For larger bond amounts, credit is evaluated but options still exist for contractors with challenged credit histories.",
    },
    {
      q: "How fast can I get a general contractor bond in Texas?",
      a: "For bonds under $25,000, same-day issuance is standard. Complete the application online and receive your bond document electronically, ready to submit to your city or county licensing office. Call (972) 379-9216 for urgent same-day requests.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Building2 className="w-4 h-4" />
            Texas Contractor License Bonds
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Texas General Contractor Bond
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get the GC license bond your city or county requires — same-day issuance available,
            no credit check for bonds under $25,000. TDI-licensed and A-rated carrier partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Free GC Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:+19723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Call (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* City requirements */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Which Texas Cities &amp; Counties Require a GC Bond?
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Texas does not license general contractors at the state level, but major cities, counties, and TDLR all have bonding requirements for contractors operating within their jurisdictions.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {cityRequirements.map((p) => (
              <div key={p.city} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{p.city}</div>
                  <div className="text-sm text-gray-600">{p.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Requirements change. Confirm your exact bond amount and form with your local licensing authority before applying. Our team can help —{" "}
            <a href="tel:+19723799216" className="text-indigo-600 font-medium">(972) 379-9216</a>.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            How Texas GC License Bonds Work
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {howItWorks.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost callout */}
      <section className="py-12 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Texas GC Bond Cost Estimates
          </h2>
          <p className="text-gray-600 mb-6 text-sm max-w-xl mx-auto">
            Most Texas GC license bonds are small — and priced accordingly. Bonds under $25,000 can be issued without a credit check.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { range: "$5,000 bond", cost: "$50–$100" },
              { range: "$10,000 bond", cost: "$75–$150" },
              { range: "$25,000 bond", cost: "$150–$300" },
            ].map((item) => (
              <div key={item.range} className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="text-sm text-gray-500 mb-1">{item.range}</div>
                <div className="text-lg font-bold text-indigo-700">{item.cost}</div>
                <div className="text-xs text-gray-400">estimated annual premium</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Instant-issue pricing available for qualified applicants. Get an exact quote in minutes.
          </p>
        </div>
      </section>

      {/* How to apply */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How to Get Your Texas GC Bond — Same Day
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            The process is straightforward. Most contractors have their bond in hand the same day they apply.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links / related bonds */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Texas Contractor Bonds</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Texas Contractor Bond", href: "/bonds/texas-contractor" },
              { label: "TDLR Bond Texas", href: "/bonds/tdlr-bond-texas" },
              { label: "License Bond Texas", href: "/bonds/license-bond-texas" },
              { label: "Contractor Bond Dallas", href: "/bonds/contractor-bond-dallas" },
              { label: "Contractor Bond Houston", href: "/bonds/contractor-bond-houston" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
                  <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-indigo-700">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Texas General Contractor Bond FAQ
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Your Texas GC License Bond Today</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Same-day issuance for bonds under $25,000. No credit check required.
            TDI-licensed agency — A-rated carrier partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
                Start My Bond Application <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:+19723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Call (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
