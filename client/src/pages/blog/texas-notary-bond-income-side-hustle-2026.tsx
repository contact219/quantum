import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { CheckCircle, ArrowRight, DollarSign, Clock, ChevronRight, Star, Zap, Users, Home, Phone, FileText, TrendingUp, Monitor, Globe, ClipboardCheck, Fingerprint, Scale, AlertTriangle, ShieldCheck } from "lucide-react";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your $50 Texas Notary Bond Can Earn $500–$8,500/Month: 8 Proven Income Streams (2026)",
  "description": "A data-backed guide to the proven, legal ways Texas notaries earn recurring monthly income in 2026 — loan signing, remote online notarization, mobile work, apostilles, I-9 verification, and more. With real rates and achievable monthly targets.",
  "datePublished": "2026-06-29",
  "dateModified": "2026-07-23",
  "author": { "@type": "Person", "name": "Nice Shotwell-Sparks", "jobTitle": "Founder, Quantum Surety LLC" },
  "publisher": {
    "@type": "Organization",
    "name": "Quantum Surety LLC",
    "url": "https://quantumsurety.bond",
    "logo": { "@type": "ImageObject", "url": "https://quantumsurety.bond/QS_Logo.png" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://quantumsurety.bond/blog/texas-notary-bond-income-side-hustle-2026" },
  "image": "https://quantumsurety.bond/QS_OG_2.png",
  "keywords": "texas notary income, notary side hustle texas, loan signing agent texas, notary bond income, mobile notary business texas, remote online notarization texas, notary signing agent income, texas notary fees 2026",
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much can a Texas notary earn per month?",
      "acceptedAnswer": { "@type": "Answer", "text": "It scales with commitment. A weekend-casual notary earns roughly $400–$700/month; a part-time notary doing about 5 loan signings a week plus online work earns $1,200–$2,500/month; a full-time signing agent with direct title-company relationships can earn $7,000–$11,000/month, which is $100,000+ a year. The median Texas notary signing agent earns about $56,900/year." }
    },
    {
      "@type": "Question",
      "name": "How much can a Texas notary charge per signature in 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "Under Texas Government Code §406.024, the maximum notarial fee is $10 for the first signature and $1 for each additional signature. For online (remote) notarizations, a Texas notary may charge up to $25 more per notarization. Travel, signing-service, and convenience fees are separate and uncapped, as long as they are clearly disclosed." }
    },
    {
      "@type": "Question",
      "name": "Can a Texas notary perform wedding ceremonies?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Unlike a few states such as Florida and South Carolina, Texas does not authorize notaries to officiate weddings. Under Texas Family Code §2.202, only licensed or ordained ministers, priests, rabbis, authorized religious officers, and current or retired judges may conduct a marriage ceremony. A Texas notary commission alone does not grant that authority." }
    },
    {
      "@type": "Question",
      "name": "Do I need additional certification to become a loan signing agent in Texas?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. In addition to your Texas notary commission and $10,000 bond, most title companies and signing services require a Loan Signing Agent certification and background check (for example through the NNA, ~$65) plus notary E&O insurance ($25–$65/year)." }
    },
    {
      "@type": "Question",
      "name": "What is RON and can Texas notaries do it?",
      "acceptedAnswer": { "@type": "Answer", "text": "RON (Remote Online Notarization) lets a Texas notary perform legally binding notarizations over secure video. Texas has authorized it since 2018. You register separately as an online notary, then work through platforms such as BlueNotary or Notarize. Adding RON typically raises a notary's income 40–100% within six months." }
    },
  ],
};

