import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, MapPin, Phone, Shield, TrendingUp } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Waco Development Services" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Waco / TDLR" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Waco / TDLR" },
  { type: "HVAC / Mechanical Bond", amount: "$10,000", authority: "City of Waco / TDLR" },
  { type: "Roofing Contractor Bond", amount: "$5,000", authority: "City of Waco Development Services" },
];

const faqs = [
  { q: "Does Waco require a contractor bond?", a: "Yes. The City of Waco Development Services department requires licensed contractors to maintain a surety bond as a condition of city contractor registration. Requirements apply to general contractors and specialty trades including electrical, plumbing, HVAC, and roofing." },
  { q: "Why is Waco such an active construction market right now?", a: "Waco has undergone a dramatic revitalization driven by tourism centered on Magnolia Market at the Silos, continued expansion at Baylor University, and a surge of new hotel, restaurant, and retail development in the downtown corridor. The city's growing national profile has attracted significant residential and commercial investment, creating strong ongoing demand for licensed, bonded contractors." },
  { q: "How much does a Waco contractor bond cost?", a: "Most Waco contractors pay $100–$250/year for a $10,000 bond, and $200–$450/year for a $25,000 bond. Your premium is determined primarily by your personal credit score. Qualified applicants receive same-day approval at the best available rate with no lengthy underwriting process for standard bond amounts." },
  { q: "Do I need a Waco city bond AND a TDLR bond?", a: "Yes, if you hold a TDLR license (electrical, plumbing, HVAC/mechanical). TDLR requires a state-level license bond, and the City of Waco requires a separate city registration bond. Quantum Surety can issue both simultaneously — tell us your trade and we'll identify everything you need." },
  { q: "Can I use my Waco contractor bond for projects in Temple or Austin?", a: "No. Each city maintains its own contractor licensing and bonding requirements. If you operate in multiple Central Texas markets — including Temple, Austin, or Dallas — you will need a separate bond for each jurisdiction. Quantum Surety can issue multi-city bonds through a single application, keeping the process fast and simple." },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Contractor Bond Waco TX",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/contractor-bond-waco",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "City", "name": "Waco", "containedInPlace": { "@type": "State", "name": "Texas" } },
  "description": "Contractor license bonds for Waco, Texas contractors. City of Waco Development Services bonding requirements for general, electrical, plumbing, HVAC, and roofing contractors.",
};

export default function ContractorBondWaco() {
  useSEO({
    title: "Contractor Bond Waco TX | Waco Contractor License Bond | Quantum Surety",
    description: "Contractor bond in Waco, TX — required for city contractor licenses. Same-day issuance. TDI-licensed surety agency. Get your free Waco bond quote today.",
    canonical: "/bonds/contractor-bond-waco",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <MapPin className="w-4 h-4" /> Waco, Texas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contractor Bond — Waco, Texas</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get your City of Waco contractor license bond same-day. Waco's rapid revitalization is driving
            one of Central Texas's strongest construction markets. TDI-licensed, A-rated carriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Waco Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
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
            <p className="font-semibold text-teal-900">Waco's Revitalization Is Fueling Construction Demand</p>
            <p className="text-teal-800 text-sm mt-1">
              Magnolia Market at the Silos, Baylor University expansion, and a surge of downtown hotel and
              retail development have transformed Waco into one of Central Texas's most active construction
              markets. Licensed, bonded contractors are essential to keeping up with the city's growth.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Waco Contractor Bond Requirements</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">The City of Waco Development Services sets bonding requirements by trade. Always verify with the city before applying.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Waco Contractors Choose Quantum Surety</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "TDI-Licensed Agency", body: "Licensed by the Texas Department of Insurance (#3480229). Your bond is backed by A-rated surety carriers approved in Texas." },
              { icon: <ArrowRight className="w-6 h-6 text-teal-600" />, title: "Same-Day Issuance", body: "Standard contractor bonds approved and delivered same-day. Keep Waco's fast-moving revitalization projects on schedule." },
              { icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: "Multi-City Bonds", body: "Work across Waco, Austin, Dallas, and Temple? We issue bonds for multiple cities simultaneously." },
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Waco Contractor Bond FAQ</h2>
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
              { city: "Austin", slug: "contractor-bond-austin" },
              { city: "Dallas", slug: "contractor-bond-dallas" },
              { city: "Fort Worth", slug: "contractor-bond-fort-worth" },
              { city: "Temple", slug: "contractor-bond-temple" },
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
          <h2 className="text-3xl font-bold mb-4">Get Your Waco Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-8">Same-day issuance. TDI-licensed agency. A-rated carriers. Stay competitive in Waco's booming construction market.</p>
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
