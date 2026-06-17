import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Copy, Check } from "lucide-react";

const VERIFY_BASE = "https://verify.quantumsurety.bond";

const BOND_LABELS: Record<string, string> = {
  notary: "Texas Notary Bond",
  dealer: "Texas GDN Dealer Bond",
  gdn: "Texas GDN Dealer Bond",
  contractor: "Texas Contractor License Bond",
};

const BOND_ID_LABELS: Record<string, string> = {
  notary: "Texas Notary ID (from your TX SOS certificate)",
  dealer: "TxDMV License Number",
  gdn: "TxDMV License Number",
  contractor: "TDLR License Number",
};

const BOND_TYPES: Record<string, "notary" | "contractor"> = {
  notary: "notary",
  dealer: "contractor",
  gdn: "contractor",
  contractor: "contractor",
};

export default function BondBadgeSetup() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const type = (params.get("type") || "notary").toLowerCase();
  const rawNext = params.get("next") || "";
  const next = rawNext.startsWith("http") ? rawNext : "";
  const badgeType = BOND_TYPES[type] || "notary";
  const bondLabel = BOND_LABELS[type] || "Texas Surety Bond";
  const idLabel = BOND_ID_LABELS[type] || "License ID";

  const [licenseId, setLicenseId] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const embedCode = licenseId.trim()
    ? `<a href="${VERIFY_BASE}/verify/${badgeType}/${encodeURIComponent(licenseId.trim())}" target="_blank" rel="noopener">\n  <img src="${VERIFY_BASE}/api/badge/${badgeType}/${encodeURIComponent(licenseId.trim())}" alt="Bond Verified by Quantum Surety" width="280" height="56">\n</a>`
    : `<a href="${VERIFY_BASE}" target="_blank" rel="noopener">\n  <img src="${VERIFY_BASE}/api/badge/${badgeType}/YOUR_LICENSE_ID" alt="Bond Verified by Quantum Surety" width="280" height="56">\n</a>`;

  useEffect(() => {
    if (licenseId.trim()) {
      setPreviewUrl(`${VERIFY_BASE}/api/badge/${badgeType}/${encodeURIComponent(licenseId.trim())}`);
    } else {
      setPreviewUrl("");
    }
  }, [licenseId, badgeType]);

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const s: Record<string, React.CSSProperties> = {
    page:    { minHeight: "100vh", background: "#0a0f1e", color: "#e2e8f0", fontFamily: "-apple-system,sans-serif", padding: "40px 20px" },
    card:    { maxWidth: 560, margin: "0 auto", background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "36px 32px" },
    tag:     { display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 },
    h1:      { fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 8px" },
    sub:     { fontSize: 14, color: "#8b949e", margin: "0 0 28px" },
    divider: { height: 1, background: "#21262d", margin: "28px 0" },
    step:    { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 },
    num:     { minWidth: 28, height: 28, borderRadius: "50%", background: "#f59e0b", color: "#000", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" },
    stepTxt: { flex: 1 },
    stepH:   { fontWeight: 700, color: "#e2e8f0", fontSize: 15, marginBottom: 4 },
    stepP:   { fontSize: 13, color: "#8b949e", lineHeight: 1.5, margin: 0 },
    btn:     { display: "block", width: "100%", background: "#f59e0b", color: "#000", border: "none", borderRadius: 8, padding: "14px 0", fontWeight: 800, fontSize: 15, cursor: "pointer", textAlign: "center", textDecoration: "none", marginBottom: 10 },
    btnGhost:{ display: "block", width: "100%", background: "transparent", color: "#8b949e", border: "1px solid #30363d", borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 14, cursor: "pointer", textAlign: "center", textDecoration: "none" },
    label:   { display: "block", fontSize: 11, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 },
    input:   { width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "10px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" },
    codeWrap:{ position: "relative", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "14px 44px 14px 14px", marginTop: 10 },
    code:    { fontFamily: "monospace", fontSize: 11, color: "#4C9AC9", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 },
    copyBtn: { position: "absolute", top: 10, right: 10, background: "transparent", border: "none", cursor: "pointer", color: "#64748b", padding: 4 },
    preview: { margin: "14px 0 0", textAlign: "center" },
    hint:    { marginTop: 12, fontSize: 12, color: "#475569", lineHeight: 1.6 },
  };

  return (
    <>
      <Helmet>
        <title>One More Step — Add Your Bond Badge | Quantum Surety</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.tag}>APPLICATION SUBMITTED</div>
          <h1 style={s.h1}>You're almost bonded!</h1>
          <p style={s.sub}>Complete your purchase, then add your free trust badge to your website.</p>

          <div style={s.step}>
            <div style={s.num}>1</div>
            <div style={s.stepTxt}>
              <div style={s.stepH}>Complete your {bondLabel} purchase</div>
              <p style={s.stepP}>You'll receive your certificate and bond number by email. Takes about 2 minutes.</p>
            </div>
          </div>
          {next && badgeType === "contractor" ? (
            <>
              <a href={next} style={s.btn}>Complete My Application →</a>
              <a href="tel:+12146668718" style={{ ...s.btnGhost, marginBottom: 10 }}>
                Or call us now: (214) 666-8718
              </a>
              <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>
                A licensed agent is reviewing your request. Most contractor bonds are approved same-day.
              </p>
            </>
          ) : next ? (
            <a href={next} style={s.btn}>Complete Purchase →</a>
          ) : null}

          <div style={s.divider} />

          <div style={s.step}>
            <div style={s.num}>2</div>
            <div style={s.stepTxt}>
              <div style={s.stepH}>Add your free bond badge to your website</div>
              <p style={s.stepP}>Shows clients your bond is active. Updates live from state records — no maintenance needed.</p>
            </div>
          </div>

          <label style={s.label}>{idLabel.toUpperCase()}</label>
          <input
            style={s.input}
            placeholder="Enter your ID to preview your badge"
            value={licenseId}
            onChange={e => setLicenseId(e.target.value)}
          />
          {previewUrl && (
            <div style={s.preview}>
              <img src={previewUrl} alt="Your bond badge preview" width={280} height={56} style={{ borderRadius: 6 }} />
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <label style={s.label}>EMBED CODE — PASTE INTO YOUR WEBSITE</label>
            <div style={s.codeWrap}>
              <pre style={s.code}>{embedCode}</pre>
              <button style={s.copyBtn} onClick={copyEmbed} title="Copy embed code">
                {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <p style={s.hint}>Works on Wix, Squarespace, WordPress, GoDaddy — paste into any HTML block or widget.</p>

          <div style={s.divider} />

          <a href="https://verify.quantumsurety.bond" target="_blank" rel="noopener" style={s.btnGhost}>
            Look up your bond on the verification portal →
          </a>
        </div>
      </div>
    </>
  );
}
