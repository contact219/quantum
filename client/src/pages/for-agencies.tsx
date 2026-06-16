import { Shield, Search, CheckCircle, Code, Building, Phone, ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const VERIFY_URL = "https://verify.quantumsurety.bond";

const features = [
  { icon: "🔍", label: "Free forever for agencies", desc: "No account required. No usage limits. Search unlimited contractors." },
  { icon: "📋", label: "816,000+ TDLR contractors", desc: "Every licensed Texas contractor updated daily from public TDLR records." },
  { icon: "🛡️", label: "Real-time bond status", desc: "Active, expired, or missing — know before you award." },
  { icon: "⭐", label: "QS Score™ trust rating", desc: "0–100 contractor trust score based on bond status, license type, and profile completeness." },
  { icon: "🔗", label: "API access", desc: "Automate verification in your vendor portal or ERP system." },
  { icon: "📌", label: "Badge embed", desc: "Let contractors display their verified bond status on their own site." },
];

const steps = [
  { n: "1", title: "Search any contractor", desc: "By name, TDLR license number, or county. Results in under a second." },
  { n: "2", title: "See bond status + QS Score", desc: "Verify license type, expiration date, bond coverage, and the 0–100 trust rating." },
  { n: "3", title: "Award with confidence", desc: "If they're not bonded, send them to quantumsurety.bond — they'll be covered same day." },
];

export default function ForAgencies() {
  useSEO({
    title: "Free Contractor Bond Verification for Texas Agencies | Quantum Surety",
    description: "Free tool for Texas procurement officers: verify any TDLR-licensed contractor's bond status and license instantly. 816,000+ records. API available.",
    canonical: "/for-agencies",
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-sm font-semibold mb-6">
            <Building className="w-4 h-4" /> For Texas State Agencies &amp; Procurement Officers
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Verify Contractor Bonds Instantly<br className="hidden md:block" />
            <span className="text-amber-400"> — Free for Texas Agencies</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Search 816,000+ licensed Texas contractors and their bond status in seconds.
            Built for procurement officers, purchasing agents, and agency compliance teams.
          </p>
          <a
            href={VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            <Search className="w-5 h-5" /> Search Contractors Free
          </a>
          <p className="text-slate-500 text-sm mt-4">No login required &middot; No usage limits &middot; Always free</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-black font-extrabold text-xl flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Everything your team needs</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.label} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-bold text-slate-900 text-sm mb-1">{f.label}</div>
              <div className="text-slate-500 text-sm leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* API section */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-3">
              <Code className="w-4 h-4" /> REST API
            </div>
            <h2 className="text-2xl font-bold mb-4">Automate contractor verification</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Integrate bond and license verification directly into your vendor management system, ERP, or procurement portal.
              Free tier: 1,000 requests/day. Enterprise plans available.
            </p>
            <a
              href={`${VERIFY_URL}/api-docs.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              View API Docs <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="bg-slate-800 rounded-xl p-5 text-sm font-mono overflow-x-auto border border-slate-700">
            <div className="text-slate-400 mb-2 text-xs">// Search contractor by name + county</div>
            <div><span className="text-amber-400">GET</span> <span className="text-emerald-400">/api/contractor-search</span></div>
            <div className="text-slate-400 mt-2 mb-3">  ?q=Smith+Electric&amp;county=Travis</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="text-slate-300 ml-4">"results": {"["}</div>
            <div className="text-slate-300 ml-8">{"{"}</div>
            <div className="text-slate-300 ml-10"><span className="text-sky-400">"name"</span>: <span className="text-emerald-300">"Smith Electric LLC"</span>,</div>
            <div className="text-slate-300 ml-10"><span className="text-sky-400">"license"</span>: <span className="text-emerald-300">"TECL12345"</span>,</div>
            <div className="text-slate-300 ml-10"><span className="text-sky-400">"bond_status"</span>: <span className="text-emerald-300">"active"</span>,</div>
            <div className="text-slate-300 ml-10"><span className="text-sky-400">"qs_score"</span>: <span className="text-amber-300">87</span>,</div>
            <div className="text-slate-300 ml-10"><span className="text-sky-400">"expires"</span>: <span className="text-emerald-300">"2027-03-15"</span></div>
            <div className="text-slate-300 ml-8">{"}"}</div>
            <div className="text-slate-300 ml-4">{"]"}</div>
            <div className="text-slate-300">{"}"}</div>
          </div>
        </div>
      </div>

      {/* When contractor needs a bond */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <Shield className="w-10 h-10 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-3">When your contractor needs a bond</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            If a contractor fails verification, send them to <strong>quantumsurety.bond</strong>.
            We issue Texas contractor bonds and performance bonds same day —
            $50 flat for notary bonds, competitive rates on all commercial bonds.
            TDI-Licensed Agency #3480229.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://quantumsurety.bond/bonds/contractor-bond-texas"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              <Shield className="w-4 h-4" /> Contractor Bond Info
            </a>
            <a
              href="tel:+12146668718"
              className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              <Phone className="w-4 h-4" /> (214) 666-8718
            </a>
          </div>
        </div>
      </div>

      {/* Verification checklist */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Pre-award contractor checklist</h2>
            {[
              "TDLR license active and not expired",
              "Bond status: active with sufficient coverage",
              "QS Score 70+ (recommended)",
              "License type matches contract scope",
              "No recent license suspensions",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-4">Run the full check in seconds</p>
            <a
              href={VERIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            >
              <Search className="w-4 h-4" /> Open Contractor Lookup
            </a>
            <p className="text-slate-400 text-xs mt-3">verify.quantumsurety.bond</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-bold mb-3">Need API access or a custom integration?</h2>
          <p className="text-slate-400 text-sm mb-6">
            We work directly with procurement teams to set up automated bond verification.
            Free API key with 1,000 req/day. Enterprise plans for higher volume.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`${VERIFY_URL}/api-docs.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              Get API Access <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="mailto:api@quantumsurety.bond"
              className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              Email api@quantumsurety.bond
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
