import { BlogAuthor } from "@/components/BlogAuthor";
export const metadata = {
  title: "What Is a QS Score? The Free Bond Health Score for Texas Businesses",
  date: "2026-05-31",
  slug: "what-is-qs-score-texas-bond-health",
  description: "Learn about the QS Score — Quantum Surety\'s free bond health rating for Texas notaries and contractors. How it\'s calculated, why it matters, and how to improve yours.",
  tags: ["qs-score", "texas", "contractors", "notaries", "bond-compliance"]
};
import { Helmet } from "react-helmet";
export default function BlogPost() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-100">
      <Helmet>
        <title>{metadata.title} | Quantum Surety Blog</title>
        <meta name="description" content={metadata.description}/>
      </Helmet>
      <div className="text-sm text-amber-400 mb-2">Bond Intelligence</div>
      <h1 className="text-4xl font-bold mb-4">{metadata.title}</h1>
      <p className="text-gray-400 mb-8">{metadata.date}</p>
      
      <p className="text-lg text-gray-300 mb-6">If you are a Texas notary or licensed contractor, your <strong>QS Score</strong> is how the industry measures your bond compliance and trustworthiness — and you can look it up for free right now.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">What Is the QS Score?</h2>
      <p className="text-gray-300 mb-4">The QS Score is a 0–100 rating developed by Quantum Surety that reflects the health of a Texas business\'s surety bond and license status. Think of it like a credit score — but specifically for your bond compliance.</p>
      <p className="text-gray-300 mb-4">Scores are graded A+ through F:</p>
      <ul className="space-y-2 mb-6 text-gray-300">
        <li><strong className="text-green-400">A+ (85–100): QS Verified</strong> — Bond is active and in excellent standing</li>
        <li><strong className="text-green-300">A (70–84): Trusted</strong> — Bond is active and well-maintained</li>
        <li><strong className="text-blue-400">B (55–69): Active</strong> — Bond is valid, approaching renewal window</li>
        <li><strong className="text-yellow-400">C (40–54): Compliant</strong> — Bond active but renewal needed soon</li>
        <li><strong className="text-orange-400">D (25–39): At Risk</strong> — Bond expiring very soon</li>
        <li><strong className="text-red-400">F (0–24): Non-Compliant</strong> — Bond has expired</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">How Is the QS Score Calculated?</h2>
      <p className="text-gray-300 mb-4">The QS Score is built from three factors:</p>
      <ol className="space-y-3 mb-6 text-gray-300 list-decimal list-inside">
        <li><strong>Bond Health (60 points)</strong> — How far away is your bond expiration? The further out, the higher your score.</li>
        <li><strong>License Type (20 points)</strong> — The complexity of your license type. Higher-tier licenses score higher.</li>
        <li><strong>Profile Completeness (20 points)</strong> — How complete is your public business profile in the Texas state database.</li>
      </ol>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Why Does Your QS Score Matter?</h2>
      <p className="text-gray-300 mb-4">An increasing number of Texas HOAs, general contractors, and property managers use the QS Score to vet vendors and subcontractors before awarding work. A high score means:</p>
      <ul className="space-y-2 mb-6 text-gray-300 list-disc list-inside">
        <li>You win more bids — buyers trust you faster</li>
        <li>HOA vendor approvals happen without friction</li>
        <li>GCs don\'t hesitate to put you on their approved sub list</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">How to Look Up Your QS Score</h2>
      <p className="text-gray-300 mb-4">Your score is public and free. Visit <a href="/qs-score" className="text-blue-400 hover:text-blue-300">quantumsurety.bond/qs-score</a> or the HOA Portal to search by license number or notary ID.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">How to Improve Your QS Score</h2>
      <p className="text-gray-300 mb-4">The single most effective way to improve your score is to <strong>renew your bond early</strong>. A bond with more than 12 months remaining scores near-perfect on the bond health factor. Don\'t wait until 30 days before expiration.</p>
      <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6 mt-8">
        <p className="font-semibold mb-3">Ready to renew your Texas bond and boost your QS Score?</p>
        <a href="/get-bond" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold">Get a Quote in 2 Minutes →</a>
      </div>
    <BlogAuthor />
    </div>
  );
}
