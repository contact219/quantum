import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, Award, Briefcase, DollarSign, ChevronRight } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas License & Permit Bonds",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/license-permit-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas license and permit (L&P) surety bonds for contractors, insurance adjusters, mortgage brokers, mixed beverage dealers, and other licensed businesses. Required by TDLR, TDI, TDHCA, TABC, and city/county licensing authorities.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "50", "unitText": "per year" } }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a Texas license and permit bond?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas license and permit (L&P) bond is a surety bond required by a Texas state agency, county, or municipality as a condition of issuing a business license or permit. It guarantees the licensed business will comply with applicable laws and regulations. If the business causes harm, injured parties can file a claim against the bond to recover damages." } },
    { "@type": "Question", "name": "Who requires license and permit bonds in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Multiple Texas agencies require L&P bonds: TDLR (contractor, electrician, HVAC, plumber, irrigator licenses), TDI (insurance adjuster and agency bonds), TDHCA (mortgage company bonds), the Texas Comptroller (sales tax bonds), TABC (mixed beverage permit bonds), and hundreds of individual city and county licensing authorities." } },
    { "@type": "Question", "name": "How much does a Texas L&P bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "Most Texas L&P bonds cost $50–$300 per year. Standard amounts ($10,000–$50,000) can often be issued instantly with a simple application. Larger bonds or applicants with credit challenges may require underwriting review. Quantum Surety offers same-day issuance for most standard L&P bond amounts." } },
    { "@type": "Question", "name": "How long does a Texas license bond last?", "acceptedAnswer": { "@type": "Answer", "text": "Most Texas L&P bonds run on a one-year term, coinciding with the annual license renewal cycle. Some bonds (such as mortgage company bonds) run on the same term as the license period and may be 1–2 years. Quantum Surety sends renewal reminders before your bond expires so your license stays in good standing." } },
    { "@type": "Question", "name": "Can I get a Texas L&P bond with bad credit?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Most standard Texas L&P bonds up to $50,000 are issued on a credit-approved basis, but specialty markets exist for applicants with poor credit. Rates for lower credit scores are higher but bonds are still available in most cases. Contact Quantum Surety to discuss your options." } },
    { "@type": "Question", "name": "What is the difference between a license bond and a permit bond?", "acceptedAnswer": { "@type": "Answer", "text": "A license bond is required to obtain a state or city business license (e.g., contractor's license, insurance adjuster license). A permit bond is required to obtain a specific work permit (e.g., a street excavation permit). In practice, both function identically as surety bonds and are often referred to together as L&P bonds." } }
  ]
};

const bondCategories = [
  {
    icon: Award,
    title: "Contractor License Bonds",
    description: "Required by TDLR and city licensing authorities for electricians, HVAC techs, plumbers, roofers, and general contractors.",
    bonds: [
      { name: "TDLR Contractor Bond", amount: "$10,000–$25,000", cost: "From $100/yr" },
      { name: "Electrical Contractor Bond", amount: "$5,000–$25,000", cost: "From $75/yr" },
      { name: "Plumbing Contractor Bond", amount: "$10,000", cost: "From $100/yr" },
      { name: "HVAC Contractor Bond", amount: "$10,000", cost: "From $100/yr" },
      { name: "Roofing Contractor Bond", amount: "$5,000–$20,000", cost: "From $75/yr" },
    ],
    href: "/bonds/license-bond-texas",
    cta: "View Contractor Bonds",
  },
  {
    icon: Briefcase,
    title: "Insurance & Financial Service Bonds",
    description: "Required by TDI and TDHCA for insurance adjusters, mortgage companies, and financial services businesses operating in Texas.",
    bonds: [
      { name: "Insurance Adjuster Bond", amount: "$10,000", cost: "From $75/yr" },
      { name: "Mortgage Company Bond", amount: "$50,000–$100,000", cost: "From $350/yr" },
      { name: "Mortgage Broker Bond", amount: "$50,000", cost: "From $300/yr" },
      { name: "Credit Services Bond", amount: "$10,000", cost: "From $100/yr" },
    ],
    href: "/quote?type=license",
    cta: "Get a Quote",
  },
  {
    icon: DollarSign,
    title: "Sales Tax & Excise Bonds",
    description: "Required by the Texas Comptroller for certain businesses to guarantee payment of state sales and excise taxes.",
    bonds: [
      { name: "Texas Sales Tax Bond", amount: "Varies (3× avg monthly tax)", cost: "From $100/yr" },
      { name: "Motor Fuel Tax Bond", amount: "Varies", cost: "From $150/yr" },
      { name: "Cigarette Tax Bond", amount: "Varies", cost: "From $100/yr" },
    ],
    href: "/quote?type=license",
    cta: "Get a Quote",
  },
  {
    icon: Shield,
    title: "TABC & Mixed Beverage Bonds",
    description: "Required by the Texas Alcoholic Beverage Commission for mixed beverage permittees to guarantee state tax remittance.",
    bonds: [
      { name: "Mixed Beverage Sales Tax Bond", amount: "$3,000–$40,000", cost: "From $75/yr" },
      { name: "Mixed Beverage Gross Receipts Bond", amount: "Varies", cost: "From $100/yr" },
    ],
    href: "/quote?type=license",
    cta: "Get a Quote",
  },
];

