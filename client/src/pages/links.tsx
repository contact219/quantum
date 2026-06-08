import { Phone, ExternalLink, ArrowRight, Shield, FileText, Calculator, Search, Car, Wrench } from "lucide-react";
import { useSEO, useSchema } from "@/hooks/useSEO";

const LINKS = [
  {
    group: "Car Title Problems",
    icon: Car,
    color: "violet",
    items: [
      {
        label: "Free Title Rescue Wizard",
        desc: "2-min eligibility check + document checklist",
        href: "/texas-title-rescue",
        badge: "FREE",
      },
      {
        label: "AI Document Analyzer",
        desc: "Upload your bill of sale — AI extracts everything",
        href: "/title-document-analyzer",
        badge: "FREE",
      },
      {
        label: "Title Bond Calculator",
        desc: "Instant bond amount + premium for your vehicle",
        href: "/title-bond-calculator",
        badge: "FREE",
      },
      {
        label: "Texas Bonded Title Guide",
        desc: "Everything you need to know about bonded titles",
        href: "/bonds/bonded-title-texas",
      },
    ],
  },
  {
    group: "Get Your Bond",
    icon: Shield,
    color: "indigo",
    items: [
      {
        label: "Texas Notary Bond — $50 Instant",
        desc: "$10,000 coverage · 4-year term · instant PDF · SB693 compliant",
        href: "/bonds/notary-bond-texas",
        badge: "$50",
      },
      {
        label: "TDLR Contractor Bond",
        desc: "Electrician, HVAC, plumber, roofer & all TDLR trades",
        href: "/bonds/tdlr-bond-texas",
      },
      {
        label: "GDN Dealer Bond",
        desc: "Required for Texas auto dealer license (TxDMV)",
        href: "/bonds/gdn-bond-texas",
      },
      {
        label: "All Bond Types →",
        desc: "Freight broker, mortgage, process server, auctioneer & more",
        href: "/get-bond",
      },
    ],
  },
  {
    group: "Free Verification Tools",
    icon: Search,
    color: "teal",
    items: [
      {
        label: "Verify a Texas Notary or Contractor",
        desc: "Free public bond status lookup — search by name or license #",
        href: "https://verify.quantumsurety.bond",
        external: true,
        badge: "FREE",
      },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; icon: string; hover: string }> = {
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700",
    icon: "bg-violet-100 text-violet-600",
    hover: "hover:bg-violet-50 hover:border-violet-300",
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
    icon: "bg-indigo-100 text-indigo-600",
    hover: "hover:bg-indigo-50 hover:border-indigo-300",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    badge: "bg-teal-100 text-teal-700",
    icon: "bg-teal-100 text-teal-600",
    hover: "hover:bg-teal-50 hover:border-teal-300",
  },
};

export default function LinksPage() {
  useSEO({
    title: "Quantum Surety — Texas Surety Bonds | Link Directory",
    description:
      "Free Texas title bond tools, instant notary bonds, TDLR contractor bonds, and GDN dealer bonds. TDI-licensed agency #3480229.",
    canonical: "/links",
    noIndex: true,
  });

  return (
    <div className="min-h-screen bg-gray-950 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 pt-12 pb-8 px-4 text-center">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/50">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Quantum Surety</h1>
        <p className="text-indigo-300 text-sm font-medium mb-1">Texas Surety Bonds — AI-Powered</p>
        <p className="text-gray-500 text-xs mb-5">TDI-Licensed Agency #3480229 · All 254 Texas Counties</p>
        <a
          href="tel:2146668718"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <Phone className="w-4 h-4" />
          (214) 666-8718 · Available 24/7
        </a>
      </div>

      {/* Link Groups */}
      <div className="max-w-md mx-auto px-4 space-y-6 mt-6">
        {LINKS.map((group) => {
          const c = colorMap[group.color];
          const GroupIcon = group.icon;
          return (
            <div key={group.group}>
              {/* Group label */}
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${c.icon}`}>
                  <GroupIcon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>
                  {group.group}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {group.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className={`flex items-center gap-3 bg-gray-900 border border-gray-800 ${c.hover} rounded-xl px-4 py-3.5 transition-all group`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-semibold leading-snug">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${c.badge}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                    {item.external ? (
                      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {/* Trust bar */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-1">
          <p className="text-gray-500 text-xs">
            ✓ TDI-Licensed &nbsp;·&nbsp; ✓ No credit check &nbsp;·&nbsp; ✓ Instant certificates
          </p>
          <p className="text-gray-600 text-xs">
            <a href="https://quantumsurety.bond" className="hover:text-gray-400 transition-colors">
              quantumsurety.bond
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
