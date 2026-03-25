import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookMarked, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";

interface Term {
  term: string;
  definition: string;
  category: "Parties" | "Bond Types" | "Contract Terms" | "Financial" | "Process" | "Legal";
}

const TERMS: Term[] = [
  // Parties
  { term: "Principal", category: "Parties", definition: "The party (usually the contractor) purchasing the bond and obligated to perform the work or meet the obligation guaranteed by the bond." },
  { term: "Obligee", category: "Parties", definition: "The party (usually the project owner or government entity) requiring the bond and protected by it. The obligee is the beneficiary of the bond. Using the exact legal name is critical — a wrong obligee name can invalidate your bond." },
  { term: "Surety", category: "Parties", definition: "The insurance/surety company that issues the bond and guarantees the principal's performance to the obligee. The surety assumes financial responsibility if the principal defaults." },
  { term: "Indemnitor", category: "Parties", definition: "A person or entity that signs the indemnity agreement and agrees to reimburse the surety for any losses. Often includes the contractor and their spouse or other principals." },
  { term: "Subcontractor", category: "Parties", definition: "A company hired by the general contractor (prime) to perform a portion of the work. May be required to provide their own performance and payment bonds on larger projects." },
  { term: "General Contractor (GC)", category: "Parties", definition: "The prime contractor responsible for overall project execution. Typically the principal on contract bonds and must manage subcontractor bonding requirements." },

  // Bond Types
  { term: "Bid Bond", category: "Bond Types", definition: "A bond submitted with a construction bid guaranteeing the contractor will enter into the contract if selected and provide required performance and payment bonds. Typically 5-10% of the bid amount." },
  { term: "Performance Bond", category: "Bond Types", definition: "A bond guaranteeing the contractor will complete the project according to contract terms and specifications. Protects the owner against contractor default or failure to complete work." },
  { term: "Payment Bond", category: "Bond Types", definition: "A bond guaranteeing the contractor will pay subcontractors, laborers, and material suppliers. Often required alongside performance bonds on public projects to protect parties who can't file liens." },
  { term: "Maintenance Bond", category: "Bond Types", definition: "A bond (also called warranty bond) guaranteeing correction of defective work or materials after project completion. Typically covers 1-2 years after final acceptance." },
  { term: "License & Permit Bond", category: "Bond Types", definition: "Bonds required by government agencies for licensing or permits. Guarantees compliance with laws/regulations. Common for contractors, auto dealers, mortgage brokers, etc." },
  { term: "Subdivision Bond", category: "Bond Types", definition: "A bond guaranteeing a developer will complete required public improvements (roads, utilities, sidewalks) within a subdivision as required by a municipality." },
  { term: "Site Improvement Bond", category: "Bond Types", definition: "Similar to a subdivision bond but covers specific site improvements on a parcel, such as grading, utilities, or drainage as required by local ordinance." },
  { term: "Supply Bond", category: "Bond Types", definition: "A bond guaranteeing a supplier will deliver materials or equipment as specified in a contract. Less common than performance bonds but used for large equipment procurement." },
  { term: "BMC-84 Freight Broker Bond", category: "Bond Types", definition: "A $75,000 federal bond required by the FMCSA for all licensed freight brokers and freight forwarders. Protects shippers and carriers against broker fraud or non-payment." },
  { term: "Notary Bond", category: "Bond Types", definition: "A bond required by state law for notaries public. In Texas, a $10,000 bond is required through the Secretary of State. Protects the public against errors or misconduct by the notary." },
  { term: "Contract Bond", category: "Bond Types", definition: "General term for bonds guaranteeing contract performance—includes bid, performance, payment, and maintenance bonds. Distinguished from commercial bonds like license or permit bonds." },
  { term: "Court Bond", category: "Bond Types", definition: "Bonds required by courts in legal proceedings. Includes appeal bonds, executor bonds, guardian bonds, and injunction bonds. Guarantees legal obligations will be fulfilled." },

  // Contract Terms
  { term: "Penal Sum", category: "Contract Terms", definition: "The maximum dollar amount the surety will pay under the bond. For contract bonds, this is typically the contract amount. For license bonds, it's a fixed amount set by regulation." },
  { term: "Premium", category: "Contract Terms", definition: "The cost of the bond, typically expressed as a percentage of the penal sum. Rates vary based on bond type, contractor qualifications, and risk factors. Not refundable even if the bond is never claimed." },
  { term: "Retainage", category: "Contract Terms", definition: "A percentage of contract payments (typically 5-10%) withheld by the owner until project completion. Important factor in contractor cash flow and bonding capacity." },
  { term: "Change Order", category: "Contract Terms", definition: "A written modification to the original contract that changes scope, schedule, or price. Large change orders can affect bond coverage and may require bond riders or new bonds." },
  { term: "Obligee Rider", category: "Contract Terms", definition: "An amendment to a bond that changes or adds obligees, often needed when a project has multiple owners or financing parties requiring bond protection." },
  { term: "Continuation Certificate", category: "Contract Terms", definition: "A document from the surety confirming a bond remains in force for an additional period, typically used on multi-year projects or renewable license bonds." },

  // Financial
  { term: "Indemnity", category: "Financial", definition: "The principal's agreement to reimburse the surety for any losses, claims, or expenses incurred due to the bond. Unlike insurance, bonds are a form of credit — you must pay back the surety." },
  { term: "Bond Capacity", category: "Financial", definition: "The maximum dollar amount of bonding a surety will extend to a contractor, based on financial strength, experience, and current work-in-progress. Also called aggregate capacity or bonding limit." },
  { term: "Single Job Limit", category: "Financial", definition: "The maximum bond amount the surety will issue for any single project. Distinct from aggregate capacity — a contractor might have a $10M aggregate but only a $5M single job limit." },
  { term: "Aggregate Limit", category: "Financial", definition: "The total maximum bonding a surety will provide across all active projects simultaneously. If a contractor's aggregate limit is $20M and they have $18M bonded, they can only take on $2M more." },
  { term: "Work-in-Progress (WIP)", category: "Financial", definition: "A financial schedule showing all active projects, their values, costs to date, and estimated completion. Critical underwriting document showing current commitments and financial position." },
  { term: "Bonding Line", category: "Financial", definition: "Similar to a line of credit; the maximum amount of bonding the surety will provide. Can be a single job limit or aggregate limit across all jobs." },
  { term: "Net Worth", category: "Financial", definition: "Total assets minus total liabilities. A key underwriting factor — sureties typically require contractor net worth to be at least 10% of the requested bond amount." },
  { term: "Liquid Assets", category: "Financial", definition: "Cash and assets quickly convertible to cash. Sureties look at liquid assets alongside net worth to assess a contractor's ability to handle cash flow challenges mid-project." },

  // Process
  { term: "Prequalification", category: "Process", definition: "The process of establishing bond capacity before bidding on projects. Contractors submit financials and background information; surety issues a letter confirming bonding availability up to specified limits." },
  { term: "Underwriting", category: "Process", definition: "The surety's process of evaluating a contractor's qualifications — financials, experience, credit, and current workload — to determine if and how much bonding to extend." },
  { term: "Claim", category: "Process", definition: "A formal demand made against a bond by the obligee or a protected party. The surety investigates and, if valid, pays the claimant up to the penal sum, then seeks reimbursement from the principal." },
  { term: "Default", category: "Process", definition: "When the principal fails to fulfill their bond obligation — e.g., abandoning a project, failing to pay subs, or non-compliance with a license. Triggers the surety's obligation to respond." },
  { term: "Subguard/SDI", category: "Process", definition: "Subcontractor Default Insurance (SDI) purchased by GCs to protect against subcontractor default. May reduce need for subcontractor bonds but doesn't replace them on public projects." },
  { term: "Consent of Surety", category: "Process", definition: "A document from the surety stating it will provide the required bonds if the contractor is awarded the contract. Often required with bid bonds." },

  // Legal
  { term: "Miller Act", category: "Legal", definition: "Federal law requiring performance and payment bonds on all federal construction contracts exceeding $150,000. State equivalents (Little Miller Acts) apply to state-funded projects." },
  { term: "Texas Government Code Chapter 2253", category: "Legal", definition: "Texas's 'Little Miller Act' requiring performance and payment bonds on public works contracts valued at $100,000 or more. Protects subcontractors and suppliers on Texas state projects." },
  { term: "Statute of Limitations", category: "Legal", definition: "The time limit for filing a claim against a bond. Varies by bond type and state. On Miller Act payment bonds, claimants typically have 1 year from last furnishing labor/materials." },
  { term: "Exoneration", category: "Legal", definition: "Release of the surety from further obligation under a bond, typically when the bond's conditions have been satisfied or the obligee releases the principal from the underlying obligation." },
];

