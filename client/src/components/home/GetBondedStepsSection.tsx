const brandColors = {
  primary: "#0B3A6F",
  accent: "#1F6FDB",
};

type Step = {
  title: string;
  description: string;
  image: string;
};

type GetBondedStepsSectionProps = {
  stateLabel?: string;
};

export function GetBondedStepsSection({ stateLabel = "your state" }: GetBondedStepsSectionProps) {
  const steps: Step[] = [
    {
      title: "Choose Your Bond (State-Specific)",
      description: `Select your bond type and state. We match you with bonds compliant with ${stateLabel} regulations.`,
      image: "/images/steps/step-1.svg",
    },
    {
      title: "Get a Fast Quote",
      description: "Receive a fast surety bond quote online — often in minutes.",
      image: "/images/steps/step-2.svg",
    },
    {
      title: "Approve & Pay Securely",
      description: "Complete secure checkout online. No paperwork delays.",
      image: "/images/steps/step-3.svg",
    },
    {
      title: "Receive Your Bond",
      description: "Your surety bond is issued and delivered — often same day.",
      image: "/images/steps/step-4.svg",
    },
  ];

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Get Bonded in 4 Simple Steps",
    description: "Fast, compliant surety bonds — issued for your state.",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
      image: step.image,
    })),
  };

  return (
    <section id="get-bonded-steps" className="bg-white py-16 text-slate-900 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColors.accent }}>
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Get Bonded in 4 Simple Steps</h2>
          <p className="mt-4 text-lg text-slate-600">Fast, compliant surety bonds — issued for your state.</p>
        </header>

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
            >
              <article className="h-full">
                <div className="border-b border-slate-200 bg-white p-4">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto h-36 w-full max-w-[240px] object-contain"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColors.primary }}>
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">Step {index + 1} — {step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <a
            href="/quote"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: brandColors.primary }}
          >
            Get My Bond Now
          </a>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
    </section>
  );
}
