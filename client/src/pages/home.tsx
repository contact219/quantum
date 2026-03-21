import { ArrowRight, Bolt, Building2, ShieldCheck, Zap } from "lucide-react";
import { Link } from "wouter";
import LogoStrip from "@/components/marketing/LogoStrip";

const bondTypes = [
  {
    title: "License & Permit Bonds",
    description: "Fast-turn placement for regulated occupations, local licensing boards, and municipal compliance filings.",
  },
  {
    title: "Contractor Programs",
    description: "Structured submissions and carrier-ready underwriting packets for growing construction and specialty trade accounts.",
  },
  {
    title: "Portfolio Support",
    description: "Responsive service for renewals, rider changes, and multi-state bond schedules with disciplined controls.",
  },
];

const processSteps = [
  {
    title: "Structured Intake",
    description: "Capture bond class, obligee, and applicant details through a secure, technology-enabled submission workflow.",
  },
  {
    title: "Pre-Qualification",
    description: "Align each request to underwriting appetite before it reaches an appointed A-rated carrier partner.",
  },
  {
    title: "Rapid Placement",
    description: "Move complete files quickly with clear communication, refined packaging, and efficient execution.",
  },
  {
    title: "Ongoing Service",
    description: "Support riders, renewals, and portfolio updates with an enterprise-grade operating cadence.",
  },
];

