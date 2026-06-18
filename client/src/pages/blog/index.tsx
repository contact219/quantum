import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Clock, Tag, Search, X, Filter } from "lucide-react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "texas-contractor-bond-crisis-june-2026",
    title: "Texas Contractor Bond Crisis: 240,627 Expired Bonds — June 2026 Data",
    description: "We analyzed 775,173 Texas TDLR contractor license records. 31% — 240,627 contractors — are operating with expired surety bonds. Full county breakdown with live data.",
    date: "2026-06-18",
    readTime: "6 min read",
    category: "Data Investigation",
    tags: ["Contractor Bond", "TDLR", "Data Study", "Texas", "Consumer Protection", "Compliance"],
    featured: true,
  },
  {
    slug: "best-texas-surety-bond-company-2026",
    title: "Best Texas Surety Bond Company 2026 — Full Comparison Guide",
    description: "We compared the top Texas surety bond companies on price, speed, Texas licensing, and digital tools. Ranked for notaries, TDLR contractors, and GDN dealers.",
    date: "2026-06-17",
    readTime: "7 min read",
    category: "Buyer's Guide",
    tags: ["Surety Bond Company", "Texas", "Comparison", "Review", "Best"],
    featured: true,
  },
  {
    slug: "texas-contractor-bond-market-data-2026",
    title: "Texas Has 816,000+ Active TDLR Contractor Licenses — 2026 Market Data",
    description: "We analyzed TDLR open data across all Texas contractor trade types: 816,000 licenses, bond requirements by category, top counties, new license velocity, and what bonds cost.",
    date: "2026-06-17",
    readTime: "6 min read",
    category: "Data Studies",
    tags: ["TDLR", "Contractor Bond", "Texas", "Data Study", "Market Data"],
    featured: true,
  },
  {
    slug: "texas-notary-expiration-data-2026",
    title: "62,623 Texas Notary Commissions Expire by December: 2026 Data Study",
    description: "We analyzed all 458,845 active Texas notary commissions. August is the biggest renewal month of the year, and one surety holds 43% of the market.",
    date: "2026-06-11",
    readTime: "5 min read",
    category: "Data Studies",
    tags: ["Notary Bond", "Data Study", "Renewal", "Texas SOS"],
    featured: true,
  },
  {
    slug: "texas-bonded-title-complete-guide-2026",
    title: "Texas Bonded Title: Complete 2026 Guide (Requirements, Process & Cost)",
    description: "Everything you need to know about getting a bonded title in Texas — when it's required, step-by-step process, what it costs, required TxDMV forms, and how to get bonded same day.",
    date: "2026-06-05",
    readTime: "9 min read",
    category: "Texas Vehicle Titles",
    tags: ["Bonded Title", "Certificate of Title Bond", "TxDMV", "VTR-130-SOF", "Texas Title"],
    featured: true,
  },
  {
    slug: "texas-certificate-of-title-bond-cost",
    title: "How Much Does a Texas Certificate of Title Bond Cost? (2026 Pricing)",
    description: "The 1.5x rule explained, a full pricing table for common vehicle values, and why most Texas title bonds start at just $50. Plus the Title Bond Calculator to get your exact number instantly.",
    date: "2026-06-05",
    readTime: "6 min read",
    category: "Texas Vehicle Titles",
    tags: ["Title Bond Cost", "Certificate of Title Bond", "Bond Pricing", "1.5x Rule", "Texas"],
    featured: false,
  },
  {
    slug: "bought-car-no-title-texas-bonded-title",
    title: "Bought a Car With No Title in Texas? Here's Your Legal Path to Ownership (2026)",
    description: "A bonded title is the legal route when a Texas seller couldn't provide a title. Covers your 3 options, red flags to check before buying, the complete bonded title process, and what you can and can't do during the 3-year bond period.",
    date: "2026-06-05",
    readTime: "7 min read",
    category: "Texas Vehicle Titles",
    tags: ["No Title Texas", "Car Without Title", "Bonded Title Texas", "Vehicle Title Bond", "TxDMV"],
    featured: false,
  },
  {
    slug: "quantum-surety-texas-title-bond-tools-2026",
    title: "Texas Title Bond in Minutes: Quantum Surety's Free Tools & Same-Day Bond",
    description: "A walkthrough of every free Quantum Surety tool built for Texas vehicle title problems — the Title Rescue Wizard, Title Bond Calculator, 10 county guides, and the direct apply link that skips the form entirely.",
    date: "2026-06-05",
    readTime: "5 min read",
    category: "Texas Vehicle Titles",
    tags: ["Texas Title Bond", "Title Rescue Wizard", "Bond Calculator", "Same-Day Bond", "Quantum Surety Tools"],
    featured: false,
  },
  {
    slug: "texas-contractor-bond-compliance-report-2026",
    title: "Nearly Half of Texas Apprentice Electricians Have Expired Surety Bonds, TDLR Data Shows",
    description: "46.9% of Texas apprentice electricians — 93,509 out of 199,435 — currently have expired surety bonds per TDLR public records. Statewide, 29.3% of all 816,000+ TDLR licensees are non-compliant.",
    date: "2026-05-27",
    readTime: "5 min read",
    category: "Data Report",
    tags: ["TDLR", "Texas Contractor Bonds", "Bond Compliance", "Electrician Bond", "Consumer Protection"],
    featured: false,
  },
  {
    slug: "how-to-get-lost-car-title-texas",
    title: "How to Get a Lost Car Title in Texas in 5 Easy Steps (2026)",
    description: "Lost your Texas car title? Here are 5 steps to get a replacement — including when you need a bonded title, the TxDMV forms required, and how Quantum Surety can get you bonded same day.",
    date: "2026-05-18",
    readTime: "8 min read",
    category: "Texas Vehicle Titles",
    tags: ["Texas Car Title", "Lost Title", "Bonded Title", "TxDMV", "Vehicle Title Bond"],
    featured: false,
  },
  {
    slug: "google-business-profile-texas-surety-bond",
    title: "Google Business Profile for Surety Bonds: Complete Texas Guide (2026)",
    description: "How to set up and optimize your Google Business Profile to rank for Texas surety bond searches. Category selection, photos, posts, reviews, Q&A — complete checklist for bond agencies.",
    date: "2026-05-17",
    readTime: "12 min read",
    category: "Local SEO",
    tags: ["Google Business Profile", "Local SEO", "Texas Surety Bond", "GBP Optimization"],
    featured: false,
  },
  {
    slug: "how-to-become-texas-notary-2026",
    title: "How to Become a Texas Notary Public in 2026 (Complete Guide)",
    description: "Step-by-step guide to becoming a Texas notary public in 2026. Eligibility, SB693 education requirement, $10,000 bond, oath of office, and how long it takes.",
    date: "2026-05-17",
    readTime: "9 min read",
    category: "Texas Notary",
    tags: ["Texas Notary", "SB693", "How to Become a Notary", "Notary Commission"],
    featured: false,
  },
  {
    slug: "what-is-a-surety-bond-texas",
    title: "What Is a Surety Bond? Texas Plain-Language Guide (2026)",
    description: "A surety bond is a 3-party guarantee — not insurance. Learn what a surety bond is, how it works, who needs one in Texas, and what it costs.",
    date: "2026-05-17",
    readTime: "6 min read",
    category: "Surety Basics",
    tags: ["Surety Bond", "Texas", "Bond vs Insurance", "How Bonds Work"],
    featured: false,
  },
  {
    slug: "how-to-get-texas-gdn-license",
    title: "How to Get a Texas GDN Dealer License in 2026 (Step-by-Step)",
    description: "Complete step-by-step guide to getting a Texas GDN motor vehicle dealer license in 2026. Required documents, bond, TxDMV eLICENSING process, costs, and timeline.",
    date: "2026-05-17",
    readTime: "10 min read",
    category: "Texas Auto Dealers",
    tags: ["GDN License", "Texas Dealer License", "TxDMV", "Motor Vehicle Dealer"],
    featured: false,
  },
  {
    slug: "bid-bond-vs-performance-bond-vs-payment-bond",
    title: "Bid Bond vs Performance Bond vs Payment Bond: Texas Guide (2026)",
    description: "What's the difference between a bid bond, performance bond, and payment bond? When each is required in Texas, what they cost, and why public contracts need all three.",
    date: "2026-05-17",
    readTime: "8 min read",
    category: "Construction Bonds",
    tags: ["Bid Bond", "Performance Bond", "Payment Bond", "Texas Construction", "Little Miller Act"],
    featured: false,
  },
  {
    slug: "texas-notary-bond-vs-eo-insurance",
    title: "Texas Notary Bond vs E&O Insurance: What's the Difference? (2026)",
    description: "Texas notary bond vs E&O insurance — what each covers, which is required by law, who is protected, and when notaries need both.",
    date: "2026-05-17",
    readTime: "7 min read",
    category: "Texas Notary",
    tags: ["Notary Bond", "E&O Insurance", "Texas Notary", "Notary Signing Agent"],
    featured: false,
  },
  {
    slug: "texas-performance-bond-guide-2026",
    title: "Texas Performance Bond Requirements & Cost Guide (2026)",
    description: "Complete guide to Texas performance bonds in 2026: who needs them, how much they cost (0.5%–3%), legal requirements under Texas Gov. Code § 2253 and the Miller Act.",
    date: "2026-04-25",
    readTime: "9 min read",
    category: "Construction Bonds",
    tags: ["Performance Bond", "Texas Construction", "Miller Act", "Gov. Code § 2253"],
    featured: false,
  },
  {
    slug: "texas-bid-bond-requirements-2026",
    title: "Texas Bid Bond Requirements 2026: What Contractors Need to Know",
    description: "Texas bid bond requirements for 2026: who needs one, when it's required, how much it costs, and how to get same-day approval.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Construction Bonds",
    tags: ["Bid Bond", "Texas Construction", "Public Projects", "Gov. Code § 2253"],
    featured: false,
  },
  {
    slug: "texas-contractor-bond-requirements-by-city",
    title: "Texas Contractor Bond Requirements by City (2026)",
    description: "Bond requirements vary by Texas city. Complete breakdown for Houston, Dallas, San Antonio, Austin, Fort Worth, and 20+ more cities — amounts, which cities require them, and where to get bonded.",
    date: "2026-04-25",
    readTime: "11 min read",
    category: "Texas Contractors",
    tags: ["Contractor Bond", "Texas Cities", "TDLR", "Local Bond Requirements"],
    featured: false,
  },
  {
    slug: "texas-hvac-contractor-bond-requirements",
    title: "Texas HVAC Contractor Bond Requirements 2026 | TDLR & City License",
    description: "Complete guide to Texas HVAC contractor bond requirements in 2026. TDLR bond requirements, city bonds, how much it costs, and how to get bonded fast.",
    date: "2026-04-25",
    readTime: "8 min read",
    category: "Texas Contractors",
    tags: ["HVAC Bond", "TDLR", "Contractor License Bond", "Texas HVAC"],
    featured: false,
  },
  {
    slug: "texas-plumbing-contractor-bond-requirements",
    title: "Texas Plumbing Contractor Bond Requirements 2026 | TDLR & City License",
    description: "Complete guide to Texas plumbing contractor bond requirements in 2026. TDLR bond, city bonds, how much it costs, and how to get bonded fast.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Texas Contractors",
    tags: ["Plumbing Bond", "TDLR", "Contractor License Bond", "Texas Plumbing"],
    featured: false,
  },
  {
    slug: "texas-roofing-contractor-bond-requirements",
    title: "Texas Roofing Contractor Bond Requirements 2026 | City & TDLR License",
    description: "Texas roofing contractor bond requirements by city in 2026. Bond amounts, who requires them, what they cost, and how to get bonded same-day.",
    date: "2026-04-25",
    readTime: "6 min read",
    category: "Texas Contractors",
    tags: ["Roofing Bond", "Contractor License Bond", "Texas Roofing", "Storm Damage"],
    featured: false,
  },
  {
    slug: "texas-electrical-contractor-bond-requirements",
    title: "Texas Electrical Contractor Bond Requirements 2026 | TDLR",
    description: "Texas electrical contractor bond requirements for 2026. Master, journeyman, and apprentice electrician bond requirements, TDLR licensing, costs, and how to renew.",
    date: "2026-04-25",
    readTime: "8 min read",
    category: "Texas Contractors",
    tags: ["Electrical Bond", "TDLR", "Master Electrician", "Contractor License Bond"],
    featured: false,
  },
  {
    slug: "texas-gdn-bond-requirements-2026",
    title: "Texas GDN Bond Requirements 2026: What Dealers Need to Know",
    description: "Texas GDN bond requirements for auto dealers in 2026 — bond amounts by dealer type, who needs one, what it costs, and how to get same-day approval.",
    date: "2026-04-25",
    readTime: "8 min read",
    category: "Texas Auto Dealers",
    tags: ["GDN Bond", "Texas Dealer Bond", "TxDMV", "Auto Dealer"],
    featured: false,
  },
  {
    slug: "texas-gdn-bond-cost-2026",
    title: "Texas GDN Bond Cost 2026: Pricing for Every Dealer Type",
    description: "How much does a Texas GDN dealer bond cost in 2026? Pricing by dealer category, what affects your rate, and why Quantum Surety starts at $100/year.",
    date: "2026-04-25",
    readTime: "6 min read",
    category: "Texas Auto Dealers",
    tags: ["GDN Bond Cost", "Texas Dealer Bond", "Bond Pricing", "Auto Dealer"],
    featured: false,
  },
  {
    slug: "texas-dealer-license-renewal-gdn-bond",
    title: "Texas Dealer License Renewal & GDN Bond: Complete 2026 Guide",
    description: "How to renew your Texas GDN dealer license and surety bond in 2026. Renewal timeline, required documents, bond renewal cost, and how to avoid license gaps.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Texas Auto Dealers",
    tags: ["GDN Renewal", "Texas Dealer License", "Bond Renewal", "TxDMV"],
    featured: false,
  },
  {
    slug: "texas-tdlr-contractor-bond-2026",
    title: "Texas TDLR Contractor Bond Requirements 2026",
    description: "Which Texas TDLR license types require a surety bond, how much it costs, when it needs to be renewed, and how to get bonded same-day.",
    date: "2026-04-25",
    readTime: "8 min read",
    category: "Texas Contractors",
    tags: ["TDLR Bond", "Contractor License Bond", "Texas Contractor", "License Renewal"],
    featured: false,
  },
  {
    slug: "texas-contractor-license-bond-cost",
    title: "Texas Contractor License Bond Cost 2026: What You'll Actually Pay",
    description: "Real-world pricing for Texas contractor license bonds in 2026. Cost by license type, what affects your rate, and why credit check matters less than you think.",
    date: "2026-04-25",
    readTime: "6 min read",
    category: "Texas Contractors",
    tags: ["Contractor Bond Cost", "TDLR", "Bond Pricing", "Texas Contractor"],
    featured: false,
  },
  {
    slug: "texas-contractor-bond-and-permits",
    title: "Texas Contractor Bond & Permit Requirements (2026)",
    description: "Do Texas contractors need a bond to pull permits? Which cities require it, what amount, and how it interacts with your TDLR license bond.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Texas Contractors",
    tags: ["Contractor Permit Bond", "Texas Permits", "City Bond Requirements", "TDLR"],
    featured: false,
  },
  {
    slug: "texas-notary-bond-sb693-2026-requirements",
    title: "Texas SB693 Notary Bond Requirements 2026 | New Education Mandate",
    description: "SB693 added a 6-hour education requirement for new Texas notaries in 2026. What changed, who it affects, how to satisfy it, and whether it changes your bond.",
    date: "2026-04-25",
    readTime: "6 min read",
    category: "Texas Notary",
    tags: ["SB693", "Texas Notary Bond", "Notary Education", "2026 Requirements"],
    featured: false,
  },
  {
    slug: "texas-notary-bond-cost-2026",
    title: "Texas Notary Bond Cost 2026: Why It's $50 Flat (No Credit Check)",
    description: "How much does a Texas notary bond cost in 2026? It's $50 flat from Quantum Surety — no credit check, no hidden fees, same-day issue. Here's why and what's included.",
    date: "2026-04-25",
    readTime: "5 min read",
    category: "Texas Notary",
    tags: ["Notary Bond Cost", "Texas Notary", "$50 Bond", "No Credit Check"],
    featured: false,
  },
  {
    slug: "texas-notary-vs-notary-signing-agent",
    title: "Texas Notary Public vs Notary Signing Agent: What's the Difference?",
    description: "Texas notary public vs notary signing agent — different roles, different bonds, different income potential. Which one you should become and what each requires.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Texas Notary",
    tags: ["Notary Signing Agent", "Texas Notary", "NSA", "Notary vs NSA"],
    featured: false,
  },
  {
    slug: "texas-notary-bond-sb693-renewal-2026",
    title: "Renewing Your Texas Notary Bond After SB693 (2026 Guide)",
    description: "How to renew your Texas notary bond after SB693 changes. Whether renewal triggers the education requirement, what's new, and how to renew in 5 minutes.",
    date: "2026-04-25",
    readTime: "5 min read",
    category: "Texas Notary",
    tags: ["Notary Bond Renewal", "SB693", "Texas Notary", "Renewal 2026"],
    featured: false,
  },
  {
    slug: "quantum-surety-tdi-licensed-agency-3480229",
    title: "Quantum Surety Is a TDI-Licensed Texas Surety Agency (#3480229)",
    description: "Quantum Surety received Texas Department of Insurance license #3480229, authorizing us to issue surety bonds statewide. What that means for you.",
    date: "2026-04-10",
    readTime: "3 min read",
    category: "Company News",
    tags: ["TDI License", "Texas Surety Agency", "License #3480229", "Quantum Surety"],
    featured: false,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Texas Vehicle Titles": "bg-teal-100 text-teal-800 border-teal-200",
  "Texas Notary":         "bg-blue-100 text-blue-800 border-blue-200",
  "Texas Contractors":    "bg-orange-100 text-orange-800 border-orange-200",
  "Texas Auto Dealers":   "bg-amber-100 text-amber-800 border-amber-200",
  "Construction Bonds":   "bg-purple-100 text-purple-800 border-purple-200",
  "Surety Basics":        "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Data Report":          "bg-rose-100 text-rose-800 border-rose-200",
  "Local SEO":            "bg-green-100 text-green-800 border-green-200",
  "Company News":         "bg-gray-100 text-gray-700 border-gray-200",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

const ALL_CATEGORIES = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function BlogIndex() {
  useSEO({
    title: "Texas Surety Bond Blog | Quantum Surety",
    description:
      "Texas surety bond guides, title bond how-tos, notary requirements, contractor licensing, and dealer bond updates. Written by a TDI-licensed Texas surety agency.",
    canonical: "/blog",
    ogType: "website",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BLOG_POSTS.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  const featuredPost = searchQuery === "" && activeCategory === "All"
    ? BLOG_POSTS.find((p) => p.featured)
    : null;
  const listPosts = featuredPost
    ? filtered.filter((p) => p.slug !== featuredPost.slug)
    : filtered;

  const isFiltering = searchQuery !== "" || activeCategory !== "All";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-300 text-sm font-medium mb-3 uppercase tracking-widest">
            Quantum Surety Blog
          </p>
          <h1 className="text-4xl font-bold mb-4">Texas Surety Bond Guides</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mb-8">
            Straight-talk guides on Texas bond requirements, title bonds, law changes, and licensing
            — written by a TDI-licensed Texas surety agency, not a content farm.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles — e.g. bonded title, notary, GDN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Category filter pills */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === cat
                  ? cat === "All"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : `${categoryColor(cat)} border-current`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Result count when filtering */}
        {isFiltering && (
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length === 0
              ? "No articles match your search."
              : `${filtered.length} article${filtered.length !== 1 ? "s" : ""} found`}
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="ml-2 text-indigo-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </p>
        )}

        {/* Featured post — only shown when not filtering */}
        {featuredPost && (
          <div className="mb-10">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
              Featured
            </p>
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="bg-white rounded-2xl border border-teal-100 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
                <div className="flex items-center gap-3 mb-4 flex-wrap relative">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColor(featuredPost.category)}`}>
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {featuredPost.readTime}
                  </span>
                  <span className="text-gray-400 text-xs">{formatDate(featuredPost.date)}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug relative">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-5 leading-relaxed relative">{featuredPost.description}</p>
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  {featuredPost.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
                <span className="text-teal-600 font-semibold text-sm flex items-center gap-1">
                  Read guide <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Article list */}
        {listPosts.length > 0 && (
          <>
            {!isFiltering && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                All Articles ({BLOG_POSTS.length})
              </p>
            )}
            <div className="space-y-3">
              {listPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryColor(post.category)}`}>
                            {post.category}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.readTime}
                          </span>
                          <span className="text-gray-400 text-xs hidden sm:inline">{formatDate(post.date)}</span>
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs text-gray-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">No articles found</p>
            <p className="text-gray-400 text-sm mb-4">Try a different keyword or browse by category above.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-indigo-600 text-sm font-semibold hover:underline"
            >
              Show all articles
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-indigo-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Your Texas Bond?</h2>
          <p className="text-indigo-200 mb-6">
            Instant quotes. No credit check. TDI-licensed Texas agency (#3480229).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quote">
              <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
                Get a Quote <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </Link>
            <Link href="/texas-title-rescue">
              <button className="bg-teal-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-400 transition-colors">
                Title Rescue Wizard <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
