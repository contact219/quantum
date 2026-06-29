import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { CheckCircle, ArrowRight, DollarSign, Clock, ChevronRight, Star, Zap, Users, Home, Phone, FileText, TrendingUp } from "lucide-react";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your $50 Texas Notary Bond Can Make You $1,000+/Month: 7 Proven Income Streams",
  "description": "Most Texas notaries never monetize their credential beyond the occasional favor. Here are 7 concrete ways to turn your notary bond into $500–$8,000/month — from loan signing to RON to wedding officiating.",
  "datePublished": "2026-06-29",
  "dateModified": "2026-06-29",
  "author": { "@type": "Person", "name": "Theodore Sparks", "jobTitle": "Founder, Quantum Surety LLC" },
  "publisher": {
    "@type": "Organization",
    "name": "Quantum Surety LLC",
    "url": "https://quantumsurety.bond",
    "logo": { "@type": "ImageObject", "url": "https://quantumsurety.bond/QS_Logo.png" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://quantumsurety.bond/blog/texas-notary-bond-income-side-hustle-2026" },
  "image": "https://quantumsurety.bond/QS_OG_2.png",
  "keywords": "texas notary income, notary side hustle texas, loan signing agent texas, notary bond income, mobile notary business texas, remote online notarization texas, notary signing agent income",
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much can a Texas notary earn per month?",
      "acceptedAnswer": { "@type": "Answer", "text": "A part-time mobile notary in Texas typically earns $500–$2,000/month. Loan signing agents working full-time earn $3,000–$8,000/month. Remote online notarization (RON) adds flexible income on top of either." }
    },
    {
      "@type": "Question",
      "name": "Do I need additional certification to become a loan signing agent in Texas?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. In addition to your Texas notary commission and bond, most title companies and signing services require NNA (National Notary Association) Loan Signing Agent certification (~$65) and notary E&O insurance ($25–$65/year)." }
    },
    {
      "@type": "Question",
      "name": "Can Texas notaries perform wedding ceremonies?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Texas law authorizes licensed notaries public to perform wedding ceremonies. This is a significant income opportunity — ceremonies typically pay $150–$500 each with almost no overhead." }
    },
    {
      "@type": "Question",
      "name": "What is RON and can Texas notaries do it?",
      "acceptedAnswer": { "@type": "Answer", "text": "RON (Remote Online Notarization) allows Texas notaries to perform notarizations via webcam and digital signatures. Texas has authorized RON since 2018 under HB 1217. Platforms include Notarize.com, DocuSign Notary, and eNotaryLog." }
    },
  ],
};

const incomeStreams = [
  {
    num: "01",
    title: "Loan Signing Agent",
    subtitle: "The highest-paying notary path",
    range: "$75–$200 per signing",
    monthly: "$1,500–$8,000/month full-time",
    color: "from-indigo-600 to-indigo-700",
    accent: "indigo",
    icon: FileText,
    id: "loan-signing",
  },
  {
    num: "02",
    title: "Mobile Notary Business",
    subtitle: "Go to the client, charge a travel fee",
    range: "$25–$75+ per visit",
    monthly: "$500–$2,500/month",
    color: "from-teal-600 to-teal-700",
    accent: "teal",
    icon: Home,
    id: "mobile-notary",
  },
  {
    num: "03",
    title: "Remote Online Notarization (RON)",
    subtitle: "Notarize from home via webcam",
    range: "$10–$25 per notarization",
    monthly: "$300–$1,500/month (scalable)",
    color: "from-violet-600 to-violet-700",
    accent: "violet",
    icon: Zap,
    id: "ron",
  },
  {
    num: "04",
    title: "Wedding Officiant",
    subtitle: "Texas notaries can legally marry couples",
    range: "$150–$500 per ceremony",
    monthly: "$300–$2,000/month (seasonal)",
    color: "from-rose-600 to-rose-700",
    accent: "rose",
    icon: Star,
    id: "weddings",
  },
  {
    num: "05",
    title: "Fingerprinting / LiveScan",
    subtitle: "Add-on service, zero credential overlap",
    range: "$25–$50 per person",
    monthly: "$400–$1,200/month",
    color: "from-orange-600 to-orange-700",
    accent: "orange",
    icon: Users,
    id: "fingerprinting",
  },
  {
    num: "06",
    title: "Apostille Coordination",
    subtitle: "High-margin document concierge",
    range: "$75–$200 per order",
    monthly: "$300–$1,500/month",
    color: "from-blue-600 to-blue-700",
    accent: "blue",
    icon: TrendingUp,
    id: "apostille",
  },
  {
    num: "07",
    title: "Corporate Retainer",
    subtitle: "Recurring revenue from local businesses",
    range: "$75–$200/month per client",
    monthly: "$500–$2,000/month (3–10 clients)",
    color: "from-green-600 to-green-700",
    accent: "green",
    icon: DollarSign,
    id: "retainer",
  },
];

