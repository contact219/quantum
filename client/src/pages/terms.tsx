export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8" data-testid="text-terms-title">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-8">Last updated: January 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <p>
              By accessing and using Quantum Surety's services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Services Provided</h2>
            <p>
              Quantum Surety acts as a licensed surety bond agency connecting contractors and businesses with 
              surety carriers. We facilitate the bond application and issuance process but do not issue bonds directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Application and Underwriting</h2>
            <p>Key points about the bonding process:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>All bond applications are subject to underwriting approval by surety carriers</li>
              <li>Quotes provided are estimates and subject to change based on full underwriting review</li>
              <li>You must provide accurate and complete information on applications</li>
              <li>False or misleading information may result in bond denial or cancellation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Financial Responsibility</h2>
            <p>
              Bond principals are financially responsible for reimbursing the surety for any claims paid. 
              Surety bonds are not insurance—they are a form of credit that must be repaid if claims occur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p>
              Quantum Surety provides bonding services "as is" and makes no warranties regarding bond approval, 
              premium rates, or timing. We are not liable for decisions made by surety carriers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p>
              For questions about these terms, contact:{" "}
              <a href="mailto:legal@quantumsurety.com" className="text-primary hover:underline">
                legal@quantumsurety.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
