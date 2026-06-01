import { Helmet } from "react-helmet";

export default function PermitPilotLanding() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>Permit Pilot — AI-Powered Texas Permit Guidance | Quantum Surety</title>
        <meta name="description" content="Permit Pilot helps Texas contractors and businesses navigate permit requirements, bond obligations, and compliance — powered by AI. Free tool from Quantum Surety."/>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-800 rounded-full px-4 py-1 text-sm text-amber-300 mb-4">
            Free AI Tool
          </div>
          <h1 className="text-5xl font-bold mb-4">Permit Pilot</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered guidance for Texas permits, bonds, and license requirements.
            Know exactly what you need before you walk into the permit office.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <a href="https://permitpilot.online" target="_blank" rel="noopener noreferrer"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Launch Permit Pilot →
            </a>
            <a href="/get-bond" className="border border-gray-600 hover:border-gray-400 text-gray-300 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Get Your Bond
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: "🏗️", title: "Trade-Specific Guidance", desc: "Electrical, plumbing, HVAC, general contracting — Permit Pilot knows the requirements for every trade in Texas." },
            { icon: "📋", title: "What Bonds You Need", desc: "Get a clear list of which surety bonds are required before you apply for permits in any Texas county." },
            { icon: "⚡", title: "Instant AI Answers", desc: "Ask in plain English. Get plain English answers. No jargon, no guesswork — just the information you need." }
          ].map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Who Uses Permit Pilot?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["General Contractors", "Find out every bond requirement before bidding a project"],
              ["Electrical & Plumbing Contractors", "TDLR licensing and bond requirements by trade"],
              ["New Business Owners", "Starting a contracting business in Texas? Start here"],
              ["City & County Permit Offices", "Embed Permit Pilot on your permitting portal for free"],
              ["HOA Property Managers", "Verify vendors meet all bond and permit requirements"],
              ["Real Estate Developers", "Bond requirements for construction and development projects"]
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <div className="text-green-400 mt-1">✓</div>
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-gray-400 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-3">Ready to simplify your permitting process?</h2>
          <p className="text-gray-300 mb-6">Permit Pilot is completely free. No signup required.</p>
          <a href="https://permitpilot.online" target="_blank" rel="noopener noreferrer"
            className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
            Launch Permit Pilot Free →
          </a>
        </div>
      </div>
    </div>
  );
}
