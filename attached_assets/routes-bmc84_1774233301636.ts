/**
 * BMC-84 API ROUTES
 * =================
 * Add this file as: server/routes-bmc84.ts
 * Then import and register it in server/routes.ts:
 *
 *   import { registerBmc84Routes } from "./routes-bmc84";
 *   // Inside your registerRoutes function, add:
 *   registerBmc84Routes(app);
 */

import type { Express } from "express";
import { db } from "./db"; // your existing drizzle db instance
import { eq, and, lte, isNull, sql } from "drizzle-orm";
import { sendEmail } from "./email"; // your existing SendGrid helper
import {
  bmc84Bonds,
  bmc84FmcsaFilings,
  bmc84Renewals,
  insertBmc84BondSchema,
  type Bmc84Bond,
} from "../shared/bmc84-schema";

// ─── Pricing Engine ───────────────────────────────────────────────────────────
// Commission structure: 20% of annual premium

export function calculateBmc84Premium(creditScore: number, yearsInBusiness: number): {
  annualPremium: number;
  creditTier: string;
  commissionRate: number;
  commissionAmount: number;
  ratePercent: number;
} {
  const BOND_AMOUNT = 75000;
  const COMMISSION_RATE = 0.20; // 20%

  let ratePercent: number;
  let creditTier: string;

  // Rate tiers based on credit score + years in business
  if (creditScore >= 750) {
    ratePercent = yearsInBusiness >= 2 ? 0.0125 : 0.02; // 1.25–2%
    creditTier = "excellent";
  } else if (creditScore >= 700) {
    ratePercent = yearsInBusiness >= 2 ? 0.02 : 0.03;   // 2–3%
    creditTier = "good";
  } else if (creditScore >= 650) {
    ratePercent = yearsInBusiness >= 2 ? 0.04 : 0.06;   // 4–6%
    creditTier = "fair";
  } else {
    ratePercent = 0.09; // 9% — high-risk program
    creditTier = "poor";
  }

  const annualPremium = Math.max(938, Math.round(BOND_AMOUNT * ratePercent));
  const commissionAmount = Math.round(annualPremium * COMMISSION_RATE);

  return {
    annualPremium,
    creditTier,
    commissionRate: COMMISSION_RATE,
    commissionAmount,
    ratePercent,
  };
}

// ─── SLA Checker ─────────────────────────────────────────────────────────────
// Run this on a cron or after each status update to detect SLA breaches

async function checkFilingSLA(bondId: string): Promise<void> {
  const [filing] = await db
    .select()
    .from(bmc84FmcsaFilings)
    .where(eq(bmc84FmcsaFilings.bondId, bondId));

  if (!filing || filing.status === "confirmed") return;

  const now = new Date();
  const SLA_HOURS = 24;

  if (filing.paymentReceivedAt) {
    const hoursElapsed = (now.getTime() - filing.paymentReceivedAt.getTime()) / 3600000;
    if (hoursElapsed > SLA_HOURS && filing.status === "pending") {
      await db
        .update(bmc84FmcsaFilings)
        .set({
          slaBreached: true,
          slaBreachReason: `Carrier not notified within ${SLA_HOURS}h of payment`,
          updatedAt: now,
        })
        .where(eq(bmc84FmcsaFilings.id, filing.id));

      // Alert admins about breach
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@quantumsurety.bond",
        subject: `⚠️ BMC-84 Filing SLA Breach — Bond ${bondId}`,
        html: `
          <p>The BMC-84 filing for bond <strong>${bondId}</strong> has exceeded the 24-hour SLA.</p>
          <p>Payment received: ${filing.paymentReceivedAt}</p>
          <p>Hours elapsed: ${hoursElapsed.toFixed(1)}</p>
          <p><a href="${process.env.APP_URL}/admin?tab=bmc84&id=${bondId}">Review in admin portal</a></p>
        `,
      });
    }
  }
}

// ─── Route Registration ───────────────────────────────────────────────────────

