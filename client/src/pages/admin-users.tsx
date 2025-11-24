import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import { queryClient, apiRequest } from "@lib/queryClient";
import { Mail, Shield } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const { data: admins, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (data: { userId: string; role: string; permission: string }) => {
      return apiRequest("PATCH", `/api/admin/users/${data.userId}/role`, {
        role: data.role,
        permission: data.permission,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Success", description: "User role updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user role", variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "underwriter", label: "Underwriter" },
    { value: "sales", label: "Sales" },
    { value: "finance", label: "Finance" },
    { value: "client", label: "Client" },
  ];

  const permissionOptions = [
    { value: "view", label: "View Only" },
    { value: "edit", label: "Edit" },
    { value: "approve", label: "Approve" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-2">Manage admin users and their permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>Manage roles and permissions for team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins && admins.length > 0 ? (
              <div className="space-y-3">
                {admins.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email || user.username}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue={user.role || "client"} onValueChange={(role) => {
                        updateRoleMutation.mutate({ userId: user.id, role, permission: user.permission || "view" });
                      }}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select defaultValue={user.permission || "view"} onValueChange={(permission) => {
                        updateRoleMutation.mutate({ userId: user.id, role: user.role || "client", permission });
                      }}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {permissionOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No admin users found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
