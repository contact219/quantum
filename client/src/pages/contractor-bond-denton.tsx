import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, MapPin, Phone, Shield, TrendingUp } from "lucide-react";

const bondTypes = [
  { type: "General Contractor Bond", amount: "$25,000", authority: "City of Denton Development Services" },
  { type: "Electrical Contractor Bond", amount: "$10,000", authority: "City of Denton / TDLR" },
  { type: "Plumbing Contractor Bond", amount: "$10,000", authority: "City of Denton / TDLR" },
  { type: "HVAC / Mechanical Bond", amount: "$10,000", authority: "City of Denton / TDLR" },
  { type: "Roofing Contractor Bond", amount: "$5,000", authority: "City of Denton Development Services" },
];

const faqs = [
  { q: "Does Denton require a contractor bond?", a: "Yes. The City of Denton Development Services department requires licensed contractors to maintain a surety bond as a condition of city contractor registration. Requirements apply to general contractors and specialty trades including electrical, plumbing, HVAC, and roofing." },
  { q: "Why is Denton such a strong construction market?", a: "Denton is one of the fastest-growing cities in the DFW Metroplex, driven by its position as a university town home to the University of North Texas and Texas Woman's University, combined with its status as a growing bedroom community for Fort Worth and Dallas. The resulting demand for student housing, multi-family development, and commercial construction creates consistent work for licensed, bonded contractors throughout the city." },
  { q: "How much does a Denton contractor bond cost?", a: "Most Denton contractors pay $100–$250/year for a $10,000 bond, and $200–$450/year for a $25,000 bond. Premiums are set primarily by your personal credit score. Qualified applicants receive same-day approval at the lowest available rate — no lengthy underwriting for standard bond amounts." },
  { q: "Do I need a Denton city bond AND a TDLR bond?", a: "Yes, if you hold a TDLR license (electrical, plumbing, HVAC/mechanical). TDLR requires a state-level license bond, and the City of Denton requires a separate city registration bond. Quantum Surety can issue both at the same time — tell us your trade and we'll confirm exactly what's needed." },
  { q: "Can I use my Denton contractor bond for projects in Fort Worth, Frisco, or McKinney?", a: "No. Each city sets its own contractor licensing and bonding requirements. If you work across multiple DFW-area cities, you'll need a separate bond for each jurisdiction. Quantum Surety can issue bonds for Denton, Fort Worth, Frisco, McKinney, and other DFW cities simultaneously — one process, multiple bonds." },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Contractor Bond Denton TX",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/contractor-bond-denton",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "City", "name": "Denton", "containedInPlace": { "@type": "State", "name": "Texas" } },
  "description": "Contractor license bonds for Denton, Texas contractors. City of Denton Development Services bonding requirements for general, electrical, plumbing, HVAC, and roofing contractors.",
};

export default function ContractorBondDenton() {
  useSEO({
    title: "Contractor Bond Denton TX | Denton Contractor License Bond | Quantum Surety",
    description: "Contractor bond in Denton, TX — required for city contractor licenses. Same-day issuance. TDI-licensed surety agency. Get your free Denton bond quote today.",
    canonical: "/bonds/contractor-bond-denton",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <MapPin className="w-4 h-4" /> Denton, Texas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contractor Bond — Denton, Texas</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get your City of Denton contractor license bond same-day. A fast-growing DFW suburb with two
            major universities driving strong construction demand. TDI-licensed, A-rated carriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Denton Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
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
            <p className="font-semibold text-teal-900">University Growth Meets DFW Expansion</p>
            <p className="text-teal-800 text-sm mt-1">
              Denton is home to the University of North Texas and Texas Woman's University, fueling demand
              for student housing, multi-family residential, and commercial development. Combined with its
              role as a rapidly growing DFW suburb, Denton offers consistent construction opportunities for
              licensed, bonded contractors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Denton Contractor Bond Requirements</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">The City of Denton Development Services sets bonding requirements by trade. Always verify with the city before applying.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Denton Contractors Choose Quantum Surety</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "TDI-Licensed Agency", body: "Licensed by the Texas Department of Insurance (#3480229). Your bond is backed by A-rated surety carriers approved in Texas." },
              { icon: <ArrowRight className="w-6 h-6 text-teal-600" />, title: "Same-Day Issuance", body: "Standard contractor bonds approved and delivered same-day. Keep your Denton projects on schedule without bonding delays." },
              { icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: "Multi-City Bonds", body: "Work across Denton, Fort Worth, Frisco, and McKinney? We issue bonds for multiple DFW cities simultaneously." },
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Denton Contractor Bond FAQ</h2>
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
              { city: "Fort Worth", slug: "contractor-bond-fort-worth" },
              { city: "McKinney", slug: "contractor-bond-mckinney" },
              { city: "Frisco", slug: "contractor-bond-frisco" },
              { city: "Dallas", slug: "contractor-bond-dallas" },
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
          <h2 className="text-3xl font-bold mb-4">Get Your Denton Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-8">Same-day issuance. TDI-licensed agency. A-rated carriers. Stay competitive in Denton's growing construction market.</p>
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
