import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin, AlertTriangle } from "lucide-react";

const GDN_LINK = "/get-bond?type=dealer";

const faqs = [
  { q: "Do Austin auto dealers need a GDN bond?", a: "Yes. All Texas motor vehicle dealers — including Austin and Travis County dealers — must carry a $50,000 GDN surety bond under Texas Occupations Code §503.033 as a condition of holding a TxDMV dealer license." },
  { q: "How much does a GDN bond cost for an Austin dealer?", a: "Austin dealers typically pay $100–$300/year depending on personal credit score. Good credit (720+) qualifies for the lowest rates — approximately $100–$150/year." },
  { q: "I'm opening a new dealership in Austin — can I get bonded before my lot is ready?", a: "Yes. Your GDN bond can be purchased before your lot is fully operational. You'll need the bond certificate as part of your initial TxDMV GDN license application, which is typically submitted before you open." },
  { q: "Does the GDN bond cover wholesale dealers in the Austin area?", a: "Yes. The $50,000 GDN bond requirement applies to all six Texas dealer license types — including wholesale dealers — regardless of city or county." },
  { q: "How do I submit my GDN bond to TxDMV in Austin?", a: "After purchasing, you receive an instant PDF certificate. Upload it through TxDMV's eLICENSING portal at txdmv.gov as part of your GDN license application or annual renewal." },
];

export default function GDNBondAustin() {
  useSEO({
    title: "GDN Bond Austin TX | Texas Motor Vehicle Dealer Bond | Quantum Surety",
    description: "Get your Texas GDN dealer bond in Austin same-day. Required under §503.033 for all Travis County motor vehicle dealer licenses. $50,000 bond from $100/yr. Instant PDF.",
    canonical: "/bonds/gdn-bond-austin",
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/gdn-bond-texas"><span className="hover:text-white cursor-pointer">GDN Bond Texas</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Austin</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3" /> Austin, TX</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">GDN Bond — Austin, Texas Motor Vehicle Dealers</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Austin's fast-growing auto market means more dealers — and more GDN bond requirements. Every licensed motor vehicle dealer in Austin and Travis County needs a $50,000 GDN surety bond. Get yours same-day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={GDN_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[{ label: "Bond amount", value: "$50,000", sub: "Required under §503.033" }, { label: "Annual cost", value: "From $100/yr", sub: "Credit-based pricing" }, { label: "Delivery", value: "Same-day", sub: "Instant PDF by email" }].map((item) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Austin Dealer License Types That Require a GDN Bond</h2>
          <p className="text-gray-600 text-sm mb-6">All six TxDMV dealer license categories require a $50,000 GDN bond — whether your dealership is in Austin, Round Rock, Cedar Park, or anywhere in the greater Austin area.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {["New Motor Vehicle Dealer", "Used Motor Vehicle Dealer", "Wholesale Motor Vehicle Dealer", "Motorcycle Dealer", "Buy Here Pay Here (BHPH) Dealer", "Lease / Finance Company"].map((type) => (
              <div key={type} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{type}</p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">Bond amount: $50,000</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Operating without a bond is a Class A misdemeanor</h2>
              <p className="text-gray-700 text-sm leading-relaxed">Texas Occupations Code §503.033 requires all licensed motor vehicle dealers to maintain a valid GDN bond. Operating without one is a Class A misdemeanor — fines up to $4,000, up to one year in jail, and potential license revocation by TxDMV.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions — Austin GDN Bond</h2>
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
          <h2 className="text-2xl font-bold mb-2">Get Your Austin GDN Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All TxDMV dealer types · From $100/yr · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={GDN_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button>
            </a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related pages</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[{ href: "/bonds/gdn-bond-dallas", title: "GDN Bond — Dallas", tag: "Dallas" }, { href: "/bonds/gdn-bond-houston", title: "GDN Bond — Houston", tag: "Houston" }, { href: "/bonds/gdn-bond-texas", title: "Texas GDN Bond Overview", tag: "Statewide" }].map((item) => (
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
