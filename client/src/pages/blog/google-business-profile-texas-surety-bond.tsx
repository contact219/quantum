import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight, Clock, ChevronRight, CheckCircle, AlertTriangle, Star, Shield } from "lucide-react";

export default function BlogGBPGuide() {
  useSEO({
    title: "Google Business Profile for Surety Bonds: Complete Texas Guide (2026) | Quantum Surety",
    description: "How to set up and optimize your Google Business Profile to rank for Texas surety bond searches. Category selection, photos, posts, reviews, Q&A — complete checklist for 2026.",
    canonical: "/blog/google-business-profile-texas-surety-bond",
    ogType: "article",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Google Business Profile for Surety Bonds: Complete Texas Optimization Guide",
    "description": "Step-by-step guide to setting up and optimizing a Google Business Profile for a Texas surety bond agency — category selection, photos, posts, reviews, Q&A, and GBP insights.",
    "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  }, "ld-json-Article");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What Google Business Profile category should a surety bond agency use?", "acceptedAnswer": { "@type": "Answer", "text": "The primary category should be 'Insurance Agency.' Secondary categories can include 'Financial Services,' 'Notary Public' (if you issue notary bonds), and 'Surety Company' if available in your market. Do not use 'Insurance Broker' as the primary — Google treats 'Insurance Agency' as the closest match for bond issuers." } },
      { "@type": "Question", "name": "Do surety bond agencies need a physical address on GBP?", "acceptedAnswer": { "@type": "Answer", "text": "No — you can create a GBP as a service-area business without displaying a physical address. For a digital-first surety agency serving all 254 Texas counties, set your service area to Texas rather than a storefront address. This is Google's recommended approach for online-only businesses." } },
    ],
  }, "ld-json-FAQ");

  const sections = [
    {
      num: "1",
      title: "Claim and Verify Your Profile",
      items: [
        { done: true, text: "Go to business.google.com and claim your listing (or create one if it doesn't exist)" },
        { done: true, text: "Verify via postcard, phone, or video verification — whichever Google offers" },
        { done: true, text: "Ensure the business name exactly matches your legal entity name (Quantum Surety LLC)" },
        { done: false, text: "Check for duplicate listings — search your name and phone number and merge or remove dupes" },
      ],
    },
    {
      num: "2",
      title: "Complete Every Profile Field",
      items: [
        { done: false, text: "Business name: \"Quantum Surety\" — no keyword stuffing, just the brand name" },
        { done: false, text: "Primary category: Insurance Agency" },
        { done: false, text: "Secondary categories: Financial Services, Notary Public (add both)" },
        { done: false, text: "Service area: Set to Texas (all 254 counties). Do NOT show a storefront address — use service-area business mode" },
        { done: false, text: "Phone: Your primary business number — must match what's on quantumsurety.bond" },
        { done: false, text: "Website: https://quantumsurety.bond" },
        { done: false, text: "Hours: Set business hours even for an online business. Use Mon–Fri 9am–5pm CST or 24/7 if you handle requests around the clock" },
        { done: false, text: "Business description: 750 characters. Include: surety bonds, Texas, TDI license #3480229, key bond types (notary, GDN, contractor, construction). Example below." },
      ],
    },
    {
      num: "3",
      title: "Write a High-Converting Business Description",
      items: [
        { done: false, text: "Lead with what you do and who you serve: 'Quantum Surety is a Texas-licensed surety bond agency issuing notary bonds, GDN dealer bonds, contractor bonds, and construction bonds across all 254 Texas counties.'" },
        { done: false, text: "Include key differentiators: instant PDF delivery, no credit check (notary bonds), same-day approval" },
        { done: false, text: "Include your TDI license number (#3480229) — adds trust and matches regulatory mentions on your site" },
        { done: false, text: "Include bond types: notary bond, GDN dealer bond, bid bond, performance bond, payment bond, contractor license bond" },
        { done: false, text: "End with a CTA phrase: 'Apply in 5 minutes at quantumsurety.bond'" },
      ],
    },
    {
      num: "4",
      title: "Add Products and Services",
      items: [
        { done: false, text: "Add each bond type as a Service in GBP: Notary Bond ($50), GDN Dealer Bond (from $100/yr), Contractor License Bond (from $75/yr), Construction Bonds, Bid Bonds, Performance Bonds, Payment Bonds" },
        { done: false, text: "For each service: add a description (2–3 sentences), add a price or price range, link to the relevant page on quantumsurety.bond" },
        { done: false, text: "Priority services to add first: Notary Bond — Texas ($50), GDN Bond — Texas (from $100/yr)" },
      ],
    },
    {
      num: "5",
      title: "Upload Photos",
      items: [
        { done: false, text: "Logo photo: upload the Quantum Surety logo (minimum 250×250px, PNG with transparent background)" },
        { done: false, text: "Cover photo: the hero image from quantumsurety.bond or a branded 1080×608px graphic with your tagline" },
        { done: false, text: "Product photos: screenshots of bond certificate PDFs (redact customer info), the bond application flow, the mybondapp.com instant-issue interface" },
        { done: false, text: "Team/office: even a clean branded workspace photo helps — no face required. A desk with 'Quantum Surety' visible adds legitimacy." },
        { done: false, text: "Minimum 5 photos to start. Google shows profiles with 10+ photos significantly more often." },
        { done: false, text: "Photo naming: rename files before upload with descriptive names (texas-notary-bond-certificate.jpg, gdn-dealer-bond-texas.jpg) — Google reads EXIF and filename" },
      ],
    },
    {
      num: "6",
      title: "Enable and Respond to Messages",
      items: [
        { done: false, text: "Turn on Google Business Messages in your GBP dashboard (Business Profile Settings → Messages → Turn on)" },
        { done: false, text: "Set an automated welcome message: 'Hi! Thanks for reaching out to Quantum Surety. What type of Texas bond do you need — notary, GDN dealer, or contractor? We can get you bonded in minutes at quantumsurety.bond'" },
        { done: false, text: "Respond to every message within 24 hours — Google penalizes profiles with slow response rates by reducing message visibility" },
        { done: false, text: "Download the Google Maps app on your phone so you get push notifications for new messages" },
      ],
    },
    {
      num: "7",
      title: "Generate and Respond to Reviews",
      items: [
        { done: false, text: "Create a short review link: go to your GBP → Get more reviews → copy the short URL. Use this in follow-up emails after bond issuance." },
        { done: false, text: "Add the review link to your confirmation email (Amazon SES) after a bond is delivered: 'Got your bond — mind leaving us a quick Google review?' with the link." },
        { done: false, text: "Respond to every review — positive and negative — within 24 hours. Google factors response rate and speed into local ranking." },
        { done: false, text: "Response template for 5-star: 'Thank you [Name]! We're glad your [bond type] arrived quickly. Let us know if you need anything else — we're here.' Keep it specific, not generic." },
        { done: false, text: "Response template for negative: 'Thank you for the feedback [Name]. We'd like to make this right — please reach out to us directly at quantumsurety.bond/contact and we'll resolve this.' Never argue publicly." },
        { done: false, text: "Target: 10+ reviews before you'll appear consistently in the local 3-pack for 'Texas notary bond' and 'surety bond agency Texas' searches." },
      ],
    },
    {
      num: "8",
      title: "Post Weekly Updates",
      items: [
        { done: false, text: "Go to GBP → Posts → Add update. Google recommends at least 1 post per week to maintain profile freshness." },
        { done: false, text: "Post types that work for surety bonds: 'What's New' (law updates, SB693 changes), 'Offer' (if running a promotion), 'Event' (webinar, deadline reminders like notary renewal season)" },
        { done: false, text: "Post ideas: 'SB693 is in effect — get your notary bond for $50 before your commission expires' with a link to /bonds/notary-bond-texas" },
        { done: false, text: "Post ideas: 'GDN bond renewal season — TxDMV requires your $50,000 dealer bond to stay active' with link to /bonds/gdn-bond-texas" },
        { done: false, text: "Post ideas: 'New to Texas notary? Here's what you need to know about the 2026 SB693 requirements' with link to /blog/texas-notary-bond-sb693-2026-requirements" },
        { done: false, text: "Each post: include a photo or graphic, 150–300 words of text, and a button linking to the relevant page on quantumsurety.bond. Posts expire after 7 days — set a weekly calendar reminder." },
      ],
    },
    {
      num: "9",
      title: "Manage the Q&A Section",
      items: [
        { done: false, text: "Seed your own Q&A: Anyone can ask and answer questions. Ask (and answer) your own most common questions using a second Google account or ask a team member." },
        { done: false, text: "Questions to seed: 'How much does a Texas notary bond cost?' → 'A Texas notary bond costs $50 for the full 4-year term at Quantum Surety. No credit check, instant PDF delivery. Get yours at quantumsurety.bond'" },
        { done: false, text: "Questions to seed: 'Do I need a surety bond to get a Texas notary commission?' → 'Yes. Texas Government Code §406.010 requires a $10,000 surety bond for every Texas notary public. Quantum Surety issues it for $50 — instant PDF, no credit check.'" },
        { done: false, text: "Questions to seed: 'What is a GDN bond in Texas?' → 'A GDN bond is a $50,000 surety bond required by TxDMV for all motor vehicle dealers under §503.033. Quantum Surety issues GDN bonds from $100/yr with same-day PDF delivery.'" },
        { done: false, text: "Monitor Q&A weekly — anyone can answer your questions, including competitors. Flag incorrect answers and respond with the correct information." },
      ],
    },
    {
      num: "10",
      title: "Monitor GBP Insights Weekly",
      items: [
        { done: false, text: "Review GBP Insights every Monday: search views (how many people found you via Search vs Maps), direction requests, website clicks, phone calls, message requests" },
        { done: false, text: "Track the search queries people use to find your profile — these often reveal untapped blog post topics or bond types to add" },
        { done: false, text: "If 'website clicks' is low relative to 'search views', your description or photos may not be compelling enough. Test a new cover photo or description." },
        { done: false, text: "If 'phone calls' is zero, double-check your phone number is correct and matches the number on quantumsurety.bond" },
        { done: false, text: "Set a monthly GBP audit: check that all fields are still accurate, add new photos if bond types have changed, verify no duplicate listings have appeared" },
      ],
    },
  ];

  const faqs = [
    { q: "What Google Business Profile category should a surety bond agency use?", a: "Primary category: Insurance Agency. Secondary categories: Financial Services and Notary Public (since notary bonds are a major product). Do not keyword-stuff the business name with terms like 'surety bond agency' — Google's guidelines prohibit it and can result in suspension." },
    { q: "Do surety bond agencies need a physical address on GBP?", a: "No. You can operate as a service-area business without displaying a physical address. For a digital-first agency serving all 254 Texas counties, set your service area to 'Texas' and hide your address. This is Google's recommended approach for online-only businesses and avoids the awkward situation of showing a home address." },
    { q: "How many reviews does a surety bond agency need to rank in the local 3-pack?", a: "There's no hard threshold, but in the Texas surety bond niche, 10–25 reviews with an average of 4.7+ stars typically places you in the top 3 local results for queries like 'Texas notary bond' and 'surety bond agency Texas.' The key is consistency: new reviews signal an active, trusted business to Google." },
    { q: "Can I ask customers to leave Google reviews?", a: "Yes — Google explicitly allows asking customers for reviews, as long as you don't offer incentives (discounts, gifts, cash) in exchange. A simple, direct request via email after bond delivery is compliant. You cannot ask only happy customers — the request must go to all customers." },
    { q: "How often should I post on Google Business Profile?", a: "Minimum once per week. GBP posts expire after 7 days (unless set as 'Events' with future end dates), so weekly posting maintains a fresh, active appearance. Bond-related updates — SB693 changes, GDN renewal season, contractor licensing deadlines — make strong post topics that also demonstrate industry expertise." },
    { q: "What happens if my GBP listing gets suspended?", a: "GBP suspensions most often result from: keyword stuffing in the business name, a mismatched address, or suspicious review activity. If suspended, appeal via the Business Profile support portal with documentation (TDI license certificate, business registration). A clean TDI license like #3480229 is strong evidence for reinstatement." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Local SEO</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Local SEO</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 12 min read</span>
            <span className="text-indigo-300 text-sm">May 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Google Business Profile for Surety Bonds: Complete Texas Optimization Guide (2026)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            A fully optimized GBP is often the fastest path to appearing in local Texas searches for notary bonds, GDN bonds, and contractor bonds. Here's every step — from category selection to weekly posts to review management.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        {/* Why GBP matters */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Why GBP matters for surety bond agencies</p>
              <p className="text-gray-700 text-sm leading-relaxed">Google's local 3-pack appears above organic results for searches like "Texas notary bond near me," "surety bond agency Texas," and "GDN bond Dallas." A well-optimized GBP can drive more clicks than a #1 organic ranking because it appears higher on the page and shows reviews, photos, and a direct phone/website link.</p>
            </div>
          </div>
        </div>

        {/* Checklist sections */}
        {sections.map((sec) => (
          <section key={sec.num}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{sec.num}</span>
              {sec.title}
            </h2>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.text} className={`flex items-start gap-3 rounded-xl p-3.5 border ${item.done ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                  <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${item.done ? "text-green-500" : "text-gray-300"}`} />
                  <p className={`text-sm leading-relaxed ${item.done ? "text-green-900" : "text-gray-700"}`}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Business description template */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
            Recommended Business Description Template
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Copy, customize, and paste into your GBP description (750 char max):</p>
            <p className="text-sm text-gray-800 leading-relaxed font-mono bg-white border border-gray-200 rounded-xl p-4">
              Quantum Surety is a Texas-licensed surety bond agency (TDI License #3480229) issuing notary bonds, GDN dealer bonds, contractor license bonds, bid bonds, performance bonds, and payment bonds across all 254 Texas counties. Notary bonds: $50 flat, instant PDF, no credit check. GDN dealer bonds: from $100/yr, same-day issuance. Construction bonds: A-rated carriers, fast approval. All bonds SB693 compliant. Apply in minutes at quantumsurety.bond.
            </p>
            <p className="text-xs text-gray-400 mt-2">~480 characters — room to add a specific city or bond type if relevant.</p>
          </div>
        </section>

        {/* Review request email template */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Star className="w-5 h-5 text-indigo-600 shrink-0" />
            Review Request Email Template (Amazon SES)
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Add to your post-bond-delivery SES email sequence:</p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <p className="text-xs text-gray-400 font-mono">Subject: Your Quantum Surety bond is ready — quick question</p>
              <hr className="border-gray-100" />
              <p className="text-sm text-gray-800 leading-relaxed">Hi [First Name],</p>
              <p className="text-sm text-gray-800 leading-relaxed">Your [bond type] is attached and ready to file. It should take about 2 minutes to complete your [SOS / TxDMV] application.</p>
              <p className="text-sm text-gray-800 leading-relaxed">If the process was easy, we'd really appreciate a quick Google review — it takes 30 seconds and helps other Texas [notaries / dealers / contractors] find us:</p>
              <p className="text-sm font-semibold text-indigo-700">[YOUR GBP SHORT REVIEW LINK]</p>
              <p className="text-sm text-gray-800 leading-relaxed">Questions? Just reply here.</p>
              <p className="text-sm text-gray-800">— The Quantum Surety Team</p>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600">Send this email 15–30 minutes after bond delivery, not immediately. Give the customer time to open the PDF first.</p>
            </div>
          </div>
        </section>

        {/* Weekly post calendar */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4-Week GBP Post Calendar</h2>
          <div className="space-y-3">
            {[
              { week: "Week 1", topic: "Notary bond introduction", text: "Texas notaries: your $10,000 surety bond is required before the Secretary of State will issue your commission. Get yours for $50 — instant PDF, no credit check, SB693 compliant.", link: "/bonds/notary-bond-texas" },
              { week: "Week 2", topic: "SB693 education requirement", text: "Starting January 1, 2026, new Texas notary applicants must complete a 2-hour education course under SB693. Here's exactly what that means for your commission application.", link: "/blog/texas-notary-bond-sb693-2026-requirements" },
              { week: "Week 3", topic: "GDN bond for Texas dealers", text: "Texas motor vehicle dealers: your $50,000 GDN bond must be active before TxDMV will issue or renew your dealer license. We issue same-day from $100/yr.", link: "/bonds/gdn-bond-texas" },
              { week: "Week 4", topic: "Construction bond explainer", text: "Texas contractors: public projects over $25,000 require a performance bond AND a payment bond under the Texas Little Miller Act. We issue both together.", link: "/blog/bid-bond-vs-performance-bond-vs-payment-bond" },
            ].map((p) => (
              <div key={p.week} className="border border-gray-200 rounded-xl p-4 flex gap-4">
                <div className="shrink-0">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{p.week}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{p.topic}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1">{p.text}</p>
                  <p className="text-xs text-indigo-500 font-mono truncate">Link → quantumsurety.bond{p.link}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Repeat this 4-week cycle with fresh variations. Seasonal posts (tax season, notary renewal reminders, GDN renewal season) can replace any week's content.</p>
        </section>

        {/* Suspension warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Top reasons GBP listings get suspended — avoid these</p>
              <ul className="text-sm text-gray-700 space-y-1 leading-relaxed">
                <li>• <strong>Keyword stuffing the business name</strong>: "Quantum Surety — Texas Notary Bonds GDN Contractor" → this violates guidelines. Just "Quantum Surety."</li>
                <li>• <strong>Address mismatch</strong>: your GBP address must match your TDI filing address exactly, or use service-area mode with no address displayed.</li>
                <li>• <strong>Incentivized reviews</strong>: offering discounts for reviews violates Google's policy. Just ask — don't bribe.</li>
                <li>• <strong>Duplicate listings</strong>: if you've moved or had old accounts, there may be a duplicate. Merge, don't create a new one.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{f.q}
                  </p>
                </div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Bond — Then Get Reviews</h2>
          <p className="text-indigo-200 mb-5">The fastest way to build GBP authority is to issue great bonds quickly. Instant PDF, $50 flat, no credit check.</p>
          <a href="/get-bond?type=notary">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Get My Notary Bond — $50 <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>

        {/* Related */}
        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/blog/what-is-a-surety-bond-texas", label: "What Is a Surety Bond? Texas Guide" },
              { href: "/blog/how-to-become-texas-notary-2026", label: "How to Become a Texas Notary (2026)" },
              { href: "/blog/texas-notary-bond-sb693-2026-requirements", label: "SB693 Requirements Guide" },
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond — $50" },
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
    </div>
  );
}
