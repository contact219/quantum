import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building2, ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface Obligee {
  name: string;
  category: "State Agency" | "Federal" | "City/County" | "Utility" | "Other";
  state: string;
  bondTypes: string[];
  notes?: string;
  website?: string;
}

const OBLIGEES: Obligee[] = [
  // Texas State Agencies
  { name: "Texas Department of Licensing and Regulation (TDLR)", category: "State Agency", state: "TX", bondTypes: ["License & Permit Bond", "Contractor License Bond"], notes: "Required for AC/HVAC, plumbing, electrician, and many trade licenses", website: "https://www.tdlr.texas.gov" },
  { name: "Texas Department of Transportation (TxDOT)", category: "State Agency", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Required on all TxDOT highway and infrastructure projects", website: "https://www.txdot.gov" },
  { name: "Texas Commission on Environmental Quality (TCEQ)", category: "State Agency", state: "TX", bondTypes: ["Reclamation Bond", "License & Permit Bond"], notes: "Environmental compliance bonds for waste and water operations", website: "https://www.tceq.texas.gov" },
  { name: "Texas Secretary of State", category: "State Agency", state: "TX", bondTypes: ["Notary Bond"], notes: "Required for all Texas notary public commissions — $10,000 bond", website: "https://www.sos.state.tx.us" },
  { name: "Texas Department of Motor Vehicles (TxDMV)", category: "State Agency", state: "TX", bondTypes: ["Motor Vehicle Dealer Bond", "License & Permit Bond"], notes: "Required for auto dealers, salvage dealers, and auction houses", website: "https://www.txdmv.gov" },
  { name: "Texas Real Estate Commission (TREC)", category: "State Agency", state: "TX", bondTypes: ["License & Permit Bond", "Mortgage Bond"], notes: "Required for mortgage companies and certain RE licensees", website: "https://www.trec.texas.gov" },
  { name: "Texas Department of Insurance (TDI)", category: "State Agency", state: "TX", bondTypes: ["Insurance Agent Bond", "Third Party Administrator Bond"], notes: "May require fidelity or surety bonds for licensees", website: "https://www.tdi.texas.gov" },
  { name: "Texas Alcoholic Beverage Commission (TABC)", category: "State Agency", state: "TX", bondTypes: ["Alcohol License Bond", "License & Permit Bond"], notes: "Required for alcohol manufacturer, distributor, and retailer licenses", website: "https://www.tabc.texas.gov" },
  { name: "Texas Education Agency (TEA)", category: "State Agency", state: "TX", bondTypes: ["License & Permit Bond"], notes: "Required for certain private schools and educational institutions", website: "https://www.tea.texas.gov" },
  { name: "Public Utility Commission of Texas (PUCT)", category: "State Agency", state: "TX", bondTypes: ["Electric Provider Bond", "Retail Electric Provider Bond"], notes: "Required for REPs operating in deregulated Texas electricity market", website: "https://www.puc.texas.gov" },
  // Texas Cities / Counties
  { name: "City of Houston", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "License & Permit Bond", "Subdivision Bond"], notes: "Required for city contracts, permits, and subdivision development", website: "https://www.houstontx.gov" },
  { name: "City of Dallas", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "License & Permit Bond"], notes: "Required for public works contracts and development agreements", website: "https://www.dallascityhall.com" },
  { name: "City of San Antonio", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond", "License & Permit Bond"], notes: "Required for COSA public improvement projects", website: "https://www.sanantonio.gov" },
  { name: "City of Austin", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "Subdivision Bond", "Site Improvement Bond"], notes: "Required for city projects, right-of-way permits, and developer agreements", website: "https://www.austintexas.gov" },
  { name: "City of Fort Worth", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Required for city contracts and public improvement projects", website: "https://www.fortworthtexas.gov" },
  { name: "City of Arlington", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "License & Permit Bond"], notes: "Required for city construction contracts and contractor licenses", website: "https://www.arlingtontx.gov" },
  { name: "Harris County", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Required for Harris County public works and infrastructure contracts", website: "https://www.harriscountytx.gov" },
  { name: "Travis County", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond"], notes: "Required for county-funded construction projects", website: "https://www.traviscountytx.gov" },
  { name: "Tarrant County", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Required for county contracts and public works", website: "https://www.tarrantcountytx.gov" },
  { name: "Bexar County", category: "City/County", state: "TX", bondTypes: ["Performance Bond", "Payment Bond"], notes: "Required for county construction and infrastructure projects", website: "https://www.bexar.org" },
  // Federal Agencies
  { name: "U.S. Army Corps of Engineers", category: "Federal", state: "All", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Miller Act bonds required on all federal construction contracts over $150,000", website: "https://www.usace.army.mil" },
  { name: "General Services Administration (GSA)", category: "Federal", state: "All", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Miller Act compliance required for all federal building and construction contracts", website: "https://www.gsa.gov" },
  { name: "Federal Highway Administration (FHWA)", category: "Federal", state: "All", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Required on federally funded highway projects administered through state DOTs", website: "https://www.fhwa.dot.gov" },
  { name: "Federal Motor Carrier Safety Administration (FMCSA)", category: "Federal", state: "All", bondTypes: ["BMC-84 Freight Broker Bond"], notes: "$75,000 BMC-84 bond required for all licensed freight brokers and freight forwarders", website: "https://www.fmcsa.dot.gov" },
  { name: "U.S. Small Business Administration (SBA)", category: "Federal", state: "All", bondTypes: ["Bid Bond", "Performance Bond", "Payment Bond"], notes: "SBA Surety Bond Guarantee Program assists small businesses in obtaining bonds", website: "https://www.sba.gov/funding-programs/surety-bonds" },
  { name: "Department of Veterans Affairs (VA)", category: "Federal", state: "All", bondTypes: ["Performance Bond", "Payment Bond", "Bid Bond"], notes: "Required for VA hospital and facility construction contracts", website: "https://www.va.gov" },
  // Utilities
  { name: "CenterPoint Energy", category: "Utility", state: "TX", bondTypes: ["License & Permit Bond", "Pipeline Bond"], notes: "May require performance bonds for contractors doing utility work", website: "https://www.centerpointenergy.com" },
  { name: "Oncor Electric Delivery", category: "Utility", state: "TX", bondTypes: ["License & Permit Bond"], notes: "Contractor qualification may require bonding requirements", website: "https://www.oncor.com" },
  { name: "Atmos Energy", category: "Utility", state: "TX", bondTypes: ["License & Permit Bond", "Pipeline Bond"], notes: "Bonding may be required for contractors performing gas line work", website: "https://www.atmosenergy.com" },
];

const CATEGORIES = ["All", "State Agency", "Federal", "City/County", "Utility", "Other"] as const;
const STATES = ["All States", "TX", "All"] as const;

export default function ObligeeLookup() {
  useSEO({
    title: "Obligee Lookup Tool | Quantum Surety",
    description: "Search our database of common bond obligees — Texas state agencies, cities, federal agencies, and utilities. Find the right obligee name for your surety bond.",
    canonical: "/obligee-lookup",
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return OBLIGEES.filter((o) => {
      const matchesSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.bondTypes.some((b) => b.toLowerCase().includes(q)) ||
        (o.notes || "").toLowerCase().includes(q);
      const matchesCategory = category === "All" || o.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const categoryColors: Record<string, string> = {
    "State Agency": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    "Federal": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    "City/County": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Utility": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    "Other": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-obligee">
            <Building2 className="w-4 h-4 mr-1" />
            Bond Obligee Database
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-obligee-headline">
            Obligee Lookup Tool
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Find the correct obligee name for your bond application. Search Texas state agencies, cities, federal bodies, and utilities.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Explainer */}
        <Card className="mb-8 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-5">
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">What is an Obligee?</p>
                <p className="text-sm text-muted-foreground">The <strong>obligee</strong> is the party requiring the bond — typically a government agency, project owner, or licensing body. Using the exact legal name matters: a wrong obligee name can invalidate your bond. Use this tool to find the correct name before completing your application.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search agencies, bond types, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
              data-testid="input-search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? "default" : "outline"}
                onClick={() => setCategory(cat)}
                data-testid={`filter-${cat.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-")}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4" data-testid="text-result-count">
          Showing <strong>{filtered.length}</strong> of {OBLIGEES.length} obligees
        </p>

        {/* Results */}
        <div className="space-y-3">
          {filtered.map((obligee, i) => (
            <Card key={i} className="hover-elevate" data-testid={`card-obligee-${i}`}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground" data-testid={`text-obligee-name-${i}`}>
                        {obligee.name}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[obligee.category]}`}>
                        {obligee.category}
                      </span>
                      <Badge variant="outline" className="text-xs">{obligee.state === "All" ? "Federal" : obligee.state}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {obligee.bondTypes.map((bt) => (
                        <Badge key={bt} variant="secondary" className="text-xs">{bt}</Badge>
                      ))}
                    </div>
                    {obligee.notes && (
                      <p className="text-sm text-muted-foreground">{obligee.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {obligee.website && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={obligee.website} target="_blank" rel="noopener noreferrer" data-testid={`link-website-${i}`}>
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <a href="/quote" data-testid={`link-quote-${i}`}>Get Bond</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground mb-4">No obligees found matching your search.</p>
                <p className="text-sm text-muted-foreground">
                  Can't find your obligee?{" "}
                  <a href="mailto:administrator@quantumsurety.bond" className="text-primary hover:underline">
                    Contact us
                  </a>{" "}
                  and we'll help identify the correct name.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>
            Don't see your obligee listed?{" "}
            <a href="mailto:administrator@quantumsurety.bond" className="text-primary hover:underline">
              Let us know
            </a>{" "}
            — we add new obligees regularly. Always verify the exact legal name with the requiring agency before submitting your bond.
          </p>
        </div>
      </div>
    </div>
  );
}