const agencyRequirements = [
  { agency: "TDLR (Texas Dept. of Licensing & Regulation)", types: "Contractor, HVAC, electrician, plumber, irrigator", amount: "$10,000–$25,000" },
  { agency: "TDI (Texas Dept. of Insurance)", types: "Insurance adjuster, agency, surplus lines", amount: "$10,000–$25,000" },
  { agency: "TDHCA (Texas Dept. of Housing & Community Affairs)", types: "Mortgage company, loan officer", amount: "$50,000–$100,000" },
  { agency: "Texas Comptroller", types: "Sales tax, motor fuel, tobacco", amount: "3× avg monthly liability" },
  { agency: "TABC (Texas Alcoholic Beverage Commission)", types: "Mixed beverage, retail dealer", amount: "$3,000–$40,000" },
  { agency: "City/County Authorities", types: "GC, specialty contractor, permit bonds", amount: "$5,000–$50,000" },
];

const faqs = [
  { q: "What is a Texas license and permit bond?", a: "A Texas license and permit (L&P) bond is a surety bond required by a Texas state agency, county, or municipality as a condition of issuing a business license or permit. It guarantees the licensed business will comply with applicable laws and regulations. If the business causes harm, injured parties can file a claim against the bond to recover damages." },
  { q: "Who requires license and permit bonds in Texas?", a: "Multiple Texas agencies require L&P bonds: TDLR (contractor, electrician, HVAC, plumber, irrigator licenses), TDI (insurance adjuster and agency bonds), TDHCA (mortgage company bonds), the Texas Comptroller (sales tax bonds), TABC (mixed beverage permit bonds), and hundreds of individual city and county licensing authorities." },
  { q: "How much does a Texas L&P bond cost?", a: "Most Texas L&P bonds cost $50–$300 per year. Standard amounts ($10,000–$50,000) can often be issued instantly with a simple application. Larger bonds or applicants with credit challenges may require underwriting review. Quantum Surety offers same-day issuance for most standard L&P bond amounts." },
  { q: "How long does a Texas license bond last?", a: "Most Texas L&P bonds run on a one-year term, coinciding with the annual license renewal cycle. Some bonds (such as mortgage company bonds) run on the same term as the license period and may be 1–2 years. Quantum Surety sends renewal reminders before your bond expires so your license stays in good standing." },
  { q: "Can I get a Texas L&P bond with bad credit?", a: "Yes. Most standard Texas L&P bonds up to $50,000 are issued on a credit-approved basis, but specialty markets exist for applicants with poor credit. Rates for lower credit scores are higher but bonds are still available in most cases." },
  { q: "What is the difference between a license bond and a permit bond?", a: "A license bond is required to obtain a state or city business license (e.g., contractor's license, insurance adjuster license). A permit bond is required to obtain a specific work permit (e.g., a street excavation permit). Both function identically as surety bonds and are often grouped as L&P bonds." },
];

