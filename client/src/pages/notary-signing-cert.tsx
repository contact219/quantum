import { useEffect, useState, useRef } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";

interface Notary {
  notary_id: string;
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  zip?: string;
  effective_date?: string;
  expire_date: string;
  surety_company?: string;
  agency?: string;
  days_until_expiry: number;
  status: "active" | "expiring" | "expired" | "unknown";
}

function parseCityFromAddress(address?: string): string {
  if (!address) return "";
  const lines = address.split("\n");
  const last = lines[lines.length - 1] || "";
  const match = last.match(/^([^,]+),\s*TX/);
  return match ? match[1].trim() : "";
}

export default function NotarySigningCert() {
  const { id } = useParams<{ id: string }>();
  const [notary, setNotary] = useState<Notary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const certDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const certTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });

  useEffect(() => {
    fetch(`https://verify.quantumsurety.bond/api/notary/lookup/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setNotary(d?.error ? null : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  function handleCopy() {
    navigator.clipboard.writeText(`https://quantumsurety.bond/notary/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0f1e", color: "#94a3b8", fontSize: 16 }}>Loading certificate…</div>;
  }

  if (!notary || notary.status === "expired") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0f1e", color: "#f1f5f9", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>
          {notary ? "Commission Expired — Certificate Unavailable" : "Notary Not Found"}
        </div>
        {notary && (
          <div style={{ color: "#94a3b8", fontSize: 14 }}>
            This notary's commission expired. Certificates can only be generated for notaries with an active commission.
          </div>
        )}
        <a href={`/notary/${id}`} style={{ marginTop: 20, color: "#f59e0b", fontSize: 14 }}>← View commission page</a>
      </div>
    );
  }

  const fullName = `${notary.first_name} ${notary.last_name}`.trim();
  const city = notary.city || parseCityFromAddress(notary.address);
  const expiryFormatted = notary.expire_date
    ? new Date(notary.expire_date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "N/A";
  const verifyUrl = `https://quantumsurety.bond/notary/${notary.notary_id}`;

  return (
    <>
      <Helmet>
        <title>{fullName} — Verified Texas Notary Signing Certificate | Quantum Surety</title>
        <meta name="description" content={`Signing certificate for Texas notary ${fullName}. Commission verified active through ${expiryFormatted} by Quantum Surety.`} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={{ background: "#0a0f1e", minHeight: "100vh", padding: "24px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

        {/* Print/share toolbar */}
        <div className="no-print" style={{ maxWidth: 640, margin: "0 auto 20px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => window.print()}
            style={{ flex: 1, minWidth: 140, background: "#f59e0b", color: "#0a0f1e", border: "none", borderRadius: 7, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            🖨️ Print / Save PDF
          </button>
          <button onClick={handleCopy}
            style={{ flex: 1, minWidth: 140, background: copied ? "#16a34a" : "rgba(255,255,255,0.06)", color: copied ? "#fff" : "#e2e8f0", border: "1px solid #334155", borderRadius: 7, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            {copied ? "✓ Link Copied!" : "🔗 Copy Verify Link"}
          </button>
          <a href={`/notary/${id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minWidth: 140, background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid #334155", borderRadius: 7, padding: "10px 18px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            ← Commission Page
          </a>
        </div>

        {/* Certificate */}
        <div id="cert" style={{
          maxWidth: 640, margin: "0 auto", background: "#fff", borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)", overflow: "hidden", color: "#1e293b"
        }}>

          {/* Header */}
          <div style={{ background: "#0a0f1e", padding: "28px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Certificate of Notary Verification</div>
            <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 22, letterSpacing: "-0.01em" }}>QUANTUM SURETY LLC</div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>TDI License #3480229 · Texas Licensed Surety Bond Agency</div>
          </div>

          {/* Body */}
          <div style={{ padding: "32px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>This certifies that the notary public named below has been verified by Quantum Surety LLC as holding an active Texas notary commission at the time of this certificate.</div>
            </div>

            {/* Notary block */}
            <div style={{ background: "#f8fafc", border: "2px solid #0a0f1e", borderRadius: 10, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{fullName}</div>
                {city && <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{city}, Texas{notary.zip ? ` ${notary.zip}` : ""}</div>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 7, padding: "10px 14px" }}>
                  <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Commission #</div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{notary.notary_id}</div>
                </div>
                <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 7, padding: "10px 14px" }}>
                  <div style={{ color: "#166534", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Status</div>
                  <div style={{ fontWeight: 800, color: "#166534" }}>✓ ACTIVE</div>
                </div>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 7, padding: "10px 14px" }}>
                  <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Commission Expires</div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{expiryFormatted}</div>
                </div>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 7, padding: "10px 14px" }}>
                  <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Surety Company</div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 12 }}>{notary.surety_company || "On file"}</div>
                </div>
              </div>
            </div>

            {/* Verification info */}
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 20px", marginBottom: 24, fontSize: 12, color: "#475569" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>Verified by:</span>
                <span>Quantum Surety LLC</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>Verification date:</span>
                <span>{certDate} at {certTime}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>Data source:</span>
                <span>Texas Secretary of State</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>Verify live:</span>
                <a href={verifyUrl} style={{ color: "#2563eb" }}>{verifyUrl}</a>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
              This certificate is generated from Texas Secretary of State public records and reflects commission status at the time of generation. Commission status may change. Scan the QR code or visit the verification URL above to confirm current status. Issued by Quantum Surety LLC, a TDI-licensed Texas surety bond agency (License #3480229). Not a government document.
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 11, color: "#64748b" }}>
              <strong style={{ color: "#0f172a" }}>quantumsurety.bond</strong> · (214) 666-8718
            </div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>Data: TX SOS Public Records</div>
          </div>
        </div>

        {/* How to use section */}
        <div className="no-print" style={{ maxWidth: 640, margin: "24px auto 0", padding: "20px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", borderRadius: 10 }}>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 15, marginBottom: 12 }}>How to use this certificate</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {[
              { icon: "📄", text: "Attach to notarized documents" },
              { icon: "📧", text: "Send to clients after a signing" },
              { icon: "🔗", text: "Include the verify link in your confirmation email" },
              { icon: "📱", text: "Screenshot and text to clients" },
            ].map(uc => (
              <div key={uc.text} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "#94a3b8", fontSize: 12 }}>
                <span>{uc.icon}</span>
                <span>{uc.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #cert { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </>
  );
}
