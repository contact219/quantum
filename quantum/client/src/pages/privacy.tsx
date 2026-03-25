import { useSEO } from "@/hooks/useSEO";

export default function Privacy() {
  useSEO({
    title: "Privacy Policy | Quantum Surety",
    description: "Read the Quantum Surety privacy policy covering how personal and business information is collected, used, and protected.",
    canonical: "/privacy",
  });
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8" data-testid="text-privacy-title">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-8">Last updated: January 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p>
              Quantum Surety is committed to protecting your privacy. This policy outlines how we collect, 
              use, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p>We collect information necessary to process bond applications and provide services, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Contact information (name, email, phone, address)</li>
              <li>Business information (company name, EIN, business structure)</li>
              <li>Financial information (financial statements, credit reports)</li>
              <li>Project details (contract values, project descriptions)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Process bond applications and underwriting reviews</li>
              <li>Communicate with you about your bonds and applications</li>
              <li>Improve our services and customer experience</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
            <p>
              We share information only with surety carriers for underwriting purposes and as required by law. 
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>
              For privacy-related questions, contact us at:{" "}
              <a href="mailto:privacy@quantumsurety.com" className="text-primary hover:underline">
                privacy@quantumsurety.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
