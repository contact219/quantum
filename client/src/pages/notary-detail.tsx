import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useRoute } from "wouter";

const VERIFY_API = "https://verify.quantumsurety.bond/api";

interface Notary {
  notary_id: string;
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  effective_date?: string;
  expire_date: string;
  surety_company?: string;
  agency?: string;
  days_until_expiry: number;
  status: "active" | "expiring" | "expired" | "unknown";
  qs_score?: number;
  qs_grade?: string;
  qs_label?: string;
  qs_color?: string;
  /** When this row was last pulled from the Texas SOS file, e.g. "2026-08-01T07:02:38.000Z". */
  updated_at?: string;
}

/**
 * The Texas SOS no longer exposes a per-notary URL. The old
 * direct.sos.state.tx.us/notaries/NotarySearch.asp now JavaScript-redirects to
 * an Appian portal, and the SOS site's own "Notary Public Search" link points at
 * that portal's root. So we link the portal and tell the reader what to type.
 * Do not invent a deep link — there isn't one.
 */
const TX_SOS_NOTARY_PORTAL = "https://texas-sos.appianportalsgov.com/sos-direct";

function parseCityFromAddress(address?: string): string {
  if (!address) return "";
  const lines = address.split("\n");
  const last = lines[lines.length - 1] || "";
  const match = last.match(/^([^,]+),\s*TX/);
  return match ? match[1].trim() : "";
}

/**
 * Parse a YYYY-MM-DD date as LOCAL midnight.
 *
 * `new Date("2026-07-28")` is parsed as UTC midnight, which renders as July 27
 * anywhere west of Greenwich. This page tells a notary when their own commission
 * expires, so a one-day shift is not cosmetic — it is wrong.
 */
function localDate(raw?: string): Date | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function longDate(raw?: string): string {
  const d = localDate(raw);
  return d ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
}

/** Whole days from today (local midnight) to `date`. Negative once it has passed. */
function daysFromToday(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / 86_400_000);
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * Status display.
 *
 * The finding gets real semantic colour, because the finding is the most important
 * object on this page: valid (green), valid-but-ending (amber), not valid (red),
 * unknown (neutral slate) must be separable at a glance, without reading the label.
 *
 * An earlier pass made all four statuses identical grey to stop the record echoing
 * the renewal CTA's palette. That solved the collision from the wrong end — an
 * active and an expired commission became visually indistinguishable, so a stranger
 * had to read the words to learn whether a notary was valid. The separation is now
 * kept by demoting the CTA (see the renewal card below, which is neutral and
 * outlined) rather than by muting the record.
 *
 * Colour is never the only cue: the marker stays filled when the commission is
 * valid today and hollow when it is not, and the label and verdict sentence say it
 * in words, so the distinction survives greyscale and colour-blindness.
 *
 * Contrast, computed (not eyeballed) against the pill fill over both ends of the
 * hero gradient #0a0f1e → #111827, worst case of the two:
 *   valid   #4ade80 on rgba(74,222,128,0.12)  → 7.99:1
 *   ending  #fbbf24 on rgba(251,191,36,0.12)  → 8.38:1
 *   invalid #f87171 on rgba(248,113,113,0.12) → 5.44:1
 *   unknown #cbd5e1 on rgba(255,255,255,0.05) → 10.47:1
 *   unknown border #8792a3                    → 4.94:1
 * Borders reuse the text colour (6.41:1 worst case, red on the gradient).
 *
 * `label` is the pill (caps, monospace); `plain` is for prose, meta descriptions
 * and structured data.
 */
function statusInfo(s: string) {
  const tint = (hex: string, rgb: string) => ({ color: hex, bg: `rgba(${rgb},0.12)`, border: hex });
  if (s === "active") return { ...tint("#4ade80", "74,222,128"), label: "COMMISSION ACTIVE", plain: "Active", filled: true };
  if (s === "expiring") return { ...tint("#fbbf24", "251,191,36"), label: "ACTIVE — EXPIRES SOON", plain: "Active, expires soon", filled: true };
  if (s === "expired") return { ...tint("#f87171", "248,113,113"), label: "COMMISSION EXPIRED", plain: "Expired", filled: false };
  return { color: "#cbd5e1", bg: "rgba(255,255,255,0.05)", border: "#8792a3", label: "STATUS UNKNOWN", plain: "Unknown", filled: false };
}

