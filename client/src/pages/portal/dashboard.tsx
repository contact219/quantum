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
  Calendar
} from "lucide-react";

export default function PortalDashboard() {
  const stats = [
    { label: "Active Bonds", value: "4", icon: Shield, color: "text-primary" },
    { label: "Total Projects", value: "12", icon: FileText, color: "text-accent" },
    { label: "Pending Quotes", value: "2", icon: Clock, color: "text-yellow-600" },
    { label: "Expiring Soon", value: "1", icon: AlertCircle, color: "text-destructive" },
  ];

  const recentBonds = [
    { id: "1", type: "Performance Bond", project: "City Hall Renovation", amount: "$500,000", status: "Active", expiresIn: "245 days" },
    { id: "2", type: "Payment Bond", project: "Highway Bridge Project", amount: "$750,000", status: "Active", expiresIn: "189 days" },
    { id: "3", type: "Bid Bond", project: "School Construction", amount: "$1,200,000", status: "Pending", expiresIn: "-" },
    { id: "4", type: "Maintenance Bond", project: "Plaza Development", amount: "$250,000", status: "Expiring", expiresIn: "28 days" },
  ];

  const upcomingDeadlines = [
    { task: "Submit financial docs for Quote #QS-2024-1789", date: "Jan 28, 2024", priority: "high" },
    { task: "Renew Performance Bond for City Hall", date: "Feb 15, 2024", priority: "medium" },
    { task: "Project completion docs for Plaza", date: "Mar 2, 2024", priority: "low" },
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
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    item.priority === "high" ? "bg-destructive" : 
                    item.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" data-testid={`text-deadline-${i}`}>{item.task}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" data-testid="button-view-tasks">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

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
