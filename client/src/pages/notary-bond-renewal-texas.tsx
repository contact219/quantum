import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, RefreshCw, AlertTriangle } from "lucide-react";

const NOTARY_LINK = "/get-bond?type=notary";

const faqs = [
  { q: "When do I need to renew my Texas notary bond?", a: "You need a new notary bond each time you renew your 4-year Texas notary commission. Your bond expires when your commission expires. You cannot file a commission renewal with the Secretary of State without a current bond." },
  { q: "Is renewing a Texas notary bond different from getting a new one?", a: "The bond itself is the same $10,000, 4-year, $50 product — the process is identical whether you're a first-time applicant or renewing. However, under SB693 (effective January 2026), renewing notaries commissioned after September 1, 2025 must also complete the mandatory education course before filing." },
  { q: "Do I need to retake the SB693 education course when I renew?", a: "If your original commission was granted on or after September 1, 2025, you will need to complete the education course again upon renewal. Notaries commissioned before September 1, 2025 were exempt from the initial course but should verify current SOS requirements for subsequent renewals." },
  { q: "How long does notary bond renewal take?", a: "The bond purchase takes under 5 minutes. Your new certificate is emailed instantly. Combined with the SOS Portal application, most Texas notaries complete the full renewal in under 30 minutes." },
  { q: "Can I renew my notary bond before my current one expires?", a: "Yes. You can purchase a new bond up to 90 days before your commission expires. The new bond term starts the day after your current commission ends, ensuring continuous coverage." },
  { q: "What happens if my notary bond lapses before I renew?", a: "A lapsed bond means your notary commission is invalid — you cannot legally perform notarizations until your commission is renewed and a current bond is on file with the Secretary of State. Resume your commission as quickly as possible to avoid liability for any notarizations performed during the gap." },
];

export default function NotaryBondRenewalTexas() {
  useSEO({
    title: "Texas Notary Bond Renewal 2026 | Renew Your $10,000 Notary Bond | Quantum Surety",
    description: "Renewing your Texas notary commission in 2026? Get your new $10,000 notary bond instantly for $50. SB693 compliant. Instant PDF — ready to file with the Texas Secretary of State today.",
    canonical: "/bonds/notary-bond-renewal-texas",
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/bonds/notary-bond-texas"><span className="hover:text-white cursor-pointer">Notary Bond Texas</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Renewal</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Notary Bond Renewal</span>
            <span className="bg-teal-400/20 text-teal-200 text-xs font-semibold px-3 py-1 rounded-full border border-teal-400/30">SB693 Compliant · 2026</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> Instant download</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Texas Notary Bond Renewal — $50, Instant PDF</h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-2xl">
            Renewing your Texas notary commission? You need a new $10,000 notary bond — same $50 price, instant delivery. SB693 compliant for 2026 renewals. Certificate emailed immediately, ready to file with the Secretary of State.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={NOTARY_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Renew My Notary Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (972) 379-9216</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "Bond amount", value: "$10,000", sub: "Required by SOS" },
            { label: "Price", value: "$50", sub: "One-time · 4-year term" },
            { label: "Credit check", value: "None", sub: "Available to all applicants" },
            { label: "Delivery", value: "Instant PDF", sub: "Email in minutes" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 border border-teal-100">
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className="text-xs text-teal-700 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* Renewal checklist */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Texas Notary Commission Renewal Checklist (2026)</h2>
          <p className="text-gray-600 text-sm mb-6">Complete these steps in order to successfully renew your Texas notary commission under SB693 requirements.</p>
          <div className="space-y-3">
            {[
              { step: "1", title: "Purchase your new notary bond — $50", detail: "Your renewal bond must cover the new 4-year commission term. Buy it here — instant PDF emailed to you in minutes. This is the same bond as your original commission, just for a new term.", timing: "Before filing" },
              { step: "2", title: "Complete the SB693 education course (if required)", detail: "Notaries who received their original commission on or after September 1, 2025 must complete the mandatory online education course via the Texas SOS Portal. Cost: $20/attempt. A 70% score is required to pass.", timing: "Before filing" },
              { step: "3", title: "File renewal via the Texas SOS Portal", detail: "Log into the Secretary of State's SOS Portal Notary System at sos.state.tx.us. Complete your commission renewal application and upload your new bond certificate. Pay the $21 SOS filing fee.", timing: "Online" },
              { step: "4", title: "Take the oath of office", detail: "After your commission is approved, you must take an oath of office before a notary public in your county. Some counties require this in-person; others may have alternatives. Check with your county clerk.", timing: "After approval" },
              { step: "5", title: "Update your notary seal / stamp", detail: "Your new commission has a new expiration date. Order an updated notary seal that reflects your new commission dates before performing any notarizations under the new term.", timing: "After approval" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{item.step}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5">{item.timing}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SB693 renewal callout */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">What SB693 changes for 2026 renewals</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">Senate Bill 693, effective January 1, 2026, added new requirements that affect notary renewals:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: "Mandatory education course", body: "Required for any notary whose original commission was granted on or after September 1, 2025. $20/attempt via the SOS Portal." },
                  { title: "Journal now legally required", body: "A notary journal is no longer just recommended — it's required by law. Keep completed journals for 10 years from the date of each notarial act." },
                  { title: "Increased criminal penalties", body: "Improper notarizations can now result in misdemeanor or felony charges depending on severity. The bond requirement is more important than ever." },
                  { title: "10-year record retention", body: "Records of all notarial acts must be retained for 10 years, not just the duration of your commission." },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-lg p-4 border border-amber-200">
                    <h3 className="font-semibold text-amber-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-gray-700 text-xs leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why renew with Quantum */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-start gap-4">
            <RefreshCw className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Why renew your notary bond with Quantum Surety</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Same $50 flat rate — no renewal surcharges",
                  "Instant PDF certificate — download in minutes",
                  "No credit check — same as your original bond",
                  "SB693 compliant for 2026 renewals",
                  "TDI-licensed Texas agency #3480229",
                  "Renewal reminders so you never miss your date",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="text-gray-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notary Bond Renewal — Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-bold mb-2">Renew Your Texas Notary Bond — $50</h2>
          <p className="text-indigo-200 mb-6">$10,000 · 4-year term · No credit check · Instant PDF · SB693 compliant · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={NOTARY_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">Renew My Notary Bond <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8"><Phone className="w-4 h-4 mr-2" /> (972) 379-9216</Button>
            </a>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/bonds/notary-bond-texas", title: "Texas Notary Bond — New Applications", tag: "Product Page" },
              { href: "/blog/texas-notary-bond-sb693-renewal-2026", title: "SB693 Renewal Guide 2026", tag: "Blog" },
              { href: "/blog/texas-notary-bond-cost-2026", title: "How Much Does a Texas Notary Bond Cost?", tag: "Blog" },
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
