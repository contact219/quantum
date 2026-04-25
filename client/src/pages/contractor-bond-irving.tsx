import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, MapPin, Phone, Shield } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Irving Building Inspection" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Irving / TDLR" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Irving / TDLR" },
  { type: "HVAC / Mechanical Bond", amount: "$10,000", authority: "City of Irving / TDLR" },
  { type: "Roofing Contractor Bond", amount: "$5,000", authority: "City of Irving Building Inspection" },
];

const faqs = [
  {
    q: "Does Irving require a contractor bond?",
    a: "Yes. The City of Irving requires licensed contractors to maintain a surety bond as a condition of city contractor registration. Requirements apply to general contractors and specialty trades including electrical, plumbing, HVAC, and roofing, administered through the Irving Building Inspection department.",
  },
  {
    q: "Why is Irving such an active commercial construction market?",
    a: "Irving is home to major corporate campuses, Las Colinas — one of the largest urban developments in the U.S. — and sits directly adjacent to DFW International Airport. This concentration of commercial real estate and infrastructure creates sustained, high demand for licensed, bonded contractors across all trades.",
  },
  {
    q: "How much does an Irving contractor bond cost?",
    a: "For a $5,000–$10,000 bond, most Irving contractors pay $100–$250/year. For a $25,000 bond, expect $250–$500/year. Rates depend on your personal credit score. Most applicants are approved same-day with no financial statements required for standard bond amounts.",
  },
  {
    q: "Do I need an Irving city bond AND a TDLR license bond?",
    a: "Yes, in many cases. TDLR covers your state-level credentials for electrical, plumbing, and HVAC work. The City of Irving requires a separate city-specific surety bond to pull permits and operate under an Irving contractor license. Quantum Surety can issue both simultaneously — one application, one process.",
  },
  {
    q: "How do I file my contractor bond with the City of Irving?",
    a: "After purchasing your bond, you'll receive a PDF certificate by email. Submit it to the City of Irving Building Inspection department as part of your contractor license application or renewal. Quantum Surety provides complete filing instructions with every bond issued.",
  },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Contractor Bond Irving TX",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/contractor-bond-irving",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "City", "name": "Irving", "containedInPlace": { "@type": "State", "name": "Texas" } },
  "description": "Contractor license bonds for Irving, Texas contractors. City of Irving Building Inspection bonding requirements for general, electrical, plumbing, HVAC, and roofing contractors.",
};

export default function ContractorBondIrving() {
  useSEO({
    title: "Contractor Bond Irving TX | Irving Contractor License Bond | Quantum Surety",
    description: "Contractor bond in Irving, TX — required for city contractor licenses. Same-day issuance. TDI-licensed surety agency. Get your free Irving bond quote today.",
    canonical: "/bonds/contractor-bond-irving",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <MapPin className="w-4 h-4" /> Irving, Texas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contractor Bond — Irving, Texas</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get your City of Irving contractor license bond same-day. Irving is home to major corporate campuses
            and DFW Airport — a strong commercial construction market that requires licensed, bonded contractors.
            TDI-licensed, A-rated carriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Irving Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Irving Contractor Bond Requirements</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">The City of Irving Building Inspection sets bonding requirements by trade. Always verify with the city before applying.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Irving Contractors Choose Quantum Surety</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "TDI-Licensed Agency", body: "Licensed by the Texas Department of Insurance (#3480229). Your bond is backed by A-rated surety carriers approved in Texas." },
              { icon: <ArrowRight className="w-6 h-6 text-teal-600" />, title: "Same-Day Issuance", body: "Standard contractor bonds approved and delivered same-day. Instant PDF so you can file with Irving Building Inspection and get to work fast." },
              { icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: "Commercial Market Ready", body: "Irving's Las Colinas and airport corridor demand bonded pros. We understand the commercial construction market and get you bonded quickly." },
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Irving Contractor Bond FAQ</h2>
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
              { city: "Fort Worth", slug: "contractor-bond-fort-worth" },
              { city: "Grand Prairie", slug: "contractor-bond-grand-prairie" },
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
          <h2 className="text-3xl font-bold mb-4">Get Your Irving Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-8">Same-day issuance. TDI-licensed agency. A-rated carriers. Stay licensed and competitive in Irving's thriving commercial construction market.</p>
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
