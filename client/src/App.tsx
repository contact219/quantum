import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "@/pages/home";
import Construction from "@/pages/construction";
import AIBondFinder from "@/pages/ai-bond-finder";
import Quote from "@/pages/quote";
import Portal from "@/pages/portal";
import QuoteDetail from "@/pages/portal/quote";
import Application from "@/pages/application";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import AdminSetup from "@/pages/admin-setup";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminUsers from "@/pages/admin-users";
import FAQ from "@/pages/faq";
import Resources from "@/pages/resources";
import StateRequirements from "@/pages/state-requirements";
import Glossary from "@/pages/glossary";
import Renewals from "@/pages/renewals";
import ObligeeLookup from "@/pages/obligee-lookup";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/not-found";

// Texas SEO landing pages
import TexasContractorBonds from "@/pages/texas-contractor";
import BidBondTexas from "@/pages/bid-bond-texas";
import PerformanceBondTexas from "@/pages/performance-bond-texas";
import LicenseBondTexas from "@/pages/license-bond-texas";
import NotaryBondTexas from "@/pages/notary-bond-texas";
import SB693NotaryBondRequirements2026 from "@/pages/sb-693-notary-bond-requirements-2026";
// Blog
import BlogIndex from "@/pages/blog/index";
import BlogSB693 from "@/pages/blog/texas-notary-bond-sb693-2026-requirements";
import BlogNotaryBondCost from "@/pages/blog/texas-notary-bond-cost-2026";
import BlogNotaryVsNSA from "@/pages/blog/texas-notary-vs-notary-signing-agent";

function ClientRedirect({ to }: { to: string }) {
  const [, navigate] = useLocation();
  useEffect(() => { navigate(to, { replace: true }); }, []);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/construction" component={Construction} />
      <Route path="/ai-bond-finder" component={AIBondFinder} />
      <Route path="/quote" component={Quote} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-setup" component={AdminSetup} />
      <Route path="/portal/application">
        <ProtectedRoute>
          <Application />
        </ProtectedRoute>
      </Route>
      <Route path="/portal/quote/:id">
        <ProtectedRoute>
          <QuoteDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/portal">
        <ProtectedRoute>
          <Portal />
        </ProtectedRoute>
      </Route>
      <Route path="/portal/:rest+">
        <ProtectedRoute>
          <Portal />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute requireAdmin>
          <Admin />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/analytics">
        <ProtectedRoute requireAdmin>
          <AdminAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute requireAdmin>
          <AdminUsers />
        </ProtectedRoute>
      </Route>
      <Route path="/faq" component={FAQ} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/state-requirements" component={StateRequirements} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/renewals" component={Renewals} />
      <Route path="/obligee-lookup" component={ObligeeLookup} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* Texas SEO landing pages */}
      <Route path="/bonds/texas-contractor" component={TexasContractorBonds} />
      <Route path="/bonds/bid-bond-texas" component={BidBondTexas} />
      <Route path="/bonds/performance-bond-texas" component={PerformanceBondTexas} />
      <Route path="/bonds/license-bond-texas" component={LicenseBondTexas} />
      <Route path="/bonds/notary-bond-texas" component={NotaryBondTexas} />

      {/* SB-693 standalone guide page (has PDF download) */}
      <Route path="/sb-693-notary-bond-requirements-2026" component={SB693NotaryBondRequirements2026} />

      {/* Redirects for alternate/legacy spellings of the above */}
      <Route path="/sb693-notary-bond">
        <ClientRedirect to="/sb-693-notary-bond-requirements-2026" />
      </Route>
      <Route path="/notary-bond-sb693">
        <ClientRedirect to="/sb-693-notary-bond-requirements-2026" />
      </Route>

      {/* Blog — specific routes BEFORE the index so wouter doesn't swallow sub-paths */}
      <Route path="/blog/texas-notary-bond-sb693-2026-requirements" component={BlogSB693} />
      <Route path="/blog/texas-notary-bond-cost-2026" component={BlogNotaryBondCost} />
      <Route path="/blog/texas-notary-vs-notary-signing-agent" component={BlogNotaryVsNSA} />
      <Route path="/blog" component={BlogIndex} />

      <Route component={NotFound} />
    </Switch>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const isPortalOrAdmin = window.location.pathname.startsWith("/portal") || window.location.pathname.startsWith("/admin");
  const isAdminAuth = window.location.pathname.startsWith("/admin-login") || window.location.pathname.startsWith("/admin-setup");

  if (isPortalOrAdmin || isAdminAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Layout>
          <Router />
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