// --- income streams, ranked by monthly earning potential ---
const incomeStreams = [
  { num: "01", title: "Loan Signing Agent", subtitle: "The flagship — real-estate closings", range: "$75–$250 / signing", color: "from-indigo-600 to-indigo-700", accent: "indigo", icon: FileText, id: "loan-signing", flag: true },
  { num: "02", title: "Remote Online Notarization (RON)", subtitle: "Notarize from home — the under-used lever", range: "+$25 / online act", color: "from-violet-600 to-violet-700", accent: "violet", icon: Monitor, id: "ron" },
  { num: "03", title: "Mobile & General Notary", subtitle: "Come-to-you, charge a travel fee", range: "$10 + travel", color: "from-teal-600 to-teal-700", accent: "teal", icon: Home, id: "mobile-notary" },
  { num: "04", title: "Apostille & Authentication", subtitle: "High-margin document concierge", range: "$50–$150 / order", color: "from-blue-600 to-blue-700", accent: "blue", icon: Globe, id: "apostille" },
  { num: "05", title: "I-9 Employment Verification", subtitle: "Recurring B2B work from HR & staffing", range: "$25–$75 / hire", color: "from-emerald-600 to-emerald-700", accent: "emerald", icon: ClipboardCheck, id: "i9" },
  { num: "06", title: "Field Inspections & Courier", subtitle: "Pairs with your signing route", range: "$25–$60 / visit", color: "from-cyan-600 to-cyan-700", accent: "cyan", icon: TrendingUp, id: "inspections" },
  { num: "07", title: "Fingerprinting / LiveScan", subtitle: "Low-effort add-on service", range: "$15–$50 / session", color: "from-orange-600 to-orange-700", accent: "orange", icon: Fingerprint, id: "fingerprinting" },
  { num: "08", title: "Retainers & Signing-Service Owner", subtitle: "Scale beyond your own hours", range: "Recurring", color: "from-green-600 to-green-700", accent: "green", icon: DollarSign, id: "retainer" },
];

// --- chart data ---
const SCENARIOS = [
  { lab: "Weekend casual", sub: "~2 signings/wk", mid: 550, range: "$400–$700", w: 5, shade: "bg-emerald-300" },
  { lab: "Part-time builder", sub: "5 signings/wk + RON", mid: 1800, range: "$1,200–$2,500", w: 16, shade: "bg-emerald-400" },
  { lab: "Serious side business", sub: "10 signings/wk", mid: 4200, range: "$3,500–$6,000", w: 38, shade: "bg-emerald-500" },
  { lab: "Full-time professional", sub: "18 signings/wk, direct title", mid: 8500, range: "$7,000–$11,000", w: 77, shade: "bg-emerald-600" },
];
const RATES = [
  { lab: "General notarization", sub: "per signature", val: "$10", w: 4 },
  { lab: "Online (RON)", sub: "per notarization", val: "$25–$30", w: 12 },
  { lab: "I-9 verification", sub: "per hire", val: "$25–$50", w: 16 },
  { lab: "Field inspection", sub: "per visit", val: "$25–$60", w: 18 },
  { lab: "Mobile notary", sub: "per trip", val: "$35–$75", w: 24 },
  { lab: "Loan signing (service)", sub: "via signing service", val: "$75–$125", w: 40 },
  { lab: "Loan signing (direct)", sub: "direct with title co.", val: "$150–$250", w: 80, star: true },
];
const PLAN = [
  { lab: "Loan signings", detail: "16/mo × ~$100", v: 1600, w: 78, shade: "bg-emerald-600", text: "text-white" },
  { lab: "Online (RON)", detail: "12/mo × ~$25", v: 300, w: 15, shade: "bg-emerald-400", text: "text-white" },
  { lab: "Everyday notary", detail: "mobile + general", v: 150, w: 7, shade: "bg-emerald-200", text: "text-emerald-900" },
];

