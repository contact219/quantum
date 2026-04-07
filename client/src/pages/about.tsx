import { SEO_PAGES, useSEO } from "@/hooks/useSEO";

function LicensingSection() {
  return (
    <section className="space-y-6 py-12 border-t border-white/10">
      <h2 className="text-2xl font-bold text-white">Licensing &amp; Compliance</h2>
      <p className="text-slate-300 leading-relaxed">
        Quantum Surety LLC is a licensed surety bond agency regulated by the Texas
        Department of Insurance. We operate under the requirements of the Texas
        Insurance Code and are authorized to issue surety bonds for contractors
        across Texas and nationwide through our carrier appointments.
      </p>

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏛️</span>
          <div>
            <p className="text-lg font-bold text-white">Texas Department of Insurance</p>
            <p className="text-emerald-300 text-sm">Licensed Surety Bond Agency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            { label: "Agency Name", value: "Quantum Surety LLC" },
            { label: "License Number", value: "#3480229" },
            { label: "License Type", value: "General Lines Property & Casualty" },
            { label: "License Status", value: "Active" },
            { label: "Regulator", value: "Texas Dept. of Insurance" },
            { label: "Service Area", value: "Texas & Nationwide" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
              <p className={`font-medium mt-0.5 ${item.label === "License Status" ? "text-emerald-300" : "text-white"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <a
          href="https://www.tdi.texas.gov/agent/agentlicensequery.html"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 underline"
        >
          Verify license #3480229 on TDI website →
        </a>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
        <p className="font-semibold text-white">Carrier Appointments</p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Quantum Surety issues bonds through appointments with RLI Insurance Company
          and other top-rated surety carriers. All carriers maintain A or better
          ratings from A.M. Best, ensuring every bond we issue is backed by a
          financially strong institution.
        </p>
      </div>
    </section>
  );
}

export default function About() {
  useSEO(SEO_PAGES.about);

  return (
    <main className="min-h-screen bg-[#020816] py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-10">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">About Quantum Surety</p>
          <h1 className="text-4xl font-bold text-white">Modern surety placement, built for contractors.</h1>
          <p className="text-slate-300 leading-relaxed max-w-3xl">
            We combine AI-assisted workflows with experienced bond support to help contractors secure bonds quickly,
            accurately, and with full transparency.
          </p>
        </section>
        <LicensingSection />
      </div>
    </main>
  );
}
