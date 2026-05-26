import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";

const VERIFY_BASE = "https://verify.quantumsurety.bond";
const BOND_WATCH_API = "https://verify.quantumsurety.bond/api/bond-watch";

const COUNTY_META: Record<string, { display: string; cities: string }> = {
  harris:     { display: "Harris",     cities: "Houston, Pasadena, Baytown, Sugar Land, Pearland" },
  dallas:     { display: "Dallas",     cities: "Dallas, Irving, Garland, Mesquite, Carrollton" },
  tarrant:    { display: "Tarrant",    cities: "Fort Worth, Arlington, Grand Prairie, Mansfield, Euless" },
  bexar:      { display: "Bexar",      cities: "San Antonio, Live Oak, Universal City, Converse, Helotes" },
  travis:     { display: "Travis",     cities: "Austin, Round Rock, Cedar Park, Pflugerville, Georgetown" },
  collin:     { display: "Collin",     cities: "Plano, McKinney, Frisco, Allen, Wylie" },
  denton:     { display: "Denton",     cities: "Denton, Lewisville, Flower Mound, The Colony, Little Elm" },
  "fort-bend":{ display: "Fort Bend",  cities: "Sugar Land, Missouri City, Richmond, Stafford, Katy" },
  williamson: { display: "Williamson", cities: "Round Rock, Cedar Park, Georgetown, Leander, Hutto" },
  montgomery: { display: "Montgomery", cities: "Conroe, The Woodlands, Spring, Magnolia, Tomball" },
  "el-paso":  { display: "El Paso",    cities: "El Paso, Socorro, Horizon City, Anthony, Fabens" },
  hidalgo:    { display: "Hidalgo",    cities: "McAllen, Mission, Pharr, Edinburg, Brownsville" },
  cameron:    { display: "Cameron",    cities: "Brownsville, Harlingen, San Benito, McAllen, Weslaco" },
  lubbock:    { display: "Lubbock",    cities: "Lubbock, Wolfforth, Slaton, Idalou, Shallowater" },
  nueces:     { display: "Nueces",     cities: "Corpus Christi, Portland, Aransas Pass, Robstown, Ingleside" },
};

interface CountyRow {
  county: string;
  total: number;
  expired: number;
  expiring_30d: number;
  expiring_90d: number;
}

