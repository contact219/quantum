// Generates standard-tier county title bond entries (ranks 11-100) and wires
// routes + data. Rich hand-verified entries (top 10) are untouched.
// Run: node scripts/gen_county_title_pages.cjs
const fs = require("fs");
const path = require("path");

// [slug, County, seat, otherCities, ~population, region flavor]
const COUNTIES = [
  ["hidalgo","Hidalgo","Edinburg",["McAllen","Mission","Pharr"],"~900,000","rgv"],
  ["montgomery","Montgomery","Conroe",["The Woodlands","Magnolia","Willis"],"~700,000","metro"],
  ["williamson","Williamson","Georgetown",["Round Rock","Cedar Park","Leander"],"~640,000","metro"],
  ["cameron","Cameron","Brownsville",["Harlingen","San Benito","Los Fresnos"],"~425,000","rgv"],
  ["brazoria","Brazoria","Angleton",["Pearland","Lake Jackson","Alvin"],"~390,000","metro"],
  ["bell","Bell","Belton",["Killeen","Temple","Harker Heights"],"~390,000","military"],
  ["galveston","Galveston","Galveston",["League City","Texas City","Friendswood"],"~360,000","metro"],
  ["lubbock","Lubbock","Lubbock",["Wolfforth","Slaton","Idalou"],"~320,000","west"],
  ["webb","Webb","Laredo",["Rio Bravo","El Cenizo"],"~270,000","border"],
  ["jefferson","Jefferson","Beaumont",["Port Arthur","Nederland","Groves"],"~255,000","east"],
  ["mclennan","McLennan","Waco",["Hewitt","Woodway","Robinson"],"~265,000","central"],
  ["smith","Smith","Tyler",["Whitehouse","Lindale","Bullard"],"~240,000","east"],
  ["brazos","Brazos","Bryan",["College Station","Navasota"],"~240,000","central"],
  ["hays","Hays","San Marcos",["Kyle","Buda","Dripping Springs"],"~270,000","metro"],
  ["ellis","Ellis","Waxahachie",["Ennis","Midlothian","Red Oak"],"~210,000","metro"],
  ["midland","Midland","Midland",["Odessa (nearby)","Greenwood"],"~170,000","west"],
  ["ector","Ector","Odessa",["West Odessa","Gardendale"],"~165,000","west"],
  ["johnson","Johnson","Cleburne",["Burleson","Joshua","Alvarado"],"~190,000","metro"],
  ["guadalupe","Guadalupe","Seguin",["Schertz","Cibolo","New Braunfels (partial)"],"~180,000","metro"],
  ["comal","Comal","New Braunfels",["Bulverde","Canyon Lake","Garden Ridge"],"~175,000","metro"],
  ["parker","Parker","Weatherford",["Aledo","Springtown","Willow Park"],"~165,000","metro"],
  ["randall","Randall","Canyon",["Amarillo (south)","Lake Tanglewood"],"~145,000","west"],
  ["taylor","Taylor","Abilene",["Tye","Merkel","Buffalo Gap"],"~145,000","west"],
  ["grayson","Grayson","Sherman",["Denison","Van Alstyne","Whitesboro"],"~140,000","north"],
  ["wichita","Wichita","Wichita Falls",["Burkburnett","Iowa Park","Electra"],"~130,000","north"],
  ["gregg","Gregg","Longview",["Kilgore","Gladewater","White Oak"],"~125,000","east"],
  ["potter","Potter","Amarillo",["Bushland","Bishop Hills"],"~115,000","west"],
  ["kaufman","Kaufman","Kaufman",["Forney","Terrell","Crandall"],"~160,000","metro"],
  ["rockwall","Rockwall","Rockwall",["Royse City","Heath","Fate"],"~125,000","metro"],
  ["tom-green","Tom Green","San Angelo",["Grape Creek","Christoval"],"~120,000","west"],
  ["bowie","Bowie","New Boston",["Texarkana","Wake Village","Nash"],"~93,000","east"],
  ["victoria","Victoria","Victoria",["Bloomington","Inez"],"~92,000","coastal"],
  ["angelina","Angelina","Lufkin",["Diboll","Hudson","Huntington"],"~87,000","east"],
  ["hunt","Hunt","Greenville",["Commerce","Caddo Mills","Quinlan"],"~105,000","north"],
  ["orange","Orange","Orange",["Vidor","Bridge City","West Orange"],"~85,000","east"],
  ["bastrop","Bastrop","Bastrop",["Elgin","Smithville","Cedar Creek"],"~110,000","metro"],
  ["liberty","Liberty","Liberty",["Cleveland","Dayton","Mont Belvieu (partial)"],"~100,000","metro"],
  ["henderson","Henderson","Athens",["Gun Barrel City","Malakoff","Chandler"],"~84,000","east"],
  ["coryell","Coryell","Gatesville",["Copperas Cove","Oglesby"],"~84,000","military"],
  ["walker","Walker","Huntsville",["New Waverly","Riverside"],"~80,000","east"],
  ["nacogdoches","Nacogdoches","Nacogdoches",["Garrison","Cushing"],"~65,000","east"],
  ["harrison","Harrison","Marshall",["Hallsville","Waskom","Scottsville"],"~69,000","east"],
  ["san-patricio","San Patricio","Sinton",["Portland","Aransas Pass","Ingleside"],"~70,000","coastal"],
  ["starr","Starr","Rio Grande City",["Roma","La Grulla","Escobares"],"~66,000","border"],
  ["wise","Wise","Decatur",["Bridgeport","Boyd","Rhome"],"~73,000","north"],
  ["anderson","Anderson","Palestine",["Elkhart","Frankston"],"~58,000","east"],
  ["hardin","Hardin","Kountze",["Lumberton","Silsbee","Sour Lake"],"~58,000","east"],
  ["hood","Hood","Granbury",["Tolar","Lipan","Cresson"],"~65,000","north"],
  ["van-zandt","Van Zandt","Canton",["Wills Point","Van","Grand Saline"],"~62,000","east"],
  ["cherokee","Cherokee","Rusk",["Jacksonville","Alto","Wells"],"~51,000","east"],
  ["rusk","Rusk","Henderson",["Overton","Tatum","Mount Enterprise"],"~53,000","east"],
  ["maverick","Maverick","Eagle Pass",["Quemado","El Indio"],"~58,000","border"],
  ["waller","Waller","Hempstead",["Waller","Brookshire","Prairie View"],"~60,000","metro"],
  ["medina","Medina","Hondo",["Castroville","Devine","Natalia"],"~52,000","central"],
  ["val-verde","Val Verde","Del Rio",["Laughlin AFB area","Comstock"],"~48,000","border"],
  ["atascosa","Atascosa","Jourdanton",["Pleasanton","Poteet","Lytle"],"~50,000","central"],
  ["burnet","Burnet","Burnet",["Marble Falls","Granite Shoals","Bertram"],"~52,000","central"],
  ["wilson","Wilson","Floresville",["La Vernia","Stockdale","Poth"],"~51,000","central"],
  ["polk","Polk","Livingston",["Corrigan","Onalaska","Goodrich"],"~52,000","east"],
  ["kerr","Kerr","Kerrville",["Ingram","Center Point","Hunt"],"~53,000","hill"],
  ["wood","Wood","Quitman",["Mineola","Winnsboro","Hawkins"],"~46,000","east"],
  ["erath","Erath","Stephenville",["Dublin","Lingleville"],"~43,000","north"],
  ["jim-wells","Jim Wells","Alice",["Orange Grove","San Diego (partial)","Premont"],"~39,000","coastal"],
  ["caldwell","Caldwell","Lockhart",["Luling","Martindale","Dale"],"~46,000","central"],
  ["navarro","Navarro","Corsicana",["Kerens","Blooming Grove","Rice"],"~53,000","north"],
  ["upshur","Upshur","Gilmer",["Big Sandy","Ore City","Union Grove"],"~42,000","east"],
  ["brown","Brown","Brownwood",["Early","Bangs","Blanket"],"~38,000","central"],
  ["chambers","Chambers","Anahuac",["Mont Belvieu","Winnie","Wallisville"],"~48,000","metro"],
  ["cooke","Cooke","Gainesville",["Muenster","Lindsay","Valley View"],"~42,000","north"],
  ["matagorda","Matagorda","Bay City",["Palacios","Van Vleck","Markham"],"~36,000","coastal"],
  ["hopkins","Hopkins","Sulphur Springs",["Cumby","Como","Pickton"],"~37,000","east"],
  ["kendall","Kendall","Boerne",["Fair Oaks Ranch","Comfort","Bergheim"],"~47,000","hill"],
  ["jasper","Jasper","Jasper",["Kirbyville","Buna","Evadale"],"~33,000","east"],
  ["hale","Hale","Plainview",["Abernathy","Hale Center","Petersburg"],"~32,000","west"],
  ["howard","Howard","Big Spring",["Coahoma","Forsan"],"~34,000","west"],
  ["hill","Hill","Hillsboro",["Whitney","Itasca","Hubbard"],"~36,000","central"],
  ["washington","Washington","Brenham",["Burton","Chappell Hill"],"~36,000","central"],
  ["fannin","Fannin","Bonham",["Leonard","Honey Grove","Savoy"],"~36,000","north"],
  ["titus","Titus","Mount Pleasant",["Talco","Winfield"],"~31,000","east"],
  ["bee","Bee","Beeville",["Skidmore","Pettus"],"~31,000","coastal"],
  ["kleberg","Kleberg","Kingsville",["Riviera","Ricardo"],"~31,000","coastal"],
  ["cass","Cass","Linden",["Atlanta","Hughes Springs","Queen City"],"~29,000","east"],
  ["austin-county","Austin","Bellville",["Sealy","Wallis","San Felipe"],"~30,000","central"],
  ["palo-pinto","Palo Pinto","Palo Pinto",["Mineral Wells","Strawn","Graford"],"~29,000","north"],
  ["grimes","Grimes","Anderson",["Navasota","Iola","Plantersville"],"~30,000","central"],
  ["uvalde","Uvalde","Uvalde",["Sabinal","Utopia","Knippa"],"~25,000","border"],
  ["shelby","Shelby","Center",["Timpson","Tenaha","Joaquin"],"~24,000","east"],
  ["aransas","Aransas","Rockport",["Fulton","Holiday Beach"],"~24,000","coastal"],
  ["milam","Milam","Cameron",["Rockdale","Thorndale","Buckholts"],"~25,000","central"],
  ["panola","Panola","Carthage",["Beckville","Gary City"],"~23,000","east"],
  ["gillespie","Gillespie","Fredericksburg",["Harper","Stonewall","Doss"],"~27,000","hill"],
];

