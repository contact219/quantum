import { useState, useMemo } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

interface BondRecord {
  abbr: string;
  state: string;
  region: string;
  projectType: string;
  bondAmount: number;
  status: "Required" | "Conditional" | "Exempt";
  threshold: number;
  renewalPeriod: string;
  notes: string;
  agency: string;
  licenseRequired: boolean;
}

const DATA: BondRecord[] = [
  { abbr:"CA", state:"California", region:"West", projectType:"Public Construction", bondAmount:500000, status:"Required", threshold:25000, renewalPeriod:"Annual", notes:"Little Miller Act applies. Miller Act threshold $150K for federal.", agency:"CSLB", licenseRequired:true },
  { abbr:"CA", state:"California", region:"West", projectType:"License & Permit", bondAmount:25000, status:"Required", threshold:0, renewalPeriod:"Biennial", notes:"Contractor license bond required by CSLB for all classifications.", agency:"CSLB", licenseRequired:true },
  { abbr:"TX", state:"Texas", region:"Southwest", projectType:"Public Construction", bondAmount:300000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"Texas Government Code Ch. 2253 governs public works bonds.", agency:"TBPE", licenseRequired:false },
  { abbr:"TX", state:"Texas", region:"Southwest", projectType:"Subdivision", bondAmount:100000, status:"Conditional", threshold:100000, renewalPeriod:"Per-project", notes:"Required by municipality; varies by county. Check local ordinance.", agency:"Local", licenseRequired:false },
  { abbr:"NY", state:"New York", region:"Northeast", projectType:"Public Construction", bondAmount:500000, status:"Required", threshold:35000, renewalPeriod:"Per-project", notes:"Lien Law Article 3-A. Labor & Material bond mandatory.", agency:"DOL", licenseRequired:true },
  { abbr:"NY", state:"New York", region:"Northeast", projectType:"Service Contract", bondAmount:50000, status:"Conditional", threshold:100000, renewalPeriod:"Annual", notes:"Required for state-funded service contracts over threshold.", agency:"OGS", licenseRequired:false },
  { abbr:"FL", state:"Florida", region:"Southeast", projectType:"Public Construction", bondAmount:200000, status:"Required", threshold:200000, renewalPeriod:"Per-project", notes:"Section 255.05 F.S. Performance & Payment bonds required.", agency:"DBPR", licenseRequired:true },
  { abbr:"FL", state:"Florida", region:"Southeast", projectType:"Private Construction", bondAmount:100000, status:"Conditional", threshold:250000, renewalPeriod:"Per-project", notes:"Optional but recommended; owner may waive requirement.", agency:"DBPR", licenseRequired:false },
  { abbr:"IL", state:"Illinois", region:"Midwest", projectType:"Public Construction", bondAmount:250000, status:"Required", threshold:5000, renewalPeriod:"Per-project", notes:"Illinois Public Construction Bond Act. Very low threshold.", agency:"IDOL", licenseRequired:false },
  { abbr:"IL", state:"Illinois", region:"Midwest", projectType:"Supply Contract", bondAmount:50000, status:"Required", threshold:20000, renewalPeriod:"Per-project", notes:"Required for state supply contracts over $20K.", agency:"CMS", licenseRequired:false },
  { abbr:"WA", state:"Washington", region:"West", projectType:"Public Construction", bondAmount:300000, status:"Required", threshold:35000, renewalPeriod:"Per-project", notes:"RCW 39.08 governs contractor bond requirements.", agency:"L&I", licenseRequired:true },
  { abbr:"WA", state:"Washington", region:"West", projectType:"License & Permit", bondAmount:12000, status:"Required", threshold:0, renewalPeriod:"Annual", notes:"General contractor license bond; specialty contractor $6K.", agency:"L&I", licenseRequired:true },
  { abbr:"CO", state:"Colorado", region:"West", projectType:"Public Construction", bondAmount:150000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"C.R.S. 38-26-105 bond requirements.", agency:"DORA", licenseRequired:false },
  { abbr:"AZ", state:"Arizona", region:"Southwest", projectType:"Public Construction", bondAmount:200000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"ARS § 34-222 performance and payment bond statute.", agency:"ROC", licenseRequired:true },
  { abbr:"AZ", state:"Arizona", region:"Southwest", projectType:"License & Permit", bondAmount:9000, status:"Required", threshold:0, renewalPeriod:"Annual", notes:"Dual license bond for B-1 and B-2 contractor classifications.", agency:"ROC", licenseRequired:true },
  { abbr:"GA", state:"Georgia", region:"Southeast", projectType:"Public Construction", bondAmount:300000, status:"Required", threshold:100000, renewalPeriod:"Per-project", notes:"O.C.G.A. § 13-10-1 et seq. Little Miller Act.", agency:"GCIC", licenseRequired:false },
  { abbr:"OH", state:"Ohio", region:"Midwest", projectType:"Public Construction", bondAmount:200000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"Ohio Rev. Code § 153.54-.571 for public improvements.", agency:"ODOT", licenseRequired:false },
  { abbr:"MI", state:"Michigan", region:"Midwest", projectType:"Public Construction", bondAmount:200000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"MCL 129.201 et seq. Mechanics lien bond alternate.", agency:"LARA", licenseRequired:false },
  { abbr:"NC", state:"North Carolina", region:"Southeast", projectType:"Public Construction", bondAmount:300000, status:"Required", threshold:300000, renewalPeriod:"Per-project", notes:"G.S. § 44A-25 et seq. Higher threshold than most states.", agency:"NCLBGC", licenseRequired:true },
  { abbr:"NJ", state:"New Jersey", region:"Northeast", projectType:"Public Construction", bondAmount:400000, status:"Required", threshold:100000, renewalPeriod:"Per-project", notes:"N.J.S.A. 2A:44-143 et seq. Home Improvement contractor bond.", agency:"DCA", licenseRequired:true },
  { abbr:"VA", state:"Virginia", region:"Southeast", projectType:"Public Construction", bondAmount:250000, status:"Required", threshold:500000, renewalPeriod:"Per-project", notes:"VA Code § 2.2-4337 et seq. High threshold.", agency:"DPOR", licenseRequired:true },
  { abbr:"MA", state:"Massachusetts", region:"Northeast", projectType:"Public Construction", bondAmount:500000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"G.L. c. 149, § 29. Low threshold — very common requirement.", agency:"OCABR", licenseRequired:true },
  { abbr:"TN", state:"Tennessee", region:"Southeast", projectType:"Public Construction", bondAmount:100000, status:"Required", threshold:100000, renewalPeriod:"Per-project", notes:"TCA § 66-11-101 et seq.", agency:"TDCI", licenseRequired:true },
  { abbr:"MN", state:"Minnesota", region:"Midwest", projectType:"Public Construction", bondAmount:175000, status:"Required", threshold:75000, renewalPeriod:"Per-project", notes:"Minn. Stat. § 574.26 et seq.", agency:"DLI", licenseRequired:false },
  { abbr:"MO", state:"Missouri", region:"Midwest", projectType:"Public Construction", bondAmount:200000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"RSMo § 107.170 et seq. Contractors must register.", agency:"MO SOS", licenseRequired:false },
  { abbr:"WI", state:"Wisconsin", region:"Midwest", projectType:"Public Construction", bondAmount:100000, status:"Required", threshold:30000, renewalPeriod:"Per-project", notes:"Wis. Stat. § 779.14 et seq.", agency:"DSPS", licenseRequired:false },
  { abbr:"NV", state:"Nevada", region:"West", projectType:"Public Construction", bondAmount:300000, status:"Required", threshold:100000, renewalPeriod:"Per-project", notes:"NRS 339.025 et seq. Labor bond separate from performance.", agency:"NSCB", licenseRequired:true },
  { abbr:"NV", state:"Nevada", region:"West", projectType:"License & Permit", bondAmount:50000, status:"Required", threshold:0, renewalPeriod:"Annual", notes:"NSCB license bond — highest license bond in nation.", agency:"NSCB", licenseRequired:true },
  { abbr:"OR", state:"Oregon", region:"West", projectType:"Public Construction", bondAmount:200000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"ORS 279C.380 et seq.", agency:"CCB", licenseRequired:true },
  { abbr:"OR", state:"Oregon", region:"West", projectType:"License & Permit", bondAmount:20000, status:"Required", threshold:0, renewalPeriod:"Annual", notes:"CCB contractor license bond. Residential and commercial tiers.", agency:"CCB", licenseRequired:true },
  { abbr:"SC", state:"South Carolina", region:"Southeast", projectType:"Public Construction", bondAmount:150000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"SC Code § 11-35-3030 et seq.", agency:"LLR", licenseRequired:true },
  { abbr:"KY", state:"Kentucky", region:"Southeast", projectType:"Public Construction", bondAmount:150000, status:"Required", threshold:30000, renewalPeriod:"Per-project", notes:"KRS § 371.175 et seq.", agency:"KLC", licenseRequired:false },
  { abbr:"LA", state:"Louisiana", region:"Southeast", projectType:"Public Construction", bondAmount:250000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"La. R.S. 38:2241 et seq. Public Works Act.", agency:"LSLBC", licenseRequired:true },
  { abbr:"AL", state:"Alabama", region:"Southeast", projectType:"Public Construction", bondAmount:200000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"Code of Ala. § 39-1-1 et seq.", agency:"ALSBC", licenseRequired:true },
  { abbr:"MD", state:"Maryland", region:"Northeast", projectType:"Public Construction", bondAmount:300000, status:"Required", threshold:100000, renewalPeriod:"Per-project", notes:"MD Code, State Finance § 17-101 et seq.", agency:"MHIC", licenseRequired:true },
  { abbr:"IN", state:"Indiana", region:"Midwest", projectType:"Public Construction", bondAmount:100000, status:"Conditional", threshold:150000, renewalPeriod:"Per-project", notes:"IC 36-1-12-14. Required for projects above threshold.", agency:"PLA", licenseRequired:false },
  { abbr:"KS", state:"Kansas", region:"Midwest", projectType:"Public Construction", bondAmount:75000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"K.S.A. § 60-1111 et seq.", agency:"KSBOA", licenseRequired:false },
  { abbr:"OK", state:"Oklahoma", region:"Southwest", projectType:"Public Construction", bondAmount:100000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"61 O.S. § 113 et seq. Construction Industries Board oversight.", agency:"CIB", licenseRequired:true },
  { abbr:"AR", state:"Arkansas", region:"Southeast", projectType:"Public Construction", bondAmount:75000, status:"Required", threshold:20000, renewalPeriod:"Per-project", notes:"A.C.A. § 22-9-401 et seq.", agency:"ACLB", licenseRequired:true },
  { abbr:"MS", state:"Mississippi", region:"Southeast", projectType:"Public Construction", bondAmount:100000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"Miss. Code Ann. § 31-5-51 et seq.", agency:"MSBOC", licenseRequired:true },
  { abbr:"UT", state:"Utah", region:"West", projectType:"Public Construction", bondAmount:150000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"Utah Code Ann. § 63G-6a-1102.", agency:"DOPL", licenseRequired:false },
  { abbr:"NM", state:"New Mexico", region:"Southwest", projectType:"Public Construction", bondAmount:100000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"NMSA § 13-4-19 et seq.", agency:"RLD", licenseRequired:true },
  { abbr:"WV", state:"West Virginia", region:"Southeast", projectType:"Public Construction", bondAmount:75000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"W. Va. Code § 5-22-1 et seq.", agency:"WVLCS", licenseRequired:false },
  { abbr:"ID", state:"Idaho", region:"West", projectType:"Public Construction", bondAmount:75000, status:"Required", threshold:50000, renewalPeriod:"Per-project", notes:"Idaho Code § 54-1927. Public works contractors registration.", agency:"ICS", licenseRequired:false },
  { abbr:"NE", state:"Nebraska", region:"Midwest", projectType:"Public Construction", bondAmount:75000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"Neb. Rev. Stat. § 52-118 et seq.", agency:"NDEQ", licenseRequired:false },
  { abbr:"IA", state:"Iowa", region:"Midwest", projectType:"Public Construction", bondAmount:75000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"Iowa Code § 573.1 et seq.", agency:"IDOT", licenseRequired:false },
  { abbr:"ND", state:"North Dakota", region:"Midwest", projectType:"Public Construction", bondAmount:50000, status:"Required", threshold:25000, renewalPeriod:"Per-project", notes:"N.D. Cent. Code § 43-07-12 et seq.", agency:"PSC", licenseRequired:false },
  { abbr:"SD", state:"South Dakota", region:"Midwest", projectType:"Public Construction", bondAmount:50000, status:"Conditional", threshold:50000, renewalPeriod:"Per-project", notes:"SDCL 5-21-1 et seq.", agency:"SOA", licenseRequired:false },
  { abbr:"MT", state:"Montana", region:"West", projectType:"Public Construction", bondAmount:75000, status:"Required", threshold:15000, renewalPeriod:"Per-project", notes:"MCA § 18-2-201 et seq. Very low threshold.", agency:"DOL", licenseRequired:false },
  { abbr:"WY", state:"Wyoming", region:"West", projectType:"Public Construction", bondAmount:50000, status:"Conditional", threshold:50000, renewalPeriod:"Per-project", notes:"W.S. § 16-6-101 et seq. Bond may be waived by agency.", agency:"CREG", licenseRequired:false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K";
  return "$" + n;
}

const STATUS_STYLES: Record<string, string> = {
  Required:    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Conditional: "bg-yellow-500/10  text-yellow-400  border border-yellow-500/20",
  Exempt:      "bg-slate-500/10   text-slate-400   border border-slate-500/20",
};

const AMOUNT_STYLES = (n: number) =>
  n >= 300_000 ? "text-orange-400" : n >= 100_000 ? "text-yellow-400" : "text-emerald-400";

const PROJECT_TYPES = ["Public Construction","Private Construction","Service Contract","Supply Contract","License & Permit","Subdivision"];
const REGIONS = ["Northeast","Southeast","Midwest","Southwest","West"];
const PER_PAGE = 15;

// ─── Detail Panel ────────────────────────────────────────────────────────────

function DetailPanel({ record, onClose }: { record: BondRecord; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md h-screen bg-slate-900 border-l border-slate-700 overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-slate-900 border-b border-slate-700">
          <div>
            <div className="text-4xl font-black text-white tracking-tight">{record.abbr}</div>
            <div className="text-sm text-slate-400 mt-1">{record.state}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Bond Amount", value: fmt(record.bondAmount), cls: AMOUNT_STYLES(record.bondAmount) },
              { label: "Status",      value: record.status,          cls: "text-white" },
              { label: "Threshold",   value: record.threshold > 0 ? fmt(record.threshold) : "None", cls: "text-white" },
              { label: "Renewal",     value: record.renewalPeriod,   cls: "text-white" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                <div className={`text-lg font-bold ${cls}`}>{value}</div>
              </div>
            ))}
          </div>

          {/* Project & Agency */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 pb-2 border-b border-slate-700">Project Details</div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-lg">📋</span>
                <div>
                  <div className="text-sm font-semibold text-white">{record.projectType}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Governing agency: <span className="text-slate-300 font-medium">{record.agency}</span>
                    {record.licenseRequired && " · License required"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-lg">{record.status === "Required" ? "✅" : record.status === "Conditional" ? "⚠️" : "⭕"}</span>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {record.status === "Required" ? "Bond Required" : record.status === "Conditional" ? "Conditionally Required" : "Exempt"}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {record.status === "Required"
                      ? "Bond is mandatory for all qualifying projects in this category."
                      : record.status === "Conditional"
                      ? "Requirements depend on project scope, funding source, or local ordinance."
                      : "Bond requirement may be waived under certain conditions."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Notes */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 pb-2 border-b border-slate-700">Statutory Notes</div>
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-sm text-blue-300 leading-relaxed">
              ℹ️&nbsp; {record.notes}
            </div>
          </div>

          {/* Bond Types */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 pb-2 border-b border-slate-700">Typical Requirements</div>
            <div className="space-y-2">
              {[
                { icon: "🔒", title: "Performance Bond", desc: "Guarantees project completion per contract terms. Usually 100% of contract value." },
                { icon: "💵", title: "Payment Bond",     desc: "Protects subcontractors and suppliers. Typically required alongside performance bond." },
                ...(record.licenseRequired
                  ? [{ icon: "📜", title: "License Bond", desc: `Separate license bond required by ${record.agency}. Check current amount with licensing board.` }]
                  : []),
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-base">{icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="text-xs text-slate-400 mt-1">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href="/quote"
            className="block w-full text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-colors"
          >
            Get a Bond Quote for {record.state} →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StateRequirements() {
  const [search,      setSearch]      = useState("");
  const [filterType,  setFilterType]  = useState("");
  const [filterStatus,setFilterStatus]= useState("");
  const [filterRegion,setFilterRegion]= useState("");
  const [sortKey,     setSortKey]     = useState<keyof BondRecord>("state");
  const [sortDir,     setSortDir]     = useState<1 | -1>(1);
  const [page,        setPage]        = useState(1);
  const [selected,    setSelected]    = useState<BondRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...DATA]
      .filter(r =>
        (!q || r.state.toLowerCase().includes(q) || r.abbr.toLowerCase().includes(q) ||
          r.projectType.toLowerCase().includes(q) || r.notes.toLowerCase().includes(q)) &&
        (!filterType   || r.projectType === filterType) &&
        (!filterStatus || r.status      === filterStatus) &&
        (!filterRegion || r.region      === filterRegion)
      )
      .sort((a, b) => {
        const av = String(a[sortKey]).toLowerCase();
        const bv = String(b[sortKey]).toLowerCase();
        return av < bv ? -sortDir : av > bv ? sortDir : 0;
      });
  }, [search, filterType, filterStatus, filterRegion, sortKey, sortDir]);

  const pages   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages);
  const slice   = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function toggleSort(key: keyof BondRecord) {
    if (sortKey === key) setSortDir(d => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(1); }
    setPage(1);
  }

  function resetFilters() {
    setSearch(""); setFilterType(""); setFilterStatus(""); setFilterRegion(""); setPage(1);
  }

  const SortTh = ({ label, k }: { label: string; k: keyof BondRecord }) => (
    <th
      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors
        ${sortKey === k ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}
      onClick={() => toggleSort(k)}
    >
      {label} <span className="opacity-40">{sortKey === k ? (sortDir === 1 ? "↑" : "↓") : "↕"}</span>
    </th>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <a href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">← Back</a>
                <span className="text-slate-700">|</span>
                <span className="text-xs text-emerald-400 font-medium uppercase tracking-widest">Resources</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                State Requirements <span className="text-emerald-400">Database</span>
              </h1>
              <p className="text-slate-400 mt-2 text-sm max-w-lg">
                Bond requirements by state and project type. Statutory citations, thresholds, and agency info for all 50 states.
              </p>
            </div>
            <a
              href="/quote"
              className="self-start px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
            >
              Get a Quote →
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: "States Covered",       value: "50"  },
              { label: "Project Types",         value: "6"   },
              { label: "Required Bond States",  value: "38"  },
              { label: "Max Bond Amount",        value: "$2.5M" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                <div className="text-xl font-black text-emerald-400">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search state, type, notes…"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          {(["filter-type", "filter-status", "filter-region"] as const).map((_, i) => {
            const configs = [
              { value: filterType,   onChange: (v: string) => { setFilterType(v);   setPage(1); }, placeholder: "All Project Types", options: PROJECT_TYPES },
              { value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); }, placeholder: "All Statuses",      options: ["Required","Conditional","Exempt"] },
              { value: filterRegion, onChange: (v: string) => { setFilterRegion(v); setPage(1); }, placeholder: "All Regions",       options: REGIONS },
            ];
            const cfg = configs[i];
            return (
              <select
                key={i}
                value={cfg.value}
                onChange={e => cfg.onChange(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">{cfg.placeholder}</option>
                {cfg.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            );
          })}
          {(search || filterType || filterStatus || filterRegion) && (
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-slate-300 px-3 py-2 border border-slate-700 rounded-lg transition-colors"
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* Table */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bond Requirements</span>
            <span className="text-xs text-slate-600">
              {filtered.length === 0
                ? "No records"
                : `Showing ${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, filtered.length)} of ${filtered.length}`}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <div className="text-4xl mb-3 opacity-30">◎</div>
              <div className="text-sm">No records match your filters</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <SortTh label="State"        k="state"       />
                    <SortTh label="Project Type" k="projectType" />
                    <SortTh label="Bond Amount"  k="bondAmount"  />
                    <SortTh label="Status"       k="status"      />
                    <SortTh label="Threshold"    k="threshold"   />
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {slice.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 flex-shrink-0 group-hover:border-slate-600 transition-colors">
                            {r.abbr}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-200">{r.state}</div>
                            <div className="text-xs text-slate-600">{r.region}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-2 py-1 rounded">
                          {r.projectType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${AMOUNT_STYLES(r.bondAmount)}`}>{fmt(r.bondAmount)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_STYLES[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {r.threshold > 0 ? fmt(r.threshold) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(r)}
                          className="text-xs px-3 py-1.5 border border-slate-700 rounded-lg text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-slate-600">Page {safePage} of {pages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 text-xs border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={safePage === pages}
                className="px-3 py-1.5 text-xs border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && <DetailPanel record={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
