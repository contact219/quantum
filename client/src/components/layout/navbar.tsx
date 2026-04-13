import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, LogIn, LogOut, User, ChevronDown, Bot, FileText } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompanySettings {
  phone?: string;
}

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: settings } = useQuery<CompanySettings>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  const phoneNumber = useMemo(() => settings?.phone || "(972) 379-9216", [settings]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/construction", label: "Construction" },
    { href: "/blog", label: "Blog" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact" },
    { href: "/quote", label: "Get Quote" },
    { href: "/portal", label: "Portal" },
  ];

  const toolsLinks = [
    { href: "/chatbot", label: "Quantum Quote Assistant", description: "AI bond finder & instant quotes", icon: Bot },
    { href: "/quote", label: "Quote Wizard", description: "Step-by-step quote form", icon: FileText },
    {
      href: "https://permitpilot.online?utm_source=quantumsurety&utm_medium=nav&utm_campaign=cross-promo",
      label: "Permit Pilot",
      description: "Free AI permit guidance tool",
      icon: null,
      external: true,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <img src="/QS_Logo.png" alt="Quantum Surety" className="w-10 h-10 object-contain" />
                <span className="text-lg font-bold text-foreground hidden sm:inline">
                  Quantum Surety
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <Button variant="ghost" className={location === link.href ? "bg-secondary" : ""}>
                  {link.label}
                </Button>
              </Link>
            ))}

            {/* Tools dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1" data-testid="button-tools-menu">
                  Tools <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">AI & Quote Tools</DropdownMenuLabel>
                {toolsLinks.map((tool) =>
                  tool.external ? (
                    <DropdownMenuItem key={tool.href} asChild>
                      <a href={tool.href} target="_blank" rel="noreferrer" className="flex flex-col items-start gap-0.5 cursor-pointer">
                        <span className="font-medium">{tool.label}
                          <span className="ml-2 rounded-full bg-cyan-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-cyan-700">Free</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{tool.description}</span>
                      </a>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={tool.href} asChild>
                      <Link href={tool.href} className="flex flex-col items-start gap-0.5 cursor-pointer">
                        <span className="font-medium">{tool.label}</span>
                        <span className="text-xs text-muted-foreground">{tool.description}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 border border-emerald-400/30 bg-emerald-400/10 rounded-full px-3 py-1">
              <span>🏛️</span>
              <span>TDI Licensed #3480229</span>
            </div>
            <a href={`tel:${phoneNumber}`} data-testid="link-call">
              <Button className="ml-2">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </a>

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2" data-testid="button-user-menu">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.email || "User"} />
                          <AvatarFallback>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" data-testid="menu-user">
                      <DropdownMenuLabel>
                        {user?.firstName} {user?.lastName}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/portal" data-testid="link-portal-menu">
                          <User className="w-4 h-4 mr-2" />
                          Portal
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href="/api/logout" data-testid="link-logout">
                          <LogOut className="w-4 h-4 mr-2" />
                          Log Out
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <a href="/api/login" data-testid="link-login">
                    <Button variant="outline" className="ml-2">
                      <LogIn className="w-4 h-4 mr-2" />
                      Log In
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${location === link.href ? "bg-secondary" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}

            <div className="border-t pt-2">
              <p className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Tools</p>
              {toolsLinks.map((tool) =>
                tool.external ? (
                  <a key={tool.href} href={tool.href} target="_blank" rel="noreferrer" className="block" data-testid="mobile-link-permit-tool">
                    <Button variant="ghost" className="w-full justify-start text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                      {tool.label}
                      <span className="ml-2 rounded-full bg-cyan-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-cyan-700">Free</span>
                    </Button>
                  </a>
                ) : (
                  <Link key={tool.href} href={tool.href} data-testid={`mobile-link-${tool.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      {tool.label}
                    </Button>
                  </Link>
                )
              )}
            </div>
            <a href={`tel:${phoneNumber}`} className="block" data-testid="mobile-link-call">
              <Button className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </a>

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <div className="pt-2 border-t">
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        {user?.firstName} {user?.lastName}
                      </div>
                    </div>
                    <a href="/api/logout" className="block" data-testid="mobile-link-logout">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </Button>
                    </a>
                  </>
                ) : (
                  <a href="/api/login" className="block" data-testid="mobile-link-login">
                    <Button variant="outline" className="w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Log In
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
