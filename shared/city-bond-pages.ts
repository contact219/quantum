// The bond x city landing pages (/bonds/notary-bond-houston, /bonds/gdn-bond-waco, ...).
//
// Noindexed since 2026-09-25. In six months of Search Console data (Mar–Sep 2026)
// only 5 of ~340 ever appeared in results: 42 impressions, 1 click. Near-identical
// pages that differ only by city are what Google's spam policy calls doorway pages,
// and a large set of them drags on how the rest of the site is judged. They stay
// live and "follow" so visitors and internal links still work.
//
// Shared because two layers must agree: server/seo.ts emits the robots tag crawlers
// see first, and useSEO() rewrites it after React renders, which Google also sees.
// If only one side knew, the client would silently flip the page back to "index".
// Keep in sync with CITY_DATA and DYN_BOND_META in server/seo.ts.

export const CITY_BOND_TYPES = [
  "notary-bond",
  "contractor-bond",
  "gdn-bond",
  "mortgage-bond",
  "hvac-bond",
  "plumber-bond",
] as const;

export const CITY_BOND_CITIES = [
  "houston", "san-antonio", "dallas", "austin", "fort-worth", "el-paso", "arlington",
  "corpus-christi", "plano", "laredo", "lubbock", "garland", "irving", "amarillo",
  "grand-prairie", "brownsville", "killeen", "frisco", "mckinney", "mesquite", "mcallen",
  "pasadena", "midland", "denton", "carrollton", "waco", "beaumont", "odessa", "abilene",
  "round-rock", "richardson", "pearland", "college-station", "tyler", "league-city",
  "wichita-falls", "edinburg", "san-angelo", "allen", "sugar-land", "lewisville", "conroe",
  "cedar-park", "longview", "mission", "bryan", "pharr", "new-braunfels", "baytown",
  "temple", "flower-mound", "harlingen", "southlake", "leander", "pflugerville",
  "georgetown", "north-richland-hills",
] as const;

const TYPES = new Set<string>(CITY_BOND_TYPES);
const CITIES = new Set<string>(CITY_BOND_CITIES);

export function isCityBondPath(path: string): boolean {
  const m = path.split(/[?#]/)[0].replace(/\/+$/, "").match(/^\/bonds\/([a-z]+-bond)-([a-z-]+)$/);
  return !!m && TYPES.has(m[1]) && CITIES.has(m[2]);
}

export const CITY_BOND_ROBOTS = "noindex, follow";

// ─── Contractor license-bond line (noindexed 2026-09-26) ─────────────────────
// These pages sell a "Texas contractor / HVAC / plumbing / electrical / TDLR bond" on the
// premise of a statewide bond requirement that does not exist: TDLR (A/C, electrical) and
// TSBPE (plumbing) licenses require liability insurance, not a surety bond (verified on
// tdlr.texas.gov and tsbpe.texas.gov). The line has never made a sale. Pages stay live
// for visitors; they are just kept out of search. Construction bonds (/bonds/texas-contractor,
// MBE, bid/performance/payment) and the /contractor/:license lookup tool are NOT in this list.
export const CONTRACTOR_LINE_NOINDEX = new Set<string>([
  "/bonds/hvac-bond-texas",
  "/bonds/electrical-contractor-bond-texas",
  "/bonds/plumbing-contractor-bond-texas",
  "/bonds/roofing-contractor-bond-texas",
  "/bonds/tdlr-bond-texas",
  "/bonds/general-contractor-bond-texas",
  "/blog/texas-contractor-bond-and-permits",
  "/blog/texas-contractor-bond-compliance-report-2026",
  "/blog/texas-contractor-bond-crisis-june-2026",
  "/blog/texas-contractor-bond-market-data-2026",
  "/blog/texas-contractor-bond-requirements-by-city",
  "/blog/texas-contractor-license-bond-cost",
  "/blog/texas-electrical-contractor-bond-requirements",
  "/blog/texas-hvac-contractor-bond-requirements",
  "/blog/texas-plumbing-contractor-bond-requirements",
  "/blog/texas-roofing-contractor-bond-requirements",
  "/blog/texas-tdlr-contractor-bond-2026",
  // Retired 2026-09-26 (301 -> /verify-contractor); listed so the sitemap drops them.
  "/bond-compliance-leaderboard",
  "/bond-compliance-by-trade",
  "/bond-ticker",
  "/press",
]);

/** Every path that must carry `noindex, follow` and stay out of the sitemap. */
export function isNoindexedPath(path: string): boolean {
  const p = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return isCityBondPath(p) || CONTRACTOR_LINE_NOINDEX.has(p);
}
