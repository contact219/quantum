import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Phone, Mail, CheckCircle2, XCircle, DollarSign, Clock, Search,
  RefreshCw, PlusCircle, Download, Trash2, TrendingUp, AlertCircle,
} from "lucide-react";

type LeadStatus = "new" | "contacted" | "sold" | "no_follow_up";
type DateRange = "today" | "week" | "month" | "all";

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

const BOND_TYPES = [
  { value: "notary", label: "Texas Notary Bond" },
  { value: "dealer", label: "Texas GDN Dealer Bond" },
  { value: "gdn", label: "Texas GDN Dealer Bond (alt)" },
  { value: "contractor", label: "Texas Contractor License Bond" },
  { value: "construction", label: "Texas Construction Bond" },
  { value: "bid", label: "Texas Bid Bond" },
  { value: "performance", label: "Texas Performance & Payment Bond" },
  { value: "payment", label: "Texas Payment Bond" },
  { value: "mortgage", label: "Texas Mortgage Broker Bond" },
  { value: "credit-access-business", label: "Texas Credit Access Business Bond" },
  { value: "collection-agency", label: "Texas Collection Agency Bond" },
  { value: "property-tax-consultant", label: "Texas Property Tax Consultant Bond" },
];

const BOND_LABELS: Record<string, string> = Object.fromEntries(BOND_TYPES.map(b => [b.value, b.label]));

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

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function startOf(range: DateRange): Date {
  const now = new Date();
  if (range === "today") {
    const d = new Date(now); d.setHours(0, 0, 0, 0); return d;
  }
  if (range === "week") {
    const d = new Date(now); d.setDate(d.getDate() - 6); d.setHours(0, 0, 0, 0); return d;
  }
  if (range === "month") {
    const d = new Date(now); d.setDate(1); d.setHours(0, 0, 0, 0); return d;
  }
  return new Date(0);
}

