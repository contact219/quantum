import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Upload, Download, Eye, Folder } from "lucide-react";

export default function PortalDocuments() {
  const documents = [
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
  ];

  const categories = [
    { name: "All Documents", count: 24, icon: FileText },
    { name: "Bonds", count: 8, icon: FileText },
    { name: "Financial", count: 6, icon: Folder },
    { name: "Licenses", count: 4, icon: FileText },
    { name: "Insurance", count: 3, icon: FileText },
    { name: "Projects", count: 3, icon: Folder },
  ];

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
        <Button data-testid="button-upload">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
