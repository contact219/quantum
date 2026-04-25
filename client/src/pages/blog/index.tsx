import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Clock, Tag } from "lucide-react";

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
    slug: "texas-performance-bond-guide-2026",
    title: "Texas Performance Bond Requirements & Cost Guide (2026)",
    description:
      "Complete guide to Texas performance bonds in 2026: who needs them, how much they cost (0.5%–3%), legal requirements under Texas Gov. Code § 2253 and the Miller Act, and how to get approved fast.",
    date: "2026-04-25",
    readTime: "9 min read",
    category: "Construction Bonds",
    tags: ["Performance Bond", "Texas Construction", "Miller Act", "Gov. Code § 2253"],
    featured: false,
  },
  {
    slug: "texas-bid-bond-requirements-2026",
    title: "Texas Bid Bond Requirements 2026: What Contractors Need to Know",
    description:
      "Texas bid bond requirements for 2026: who needs one, when it's required, how much it costs, and how to get same-day approval. Complete guide for Texas contractors bidding public and private projects.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Construction Bonds",
    tags: ["Bid Bond", "Texas Construction", "Public Projects", "Gov. Code § 2253"],
    featured: false,
  },
  {
    slug: "texas-contractor-bond-requirements-by-city",
    title: "Texas Contractor Bond Requirements by City (2026)",
    description:
      "Contractor bond requirements for every major Texas city in 2026. Dallas, Houston, Austin, San Antonio, Fort Worth, El Paso, and more — bond amounts, licensing agencies, and how to get bonded fast.",
    date: "2026-04-25",
    readTime: "10 min read",
    category: "Texas Contractors",
    tags: ["Contractor Bond", "Texas Cities", "License Bond", "TDLR"],
    featured: true,
  },
  {
    slug: "texas-gdn-bond-requirements-2026",
    title: "Texas GDN Bond Requirements 2026: What Every Motor Vehicle Dealer Needs to Know",
    description:
      "Complete guide to Texas GDN bond requirements. What a GDN bond is, why it's required under §503.033, all 6 dealer license types, bond amount, and what happens if you operate without one.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Texas Auto Dealers",
    tags: ["GDN Bond", "Texas Dealer License", "§503.033", "TxDMV"],
    featured: false,
  },
  {
    slug: "texas-gdn-bond-cost-2026",
    title: "How Much Does a Texas GDN Bond Cost in 2026?",
    description:
      "A Texas GDN dealer bond costs $100–$300 per year for most dealers. Full cost breakdown by credit tier, why it's cheaper than most expect, and how to get the lowest rate.",
    date: "2026-04-25",
    readTime: "5 min read",
    category: "Texas Auto Dealers",
    tags: ["GDN Bond", "Bond Cost", "Texas Dealer License"],
    featured: false,
  },
  {
    slug: "texas-dealer-license-renewal-gdn-bond",
    title: "Texas Dealer License Renewal: GDN Bond Checklist & TxDMV Steps",
    description:
      "Step-by-step GDN bond renewal checklist for Texas dealers — TxDMV eLICENSING instructions, key deadlines, common mistakes, and what happens if your bond lapses.",
    date: "2026-04-25",
    readTime: "6 min read",
    category: "Texas Auto Dealers",
    tags: ["GDN Bond", "Dealer License Renewal", "TxDMV", "Texas Auto Dealers"],
    featured: false,
  },
  {
    slug: "quantum-surety-tdi-licensed-agency-3480229",
    title: "Quantum Surety Receives TDI Agency License #3480229",
    description:
      "Quantum Surety LLC is now fully licensed by the Texas Department of Insurance (License #3480229), operating under full TDI regulatory oversight as a General Lines P&C agency.",
    date: "2026-04-07",
    readTime: "4 min read",
    category: "Company News",
    tags: ["Company News", "TDI Licensed", "Texas"],
    featured: false,
  },
  {
    slug: "texas-contractor-bond-and-permits",
    title: "Texas Contractors: Get Your Bond and Pull Your Permits in One Day",
    description:
      "A practical same-day workflow for DFW contractors: secure your license bond, identify every required permit, and submit with fewer delays.",
    date: "2026-04-05",
    readTime: "6 min read",
    category: "Texas Contractors",
    tags: ["Contractor License Bond", "DFW Permits", "Permit Pilot"],
    featured: false,
  },
  {
    slug: "texas-notary-bond-sb693-renewal-2026",
    title: "Texas Notary Bond Renewal Under SB693 2026: What Every Renewing Notary Must Do",
    description:
      "Renewing your Texas notary commission in 2026? SB693 added a mandatory education course and journal requirement that apply to renewals. Step-by-step checklist plus 5 FAQs.",
    date: "2026-04-09",
    readTime: "7 min read",
    category: "Texas Notary",
    tags: ["SB693", "Texas Notary Bond", "Renewal", "2026 Requirements"],
    featured: false,
  },
  {
    slug: "texas-notary-bond-sb693-2026-requirements",
    title: "Texas Notary Bond Requirements 2026: What SB693 Changes for New and Renewing Notaries",
    description:
      "Senate Bill 693 took effect January 1, 2026 and changed Texas notary law significantly — mandatory education, new criminal penalties, 10-year record retention. Here's exactly what it means for your notary bond and commission.",
    date: "2026-03-15",
    readTime: "7 min read",
    category: "Texas Notary",
    tags: ["SB693", "Texas Notary Bond", "2026 Requirements", "Secretary of State"],
    featured: false,
  },
  {
    slug: "texas-notary-bond-cost-2026",
    title: "How Much Does a Texas Notary Bond Cost in 2026?",
    description:
      "A Texas notary bond costs $50 for the full 4-year term — no credit check, no annual renewals. Here's exactly what you get, what the SOS fees are, and why E&O insurance is worth adding.",
    date: "2026-03-20",
    readTime: "4 min read",
    category: "Texas Notary",
    tags: ["Texas Notary Bond", "Bond Cost", "E&O Insurance"],
    featured: false,
  },
  {
    slug: "texas-notary-vs-notary-signing-agent",
    title: "Texas Notary vs. Notary Signing Agent: What's the Difference?",
    description:
      "A notary public and a notary signing agent are not the same thing. Here's what each role requires, what bonds and insurance you need, and which path makes more sense for your business.",
    date: "2026-03-25",
    readTime: "6 min read",
    category: "Texas Notary",
    tags: ["Notary Signing Agent", "Texas Notary", "E&O Insurance"],
    featured: false,
  },
  {
    slug: "texas-tdlr-contractor-bond-2026",
    title: "Texas TDLR Contractor Bond 2026: Everything Licensed Tradespeople Need to Know",
    description:
      "Complete guide to Texas TDLR contractor bonds in 2026. Which trades require a bond, how much it costs, how to file, and what changes are coming.",
    date: "2026-04-09",
    readTime: "8 min read",
    category: "Texas Contractors",
    tags: ["TDLR", "Contractor License Bond", "Texas License Bond"],
    featured: false,
  },
  {
    slug: "texas-contractor-license-bond-cost",
    title: "How Much Does a Texas Contractor License Bond Cost? (2026 Guide)",
    description:
      "Find out exactly what a Texas contractor license bond costs in 2026. Rates by trade, credit score, and bond amount — TDLR, city bonds, electrical, HVAC, and plumbing.",
    date: "2026-04-09",
    readTime: "7 min read",
    category: "Texas Contractors",
    tags: ["Contractor License Bond", "Bond Cost", "TDLR"],
    featured: false,
  },
  {
    slug: "texas-electrical-contractor-bond-requirements",
    title: "Texas Electrical Contractor Bond Requirements 2026 | TDLR & City License",
    description:
      "Everything Texas electricians need to know about surety bond requirements in 2026. TDLR bond, city bonds (Dallas, Houston, Austin), costs, and how to file.",
    date: "2026-04-09",
    readTime: "8 min read",
    category: "Texas Contractors",
    tags: ["Electrical Contractor Bond", "TDLR", "Texas License Bond"],
    featured: false,
  },
  {
    slug: "texas-hvac-contractor-bond-requirements",
    title: "Texas HVAC Contractor Bond Requirements 2026 | TDLR & City License",
    description:
      "Everything Texas HVAC contractors need to know about surety bond requirements in 2026. TDLR bond amounts, city bonds, how to apply, and what it costs.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Texas Contractors",
    tags: ["HVAC Bond", "TDLR", "Contractor License Bond", "Texas HVAC"],
    featured: false,
  },
  {
    slug: "texas-plumbing-contractor-bond-requirements",
    title: "Texas Plumbing Contractor Bond Requirements 2026 | TDLR & City License",
    description:
      "Complete guide to Texas plumbing contractor bond requirements in 2026. TDLR bond, city bonds, how much it costs, and how to get bonded fast.",
    date: "2026-04-25",
    readTime: "7 min read",
    category: "Texas Contractors",
    tags: ["Plumbing Bond", "TDLR", "Contractor License Bond", "Texas Plumbing"],
    featured: false,
  },
  {
    slug: "texas-roofing-contractor-bond-requirements",
    title: "Texas Roofing Contractor Bond Requirements 2026 | City & TDLR License",
    description:
      "Texas roofing contractor bond requirements by city in 2026. Bond amounts, who requires them, what they cost, and how to get bonded same-day.",
    date: "2026-04-25",
    readTime: "6 min read",
    category: "Texas Contractors",
    tags: ["Roofing Bond", "Contractor License Bond", "Texas Roofing", "Storm Damage"],
    featured: false,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  useSEO({
    title: "Texas Surety Bond Blog | Quantum Surety",
    description:
      "Texas surety bond guides, notary bond requirements, SB693 law changes, and licensing tips for Texas small business owners. Straight talk from a TDI-licensed agency.",
    canonical: "/blog",
    ogType: "website",
  });

  const featured = BLOG_POSTS.find((p) => p.featured);
  const rest = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-300 text-sm font-medium mb-3 uppercase tracking-widest">
            Quantum Surety Blog
          </p>
          <h1 className="text-4xl font-bold mb-4">Texas Surety Bond Guides</h1>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Straight-talk guides on Texas bond requirements, law changes, and licensing — written by a
            TDI-licensed Texas surety agency, not a content farm.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Featured post */}
        {featured && (
          <div className="mb-12">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
              Featured
            </p>
            <Link href={`/blog/${featured.slug}`}>
              <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer p-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {featured.readTime}
                  </span>
                  <span className="text-gray-400 text-xs">{formatDate(featured.date)}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
                  {featured.title}
                </h2>
                <p className="text-gray-600 mb-5 leading-relaxed">{featured.description}</p>
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-500 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
                <span className="text-indigo-600 font-semibold text-sm flex items-center gap-1">
                  Read guide <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Rest of posts */}
        {rest.length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              All Articles
            </p>
            <div className="space-y-4">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer p-6">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                      <span className="text-gray-400 text-xs">{formatDate(post.date)}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{post.description}</p>
                    <span className="text-indigo-600 font-semibold text-sm flex items-center gap-1">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="mt-16 bg-indigo-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Your Texas Bond?</h2>
          <p className="text-indigo-200 mb-6">
            Instant quotes. No credit check. TDI-licensed Texas agency.
          </p>
          <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX" target="_blank" rel="noreferrer">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Get My Notary Bond <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
