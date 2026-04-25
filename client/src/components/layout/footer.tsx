import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface CompanySettings {
  phone?: string;
  email?: string;
}

export function Footer() {
  const { data: settings } = useQuery<CompanySettings>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const contactLinks = useMemo(() => {
    const phone = settings?.phone || "(972) 379-9216";
    const email = settings?.email || "administrator@quantumsurety.bond";
    
    return [
      { href: `tel:${phone}`, label: phone },
      { href: `mailto:${email}`, label: email },
    ];
  }, [settings]);

  const linkGroups = [
    {
      title: "Learn",
      links: [
        { href: "/about", label: "About" },
        { href: "/faq", label: "FAQ" },
        { href: "/resources", label: "Resources" },
        { href: "/glossary", label: "Glossary" },
        { href: "/obligee-lookup", label: "Obligee Lookup" },
        { href: "/renewals", label: "Bond Renewal Reminders" },
      ],
    },
    {
      title: "Bonds",
      links: [
        { href: "/bonds/texas-contractor", label: "Texas Contractor Bonds" },
        { href: "/bonds/bid-bond-texas", label: "Bid Bonds" },
        { href: "/bonds/performance-bond-texas", label: "Performance Bonds" },
        { href: "/bonds/payment-bond-texas", label: "Payment Bonds" },
        { href: "/bonds/license-bond-texas", label: "License Bonds" },
        { href: "/bonds/tdlr-bond-texas", label: "TDLR Bonds" },
        { href: "/bonds/gdn-bond-texas", label: "GDN Auto Dealer Bonds" },
        { href: "/bonds/notary-bond-texas", label: "Notary Bonds" },
        { href: "/blog", label: "Bond Guides & Blog" },
        { href: "/quote", label: "Get a Quote" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ],
    },
    {
      title: "Contact",
      links: contactLinks,
    },
  ];

  return (
    <footer className="bg-slate-900 py-8 text-slate-400">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-white font-semibold mb-4" data-testid={`text-footer-${group.title.toLowerCase()}`}>{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") || link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="hover:text-white transition-colors"
                        data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>
                        <span className="hover:text-white transition-colors cursor-pointer" data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                          {link.label}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white rounded-lg px-3 py-1.5">
                <img src="/QS_Logo.png" alt="Quantum Surety" className="h-8 w-auto object-contain max-w-[180px]" />
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center" data-testid="text-copyright">
              © {new Date().getFullYear()} Quantum Surety. All rights reserved.
            </p>
          </div>

          <div className="border-t border-white/10 pt-4 mt-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="text-emerald-500">🏛️</span>
              <span>
                Quantum Surety LLC is licensed by the Texas Department of Insurance &middot;{" "}
                Agency License <strong className="text-slate-400">#3480229</strong> &middot;
                General Lines Property &amp; Casualty &middot;{" "}
                <a
                  href="https://www.tdi.texas.gov/agent/agentlicensequery.html"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-slate-300 transition"
                >
                  Verify at tdi.texas.gov
                </a>
              </span>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-6xl text-center text-sm" data-testid="text-disclaimer">
            <p className="mb-2 text-slate-300">
              <strong>Quantum Surety LLC</strong> &middot; 1416 Bessie Drive, Wylie, TX 75098 &middot; (972) 379-9216
            </p>
            <p>
              Quantum Surety is a licensed insurance producer in Texas and other states where authorized. Bond placement services are provided through appointed carrier partners and are subject to carrier underwriting and approval. Quantum Surety does not issue surety bonds on its own paper.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
