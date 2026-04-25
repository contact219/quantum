import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, MapPin, Phone, Shield, TrendingUp } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Amarillo Development Services" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Amarillo / TDLR" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Amarillo / TDLR" },
  { type: "HVAC / Mechanical Bond", amount: "$10,000", authority: "City of Amarillo / TDLR" },
  { type: "Roofing Contractor Bond", amount: "$5,000", authority: "City of Amarillo Development Services" },
];

const faqs = [
  { q: "Does Amarillo require a contractor bond?", a: "Yes. The City of Amarillo Development Services department requires licensed contractors to maintain a surety bond as a condition of city contractor registration. Requirements apply to general contractors and specialty trades including electrical, plumbing, HVAC, and roofing." },
  { q: "Why is Amarillo a strong construction market?", a: "Amarillo is the economic hub of the Texas Panhandle, with growing activity in energy infrastructure, agriculture-related construction, and residential development. Large-scale wind energy projects, feedlot facility expansions, and commercial growth in the Loop 335 corridor continue to drive consistent demand for licensed, bonded contractors throughout the region." },
  { q: "How much does an Amarillo contractor bond cost?", a: "Most Amarillo contractors pay $100–$250/year for a $10,000 bond, and $200–$450/year for a $25,000 bond. Your exact premium is based primarily on personal credit score. Qualified applicants receive same-day approval at the lowest available rate — no lengthy underwriting process for standard bond amounts." },
  { q: "Do I need an Amarillo city bond AND a TDLR bond?", a: "Yes, if you hold a TDLR license (electrical, plumbing, HVAC/mechanical). TDLR requires a state-level license bond, and the City of Amarillo requires a separate city registration bond. Quantum Surety can issue both bonds simultaneously — just let us know your trade and we'll confirm exactly what's required." },
  { q: "Can I use my Amarillo contractor bond in Canyon or other Panhandle cities?", a: "No. Each municipality sets its own contractor licensing and bonding requirements. If you operate in multiple Panhandle cities or larger Texas metros like Lubbock or Dallas, you will need a separate bond for each jurisdiction. Quantum Surety can issue multiple city bonds at once through a single application process." },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Contractor Bond Amarillo TX",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/contractor-bond-amarillo",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "City", "name": "Amarillo", "containedInPlace": { "@type": "State", "name": "Texas" } },
  "description": "Contractor license bonds for Amarillo, Texas contractors. City of Amarillo Development Services bonding requirements for general, electrical, plumbing, HVAC, and roofing contractors.",
};

export default function ContractorBondAmarillo() {
  useSEO({
    title: "Contractor Bond Amarillo TX | Amarillo Contractor License Bond | Quantum Surety",
    description: "Contractor bond in Amarillo, TX — required for city contractor licenses. Same-day issuance. TDI-licensed surety agency. Get your free Amarillo bond quote today.",
    canonical: "/bonds/contractor-bond-amarillo",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <MapPin className="w-4 h-4" /> Amarillo, Texas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contractor Bond — Amarillo, Texas</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get your City of Amarillo contractor license bond same-day. The Panhandle's construction hub
            requires licensed, bonded contractors. TDI-licensed, A-rated carriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Amarillo Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
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

      <section className="py-6 px-4 bg-teal-50 border-b border-teal-200">
        <div className="max-w-4xl mx-auto flex items-start gap-4">
          <TrendingUp className="w-6 h-6 text-teal-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-teal-900">Hub of the Texas Panhandle Construction Market</p>
            <p className="text-teal-800 text-sm mt-1">
              Amarillo anchors the Texas Panhandle economy, with sustained construction activity driven by
              wind energy infrastructure, agricultural facility expansion, and commercial development along
              the Loop 335 corridor. Licensed, bonded contractors are in consistent demand across the region.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Amarillo Contractor Bond Requirements</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">The City of Amarillo Development Services sets bonding requirements by trade. Always verify with the city before applying.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Amarillo Contractors Choose Quantum Surety</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "TDI-Licensed Agency", body: "Licensed by the Texas Department of Insurance (#3480229). Your bond is backed by A-rated surety carriers approved in Texas." },
              { icon: <ArrowRight className="w-6 h-6 text-teal-600" />, title: "Same-Day Issuance", body: "Standard contractor bonds approved and delivered same-day. Keep your Amarillo projects moving without bonding delays." },
              { icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: "Multi-City Bonds", body: "Work across Amarillo, Lubbock, and the wider Panhandle region? We issue bonds for multiple cities simultaneously." },
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Amarillo Contractor Bond FAQ</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contractor Bonds in Nearby Cities</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "Lubbock", slug: "contractor-bond-lubbock" },
              { city: "Dallas", slug: "contractor-bond-dallas" },
              { city: "Fort Worth", slug: "contractor-bond-fort-worth" },
              { city: "Austin", slug: "contractor-bond-austin" },
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
          <h2 className="text-3xl font-bold mb-4">Get Your Amarillo Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-8">Same-day issuance. TDI-licensed agency. A-rated carriers. Stay competitive in Amarillo's active construction market.</p>
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
