import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield, Phone, ChevronRight, MapPin } from "lucide-react";
import { TX_CITIES, BOND_TYPES, COLOR_MAP, type TxCity, type BondType } from "@/data/city-bonds";

function slugToName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function parseSlug(rawSlug: string): { city: TxCity | null; bond: BondType | null } {
  const bondPrefixes = Object.keys(BOND_TYPES).sort((a, b) => b.length - a.length);
  for (const prefix of bondPrefixes) {
    if (rawSlug.startsWith(prefix + "-")) {
      const citySlug = rawSlug.slice(prefix.length + 1);
      const city = TX_CITIES.find(c => c.slug === citySlug) || null;
      if (city) return { city, bond: BOND_TYPES[prefix] };
    }
  }
  return { city: null, bond: null };
}

export default function CityBondPage({ slug }: { slug: string }) {
  const { city, bond } = parseSlug(slug);

  if (!city || !bond) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <Link href="/"><span className="text-indigo-600 hover:underline cursor-pointer">Return home</span></Link>
        </div>
      </div>
    );
  }

  const colors = COLOR_MAP[bond.color] || COLOR_MAP.indigo;
  const canonicalPath = `/bonds/${bond.slug}-${city.slug}`;
  const pageTitle = `${bond.name} — ${city.name} | ${bond.cost} | Quantum Surety`;
  const metaDesc = `Get your ${bond.name} in ${city.name}, TX — ${bond.amount} coverage, ${bond.cost}. Instant certificate. ${bond.issuer}-accepted. TDI-licensed agency.`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${bond.name} — ${city.name}`,
    "serviceType": "Surety Bond",
    "url": `https://quantumsurety.bond${canonicalPath}`,
    "provider": { "@type": "LocalBusiness", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
    "areaServed": [{ "@type": "City", "name": city.name }, { "@type": "State", "name": "Texas" }],
    "description": `${bond.name} for ${city.name}-area license holders. ${bond.amount} coverage, ${bond.cost}. Instant PDF certificate. ${bond.issuer}-accepted.`,
    "offers": { "@type": "Offer", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": bond.faqs.map(f => ({
      "@type": "Question",
      "name": typeof f.q === "function" ? f.q(city) : f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a(city) },
    })),
  };

  useSEO({ title: pageTitle, description: metaDesc, canonical: canonicalPath });
  useSchema(serviceSchema, "ld-json-Service");
  useSchema(faqSchema, "ld-json-FAQ");

  const relatedBonds = Object.values(BOND_TYPES)
    .filter(b => b.slug !== bond.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className={`${colors.bg} text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center gap-2 text-sm mb-4 flex-wrap opacity-70`}>
            <Link href="/bonds/surety-bonds-texas"><span className="hover:opacity-100 cursor-pointer">Texas Surety Bonds</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span>{bond.shortName}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{city.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`${colors.badge} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
              <MapPin className="w-3 h-3" /> {city.name}, TX
            </span>
            <span className="text-sm flex items-center gap-1 opacity-70"><Clock className="w-3 h-3" /> Instant certificate</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{bond.name} — {city.name}</h1>
          <p className={`${colors.text} text-lg leading-relaxed mb-8 max-w-2xl`}>
            {city.name}-area license holders: get your required {bond.amount} {bond.name.toLowerCase()} in minutes.
            {" "}{bond.cost} — {bond.costNote}. Instant PDF certificate ready to file with the {bond.issuer}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={bond.applyUrl}>
              <Button size="lg" className={`${colors.btn} font-semibold px-8`}>
                Get My {bond.shortName} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 border-b border-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Bond amount", value: bond.amount, sub: `Required by ${bond.issuer}` },
            { label: "Total cost", value: bond.cost, sub: bond.costNote },
            { label: "Delivery", value: "Instant PDF", sub: "Email within minutes" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className={`text-xs ${colors.btnText} mt-1`}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {bond.shortName} Requirements for {city.name} — {city.county} County
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {bond.description} This requirement applies throughout {city.county} County and the broader {city.region} area,
            including {city.nearby}. Quantum Surety issues bonds through A-rated carriers accepted by the {bond.issuer}.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Bond amount", detail: `${bond.amount} required coverage` },
              { title: "Cost", detail: `${bond.cost} — ${bond.costNote}` },
              { title: "Required by", detail: bond.issuer },
              { title: "Legal authority", detail: bond.legal },
              { title: "Credit check", detail: "None required" },
              { title: "Processing", detail: "Instant — PDF in minutes" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className={`w-5 h-5 ${colors.btnText} mt-0.5 shrink-0`} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How to Get Your {city.name} {bond.shortName} in 3 Steps
          </h2>
          <p className="text-gray-600 text-sm mb-6">100% online — no fax, no office visit, no waiting for mail.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Apply online", body: `Enter your license details and ${city.county} County information. Takes under 2 minutes at quantumsurety.bond.` },
              { step: "2", title: `Pay ${bond.cost}`, body: `Secure checkout. No credit check. No hidden fees. One payment for ${bond.costNote}.` },
              { step: "3", title: "Download instantly", body: `Your ${bond.amount} bond certificate PDF arrives by email within minutes — ready to file with the ${bond.issuer}.` },
            ].map(s => (
              <div key={s.step} className={`${colors.bg} bg-opacity-5 border rounded-xl p-5`} style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <div className={`w-8 h-8 ${colors.bg} text-white rounded-full flex items-center justify-center font-bold text-sm mb-3`}>{s.step}</div>
                <p className="font-semibold text-gray-900 mb-2">{s.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions — {city.name} {bond.shortName}
          </h2>
          <div className="space-y-4">
            {bond.faqs.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className={`w-4 h-4 ${colors.btnText} mt-0.5 shrink-0`} />
                    {typeof item.q === "function" ? item.q(city) : item.q}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{item.a(city)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className={`${colors.bg} rounded-2xl p-8 text-white text-center`}>
          <h2 className="text-2xl font-bold mb-2">Get Your {city.name} {bond.shortName} Today</h2>
          <p className={`${colors.text} mb-6 opacity-80`}>{bond.amount} coverage · {bond.cost} · Instant PDF · TDI Licensed #3480229</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={bond.applyUrl}>
              <Button size="lg" className={`${colors.btn} font-semibold px-8`}>
                Get My {bond.shortName} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>

        {/* Related bonds */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Other bonds available in {city.name}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedBonds.map(rb => (
              <Link key={rb.slug} href={`/bonds/${rb.slug}-${city.slug}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="text-gray-900 font-semibold text-sm">{rb.shortName}</p>
                  <p className="text-xs text-gray-500 mt-1">{rb.cost} · {rb.amount}</p>
                  <p className={`${colors.btnText} text-xs mt-2 flex items-center gap-1`}>View page <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
