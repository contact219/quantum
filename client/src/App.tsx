import { Switch, Route, useLocation } from "wouter";
import { usePageTracking } from "@/hooks/useTracker";
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
import AdminLeads from "@/pages/admin-leads";
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
import TexasBondWatch from "@/pages/texas-bond-watch";
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
import GDNBondTexas from "@/pages/gdn-bond-texas";
import GDNBondDallas from "@/pages/gdn-bond-dallas";
import GDNBondHouston from "@/pages/gdn-bond-houston";
import GDNBondAustin from "@/pages/gdn-bond-austin";
import GDNBondSanAntonio from "@/pages/gdn-bond-san-antonio";
import NotaryBondRenewalTexas from "@/pages/notary-bond-renewal-texas";
import MBEContractorBondTexas from "@/pages/mbe-contractor-bond-texas";
import AuctioneerBondTexas from "@/pages/auctioneer-bond-texas";
import MortgageBrokerBondTexas from "@/pages/mortgage-broker-bond-texas";
import PropertyTaxConsultantBondTexas from "@/pages/property-tax-consultant-bond-texas";
import CollectionAgencyBondTexas from "@/pages/collection-agency-bond-texas";
import CreditAccessBusinessBondTexas from "@/pages/credit-access-business-bond-texas";
import ManufacturedHomeDealerBondTexas from "@/pages/manufactured-home-dealer-bond-texas";
import MoneyServicesBondTexas from "@/pages/money-services-bond-texas";
import ProcessServerBondTexas from "@/pages/process-server-bond-texas";
import NotaryBondDallas from "@/pages/notary-bond-dallas";
import NotaryBondHouston from "@/pages/notary-bond-houston";
import NotaryBondSanAntonio from "@/pages/notary-bond-san-antonio";
import NotaryBondAustin from "@/pages/notary-bond-austin";
import NotaryBondFortWorth from "@/pages/notary-bond-fort-worth";
import NotaryBondElPaso from "@/pages/notary-bond-el-paso";
import NotaryBondArlington from "@/pages/notary-bond-arlington";
import NotaryBondPlano from "@/pages/notary-bond-plano";
import NotaryBondCorpusChristi from "@/pages/notary-bond-corpus-christi";
import NotaryBondLubbock from "@/pages/notary-bond-lubbock";
import GDNBondFortWorth from "@/pages/gdn-bond-fort-worth";
import GDNBondPlano from "@/pages/gdn-bond-plano";
import GDNBondArlington from "@/pages/gdn-bond-arlington";
import GDNBondElPaso from "@/pages/gdn-bond-el-paso";
// City contractor bond pages
import ContractorBondDallas from "@/pages/contractor-bond-dallas";
import ContractorBondHouston from "@/pages/contractor-bond-houston";
import ContractorBondAustin from "@/pages/contractor-bond-austin";
import ContractorBondSanAntonio from "@/pages/contractor-bond-san-antonio";
import ContractorBondFortWorth from "@/pages/contractor-bond-fort-worth";
import ContractorBondPlano from "@/pages/contractor-bond-plano";
import ContractorBondArlington from "@/pages/contractor-bond-arlington";
import ContractorBondMcKinney from "@/pages/contractor-bond-mckinney";
import ContractorBondElPaso from "@/pages/contractor-bond-el-paso";
import ContractorBondCorpusChristi from "@/pages/contractor-bond-corpus-christi";
import ContractorBondLubbock from "@/pages/contractor-bond-lubbock";
import ContractorBondFrisco from "@/pages/contractor-bond-frisco";
import ContractorBondAmarillo from "@/pages/contractor-bond-amarillo";
import ContractorBondWaco from "@/pages/contractor-bond-waco";
import ContractorBondDenton from "@/pages/contractor-bond-denton";
import ContractorBondGarland from "@/pages/contractor-bond-garland";
import ContractorBondIrving from "@/pages/contractor-bond-irving";
import ContractorBondGrandPrairie from "@/pages/contractor-bond-grand-prairie";
// Trade-specific bond pages
import HomeInspectorBondTexas from "@/pages/home-inspector-bond-texas";
import LocksmithBondTexas from "@/pages/locksmith-bond-texas";
import PestControlBondTexas from "@/pages/pest-control-bond-texas";
import PaymentBondTexas from "@/pages/payment-bond-texas";
import GeneralContractorBondTexas from "@/pages/general-contractor-bond-texas";
import RoofingContractorBondTexas from "@/pages/roofing-contractor-bond-texas";
import FreightBrokerBondTexas from "@/pages/freight-broker-bond-texas";
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
import GetBond from "@/pages/get-bond";
import Renew from "@/pages/renew";
import BadgePage from "@/pages/badge";
import CountyBondWatch from "@/pages/county-bond-watch";
import BondComplianceLeaderboard from "@/pages/bond-compliance-leaderboard";
import Press from "@/pages/press";
import ContractorDetail from "@/pages/contractor-detail";
import ContractorQR from "@/pages/contractor-qr";
import BondTicker from "@/pages/bond-ticker";
import BlogGDNBondRequirements2026 from "@/pages/blog/texas-gdn-bond-requirements-2026";
import BlogGDNBondCost2026 from "@/pages/blog/texas-gdn-bond-cost-2026";
import BlogDealerLicenseRenewal from "@/pages/blog/texas-dealer-license-renewal-gdn-bond";
import BlogPerformanceBondGuide2026 from "@/pages/blog/texas-performance-bond-guide-2026";
import BlogBidBondRequirements2026 from "@/pages/blog/texas-bid-bond-requirements-2026";
import BlogContractorBondByCity from "@/pages/blog/texas-contractor-bond-requirements-by-city";
import BlogHVACBondRequirements from "@/pages/blog/texas-hvac-contractor-bond-requirements";
import BlogPlumbingBondRequirements from "@/pages/blog/texas-plumbing-contractor-bond-requirements";
import BlogRoofingBondRequirements from "@/pages/blog/texas-roofing-contractor-bond-requirements";
import BlogHowToBecomeTexasNotary from "@/pages/blog/how-to-become-texas-notary-2026";
import BlogWhatIsASuretyBond from "@/pages/blog/what-is-a-surety-bond-texas";
import BlogHowToGetTexasGDNLicense from "@/pages/blog/how-to-get-texas-gdn-license";
import BlogBidVsPerformanceVsPayment from "@/pages/blog/bid-bond-vs-performance-bond-vs-payment-bond";
import BlogNotaryBondVsEO from "@/pages/blog/texas-notary-bond-vs-eo-insurance";
import BlogGBPGuide from "@/pages/blog/google-business-profile-texas-surety-bond";
import BlogLostCarTitleTexas from "@/pages/blog/how-to-get-lost-car-title-texas";
// Spanish pages
import EsHome from "@/pages/es/index";
import FianzaNotarioTexas from "@/pages/es/fianza-notario-texas";
// Additional GDN city pages
import GDNBondCorpusChristi from "@/pages/gdn-bond-corpus-christi";
import GDNBondLaredo from "@/pages/gdn-bond-laredo";
import GDNBondLubbock from "@/pages/gdn-bond-lubbock";
import GDNBondMcAllen from "@/pages/gdn-bond-mcallen";
import GDNBondBrownsville from "@/pages/gdn-bond-brownsville";
import GDNBondFrisco from "@/pages/gdn-bond-frisco";
import GDNBondMcKinney from "@/pages/gdn-bond-mckinney";
import GDNBondIrving from "@/pages/gdn-bond-irving";
import GDNBondGarland from "@/pages/gdn-bond-garland";
import GDNBondGrandPrairie from "@/pages/gdn-bond-grand-prairie";
import GDNBondDenton from "@/pages/gdn-bond-denton";
import GDNBondAmarillo from "@/pages/gdn-bond-amarillo";
// Construction hub + bonded title + L&P hub
import ConstructionBondTexas from "@/pages/construction-bond-texas";
import BondedTitleTexas from "@/pages/bonded-title-texas";
import LicensePermitBondTexas from "@/pages/license-permit-bond-texas";
// Additional notary city pages
import NotaryBondLaredo from "@/pages/notary-bond-laredo";
import NotaryBondMcAllen from "@/pages/notary-bond-mcallen";
import NotaryBondBrownsville from "@/pages/notary-bond-brownsville";
import NotaryBondBeaumont from "@/pages/notary-bond-beaumont";
import NotaryBondRoundRock from "@/pages/notary-bond-round-rock";
import NotaryBondLewisville from "@/pages/notary-bond-lewisville";
import NotaryBondGarland from "@/pages/notary-bond-garland";
import NotaryBondIrving from "@/pages/notary-bond-irving";
import NotaryBondMidland from "@/pages/notary-bond-midland";
import NotaryBondOdessa from "@/pages/notary-bond-odessa";
// Generated city pages
import NotaryBondKilleen from "@/pages/notary-bond-killeen";
import ContractorBondKilleen from "@/pages/contractor-bond-killeen";
import GDNBondKilleen from "@/pages/gdn-bond-killeen";
import NotaryBondPasadena from "@/pages/notary-bond-pasadena";
import ContractorBondPasadena from "@/pages/contractor-bond-pasadena";
import GDNBondPasadena from "@/pages/gdn-bond-pasadena";
import NotaryBondMesquite from "@/pages/notary-bond-mesquite";
import ContractorBondMesquite from "@/pages/contractor-bond-mesquite";
import GDNBondMesquite from "@/pages/gdn-bond-mesquite";
import NotaryBondCarrollton from "@/pages/notary-bond-carrollton";
import ContractorBondCarrollton from "@/pages/contractor-bond-carrollton";
import GDNBondCarrollton from "@/pages/gdn-bond-carrollton";
import NotaryBondPearland from "@/pages/notary-bond-pearland";
import ContractorBondPearland from "@/pages/contractor-bond-pearland";
import GDNBondPearland from "@/pages/gdn-bond-pearland";
import NotaryBondAbilene from "@/pages/notary-bond-abilene";
import ContractorBondAbilene from "@/pages/contractor-bond-abilene";
import GDNBondAbilene from "@/pages/gdn-bond-abilene";
import NotaryBondRichardson from "@/pages/notary-bond-richardson";
import ContractorBondRichardson from "@/pages/contractor-bond-richardson";
import GDNBondRichardson from "@/pages/gdn-bond-richardson";
import NotaryBondLeagueCity from "@/pages/notary-bond-league-city";
import ContractorBondLeagueCity from "@/pages/contractor-bond-league-city";
import GDNBondLeagueCity from "@/pages/gdn-bond-league-city";
import NotaryBondTyler from "@/pages/notary-bond-tyler";
import ContractorBondTyler from "@/pages/contractor-bond-tyler";
import GDNBondTyler from "@/pages/gdn-bond-tyler";
import NotaryBondWichitaFalls from "@/pages/notary-bond-wichita-falls";
import ContractorBondWichitaFalls from "@/pages/contractor-bond-wichita-falls";
import GDNBondWichitaFalls from "@/pages/gdn-bond-wichita-falls";
import NotaryBondSanAngelo from "@/pages/notary-bond-san-angelo";
import ContractorBondSanAngelo from "@/pages/contractor-bond-san-angelo";
import GDNBondSanAngelo from "@/pages/gdn-bond-san-angelo";
import ContractorBondBeaumont from "@/pages/contractor-bond-beaumont";
import GDNBondBeaumont from "@/pages/gdn-bond-beaumont";
import ContractorBondRoundRock from "@/pages/contractor-bond-round-rock";
import GDNBondRoundRock from "@/pages/gdn-bond-round-rock";
import ContractorBondLewisville from "@/pages/contractor-bond-lewisville";
import GDNBondLewisville from "@/pages/gdn-bond-lewisville";
import ContractorBondMidland from "@/pages/contractor-bond-midland";
import GDNBondMidland from "@/pages/gdn-bond-midland";
import ContractorBondOdessa from "@/pages/contractor-bond-odessa";
import GDNBondOdessa from "@/pages/gdn-bond-odessa";

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
  usePageTracking();
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/construction" component={Construction} />
      <Route path="/ai-bond-finder" component={AIBondFinder} />
      <Route path="/chatbot" component={ChatbotPage} />
      <Route path="/quote" component={Quote} />
      <Route path="/get-bond" component={GetBond} />
      <Route path="/renew" component={Renew} />
      <Route path="/badge" component={BadgePage} />
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
      <Route path="/admin/leads">
        <ProtectedRoute requireAdmin>
          <AdminLeads />
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

      {/* Texas Bond Watch — live bond expiration tracker */}
      <Route path="/texas-bond-watch" component={TexasBondWatch} />
      <Route path="/texas-bond-watch/:county" component={CountyBondWatch} />
      <Route path="/bond-compliance-leaderboard" component={BondComplianceLeaderboard} />
      <Route path="/press" component={Press} />
      <Route path="/bond-ticker" component={BondTicker} />
      <Route path="/contractor/:license/qr" component={ContractorQR} />
      <Route path="/contractor/:license" component={ContractorDetail} />
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
      <Route path="/bonds/gdn-bond-texas" component={GDNBondTexas} />
      <Route path="/bonds/gdn-bond-dallas" component={GDNBondDallas} />
      <Route path="/bonds/gdn-bond-houston" component={GDNBondHouston} />
      <Route path="/bonds/gdn-bond-austin" component={GDNBondAustin} />
      <Route path="/bonds/gdn-bond-san-antonio" component={GDNBondSanAntonio} />
      <Route path="/bonds/mbe-contractor-bond-texas" component={MBEContractorBondTexas} />
      <Route path="/bonds/auctioneer-bond-texas" component={AuctioneerBondTexas} />
      <Route path="/bonds/mortgage-broker-bond-texas" component={MortgageBrokerBondTexas} />
      <Route path="/bonds/property-tax-consultant-bond-texas" component={PropertyTaxConsultantBondTexas} />
      <Route path="/bonds/collection-agency-bond-texas" component={CollectionAgencyBondTexas} />
      <Route path="/bonds/credit-access-business-bond-texas" component={CreditAccessBusinessBondTexas} />
      <Route path="/bonds/manufactured-home-dealer-bond-texas" component={ManufacturedHomeDealerBondTexas} />
      <Route path="/bonds/money-services-bond-texas" component={MoneyServicesBondTexas} />
      <Route path="/bonds/process-server-bond-texas" component={ProcessServerBondTexas} />
      {/* Notary bond city pages */}
      <Route path="/bonds/notary-bond-dallas" component={NotaryBondDallas} />
      <Route path="/bonds/notary-bond-houston" component={NotaryBondHouston} />
      <Route path="/bonds/notary-bond-san-antonio" component={NotaryBondSanAntonio} />
      <Route path="/bonds/notary-bond-austin" component={NotaryBondAustin} />
      <Route path="/bonds/notary-bond-fort-worth" component={NotaryBondFortWorth} />
      <Route path="/bonds/notary-bond-el-paso" component={NotaryBondElPaso} />
      <Route path="/bonds/notary-bond-arlington" component={NotaryBondArlington} />
      <Route path="/bonds/notary-bond-plano" component={NotaryBondPlano} />
      <Route path="/bonds/notary-bond-corpus-christi" component={NotaryBondCorpusChristi} />
      <Route path="/bonds/notary-bond-lubbock" component={NotaryBondLubbock} />
      {/* Additional GDN bond city pages */}
      <Route path="/bonds/gdn-bond-fort-worth" component={GDNBondFortWorth} />
      <Route path="/bonds/gdn-bond-plano" component={GDNBondPlano} />
      <Route path="/bonds/gdn-bond-arlington" component={GDNBondArlington} />
      <Route path="/bonds/gdn-bond-el-paso" component={GDNBondElPaso} />
      <Route path="/bonds/notary-bond-renewal-texas" component={NotaryBondRenewalTexas} />

      {/* City contractor bond pages */}
      <Route path="/bonds/contractor-bond-dallas" component={ContractorBondDallas} />
      <Route path="/bonds/contractor-bond-houston" component={ContractorBondHouston} />
      <Route path="/bonds/contractor-bond-austin" component={ContractorBondAustin} />
      <Route path="/bonds/contractor-bond-san-antonio" component={ContractorBondSanAntonio} />
      <Route path="/bonds/contractor-bond-fort-worth" component={ContractorBondFortWorth} />
      <Route path="/bonds/contractor-bond-plano" component={ContractorBondPlano} />
      <Route path="/bonds/contractor-bond-arlington" component={ContractorBondArlington} />
      <Route path="/bonds/contractor-bond-mckinney" component={ContractorBondMcKinney} />
      <Route path="/bonds/contractor-bond-el-paso" component={ContractorBondElPaso} />
      <Route path="/bonds/contractor-bond-corpus-christi" component={ContractorBondCorpusChristi} />
      <Route path="/bonds/contractor-bond-lubbock" component={ContractorBondLubbock} />
      <Route path="/bonds/contractor-bond-frisco" component={ContractorBondFrisco} />
      <Route path="/bonds/contractor-bond-amarillo" component={ContractorBondAmarillo} />
      <Route path="/bonds/contractor-bond-waco" component={ContractorBondWaco} />
      <Route path="/bonds/contractor-bond-denton" component={ContractorBondDenton} />
      <Route path="/bonds/contractor-bond-garland" component={ContractorBondGarland} />
      <Route path="/bonds/contractor-bond-irving" component={ContractorBondIrving} />
      <Route path="/bonds/contractor-bond-grand-prairie" component={ContractorBondGrandPrairie} />

      {/* Trade-specific bond pages */}
      <Route path="/bonds/home-inspector-bond-texas" component={HomeInspectorBondTexas} />
      <Route path="/bonds/locksmith-bond-texas" component={LocksmithBondTexas} />
      <Route path="/bonds/pest-control-bond-texas" component={PestControlBondTexas} />
      <Route path="/bonds/payment-bond-texas" component={PaymentBondTexas} />
      <Route path="/bonds/general-contractor-bond-texas" component={GeneralContractorBondTexas} />
      <Route path="/bonds/roofing-contractor-bond-texas" component={RoofingContractorBondTexas} />
      <Route path="/bonds/freight-broker-bond-texas" component={FreightBrokerBondTexas} />

      {/* Comparison / educational pages */}
      <Route path="/bonds/bid-bond-vs-performance-bond" component={BidBondVsPerformanceBond} />
      <Route path="/bonds/surety-bond-vs-insurance" component={SuretyBondVsInsurance} />

      {/* Additional GDN city pages */}
      <Route path="/bonds/gdn-bond-corpus-christi" component={GDNBondCorpusChristi} />
      <Route path="/bonds/gdn-bond-laredo" component={GDNBondLaredo} />
      <Route path="/bonds/gdn-bond-lubbock" component={GDNBondLubbock} />
      <Route path="/bonds/gdn-bond-mcallen" component={GDNBondMcAllen} />
      <Route path="/bonds/gdn-bond-brownsville" component={GDNBondBrownsville} />
      <Route path="/bonds/gdn-bond-frisco" component={GDNBondFrisco} />
      <Route path="/bonds/gdn-bond-mckinney" component={GDNBondMcKinney} />
      <Route path="/bonds/gdn-bond-irving" component={GDNBondIrving} />
      <Route path="/bonds/gdn-bond-garland" component={GDNBondGarland} />
      <Route path="/bonds/gdn-bond-grand-prairie" component={GDNBondGrandPrairie} />
      <Route path="/bonds/gdn-bond-denton" component={GDNBondDenton} />
      <Route path="/bonds/gdn-bond-amarillo" component={GDNBondAmarillo} />

      {/* Construction hub + bonded title */}
      <Route path="/bonds/construction-bond-texas" component={ConstructionBondTexas} />
      <Route path="/bonds/bonded-title-texas" component={BondedTitleTexas} />
      <Route path="/bonds/license-permit-bond-texas" component={LicensePermitBondTexas} />

      {/* Additional notary city pages */}
      <Route path="/bonds/notary-bond-laredo" component={NotaryBondLaredo} />
      <Route path="/bonds/notary-bond-mcallen" component={NotaryBondMcAllen} />
      <Route path="/bonds/notary-bond-brownsville" component={NotaryBondBrownsville} />
      <Route path="/bonds/notary-bond-beaumont" component={NotaryBondBeaumont} />
      <Route path="/bonds/notary-bond-round-rock" component={NotaryBondRoundRock} />
      <Route path="/bonds/notary-bond-lewisville" component={NotaryBondLewisville} />
      <Route path="/bonds/notary-bond-garland" component={NotaryBondGarland} />
      <Route path="/bonds/notary-bond-irving" component={NotaryBondIrving} />
      <Route path="/bonds/notary-bond-midland" component={NotaryBondMidland} />
      <Route path="/bonds/notary-bond-odessa" component={NotaryBondOdessa} />

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
      <Route path="/blog/texas-gdn-bond-requirements-2026" component={BlogGDNBondRequirements2026} />
      <Route path="/blog/texas-gdn-bond-cost-2026" component={BlogGDNBondCost2026} />
      <Route path="/blog/texas-dealer-license-renewal-gdn-bond" component={BlogDealerLicenseRenewal} />
      <Route path="/blog/texas-performance-bond-guide-2026" component={BlogPerformanceBondGuide2026} />
      <Route path="/blog/texas-bid-bond-requirements-2026" component={BlogBidBondRequirements2026} />
      <Route path="/blog/texas-contractor-bond-requirements-by-city" component={BlogContractorBondByCity} />
      <Route path="/blog/texas-hvac-contractor-bond-requirements" component={BlogHVACBondRequirements} />
      <Route path="/blog/texas-plumbing-contractor-bond-requirements" component={BlogPlumbingBondRequirements} />
      <Route path="/blog/texas-roofing-contractor-bond-requirements" component={BlogRoofingBondRequirements} />
      <Route path="/blog/how-to-become-texas-notary-2026" component={BlogHowToBecomeTexasNotary} />
      <Route path="/blog/what-is-a-surety-bond-texas" component={BlogWhatIsASuretyBond} />
      <Route path="/blog/how-to-get-texas-gdn-license" component={BlogHowToGetTexasGDNLicense} />
      <Route path="/blog/bid-bond-vs-performance-bond-vs-payment-bond" component={BlogBidVsPerformanceVsPayment} />
      <Route path="/blog/texas-notary-bond-vs-eo-insurance" component={BlogNotaryBondVsEO} />
      <Route path="/blog/google-business-profile-texas-surety-bond" component={BlogGBPGuide} />
      <Route path="/blog/how-to-get-lost-car-title-texas" component={BlogLostCarTitleTexas} />
      <Route path="/blog" component={BlogIndex} />

      {/* Spanish pages */}
      <Route path="/es/fianza-notario-texas" component={FianzaNotarioTexas} />
      <Route path="/es" component={EsHome} />

      <Route path="/bonds/notary-bond-killeen" component={NotaryBondKilleen} />
      <Route path="/bonds/contractor-bond-killeen" component={ContractorBondKilleen} />
      <Route path="/bonds/gdn-bond-killeen" component={GDNBondKilleen} />
      <Route path="/bonds/notary-bond-pasadena" component={NotaryBondPasadena} />
      <Route path="/bonds/contractor-bond-pasadena" component={ContractorBondPasadena} />
      <Route path="/bonds/gdn-bond-pasadena" component={GDNBondPasadena} />
      <Route path="/bonds/notary-bond-mesquite" component={NotaryBondMesquite} />
      <Route path="/bonds/contractor-bond-mesquite" component={ContractorBondMesquite} />
      <Route path="/bonds/gdn-bond-mesquite" component={GDNBondMesquite} />
      <Route path="/bonds/notary-bond-carrollton" component={NotaryBondCarrollton} />
      <Route path="/bonds/contractor-bond-carrollton" component={ContractorBondCarrollton} />
      <Route path="/bonds/gdn-bond-carrollton" component={GDNBondCarrollton} />
      <Route path="/bonds/notary-bond-pearland" component={NotaryBondPearland} />
      <Route path="/bonds/contractor-bond-pearland" component={ContractorBondPearland} />
      <Route path="/bonds/gdn-bond-pearland" component={GDNBondPearland} />
      <Route path="/bonds/notary-bond-abilene" component={NotaryBondAbilene} />
      <Route path="/bonds/contractor-bond-abilene" component={ContractorBondAbilene} />
      <Route path="/bonds/gdn-bond-abilene" component={GDNBondAbilene} />
      <Route path="/bonds/notary-bond-richardson" component={NotaryBondRichardson} />
      <Route path="/bonds/contractor-bond-richardson" component={ContractorBondRichardson} />
      <Route path="/bonds/gdn-bond-richardson" component={GDNBondRichardson} />
      <Route path="/bonds/notary-bond-league-city" component={NotaryBondLeagueCity} />
      <Route path="/bonds/contractor-bond-league-city" component={ContractorBondLeagueCity} />
      <Route path="/bonds/gdn-bond-league-city" component={GDNBondLeagueCity} />
      <Route path="/bonds/notary-bond-tyler" component={NotaryBondTyler} />
      <Route path="/bonds/contractor-bond-tyler" component={ContractorBondTyler} />
      <Route path="/bonds/gdn-bond-tyler" component={GDNBondTyler} />
      <Route path="/bonds/notary-bond-wichita-falls" component={NotaryBondWichitaFalls} />
      <Route path="/bonds/contractor-bond-wichita-falls" component={ContractorBondWichitaFalls} />
      <Route path="/bonds/gdn-bond-wichita-falls" component={GDNBondWichitaFalls} />
      <Route path="/bonds/notary-bond-san-angelo" component={NotaryBondSanAngelo} />
      <Route path="/bonds/contractor-bond-san-angelo" component={ContractorBondSanAngelo} />
      <Route path="/bonds/gdn-bond-san-angelo" component={GDNBondSanAngelo} />
      <Route path="/bonds/contractor-bond-beaumont" component={ContractorBondBeaumont} />
      <Route path="/bonds/gdn-bond-beaumont" component={GDNBondBeaumont} />
      <Route path="/bonds/contractor-bond-round-rock" component={ContractorBondRoundRock} />
      <Route path="/bonds/gdn-bond-round-rock" component={GDNBondRoundRock} />
      <Route path="/bonds/contractor-bond-lewisville" component={ContractorBondLewisville} />
      <Route path="/bonds/gdn-bond-lewisville" component={GDNBondLewisville} />
      <Route path="/bonds/contractor-bond-midland" component={ContractorBondMidland} />
      <Route path="/bonds/gdn-bond-midland" component={GDNBondMidland} />
      <Route path="/bonds/contractor-bond-odessa" component={ContractorBondOdessa} />
      <Route path="/bonds/gdn-bond-odessa" component={GDNBondOdessa} />
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
