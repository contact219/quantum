import { useState } from "react";
import { CheckCircle, DollarSign, Users, TrendingUp, Link2, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const TIERS = [
  { label: "Starter", sales: "1–24 sales", rate: "15%", color: "#94a3b8", bg: "#1e293b" },
  { label: "Silver", sales: "25–99 sales", rate: "20%", color: "#e2e8f0", bg: "#1e293b" },
  { label: "Gold", sales: "100+ sales", rate: "25%", color: "#f59e0b", bg: "#1e293b" },
];

const BENEFITS = [
  { icon: DollarSign, title: "Up to 25% Commission", desc: "Earn on every bond sold through your referral link. Commission increases automatically as your sales volume grows." },
  { icon: TrendingUp, title: "Tiered Rewards", desc: "Start at 15% and unlock 20% at 25 sales, then 25% at 100 sales — no applications or approvals required." },
  { icon: Link2, title: "Your Own Referral Link", desc: "Unique link and code generated instantly. Works on every bond type we sell — notary, contractor, dealer, and more." },
  { icon: BarChart3, title: "Live Dashboard", desc: "Track every referral, see commission totals, and access marketing assets from your personal partner dashboard." },
  { icon: Users, title: "Who It's For", desc: "Notary training schools, insurance agents, real estate offices, CPAs, title companies, law firms — anyone with clients who need bonds." },
  { icon: CheckCircle, title: "Instant Activation", desc: "No waiting period. Register, get your link, and start earning in under 2 minutes." },
];

export default function PartnerProgram() {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashLink, setDashLink] = useState("");
  const [refCode, setRefCode] = useState("");
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://partners.quantumsurety.bond/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: data.error || "Registration failed. Please try again.", variant: "destructive" });
        return;
      }
      setRefCode(data.referral_code);
      setDashLink(data.dashboard_link);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({ title: "Error", description: "Could not reach the server. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">You're in!</h1>
          <p className="text-slate-400 mb-8 text-lg">Check your email for your dashboard link and referral code. You can start earning commissions right now.</p>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6 text-left">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Your Referral Code</p>
            <p className="text-3xl font-black text-amber-400 tracking-widest mb-5">{refCode}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Your Referral Link</p>
            <p className="text-sm text-blue-400 break-all">https://quantumsurety.bond/get-bond?ref={refCode}</p>
          </div>
          <a href={dashLink} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 bg-amber-400 text-black font-bold px-8 py-3 rounded-lg text-base hover:bg-amber-300 transition-colors">
            Open My Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
          Partner Program
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
          Earn Up to <span className="text-amber-400">25% Commission</span><br className="hidden sm:block"/> on Every Bond You Refer
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Share your unique link. When your clients buy a Texas bond through Quantum Surety, you earn — automatically, on every sale.
        </p>
        <div className="flex flex-wrap gap-4 justify-center text-sm text-slate-400 mb-10">
          {["Instant activation", "No approval process", "All bond types", "Live commission dashboard"].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />{t}
            </span>
          ))}
        </div>
        <a href="#signup">
          <Button size="lg" className="bg-amber-400 text-black hover:bg-amber-300 font-bold text-base px-8">
            Join the Partner Program <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </section>

      {/* Commission tiers */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-center text-2xl font-bold text-white mb-8">Commission Tiers</h2>
        <div className="grid grid-cols-3 gap-4">
          {TIERS.map((tier, i) => (
            <div key={tier.label}
              className={`rounded-xl border p-6 text-center ${i === 2 ? "border-amber-400/50 bg-amber-400/5" : "border-slate-700 bg-slate-900"}`}>
              <div className="text-3xl font-black mb-1" style={{ color: tier.color }}>{tier.rate}</div>
              <div className="text-white font-bold mb-1">{tier.label}</div>
              <div className="text-xs text-slate-500">{tier.sales}</div>
              {i === 2 && <div className="mt-3 text-xs bg-amber-400/10 text-amber-400 rounded-full px-2 py-0.5 font-semibold">Auto-unlock</div>}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">Tier upgrades happen automatically when your cumulative sales hit the threshold — no need to ask.</p>
      </section>

      {/* Benefits grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Signup form */}
      <section id="signup" className="max-w-lg mx-auto px-4 pb-24">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Join the Program</h2>
          <p className="text-slate-400 text-sm mb-6">Free to join. Your referral link is generated instantly.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-slate-300 text-sm mb-1.5 block">Full Name *</Label>
              <Input
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jane Smith" required
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-400"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm mb-1.5 block">Email Address *</Label>
              <Input
                type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@company.com" required
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">Company</Label>
                <Input
                  value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Optional"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-400"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-sm mb-1.5 block">Phone</Label>
                <Input
                  type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="Optional"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-400"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-amber-400 text-black hover:bg-amber-300 font-bold text-base py-5 mt-2">
              {loading ? "Creating your account…" : "Get My Referral Link →"}
            </Button>
            <p className="text-center text-xs text-slate-600">
              Already a partner?{" "}
              <a href="https://partners.quantumsurety.bond" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                Log in to your dashboard
              </a>
            </p>
          </form>
        </div>
      </section>

    </div>
  );
}
