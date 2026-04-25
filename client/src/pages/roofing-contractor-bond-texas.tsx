import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, CloudRain } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Surety Bond",
  "name": "Texas Roofing Contractor Bond",
  "description": "Surety bond required by Texas cities for roofing contractor licensing. Instant issue, competitive rates.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Quantum Surety Bonds",
    "url": "https://quantumsurety.bond",
    "telephone": "+19723799216",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "TX",
      "addressCountry": "US"
    }
  },
  "areaServed": {
    "@type": "State",
    "name": "Texas"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "priceRange": "$50-$200/year"
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a roofing contractor bond in Texas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A roofing contractor bond is a surety bond required by many Texas cities before a roofing contractor can obtain a local license or pull permits. It protects homeowners and the municipality if the roofer fails to complete work, violates building codes, or causes financial harm to customers."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a roofing contractor bond cost in Texas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Texas roofing contractor bonds typically cost $50–$200 per year depending on the bond amount required by your city and your credit profile. For standard bond amounts of $5,000–$10,000, most applicants pay under $150/year with no credit issues."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need a bond for every city I work in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Potentially yes. Texas does not have a statewide roofing contractor license, so each city sets its own licensing requirements. If you work in Houston, Dallas, San Antonio, and Austin, each city may require its own bond. We can issue bonds for all Texas municipalities — contact us for multi-city bundling."
      }
    },
    {
      "@type": "Question",
      "name": "What about storm chaser contractors — do they need a Texas bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, and this is especially important. Storm chasers operating after Texas hailstorms are subject to the same city licensing and bonding requirements as local roofers. Many Texas cities have increased enforcement after high-volume storm seasons. Out-of-state contractors working Texas storm events are required to comply with local ordinances, including bonding."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can I get my roofing contractor bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Same-day. Once approved, your bond certificate is emailed as a PDF — ready to submit with your city license application or permit application. Most approvals are instant with no financials required for standard bond amounts."
      }
    }
  ]
};

const cityRequirements = [
  { city: "Houston", amount: "$10,000", authority: "Houston Permitting Center" },
  { city: "Dallas", amount: "$10,000", authority: "City of Dallas Development Services" },
  { city: "San Antonio", amount: "$5,000", authority: "City of San Antonio Dev. Services" },
  { city: "Austin", amount: "$10,000", authority: "City of Austin Development Services" },
  { city: "Fort Worth", amount: "$10,000", authority: "City of Fort Worth Development Services" },
  { city: "Other TX Cities", amount: "$5,000–$20,000", authority: "Varies by municipality" },
];

const faqs = [
  {
    q: "What is a roofing contractor bond in Texas?",
    a: "A roofing contractor bond is a surety bond required by many Texas cities before a roofing contractor can obtain a local license or pull permits. It protects homeowners and the municipality if the roofer fails to complete work, violates building codes, or causes financial harm to customers.",
  },
  {
    q: "How much does a roofing contractor bond cost in Texas?",
    a: "Texas roofing contractor bonds typically cost $50–$200 per year depending on the bond amount required by your city and your credit profile. For standard bond amounts of $5,000–$10,000, most applicants pay under $150/year with no credit issues.",
  },
  {
    q: "Do I need a bond for every city I work in?",
    a: "Potentially yes. Texas does not have a statewide roofing contractor license, so each city sets its own licensing requirements. If you work in Houston, Dallas, San Antonio, and Austin, each city may require its own bond. We can issue bonds for all Texas municipalities — contact us for multi-city bundling.",
  },
  {
    q: "What about storm chaser contractors — do they need a Texas bond?",
    a: "Yes, and this is especially important. Storm chasers operating after Texas hailstorms are subject to the same city licensing and bonding requirements as local roofers. Many Texas cities have increased enforcement after high-volume storm seasons. Out-of-state contractors working Texas storm events are required to comply with local ordinances, including bonding.",
  },
  {
    q: "How quickly can I get my roofing contractor bond?",
    a: "Same-day. Once approved, your bond certificate is emailed as a PDF — ready to submit with your city license application or permit application. Most approvals are instant with no financials required for standard bond amounts.",
  },
];

