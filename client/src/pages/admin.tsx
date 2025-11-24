import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Filter, 
  X, 
  Eye, 
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Printer,
  Trash2,
  Edit2,
  Settings,
  Phone,
  Mail,
  MapPin,
  Globe,
  Plus,
  Video,
  BookOpen
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("quotes");
  const [resources, setResources] = useState<any[]>([]);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    type: "guide",
    title: "",
    description: "",
    category: "Guide",
    downloadable: false,
    downloadUrl: "",
    videoUrl: "",
    duration: "",
    order: 0,
  });
  const [carriers, setCarriers] = useState<any[]>([]);
  const [editingCarrier, setEditingCarrier] = useState<any>(null);
  const [showCarrierForm, setShowCarrierForm] = useState(false);
  const [carrierFormData, setCarrierFormData] = useState<any>({
    name: "",
    website: "",
    commissionRate: 15,
    minCreditScore: 600,
    contact: "",
    email: "",
    phone: "",
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "settings") {
      fetchSettings();
    } else if (activeTab === "resources") {
      fetchResources();
    } else if (activeTab === "carriers") {
      fetchCarriers();
    }
  }, [activeTab]);

  const fetchCarriers = async () => {
    try {
      const response = await fetch("/api/admin/carriers");
      const data = await response.json();
      setCarriers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load carriers", variant: "destructive" });
    }
  };

  const handleSaveCarrier = async () => {
    try {
      if (!carrierFormData.name) {
        toast({ title: "Error", description: "Carrier name is required", variant: "destructive" });
        return;
      }

      const url = editingCarrier
        ? `/api/admin/carriers/${editingCarrier.id}`
        : "/api/admin/carriers";
      const method = editingCarrier ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carrierFormData),
      });

      if (!response.ok) throw new Error("Failed to save");

      await fetchCarriers();
      setShowCarrierForm(false);
      setEditingCarrier(null);
      setCarrierFormData({
        name: "",
        website: "",
        commissionRate: 15,
        minCreditScore: 600,
        contact: "",
        email: "",
        phone: "",
        notes: "",
      });
      toast({ title: "Success", description: editingCarrier ? "Carrier updated" : "Carrier created" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save carrier", variant: "destructive" });
    }
  };

  const handleDeleteCarrier = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/carriers/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      await fetchCarriers();
      toast({ title: "Success", description: "Carrier deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete carrier", variant: "destructive" });
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/admin/resources");
      const data = await response.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load resources", variant: "destructive" });
    }
  };

  const handleSaveResource = async () => {
    try {
      if (!formData.title) {
        toast({ title: "Error", description: "Title is required", variant: "destructive" });
        return;
      }

      // Normalize form data - remove undefined/null optional fields
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description || null,
        category: formData.category || null,
        link: formData.type === "tool" ? (formData.link || null) : null,
        videoUrl: formData.type === "video" ? (formData.videoUrl || null) : null,
        duration: formData.type === "video" ? (formData.duration || null) : null,
        downloadable: formData.downloadable,
        downloadUrl: formData.downloadable ? (formData.downloadUrl || null) : null,
        order: formData.order || 0,
      };

      const url = editingResource
        ? `/api/admin/resources/${editingResource.id}`
        : "/api/admin/resources";
      const method = editingResource ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Save error:", error);
        throw new Error("Failed to save");
      }

      await fetchResources();
      setShowResourceForm(false);
      setEditingResource(null);
      setFormData({
        type: "guide",
        title: "",
        description: "",
        category: "Guide",
        downloadable: false,
        downloadUrl: "",
        videoUrl: "",
        duration: "",
        link: "",
        order: 0,
      });
      toast({ title: "Success", description: editingResource ? "Resource updated" : "Resource created" });
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({ title: "Error", description: "Failed to save resource", variant: "destructive" });
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      await fetchResources();
      toast({ title: "Success", description: "Resource deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
    }
  };

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsSaving(true);
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save");
      toast({ title: "Success", description: "Settings saved successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handlePrintQuote = (quote: any) => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Quote ${quote.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
              .section { margin-top: 20px; }
              .row { display: flex; margin-top: 10px; }
              .label { font-weight: bold; width: 150px; }
              .value { flex: 1; }
              .print-btn { display: none; }
              @media print { body { margin: 20px; } }
            </style>
          </head>
          <body>
            <h1>Quote #${quote.id}</h1>
            <div class="section">
              <div class="row"><div class="label">Business:</div><div class="value">${quote.businessName}</div></div>
              <div class="row"><div class="label">Contact:</div><div class="value">${quote.contactName}</div></div>
              <div class="row"><div class="label">Email:</div><div class="value">${quote.contactEmail || "N/A"}</div></div>
              <div class="row"><div class="label">Phone:</div><div class="value">${quote.contactPhone || "N/A"}</div></div>
            </div>
            <div class="section">
              <div class="row"><div class="label">Bond Type:</div><div class="value">${quote.bondType}</div></div>
              <div class="row"><div class="label">Contract Value:</div><div class="value">${quote.contractValue}</div></div>
              <div class="row"><div class="label">Estimated Premium:</div><div class="value">${quote.estimatedPremium}</div></div>
              <div class="row"><div class="label">State:</div><div class="value">${quote.state}</div></div>
              <div class="row"><div class="label">Status:</div><div class="value">${quote.status}</div></div>
            </div>
            <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer;">Print</button>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const response = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast({ title: "Success", description: "Quote deleted successfully" });
        setSelectedQuote(null);
        // Refresh would happen in real app with React Query
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete quote", variant: "destructive" });
    }
  };

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
            Manage quotes, clients, and company settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="quotes" data-testid="tab-quotes">Quotes</TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
            <TabsTrigger value="carriers" data-testid="tab-carriers">Carriers</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="space-y-6">
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
                      <Button 
                        className="flex-1" 
                        data-testid="button-save"
                        onClick={() => handlePrintQuote(selectedQuote)}
                        variant="outline"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" data-testid="button-delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Quote?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The quote will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteQuote(selectedQuote.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogContent>
                      </AlertDialog>
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
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resource Management</CardTitle>
                    <CardDescription>Manage guides, videos, and educational resources</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setShowResourceForm(true);
                      setEditingResource(null);
                      setFormData({ type: "guide", title: "", description: "", category: "Guide", downloadable: false, downloadUrl: "", videoUrl: "", duration: "", order: 0 });
                    }}
                    data-testid="button-add-resource"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showResourceForm && (
                  <div className="mb-8 p-6 bg-card border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">{editingResource ? "Edit Resource" : "New Resource"}</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                          <SelectTrigger data-testid="select-resource-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="guide">Guide</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="tool">Tool</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Resource title"
                          data-testid="input-resource-title"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Resource description"
                        className="min-h-20"
                        data-testid="textarea-resource-description"
                      />
                    </div>

                    {(formData.type === "guide" || formData.type === "video") && (
                      <div className="grid grid-cols-2 gap-4">
                        {formData.type === "guide" && (
                          <>
                            <div>
                              <Label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={formData.downloadable}
                                  onChange={(e) => setFormData({ ...formData, downloadable: e.target.checked })}
                                  data-testid="checkbox-downloadable"
                                />
                                Downloadable
                              </Label>
                            </div>
                            {formData.downloadable && (
                              <div>
                                <Label>Download URL</Label>
                                <Input
                                  value={formData.downloadUrl}
                                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                                  placeholder="https://example.com/file.pdf"
                                  type="url"
                                  data-testid="input-download-url"
                                />
                              </div>
                            )}
                          </>
                        )}
                        {formData.type === "video" && (
                          <>
                            <div>
                              <Label>Video URL</Label>
                              <Input
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                placeholder="https://youtube.com/embed/..."
                                data-testid="input-video-url"
                              />
                            </div>
                            <div>
                              <Label>Duration</Label>
                              <Input
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="5:23"
                                data-testid="input-duration"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {formData.type === "tool" && (
                      <div>
                        <Label>Link</Label>
                        <Input
                          value={formData.link || ""}
                          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                          placeholder="/ai-bond-finder"
                          data-testid="input-tool-link"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Guide"
                          data-testid="input-category"
                        />
                      </div>
                      <div>
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                          data-testid="input-order"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowResourceForm(false);
                          setEditingResource(null);
                        }}
                        data-testid="button-cancel-form"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveResource} data-testid="button-save-resource">
                        {editingResource ? "Update Resource" : "Create Resource"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-start gap-4 p-4 border rounded-lg hover-elevate">
                      <div className="flex-shrink-0 mt-1">
                        {resource.type === "guide" && <BookOpen className="w-5 h-5 text-primary" />}
                        {resource.type === "video" && <Video className="w-5 h-5 text-primary" />}
                        {resource.type === "tool" && <FileText className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                          {resource.category && <Badge variant="outline" className="text-xs">{resource.category}</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingResource(resource);
                            setFormData({
                              type: resource.type,
                              title: resource.title || "",
                              description: resource.description || "",
                              category: resource.category || "Guide",
                              link: resource.link || "",
                              videoUrl: resource.videoUrl || "",
                              duration: resource.duration || "",
                              downloadable: resource.downloadable || false,
                              downloadUrl: resource.downloadUrl || "",
                              order: resource.order || 0,
                            });
                            setShowResourceForm(true);
                          }}
                          data-testid={`button-edit-resource-${resource.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" data-testid={`button-delete-resource-${resource.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex justify-end gap-3">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteResource(resource.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carriers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Carrier Management</CardTitle>
                    <CardDescription>Manage insurance carrier partnerships</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setShowCarrierForm(true);
                      setEditingCarrier(null);
                      setCarrierFormData({
                        name: "",
                        website: "",
                        commissionRate: 15,
                        minCreditScore: 600,
                        contact: "",
                        email: "",
                        phone: "",
                        notes: "",
                      });
                    }}
                    data-testid="button-add-carrier"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Carrier
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showCarrierForm && (
                  <div className="mb-8 p-6 bg-card border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">{editingCarrier ? "Edit Carrier" : "New Carrier"}</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Carrier Name</Label>
                        <Input
                          value={carrierFormData.name}
                          onChange={(e) => setCarrierFormData({ ...carrierFormData, name: e.target.value })}
                          placeholder="e.g., RLI Surety"
                          data-testid="input-carrier-name"
                        />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input
                          value={carrierFormData.website || ""}
                          onChange={(e) => setCarrierFormData({ ...carrierFormData, website: e.target.value })}
                          placeholder="https://example.com"
                          data-testid="input-carrier-website"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Commission Rate (%)</Label>
                        <Input
                          type="number"
                          value={carrierFormData.commissionRate}
                          onChange={(e) => setCarrierFormData({ ...carrierFormData, commissionRate: parseFloat(e.target.value) })}
                          placeholder="15"
                          data-testid="input-commission-rate"
                        />
                      </div>
                      <div>
                        <Label>Min Credit Score</Label>
                        <Input
                          type="number"
                          value={carrierFormData.minCreditScore}
                          onChange={(e) => setCarrierFormData({ ...carrierFormData, minCreditScore: parseInt(e.target.value) })}
                          data-testid="input-min-credit-score"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Person</Label>
                        <Input
                          value={carrierFormData.contact || ""}
                          onChange={(e) => setCarrierFormData({ ...carrierFormData, contact: e.target.value })}
                          placeholder="Contact name"
                          data-testid="input-contact-person"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={carrierFormData.email || ""}
                          onChange={(e) => setCarrierFormData({ ...carrierFormData, email: e.target.value })}
                          placeholder="email@example.com"
                          data-testid="input-carrier-email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={carrierFormData.phone || ""}
                        onChange={(e) => setCarrierFormData({ ...carrierFormData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        data-testid="input-carrier-phone"
                      />
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={carrierFormData.notes || ""}
                        onChange={(e) => setCarrierFormData({ ...carrierFormData, notes: e.target.value })}
                        placeholder="Carrier details and requirements"
                        className="min-h-20"
                        data-testid="textarea-carrier-notes"
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setShowCarrierForm(false)}
                        data-testid="button-cancel-carrier-form"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveCarrier} data-testid="button-save-carrier">
                        {editingCarrier ? "Update Carrier" : "Create Carrier"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {carriers.map((carrier) => (
                    <div key={carrier.id} className="flex items-start gap-4 p-4 border rounded-lg hover-elevate">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{carrier.name}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                          <p>Commission: {carrier.commissionRate}%</p>
                          <p>Min Credit Score: {carrier.minCreditScore}</p>
                          {carrier.contact && <p>Contact: {carrier.contact}</p>}
                          {carrier.email && <p>Email: {carrier.email}</p>}
                          {carrier.phone && <p>Phone: {carrier.phone}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCarrier(carrier);
                            setCarrierFormData(carrier);
                            setShowCarrierForm(true);
                          }}
                          data-testid={`button-edit-carrier-${carrier.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" data-testid={`button-delete-carrier-${carrier.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Carrier</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{carrier.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex justify-end gap-3">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCarrier(carrier.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Company Settings
                </CardTitle>
                <CardDescription>Manage your company's contact information</CardDescription>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Loading settings...</p>
                  </div>
                ) : settings ? (
                  <div className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Company Name
                      </Label>
                      <Input
                        id="company-name"
                        value={settings.companyName || ""}
                        onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                        placeholder="Enter company name"
                        data-testid="input-company-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={settings.phone || ""}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        placeholder="Enter phone number"
                        type="tel"
                        data-testid="input-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        value={settings.email || ""}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="Enter email address"
                        type="email"
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={settings.address || ""}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        placeholder="Enter company address"
                        data-testid="input-address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={settings.website || ""}
                        onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                        placeholder="Enter website URL"
                        type="url"
                        data-testid="input-website"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => fetchSettings()}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        disabled={settingsSaving}
                        data-testid="button-save-settings"
                      >
                        {settingsSaving ? "Saving..." : "Save Settings"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Failed to load settings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
