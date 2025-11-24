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
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <div className="border-t border-gray-800 pt-8">
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

          <p className="text-xs text-gray-500 mt-6 text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            Quantum Surety is a licensed surety bond agency. All quotes are subject to
            underwriting review and carrier approval. Premium rates and bond availability may
            vary based on applicant qualifications, project details, and market conditions.
            Bond approval is not guaranteed and is determined on a case-by-case basis.
          </p>
        </div>
      </div>
    </footer>
  );
}
