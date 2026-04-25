import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, MapPin, Phone, Shield } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Lubbock Development Services" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Lubbock / TDLR" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Lubbock / TDLR" },
  { type: "HVAC / Mechanical Bond", amount: "$10,000", authority: "City of Lubbock / TDLR" },
  { type: "Roofing Contractor Bond", amount: "$5,000", authority: "City of Lubbock Development Services" },
];

const faqs = [
  { q: "Does Lubbock require a contractor bond?", a: "Yes. The City of Lubbock Development Services requires licensed contractors to maintain a surety bond as a condition of city contractor licensing. Requirements apply to general contractors and specialty trades including electrical, plumbing, HVAC, and roofing." },
  { q: "What bond amount is required in Lubbock?", a: "Bond amounts in Lubbock typically range from $5,000 for roofing contractors to $25,000 for general contractors. Most trade contractors (electrical, plumbing, HVAC) require a $10,000 bond. Always confirm the specific amount with the City of Lubbock Development Services before applying." },
  { q: "How much does a Lubbock contractor bond cost?", a: "Most Lubbock contractors pay $100–$250/year for a $10,000 bond, and $250–$500/year for a $25,000 bond. Rates depend on personal credit score. Qualified applicants are approved same-day at the lowest available rates." },
  { q: "Do wind energy contractors need a bond in Lubbock?", a: "Contractors working on utility-scale wind projects in West Texas typically require performance and payment bonds under the Miller Act or private project requirements — not city license bonds. City license bonds are required for work within Lubbock city limits. We issue both types." },
  { q: "Can I get both a TDLR bond and a Lubbock city bond?", a: "Yes. Many trades require both a TDLR state license bond and a separate city contractor bond for Lubbock. We can issue both simultaneously — tell us your trade and we'll identify exactly what's required." },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Contractor Bond Lubbock TX",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/contractor-bond-lubbock",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "City", "name": "Lubbock", "containedInPlace": { "@type": "State", "name": "Texas" } },
  "description": "Contractor license bonds for Lubbock, Texas contractors. City of Lubbock Development Services bonding requirements for general, electrical, plumbing, HVAC, and roofing contractors.",
};

export default function ContractorBondLubbock() {
  useSEO({
    title: "Contractor Bond Lubbock TX | Lubbock Contractor License Bond | Quantum Surety",
    description: "Contractor bond in Lubbock, TX — required for city contractor licenses. Same-day issuance. TDI-licensed surety agency. Get your free Lubbock bond quote today.",
    canonical: "/bonds/contractor-bond-lubbock",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <MapPin className="w-4 h-4" /> Lubbock, Texas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contractor Bond — Lubbock, Texas</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get your City of Lubbock contractor license bond same-day. Required for GC and trade contractor licenses.
            TDI-licensed, A-rated carriers, instant approval for standard amounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Lubbock Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Lubbock Contractor Bond Requirements</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">Bond requirements vary by trade. Always verify current amounts with the City of Lubbock Development Services before applying.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">License Type</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Bond Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Issuing Authority</th>
                </tr>
              </thead>
              <tbody>
                {bondTypes.map((row, i) => (
                  <tr key={row.type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-4 text-gray-800 font-medium">{row.type}</td>
                    <td className="p-4 text-indigo-700 font-bold">{row.amount}</td>
                    <td className="p-4 text-gray-600">{row.authority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Lubbock Contractors Choose Quantum Surety</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "TDI-Licensed Agency", body: "Licensed by the Texas Department of Insurance (#3480229). Your bond is backed by A-rated surety carriers." },
              { icon: <ArrowRight className="w-6 h-6 text-teal-600" />, title: "Same-Day Issuance", body: "Standard contractor bonds under $25,000 approved and delivered same-day in most cases." },
              { icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: "No Credit Check", body: "Most Lubbock contractor license bonds are issued instantly with no credit check required." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Lubbock Contractor Bond FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contractor Bonds in Other Texas Cities</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "Dallas", slug: "contractor-bond-dallas" },
              { city: "Houston", slug: "contractor-bond-houston" },
              { city: "Austin", slug: "contractor-bond-austin" },
              { city: "Fort Worth", slug: "contractor-bond-fort-worth" },
            ].map((c) => (
              <Link key={c.city} href={`/bonds/${c.slug}`}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer text-center">
                  <p className="font-semibold text-gray-900 mb-1">{c.city}</p>
                  <p className="text-indigo-600 text-xs font-medium">View requirements →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Your Lubbock Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-8">Same-day issuance. No credit check for standard amounts. TDI-licensed agency. A-rated carriers.</p>
          <Link href="/quote">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
              Get My Free Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
