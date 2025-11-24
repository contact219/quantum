import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookMarked, Search } from "lucide-react";
import { useState } from "react";

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");

  const terms = [
    {
      term: "Principal",
      definition: "The party (usually the contractor) purchasing the bond and obligated to perform the work or meet the obligation guaranteed by the bond."
    },
    {
      term: "Obligee",
      definition: "The party (usually the project owner or government entity) requiring the bond and protected by it. The obligee is the beneficiary of the bond."
    },
    {
      term: "Surety",
      definition: "The insurance/surety company that issues the bond and guarantees the principal's performance to the obligee. The surety assumes financial responsibility if the principal defaults."
    },
    {
      term: "Indemnity",
      definition: "The principal's agreement to reimburse the surety for any losses, claims, or expenses the surety incurs due to the bond. Unlike insurance, bonds are a form of credit—you must pay back the surety."
    },
    {
      term: "Bond Capacity",
      definition: "The maximum dollar amount of bonding a surety will extend to a contractor, based on financial strength, experience, and current work-in-progress. Also called aggregate capacity or bonding limit."
    },
    {
      term: "Penal Sum",
      definition: "The maximum dollar amount the surety will pay under the bond. For contract bonds, this is typically the contract amount. For license bonds, it's a fixed amount set by regulation."
    },
    {
      term: "Premium",
      definition: "The cost of the bond, typically expressed as a percentage of the penal sum. Rates vary based on bond type, contractor qualifications, and risk factors."
    },
    {
      term: "Bid Bond",
      definition: "A bond submitted with a construction bid guaranteeing the contractor will enter into the contract if selected and provide required performance and payment bonds. Typically 5-10% of the bid amount."
    },
    {
      term: "Performance Bond",
      definition: "A bond guaranteeing the contractor will complete the project according to contract terms and specifications. Protects the owner against contractor default or failure to complete work."
    },
    {
      term: "Payment Bond",
      definition: "A bond guaranteeing the contractor will pay subcontractors, laborers, and material suppliers. Often required alongside performance bonds on public projects to protect parties who can't file liens."
    },
    {
      term: "Maintenance Bond",
      definition: "A bond (also called warranty bond) guaranteeing correction of defective work or materials after project completion. Typically covers 1-2 years after final acceptance."
    },
    {
      term: "Contract Bond",
      definition: "General term for bonds guaranteeing contract performance—includes bid, performance, payment, and maintenance bonds. Distinguished from commercial bonds like license or permit bonds."
    },
    {
      term: "License/Permit Bond",
      definition: "Bonds required by government agencies for licensing or permits. Guarantees compliance with laws/regulations. Common for contractors, auto dealers, mortgage brokers, etc."
    },
    {
      term: "Work-in-Progress (WIP)",
      definition: "A financial schedule showing all active projects, their values, costs to date, and estimated completion. Critical underwriting document showing current commitments and financial position."
    },
    {
      term: "Bonding Line",
      definition: "Similar to a line of credit; the maximum amount of bonding the surety will provide. Can be a single job limit or aggregate limit across all jobs."
    },
    {
      term: "Prequalification",
      definition: "The process of establishing bond capacity before bidding on projects. Contractors submit financials and background information; surety issues a letter confirming bonding availability up to specified limits."
    },
    {
      term: "Retainage",
      definition: "A percentage of contract payments (typically 5-10%) withheld by the owner until project completion to ensure contract performance. Important factor in contractor cash flow and bonding."
    },
    {
      term: "Subguard/Subcontractor Default Insurance (SDI)",
      definition: "Insurance purchased by general contractors to protect against subcontractor default. May reduce need for subcontractor bonds but doesn't replace them for public projects."
    }
  ];

  const filteredTerms = terms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Key terms and definitions you'll encounter in the bonding process
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTerms.map((item, index) => (
            <Card key={index} className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-primary" data-testid={`text-term-${index}`}>
                  {item.term}
                </h3>
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
                <p className="text-muted-foreground">No terms found matching "{searchTerm}"</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Don't see a term you're looking for?{" "}
            <a href="mailto:support@quantumsurety.com" className="text-primary hover:underline">
              Contact us
            </a>{" "}
            and we'll help clarify.
          </p>
        </div>
      </div>
    </div>
  );
}
