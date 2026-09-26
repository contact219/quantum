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
