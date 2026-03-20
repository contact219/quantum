export const suretyPortalBlueprint = {
  intakeLabel: "Surety Application Portal (Best Method for Quantum Surety)",
  contractorUploads: [
    { type: "bond_request", label: "Bond request form", required: true },
    { type: "contract", label: "Project contract or bid specs", required: true },
    { type: "financials", label: "Financial statements", required: true },
    { type: "credit_auth", label: "Credit authorization", required: true },
    { type: "resume", label: "Resume / experience", required: false },
    { type: "job_breakdown", label: "Job cost breakdown", required: false },
    { type: "prior_bonds", label: "Prior bond history", required: false },
    { type: "work_schedule", label: "Work-on-hand schedule", required: false },
  ],
  automatedSteps: [
    {
      id: "credit_pull",
      title: "Pull credit",
      description: "Capture credit authorization and trigger the credit pull workflow.",
    },
    {
      id: "underwriting_rules",
      title: "Run internal underwriting rules",
      description: "Evaluate contractor, project, and financial fit against underwriting criteria.",
    },
    {
      id: "missing_documents",
      title: "Flag missing documents",
      description: "Track required uploads and highlight any remaining underwriting gaps.",
    },
    {
      id: "preliminary_quote",
      title: "Generate preliminary quote",
      description: "Produce a working premium estimate once the intake package is complete.",
    },
    {
      id: "e_sign",
      title: "Send bond electronically for e-signature",
      description: "Prepare the bond package and move the contractor into digital execution.",
    },
  ],
} as const;

export const requiredSuretyDocuments = suretyPortalBlueprint.contractorUploads.filter(
  (document) => document.required,
);
