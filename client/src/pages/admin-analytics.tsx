import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, FileText, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface AnalyticsData {
  totalQuotes: number;
  totalApplications: number;
  totalBonds: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalPremium: string;
  totalCommissions: string;
  averageApprovalTime: number;
  conversionRate: string;
}

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
  });

  if (isLoading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6">No analytics data available</div>;
  }

  const statCards = [
    {
      title: "Total Quotes",
      value: analytics.totalQuotes,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Applications",
      value: analytics.totalApplications,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Approved",
      value: analytics.approvedApplications,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: analytics.rejectedApplications,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Total Premium",
      value: `$${analytics.totalPremium}`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "Conversion Rate",
      value: `${analytics.conversionRate}%`,
      icon: TrendingUp,
      color: "text-indigo-600",
    },
  ];

  // Sample data for charts
  const monthlyData = [
    { month: "Jan", quotes: 45, applications: 38, approved: 28 },
    { month: "Feb", quotes: 52, applications: 45, approved: 32 },
    { month: "Mar", quotes: 61, applications: 51, approved: 38 },
    { month: "Apr", quotes: 55, applications: 48, approved: 35 },
    { month: "May", quotes: 68, applications: 58, approved: 42 },
    { month: "Jun", quotes: 72, applications: 62, approved: 47 },
  ];

  const statusData = [
    { name: "Approved", value: analytics.approvedApplications, fill: "#10b981" },
    { name: "Rejected", value: analytics.rejectedApplications, fill: "#ef4444" },
    { name: "Pending", value: analytics.totalApplications - analytics.approvedApplications - analytics.rejectedApplications, fill: "#f59e0b" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track key metrics and performance indicators</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Quotes, applications, and approvals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quotes" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="applications" stroke="#8b5cf6" />
                  <Line type="monotone" dataKey="approved" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
              <CardDescription>Breakdown of application statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Approval Time</p>
                <p className="text-2xl font-bold">{Math.round(analytics.averageApprovalTime / 1000 / 60)} min</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Commissions</p>
                <p className="text-2xl font-bold">${analytics.totalCommissions}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
