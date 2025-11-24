import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Filter, 
  X, 
  Eye, 
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const quotes = [
    {
      id: "QS-2024-1789",
      businessName: "Smith Construction LLC",
      contactName: "Robert Smith",
      bondType: "Performance Bond",
      contractValue: "$450,000",
      status: "pending",
      submittedDate: "2024-01-22",
      estimatedPremium: "$6,750",
      state: "CA",
    },
    {
      id: "QS-2024-1790",
      businessName: "BuildRight Contractors",
      contactName: "Maria Garcia",
      bondType: "Bid Bond",
      contractValue: "$1,200,000",
      status: "approved",
      submittedDate: "2024-01-21",
      estimatedPremium: "$18,000",
      state: "TX",
    },
    {
      id: "QS-2024-1791",
      businessName: "Metro Plumbing Co",
      contactName: "James Wilson",
      bondType: "Payment Bond",
      contractValue: "$275,000",
      status: "under_review",
      submittedDate: "2024-01-20",
      estimatedPremium: "$4,125",
      state: "NY",
    },
    {
      id: "QS-2024-1792",
      businessName: "Elite Electrical Services",
      contactName: "Jennifer Lee",
      bondType: "Performance Bond",
      contractValue: "$680,000",
      status: "pending",
      submittedDate: "2024-01-19",
      estimatedPremium: "$10,200",
      state: "FL",
    },
    {
      id: "QS-2024-1793",
      businessName: "Apex Roofing Inc",
      contactName: "Michael Brown",
      bondType: "License Bond",
      contractValue: "$50,000",
      status: "approved",
      submittedDate: "2024-01-18",
      estimatedPremium: "$500",
      state: "IL",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "under_review":
        return "default";
      case "approved":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = !statusFilter || statusFilter === "all" || quote.status === statusFilter;
    const matchesSearch = !searchTerm || 
      quote.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: "Total Quotes", value: "147", icon: FileText, change: "+12%" },
    { label: "Active Clients", value: "89", icon: Users, change: "+8%" },
    { label: "Total Premium", value: "$234K", icon: DollarSign, change: "+15%" },
    { label: "Avg. Processing", value: "2.3d", icon: Clock, change: "-10%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-admin-title">
            Admin Console
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage quotes, clients, and bond applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1" data-testid={`text-admin-stat-${i}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quote Management</CardTitle>
                    <CardDescription>Review and process bond applications</CardDescription>
                  </div>
                  <Button size="sm" data-testid="button-export">
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by business name or quote ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48" data-testid="select-status-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  {((statusFilter && statusFilter !== "all") || searchTerm) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setStatusFilter("all");
                        setSearchTerm("");
                      }}
                      data-testid="button-clear-filters"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote ID</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Bond Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow 
                        key={quote.id} 
                        className="cursor-pointer hover-elevate"
                        onClick={() => setSelectedQuote(quote)}
                        data-testid={`row-quote-${quote.id}`}
                      >
                        <TableCell className="font-mono text-sm">{quote.id}</TableCell>
                        <TableCell className="font-medium">{quote.businessName}</TableCell>
                        <TableCell>{quote.bondType}</TableCell>
                        <TableCell>{quote.contractValue}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(quote.status)}>
                            {getStatusLabel(quote.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuote(quote);
                            }}
                            data-testid={`button-view-${quote.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Quote Details</CardTitle>
                <CardDescription>
                  {selectedQuote ? `Quote #${selectedQuote.id}` : "Select a quote to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedQuote ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Business Name</Label>
                        <p className="font-medium" data-testid="text-detail-business">{selectedQuote.businessName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Contact Person</Label>
                        <p className="font-medium" data-testid="text-detail-contact">{selectedQuote.contactName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Bond Type</Label>
                        <p className="font-medium" data-testid="text-detail-bond-type">{selectedQuote.bondType}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Contract Value</Label>
                        <p className="font-medium" data-testid="text-detail-value">{selectedQuote.contractValue}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Estimated Premium</Label>
                        <p className="font-medium text-primary" data-testid="text-detail-premium">{selectedQuote.estimatedPremium}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">State</Label>
                        <p className="font-medium">{selectedQuote.state}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Submitted Date</Label>
                        <p className="font-medium">{new Date(selectedQuote.submittedDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label htmlFor="internal-notes">Internal Notes</Label>
                      <Textarea
                        id="internal-notes"
                        placeholder="Add internal notes about this quote..."
                        rows={4}
                        data-testid="textarea-notes"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="update-status">Update Status</Label>
                      <Select defaultValue={selectedQuote.status}>
                        <SelectTrigger id="update-status" data-testid="select-update-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" data-testid="button-save">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedQuote(null)} data-testid="button-close">
                        Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Click on a quote to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
