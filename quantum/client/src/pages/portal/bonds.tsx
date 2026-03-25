import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Download, AlertCircle, Printer } from "lucide-react";
import { useState } from "react";

export default function PortalBonds() {
  const [selectedBond, setSelectedBond] = useState<any>(null);

  const handlePrintBond = (bond: any) => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bond ${bond.bondNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
              .section { margin-top: 30px; }
              .row { display: flex; margin-top: 10px; }
              .label { font-weight: bold; width: 180px; }
              .value { flex: 1; }
              @media print { body { margin: 20px; } }
            </style>
          </head>
          <body>
            <h1>Surety Bond Certificate</h1>
            <div class="section">
              <div class="row"><div class="label">Bond Number:</div><div class="value">${bond.bondNumber}</div></div>
              <div class="row"><div class="label">Bond Type:</div><div class="value">${bond.type}</div></div>
              <div class="row"><div class="label">Project:</div><div class="value">${bond.project}</div></div>
              <div class="row"><div class="label">Penal Sum:</div><div class="value">${bond.penalSum}</div></div>
              <div class="row"><div class="label">Premium:</div><div class="value">${bond.premium}</div></div>
            </div>
            <div class="section">
              <div class="row"><div class="label">Effective Date:</div><div class="value">${new Date(bond.effectiveDate).toLocaleDateString()}</div></div>
              <div class="row"><div class="label">Expiration Date:</div><div class="value">${new Date(bond.expirationDate).toLocaleDateString()}</div></div>
              <div class="row"><div class="label">Status:</div><div class="value">${bond.status}</div></div>
            </div>
            <button onclick="window.print()" style="margin-top: 30px; padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer;">Print</button>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const bonds = [
    {
      id: "1",
      bondNumber: "QS-2023-4892",
      type: "Performance Bond",
      project: "City Hall Renovation",
      penalSum: "$500,000",
      premium: "$7,500",
      effectiveDate: "2023-06-15",
      expirationDate: "2024-12-31",
      status: "Active",
      daysToExpire: 245,
    },
    {
      id: "2",
      bondNumber: "QS-2023-5103",
      type: "Payment Bond",
      project: "Highway Bridge Project",
      penalSum: "$750,000",
      premium: "$11,250",
      effectiveDate: "2023-09-01",
      expirationDate: "2024-08-15",
      status: "Active",
      daysToExpire: 189,
    },
    {
      id: "3",
      bondNumber: "QS-2024-0127",
      type: "Bid Bond",
      project: "School Construction",
      penalSum: "$1,200,000",
      premium: "$3,600",
      effectiveDate: "2024-01-15",
      expirationDate: "2024-04-15",
      status: "Active",
      daysToExpire: 75,
    },
    {
      id: "4",
      bondNumber: "QS-2023-2456",
      type: "Maintenance Bond",
      project: "Plaza Development",
      penalSum: "$250,000",
      premium: "$2,500",
      effectiveDate: "2023-10-15",
      expirationDate: "2024-02-28",
      status: "Expiring",
      daysToExpire: 28,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Expiring":
        return "destructive";
      case "Expired":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-bonds-title">
            My Bonds
          </h1>
          <p className="text-muted-foreground text-lg">
            View and manage all your surety bonds
          </p>
        </div>
        <Button data-testid="button-request-bond">
          <Shield className="w-4 h-4 mr-2" />
          Request New Bond
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bonds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-total-bonds">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary" data-testid="text-active-bonds">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive" data-testid="text-expiring-bonds">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent" data-testid="text-total-coverage">$8.5M</div>
          </CardContent>
        </Card>
      </div>

      {bonds.some(b => b.status === "Expiring") && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Action Required
            </CardTitle>
            <CardDescription>
              You have {bonds.filter(b => b.status === "Expiring").length} bond(s) expiring within 30 days
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bond List</CardTitle>
          <CardDescription>All your surety bonds and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bond Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Penal Sum</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bonds.map((bond) => (
                <TableRow key={bond.id} data-testid={`row-bond-${bond.id}`}>
                  <TableCell className="font-mono text-sm">{bond.bondNumber}</TableCell>
                  <TableCell className="font-medium">{bond.type}</TableCell>
                  <TableCell>{bond.project}</TableCell>
                  <TableCell>{bond.penalSum}</TableCell>
                  <TableCell>{bond.premium}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{new Date(bond.expirationDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {bond.daysToExpire > 0 ? `${bond.daysToExpire} days` : "Expired"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(bond.status)}>
                      {bond.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handlePrintBond(bond)}
                      data-testid={`button-print-${bond.id}`}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
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