export default function CountyBondWatch() {
  const [, params] = useRoute("/texas-bond-watch/:county");
  const rawCounty = (params?.county || "").toLowerCase().replace(/[^a-z-]/g, "");
  const meta = COUNTY_META[rawCounty];
  const countyName = meta?.display || rawCounty.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const displayName = meta?.display || countyName;

  const { data: countiesData } = useQuery<{ counties: CountyRow[] }>({
    queryKey: [BOND_WATCH_API + "/counties"],
    queryFn: () => fetch(`${BOND_WATCH_API}/counties`).then(r => r.json()),
    staleTime: 1000 * 60 * 30,
  });

  const c = countiesData?.counties?.find(
    row => row.county?.toLowerCase() === displayName.toLowerCase()
  );
  const expiredPct = c && c.total > 0 ? ((c.expired / c.total) * 100).toFixed(1) : null;

  const title = `${countyName} County Contractor Bond Status — Live Expiration Tracker | Texas Bond Watch`;
  const description = c
    ? `${countyName} County: ${c.expired.toLocaleString()} contractors (${expiredPct}%) have expired bonds. ${c.expiring_30d.toLocaleString()} more expire in 30 days. Verify any contractor's bond status free.`
    : `Track contractor bond expirations in ${countyName} County, Texas. Free live data from TDLR updated daily.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://quantumsurety.bond/texas-bond-watch/${rawCounty}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://quantumsurety.bond/texas-bond-watch/${rawCounty}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `${countyName} County Texas Contractor Bond Tracker`,
          "description": description,
          "url": `https://quantumsurety.bond/texas-bond-watch/${rawCounty}`,
          "isPartOf": { "@type": "WebApplication", "name": "Texas Bond Watch", "url": "https://quantumsurety.bond/texas-bond-watch" }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "52px 24px 44px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link href="/texas-bond-watch">
            <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#64748b", display: "block", marginBottom: 16, cursor: "pointer" }}>
              ← TEXAS BOND WATCH
            </span>
          </Link>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            LIVE TDLR DATA
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            {countyName} County<br />Contractor Bond Tracker
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Live bond expiration data for all TDLR-licensed contractors in {countyName} County.
            {meta?.cities && ` Serving ${meta.cities} and surrounding areas.`}
          </p>

          {c ? (
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {([
                { label: "Total Licensed", value: c.total.toLocaleString(), color: "#e2e8f0" },
                { label: "Expired Bonds", value: (c.expired as number).toLocaleString(), color: "#dc2626" },
                { label: "Expiring 30 Days", value: (c.expiring_30d as number).toLocaleString(), color: "#d97706" },
                { label: "Lapsed Rate", value: `${expiredPct}%`, color: "#94a3b8" },
              ] as { label: string; value: string; color: string }[]).map(stat => (
                <div key={stat.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "18px 24px", minWidth: 120, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, fontFamily: "monospace" }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Loading live data…</div>
          )}

          <a href={`${VERIFY_BASE}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 800, fontSize: 14, padding: "14px 32px", borderRadius: 8, textDecoration: "none", marginRight: 12 }}>
            Verify a Contractor Now →
          </a>
          <Link href="/texas-bond-watch">
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", color: "#e2e8f0", fontWeight: 600, fontSize: 14, padding: "14px 24px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}>
              All Texas Counties
            </span>
          </Link>
        </div>
      </section>

      {/* Embed widget */}
      <section style={{ background: "#161b22", padding: "40px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            Embed {countyName} County Bond Stats on Your Website
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
            HOA boards, permit offices, and property managers can add live {countyName} County contractor bond data to their website with one line of code:
          </p>
          <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "14px 16px", fontFamily: "monospace", fontSize: 12, color: "#4C9AC9", cursor: "pointer", wordBreak: "break-all" }}
            onClick={() => navigator.clipboard?.writeText(`<script src="https://verify.quantumsurety.bond/county-stats.js?county=${encodeURIComponent(rawCounty.replace(/-/g," "))}"></script>`).catch(() => {})}
            title="Click to copy">
            {`<script src="https://verify.quantumsurety.bond/county-stats.js?county=${rawCounty.replace(/-/g," ")}"></script>`}
          </div>
          <p style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>Click to copy · Live TDLR data · Updates daily · Free forever</p>
        </div>
      </section>

      {/* What bond means */}
      <section style={{ background: "#0d1117", padding: "48px 24px", borderTop: "1px solid #21262d" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 20 }}>
            Why Verify a Contractor's Bond in {countyName} County?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {[
              { icon: "🔒", t: "Financial Protection", b: "A current surety bond means you have recourse if the contractor fails to complete work or causes damage." },
              { icon: "⚖️", t: "Legal Compliance", b: "TDLR requires most Texas contractors to maintain active bonds as a condition of their license." },
              { icon: "🛡️", t: "Weeds Out Fraudsters", b: `${expiredPct ? expiredPct + "%" : "Nearly 30%"} of ${countyName} County contractors have lapsed bonds — a key red flag before hiring.` },
              { icon: "📋", t: "Insurance Claims", b: "Bond status directly affects insurance claims. An unverified contractor may leave you unprotected." },
            ].map(item => (
              <div key={item.t} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{item.t}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{item.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get your own bond */}
      <section style={{ background: "#0a0f1e", padding: "48px 24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Are You a {countyName} County Contractor?
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24, lineHeight: 1.6 }}>
            Get or renew your Texas contractor bond in minutes. Instant approval, same-day certificate, A-rated carrier.
          </p>
          <Link href="/quote">
            <span style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 800, fontSize: 15, padding: "16px 40px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}>
              Get Your Bond Quote →
            </span>
          </Link>
          <p style={{ fontSize: 12, color: "#475569", marginTop: 12 }}>Texas-licensed agency · TDI #3480229 · (214) 666-8718</p>
        </div>
      </section>
    </>
  );
}
