import { SEO_PAGES, useSEO } from "@/hooks/useSEO";
import { ServicesSection } from "@/components/home/ServicesSection";

const trustMetrics = [
  { value: "A-rated", label: "Carrier partners" },
  { value: "All 50", label: "States served" },
  { value: "24-hr", label: "Typical filing time" },
  { value: "Texas", label: "Licensed producer" },
];

const processSteps = [
  {
    title: "Submit Your Request",
    description: "Tell us about your bond in minutes — bond type, project size, and basic business info. No lengthy paperwork, no phone tag.",
  },
  {
    title: "AI Pre-Qualification",
    description: "Our system instantly evaluates your submission and matches it to the right carrier program. Most applicants get a quote the same day.",
  },
  {
    title: "Carrier Approval",
    description: "We submit a clean, carrier-ready package to our A-rated underwriting partners. You stay informed at every step.",
  },
  {
    title: "Bond Issued & Delivered",
    description: "Once approved, your bond is executed and delivered — by email or directly to the obligee. Fast, simple, done.",
  },
];

export default function Home() {
  useSEO(SEO_PAGES.home);
  return (
    <div className="bg-[#020816] text-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.16),_transparent_30%),linear-gradient(135deg,_#020816_0%,_#07111f_38%,_#0f1724_68%,_#161b28_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        </div>

        <div className="quantum-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="quantum-filaments pointer-events-none absolute inset-0 opacity-80" />
        <div className="flash-motion-left pointer-events-none absolute -left-24 top-24 h-[28rem] w-48 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="flash-motion-right pointer-events-none absolute -right-20 bottom-10 h-[24rem] w-44 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-cyan-100/80 backdrop-blur-md">
              <img src="/QS_Logo.png" alt="Quantum Surety" className="w-4 h-4 object-contain" />
              Quantum Surety
            </div>

            <h1
              className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
              data-testid="text-hero-headline"
            >
              Fast, AI-Powered Surety Bonds for Contractors
            </h1>

            <p
              className="mt-8 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl"
              data-testid="text-hero-subheadline"
            >
              Quantum Surety delivers bid bonds, performance bonds, payment bonds, license bonds, and freight broker bonds — faster than traditional agencies. AI-assisted underwriting, A-rated carriers, licensed in Texas and all 50 states.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/quote"
                className="inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-200"
                data-testid="link-hero-primary-cta"
              >
                Request Bond Placement
              </a>
              <a
                href="/resources"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/10"
                data-testid="link-hero-secondary-cta"
              >
                Review Resources
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {trustMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <div className="text-2xl font-semibold tracking-tight text-white">{metric.value}</div>
                  <div className="mt-2 text-sm text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>

            <p
              className="mt-8 max-w-2xl text-sm leading-6 text-slate-400"
              data-testid="text-hero-disclaimer"
            >
              All bonds are underwritten and approved by appointed insurance carriers. Quantum Surety does not issue bonds independently.
            </p>
          </div>

          <div className="relative lg:pl-10">
            <div className="absolute -left-12 top-8 hidden h-40 w-40 rounded-full border border-cyan-300/10 bg-cyan-300/10 blur-2xl lg:block" />
            <div className="hero-glass-frame relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(8,17,34,0.92),_rgba(17,25,39,0.72))] p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.15),_transparent_28%),linear-gradient(180deg,_transparent,_rgba(0,0,0,0.2))]" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Placement dashboard</div>
                      <div className="mt-3 text-2xl font-semibold tracking-tight">Carrier-ready workflow</div>
                    </div>
                    <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">Secure intake</div>
                  </div>

                  <div className="relative mt-8 h-[28rem] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.02),_rgba(255,255,255,0.01))]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_18%,_rgba(56,189,248,0.18),_transparent_24%),linear-gradient(180deg,_rgba(2,8,22,0.3),_rgba(2,8,22,0.85))]" />
                    <div className="building-reflection absolute inset-y-0 left-[14%] w-[42%] rounded-t-[1.5rem] border border-cyan-300/10 bg-[linear-gradient(180deg,_rgba(125,211,252,0.22),_rgba(15,23,42,0.08)_20%,_rgba(8,15,29,0.82)_100%)] shadow-[0_0_60px_rgba(34,211,238,0.08)]" />
                    <div className="building-reflection absolute inset-y-[8%] right-[10%] w-[28%] rounded-t-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(148,163,184,0.25),_rgba(15,23,42,0.1)_24%,_rgba(9,12,22,0.9)_100%)]" />
                    <div className="absolute inset-y-0 left-[18%] w-px bg-gradient-to-b from-cyan-200/0 via-cyan-200/70 to-cyan-200/0" />
                    <div className="absolute inset-y-0 left-[27%] w-px bg-gradient-to-b from-cyan-200/0 via-cyan-200/55 to-cyan-200/0" />
                    <div className="absolute inset-y-0 right-[22%] w-px bg-gradient-to-b from-white/0 via-white/35 to-white/0" />
                    <div className="absolute inset-x-[8%] top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                    <div className="absolute inset-x-[12%] top-[36%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute inset-x-[16%] top-[62%] h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(180deg,_transparent,_rgba(2,8,22,0.92))]" />
                    <div className="circuit-arc absolute left-[5%] top-[10%] h-40 w-40 rounded-full border border-cyan-300/20" />
                    <div className="circuit-arc absolute right-[6%] top-[20%] h-56 w-56 rounded-full border border-cyan-300/10" />
                    <div className="circuit-node absolute left-[56%] top-[22%]" />
                    <div className="circuit-node absolute left-[72%] top-[38%]" />
                    <div className="circuit-node absolute left-[48%] top-[58%]" />
                    <div className="absolute left-[48%] top-[24%] h-px w-[24%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                    <div className="absolute left-[50%] top-[40%] h-px w-[22%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
                    <div className="absolute left-[48%] top-[60%] h-px w-[18%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
                    <div className="absolute left-[57%] top-[22%] h-[36%] w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.03))] p-5 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Placement status</div>
                    <div className="mt-4 text-4xl font-semibold tracking-tight text-white">Carrier aligned</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Disciplined submissions prepared for appointed carrier underwriting teams.</p>
                  </div>
                  <div className="rounded-[1.6rem] border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Compliance posture</div>
                    <ul className="mt-4 space-y-3 text-sm text-slate-100/90">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                        <span>Internal review aligned with carrier underwriting standards</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                        <span>Technology-enabled intake built for efficient bond placement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                        <span>Final approval and issuance remain with carrier partners</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-[#081122]/80 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Operational cadence</span>
                      <span className="text-cyan-200">Efficient + controlled</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,_rgba(125,211,252,0.45),_rgba(34,211,238,1),_rgba(147,197,253,0.7))] shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-400">A modern interface style with conservative, compliance-forward messaging for business buyers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />

      <section className="bg-white py-20 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight" data-testid="text-process-headline">
              Get Bonded in 4 Simple Steps
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              >
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">0{index + 1}</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-sm leading-7 text-slate-500" data-testid="text-process-disclaimer">
            Bond placement is subject to carrier underwriting and approval. Quantum Surety does not independently underwrite or issue bonds.
          </p>

          {/* Testimonials */}
          <div className="mt-16 border-t border-slate-200 pt-14">
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
              What clients say
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "Quantum Surety got our bid bond issued same-day. We were able to submit our bid on time and won the contract. Fast and professional.",
                  name: "Marcus T.",
                  title: "General Contractor, Dallas TX",
                },
                {
                  quote: "Switching from our BMC-85 trust to a BMC-84 bond was seamless. The team walked us through everything and filed with FMCSA within 24 hours.",
                  name: "Jennifer R.",
                  title: "Freight Broker, Houston TX",
                },
                {
                  quote: "We needed a performance bond for a public school project fast. Quantum had us approved and bonded in two days. Will use again.",
                  name: "David L.",
                  title: "Subcontractor, Austin TX",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <p className="mb-4 text-sm leading-relaxed text-slate-700">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate-400">
              Testimonials represent typical client experiences. Results vary by bond type and applicant qualifications.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#eef4f8] py-20 text-slate-900">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">Why choose us</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight" data-testid="text-about-headline">
            About Quantum Surety
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700" data-testid="text-about-body-primary">
            Quantum Surety is a licensed Texas insurance producer and surety bond agency specializing in placement for contractors, freight brokers, and businesses across Texas and all 50 states.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600" data-testid="text-about-body-secondary">
            We combine AI-powered underwriting technology with deep surety expertise to deliver faster bond approvals than traditional agencies. Our carrier network includes A-rated, T-listed companies authorized to issue bonds on federal and public projects nationwide. From a $5,000 license bond to a $10 million performance bond — we handle it.
          </p>
        </div>
      </section>
    </div>
  );
}
