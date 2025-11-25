import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Shield, Plus } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ email: "", firstName: "", lastName: "", role: "admin", permission: "view" });
  const [isCreating, setIsCreating] = useState(false);
  
  const { data: admins, isLoading, refetch } = useQuery<User[]>({
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

  const createUserMutation = useMutation({
    mutationFn: async (data: { email: string; firstName: string; lastName: string; role: string; permission: string }) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Success", description: "Admin user created successfully" });
      setShowCreateForm(false);
      setFormData({ email: "", firstName: "", lastName: "", role: "admin", permission: "view" });
      refetch();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create admin user", variant: "destructive" });
    },
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    createUserMutation.mutate(formData);
    setIsCreating(false);
  };

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

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Admin User</CardTitle>
            <CardDescription>Create a new admin account and assign roles</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-create-email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    data-testid="input-create-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    data-testid="input-create-last-name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(role) => setFormData({ ...formData, role })}>
                    <SelectTrigger id="role" data-testid="select-create-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="underwriter">Underwriter</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="permission">Permission</Label>
                  <Select value={formData.permission} onValueChange={(permission) => setFormData({ ...formData, permission })}>
                    <SelectTrigger id="permission" data-testid="select-create-permission">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="approve">Approve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating} data-testid="button-create-user">
                  {isCreating ? "Creating..." : "Create User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ email: "", firstName: "", lastName: "", role: "admin", permission: "view" });
                  }}
                  data-testid="button-cancel-create"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage roles and permissions for team members</CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              data-testid="button-add-user"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
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
