import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, CheckCircle, Clock, Mail, ShieldCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";

const BOND_TYPES = [
  "Performance Bond",
  "Payment Bond",
  "Bid Bond",
  "License & Permit Bond",
  "Maintenance Bond",
  "Subdivision Bond",
  "Site Improvement Bond",
  "Supply Bond",
  "Notary Bond",
  "BMC-84 Freight Broker Bond",
  "Court / Judicial Bond",
  "Other",
];

export default function Renewals() {
  useSEO({
    title: "Bond Renewal Reminders | Quantum Surety",
    description: "Never let your surety bond lapse. Sign up for free automatic renewal reminders at 90, 60, and 30 days before expiration.",
    canonical: "/renewals",
  });

  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    contactName: "",
    companyName: "",
    bondType: "",
    bondNumber: "",
    expirationDate: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.bondType || !form.expirationDate) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast({ title: "Error", description: data.error || "Something went wrong.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-renewals">
            <Bell className="w-4 h-4 mr-1" />
            Free Service
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-renewals-headline">
            Bond Renewal Reminders
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Never let your surety bond lapse. We'll remind you at 90, 60, and 30 days before expiration — completely free.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why it matters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold mb-2">Lapsed Bonds Are Costly</h3>
              <p className="text-sm text-muted-foreground">A lapsed bond can halt your projects, void contracts, and risk your contractor license. One missed renewal can cost far more than the bond itself.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold mb-2">3 Timely Reminders</h3>
              <p className="text-sm text-muted-foreground">We send automated email alerts at 90, 60, and 30 days before your bond expires — giving you plenty of time to renew without rush fees or coverage gaps.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-2">Always in Good Standing</h3>
              <p className="text-sm text-muted-foreground">Stay compliant with state licensing requirements and project obligees. Continuous coverage builds trust with owners and keeps your license active.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3" data-testid="text-success">You're Registered!</h2>
                  <p className="text-muted-foreground mb-6">
                    We've sent a confirmation to <strong>{form.email}</strong>. You'll receive reminders at 90, 60, and 30 days before your bond expires.
                  </p>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ email: "", contactName: "", companyName: "", bondType: "", bondNumber: "", expirationDate: "" }); }} data-testid="button-register-another">
                    Register Another Bond
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Register Your Bond</CardTitle>
                  <CardDescription>Enter your bond details and we'll take care of the rest. No account needed.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Your Name</Label>
                        <Input
                          id="contactName"
                          placeholder="Jane Smith"
                          value={form.contactName}
                          onChange={(e) => handleChange("contactName", e.target.value)}
                          data-testid="input-contact-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Smith Construction LLC"
                          value={form.companyName}
                          onChange={(e) => handleChange("companyName", e.target.value)}
                          data-testid="input-company-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@smithconstruction.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bondType">Bond Type <span className="text-destructive">*</span></Label>
                      <Select value={form.bondType} onValueChange={(v) => handleChange("bondType", v)} required>
                        <SelectTrigger id="bondType" data-testid="select-bond-type">
                          <SelectValue placeholder="Select bond type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {BOND_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bondNumber">Bond Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input
                          id="bondNumber"
                          placeholder="e.g. 12345678"
                          value={form.bondNumber}
                          onChange={(e) => handleChange("bondNumber", e.target.value)}
                          data-testid="input-bond-number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expirationDate">Expiration Date <span className="text-destructive">*</span></Label>
                        <Input
                          id="expirationDate"
                          type="date"
                          value={form.expirationDate}
                          onChange={(e) => handleChange("expirationDate", e.target.value)}
                          required
                          data-testid="input-expiration-date"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit">
                      {loading ? "Registering..." : "Set Up My Reminders"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Free service. No spam. Unsubscribe any time.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="w-4 h-4" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { day: "Today", text: "Confirmation email sent immediately" },
                  { day: "90 Days Out", text: "First reminder — start renewal process" },
                  { day: "60 Days Out", text: "Second reminder — confirm renewal is underway" },
                  { day: "30 Days Out", text: "Final reminder — bond must be renewed" },
                ].map((item) => (
                  <div key={item.day} className="flex gap-3 items-start">
                    <Badge variant="outline" className="shrink-0 text-xs">{item.day}</Badge>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-2">Need to Renew Now?</h4>
                <p className="text-sm text-muted-foreground mb-4">If your bond is expiring soon, we can expedite renewal — often same day.</p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/quote">Get a Renewal Quote</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
