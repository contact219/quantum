import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { suretyPortalBlueprint } from "@/lib/suretyBlueprint";
import { useLocation } from "wouter";
import { Upload, CheckCircle, AlertCircle, FileText, DollarSign, PenTool, Sparkles } from "lucide-react";

type ApplicationStatus = "draft" | "submitted" | "approved" | "rejected" | "bonded";
type DocumentType = "bond_request" | "contract" | "financials" | "credit_auth" | "resume" | "job_breakdown" | "prior_bonds" | "work_schedule";

interface ApplicationForm {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  yearsInBusiness: string;
  annualRevenue: string;
}

interface Application {
  id: string;
  applicationNumber: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  status: ApplicationStatus;
  underwritingStatus: string;
  missingDocuments: string[];
  preliminaryPremium: number;
  eSignatureStatus: string;
  createdAt: string;
}

interface AppDocument {
  id: string;
  documentType: DocumentType;
  fileName: string;
  validationStatus: string;
  uploadedAt: string;
}

export default function ApplicationPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("list");
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationForm>({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    businessType: "",
    yearsInBusiness: "",
    annualRevenue: "",
  });

  const documentTypes: { value: DocumentType; label: string; required: boolean }[] =
    suretyPortalBlueprint.contractorUploads.map((document) => ({
      value: document.type as DocumentType,
      label: document.label,
      required: document.required,
    }));

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      if (response.ok) {
        const apps = await response.json();
        setApplications(apps);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  };

  const handleCreateApplication = async () => {
    if (!formData.companyName || !formData.contactName || !formData.contactEmail) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentApp(result.application);
        setActiveTab("details");
        toast({ title: "Success", description: "Application created successfully" });
        fetchApplications();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create application", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplication = async (appId: string) => {
    try {
      const response = await fetch(`/api/applications/${appId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentApp(data.application);
        setDocuments(data.documents || []);
        setActiveTab("details");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load application", variant: "destructive" });
    }
  };

  const handleDocumentUpload = async (documentType: DocumentType) => {
    if (!currentApp) return;
    
    // Simulate document upload
    const fileName = `${documentType}_sample.pdf`;
    const fileUrl = `/documents/${currentApp.id}/${fileName}`;

    setLoading(true);
    try {
      const response = await fetch(`/api/applications/${currentApp.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          fileName,
          fileUrl,
          fileSize: 1024000,
          mimeType: "application/pdf",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments([...documents, result.document]);
        toast({ title: "Success", description: `${documentType} uploaded successfully` });

        // Re-evaluate application after document upload
        await evaluateApplication();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload document", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const evaluateApplication = async () => {
    if (!currentApp) return;

    try {
      const response = await fetch(`/api/applications/${currentApp.id}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentApp(result.application);
        toast({ title: "Success", description: "Application evaluated" });
      }
    } catch (error) {
      console.error("Evaluation failed", error);
    }
  };

  const handleGenerateQuote = async () => {
    if (!currentApp) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/applications/${currentApp.id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentApp({ ...currentApp, preliminaryPremium: parseFloat(result.preliminaryPremium) });
        toast({ title: "Success", description: "Preliminary quote generated" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate quote", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleESign = async () => {
    if (!currentApp) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/applications/${currentApp.id}/e-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentApp(result.application);
        toast({ title: "Success", description: "E-signature package prepared" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to prepare e-signature", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="heading-application-portal">Surety Application Portal</h1>
          <p className="text-muted-foreground">Submit your bonding application and required documents</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="list" data-testid="tab-applications">My Applications</TabsTrigger>
            {currentApp && <TabsTrigger value="details" data-testid="tab-application-details">Application Details</TabsTrigger>}
          </TabsList>

          {/* Applications List Tab */}
          <TabsContent value="list" className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {suretyPortalBlueprint.intakeLabel}
                </CardTitle>
                <CardDescription>
                  This portal is structured around a contractor upload checklist plus an automated underwriting workflow.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Contractor uploads
                  </p>
                  <div className="space-y-2">
                    {suretyPortalBlueprint.contractorUploads.map((document) => (
                      <div key={document.type} className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
                        <span className="text-sm">{document.label}</span>
                        <Badge variant={document.required ? "default" : "outline"}>
                          {document.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Portal automation
                  </p>
                  <div className="space-y-2">
                    {suretyPortalBlueprint.automatedSteps.map((step, index) => (
                      <div key={step.id} className="rounded-lg border bg-background/80 p-3">
                        <p className="text-sm font-medium">
                          {index + 1}. {step.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Start New Application</CardTitle>
                <CardDescription>Fill in your company information to begin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="ABC Construction LLC"
                      data-testid="input-company-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Name *</Label>
                    <Input
                      id="contact"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="John Smith"
                      data-testid="input-contact-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="john@example.com"
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="(555) 123-4567"
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                      <SelectTrigger data-testid="select-business-type">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general_contractor">General Contractor</SelectItem>
                        <SelectItem value="subcontractor">Subcontractor</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Years in Business</Label>
                    <Input
                      id="years"
                      type="number"
                      value={formData.yearsInBusiness}
                      onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                      placeholder="0"
                      data-testid="input-years-in-business"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={formData.annualRevenue}
                      onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                      placeholder="e.g., 500000"
                      data-testid="input-annual-revenue"
                    />
                  </div>
                </div>

                <Button onClick={handleCreateApplication} disabled={loading} className="w-full" data-testid="button-create-application">
                  Create Application
                </Button>
              </CardContent>
            </Card>

            {/* Existing Applications */}
            {applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 cursor-pointer transition"
                        onClick={() => handleSelectApplication(app.id)}
                        data-testid={`row-application-${app.id}`}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{app.applicationNumber}</p>
                          <p className="text-sm text-muted-foreground">{app.companyName}</p>
                        </div>
                        <Badge variant={app.status === "approved" ? "default" : "outline"}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Application Details Tab */}
          {currentApp && (
            <TabsContent value="details" className="space-y-6">
              {/* Application Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentApp.applicationNumber}</CardTitle>
                      <CardDescription>{currentApp.companyName}</CardDescription>
                    </div>
                    <Badge variant={currentApp.underwritingStatus === "approved" ? "default" : "outline"}>
                      {currentApp.underwritingStatus}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Required Documents
                  </CardTitle>
                  <CardDescription>Upload all required documents for underwriting review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentTypes.map((doc) => {
                      const uploaded = documents.find((d) => d.documentType === doc.value);
                      return (
                        <div
                          key={doc.value}
                          className="flex items-center justify-between p-4 border rounded-lg"
                          data-testid={`document-row-${doc.value}`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {uploaded ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : doc.required ? (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">
                                {doc.label} {doc.required && <span className="text-red-600">*</span>}
                              </p>
                              {uploaded && (
                                <p className="text-sm text-muted-foreground">{uploaded.fileName}</p>
                              )}
                            </div>
                          </div>
                          {!uploaded && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDocumentUpload(doc.value)}
                              disabled={loading}
                              data-testid={`button-upload-${doc.value}`}
                            >
                              Upload
                            </Button>
                          )}
                          {uploaded && (
                            <Badge variant="default">Uploaded</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {currentApp.missingDocuments && currentApp.missingDocuments.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-900">Missing Required Documents:</p>
                      <ul className="mt-2 space-y-1">
                        {currentApp.missingDocuments.map((doc) => (
                          <li key={doc} className="text-sm text-yellow-800">• {doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Underwriting Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Underwriting Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-2xl font-bold capitalize">{currentApp.underwritingStatus}</p>
                    </div>
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Documents</p>
                      <p className="text-2xl font-bold">{documents.length} / {documentTypes.filter(d => d.required).length}</p>
                    </div>
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Application</p>
                      <p className="text-2xl font-bold capitalize">{currentApp.status}</p>
                    </div>
                  </div>

                  {currentApp.underwritingStatus === "approved" && (
                    <Button onClick={handleGenerateQuote} disabled={loading} className="w-full" data-testid="button-generate-quote">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Generate Preliminary Quote
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Preliminary Quote */}
              {currentApp.preliminaryPremium && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Preliminary Quote
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-accent/10 rounded-lg border border-accent">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">Estimated Annual Premium</p>
                        <p className="text-4xl font-bold text-accent">
                          ${currentApp.preliminaryPremium.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleESign} disabled={loading} className="w-full" data-testid="button-e-sign">
                      <PenTool className="w-4 h-4 mr-2" />
                      Proceed to E-Signature
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* E-Signature Status */}
              {currentApp.eSignatureStatus === "sent" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      E-Signature Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Your bond document has been sent for e-signature. Please check your email for the signing link.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
