import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  validationStatus: string;
  createdAt: string;
}

const REQUIRED_DOCUMENTS = [
  { type: "bond_request", label: "Bond Request Form", required: true },
  { type: "contract", label: "Project Contract/Bid Specs", required: true },
  { type: "financials", label: "Financial Statements", required: true },
  { type: "credit_auth", label: "Credit Authorization", required: true },
  { type: "resume", label: "Resume/Experience", required: false },
  { type: "job_breakdown", label: "Job Cost Breakdown", required: false },
  { type: "prior_bonds", label: "Prior Bond History", required: false },
  { type: "work_schedule", label: "Work-on-Hand Schedule", required: false },
];

export default function PortalDocuments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>("bond_request");
  const [applicationId, setApplicationId] = useState<string>("");

  // Fetch user's quotes to get the application
  const { data: quotes = [] } = useQuery({
    queryKey: ["/api/user/quotes"],
    queryFn: async () => {
      const response = await fetch("/api/user/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      return response.json();
    },
  });

  // Get first quote's application ID
  useEffect(() => {
    if (quotes.length > 0 && quotes[0].id) {
      // We'll use the quote ID as the application ID for now
      const quoteId = quotes[0].id;
      setApplicationId(quoteId);
      fetchDocuments(quoteId);
    }
  }, [quotes]);

  const fetchDocuments = async (appId: string) => {
    try {
      const response = await fetch(`/api/applications/${appId}/documents`);
      if (response.ok) {
        const docs = await response.json();
        setDocuments(docs || []);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    if (!applicationId) {
      toast({
        title: "Error",
        description: "No active application found. Please create a quote first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    let actualApplicationId = applicationId;
    try {
      for (const file of Array.from(files)) {
        // Upload document to API
        const response = await fetch(`/api/applications/${applicationId}/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentType: selectedDocType,
            fileName: file.name,
            fileUrl: URL.createObjectURL(file),
            fileSize: file.size,
            mimeType: file.type,
          }),
        });

        const uploadResult = await response.json();
        if (!response.ok) {
          throw new Error("Failed to upload document");
        }

        if (uploadResult.applicationId) {
          actualApplicationId = uploadResult.applicationId;
          setApplicationId(uploadResult.applicationId);
        }
      }
      
      // Refresh documents list using the correct application ID
      await fetchDocuments(actualApplicationId);
      
      // Invalidate quotes query to refresh application status on quote page
      queryClient.invalidateQueries({ queryKey: ["/api/user/quotes"] });
      
      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      });
      
      // Reset document type selector
      setSelectedDocType("bond_request");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload file(s)",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getDocumentLabel = (type: string): string => {
    return REQUIRED_DOCUMENTS.find(d => d.type === type)?.label || type;
  };

  const getRequiredStatus = (type: string): boolean => {
    return REQUIRED_DOCUMENTS.find(d => d.type === type)?.required || false;
  };

  const getUploadedCount = (type: string): number => {
    return documents.filter(d => d.documentType === type).length;
  };

  const allRequiredDocsUploaded = REQUIRED_DOCUMENTS.filter(d => d.required).every(
    d => getUploadedCount(d.type) > 0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-documents-title">
          Upload Documents
        </h1>
        <p className="text-muted-foreground text-lg">
          Submit your required documents for underwriting review
        </p>
      </div>

      {allRequiredDocsUploaded && (
        <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">All Required Documents Uploaded</p>
              <p className="text-sm text-green-800 dark:text-green-200">Your application is ready for underwriting review.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>Select document type and upload files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doc-type">Document Type</Label>
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger id="doc-type" data-testid="select-doc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REQUIRED_DOCUMENTS.map((doc) => (
                  <SelectItem key={doc.type} value={doc.type}>
                    {doc.label}
                    {doc.required && <span className="ml-2 text-destructive">*</span>}
                    {getUploadedCount(doc.type) > 0 && (
                      <span className="ml-2 text-xs text-green-600">✓ Uploaded</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleUploadClick}
              disabled={isUploading || !applicationId}
              data-testid="button-upload"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Choose Files"}
            </Button>
            {!applicationId && (
              <p className="text-sm text-muted-foreground mt-2">Create a quote first to upload documents</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
            onChange={handleFileChange}
            className="hidden"
            data-testid="input-file-upload"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents Checklist</CardTitle>
          <CardDescription>Complete all required documents to proceed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const uploadedCount = getUploadedCount(doc.type);
              const isComplete = uploadedCount > 0;
              
              return (
                <div key={doc.type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{doc.label}</p>
                      {doc.required && (
                        <Badge variant="outline" className="text-xs mt-1">Required</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {uploadedCount > 0 ? (
                      <Badge variant="default" className="bg-green-600">
                        {uploadedCount} file{uploadedCount !== 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not uploaded</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>All uploaded documents for your application</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} data-testid={`row-document-${doc.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {doc.fileName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getDocumentLabel(doc.documentType)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFileSize(doc.fileSize)}
                    </TableCell>
                    <TableCell>
                      {doc.validationStatus === 'valid' ? (
                        <Badge variant="default" className="bg-green-600">Valid</Badge>
                      ) : doc.validationStatus === 'invalid' ? (
                        <Badge variant="destructive">Invalid</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
