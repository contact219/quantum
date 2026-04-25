import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { useSEO, useSchema } from "@/hooks/useSEO";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What's the difference between bid, performance, and payment bonds?", "acceptedAnswer": { "@type": "Answer", "text": "Bid bonds guarantee you'll honor your bid and enter into a contract if selected. Performance bonds ensure you'll complete the project according to contract terms. Payment bonds guarantee payment to subcontractors and suppliers. Most public projects require all three." } },
    { "@type": "Question", "name": "What is a surety bond?", "acceptedAnswer": { "@type": "Answer", "text": "A surety bond is a three-party agreement where the surety (insurance company) guarantees the principal's (contractor's) performance to the obligee (project owner). It's not traditional insurance — if you default, you're required to reimburse the surety for any claims paid." } },
    { "@type": "Question", "name": "How much do surety bonds cost?", "acceptedAnswer": { "@type": "Answer", "text": "Premiums typically range from 0.5% to 3% of the bond amount, depending on bond type, your credit, financials, and experience. Strong contractors with good credit pay lower rates. Some small license bonds have minimum premiums of $100–$500. Texas notary bonds are $50 flat." } },
    { "@type": "Question", "name": "How long does surety bond approval take?", "acceptedAnswer": { "@type": "Answer", "text": "Simple bonds (notary, auto dealer, some license bonds) can be issued instantly or within hours. Construction bonds under $500K typically process in 24–48 hours. Larger or complex bonds may take 3–7 business days." } },
    { "@type": "Question", "name": "Do I need good credit to get bonded?", "acceptedAnswer": { "@type": "Answer", "text": "Credit is one factor but not the only one. For construction bonds, financial strength and experience matter more. We work with contractors at various credit levels. Some smaller commercial bonds are available with credit scores as low as 600–650." } },
    { "@type": "Question", "name": "Is Quantum Surety licensed in Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Quantum Surety is licensed by the Texas Department of Insurance (TDI license #3480229) and is authorized to issue surety bonds across Texas and all 50 states." } }
  ]
};

export default function FAQ() {
  useSEO({
    title: "Texas Surety Bond FAQ | Common Questions Answered | Quantum Surety",
    description: "Answers to common Texas surety bond questions: costs, approval times, credit requirements, bond types, performance vs bid bonds, and TDI licensing. TDI-licensed agency.",
    canonical: "/faq",
  });
  useSchema(FAQ_SCHEMA, "ld-json-FAQ");
  const constructionFAQs = [
    {
      question: "What's the difference between bid, performance, and payment bonds?",
      answer: "Bid bonds guarantee you'll honor your bid and enter into a contract if selected. Performance bonds ensure you'll complete the project according to contract terms. Payment bonds guarantee payment to subcontractors and suppliers. Most public projects require all three."
    },
    {
      question: "Why do contractors need surety bonds?",
      answer: "Many public and private project owners require bonds to protect themselves against contractor default. Bonds ensure project completion and payment to subs/suppliers, reducing the owner's risk. Some states also require license bonds for contractors to operate legally."
    },
    {
      question: "What is bond capacity and how is it determined?",
      answer: "Bond capacity is the maximum dollar amount of bonding a surety will provide. It's based on your financials, experience, credit, and current work-in-progress. Capacity = (Net Worth × 10) - Current Backlog is a rough formula, though underwriters consider many factors."
    },
    {
      question: "What documents are typically required for a bond application?",
      answer: "Standard documents include: financial statements (often audited for larger bonds), work-in-progress schedule, resume of experience, bank references, project details, and sometimes tax returns. Requirements vary by bond size and contractor experience."
    },
    {
      question: "How long does it take to get approved for a construction bond?",
      answer: "For established contractors with good financials, bonds under $500K often approve in 24-48 hours. Larger bonds or first-time applicants may take 3-7 days as underwriters review financials and background more thoroughly."
    },
    {
      question: "Can subcontractors get bonded?",
      answer: "Absolutely! More GCs now require subcontractors to be bonded. The process is similar to GCs but often faster for smaller amounts. First-time bonds may require more documentation, but we specialize in helping subs navigate the bonding process."
    },
  ];

  const generalFAQs = [
    {
      question: "What is a surety bond?",
      answer: "A surety bond is a three-party agreement where the surety (insurance company) guarantees the principal's (contractor's) performance to the obligee (project owner). It's not traditional insurance—if you default, you're required to reimburse the surety for any claims paid."
    },
    {
      question: "Is a surety bond the same as insurance?",
      answer: "No. Insurance protects you from risk. A surety bond protects the obligee from your failure to perform. You're ultimately responsible for reimbursing the surety for any claims. The bond is essentially a line of credit backed by your financials."
    },
    {
      question: "How much do surety bonds cost?",
      answer: "Premiums typically range from 0.5% to 3% of the bond amount, depending on bond type, your credit, financials, and experience. Strong contractors with good credit pay lower rates. Some small license bonds have minimum premiums of $100-$500."
    },
    {
      question: "How long does approval take?",
      answer: "Simple bonds (notary, auto dealer, some license bonds) can be issued instantly or within hours. Construction bonds under $500K typically process in 24-48 hours. Larger or complex bonds may take 3-7 business days."
    },
    {
      question: "Do I need good credit to get bonded?",
      answer: "Credit is one factor, but not the only one. For construction bonds, financial strength and experience matter more. We work with contractors at various credit levels. Some smaller commercial bonds are available with credit scores as low as 600-650."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-faq">
            <HelpCircle className="w-4 h-4 mr-1" />
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-faq-headline">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-200">
            Find answers to common questions about surety bonds
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6" data-testid="text-construction-section">
            Construction Bond Questions
          </h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {constructionFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`construction-${index}`}>
                    <AccordionTrigger className="text-left" data-testid={`question-construction-${index}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6" data-testid="text-general-section">
            General Surety Bond Questions
          </h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {generalFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`general-${index}`}>
                    <AccordionTrigger className="text-left" data-testid={`question-general-${index}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
