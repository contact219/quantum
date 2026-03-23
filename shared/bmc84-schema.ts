import { pgTable, text, varchar, integer, timestamp, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const bmc84StatusEnum = pgEnum("bmc84_status", [
  "quote",
  "payment_pending",
  "paid",
  "filing_sent",
  "active",
  "renewal_pending",
  "expired",
  "cancelled",
]);

export const bmc84CreditTierEnum = pgEnum("bmc84_credit_tier", [
  "excellent",
  "good",
  "fair",
  "poor",
]);

export const filingStatusEnum = pgEnum("bmc84_filing_status", [
  "pending",
  "notified",
  "filed",
  "confirmed",
  "failed",
]);

export const bmc84Bonds = pgTable("bmc84_bonds", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  brokerName: text("broker_name").notNull(),
  brokerEmail: text("broker_email").notNull(),
  brokerPhone: text("broker_phone"),
  companyName: text("company_name").notNull(),
  mcNumber: varchar("mc_number", { length: 20 }),
  usdotNumber: varchar("usdot_number", { length: 20 }),
  yearsInBusiness: integer("years_in_business"),
  stateOfIncorporation: varchar("state_of_incorporation", { length: 2 }),
  bondAmount: decimal("bond_amount", { precision: 10, scale: 2 }).default("75000.00").notNull(),
  annualPremium: decimal("annual_premium", { precision: 8, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.20"),
  commissionAmount: decimal("commission_amount", { precision: 8, scale: 2 }),
  creditTier: bmc84CreditTierEnum("credit_tier"),
  creditScore: integer("credit_score"),
  carrierName: text("carrier_name"),
  carrierPolicyNumber: text("carrier_policy_number"),
  effectiveDate: timestamp("effective_date"),
  expirationDate: timestamp("expiration_date"),
  issuedAt: timestamp("issued_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: bmc84StatusEnum("status").default("quote").notNull(),
  paidAt: timestamp("paid_at"),
  stripePaymentId: text("stripe_payment_id"),
  isMigrationFromBmc85: boolean("is_migration_from_bmc85").default(false),
  internalNotes: text("internal_notes"),
  adminId: varchar("admin_id", { length: 36 }),
});

export const bmc84FmcsaFilings = pgTable("bmc84_fmcsa_filings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  bondId: varchar("bond_id", { length: 36 }).notNull().references(() => bmc84Bonds.id),
  status: filingStatusEnum("status").default("pending").notNull(),
  paymentReceivedAt: timestamp("payment_received_at"),
  carrierNotifiedAt: timestamp("carrier_notified_at"),
  carrierFiledAt: timestamp("carrier_filed_at"),
  fmcsaConfirmedAt: timestamp("fmcsa_confirmed_at"),
  slaBreached: boolean("sla_breached").default(false),
  slaBreachReason: text("sla_breach_reason"),
  notifiedBy: text("notified_by"),
  carrierContact: text("carrier_contact"),
  fmcsaConfirmationRef: text("fmcsa_confirmation_ref"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bmc84Renewals = pgTable("bmc84_renewals", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  bondId: varchar("bond_id", { length: 36 }).notNull().references(() => bmc84Bonds.id),
  renewalYear: integer("renewal_year").notNull(),
  dueDate: timestamp("due_date").notNull(),
  reminder60SentAt: timestamp("reminder_60_sent_at"),
  reminder30SentAt: timestamp("reminder_30_sent_at"),
  reminder7SentAt: timestamp("reminder_7_sent_at"),
  renewedAt: timestamp("renewed_at"),
  renewalPremium: decimal("renewal_premium", { precision: 8, scale: 2 }),
  newBondId: varchar("new_bond_id", { length: 36 }),
  status: text("status", {
    enum: ["pending", "reminded_60", "reminded_30", "reminded_7", "renewed", "lapsed"]
  }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBmc84BondSchema = createInsertSchema(bmc84Bonds, {
  brokerEmail: z.string().email("Valid email required"),
  mcNumber: z.string().optional(),
  annualPremium: z.coerce.number().min(938, "Minimum premium is $938"),
  creditScore: z.coerce.number().min(300).max(850).optional(),
  yearsInBusiness: z.coerce.number().min(0).max(100).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true, commissionAmount: true });

export const bmc84QuoteFormSchema = z.object({
  bondType: z.literal("bmc84"),
  mcNumber: z.string().optional(),
  isMigrationFromBmc85: z.boolean().default(false),
  companyName: z.string().min(2, "Company name required"),
  brokerName: z.string().min(2, "Full name required"),
  brokerEmail: z.string().email("Valid email required"),
  brokerPhone: z.string().optional(),
  stateOfIncorporation: z.string().length(2, "Select a state"),
  yearsInBusiness: z.coerce.number().min(0, "Required"),
  ssn: z.string().min(9, "SSN required for underwriting"),
  creditPullConsent: z.boolean().refine(v => v === true, "Consent required"),
  notes: z.string().optional(),
});

export type Bmc84Bond = typeof bmc84Bonds.$inferSelect;
export type InsertBmc84Bond = typeof bmc84Bonds.$inferInsert;
export type Bmc84FmcsaFiling = typeof bmc84FmcsaFilings.$inferSelect;
export type Bmc84Renewal = typeof bmc84Renewals.$inferSelect;
export type Bmc84QuoteFormData = z.infer<typeof bmc84QuoteFormSchema>;
