export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl" data-testid="text-hero-headline">
            Fast, Compliant License &amp; Permit Bond Placement
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300 md:text-xl" data-testid="text-hero-subheadline">
            Quantum Surety places surety bonds through A-rated insurance carriers using disciplined underwriting and a technology-enabled submission process.
          </p>
          <p className="mx-auto max-w-4xl text-sm text-slate-400" data-testid="text-hero-disclaimer">
            All bonds are underwritten and approved by appointed carrier partners. Quantum Surety does not independently underwrite or issue bonds.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-center text-3xl font-semibold" data-testid="text-services-headline">
            License &amp; Permit Surety Bonds
          </h2>

          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-lg text-gray-700" data-testid="text-services-body-primary">
              We assist principals in securing license and permit bonds required by state, municipal, and regulatory authorities.
            </p>

            <p className="text-gray-600" data-testid="text-services-body-secondary">
              Submissions are pre-qualified using internal underwriting criteria aligned with carrier guidelines and placed with appointed insurance carriers for final underwriting and approval.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-semibold" data-testid="text-process-headline">
            How the Bond Placement Process Works
          </h2>

          <div className="grid gap-8 text-center md:grid-cols-4">
            {[
              {
                title: "1. Submit Request",
                description: "Provide business and bond requirement details through our secure form.",
              },
              {
                title: "2. Pre-Underwriting Review",
                description: "We evaluate submissions using underwriting standards aligned with our carrier partners.",
              },
              {
                title: "3. Carrier Submission",
                description: "Clean, complete submissions are delivered to the appropriate carrier underwriting team.",
              },
              {
                title: "4. Carrier Approval & Issuance",
                description: "Upon approval, the bond is executed by the carrier and delivered to the principal.",
              },
            ].map((step) => (
              <div key={step.title}>
                <h3 className="mb-2 font-semibold" data-testid={`text-step-${step.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-center text-xs text-gray-500" data-testid="text-process-disclaimer">
            Bond placement is subject to carrier underwriting and approval. Submission does not guarantee bond issuance.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-semibold" data-testid="text-about-headline">
            About Quantum Surety
          </h2>

          <p className="mb-4 text-lg text-gray-700" data-testid="text-about-body-primary">
            Quantum Surety is a Texas-licensed insurance producer specializing in surety bond placement for license and permit obligations.
          </p>

          <p className="text-gray-600" data-testid="text-about-body-secondary">
            We work with appointed A-rated carriers to pre-qualify submissions, streamline underwriting review, and help principals obtain bonds efficiently and compliantly. All bonds are underwritten and issued by our carrier partners.
          </p>
        </div>
      </section>
    </div>
  );
}
