import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRoute } from "wouter";

const VERIFY_API = "https://verify.quantumsurety.bond/api";

interface Contractor {
  license_number: string;
  license_type: string;
  business_name: string;
  owner_name: string;
  business_city: string;
  expire_date: string;
  days_until_expiry: number;
  status: string;
}

export default function ContractorQR() {
  const [, params] = useRoute("/contractor/:license/qr");
  const license = params?.license ?? "";
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!license) return;
    fetch(`${VERIFY_API}/contractor/lookup/${encodeURIComponent(license)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setContractor(d))
      .catch(() => {});
  }, [license]);

  const verifyUrl = `https://verify.quantumsurety.bond/verify/contractor/${license}`;
  // QR Server free API — returns a PNG QR code image
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}&bgcolor=0a0f1e&color=f59e0b&margin=10`;
  const qrPrint = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff&color=000000&margin=20`;

  const name = contractor?.business_name || contractor?.owner_name || `Contractor ${license}`;
  const status = contractor?.status || "unknown";
  const statusColor = status === "active" ? "#059669" : status === "expiring" ? "#d97706" : status === "expired" ? "#dc2626" : "#6b7280";
  const statusLabel = status === "active" ? "BOND ACTIVE" : status === "expiring" ? "EXPIRING SOON" : status === "expired" ? "BOND LAPSED" : "UNKNOWN";

  const embedHtml = `<!-- Quantum Surety Bond Verification QR Code -->
<div style="text-align:center;font-family:sans-serif;padding:12px;border:1px solid #e2e8f0;border-radius:8px;max-width:200px">
  <img src="${qrPrint}" width="180" height="180" alt="Scan to verify bond status">
  <div style="font-size:11px;color:#64748b;margin-top:6px">Scan to verify bond<br>${name}</div>
</div>`;

  const title = contractor
    ? `${name} — Bond Verification QR Code | Quantum Surety`
    : `Bond Verification QR Code — License ${license} | Quantum Surety`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Printable bond verification QR code for ${name} (TDLR ${license}). Scan to see live bond status from Texas public records.`} />
        <link rel="canonical" href={`https://quantumsurety.bond/contractor/${license}/qr`} />
      </Helmet>

      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "52px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            PRINTABLE BOND VERIFICATION QR
          </div>
          <h1 style={{ fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 8px" }}>
            Bond Status QR Code
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>
            Print on your truck, yard sign, or business card. Customers scan to see your live bond status.
          </p>

          {/* QR Card - dark version */}
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 16, padding: 32, display: "inline-block", marginBottom: 24 }}>
            <img src={qrUrl} width={220} height={220} alt={`Bond verification QR for ${name}`} style={{ display: "block", borderRadius: 8 }} />
            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{name}</div>
            {contractor && (
              <div style={{ marginTop: 4, fontSize: 11, fontFamily: "monospace", color: statusColor, fontWeight: 800, letterSpacing: 1 }}>
                {statusLabel}
              </div>
            )}
            <div style={{ marginTop: 4, fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
              TDLR #{license} · QUANTUM SURETY
            </div>
          </div>

          {/* Download options */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
            <a href={qrPrint} download={`bond-qr-${license}.png`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>
              Download Print-Quality PNG →
            </a>
            <a href={verifyUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              View Live Bond Status
            </a>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ background: "#0d1117", padding: "36px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 20, textAlign: "center" }}>Put It Everywhere</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { icon: "🚛", label: "Work Truck", desc: "Magnetic decal on your door" },
              { icon: "🪧", label: "Yard Sign", desc: "Scannable by homeowners at jobsite" },
              { icon: "💼", label: "Business Card", desc: "Add to the back of your card" },
              { icon: "🌐", label: "Website", desc: "Paste the embed code below" },
              { icon: "📧", label: "Email Signature", desc: "Link your verify page" },
              { icon: "📄", label: "Proposals", desc: "Include in bid documents" },
            ].map(u => (
              <div key={u.label} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{u.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{u.label}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{u.desc}</div>
              </div>
            ))}
          </div>

          {/* Website embed code */}
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 10 }}>Copy to Your Website</div>
            <div
              onClick={() => { navigator.clipboard?.writeText(embedHtml).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "10px 12px", fontFamily: "monospace", fontSize: 10, color: "#4C9AC9", whiteSpace: "pre-wrap", wordBreak: "break-all", cursor: "pointer", marginBottom: 8 }}>
              {embedHtml}
            </div>
            <button
              onClick={() => { navigator.clipboard?.writeText(embedHtml).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 5, padding: "6px 16px", fontSize: 12, color: copied ? "#059669" : "#8b949e", cursor: "pointer", fontFamily: "monospace" }}>
              {copied ? "Copied!" : "Copy HTML"}
            </button>
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section style={{ background: "#0a0f1e", padding: "36px 24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          {status === "expired" ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#dc2626", marginBottom: 8 }}>Bond Lapsed — QR shows EXPIRED to customers</div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Renew your bond so this QR code shows ACTIVE. Fast online renewal — bond certificate emailed in minutes.</p>
              <a href={`https://quantumsurety.bond/get-bond?type=contractor&license=${license}&src=qr-page`}
                style={{ display: "inline-block", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
                Renew Bond Now — from $50 →
              </a>
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#059669", marginBottom: 8 }}>Your bond is active — show it off</div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Keep your bond current so this QR always shows green. Quantum Surety handles renewal — automated reminders included.</p>
              <a href="https://quantumsurety.bond/get-bond?src=qr-cta"
                style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
                Get a Renewal Reminder →
              </a>
            </>
          )}
        </div>
      </section>
    </>
  );
}
