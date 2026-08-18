import { Switch, Route, useLocation } from "wouter";
import { usePageTracking } from "@/hooks/useTracker";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "@/pages/home";
const Construction = lazy(() => import("@/pages/construction"));
const AIBondFinder = lazy(() => import("@/pages/ai-bond-finder"));
const ChatbotPage = lazy(() => import("@/pages/chatbot"));
const Quote = lazy(() => import("@/pages/quote"));
const Portal = lazy(() => import("@/pages/portal"));
const QuoteDetail = lazy(() => import("@/pages/portal/quote"));
const Application = lazy(() => import("@/pages/application"));
const Admin = lazy(() => import("@/pages/admin"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminSetup = lazy(() => import("@/pages/admin-setup"));
const AdminAnalytics = lazy(() => import("@/pages/admin-analytics"));
const AdminUsers = lazy(() => import("@/pages/admin-users"));
const AdminLeads = lazy(() => import("@/pages/admin-leads"));
const FAQ = lazy(() => import("@/pages/faq"));
const Resources = lazy(() => import("@/pages/resources"));
const About = lazy(() => import("@/pages/about"));
const StateRequirements = lazy(() => import("@/pages/state-requirements"));
const Glossary = lazy(() => import("@/pages/glossary"));
const Renewals = lazy(() => import("@/pages/renewals"));
const ObligeeLookup = lazy(() => import("@/pages/obligee-lookup"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Contact = lazy(() => import("@/pages/contact"));
import NotFound from "@/pages/not-found";

// Texas SEO landing pages
const TexasBondWatch = lazy(() => import("@/pages/texas-bond-watch"));
const TexasContractorBonds = lazy(() => import("@/pages/texas-contractor"));
const BidBondTexas = lazy(() => import("@/pages/bid-bond-texas"));
const ContractSuretyApply = lazy(() => import("@/pages/contract-surety-apply"));
const TexasNotaryExamPractice = lazy(() => import("@/pages/texas-notary-exam-practice"));
const TexasNotaryJournal = lazy(() => import("@/pages/texas-notary-journal"));
const PerformanceBondTexas = lazy(() => import("@/pages/performance-bond-texas"));
const LicenseBondTexas = lazy(() => import("@/pages/license-bond-texas"));
const NotaryBondTexas = lazy(() => import("@/pages/notary-bond-texas"));
const SB693NotaryBondRequirements2026 = lazy(() => import("@/pages/sb-693-notary-bond-requirements-2026"));
// License bond product pages
const TDLRBondTexas = lazy(() => import("@/pages/tdlr-bond-texas"));
const ElectricalContractorBondTexas = lazy(() => import("@/pages/electrical-contractor-bond-texas"));
const HVACBondTexas = lazy(() => import("@/pages/hvac-bond-texas"));
const PlumbingContractorBondTexas = lazy(() => import("@/pages/plumbing-contractor-bond-texas"));
const AutoDealerBondTexas = lazy(() => import("@/pages/auto-dealer-bond-texas"));
const GDNBondTexas = lazy(() => import("@/pages/gdn-bond-texas"));
const GDNBondDallas = lazy(() => import("@/pages/gdn-bond-dallas"));
const GDNBondHouston = lazy(() => import("@/pages/gdn-bond-houston"));
const GDNBondAustin = lazy(() => import("@/pages/gdn-bond-austin"));
const GDNBondSanAntonio = lazy(() => import("@/pages/gdn-bond-san-antonio"));
const NotaryBondRenewalTexas = lazy(() => import("@/pages/notary-bond-renewal-texas"));
const MBEContractorBondTexas = lazy(() => import("@/pages/mbe-contractor-bond-texas"));
const AuctioneerBondTexas = lazy(() => import("@/pages/auctioneer-bond-texas"));
const MortgageBrokerBondTexas = lazy(() => import("@/pages/mortgage-broker-bond-texas"));
const PropertyTaxConsultantBondTexas = lazy(() => import("@/pages/property-tax-consultant-bond-texas"));
const CollectionAgencyBondTexas = lazy(() => import("@/pages/collection-agency-bond-texas"));
const CreditAccessBusinessBondTexas = lazy(() => import("@/pages/credit-access-business-bond-texas"));
const ManufacturedHomeDealerBondTexas = lazy(() => import("@/pages/manufactured-home-dealer-bond-texas"));
const MoneyServicesBondTexas = lazy(() => import("@/pages/money-services-bond-texas"));
const ProcessServerBondTexas = lazy(() => import("@/pages/process-server-bond-texas"));
const NotaryBondDallas = lazy(() => import("@/pages/notary-bond-dallas"));
const NotaryBondHouston = lazy(() => import("@/pages/notary-bond-houston"));
const NotaryBondSanAntonio = lazy(() => import("@/pages/notary-bond-san-antonio"));
const NotaryBondAustin = lazy(() => import("@/pages/notary-bond-austin"));
const NotaryBondFortWorth = lazy(() => import("@/pages/notary-bond-fort-worth"));
const NotaryBondElPaso = lazy(() => import("@/pages/notary-bond-el-paso"));
const NotaryBondArlington = lazy(() => import("@/pages/notary-bond-arlington"));
const NotaryBondPlano = lazy(() => import("@/pages/notary-bond-plano"));
const NotaryBondCorpusChristi = lazy(() => import("@/pages/notary-bond-corpus-christi"));
const NotaryBondLubbock = lazy(() => import("@/pages/notary-bond-lubbock"));
const GDNBondFortWorth = lazy(() => import("@/pages/gdn-bond-fort-worth"));
const GDNBondPlano = lazy(() => import("@/pages/gdn-bond-plano"));
const GDNBondArlington = lazy(() => import("@/pages/gdn-bond-arlington"));
const GDNBondElPaso = lazy(() => import("@/pages/gdn-bond-el-paso"));
// City contractor bond pages
const ContractorBondDallas = lazy(() => import("@/pages/contractor-bond-dallas"));
const ContractorBondHouston = lazy(() => import("@/pages/contractor-bond-houston"));
const ContractorBondAustin = lazy(() => import("@/pages/contractor-bond-austin"));
const ContractorBondSanAntonio = lazy(() => import("@/pages/contractor-bond-san-antonio"));
const ContractorBondFortWorth = lazy(() => import("@/pages/contractor-bond-fort-worth"));
const ContractorBondPlano = lazy(() => import("@/pages/contractor-bond-plano"));
const ContractorBondArlington = lazy(() => import("@/pages/contractor-bond-arlington"));
const ContractorBondMcKinney = lazy(() => import("@/pages/contractor-bond-mckinney"));
const ContractorBondElPaso = lazy(() => import("@/pages/contractor-bond-el-paso"));
const ContractorBondCorpusChristi = lazy(() => import("@/pages/contractor-bond-corpus-christi"));
const ContractorBondLubbock = lazy(() => import("@/pages/contractor-bond-lubbock"));
const ContractorBondFrisco = lazy(() => import("@/pages/contractor-bond-frisco"));
const ContractorBondAmarillo = lazy(() => import("@/pages/contractor-bond-amarillo"));
const ContractorBondWaco = lazy(() => import("@/pages/contractor-bond-waco"));
const ContractorBondDenton = lazy(() => import("@/pages/contractor-bond-denton"));
const ContractorBondGarland = lazy(() => import("@/pages/contractor-bond-garland"));
const ContractorBondIrving = lazy(() => import("@/pages/contractor-bond-irving"));
const ContractorBondGrandPrairie = lazy(() => import("@/pages/contractor-bond-grand-prairie"));
// Trade-specific bond pages
const HomeInspectorBondTexas = lazy(() => import("@/pages/home-inspector-bond-texas"));
const LocksmithBondTexas = lazy(() => import("@/pages/locksmith-bond-texas"));
const PestControlBondTexas = lazy(() => import("@/pages/pest-control-bond-texas"));
const PaymentBondTexas = lazy(() => import("@/pages/payment-bond-texas"));
const GeneralContractorBondTexas = lazy(() => import("@/pages/general-contractor-bond-texas"));
const RoofingContractorBondTexas = lazy(() => import("@/pages/roofing-contractor-bond-texas"));
// Comparison / educational pages
const BidBondVsPerformanceBond = lazy(() => import("@/pages/bid-bond-vs-performance-bond"));
const SuretyBondVsInsurance = lazy(() => import("@/pages/surety-bond-vs-insurance"));
// Notary E&O insurance
const NotaryEOInsurance = lazy(() => import("@/pages/notary-eo-insurance"));
// Blog
const BlogIndex = lazy(() => import("@/pages/blog/index"));
const BlogSB693 = lazy(() => import("@/pages/blog/texas-notary-bond-sb693-2026-requirements"));
const BlogNotaryBondCost = lazy(() => import("@/pages/blog/texas-notary-bond-cost-2026"));
const BlogNotaryVsNSA = lazy(() => import("@/pages/blog/texas-notary-vs-notary-signing-agent"));
const BlogNotaryBondIncome = lazy(() => import("@/pages/blog/texas-notary-bond-income-side-hustle-2026"));
const BlogTexasContractorBondAndPermits = lazy(() => import("@/pages/blog/texas-contractor-bond-and-permits"));
const BlogTDILicense = lazy(() => import("@/pages/blog/TDILicenseAnnouncement"));
const BlogSB693Renewal = lazy(() => import("@/pages/blog/texas-notary-bond-sb693-renewal-2026"));
const BlogTDLRBond2026 = lazy(() => import("@/pages/blog/texas-tdlr-contractor-bond-2026"));
const BlogNotaryData2026 = lazy(() => import("@/pages/blog/texas-notary-expiration-data-2026"));
const BlogBestTexasSuretyBondCompany = lazy(() => import("@/pages/blog/best-texas-surety-bond-company-2026"));
const BlogTexasContractorBondMarketData = lazy(() => import("@/pages/blog/texas-contractor-bond-market-data-2026"));
const BlogContractorBondCrisisJune2026 = lazy(() => import("@/pages/blog/texas-contractor-bond-crisis-june-2026"));
const CompareWesternSurety = lazy(() => import("@/pages/compare-western-surety"));
const CompareMerchantsBonding = lazy(() => import("@/pages/compare-merchants-bonding"));
const CompareTravelers = lazy(() => import("@/pages/compare-travelers"));
const CompareSuretyBonds = lazy(() => import("@/pages/compare-suretybonds"));
const CompareBondExchange = lazy(() => import("@/pages/compare-bondexchange"));
const CompareTool = lazy(() => import("@/pages/compare-tool"));
const NotarySchoolPartner = lazy(() => import("@/pages/notary-school-partner"));
const SB693ComplianceCheck = lazy(() => import("@/pages/sb693-compliance-check"));
const VerifyContractor = lazy(() => import("@/pages/verify-contractor"));
const OversizePermitBond = lazy(() => import("@/pages/oversize-permit-bond"));
const BlogContractorBondCost = lazy(() => import("@/pages/blog/texas-contractor-license-bond-cost"));
const BlogElectricalBondRequirements = lazy(() => import("@/pages/blog/texas-electrical-contractor-bond-requirements"));
const GetBond = lazy(() => import("@/pages/get-bond"));
const BondBadgeSetup = lazy(() => import("@/pages/bond-badge-setup"));
const ApiAccess = lazy(() => import("@/pages/api-access"));
const BondGuard = lazy(() => import("@/pages/bond-guard"));
const BondGuardPro = lazy(() => import("@/pages/bond-guard-pro"));
const PartnerProgram = lazy(() => import("@/pages/partner-program"));
const CityBondPage = lazy(() => import("@/pages/city-bond-page"));
const Renew = lazy(() => import("@/pages/renew"));
const BadgePage = lazy(() => import("@/pages/badge"));
const CountyBondWatch = lazy(() => import("@/pages/county-bond-watch"));
const BondComplianceLeaderboard = lazy(() => import("@/pages/bond-compliance-leaderboard"));
const Press = lazy(() => import("@/pages/press"));
const Newsroom = lazy(() => import("@/pages/newsroom"));
const ContractorDetail = lazy(() => import("@/pages/contractor-detail"));
const ContractorQR = lazy(() => import("@/pages/contractor-qr"));
const BondTicker = lazy(() => import("@/pages/bond-ticker"));
const NotaryDetail = lazy(() => import("@/pages/notary-detail"));
const NotaryQR = lazy(() => import("@/pages/notary-qr"));
const BondComplianceByTrade = lazy(() => import("@/pages/bond-compliance-by-trade"));
const EmbedWidget = lazy(() => import("@/pages/embed-widget"));
const NotarySigningCert = lazy(() => import("@/pages/notary-signing-cert"));
const BlogGDNBondRequirements2026 = lazy(() => import("@/pages/blog/texas-gdn-bond-requirements-2026"));
const BlogGDNBondCost2026 = lazy(() => import("@/pages/blog/texas-gdn-bond-cost-2026"));
const BlogDealerLicenseRenewal = lazy(() => import("@/pages/blog/texas-dealer-license-renewal-gdn-bond"));
const BlogPerformanceBondGuide2026 = lazy(() => import("@/pages/blog/texas-performance-bond-guide-2026"));
const BlogBidBondRequirements2026 = lazy(() => import("@/pages/blog/texas-bid-bond-requirements-2026"));
const BlogContractorBondByCity = lazy(() => import("@/pages/blog/texas-contractor-bond-requirements-by-city"));
const BlogHVACBondRequirements = lazy(() => import("@/pages/blog/texas-hvac-contractor-bond-requirements"));
const BlogPlumbingBondRequirements = lazy(() => import("@/pages/blog/texas-plumbing-contractor-bond-requirements"));
const BlogRoofingBondRequirements = lazy(() => import("@/pages/blog/texas-roofing-contractor-bond-requirements"));
const BlogHowToBecomeTexasNotary = lazy(() => import("@/pages/blog/how-to-become-texas-notary-2026"));
const BlogWhatIsASuretyBond = lazy(() => import("@/pages/blog/what-is-a-surety-bond-texas"));
const BlogHowToGetTexasGDNLicense = lazy(() => import("@/pages/blog/how-to-get-texas-gdn-license"));
const BlogBidVsPerformanceVsPayment = lazy(() => import("@/pages/blog/bid-bond-vs-performance-bond-vs-payment-bond"));
const BlogNotaryBondVsEO = lazy(() => import("@/pages/blog/texas-notary-bond-vs-eo-insurance"));
const BlogGBPGuide = lazy(() => import("@/pages/blog/google-business-profile-texas-surety-bond"));
const BlogLostCarTitleTexas = lazy(() => import("@/pages/blog/how-to-get-lost-car-title-texas"));
const BlogContractorBondComplianceReport2026 = lazy(() => import("@/pages/blog/texas-contractor-bond-compliance-report-2026"));
const BlogAutoDealerBondCompliance2026 = lazy(() => import("@/pages/blog/texas-auto-dealer-bond-compliance-jun2026"));
const BlogBondedTitleGuide2026 = lazy(() => import("@/pages/blog/texas-bonded-title-complete-guide-2026"));
const BlogTitleBondCost = lazy(() => import("@/pages/blog/texas-certificate-of-title-bond-cost"));
const BlogNoTitleTexas = lazy(() => import("@/pages/blog/bought-car-no-title-texas-bonded-title"));
const BlogQSTitleBondTools = lazy(() => import("@/pages/blog/quantum-surety-texas-title-bond-tools-2026"));
const TitleDocumentAnalyzer = lazy(() => import("@/pages/title-document-analyzer"));
const QSScore = lazy(() => import("@/pages/qs-score"));
const QSLeaderboard = lazy(() => import("@/pages/qs-leaderboard"));
const PermitPilotLanding = lazy(() => import("@/pages/permit-pilot-landing"));
const HOAPortal = lazy(() => import("@/pages/hoa-portal"));
// Spanish pages
const EsHome = lazy(() => import("@/pages/es/index"));
const FianzaNotarioTexas = lazy(() => import("@/pages/es/fianza-notario-texas"));
// Additional GDN city pages
const GDNBondCorpusChristi = lazy(() => import("@/pages/gdn-bond-corpus-christi"));
const GDNBondLaredo = lazy(() => import("@/pages/gdn-bond-laredo"));
const GDNBondLubbock = lazy(() => import("@/pages/gdn-bond-lubbock"));
const GDNBondMcAllen = lazy(() => import("@/pages/gdn-bond-mcallen"));
const GDNBondBrownsville = lazy(() => import("@/pages/gdn-bond-brownsville"));
const GDNBondFrisco = lazy(() => import("@/pages/gdn-bond-frisco"));
const GDNBondMcKinney = lazy(() => import("@/pages/gdn-bond-mckinney"));
const GDNBondIrving = lazy(() => import("@/pages/gdn-bond-irving"));
const GDNBondGarland = lazy(() => import("@/pages/gdn-bond-garland"));
const GDNBondGrandPrairie = lazy(() => import("@/pages/gdn-bond-grand-prairie"));
const GDNBondDenton = lazy(() => import("@/pages/gdn-bond-denton"));
const GDNBondAmarillo = lazy(() => import("@/pages/gdn-bond-amarillo"));
// Construction hub + bonded title + L&P hub
const ConstructionBondTexas = lazy(() => import("@/pages/construction-bond-texas"));
const BondedTitleTexas = lazy(() => import("@/pages/bonded-title-texas"));
const LicensePermitBondTexas = lazy(() => import("@/pages/license-permit-bond-texas"));
const TitleBondCalculator = lazy(() => import("@/pages/title-bond-calculator"));
const SuretyBondCalculator = lazy(() => import("@/pages/surety-bond-calculator"));
const TexasBondData = lazy(() => import("@/pages/texas-bond-data"));
const TexasNotaryLookup = lazy(() => import("@/pages/texas-notary-lookup"));
const CountyTitleBondPage = lazy(() => import("@/pages/county-title-bond-page"));
const TitleRescue = lazy(() => import("@/pages/texas-title-rescue"));
// Additional notary city pages
const NotaryBondLaredo = lazy(() => import("@/pages/notary-bond-laredo"));
const NotaryBondMcAllen = lazy(() => import("@/pages/notary-bond-mcallen"));
const NotaryBondBrownsville = lazy(() => import("@/pages/notary-bond-brownsville"));
const NotaryBondBeaumont = lazy(() => import("@/pages/notary-bond-beaumont"));
const NotaryBondRoundRock = lazy(() => import("@/pages/notary-bond-round-rock"));
const NotaryBondLewisville = lazy(() => import("@/pages/notary-bond-lewisville"));
const NotaryBondGarland = lazy(() => import("@/pages/notary-bond-garland"));
const NotaryBondIrving = lazy(() => import("@/pages/notary-bond-irving"));
const NotaryBondMidland = lazy(() => import("@/pages/notary-bond-midland"));
const NotaryBondOdessa = lazy(() => import("@/pages/notary-bond-odessa"));
// Generated city pages
const NotaryBondKilleen = lazy(() => import("@/pages/notary-bond-killeen"));
const ContractorBondKilleen = lazy(() => import("@/pages/contractor-bond-killeen"));
const GDNBondKilleen = lazy(() => import("@/pages/gdn-bond-killeen"));
const NotaryBondPasadena = lazy(() => import("@/pages/notary-bond-pasadena"));
const ContractorBondPasadena = lazy(() => import("@/pages/contractor-bond-pasadena"));
const GDNBondPasadena = lazy(() => import("@/pages/gdn-bond-pasadena"));
const NotaryBondMesquite = lazy(() => import("@/pages/notary-bond-mesquite"));
const ContractorBondMesquite = lazy(() => import("@/pages/contractor-bond-mesquite"));
const GDNBondMesquite = lazy(() => import("@/pages/gdn-bond-mesquite"));
const NotaryBondCarrollton = lazy(() => import("@/pages/notary-bond-carrollton"));
const ContractorBondCarrollton = lazy(() => import("@/pages/contractor-bond-carrollton"));
const GDNBondCarrollton = lazy(() => import("@/pages/gdn-bond-carrollton"));
const NotaryBondPearland = lazy(() => import("@/pages/notary-bond-pearland"));
const ContractorBondPearland = lazy(() => import("@/pages/contractor-bond-pearland"));
const GDNBondPearland = lazy(() => import("@/pages/gdn-bond-pearland"));
const NotaryBondAbilene = lazy(() => import("@/pages/notary-bond-abilene"));
const ContractorBondAbilene = lazy(() => import("@/pages/contractor-bond-abilene"));
const GDNBondAbilene = lazy(() => import("@/pages/gdn-bond-abilene"));
const NotaryBondRichardson = lazy(() => import("@/pages/notary-bond-richardson"));
const ContractorBondRichardson = lazy(() => import("@/pages/contractor-bond-richardson"));
const GDNBondRichardson = lazy(() => import("@/pages/gdn-bond-richardson"));
const NotaryBondLeagueCity = lazy(() => import("@/pages/notary-bond-league-city"));
const ContractorBondLeagueCity = lazy(() => import("@/pages/contractor-bond-league-city"));
const GDNBondLeagueCity = lazy(() => import("@/pages/gdn-bond-league-city"));
const NotaryBondTyler = lazy(() => import("@/pages/notary-bond-tyler"));
const ContractorBondTyler = lazy(() => import("@/pages/contractor-bond-tyler"));
const GDNBondTyler = lazy(() => import("@/pages/gdn-bond-tyler"));
const NotaryBondWichitaFalls = lazy(() => import("@/pages/notary-bond-wichita-falls"));
const ContractorBondWichitaFalls = lazy(() => import("@/pages/contractor-bond-wichita-falls"));
const GDNBondWichitaFalls = lazy(() => import("@/pages/gdn-bond-wichita-falls"));
const NotaryBondSanAngelo = lazy(() => import("@/pages/notary-bond-san-angelo"));
const ContractorBondSanAngelo = lazy(() => import("@/pages/contractor-bond-san-angelo"));
const GDNBondSanAngelo = lazy(() => import("@/pages/gdn-bond-san-angelo"));
const ContractorBondBeaumont = lazy(() => import("@/pages/contractor-bond-beaumont"));
const GDNBondBeaumont = lazy(() => import("@/pages/gdn-bond-beaumont"));
const ContractorBondRoundRock = lazy(() => import("@/pages/contractor-bond-round-rock"));
const GDNBondRoundRock = lazy(() => import("@/pages/gdn-bond-round-rock"));
const ContractorBondLewisville = lazy(() => import("@/pages/contractor-bond-lewisville"));
const GDNBondLewisville = lazy(() => import("@/pages/gdn-bond-lewisville"));
const ContractorBondMidland = lazy(() => import("@/pages/contractor-bond-midland"));
const GDNBondMidland = lazy(() => import("@/pages/gdn-bond-midland"));
const ContractorBondOdessa = lazy(() => import("@/pages/contractor-bond-odessa"));
const GDNBondOdessa = lazy(() => import("@/pages/gdn-bond-odessa"));

const NotaryExpirationCheck = lazy(() => import("@/pages/notary-expiration-check"));
const LinksPage = lazy(() => import("@/pages/links"));
const BondHealthScore = lazy(() => import("@/pages/bond-health-score"));
const ForAgencies = lazy(() => import("@/pages/for-agencies"));

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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent" /></div>}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/construction" component={Construction} />
      <Route path="/ai-bond-finder" component={AIBondFinder} />
      <Route path="/chatbot" component={ChatbotPage} />
      <Route path="/quote" component={Quote} />
      <Route path="/get-bond" component={GetBond} />
      <Route path="/badge-setup" component={BondBadgeSetup} />
      <Route path="/api-access" component={ApiAccess} />
      <Route path="/bond-guard" component={BondGuard} />
      <Route path="/bond-guard-pro" component={BondGuardPro} />
      <Route path="/partner-program" component={PartnerProgram} />
      <Route path="/bonds/bonded-title-harris-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-dallas-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-bexar-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-tarrant-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-travis-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-el-paso-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-collin-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-denton-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-fort-bend-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-nueces-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hidalgo-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-montgomery-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-williamson-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-cameron-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-brazoria-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-bell-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-galveston-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-lubbock-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-webb-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-jefferson-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-mclennan-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-smith-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-brazos-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hays-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-ellis-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-midland-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-ector-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-johnson-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-guadalupe-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-comal-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-parker-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-randall-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-taylor-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-grayson-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-wichita-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-gregg-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-potter-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-kaufman-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-rockwall-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-tom-green-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-bowie-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-victoria-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-angelina-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hunt-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-orange-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-bastrop-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-liberty-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-henderson-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-coryell-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-walker-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-nacogdoches-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-harrison-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-san-patricio-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-starr-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-wise-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-anderson-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hardin-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hood-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-van-zandt-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-cherokee-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-rusk-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-maverick-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-waller-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-medina-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-val-verde-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-atascosa-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-burnet-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-wilson-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-polk-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-kerr-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-wood-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-erath-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-jim-wells-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-caldwell-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-navarro-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-upshur-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-brown-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-chambers-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-cooke-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-matagorda-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hopkins-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-kendall-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-jasper-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hale-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-howard-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-hill-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-washington-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-fannin-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-titus-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-bee-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-kleberg-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-cass-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-austin-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-palo-pinto-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-grimes-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-uvalde-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-shelby-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-aransas-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-milam-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-panola-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-gillespie-county" component={CountyTitleBondPage} />
      <Route path="/bonds/bonded-title-texas" component={BondedTitleTexas} />
      <Route path="/title-document-analyzer" component={TitleDocumentAnalyzer} />
      <Route path="/texas-title-rescue" component={TitleRescue} />
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
      <Route path="/newsroom" component={Newsroom} />
      <Route path="/bond-ticker" component={BondTicker} />
      <Route path="/contractor/:license/qr" component={ContractorQR} />
      <Route path="/contractor/:license" component={ContractorDetail} />
      <Route path="/notary/:id/qr" component={NotaryQR} />
      <Route path="/notary/:id/cert" component={NotarySigningCert} />
      <Route path="/notary/:id" component={NotaryDetail} />
      <Route path="/bond-compliance-by-trade" component={BondComplianceByTrade} />
      <Route path="/embed-widget" component={EmbedWidget} />
      {/* Texas SEO landing pages */}
      <Route path="/bonds/texas-contractor" component={TexasContractorBonds} />
      <Route path="/bonds/bid-bond-texas" component={BidBondTexas} />
      <Route path="/contract-surety" component={ContractSuretyApply} />
      <Route path="/texas-notary-exam-practice" component={TexasNotaryExamPractice} />
      <Route path="/texas-notary-journal" component={TexasNotaryJournal} />
      <Route path="/bonds/performance-bond-texas" component={PerformanceBondTexas} />
      <Route path="/bonds/license-bond-texas" component={LicenseBondTexas} />
      <Route path="/bonds/notary-bond-texas" component={NotaryBondTexas} />
      <Route path="/notary-bonds">
        <ClientRedirect to="/bonds/notary-bond-texas" />
      </Route>
      <Route path="/notary-bond">
        <ClientRedirect to="/bonds/notary-bond-texas" />
      </Route>
      <Route path="/bonds/notary-bond">
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
      <Route path="/title-bond-calculator" component={TitleBondCalculator} />
      <Route path="/surety-bond-calculator" component={SuretyBondCalculator} />
      <Route path="/texas-bond-data" component={TexasBondData} />
      <Route path="/texas-notary-lookup" component={TexasNotaryLookup} />
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
      <Route path="/blog/texas-notary-bond-income-side-hustle-2026" component={BlogNotaryBondIncome} />
      <Route path="/blog/texas-contractor-bond-and-permits" component={BlogTexasContractorBondAndPermits} />
      <Route path="/blog/quantum-surety-tdi-licensed-agency-3480229" component={BlogTDILicense} />
      <Route path="/blog/texas-notary-bond-sb693-renewal-2026" component={BlogSB693Renewal} />
      <Route path="/blog/texas-tdlr-contractor-bond-2026" component={BlogTDLRBond2026} />
      <Route path="/blog/texas-notary-expiration-data-2026" component={BlogNotaryData2026} />
      <Route path="/blog/best-texas-surety-bond-company-2026" component={BlogBestTexasSuretyBondCompany} />
      <Route path="/blog/texas-contractor-bond-market-data-2026" component={BlogTexasContractorBondMarketData} />
      <Route path="/blog/texas-contractor-bond-crisis-june-2026" component={BlogContractorBondCrisisJune2026} />
      <Route path="/compare" component={CompareTool} />
      <Route path="/notary-school-partner" component={NotarySchoolPartner} />
      <Route path="/compare/western-surety-notary-bond" component={CompareWesternSurety} />
      <Route path="/compare/merchants-bonding-notary-bond" component={CompareMerchantsBonding} />
      <Route path="/compare/travelers-notary-bond" component={CompareTravelers} />
      <Route path="/compare-suretybonds" component={CompareSuretyBonds} />
      <Route path="/compare-bondexchange" component={CompareBondExchange} />
      <Route path="/sb693-compliance-check" component={SB693ComplianceCheck} />
      <Route path="/verify-contractor" component={VerifyContractor} />
      <Route path="/bonds/oversize-permit-bond-texas" component={OversizePermitBond} />
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
      <Route path="/blog/texas-contractor-bond-compliance-report-2026" component={BlogContractorBondComplianceReport2026} />
      <Route path="/blog/texas-auto-dealer-bond-compliance-jun2026" component={BlogAutoDealerBondCompliance2026} />
      <Route path="/blog/texas-bonded-title-complete-guide-2026" component={BlogBondedTitleGuide2026} />
      <Route path="/blog/texas-certificate-of-title-bond-cost" component={BlogTitleBondCost} />
      <Route path="/blog/bought-car-no-title-texas-bonded-title" component={BlogNoTitleTexas} />
      <Route path="/blog/quantum-surety-texas-title-bond-tools-2026" component={BlogQSTitleBondTools} />
      <Route path="/blog" component={BlogIndex} />
      <Route path="/qs-score" component={QSScore} />
      <Route path="/qs-leaderboard" component={QSLeaderboard} />
      <Route path="/bond-health-score" component={BondHealthScore} />
      <Route path="/permit-pilot" component={PermitPilotLanding} />
      <Route path="/hoa-portal" component={HOAPortal} />

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
      <Route path="/for-agencies" component={ForAgencies} />
      <Route path="/notary-expiration-check" component={NotaryExpirationCheck} />
      <Route path="/links" component={LinksPage} />
      <Route path="/bonds/texas-vehicle-title-bond" component={BondedTitleTexas} />
      <Route path="/bonds/:slug">{(p: any) => <CityBondPage slug={p.slug || ""} />}</Route>
      <Route component={NotFound} />
    </Switch>
      </Suspense>
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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Layout>
            <Router />
          </Layout>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
