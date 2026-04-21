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
import ChatbotPage from "@/pages/chatbot";
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
import About from "@/pages/about";
import StateRequirements from "@/pages/state-requirements";
import Glossary from "@/pages/glossary";
import Renewals from "@/pages/renewals";
import ObligeeLookup from "@/pages/obligee-lookup";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

// Texas SEO landing pages
import TexasContractorBonds from "@/pages/texas-contractor";
import BidBondTexas from "@/pages/bid-bond-texas";
import PerformanceBondTexas from "@/pages/performance-bond-texas";
import LicenseBondTexas from "@/pages/license-bond-texas";
import NotaryBondTexas from "@/pages/notary-bond-texas";
import SB693NotaryBondRequirements2026 from "@/pages/sb-693-notary-bond-requirements-2026";
// License bond product pages
import TDLRBondTexas from "@/pages/tdlr-bond-texas";
import ElectricalContractorBondTexas from "@/pages/electrical-contractor-bond-texas";
import HVACBondTexas from "@/pages/hvac-bond-texas";
import PlumbingContractorBondTexas from "@/pages/plumbing-contractor-bond-texas";
import AutoDealerBondTexas from "@/pages/auto-dealer-bond-texas";
// City contractor bond pages
import ContractorBondDallas from "@/pages/contractor-bond-dallas";
import ContractorBondHouston from "@/pages/contractor-bond-houston";
import ContractorBondAustin from "@/pages/contractor-bond-austin";
import ContractorBondSanAntonio from "@/pages/contractor-bond-san-antonio";
import ContractorBondFortWorth from "@/pages/contractor-bond-fort-worth";
import ContractorBondPlano from "@/pages/contractor-bond-plano";
import ContractorBondArlington from "@/pages/contractor-bond-arlington";
import ContractorBondMcKinney from "@/pages/contractor-bond-mckinney";
// Trade-specific bond pages
import HomeInspectorBondTexas from "@/pages/home-inspector-bond-texas";
import LocksmithBondTexas from "@/pages/locksmith-bond-texas";
import PestControlBondTexas from "@/pages/pest-control-bond-texas";
// Comparison / educational pages
import BidBondVsPerformanceBond from "@/pages/bid-bond-vs-performance-bond";
import SuretyBondVsInsurance from "@/pages/surety-bond-vs-insurance";
// Notary E&O insurance
import NotaryEOInsurance from "@/pages/notary-eo-insurance";
// Blog
import BlogIndex from "@/pages/blog/index";
import BlogSB693 from "@/pages/blog/texas-notary-bond-sb693-2026-requirements";
import BlogNotaryBondCost from "@/pages/blog/texas-notary-bond-cost-2026";
import BlogNotaryVsNSA from "@/pages/blog/texas-notary-vs-notary-signing-agent";
import BlogTexasContractorBondAndPermits from "@/pages/blog/texas-contractor-bond-and-permits";
import BlogTDILicense from "@/pages/blog/TDILicenseAnnouncement";
import BlogSB693Renewal from "@/pages/blog/texas-notary-bond-sb693-renewal-2026";
import BlogTDLRBond2026 from "@/pages/blog/texas-tdlr-contractor-bond-2026";
import BlogContractorBondCost from "@/pages/blog/texas-contractor-license-bond-cost";
import BlogElectricalBondRequirements from "@/pages/blog/texas-electrical-contractor-bond-requirements";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function ClientRedirect({ to }: { to: string }) {
  const [, navigate] = useLocation();
  useEffect(() => { navigate(to, { replace: true }); }, []);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/construction" component={Construction} />
      <Route path="/ai-bond-finder" component={AIBondFinder} />
      <Route path="/chatbot" component={ChatbotPage} />
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
      <Route path="/about" component={About} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/state-requirements" component={StateRequirements} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/renewals" component={Renewals} />
      <Route path="/obligee-lookup" component={ObligeeLookup} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />

      {/* Texas SEO landing pages */}
      <Route path="/bonds/texas-contractor" component={TexasContractorBonds} />
      <Route path="/bonds/bid-bond-texas" component={BidBondTexas} />
      <Route path="/bonds/performance-bond-texas" component={PerformanceBondTexas} />
      <Route path="/bonds/license-bond-texas" component={LicenseBondTexas} />
      <Route path="/bonds/notary-bond-texas" component={NotaryBondTexas} />
      <Route path="/notary-bonds">
        <ClientRedirect to="/bonds/notary-bond-texas" />
      </Route>
      <Route path="/notary-bond">
        <ClientRedirect to="/bonds/notary-bond-texas" />
      </Route>

      {/* License bond product pages */}
      <Route path="/bonds/tdlr-bond-texas" component={TDLRBondTexas} />
      <Route path="/bonds/electrical-contractor-bond-texas" component={ElectricalContractorBondTexas} />
      <Route path="/bonds/hvac-bond-texas" component={HVACBondTexas} />
      <Route path="/bonds/plumbing-contractor-bond-texas" component={PlumbingContractorBondTexas} />
      <Route path="/bonds/auto-dealer-bond-texas" component={AutoDealerBondTexas} />

      {/* City contractor bond pages */}
      <Route path="/bonds/contractor-bond-dallas" component={ContractorBondDallas} />
      <Route path="/bonds/contractor-bond-houston" component={ContractorBondHouston} />
      <Route path="/bonds/contractor-bond-austin" component={ContractorBondAustin} />
      <Route path="/bonds/contractor-bond-san-antonio" component={ContractorBondSanAntonio} />
      <Route path="/bonds/contractor-bond-fort-worth" component={ContractorBondFortWorth} />
      <Route path="/bonds/contractor-bond-plano" component={ContractorBondPlano} />
      <Route path="/bonds/contractor-bond-arlington" component={ContractorBondArlington} />
      <Route path="/bonds/contractor-bond-mckinney" component={ContractorBondMcKinney} />

      {/* Trade-specific bond pages */}
      <Route path="/bonds/home-inspector-bond-texas" component={HomeInspectorBondTexas} />
      <Route path="/bonds/locksmith-bond-texas" component={LocksmithBondTexas} />
      <Route path="/bonds/pest-control-bond-texas" component={PestControlBondTexas} />

      {/* Comparison / educational pages */}
      <Route path="/bonds/bid-bond-vs-performance-bond" component={BidBondVsPerformanceBond} />
      <Route path="/bonds/surety-bond-vs-insurance" component={SuretyBondVsInsurance} />

      {/* Notary E&O insurance */}
      <Route path="/bonds/notary-eo-insurance" component={NotaryEOInsurance} />

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
      <Route path="/blog/texas-contractor-bond-and-permits" component={BlogTexasContractorBondAndPermits} />
      <Route path="/blog/quantum-surety-tdi-licensed-agency-3480229" component={BlogTDILicense} />
      <Route path="/blog/texas-notary-bond-sb693-renewal-2026" component={BlogSB693Renewal} />
      <Route path="/blog/texas-tdlr-contractor-bond-2026" component={BlogTDLRBond2026} />
      <Route path="/blog/texas-contractor-license-bond-cost" component={BlogContractorBondCost} />
      <Route path="/blog/texas-electrical-contractor-bond-requirements" component={BlogElectricalBondRequirements} />
      <Route path="/blog" component={BlogIndex} />

      <Route component={NotFound} />
    </Switch>
    </>
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
