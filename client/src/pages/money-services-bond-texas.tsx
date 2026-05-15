import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, AlertTriangle } from "lucide-react";

const QUOTE_LINK = "/quote?type=license&bond=money-services";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Texas Money Services Bond",
  "serviceType": "Surety Bond",
  "url": "https://quantumsurety.bond/bonds/money-services-bond-texas",
  "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  "areaServed": { "@type": "State", "name": "Texas" },
  "description": "Texas money services business surety bond required by the Texas Department of Banking under Finance Code Chapter 151. Minimum $300,000. Instant quotes.",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "description": "Texas money services bonds from $300,000 minimum. Rates based on business volume and credit." }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a Texas money services bond?", "acceptedAnswer": { "@type": "Answer", "text": "A Texas money services bond is a surety bond required by the Texas Department of Banking (TDB) for money services businesses (MSBs) under Texas Finance Code Chapter 151. The bond — or an equivalent permissible investment — protects consumers from losses caused by MSB insolvency or misconduct. The minimum bond amount is $300,000." } },
    { "@type": "Question", "name": "Who needs a money services license and bond in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Any business engaged in money transmission, currency exchange, selling payment instruments, stored value, or prepaid access products in Texas must obtain a license from the Texas Department of Banking under Finance Code Chapter 151. This includes money transfer companies, remittance providers, currency dealers, and prepaid card issuers." } },
    { "@type": "Question", "name": "How much is the Texas money services bond?", "acceptedAnswer": { "@type": "Answer", "text": "The Texas Finance Code §151.308 requires a minimum $300,000 surety bond (or permissible investments of equivalent value). The required amount may increase based on the dollar volume of transactions. Large-volume operators may need bonds up to $2,000,000 or more. Contact Quantum Surety for a custom quote based on your transaction volume." } },
    { "@type": "Question", "name": "How much does a Texas money services bond cost?", "acceptedAnswer": { "@type": "Answer", "text": "Premium for a Texas money services bond depends on the bond amount, the company's financial strength, and ownership credit history. For a $300,000 bond, well-qualified applicants typically pay $3,000–$9,000 per year (1%–3% of the bond amount). Larger bonds are quoted individually." } },
    { "@type": "Question", "name": "What agency regulates money services businesses in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "The Texas Department of Banking (TDB) regulates and licenses money services businesses in Texas under Finance Code Chapter 151 (the Money Services Act). Federal oversight is also required — money services businesses must register with FinCEN as a Money Services Business and comply with Bank Secrecy Act requirements." } }
  ]
};

const faqs = [
  { q: "What is a Texas money services bond?", a: "A Texas money services bond is a surety bond required by the Texas Department of Banking (TDB) for money services businesses (MSBs) under Texas Finance Code Chapter 151. The bond — or an equivalent permissible investment — protects consumers from losses caused by MSB insolvency or misconduct. The minimum bond amount is $300,000." },
  { q: "Who needs a money services license and bond in Texas?", a: "Any business engaged in money transmission, currency exchange, selling payment instruments, stored value, or prepaid access products in Texas must obtain a license from the Texas Department of Banking under Finance Code Chapter 151. This includes money transfer companies, remittance providers, currency dealers, and prepaid card issuers." },
  { q: "How much is the Texas money services bond?", a: "Texas Finance Code §151.308 requires a minimum $300,000 surety bond (or permissible investments of equivalent value). The required amount may increase based on transaction volume. Large-volume operators may need bonds up to $2,000,000 or more. Contact Quantum Surety for a custom quote based on your transaction volume." },
  { q: "How much does a Texas money services bond cost?", a: "Premium for a Texas money services bond depends on the bond amount, the company's financial strength, and ownership credit history. For a $300,000 bond, well-qualified applicants typically pay $3,000–$9,000 per year (1%–3% of the bond amount). Larger bonds are quoted individually." },
  { q: "What agency regulates money services businesses in Texas?", a: "The Texas Department of Banking (TDB) regulates and licenses money services businesses in Texas under Finance Code Chapter 151 (the Money Services Act). Federal oversight is also required — money services businesses must register with FinCEN as a Money Services Business and comply with Bank Secrecy Act requirements." },
  { q: "Is a surety bond required or can we use permissible investments instead?", a: "Texas Finance Code §151.308 allows money services businesses to satisfy the security requirement with a surety bond OR permissible investments (e.g., U.S. Treasury securities, certificates of deposit). Many businesses choose the surety bond because it requires only a small annual premium rather than tying up $300,000+ in capital." },
];

