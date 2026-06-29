export interface TxCity {
  name: string;
  slug: string;
  county: string;
  region: string;
  nearby: string;
}

export interface BondType {
  slug: string;         // prefix used in URL: "notary-bond", "mortgage-bond" etc
  name: string;         // "Texas Notary Bond"
  shortName: string;    // "Notary Bond"
  amount: string;       // "$10,000"
  cost: string;         // "$50 flat / 4-year term"
  costNote: string;     // "no annual renewal"
  legal: string;        // "Texas Government Code §406.010"
  issuer: string;       // "Texas Secretary of State"
  applyUrl: string;
  applyType: string;    // bond_type query param
  description: string;
  faqs: { q: string | ((city: TxCity) => string); a: (city: TxCity) => string }[];
  color: string;        // tailwind color class for accent
}

export const TX_CITIES: TxCity[] = [
  { name: "Houston",        slug: "houston",         county: "Harris",       region: "Greater Houston",      nearby: "Pasadena, Sugar Land, Baytown" },
  { name: "San Antonio",    slug: "san-antonio",     county: "Bexar",        region: "South-Central Texas",  nearby: "New Braunfels, Converse, Live Oak" },
  { name: "Dallas",         slug: "dallas",          county: "Dallas",       region: "DFW Metroplex",        nearby: "Garland, Mesquite, Irving" },
  { name: "Austin",         slug: "austin",          county: "Travis",       region: "Central Texas",        nearby: "Round Rock, Cedar Park, Georgetown" },
  { name: "Fort Worth",     slug: "fort-worth",      county: "Tarrant",      region: "DFW Metroplex",        nearby: "Arlington, North Richland Hills, Burleson" },
  { name: "El Paso",        slug: "el-paso",         county: "El Paso",      region: "West Texas",           nearby: "Socorro, Anthony, Horizon City" },
  { name: "Arlington",      slug: "arlington",       county: "Tarrant",      region: "DFW Metroplex",        nearby: "Grand Prairie, Mansfield, Irving" },
  { name: "Corpus Christi", slug: "corpus-christi",  county: "Nueces",       region: "South Texas Coast",    nearby: "Portland, Calallen, Flour Bluff" },
  { name: "Plano",          slug: "plano",           county: "Collin",       region: "North DFW",            nearby: "Frisco, Allen, Richardson" },
  { name: "Laredo",         slug: "laredo",          county: "Webb",         region: "South Texas",          nearby: "Nuevo Laredo, Cotulla, Eagle Pass" },
  { name: "Lubbock",        slug: "lubbock",         county: "Lubbock",      region: "West Texas",           nearby: "Wolfforth, Slaton, Shallowater" },
  { name: "Garland",        slug: "garland",         county: "Dallas",       region: "DFW Metroplex",        nearby: "Rowlett, Sachse, Wylie" },
  { name: "Irving",         slug: "irving",          county: "Dallas",       region: "DFW Metroplex",        nearby: "Grand Prairie, Las Colinas, Coppell" },
  { name: "Amarillo",       slug: "amarillo",        county: "Potter",       region: "Texas Panhandle",      nearby: "Canyon, Randall County, Claude" },
  { name: "Grand Prairie",  slug: "grand-prairie",   county: "Dallas",       region: "DFW Metroplex",        nearby: "Arlington, Mansfield, Cedar Hill" },
  { name: "Brownsville",    slug: "brownsville",     county: "Cameron",      region: "Rio Grande Valley",    nearby: "Harlingen, San Benito, Matamoros" },
  { name: "Killeen",        slug: "killeen",         county: "Bell",         region: "Central Texas",        nearby: "Temple, Copperas Cove, Fort Cavazos" },
  { name: "Frisco",         slug: "frisco",          county: "Collin",       region: "North DFW",            nearby: "Plano, McKinney, Allen" },
  { name: "McKinney",       slug: "mckinney",        county: "Collin",       region: "North DFW",            nearby: "Frisco, Allen, Prosper" },
  { name: "Mesquite",       slug: "mesquite",        county: "Dallas",       region: "East DFW",             nearby: "Garland, Balch Springs, Sunnyvale" },
  { name: "McAllen",        slug: "mcallen",         county: "Hidalgo",      region: "Rio Grande Valley",    nearby: "Edinburg, Mission, Pharr" },
  { name: "Pasadena",       slug: "pasadena",        county: "Harris",       region: "Greater Houston",      nearby: "Deer Park, La Porte, Baytown" },
  { name: "Midland",        slug: "midland",         county: "Midland",      region: "Permian Basin",        nearby: "Odessa, Andrews, Stanton" },
  { name: "Denton",         slug: "denton",          county: "Denton",       region: "North DFW",            nearby: "Lewisville, Corinth, Flower Mound" },
  { name: "Carrollton",     slug: "carrollton",      county: "Dallas",       region: "North DFW",            nearby: "Farmers Branch, Addison, Coppell" },
  { name: "Waco",           slug: "waco",            county: "McLennan",     region: "Central Texas",        nearby: "Hewitt, Woodway, Bellmead" },
  { name: "Beaumont",       slug: "beaumont",        county: "Jefferson",    region: "Southeast Texas",      nearby: "Port Arthur, Orange, Lumberton" },
  { name: "Odessa",         slug: "odessa",          county: "Ector",        region: "Permian Basin",        nearby: "Midland, Andrews, Monahans" },
  { name: "Abilene",        slug: "abilene",         county: "Taylor",       region: "West Texas",           nearby: "Dyess AFB, Tye, Merkel" },
  { name: "Round Rock",     slug: "round-rock",      county: "Williamson",   region: "Greater Austin",       nearby: "Pflugerville, Cedar Park, Georgetown" },
  { name: "Richardson",     slug: "richardson",      county: "Dallas",       region: "North Dallas",         nearby: "Plano, Allen, Garland" },
  { name: "Pearland",       slug: "pearland",        county: "Brazoria",     region: "Greater Houston",      nearby: "Friendswood, Alvin, Manvel" },
  { name: "College Station", slug: "college-station", county: "Brazos",      region: "Brazos Valley",        nearby: "Bryan, Hearne, Navasota" },
  { name: "Tyler",          slug: "tyler",           county: "Smith",        region: "East Texas",           nearby: "Longview, Jacksonville, Lindale" },
  { name: "League City",    slug: "league-city",     county: "Galveston",    region: "Greater Houston",      nearby: "Friendswood, Pearland, Clear Lake" },
  { name: "Wichita Falls",  slug: "wichita-falls",   county: "Wichita",      region: "North Texas",          nearby: "Burkburnett, Iowa Park, Henrietta" },
  { name: "Edinburg",       slug: "edinburg",        county: "Hidalgo",      region: "Rio Grande Valley",    nearby: "McAllen, Mission, Pharr" },
  { name: "San Angelo",     slug: "san-angelo",      county: "Tom Green",    region: "West Texas",           nearby: "Grape Creek, Wall, Concho County" },
  { name: "Allen",          slug: "allen",           county: "Collin",       region: "North DFW",            nearby: "Plano, McKinney, Frisco" },
  { name: "Sugar Land",     slug: "sugar-land",      county: "Fort Bend",    region: "Greater Houston",      nearby: "Missouri City, Stafford, Richmond" },
  { name: "Lewisville",     slug: "lewisville",      county: "Denton",       region: "North DFW",            nearby: "Flower Mound, Highland Village, Carrollton" },
  { name: "Conroe",         slug: "conroe",          county: "Montgomery",   region: "Greater Houston",      nearby: "The Woodlands, Spring, Willis" },
  { name: "Cedar Park",     slug: "cedar-park",      county: "Williamson",   region: "Greater Austin",       nearby: "Round Rock, Leander, Georgetown" },
  { name: "Longview",       slug: "longview",        county: "Gregg",        region: "East Texas",           nearby: "Tyler, Marshall, Kilgore" },
  { name: "Mission",        slug: "mission",         county: "Hidalgo",      region: "Rio Grande Valley",    nearby: "McAllen, Edinburg, Pharr" },
  { name: "Bryan",          slug: "bryan",           county: "Brazos",       region: "Brazos Valley",        nearby: "College Station, Hearne, Calvert" },
  { name: "Pharr",          slug: "pharr",           county: "Hidalgo",      region: "Rio Grande Valley",    nearby: "McAllen, Mission, San Juan" },
  { name: "New Braunfels",  slug: "new-braunfels",   county: "Comal",        region: "Central Texas",        nearby: "San Marcos, Seguin, San Antonio" },
  { name: "Baytown",        slug: "baytown",         county: "Harris",       region: "Greater Houston",      nearby: "La Porte, Pasadena, Deer Park" },
  { name: "Temple",         slug: "temple",          county: "Bell",         region: "Central Texas",        nearby: "Killeen, Belton, Waco" },
  { name: "Flower Mound",   slug: "flower-mound",    county: "Denton",       region: "North DFW",            nearby: "Lewisville, Coppell, Grapevine" },
  { name: "Harlingen",      slug: "harlingen",       county: "Cameron",      region: "Rio Grande Valley",    nearby: "Brownsville, McAllen, San Benito" },
  { name: "Southlake",      slug: "southlake",       county: "Tarrant",      region: "DFW Metroplex",        nearby: "Grapevine, Colleyville, Keller" },
  { name: "Leander",        slug: "leander",         county: "Williamson",   region: "Greater Austin",       nearby: "Cedar Park, Georgetown, Round Rock" },
  { name: "Pflugerville",   slug: "pflugerville",    county: "Travis",       region: "Greater Austin",       nearby: "Round Rock, Hutto, Austin" },
  { name: "Georgetown",     slug: "georgetown",      county: "Williamson",   region: "Greater Austin",       nearby: "Round Rock, Cedar Park, Leander" },
  { name: "North Richland Hills", slug: "north-richland-hills", county: "Tarrant", region: "DFW Metroplex", nearby: "Haltom City, Richland Hills, Keller" },
];