export default function RoofingContractorBondTexas() {
  useSEO({
    title: "Roofing Contractor Bond Texas | TX Roofer License Bond | Quantum Surety",
    description:
      "Texas roofing contractor bond — required by many Texas cities for roofer licensing. Instant issue, competitive rates. TDI-licensed surety agency. Get your free quote today.",
    canonical: "/bonds/roofing-contractor-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

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
            <span>Roofing Contractor Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">City License Bond</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Roofing Contractor Bond
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Required by Houston, Dallas, San Antonio, Austin, Fort Worth, and many other Texas cities before a roofing contractor can obtain a license or pull permits. Get bonded same-day — instant PDF delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Roofing Bond <ArrowRight className="w-4 h-4 ml-2" />
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

      {/* Key facts */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Typical bond amount", value: "$5,000–$20,000", sub: "Varies by city requirement" },
            { label: "Annual cost", value: "From $50/yr", sub: "No credit check for standard amounts" },
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

        {/* What it is */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is a Texas Roofing Contractor Bond?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            A roofing contractor bond is a type of license surety bond that guarantees a roofing contractor will comply with local ordinances, complete contracted work, and protect homeowners from financial harm caused by contractor negligence or default. Unlike insurance — which protects the contractor — a surety bond protects the public and the city that issued the license.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Texas does not have a statewide roofing contractor license, so bonding requirements are set at the city level. The five largest Texas cities — Houston, Dallas, San Antonio, Austin, and Fort Worth — all maintain roofing contractor licensing programs that include a surety bond requirement.
          </p>
        </section>

        {/* Where required */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Where Roofing Contractor Bonds Are Required in Texas</h2>
          <p className="text-gray-600 text-sm mb-6">Texas cities each set their own licensing and bond requirements. The table below reflects the most common amounts — verify current requirements with the relevant permitting office before applying.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {cityRequirements.map((r) => (
              <div key={r.city} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.city}</p>
                  <p className="text-xs text-gray-500">{r.authority}</p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">Bond amount: {r.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Don't see your city?{" "}
            <Link href="/quote">
              <span className="text-indigo-600 hover:underline cursor-pointer">Contact us</span>
            </Link>{" "}
            — we issue bonds for all Texas municipalities.
          </p>
        </section>

        {/* Storm season context */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-start gap-4">
            <CloudRain className="w-8 h-8 text-indigo-500 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Texas Hailstorm Season and Roofing Bonds</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Texas sits in the heart of "Hail Alley" — the corridor stretching from the Texas Panhandle through North Texas — making it one of the most active hail states in the country. Major storm events in the Dallas-Fort Worth metroplex, San Antonio, and Houston routinely generate thousands of roofing insurance claims in a single season, drawing large numbers of out-of-state contractors.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Texas cities have significantly increased enforcement of roofing contractor licensing and bonding requirements in the aftermath of storm seasons. Contractors operating without a valid bond risk permit denials, stop-work orders, and fines. Getting bonded before storm season ensures you can work immediately when opportunity arises — same-day issuance means no delays.
              </p>
            </div>
          </div>
        </section>

        {/* What it covers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Does a Roofing Contractor Bond Cover?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Failure to complete a roofing contract",
              "Violations of local building codes",
              "Failure to obtain required permits",
              "Consumer financial losses from contractor default",
              "Unpaid subcontractors or material suppliers",
              "Work abandoned after partial completion",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to get bonded */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Your Roofing Bond in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Request your bond",
                body: "Tell us which Texas city you're licensing in and the bond amount they require. Takes under 2 minutes.",
              },
              {
                step: "2",
                title: "Instant approval",
                body: "Most roofers are approved immediately with no financials or business records needed for bond amounts under $20,000.",
              },
              {
                step: "3",
                title: "File and start working",
                body: "Bond certificate emailed instantly as a PDF. Submit to your city's permitting or licensing department with your application.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/quote">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10">
                Get My Bond Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
          <h2 className="text-2xl font-bold mb-2">Get Your Roofing Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All Texas cities · Rates from $50/yr · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
              { href: "/bonds/electrical-contractor-bond-texas", title: "Electrical Contractor Bond", tag: "City License" },
              { href: "/bonds/hvac-bond-texas", title: "HVAC Contractor Bond", tag: "TDLR AC" },
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
