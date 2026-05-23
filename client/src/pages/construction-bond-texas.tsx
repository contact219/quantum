import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, Building2, FileText, DollarSign, Clock } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Construction Bonds",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/construction-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Bid bonds, performance bonds, and payment bonds for Texas construction projects. Required under Texas Government Code § 2253 (Texas Little Miller Act) for public contracts over $25,000. TDI-licensed surety agency.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "0.5", "maxPrice": "3", "unitText": "percent of bond amount annually" } }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What construction bonds are required in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Texas Government Code § 2253 (the Texas Little Miller Act) requires both a performance bond and a payment bond on public contracts over $25,000. A bid bond is required at the bidding stage for most public projects. Private project owners often require the same bonds at varying contract thresholds." } },
    { "@type": "Question", "name": "How much does a construction bond cost in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Texas construction bond rates typically range from 0.5% to 3% of the contract value annually. A $500,000 bond usually costs $2,500–$15,000. Bid bonds are frequently issued at no charge or a nominal fee when a performance bond is also quoted." } },
    { "@type": "Question", "name": "What is the Texas Little Miller Act?", "acceptedAnswer": { "@type": "Answer", "text": "The Texas Little Miller Act (Government Code § 2253) requires performance and payment bonds on public construction contracts over $25,000. It mirrors the federal Miller Act, which applies to federal projects over $150,000, but governs state, county, and municipal projects in Texas." } },
    { "@type": "Question", "name": "Can I get a construction bond with bad credit?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Specialty surety markets exist for contractors with credit challenges. Rates will be higher (2%–5%) and collateral may be required. Quantum Surety works with multiple carriers to find options for most credit profiles." } },
    { "@type": "Question", "name": "How long does it take to get a Texas construction bond?", "acceptedAnswer": { "@type": "Answer", "text": "Bonds under $500,000 can often be approved same-day or next business day. Projects over $1M typically require financial statements and take 2–5 business days. Submit early to avoid delays during the bid process." } },
    { "@type": "Question", "name": "Do I need a separate bond for each Texas project?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Construction bonds are project-specific — each contract requires its own performance, payment, and bid bonds. Quantum Surety handles as many projects simultaneously as your bonding capacity supports." } }
  ]
};

const bondTypes = [
  {
    name: "Bid Bond",
    slug: "bid-bond-texas",
    icon: FileText,
    amount: "5–10% of bid",
    cost: "Free–$500",
    description: "Guarantees you'll honor your bid and proceed to contract if selected. Required on most Texas public project bids.",
    when: "At the bidding stage — before the contract is awarded.",
  },
  {
    name: "Performance Bond",
    slug: "performance-bond-texas",
    icon: Shield,
    amount: "100% of contract",
    cost: "0.5%–3%",
    description: "Guarantees you'll complete the project according to the contract terms. Required on all Texas public contracts over $25,000.",
    when: "At contract execution — alongside the payment bond.",
  },
  {
    name: "Payment Bond",
    slug: "payment-bond-texas",
    icon: DollarSign,
    amount: "100% of contract",
    cost: "Bundled with performance",
    description: "Guarantees you'll pay subcontractors, laborers, and suppliers. Required on all Texas public contracts over $25,000.",
    when: "At contract execution — always issued with the performance bond.",
  },
];

const requirements = [
  { project: "Texas state agency contracts", threshold: "$25,000+", authority: "Texas Gov. Code § 2253" },
  { project: "County & municipal contracts", threshold: "$25,000+", authority: "Texas Gov. Code § 2253" },
  { project: "School district contracts", threshold: "$25,000+", authority: "Texas Education Code" },
  { project: "Federal contracts in Texas", threshold: "$150,000+", authority: "Miller Act (40 U.S.C. § 3131)" },
  { project: "TxDOT highway projects", threshold: "All contracts", authority: "TxDOT Standard Specs" },
  { project: "Private commercial projects", threshold: "Varies by owner", authority: "Contract requirement" },
];

const faqs = [
  { q: "What construction bonds are required in Texas?", a: "Texas Government Code § 2253 (the Texas Little Miller Act) requires both a performance bond and a payment bond on public contracts over $25,000. A bid bond is required at the bidding stage for most public projects. Private project owners often require the same bonds at varying contract thresholds." },
  { q: "How much does a construction bond cost in Texas?", a: "Texas construction bond rates typically range from 0.5% to 3% of the contract value annually. A $500,000 bond usually costs $2,500–$15,000. Bid bonds are frequently issued at no charge or a nominal fee when a performance bond is also quoted." },
  { q: "What is the Texas Little Miller Act?", a: "The Texas Little Miller Act (Government Code § 2253) requires performance and payment bonds on public construction contracts over $25,000. It mirrors the federal Miller Act, which applies to federal projects over $150,000, but governs state, county, and municipal projects in Texas." },
  { q: "Can I get a construction bond with bad credit?", a: "Yes. Specialty surety markets exist for contractors with credit challenges. Rates will be higher (2%–5%) and collateral may be required. Quantum Surety works with multiple carriers to find options for most credit profiles." },
  { q: "How long does it take to get a Texas construction bond?", a: "Bonds under $500,000 can often be approved same-day or next business day. Projects over $1M typically require financial statements and take 2–5 business days. Submit early to avoid delays during the bid process." },
  { q: "Do I need a separate bond for each Texas project?", a: "Yes. Construction bonds are project-specific — each contract requires its own performance, payment, and bid bonds. Quantum Surety handles as many projects simultaneously as your bonding capacity supports." },
];

