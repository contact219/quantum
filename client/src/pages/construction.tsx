import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, CheckCircle, FileText, Shield, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import constructionHero from "@assets/generated_images/contractor_with_digital_blueprints.png";
import gcImage from "@assets/generated_images/general_contractor_in_office.png";
import subImage from "@assets/generated_images/subcontractor_team_at_work.png";

export default function Construction() {
  const [role, setRole] = useState("");
  const [projectSize, setProjectSize] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleFindBond = () => {
    if (role && projectSize) {
      setShowRecommendation(true);
    }
  };

  const getRecommendation = () => {
    if (!role || !projectSize) return null;

    const recommendations: Record<string, { bonds: string[], premium: string, docs: string[] }> = {
      "gc_under_100k": {
        bonds: ["Performance Bond", "Payment Bond"],
        premium: "1-3% of contract value",
        docs: ["Financial statements", "Project details", "Resume of experience"]
      },
      "gc_100k_500k": {
        bonds: ["Bid Bond", "Performance Bond", "Payment Bond"],
        premium: "1-3% of contract value",
        docs: ["Financial statements", "Work-in-progress schedule", "Project details", "Resume"]
      },
      "gc_500k_5m": {
        bonds: ["Bid Bond", "Performance Bond", "Payment Bond"],
        premium: "1-2.5% of contract value",
        docs: ["Audited financials", "Work-in-progress schedule", "Project details", "Resume", "Bank references"]
      },
      "gc_over_5m": {
        bonds: ["Bid Bond", "Performance Bond", "Payment Bond", "Maintenance Bond"],
        premium: "0.75-2% of contract value",
        docs: ["Audited financials", "Work-in-progress schedule", "Project details", "Resume", "Bank references", "Previous bond history"]
      },
      "sub_under_100k": {
        bonds: ["Performance Bond", "Payment Bond"],
        premium: "1-3% of contract value",
        docs: ["Financial statements", "Contract details", "Resume"]
      },
      "sub_100k_500k": {
        bonds: ["Performance Bond", "Payment Bond"],
        premium: "1-3% of contract value",
        docs: ["Financial statements", "Work-in-progress schedule", "Contract details"]
      },
      "sub_500k_5m": {
        bonds: ["Performance Bond", "Payment Bond"],
        premium: "1-2.5% of contract value",
        docs: ["Financial statements", "Work-in-progress schedule", "Contract details", "Resume"]
      },
      "sub_over_5m": {
        bonds: ["Performance Bond", "Payment Bond"],
        premium: "0.75-2% of contract value",
        docs: ["Audited financials", "Work-in-progress schedule", "Contract details", "Resume", "Bank references"]
      }
    };

    const key = `${role}_${projectSize}`;
    return recommendations[key];
  };

  const recommendation = getRecommendation();

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-indigo-900/85 to-transparent z-10" />
        <div className="absolute inset-0 opacity-25 z-0">
          <img src={constructionHero} alt="Contractor reviewing plans" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-construction">
              <Building2 className="w-3 h-3 mr-1" />
              Construction Bonds
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight" data-testid="text-construction-headline">
              Construction Bonds That Move at the Speed of Your Projects
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed font-medium" data-testid="text-construction-subheadline">
              Bid, performance, and payment bonds built for contractors, GCs, and subcontractors who can't afford delays.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose max-w-none mb-16">
            <p className="text-lg leading-relaxed text-foreground" data-testid="text-overview">
              Construction projects run on timelines, not guesswork. Quantum Surety delivers AI-powered bonding support that helps you win more bids, keep your projects moving, and stay compliant with owners, municipalities, and state requirements.
            </p>
            <p className="text-lg leading-relaxed text-foreground mt-4">
              Whether you're a general contractor competing for multi-million-dollar public contracts or a subcontractor taking on your first bonded job, we provide:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 list-none pl-0">
              {["Bid Bonds", "Performance Bonds", "Payment Bonds", "Maintenance/Warranty Bonds", "Supply Bonds", "Contractor License & Permit Bonds"].map((bond, i) => (
                <li key={i} className="flex items-center gap-2" data-testid={`text-bond-type-${i}`}>
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{bond}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg leading-relaxed text-foreground mt-6">
              Our platform simplifies the complex world of construction surety — so you can focus on building, not paperwork.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" data-testid="badge-gc">
                <Building2 className="w-3 h-3 mr-1" />
                For General Contractors
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-gc-headline">
                For General Contractors
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                General contractors carry the weight of deadlines, budgets, and owner expectations. Your bond program shouldn't slow you down.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Fast underwriting",
                  "Support for multi-project pipelines",
                  "Clear communication with owners",
                  "Streamlined document handling",
                  "Real-time project tracking through your portal"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3" data-testid={`text-gc-feature-${i}`}>
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/quote?type=gc">
                <Button size="lg" data-testid="button-gc-quote">
                  Start Your GC Bond Request
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={gcImage} alt="General contractor in office" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl overflow-hidden shadow-lg">
              <img src={subImage} alt="Subcontractor team at work" className="w-full h-auto object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4" data-testid="badge-sub">
                <Users className="w-3 h-3 mr-1" />
                For Subcontractors
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-sub-headline">
                For Subcontractors
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                More GCs now require bonded subs. We make the process simple—even if you've never been bonded before.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Step-by-step assistance",
                  "Fast approvals on lower bond amounts",
                  "Clear, simple guidance",
                  "A client portal to track bonds and expirations"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3" data-testid={`text-sub-feature-${i}`}>
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/quote?type=sub">
                <Button size="lg" className="bg-accent hover:bg-accent/90" data-testid="button-sub-quote">
                  Start Your Subcontractor Bond Request
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl" data-testid="text-ai-widget-title">
                Not sure which construction bond you need?
              </CardTitle>
              <CardDescription className="text-lg">
                Tell us about your project — we'll match you instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">I am a:</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role" data-testid="select-role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gc">General Contractor</SelectItem>
                      <SelectItem value="sub">Subcontractor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-size">Project size:</Label>
                  <Select value={projectSize} onValueChange={setProjectSize}>
                    <SelectTrigger id="project-size" data-testid="select-project-size">
                      <SelectValue placeholder="Select project size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_100k">Under $100,000</SelectItem>
                      <SelectItem value="100k_500k">$100K - $500K</SelectItem>
                      <SelectItem value="500k_5m">$500K - $5M</SelectItem>
                      <SelectItem value="over_5m">$5M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleFindBond} 
                  className="w-full" 
                  size="lg"
                  disabled={!role || !projectSize}
                  data-testid="button-find-bond"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find My Bonds
                </Button>
              </div>

              {showRecommendation && recommendation && (
                <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-primary/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" data-testid="text-recommendation-title">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    Recommended Bonds
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground mb-2">You'll need:</p>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.bonds.map((bond, i) => (
                          <Badge key={i} variant="secondary" className="text-sm" data-testid={`badge-recommended-${i}`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {bond}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground mb-1">Estimated Premium Range:</p>
                      <p className="text-lg font-bold text-primary" data-testid="text-premium">{recommendation.premium}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground mb-2">Required Documents:</p>
                      <ul className="space-y-1">
                        {recommendation.docs.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm" data-testid={`text-doc-${i}`}>
                            <FileText className="w-4 h-4 text-accent" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href="/quote">
                      <Button className="w-full" size="lg" data-testid="button-start-quote">
                        Start Quote
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
