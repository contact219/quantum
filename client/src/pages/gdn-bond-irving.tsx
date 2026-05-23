import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin, AlertTriangle } from "lucide-react";

const GDN_LINK = "/get-bond?type=dealer";

const faqs = [
  { q: "Do Irving auto dealers need a GDN bond?", a: "Yes. Every licensed motor vehicle dealer in Texas  including dealers in Dallas County and the DFW metroplex  must carry a $50,000 GDN surety bond under Texas Occupations Code 503.033 before TxDMV will issue or renew a dealer license." },
  { q: "How much does a GDN bond cost for a Irving dealer?", a: "Most Irving dealers pay $100$300 per year. Your exact rate is based on your personal credit score. Dealers with good credit (720+) typically pay around $100$150/year for $50,000 in coverage." },
  { q: "How fast can I get a GDN bond in Irving?", a: "Same-day. Apply online, get approved, and receive your bond certificate as an instant PDF  ready to submit to TxDMV's eLICENSING portal the same day." },
  { q: "What happens if my GDN bond lapses?", a: "A lapsed bond invalidates your dealer license. Operating without a valid bond is a Class A misdemeanor under Texas law  fines up to $4,000 and up to one year in jail. Quantum Surety sends renewal reminders so your coverage never lapses." },
];

export default function GDNBondIrving() {
  useSEO({
    title: "GDN Bond Irving TX | Texas Motor Vehicle Dealer Bond | Quantum Surety",
    description: "Get your Texas GDN dealer bond in Irving same-day. Required under 503.033 for all motor vehicle dealer licenses. $50,000 bond from $100/yr. Instant PDF delivery.",
    canonical: "/bonds/gdn-bond-irving",
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/gdn-bond-texas"><span className="hover:text-white cursor-pointer">GDN Bond Texas</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Irving</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3" /> Irving, TX</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Same-day issuance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">GDN Bond  Irving, Texas Motor Vehicle Dealers</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Irving motor vehicle dealers need a $50,000 GDN surety bond before TxDMV will issue or renew a dealer license. Get bonded same-day  instant PDF certificate, accepted by TxDMV eLICENSING.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={GDN_LINK}><Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" /></Button></a>
            <a href="tel:2146668718"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button></a>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[{ label: "Bond amount", value: "$50,000", sub: "Required under 503.033" }, { label: "Annual cost", value: "From $100/yr", sub: "Credit-based pricing" }, { label: "Delivery", value: "Same-day", sub: "Instant PDF by email" }].map((item) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Irving Dealer License Types That Require a GDN Bond</h2>
          <p className="text-gray-600 text-sm mb-6">All TxDMV dealer license categories require a $50,000 GDN bond  whether your lot is in Irving or anywhere in Dallas County and the DFW metroplex.</p>
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
              <p className="text-gray-700 text-sm leading-relaxed">Texas Occupations Code 503.033 makes it a Class A misdemeanor to operate as a motor vehicle dealer without a valid GDN bond on file with TxDMV. Penalties include fines up to $4,000, up to one year in jail, and license revocation. A lapsed bond  even for a day  creates the same exposure.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions  Irving GDN Bond</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200"><p className="font-semibold text-gray-900 text-sm flex items-start gap-2"><Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{item.q}</p></div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{item.a}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Irving GDN Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance  All TxDMV dealer types  From $100/yr  TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={GDN_LINK}><Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" /></Button></a>
            <a href="tel:2146668718"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (214) 666-8718</Button></a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related pages</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[{ href: "/bonds/gdn-bond-dallas", title: "GDN Bond  Dallas", tag: "Dallas" }, { href: "/bonds/gdn-bond-texas", title: "Texas GDN Bond Overview", tag: "Statewide" }, { href: "/bonds/auto-dealer-bond-texas", title: "Auto Dealer Bond Texas", tag: "All Dealers" }].map((item) => (
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