import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  role: text("role").notNull().default("client"),
});

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  penal_sum: decimal("penal_sum").notNull(),
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

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true, createdAt: true, status: true });
export const insertBondSchema = createInsertSchema(bonds).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertBond = z.infer<typeof insertBondSchema>;
export type Bond = typeof bonds.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

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