export const BOND_TYPES: Record<string, BondType> = {
  "notary-bond": {
    slug: "notary-bond",
    name: "Texas Notary Bond",
    shortName: "Notary Bond",
    amount: "$10,000",
    cost: "$50 flat",
    costNote: "full 4-year term · no annual renewal",
    legal: "Texas Government Code §406.010",
    issuer: "Texas Secretary of State",
    applyUrl: "/get-bond?type=notary",
    applyType: "notary",
    color: "indigo",
    description: "Every Texas notary public must hold a $10,000 surety bond before the Texas Secretary of State will issue or renew a notary commission.",
    faqs: [
      { q: (c) => `Do ${c.name} notaries need a surety bond?`, a: (c) => `Yes. Every Texas notary — including those commissioned in ${c.county} County — must obtain a $10,000 surety bond under Texas Government Code §406.010 before the Texas Secretary of State will issue or renew a notary commission.` },
      { q: (_) => "How much does a Texas notary bond cost?", a: (_) => "A Texas notary bond costs $50 for the full 4-year commission term from Quantum Surety — no annual renewals, no credit check, no hidden fees." },
      { q: (c) => `How fast can I get a notary bond in ${c.name}?`, a: (_) => "Instantly. Apply online, pay $50, and your bond certificate PDF is emailed within minutes — ready to file with the Texas Secretary of State the same day." },
      { q: (_) => "What changed for Texas notaries under SB693?", a: (_) => "Senate Bill 693 (effective January 1, 2026) added a mandatory education course requirement. The $10,000 bond requirement is unchanged — Quantum Surety's bond is fully SB693 compliant." },
    ],
  },
  "contractor-bond": {
    slug: "contractor-bond",
    name: "Texas Contractor License Bond",
    shortName: "Contractor Bond",
    amount: "$10,000–$25,000",
    cost: "from $75/year",
    costNote: "annual · based on bond amount",
    legal: "Texas Occupations Code (TDLR)",
    issuer: "Texas Department of Licensing and Regulation",
    applyUrl: "/get-bond?type=contractor",
    applyType: "contractor",
    color: "teal",
    description: "Texas contractors licensed by TDLR must maintain a surety bond as a condition of their license. The bond amount varies by license type and protects consumers from contractor misconduct.",
    faqs: [
      { q: (c) => `Do ${c.name} contractors need a surety bond?`, a: (c) => `Yes. Contractors in ${c.name} holding a TDLR license — including electricians, HVAC technicians, and general contractors — must maintain a surety bond as a condition of their Texas license.` },
      { q: (_) => "How much does a Texas contractor bond cost?", a: (_) => "Texas contractor bonds start at $75/year through Quantum Surety, depending on the required bond amount and license type. Most TDLR bonds range from $10,000 to $25,000." },
      { q: (_) => "What happens if a contractor's bond lapses?", a: (_) => "A lapsed bond triggers automatic TDLR license suspension. Quantum Surety sends renewal reminders so your bond stays active continuously." },
      { q: (c) => `Can I get a contractor bond for ${c.name} online?`, a: (_) => "Yes — the entire process is online. Apply, pay, and receive your bond certificate by email within minutes, ready to file with TDLR." },
    ],
  },
  "gdn-bond": {
    slug: "gdn-bond",
    name: "Texas GDN Dealer Bond",
    shortName: "GDN Dealer Bond",
    amount: "$50,000",
    cost: "from $100/year",
    costNote: "annual renewal",
    legal: "Texas Occupations Code §503.033",
    issuer: "Texas Department of Motor Vehicles (TxDMV)",
    applyUrl: "/get-bond?type=gdn",
    applyType: "gdn",
    color: "blue",
    description: "Every Texas motor vehicle dealer holding a General Distinguishing Number (GDN) license must post a $50,000 surety bond with TxDMV under Texas Occupations Code §503.033.",
    faqs: [
      { q: (c) => `Do ${c.name} car dealers need a surety bond?`, a: (c) => `Yes. Every licensed motor vehicle dealer in ${c.name} and ${c.county} County must maintain a $50,000 GDN surety bond under Texas Occupations Code §503.033 as a condition of their TxDMV dealer license.` },
      { q: (_) => "How much does a Texas GDN dealer bond cost?", a: (_) => "Texas GDN dealer bonds start at $100/year from Quantum Surety. The exact rate depends on your credit profile and dealership history." },
      { q: (_) => "What does a GDN bond cover?", a: (_) => "A GDN surety bond protects consumers and TxDMV from financial harm caused by dealer fraud, misrepresentation, or failure to pay required taxes and fees on vehicle sales." },
      { q: (_) => "How quickly can I get a GDN bond certificate?", a: (_) => "Same day. Apply online through Quantum Surety, and your $50,000 GDN bond certificate is emailed within minutes — accepted by TxDMV statewide." },
    ],
  },
  "mortgage-bond": {
    slug: "mortgage-bond",
    name: "Texas Mortgage Broker Bond",
    shortName: "Mortgage Broker Bond",
    amount: "$50,000",
    cost: "from $375/year",
    costNote: "annual renewal",
    legal: "Texas Finance Code §156.204",
    issuer: "Texas Department of Savings and Mortgage Lending (SML)",
    applyUrl: "/get-bond?type=mortgage",
    applyType: "mortgage",
    color: "purple",
    description: "Texas mortgage brokers and mortgage bankers must post a $50,000 surety bond with the Texas SML under Texas Finance Code §156.204 as a condition of licensure.",
    faqs: [
      { q: (c) => `Do ${c.name} mortgage brokers need a surety bond?`, a: (c) => `Yes. Mortgage brokers and bankers operating in ${c.name} and throughout Texas must maintain a $50,000 surety bond with the Texas Department of Savings and Mortgage Lending under Texas Finance Code §156.204.` },
      { q: (_) => "How much does a Texas mortgage broker bond cost?", a: (_) => "Texas mortgage broker bonds start at $375/year through Quantum Surety. Rates vary based on credit and license history." },
      { q: (_) => "Who requires the Texas mortgage broker bond?", a: (_) => "The Texas Department of Savings and Mortgage Lending (SML) requires the bond as a condition of issuing a mortgage broker or mortgage banker license." },
      { q: (_) => "How quickly can I get a mortgage broker bond?", a: (_) => "Same day. Apply online and receive your bond certificate by email within minutes — ready to file with Texas SML." },
    ],
  },
  "hvac-bond": {
    slug: "hvac-bond",
    name: "Texas HVAC Contractor Bond",
    shortName: "HVAC Bond",
    amount: "$10,000",
    cost: "from $75/year",
    costNote: "annual renewal",
    legal: "Texas Occupations Code Chapter 1302",
    issuer: "Texas Department of Licensing and Regulation (TDLR)",
    applyUrl: "/get-bond?type=contractor",
    applyType: "contractor",
    color: "orange",
    description: "Texas HVAC (air conditioning and refrigeration) contractors licensed by TDLR under Texas Occupations Code Chapter 1302 must maintain a surety bond as a condition of their Air Conditioning and Refrigeration Contractor (ACR) license.",
    faqs: [
      { q: (c) => `Do ${c.name} HVAC contractors need a bond?`, a: (c) => `Yes. HVAC contractors in ${c.name} holding a TDLR Air Conditioning and Refrigeration Contractor (ACR) license must maintain a surety bond under Texas Occupations Code Chapter 1302.` },
      { q: (_) => "How much does a Texas HVAC bond cost?", a: (_) => "Texas HVAC contractor bonds start at $75/year through Quantum Surety for a $10,000 bond — the amount required by TDLR for ACR licensees." },
      { q: (_) => "What happens if my HVAC bond lapses?", a: (_) => "A lapsed HVAC bond results in automatic TDLR license suspension. Quantum Surety notifies you before expiration so your ACR license stays active." },
      { q: (c) => `How do I get an HVAC bond in ${c.name}?`, a: (_) => "Apply online at Quantum Surety, pay, and receive your bond certificate by email within minutes — ready to file with TDLR." },
    ],
  },
  "plumber-bond": {
    slug: "plumber-bond",
    name: "Texas Plumbing Contractor Bond",
    shortName: "Plumber Bond",
    amount: "$10,000",
    cost: "from $75/year",
    costNote: "annual renewal",
    legal: "Texas Occupations Code Chapter 1301",
    issuer: "Texas State Board of Plumbing Examiners (TSBPE)",
    applyUrl: "/get-bond?type=contractor",
    applyType: "contractor",
    color: "cyan",
    description: "Texas plumbing contractors licensed by the Texas State Board of Plumbing Examiners (TSBPE) must maintain a surety bond under Texas Occupations Code Chapter 1301 as a condition of their Master Plumber or Responsible Master Plumber license.",
    faqs: [
      { q: (c) => `Do ${c.name} plumbers need a surety bond?`, a: (c) => `Yes. Master Plumbers and Responsible Master Plumbers operating in ${c.name} and ${c.county} County must maintain a surety bond with TSBPE under Texas Occupations Code Chapter 1301.` },
      { q: (_) => "How much does a Texas plumber bond cost?", a: (_) => "Texas plumbing contractor bonds start at $75/year through Quantum Surety for the $10,000 coverage required by TSBPE." },
      { q: (_) => "Who requires the Texas plumbing contractor bond?", a: (_) => "The Texas State Board of Plumbing Examiners (TSBPE) requires the bond as a condition of all Master Plumber and Responsible Master Plumber licenses." },
      { q: (c) => `How do I get a plumber bond in ${c.name}?`, a: (_) => "Apply online at Quantum Surety — your bond certificate arrives by email within minutes, ready to file with TSBPE." },
    ],
  },
};