export default function LicensePermitBondTexas() {
  useSEO({
    title: "Texas License & Permit Bonds | TDLR, Contractor, Adjuster, Mortgage | Quantum Surety",
    description: "Texas license and permit bonds for contractors, insurance adjusters, mortgage brokers, mixed beverage dealers, and more. TDLR, TDI, TDHCA, TABC requirements covered. From $50/yr. TDI-licensed #3480229.",
    canonical: "/bonds/license-permit-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-300 text-sm mb-6">
            <Link href="/"><span className="hover:text-white cursor-pointer">Home</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas License &amp; Permit Bonds</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Texas License &amp; Permit Bonds
          </h1>
          <p className="text-xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            Bonds required by TDLR, TDI, TDHCA, TABC, the Texas Comptroller, and local licensing authorities — for contractors, adjusters, mortgage companies, and more.
          </p>
          <p className="text-indigo-200 text-sm mb-8">
            From $50/yr · Same-day issuance on standard amounts · TDI Licensed #3480229
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote?type=license">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My L&amp;P Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Call (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "Starting price", value: "From $50/yr" },
            { label: "Issuance", value: "Same-day" },
            { label: "Agencies covered", value: "TDLR · TDI · TABC" },
            { label: "TDI License", value: "#3480229" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 border border-teal-100">
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bond categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Texas L&amp;P Bond Categories</h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Texas license and permit bonds span dozens of industries and agencies. Select the category that matches your license type.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {bondCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="border border-gray-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{cat.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{cat.description}</p>
                  <div className="space-y-2 mb-5">
                    {cat.bonds.map((b) => (
                      <div key={b.name} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                        <span className="font-medium text-gray-800">{b.name}</span>
                        <div className="flex gap-3 text-right">
                          <span className="text-gray-500">{b.amount}</span>
                          <span className="font-semibold text-indigo-700">{b.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href={cat.href}>
                    <Button size="sm" variant="outline" className="w-full">
                      {cat.cta} <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agency requirements table */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Texas L&amp;P Bond Requirements by Agency</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Each Texas regulatory agency sets its own bond amount and form requirements. Here's a quick reference:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Agency</th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Bond Types</th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Typical Amount</th>
                </tr>
              </thead>
              <tbody>
                {agencyRequirements.map((r, i) => (
                  <tr key={r.agency} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 font-medium text-gray-900">{r.agency}</td>
                    <td className="p-3 border border-gray-200 text-gray-600">{r.types}</td>
                    <td className="p-3 border border-gray-200 text-indigo-700 font-semibold">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Get Your Texas L&amp;P Bond — 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Tell us your license type", body: "Select your agency (TDLR, TDI, TABC, city, etc.) and tell us the bond amount required. Most L&P applications take under 5 minutes." },
              { step: "2", title: "Instant or same-day approval", body: "Standard bond amounts ($10,000–$50,000) are often approved instantly online. Larger or specialty bonds are reviewed same-day in most cases." },
              { step: "3", title: "Receive your bond certificate", body: "Your bond PDF is emailed immediately upon approval. We file directly with the agency on your behalf when required." },
            ].map((s) => (
              <div key={s.step} className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What does the bond cover */}
      <section className="py-12 px-4 bg-teal-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Does a Texas L&amp;P Bond Actually Cover?</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                A license and permit bond protects the public and the licensing authority — not the bondholder. If a licensed contractor or business violates the law, causes financial harm, or fails to pay required taxes, an injured party can file a claim against the bond.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                The surety pays valid claims up to the bond amount. The bondholder is then obligated to reimburse the surety — so a bond is not insurance for the licensee, but a guarantee to the public.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { who: "Customers / consumers", what: "Harmed by unlicensed or fraudulent work" },
                { who: "Subcontractors / suppliers", what: "Unpaid for work or materials on permitted projects" },
                { who: "State tax authorities", what: "Unpaid sales tax, excise tax, or mixed beverage tax" },
                { who: "Licensing agency", what: "Regulatory violations or license misuse" },
              ].map((row) => (
                <div key={row.who} className="bg-white rounded-lg p-4 border border-teal-100 flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{row.who}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{row.what}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Texas License &amp; Permit Bond FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{faq.q}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related bonds */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Texas Bond Pages</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Contractor License Bond Texas", slug: "license-bond-texas", desc: "TDLR, electrical, HVAC, plumbing, and GC license bonds." },
              { name: "Texas Construction Bonds", slug: "construction-bond-texas", desc: "Bid, performance, and payment bonds for public projects." },
              { name: "Texas GDN Dealer Bond", slug: "gdn-bond-texas", desc: "Motor vehicle dealer bond — $50,000 required by TxDMV." },
              { name: "Texas Notary Bond", slug: "notary-bond-texas", desc: "$50 flat, $10,000 coverage, instant PDF." },
              { name: "Texas Bonded Title Bond", slug: "bonded-title-texas", desc: "Bonded title surety bond for vehicles without a clear title." },
              { name: "All Texas Bonds", slug: "", desc: "Browse the full Quantum Surety bond catalog." },
            ].map((b) => (
              <Link key={b.name} href={b.slug ? `/bonds/${b.slug}` : "/"}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{b.name}</p>
                  <p className="text-gray-500 text-xs mb-2">{b.desc}</p>
                  <p className="text-indigo-600 text-xs font-medium">View details →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Your Texas License &amp; Permit Bond Today</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Same-day issuance on most standard amounts · All Texas regulatory agencies · From $50/yr · TDI Licensed #3480229
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote?type=license">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
                Get My L&amp;P Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Call (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
