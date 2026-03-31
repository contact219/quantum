import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { quoteFormSchema, type QuoteFormData } from "@shared/schema";
import { CheckCircle, ArrowRight, ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO_PAGES, useSEO } from "@/hooks/useSEO";

const BOND_TYPES = [
  { value: "bid", label: "Bid Bond" },
  { value: "performance", label: "Performance Bond" },
  { value: "payment", label: "Payment Bond" },
  { value: "maintenance", label: "Maintenance/Warranty Bond" },
  { value: "supply", label: "Supply Bond" },
  { value: "license", label: "Contractor License Bond" },
  { value: "auto_dealer", label: "Auto Dealer Bond" },
  { value: "notary", label: "Notary Bond" },
  { value: "probate", label: "Probate/Court Bond" },
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function Quote() {
  useSEO(SEO_PAGES.quote);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [quoteResult, setQuoteResult] = useState<any>(null);
  const { toast } = useToast();

  const quoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json() as Promise<{ quote: any; suggestedPremiumRange: string; riskNotes: string; nextSteps: string[] }>;
    },
    onSuccess: (result) => {
      setQuoteResult({
        quoteId: result.quote.quoteNumber || result.quote.id,
        suggestedPremiumRange: result.suggestedPremiumRange,
        riskNotes: result.riskNotes,
        nextSteps: result.nextSteps
      });
      setSubmitted(true);
    },
    onError: (error) => {
      console.error("Quote submission error:", error);
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

  const onSubmit = async (data: QuoteFormData) => {
    quoteMutation.mutate(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = getStepFields(step);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const getStepFields = (currentStep: number): any[] => {
    switch (currentStep) {
      case 1:
        return ["bondType", "projectState"];
      case 2:
        return ["businessName", "contactName", "contactEmail", "businessType"];
      case 3:
        return [];
      default:
        return [];
    }
  };

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
                  {quoteResult.nextSteps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start gap-2" data-testid={`text-next-step-${i}`}>
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/portal" className="flex-1">
                  <Button className="w-full" size="lg" data-testid="button-portal">
                    Go to Portal
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-home">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge className="mb-4" data-testid="badge-quote">
            <FileText className="w-4 h-4 mr-1" />
            Free Quote
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-quote-headline">
            Get Your Bond Quote
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete this quick form to receive your custom quote
          </p>
        </div>

        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= num
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                data-testid={`step-indicator-${num}`}
              >
                {num}
              </div>
              {num < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > num ? "bg-primary" : "bg-secondary"
                  }`}
                />
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
                            <SelectContent className="z-50 w-full min-w-[300px] bg-white border-2 border-gray-300 shadow-2xl">
                              {BOND_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="py-3 px-4 text-base font-medium cursor-pointer hover:bg-primary hover:text-white">
                                  {type.label}
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
                            <SelectContent className="z-50 w-full min-w-[250px] bg-white border-2 border-gray-300 shadow-2xl">
                              {US_STATES.map((state) => (
                                <SelectItem key={state} value={state} className="py-3 px-4 text-base font-medium cursor-pointer hover:bg-primary hover:text-white">
                                  {state}
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
                          <FormLabel>Contract/Bond Value</FormLabel>
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
                              <SelectItem value="good">Good (700-749)</SelectItem>
                              <SelectItem value="fair">Fair (650-699)</SelectItem>
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
                            {BOND_TYPES.find(t => t.value === form.getValues("bondType"))?.label}
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
                {step > 1 ? (
                  <Button type="button" variant="outline" size="lg" onClick={prevStep} data-testid="button-prev">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                ) : (
                  <div />
                )}
                {step < 4 ? (
                  <Button type="button" size="lg" onClick={nextStep} data-testid="button-next">
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    disabled={quoteMutation.isPending}
                    onClick={form.handleSubmit(onSubmit)}
                    data-testid="button-submit"
                  >
                    {quoteMutation.isPending ? "Submitting…" : "Submit Quote"}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>

    </div>
    </>
  );
}
