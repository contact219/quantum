import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Mail, FileText } from "lucide-react";
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
    { value: "SB693", label: "SB-693 Notary" },
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

function PaperBot({ action, isThinking }: { action: "smile" | "surprised" | "thoughtful"; isThinking: boolean }) {
  const eyeY = action === "surprised" ? 42 : 48;
  const mouth = action === "smile" ? "M82 116 Q100 132 118 116" : action === "surprised" ? "M100 113 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" : "M78 120 Q100 110 122 120";

  return (
    <div className={`relative mx-auto h-48 w-48 rounded-2xl bg-white shadow-lg border p-2 ${isThinking ? "animate-pulse" : ""}`}>
      <svg viewBox="0 0 200 200" className={`h-full w-full ${isThinking ? "animate-[bounce_1.6s_ease-in-out_infinite]" : ""}`}>
        <rect x="25" y="20" width="150" height="160" rx="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" />
        <path d="M145 20 L175 50 L145 50 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="75" cy={eyeY} r="7" fill="#0F172A" className={isThinking ? "animate-ping" : ""} />
        <circle cx="125" cy={eyeY} r="7" fill="#0F172A" className={isThinking ? "animate-ping" : ""} />
        {action === "surprised" ? (
          <circle cx="100" cy="114" r="10" fill="none" stroke="#0F172A" strokeWidth="5" />
        ) : (
          <path d={mouth} fill="none" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        )}
        <path d="M45 150 C70 138, 130 138, 156 150" fill="none" stroke="#94A3B8" strokeWidth="3" strokeDasharray="4 4" />
      </svg>
      {isThinking && (
        <div className="absolute -right-2 -top-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold">Thinking…</div>
      )}
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
      "Get an AI-driven quote for Notary, Construction, and Labor & Payment bonds with PaperBot. Fast estimates, eligibility guidance, and a custom quote CTA.",
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
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under 2 seconds with PaperBot's AI quote engine.",
          },
        },
      ],
      bondType: {
        "@type": "BondType",
        name: "Texas Notary (SB-693) Bond",
        description: "Surety bond required for notaries public in Texas.",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "paperbot-faq-schema";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.getElementById("paperbot-faq-schema")?.remove();
    };
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
      window.dispatchEvent(new CustomEvent("paperbot_mascot_animation", { detail: { action: data.mascot_action } }));
      window.dispatchEvent(new CustomEvent("quote_submitted", { detail: { bondCategory, bondType } }));
    },
  });

  const mascotAction = quoteMutation.isPending ? "thoughtful" : result?.mascot_action || "smile";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Sparkles className="h-4 w-4" /> AI Quote Assistant
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">PaperBot Surety Quote Chatbot</h1>
          <p className="mt-3 text-muted-foreground">Notary, Construction, and Labor & Payment quotes in seconds.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Ask PaperBot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bond-category">Bond Category</Label>
                  <Select
                    value={bondCategory}
                    onValueChange={(value: "notary" | "construction" | "lp") => {
                      setBondCategory(value);
                      setBondType(BOND_TYPES[value][0].value);
                    }}
                  >
                    <SelectTrigger id="bond-category"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notary">📜 Notary</SelectItem>
                      <SelectItem value="construction">🏗️ Construction</SelectItem>
                      <SelectItem value="lp">💼 L&amp;P Bonds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bond-type">Bond Type</Label>
                  <Select value={bondType} onValueChange={setBondType}>
                    <SelectTrigger id="bond-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bond-amount">Bond Amount</Label>
                  <Input id="bond-amount" type="number" min={1000} value={bondAmount} onChange={(e) => setBondAmount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" className="pl-9" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-details">Business Details (optional)</Label>
                <Textarea id="business-details" rows={4} placeholder="Years in business, project type, public/private obligee, etc." value={businessDetails} onChange={(e) => setBusinessDetails(e.target.value)} />
              </div>

              <Button
                className="h-11 w-full text-base"
                onClick={() => quoteMutation.mutate()}
                disabled={quoteMutation.isPending || Number(bondAmount) <= 0}
              >
                {quoteMutation.isPending ? "PaperBot is thinking..." : 'Ask PaperBot'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 p-6">
              <PaperBot action={mascotAction} isThinking={quoteMutation.isPending} />

              {result ? (
                <div className="space-y-4 rounded-xl border bg-slate-50 p-4">
                  <p className="text-sm leading-relaxed">{result.quote_text}</p>
                  <p className="text-sm text-muted-foreground">{result.eligibility}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href={result.cta_url}
                      onClick={() => window.dispatchEvent(new CustomEvent("cta_click", { detail: { source: "paperbot" } }))}
                    >
                      <Button className="w-full">Get a Custom Quote</Button>
                    </a>
                    <Link href="/quote">
                      <Button variant="outline" className="w-full">Book a Consultation</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Submit your details to receive instant premium estimates and eligibility notes.
                </div>
              )}

              <div className="rounded-xl bg-primary/5 p-4 text-sm">
                <p className="font-semibold">Optional lead magnet</p>
                <p className="mt-1 text-muted-foreground">After your quote, we can email a category-specific checklist PDF.</p>
                <FileText className="mt-2 h-4 w-4 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