/**
 * Publisher disclosure for the RECORD PROVENANCE block.
 *
 * This page reports whether a commission is valid and, when it has lapsed, sells
 * the remedy a few hundred pixels later. That the publisher profits from one of the
 * outcomes it reports is a fact about the record, so it is stated in the record's
 * own voice, above the data, rather than buried in the advertisement.
 *
 * The agency-of-record sentence is derived, never hardcoded: `agency` is the bond
 * agency the state has on file. When it is us, that is a stronger conflict than
 * when it is someone else, and it is said plainly rather than softened or omitted.
 * Matching is case-insensitive on "quantum" because the source data is free text
 * ("Quantum Surety", "QUANTUM SURETY LLC", …).
 */
function publisherDisclosure(agency?: string): string {
  const a = (agency || "").trim();
  const base =
    "Quantum Surety is a licensed Texas bond agency (TDI license #3480229) that sells notary bonds, "
    + "including renewals of commissions like this one. It has no role in this commission and cannot "
    + "issue, change or revoke it.";
  if (!a) return `${base} The source record does not state which bond agency is on file for this notary.`;
  if (/quantum/i.test(a)) {
    return `${base} Quantum Surety is itself the bond agency on file for this notary, recorded as `
      + `"${a}", so this page reports on its own customer — a closer commercial interest in this record, not a lesser one.`;
  }
  return `${base} The bond agency on file for this notary is ${a}, not Quantum Surety.`;
}

/**
 * The one sentence this page exists to answer: is this person a valid Texas notary
 * right now? Written for someone who was sent the link and knows nothing about
 * notary commissions — third person, no jargon, no abbreviations, no pill to decode.
 *
 * `expDate` must come from longDate()/localDate(). Never format the date here with
 * `new Date(raw).toLocaleDateString()`: that parses YYYY-MM-DD as UTC midnight and
 * renders the day before anywhere west of Greenwich.
 */
