import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useRoute } from "wouter";

const VERIFY_API = "https://verify.quantumsurety.bond/api";

interface Contractor {
  license_number: string;
  license_type: string;
  license_subtype: string;
  business_name: string;
  owner_name: string;
  business_address: string;
  business_city: string;
  business_county: string;
  business_phone: string;
  expire_date: string;
  days_until_expiry: number;
  status: "active" | "expiring" | "expired" | "unknown";
}

function statusInfo(s: string) {
  if (s === "active") return { label: "BOND ACTIVE", color: "#059669", bg: "rgba(5,150,105,0.1)" };
  if (s === "expiring") return { label: "EXPIRING SOON", color: "#d97706", bg: "rgba(217,119,6,0.1)" };
  if (s === "expired") return { label: "BOND LAPSED", color: "#dc2626", bg: "rgba(220,38,38,0.1)" };
  return { label: "UNKNOWN", color: "#6b7280", bg: "rgba(107,114,128,0.1)" };
}

export default function ContractorDetail() {
  const [, params] = useRoute("/contractor/:license");
  const license = params?.license ?? "";
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!license) return;
    setLoading(true);
    fetch(`${VERIFY_API}/contractor/lookup/${encodeURIComponent(license)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(d => { if (d) setContractor(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [license]);

  const si = contractor ? statusInfo(contractor.status) : statusInfo("unknown");
  const name = contractor?.business_name || contractor?.owner_name || license;
  const city = contractor?.business_city?.split(" ")[0] || contractor?.business_county || "Texas";
  const licType = contractor?.license_type || "Contractor";
  const expDate = contractor?.expire_date ? new Date(contractor.expire_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  const isExpired = contractor?.status === "expired";

  const pageTitle = contractor
    ? `${name} — ${licType} Bond Status | ${city}, TX | Quantum Surety`
    : `Contractor Bond Status — License ${license} | Quantum Surety`;
  const pageDesc = contractor
    ? `${name} (TDLR ${license}) — ${licType} in ${city}, Texas. Bond status: ${si.label}. Expires ${expDate}. Verified by Quantum Surety from TDLR public records.`
    : `Look up bond status for TDLR license ${license} — Texas contractor bond verification.`;

  const embedCode = contractor
    ? `<a href="https://verify.quantumsurety.bond/verify/contractor/${license}" target="_blank">\n  <img src="https://verify.quantumsurety.bond/api/badge/contractor/${license}" alt="Bond Status — ${name}" width="280" height="56">\n</a>`
    : "";

  const tweetText = contractor && contractor.status === "active"
    ? `✅ ${name} (TDLR #${license}) has an active surety bond — verified by @QuantumSurety. https://quantumsurety.bond/contractor/${license}`
    : contractor
    ? `⚠️ ${name} (TDLR #${license}) — bond status: ${si.label}. Check Texas contractor bonds: https://quantumsurety.bond/contractor/${license}`
    : "";

  const jsonLd = contractor ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": `${licType} licensed by TDLR in ${city}, Texas. Bond status: ${si.label}.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    ...(contractor.business_phone ? { "telephone": contractor.business_phone } : {}),
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "license",
      "name": `TDLR ${licType} License`,
      "identifier": license,
      "validFrom": contractor.expire_date ? new Date(new Date(contractor.expire_date).setFullYear(new Date(contractor.expire_date).getFullYear() - 2)).toISOString().slice(0, 10) : undefined,
      "validUntil": contractor.expire_date?.slice(0, 10),
    },
    "url": `https://quantumsurety.bond/contractor/${license}`,
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`https://quantumsurety.bond/contractor/${license}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`https://quantumsurety.bond/contractor/${license}`} />
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "48px 24px 36px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            TDLR LICENSE BOND VERIFICATION
          </div>

          {loading && (
            <p style={{ color: "#64748b", fontSize: 15 }}>Looking up license {license}…</p>
          )}

          {notFound && !loading && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 12 }}>License Not Found</h1>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>No TDLR record for license number <strong style={{ color: "#e2e8f0" }}>{license}</strong>.</p>
              <a href="https://verify.quantumsurety.bond" style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>Search All Contractors →</a>
            </>
          )}

          {contractor && !loading && (
            <>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: si.bg, border: `1px solid ${si.color}40`, borderRadius: 8, padding: "8px 18px", marginBottom: 16 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: si.color, display: "inline-block" }} />
                <span style={{ fontWeight: 800, color: si.color, fontSize: 14, fontFamily: "monospace", letterSpacing: 1 }}>{si.label}</span>
              </div>
              <h1 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 10px" }}>{name}</h1>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
                {licType} · TDLR #{license} · {city}, TX
              </p>

              {/* Detail grid */}
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24, textAlign: "left", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                  {[
                    { label: "License Number", value: license },
                    { label: "License Type", value: contractor.license_type },
                    { label: "License Subtype", value: contractor.license_subtype || "—" },
                    { label: "County", value: contractor.business_county || "—" },
                    { label: "City", value: city },
                    { label: "Bond Expiration", value: expDate, color: si.color },
                    ...(contractor.days_until_expiry > 0 ? [{ label: "Days Until Expiry", value: `${contractor.days_until_expiry} days`, color: si.color }] : []),
                    { label: "Phone", value: contractor.business_phone || "—" },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", letterSpacing: 1, marginBottom: 3 }}>{f.label.toUpperCase()}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: (f as any).color || "#e2e8f0" }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {isExpired && (
                <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ fontWeight: 800, color: "#dc2626", marginBottom: 6 }}>Bond Lapsed — Renew in Under 24 Hours</div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>TDLR requires an active surety bond to maintain your license. Renew online in minutes — instant electronic bond certificate.</p>
                  <Link href={`/get-bond?type=contractor&license=${license}&src=contractor-detail`}>
                    <span style={{ display: "inline-block", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}>
                      Renew Bond Now — from $50 →
                    </span>
                  </Link>
                </div>
              )}

              {/* Embed + share */}
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>Share & Embed Your Bond Status</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "#1d9bf0", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none" }}>
                    Share on X
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://quantumsurety.bond/contractor/${license}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "#0a66c2", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none" }}>
                    Share on LinkedIn
                  </a>
                  <a href={`https://verify.quantumsurety.bond/verify/contractor/${license}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                    Shareable Verify Link
                  </a>
                  <Link href={`/contractor/${license}/qr`}>
                    <span style={{ display: "inline-block", background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, cursor: "pointer", border: "1px solid rgba(245,158,11,0.3)" }}>
                      Print QR Code →
                    </span>
                  </Link>
                </div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", marginBottom: 6 }}>Add to your website (copy HTML):</div>
                <div
                  onClick={() => navigator.clipboard?.writeText(embedCode).catch(() => {})}
                  style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "10px 12px", fontFamily: "monospace", fontSize: 10, color: "#4C9AC9", whiteSpace: "pre-wrap", wordBreak: "break-all", cursor: "pointer" }}>
                  {embedCode}
                </div>
                <p style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>Click to copy · Shows live bond status from TDLR public records</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Data note */}
      <section style={{ background: "#0a0f1e", padding: "24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.6 }}>
            Data source: Texas Department of Licensing and Regulation (TDLR) via data.texas.gov. Updated daily. Bond status may have a 24-hour lag. &nbsp;
            <Link href="/bond-compliance-leaderboard"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>County Compliance Leaderboard</span></Link> &nbsp;·&nbsp;
            <a href="https://verify.quantumsurety.bond" style={{ color: "#4C9AC9" }}>Search All Contractors</a> &nbsp;·&nbsp;
            <Link href="/press"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Press Kit</span></Link>
          </p>
        </div>
      </section>
    </>
  );
}
