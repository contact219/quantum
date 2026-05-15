import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight } from "lucide-react";

const QUOTE_LINK = "/quote?type=license&bond=process-server";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Process Server Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/process-server-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas process server surety bond required by the Office of Court Administration for certified process servers. $1,000 bond. Instant online issuance.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "price": "50", "priceValidUntil": "2027-12-31", "availability": "https://schema.org/InStock" }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do process servers need a bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Texas Supreme Court Order governing certified process servers requires applicants to maintain a $1,000 surety bond as part of the certification process with the Office of Court Administration (OCA). The bond must remain active throughout the certification period." } },
    { "@type": "Question", "name": "How much does a Texas process server bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas process server bond ($1,000 coverage) typically costs $50–$75 per year. This is one of the most affordable professional bonds in Texas. Instant online issuance with same-day PDF delivery." } },
    { "@type": "Question", "name": "Who certifies process servers in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "The Office of Court Administration (OCA) certifies process servers in Texas through the Judicial Branch Certification Commission (JBCC). Certification is required for process servers who serve process under Texas Rule of Civil Procedure 103 and 536a as an authorized person." } },
    { "@type": "Question", "name": "What does a process server bond cover?", "acceptedAnswer": { "@type": "Answer", "text": "A process server bond protects parties in legal proceedings from financial harm caused by a process server's negligence, fraud, or improper service of process. If a process server's misconduct causes a judgment to be set aside or delays a legal proceeding, the bond provides compensation." } }
  ]
};

const faqs = [
  { q: "Do process servers need a bond in Texas?", a: "Yes. The Texas Supreme Court Order governing certified process servers requires applicants to maintain a $1,000 surety bond as part of the certification process with the Office of Court Administration (OCA). The bond must remain active throughout the certification period." },
  { q: "How much does a Texas process server bond cost?", a: "A Texas process server bond ($1,000 coverage) typically costs $50–$75 per year. This is one of the most affordable professional bonds in Texas. Instant online issuance with same-day PDF delivery." },
  { q: "Who certifies process servers in Texas?", a: "The Office of Court Administration (OCA) certifies process servers in Texas through the Judicial Branch Certification Commission (JBCC). Certification is required for process servers who serve process under Texas Rule of Civil Procedure 103 and 536a as an authorized person." },
  { q: "What does a process server bond cover?", a: "A process server bond protects parties in legal proceedings from financial harm caused by a process server's negligence, fraud, or improper service of process. If a process server's misconduct causes a judgment to be set aside or delays a legal proceeding, the bond provides compensation." },
  { q: "How long is a Texas process server certification?", a: "Texas process server certifications are issued for two-year terms and must be renewed biennially with the JBCC. Your $1,000 surety bond must remain active throughout the certification period to maintain your certification." },
  { q: "Does every county in Texas require a process server bond?", a: "The $1,000 bond requirement applies to process servers certified under the statewide JBCC certification program. Individual county courts may have additional requirements for process servers operating under local court rules. Contact Quantum Surety for guidance on your specific county's requirements." },
];

export default function ProcessServerBondTexas() {
  useSEO({
    title: "Texas Process Server Bond | $1,000 OCA Bond | Instant Online | Quantum Surety",
    description: "Texas process server surety bond required by OCA for certified process servers. $1,000 bond, from $50/yr. Instant PDF by email. JBCC certification requirement.",
    canonical: "/bonds/process-server-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/license-bond-texas"><span className="hover:text-white cursor-pointer">Texas License Bonds</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Process Server Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">OCA / JBCC Certification Requirement</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Process Server Bond — OCA Certification Requirement</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Texas certified process servers must maintain a $1,000 surety bond with the Office of Court Administration (OCA) through the Judicial Branch Certification Commission. Get your bond same-day — instant PDF, accepted by JBCC for certification and renewal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Process Server Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (972) 379-9216</Button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Bond amount", value: "$1,000", sub: "OCA certification requirement" },
            { label: "Annual cost", value: "From $50/yr", sub: "Flat-rate pricing" },
            { label: "Delivery", value: "Same-day", sub: "Instant PDF by email" }
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
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Process Server Bond Requirements</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The <strong>Judicial Branch Certification Commission (JBCC)</strong> — an arm of the Office of Court Administration — certifies process servers in Texas under the Texas Supreme Court's process server certification rules. To obtain or renew your certification, you must submit a <strong>$1,000 surety bond</strong> along with your application.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Certified process servers are authorized to serve civil process in Texas courts under <strong>Texas Rules of Civil Procedure 103 and 536a</strong>. Without a current certification and bond, you cannot serve process as an independent process server in Texas state courts.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Bond amount", detail: "$1,000 — OCA / JBCC requirement" },
              { title: "Certification body", detail: "Judicial Branch Certification Commission (JBCC)" },
              { title: "Certification term", detail: "2-year term, renewed biennially" },
              { title: "Authority", detail: "Texas Rules of Civil Procedure 103 & 536a" },
              { title: "Annual cost", detail: "From $50/yr — flat-rate" },
              { title: "Delivery", detail: "Instant PDF, JBCC-accepted" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2"><Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{item.q}</p>
                </div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{item.a}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Process Server Bond Today</h2>
          <p className="text-indigo-200 mb-6">$1,000 OCA-accepted bond · From $50/yr · Instant PDF · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (972) 379-9216</Button>
            </a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related Texas license bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/notary-bond-texas", title: "Texas Notary Bond", tag: "SoS Required" },
              { href: "/bonds/license-bond-texas", title: "All Texas License Bonds", tag: "Hub Page" },
              { href: "/bonds/home-inspector-bond-texas", title: "Home Inspector Bond", tag: "TREC Required" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-1 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 flex items-center gap-1">View page <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
