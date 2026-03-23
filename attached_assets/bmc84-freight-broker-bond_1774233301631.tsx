import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, DollarSign, FileText, Truck, RefreshCw } from "lucide-react";

export default function BMC84FreightBrokerBond() {
  useSEO({
    title: "BMC-84 Freight Broker Bond | $75,000 FMCSA Bond | Quantum Surety",
    description:
      "Get your BMC-84 freight broker surety bond fast. $75,000 FMCSA-required bond for freight brokers and forwarders. Rates from $938/year. Same-day filing with FMCSA. AI-powered approvals.",
    canonical: "/bonds/bmc-84-freight-broker",
  });

  const steps = [
    {
      step: "1",
      title: "Apply online in minutes",
      body: "Tell us your name, business details, and MC number. We run a soft credit check — no hard pull, no financial statements needed for most applicants.",
    },
    {
      step: "2",
      title: "Instant quote",
      body: "Our AI-powered underwriting delivers a bond quote immediately for most applicants. Rates start at $938/year for qualified brokers.",
    },
    {
      step: "3",
      title: "Pay and get filed",
      body: "Pay your premium online. We coordinate electronic filing with the FMCSA within 24 hours. Your bond status appears in the FMCSA system within 1–3 business days.",
    },
  ];

  const faqs = [
    {
      q: "What is a BMC-84 bond?",
      a: "A BMC-84 is the surety bond required by the Federal Motor Carrier Safety Administration (FMCSA) for all licensed freight brokers and freight forwarders operating in the United States. The bond amount is $75,000 and it must be on file with the FMCSA before your broker license is activated. It protects motor carriers and shippers if a broker fails to pay for services rendered.",
    },
    {
      q: "How much does a BMC-84 bond cost?",
      a: "Rates start at $938 per year for freight brokers with good credit and established business history. Brokers with credit scores between 650–725 typically pay $2,500–$4,000/year. The exact rate depends on your personal credit score, years in business, and claims history. Use our quote form to get your exact rate in minutes.",
    },
    {
      q: "How quickly can I get my BMC-84 bond?",
      a: "Most applicants receive a quote instantly. Once you pay your premium, we coordinate electronic filing with the FMCSA within 24 hours. Your bond shows as active in the FMCSA Licensing & Insurance portal within 1–3 business days.",
    },
    {
      q: "I currently have a BMC-85 trust fund. Do I need to switch?",
      a: "Yes, if your trust fund provider no longer qualifies under the FMCSA's updated rules effective January 2026. The FMCSA estimates over 90% of previous BMC-85 providers are no longer eligible. Switching to a BMC-84 bond is the simplest and most affordable solution — most brokers pay less than $2,000/year vs. $75,000 tied up in a trust.",
    },
    {
      q: "Do I need an MC number to apply?",
      a: "You do not need an MC number to get a quote. However, you will need your MC number before we can file the bond with the FMCSA. If you are starting a new brokerage, you can apply for FMCSA broker authority and your bond simultaneously.",
    },
    {
      q: "What happens when my BMC-84 bond expires?",
      a: "BMC-84 bonds renew annually. We send renewal notices 60 and 30 days before expiration. If your bond lapses, the FMCSA can immediately suspend your broker operating authority — so timely renewal is critical. We make renewals simple: pay your renewal invoice and we handle the re-filing.",
    },
    {
      q: "Can I get bonded with bad credit?",
      a: "Yes. Programs exist for brokers with credit scores below 650, though rates are higher (typically 5–12% of the bond amount, or $3,750–$9,000/year). Some high-risk programs may require partial collateral. Contact us to discuss your options.",
    },
  ];

  const rates = [
    { credit: "Excellent (750+)", rate: "$938–$1,500/yr", label: "Best rate" },
    { credit: "Good (700–749)", rate: "$1,500–$2,500/yr", label: "Standard" },
    { credit: "Fair (650–699)", rate: "$2,500–$4,500/yr", label: "Higher risk" },
    { credit: "Below 650", rate: "$4,500–$9,000/yr", label: "High-risk program" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Truck className="w-4 h-4" />
            FMCSA-Required · Electronic Filing · All 50 States
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            BMC-84 Freight Broker Bond
          </h1>
          <p className="text-xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            The $75,000 FMCSA surety bond every freight broker needs to operate legally.
            AI-powered approvals, same-day FMCSA filing, rates from $938/year.
          </p>
          <p className="text-sm text-indigo-300 mb-8">
            Previously on a BMC-85 trust? New FMCSA rules effective January 2026 — switching to BMC-84 is fast and affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote?type=bmc84">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My BMC-84 Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ai-bond-finder">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Have Questions? Ask Our AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key stats */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: DollarSign, label: "Bond amount", value: "$75,000", sub: "FMCSA requirement" },
            { icon: Clock, label: "Filing time", value: "24 hrs", sub: "After payment" },
            { icon: FileText, label: "Rates from", value: "$938/yr", sub: "Good credit" },
            { icon: RefreshCw, label: "Renewal", value: "Annual", sub: "We handle re-filing" },
          ].map((stat) => (
            <div key={stat.label}>
              <stat.icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BMC-85 migration alert */}
      <section className="py-8 px-4 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">Important: FMCSA rule change effective January 2026</p>
            <p className="text-amber-800 text-sm mt-1">
              The FMCSA's updated financial responsibility rules have eliminated most unfunded BMC-85 trust fund providers. If your BMC-85 trust is no longer compliant, your broker authority is at risk of suspension. Switching to a BMC-84 bond takes less than 24 hours and costs a fraction of the $75,000 trust requirement.
            </p>
            <Link href="/quote?type=bmc84&from=bmc85">
              <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700 text-white">
                Switch from BMC-85 to BMC-84 <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Get Your BMC-84 Bond
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate table */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">BMC-84 Bond Rates</h2>
          <p className="text-center text-gray-600 mb-10">
            Your exact rate is determined by credit score, years in business, and claims history. Get your exact quote in minutes.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {rates.map((r) => (
              <div key={r.credit} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-xs text-gray-500 mb-1">{r.label}</div>
                <div className="text-lg font-bold text-indigo-700 mb-2">{r.rate}</div>
                <div className="text-xs text-gray-600">{r.credit}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Rates are estimates. Your exact premium is determined by underwriting review.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            What's Included with Your BMC-84 Bond
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Electronic FMCSA filing within 24 hours of payment",
              "Bond certificate delivered by email",
              "60-day and 30-day renewal reminders",
              "Automatic renewal filing when premium is paid",
              "FMCSA compliance support from our team",
              "Online bond status verification 24/7",
              "Claims defense support through our carrier",
              "Coverage in all 50 states",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">BMC-84 Bond FAQ</h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-200 pb-8">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Your BMC-84 Bond Today</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Rates from $938/year. FMCSA filing within 24 hours. All 50 states.
          </p>
          <Link href="/quote?type=bmc84">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-10">
              Get My Instant Quote <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
