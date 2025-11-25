import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Upload, Download, Eye, Folder, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  size: string;
  relatedTo: string;
}

export default function PortalDocuments() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Financial Statement 2023.pdf",
      category: "Financial",
      uploadDate: "2024-01-10",
      size: "2.4 MB",
      relatedTo: "Quote #QS-2024-0127",
    },
    {
      id: "2",
      name: "Performance Bond - City Hall.pdf",
      category: "Bonds",
      uploadDate: "2023-06-15",
      size: "156 KB",
      relatedTo: "City Hall Renovation",
    },
    {
      id: "3",
      name: "Payment Bond - Highway Bridge.pdf",
      category: "Bonds",
      uploadDate: "2023-09-01",
      size: "148 KB",
      relatedTo: "Highway Bridge Project",
    },
    {
      id: "4",
      name: "Work-in-Progress Schedule Q4.xlsx",
      category: "Financial",
      uploadDate: "2024-01-05",
      size: "89 KB",
      relatedTo: "Annual Review",
    },
    {
      id: "5",
      name: "License - General Contractor.pdf",
      category: "Licenses",
      uploadDate: "2023-01-15",
      size: "245 KB",
      relatedTo: "Business Documents",
    },
    {
      id: "6",
      name: "Insurance Certificate.pdf",
      category: "Insurance",
      uploadDate: "2023-12-01",
      size: "312 KB",
      relatedTo: "Business Documents",
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { name: "All Documents", count: documents.length, icon: FileText },
    { name: "Bonds", count: documents.filter(d => d.category === "Bonds").length, icon: FileText },
    { name: "Financial", count: documents.filter(d => d.category === "Financial").length, icon: Folder },
    { name: "Licenses", count: documents.filter(d => d.category === "Licenses").length, icon: FileText },
    { name: "Insurance", count: documents.filter(d => d.category === "Insurance").length, icon: FileText },
    { name: "Projects", count: documents.filter(d => d.category === "Projects").length, icon: Folder },
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategory = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('bond')) return 'Bonds';
    if (lowerName.includes('financial') || lowerName.includes('statement') || lowerName.includes('income') || lowerName.includes('balance')) return 'Financial';
    if (lowerName.includes('license') || lowerName.includes('permit')) return 'Licenses';
    if (lowerName.includes('insurance') || lowerName.includes('certificate')) return 'Insurance';
    return 'Documents';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          category: getCategory(file.name),
          uploadDate: new Date().toISOString().split('T')[0],
          size: formatFileSize(file.size),
          relatedTo: "Recent Upload",
        };
        
        setDocuments(prev => [newDoc, ...prev]);
      }
      
      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      });
    } catch (error) {
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

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Deleted",
      description: "Document removed successfully",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-documents-title">
            Documents
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and organize your bond-related documents
          </p>
        </div>
        <Button 
          onClick={handleUploadClick}
          disabled={isUploading}
          data-testid="button-upload"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
          onChange={handleFileChange}
          className="hidden"
          data-testid="input-file-upload"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, i) => (
          <Card key={i} className="hover-elevate active-elevate-2 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <category.icon className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{category.name}</p>
              </div>
              <p className="text-2xl font-bold" data-testid={`text-category-${i}`}>{category.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Your uploaded and generated documents</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No documents uploaded yet. Click "Upload Document" to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Related To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} data-testid={`row-document-${doc.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{doc.size}</TableCell>
                    <TableCell className="text-sm">{doc.relatedTo}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" data-testid={`button-view-${doc.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-download-${doc.id}`}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          data-testid={`button-delete-${doc.id}`}
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
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
