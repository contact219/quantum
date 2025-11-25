import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  FileText, 
  Shield, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Calendar,
  FileUp,
  PenTool,
  Eye
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

export default function PortalDashboard() {
  // Use TanStack Query to fetch user quotes with proper caching and refetch
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['/api/user/quotes'],
    queryFn: async () => {
      const response = await fetch("/api/user/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      return response.json() as Promise<Quote[]>;
    },
    // Refetch whenever user navigates to this page
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale, refetch on mount
  });

  const stats = [
    { label: "Active Bonds", value: "4", icon: Shield, color: "text-primary" },
    { label: "Total Projects", value: "12", icon: FileText, color: "text-accent" },
    { label: "Pending Quotes", value: quotes.filter(q => q.status === "pending").length.toString(), icon: Clock, color: "text-yellow-600" },
    { label: "Expiring Soon", value: "1", icon: AlertCircle, color: "text-destructive" },
  ];

  const recentBonds = [
    { id: "1", type: "Performance Bond", project: "City Hall Renovation", amount: "$500,000", status: "Active", expiresIn: "245 days" },
    { id: "2", type: "Payment Bond", project: "Highway Bridge Project", amount: "$750,000", status: "Active", expiresIn: "189 days" },
    { id: "3", type: "Bid Bond", project: "School Construction", amount: "$1,200,000", status: "Pending", expiresIn: "-" },
    { id: "4", type: "Maintenance Bond", project: "Plaza Development", amount: "$250,000", status: "Expiring", expiresIn: "28 days" },
  ];

  const approvedQuotes = quotes.filter(q => q.status === "approved");
  const pendingQuotes = quotes.filter(q => q.status === "pending");

  const upcomingDeadlines = quotes.map((quote, i) => ({
    id: quote.id,
    task: `Quote #${quote.id.slice(0, 8)} - ${quote.bondType}`,
    date: new Date(quote.createdAt).toLocaleDateString(),
    priority: quote.status === "pending" ? "high" : quote.status === "approved" ? "low" : "medium" as const,
  })).slice(0, 3);

  const nextStepsByStatus = (quoteId: string): Array<{icon: any, title: string, description: string, href?: string, action?: () => void}> => [
    {
      icon: Eye,
      title: "Review Quote Details",
      description: "Review the approved quote terms and conditions",
      href: `/portal/quote/${quoteId}`
    },
    {
      icon: FileUp,
      title: "Upload Required Documents",
      description: "Submit required documents for underwriting",
      href: "/portal/documents"
    },
    {
      icon: PenTool,
      title: "Sign Agreement",
      description: "Complete e-signature process for your bond"
    },
    {
      icon: CheckCircle,
      title: "Confirm & Activate",
      description: "Confirm your information and activate the bond"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Here's an overview of your bonding activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid={`text-stat-${i}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Recent Bonds
            </CardTitle>
            <CardDescription>Your most recent bond activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBonds.map((bond) => (
                <div key={bond.id} className="flex items-center justify-between p-3 rounded-lg border hover-elevate">
                  <div className="flex-1">
                    <p className="font-semibold" data-testid={`text-bond-${bond.id}`}>{bond.type}</p>
                    <p className="text-sm text-muted-foreground">{bond.project}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-medium">{bond.amount}</p>
                    <p className="text-xs text-muted-foreground">{bond.expiresIn}</p>
                  </div>
                  <Badge
                    variant={bond.status === "Active" ? "default" : bond.status === "Expiring" ? "destructive" : "secondary"}
                    data-testid={`badge-status-${bond.id}`}
                  >
                    {bond.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Link href="/portal/bonds">
              <Button variant="outline" className="w-full mt-4" data-testid="button-view-bonds">
                View All Bonds
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((item, i) => (
                <Link key={i} href={`/portal/quote/${item.id}`}>
                  <div className="flex items-start gap-3 p-3 rounded-lg border hover-elevate cursor-pointer transition-all">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      item.priority === "high" ? "bg-destructive" : 
                      item.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" data-testid={`text-deadline-${i}`}>{item.task}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href={approvedQuotes.length > 0 ? `/portal/quote/${approvedQuotes[0].id}` : "/portal/projects"}>
              <Button variant="outline" className="w-full mt-4" data-testid="button-view-tasks">
                View All Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {approvedQuotes.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Approved Quotes - Next Steps
            </CardTitle>
            <CardDescription>Your quotes have been approved. Complete the following steps to activate your bonds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvedQuotes.map((quote) => (
              <div key={quote.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {quote.projectName || quote.bondType}
                      <Badge className="bg-green-600">Approved</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">Quote #{quote.id.slice(0, 8)} • Premium: ${quote.estimatedPremium || "0"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {nextStepsByStatus(quote.id).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-md border border-border/50">
                      <step.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                      {step.href && (
                        <Link href={step.href}>
                          <Button size="sm" variant="ghost" data-testid={`button-action-${step.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/quote">
              <Button className="w-full h-auto flex-col gap-2 py-6" variant="outline" data-testid="button-quick-quote">
                <FileText className="w-6 h-6" />
                <span>Request New Quote</span>
              </Button>
            </Link>
            <Link href="/portal/projects">
              <Button className="w-full h-auto flex-col gap-2 py-6" variant="outline" data-testid="button-quick-project">
                <Shield className="w-6 h-6" />
                <span>View Projects</span>
              </Button>
            </Link>
            <Link href="/portal/documents">
              <Button className="w-full h-auto flex-col gap-2 py-6" variant="outline" data-testid="button-quick-docs">
                <FileText className="w-6 h-6" />
                <span>Upload Documents</span>
              </Button>
            </Link>
            <Link href="/ai-bond-finder">
              <Button className="w-full h-auto flex-col gap-2 py-6" variant="outline" data-testid="button-quick-ai">
                <CheckCircle className="w-6 h-6" />
                <span>AI Bond Finder</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-accent text-white">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription className="text-gray-100">
              Our team is here to assist you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-100">
              Have questions about your bonds or need assistance with a project?
            </p>
            <Button variant="outline" className="w-full border-white text-primary hover:bg-white/10" data-testid="button-contact">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
