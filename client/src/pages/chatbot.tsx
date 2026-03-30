import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mail, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { Link } from "wouter";

type QuoteResponse = {
  premium: number;
  currency: string;
  quote_text: string;
  eligibility: string;
  cta_url: string;
  mascot_action: "smile" | "surprised" | "thoughtful";
  bond_category: string;
};

const BOND_TYPES: Record<string, { value: string; label: string }[]> = {
  notary: [
    { value: "SB693", label: "SB-693 Notary Bond" },
    { value: "general", label: "General Notary Bond" },
  ],
  construction: [
    { value: "performance", label: "Performance Bond" },
    { value: "payment", label: "Payment Bond" },
    { value: "bid", label: "Bid Bond" },
  ],
  lp: [
    { value: "labor", label: "Labor Bond" },
    { value: "payment", label: "Payment Bond" },
  ],
};

function QuantumQuoteAssistant({
  action,
  isThinking,
  hasResult,
}: {
  action: "smile" | "surprised" | "thoughtful";
  isThinking: boolean;
  hasResult: boolean;
}) {
  const eyeY = action === "surprised" ? 42 : 48;
  const mouth =
    action === "smile"
      ? "M82 116 Q100 132 118 116"
      : action === "surprised"
      ? "M100 113 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0"
      : "M78 120 Q100 110 122 120";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={[
          "relative h-36 w-36 rounded-2xl bg-white border-2 p-2 transition-all duration-500",
          isThinking
            ? "border-indigo-400 shadow-lg shadow-indigo-200 animate-pulse scale-105"
            : hasResult
            ? "border-teal-400 shadow-lg shadow-teal-200 scale-110"
            : "border-slate-200 shadow-md",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 200 200"
          className={[
            "h-full w-full transition-transform duration-300",
            isThinking ? "animate-bounce" : "",
          ].join(" ")}
        >
          <rect x="25" y="20" width="150" height="160" rx="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" />
          <path d="M145 20 L175 50 L145 50 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
          <circle
            cx="75"
            cy={eyeY}
            r="7"
            fill={hasResult ? "#0D9488" : "#0F172A"}
            className={isThinking ? "animate-ping" : ""}
          />
          <circle
            cx="125"
            cy={eyeY}
            r="7"
            fill={hasResult ? "#0D9488" : "#0F172A"}
            className={isThinking ? "animate-ping" : ""}
          />
          {action === "surprised" ? (
            <circle cx="100" cy="114" r="10" fill="none" stroke="#0F172A" strokeWidth="5" />
          ) : (
            <path d={mouth} fill="none" stroke={hasResult ? "#0D9488" : "#0F172A"} strokeWidth="5" strokeLinecap="round" />
          )}
          <path d="M45 150 C70 138, 130 138, 156 150" fill="none" stroke="#94A3B8" strokeWidth="3" strokeDasharray="4 4" />
        </svg>

        {isThinking && (
          <div className="absolute -top-3 -right-3 rounded-full bg-indigo-600 text-white px-2 py-0.5 text-xs font-bold animate-bounce">
            Thinking…
          </div>
        )}
        {hasResult && !isThinking && (
          <div className="absolute -top-3 -right-3 rounded-full bg-teal-500 text-white px-2 py-0.5 text-xs font-bold">
            Done!
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 font-medium">
        {isThinking ? "Calculating your quote…" : hasResult ? "Here's your estimate" : "Fill the form & ask me!"}
      </p>
    </div>
  );
}

export default function ChatbotPage() {
  const [bondCategory, setBondCategory] = useState<"notary" | "construction" | "lp">("notary");
  const [bondType, setBondType] = useState("SB693");
  const [bondAmount, setBondAmount] = useState("10000");
  const [businessDetails, setBusinessDetails] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<QuoteResponse | null>(null);

  useSEO({
    title: `Instant ${bondCategory === "lp" ? "Labor & Payment" : bondCategory} Quote – AI Powered | Quantum Surety`,
    description:
      "Get an AI-driven quote for Notary, Construction, and Labor & Payment bonds with Quantum Quote Assistant. Fast estimates, eligibility guidance, and a custom quote CTA.",
    canonical: "/chatbot",
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How quickly can I get a Notary Bond quote?",
          acceptedAnswer: { "@type": "Answer", text: "Under 2 seconds with Quantum Quote Assistant's AI engine." },
        },
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "quantum-quote-faq-schema";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.getElementById("quantum-quote-faq-schema")?.remove(); };
  }, []);

  const currentTypes = useMemo(() => BOND_TYPES[bondCategory], [bondCategory]);

  const quoteMutation = useMutation({
    mutationFn: async () => {
      const resp = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bond_category: bondCategory,
          bond_type: bondType,
          bond_amount: parseFloat(bondAmount),
          business_details: businessDetails,
          email,
        }),
      });
      if (!resp.ok) throw new Error("Quote request failed.");
      return (await resp.json()) as QuoteResponse;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const mascotAction = quoteMutation.isPending ? "thoughtful" : result?.mascot_action || "smile";
  const hasResult = !!result && !quoteMutation.isPending;

  function handleReset() {
    setResult(null);
    quoteMutation.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <Badge className="mb-3 bg-indigo-100 text-indigo-700 border-indigo-200">
            <Sparkles className="h-3 w-3 mr-1" /> AI Quote Assistant
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Quantum Quote Assistant</h1>
          <p className="mt-2 text-slate-500">Notary, Construction, and Labor & Payment quotes in seconds.</p>
        </div>

        {/* Mascot — always visible at top */}
        <div className="flex justify-center mb-6">
          <QuantumQuoteAssistant action={mascotAction} isThinking={quoteMutation.isPending} hasResult={hasResult} />
        </div>

        {/* Result speech bubble */}
        {hasResult && result && (
          <div className="relative mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* speech bubble pointer */}
            <div className="mx-auto w-4 h-4 bg-teal-50 border-l border-t border-teal-200 rotate-45 -mb-2 relative z-10" style={{ marginLeft: "calc(50% - 8px)" }} />
            <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-5 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 text-lg">
                    Estimated premium: <span className="text-teal-700">${result.premium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </p>
                  <p className="text-slate-700 text-sm mt-1">{result.quote_text}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 bg-white rounded-lg px-3 py-2 border border-teal-100">
                {result.eligibility}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/quote">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold" data-testid="btn-get-official-quote">
                    Get official quote <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleReset} data-testid="btn-ask-again">
                  <RefreshCw className="w-4 h-4 mr-1" /> Ask again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {quoteMutation.isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Quantum Quote Assistant couldn't connect right now. Please try again or{" "}
            <Link href="/quote"><span className="underline cursor-pointer">get a manual quote</span></Link>.
          </div>
        )}

        {/* Form card */}
        {!hasResult && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bond-category">Bond Category</Label>
                <Select
                  value={bondCategory}
                  onValueChange={(v: "notary" | "construction" | "lp") => {
                    setBondCategory(v);
                    setBondType(BOND_TYPES[v][0].value);
                  }}
                >
                  <SelectTrigger id="bond-category" data-testid="select-bond-category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notary">Notary</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="lp">Labor & Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bond-type">Bond Type</Label>
                <Select value={bondType} onValueChange={setBondType}>
                  <SelectTrigger id="bond-type" data-testid="select-bond-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currentTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bond-amount">Bond Amount ($)</Label>
                <Input
                  id="bond-amount"
                  type="number"
                  min={1000}
                  value={bondAmount}
                  onChange={(e) => setBondAmount(e.target.value)}
                  data-testid="input-bond-amount"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email (optional)</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="business-details">Business Details <span className="text-slate-400 font-normal">(optional)</span></Label>
              <Textarea
                id="business-details"
                rows={3}
                placeholder="Years in business, project type, public/private obligee, credit notes…"
                value={businessDetails}
                onChange={(e) => setBusinessDetails(e.target.value)}
                data-testid="input-business-details"
              />
            </div>

            {/* Submit — large, full-width, always at the bottom of the form */}
            <Button
              size="lg"
              className="w-full text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => quoteMutation.mutate()}
              disabled={quoteMutation.isPending || Number(bondAmount) <= 0}
              data-testid="btn-get-quote"
            >
              {quoteMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Calculating…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Get My Quote
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-slate-400">
              Instant estimate · No login required · No credit check
            </p>
          </div>
        )}

        {/* Bottom links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <Link href="/quote"><span className="hover:text-indigo-600 cursor-pointer hover:underline">Get a full official quote →</span></Link>
          <Link href="/ai-bond-finder"><span className="hover:text-indigo-600 cursor-pointer hover:underline">AI Bond Finder →</span></Link>
          <Link href="/bonds/notary-bond-texas"><span className="hover:text-indigo-600 cursor-pointer hover:underline">Texas Notary Bond →</span></Link>
        </div>
      </div>
    </div>
  );
}
