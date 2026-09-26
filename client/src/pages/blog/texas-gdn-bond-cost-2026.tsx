import { Link } from "wouter";
import { BlogAuthor } from "@/components/BlogAuthor";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Phone, ChevronRight } from "lucide-react";

const GDN_LINK = "/get-bond?type=dealer";

export default function BlogGDNBondCost2026() {
  useSEO({
    title: "How Much Does a Texas GDN Bond Cost in 2026? | Quantum Surety",
    description:
      "GDN dealer bonds through Quantum Surety start at $250 for the full 2-year term, which is RLI's minimum premium. RLI prices each bond, and your exact premium is confirmed before you pay.",
    canonical: "/blog/texas-gdn-bond-cost-2026",
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
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 3 min read</span>
            <span className="text-indigo-300 text-sm">Updated September 26, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            How Much Does a Texas GDN Bond Cost in 2026?
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Short answer: <strong>from $250 for the full 2-year term</strong>. Below is what dealers have actually
            been quoted through us, what sets the price, and what to do if you're declined.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="space-y-12">

          {/* Pricing facts: RLI book (bk_bonds, dealer_gdn, $50,000) as of 2026-09-26 — 63 applications,
              10 priced (9 at $250, 1 at $375, all 2-year term), 10 declined, 3 issued. TxDMV: $50,000 bond
              since 2021-09-01, 2-year term. The previous credit-tier table was not based on any data
              (it even said 0.5% of $50,000 was $100); do not restore it. */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GDN bond cost at a glance</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              TxDMV requires a <strong>$50,000</strong> bond for a GDN dealer license, on a 2-year term. You don't pay
              $50,000. You pay a premium, once, for the whole term. Our dealer bonds are written by RLI, and RLI's minimum
              premium is <strong>$250 for the 2-year term</strong>, about $125 a year.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">What RLI actually quoted Texas dealers through us — $50,000 bond, 2-year term</p>
              </div>
              {[
                { label: "Quoted $250", value: "9 dealers" },
                { label: "Quoted $375", value: "1 dealer" },
                { label: "Declined", value: "10 dealers" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0">
                  <p className="font-semibold text-gray-900 text-sm">{row.label}</p>
                  <span className="font-bold text-sm text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              From our own RLI applications, June–September 2026. Many other applications were started but never
              submitted for a price, so they are not counted here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What sets the price</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The surety underwrites each application and sets the premium. We don't publish a credit-score table
              because we don't have the data to back one. What we can tell you is what happened: nearly every dealer
              RLI priced came in at the $250 minimum, and one was quoted $375.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The bond amount is the same $50,000 for every GDN license type that needs a bond. TxDMV exempts
              franchised dealers and the trailer/semitrailer and non-motorized travel trailer license types.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Can I get a GDN bond with bad credit?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Not always. RLI declined 10 of the dealer applications we submitted in the same period it priced 10, so a
              decline is a real possibility. A decline from one surety isn't final: other sureties apply different
              standards.
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
              <p className="text-sm text-teal-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Declined?</strong> Call us at (214) 666-8718 and we'll tell you honestly whether we can
                place the bond elsewhere.</span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What your premium covers</h2>
            <div className="space-y-3">
              {[
                "The $50,000 bond TxDMV requires, for the full 2-year term",
                "A PDF bond certificate by email to file with TxDMV",
                "Support from a TDI-licensed Texas agency (#3480229)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* CTA */}
        <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas GDN Bond from $250 for the 2-year term</h2>
          <p className="text-indigo-200 mb-6">$50,000 bond · 2-year term · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={GDN_LINK}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My GDN Bond <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: "/blog/texas-gdn-bond-requirements-2026", title: "Texas GDN Bond Requirements 2026: What Every Dealer Needs to Know", tag: "Requirements Guide" },
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
    <BlogAuthor />
    </div>
  );
}
