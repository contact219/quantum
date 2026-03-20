import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import LogoStrip from "@/components/marketing/LogoStrip";
import aiOrbit from "@assets/lottie/ai-orbit.json";
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
  Scale,
  BadgeCheck,
  Timer,
  Headset
} from "lucide-react";
import heroImage from "@assets/generated_images/modern_construction_site_hero_image.png";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

export default function Home() {
  const features = [
    {
      icon: Building2,
      title: "Construction‑Focused Underwriting",
      description: "Bond programs built around bid schedules, change orders, and capacity growth.",
    },
    {
      icon: Sparkles,
      title: "AI‑Guided Bond Matching",
      description: "Instantly map the right bond type to your project scope and owner requirements.",
    },
    {
      icon: Zap,
      title: "Faster Decisions",
      description: "Most submissions reviewed within 24–48 hours under standard thresholds.",
    },
    {
      icon: FileCheck,
      title: "Digital‑First Workflow",
      description: "Upload once, reuse everywhere. Keep projects moving without paperwork delays.",
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
      <section className="relative bg-gradient-to-br from-[#0B1020] via-[#0F1B3D] to-[#0B1020] min-h-[640px] md:min-h-[740px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020]/95 via-[#0B1020]/80 to-transparent z-10" />
        <div className="absolute inset-0 opacity-20 z-0">
          <img src={heroImage} alt="Modern construction site" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-tagline">
                <Sparkles className="w-3 h-3 mr-1" />
                Enterprise‑grade Surety for Construction
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight" data-testid="text-hero-headline">
                Bonding Capacity that Wins More Projects—Faster
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed font-medium" data-testid="text-hero-subheadline">
                Outcome‑focused underwriting, AI‑driven guidance, and a single portal to scale your bond program.
              </p>

              <div className="flex flex-wrap gap-3 mb-8 text-sm text-white/90">
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full"><Timer className="w-4 h-4" /> 24–48hr reviews under standard thresholds</span>
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full"><BadgeCheck className="w-4 h-4" /> Dedicated underwriter support</span>
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full"><Headset className="w-4 h-4" /> Real‑time status & approvals</span>
              </div>

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

            <div className="lg:col-span-5">
              <div className="glass-card p-6 md:p-8">
                <div className="h-56 md:h-64">
                  <Lottie animationData={aiOrbit} loop />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="glass-panel p-4">
                    <p className="text-xs uppercase tracking-wide text-white/70">Avg. Approval</p>
                    <p className="text-2xl font-semibold text-white">36 hrs</p>
                  </div>
                  <div className="glass-panel p-4">
                    <p className="text-xs uppercase tracking-wide text-white/70">Capacity Growth</p>
                    <p className="text-2xl font-semibold text-white">+28%</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 mt-4">
                  Built to shorten underwriting cycles and improve win rates across bid calendars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-background border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-6">Trusted by high‑growth contractors nationwide</p>
          <LogoStrip />
        </div>
      </section>

      <motion.section {...fadeUp} className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-headline">
              Why Contractors Choose Quantum Surety
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Clear decisions, faster turnaround, and a platform designed for scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} {...fadeUp}>
                <Card className="hover-elevate glass-panel border border-white/10">
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A streamlined path from submission to issuance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Submit", desc: "Answer a few questions and upload key documents." },
              { title: "Underwrite", desc: "Dedicated review with AI‑assisted risk analysis." },
              { title: "Issue", desc: "Digital bond delivery with ongoing capacity tracking." },
            ].map((step, i) => (
              <Card key={i} className="glass-panel">
                <CardHeader>
                  <div className="text-sm text-muted-foreground">Step {i + 1}</div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="py-16 md:py-24 lg:py-32 bg-card">
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
                <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all glass-panel" data-testid={`card-bond-${index}`}>
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
      </motion.section>

      <motion.section {...fadeUp} className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-headline">
            Ready to Scale Your Bonding Capacity?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join high‑growth contractors modernizing their surety program with Quantum.
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
      </motion.section>
    </div>
  );
}
