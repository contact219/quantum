import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, DollarSign, RefreshCw, Truck } from "lucide-react";

interface Bmc84Bond {
  id: string;
  brokerName: string;
  brokerEmail: string;
  companyName: string;
  mcNumber: string | null;
  annualPremium: string;
  commissionAmount: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  expirationDate: string | null;
  isMigrationFromBmc85: boolean;
  carrierName: string | null;
  filing: {
    status: string;
    paymentReceivedAt: string | null;
    carrierNotifiedAt: string | null;
    fmcsaConfirmedAt: string | null;
    slaBreached: boolean;
  } | null;
  renewal: {
    dueDate: string;
    status: string;
    reminder60SentAt: string | null;
    reminder30SentAt: string | null;
  } | null;
}

interface Bmc84Metrics {
  totalBonds: number;
  activeBonds: number;
  pendingPayment: number;
  pendingFiling: number;
  totalAnnualPremium: number;
  totalCommissionEarned: number;
  migrationFromBmc85: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  quote:           { label: "Quote",         color: "bg-gray-100 text-gray-700" },
  payment_pending: { label: "Awaiting pmt",  color: "bg-yellow-100 text-yellow-700" },
  paid:            { label: "Paid — File!",  color: "bg-orange-100 text-orange-700" },
  filing_sent:     { label: "Filing sent",   color: "bg-blue-100 text-blue-700" },
  active:          { label: "Active",        color: "bg-green-100 text-green-700" },
  renewal_pending: { label: "Renewal due",   color: "bg-purple-100 text-purple-700" },
  expired:         { label: "Expired",       color: "bg-red-100 text-red-700" },
  cancelled:       { label: "Cancelled",     color: "bg-gray-100 text-gray-500" },
};

function hoursAgo(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 3600000;
}

