import { Link, Route, Switch, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Shield, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import PortalDashboard from "./dashboard";
import PortalProjects from "./projects";
import PortalBonds from "./bonds";
import PortalDocuments from "./documents";
import PortalSettings from "./settings";
import { useSEO } from "@/hooks/useSEO";

export default function Portal() {
  useSEO({
    title: "Client Portal | Quantum Surety",
    description: "Quantum Surety client portal for managing projects, bond documents, and account settings.",
    canonical: "/portal",
    noIndex: true,
  });
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/projects", label: "My Projects", icon: FolderKanban },
    { href: "/portal/bonds", label: "My Bonds", icon: Shield },
    { href: "/portal/documents", label: "Documents", icon: FileText },
    { href: "/portal/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b h-16 flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-portal-menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
          <h2 className="text-lg font-bold" data-testid="text-portal-title-mobile">Client Portal</h2>
        </div>

        {/* Sidebar - collapsible on mobile */}
        <aside className={`${
          sidebarOpen ? "fixed" : "hidden"
        } md:relative md:flex md:flex-col w-64 bg-card border-r z-30 md:z-0 h-full md:h-auto top-16 md:top-0 left-0 right-0 bottom-0 flex flex-col`}>
          <div className="p-6 border-b hidden md:block">
            <h2 className="text-xl font-bold" data-testid="text-portal-title">Client Portal</h2>
            <p className="text-sm text-muted-foreground mt-1">ABC Construction LLC</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/portal" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3" data-testid="button-logout" onClick={() => setSidebarOpen(false)}>
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Exit Portal</span>
                <span className="sm:hidden text-xs">Exit</span>
              </Button>
            </Link>
          </div>
        </aside>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto mt-16 md:mt-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Switch>
              <Route path="/portal" component={PortalDashboard} />
              <Route path="/portal/projects" component={PortalProjects} />
              <Route path="/portal/bonds" component={PortalBonds} />
              <Route path="/portal/documents" component={PortalDocuments} />
              <Route path="/portal/settings" component={PortalSettings} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}
