import { useEffect, useState } from 'react';

interface Runner {
  id: string;
  name: string;
  company?: string;
  jurisdictions?: string[];
  specialties?: string[];
  ratePerPermit?: string;
  rateType?: string;
  bio?: string;
  verified?: boolean;
}

export default function Runners() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Runner | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', jurisdiction: '', projectDescription: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/permit-runners')
      .then(r => r.json())
      .then(d => setRunners(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!open) return;
    setSending(true);
    try {
      const r = await fetch(`/api/permit-runners/${open.id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (r.ok) setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-16">
      <section className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <p className="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">Permit Runner Network</p>
        <h1 className="mb-4 text-4xl font-bold text-white">Skip the line at the permit counter.</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Vetted permit runners pull, file, and chase your permits at DFW city offices — so your crew stays on the job.
          Flat per-permit rates, direct contact, no middleman fees.
        </p>
      </section>

      {loading ? (
        <p className="text-slate-400">Loading runners…</p>
      ) : runners.length === 0 ? (
        <p className="text-slate-400">No runners available right now — check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {runners.map(r => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white text-lg">{r.name}</h3>
                  {r.company && <p className="text-sm text-slate-400">{r.company}</p>}
                </div>
                {r.verified && (
                  <span className="rounded-full bg-emerald-400/10 border border-emerald-300/30 px-2 py-0.5 text-xs text-emerald-300">Verified</span>
                )}
              </div>
              {r.bio && <p className="mt-3 text-sm text-slate-300 leading-relaxed">{r.bio}</p>}
              <div className="mt-3 flex flex-wrap gap-1">
                {(r.jurisdictions || []).slice(0, 6).map(j => (
                  <span key={j} className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-slate-300">{j}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-cyan-300 font-semibold">
                  ${r.ratePerPermit || '—'}<span className="text-slate-400 font-normal text-sm"> / permit</span>
                </span>
                <button
                  onClick={() => { setOpen(r); setSent(false); }}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-medium hover:bg-cyan-400"
                >
                  Hire {r.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <strong className="text-white">Are you a permit runner?</strong> Join the network — free listing, direct
        client contact. Email <a href="mailto:runners@permitpilot.online" className="text-cyan-300">runners@permitpilot.online</a> with
        your jurisdictions, rates, and experience.
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={e => e.stopPropagation()}>
            {sent ? (
              <div className="text-center py-6">
                <p className="text-2xl mb-2">✅</p>
                <h3 className="text-white font-semibold text-lg mb-1">Inquiry sent to {open.name}!</h3>
                <p className="text-slate-400 text-sm">They typically respond within 24 hours. A copy was emailed to you.</p>
                <button onClick={() => setOpen(null)} className="mt-5 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-medium">Done</button>
              </div>
            ) : (
              <>
                <h3 className="text-white font-semibold text-lg mb-4">Hire {open.name}</h3>
                <form onSubmit={submit} className="space-y-3">
                  <input required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder-slate-500" />
                  <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder-slate-500" />
                  <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder-slate-500" />
                  <input required placeholder="City / jurisdiction" value={form.jurisdiction} onChange={e => setForm({ ...form, jurisdiction: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder-slate-500" />
                  <textarea required placeholder="What permits do you need pulled?" rows={3} value={form.projectDescription}
                    onChange={e => setForm({ ...form, projectDescription: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder-slate-500" />
                  <button disabled={sending} className="w-full rounded-lg bg-cyan-500 py-2.5 text-slate-950 font-semibold text-sm hover:bg-cyan-400 disabled:opacity-60">
                    {sending ? 'Sending…' : 'Send Inquiry'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
