import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, Truck } from "lucide-react";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Surety Bond",
  "name": "Freight Broker Bond (BMC-84)",
  "description": "$75,000 FMCSA-required surety bond for all licensed freight brokers and forwarders. Fast approval, competitive rates.",
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
    "@type": "Country",
    "name": "United States"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "priceRange": "$500-$3,000/year"
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a BMC-84 freight broker bond?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The BMC-84 is a $75,000 surety bond required by the Federal Motor Carrier Safety Administration (FMCSA) under 49 CFR Part 387 for all licensed freight brokers and freight forwarders. It protects shippers and carriers if the broker fails to pay for transportation services or otherwise violates their legal obligations."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a freight broker bond cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Freight broker bond premiums typically range from $500–$3,000 per year for the required $75,000 bond. Your exact rate depends on your personal and business credit profile. Applicants with strong credit can often secure rates at 1–2% of the bond amount ($750–$1,500/year). Poor credit may result in higher rates or a cash collateral program."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need the BMC-84 bond before I can get my FMCSA license?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The BMC-84 bond must be on file with the FMCSA before your freight broker or freight forwarder authority (MC number) becomes active. You apply for your MC number through FMCSA's Unified Registration System (URS), then file your bond. FMCSA will not activate your operating authority without a valid BMC-84 on file."
      }
    },
    {
      "@type": "Question",
      "name": "Is the freight broker bond a state or federal requirement?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The BMC-84 is a federal requirement, not a state requirement. It is mandated by FMCSA under federal law and applies to all freight brokers and forwarders operating in interstate commerce, regardless of which state they are based in. There is no separate state-level freight broker bond required in Texas."
      }
    },
    {
      "@type": "Question",
      "name": "How often does the freight broker bond renew?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Freight broker bonds renew annually. If the bond lapses or is cancelled, FMCSA will suspend your operating authority. We send renewal reminders in advance and can process your renewal quickly to ensure there is no gap in your authority."
      }
    }
  ]
};

const faqs = [
  {
    q: "What is a BMC-84 freight broker bond?",
    a: "The BMC-84 is a $75,000 surety bond required by the Federal Motor Carrier Safety Administration (FMCSA) under 49 CFR Part 387 for all licensed freight brokers and freight forwarders. It protects shippers and carriers if the broker fails to pay for transportation services or otherwise violates their legal obligations.",
  },
  {
    q: "How much does a freight broker bond cost?",
    a: "Freight broker bond premiums typically range from $500–$3,000 per year for the required $75,000 bond. Your exact rate depends on your personal and business credit profile. Applicants with strong credit can often secure rates at 1–2% of the bond amount ($750–$1,500/year). Poor credit may result in higher rates or a cash collateral program.",
  },
  {
    q: "Do I need the BMC-84 bond before I can get my FMCSA license?",
    a: "Yes. The BMC-84 bond must be on file with the FMCSA before your freight broker or freight forwarder authority (MC number) becomes active. You apply for your MC number through FMCSA's Unified Registration System (URS), then file your bond. FMCSA will not activate your operating authority without a valid BMC-84 on file.",
  },
  {
    q: "Is the freight broker bond a state or federal requirement?",
    a: "The BMC-84 is a federal requirement, not a state requirement. It is mandated by FMCSA under federal law and applies to all freight brokers and forwarders operating in interstate commerce, regardless of which state they are based in. There is no separate state-level freight broker bond required in Texas.",
  },
  {
    q: "How often does the freight broker bond renew?",
    a: "Freight broker bonds renew annually. If the bond lapses or is cancelled, FMCSA will suspend your operating authority. We send renewal reminders in advance and can process your renewal quickly to ensure there is no gap in your authority.",
  },
];

