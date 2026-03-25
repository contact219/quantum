# BMC-84 Integration Guide
# ========================
# Exactly what to add where. All files below are drop-ins.
# Estimated integration time: 2–3 hours in Replit.

## FILES TO ADD (new files, no existing changes needed)

1. shared/bmc84-schema.ts          → shared/bmc84-schema.ts
2. server/routes-bmc84.ts          → server/routes-bmc84.ts
3. client/src/pages/bmc84-freight-broker-bond.tsx → client/src/pages/bmc84-freight-broker-bond.tsx
4. client/src/components/Bmc84AdminPanel.tsx      → client/src/components/admin/Bmc84AdminPanel.tsx

## CHANGES TO EXISTING FILES

### 1. shared/schema.ts — export the new BMC-84 types
Add at the bottom (after your existing exports):

  export * from "./bmc84-schema";

### 2. server/routes.ts — register BMC-84 routes
Add near the top with your other imports:

  import { registerBmc84Routes } from "./routes-bmc84";

Add inside your registerRoutes() function, after your existing routes:

  registerBmc84Routes(app);

### 3. client/src/App.tsx — add the landing page route
Add with your other imports:

  import BMC84FreightBrokerBond from "@/pages/bmc84-freight-broker-bond";

Add inside the <Switch> block, before the NotFound catch-all:

  <Route path="/bonds/bmc-84-freight-broker" component={BMC84FreightBrokerBond} />

### 4. server/seo.ts — add BMC-84 page to PAGE_META
Add inside PAGE_META:

  "/bonds/bmc-84-freight-broker": {
    title: "BMC-84 Freight Broker Bond | $75,000 FMCSA Bond | Quantum Surety",
    description: "Get your BMC-84 freight broker surety bond fast. $75,000 FMCSA-required bond for freight brokers and forwarders. Rates from $938/year. Same-day FMCSA filing.",
    canonical: `${BASE_URL}/bonds/bmc-84-freight-broker`,
    content: `
      <main>
        <h1>BMC-84 Freight Broker Bond</h1>
        <p>The $75,000 FMCSA-required surety bond for all licensed freight brokers and freight forwarders in the United States. Quantum Surety issues BMC-84 bonds with AI-powered approvals, electronic FMCSA filing within 24 hours, and rates starting at $938/year.</p>
        <p>Switching from a BMC-85 trust fund? New FMCSA rules effective January 2026 require most brokers to switch to a BMC-84 bond. The process takes less than 24 hours.</p>
        <a href="/quote?type=bmc84">Get Your BMC-84 Quote</a>
      </main>`,
  },

### 5. client/src/components/layout/footer.tsx — add BMC-84 to Bonds column
In the footerColumns Bonds array, add:

  { href: "/bonds/bmc-84-freight-broker", label: "Freight Broker Bond (BMC-84)" },

### 6. client/src/pages/admin.tsx — add BMC-84 tab
Add import:

  import { Bmc84AdminPanel } from "@/components/admin/Bmc84AdminPanel";

Add a new tab in your admin tabs:

  { value: "bmc84", label: "BMC-84 Bonds" }

And the tab content:

  <TabsContent value="bmc84">
    <Bmc84AdminPanel />
  </TabsContent>

### 7. Database migration — run drizzle push
After adding bmc84-schema.ts, run:

  npm run db:push

This creates the 3 new tables:
  - bmc84_bonds
  - bmc84_fmcsa_filings
  - bmc84_renewals

### 8. Environment variable — add ADMIN_EMAIL
In your Replit secrets, add:

  ADMIN_EMAIL=your-real-email@quantumsurety.bond

This is where all filing alerts and admin notifications go.

### 9. Set up daily renewal cron
Add to your Replit deployment or use a simple setInterval in server startup:

  // In server/app.ts or index-dev.ts, add after server starts:
  // Run renewal reminders daily at 9am
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(async () => {
    const hour = new Date().getHours();
    if (hour === 9) {
      await fetch(`${process.env.APP_URL}/api/bmc84/process-renewals`, { method: "POST" });
    }
  }, TWENTY_FOUR_HOURS);

## WHAT THIS BUILDS

### Landing page (/bonds/bmc-84-freight-broker)
- Full SEO-optimized page targeting "freight broker bond", "BMC-84 bond"
- BMC-85 migration alert banner (timed for the 2026 rule change)
- Rate table by credit tier
- 7 FAQ items covering all common questions
- CTA to quote form pre-filled with bond type

### Quote workflow (/quote?type=bmc84)
- Adds BMC-84 as a selectable bond type in your existing quote form
- Pricing engine calculates premium based on credit score + years in business
- Creates bond record in database
- Sends quote email to broker + admin notification

### Admin portal (/admin → BMC-84 tab)
- Filing SLA queue — shows bonds paid but not yet filed, with countdown
- One-click status updates: notified → filed → confirmed
- Auto-alerts admin when 24hr SLA is breached
- Renewal queue with 60-day and 30-day reminder status
- Revenue metrics: active bonds, total premium, your commissions

### Email automation (SendGrid)
- Quote confirmation to broker
- New quote notification to admin
- Payment confirmation to broker
- 24hr SLA alert to admin when payment received
- FMCSA confirmed notification to broker (with effective/expiration dates)
- 60-day renewal reminder to broker + admin
- 30-day renewal reminder to broker + admin (urgent tone)

### Pricing structure (as specified)
- Premium: $938–$9,000/year based on credit tier
- Commission: 20% of annual premium
- At $1,200 average premium × 100 brokers = $24,000/year recurring
- All commissions visible in admin metrics panel

## LAUNCH CHECKLIST

After deploying:

[ ] Run npm run db:push to create BMC-84 tables
[ ] Add ADMIN_EMAIL to Replit secrets
[ ] Verify the landing page: https://quantumsurety.bond/bonds/bmc-84-freight-broker
[ ] Test the quote form: submit a test BMC-84 quote
[ ] Check admin BMC-84 tab loads correctly
[ ] Resubmit sitemap in Google Search Console (new page added)
[ ] Post in r/FreightBrokers and DAT community announcing the program
[ ] Add to your Google Business Profile services list
