import { Link } from "wouter";
import { BlogAuthor } from "@/components/BlogAuthor";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight, Clock, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";

export default function BlogHowToGetTexasGDNLicense() {
  useSEO({
    title: "How to Get a Texas GDN Dealer License in 2026 (Step-by-Step) | Quantum Surety",
    description: "Complete step-by-step guide to getting a Texas GDN motor vehicle dealer license in 2026. Required documents, bond, TxDMV eLICENSING process, costs, and timeline.",
    canonical: "/blog/how-to-get-texas-gdn-license",
    ogType: "article",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get a Texas GDN Dealer License",
    "description": "Step-by-step process for obtaining a Texas General Distinguishing Number (GDN) motor vehicle dealer license from TxDMV.",
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Determine your dealer license type", "text": "Texas has 6 GDN dealer license types: independent motor vehicle dealer, franchise dealer, motorcycle dealer, wholesale dealer, auction dealer, and mobility motor vehicle dealer." },
      { "@type": "HowToStep", "position": 2, "name": "Secure a qualified dealer location", "text": "TxDMV requires a permanent, enclosed business location with adequate display space and a dedicated office. Location must meet county zoning requirements." },
      { "@type": "HowToStep", "position": 3, "name": "Obtain your $50,000 GDN surety bond", "text": "Purchase the mandatory $50,000 GDN surety bond required under Texas Transportation Code §503.033. Quantum Surety issues same-day from $100/yr." },
      { "@type": "HowToStep", "position": 4, "name": "Complete the dealer education course", "text": "First-time applicants must complete a TxDMV-approved pre-licensing education course (typically 6 hours)." },
      { "@type": "HowToStep", "position": 5, "name": "Gather required documents", "text": "Collect your bond certificate, insurance certificate, assumed name certificate (if applicable), proof of location, and application fee." },
      { "@type": "HowToStep", "position": 6, "name": "Submit via TxDMV eLICENSING", "text": "Apply online at dmv.texas.gov through eLICENSING. Upload all documents and pay the application fee." },
    ],
    "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  }, "ld-json-HowTo");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How much does a Texas GDN dealer license cost?", "acceptedAnswer": { "@type": "Answer", "text": "TxDMV application fees vary by license type: Independent Motor Vehicle Dealer (~$700), Wholesale Dealer (~$350), Motorcycle Dealer (~$350). Plus your $50,000 GDN bond (from $100/yr at Quantum Surety), and education course (~$100–$200)." } },
      { "@type": "Question", "name": "How long does it take to get a Texas GDN license?", "acceptedAnswer": { "@type": "Answer", "text": "TxDMV typically processes complete GDN applications in 4–8 weeks. Incomplete applications or location inspections that fail can extend the timeline. Having all documents ready before submitting is critical." } },
    ],
  }, "ld-json-FAQ");

  const licenseTypes = [
    { type: "Independent Motor Vehicle Dealer", code: "IMVD", sells: "Used vehicles to the public", fee: "~$700" },
    { type: "Franchise (New Vehicle) Dealer", code: "FMVD", sells: "New vehicles from a manufacturer", fee: "~$700" },
    { type: "Wholesale Motor Vehicle Dealer", code: "WMVD", sells: "Vehicles only to other dealers (not public)", fee: "~$350" },
    { type: "Motorcycle Dealer", code: "MCD", sells: "Motorcycles to the public", fee: "~$350" },
    { type: "Auction Dealer", code: "ACD", sells: "Vehicles via auction", fee: "~$700" },
    { type: "Mobility Motor Vehicle Dealer", code: "MMVD", sells: "Vehicles modified for persons with disabilities", fee: "~$350" },
  ];

  const requirements = [
    { item: "$50,000 GDN surety bond", detail: "Required under §503.033. From $100/yr at Quantum Surety — instant PDF same day." },
    { item: "Dealer location", detail: "Permanent enclosed building with display space. Must pass TxDMV inspection." },
    { item: "General liability insurance", detail: "Minimum $100,000/$300,000 coverage naming TxDMV as certificate holder." },
    { item: "Pre-licensing education", detail: "6-hour TxDMV-approved dealer education course for first-time applicants." },
    { item: "Assumed name certificate", detail: "Required if operating under a trade name (DBA) different from your legal name." },
    { item: "Background check consent", detail: "All owners, partners, and officers must consent to a criminal background check." },
    { item: "Application fee", detail: "Paid online via TxDMV eLICENSING. Varies by license type ($350–$700)." },
  ];

  const faqs = [
    { q: "What does GDN stand for in Texas?", a: "GDN stands for General Distinguishing Number — the unique identifier assigned by TxDMV to each licensed motor vehicle dealer in Texas. Every licensed dealer must display their GDN on their dealer plate and signage. A GDN is the same as a Texas dealer license." },
    { q: "How much does a Texas GDN dealer license cost?", a: "Expect to spend $1,000–$1,500 total for your initial GDN license: TxDMV application fee ($350–$700 depending on type), GDN surety bond premium ($100–$300/yr from Quantum Surety), pre-licensing education (~$100–$200), and dealer plates ($50–$100 each). Plus the cost of qualifying your dealer location." },
    { q: "How long does it take to get a Texas GDN license?", a: "TxDMV typically processes complete GDN applications in 4–8 weeks. The most common delays are: incomplete documentation, failed location inspection, or background check issues. Having your bond certificate, insurance certificate, and education completion ready before you submit dramatically speeds up the process." },
    { q: "Do I need a physical lot to get a GDN license in Texas?", a: "Yes. TxDMV requires all GDN licensees to have a permanent, enclosed business location — not just a home address or parking lot. The location must have adequate display space for at least 5 vehicles and a dedicated business office. TxDMV will inspect your location before granting your license." },
    { q: "Can I sell cars from home with a Texas GDN license?", a: "No. Texas requires a qualifying dealer location that is separate from a personal residence and meets commercial zoning requirements. You cannot operate a licensed dealership from your home." },
    { q: "What happens if I operate without a GDN bond?", a: "Operating as a motor vehicle dealer without a valid GDN bond is a Class A misdemeanor under Texas law — punishable by fines up to $4,000 and up to one year in jail. TxDMV can also revoke your license immediately upon discovering a lapsed bond." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Texas Auto Dealers</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Texas Auto Dealers</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 10 min read</span>
            <span className="text-indigo-300 text-sm">May 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            How to Get a Texas GDN Dealer License in 2026 (Step-by-Step)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            The complete process for getting your Texas motor vehicle dealer license — from choosing your dealer type and qualifying your location to getting your $50,000 GDN bond and submitting through TxDMV eLICENSING.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Operating without a GDN is a Class A misdemeanor</p>
              <p className="text-gray-700 text-sm">Texas Transportation Code §503.033 makes it a Class A misdemeanor to act as a motor vehicle dealer without a valid GDN license and bond — fines up to $4,000 and up to one year in jail.</p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Choose Your GDN License Type</h2>
          <p className="text-gray-700 leading-relaxed mb-5">Texas has 6 GDN dealer license categories. Choose the one that matches how you'll be buying and selling vehicles:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-indigo-50"><th className="text-left p-3 border border-gray-200 font-semibold">License Type</th><th className="text-left p-3 border border-gray-200 font-semibold">What You Can Sell</th><th className="text-left p-3 border border-gray-200 font-semibold">App Fee</th></tr></thead>
              <tbody>
                {licenseTypes.map((l, i) => (
                  <tr key={l.type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 font-medium text-gray-900">{l.type}</td>
                    <td className="p-3 border border-gray-200 text-gray-600">{l.sells}</td>
                    <td className="p-3 border border-gray-200 text-indigo-700 font-semibold">{l.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">All 6 license types require the same $50,000 GDN surety bond.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Need Before You Apply</h2>
          <div className="space-y-3">
            {requirements.map((r) => (
              <div key={r.item} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.item}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your GDN Bond Same-Day</h2>
          <p className="text-indigo-200 mb-5">$50,000 bond from $100/yr. Instant PDF certificate accepted by TxDMV eLICENSING. Apply in 5 minutes.</p>
          <a href="/get-bond?type=dealer">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Get My GDN Bond <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submitting Your Application via TxDMV eLICENSING</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Create a TxDMV eLICENSING account", body: "Go to dmv.texas.gov and create an eLICENSING account. You'll manage your entire dealer license — applications, renewals, and plate orders — through this portal." },
              { step: "2", title: "Start your GDN application", body: "In eLICENSING, select 'Apply for a New Dealer License' and choose your license type. The system will tell you exactly which documents to upload." },
              { step: "3", title: "Upload all required documents", body: "Upload your bond certificate PDF, certificate of insurance, proof of location (lease or deed), education completion certificate, and assumed name certificate (if applicable)." },
              { step: "4", title: "Pay the application fee", body: "Pay online via the eLICENSING portal by credit/debit card. Fees range from $350 to $700 depending on your license type." },
              { step: "5", title: "Schedule your location inspection", body: "TxDMV will contact you to schedule an inspection of your dealer location. Ensure your signage is up, the office is set up, and display space is available for at least 5 vehicles." },
              { step: "6", title: "Receive your GDN and dealer plates", body: "Once approved, your GDN certificate is issued. Order your dealer plates through eLICENSING. Your license is active — you may begin buying and selling." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{s.step}</div>
                <div className="pt-0.5">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{s.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200"><p className="font-semibold text-gray-900 text-sm">{f.q}</p></div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{f.a}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/bonds/gdn-bond-texas", label: "Texas GDN Dealer Bond Overview" },
              { href: "/blog/texas-gdn-bond-requirements-2026", label: "GDN Bond Requirements 2026" },
              { href: "/blog/texas-gdn-bond-cost-2026", label: "How Much Does a GDN Bond Cost?" },
              { href: "/blog/texas-dealer-license-renewal-gdn-bond", label: "Dealer License Renewal Checklist" },
            ].map((r) => (
              <Link key={r.href} href={r.href}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{r.label}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    <BlogAuthor />
    </div>
  );
}