export default function FreightBrokerBondTexas() {
  useSEO({
    title: "Freight Broker Bond (BMC-84) | Federal Freight Broker License Bond | Quantum Surety",
    description:
      "Freight broker bond (BMC-84) — $75,000 FMCSA-required bond for all licensed freight brokers and forwarders. Fast approval, competitive rates. TDI-licensed. Free quote.",
    canonical: "/bonds/freight-broker-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds">
              <span className="hover:text-white cursor-pointer">Surety Bonds</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Freight Broker Bond (BMC-84)</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Federal FMCSA Requirement</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Fast approval</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Freight Broker Bond — BMC-84 ($75,000)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Every FMCSA-licensed freight broker and freight forwarder must file a $75,000 BMC-84 surety bond before operating authority is granted. Get your bond quickly with competitive rates and no unnecessary delays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My BMC-84 Bond <ArrowRight className="w-4 h-4 ml-2" />
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
            { label: "Required bond amount", value: "$75,000", sub: "Set by FMCSA — 49 CFR Part 387" },
            { label: "Annual cost", value: "$500–$3,000/yr", sub: "Based on credit profile" },
            { label: "Renewal", value: "Annual", sub: "Lapse = suspended authority" },
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

        {/* What the BMC-84 is */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is the BMC-84 Freight Broker Bond?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The BMC-84 is a $75,000 surety bond mandated by the Federal Motor Carrier Safety Administration (FMCSA) under <strong>49 CFR Part 387</strong>. It is required for all individuals and businesses seeking to operate as a licensed freight broker or freight forwarder in interstate commerce. The bond must be on file with FMCSA before your operating authority (MC number) becomes active.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The bond protects shippers and motor carriers from financial harm caused by a broker's failure to pay for transportation services, dishonest dealings, or other violations of federal broker regulations. If a valid claim is made against your bond, the surety pays up to $75,000 — and you are then obligated to reimburse the surety. This is why the BMC-84 is a bond, not insurance: it is a credit instrument, not indemnification.
          </p>
        </section>

        {/* Who needs it */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Who Needs a Freight Broker Bond?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "New freight brokers applying for FMCSA operating authority",
              "Freight forwarders registering for an MC number",
              "Existing brokers renewing their BMC-84 annually",
              "Brokers reinstating lapsed or cancelled authority",
              "Texas-based freight brokers (TX is a top-5 freight state)",
              "Out-of-state brokers operating interstate routes through Texas",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it differs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How the BMC-84 Differs From Other Surety Bonds</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                label: "Federal, not state",
                body: "The BMC-84 is issued to FMCSA — a federal agency — not to a state licensing board. It applies nationwide regardless of where you are incorporated or where you operate.",
              },
              {
                label: "Higher bond amount",
                body: "At $75,000, the BMC-84 is significantly larger than most state contractor license bonds ($10,000–$25,000). This reflects the financial exposure involved in freight brokerage.",
              },
              {
                label: "Credit-driven pricing",
                body: "Because the bond amount is large, credit plays a bigger role in pricing than it does for smaller bonds. Strong credit yields 1–2% premiums; challenged credit may be 3–4% or require collateral.",
              },
              {
                label: "Authority activation gate",
                body: "FMCSA will not activate your MC number until the BMC-84 is filed. There is no grace period — the bond must be in place before you can legally broker any freight.",
              },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.label}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Texas context */}
        <section className="bg-teal-50 rounded-2xl p-8 border border-teal-100">
          <div className="flex items-start gap-4">
            <Truck className="w-8 h-8 text-teal-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Texas: A Major Freight Brokerage Hub</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Texas is one of the largest freight markets in the United States. The Dallas-Fort Worth metroplex is home to one of the highest concentrations of freight brokers and 3PLs in the country, driven by the region's central geographic position, major intermodal facilities, and proximity to the US-Mexico border.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Laredo, Texas is the largest land port of entry in the US, handling over 40% of US-Mexico trade by truck. Many Texas-based freight brokers specialize in cross-border and nearshore logistics — all of which require active FMCSA authority and a current BMC-84 bond. We serve brokers throughout DFW, Houston, San Antonio, Laredo, and El Paso.
              </p>
            </div>
          </div>
        </section>

        {/* How to apply with FMCSA */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Your MC Number and BMC-84 Bond</h2>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                step: "1",
                title: "Register with FMCSA",
                body: "Apply for freight broker operating authority through FMCSA's Unified Registration System (URS) at safer.fmcsa.dot.gov. You'll receive a USDOT number and MC number.",
              },
              {
                step: "2",
                title: "Get your BMC-84 bond",
                body: "Apply for your $75,000 BMC-84 bond here. We'll send you the bond form, which your surety files directly with FMCSA electronically.",
              },
              {
                step: "3",
                title: "Bond filed with FMCSA",
                body: "We file the BMC-84 form directly with FMCSA on your behalf. FMCSA verifies the filing and begins the 10-day waiting period for new authority.",
              },
              {
                step: "4",
                title: "Authority activated",
                body: "After FMCSA's review period, your operating authority becomes active. You can now legally broker freight in interstate commerce.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/quote">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10">
                Start My BMC-84 Application <ArrowRight className="w-4 h-4 ml-2" />
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
          <h2 className="text-2xl font-bold mb-2">Get Your BMC-84 Freight Broker Bond Today</h2>
          <p className="text-indigo-200 mb-6">$75,000 FMCSA bond · Fast approval · Rates from $500/yr · TDI Licensed Agency #3480229</p>
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
              { href: "/bonds/license-bond-texas", title: "Texas License Bonds", tag: "Hub Page" },
              { href: "/bonds/electrical-contractor-bond-texas", title: "Electrical Contractor Bond", tag: "City License" },
              { href: "/bonds/roofing-contractor-bond-texas", title: "Roofing Contractor Bond", tag: "City License" },
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
