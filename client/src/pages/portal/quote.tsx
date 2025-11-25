import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams, useLocation } from "wouter";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileUp,
  PenTool,
  Eye,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Quote {
  id: string;
  bondType: string;
  projectName: string;
  contractValue?: string;
  status: string;
  estimatedPremium?: string;
  createdAt: string;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const quoteId = params.id as string;

  const { data: quote, isLoading } = useQuery({
    queryKey: ["/api/user/quotes", quoteId],
    queryFn: async () => {
      const response = await fetch("/api/user/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const quotes = await response.json() as Quote[];
      return quotes.find(q => q.id === quoteId);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-40 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/portal")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Quote not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColor = {
    pending: "bg-yellow-600",
    approved: "bg-green-600",
    rejected: "bg-destructive",
    bonded: "bg-primary",
  }[quote.status] || "bg-secondary";

  const statusIcon = {
    pending: Clock,
    approved: CheckCircle,
    rejected: AlertCircle,
    bonded: FileText,
  }[quote.status] || FileText;

  const StatusIcon = statusIcon;

  const nextSteps = [
    {
      icon: Eye,
      title: "Review Quote Details",
      description: "Review the approved quote terms and conditions",
      completed: true,
    },
    {
      icon: FileUp,
      title: "Upload Required Documents",
      description: "Submit required documents for underwriting",
      href: "/portal/documents",
      completed: false,
    },
    {
      icon: PenTool,
      title: "Sign Agreement",
      description: "Complete e-signature process for your bond",
      completed: false,
    },
    {
      icon: CheckCircle,
      title: "Confirm & Activate",
      description: "Confirm your information and activate the bond",
      completed: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/portal")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-quote-title">
          {quote.projectName || quote.bondType}
        </h1>
        <p className="text-muted-foreground text-lg">
          Quote #{quote.id.slice(0, 8)} • {quote.bondType}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Quote Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bond Type</p>
                <p className="text-lg font-semibold">{quote.bondType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                  <p className="text-lg font-semibold capitalize">{quote.status}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contract Value</p>
                <p className="text-lg font-semibold">{quote.contractValue || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Premium</p>
                <p className="text-lg font-semibold">${quote.estimatedPremium || "0"}</p>
              </div>
            </div>

            {quote.status === "pending" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Your quote is pending review. You'll be notified when it's approved.
                </p>
              </div>
            )}

            {quote.status === "approved" && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Excellent! Your quote has been approved. Complete the steps below to activate your bond.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span className="text-sm font-medium">Quote ID</span>
              <code className="text-xs">{quote.id.slice(0, 8)}</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span className="text-sm font-medium">Created</span>
              <span className="text-sm">{new Date(quote.createdAt).toLocaleDateString()}</span>
            </div>
            <Badge className={statusColor} data-testid="badge-quote-status">
              {quote.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {quote.status === "approved" && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Next Steps to Activate
            </CardTitle>
            <CardDescription>Complete these steps to finalize your bond</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextSteps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-border/50 hover-elevate"
                  >
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <StepIcon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                    {step.href && !step.completed && (
                      <Link href={step.href}>
                        <Button size="sm" variant="outline" data-testid={`button-action-${step.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {quote.status === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Review
            </CardTitle>
            <CardDescription>Your quote is being reviewed by our underwriting team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We typically review quotes within 1-2 business days. You'll receive an email notification as soon as your quote is approved or if we need additional information.
            </p>
            <Link href="/quote">
              <Button variant="outline" className="w-full" data-testid="button-request-another">
                Request Another Quote
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