const CATEGORIES = ["All", "Parties", "Bond Types", "Contract Terms", "Financial", "Process", "Legal"] as const;

export default function Glossary() {
  useSEO({
    title: "Surety Bond Glossary | Quantum Surety",
    description: "Learn common surety bond terms, definitions, and concepts used in construction and commercial bonding. Searchable glossary covering bond types, parties, financial terms, and legal concepts.",
    canonical: "/glossary",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredTerms = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return TERMS.filter((t) => {
      const matchesSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-glossary">
            <BookMarked className="w-4 h-4 mr-1" />
            Glossary
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-glossary-headline">
            Surety Bond Terminology
          </h1>
          <p className="text-xl text-gray-200">
            {TERMS.length} key terms and definitions you'll encounter in the bonding process
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search terms and definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
              {cat === "All" ? ` (${TERMS.length})` : ` (${TERMS.filter((t) => t.category === cat).length})`}
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-6" data-testid="text-result-count">
          Showing <strong>{filteredTerms.length}</strong> {filteredTerms.length === 1 ? "term" : "terms"}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          {searchTerm ? ` matching "${searchTerm}"` : ""}
        </p>

        <div className="space-y-4">
          {filteredTerms.map((item, index) => (
            <Card key={index} className="hover-elevate">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-foreground" data-testid={`text-term-${index}`}>
                    {item.term}
                  </h3>
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.definition}
                </p>
              </CardContent>
            </Card>
          ))}

          {filteredTerms.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookMarked className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground mb-2">No terms found</p>
                <p className="text-sm text-muted-foreground">Try a different search or category.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Don't see a term you're looking for?{" "}
            <a href="mailto:administrator@quantumsurety.bond" className="text-primary hover:underline">
              Contact us
            </a>{" "}
            and we'll add it.
          </p>
        </div>
      </div>
    </div>
  );
}