function exportCSV(rows: Lead[]) {
  const headers = ["Name", "Email", "Phone", "Bond Type", "Status", "Sale Amount", "Notes", "Source", "Received"];
  const lines = rows.map(l => [
    l.name, l.email, l.phone, bondDisplay(l.bondType), l.status,
    l.saleAmount || "", (l.notes || "").replace(/\n/g, " "), l.source || "",
    fmtTime(l.leadTime),
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  a.download = `qs-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function AdminLeads() {
  useSEO({ title: "Leads — Quantum Surety Admin", description: "", canonical: "/admin/leads" });
  const qc = useQueryClient();
  const { toast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBond, setFilterBond] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  // Edit dialog
  const [editing, setEditing] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>("new");
  const [editNotes, setEditNotes] = useState("");
  const [editSale, setEditSale] = useState("");

  // New lead dialog
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBond, setNewBond] = useState("");
  const [newSource, setNewSource] = useState("manual entry");
  const [newNotes, setNewNotes] = useState("");

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/leads"] }); toast({ title: "Lead updated" }); setEditing(null); },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  const createMutation = useMutation({
    mutationFn: async (data: object) => {
      const r = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error("Create failed");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({ title: "Lead created" });
      setNewOpen(false);
      setNewName(""); setNewEmail(""); setNewPhone(""); setNewBond(""); setNewSource("manual entry"); setNewNotes("");
    },
    onError: () => toast({ title: "Create failed", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Delete failed");
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/leads"] }); toast({ title: "Lead deleted" }); setDeleteTarget(null); },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  function quickStatus(lead: Lead, status: LeadStatus) {
    updateMutation.mutate({ id: lead.id, data: { status } });
  }

  function openEdit(lead: Lead) {
    setEditing(lead); setEditStatus(lead.status);
    setEditNotes(lead.notes || ""); setEditSale(lead.saleAmount || "");
  }

  function saveEdit() {
    if (!editing) return;
    updateMutation.mutate({ id: editing.id, data: { status: editStatus, notes: editNotes, saleAmount: editSale || undefined } });
  }

  function submitNewLead() {
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim()) {
      toast({ title: "Name, email, and phone are required", variant: "destructive" }); return;
    }
    createMutation.mutate({ name: newName, email: newEmail, phone: newPhone, bondType: newBond || null, source: newSource, notes: newNotes || null });
  }

  // Compute stats relative to time periods
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

  const stats = useMemo(() => {
    const newToday = leads.filter(l => l.status === "new" && new Date(l.leadTime) >= todayStart).length;
    const newWeek = leads.filter(l => l.status === "new" && new Date(l.leadTime) >= weekStart).length;
    const soldMonth = leads
      .filter(l => l.status === "sold" && l.saleAmount && new Date(l.leadTime) >= monthStart)
      .reduce((s, l) => s + parseFloat(l.saleAmount!), 0);
    const totalRevenue = leads.filter(l => l.status === "sold" && l.saleAmount)
      .reduce((s, l) => s + parseFloat(l.saleAmount!), 0);
    const counts = {
      all: leads.length,
      new: leads.filter(l => l.status === "new").length,
      contacted: leads.filter(l => l.status === "contacted").length,
      sold: leads.filter(l => l.status === "sold").length,
      no_follow_up: leads.filter(l => l.status === "no_follow_up").length,
    };
    return { newToday, newWeek, soldMonth, totalRevenue, counts };
  }, [leads]);

  const filtered = useMemo(() => {
    const cutoff = startOf(dateRange);
    return leads.filter(l => {
      if (new Date(l.leadTime) < cutoff) return false;
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) &&
          !l.email.toLowerCase().includes(search.toLowerCase()) &&
          !(l.phone || "").includes(search)) return false;
      if (filterStatus !== "all" && l.status !== filterStatus) return false;
      if (filterBond !== "all" && (l.bondType || "").toLowerCase() !== filterBond) return false;
      return true;
    }).slice().reverse();
  }, [leads, search, filterStatus, filterBond, dateRange]);

  const DATE_TABS: { key: DateRange; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "all", label: "All Time" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quantum Surety CRM — {leads.length} total leads</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href="/admin"><Button variant="outline" size="sm">Admin Dashboard</Button></a>
            <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-1" />Refresh</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)}>
              <Download className="w-4 h-4 mr-1" />Export CSV
            </Button>
            <Button size="sm" onClick={() => setNewOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-1" />New Lead
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "New Today", value: stats.newToday, color: "text-red-600", icon: <AlertCircle className="w-4 h-4" /> },
            { label: "New This Week", value: stats.newWeek, color: "text-orange-500", icon: <TrendingUp className="w-4 h-4" /> },
            { label: "All New", value: stats.counts.new, color: "text-red-500", icon: null },
            { label: "Contacted", value: stats.counts.contacted, color: "text-yellow-600", icon: null },
            { label: "Sold", value: stats.counts.sold, color: "text-green-600", icon: null },
            { label: "Rev This Month", value: `$${stats.soldMonth.toFixed(0)}`, color: "text-green-600", icon: <DollarSign className="w-4 h-4" /> },
          ].map(s => (
            <Card key={s.label} className="text-center py-3 px-2">
              <div className={`text-xl font-bold ${s.color} flex items-center justify-center gap-1`}>
                {s.icon}{s.value}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <CardContent className="pt-4 space-y-3">
            {/* Date range tabs */}
            <div className="flex gap-1 flex-wrap">
              {DATE_TABS.map(t => (
                <Button key={t.key} size="sm"
                  variant={dateRange === t.key ? "default" : "outline"}
                  onClick={() => setDateRange(t.key)}
                  className="h-8 text-xs"
                >
                  {t.label}
                </Button>
              ))}
            </div>
            {/* Search + status + bond type */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses ({stats.counts.all})</SelectItem>
                  <SelectItem value="new">New ({stats.counts.new})</SelectItem>
                  <SelectItem value="contacted">Contacted ({stats.counts.contacted})</SelectItem>
                  <SelectItem value="sold">Sold ({stats.counts.sold})</SelectItem>
                  <SelectItem value="no_follow_up">No Follow-up ({stats.counts.no_follow_up})</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBond} onValueChange={setFilterBond}>
                <SelectTrigger className="w-48 h-8 text-xs">
                  <SelectValue placeholder="All Bond Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bond Types</SelectItem>
                  {BOND_TYPES.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads table */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
              {dateRange !== "all" ? ` — ${DATE_TABS.find(t => t.key === dateRange)?.label}` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading leads…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No leads match your filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Contact</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Bond Type</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Received</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Source</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Notes</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(lead => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{lead.name}</td>
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
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{bondDisplay(lead.bondType)}</td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-700 font-medium">{timeAgo(lead.leadTime)}</div>
                          <div className="text-xs text-gray-400">{fmtTime(lead.leadTime)}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 max-w-[100px] truncate">{lead.source || "—"}</td>
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
                        <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px] truncate">
                          {lead.notes || <span className="italic text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {lead.status === "new" && (
                              <Button size="sm" variant="outline" className="h-7 text-xs px-2 text-yellow-700 border-yellow-300"
                                onClick={() => quickStatus(lead, "contacted")}>
                                <Clock className="w-3 h-3 mr-1" />Contacted
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
                              onClick={() => openEdit(lead)}>Edit</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteTarget(lead)}>
                              <Trash2 className="w-3 h-3" />
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
          <DialogHeader><DialogTitle>Update Lead — {editing?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="text-sm text-gray-500 space-y-0.5 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{editing?.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{editing?.phone}</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{editing ? fmtTime(editing.leadTime) : ""}</div>
              {editing?.source && <div className="text-xs text-gray-400">Source: {editing.source}</div>}
            </div>
            <div>
              <Label className="text-xs font-semibold">Status</Label>
              <Select value={editStatus} onValueChange={v => setEditStatus(v as LeadStatus)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                <Input type="number" placeholder="e.g. 50" value={editSale} onChange={e => setEditSale(e.target.value)} className="mt-1" />
              </div>
            )}
            <div>
              <Label className="text-xs font-semibold">Notes</Label>
              <Textarea placeholder="Add notes about this lead…" value={editNotes} onChange={e => setEditNotes(e.target.value)} className="mt-1 h-24 resize-none" />
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

      {/* New Lead Dialog */}
      <Dialog open={newOpen} onOpenChange={open => { if (!open) setNewOpen(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Name *</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-semibold">Phone *</Label>
                <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(555) 555-5555" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Email *</Label>
              <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@example.com" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Bond Type</Label>
              <Select value={newBond} onValueChange={setNewBond}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select bond type…" /></SelectTrigger>
                <SelectContent>
                  {BOND_TYPES.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Source</Label>
              <Input value={newSource} onChange={e => setNewSource(e.target.value)} placeholder="e.g. phone call, referral, trade show" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Notes</Label>
              <Textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Any initial notes…" className="mt-1 h-20 resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={submitNewLead} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Saving…" : "Add Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Lead?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600 py-2">
            Permanently delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})?
            This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
