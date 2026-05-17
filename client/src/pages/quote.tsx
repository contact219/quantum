import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { quoteFormSchema, type QuoteFormData } from "@shared/schema";
import { CheckCircle, ArrowRight, ArrowLeft, FileText, AlertCircle, Search, Zap, ClipboardList } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO_PAGES, useSEO } from "@/hooks/useSEO";
import { track } from "@/hooks/useTracker";

// ── Bond catalog ──────────────────────────────────────────────────────────────

const INSTANT_BONDS = [
  {
    value: "notary",
    label: "Notary Bond",
    price: "$50 flat",
    detail: "$10,000 coverage · Instant PDF · No credit check",
    redirectPath: "/get-bond?type=notary",
  },
  {
    value: "dealer",
    label: "GDN Dealer Bond",
    price: "From $100/yr",
    detail: "$50,000 coverage · Same-day · TxDMV accepted",
    redirectPath: "/get-bond?type=dealer",
  },
];

const QUOTE_BONDS = [
  { value: "bid",        label: "Bid Bond",                    detail: "Required for public project bids" },
  { value: "performance",label: "Performance Bond",            detail: "Guarantees project completion" },
  { value: "payment",    label: "Payment Bond",                detail: "Protects subs & suppliers" },
  { value: "license",    label: "Contractor License Bond",     detail: "TDLR & city license requirement" },
  { value: "maintenance",label: "Maintenance / Warranty Bond", detail: "Post-completion warranty bond" },
  { value: "supply",     label: "Supply Bond",                 detail: "Guarantees materials delivery" },
  { value: "probate",    label: "Probate / Court Bond",        detail: "Executor, guardian & trustee bonds" },
  { value: "auto_dealer",label: "Auto Dealer Bond",            detail: "General motor vehicle dealer bond" },
];

const INSTANT_KEYS = new Set(["notary", "gdn", "dealer"]);

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

// ── Sidebar components ────────────────────────────────────────────────────────

function PermitPilotQuoteSidebar() {
  return (
    <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-6 space-y-4 mt-8">
      <div className="flex items-center gap-2">
        <span className="text-xl">🗺️</span>
        <h3 className="font-bold text-slate-900">Next step after your bond</h3>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">
        Once you have your contractor bond in hand, you&apos;re ready to pull permits. Permit Pilot identifies every
        permit your DFW project needs — building, electrical, mechanical, plumbing — across all 24 jurisdictions in
        seconds.
      </p>
      <ul className="space-y-1 text-sm text-slate-700">
        {["24 DFW jurisdictions covered","AI permit analysis in 30 seconds","PDF compliance checklist download","Free to start"].map((t) => (
          <li key={t} className="flex items-center gap-2"><span className="text-emerald-500">✓</span> {t}</li>
        ))}
      </ul>
      <a
        href="https://permitpilot.online?utm_source=quantumsurety&utm_medium=quote-page&utm_campaign=cross-promo"
        target="_blank"
        rel="noreferrer"
        className="block w-full text-center px-4 py-2.5 rounded-xl border border-cyan-400/30 text-cyan-700 text-sm font-semibold hover:bg-cyan-400/10 transition"
      >
        Analyze My Project on Permit Pilot →
      </a>
      <p className="text-xs text-slate-500 italic">
        Permit Pilot provides AI-generated permit guidance for informational purposes. Always verify requirements
        directly with your local building department before submitting applications.
      </p>
    </div>
  );
}

function QuoteTrustPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 space-y-4 mt-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
        Why contractors trust Quantum Surety
      </p>
      <div className="space-y-3">
        {[
          { icon: "🏛️", title: "TDI Licensed Agency",    desc: "License #3480229 · Texas Dept. of Insurance", color: "text-emerald-300" },
          { icon: "⚡", title: "Same-Day Approval",       desc: "Most applicants approved in minutes",         color: "text-cyan-300"    },
          { icon: "🛡️", title: "A-Rated Carrier",         desc: "Bonds backed by top-rated surety carriers",  color: "text-indigo-300"  },
          { icon: "🔒", title: "Secure & Confidential",   desc: "Your information is never sold or shared",   color: "text-slate-300"   },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${item.color}`}>{item.title}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── URL param helpers ─────────────────────────────────────────────────────────

function getTypeParam(): string {
  return new URLSearchParams(window.location.search).get("type")?.toLowerCase() ?? "";
}

function resolveQuoteBondType(typeParam: string): string {
  const map: Record<string, string> = {
    license: "license", tdlr: "license", electrical: "license", hvac: "license",
    plumbing: "license", roofing: "license", irrigator: "license",
    auto_dealer: "auto_dealer",
    bid: "bid", performance: "performance", payment: "payment",
    maintenance: "maintenance", supply: "supply", probate: "probate",
  };
  return map[typeParam] ?? "";
}

// ── Bond selector (Step 0) ────────────────────────────────────────────────────

interface BondSelectorProps {
  onSelectQuoteBond: (bondType: string) => void;
}

function BondSelector({ onSelectQuoteBond }: BondSelectorProps) {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const q = query.toLowerCase();

  const filteredInstant = useMemo(
    () => INSTANT_BONDS.filter((b) => !q || b.label.toLowerCase().includes(q) || b.detail.toLowerCase().includes(q)),
    [q],
  );
  const filteredQuote = useMemo(
    () => QUOTE_BONDS.filter((b) => !q || b.label.toLowerCase().includes(q) || b.detail.toLowerCase().includes(q)),
    [q],
  );
  const hasResults = filteredInstant.length + filteredQuote.length > 0;

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search bond type…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 placeholder-gray-400 text-base bg-white"
          autoFocus
        />
      </div>

      {!hasResults && (
        <p className="text-center text-gray-500 py-6">No bonds matched "{query}" — try "notary", "bid", or "license".</p>
      )}

      {filteredInstant.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Instant Apply — Bond in minutes</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredInstant.map((bond) => (
              <button
                key={bond.value}
                onClick={() => navigate(bond.redirectPath)}
                className="text-left w-full rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-gray-900 text-base group-hover:text-emerald-800">{bond.label}</span>
                  <span className="text-lg font-extrabold text-emerald-700 ml-2 shrink-0">{bond.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{bond.detail}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                  <Zap className="w-3 h-3" /> Apply instantly <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {filteredQuote.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Get a Quote — reviewed &amp; priced for you</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredQuote.map((bond) => (
              <button
                key={bond.value}
                onClick={() => onSelectQuoteBond(bond.value)}
                className="text-left w-full rounded-2xl border-2 border-gray-200 bg-white p-5 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md transition-all group"
              >
                <p className="font-bold text-gray-900 text-base mb-1 group-hover:text-indigo-800">{bond.label}</p>
                <p className="text-xs text-gray-500 mb-3">{bond.detail}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  Get a quote <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Main quote page ───────────────────────────────────────────────────────────

export default function Quote() {
  useSEO(SEO_PAGES.quote);
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quoteResult, setQuoteResult] = useState<any>(null);
  const { toast } = useToast();

  // Handle ?type= URL param on mount
  useEffect(() => {
    const typeParam = getTypeParam();
    if (!typeParam) return;
    if (INSTANT_KEYS.has(typeParam)) {
      navigate(`/get-bond?type=${typeParam}`);
      return;
    }
    const resolved = resolveQuoteBondType(typeParam);
    if (resolved) {
      form.setValue("bondType", resolved);
      setStep(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json() as Promise<{ quote: any; suggestedPremiumRange: string; riskNotes: string; nextSteps: string[] }>;
    },
    onSuccess: (result) => {
      track({ type: "quote_submit", element: "quote_form", value: form.getValues("bondType") });
      setQuoteResult({
        quoteId: result.quote.quoteNumber || result.quote.id,
        suggestedPremiumRange: result.suggestedPremiumRange,
        riskNotes: result.riskNotes,
        nextSteps: result.nextSteps,
      });
      setSubmitted(true);
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "We couldn't submit your quote. Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      bondType: "",
      contractValue: "",
      projectName: "",
      projectState: "",
      businessName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      businessType: "",
      yearsInBusiness: 0,
      annualRevenue: "",
      creditScore: "",
    },
  });

  const handleSelectQuoteBond = (bondType: string) => {
    form.setValue("bondType", bondType);
    setStep(1);
  };

  const getStepFields = (s: number): any[] => {
    switch (s) {
      case 1: return ["bondType", "projectState"];
      case 2: return ["businessName", "contactName", "contactEmail", "businessType"];
      case 3: return [];
      default: return [];
    }
  };

  const nextStep = async () => {
    const valid = await form.trigger(getStepFields(step));
    if (valid) setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => (s === 1 ? 0 : s - 1));

  const onSubmit = async (data: QuoteFormData) => {
    quoteMutation.mutate(data);
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted && quoteResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl mb-2" data-testid="text-success-title">
                Quote Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-lg">
                Quote ID: <span className="font-mono font-bold" data-testid="text-quote-id">{quoteResult.quoteId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Estimated Premium Range</h3>
                <p className="text-2xl font-bold text-primary" data-testid="text-premium-range">
                  {quoteResult.suggestedPremiumRange}
                </p>
                <p className="text-sm text-muted-foreground mt-2" data-testid="text-risk-notes">
                  {quoteResult.riskNotes}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Next Steps</h3>
                <ul className="space-y-2">
                  {quoteResult.nextSteps.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2" data-testid={`text-next-step-${i}`}>
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/portal" className="flex-1">
                  <Button className="w-full" size="lg" data-testid="button-portal">Go to Portal</Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-home">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <PermitPilotQuoteSidebar />
        </div>
      </div>
    );
  }

  // ── Selector screen (step 0) ──────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="mb-4">
              <FileText className="w-4 h-4 mr-1" />
              Surety Bonds
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">What bond do you need?</h1>
            <p className="text-xl text-muted-foreground">
              Instant bonds issue in minutes. All others get a free custom quote.
            </p>
          </div>
          <BondSelector onSelectQuoteBond={handleSelectQuoteBond} />
          <QuoteTrustPanel />
        </div>
      </div>
    );
  }

  // ── Quote form (steps 1–4) ────────────────────────────────────────────────
  const QUOTE_BONDS_MAP = Object.fromEntries(QUOTE_BONDS.map((b) => [b.value, b.label]));
  const selectedLabel = QUOTE_BONDS_MAP[form.getValues("bondType")] ?? form.getValues("bondType");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge className="mb-4">
            <FileText className="w-4 h-4 mr-1" />
            Free Quote
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-2" data-testid="text-quote-headline">
            Get Your Bond Quote
          </h1>
          {selectedLabel && (
            <p className="text-lg text-indigo-700 font-semibold">{selectedLabel}</p>
          )}
          <p className="text-muted-foreground mt-1">Complete this quick form to receive your custom quote</p>
        </div>

        {/* Progress bar — steps 1-4 */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= num ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
                data-testid={`step-indicator-${num}`}
              >
                {num}
              </div>
              {num < 4 && (
                <div className={`flex-1 h-1 mx-2 ${step > num ? "bg-primary" : "bg-secondary"}`} />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle data-testid="text-step-title">
                  {step === 1 && "Step 1: Bond Context"}
                  {step === 2 && "Step 2: Business Information"}
                  {step === 3 && "Step 3: Financial Details"}
                  {step === 4 && "Step 4: Review & Submit"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Tell us about the bond you need"}
                  {step === 2 && "Provide your business details"}
                  {step === 3 && "Share some financial information"}
                  {step === 4 && "Review your information and submit"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="bondType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bond Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-bond-type" className="h-11 text-base bg-white border-2 border-gray-300 hover:border-primary focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="Select bond type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-50 bg-white border-2 border-gray-300 shadow-2xl">
                              {QUOTE_BONDS.map((b) => (
                                <SelectItem key={b.value} value={b.value} className="py-3 px-4 text-base font-medium cursor-pointer hover:bg-primary hover:text-white">
                                  {b.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="projectState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project State *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-state" className="h-11 text-base bg-white border-2 border-gray-300 hover:border-primary focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-50 bg-white border-2 border-gray-300 shadow-2xl">
                              {US_STATES.map((s) => (
                                <SelectItem key={s} value={s} className="py-3 px-4 text-base font-medium cursor-pointer hover:bg-primary hover:text-white">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contractValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract / Bond Value</FormLabel>
                          <FormControl>
                            <Input placeholder="$100,000" {...field} data-testid="input-contract-value" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Municipal Building Renovation" {...field} data-testid="input-project-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Construction LLC" {...field} data-testid="input-business-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} data-testid="input-contact-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@abcconstruction.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-business-type">
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="llc">LLC</SelectItem>
                              <SelectItem value="corporation">Corporation</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="yearsInBusiness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years in Business</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-years-business"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="annualRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Revenue</FormLabel>
                          <FormControl>
                            <Input placeholder="$2,500,000" {...field} data-testid="input-revenue" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Score Range</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-credit-score">
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent (750+)</SelectItem>
                              <SelectItem value="good">Good (700–749)</SelectItem>
                              <SelectItem value="fair">Fair (650–699)</SelectItem>
                              <SelectItem value="poor">Poor (Below 650)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    {quoteMutation.isError && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3" data-testid="error-quote-submission">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-destructive">Submission Failed</p>
                          <p className="text-sm text-muted-foreground">Please try again or contact support if the problem persists.</p>
                        </div>
                      </div>
                    )}
                    <div className="p-6 bg-card rounded-lg border space-y-4">
                      <h3 className="font-semibold text-lg">Review Your Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Bond Type</p>
                          <p className="font-medium" data-testid="text-review-bond-type">
                            {QUOTE_BONDS_MAP[form.getValues("bondType")] ?? form.getValues("bondType")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">State</p>
                          <p className="font-medium" data-testid="text-review-state">{form.getValues("projectState")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Business Name</p>
                          <p className="font-medium" data-testid="text-review-business">{form.getValues("businessName")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contact Email</p>
                          <p className="font-medium" data-testid="text-review-email">{form.getValues("contactEmail")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

            <div className="sticky bottom-4 z-40 mt-6 rounded-xl border bg-white/95 p-3 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <Button type="button" variant="outline" size="lg" onClick={prevStep} data-testid="button-prev">
                  <ArrowLeft className="w-4 h-4 mr-2" /> {step === 1 ? "Back" : "Previous"}
                </Button>
                {step < 4 ? (
                  <Button type="button" size="lg" onClick={nextStep} data-testid="button-next" style={{ backgroundColor: "#4338ca", color: "#ffffff", fontWeight: 600 }}>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    disabled={quoteMutation.isPending}
                    onClick={form.handleSubmit(onSubmit)}
                    data-testid="button-submit"
                    style={{ backgroundColor: "#4338ca", color: "#ffffff", fontWeight: 600 }}
                  >
                    {quoteMutation.isPending ? "Submitting…" : "Submit Quote"}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
        <QuoteTrustPanel />
        <PermitPilotQuoteSidebar />
      </div>
    </div>
  );
}