const proofPoints = [
  { label: "Secure intake", value: "Bank-grade workflow" },
  { label: "Carrier alignment", value: "A-rated partners" },
  { label: "Response posture", value: "Rapid turnaround" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <section className="hero-shell relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,#091427_0%,#0b1730_45%,#111827_100%)]">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="hero-glow-cyan absolute -left-24 top-16 h-72 w-72 rounded-full" />
        <div className="hero-glow-blue absolute right-[-4rem] top-[-2rem] h-80 w-80 rounded-full" />
        <div className="hero-motion absolute inset-y-10 right-[8%] hidden w-px bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-white/5 px-4 py-2 text-sm text-cyan-100 backdrop-blur-md">
              <Zap className="h-4 w-4 text-cyan-300" />
              Tech-forward surety placement for enterprise-grade risk review
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl" data-testid="text-hero-headline">
              Secure bond placement with a faster, more sophisticated operating rhythm.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl" data-testid="text-hero-subheadline">
              Quantum Surety pairs disciplined underwriting preparation with a modern digital experience, helping license, permit, and contractor submissions move quickly toward appointed carrier review.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/quote">
                <a className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:bg-cyan-300" data-testid="link-hero-cta-primary">
                  Start a Quote
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Link>
              <Link href="/resources">
                <a className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/10" data-testid="link-hero-cta-secondary">
                  Explore Resources
                </a>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {proofPoints.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-400" data-testid="text-hero-disclaimer">
              All bonds are underwritten and approved by appointed carrier partners. Quantum Surety does not independently underwrite or issue bonds.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-cyan-300/10 bg-cyan-300/5 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-[0_25px_100px_rgba(2,8,23,0.55)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b1425]">
                <div className="relative h-[460px] overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.28),transparent_22%),linear-gradient(160deg,#0f172a_12%,#0b1324_55%,#1f2937_100%)] p-6 sm:p-8">
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_42%,transparent_60%)] opacity-60" />
                  <div className="absolute -right-12 top-8 h-64 w-64 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-3xl" />
                  <div className="absolute inset-y-0 right-0 w-2/3 bg-[linear-gradient(135deg,rgba(15,23,42,0)_0%,rgba(34,211,238,0.09)_35%,rgba(255,255,255,0.03)_100%)]" />
                  <div className="absolute bottom-0 right-0 h-full w-[72%] bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-60 mix-blend-screen" />

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-300/80">
                      <span>Quantum Surety</span>
                      <span>Secure // Rapid // Sophisticated</span>
                    </div>

                    <div className="space-y-4 max-w-sm">
                      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/45 px-3 py-1 text-xs text-cyan-100 backdrop-blur-md">
                        <Bolt className="h-3.5 w-3.5" />
                        Flash-inspired energy, enterprise restraint
                      </div>
                      <h2 className="text-3xl font-semibold leading-tight text-white">
                        A modern hero built on trust, precision, and motion.
                      </h2>
                      <p className="text-sm leading-6 text-slate-300">
                        Architectural imagery, data filaments, and glass-morphism layers create a premium visual system without losing the conservative posture expected in surety.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
                        <ShieldCheck className="h-5 w-5 text-cyan-300" />
                        <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Risk posture</p>
                        <p className="mt-2 text-lg font-semibold text-white">Conservative controls</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
                        <Building2 className="h-5 w-5 text-cyan-300" />
                        <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Market stance</p>
                        <p className="mt-2 text-lg font-semibold text-white">Enterprise credibility</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#08101d] py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 md:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Trusted by growing contractors and compliance-driven businesses</p>
            <p className="mt-2 text-sm text-slate-300">A clean grayscale partner row reinforces credibility while preserving the premium minimalist presentation.</p>
          </div>
          <div className="max-w-2xl flex-1 opacity-70 grayscale">
            <LogoStrip />
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fb] py-20 text-slate-900">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">Design strategy</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl" data-testid="text-services-headline">
              Dynamic enough to feel advanced. Conservative enough to feel trusted.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600" data-testid="text-services-body-primary">
              The new system uses a midnight navy foundation, slate neutrals, and restrained electric cyan accents to present Quantum Surety as secure, rapid, and sophisticated.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-500" data-testid="text-services-body-secondary">
              Typography remains bold and readable, layouts stay asymmetrical and spacious, and each module uses premium micro-interactions instead of distracting motion.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {bondTypes.map((type) => (
              <div key={type.title} className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_24px_80px_rgba(8,145,178,0.15)]">
                <div className="mb-5 h-px w-16 bg-gradient-to-r from-cyan-500 to-transparent" />
                <h3 className="text-xl font-semibold text-slate-900">{type.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{type.description}</p>
                <div className="mt-6 text-sm font-medium text-cyan-700 transition group-hover:text-cyan-500">Purpose-built for fast placement</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">Enterprise workflow</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl" data-testid="text-process-headline">
              How the modernized bond placement process works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700" data-testid={`text-step-${index + 1}`}>
                  0{index + 1}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-center text-xs leading-6 text-slate-500" data-testid="text-process-disclaimer">
            Bond placement remains subject to carrier underwriting and approval. Submission of information does not guarantee bond issuance.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#eef4f8] py-20 text-slate-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:px-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">About Quantum Surety</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl" data-testid="text-about-headline">
              A premium digital front door for a disciplined surety operation.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600" data-testid="text-about-body-primary">
              Quantum Surety is a Texas-licensed insurance producer focused on surety bond placement for license, permit, and contractor obligations.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-500" data-testid="text-about-body-secondary">
              We work with appointed A-rated carriers to pre-qualify submissions, refine underwriting packages, and help principals obtain bonds efficiently, compliantly, and with a more modern client experience.
            </p>
          </div>

          <div className="glass-panel rounded-[2rem] border border-white/60 bg-white/60 p-8 text-slate-900 shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">Modernization pillars</p>
            <div className="mt-6 space-y-6">
              {[
                ["Power palette", "Midnight navy, slate grey, and selective cyan accents reinforce trust with a tech-forward edge."],
                ["Typography", "Bold sans-serif headlines and spacious body copy create enterprise-level clarity."],
                ["Glass-morphism", "Frosted containers and soft reflections elevate contact and intake experiences."],
                ["Micro-interactions", "Subtle hover lift and glow treatments add energy without compromising professionalism."],
              ].map(([title, description]) => (
                <div key={title} className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
