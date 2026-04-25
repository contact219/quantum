import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Phone, ChevronRight, AlertTriangle, Shield } from "lucide-react";

const GDN_LINK = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R4210CMBA2&State=TX";

export default function BlogGDNBondRequirements2026() {
  useSEO({
    title: "Texas GDN Bond Requirements 2026: What Every Motor Vehicle Dealer Needs to Know | Quantum Surety",
    description:
      "Complete guide to Texas GDN bond requirements in 2026. What a GDN bond is, why it's required under §503.033, all 6 dealer license types, bond amount, and what happens if you operate without one.",
    canonical: "/blog/texas-gdn-bond-requirements-2026",
    ogType: "article",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Article", "publisher": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" } }, "ld-json-Article");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas Auto Dealers</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Auto Dealers</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 7 min read</span>
            <span className="text-indigo-300 text-sm">April 25, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Texas GDN Bond Requirements 2026: What Every Motor Vehicle Dealer Needs to Know
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            If you hold — or are applying for — a Texas motor vehicle dealer license, a $50,000 GDN surety bond is not optional. Here's exactly what's required, why it exists, and what happens if you skip it.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="space-y-12">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a Texas GDN bond?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A GDN bond — short for General Distinguishing Number bond — is a $50,000 surety bond required by the Texas Department of Motor Vehicles (TxDMV) as a condition of holding any motor vehicle dealer license in Texas. The requirement is codified in <strong>Texas Occupations Code §503.033</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The bond is not insurance for your business. It's a financial guarantee to the state and to consumers that you will operate your dealership lawfully. If you commit fraud, fail to transfer a vehicle title, misrepresent a vehicle's condition, or violate Texas dealer licensing rules, a harmed party can file a claim against your bond to recover their losses.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Unlike insurance — where the insurer absorbs the loss — a surety bond works like a line of credit. If the surety pays a claim, <strong>you are personally obligated to repay the surety company</strong>. The bond protects the public; it does not protect you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is required to carry a GDN bond?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Every Texas motor vehicle dealer that holds an active GDN license is required to maintain a valid $50,000 surety bond. This requirement applies across all six dealer license categories:
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900">Dealer License Type</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">Bond Required</th>
                    <th className="text-center px-4 py-3 font-semibold text-teal-700">Bond Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["New Motor Vehicle Dealer (Franchised)", "Yes", "$50,000"],
                    ["Used Motor Vehicle Dealer (Independent)", "Yes", "$50,000"],
                    ["Wholesale Motor Vehicle Dealer", "Yes", "$50,000"],
                    ["Motorcycle Dealer", "Yes", "$50,000"],
                    ["Buy Here Pay Here (BHPH) Dealer", "Yes", "$50,000"],
                    ["Lease / Finance Company", "Yes", "$50,000"],
                  ].map(([type, req, amount], i) => (
                    <tr key={type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">{type}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-teal-700 font-medium text-xs">
                          <CheckCircle className="w-3.5 h-3.5" /> {req}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-900">{amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Source: Texas Occupations Code §503.033 / TxDMV dealer licensing requirements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why does Texas require a GDN bond?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Texas licensed more than 20,000 active motor vehicle dealers as of 2025. Vehicle sales involve some of the largest single transactions most consumers ever make. The GDN bond requirement exists for three main reasons:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Consumer protection",
                  body: "Dealers handle vehicle titles, lien payoffs, and large sums of consumer money. The bond ensures that if a dealer commits fraud, fails to deliver a clear title, or misrepresents a vehicle, the consumer has a financial remedy beyond a civil lawsuit against the dealer directly.",
                },
                {
                  title: "State regulatory enforcement",
                  body: "TxDMV uses the bond requirement as a gatekeeping mechanism. Dealers who cannot obtain a bond — typically because of serious fraud history — cannot obtain or renew their license. The bond requirement filters out the highest-risk applicants before they open their doors.",
                },
                {
                  title: "Title and lien accountability",
                  body: "One of the most common dealer-related consumer complaints involves title delays and undisclosed liens. The GDN bond creates a financial incentive for dealers to handle title work correctly and on time. A single claim can cost a dealer their entire $50,000 bond.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                  <h3 className="font-bold text-indigo-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Class A misdemeanor: operating without a valid GDN bond</h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Texas Occupations Code §503.033 makes it a <strong>Class A misdemeanor</strong> to operate as a motor vehicle dealer without a valid surety bond on file with TxDMV. A Class A misdemeanor in Texas carries penalties of:
                  </p>
                  <ul className="space-y-2 mb-3">
                    {[
                      "Fine up to $4,000",
                      "Up to one year in county jail",
                      "Potential license suspension or permanent revocation by TxDMV",
                      "Civil liability to any consumer harmed during the unlicensed period",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-amber-600 mt-0.5 shrink-0">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    A lapsed bond — even for a single day — creates the same exposure as operating without one. This is why renewal timing matters.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What the GDN bond covers</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Under Texas law, a claim can be filed against your GDN bond by a consumer, lender, or the state when a dealer:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Fails to deliver a clear vehicle title after purchase",
                "Misrepresents a vehicle's condition, history, or mileage",
                "Collects payment and fails to deliver the vehicle",
                "Fails to pay off an existing lien before sale",
                "Engages in fraudulent sales or financing practices",
                "Violates Texas dealer licensing statutes or TxDMV rules",
                "Fails to complete required title transfer paperwork",
                "Submits forged or fraudulent documents to TxDMV",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to get your GDN bond</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Obtaining a GDN bond is straightforward. Most Texas dealers are approved same-day and receive their bond certificate as an instant PDF — ready to submit to TxDMV.
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { step: "1", title: "Apply online", body: "Select Texas GDN bond, enter your dealer type and basic business info. Takes under 2 minutes." },
                { step: "2", title: "Instant approval", body: "Most applications are approved same-day. No financial statements required for standard $50,000 bonds." },
                { step: "3", title: "Receive your PDF", body: "Bond certificate emailed instantly. Submit to TxDMV with your GDN license application via eLICENSING." },
              ].map((s) => (
                <div key={s.step} className="text-center p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-base font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{s.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key facts summary</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {[
                { label: "Governing law", value: "Texas Occupations Code §503.033" },
                { label: "Issuing authority", value: "Texas Department of Motor Vehicles (TxDMV)" },
                { label: "Required bond amount", value: "$50,000 — uniform for all 6 dealer types" },
                { label: "Estimated annual cost", value: "$100–$300/year (credit-based)" },
                { label: "Bond term", value: "Annual — must be renewed each license year" },
                { label: "Penalty for non-compliance", value: "Class A misdemeanor — up to $4,000 fine + jail" },
                { label: "Certificate delivery", value: "Instant PDF via email — same-day filing possible" },
              ].map((row, i) => (
                <div key={row.label} className={`flex gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <span className="text-sm font-semibold text-gray-900 w-44 shrink-0">{row.label}</span>
                  <span className="text-sm text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

        </article>

        {/* CTA */}
        <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas GDN Bond Today</h2>
          <p className="text-indigo-200 mb-6">Same-day issuance · All 6 dealer types · From $100/yr · TDI Licensed Agency #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={GDN_LINK} target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: "/blog/texas-gdn-bond-cost-2026", title: "How Much Does a Texas GDN Bond Cost? (2026)", tag: "Cost Guide" },
              { href: "/blog/texas-dealer-license-renewal-gdn-bond", title: "Texas Dealer License Renewal: GDN Bond Checklist", tag: "Renewal Guide" },
              { href: "/bonds/gdn-bond-texas", title: "Texas GDN Bond — Apply Online", tag: "Product Page" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-2 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