export function Bmc84AdminPanel() {
  const qc = useQueryClient();
  const [selectedBond, setSelectedBond] = useState<Bmc84Bond | null>(null);
  const [filingNote, setFilingNote] = useState("");
  const [fmcsaRef, setFmcsaRef] = useState("");

  const { data: bonds = [], isLoading } = useQuery<Bmc84Bond[]>({
    queryKey: ["/api/admin/bmc84/bonds"],
    refetchInterval: 60_000,
  });

  const { data: metrics } = useQuery<Bmc84Metrics>({
    queryKey: ["/api/admin/bmc84/metrics"],
  });

  const updateFilingStatus = useMutation({
    mutationFn: ({ bondId, status, fmcsaRef, notes }: {
      bondId: string; status: string; fmcsaRef?: string; notes?: string;
    }) =>
      apiRequest("PATCH", `/api/bmc84/${bondId}/filing-status`, { status, fmcsaConfirmationRef: fmcsaRef, notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/bmc84/bonds"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/bmc84/metrics"] });
      setSelectedBond(null);
    },
  });

  const processRenewals = useMutation({
    mutationFn: () => apiRequest("POST", "/api/bmc84/process-renewals", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/bmc84/bonds"] }),
  });

  const needsAction = bonds.filter(
    b => b.status === "paid" || b.status === "filing_sent" ||
      (b.filing?.slaBreached && b.status !== "active")
  );

  const renewalsDue = bonds.filter(
    b => b.renewal && new Date(b.renewal.dueDate) <= new Date(Date.now() + 30 * 86400000)
      && b.renewal.status !== "renewed"
  );

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading BMC-84 data...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck,       label: "Active bonds",        value: metrics?.activeBonds ?? 0,                      sub: "FMCSA active" },
          { icon: DollarSign,  label: "Annual premium",      value: `$${(metrics?.totalAnnualPremium ?? 0).toLocaleString()}`, sub: "Recurring/yr" },
          { icon: DollarSign,  label: "Your commissions",    value: `$${(metrics?.totalCommissionEarned ?? 0).toLocaleString()}`, sub: "At 20% rate" },
          { icon: RefreshCw,   label: "BMC-85 migrations",   value: metrics?.migrationFromBmc85 ?? 0,               sub: "Converted" },
        ].map(m => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <m.icon className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-gray-500">{m.label}</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{m.value}</div>
              <div className="text-xs text-gray-400">{m.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {needsAction.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-4 h-4" />
              Filing queue — {needsAction.length} bond{needsAction.length !== 1 ? "s" : ""} need action
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  {["Company", "Broker", "MC#", "Premium", "Paid", "SLA", "Action"].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {needsAction.map(bond => {
                  const hours = bond.filing?.paymentReceivedAt
                    ? hoursAgo(bond.filing.paymentReceivedAt)
                    : null;
                  const slaOk = hours !== null && hours < 24;
                  return (
                    <tr key={bond.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{bond.companyName}</td>
                      <td className="px-4 py-3 text-gray-600">{bond.brokerName}</td>
                      <td className="px-4 py-3 text-gray-500">{bond.mcNumber || "—"}</td>
                      <td className="px-4 py-3">${parseFloat(bond.annualPremium).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {bond.paidAt ? new Date(bond.paidAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {hours !== null ? (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${slaOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {hours.toFixed(1)}h {slaOk ? "✓" : "⚠️ BREACHED"}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {bond.status === "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => updateFilingStatus.mutate({ bondId: bond.id, status: "notified" })}
                            >
                              Mark carrier notified
                            </Button>
                          )}
                          {bond.status === "filing_sent" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => updateFilingStatus.mutate({ bondId: bond.id, status: "filed" })}
                            >
                              Mark FMCSA filed
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="text-xs bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setSelectedBond(bond)}
                          >
                            Confirm active
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {selectedBond && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-base">Confirm BMC-84 Active — {selectedBond.companyName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the FMCSA confirmation reference to mark this bond as active. This notifies the broker and starts their renewal clock.
              </p>
              <div>
                <label className="text-xs text-gray-500 block mb-1">FMCSA confirmation reference (optional)</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. FMCSA-2026-XXXXXX"
                  value={fmcsaRef}
                  onChange={e => setFmcsaRef(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Internal notes</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Carrier contact, filing details, etc."
                  value={filingNote}
                  onChange={e => setFilingNote(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => updateFilingStatus.mutate({
                    bondId: selectedBond.id,
                    status: "confirmed",
                    fmcsaRef,
                    notes: filingNote,
                  })}
                  disabled={updateFilingStatus.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Active + Notify Broker
                </Button>
                <Button variant="outline" onClick={() => setSelectedBond(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {renewalsDue.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-600" />
                Renewals due within 30 days — {renewalsDue.length} bond{renewalsDue.length !== 1 ? "s" : ""}
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => processRenewals.mutate()}
                disabled={processRenewals.isPending}
              >
                {processRenewals.isPending ? "Sending..." : "Send all reminders"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  {["Company", "Broker", "Expires", "Premium", "60-day", "30-day", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renewalsDue.map(bond => (
                  <tr key={bond.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{bond.companyName}</td>
                    <td className="px-4 py-3 text-gray-600">{bond.brokerEmail}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {bond.renewal ? new Date(bond.renewal.dueDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">${parseFloat(bond.annualPremium).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {bond.renewal?.reminder60SentAt ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <Clock className="w-4 h-4 text-gray-300 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {bond.renewal?.reminder30SentAt ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <Clock className="w-4 h-4 text-gray-300 mx-auto" />}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[bond.status]?.color || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_CONFIG[bond.status]?.label || bond.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All BMC-84 bonds — {bonds.length} total</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {bonds.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No BMC-84 bonds yet. Once your first freight broker applies, they'll appear here.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  {["Company", "Broker", "MC#", "Premium", "Commission", "Status", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bonds.map(bond => (
                  <tr key={bond.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {bond.companyName}
                      {bond.isMigrationFromBmc85 && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">BMC-85 migr.</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{bond.brokerName}</td>
                    <td className="px-4 py-3 text-gray-500">{bond.mcNumber || "—"}</td>
                    <td className="px-4 py-3">${parseFloat(bond.annualPremium).toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-700 font-medium">
                      ${parseFloat(bond.commissionAmount || "0").toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[bond.status]?.color || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_CONFIG[bond.status]?.label || bond.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(bond.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
