import type { Express } from "express";
import { eq, and, lte, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { sendEmail } from "./email";
import {
  bmc84Bonds,
  bmc84FmcsaFilings,
  bmc84Renewals,
  insertBmc84BondSchema,
  type Bmc84Bond,
} from "../shared/bmc84-schema";

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export function calculateBmc84Premium(creditScore: number, yearsInBusiness: number): {
  annualPremium: number;
  creditTier: string;
  commissionRate: number;
  commissionAmount: number;
  ratePercent: number;
} {
  const BOND_AMOUNT = 75000;
  const COMMISSION_RATE = 0.20;

  let ratePercent: number;
  let creditTier: string;

  if (creditScore >= 750) {
    ratePercent = yearsInBusiness >= 2 ? 0.0125 : 0.02;
    creditTier = "excellent";
  } else if (creditScore >= 700) {
    ratePercent = yearsInBusiness >= 2 ? 0.02 : 0.03;
    creditTier = "good";
  } else if (creditScore >= 650) {
    ratePercent = yearsInBusiness >= 2 ? 0.04 : 0.06;
    creditTier = "fair";
  } else {
    ratePercent = 0.09;
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

async function checkFilingSLA(bondId: string): Promise<void> {
  const filing = await db
    .select()
    .from(bmc84FmcsaFilings)
    .where(eq(bmc84FmcsaFilings.bondId, bondId))
    .limit(1);

  if (!filing.length || filing[0].status === "confirmed") return;

  const now = new Date();
  const SLA_HOURS = 24;

  if (filing[0].paymentReceivedAt) {
    const hoursElapsed = (now.getTime() - filing[0].paymentReceivedAt.getTime()) / 3600000;
    if (hoursElapsed > SLA_HOURS && filing[0].status === "pending") {
      await db
        .update(bmc84FmcsaFilings)
        .set({
          slaBreached: true,
          slaBreachReason: `Carrier not notified within ${SLA_HOURS}h of payment`,
          updatedAt: now,
        })
        .where(eq(bmc84FmcsaFilings.id, filing[0].id));

      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@quantumsurety.bond",
        subject: `⚠️ BMC-84 Filing SLA Breach — Bond ${bondId}`,
        html: `
          <p>The BMC-84 filing for bond <strong>${bondId}</strong> has exceeded the 24-hour SLA.</p>
          <p>Payment received: ${filing[0].paymentReceivedAt}</p>
          <p>Hours elapsed: ${hoursElapsed.toFixed(1)}</p>
          <p><a href="${process.env.APP_URL}/admin?tab=bmc84&id=${bondId}">Review in admin portal</a></p>
        `,
      });
    }
  }
}

export function registerBmc84Routes(app: Express) {
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

  app.post("/api/bmc84/quotes", async (req, res) => {
    try {
      const parsed = insertBmc84BondSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      }

      const data = parsed.data;

      let pricingData: Record<string, unknown> = {};
      if (data.creditScore) {
        const pricing = calculateBmc84Premium(data.creditScore, data.yearsInBusiness || 0);
        pricingData = {
          annualPremium: pricing.annualPremium.toString(),
          commissionRate: pricing.commissionRate.toString(),
          commissionAmount: pricing.commissionAmount.toString(),
          creditTier: pricing.creditTier,
        };
      }

      const bond = await db
        .insert(bmc84Bonds)
        .values({
          ...data,
          ...pricingData,
          status: "quote",
        } as any)
        .returning();

      await sendEmail({
        to: bond[0].brokerEmail,
        subject: "Your BMC-84 Freight Broker Bond Quote — Quantum Surety",
        html: `
          <h2>Your BMC-84 Bond Quote</h2>
          <p>Hi ${bond[0].brokerName},</p>
          <p>Thank you for requesting a BMC-84 freight broker bond quote. Here are your details:</p>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Bond type</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>BMC-84 Freight Broker Bond</strong></td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Bond amount</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>$75,000</strong></td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Annual premium</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>$${bond[0].annualPremium}</strong></td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Company</td><td style="padding:8px;border:1px solid #e5e7eb;">${bond[0].companyName}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Quote ID</td><td style="padding:8px;border:1px solid #e5e7eb;">${bond[0].id}</td></tr>
          </table>
          <p style="margin-top:24px;">
            <a href="${process.env.APP_URL}/portal/bmc84/${bond[0].id}" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
              Complete Your Application
            </a>
          </p>
          <p style="color:#6b7280;font-size:13px;">Once payment is received, we file electronically with the FMCSA within 24 hours.</p>
          <p style="color:#6b7280;font-size:13px;">Questions? Call us at (972) 379-9216 or reply to this email.</p>
        `,
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@quantumsurety.bond",
        subject: `New BMC-84 Quote — ${bond[0].companyName}`,
        html: `
          <p>New BMC-84 freight broker bond quote submitted:</p>
          <ul>
            <li><strong>Company:</strong> ${bond[0].companyName}</li>
            <li><strong>Broker:</strong> ${bond[0].brokerName} (${bond[0].brokerEmail})</li>
            <li><strong>MC#:</strong> ${bond[0].mcNumber || "Not provided yet"}</li>
            <li><strong>Annual premium:</strong> $${bond[0].annualPremium}</li>
            <li><strong>Your commission:</strong> $${bond[0].commissionAmount}</li>
            <li><strong>Migration from BMC-85:</strong> ${bond[0].isMigrationFromBmc85 ? "Yes" : "No"}</li>
          </ul>
          <a href="${process.env.APP_URL}/admin?tab=bmc84&id=${bond[0].id}">View in admin portal</a>
        `,
      });

      res.json({ success: true, bondId: bond[0].id, quote: bond[0] });
    } catch (err: any) {
      console.error("BMC-84 quote creation failed:", err);
      res.status(500).json({ error: "Failed to create quote" });
    }
  });

  app.post("/api/bmc84/:id/payment-confirmed", async (req, res) => {
    try {
      const { id } = req.params;
      const { stripePaymentId } = req.body;
      const now = new Date();

      const bond = await db
        .update(bmc84Bonds)
        .set({ status: "paid", paidAt: now, stripePaymentId, updatedAt: now })
        .where(eq(bmc84Bonds.id, id))
        .returning();

      if (!bond.length) return res.status(404).json({ error: "Bond not found" });

      await db.insert(bmc84FmcsaFilings).values({
        bondId: id,
        status: "pending",
        paymentReceivedAt: now,
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@quantumsurety.bond",
        subject: `🚨 ACTION REQUIRED: BMC-84 Filing — ${bond[0].companyName} — 24hr SLA`,
        html: `
          <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin-bottom:16px;">
            <strong>⚡ 24-HOUR SLA CLOCK STARTED</strong>
            <p>Payment received at ${now.toLocaleString()}. You must notify the carrier and confirm FMCSA e-filing within 24 hours.</p>
          </div>
          <h3>Bond Details</h3>
          <ul>
            <li><strong>Broker:</strong> ${bond[0].brokerName} — ${bond[0].companyName}</li>
            <li><strong>Email:</strong> ${bond[0].brokerEmail}</li>
            <li><strong>Phone:</strong> ${bond[0].brokerPhone || "Not provided"}</li>
            <li><strong>MC#:</strong> ${bond[0].mcNumber || "⚠️ Not provided — confirm with broker"}</li>
            <li><strong>Bond amount:</strong> $75,000</li>
            <li><strong>Premium paid:</strong> $${bond[0].annualPremium}</li>
            <li><strong>Your commission:</strong> $${bond[0].commissionAmount}</li>
            <li><strong>Carrier:</strong> ${bond[0].carrierName || "⚠️ Assign a carrier"}</li>
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

      await sendEmail({
        to: bond[0].brokerEmail,
        subject: "Payment Confirmed — Your BMC-84 Bond is Being Filed with FMCSA",
        html: `
          <h2>Payment Received</h2>
          <p>Hi ${bond[0].brokerName},</p>
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
            <li>Annual premium: $${bond[0].annualPremium}</li>
            <li>Coverage: All 50 states</li>
          </ul>
          <p>Questions? Call us at (972) 379-9216 or reply to this email.</p>
          <p>— Quantum Surety Team</p>
        `,
      });

      res.json({ success: true, bond: bond[0] });
    } catch (err: any) {
      console.error("Payment confirmation failed:", err);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  app.patch("/api/bmc84/:id/filing-status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, fmcsaConfirmationRef, notes } = req.body;
      const now = new Date();

      const filing = await db
        .update(bmc84FmcsaFilings)
        .set({
          status,
          fmcsaConfirmationRef,
          notes,
          updatedAt: now,
          ...(status === "notified" && { carrierNotifiedAt: now }),
          ...(status === "filed" && { carrierFiledAt: now }),
          ...(status === "confirmed" && { fmcsaConfirmedAt: now }),
        })
        .where(eq(bmc84FmcsaFilings.bondId, id))
        .returning();

      if (!filing.length) return res.status(404).json({ error: "Filing not found" });

      const bond = await db
        .update(bmc84Bonds)
        .set({
          status: status === "confirmed" ? "active" : "filing_sent",
          updatedAt: now,
        })
        .where(eq(bmc84Bonds.id, id))
        .returning();

      if (status === "confirmed" && bond.length) {
        await sendEmail({
          to: bond[0].brokerEmail,
          subject: "Your BMC-84 Bond is Now Active with FMCSA",
          html: `
            <h2>Your BMC-84 Bond is Active</h2>
            <p>Hi ${bond[0].brokerName},</p>
            <p>Congratulations! Your BMC-84 freight broker surety bond is now active with the Federal Motor Carrier Safety Administration (FMCSA).</p>
            <p><strong>Bond Details:</strong></p>
            <ul>
              <li>Bond Amount: $75,000</li>
              <li>Status: Active</li>
              <li>Effective Date: ${new Date().toLocaleDateString()}</li>
              <li>Annual Premium: $${bond[0].annualPremium}</li>
              <li>FMCSA Reference: ${fmcsaConfirmationRef || "See your FMCSA account"}</li>
            </ul>
            <p>You can now verify your bond status at the <a href="https://li-public.fmcsa.dot.gov">FMCSA Licensing & Insurance Portal</a>.</p>
            <p><strong>Renewal:</strong> We'll send you renewal reminders 60 and 30 days before your bond expires.</p>
            <p>Questions? Call us at (972) 379-9216 or reply to this email.</p>
            <p>— Quantum Surety Team</p>
          `,
        });
      }

      res.json({ success: true, filing: filing[0], bond: bond[0] });
    } catch (err: any) {
      console.error("Filing status update failed:", err);
      res.status(500).json({ error: "Failed to update filing status" });
    }
  });

  app.get("/api/admin/bmc84/bonds", async (req, res) => {
    try {
      const bonds = await db
        .select()
        .from(bmc84Bonds);

      const bondsWithFiling = await Promise.all(
        bonds.map(async (bond) => {
          const filing = await db
            .select()
            .from(bmc84FmcsaFilings)
            .where(eq(bmc84FmcsaFilings.bondId, bond.id))
            .limit(1);

          const renewal = await db
            .select()
            .from(bmc84Renewals)
            .where(eq(bmc84Renewals.bondId, bond.id))
            .limit(1);

          return {
            ...bond,
            filing: filing[0] || null,
            renewal: renewal[0] || null,
          };
        })
      );

      res.json(bondsWithFiling);
    } catch (err: any) {
      console.error("Failed to fetch BMC-84 bonds:", err);
      res.status(500).json({ error: "Failed to fetch bonds" });
    }
  });

  app.get("/api/admin/bmc84/metrics", async (req, res) => {
    try {
      const bonds = await db.select().from(bmc84Bonds);

      const activeBonds = bonds.filter((b) => b.status === "active").length;
      const totalAnnualPremium = bonds.reduce((sum, b) => sum + parseFloat(b.annualPremium.toString()), 0);
      const totalCommissionEarned = bonds.reduce((sum, b) => sum + (b.commissionAmount ? parseFloat(b.commissionAmount.toString()) : 0), 0);
      const migrationFromBmc85 = bonds.filter((b) => b.isMigrationFromBmc85).length;

      res.json({
        totalBonds: bonds.length,
        activeBonds,
        pendingPayment: bonds.filter((b) => b.status === "payment_pending").length,
        pendingFiling: bonds.filter((b) => b.status === "paid" || b.status === "filing_sent").length,
        totalAnnualPremium: Math.round(totalAnnualPremium),
        totalCommissionEarned: Math.round(totalCommissionEarned),
        migrationFromBmc85,
      });
    } catch (err: any) {
      console.error("Failed to fetch BMC-84 metrics:", err);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.post("/api/bmc84/process-renewals", async (req, res) => {
    try {
      const now = new Date();
      const sixtyDaysFromNow = new Date(now.getTime() + 60 * 86400000);
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 86400000);

      const renewals = await db
        .select()
        .from(bmc84Renewals)
        .where(and(
          eq(bmc84Renewals.status, "pending"),
          lte(bmc84Renewals.dueDate, sixtyDaysFromNow)
        ));

      for (const renewal of renewals) {
        const bond = await db
          .select()
          .from(bmc84Bonds)
          .where(eq(bmc84Bonds.id, renewal.bondId))
          .limit(1);

        if (!bond.length) continue;

        if (!renewal.reminder60SentAt && renewal.dueDate <= sixtyDaysFromNow) {
          await db
            .update(bmc84Renewals)
            .set({ reminder60SentAt: now, status: "reminded_60", updatedAt: now })
            .where(eq(bmc84Renewals.id, renewal.id));

          await sendEmail({
            to: bond[0].brokerEmail,
            subject: `Your BMC-84 Bond Renewal Due in 60 Days — ${bond[0].companyName}`,
            html: `
              <p>Hi ${bond[0].brokerName},</p>
              <p>Your BMC-84 freight broker bond renewal is due in 60 days (${renewal.dueDate.toLocaleDateString()}).</p>
              <p>To ensure uninterrupted coverage, please renew your bond now. Simply pay your renewal premium and we'll handle the FMCSA re-filing.</p>
              <p><a href="${process.env.APP_URL}/quote?type=bmc84&renewal=${bond[0].id}">Renew Your BMC-84 Bond</a></p>
            `,
          });
        }

        if (!renewal.reminder30SentAt && renewal.dueDate <= thirtyDaysFromNow) {
          await db
            .update(bmc84Renewals)
            .set({ reminder30SentAt: now, status: "reminded_30", updatedAt: now })
            .where(eq(bmc84Renewals.id, renewal.id));

          await sendEmail({
            to: bond[0].brokerEmail,
            subject: `URGENT: Your BMC-84 Bond Expires in 30 Days — Action Required`,
            html: `
              <p>Hi ${bond[0].brokerName},</p>
              <p><strong>URGENT:</strong> Your BMC-84 freight broker bond expires in 30 days (${renewal.dueDate.toLocaleDateString()}).</p>
              <p>If your bond lapses, the FMCSA can suspend your broker operating authority immediately. Please renew now to avoid disruption.</p>
              <p><a href="${process.env.APP_URL}/quote?type=bmc84&renewal=${bond[0].id}">Renew Now</a></p>
            `,
          });
        }
      }

      res.json({ success: true, processed: renewals.length });
    } catch (err: any) {
      console.error("Renewal processing failed:", err);
      res.status(500).json({ error: "Failed to process renewals" });
    }
  });
}
