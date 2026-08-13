import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRoute } from "wouter";

const VERIFY_API = "https://verify.quantumsurety.bond/api";

interface Notary {
  notary_id: string;
  first_name: string;
  last_name: string;
  expire_date: string;
  days_until_expiry: number;
  status: string;
}

export default function NotaryQR() {
  const [, params] = useRoute("/notary/:id/qr");
  const notaryId = params?.id ?? "";
  const [notary, setNotary] = useState<Notary | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!notaryId) return;
    fetch(`${VERIFY_API}/notary/lookup/${encodeURIComponent(notaryId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setNotary(d))
      .catch(() => {});
  }, [notaryId]);

  const verifyUrl = `https://verify.quantumsurety.bond/verify/notary/${notaryId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}&bgcolor=0a0f1e&color=f59e0b&margin=10`;
  const qrPrint = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff&color=000000&margin=20`;

  const fullName = notary ? `${notary.first_name} ${notary.last_name}`.trim() : `Notary ${notaryId}`;
  const status = notary?.status || "unknown";
  const statusColor = status === "active" ? "#059669" : status === "expiring" ? "#d97706" : status === "expired" ? "#dc2626" : "#6b7280";
  const statusLabel = status === "active" ? "COMMISSION ACTIVE" : status === "expiring" ? "EXPIRING SOON" : status === "expired" ? "COMMISSION LAPSED" : "UNKNOWN";

  const embedHtml = `<!-- Quantum Surety Notary Commission QR Code -->
<div style="text-align:center;font-family:sans-serif;padding:12px;border:1px solid #e2e8f0;border-radius:8px;max-width:200px">
  <img src="${qrPrint}" width="180" height="180" alt="Scan to verify notary commission">
  <div style="font-size:11px;color:#64748b;margin-top:6px">Scan to verify commission<br>${fullName}</div>
</div>`;

  const title = notary
    ? `${fullName} — Notary Commission QR Code | Quantum Surety`
    : `Notary Commission QR Code — ID ${notaryId} | Quantum Surety`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Printable commission verification QR code for ${fullName} (TX Notary #${notaryId}). Scan to see live commission status from Texas SOS public records.`} />
        <link rel="canonical" href={`https://quantumsurety.bond/notary/${notaryId}/qr`} />
      </Helmet>

      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "52px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            PRINTABLE NOTARY COMMISSION QR
          </div>
          <h1 style={{ fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 8px" }}>
            Notary Commission QR Code
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>
            Add to your stamp bag, email signature, or client documents. Anyone can scan to verify your active Texas commission.
          </p>

          {/* QR Card */}
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 16, padding: 32, display: "inline-block", marginBottom: 24 }}>
            <img src={qrUrl} width={220} height={220} alt={`Commission QR for ${fullName}`} style={{ display: "block", borderRadius: 8 }} />
            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{fullName}</div>
            {notary && (
              <div style={{ marginTop: 4, fontSize: 11, fontFamily: "monospace", color: statusColor, fontWeight: 800, letterSpacing: 1 }}>
                {statusLabel}
              </div>
            )}
            <div style={{ marginTop: 4, fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
              TX Notary #{notaryId} · QUANTUM SURETY
            </div>
          </div>

          {/* Download options */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
            <a href={qrPrint} download={`notary-qr-${notaryId}.png`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>
              Download Print-Quality PNG →
            </a>
            <a href={verifyUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              View Live Commission Status
            </a>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ background: "#0d1117", padding: "36px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 20, textAlign: "center" }}>Where to Use Your QR</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { icon: "📝", label: "Notarized Docs", desc: "Stamp with QR so clients verify instantly" },
              { icon: "📧", label: "Email Signature", desc: "Add to every client email" },
              { icon: "💼", label: "Business Card", desc: "Print on back of your card" },
              { icon: "🌐", label: "Website", desc: "Paste the embed code below" },
              { icon: "📋", label: "Rate Sheet", desc: "Include with your services list" },
              { icon: "📱", label: "Scheduling Texts", desc: "Share verify link when confirming appts" },
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

      {/* Renewal CTA */}
      <section style={{ background: "#0a0f1e", padding: "36px 24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          {status === "expired" ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#dc2626", marginBottom: 8 }}>Commission Lapsed — QR shows EXPIRED to clients</div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Renew your notary bond so this QR shows ACTIVE. Texas $10,000 notary bond — $50 flat, instant certificate.</p>
              <a href={`https://quantumsurety.bond/get-bond?type=notary&utm_source=notary-qr&id=${notaryId}`}
                style={{ display: "inline-block", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
                Renew Notary Bond — $50 →
              </a>
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#059669", marginBottom: 8 }}>Commission active — show it off</div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Keep your bond current so this QR always shows green. Quantum Surety handles renewal reminders automatically.</p>
              <a href={`https://quantumsurety.bond/get-bond?type=notary&utm_source=notary-qr-cta&id=${notaryId}`}
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
