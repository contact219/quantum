import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ChevronRight, Clock, Phone } from "lucide-react";

export default function BlogTDILicense() {
  useSEO({
    title: "Quantum Surety Receives TDI Agency License #3480229 | Quantum Surety Blog",
    description:
      "Quantum Surety LLC is now fully licensed by the Texas Department of Insurance (License #3480229) as a General Lines Property & Casualty agency.",
    canonical: "/blog/quantum-surety-tdi-licensed-agency-3480229",
    ogType: "article",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Article", "publisher": { "@type": "Organization", "name": "Quantum Surety Bonds", "url": "https://quantumsurety.bond" } }, "ld-json-Article");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/blog">
              <span className="hover:text-white cursor-pointer">Blog</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Company News</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
              Company News
            </span>
            <span className="text-indigo-300 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> 4 min read
            </span>
            <span className="text-indigo-300 text-sm">April 7, 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Quantum Surety Receives Texas Department of Insurance Agency License #3480229
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Quantum Surety LLC is now fully licensed by the Texas Department of Insurance,
            making us one of the few AI-powered surety bond agencies operating under full
            TDI regulatory oversight in Texas.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="space-y-10">

          {/* License details card */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm text-emerald-800 font-semibold mb-4">License Details</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Agency", value: "Quantum Surety LLC" },
                { label: "License Number", value: "#3480229" },
                { label: "License Type", value: "General Lines P&C" },
                { label: "Status", value: "Active" },
                { label: "Issued By", value: "Texas Dept. of Insurance" },
                { label: "Effective", value: "April 2026" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">{item.label}</p>
                  <p className="text-gray-900 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What this means for our clients</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Operating under a TDI General Lines Property & Casualty license means Quantum Surety is
              held to the same regulatory standards as any licensed insurance agency in Texas. Our clients
              can verify our license status directly through the Texas Department of Insurance's public
              lookup system at any time.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              TDI licensure requires adherence to Texas Insurance Code requirements covering how we handle
              client funds, disclose fees, and maintain business records. It also means our agents are
              individually licensed and accountable to the state.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For contractors, notaries, and small business owners purchasing surety bonds in Texas,
              working with a TDI-licensed agency gives you recourse through the state if something ever
              goes wrong — an important protection that unlicensed or out-of-state bond sellers cannot offer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why we pursued TDI licensure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Texas has a large and active surety bond market. Many bonds sold to Texas contractors and
              professionals come from agencies operating without TDI oversight — legally permissible for
              some bond types, but not a standard we wanted to hold ourselves to.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our goal from day one has been to build the most trustworthy AI-powered bond agency in Texas.
              Full TDI licensure is a foundational part of that — not a checkbox, but a commitment to the
              clients and carriers we work with.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <ul className="space-y-3">
                {[
                  "Bonds issued under TDI-regulated agency authority",
                  "Agent licensing and continuing education requirements",
                  "State oversight of client fund handling and recordkeeping",
                  "Verifiable license on TDI public lookup (#3480229)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-indigo-900">
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </article>

        {/* CTA */}
        <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get Your Texas Bond from a TDI-Licensed Agency</h2>
          <p className="text-indigo-200 mb-6">
            Instant quotes · No credit check · Licensed under TDI #3480229
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get Instant Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:9723799216">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (972) 379-9216
              </Button>
            </a>
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: "/blog/texas-notary-bond-sb693-2026-requirements",
                title: "Texas Notary Bond 2026: What SB693 Changes",
                tag: "SB693 Guide",
              },
              {
                href: "/bonds/notary-bond-texas",
                title: "Texas Notary Bond — $50 Instant Online",
                tag: "Product Page",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-indigo-600 mb-2 block">{item.tag}</span>
                  <p className="text-gray-900 font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium flex items-center gap-1">
                    Read more <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