const SCENARIOS = {
  metro: (c) => [
    `Salvage and insurance auction purchases (Copart/IAA) brought home to ${c.seat} without a clean title`,
    `Private vehicle sales via Facebook Marketplace and Craigslist around ${c.seat} where the seller lost the title`,
    `Inherited vehicles from ${c.county} County estates where the title was never transferred`,
    `Vehicles bought from dealers or businesses that closed before transferring the title`,
  ],
  rgv: (c) => [
    `Private vehicle sales across the Rio Grande Valley where the seller lost or never had the title`,
    `Auction vehicles purchased in the ${c.seat} area without clean paperwork`,
    `Inherited vehicles from family estates in ${c.county} County`,
    `Vehicles bought from small lots that closed before transferring the title`,
  ],
  border: (c) => [
    `Private sales in the ${c.seat} area where the seller lost the title`,
    `Vehicles purchased at auction without a negotiable title`,
    `Inherited vehicles from ${c.county} County estates`,
    `Work trucks bought from businesses that dissolved before the title transfer`,
  ],
  military: (c) => [
    `Service members buying vehicles from departing personnel near Fort Cavazos without completed title paperwork`,
    `Private sales around ${c.seat} where the seller lost the title`,
    `Inherited vehicles from ${c.county} County estates`,
    `Auction purchases brought back without a negotiable title`,
  ],
  east: (c) => [
    `Private truck and trailer sales in East Texas where the title was lost years ago`,
    `Inherited farm and work vehicles from ${c.county} County estates`,
    `Auction purchases in the ${c.seat} area without clean paperwork`,
    `Barn-find and project vehicles bought without a title`,
  ],
  west: (c) => [
    `Oilfield and ranch trucks bought in private sales without a negotiable title`,
    `Auction vehicles purchased around ${c.seat} without clean paperwork`,
    `Inherited vehicles from ${c.county} County estates`,
    `Project and classic vehicles found without titles`,
  ],
  north: (c) => [
    `Private vehicle sales around ${c.seat} where the seller lost the title`,
    `Inherited vehicles and farm trucks from ${c.county} County estates`,
    `Auction purchases without a negotiable title`,
    `Project vehicles bought from private collections without paperwork`,
  ],
  central: (c) => [
    `Private vehicle sales around ${c.seat} where the seller lost the title`,
    `Inherited vehicles from ${c.county} County estates`,
    `Ranch and work trucks bought without a negotiable title`,
    `Auction purchases brought home without clean paperwork`,
  ],
  coastal: (c) => [
    `Private sales around ${c.seat} where the title was lost (or damaged in storms)`,
    `Inherited vehicles from ${c.county} County estates`,
    `Auction and salvage purchases without a negotiable title`,
    `Work trucks from businesses that closed before transferring the title`,
  ],
  hill: (c) => [
    `Private vehicle sales in the Hill Country where the seller lost the title`,
    `Inherited and classic vehicles from ${c.county} County estates`,
    `Ranch trucks bought without a negotiable title`,
    `Auction purchases without clean paperwork`,
  ],
};

