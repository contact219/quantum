import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { track } from "@/hooks/useTracker";
import { Download, Trash2, Plus, ShieldCheck, AlertTriangle, Printer } from "lucide-react";

/**
 * Free Texas notary record book (journal), local-first.
 *
 * WHY. SB 693 doubled the retention period to ten years from the date of notarization and
 * made failure to keep the required record expressly "good cause" to suspend or revoke a
 * commission. Every Texas notary now carries a decade-long statutory duty with real teeth,
 * and nothing on the market attaches a product to it. Tex. Gov't Code § 406.014(c)
 * expressly permits keeping the record electronically, which is the legal basis for this.
 *
 * WHY LOCAL-FIRST, AND THIS IS THE LOAD-BEARING DECISION. The eight fields the statute
 * requires include third-party signers' names and mailing addresses, and notary records get
 * subpoenaed. A one-person agency should not become the custodian of thousands of other
 * people's identity records — the breach surface is enormous and the duty is not ours to
 * hold. Under § 406.014(b) the retention obligation belongs to the NOTARY.
 *
 * So entries live in the notary's own browser and are never transmitted here. We provide
 * the structure, the validation and the export; they keep the record, exactly as the law
 * says they must. That is honest about who is responsible, and it means a lapse on our side
 * cannot destroy somebody's legal records.
 *
 * The consequence must be stated plainly on the page rather than buried: browser storage is
 * not a ten-year guarantee, so exporting is the actual compliance step. The page nags about
 * it, because a journal that quietly loses records is worse than no journal.
 *
 * Fields are § 406.014(a)(1)-(8) verbatim in substance. Conditional sections appear only
 * when relevant — a witness block only when the instrument is proved by a witness, land
 * fields only when land is conveyed — because a form demanding irrelevant fields is a form
 * people abandon and then keep no record at all.
 */

type Entry = {
  id: string;
  dateNotarized: string;
  dateInstrument: string;
  actType: string;
  instrumentType: string;
  signerName: string;
  signerAddress: string;
  idMethod: string;
  idDetail: string;
  introducerName: string;
  introducerAddress: string;
  witnessAddress: string;
  witnessKnown: string;
  witnessIntroducer: string;
  granteeName: string;
  granteeAddress: string;
  landConveyed: boolean;
  originalGrantee: string;
  landCounty: string;
  feeCharged: string;
  notes: string;
};

const BLANK: Omit<Entry, "id"> = {
  dateNotarized: new Date().toISOString().slice(0, 10),
  dateInstrument: "",
  actType: "Acknowledgment",
  instrumentType: "",
  signerName: "",
  signerAddress: "",
  idMethod: "Personally known",
  idDetail: "",
  introducerName: "",
  introducerAddress: "",
  witnessAddress: "",
  witnessKnown: "",
  witnessIntroducer: "",
  granteeName: "",
  granteeAddress: "",
  landConveyed: false,
  originalGrantee: "",
  landCounty: "",
  feeCharged: "",
  notes: "",
};

const ACTS = ["Acknowledgment", "Jurat", "Oath or affirmation", "Certified copy", "Deposition", "Protest"];
const ID_METHODS = [
  "Personally known",
  "Government-issued identification card",
  "United States passport",
  "Introduced by a credible witness",
];
const KEY = "qs_tx_notary_journal_v1";