export default function ConstructionBondTexas() {
  useSEO({
    title: "Texas Construction Bonds | Bid, Performance & Payment Bonds | Quantum Surety",
    description: "Get Texas construction bonds fast — bid bonds, performance bonds, and payment bonds. Required under Texas Little Miller Act § 2253 for public contracts over $25,000. TDI-licensed, A-rated carriers, same-day approvals.",
    canonical: "/bonds/construction-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Building2 className="w-4 h-4" />
            Texas Construction Bonds
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Texas Construction Bonds for Contractors
          </h1>
          <p className="text-xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            Bid bonds, performance bonds, and payment bonds for Texas public and private construction projects.
            TDI-licensed · A-rated carriers · Fast approvals.
          </p>
          <p className="text-indigo-200 text-sm mb-8">
            Required under Texas Government Code § 2253 (Little Miller Act) for public contracts over $25,000
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get a Construction Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ai-bond-finder">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Talk to Our Bond Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "Typical rate", value: "0.5%–3%" },
            { label: "Public contract threshold", value: "$25,000+" },
            { label: "Approval time", value: "Same day" },
            { label: "TDI License", value: "#3480229" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 border border-teal-100">
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three bond types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            The Three Texas Construction Bond Types
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Most Texas public construction projects require all three bonds — issued together by Quantum Surety in a single application process.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {bondTypes.map((bond) => {
              const Icon = bond.icon;
              return (
                <div key={bond.name} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{bond.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{bond.description}</p>
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Bond amount</span>
                      <span className="font-semibold text-gray-900">{bond.amount}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Typical cost</span>
                      <span className="font-semibold text-indigo-700">{bond.cost}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Required when</span>
                      <span className="font-semibold text-gray-700 text-right max-w-[120px]">{bond.when}</span>
                    </div>
                  </div>
                  <Link href={`/bonds/${bond.slug}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      Learn More <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Texas Little Miller Act */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Texas Little Miller Act — Who Needs Construction Bonds?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Texas Government Code § 2253 — the Texas Little Miller Act — mandates performance and payment bonds on all public construction contracts exceeding $25,000. Here's a breakdown by project type:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Project Type</th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Bond Threshold</th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">Legal Authority</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((r, i) => (
                  <tr key={r.project} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 font-medium text-gray-900">{r.project}</td>
                    <td className="p-3 border border-gray-200 text-indigo-700 font-semibold">{r.threshold}</td>
                    <td className="p-3 border border-gray-200 text-gray-600">{r.authority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to get bonds */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            How to Get Texas Construction Bonds — 3 Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Submit your project details",
                body: "Tell us the contract value, project type, owner (obligee), and your business and credit history. Takes about 10 minutes for straightforward projects.",
              },
              {
                step: "2",
                title: "Underwriting & approval",
                body: "Quantum Surety's AI-assisted underwriting pre-screens your application across multiple A-rated carriers. Simple projects get same-day approval; complex ones 2–5 business days.",
              },
              {
                step: "3",
                title: "Receive your bond",
                body: "Bonds are delivered digitally or as wet-signed originals as required by the obligee. We coordinate directly with project owners when needed.",
              },
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

      {/* Cost section */}
      <section className="py-12 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Texas Construction Bond Cost Estimates
          </h2>
          <p className="text-gray-600 text-sm mb-8">Performance + payment bond combined premium. Rates vary by credit, capacity, and project type.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { range: "$100K contract", cost: "$500–$3,000" },
              { range: "$500K contract", cost: "$2,500–$15,000" },
              { range: "$1M contract", cost: "$5,000–$30,000" },
              { range: "$5M contract", cost: "$25,000–$100,000" },
            ].map((item) => (
              <div key={item.range} className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="text-xs text-gray-500 mb-1">{item.range}</div>
                <div className="text-lg font-bold text-indigo-700">{item.cost}</div>
                <div className="text-xs text-gray-400">est. annual premium</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What carriers look for */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Underwriters Look for in Texas Construction Bond Applications
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">Surety underwriters evaluate the "Three Cs" — Credit, Capacity, and Character.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Credit",
                items: ["Personal credit score (most weight for bonds under $500K)", "Business credit history", "Existing debt obligations", "No recent judgments or bankruptcies"],
              },
              {
                title: "Capacity",
                items: ["Working capital available", "Current project backlog vs. available bandwidth", "Equipment owned or leased", "Years in business and experience in the project type"],
              },
              {
                title: "Character",
                items: ["Track record of completed projects", "References from prior owners or GCs", "No license violations or complaints", "Professionalism in application and communication"],
              },
            ].map((c) => (
              <div key={c.title} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">{c.title}</h3>
                <ul className="space-y-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Texas Construction Bond FAQ</h2>
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
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Texas Bond Pages</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Bid Bond Texas", slug: "bid-bond-texas", desc: "Required at the bidding stage for Texas public projects." },
              { name: "Performance Bond Texas", slug: "performance-bond-texas", desc: "Guarantees project completion per contract terms." },
              { name: "Payment Bond Texas", slug: "payment-bond-texas", desc: "Protects subcontractors and suppliers on Texas projects." },
              { name: "General Contractor Bond", slug: "general-contractor-bond-texas", desc: "License and permit bonds for Texas general contractors." },
              { name: "TDLR Contractor Bond", slug: "tdlr-bond-texas", desc: "Required for TDLR-licensed trades in Texas." },
              { name: "All Contractor Bonds", slug: "texas-contractor", desc: "Full overview of bond options for Texas contractors." },
            ].map((b) => (
              <Link key={b.name} href={`/bonds/${b.slug}`}>
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
          <h2 className="text-3xl font-bold mb-4">Get Your Texas Construction Bond</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Submit your project details and get a same-day quote on bid, performance, and payment bonds.
            A-rated carriers · TDI Licensed #3480229 · All 254 Texas Counties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
                Start My Bond Application <ArrowRight className="w-4 h-4 ml-2" />
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