export default function MoneyServicesBondTexas() {
  useSEO({
    title: "Texas Money Services Bond | $300K MSB Bond | Finance Code Ch. 151 | Quantum Surety",
    description: "Texas money services business (MSB) surety bond required by the Texas Department of Banking under Finance Code Ch. 151. $300,000 minimum bond. Get an instant quote.",
    canonical: "/bonds/money-services-bond-texas",
  });
  useSchema(SERVICE_SCHEMA, "ld-json-Service");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/commercial"><span className="hover:text-white cursor-pointer">Commercial Bonds</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Money Services Bond</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Finance Code Ch. 151</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Custom quotes available</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Money Services Bond — TDB License Requirement</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            The Texas Department of Banking requires all money services businesses to maintain a minimum $300,000 surety bond under Texas Finance Code Chapter 151. Quantum Surety provides custom quotes for MSB bonds at all volume tiers — from remittance startups to established money transmitters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get an MSB Bond Quote <ArrowRight className="w-4 h-4 ml-2" /></Button>
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
            { label: "Minimum bond", value: "$300,000", sub: "Tex. Finance Code §151.308" },
            { label: "Annual premium", value: "From 1%", sub: "Credit & volume based" },
            { label: "Regulator", value: "TX Dept of Banking", sub: "Finance Code Ch. 151" }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Texas Money Services Act — Bond Requirements</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The <strong>Texas Finance Code Chapter 151</strong> (Money Services Act) requires any business engaged in money transmission, currency exchange, payment instrument sales, or stored-value products in Texas to be licensed by the <strong>Texas Department of Banking (TDB)</strong>. A surety bond — or equivalent permissible investment — must be maintained throughout the license period.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            The bond protects Texas consumers from financial losses caused by an MSB's insolvency, fraud, or failure to transmit funds. The minimum bond amount is <strong>$300,000</strong>, but TDB may require additional security based on your transaction volume.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Minimum bond amount", detail: "$300,000 per Texas Finance Code §151.308" },
              { title: "Who needs it", detail: "Money transmitters, currency dealers, prepaid card issuers, remittance companies" },
              { title: "Regulator", detail: "Texas Department of Banking (TDB), Money Services Division" },
              { title: "Federal requirement", detail: "Must also register with FinCEN as a Money Services Business" },
              { title: "License term", detail: "Annual license renewed with TDB" },
              { title: "Alternative to bond", detail: "Permissible investments (T-bills, CDs) — same dollar amount required" },
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

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Why a surety bond beats permissible investments for most MSBs</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                TDB allows MSBs to satisfy the security requirement with either a surety bond OR $300,000+ in permissible investments (government securities, CDs). With a surety bond, you pay only the annual premium (typically $3,000–$9,000 on a $300K bond) — rather than locking up $300,000 in capital. For growing MSBs, this frees working capital for operations and compliance infrastructure.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Needs a Texas Money Services License</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Money transmitters", detail: "Companies that transmit money domestically or internationally, including remittance companies" },
              { title: "Currency dealers/exchangers", detail: "Businesses that buy and sell foreign currency or provide foreign exchange services" },
              { title: "Payment instrument sellers", detail: "Sellers of money orders, traveler's checks, or similar instruments" },
              { title: "Stored value / prepaid", detail: "Issuers of prepaid debit cards, stored value cards, and prepaid access products" },
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
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Money Services Bond Quote</h2>
          <p className="text-indigo-200 mb-6">$300K minimum bond · Custom quotes for all volume tiers · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={QUOTE_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Request a Quote <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (972) 379-9216</Button>
            </a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related commercial surety bonds</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/mortgage-broker-bond-texas", title: "Texas Mortgage Company Bond", tag: "TDSML Required" },
              { href: "/bonds/collection-agency-bond-texas", title: "Collection Agency Bond", tag: "OCCC Required" },
              { href: "/bonds/credit-access-business-bond-texas", title: "Credit Access Business Bond", tag: "OCCC Required" },
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
