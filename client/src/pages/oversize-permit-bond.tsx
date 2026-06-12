import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Phone, Truck } from "lucide-react";

export default function OversizePermitBond() {
  useSEO({
    title: "Texas Oversize/Overweight Permit Bond ($15,000) — Same Day | Quantum Surety",
    description:
      "TxDMV requires a $15,000 surety bond for many oversize/overweight hauling permits (Transportation Code Ch. 623). Annual term, same-day online issuance for Texas heavy haulers. TDI #3480229.",
    canonical: "/bonds/oversize-permit-bond-texas",
  });
  useSchema({ "@context": "https://schema.org", "@type": "Service", "name": "Texas Oversize/Overweight Permit Bond", "provider": { "@type": "InsuranceAgency", "name": "Quantum Surety", "url": "https://quantumsurety.bond" } }, "ld-json-Service");

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-indigo-300 text-sm font-semibold uppercase tracking-wide">
            <Truck className="w-4 h-4" /> For Texas Heavy Haulers
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Texas Oversize/Overweight Permit Bond — Issued Same Day
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Hauling superheavy or oversize loads in Texas? TxDMV requires a <strong>$15,000 surety bond</strong> on file
            before issuing many oversize/overweight permits. Get yours online in minutes — so your permits, and your
            loads, keep moving.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/get-bond?type=oversize-permit">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                Get My Permit Bond <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="tel:+12146668718">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-900 text-sm font-medium">
            <strong>TL;DR:</strong> $15,000 bond, required under Texas Transportation Code Chapter 623 for many
            oversize/overweight permit holders. Annual term, from ~$100/year, certificate by email the same day —
            file it with TxDMV and start pulling permits.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Who needs this bond?</h2>
        <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-8 space-y-2">
          <li>Heavy-haul trucking companies pulling TxDMV oversize/overweight permits</li>
          <li>House and manufactured-home movers</li>
          <li>Oilfield, wind-energy, and construction-equipment transporters</li>
          <li>Crane and rigging companies moving superheavy equipment on Texas highways</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-8">
          The bond protects Texas counties for road and culvert damage caused by superheavy or oversize moves —
          TxDMV won't issue the relevant permits until it's on file. One bond covers your company's permits for the
          full annual term, statewide.
        </p>

        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <ol className="list-decimal pl-6 text-gray-700 leading-relaxed mb-8 space-y-2">
          <li>Apply online — company info and a few minutes of your time</li>
          <li>Bond issued same day by an A-rated carrier; certificate arrives by email</li>
          <li>File with TxDMV and pull permits without delay — renew annually</li>
        </ol>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-10">
          <h3 className="text-lg font-bold mb-2">Keep your permits moving</h3>
          <p className="text-gray-700 text-sm mb-4">
            Most oversize permit bonds are approved instantly — no credit check for standard applicants.
          </p>
          <Link href="/get-bond?type=oversize-permit">
            <Button>Start My Bond — Same Day <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-5 mb-10">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">How much does the bond cost?</h3>
            <p className="text-gray-700 leading-relaxed">The bond amount is $15,000, but you pay only an annual premium — typically starting around $100/year depending on the applicant. You never post the full amount.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">How fast can I get it?</h3>
            <p className="text-gray-700 leading-relaxed">Same day in most cases — apply online and the certificate arrives by email, ready to file with TxDMV.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Does one bond cover all my permits?</h3>
            <p className="text-gray-700 leading-relaxed">Yes — the bond is filed once with TxDMV and covers your company's qualifying oversize/overweight permits for the annual term.</p>
          </div>
        </div>

        <div className="space-y-2">
          {["TDI-licensed Texas agency #3480229", "A-rated carrier", "Same-day certificate by email"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {t}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