export function registerBmc84Routes(app: Express) {

  // GET /api/bmc84/quote-estimate
  // Returns instant premium estimate by credit score + years in business
  app.get("/api/bmc84/quote-estimate", (req, res) => {
    const creditScore = parseInt(req.query.credit as string) || 700;
    const yearsInBusiness = parseInt(req.query.years as string) || 2;
    const pricing = calculateBmc84Premium(creditScore, yearsInBusiness);
    res.json({
      bondAmount: 75000,
      ...pricing,
      monthly: Math.round(pricing.annualPremium / 12),
    });
  });

  // POST /api/bmc84/quotes
  // Creates a new BMC-84 quote record
  app.post("/api/bmc84/quotes", async (req, res) => {
    try {
      const parsed = insertBmc84BondSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      }

      const data = parsed.data;

      // Calculate pricing if credit score provided
      let pricingData = {};
      if (data.creditScore) {
        const pricing = calculateBmc84Premium(data.creditScore, data.yearsInBusiness || 0);
        pricingData = {
          annualPremium: pricing.annualPremium.toString(),
          commissionRate: pricing.commissionRate.toString(),
          commissionAmount: pricing.commissionAmount.toString(),
          creditTier: pricing.creditTier as any,
        };
      }

      const [bond] = await db
        .insert(bmc84Bonds)
        .values({
          ...data,
          ...pricingData,
          status: "quote",
        })
        .returning();

      // Send acknowledgment email to broker
      await sendEmail({
        to: bond.brokerEmail,
        subject: "Your BMC-84 Freight Broker Bond Quote — Quantum Surety",
        html: `
          <h2>Your BMC-84 Bond Quote</h2>
          <p>Hi ${bond.brokerName},</p>
          <p>Thank you for requesting a BMC-84 freight broker bond quote. Here are your details:</p>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Bond type</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>BMC-84 Freight Broker Bond</strong></td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Bond amount</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>$75,000</strong></td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Annual premium</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>$${bond.annualPremium}</strong></td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Company</td><td style="padding:8px;border:1px solid #e5e7eb;">${bond.companyName}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Quote ID</td><td style="padding:8px;border:1px solid #e5e7eb;">${bond.id}</td></tr>
          </table>
          <p style="margin-top:24px;">
            <a href="${process.env.APP_URL}/portal/bmc84/${bond.id}" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
              Complete Your Application
            </a>
          </p>
          <p style="color:#6b7280;font-size:13px;">Once payment is received, we file electronically with the FMCSA within 24 hours.</p>
          <p style="color:#6b7280;font-size:13px;">Questions? Call us at (972) 379-9216 or reply to this email.</p>
        `,
      });

      // Notify admin of new BMC-84 quote
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@quantumsurety.bond",
        subject: `New BMC-84 Quote — ${bond.companyName}`,
        html: `
          <p>New BMC-84 freight broker bond quote submitted:</p>
          <ul>
            <li><strong>Company:</strong> ${bond.companyName}</li>
            <li><strong>Broker:</strong> ${bond.brokerName} (${bond.brokerEmail})</li>
            <li><strong>MC#:</strong> ${bond.mcNumber || "Not provided yet"}</li>
            <li><strong>Annual premium:</strong> $${bond.annualPremium}</li>
            <li><strong>Your commission:</strong> $${bond.commissionAmount}</li>
            <li><strong>Migration from BMC-85:</strong> ${bond.isMigrationFromBmc85 ? "Yes" : "No"}</li>
          </ul>
          <a href="${process.env.APP_URL}/admin?tab=bmc84&id=${bond.id}">View in admin portal</a>
        `,
      });

      res.json({ success: true, bondId: bond.id, quote: bond });
    } catch (err: any) {
      console.error("BMC-84 quote creation failed:", err);
      res.status(500).json({ error: "Failed to create quote" });
    }
  });

  // POST /api/bmc84/:id/payment-confirmed
  // Called after Stripe payment succeeds — starts the 24-hour FMCSA filing SLA
  app.post("/api/bmc84/:id/payment-confirmed", async (req, res) => {
    try {
      const { id } = req.params;
      const { stripePaymentId } = req.body;
      const now = new Date();

      // Update bond status
      const [bond] = await db
        .update(bmc84Bonds)
        .set({ status: "paid", paidAt: now, stripePaymentId, updatedAt: now })
        .where(eq(bmc84Bonds.id, id))
        .returning();

      if (!bond) return res.status(404).json({ error: "Bond not found" });

      // Create FMCSA filing record — SLA clock starts now
      await db.insert(bmc84FmcsaFilings).values({
        bondId: id,
        status: "pending",
        paymentReceivedAt: now,
      });

      // ─── FMCSA Filing SLA: Step 1 ────────────────────────────────────────
      // Alert admin immediately — they must notify carrier within 24 hours
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@quantumsurety.bond",
        subject: `🚨 ACTION REQUIRED: BMC-84 Filing — ${bond.companyName} — 24hr SLA`,
        html: `
          <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin-bottom:16px;">
            <strong>⚡ 24-HOUR SLA CLOCK STARTED</strong>
            <p>Payment received at ${now.toLocaleString()}. You must notify the carrier and confirm FMCSA e-filing within 24 hours.</p>
          </div>
          <h3>Bond Details</h3>
          <ul>
            <li><strong>Broker:</strong> ${bond.brokerName} — ${bond.companyName}</li>
            <li><strong>Email:</strong> ${bond.brokerEmail}</li>
            <li><strong>Phone:</strong> ${bond.brokerPhone || "Not provided"}</li>
            <li><strong>MC#:</strong> ${bond.mcNumber || "⚠️ Not provided — confirm with broker"}</li>
            <li><strong>Bond amount:</strong> $75,000</li>
            <li><strong>Premium paid:</strong> $${bond.annualPremium}</li>
            <li><strong>Your commission:</strong> $${bond.commissionAmount}</li>
            <li><strong>Carrier:</strong> ${bond.carrierName || "⚠️ Assign a carrier"}</li>
          </ul>
          <h3>Next Steps (complete within 24 hours)</h3>
          <ol>
            <li>Email your carrier contact with bond details</li>
            <li>Carrier submits BMC-84 e-filing to FMCSA portal</li>
            <li>Confirm carrier filed and update status in admin portal</li>
            <li>Email broker confirmation with FMCSA filing reference</li>
          </ol>
          <a href="${process.env.APP_URL}/admin?tab=bmc84&id=${id}" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Open in Admin Portal
          </a>
        `,
      });

      // Confirm payment receipt to broker
      await sendEmail({
        to: bond.brokerEmail,
        subject: "Payment Confirmed — Your BMC-84 Bond is Being Filed with FMCSA",
        html: `
          <h2>Payment Received</h2>
          <p>Hi ${bond.brokerName},</p>
          <p>We've received your payment for your BMC-84 freight broker bond. Here's what happens next:</p>
          <ol>
            <li><strong>Within 24 hours:</strong> We coordinate electronic filing with the FMCSA on your behalf</li>
            <li><strong>Within 1–3 business days:</strong> Your bond appears as active in the FMCSA Licensing & Insurance portal</li>
            <li><strong>You'll receive:</strong> A confirmation email with your bond certificate and FMCSA filing reference</li>
          </ol>
          <p>You can verify your bond status anytime at: <a href="https://li-public.fmcsa.dot.gov">FMCSA Licensing & Insurance Portal</a></p>
          <p><strong>Bond details:</strong></p>
          <ul>
            <li>Bond amount: $75,000</li>
            <li>Annual premium: $${bond.annualPremium}</li>
            <li>Coverage: All 50 states</li>
          </ul>
          <p>Questions? Call us at (972) 379-9216 or reply to this email.</p>
          <p>— Quantum Surety Team</p>
        `,
      });

      res.json({ success: true, message: "Payment confirmed, FMCSA filing initiated" });
    } catch (err: any) {
      console.error("Payment confirmation failed:", err);
      res.status(500).json({ error: "Failed to process payment confirmation" });
    }
  });

  // PATCH /api/bmc84/:id/filing-status
  // Admin updates filing status as it progresses through the SLA steps
  app.patch("/api/bmc84/:id/filing-status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, carrierContact, fmcsaConfirmationRef, notes } = req.body;
      const now = new Date();

      const updateData: Record<string, any> = { status, notes, updatedAt: now };

      if (status === "notified")  updateData.carrierNotifiedAt = now;
      if (status === "filed")     updateData.carrierFiledAt = now;
      if (status === "confirmed") {
        updateData.fmcsaConfirmedAt = now;
        updateData.fmcsaConfirmationRef = fmcsaConfirmationRef;
        if (carrierContact) updateData.carrierContact = carrierContact;

        // Update bond to active
        await db
          .update(bmc84Bonds)
          .set({ status: "active", updatedAt: now })
          .where(eq(bmc84Bonds.id, id));

        // Get bond for broker notification
        const [bond] = await db.select().from(bmc84Bonds).where(eq(bmc84Bonds.id, id));
        if (bond) {
          // Create renewal record for 1 year from effective date
          const renewalDue = new Date(bond.effectiveDate || now);
          renewalDue.setFullYear(renewalDue.getFullYear() + 1);
          renewalDue.setDate(renewalDue.getDate() - 1); // Day before expiration

          await db.insert(bmc84Renewals).values({
            bondId: id,
            renewalYear: 1,
            dueDate: renewalDue,
            status: "pending",
          });

          // Notify broker: bond is active
          await sendEmail({
            to: bond.brokerEmail,
            subject: "✅ Your BMC-84 Bond is Active with FMCSA — Quantum Surety",
            html: `
              <h2>Your BMC-84 Bond is Now Active</h2>
              <p>Hi ${bond.brokerName},</p>
              <p>Your $75,000 BMC-84 freight broker bond has been filed and confirmed with the FMCSA. Your broker operating authority is now active.</p>
              <table style="border-collapse:collapse;width:100%;max-width:500px;">
                <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Bond amount</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>$75,000</strong></td></tr>
                <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">FMCSA reference</td><td style="padding:8px;border:1px solid #e5e7eb;">${fmcsaConfirmationRef || "On file"}</td></tr>
                <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Effective</td><td style="padding:8px;border:1px solid #e5e7eb;">${bond.effectiveDate?.toLocaleDateString()}</td></tr>
                <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Expires</td><td style="padding:8px;border:1px solid #e5e7eb;">${bond.expirationDate?.toLocaleDateString()}</td></tr>
                <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Annual renewal</td><td style="padding:8px;border:1px solid #e5e7eb;">We'll remind you 60 and 30 days before expiration</td></tr>
              </table>
              <p style="margin-top:16px;">Verify your bond status: <a href="https://li-public.fmcsa.dot.gov">FMCSA Licensing & Insurance Portal</a></p>
              <p>— Quantum Surety Team | (972) 379-9216</p>
            `,
          });
        }
      }

      await db
        .update(bmc84FmcsaFilings)
        .set(updateData)
        .where(eq(bmc84FmcsaFilings.bondId, id));

      res.json({ success: true });
    } catch (err: any) {
      console.error("Filing status update failed:", err);
      res.status(500).json({ error: "Failed to update filing status" });
    }
  });

  // POST /api/bmc84/process-renewals
  // Run this daily via cron — sends renewal reminders and flags lapsed bonds
  app.post("/api/bmc84/process-renewals", async (req, res) => {
    try {
      const now = new Date();

      // 60-day reminders
      const in60Days = new Date(now);
      in60Days.setDate(in60Days.getDate() + 60);
      const past57Days = new Date(now);
      past57Days.setDate(past57Days.getDate() + 57);

      const due60 = await db
        .select({ renewal: bmc84Renewals, bond: bmc84Bonds })
        .from(bmc84Renewals)
        .innerJoin(bmc84Bonds, eq(bmc84Renewals.bondId, bmc84Bonds.id))
        .where(
          and(
            isNull(bmc84Renewals.reminder60SentAt),
            lte(bmc84Renewals.dueDate, in60Days),
            sql`${bmc84Renewals.dueDate} >= ${past57Days}`
          )
        );

      for (const { renewal, bond } of due60) {
        await sendEmail({
          to: bond.brokerEmail,
          subject: "Your BMC-84 Bond Renews in 60 Days — Action Required",
          html: `
            <h2>BMC-84 Bond Renewal Notice — 60 Days</h2>
            <p>Hi ${bond.brokerName},</p>
            <p>Your $75,000 FMCSA freight broker bond expires on <strong>${renewal.dueDate.toLocaleDateString()}</strong>.</p>
            <p>If your bond lapses, the FMCSA will <strong>immediately suspend your broker operating authority</strong>. Renewing early ensures zero disruption to your business.</p>
            <p><strong>Your renewal options:</strong></p>
            <ul>
              <li>Renew online at the same rate (subject to credit review)</li>
              <li>Call us at (972) 379-9216</li>
              <li>Reply to this email</li>
            </ul>
            <a href="${process.env.APP_URL}/portal/bmc84/${bond.id}/renew" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
              Renew My Bond Now
            </a>
            <p style="color:#6b7280;font-size:13px;">This is an automated reminder from Quantum Surety. Bond ID: ${bond.id}</p>
          `,
        });

        await db
          .update(bmc84Renewals)
          .set({ reminder60SentAt: now, status: "reminded_60", updatedAt: now })
          .where(eq(bmc84Renewals.id, renewal.id));
      }

      // 30-day reminders
      const in30Days = new Date(now);
      in30Days.setDate(in30Days.getDate() + 30);
      const past27Days = new Date(now);
      past27Days.setDate(past27Days.getDate() + 27);

      const due30 = await db
        .select({ renewal: bmc84Renewals, bond: bmc84Bonds })
        .from(bmc84Renewals)
        .innerJoin(bmc84Bonds, eq(bmc84Renewals.bondId, bmc84Bonds.id))
        .where(
          and(
            isNull(bmc84Renewals.reminder30SentAt),
            lte(bmc84Renewals.dueDate, in30Days),
            sql`${bmc84Renewals.dueDate} >= ${past27Days}`
          )
        );

      for (const { renewal, bond } of due30) {
        await sendEmail({
          to: bond.brokerEmail,
          subject: "⚠️ 30 Days Until BMC-84 Bond Expiration — Renew Now",
          html: `
            <h2>URGENT: BMC-84 Bond Renewal — 30 Days Remaining</h2>
            <p>Hi ${bond.brokerName},</p>
            <p>Your freight broker bond expires in <strong>30 days</strong> on ${renewal.dueDate.toLocaleDateString()}. Do not let it lapse — your FMCSA operating authority will be suspended immediately upon expiration.</p>
            <a href="${process.env.APP_URL}/portal/bmc84/${bond.id}/renew" style="background:#dc2626;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
              Renew Immediately
            </a>
            <p>Or call us directly: <strong>(972) 379-9216</strong></p>
            <p style="color:#6b7280;font-size:13px;">Quantum Surety | admin@quantumsurety.bond</p>
          `,
        });

        // Also alert admin about upcoming renewal
        await sendEmail({
          to: process.env.ADMIN_EMAIL || "admin@quantumsurety.bond",
          subject: `30-Day Renewal Alert — ${bond.companyName} — BMC-84 Expiring ${renewal.dueDate.toLocaleDateString()}`,
          html: `
            <p>BMC-84 bond renewal due in 30 days:</p>
            <ul>
              <li><strong>Broker:</strong> ${bond.brokerName} — ${bond.companyName}</li>
              <li><strong>Email:</strong> ${bond.brokerEmail}</li>
              <li><strong>Expiration:</strong> ${renewal.dueDate.toLocaleDateString()}</li>
              <li><strong>Current premium:</strong> $${bond.annualPremium}/yr</li>
              <li><strong>Your commission at renewal:</strong> ~$${bond.commissionAmount}</li>
            </ul>
            <a href="${process.env.APP_URL}/admin?tab=bmc84&id=${bond.id}">View in admin portal</a>
          `,
        });

        await db
          .update(bmc84Renewals)
          .set({ reminder30SentAt: now, status: "reminded_30", updatedAt: now })
          .where(eq(bmc84Renewals.id, renewal.id));
      }

      res.json({
        success: true,
        processed: { reminder60: due60.length, reminder30: due30.length },
      });
    } catch (err: any) {
      console.error("Renewal processing failed:", err);
      res.status(500).json({ error: "Renewal processing failed" });
    }
  });

  // GET /api/admin/bmc84/bonds
  // Admin: list all BMC-84 bonds with filing and renewal status
  app.get("/api/admin/bmc84/bonds", async (req, res) => {
    try {
      const bonds = await db
        .select()
        .from(bmc84Bonds)
        .orderBy(sql`${bmc84Bonds.createdAt} DESC`);

      // Get filing statuses
      const filings = await db.select().from(bmc84FmcsaFilings);
      const filingMap = Object.fromEntries(filings.map(f => [f.bondId, f]));

      // Get renewal statuses
      const renewals = await db.select().from(bmc84Renewals);
      const renewalMap = Object.fromEntries(renewals.map(r => [r.bondId, r]));

      const enriched = bonds.map(bond => ({
        ...bond,
        filing: filingMap[bond.id] || null,
        renewal: renewalMap[bond.id] || null,
      }));

      res.json(enriched);
    } catch (err: any) {
      console.error("Failed to fetch BMC-84 bonds:", err);
      res.status(500).json({ error: "Failed to fetch bonds" });
    }
  });

  // GET /api/admin/bmc84/metrics
  // Admin: revenue and pipeline metrics
  app.get("/api/admin/bmc84/metrics", async (req, res) => {
    try {
      const bonds = await db.select().from(bmc84Bonds);

      const metrics = {
        totalBonds: bonds.length,
        activeBonds: bonds.filter(b => b.status === "active").length,
        pendingPayment: bonds.filter(b => b.status === "payment_pending").length,
        pendingFiling: bonds.filter(b => b.status === "paid" || b.status === "filing_sent").length,
        totalAnnualPremium: bonds
          .filter(b => b.status === "active")
          .reduce((sum, b) => sum + parseFloat(b.annualPremium || "0"), 0),
        totalCommissionEarned: bonds
          .filter(b => b.status === "active")
          .reduce((sum, b) => sum + parseFloat(b.commissionAmount || "0"), 0),
        migrationFromBmc85: bonds.filter(b => b.isMigrationFromBmc85).length,
      };

      res.json(metrics);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });
}
