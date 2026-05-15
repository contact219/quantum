import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Phone, Mail, CheckCircle2, XCircle, DollarSign, Clock, Search, RefreshCw,
} from "lucide-react";

type LeadStatus = "new" | "contacted" | "sold" | "no_follow_up";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  bondType: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  saleAmount: string | null;
  leadTime: string;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-red-100 text-red-700 border-red-200",
  contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  sold: "bg-green-100 text-green-700 border-green-200",
  no_follow_up: "bg-gray-100 text-gray-600 border-gray-200",
};

const BOND_LABELS: Record<string, string> = {
  notary: "Texas Notary Bond",
  dealer: "Texas GDN Dealer Bond",
  gdn: "Texas GDN Dealer Bond",
  contractor: "Texas Contractor License Bond",
  construction: "Texas Construction Bond",
  bid: "Texas Bid Bond",
  performance: "Texas Performance & Payment Bond",
  payment: "Texas Payment Bond",
  mortgage: "Texas Mortgage Broker Bond",
  "credit-access-business": "Texas Credit Access Business Bond",
  "collection-agency": "Texas Collection Agency Bond",
  "property-tax-consultant": "Texas Property Tax Consultant Bond",
};

function bondDisplay(raw: string | null) {
  if (!raw) return "Unknown";
  return BOND_LABELS[raw.toLowerCase()] || raw;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
    hour12: true,
  }) + " CDT";
}

export default function AdminLeads() {
  useSEO({ title: "Leads — Quantum Surety Admin", description: "", canonical: "/admin/leads" });
  const qc = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>("new");
  const [editNotes, setEditNotes] = useState("");
  const [editSale, setEditSale] = useState("");

  const { data: leads = [], isLoading, refetch } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads"],
    queryFn: async () => {
      const r = await fetch("/api/admin/leads");
      if (!r.ok) throw new Error("Failed to fetch leads");
      return r.json();
    },
    refetchInterval: 60_000,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lead> }) => {
      const r = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error("Update failed");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({ title: "Lead updated" });
      setEditing(null);
    },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  function quickStatus(lead: Lead, status: LeadStatus) {
    updateMutation.mutate({ id: lead.id, data: { status } });
  }

  function openEdit(lead: Lead) {
    setEditing(lead);
    setEditStatus(lead.status);
    setEditNotes(lead.notes || "");
    setEditSale(lead.saleAmount || "");
  }

  function saveEdit() {
    if (!editing) return;
    updateMutation.mutate({
      id: editing.id,
      data: {
        status: editStatus,
        notes: editNotes,
        saleAmount: editSale || undefined,
      },
    });
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || "").includes(search);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  }).slice().reverse(); // newest first

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    sold: leads.filter(l => l.status === "sold").length,
    no_follow_up: leads.filter(l => l.status === "no_follow_up").length,
  };
  const revenue = leads.filter(l => l.status === "sold" && l.saleAmount)
    .reduce((s, l) => s + parseFloat(l.saleAmount!), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-sm text-gray-500 mt-1">Quantum Surety CRM</p>
          </div>
          <div className="flex gap-2">
            <a href="/admin">
              <Button variant="outline" size="sm">Admin Dashboard</Button>
            </a>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total", value: counts.all, color: "text-indigo-600" },
            { label: "New", value: counts.new, color: "text-red-600" },
            { label: "Contacted", value: counts.contacted, color: "text-yellow-600" },
            { label: "Sold", value: counts.sold, color: "text-green-600" },
            { label: "Revenue", value: `$${revenue.toFixed(0)}`, color: "text-green-600" },
          ].map(s => (
            <Card key={s.label} className="text-center py-3">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <CardContent className="pt-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search name, email, phone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {(["all", "new", "contacted", "sold", "no_follow_up"] as const).map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={filterStatus === s ? "default" : "outline"}
                  onClick={() => setFilterStatus(s)}
                >
                  {s === "all" ? `All (${counts.all})` :
                   s === "no_follow_up" ? `No Follow-up (${counts.no_follow_up})` :
                   `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leads table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
              {filterStatus !== "all" ? ` — ${filterStatus}` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading leads…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No leads found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Contact</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Bond Type</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Received</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Notes</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(lead => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900">{lead.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline flex items-center gap-1 text-xs">
                              <Mail className="w-3 h-3" />{lead.email}
                            </a>
                            <a href={`tel:${lead.phone}`} className="text-gray-700 hover:underline flex items-center gap-1 text-xs">
                              <Phone className="w-3 h-3" />{lead.phone}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{bondDisplay(lead.bondType)}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{fmtTime(lead.leadTime)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[lead.status]}`}>
                            {lead.status === "no_follow_up" ? "No Follow-up" : lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                          {lead.saleAmount && (
                            <div className="text-xs text-green-600 font-semibold mt-0.5 flex items-center gap-0.5">
                              <DollarSign className="w-3 h-3" />{parseFloat(lead.saleAmount).toFixed(0)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">
                          {lead.notes || <span className="italic text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {lead.status === "new" && (
                              <Button size="sm" variant="outline" className="h-7 text-xs px-2 text-yellow-700 border-yellow-300"
                                onClick={() => quickStatus(lead, "contacted")}>
                                Contacted
                              </Button>
                            )}
                            {lead.status !== "sold" && lead.status !== "no_follow_up" && (
                              <Button size="sm" variant="outline" className="h-7 text-xs px-2 text-green-700 border-green-300"
                                onClick={() => quickStatus(lead, "sold")}>
                                <CheckCircle2 className="w-3 h-3 mr-1" />Sold
                              </Button>
                            )}
                            {lead.status !== "no_follow_up" && (
                              <Button size="sm" variant="outline" className="h-7 text-xs px-2 text-gray-500"
                                onClick={() => quickStatus(lead, "no_follow_up")}>
                                <XCircle className="w-3 h-3 mr-1" />Skip
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 text-xs px-2"
                              onClick={() => openEdit(lead)}>
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Lead — {editing?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="text-sm text-gray-500 space-y-0.5">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{editing?.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{editing?.phone}</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{editing ? fmtTime(editing.leadTime) : ""}</div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Status</Label>
              <Select value={editStatus} onValueChange={v => setEditStatus(v as LeadStatus)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="no_follow_up">No Follow-up Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editStatus === "sold" && (
              <div>
                <Label className="text-xs font-semibold">Sale Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 39"
                  value={editSale}
                  onChange={e => setEditSale(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <Label className="text-xs font-semibold">Notes</Label>
              <Textarea
                placeholder="Add notes about this lead…"
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                className="mt-1 h-24 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
