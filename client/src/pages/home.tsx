const trustMetrics = [
  { value: "<24 hrs", label: "Response window" },
  { value: "$250M+", label: "Program capacity" },
  { value: "A-rated", label: "Carrier network" },
];

const capabilities = [
  "Delegated intake orchestration",
  "Executive-level underwriting visibility",
  "Secure, rapid bond placement workflows",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020816] text-white">
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
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
              Quantum Surety
            </div>

            <h1
              className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
              data-testid="text-hero-headline"
            >
              Enterprise surety built for secure velocity.
            </h1>

            <p
              className="mt-8 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl"
              data-testid="text-hero-subheadline"
            >
              Quantum Surety blends disciplined underwriting, digital precision, and executive-grade service to accelerate bond placement without compromising control.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/quote"
                className="inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-200"
                data-testid="link-hero-primary-cta"
              >
                Request Executive Review
              </a>
              <a
                href="/construction"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/10"
                data-testid="link-hero-secondary-cta"
              >
                Explore Capabilities
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
              All bonds are underwritten by appointed carrier partners and remain subject to final carrier approval. Quantum Surety does not independently issue bonds.
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
                      <div className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Live placement matrix</div>
                      <div className="mt-3 text-2xl font-semibold tracking-tight">Quantum corridor</div>
                    </div>
                    <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">Protected flow</div>
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
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Executive signal</div>
                    <div className="mt-4 text-4xl font-semibold tracking-tight text-white">98.4%</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Submission completeness score across digitally prepared accounts entering carrier review.</p>
                  </div>
                  <div className="rounded-[1.6rem] border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">System posture</div>
                    <ul className="mt-4 space-y-3 text-sm text-slate-100/90">
                      {capabilities.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-[#081122]/80 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Operational cadence</span>
                      <span className="text-cyan-200">Rapid + controlled</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,_rgba(125,211,252,0.45),_rgba(34,211,238,1),_rgba(147,197,253,0.7))] shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-400">Built to reassure sophisticated buyers while expressing the speed and energy of a modern underwriting interface.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
