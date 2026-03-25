import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, LogIn, LogOut, User } from "lucide-react";
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
  
  const phoneNumber = useMemo(() => settings?.phone || "1-800-QUANTUM", [settings]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/construction", label: "Construction" },
    { href: "/bonds/bmc-84-freight-broker", label: "Freight Bonds" },
    { href: "/ai-bond-finder", label: "AI Bond Finder" },
    { href: "/quote", label: "Get Quote" },
    { href: "/portal", label: "Portal" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
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
                <Button
                  variant="ghost"
                  className={location === link.href ? "bg-secondary" : ""}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
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