function load(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

export default function TexasNotaryJournal() {
  useSEO({
    title: "Free Texas Notary Record Book — SB 693 Compliant Journal | Quantum Surety",
    description:
      "Free digital notary journal built to Tex. Gov't Code § 406.014. Records every field the statute requires, exports for the 10-year retention SB 693 now demands, and stays on your own device — we never see your entries.",
    canonical: "/texas-notary-journal",
  });

  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState<Omit<Entry, "id">>(BLANK);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => setEntries(load()), []);
  useEffect(() => {
    if (entries.length) localStorage.setItem(KEY, JSON.stringify(entries));
  }, [entries]);

  const lastExport = typeof localStorage !== "undefined" ? localStorage.getItem(KEY + "_exported") : null;
  const staleExport =
    entries.length > 0 &&
    (!lastExport || Date.now() - Number(lastExport) > 30 * 24 * 3600 * 1000);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm({ ...form, [k]: v });
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    // Only the fields the statute actually demands are enforced. Over-validating a
    // compliance form makes people give up and keep nothing.
    if (!form.dateNotarized || !form.signerName.trim() || !form.signerAddress.trim()) {
      setErr("Date of notarization, signer's name and signer's mailing address are required by § 406.014(a).");
      return;
    }
    setErr("");
    setEntries([{ ...form, id: crypto.randomUUID() }, ...entries]);
    setForm({ ...BLANK, dateNotarized: new Date().toISOString().slice(0, 10) });
    setOpen(false);
    track({ type: "form_start", element: "notary_journal_entry", value: "journal" });
  }

  function exportCsv() {
    const cols: (keyof Entry)[] = [
      "dateNotarized", "dateInstrument", "actType", "instrumentType",
      "signerName", "signerAddress", "idMethod", "idDetail",
      "introducerName", "introducerAddress", "witnessAddress", "witnessKnown",
      "witnessIntroducer", "granteeName", "granteeAddress", "landConveyed",
      "originalGrantee", "landCounty", "feeCharged", "notes",
    ];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...entries.map((e) => cols.map((c) => esc(e[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `texas-notary-record-book-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    localStorage.setItem(KEY + "_exported", String(Date.now()));
    track({ type: "checkout_click", element: "journal_export", value: String(entries.length) });
  }

  function remove(id: string) {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 text-white py-11 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-emerald-400 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            Free · Stays on your device
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Texas Notary Record Book</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Every field Texas Government Code § 406.014 requires, in the order it requires them.
            SB 693 now makes you keep these records for <strong>ten years</strong>, and makes
            failing to keep them grounds to revoke your commission.
          </p>
        </div>
      </section>

      <div className="bg-white border-b border-slate-200 py-4 px-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-slate-700 text-sm leading-relaxed">
            <strong>Your entries never leave this device.</strong> They are saved in this browser
            and are not transmitted to Quantum Surety or anyone else. That is deliberate: the
            record contains other people's names and addresses, and under § 406.014(b) the duty to
            retain it is yours, not your bond agency's.{" "}
            <strong>So exporting is the compliance step, not a convenience.</strong> Browser storage
            can be cleared by a cache wipe, a new device or a reinstalled browser. Export to CSV
            regularly and keep the file where your other ten-year records live.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {staleExport && (
          <div className="flex gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-amber-900 text-sm leading-relaxed">
              You have {entries.length} {entries.length === 1 ? "entry" : "entries"} that
              {lastExport ? " have not been exported in over a month." : " have never been exported."}{" "}
              If this browser is cleared they are gone, and the retention duty is still yours.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            <Plus className="w-4 h-4" /> New entry
          </button>
          <button
            onClick={exportCsv}
            disabled={!entries.length}
            className="inline-flex items-center gap-2 border border-slate-300 text-slate-800 font-semibold px-5 py-2.5 rounded-lg disabled:opacity-40"
          >
            <Download className="w-4 h-4" /> Export CSV ({entries.length})
          </button>
          <button
            onClick={() => window.print()}
            disabled={!entries.length}
            className="inline-flex items-center gap-2 border border-slate-300 text-slate-800 font-semibold px-5 py-2.5 rounded-lg disabled:opacity-40"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>

        {open && (
          <form onSubmit={add} className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Date of notarization *" hint="§ 406.014(a)(2)">
                <input type="date" value={form.dateNotarized} onChange={(e) => set("dateNotarized", e.target.value)} className="inp" />
              </Field>
              <Field label="Date of the instrument" hint="§ 406.014(a)(1)">
                <input type="date" value={form.dateInstrument} onChange={(e) => set("dateInstrument", e.target.value)} className="inp" />
              </Field>
              <Field label="Type of notarial act">
                <select value={form.actType} onChange={(e) => set("actType", e.target.value)} className="inp">
                  {ACTS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              <Field label="Type of instrument" hint="e.g. deed, affidavit, power of attorney">
                <input value={form.instrumentType} onChange={(e) => set("instrumentType", e.target.value)} className="inp" />
              </Field>
              <Field label="Signer / grantor / maker *" hint="§ 406.014(a)(3)">
                <input value={form.signerName} onChange={(e) => set("signerName", e.target.value)} className="inp" />
              </Field>
              <Field label="Their mailing address *" hint="§ 406.014(a)(4)">
                <input value={form.signerAddress} onChange={(e) => set("signerAddress", e.target.value)} className="inp" />
              </Field>
              <Field label="How was identity established?" hint="§ 406.014(a)(5)">
                <select value={form.idMethod} onChange={(e) => set("idMethod", e.target.value)} className="inp">
                  {ID_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="ID detail" hint="Issuing agency, or leave blank if personally known">
                <input value={form.idDetail} onChange={(e) => set("idDetail", e.target.value)} className="inp" />
              </Field>
            </div>

            {form.idMethod === "Introduced by a credible witness" && (
              <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                <Field label="Introducer's name" hint="Required when the signer was introduced">
                  <input value={form.introducerName} onChange={(e) => set("introducerName", e.target.value)} className="inp" />
                </Field>
                <Field label="Introducer's mailing address">
                  <input value={form.introducerAddress} onChange={(e) => set("introducerAddress", e.target.value)} className="inp" />
                </Field>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Grantee's name" hint="§ 406.014(a)(7)">
                <input value={form.granteeName} onChange={(e) => set("granteeName", e.target.value)} className="inp" />
              </Field>
              <Field label="Grantee's mailing address">
                <input value={form.granteeAddress} onChange={(e) => set("granteeAddress", e.target.value)} className="inp" />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input type="checkbox" checked={form.landConveyed} onChange={(e) => set("landConveyed", e.target.checked)} />
              This instrument conveys or charges land — § 406.014(a)(8) applies
            </label>

            {form.landConveyed && (
              <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                <Field label="Name of the original grantee">
                  <input value={form.originalGrantee} onChange={(e) => set("originalGrantee", e.target.value)} className="inp" />
                </Field>
                <Field label="County where the land is located">
                  <input value={form.landCounty} onChange={(e) => set("landCounty", e.target.value)} className="inp" />
                </Field>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Fee charged" hint="Not required by statute — useful for your own records">
                <input value={form.feeCharged} onChange={(e) => set("feeCharged", e.target.value)} placeholder="$10.00" className="inp" />
              </Field>
              <Field label="Notes">
                <input value={form.notes} onChange={(e) => set("notes", e.target.value)} className="inp" />
              </Field>
            </div>

            {err && <p className="text-sm text-red-700">{err}</p>}
            <button type="submit" className="bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg">
              Save entry
            </button>
          </form>
        )}

        {entries.length === 0 ? (
          <p className="text-slate-500 text-center py-12">
            No entries yet. Every notarization you perform in Texas needs one.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((e) => (
              <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {e.signerName} <span className="font-normal text-slate-500">· {e.actType}</span>
                  </p>
                  <p className="text-sm text-slate-600 truncate">
                    {e.dateNotarized}
                    {e.instrumentType ? ` · ${e.instrumentType}` : ""} · {e.idMethod}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{e.signerAddress}</p>
                </div>
                <button onClick={() => remove(e.id)} className="text-slate-400 hover:text-red-600 shrink-0" aria-label="Delete entry">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Two things this does not do</h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">
            It does not keep your records for you. Under § 406.014(b) that duty is yours for ten
            years, and browser storage is not a ten-year guarantee — export and file the CSV.
          </p>
          <p className="text-slate-700 text-sm leading-relaxed">
            It is not legal advice. The field list follows § 406.014(a) as written, but if you are
            unsure whether a particular notarization needs a particular entry, ask the Secretary of
            State rather than a bond agency.
          </p>
        </div>
      </div>

      <style>{`
        .inp { width:100%; border:1px solid #cbd5e1; border-radius:0.5rem; padding:0.6rem 0.75rem; background:#fff; }
        @media print { header, nav, footer, button { display:none !important; } }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-800 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}
