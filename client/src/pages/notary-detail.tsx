import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useRoute } from "wouter";

const VERIFY_API = "https://verify.quantumsurety.bond/api";

interface Notary {
  notary_id: string;
  first_name: string;
  last_name: string;
  county: string;
  city?: string;
  commission_date?: string;
  expire_date: string;
  days_until_expiry: number;
  status: "active" | "expiring" | "expired" | "unknown";
}

function statusInfo(s: string) {
  if (s === "active") return { label: "COMMISSION ACTIVE", color: "#059669", bg: "rgba(5,150,105,0.1)" };
  if (s === "expiring") return { label: "EXPIRING SOON", color: "#d97706", bg: "rgba(217,119,6,0.1)" };
  if (s === "expired") return { label: "COMMISSION LAPSED", color: "#dc2626", bg: "rgba(220,38,38,0.1)" };
  return { label: "UNKNOWN", color: "#6b7280", bg: "rgba(107,114,128,0.1)" };
}

export default function NotaryDetail() {
  const [, params] = useRoute("/notary/:id");
  const notaryId = params?.id ?? "";
  const [notary, setNotary] = useState<Notary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!notaryId) return;
    setLoading(true);
    fetch(`${VERIFY_API}/notary/lookup/${encodeURIComponent(notaryId)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(d => { if (d) setNotary(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [notaryId]);

  const si = notary ? statusInfo(notary.status) : statusInfo("unknown");
  const fullName = notary ? `${notary.first_name} ${notary.last_name}`.trim() : notaryId;
  const county = notary?.county || "Texas";
  const city = notary?.city || county;
  const isExpired = notary?.status === "expired";
  const isExpiring = notary?.status === "expiring";

  const expDate = notary?.expire_date
    ? new Date(notary.expire_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";
  const commDate = notary?.commission_date
    ? new Date(notary.commission_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  const verifyUrl = `https://verify.quantumsurety.bond/verify/notary/${notaryId}`;
  const pageUrl = `https://quantumsurety.bond/notary/${notaryId}`;

  const pageTitle = notary
    ? `${fullName} — Texas Notary Commission Status | ${county} County | Quantum Surety`
    : `Texas Notary Commission — ID ${notaryId} | Quantum Surety`;
  const pageDesc = notary
    ? `${fullName} (TX Notary #${notaryId}) — ${county} County. Commission status: ${si.label}. Expires ${expDate}. Verified from Texas SOS public records.`
    : `Look up Texas notary commission status for notary ID ${notaryId}.`;

  const tweetText = notary && notary.status === "active"
    ? `✅ ${fullName} (TX Notary #${notaryId}) has an active notary commission — verified by @QuantumSurety. ${pageUrl}`
    : notary
    ? `⚠️ ${fullName} (TX Notary #${notaryId}) — commission: ${si.label}. Check Texas notary status: ${pageUrl}`
    : "";

  const embedCode = notary
    ? `<a href="${verifyUrl}" target="_blank">\n  <img src="https://verify.quantumsurety.bond/api/badge/notary/${notaryId}" alt="Notary Commission — ${fullName}" width="280" height="56">\n</a>`
    : "";

  const jsonLd = notary ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": fullName,
    "description": `Texas Notary Public in ${county} County. Commission status: ${si.label}.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "commission",
      "name": "Texas Notary Public Commission",
      "identifier": notaryId,
      ...(notary.commission_date ? { "validFrom": notary.commission_date.slice(0, 10) } : {}),
      "validUntil": notary.expire_date?.slice(0, 10),
    },
    "url": pageUrl,
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "48px 24px 36px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            TEXAS NOTARY COMMISSION VERIFICATION
          </div>

          {loading && (
            <p style={{ color: "#64748b", fontSize: 15 }}>Looking up notary {notaryId}…</p>
          )}

          {notFound && !loading && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 12 }}>Notary Not Found</h1>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>No Texas SOS record for notary ID <strong style={{ color: "#e2e8f0" }}>{notaryId}</strong>.</p>
              <a href="https://verify.quantumsurety.bond" style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>Search All Notaries →</a>
            </>
          )}

          {notary && !loading && (
            <>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: si.bg, border: `1px solid ${si.color}40`, borderRadius: 8, padding: "8px 18px", marginBottom: 16 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: si.color, display: "inline-block" }} />
                <span style={{ fontWeight: 800, color: si.color, fontSize: 14, fontFamily: "monospace", letterSpacing: 1 }}>{si.label}</span>
              </div>
              <h1 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 10px" }}>{fullName}</h1>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
                Texas Notary Public · ID #{notaryId} · {county} County, TX
              </p>

              {/* Detail grid */}
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24, textAlign: "left", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                  {[
                    { label: "Notary ID", value: notaryId },
                    { label: "Full Name", value: fullName },
                    { label: "County", value: county },
                    ...(city && city !== county ? [{ label: "City", value: city }] : []),
                    ...(commDate ? [{ label: "Commission Date", value: commDate }] : []),
                    { label: "Commission Expires", value: expDate, color: si.color },
                    ...(notary.days_until_expiry > 0 ? [{ label: "Days Until Expiry", value: `${notary.days_until_expiry} days`, color: si.color }] : []),
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", letterSpacing: 1, marginBottom: 3 }}>{f.label.toUpperCase()}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: (f as any).color || "#e2e8f0" }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Renewal CTA */}
              {(isExpired || isExpiring) && (
                <div style={{ background: isExpired ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)", border: `1px solid ${isExpired ? "rgba(220,38,38,0.25)" : "rgba(217,119,6,0.25)"}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ fontWeight: 800, color: isExpired ? "#dc2626" : "#d97706", marginBottom: 6 }}>
                    {isExpired ? "Commission Lapsed — Renew to Remain Active" : "Commission Expiring Soon — Renew Now"}
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>
                    Texas notaries must maintain an active $10,000 surety bond throughout their commission. Renew your notary bond online in minutes — instant electronic certificate.
                  </p>
                  <Link href={`/get-bond?type=notary&src=notary-detail&id=${notaryId}`}>
                    <span style={{ display: "inline-block", background: isExpired ? "#dc2626" : "#d97706", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}>
                      Renew Notary Bond — $50 Flat →
                    </span>
                  </Link>
                </div>
              )}

              {/* Share & embed */}
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>Share & Embed Commission Status</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "#1d9bf0", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none" }}>
                    Share on X
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "#0a66c2", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none" }}>
                    Share on LinkedIn
                  </a>
                  <a href={verifyUrl}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                    Shareable Verify Link
                  </a>
                </div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", marginBottom: 6 }}>Add to your website or email signature (copy HTML):</div>
                <div
                  onClick={() => navigator.clipboard?.writeText(embedCode).catch(() => {})}
                  style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "10px 12px", fontFamily: "monospace", fontSize: 10, color: "#4C9AC9", whiteSpace: "pre-wrap", wordBreak: "break-all", cursor: "pointer" }}>
                  {embedCode}
                </div>
                <p style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>Click to copy · Shows live commission status from Texas SOS public records</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Data note */}
      <section style={{ background: "#0a0f1e", padding: "24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.6 }}>
            Data source: Texas Secretary of State public records. Updated monthly. Commission status may have a 24-hour lag. &nbsp;
            <a href="https://verify.quantumsurety.bond" style={{ color: "#4C9AC9" }}>Search All Notaries</a> &nbsp;·&nbsp;
            <Link href="/bonds/notary-bond-texas"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Texas Notary Bond</span></Link> &nbsp;·&nbsp;
            <Link href="/press"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Press Kit</span></Link>
          </p>
        </div>
      </section>
    </>
  );
}