function entry([slug, county, seat, others, pop, region]) {
  const c = { slug, county, seat };
  const scenarios = SCENARIOS[region](c);
  return `  "${slug}": {
    slug: "${slug}",
    name: "${county} County",
    county: "${county}",
    mainCity: "${seat}",
    otherCities: ${JSON.stringify(others)},
    assessorName: "${county} County Tax Assessor-Collector",
    assessorPhone: "",
    assessorAddress: "the ${county} County Tax Office in ${seat}, TX",
    assessorWebsite: "txdmv.gov",
    filingHours: "Monday–Friday, standard business hours (verify with the county office)",
    population: "${pop}",
    rank: 0,
    filingNote: "File your bonded title application at the ${county} County Tax Assessor-Collector office in ${seat}. Before visiting, confirm the current address, hours, and any appointment requirements on the county website or at txdmv.gov — smaller county offices sometimes consolidate motor-vehicle services on specific days.",
    commonScenarios: ${JSON.stringify(scenarios, null, 6).replace(/\n/g, "\n    ")},
    relatedCounties: [],
  },`;
}

const dataPath = path.join(__dirname, "../client/src/data/county-title-bonds.ts");
let data = fs.readFileSync(dataPath, "utf8");
const existing = COUNTIES.filter(([slug]) => data.includes(`"${slug}": {`));
if (existing.length) {
  console.log("skipping existing:", existing.map(e => e[0]).join(","));
}
const newCounties = COUNTIES.filter(([slug]) => !data.includes(`"${slug}": {`));
const block = newCounties.map(entry).join("\n");
const dataAnchorRe = /};\r?\n\r?\nexport const COUNTY_TITLE_BOND_SLUGS/;
if (!dataAnchorRe.test(data)) throw new Error("data file anchor not found");
data = data.replace(dataAnchorRe, `${block}\n};\n\nexport const COUNTY_TITLE_BOND_SLUGS`);
fs.writeFileSync(dataPath, data);
console.log(`added ${newCounties.length} county entries`);

// Routes in App.tsx — insert before the bonded-title-texas route
const appPath = path.join(__dirname, "../client/src/App.tsx");
let app = fs.readFileSync(appPath, "utf8");
const routeLines = newCounties
  .filter(([slug]) => !app.includes(`bonded-title-${slug}-county`))
  .map(([slug]) => `      <Route path="/bonds/bonded-title-${slug}-county" component={CountyTitleBondPage} />`)
  .join("\n");
const appAnchorRe = /(      <Route path="\/bonds\/bonded-title-texas" component=\{BondedTitleTexas\} \/>\r?\n      <Route path="\/title-document-analyzer")/;
if (!appAnchorRe.test(app)) throw new Error("App.tsx anchor not found");
app = app.replace(appAnchorRe, `${routeLines}\n$1`);
fs.writeFileSync(appPath, app);
console.log(`added ${newCounties.length} routes`);

// Emit compact map for seo.ts
const seoMap = COUNTIES.map(([slug, county, seat, , pop]) =>
  `  "${slug}": { name: "${county}", seat: "${seat}", population: "${pop}" },`
).join("\n");
fs.writeFileSync(path.join(__dirname, "county_seo_map.txt"), seoMap);
console.log("wrote scripts/county_seo_map.txt for seo.ts");
