import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearch } from "wouter";

export default function NotarySchoolPartner() {
  const search = useSearch();
  const params = new URLSearchParams(search || "");
  const ref = params.get("ref") || "";
  const isStudent = !!ref || params.get("student") === "1";

  const applyLink = `https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&State=TX${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`;

  if (isStudent) return <StudentView applyLink={applyLink} />;
  return <PartnerView />;
}

function StudentView({ applyLink }: { applyLink: string }) {
  return (
    <>
      <Helmet>
        <title>Get Your Texas Notary Bond — Recommended by Your Training School | Quantum Surety</title>
        <meta name="description" content="Your notary training school recommended Quantum Surety for your Texas notary bond. $50 flat, instant PDF certificate, SB693-compliant. Ready in 10 minutes." />
        <link rel="canonical" href="https://quantumsurety.bond/notary-school-partner" />
      </Helmet>

      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#1e1b4b 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, color: "#6ee7b7", letterSpacing: 2, marginBottom: 20 }}>
            SCHOOL RECOMMENDED
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: "0 0 16px" }}>
            Your Notary Training Is Complete —<br />Get Your Bond in 10 Minutes
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px" }}>
            Your training school recommended Quantum Surety for your Texas notary bond. $50 flat, instant PDF certificate.
          </p>
          <a
            href={applyLink}
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-block", background: "#10b981", color: "#fff", fontWeight: 800, fontSize: 18, padding: "16px 36px", borderRadius: 12, textDecoration: "none" }}
          >
            Get My $50 Notary Bond →
          </a>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 28, flexWrap: "wrap" }}>
            {["Same-day PDF certificate", "RLI Insurance (A-rated)", "SB693-compliant"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "#6ee7b7", fontSize: 13, fontWeight: 600 }}>
                <span style={{ fontSize: 16 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 72px" }}>
        <div style={{ background: "#fffbeb", border: "2px solid #f59e0b", borderRadius: 12, padding: "20px 24px", marginBottom: 36 }}>
          <div style={{ fontWeight: 800, color: "#92400e", fontSize: 15, marginBottom: 6 }}>⚠️ Don't forget SB693</div>
          <p style={{ color: "#78350f", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Texas SB693 requires a 2-hour online notary training course ($20, paid to the state) at{" "}
            <a href="https://sos.texas.gov/notary" target="_blank" rel="noreferrer" style={{ color: "#b45309", fontWeight: 700 }}>sos.texas.gov/notary</a>{" "}
            before filing your commission renewal. Make sure you've completed it before submitting your application.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 36 }}>
          {[
            { icon: "⚡", title: "Same-Day Delivery", body: "Your bond certificate arrives by email — usually within hours of purchase." },
            { icon: "🛡️", title: "A-Rated Underwriter", body: "Underwritten by RLI Insurance Company, A-rated by AM Best. Accepted by the Texas Secretary of State." },
            { icon: "🔔", title: "Free Renewal Reminders", body: "We'll remind you 90, 60, and 30 days before your bond expires — so you're never lapsed." },
          ].map(c => (
            <div key={c.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 16px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{c.body}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "24px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12 }}>
          <p style={{ color: "#166534", fontSize: 14, marginBottom: 16 }}>Not sure if you're SB693-ready? Check your compliance status first.</p>
          <Link href="/sb693-compliance-check">
            <span style={{ display: "inline-block", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>
              Check SB693 Compliance →
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}

function PartnerView() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ org: "", contact: "", email: "", website: "", students: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.contact,
          email: form.email,
          phone: "",
          bond_type: "partner-referral",
          source: "notary-school-partner-page",
          notes: JSON.stringify({ org: form.org, website: form.website, monthly_students: form.students }),
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  return (
    <>
      <Helmet>
        <title>Notary Training School Partner Program — Quantum Surety Bonds</title>
        <meta name="description" content="Earn 10% commission on every Texas notary bond your students purchase. Partner with Quantum Surety — Texas' leading same-day notary bond agency. No paperwork, instant setup." />
        <link rel="canonical" href="https://quantumsurety.bond/notary-school-partner" />
      </Helmet>

      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#1e1b4b 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, color: "#f59e0b", letterSpacing: 2, marginBottom: 20 }}>
            TRAINING SCHOOL PARTNERS
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Partner With Texas' #1 Notary Bond Agency
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 0" }}>
            Recommend Quantum Surety to your students and earn 10% on every bond purchase — forever.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 80px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#1e293b" }}>

        {/* Benefit cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 56 }}>
          {[
            { icon: "💵", title: "$5 per bond, per student", body: "10% of every $50 bond purchase goes to your organization. Students renew every 4 years — you earn on each renewal." },
            { icon: "🔗", title: "Dedicated co-branded link", body: "One custom URL to share. Every click is tracked. Referral credits applied automatically — no forms for you to fill." },
            { icon: "⚡", title: "Instant bonds for your students", body: "$50 flat, same-day PDF certificate, SB693-compliant process, free renewal reminders. Zero friction at purchase." },
          ].map(c => (
            <div key={c.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 8 }}>{c.title}</div>
              <div style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{c.body}</div>
            </div>
          ))}
        </div>

        {/* Application form */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Apply to Become a Partner</h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              We'll set up your custom referral link within 1 business day and send it to you by email. No paperwork, no integration work.
            </p>

            {submitted ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                <div style={{ fontWeight: 800, color: "#166534", fontSize: 16, marginBottom: 8 }}>Application Received</div>
                <p style={{ color: "#166534", fontSize: 14, margin: 0 }}>We'll email your co-branded referral link within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { key: "org", label: "Organization name", placeholder: "Texas Notary Academy" },
                  { key: "contact", label: "Your name", placeholder: "Jane Smith" },
                  { key: "email", label: "Email address", placeholder: "jane@example.com", type: "email" },
                  { key: "website", label: "Website", placeholder: "https://yourschool.com" },
                  { key: "students", label: "Approx. students per month", placeholder: "50" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{f.label}</label>
                    <input
                      type={f.type || "text"}
                      required
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: "#4f46e5", color: "#fff", fontWeight: 800, fontSize: 15, padding: "13px", borderRadius: 10, border: "none", cursor: "pointer", opacity: submitting ? 0.7 : 1, marginTop: 4 }}
                >
                  {submitting ? "Submitting…" : "Apply for Partner Link →"}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>How It Works</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { q: "How does the referral commission work?", a: "You earn 10% of every bond premium — $5 per $50 bond. We pay monthly via check or ACH for all referrals tracked to your link. Students renewing their bond in 4 years count again." },
                { q: "What do my students get?", a: "$50 flat for a 4-year Texas notary bond, underwritten by A-rated RLI Insurance Company. Instant PDF delivery. SB693-compliant process with built-in renewal reminders." },
                { q: "How do I track referrals?", a: "Your partner dashboard at partners.quantumsurety.bond shows every referral, status, and commission in real time. No spreadsheets." },
                { q: "Is there a minimum volume requirement?", a: "No. Whether you refer 2 students or 200, you earn the same rate. There's no paperwork, no integration, and no minimum." },
              ].map(faq => (
                <div key={faq.q} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13, marginBottom: 5 }}>{faq.q}</div>
                  <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>{faq.a}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 4 }}>Already a partner?</div>
              <a href="https://partners.quantumsurety.bond" target="_blank" rel="noreferrer" style={{ color: "#4f46e5", fontSize: 13, fontWeight: 600 }}>
                Log in to your partner dashboard →
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 56, borderTop: "1px solid #e2e8f0", paddingTop: 32, textAlign: "center" }}>
          <div style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>Questions? We'll respond same day.</div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>📞 (214) 666-8718 · ✉️ administrator@quantumsurety.bond</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8 }}>Quantum Surety Bonds · TDI Licensed Agency #3480229</div>
        </div>
      </div>
    </>
  );
}
