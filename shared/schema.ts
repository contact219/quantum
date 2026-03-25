import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, jsonb, index, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - merged with Replit Auth requirements
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Replit Auth fields (required)
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Legacy/additional fields (optional)
  username: text("username").unique(),
  password: text("password"),
  companyName: text("company_name"),
  role: text("role").notNull().default("client"), // client, underwriter, sales, finance, admin
  permission: text("permission").default("view"), // view, edit, approve (role-based)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  quoteNumber: text("quote_number"),
  bondType: text("bond_type").notNull(),
  contractValue: decimal("contract_value"),
  projectName: text("project_name"),
  projectState: text("project_state"),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  businessType: text("business_type"),
  yearsInBusiness: integer("years_in_business"),
  annualRevenue: decimal("annual_revenue"),
  creditScore: text("credit_score"),
  status: text("status").notNull().default("pending"),
  estimatedPremium: decimal("estimated_premium"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bonds = pgTable("bonds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  quoteId: varchar("quote_id").references(() => quotes.id),
  bondType: text("bond_type").notNull(),
  penalSum: decimal("penal_sum").notNull(),
  premium: decimal("premium").notNull(),
  effectiveDate: timestamp("effective_date"),
  expirationDate: timestamp("expiration_date"),
  status: text("status").notNull().default("active"),
  bondNumber: text("bond_number"),
  projectName: text("project_name"),
  obligee: text("obligee"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  contractValue: decimal("contract_value"),
  state: text("state"),
  status: text("status").notNull().default("active"),
  startDate: timestamp("start_date"),
  completionDate: timestamp("completion_date"),
  obligee: text("obligee"),
  bondIds: text("bond_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companySettings = pgTable("company_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  website: text("website"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'guide', 'video', 'tool'
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"), // e.g., 'Guide', 'Article'
  link: text("link"), // For tools and external links
  videoUrl: text("video_url"), // YouTube URL or embed code
  duration: text("duration"), // For videos
  downloadable: boolean("downloadable").default(false),
  downloadUrl: text("download_url"), // PDF or file download link
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const carriers = pgTable("carriers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // e.g., "RLI Surety", "Liberty Mutual"
  website: text("website"),
  logo: text("logo"), // URL to carrier logo
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("15"), // Default 15%
  capacityLimit: decimal("capacity_limit"), // Max bonding capacity
  minCreditScore: integer("min_credit_score").default(600),
  contact: text("contact"), // Contact person name
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quoteCarriers = pgTable("quote_carriers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id),
  carrierId: varchar("carrier_id").notNull().references(() => carriers.id),
  status: text("status").notNull().default("pending"), // pending, submitted, approved, rejected, issued
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  commissionEarned: decimal("commission_earned"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carrierRules = pgTable("carrier_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  carrierId: varchar("carrier_id").notNull().references(() => carriers.id),
  // Bond type rules (bid, performance, payment)
  acceptedBondTypes: text("accepted_bond_types").array().default(sql`'{bid,performance,payment}'`),
  // Contract value limits
  minContractValue: decimal("min_contract_value"),
  maxContractValue: decimal("max_contract_value"),
  // Project type rules
  acceptedProjectTypes: text("accepted_project_types").array(), // commercial, residential, infrastructure, etc
  // Experience & financial requirements
  minYearsInBusiness: integer("min_years_in_business").default(0),
  minAnnualRevenue: decimal("min_annual_revenue"),
  minCreditScore: integer("min_credit_score").default(600),
  // Geographic rules
  acceptedStates: text("accepted_states").array(), // null = all states
  // Capacity rules
  maxBondsPerYear: integer("max_bonds_per_year"),
  // Custom rules
  customRules: jsonb("custom_rules"), // For additional carrier-specific rules
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const carrierCapacity = pgTable("carrier_capacity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  carrierId: varchar("carrier_id").notNull().references(() => carriers.id),
  annualCapacityLimit: decimal("annual_capacity_limit").notNull(),
  usedCapacity: decimal("used_capacity").default("0"),
  capacityYear: integer("capacity_year").notNull(), // Year for tracking
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carrierMetrics = pgTable("carrier_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  carrierId: varchar("carrier_id").notNull().references(() => carriers.id),
  quotesSubmitted: integer("quotes_submitted").default(0),
  quotesApproved: integer("quotes_approved").default(0),
  quotesRejected: integer("quotes_rejected").default(0),
  averageApprovalTimeMs: integer("average_approval_time_ms"),
  totalCommissionsEarned: decimal("total_commissions_earned").default("0"),
  averagePremium: decimal("average_premium"),
  customerSatisfactionScore: decimal("customer_satisfaction_score", { precision: 3, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const suretyApplications = pgTable("surety_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  applicationNumber: text("application_number").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  businessType: text("business_type"),
  yearsInBusiness: integer("years_in_business"),
  annualRevenue: decimal("annual_revenue"),
  creditScore: integer("credit_score"),
  // Credit pull data
  creditPullStatus: text("credit_pull_status").default("pending"), // pending, completed, failed
  creditPullData: jsonb("credit_pull_data"), // Plaid response data
  // Underwriting
  underwritingStatus: text("underwriting_status").default("pending"), // pending, in_review, approved, rejected
  ruleValidationResults: jsonb("rule_validation_results"), // Results from underwriting rules
  missingDocuments: text("missing_documents").array(), // Document types still needed
  // Quote
  preliminaryQuoteId: varchar("preliminary_quote_id"),
  preliminaryPremium: decimal("preliminary_premium"),
  // E-signature
  eSignatureStatus: text("e_signature_status").default("pending"), // pending, sent, signed, completed
  eSignatureDocumentId: text("e_signature_document_id"), // DocuSign/PandaDoc envelope ID
  // Status
  status: text("status").notNull().default("draft"), // draft, submitted, approved, rejected, bonded
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applicationDocuments = pgTable("application_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => suretyApplications.id),
  documentType: text("document_type").notNull(), // bond_request, contract, financials, credit_auth, resume, job_breakdown, prior_bonds, work_schedule
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(), // S3 or storage URL
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  validationStatus: text("validation_status").default("pending"), // pending, valid, invalid
  validationErrors: text("validation_errors").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creditPulls = pgTable("credit_pulls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => suretyApplications.id),
  provider: text("provider").notNull(), // plaid, dun_and_bradstreet, equifax
  externalId: text("external_id"), // Provider's transaction/report ID
  creditScore: integer("credit_score"),
  debtToIncomeRatio: decimal("debt_to_income_ratio"),
  businessRating: integer("business_rating"),
  riskLevel: text("risk_level"), // low, medium, high
  details: jsonb("details"), // Raw provider response
  pulledAt: timestamp("pulled_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCarrierSchema = createInsertSchema(carriers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuoteCarrierSchema = createInsertSchema(quoteCarriers).omit({ id: true, createdAt: true });
export const insertCarrierRulesSchema = createInsertSchema(carrierRules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCarrierCapacitySchema = createInsertSchema(carrierCapacity).omit({ id: true, createdAt: true });
export const insertCarrierMetricsSchema = z.object({
  carrierId: z.string(),
  quotesSubmitted: z.number().int().optional().nullable(),
  quotesApproved: z.number().int().optional().nullable(),
  quotesRejected: z.number().int().optional().nullable(),
  averageApprovalTimeMs: z.number().int().optional().nullable(),
  totalCommissionsEarned: z.string().optional().nullable(),
  averagePremium: z.string().optional().nullable(),
  customerSatisfactionScore: z.string().optional().nullable(),
  lastUpdated: z.date().optional().nullable(),
});

export const insertSuretyApplicationSchema = createInsertSchema(suretyApplications).omit({ id: true, applicationNumber: true, createdAt: true, updatedAt: true });
export const insertApplicationDocumentSchema = createInsertSchema(applicationDocuments).omit({ id: true, createdAt: true });
export const insertCreditPullSchema = createInsertSchema(creditPulls).omit({ id: true, createdAt: true });

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const upsertUserSchema = createInsertSchema(users)
  .pick({
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    profileImageUrl: true,
  })
  .extend({
    id: z.string(),
    email: z.string().nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    profileImageUrl: z.string().nullable().optional(),
  });
export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true, createdAt: true, status: true });
export const insertBondSchema = createInsertSchema(bonds).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const insertCompanySettingsSchema = createInsertSchema(companySettings).omit({ id: true, updatedAt: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true, updatedAt: true });

// Email Notification table
export const emailNotifications = pgTable("email_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  applicationId: varchar("application_id").references(() => suretyApplications.id),
  quoteId: varchar("quote_id").references(() => quotes.id),
  type: text("type").notNull(), // quote_ready, document_needed, status_changed, bond_issued
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  status: text("status").notNull().default("pending"), // pending, sent, failed
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin Analytics Snapshot (daily)
export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  snapshotDate: timestamp("snapshot_date").notNull().defaultNow(),
  totalQuotes: integer("total_quotes").default(0),
  totalApplications: integer("total_applications").default(0),
  totalBonds: integer("total_bonds").default(0),
  approvedApplications: integer("approved_applications").default(0),
  rejectedApplications: integer("rejected_applications").default(0),
  totalPremium: decimal("total_premium").default("0"),
  totalCommissions: decimal("total_commissions").default("0"),
  averageApprovalTime: integer("average_approval_time_ms"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }), // percentage
  createdAt: timestamp("created_at").defaultNow(),
});

export const renewalReminders = pgTable("renewal_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  contactName: text("contact_name"),
  companyName: text("company_name"),
  bondType: text("bond_type").notNull(),
  bondNumber: text("bond_number"),
  expirationDate: text("expiration_date").notNull(),
  notifyDays: text("notify_days").default("90,60,30"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRenewalReminderSchema = createInsertSchema(renewalReminders).omit({ id: true, createdAt: true });
export type InsertRenewalReminder = z.infer<typeof insertRenewalReminderSchema>;
export type RenewalReminder = typeof renewalReminders.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertBond = z.infer<typeof insertBondSchema>;
export type Bond = typeof bonds.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;
export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertCarrier = z.infer<typeof insertCarrierSchema>;
export type Carrier = typeof carriers.$inferSelect;
export type InsertQuoteCarrier = z.infer<typeof insertQuoteCarrierSchema>;
export type QuoteCarrier = typeof quoteCarriers.$inferSelect;
export type InsertCarrierRules = z.infer<typeof insertCarrierRulesSchema>;
export type CarrierRules = typeof carrierRules.$inferSelect;
export type InsertCarrierCapacity = z.infer<typeof insertCarrierCapacitySchema>;
export type CarrierCapacity = typeof carrierCapacity.$inferSelect;
export type InsertCarrierMetrics = z.infer<typeof insertCarrierMetricsSchema>;
export type CarrierMetrics = typeof carrierMetrics.$inferSelect;

export type InsertSuretyApplication = z.infer<typeof insertSuretyApplicationSchema>;
export type SuretyApplication = typeof suretyApplications.$inferSelect;
export type InsertApplicationDocument = z.infer<typeof insertApplicationDocumentSchema>;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type InsertCreditPull = z.infer<typeof insertCreditPullSchema>;
export type CreditPull = typeof creditPulls.$inferSelect;

// Email Notifications
export const insertEmailNotificationSchema = createInsertSchema(emailNotifications).omit({ id: true, createdAt: true });
export type InsertEmailNotification = z.infer<typeof insertEmailNotificationSchema>;
export type EmailNotification = typeof emailNotifications.$inferSelect;

// Analytics
export const insertAnalyticsSnapshotSchema = createInsertSchema(analyticsSnapshots).omit({ id: true, createdAt: true });
export type InsertAnalyticsSnapshot = z.infer<typeof insertAnalyticsSnapshotSchema>;
export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;

export const quoteFormSchema = z.object({
  bondType: z.string().min(1, "Bond type is required"),
  contractValue: z.string().optional(),
  projectName: z.string().optional(),
  projectState: z.string().min(1, "State is required"),
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  businessType: z.string().min(1, "Business type is required"),
  yearsInBusiness: z.number().min(0).optional(),
  annualRevenue: z.string().optional(),
  creditScore: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

export const bondFinderSchema = z.object({
  role: z.enum(["general_contractor", "subcontractor", "developer", "other"]),
  projectSize: z.enum(["under_100k", "100k_500k", "500k_5m", "over_5m"]),
  state: z.string().min(2),
});

export type BondFinderData = z.infer<typeof bondFinderSchema>;

export * from "./bmc84-schema";
