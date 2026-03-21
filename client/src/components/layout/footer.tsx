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
    const phone = settings?.phone || "1-800-QUANTUM";
    const email = settings?.email || "support@quantumsurety.com";
    
    return [
      { href: `tel:${phone}`, label: phone },
      { href: `mailto:${email}`, label: email },
    ];
  }, [settings]);

  const linkGroups = [
    {
      title: "Learn",
      links: [
        { href: "/faq", label: "FAQ" },
        { href: "/resources", label: "Resources" },
        { href: "/glossary", label: "Glossary" },
      ],
    },
    {
      title: "Bonds",
      links: [
        { href: "/construction", label: "Construction" },
        { href: "/ai-bond-finder", label: "AI Bond Finder" },
        { href: "/quote", label: "Get Quote" },
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">QS</span>
              </div>
              <span className="text-lg font-bold text-white">Quantum Surety</span>
            </div>
            <p className="text-sm text-gray-400 text-center" data-testid="text-copyright">
              © {new Date().getFullYear()} Quantum Surety. All rights reserved.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-6xl text-center text-sm" data-testid="text-disclaimer">
            <p>
              Quantum Surety is a licensed insurance producer in the State of Texas and other states where authorized. Bond placement services are provided through appointed insurance carriers and are subject to carrier underwriting and approval.
            </p>
            <p className="mt-2">
              Quantum Surety does not issue surety bonds on its own paper.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
