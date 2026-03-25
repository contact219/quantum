/**
 * BMC-84 SCHEMA ADDITIONS
 * =======================
 * Add these tables and types to your existing shared/schema.ts
 * Paste them after your existing table definitions, before the export section.
 *
 * These add:
 *   1. bmc84_bonds         — the bond record with pricing and status
 *   2. bmc84_fmcsa_filings — FMCSA filing coordination log
 *   3. bmc84_renewals      — renewal tracking and reminder state
 *   4. Zod schemas for API validation
 */

import { pgTable, text, varchar, integer, timestamp, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const bmc84StatusEnum = pgEnum("bmc84_status", [
  "quote",           // Quote issued, not yet paid
  "payment_pending", // Awaiting payment
  "paid",            // Payment received — trigger FMCSA filing
  "filing_sent",     // Carrier notified to file with FMCSA
  "active",          // FMCSA confirmed bond active
  "renewal_pending", // Approaching expiration — renewal needed
  "expired",         // Bond expired
  "cancelled",       // Bond cancelled (30-day notice required)
]);

export const bmc84CreditTierEnum = pgEnum("bmc84_credit_tier", [
  "excellent", // 750+ → $938–$1,500/yr
  "good",      // 700–749 → $1,500–$2,500/yr
  "fair",      // 650–699 → $2,500–$4,500/yr
  "poor",      // <650 → $4,500–$9,000/yr (high-risk program)
]);

export const filingStatusEnum = pgEnum("bmc84_filing_status", [
  "pending",   // Not yet sent to carrier
  "notified",  // Carrier notified via email
  "filed",     // Carrier confirmed FMCSA filing submitted
  "confirmed", // FMCSA system shows bond active
  "failed",    // Filing failed — manual intervention needed
]);

// ─── BMC-84 Bonds ─────────────────────────────────────────────────────────────

export const bmc84Bonds = pgTable("bmc84_bonds", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

  // Broker info
  brokerName:     text("broker_name").notNull(),
  brokerEmail:    text("broker_email").notNull(),
  brokerPhone:    text("broker_phone"),
  companyName:    text("company_name").notNull(),
  mcNumber:       varchar("mc_number", { length: 20 }),    // FMCSA MC# (optional at quote)
  usdotNumber:    varchar("usdot_number", { length: 20 }), // USDOT# if different
  yearsInBusiness: integer("years_in_business"),
  stateOfIncorporation: varchar("state_of_incorporation", { length: 2 }),

  // Bond details
  bondAmount:     decimal("bond_amount", { precision: 10, scale: 2 }).default("75000.00").notNull(),
  annualPremium:  decimal("annual_premium", { precision: 8, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.20"), // 20%
  commissionAmount: decimal("commission_amount", { precision: 8, scale: 2 }),
  creditTier:     bmc84CreditTierEnum("credit_tier"),
  creditScore:    integer("credit_score"),

  // Carrier info
  carrierName:    text("carrier_name"),              // e.g. "Markel Specialty"
  carrierPolicyNumber: text("carrier_policy_number"),

  // Dates
  effectiveDate:  timestamp("effective_date"),
  expirationDate: timestamp("expiration_date"),
  issuedAt:       timestamp("issued_at"),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
  updatedAt:      timestamp("updated_at").defaultNow().notNull(),

  // Status
  status:         bmc84StatusEnum("status").default("quote").notNull(),
  paidAt:         timestamp("paid_at"),
  stripePaymentId: text("stripe_payment_id"),

  // From BMC-85 migration?
  isMigrationFromBmc85: boolean("is_migration_from_bmc85").default(false),

  // Admin notes
  internalNotes:  text("internal_notes"),
  adminId:        varchar("admin_id", { length: 36 }), // Who processed this
});

// ─── FMCSA Filing Log ─────────────────────────────────────────────────────────
// Tracks the SLA: "payment received → carrier notified → e-filed within 24 hours"

export const bmc84FmcsaFilings = pgTable("bmc84_fmcsa_filings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  bondId: varchar("bond_id", { length: 36 }).notNull().references(() => bmc84Bonds.id),

  status:         filingStatusEnum("status").default("pending").notNull(),

  // SLA timestamps (target: each step within 24 hours of payment)
  paymentReceivedAt:  timestamp("payment_received_at"),
  carrierNotifiedAt:  timestamp("carrier_notified_at"),    // Step 1: email carrier
  carrierFiledAt:     timestamp("carrier_filed_at"),       // Step 2: carrier confirms e-filed
  fmcsaConfirmedAt:   timestamp("fmcsa_confirmed_at"),     // Step 3: FMCSA system active

  // SLA breach flags (auto-calculated by server)
  slaBreached:        boolean("sla_breached").default(false),
  slaBreachReason:    text("sla_breach_reason"),

  // Who did what
  notifiedBy:         text("notified_by"), // admin email who sent carrier notification
  carrierContact:     text("carrier_contact"),
  fmcsaConfirmationRef: text("fmcsa_confirmation_ref"), // Reference number from FMCSA

  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Renewal Tracking ─────────────────────────────────────────────────────────
// Each active bond gets a renewal record. SendGrid reminders hook into this.

export const bmc84Renewals = pgTable("bmc84_renewals", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  bondId: varchar("bond_id", { length: 36 }).notNull().references(() => bmc84Bonds.id),

  renewalYear:    integer("renewal_year").notNull(), // 1 = first renewal, 2 = second, etc.
  dueDate:        timestamp("due_date").notNull(),   // = bond expiration date

  // Reminder tracking
  reminder60SentAt: timestamp("reminder_60_sent_at"),  // 60-day notice sent
  reminder30SentAt: timestamp("reminder_30_sent_at"),  // 30-day notice sent
  reminder7SentAt:  timestamp("reminder_7_sent_at"),   // 7-day final warning

  // Renewal outcome
  renewedAt:      timestamp("renewed_at"),
  renewalPremium: decimal("renewal_premium", { precision: 8, scale: 2 }),
  newBondId:      varchar("new_bond_id", { length: 36 }), // Links to next year's bond record
  status: text("status", {
    enum: ["pending", "reminded_60", "reminded_30", "reminded_7", "renewed", "lapsed"]
  }).default("pending").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const insertBmc84BondSchema = createInsertSchema(bmc84Bonds, {
  brokerEmail: z.string().email("Valid email required"),
  mcNumber: z.string().optional(),
  annualPremium: z.coerce.number().min(938, "Minimum premium is $938"),
  creditScore: z.coerce.number().min(300).max(850).optional(),
  yearsInBusiness: z.coerce.number().min(0).max(100).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true, commissionAmount: true });

export const bmc84QuoteFormSchema = z.object({
  // Step 1: Bond context
  bondType:    z.literal("bmc84"),
  mcNumber:    z.string().optional(),
  isMigrationFromBmc85: z.boolean().default(false),

  // Step 2: Business info
  companyName:          z.string().min(2, "Company name required"),
  brokerName:           z.string().min(2, "Full name required"),
  brokerEmail:          z.string().email("Valid email required"),
  brokerPhone:          z.string().optional(),
  stateOfIncorporation: z.string().length(2, "Select a state"),
  yearsInBusiness:      z.coerce.number().min(0, "Required"),

  // Step 3: Credit info (soft pull consent)
  ssn:                  z.string().min(9, "SSN required for underwriting"),
  creditPullConsent:    z.boolean().refine(v => v === true, "Consent required"),

  // Step 4: Review
  notes: z.string().optional(),
});

export type Bmc84Bond = typeof bmc84Bonds.$inferSelect;
export type InsertBmc84Bond = typeof bmc84Bonds.$inferInsert;
export type Bmc84FmcsaFiling = typeof bmc84FmcsaFilings.$inferSelect;
export type Bmc84Renewal = typeof bmc84Renewals.$inferSelect;
export type Bmc84QuoteFormData = z.infer<typeof bmc84QuoteFormSchema>;
