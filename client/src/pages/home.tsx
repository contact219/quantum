import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  Zap, 
  Shield, 
  Clock, 
  Sparkles,
  ArrowRight,
  Building2,
  HardHat,
  Wrench,
  FileBadge,
  Car,
  FileCheck,
  Scale
} from "lucide-react";
import heroImage from "@assets/generated_images/modern_construction_site_hero_image.png";

export default function Home() {
  const features = [
    {
      icon: Building2,
      title: "Construction-Focused Expertise",
      description: "We understand bids, projects, and owner requirements.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Guidance",
      description: "Instantly find the right bond for your project.",
    },
    {
      icon: Zap,
      title: "Fast Approvals",
      description: "Designed to match today's bid environments.",
    },
    {
      icon: FileCheck,
      title: "Digital Simplicity",
      description: "No paperwork delays. Everything delivered online.",
    },
  ];

  const bondCategories = [
    { icon: FileText, name: "Bid Bonds", href: "/construction" },
    { icon: CheckCircle, name: "Performance Bonds", href: "/construction" },
    { icon: Shield, name: "Payment Bonds", href: "/construction" },
    { icon: Clock, name: "Maintenance/Warranty Bonds", href: "/construction" },
    { icon: Wrench, name: "Supply Bonds", href: "/construction" },
    { icon: HardHat, name: "Contractor License Bonds", href: "/construction" },
    { icon: Car, name: "Auto Dealer Bonds", href: "/quote" },
    { icon: FileBadge, name: "Notary Bonds", href: "/quote" },
    { icon: Scale, name: "Probate & Court Bonds", href: "/quote" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-indigo-900/80 to-transparent z-10" />
        <div className="absolute inset-0 opacity-20 z-0">
          <img src={heroImage} alt="Modern construction site" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-tagline">
              <Sparkles className="w-3 h-3 mr-1" />
              #1 AI-Powered Construction Surety Bond Agency
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight" data-testid="text-hero-headline">
              Construction Bonds That Move at the Speed of Your Projects
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed font-medium" data-testid="text-hero-subheadline">
              Fast approvals. Clear guidance. Real support.<br />
              Quantum Surety gives you the bonding capacity you need — without the red tape.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/ai-bond-finder">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-accent hover:bg-accent/90" data-testid="button-find-bond">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find My Construction Bond
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/quote">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10 backdrop-blur" data-testid="button-get-quote">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-headline">
              Why Contractors Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for contractors, GCs, and subs who need results, not excuses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl" data-testid={`text-feature-${index}`}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-bonds-headline">
              Bond Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive surety bond solutions for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bondCategories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={`card-bond-${index}`}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg" data-testid={`text-bond-${index}`}>{category.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-headline">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of contractors who trust Quantum Surety for their bonding needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary" data-testid="button-cta-quote">
                Get Your Free Quote
              </Button>
            </Link>
            <Link href="/ai-bond-finder">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100" data-testid="button-cta-ai">
                Try AI Bond Finder
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
