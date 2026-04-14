import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, AlertCircle } from "lucide-react";

const faqs = [
  {
    q: "What is Errors & Omissions (E&O) insurance for notaries?",
    a: "Notary E&O insurance (Errors & Omissions) is a professional liability policy that protects a notary public from financial losses caused by mistakes made during the notarization process — such as failing to verify identity, notarizing an incorrect document, or missing a required seal. It covers your legal defense costs and any damages up to your policy limit.",
  },
  {
    q: "Is E&O insurance required for Texas notaries?",
    a: "No. Notary E&O insurance is not required by the State of Texas. It is an optional but strongly recommended protection. The Texas notary bond ($10,000, required by law) protects the public — not you. E&O insurance is what protects you personally from claims arising from notarial errors.",
  },
  {
    q: "What's the difference between a notary bond and E&O insurance?",
    a: "A notary bond protects the public: if you make a mistake that causes financial harm to someone, they can make a claim on your bond. But if the surety pays that claim, they can seek reimbursement from you. E&O insurance protects the notary: it covers your legal costs and settlements so you're not personally on the hook for honest mistakes.",
  },
  {
    q: "How much does notary E&O insurance cost in Texas?",
    a: "Notary E&O insurance typically costs $30–$75 per year for $25,000–$100,000 in coverage. Notary signing agent (NSA) policies with higher limits ($100,000+) may cost more. Policies are available from several providers specializing in notary professional liability.",
  },
  {
    q: "Does E&O insurance cover notary signing agents (NSAs)?",
    a: "Yes, but coverage varies. Standard notary E&O policies may have lower limits appropriate for traditional notary work. Notary signing agents who handle loan closings and real estate documents should look for NSA-specific policies with higher limits ($100,000+) to match the value of transactions they handle.",
  },
  {
    q: "Can I get my notary bond and E&O insurance together?",
    a: "Quantum Surety issues Texas notary bonds ($10,000, $50/year) directly. For E&O insurance, we can refer you to specialized providers. Some insurers bundle both the bond and E&O coverage into a single notary protection package.",
  },
];

export default function NotaryEOInsurance() {
  useSEO({
    title: "Notary E&O Insurance Texas | Errors & Omissions vs. Bond | Quantum Surety",
    description:
      "Understand the difference between a Texas notary bond and E&O insurance. Learn what E&O insurance covers, whether it's required, and how to protect yourself as a Texas notary public.",
    canonical: "/bonds/notary-eo-insurance",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/notary-bond-texas">
              <span className="hover:text-white cursor-pointer">Texas Notary Bond</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Notary E&O Insurance</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Notary Protection Guide</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Shield className="w-3 h-3" /> Bond + E&O explained</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Notary E&O Insurance in Texas — What It Is and Why It Matters
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Your Texas notary bond protects the public. Errors & Omissions (E&O) insurance protects <em>you</em>. Understand the difference and make sure you have the right coverage before your next notarization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/bonds/notary-bond-texas">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Notary Bond — $50 <ArrowRight className="w-4 h-4 ml-2" />
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

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* Key distinction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notary Bond vs. E&O Insurance: The Core Difference</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Texas Notary Bond</p>
                  <p className="text-xs text-indigo-700 font-semibold">Required by law · $10,000 · $50/year</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "Protects the PUBLIC from your mistakes",
                  "Required by Texas Secretary of State",
                  "Claimants can recover up to $10,000",
                  "You may owe the surety if a claim is paid",
                  "Does NOT protect your personal finances",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">E&O Insurance</p>
                  <p className="text-xs text-teal-700 font-semibold">Optional but recommended · $30–$75/year</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "Protects YOU from errors and claims",
                  "Not required by Texas law",
                  "Covers your legal defense costs",
                  "Pays settlements up to policy limit",
                  "No reimbursement required from you",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Who needs E&O */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Should Have Notary E&O Insurance?</h2>
          <div className="space-y-4">
            {[
              {
                title: "Notary Signing Agents (NSAs)",
                desc: "If you handle loan signings and real estate closings, you're working with documents that involve large financial transactions. A mistake on a deed of trust or promissory note could trigger a significant claim. NSA-specific E&O policies with $100,000+ limits are strongly recommended.",
                priority: "High priority",
                color: "red",
              },
              {
                title: "High-Volume Notaries",
                desc: "If you notarize dozens of documents per month, your statistical exposure to errors is higher. E&O insurance is inexpensive relative to the risk and provides peace of mind at scale.",
                priority: "Recommended",
                color: "amber",
              },
              {
                title: "Mobile Notaries",
                desc: "Mobile notaries often work independently without employer coverage. If you're operating your own mobile notary business, you should carry both a bond and E&O insurance as professional standards.",
                priority: "Recommended",
                color: "amber",
              },
              {
                title: "Traditional In-Office Notaries",
                desc: "If you notarize occasionally for your employer and have low volume, your risk exposure is lower. E&O may still be worth considering, but it's less urgent than for NSAs.",
                priority: "Optional",
                color: "green",
              },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                    item.color === "red" ? "bg-red-100 text-red-700" :
                    item.color === "amber" ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  }`}>{item.priority}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Alert box */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Important: Your bond doesn't protect you</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                A common misconception is that having a notary bond means you're "covered." Your $10,000 Texas notary bond protects someone who suffers harm from your error — not you. If a claim is paid from your bond, the surety company can pursue you for reimbursement. E&O insurance is the coverage that actually protects your personal finances.
              </p>
            </div>
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
          <h2 className="text-2xl font-bold mb-2">Start With Your Texas Notary Bond — $50</h2>
          <p className="text-indigo-200 mb-6">Required by law · Same-day issuance · Instant PDF · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bonds/notary-bond-texas">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Notary Bond <ArrowRight className="w-4 h-4 ml-2" />
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related resources</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/notary-bond-texas", title: "Texas Notary Bond", tag: "Required" },
              { href: "/blog/texas-notary-vs-notary-signing-agent", title: "Notary vs. Signing Agent", tag: "Blog" },
              { href: "/sb-693-notary-bond-requirements-2026", title: "SB-693 Requirements 2026", tag: "Guide" },
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
