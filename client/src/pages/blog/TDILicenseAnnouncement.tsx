import { useSEO } from "@/hooks/useSEO";

export default function BlogTDILicense() {
  useSEO({
    title: "Quantum Surety Receives TDI Agency License #3480229 | Quantum Surety Blog",
    description:
      "Quantum Surety LLC is now fully licensed by the Texas Department of Insurance (License #3480229) as a General Lines Property & Casualty agency.",
    canonical: "/blog/quantum-surety-tdi-licensed-agency-3480229",
    ogType: "article",
  });

  return (
    <article className="max-w-3xl mx-auto pb-16 space-y-8 pt-10 px-4">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-medium border border-emerald-400/20">
            Company News
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">
            April 2026
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">
          Quantum Surety Receives Texas Department of Insurance Agency License #3480229
        </h1>
        <p className="text-lg text-slate-300">
          Quantum Surety LLC is now fully licensed by the Texas Department of Insurance,
          making us one of the few AI-powered surety bond agencies operating under full
          TDI regulatory oversight in Texas.
        </p>
      </header>

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
        <p className="text-sm text-emerald-200 font-medium mb-2">License Details</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Agency", value: "Quantum Surety LLC" },
            { label: "License Number", value: "#3480229" },
            { label: "License Type", value: "General Lines P&C" },
            { label: "Status", value: "Active" },
            { label: "Issued By", value: "Texas Dept. of Insurance" },
            { label: "Effective", value: "April 2026" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-emerald-400/70 text-xs uppercase tracking-wide">{item.label}</p>
              <p className="text-white font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
