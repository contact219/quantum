import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Award, Clock, DollarSign } from "lucide-react";

function PermitPilotLicenseBondCallout() {
  const featuredCities = [
    "Dallas",
    "Fort Worth",
    "Frisco",
    "McKinney",
    "Allen",
    "Plano",
    "Arlington",
    "Denton",
    "Grapevine",
    "Wylie",
    "Flower Mound",
    "Mansfield",
  ];

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 mt-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-300 mb-3">
        After Your Bond — Know Your Permits
      </p>
      <h3 className="text-lg font-bold text-white mb-2">
        What happens after you get your contractor license bond?
      </h3>
      <p className="text-slate-200 text-sm leading-relaxed mb-4">
        Most DFW cities require your bond on file before accepting permit applications. Once bonded, use{" "}
        <strong className="text-white">Permit Pilot</strong> — our sister platform — to identify every building,
        electrical, mechanical, and plumbing permit your project needs across all 24 DFW jurisdictions.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-slate-200">
        {featuredCities.map((city) => (
          <span key={city} className="flex items-center gap-1">
            <span className="text-cyan-300">+</span> {city}
          </span>
        ))}
      </div>
      <a
        href="https://permitpilot.online?utm_source=quantumsurety&utm_medium=product-page&utm_campaign=cross-promo"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-sm hover:opacity-90 transition"
      >
        Try Permit Pilot Free
      </a>
      <p className="mt-4 text-xs text-slate-300 italic">
        Permit Pilot provides AI-generated permit guidance for informational purposes. Always verify requirements
        directly with your local building department before submitting applications.
      </p>
    </div>
  );
}

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Contractor License Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/license-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas contractor license bonds for TDLR and city licenses. Instant issue for standard amounts. Required for electrical, HVAC, plumbing, and general contractor licenses across Texas.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": "50", "unitText": "per year" } }
};

export default function LicenseBondTexas() {
  useSEO({
    title: "Texas Contractor License Bonds | TDLR & City License Bonds | Quantum Surety",
    description:
      "Texas contractor license bonds for TDLR and city licenses. Instant issue for standard amounts. Rates from $50/year. Electrical, HVAC, plumbing, general contractor. TDI-licensed.",
    canonical: "/bonds/license-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");

  const bondTypes = [
    {
      name: "TDLR Contractor Bond",
      authority: "Texas Dept. of Licensing & Regulation",
      amount: "$10,000–$50,000",
      cost: "From $100/yr",
      who: "Electricians, HVAC techs, plumbers, and other TDLR-licensed contractors",
    },
    {
      name: "Electrical Contractor Bond",
      authority: "City electrical licensing authorities",
      amount: "$5,000–$25,000",
      cost: "From $75/yr",
      who: "Electrical contractors obtaining city licenses in Houston, Dallas, Austin, San Antonio",
    },
    {
      name: "Plumbing Contractor Bond",
      authority: "Texas State Board of Plumbing Examiners",
      amount: "$10,000",
      cost: "From $100/yr",
      who: "Licensed plumbing contractors and master plumbers",
    },
    {
      name: "HVAC Contractor Bond",
      authority: "TDLR — Air Conditioning & Refrigeration",
      amount: "$10,000",
      cost: "From $100/yr",
      who: "HVAC contractors licensed through TDLR statewide",
    },
    {
      name: "General Contractor Bond",
      authority: "City and county licensing authorities",
      amount: "$5,000–$50,000",
      cost: "From $75/yr",
      who: "General contractors obtaining city licenses in major Texas metros",
    },
    {
      name: "Roofing Contractor Bond",
      authority: "Various city authorities",
      amount: "$5,000–$20,000",
      cost: "From $75/yr",
      who: "Roofing contractors bidding or working in TX cities that require licensing",
    },
    {
      name: "Landscaping Bond",
      authority: "City permit offices",
      amount: "$2,500–$10,000",
      cost: "From $50/yr",
      who: "Landscape contractors and irrigation specialists working in Texas",
    },
    {
      name: "Auto Dealer Bond",
      authority: "Texas Dept. of Motor Vehicles",
      amount: "$25,000–$50,000",
      cost: "From $200/yr",
      who: "New and used car dealers obtaining a Texas DMV dealer license",
    },
  ];

  const cities = [
    { city: "Houston", note: "Requires bonds for electrical, plumbing, HVAC, and general contractors" },
    { city: "Dallas", note: "Contractor licensing and bonding required for many trades" },
    { city: "Austin", note: "Building permits require proof of license bonds for most trades" },
    { city: "San Antonio", note: "City licensing office requires bonds for electrical and plumbing contractors" },
    { city: "Fort Worth", note: "Contractor licenses and bonds required for multiple trades" },
    { city: "El Paso", note: "City requires bonds for specialty contractors and general contractors" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Award className="w-4 h-4" />
            Texas License & Permit Bonds
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Texas Contractor License Bonds
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get your Texas contractor license bond fast. TDLR bonds, city license bonds,
            and permit bonds for all trades — issued same-day, delivered by email.
            Rates start at $75/year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My License Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why fast matters */}
      <section className="py-10 px-4 bg-teal-50 border-b border-teal-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Clock, label: "Same-day issuance", body: "Bond documents delivered by email — ready to submit to TDLR or city licensing offices immediately" },
              { icon: DollarSign, label: "Rates from $75/yr", body: "License bonds are among the most affordable surety bonds — most Texas contractors pay under $300/year" },
              { icon: Award, label: "All trades covered", body: "We issue bonds for every trade TDLR and Texas cities regulate — electrical, plumbing, HVAC, roofing, and more" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <item.icon className="w-7 h-7 text-teal-700 mb-2" />
                <div className="font-semibold text-gray-900 mb-1">{item.label}</div>
                <div className="text-sm text-gray-600">{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bond types grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Texas License Bond Types
          </h2>
          <p className="text-gray-600 mb-10">
            Every trade has different bonding requirements. Here are the most common Texas contractor license bonds:
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {bondTypes.map((bond) => (
              <div key={bond.name} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{bond.name}</h3>
                  <span className="text-sm font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full whitespace-nowrap ml-3">
                    {bond.cost}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{bond.authority}</div>
                <div className="text-sm text-gray-600 mb-3">{bond.who}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Bond amount: {bond.amount}</span>
                  <a
                    href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" variant="outline" className="text-xs">
                      Get Quote <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Texas City License Bond Requirements
          </h2>
          <p className="text-gray-600 mb-8">
            In addition to TDLR statewide requirements, major Texas cities have their own contractor licensing and bonding requirements:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {cities.map((c) => (
              <div key={c.city} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900">{c.city}: </span>
                  <span className="text-gray-600 text-sm">{c.note}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Requirements vary by city and trade. Our team knows the local rules — contact us if you're unsure what bond your city requires.
          </p>
        </div>
      </section>

      {/* How to get your bond */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            How to Get Your Texas License Bond in 3 Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Tell us your trade and city", body: "Select your bond type, enter the required bond amount, and tell us your state license or TDLR number." },
              { step: "2", title: "Instant approval", body: "Most Texas license bonds are approved instantly based on a soft credit check. No financial statements needed." },
              { step: "3", title: "Receive bond documents", body: "Bond certificate delivered to your email within minutes. Print and submit to TDLR or your city licensing office." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <PermitPilotLicenseBondCallout />
          <h2 className="text-3xl font-bold mb-4">
            Get Your Texas License Bond Today
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Same-day issuance. Rates from $75/year. All Texas trades covered.
          </p>
          <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noreferrer">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
              Get My License Bond <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
