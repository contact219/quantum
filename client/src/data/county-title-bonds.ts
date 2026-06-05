export interface CountyTitleBondData {
  slug: string;
  name: string;
  county: string;
  mainCity: string;
  otherCities: string[];
  assessorName: string;
  assessorPhone: string;
  assessorAddress: string;
  assessorWebsite: string;
  filingHours: string;
  population: string;
  rank: number;
  filingNote: string;
  commonScenarios: string[];
  relatedCounties: string[];
}

export const COUNTY_TITLE_BOND_DATA: Record<string, CountyTitleBondData> = {
  harris: {
    slug: "harris",
    name: "Harris County",
    county: "Harris",
    mainCity: "Houston",
    otherCities: ["Pasadena", "Baytown", "Pearland", "Missouri City", "Stafford"],
    assessorName: "Ann Harris Bennett",
    assessorPhone: "(713) 274-8000",
    assessorAddress: "1001 Preston St, Houston, TX 77002",
    assessorWebsite: "hctax.net",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "4.7 million",
    rank: 1,
    filingNote: "Harris County has 19 branch locations across the Houston metro area. You can file your bonded title application at any branch — the main Downtown Houston office at 1001 Preston St is most accessible from central Houston. Pasadena, Baytown, and Humble branches serve the eastern suburbs.",
    commonScenarios: [
      "Houston-area Copart and IAA auction buyers (multiple auction facilities in Harris County)",
      "Private vehicle sales via Houston Facebook Marketplace where seller lost title",
      "Inherited vehicles from Houston-area estates and probate",
      "Fleet vehicles from companies that closed or relocated out of Texas",
      "Vehicles purchased from Texas dealers during closures"
    ],
    relatedCounties: ["fort-bend", "dallas"],
  },
  dallas: {
    slug: "dallas",
    name: "Dallas County",
    county: "Dallas",
    mainCity: "Dallas",
    otherCities: ["Irving", "Garland", "Mesquite", "Carrollton", "Richardson"],
    assessorName: "John R. Ames",
    assessorPhone: "(214) 653-7811",
    assessorAddress: "500 Elm St, Dallas, TX 75202",
    assessorWebsite: "dallascounty.org",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "2.6 million",
    rank: 2,
    filingNote: "Dallas County Tax Office has multiple locations — the main office at 500 Elm St is downtown. Branch offices in Garland, Mesquite, Irving, and Grand Prairie are available. Check dallascounty.org for the nearest location and current wait times.",
    commonScenarios: [
      "Dallas-area auction buyers from Manheim Texas Hobby, Copart Dallas, and IAA Dallas",
      "Private sales via Dallas Facebook groups and Facebook Marketplace",
      "Inherited vehicles from Dallas County estates",
      "Commercial vehicles from Dallas-area construction firms and logistics companies",
      "Classic car purchases from North Texas car shows and private collections"
    ],
    relatedCounties: ["collin", "tarrant", "denton"],
  },
  bexar: {
    slug: "bexar",
    name: "Bexar County",
    county: "Bexar",
    mainCity: "San Antonio",
    otherCities: ["Leon Valley", "Converse", "Universal City", "Helotes", "Live Oak"],
    assessorName: "Albert Uresti",
    assessorPhone: "(210) 335-2251",
    assessorAddress: "233 N Pecos La Trinidad, San Antonio, TX 78207",
    assessorWebsite: "bexar.org",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "2.1 million",
    rank: 3,
    filingNote: "Bexar County Tax Office is located near downtown San Antonio at 233 N Pecos La Trinidad. Military personnel and veterans at JBSA Fort Sam Houston, Lackland AFB, and Randolph AFB frequently need bonded titles for vehicles purchased from departing service members — the office is experienced with these transactions.",
    commonScenarios: [
      "Military-to-civilian vehicle sales at JBSA (Fort Sam Houston, Lackland AFB, Randolph AFB)",
      "Private sales in San Antonio neighborhoods where sellers misplaced titles",
      "Inherited vehicles from Bexar County estates, especially older ranch vehicles",
      "Vehicles purchased at San Antonio-area auctions without proper paperwork",
      "Out-of-state vehicles brought to San Antonio by relocating military families"
    ],
    relatedCounties: ["travis", "nueces"],
  },
  tarrant: {
    slug: "tarrant",
    name: "Tarrant County",
    county: "Tarrant",
    mainCity: "Fort Worth",
    otherCities: ["Arlington", "Grand Prairie", "Euless", "Bedford", "Hurst"],
    assessorName: "Rick Barnes",
    assessorPhone: "(817) 884-1100",
    assessorAddress: "100 E Weatherford St, Fort Worth, TX 76196",
    assessorWebsite: "tarrantcounty.com",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "2.1 million",
    rank: 4,
    filingNote: "Tarrant County Tax Office is in the historic Tarrant County Courthouse in downtown Fort Worth. Branch offices are available in Arlington, Euless, and other cities. Fort Worth is a major hub for commercial vehicle transactions — the Tarrant County office handles many fleet and work truck bonded title applications.",
    commonScenarios: [
      "Commercial vehicles and work trucks purchased through Fort Worth-area dealers or fleets",
      "Classic cars and trucks from North Texas auto shows and barn finds",
      "Vehicles purchased at Manheim Fort Worth and DFW-area auctions",
      "Arlington-area private sales where title paperwork was misplaced",
      "Inherited ranch and farm vehicles in Tarrant County"
    ],
    relatedCounties: ["dallas", "collin", "denton"],
  },
  travis: {
    slug: "travis",
    name: "Travis County",
    county: "Travis",
    mainCity: "Austin",
    otherCities: ["Cedar Park", "Round Rock", "Pflugerville", "Lakeway", "Bee Cave"],
    assessorName: "Bruce Elfant",
    assessorPhone: "(512) 854-9473",
    assessorAddress: "5501 Airport Blvd, Austin, TX 78751",
    assessorWebsite: "tax.co.travis.tx.us",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "1.3 million",
    rank: 5,
    filingNote: "Travis County Tax Office is on Airport Blvd in north-central Austin. Austin's rapid growth has brought a surge in private vehicle sales — particularly tech professionals buying and selling vehicles frequently. Out-of-state transplants often arrive with titles that don't transfer cleanly to Texas, requiring a bonded title.",
    commonScenarios: [
      "Tech-sector relocations bringing vehicles from California, New York, and other states with complex title rules",
      "Austin-area private sales where sellers lost the Texas title",
      "Electric vehicles (Tesla, Rivian) purchased privately with incomplete paperwork",
      "Motorcycles purchased at Austin vintage motorcycle shows and meetups",
      "Trailers and RVs from Cedar Park and Lakeway area residents"
    ],
    relatedCounties: ["bexar", "collin"],
  },
  "el-paso": {
    slug: "el-paso",
    name: "El Paso County",
    county: "El Paso",
    mainCity: "El Paso",
    otherCities: ["Socorro", "Anthony", "Horizon City", "Canutillo", "Fabens"],
    assessorName: "Ruben P. Gonzalez",
    assessorPhone: "(915) 546-2140",
    assessorAddress: "301 Manny Martinez Dr, El Paso, TX 79905",
    assessorWebsite: "epcounty.com",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "870,000",
    rank: 6,
    filingNote: "El Paso County Tax Office handles a high volume of cross-border vehicle situations. Vehicles brought from New Mexico sometimes arrive without documentation that Texas accepts directly. The El Paso office is experienced with out-of-state title complications and can guide you through the bonded title process.",
    commonScenarios: [
      "Vehicles purchased in New Mexico brought to El Paso without proper Texas title transfer",
      "Cross-border vehicle situations requiring Texas title establishment",
      "Military vehicle purchases and transfers at Fort Bliss",
      "Used vehicle purchases from El Paso private sellers who lost titles",
      "Classic vehicles from El Paso area estates and private collections"
    ],
    relatedCounties: ["bexar"],
  },
  collin: {
    slug: "collin",
    name: "Collin County",
    county: "Collin",
    mainCity: "McKinney",
    otherCities: ["Plano", "Frisco", "Allen", "Richardson", "Wylie"],
    assessorName: "Kenneth Maun",
    assessorPhone: "(972) 547-5020",
    assessorAddress: "2300 Bloomdale Rd #2304, McKinney, TX 75071",
    assessorWebsite: "collincountytx.gov",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "1.1 million",
    rank: 7,
    filingNote: "Collin County is one of the fastest-growing counties in the United States, with Frisco, Plano, and McKinney all booming. The rapid influx of residents from other states creates frequent title transfer complications. The Collin County Tax Office at 2300 Bloomdale Rd in McKinney is the main filing location.",
    commonScenarios: [
      "Tech corridor relocations (Plano Legacy West, Frisco) bringing out-of-state titles",
      "Luxury and exotic vehicles purchased privately in Plano and Frisco",
      "New residents from California and the Northeast with non-standard title situations",
      "Private vehicle sales at North Texas car meets and enthusiast events",
      "Classic cars from Collin County estate sales and collections"
    ],
    relatedCounties: ["dallas", "tarrant", "denton"],
  },
  denton: {
    slug: "denton",
    name: "Denton County",
    county: "Denton",
    mainCity: "Denton",
    otherCities: ["Lewisville", "Carrollton", "Flower Mound", "The Colony", "Little Elm"],
    assessorName: "Michelle French",
    assessorPhone: "(940) 349-3500",
    assessorAddress: "1505 E McKinney St, Denton, TX 76209",
    assessorWebsite: "dentoncounty.gov",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "950,000",
    rank: 8,
    filingNote: "Denton County Tax Office is in the heart of Denton near UNT. The area's large student and young professional population frequently buy used vehicles through private sales. A satellite office is available in Lewisville for residents in the southern part of the county.",
    commonScenarios: [
      "UNT and TWU student vehicle purchases where sellers did not provide proper title",
      "Denton-area classic car and truck sales from long-time Texas residents",
      "Motorcycles purchased through private sales in Lewisville and Flower Mound",
      "Trailers and work equipment from Denton County rural properties",
      "Commercial vehicles from Lewisville and The Colony industrial parks"
    ],
    relatedCounties: ["collin", "dallas", "tarrant"],
  },
  "fort-bend": {
    slug: "fort-bend",
    name: "Fort Bend County",
    county: "Fort Bend",
    mainCity: "Richmond",
    otherCities: ["Sugar Land", "Missouri City", "Pearland", "Stafford", "Rosenberg"],
    assessorName: "Carmen Turner",
    assessorPhone: "(281) 341-3710",
    assessorAddress: "1317 Eugene Heimann Cir, Richmond, TX 77469",
    assessorWebsite: "fortbendcountytx.gov",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "820,000",
    rank: 9,
    filingNote: "Fort Bend County Tax Office is in Richmond, with a satellite office available in Sugar Land at the Fort Bend County Government Center (12950 Dairy Ashford Rd). Fort Bend is one of the most diverse and affluent counties in Texas — international community members purchasing vehicles privately sometimes encounter title documentation gaps.",
    commonScenarios: [
      "Luxury vehicles purchased privately in Sugar Land and Missouri City",
      "International community vehicle purchases where sellers are unfamiliar with TX title requirements",
      "Fleet vehicles from Fort Bend County energy and petrochemical businesses",
      "Private sales in Sugar Land master-planned communities (First Colony, Greatwood, Riverstone)",
      "Classic vehicles from Rosenberg and Richmond area ranch estates"
    ],
    relatedCounties: ["harris"],
  },
  nueces: {
    slug: "nueces",
    name: "Nueces County",
    county: "Nueces",
    mainCity: "Corpus Christi",
    otherCities: ["Portland", "Robstown", "Aransas Pass", "Sinton", "Rockport"],
    assessorName: "Kevin Kieschnick",
    assessorPhone: "(361) 888-0307",
    assessorAddress: "901 Leopard St, Corpus Christi, TX 78401",
    assessorWebsite: "nuecesco.com",
    filingHours: "Monday–Friday 8:00 AM – 4:30 PM",
    population: "370,000",
    rank: 10,
    filingNote: "Nueces County Tax Office is in downtown Corpus Christi at 901 Leopard St. Corpus Christi's coastal location means the office regularly processes boats, trailers, and marine vehicles alongside regular cars and trucks. NAS Corpus Christi also generates a steady stream of military vehicle transfer transactions.",
    commonScenarios: [
      "Marine vessels and boat trailers purchased privately without proper title transfer",
      "Military vehicle purchases and transfers from NAS Corpus Christi personnel",
      "Classic vehicles and trucks from South Texas ranches and private estates",
      "Private vehicle sales in the Corpus Christi coastal community",
      "Commercial fishing and oil industry work vehicles without clear title history"
    ],
    relatedCounties: ["bexar", "travis"],
  },
};

export const COUNTY_TITLE_BOND_SLUGS = Object.keys(COUNTY_TITLE_BOND_DATA);