export default function BlogNotaryBondIncome() {
  useSEO({
    title: "Your $50 Texas Notary Bond Can Earn $500–$8,500/Month: 8 Income Streams (2026) | Quantum Surety",
    description: "A data-backed guide to the proven, legal ways Texas notaries earn monthly income in 2026 — loan signing, RON, mobile, apostilles, I-9 verification — with real rates, revenue charts, and achievable targets.",
    canonical: "/blog/texas-notary-bond-income-side-hustle-2026",
    ogType: "article",
  });
  useSchema(SCHEMA, "ld-json-Article");
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span>Texas Notary</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-semibold bg-teal-500/30 text-teal-100 px-3 py-1 rounded-full">Income Report</span>
            <span className="text-emerald-200 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 9 min read</span>
            <span className="text-emerald-200 text-sm">Updated July 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Your Notary Stamp Is a $50 Business License. Here's the Monthly Income It Can Actually Earn.
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Most Texas notaries earn <strong>$0 extra</strong> from their credential — they got commissioned for one job and never used it again. Below are the proven, legal ways to turn that stamp into recurring monthly income in 2026, with real rates and achievable targets.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12">

        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            ["$10", "New max fee per signature — up from $6 (§406.024)"],
            ["+$25", "Extra you can charge per online notarization"],
            ["$56.9K", "Median Texas signing-agent income"],
            ["40–100%", "Income lift after adding online notarization"],
          ].map(([v, l]) => (
            <div key={l} className="border border-slate-200 rounded-xl p-4 relative overflow-hidden">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{v}</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{l}</p>
            </div>
          ))}
        </div>

        {/* TOC */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">In this report</p>
          <ol className="space-y-1.5 text-sm">
            {[
              ["#law", "Know the law (fees just went up)"],
              ["#opportunity", "The eight income streams, ranked"],
              ["#loan-signing", "01 — Loan Signing Agent ($75–$250)"],
              ["#ron", "02 — Remote Online Notarization"],
              ["#mobile-notary", "03 — Mobile & General Notary"],
              ["#more", "04–08 — Apostilles, I-9, inspections & more"],
              ["#earnings", "What you can realistically earn each month"],
              ["#plan", "A realistic path to $2,000/month"],
              ["#get-started", "Your first 90 days"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-emerald-700 hover:text-emerald-900 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* Know the law */}
        <section id="law" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Know the Law — It's Where the Trust (and the Money) Is</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
              <p className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2"><ShieldCheck className="w-4 h-4" /> True &amp; recently improved</p>
              <p className="text-sm text-slate-700">Texas raised the maximum notarial fee to <strong>$10 per signature</strong> ($1 each additional), and allows up to <strong>$25 extra per online notarization</strong> (Gov. Code §406.024). Your <strong>travel, signing-service, and convenience fees are separate</strong> and uncapped — as long as you disclose them. That's where signing agents make real money.</p>
            </div>
            <div className="border border-rose-200 bg-rose-50 rounded-xl p-4">
              <p className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wide mb-2"><AlertTriangle className="w-4 h-4" /> Common myth — don't build on it</p>
              <p className="text-sm text-slate-700">“Texas notaries can perform weddings.” <strong>False in Texas.</strong> Under Family Code §2.202 only ordained/licensed ministers, rabbis, authorized religious officers, and judges may officiate. A notary commission <strong>does not</strong> authorize you to marry couples — some notaries get separately ordained, but that's a different credential.</p>
            </div>
          </div>
        </section>

        {/* Overview cards */}
        <section id="opportunity" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Eight Income Streams, Ranked by Earning Power</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            There are over 100,000 active Texas notary commissions, and most notarize a handful of documents a year as a workplace favor — earning nothing from a credential they paid to obtain and bond. Paired with the right model, that same commission is a low-overhead income tool that scales with your time.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            These are ranked from highest monthly earning potential to easiest add-on. You don't need all eight — the top two, <strong>loan signing</strong> and <strong>online notarization</strong>, are where nearly all of the money is.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incomeStreams.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={`flex items-center gap-3 border rounded-xl p-3.5 transition-all group ${s.flag ? "border-amber-300 bg-amber-50/60 hover:border-amber-400" : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"}`}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-emerald-800">{s.num} — {s.title}</p>
                  <p className="text-xs text-slate-500">{s.range}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 01 Loan signing */}
        <section id="loan-signing" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 01 · The flagship</span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">Loan Signing Agent</h2>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
            <div className="grid grid-cols-3 divide-x divide-indigo-200 text-center">
              <div className="px-3"><p className="text-lg font-bold text-indigo-700">$75–$250</p><p className="text-xs text-slate-500">per signing</p></div>
              <div className="px-3"><p className="text-lg font-bold text-indigo-700">15–20/wk</p><p className="text-xs text-slate-500">full-time volume</p></div>
              <div className="px-3"><p className="text-lg font-bold text-indigo-700">$100K+</p><p className="text-xs text-slate-500">yearly, full-time</p></div>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            A <strong>Loan Signing Agent (LSA)</strong> notarizes mortgage closing packages — the stack of 100+ documents a borrower signs at a refinance, purchase, or HELOC. Signing services pay <strong>$75–$125</strong> per appointment; notaries with <strong>direct title-company relationships earn $150–$250</strong>. Full-time agents doing 15–20 a week clear six figures, and Texas — a title-state with enormous real-estate volume — has more of these closings than almost anywhere.
          </p>
          <h3 className="text-lg font-bold text-slate-900 mb-3">What you need to get started</h3>
          <ul className="space-y-2 mb-5">
            {[
              ["Texas notary commission + $10,000 bond", "You start here"],
              ["Loan Signing Agent certification + background check", "~$65 one-time (e.g. NNA)"],
              ["Notary E&O insurance", "$25–$65/year"],
              ["Laser printer + legal-size paper", "$150–$250 one-time"],
              ["Profiles on Snapdocs, NotaryDash, Notary Rotary", "Free to join"],
            ].map(([item, note]) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 text-sm"><strong>{item}</strong> — <span className="text-slate-500">{note}</span></span>
              </li>
            ))}
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Texas advantage:</strong> Because Texas is a title-state, title companies (not attorneys) handle closings — creating distributed demand for signers in every metro and suburb. Dallas, Houston, San Antonio, and Austin each generate hundreds of signings a day.
          </div>
        </section>

        {/* 02 RON */}
        <section id="ron" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center"><Monitor className="w-5 h-5 text-white" /></div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 02 · Most under-used lever</span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">Remote Online Notarization (RON)</h2>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            Texas authorized RON in 2018. It lets you perform legally binding notarizations over secure video — no travel, no geography. Texas lets you charge <strong>up to $25 extra per online notarization</strong> on top of the $10 base, and platforms feed you volume from across the country. Notaries who add RON typically see income rise <strong>40–100% within six months</strong>, which makes it the single most under-used lever in the business.
          </p>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-2">
            <p className="text-sm font-bold text-violet-800 mb-2">RON platforms accepting Texas notaries:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["BlueNotary", "Bill clients directly, set your price"],
                ["Notarize", "On-demand queue + real-estate closings"],
                ["DocuSign Notary", "Enterprise, e-signature integrated"],
                ["eNotaryLog", "Court & title focused"],
              ].map(([p, note]) => (
                <div key={p} className="text-xs"><p className="font-semibold text-violet-900">{p}</p><p className="text-violet-600">{note}</p></div>
              ))}
            </div>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed mt-4">
            You'll need a webcam, a digital certificate from an approved vendor, and to register separately as an online notary. Setup takes 1–2 days; no new state license beyond your commission.
          </p>
        </section>

        {/* 03 Mobile */}
        <section id="mobile-notary" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center"><Home className="w-5 h-5 text-white" /></div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream 03</span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">Mobile &amp; General Notary</h2>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            You travel to the client and charge a travel fee on top of the $10 per-signature fee. The signature fee is capped — <strong>your travel fee is not</strong>, and after-hours or emergency visits command a premium. The trick is <em>where</em> your clients are: certain venues generate repeat, high-need work.
          </p>
          <div className="space-y-3">
            {[
              ["Hospitals & nursing homes", "Advance directives, POAs, and wills witnessed on urgent timelines. One facility relationship becomes weekly recurring income — introduce yourself to the social-work department."],
              ["Jails & detention centers", "Inmates regularly need POAs, property transfers, and affidavits notarized, and facilities often can't source local notaries. Ask the administrator about becoming a pre-approved vendor."],
              ["Car dealerships", "Title transfers, lien releases, and odometer statements. A busy dealer may need 10–20 notarizations a week — pitch the F&I manager a flat weekly rate."],
              ["Law firms & title offices", "Paralegals need documents notarized on deadline. Two or three firm relationships can generate $200–$600/week; price per visit, not per signature."],
            ].map(([venue, why]) => (
              <div key={venue} className="border border-slate-200 rounded-xl p-4">
                <p className="font-bold text-slate-900 mb-1">{venue}</p>
                <p className="text-sm text-slate-600">{why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 04-08 more */}
        <section id="more" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Five More Streams — Including Two Most Guides Miss</h2>
          <p className="text-slate-600 mb-6">Lower volume individually, but they stack — and I-9 verification and field inspections are genuinely under-served in Texas.</p>
          <div className="space-y-5">
            {[
              { id: "apostille", n: "04", icon: Globe, grad: "from-blue-500 to-blue-600", title: "Apostille & Authentication — $50–$150 per order", body: "An apostille authenticates a US document for use abroad — adoptions, overseas work, dual citizenship, immigration. It requires notarization plus a Texas SOS (and sometimes US State Dept) step most clients have no idea how to navigate. You handle it end-to-end for a service/courier fee. Texas's large international communities and immigration attorneys are your referral engine.", tint: "text-blue-700 bg-blue-50" },
              { id: "i9", n: "05", icon: ClipboardCheck, grad: "from-emerald-500 to-emerald-600", title: "I-9 Employment Verification — $25–$75 per hire", tag: "Most guides miss this", body: "Remote hires need someone local to physically inspect their ID for the federal Form I-9. You serve as the employer's authorized representative — fast, repeatable, and once you're on an HR or staffing firm's list, the volume is steady B2B work with no notarization cap involved.", tint: "text-emerald-700 bg-emerald-50" },
              { id: "inspections", n: "06", icon: TrendingUp, grad: "from-cyan-500 to-cyan-600", title: "Field Inspections & Courier — $25–$60 per assignment", tag: "Most guides miss this", body: "Lenders and inspection companies pay notaries to verify occupancy, photograph properties, and pick up or deliver documents. It pairs naturally with a signing route — extra money from stops you're half-making already.", tint: "text-cyan-700 bg-cyan-50" },
              { id: "fingerprinting", n: "07", icon: Fingerprint, grad: "from-orange-500 to-orange-600", title: "Fingerprinting / LiveScan — $15–$50 per session", body: "A natural add-on for notaries who already serve professionals needing background checks: teachers, healthcare workers, contractors, foster parents. Get authorized as a DPS LiveScan provider (a USB scanner runs $200–$500) and offer it alongside your mobile route.", tint: "text-orange-700 bg-orange-50" },
              { id: "retainer", n: "08", icon: DollarSign, grad: "from-green-500 to-green-600", title: "Retainers & Signing-Service Owner — recurring revenue", body: "Graduate from doing every job yourself. Land recurring monthly retainers with insurance agencies, dealerships, staffing firms, and law offices — or subcontract overflow signings to other notaries and keep a margin. Three clients at $100/month is $300 of passive income; a signing service scales far past your own hours.", tint: "text-green-700 bg-green-50" },
            ].map((s) => (
              <div key={s.id} id={s.id} className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.grad} flex items-center justify-center flex-shrink-0`}><s.icon className="w-4 h-4 text-white" /></div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Income Stream {s.n}</span>
                      {s.tag && <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded">{s.tag}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Earnings charts */}
        <section id="earnings" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">What You Can Realistically Earn Each Month</h2>
          <p className="text-slate-600 mb-6">Income scales with how much you commit, not luck. These reflect 2026 Texas signing volume and the fee schedule above.</p>

          {/* Chart 1: by commitment */}
          <div className="border border-slate-200 rounded-xl p-5 mb-6">
            <p className="text-sm text-slate-500 mb-4"><strong className="text-slate-700">Monthly take-home by commitment level</strong> — loan signings + online + mobile combined</p>
            <div className="space-y-3.5">
              {SCENARIOS.map((d) => (
                <div key={d.lab} className="grid grid-cols-[minmax(120px,150px)_1fr] gap-3 items-center">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">{d.lab}<span className="block font-normal text-xs text-slate-400 font-mono">{d.sub}</span></div>
                  <div className="relative h-7 bg-slate-100 rounded-md">
                    <div className={`h-full ${d.shade} rounded-md flex items-center`} style={{ width: `${d.w}%` }} />
                    <span className="absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-800 font-mono tabular-nums whitespace-nowrap" style={{ left: `calc(${d.w}% + 8px)` }}>${d.mid.toLocaleString()}<span className="text-slate-400 font-medium">/mo · {d.range}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: per-appointment */}
          <div className="border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500 mb-4"><strong className="text-slate-700">What each job pays, per appointment</strong> — the mix you choose sets your rate. <span className="text-amber-600">★</span> = top earner</p>
            <div className="space-y-3">
              {RATES.map((d) => (
                <div key={d.lab + d.sub} className="grid grid-cols-[minmax(130px,160px)_1fr] gap-3 items-center">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">{d.star && <span className="text-amber-500">★ </span>}{d.lab}<span className="block font-normal text-xs text-slate-400 font-mono">{d.sub}</span></div>
                  <div className="relative h-6 bg-slate-100 rounded-md">
                    <div className={`h-full rounded-md ${d.star ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${d.w}%` }} />
                    <span className="absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-800 font-mono tabular-nums whitespace-nowrap" style={{ left: `calc(${d.w}% + 8px)` }}>{d.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">Per-signature notarial fees are capped at $10 by Texas law; the higher figures reflect signing-service, travel, and service fees, which are separate and disclosed.</p>
          </div>
        </section>

        {/* Plan */}
        <section id="plan" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">A Realistic Path to $2,000/Month — Part-Time</h2>
          <p className="text-slate-600 mb-6">You don't need to quit your job. This is four loan signings a week plus a little online and mobile work — the kind of schedule a renewing notary runs on evenings and weekends.</p>
          <div className="border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500 mb-4"><strong className="text-slate-700">How $2,000 a month is built</strong> — three streams stacked to the goal</p>
            <div className="flex h-11 rounded-lg overflow-hidden border border-slate-200">
              {PLAN.map((p) => (
                <div key={p.lab} className={`${p.shade} ${p.text} flex items-center justify-center text-xs font-bold font-mono border-r-2 border-white last:border-r-0`} style={{ width: `${p.w}%` }}>{p.w > 12 ? `$${p.v.toLocaleString()}` : ""}</div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
              {PLAN.map((p) => (
                <div key={p.lab} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`w-3 h-3 rounded ${p.shade}`} />{p.lab} <span className="text-slate-900 font-semibold font-mono">${p.v.toLocaleString()}</span> <span className="text-slate-400 text-xs">({p.detail})</span>
                </div>
              ))}
            </div>
            <div className="flex items-baseline justify-between mt-4 pt-4 border-t border-dashed border-slate-200">
              <span className="font-semibold text-slate-700">Realistic monthly total</span>
              <span className="font-mono font-extrabold text-2xl text-emerald-600 tabular-nums">$2,050/mo</span>
            </div>
          </div>
        </section>

        {/* First 90 days */}
        <section id="get-started" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your First 90 Days — From Stamp to First Paycheck</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ["Weeks 1–2", "Get bonded & commissioned", "Hold an active $10,000 Texas notary bond and commission. Renewing? Confirm yours doesn't lapse — a gap means you can't legally notarize (or earn)."],
              ["Weeks 3–6", "Add the money skills", "Complete loan-signing-agent training + background check, and register as a Remote Online Notary. This is what unlocks $75–$250 appointments instead of $10 ones."],
              ["Weeks 7–12", "Get on the platforms", "List on signing services and RON platforms, introduce yourself to local title companies, and set your travel fees. First signings usually land inside 30 days."],
            ].map(([wk, t, body]) => (
              <div key={wk} className="border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-mono font-bold uppercase tracking-wide text-emerald-600">{wk}</p>
                <h4 className="font-bold text-slate-900 mt-1 mb-1.5">{t}</h4>
                <p className="text-sm text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How much can a Texas notary realistically earn per month?", a: "It scales with commitment: roughly $400–$700/month weekend-casual, $1,200–$2,500 part-time (about 5 signings/week plus online work), and $7,000–$11,000 full-time with direct title relationships — which is $100,000+ a year. The median Texas notary signing agent earns about $56,900/year." },
              { q: "How much can I charge per signature in 2026?", a: "Texas Gov. Code §406.024 sets the maximum notarial fee at $10 for the first signature and $1 for each additional. Online notarizations allow up to $25 more per act. Travel, signing-service, and convenience fees are separate and uncapped, as long as you disclose them clearly." },
              { q: "Can a Texas notary perform wedding ceremonies?", a: "No. Unlike Florida or South Carolina, Texas does not authorize notaries to officiate weddings. Under Family Code §2.202, only licensed/ordained ministers, priests, rabbis, authorized religious officers, and current or retired judges may conduct a marriage ceremony. Your notary commission alone does not grant that authority." },
              { q: "Do I need extra insurance beyond my notary bond?", a: "Your $10,000 notary bond protects the public, not you. Notary E&O (Errors & Omissions) insurance protects you if a mistake causes a client financial harm. It costs $25–$65/year and is required by most title companies for loan-signing work." },
              { q: "Is being bilingual an advantage in Texas?", a: "A significant one. Texas has large Spanish-speaking communities statewide. Bilingual notaries command a premium and face little competition in many markets — lead with it in every channel." },
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-200"><p className="font-semibold text-slate-900 text-sm">{faq.q}</p></div>
                <div className="px-5 py-4"><p className="text-slate-700 text-sm leading-relaxed">{faq.a}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"><DollarSign className="w-6 h-6 text-white" /></div>
          <h3 className="text-2xl font-bold mb-2">It All Starts With an Active Bond</h3>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto">
            Renewing? Every day your bond is lapsed is a day you legally can't notarize — or earn. Not commissioned yet? The $10,000 surety bond is the cheapest business license you'll ever buy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/bonds/notary-bond-texas">
              <span className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer">
                Get or Renew Your Bond — $50 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <a href="tel:+12146668718" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              <Phone className="w-4 h-4" /> (214) 666-8718
            </a>
          </div>
          <p className="text-emerald-200 text-xs mt-4">RLI Insurance (A-rated) · TDI License #3480229 · Instant PDF delivery</p>
        </div>

        {/* Sources + author */}
        <div className="mt-8 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-500">Sources:</strong> Texas Gov. Code §406.024 (notary fee schedule); Texas Family Code §2.202 (who may conduct marriage ceremonies); ZipRecruiter &amp; Salary.com Texas notary-signing-agent wage data (2026); NNA and signing-service rate ranges; BlueNotary and Notarize published RON payouts (2026). Income figures are illustrative ranges based on cited 2026 market data and depend on effort, location, and volume — they are not guarantees of earnings.
        </div>
        <div className="mt-8 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-emerald-700">NS</div>
          <div>
            <p className="font-bold text-slate-900">Nice Shotwell-Sparks</p>
            <p className="text-sm text-slate-500">Founder, Quantum Surety LLC · TDI License #3480229</p>
            <p className="text-sm text-slate-600 mt-1">Texas-licensed surety bond agency specializing in notary, contractor, and GDN dealer bonds. We've helped thousands of Texas notaries get bonded since 2025.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
