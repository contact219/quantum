import { Link, Route, Switch, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Shield, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react";
import PortalDashboard from "./dashboard";
import PortalProjects from "./projects";
import PortalBonds from "./bonds";
import PortalDocuments from "./documents";
import PortalSettings from "./settings";
import QuoteDetailPage from "./quote";

export default function Portal() {
  const [location] = useLocation();

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
        <aside className="w-64 bg-card border-r flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold" data-testid="text-portal-title">Client Portal</h2>
            <p className="text-sm text-muted-foreground mt-1">ABC Construction LLC</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/portal" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3" data-testid="button-logout">
                <LogOut className="w-5 h-5" />
                Exit Portal
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Switch>
              <Route path="/portal" component={PortalDashboard} />
              <Route path="/portal/quote/:id" component={QuoteDetailPage} />
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
