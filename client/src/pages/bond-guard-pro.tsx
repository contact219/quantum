import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Bell, LayoutDashboard, RefreshCw, Zap, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "All Bonds, One Screen",
    body: "Add every TDLR license you hold — HVAC, electrical, plumbing, general contractor, AC. See status, expiry date, and days remaining at a glance.",
  },
  {
    icon: Bell,
    title: "Automated Expiry Alerts",
    body: "Email alerts at 30 days and again at 7 days before each bond expires. Never get caught with a lapsed license on an active job.",
  },
  {
    icon: RefreshCw,
    title: "Live Data, Daily Refresh",
    body: "Status pulled directly from TDLR and Texas SOS public records every day. What you see is what state inspectors see.",
  },
  {
    icon: Zap,
    title: "One-Click Renewal",
    body: "Each bond card links directly to renew that specific bond type with Quantum Surety — pre-filled, no hunting around.",
  },
];

const WHO = [
  { emoji: "⚡", trade: "Electricians", note: "TDLR Master + Journeyman bonds" },
  { emoji: "❄️", trade: "HVAC Contractors", note: "AC/refrigeration + general contractor bonds" },
  { emoji: "🔧", trade: "Plumbers", note: "Master plumber + contractor bonds" },
  { emoji: "🏗️", trade: "General Contractors", note: "Multiple specialty trade bonds" },
  { emoji: "🚗", trade: "Auto Dealers", note: "GDN bond + dealer license bonds" },
  { emoji: "🏠", trade: "Remodelers", note: "Roofing + general contractor + specialty bonds" },
];

export default function BondGuardPro() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      const res = await fetch("https://dashboard.quantumsurety.bond/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: "Error", description: data.error || "Something went wrong.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error — please try again.", variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Bond Guard Pro — Multi-Bond Compliance Dashboard for Texas Contractors | Quantum Surety</title>
        <meta name="description" content="Track all your Texas contractor bonds and TDLR licenses in one dashboard. Automated 30-day and 7-day expiry alerts. 14-day free trial, then $19.99/month." />
        <link rel="canonical" href="https://quantumsurety.bond/bond-guard-pro" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0f172a 0%,#0c2340 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 20, padding: "4px 16px", fontSize: 12, color: "#4ade80", marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>
            <Shield size={12} /> BOND GUARD PRO
          </div>
          <h1 style={{ fontSize: "clamp(30px,5vw,54px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
            Every Bond You Hold.<br />
            <span style={{ color: "#22c55e" }}>One Dashboard.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 580, margin: "0 auto 12px", lineHeight: 1.65 }}>
            Texas contractors hold 3–5 bonds simultaneously. Bond Guard Pro tracks all of them, sends expiry alerts before you lapse, and puts one-click renewal a tap away.
          </p>
          <p style={{ fontSize: 14, color: "#475569", marginBottom: 36 }}>
            14-day free trial · $19.99/month · Cancel anytime
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#signup">
              <Button size="lg" style={{ background: "#22c55e", color: "#000", fontWeight: 800, fontSize: 16, padding: "14px 32px" }}>
                Start Free Trial <ArrowRight size={16} style={{ marginLeft: 6 }} />
              </Button>
            </a>
            <a href="https://dashboard.quantumsurety.bond" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" style={{ fontSize: 15, padding: "14px 28px", borderColor: "#334155", color: "#94a3b8" }}>
                Log In
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: "#0f172a", borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", textAlign: "center", padding: "28px 24px", gap: 16 }}>
          {[
            { v: "3–5", l: "Bonds avg TX contractor holds" },
            { v: "816k+", l: "TDLR licensees tracked" },
            { v: "Daily", l: "Data refresh from TDLR" },
            { v: "$0", l: "Cost to add each bond" },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#22c55e" }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Who it's for */}
      <section style={{ background: "#0d1117", padding: "56px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 8 }}>Built for multi-license contractors</h2>
          <p style={{ color: "#64748b", textAlign: "center", fontSize: 14, marginBottom: 36 }}>If you hold more than one TDLR license, you need this.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
            {WHO.map(w => (
              <div key={w.trade} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24 }}>{w.emoji}</span>
                <div>
                  <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{w.trade}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{w.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#161b22", padding: "56px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 40 }}>What you get</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 12, padding: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={18} color="#22c55e" />
                </div>
                <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.65 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing + signup */}
      <section id="signup" style={{ background: "#0a0f1e", padding: "64px 24px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 4 }}>Start your free trial</h2>
          <p style={{ color: "#64748b", textAlign: "center", fontSize: 14, marginBottom: 32 }}>14 days free, then $19.99/month. Cancel anytime.</p>

          <div style={{ background: "#1e293b", border: "2px solid #22c55e", borderRadius: 14, padding: 32, marginBottom: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #334155" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#fff" }}>$19.99<span style={{ fontSize: 16, color: "#64748b", fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, marginTop: 4 }}>14-DAY FREE TRIAL</div>
            </div>
            <ul style={{ listStyle: "none", marginBottom: 28 }}>
              {[
                "Unlimited bonds tracked",
                "30-day + 7-day expiry alerts",
                "Daily TDLR & TX SOS data refresh",
                "One-click renewal for any bond type",
                "Magic-link login — no password needed",
                "Cancel anytime, no questions asked",
              ].map(f => (
                <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid #1e293b", color: "#94a3b8", fontSize: 13 }}>
                  <CheckCircle size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />{f}
                </li>
              ))}
            </ul>

            <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <Label style={{ color: "#64748b", fontSize: 10, letterSpacing: 1, fontFamily: "monospace", display: "block", marginBottom: 6 }}>FULL NAME *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith" required
                  style={{ background: "#0f172a", border: "1px solid #334155", color: "#f1f5f9" }} />
              </div>
              <div>
                <Label style={{ color: "#64748b", fontSize: 10, letterSpacing: 1, fontFamily: "monospace", display: "block", marginBottom: 6 }}>EMAIL ADDRESS *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@company.com" required
                  style={{ background: "#0f172a", border: "1px solid #334155", color: "#f1f5f9" }} />
              </div>
              <Button type="submit" disabled={loading}
                style={{ background: "#22c55e", color: "#000", fontWeight: 800, fontSize: 15, padding: "13px 0", marginTop: 4, width: "100%", border: "none", borderRadius: 8, cursor: "pointer" }}>
                {loading ? "Redirecting to checkout…" : "Start Free Trial →"}
              </Button>
              <p style={{ textAlign: "center", fontSize: 11, color: "#475569" }}>
                Secured by Stripe · No credit card required for trial
              </p>
            </form>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#475569" }}>
              Already a subscriber?{" "}
              <a href="https://dashboard.quantumsurety.bond" target="_blank" rel="noreferrer" style={{ color: "#22c55e" }}>
                Log in to your dashboard →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Compare to doing it manually */}
      <section style={{ background: "#0d1117", padding: "48px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ background: "#161b22", border: "1px solid #334155", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#fff" }}>The alternative:</strong> manually check TDLR's website for each of your 3–5 licenses, remember which ones expire in which months, and hope you don't forget one on a busy week.
              A lapsed bond means your TDLR license goes inactive — you can't legally work until it's reinstated.
              At $19.99/month, Bond Guard Pro costs less than a single hour of lost work.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
