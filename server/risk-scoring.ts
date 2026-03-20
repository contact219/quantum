import type { ApplicationDocument, SuretyApplication } from "@shared/schema";

const REQUIRED_DOCUMENTS = ["bond_request", "contract", "financials", "credit_auth"];

type Factor = {
  label: string;
  score: number;
  weight: number;
  impact: "positive" | "neutral" | "negative";
  detail: string;
};

export type RiskAssessment = {
  score: number;
  riskLevel: "low" | "moderate" | "high";
  recommendedStatus: "approved" | "in_review" | "rejected";
  recommendedPremiumRate: number;
  estimatedBondCapacity: number;
  bureauScore: number;
  missingDocuments: string[];
  summary: string;
  factors: Factor[];
  automation: {
    administrators: string[];
    underwriters: string[];
    clients: string[];
  };
  workflowTriggers: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeRevenue(value: SuretyApplication["annualRevenue"]) {
  return value ? parseFloat(value.toString()) || 0 : 0;
}

function deterministicSeed(application: SuretyApplication) {
  const source = [
    application.companyName,
    application.contactEmail,
    application.contactPhone ?? "",
    application.yearsInBusiness ?? 0,
    application.annualRevenue ?? 0,
  ].join("|");

  return source.split("").reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
}

export function generateSyntheticCreditScore(application: SuretyApplication) {
  const years = application.yearsInBusiness ?? 0;
  const revenue = normalizeRevenue(application.annualRevenue);
  const seed = deterministicSeed(application);
  const revenueBoost = revenue >= 1_000_000 ? 55 : revenue >= 500_000 ? 35 : revenue >= 250_000 ? 20 : revenue >= 100_000 ? 10 : 0;
  const tenureBoost = Math.min(years * 8, 56);
  const variance = seed % 41;

  return clamp(560 + revenueBoost + tenureBoost + variance, 540, 815);
}

export function evaluateRiskModel(application: SuretyApplication, documents: ApplicationDocument[]): RiskAssessment {
  const years = application.yearsInBusiness ?? 0;
  const revenue = normalizeRevenue(application.annualRevenue);
  const bureauScore = application.creditScore ?? generateSyntheticCreditScore(application);
  const validDocuments = documents.filter((document) => document.validationStatus === "valid");
  const uploadedTypes = new Set(validDocuments.map((document) => document.documentType));
  const missingDocuments = REQUIRED_DOCUMENTS.filter((document) => !uploadedTypes.has(document));

  const creditComponent = clamp(((bureauScore - 500) / 350) * 100, 0, 100);
  const experienceComponent = clamp((years / 10) * 100, 0, 100);
  const revenueComponent = clamp((revenue / 1_500_000) * 100, 0, 100);
  const documentationComponent = clamp(((REQUIRED_DOCUMENTS.length - missingDocuments.length) / REQUIRED_DOCUMENTS.length) * 100, 0, 100);
  const businessTypeComponent = application.businessType === "general_contractor" ? 85 : application.businessType === "subcontractor" ? 76 : 68;

  const factors: Factor[] = [
    {
      label: "Credit strength",
      score: Math.round(creditComponent),
      weight: 0.35,
      impact: bureauScore >= 680 ? "positive" : bureauScore >= 620 ? "neutral" : "negative",
      detail: `Synthetic bureau score ${bureauScore}`,
    },
    {
      label: "Business tenure",
      score: Math.round(experienceComponent),
      weight: 0.2,
      impact: years >= 3 ? "positive" : years >= 1 ? "neutral" : "negative",
      detail: `${years} years in business`,
    },
    {
      label: "Revenue support",
      score: Math.round(revenueComponent),
      weight: 0.2,
      impact: revenue >= 500_000 ? "positive" : revenue >= 100_000 ? "neutral" : "negative",
      detail: `$${revenue.toLocaleString()} annual revenue`,
    },
    {
      label: "Submission completeness",
      score: Math.round(documentationComponent),
      weight: 0.15,
      impact: missingDocuments.length === 0 ? "positive" : missingDocuments.length <= 2 ? "neutral" : "negative",
      detail: `${REQUIRED_DOCUMENTS.length - missingDocuments.length}/${REQUIRED_DOCUMENTS.length} required documents validated`,
    },
    {
      label: "Entity profile",
      score: businessTypeComponent,
      weight: 0.1,
      impact: businessTypeComponent >= 80 ? "positive" : "neutral",
      detail: application.businessType ? application.businessType.replace(/_/g, " ") : "business type not selected",
    },
  ];

  const weightedScore = Math.round(
    factors.reduce((total, factor) => total + factor.score * factor.weight, 0),
  );

  const riskLevel: RiskAssessment["riskLevel"] = weightedScore >= 78 ? "low" : weightedScore >= 60 ? "moderate" : "high";
  const recommendedStatus: RiskAssessment["recommendedStatus"] =
    missingDocuments.length > 2 || weightedScore < 50 ? "rejected" : missingDocuments.length > 0 || weightedScore < 78 ? "in_review" : "approved";

  const recommendedPremiumRate = weightedScore >= 85 ? 0.0125 : weightedScore >= 75 ? 0.0175 : weightedScore >= 65 ? 0.0225 : 0.03;
  const estimatedBondCapacity = Math.round(Math.max(revenue * 0.15, 25_000));

  const administrators = [
    missingDocuments.length > 0
      ? `Auto-send checklist reminder for: ${missingDocuments.join(", ")}`
      : "Auto-notify carrier ops that the file is document-complete",
    weightedScore < 60
      ? "Escalate the file into a senior underwriter review queue"
      : "Route the file into the straight-through processing lane",
    "Schedule follow-up tasks and SLA alerts if the file sits untouched for 24 hours",
  ];

  const underwriters = [
    `Use a target premium band of ${(recommendedPremiumRate * 100).toFixed(2)}% and capacity near $${estimatedBondCapacity.toLocaleString()}`,
    bureauScore < 640
      ? "Request indemnity support and a more detailed explanation of recent credit events"
      : "Leverage the credit result to support delegated underwriting authority",
    revenue < 250_000
      ? "Review WIP schedule and liquidity before final approval"
      : "Focus manual review on contract terms and aggregate program exposure",
  ];

  const clients = [
    missingDocuments.length > 0
      ? `Prompt the client to upload ${missingDocuments.join(", ")} to improve the score automatically`
      : "Offer a one-click next step to bind and e-sign digitally",
    bureauScore < 680
      ? "Show coaching tips that explain how stronger financials can improve future pricing"
      : "Surface preferred pricing messaging and faster approval expectations",
    "Generate automated status updates whenever the risk tier or underwriting queue changes",
  ];

  const workflowTriggers = [
    recommendedStatus === "approved" ? "generate_preliminary_quote" : "queue_manual_review",
    missingDocuments.length > 0 ? "send_document_request" : "notify_underwriting_ready",
    bureauScore < 640 ? "request_additional_credit_support" : "proceed_to_esign_when_bound",
  ];

  const summary = `${riskLevel.toUpperCase()} risk / score ${weightedScore}. ` +
    `The file is ${missingDocuments.length === 0 ? "document-complete" : `missing ${missingDocuments.length} required item(s)`} ` +
    `with a modeled bureau score of ${bureauScore}.`;

  return {
    score: weightedScore,
    riskLevel,
    recommendedStatus,
    recommendedPremiumRate,
    estimatedBondCapacity,
    bureauScore,
    missingDocuments,
    summary,
    factors,
    automation: {
      administrators,
      underwriters,
      clients,
    },
    workflowTriggers,
  };
}