export default function BlogNotaryBondIncome() {
  useSEO({
    title: "Your $50 Texas Notary Bond Can Make You $1,000+/Month: 7 Income Streams | Quantum Surety",
    description: "Most Texas notaries never monetize their credential. Here are 7 proven ways to turn your notary bond into $500–$8,000/month — loan signing, RON, weddings, fingerprinting, and more.",
    canonical: "/blog/texas-notary-bond-income-side-hustle-2026",
    ogType: "article",
  });
  useSchema(SCHEMA, "ld-json-Article");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas Notary</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-semibold bg-teal-500/30 text-teal-200 px-3 py-1 rounded-full">Income Guide</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 8 min read</span>
            <span className="text-indigo-300 text-sm">June 29, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Your $50 Texas Notary Bond Can Make You $1,000+/Month: 7 Proven Income Streams
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Most Texas notaries use their commission for an occasional favor — a neighbor's signature, a document at work. But your notary bond unlocks income opportunities most credential holders never touch. Here's exactly how to change that.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12">

        {/* TOC */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">In this guide</p>
          <ol className="space-y-1.5 text-sm">
            {[
              ["#opportunity", "The untapped opportunity"],
              ["#loan-signing", "01 — Loan Signing Agent ($75–$200/signing)"],
              ["#mobile-notary", "02 — Mobile Notary Business"],
              ["#ron", "03 — Remote Online Notarization (RON)"],
              ["#weddings", "04 — Wedding Officiant"],
              ["#fingerprinting", "05 — Fingerprinting / LiveScan"],
              ["#apostille", "06 — Apostille Coordination"],
              ["#retainer", "07 — Corporate Retainer"],
              ["#marketing", "How to get your first client"],
              ["#get-started", "Action steps this week"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-indigo-600 hover:text-indigo-800 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* Income Overview Cards */}
        <section id="opportunity" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Untapped Opportunity</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            There are over 100,000 active Texas notary commissions. The vast majority of notaries notarize maybe 5–10 documents a year — mostly as a workplace favor — and earn exactly $0 from the credential they paid to obtain and bond.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            That's a mistake. A Texas notary commission paired with the right business model is a surprisingly powerful income tool — one that requires almost no startup capital, has no inventory, and scales with your time.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            Below are seven concrete income streams, ranked from highest earning potential to easiest to start. You don't need to pursue all seven — picking one and executing on it consistently is enough to add meaningful income.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {incomeStreams.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-3 border border-slate-200 rounded-xl p-3.5 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-700">{s.title}</p>
                  <p className="text-xs text-slate-500">{s.range}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 1 — Loan Signing */}
        <section id="loan-signing" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 01</span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">Loan Signing Agent</h2>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
            <div className="grid grid-cols-3 divide-x divide-indigo-200 text-center">
              <div className="px-3">
                <p className="text-lg font-bold text-indigo-700">$75–$200</p>
                <p className="text-xs text-slate-500">per signing</p>
              </div>
              <div className="px-3">
                <p className="text-lg font-bold text-indigo-700">2–3/day</p>
                <p className="text-xs text-slate-500">experienced agents</p>
              </div>
              <div className="px-3">
                <p className="text-lg font-bold text-indigo-700">$3k–$8k</p>
                <p className="text-xs text-slate-500">monthly full-time</p>
              </div>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">
            A <strong>Loan Signing Agent (LSA)</strong> is a notary who specializes in notarizing mortgage loan closing packages — the stack of 100+ documents a borrower signs when closing on a home. Title companies and escrow firms pay notaries $75–$200 per signing appointment, which typically takes 45–90 minutes.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Texas real estate volume is enormous. Harris County alone closes tens of thousands of mortgages each month. Every one of those closings needs a notary. Established LSAs work with title companies directly and receive assignments through platforms like Snapdocs, SigningOrder, NotaryGo, and Notary Rotary.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mb-3">What you need to get started</h3>
          <ul className="space-y-2 mb-5">
            {[
              ["Texas notary commission + $10,000 bond", "Already have this"],
              ["NNA Loan Signing Agent certification", "~$65 one-time, online"],
              ["Notary E&O insurance", "$25–$65/year from NNA or ProAssurance"],
              ["Laser printer + legal-size paper", "$150–$250 one-time"],
              ["Profile on Snapdocs, NotaryGo, Notary Rotary", "Free to join"],
            ].map(([item, note]) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 text-sm"><strong>{item}</strong> — <span className="text-slate-500">{note}</span></span>
              </li>
            ))}
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Texas advantage:</strong> Texas is a title-state, meaning title companies (not attorneys) handle closings. This creates massive, distributed demand for notary signers across every metro and suburb. Dallas, Houston, San Antonio, and Austin each have hundreds of active signings per day.
          </div>
        </section>

        {/* Section 2 — Mobile Notary */}
        <section id="mobile-notary" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 02</span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">Mobile Notary Business</h2>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">
            A mobile notary travels to the client and charges a travel fee on top of the state-capped per-signature fee. The key insight most notaries miss: the <em>location</em> of your client base matters as much as the volume. Certain venues generate repeat, high-need work:
          </p>

          <div className="space-y-3 mb-5">
            {[
              {
                venue: "Hospitals & Nursing Homes",
                why: "Patients urgently need advance directives, POAs, and wills witnessed. Nursing facilities have ongoing weekly needs. One facility relationship = consistent recurring income.",
                tip: "Introduce yourself to the social work department. Many facilities will add you to their preferred vendor list.",
              },
              {
                venue: "Jails & Detention Centers",
                why: "Inmates need documents notarized regularly — POAs, property transfers, legal affidavits. County jails process hundreds of these per month and frequently can't source local notaries.",
                tip: "Contact the facility administrator about becoming a pre-approved vendor. You may need a background check.",
              },
              {
                venue: "Car Dealerships",
                why: "Dealer title transfers, lien releases, and odometer statements all need notarization. High-volume dealerships may need 10–20 notarizations per week.",
                tip: "Pitch the F&I manager, not the floor salesperson. Offer a flat weekly rate to become their exclusive notary.",
              },
              {
                venue: "Law Firms",
                why: "Paralegals regularly need documents notarized on tight deadlines. A relationship with 2–3 firms can generate $200–$600/week passively.",
                tip: "Drop off a one-page sheet listing your services and turnaround time. Price per visit beats per-signature for firm clients.",
              },
              {
                venue: "Real Estate Offices",
                why: "Affidavits, power of attorney for closings, and deed notarizations create consistent need. Especially strong in Texas suburban markets.",
                tip: "Introduce yourself at office meetings. Many agents will use you for their entire book of business once they trust your reliability.",
              },
            ].map((v) => (
              <div key={v.venue} className="border border-slate-200 rounded-xl p-4">
                <p className="font-bold text-slate-900 mb-1">{v.venue}</p>
                <p className="text-sm text-slate-600 mb-2">{v.why}</p>
                <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-1.5"><strong>Pro tip:</strong> {v.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — RON */}
        <section id="ron" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 03</span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">Remote Online Notarization (RON)</h2>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">
            Texas authorized RON in 2018 under HB 1217. Remote online notarization lets you perform legally binding notarizations via a webcam session — no travel, no scheduling constraints, and no geographic limits. You can notarize for a client in El Paso while sitting in your Dallas home office.
          </p>

          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-5">
            <p className="text-sm font-bold text-violet-800 mb-2">RON platforms accepting Texas notaries:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Notarize.com", "Consumer-facing, high volume"],
                ["DocuSign Notary", "Enterprise-grade, integrates with e-sign"],
                ["eNotaryLog", "Court-focused, high per-signing rate"],
                ["PandaDoc Notary", "Business documents, subscription model"],
              ].map(([platform, note]) => (
                <div key={platform} className="text-xs">
                  <p className="font-semibold text-violet-900">{platform}</p>
                  <p className="text-violet-600">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">
            RON typically pays less per notarization than in-person work ($10–$25 vs. $25–$75), but the volume potential is significantly higher. Many Texas notaries use RON as a fill-in revenue source around their in-person schedule.
          </p>

          <p className="text-slate-700 leading-relaxed">
            You'll need: a webcam, a digital certificate from an approved vendor (IdenTrust or DocuSign), and credentials on a RON platform. Initial setup takes 1–2 days. No additional state license is required beyond your existing commission.
          </p>
        </section>

        {/* Sections 4-7 — Quick wins grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Wins: Four More Income Streams</h2>
          <p className="text-slate-600 mb-6">These are lower volume but easy to add on with almost no startup cost.</p>

          <div className="space-y-5">

            {/* Weddings */}
            <div id="weddings" className="border border-rose-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 04</span>
                  <h3 className="text-lg font-bold text-slate-900">Wedding Officiant — $150–$500 per ceremony</h3>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                Texas law (Family Code §2.202) authorizes licensed notaries public to solemnize marriages. This is one of the most overlooked notary income opportunities. A weekend wedding pays $150–$500 for 30–60 minutes of work. Texas weddings peak March–June and September–November, but destination wedding work runs year-round.
              </p>
              <p className="text-sm text-rose-700 bg-rose-50 rounded-lg px-3 py-2">
                <strong>To get started:</strong> List yourself on Thumbtack, WeddingWire, or The Knot. Write a simple ceremony script (many free templates exist). No additional license required — your Texas notary commission is enough.
              </p>
            </div>

            {/* Fingerprinting */}
            <div id="fingerprinting" className="border border-orange-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 05</span>
                  <h3 className="text-lg font-bold text-slate-900">LiveScan Fingerprinting — $25–$50 per person</h3>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                Fingerprinting is a natural add-on for notaries who already work with professionals requiring background checks: teachers, healthcare workers, contractors, foster parents. Get authorized as a Texas DPS-approved LiveScan provider. Volume is steady and predictable — Texas has hundreds of thousands of regulated professionals renewing credentials each year.
              </p>
              <p className="text-sm text-orange-700 bg-orange-50 rounded-lg px-3 py-2">
                <strong>Setup cost:</strong> $200–$500 for a USB fingerprint scanner. DPS authorization is a one-time application. Partners well with a mobile notary route — offer both services on the same visit.
              </p>
            </div>

            {/* Apostille */}
            <div id="apostille" className="border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 06</span>
                  <h3 className="text-lg font-bold text-slate-900">Apostille Coordination — $75–$200 per order</h3>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                An apostille is a form of international document authentication required when presenting a US document abroad — adoptions, international business, foreign education, immigration. The process requires notarization plus a Texas SOS apostille. Most clients have no idea how to do this and will pay $75–$200 for someone to handle it. You notarize the document, then use a courier or handle the SOS submission yourself.
              </p>
              <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                <strong>Demand signal:</strong> Texas has large international communities (Houston, Dallas, San Antonio). Immigration attorneys and international businesses are your best referral sources.
              </p>
            </div>

            {/* Corporate Retainer */}
            <div id="retainer" className="border border-green-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 07</span>
                  <h3 className="text-lg font-bold text-slate-900">Corporate Retainer — $75–$200/month per client</h3>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                Small businesses — insurance agencies, staffing firms, real estate offices, HR departments — have recurring notary needs but no on-staff notary. A monthly retainer for a flat fee covers all their notarizations that month, giving them predictability and giving you recurring revenue. Three clients at $100/month = $300/month of passive income on top of everything else you're doing.
              </p>
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                <strong>Pitch:</strong> "For $100/month I'm your on-call notary — call or text any time, I come to your office within 24 hours or handle it remotely via RON. No per-signature billing, no surprises."
              </p>
            </div>
          </div>
        </section>

        {/* Marketing */}
        <section id="marketing" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Get Your First Client</h2>
          <p className="text-slate-700 leading-relaxed mb-5">
            The biggest barrier for notaries isn't skill — it's visibility. Here's where active Texas notaries find clients:
          </p>

          <div className="space-y-3">
            {[
              {
                channel: "Google Business Profile",
                action: "Create a free profile under 'Notary Public' or 'Notary Signing Agent'. Texas-specific searches like 'mobile notary near me' generate high-intent traffic. Add your services, photos, and hours. This single step generates the most organic clients long-term.",
              },
              {
                channel: "Notary directory listings",
                action: "Claim your profiles on Notary Rotary (notaryrotary.com), 123Notary.com, and NotaryCafe.com. These are the first places title companies search when they need a signer. A complete profile with reviews is essential for loan signing work.",
              },
              {
                channel: "LinkedIn outreach",
                action: "Connect with title company closers, real estate agents, and paralegals in your city. A short intro message mentioning same-day availability and your NNA certification converts well. Title companies rotate through signers constantly.",
              },
              {
                channel: "Nextdoor & neighborhood apps",
                action: "Post a simple 'Local notary available' message in your neighborhood groups. Consumer notary work (wills, POAs, personal documents) comes almost exclusively from neighborhood referrals.",
              },
              {
                channel: "Cold outreach to nursing facilities",
                action: "Call or walk in to the nearest 3–5 assisted living facilities and ask for the social work director. Introduce yourself and leave a business card. This is the fastest path to recurring mobile notary income.",
              },
            ].map((item) => (
              <div key={item.channel} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.channel}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action steps */}
        <section id="get-started" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Action Steps This Week</h2>
          <p className="text-slate-700 leading-relaxed mb-5">
            You don't need to build all seven income streams at once. Pick the one that fits your schedule and start. Here's a one-week action plan:
          </p>
          <div className="space-y-3">
            {[
              ["Day 1", "Create your Google Business Profile. Add photos, list 'Mobile Notary' and 'Loan Signing Agent' as services."],
              ["Day 2", "Register on Notary Rotary, 123Notary, and Snapdocs. Complete your profile fully — photo, certifications, service area."],
              ["Day 3", "Purchase NNA Loan Signing Agent certification online ($65). Complete the training — it's a half-day online course."],
              ["Day 4", "Email or walk into 3 nearby assisted living facilities. Drop off a business card with your name, phone, and 'notary on call' message."],
              ["Day 5", "Post on Nextdoor. Message 5 LinkedIn connections who work in real estate, title, or law. Ask for a 5-minute intro call."],
              ["Weekend", "If interested in RON: create an account on Notarize.com and complete the onboarding. It takes about an hour."],
            ].map(([day, step]) => (
              <div key={day} className="flex gap-3">
                <div className="w-16 flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{day}</span>
                </div>
                <p className="text-sm text-slate-700 pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How much can a Texas notary realistically earn in the first month?",
                a: "Most notaries doing their first month of active mobile notary or loan signing work earn $200–$600 — mostly from building connections and completing their first few jobs. By month 3, consistent agents earn $800–$2,000/month part-time. Full-time loan signing agents typically cross $3,000/month within 6 months.",
              },
              {
                q: "Do I need additional insurance beyond my notary bond?",
                a: "Your $10,000 notary bond protects the public (your obligees), not you personally. Notary E&O (Errors & Omissions) insurance protects you if you make a mistake that causes financial harm to a client. It costs $25–$65/year and is required by most title companies for loan signing agents.",
              },
              {
                q: "Can I do loan signing work in Texas without NNA certification?",
                a: "Technically yes — there's no state law requiring NNA certification. But as a practical matter, most signing services and title companies require it before adding you to their roster. It's a half-day course and worth the $65.",
              },
              {
                q: "Is there a bilingual (Spanish) advantage in Texas?",
                a: "Significant advantage. Texas has large Spanish-speaking communities statewide — Houston, San Antonio, the Rio Grande Valley, El Paso. Spanish-speaking notaries command a premium and face almost no competition in many markets. If you're bilingual, lead with it in every marketing channel.",
              },
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                  <p className="font-semibold text-slate-900 text-sm">{faq.q}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-slate-700 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-indigo-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Your Bond is Already Active — Now Make It Work</h3>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            You've already done the hard part: you have your Texas notary commission and your bond. The income streams above require mostly time and a bit of networking — not a new license or major investment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/bonds/notary-bond-texas">
              <span className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer">
                Renew or Get Your Bond — $50 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <a href="tel:+12146668718" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              <Phone className="w-4 h-4" /> (214) 666-8718
            </a>
          </div>
          <p className="text-indigo-200 text-xs mt-4">RLI Insurance (A-rated) · TDI License #3480229 · Instant PDF delivery</p>
        </div>

        {/* Author box */}
        <div className="mt-10 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-indigo-700">TS</div>
          <div>
            <p className="font-bold text-slate-900">Theodore Sparks</p>
            <p className="text-sm text-slate-500">Founder, Quantum Surety LLC · TDI License #3480229</p>
            <p className="text-sm text-slate-600 mt-1">Texas-licensed surety bond agency specializing in notary, contractor, and GDN dealer bonds. We've helped thousands of Texas notaries get bonded since 2023.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
