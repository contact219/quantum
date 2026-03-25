import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Building2, Calendar, DollarSign } from "lucide-react";

export default function PortalProjects() {
  const projects = [
    {
      id: "1",
      name: "City Hall Renovation",
      obligee: "City of Springfield",
      contractValue: "$500,000",
      status: "Active",
      startDate: "2023-06-15",
      completionDate: "2024-12-31",
      bondsRequired: ["Performance", "Payment"],
    },
    {
      id: "2",
      name: "Highway Bridge Project",
      obligee: "State DOT",
      contractValue: "$750,000",
      status: "Active",
      startDate: "2023-09-01",
      completionDate: "2024-08-15",
      bondsRequired: ["Bid", "Performance", "Payment"],
    },
    {
      id: "3",
      name: "School Construction",
      obligee: "Springfield School District",
      contractValue: "$1,200,000",
      status: "Bidding",
      startDate: "2024-03-01",
      completionDate: "2025-06-30",
      bondsRequired: ["Bid"],
    },
    {
      id: "4",
      name: "Plaza Development",
      obligee: "Downtown Development Corp",
      contractValue: "$250,000",
      status: "Completed",
      startDate: "2022-11-01",
      completionDate: "2023-10-15",
      bondsRequired: ["Performance", "Payment", "Maintenance"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Bidding":
        return "secondary";
      case "Completed":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-projects-title">
            My Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your construction projects and associated bonds
          </p>
        </div>
        <Button data-testid="button-new-project">
          <Building2 className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-total-projects">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary" data-testid="text-active-projects">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bidding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600" data-testid="text-bidding-projects">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600" data-testid="text-completed-projects">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>All your construction projects in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Obligee</TableHead>
                <TableHead>Contract Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Bonds</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.obligee}</TableCell>
                  <TableCell>{project.contractValue}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(project.completionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {project.bondsRequired.map((bond, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {bond}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" data-testid={`button-view-${project.id}`}>
                      <FileText className="w-4 h-4" />
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