function verdictSentence(name: string, status: string, expDate: string): string {
  if (status === "active") {
    return expDate
      ? `${name} is currently commissioned as a Texas notary. The commission runs through ${expDate}.`
      : `${name} is currently commissioned as a Texas notary.`;
  }
  if (status === "expiring") {
    return expDate
      ? `${name} is currently commissioned as a Texas notary. The commission is valid through ${expDate}. After that date it is no longer valid unless it is renewed.`
      : `${name} is currently commissioned as a Texas notary. The commission is near the end of its term, and is no longer valid once it expires unless it is renewed.`;
  }
  if (status === "expired") {
    return expDate
      ? `This commission expired on ${expDate}. It is not currently valid, and ${name} is not commissioned as a Texas notary today.`
      : `This commission has expired. It is not currently valid, and ${name} is not commissioned as a Texas notary today.`;
  }
  return `The state record for this commission does not show a current status, so whether ${name} is commissioned today cannot be answered from this page. Check the Texas Secretary of State search below.`;
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
  const resolvedCity = notary?.city || parseCityFromAddress(notary?.address);
  const location = [resolvedCity, notary?.state || "TX"].filter(Boolean).join(", ") || "Texas";
  const isExpired = notary?.status === "expired";
  const isExpiring = notary?.status === "expiring";

  const expDate = longDate(notary?.expire_date);
  const commDate = longDate(notary?.effective_date);
  // Real retrieval timestamp from the lookup API — not a vague "updated monthly".
  const retrievedDate = longDate(notary?.updated_at);

  const correctionMailto =
    `mailto:administrator@quantumsurety.bond`
    + `?subject=${encodeURIComponent(`Correction request — TX Notary #${notaryId}`)}`
    + `&body=${encodeURIComponent(
        `Notary ID: ${notaryId}\nPage: https://quantumsurety.bond/notary/${notaryId}\n\nWhat is wrong with this record:\n`
      )}`;

  // Days to (or since) expiry, computed from the date rather than the API's
  // days_until_expiry so the sign is always meaningful for lapsed commissions.
  const expObj = localDate(notary?.expire_date);
  const days = expObj ? daysFromToday(expObj) : null;

  // Speak to where this person actually is in their commission, using their own date.
  const ctaHeadline = isExpired
    ? (expDate
        ? `Commission lapsed ${expDate}`
        : "Commission Lapsed — Renew to Remain Active")
    : (expDate
        ? (days === 0 ? `Commission expires today — ${expDate}`
          : days === 1 ? `Commission expires tomorrow — ${expDate}`
          : `Commission expires ${expDate}`)
        : "Commission Expiring Soon — Renew Now");

  const lapsedPrefix = days === null || days >= 0 ? ""
    : days === -1 ? "That was yesterday. "
    : `That was ${plural(Math.abs(days), "day")} ago. `;
  const leftPrefix = days === null || days <= 1 ? ""
    : `${plural(days, "day")} left. `;

  const ctaSubhead = isExpired
    ? lapsedPrefix
      + "A Texas notary commission requires an active $10,000 surety bond for its full term. A new 4-year bond is $50 flat — certificate emailed in minutes, no credit check."
    : leftPrefix
      + "Renew before it lapses and your commission stays continuous. $50 flat for the full 4-year term — certificate emailed in minutes, no credit check.";

  const verifyUrl = `https://verify.quantumsurety.bond/verify/notary/${notaryId}`;
  const pageUrl = `https://quantumsurety.bond/notary/${notaryId}`;

  const pageTitle = notary
    ? `${fullName} — Texas Notary Commission Status | ${location} | Quantum Surety`
    : `Texas Notary Commission — ID ${notaryId} | Quantum Surety`;
  const pageDesc = notary
    ? `${fullName} (TX Notary #${notaryId}) — ${location}. Commission status: ${si.plain}. Expires ${expDate}. Source: Texas Secretary of State public records.`
    : `Look up Texas notary commission status for notary ID ${notaryId}.`;

  // Share copy must not claim Quantum Surety verified or vouched for the commission
  // — the provenance strip says the opposite ("republishes this record; it does not
  // issue, hold or amend it"). The state is named as the source; we are named only
  // as the place the lookup was read.
  const shareFinding = !notary
    ? ""
    : notary.status === "expired"
      ? `${fullName} (TX Notary #${notaryId}) — Texas Secretary of State records show this notary commission expired${expDate ? ` on ${expDate}` : ""}.`
      : notary.status === "unknown"
        ? `${fullName} (TX Notary #${notaryId}) — Texas Secretary of State records do not show a current status for this notary commission.`
        : `${fullName} (TX Notary #${notaryId}) — Texas Secretary of State records show this notary commission active${expDate ? ` through ${expDate}` : ""}.`;

  const tweetText = shareFinding ? `${shareFinding} Record: ${pageUrl}` : "";

  const embedCode = notary
    ? `<a href="${verifyUrl}" target="_blank">\n  <img src="https://verify.quantumsurety.bond/api/badge/notary/${notaryId}" alt="Notary Commission — ${fullName}" width="280" height="56">\n</a>`
    : "";

  const jsonLd = notary ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": fullName,
    "description": `Texas Notary Public in ${location}. Commission status: ${si.plain}.`,
    ...(resolvedCity ? { "address": {
      "@type": "PostalAddress",
      "addressLocality": resolvedCity,
      "addressRegion": "TX",
      "postalCode": notary.zip || undefined,
      "addressCountry": "US"
    }} : {}),
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "commission",
      "name": "Texas Notary Public Commission",
      "identifier": notaryId,
      ...(notary.effective_date ? { "validFrom": notary.effective_date.slice(0, 10) } : {}),
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
              {/*
                Status indicator: the loudest thing on the page, deliberately. See
                statusInfo() for the palette and its computed contrast ratios (5.44:1
                worst case). It no longer collides with the renewal CTA because the
                CTA is now neutral and outlined, not because the record is muted.
                The marker is filled when the commission is valid today and hollow
                when it is not, so validity survives greyscale.
              */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: si.bg, border: `1px solid ${si.border}`, borderRadius: 8, padding: "8px 18px", marginBottom: 16 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 10, height: 10, borderRadius: "50%", boxSizing: "border-box", display: "inline-block",
                    background: si.filled ? si.color : "transparent",
                    border: `2px solid ${si.color}`,
                  }}
                />
                <span style={{ fontWeight: 800, color: si.color, fontSize: 14, fontFamily: "monospace", letterSpacing: 1 }}>{si.label}</span>
              </div>
              <h1 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 10px" }}>{fullName}</h1>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
                Texas Notary Public · ID #{notaryId} · {location}
              </p>

              {/*
                The verdict. Whoever was sent this link came to ask one question, and
                it gets answered in a sentence before any table, score or offer —
                not encoded in a pill the reader has to interpret.
              */}
              <p style={{ fontSize: 17, lineHeight: 1.55, color: "#e2e8f0", textAlign: "left", margin: "0 0 24px", fontWeight: 500 }}>
                {verdictSentence(fullName, notary.status, expDate)}
              </p>

              {/*
                Provenance strip. Deliberately placed above the data, not below it:
                the point is that a stranger can check the record before reading it.
                Styled as a citation block — no fills, no brand color, no urgency.
                Every colour here is >= 4.5:1 on #0d1117 (worst case: link #4C9AC9, 6.10:1).
              */}
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "16px 18px", textAlign: "left", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontFamily: "monospace", letterSpacing: 1.5, color: "#94a3b8", paddingBottom: 10, marginBottom: 12, borderBottom: "1px solid #30363d" }}>
                  RECORD PROVENANCE
                </div>

                <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "minmax(96px,auto) 1fr", columnGap: 16, rowGap: 10, fontSize: 13, lineHeight: 1.6 }}>
                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>SOURCE</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    Texas Secretary of State, notary public records. Quantum Surety republishes this record; it does not issue, hold or amend it.
                  </dd>

                  {/*
                    Who publishes this, and what they sell. Placed before the data,
                    in the record's own voice — a reader should learn that money
                    flows between the publisher and the subject without having to
                    ask, and before they read the finding. #cbd5e1 on #0d1117 is
                    12.75:1.
                  */}
                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>PUBLISHER</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    {publisherDisclosure(notary.agency)}
                  </dd>

                  {retrievedDate && (
                    <>
                      <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>RETRIEVED</dt>
                      <dd style={{ margin: 0, color: "#cbd5e1" }}>
                        Retrieved from Texas Secretary of State records on {retrievedDate}.
                      </dd>
                    </>
                  )}

                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>VERIFY</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    Check it against the state yourself:{" "}
                    <a
                      href={TX_SOS_NOTARY_PORTAL}
                      target="_blank"
                      rel="noopener noreferrer external"
                      style={{ color: "#4C9AC9", textDecoration: "underline" }}
                    >
                      Texas SOS notary search portal ↗
                    </a>
                    {" "}(leaves quantumsurety.bond, opens in a new tab). The state publishes no direct link to an individual notary, so the link lands on the state's Notary Public Search form. Type{" "}
                    <strong style={{ fontFamily: "monospace", color: "#e2e8f0", fontWeight: 600 }}>{notaryId}</strong>{" "}
                    into <strong style={{ color: "#e2e8f0", fontWeight: 600 }}>Notary ID</strong>, the first field on that form, and search.
                    {/*
                      A cautious reader checks the address bar, sees a non-texas.gov
                      host, and reasonably suspects a redirect to a vendor's own site.
                      Say plainly that the state runs it there. #94a3b8 on #0d1117 is
                      7.38:1.
                    */}
                    <span style={{ display: "block", marginTop: 8, color: "#94a3b8", fontSize: 12.5, lineHeight: 1.55 }}>
                      That link is not a texas.gov address. The Texas Secretary of State runs its notary search on the vendor-hosted portal <span style={{ fontFamily: "monospace" }}>texas-sos.appianportalsgov.com</span>, and the SOS website's own Notary Public Search link points to the same host.
                    </span>
                  </dd>

                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>CORRECTIONS</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    If anything here does not match the state's record,{" "}
                    <a href={correctionMailto} style={{ color: "#4C9AC9", textDecoration: "underline" }}>
                      report an error in this record
                    </a>
                    {" "}and we will re-pull it.
                  </dd>
                </dl>
              </div>

              {/* QS Score */}
              {notary.qs_score !== undefined && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", marginBottom: 24 }}>
                  <div style={{ position: "relative", width: 64, height: 64 }}>
                    <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle cx="32" cy="32" r="26" fill="none" stroke={notary.qs_color} strokeWidth="6"
                        strokeDasharray={`${(notary.qs_score / 100) * 2 * Math.PI * 26} ${2 * Math.PI * 26}`} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: notary.qs_color, lineHeight: 1 }}>{notary.qs_score}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: notary.qs_color }}>{notary.qs_grade}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginBottom: 2 }}>QS SCORE™</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: notary.qs_color }}>{notary.qs_label}</div>
                    <Link href="/qs-score">
                      <span style={{ fontSize: 11, color: "#475569", cursor: "pointer", textDecoration: "underline" }}>How scoring works →</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Detail grid */}
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24, textAlign: "left", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                  {[
                    { label: "Notary ID", value: notaryId },
                    { label: "Full Name", value: fullName },
                    ...(resolvedCity ? [{ label: "City", value: resolvedCity }] : []),
                    ...(notary.zip ? [{ label: "ZIP Code", value: notary.zip }] : []),
                    ...(commDate ? [{ label: "Commission Date", value: commDate }] : []),
                    // No status colour on these values either — the record's data
                    // stays neutral so nothing in it echoes the CTA's palette.
                    { label: "Commission Expires", value: expDate },
                    ...(notary.days_until_expiry > 0 ? [{ label: "Days Until Expiry", value: `${notary.days_until_expiry} days` }] : []),
                    ...(notary.surety_company ? [{ label: "Surety Company", value: notary.surety_company }] : []),
                    ...(notary.agency ? [{ label: "Bond Agency", value: notary.agency }] : []),
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", letterSpacing: 1, marginBottom: 3 }}>{f.label.toUpperCase()}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/*
                Renewal CTA — deliberately subordinate to the record above it.
                It used to be the only saturated element on the page: a #dc2626 /
                #d97706 tinted card with a solid fill button, so the advertisement
                was louder than the finding it was selling against (that headline
                was also only 3.53:1 on its own card — it failed contrast as well as
                taste). It is now a neutral outlined card with an outline button and
                an explicit "offer" label, so a stranger reads the status first and
                the offer second.

                Gating is unchanged and must stay unchanged: active commissions get
                no CTA at all, because notaries share this page as proof of standing.

                Contrast on the card fill rgba(255,255,255,0.03) over the hero
                gradient, worst case of the two ends: label/body #94a3b8 6.44:1,
                headline #cbd5e1 11.11:1, button text #e2e8f0 13.38:1, button border
                #7d8899 4.60:1.
              */}
              {(isExpired || isExpiring) && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "16px 20px", marginBottom: 20, textAlign: "left" }}>
                  <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 1.5, color: "#94a3b8", marginBottom: 8 }}>
                    OFFER FROM QUANTUM SURETY
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#cbd5e1", marginBottom: 6 }}>
                    {ctaHeadline}
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>
                    {ctaSubhead}
                  </p>
                  <Link href={`/get-bond?type=notary&src=notary-detail&id=${notaryId}`}>
                    <span style={{ display: "inline-block", background: "transparent", color: "#e2e8f0", border: "1px solid #7d8899", fontWeight: 600, fontSize: 13, padding: "9px 18px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}>
                      {isExpired ? "Get a New 4-Year Bond — $50 Flat →" : "Renew Notary Bond — $50 Flat →"}
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
                  <Link href={`/notary/${notaryId}/qr`}>
                    <span style={{ display: "inline-block", background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, cursor: "pointer", border: "1px solid rgba(245,158,11,0.3)" }}>
                      Print QR Code →
                    </span>
                  </Link>
                  {!isExpired && (
                    <Link href={`/notary/${notaryId}/cert`}>
                      <span style={{ display: "inline-block", background: "#059669", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, cursor: "pointer" }}>
                        Generate Signing Certificate →
                      </span>
                    </Link>
                  )}
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

      {/* Footer nav. The data-source sentence that used to live here is superseded
          by the RECORD PROVENANCE strip above, which states a real retrieval date
          and links the state's own search portal. */}
      <section style={{ background: "#0a0f1e", padding: "24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
            <a href="https://verify.quantumsurety.bond" style={{ color: "#4C9AC9" }}>Search All Notaries</a> &nbsp;·&nbsp;
            <Link href="/bonds/notary-bond-texas"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Texas Notary Bond</span></Link> &nbsp;·&nbsp;
            <Link href="/press"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Press Kit</span></Link>
          </p>
        </div>
      </section>
    </>
  );
}
