import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, MapPin, Phone, Shield } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Grand Prairie Building Inspection" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Grand Prairie / TDLR" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Grand Prairie / TDLR" },
  { type: "HVAC / Mechanical Bond", amount: "$10,000", authority: "City of Grand Prairie / TDLR" },
  { type: "Roofing Contractor Bond", amount: "$5,000", authority: "City of Grand Prairie Building Inspection" },
];

const faqs = [
  {
    q: "Does Grand Prairie require a contractor bond?",
    a: "Yes. The City of Grand Prairie requires licensed contractors to maintain a surety bond as a condition of city contractor registration. Requirements apply to general contractors and specialty trades including electrical, plumbing, HVAC, and roofing, administered through the Grand Prairie Building Inspection department.",
  },
  {
    q: "What makes Grand Prairie a strong construction market?",
    a: "Grand Prairie sits at the geographic center of the Dallas–Fort Worth metroplex, surrounded by major entertainment venues, industrial parks, and continuous residential development. Epic Waters Indoor Waterpark, major warehouse and logistics corridors, and suburban growth all fuel sustained demand for licensed, bonded contractors across every trade.",
  },
  {
    q: "How much does a Grand Prairie contractor bond cost?",
    a: "For a $5,000–$10,000 bond, most Grand Prairie contractors pay $100–$250/year. For a $25,000 bond, expect $250–$500/year. Rates depend on your personal credit score. Most applicants are approved same-day with no financial statements required for standard bond amounts.",
  },
  {
    q: "Do I need a Grand Prairie city bond AND a TDLR license bond?",
    a: "Yes, in many cases. TDLR covers your state-level credentials for electrical, plumbing, and HVAC work. The City of Grand Prairie requires a separate city-specific surety bond to pull permits and operate under a Grand Prairie contractor license. Quantum Surety can issue both simultaneously — one application, one process.",
  },
  {
    q: "How do I file my contractor bond with the City of Grand Prairie?",
    a: "After purchasing your bond, you'll receive a PDF certificate by email. Submit it to the City of Grand Prairie Building Inspection department as part of your contractor license application or renewal. Quantum Surety provides complete filing instructions with every bond issued.",
  },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Contractor Bond Grand Prairie TX",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/contractor-bond-grand-prairie",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "City", "name": "Grand Prairie", "containedInPlace": { "@type": "State", "name": "Texas" } },
  "description": "Contractor license bonds for Grand Prairie, Texas contractors. City of Grand Prairie Building Inspection bonding requirements for general, electrical, plumbing, HVAC, and roofing contractors.",
};

export default function ContractorBondGrandPrairie() {
  useSEO({
    title: "Contractor Bond Grand Prairie TX | Grand Prairie Contractor License Bond | Quantum Surety",
    description: "Contractor bond in Grand Prairie, TX — required for city contractor licenses. Same-day issuance. TDI-licensed surety agency. Get your free Grand Prairie bond quote today.",
    canonical: "/bonds/contractor-bond-grand-prairie",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <MapPin className="w-4 h-4" /> Grand Prairie, Texas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contractor Bond — Grand Prairie, Texas</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get your City of Grand Prairie contractor license bond same-day. Grand Prairie sits between Dallas
            and Fort Worth with major entertainment and industrial zones driving construction — stay licensed
            and bonded. TDI-licensed, A-rated carriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Grand Prairie Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Grand Prairie Contractor Bond Requirements</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">The City of Grand Prairie Building Inspection sets bonding requirements by trade. Always verify with the city before applying.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Grand Prairie Contractors Choose Quantum Surety</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "TDI-Licensed Agency", body: "Licensed by the Texas Department of Insurance (#3480229). Your bond is backed by A-rated surety carriers approved in Texas." },
              { icon: <ArrowRight className="w-6 h-6 text-teal-600" />, title: "Same-Day Issuance", body: "Standard contractor bonds approved and delivered same-day. Instant PDF so you can file with Grand Prairie Building Inspection and start work immediately." },
              { icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: "DFW Corridor Expertise", body: "Working across Grand Prairie, Arlington, Irving, or Dallas? We issue bonds for multiple DFW cities simultaneously — one process, all cities covered." },
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Grand Prairie Contractor Bond FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{faq.q}
                </h3>
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
              { city: "Dallas", slug: "contractor-bond-dallas" },
              { city: "Arlington", slug: "contractor-bond-arlington" },
              { city: "Irving", slug: "contractor-bond-irving" },
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
          <h2 className="text-3xl font-bold mb-4">Get Your Grand Prairie Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-8">Same-day issuance. TDI-licensed agency. A-rated carriers. Stay licensed and competitive across Grand Prairie and the DFW corridor.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
                Get My Free Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
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
    </div>
  );
}
