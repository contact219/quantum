import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, AlertTriangle, RefreshCw } from "lucide-react";

const GDN_LINK = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX";

const dealerTypes = [
  { type: "New Motor Vehicle Dealer", description: "Franchised dealers selling new cars, trucks, and SUVs", amount: "$50,000", cost: "From $100/yr" },
  { type: "Used Motor Vehicle Dealer", description: "Independent lots selling pre-owned vehicles", amount: "$50,000", cost: "From $100/yr" },
  { type: "Wholesale Motor Vehicle Dealer", description: "Dealers who sell only to other licensed dealers", amount: "$50,000", cost: "From $100/yr" },
  { type: "Motorcycle Dealer", description: "New and used motorcycle sales", amount: "$50,000", cost: "From $100/yr" },
  { type: "Buy Here Pay Here (BHPH) Dealer", description: "In-house financing dealers who carry their own paper", amount: "$50,000", cost: "From $100/yr" },
  { type: "Lease / Finance Company", description: "Companies that lease vehicles or arrange dealer financing", amount: "$50,000", cost: "From $100/yr" },
];

const faqs = [
  {
    q: "What is a Texas GDN bond?",
    a: "A GDN (General Distinguishing Number) bond is a $50,000 surety bond required by the Texas Department of Motor Vehicles under Texas Occupations Code §503.033 before a motor vehicle dealer license (GDN) can be issued. It protects consumers and the state if a dealer engages in fraud, fails to transfer titles, misrepresents vehicles, or otherwise violates Texas dealer law.",
  },
  {
    q: "How much does a Texas GDN bond cost?",
    a: "Most Texas dealers pay $100–$300 per year for a $50,000 GDN bond. Your exact rate is based on your credit profile. Dealers with good credit typically pay 0.5–1% of the bond amount annually — making it one of the most affordable license requirements.",
  },
  {
    q: "What is the required bond amount?",
    a: "Texas Occupations Code §503.033 sets the required bond amount at $50,000 for all GDN license holders. This applies uniformly across all six dealer license types — new, used, wholesale, motorcycle, BHPH, and lease/finance.",
  },
  {
    q: "What happens if I operate without a GDN bond?",
    a: "Operating as a motor vehicle dealer in Texas without a valid GDN bond is a Class A misdemeanor under Texas Occupations Code §503.033. Penalties can include fines up to $4,000 and up to one year in jail, in addition to license suspension or revocation by TxDMV.",
  },
  {
    q: "When does my GDN bond renew?",
    a: "Texas GDN bonds are typically issued on an annual basis and must be renewed before your dealer license renewal date with TxDMV. Quantum Surety sends renewal reminders so your coverage never lapses — a lapsed bond means an invalid dealer license.",
  },
  {
    q: "How quickly can I get my GDN bond?",
    a: "Same-day. Once your application is approved, your bond certificate is emailed as an instant PDF. You can submit it to TxDMV with your GDN license application on the same day.",
  },
];

export default function GDNBondTexas() {
  useSEO({
    title: "Texas GDN Bond | General Distinguishing Number Dealer Bond | Quantum Surety",
    description:
      "Get your Texas GDN bond same-day. Required under Texas Occupations Code §503.033 for all motor vehicle dealer licenses. $50,000 bond from $100/yr. Instant PDF delivery.",
    canonical: "/bonds/gdn-bond-texas",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Service", "serviceType": "Surety Bond", "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" }, "areaServed": { "@type": "State", "name": "Texas" } }, "ld-json-Service");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/license-bond-texas">
              <span className="hover:text-white cursor-pointer">License Bonds</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/bonds/auto-dealer-bond-texas">
              <span className="hover:text-white cursor-pointer">Auto Dealer Bonds</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>GDN Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Occupations Code §503.033</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas GDN Bond — General Distinguishing Number Dealer Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by TxDMV for every motor vehicle dealer license in Texas. The $50,000 GDN surety bond is mandated under Texas Occupations Code §503.033 and covers all six dealer license types — new, used, wholesale, motorcycle, BHPH, and lease/finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={GDN_LINK} target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Bond amount", value: "$50,000", sub: "Required under §503.033" },
            { label: "Annual cost", value: "From $100/yr", sub: "Based on credit profile" },
            { label: "Delivery", value: "Same-day", sub: "Instant PDF by email" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-teal-100">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className="text-xs text-teal-700 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* Legal requirement callout */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Legally Required — Texas Occupations Code §503.033</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Every Texas motor vehicle dealer must maintain a valid $50,000 GDN surety bond as a condition of holding a dealer license issued by TxDMV. Operating without a valid bond is a <strong>Class A misdemeanor</strong> — punishable by a fine up to $4,000 and up to one year in county jail, plus potential license revocation.
              </p>
              <p className="text-gray-600 text-sm">
                The bond requirement applies to all GDN license types and must remain active throughout the license term. A lapse in bond coverage renders your dealer license invalid.
              </p>
            </div>
          </div>
        </section>

        {/* Dealer types table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All 6 GDN Dealer License Types — Bond Requirements</h2>
          <p className="text-gray-600 text-sm mb-6">Texas Occupations Code §503.033 applies to all motor vehicle dealer license categories. The $50,000 bond amount is uniform across all types.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Dealer Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 hidden sm:table-cell">Description</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-900">Bond Amount</th>
                  <th className="text-center px-4 py-3 font-semibold text-teal-700">Est. Annual Cost</th>
                </tr>
              </thead>
              <tbody>
                {dealerTypes.map((d, i) => (
                  <tr key={d.type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-900 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      {d.type}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{d.description}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900">{d.amount}</td>
                    <td className="px-4 py-3 text-center font-semibold text-teal-700">{d.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Annual cost estimates are based on applicants with good credit. Actual premiums may vary.</p>
        </section>

        {/* Renewal reminder */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-start gap-4">
            <RefreshCw className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Never Miss Your GDN Bond Renewal</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Your GDN bond must be renewed annually — a lapsed bond means an invalid dealer license with TxDMV. Unlike most competitors, Quantum Surety sends proactive renewal reminders before your expiration date so your coverage and your license stay active.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Renewal reminders sent 60 and 30 days before expiration",
                  "Same-day reissuance — bond renewed in minutes, not days",
                  "Continuous coverage with no gaps in your dealer license",
                  "TxDMV-accepted bond certificate delivered by email",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="text-gray-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to get bonded */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your GDN Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Select your dealer type", body: "Choose your GDN license category — new, used, wholesale, motorcycle, BHPH, or lease/finance. Takes under 2 minutes." },
              { step: "2", title: "Instant approval", body: "Most Texas dealers are approved same-day. No financial statements required. Credit-based pricing starts at $100/year." },
              { step: "3", title: "File with TxDMV", body: "Bond certificate emailed as an instant PDF. Submit with your GDN license application through TxDMV's eLICENSING portal." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{item.q}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas GDN Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All 6 GDN dealer types · From $100/yr · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={GDN_LINK} target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/auto-dealer-bond-texas", title: "Auto Dealer Bond (TxDMV)", tag: "Dealer License" },
              { href: "/bonds/tdlr-bond-texas", title: "TDLR Contractor Bond", tag: "TDLR License" },
              { href: "/bonds/license-bond-texas", title: "All Texas License Bonds", tag: "Hub Page" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-1 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">View page <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