export const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string; btn: string; btnText: string }> = {
  indigo: { bg: "bg-indigo-900",   text: "text-indigo-100",  border: "border-indigo-100", badge: "bg-indigo-700",  btn: "bg-white text-indigo-900 hover:bg-indigo-50",    btnText: "text-indigo-600" },
  teal:   { bg: "bg-teal-900",     text: "text-teal-100",    border: "border-teal-100",   badge: "bg-teal-700",    btn: "bg-white text-teal-900 hover:bg-teal-50",        btnText: "text-teal-600" },
  blue:   { bg: "bg-blue-900",     text: "text-blue-100",    border: "border-blue-100",   badge: "bg-blue-700",    btn: "bg-white text-blue-900 hover:bg-blue-50",        btnText: "text-blue-600" },
  purple: { bg: "bg-purple-900",   text: "text-purple-100",  border: "border-purple-100", badge: "bg-purple-700",  btn: "bg-white text-purple-900 hover:bg-purple-50",    btnText: "text-purple-600" },
  orange: { bg: "bg-orange-900",   text: "text-orange-100",  border: "border-orange-100", badge: "bg-orange-700",  btn: "bg-white text-orange-900 hover:bg-orange-50",    btnText: "text-orange-600" },
  cyan:   { bg: "bg-cyan-900",     text: "text-cyan-100",    border: "border-cyan-100",   badge: "bg-cyan-700",    btn: "bg-white text-cyan-900 hover:bg-cyan-50",        btnText: "text-cyan-600" },
};
