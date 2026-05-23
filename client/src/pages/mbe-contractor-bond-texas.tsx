import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, Award, Users, FileText } from "lucide-react";

const faqs = [
  {
    q: "Can a minority-owned business get a surety bond in Texas?",
    a: "Yes. Minority-owned businesses (MBEs), HUB-certified contractors, and DBE-certified contractors can all obtain surety bonds in Texas. Quantum Surety specializes in working with certified minority contractors — including through the SBA Surety Bond Guarantee Program, which helps businesses qualify that might not meet traditional surety underwriting criteria.",
  },
  {
    q: "What is the SBA Surety Bond Guarantee Program?",
    a: "The SBA Surety Bond Guarantee Program allows the Small Business Administration to guarantee 70–90% of a surety bond for small and minority contractors who cannot qualify through traditional channels. This means contractors who have been denied or limited by other bonding agencies may still be able to get bonded and bid on public contracts. Quantum Surety works with this program.",
  },
  {
    q: "What is a Texas HUB-certified contractor?",
    a: "A HUB (Historically Underutilized Business) certification is issued by the Texas Comptroller's office to businesses that are at least 51% owned by minority individuals, women, or veterans. Texas state agencies are required to meet HUB participation goals on contracts, making HUB certification valuable for winning public work — which often requires surety bonds.",
  },
  {
    q: "What bonds do MBE contractors need for public contracts?",
    a: "Public contracts in Texas typically require three bonds: a Bid Bond (submitted with your proposal, guarantees you'll honor your bid), a Performance Bond (guarantees you'll complete the contract), and a Payment Bond (guarantees you'll pay subcontractors and suppliers). All three are issued same-day by Quantum Surety.",
  },
  {
    q: "How quickly can I get a surety bond as an MBE contractor?",
    a: "Same-day on most standard bonds. For bid bonds under $500K, approval is typically immediate. Larger performance and payment bonds may require financial statements, but Quantum Surety moves fast — most contractors receive their bond certificate within 24 hours.",
  },
  {
    q: "What if I've been denied a surety bond before?",
    a: "Prior denials don't disqualify you. The SBA Surety Bond Guarantee Program exists specifically for this situation — it was created to expand bonding access for small and minority contractors who don't meet traditional surety criteria. Contact us and we'll explore all available options.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Surety Bonds for MBE and HUB-Certified Texas Contractors",
  serviceType: "Surety Bond",
  url: "https://quantumsurety.bond/bonds/mbe-contractor-bond-texas",
  provider: {
    "@type": "LocalBusiness",
    name: "Quantum Surety Bonds",
    url: "https://quantumsurety.bond",
    telephone: "+12146668718",
  },
  areaServed: { "@type": "State", name: "Texas" },
  description:
    "Surety bonds for minority-owned businesses, HUB-certified contractors, and DBE-certified contractors in Texas. Bid bonds, performance bonds, and payment bonds. SBA Surety Bond Guarantee Program available.",
};

export default function MBEContractorBondTexas() {
  useSEO({
    title: "Surety Bonds for MBE Contractors Texas | HUB & DBE Certified | Quantum Surety",
    description:
      "Surety bonds for minority-owned (MBE), HUB-certified, and DBE-certified Texas contractors. Bid bonds, performance bonds, payment bonds. SBA Bond Guarantee Program available. Same-day certificates.",
    canonical: "/bonds/mbe-contractor-bond-texas",
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
            <span>MBE Contractor Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">HUB · DBE · MBE Certified</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Surety Bonds for Minority Contractors in Texas
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            HUB-certified, DBE-certified, and MBE contractors deserve fast access to bonding. We specialize in getting minority contractors bonded — including through the SBA Surety Bond Guarantee Program for those who've been turned down elsewhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Certifications served", value: "HUB · DBE · MBE", sub: "Texas Comptroller & federal programs" },
            { label: "SBA Bond Guarantee", value: "70–90%", sub: "For contractors who don't qualify traditionally" },
            { label: "Turnaround", value: "Same-day", sub: "Bid, performance & payment bonds" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-teal-100">
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className="text-xs text-teal-700 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* SBA section */}
        <section className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">The SBA Surety Bond Guarantee Program</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Most minority contractors don't know this program exists. The <strong>Small Business Administration guarantees 70–90% of your surety bond</strong> if you can't qualify through traditional channels — meaning contractors who've been denied or limited by other agencies can still compete for bonded public contracts.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The program covers bid bonds, performance bonds, and payment bonds up to <strong>$10 million</strong>. It was created specifically to expand bonding access for small and disadvantaged businesses.
              </p>
              <a href="/quote" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800">
                Ask about SBA bond guarantee eligibility <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Bond types */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bond Types for Public Contracts</h2>
          <p className="text-gray-600 text-sm mb-6">Most Texas public contracts — city, county, state, and federal — require all three of these bonds.</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: <FileText className="w-5 h-5 text-indigo-500" />,
                title: "Bid Bond",
                desc: "Submitted with your proposal. Guarantees you'll honor your bid price and execute the contract if awarded. Required to even submit a proposal on most public projects.",
                cta: "Required to bid",
              },
              {
                icon: <Shield className="w-5 h-5 text-indigo-500" />,
                title: "Performance Bond",
                desc: "Issued at contract award. Guarantees you'll complete the project according to the contract terms. Protects the project owner if you fail to perform.",
                cta: "Required at award",
              },
              {
                icon: <Users className="w-5 h-5 text-indigo-500" />,
                title: "Payment Bond",
                desc: "Issued alongside the performance bond. Guarantees you'll pay all subcontractors, laborers, and material suppliers. Required on most public work over $25K.",
                cta: "Required at award",
              },
            ].map((b) => (
              <div key={b.title} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  {b.icon}
                  <h3 className="font-bold text-gray-900">{b.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{b.desc}</p>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{b.cta}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications We Serve</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { cert: "HUB", full: "Historically Underutilized Business", body: "Texas Comptroller", detail: "Required for Texas state agency contract goals" },
              { cert: "DBE", full: "Disadvantaged Business Enterprise", body: "TxDOT / Federal", detail: "Required for federally-funded transportation projects" },
              { cert: "MBE", full: "Minority Business Enterprise", body: "NCTRCA / City programs", detail: "Required for city and county MBE participation goals" },
            ].map((c) => (
              <div key={c.cert} className="border-2 border-indigo-100 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                <div className="text-2xl font-black text-indigo-600 mb-1">{c.cert}</div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{c.full}</p>
                <p className="text-xs text-gray-500 mb-2">{c.body}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{c.detail}</p>
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
          <h2 className="text-2xl font-bold mb-2">Get Your MBE Contractor Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · HUB · DBE · MBE · SBA program available · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/bid-bond-texas", title: "Texas Bid Bond", tag: "Public Contracts" },
              { href: "/bonds/performance-bond-texas", title: "Texas Performance Bond", tag: "Contract Bonds" },
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
