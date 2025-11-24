import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quoteFormSchema } from "@shared/schema";
import { generateAIResponse } from "./openai";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes - this endpoint MUST NOT use isAuthenticated middleware
  // so that the frontend can check auth status
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Quote submission endpoint
  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = quoteFormSchema.parse(req.body);
      const quote = await storage.createQuote({
        bondType: validatedData.bondType,
        contractValue: validatedData.contractValue,
        projectName: validatedData.projectName,
        projectState: validatedData.projectState,
        businessName: validatedData.businessName,
        contactName: validatedData.contactName,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        businessType: validatedData.businessType,
        yearsInBusiness: validatedData.yearsInBusiness,
        annualRevenue: validatedData.annualRevenue,
        creditScore: validatedData.creditScore,
      });
      
      res.json({
        success: true,
        quote,
        suggestedPremiumRange: "1.5% - 2.5%",
        riskNotes: "Based on provided information, this appears to be a standard risk profile.",
        nextSteps: [
          "We'll review your application within 24 hours",
          "You may be contacted for additional documentation",
          "Once approved, your bond will be issued digitally"
        ]
      });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid quote data" });
    }
  });

  // Get all quotes (admin)
  app.get("/api/quotes", async (req, res) => {
    const quotes = await storage.getAllQuotes();
    res.json(quotes);
  });

  // Get specific quote
  app.get("/api/quotes/:id", async (req, res) => {
    const quote = await storage.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ error: "Quote not found" });
    }
  });

  // Update quote status
  app.patch("/api/quotes/:id/status", async (req, res) => {
    const { status } = req.body;
    const quote = await storage.updateQuoteStatus(req.params.id, status);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ error: "Quote not found" });
    }
  });

  // Get bonds for user
  app.get("/api/bonds", async (req, res) => {
    const userId = req.query.userId as string || "user-1";
    const bonds = await storage.getBondsByUserId(userId);
    res.json(bonds);
  });

  // Get all bonds (admin)
  app.get("/api/bonds/all", async (req, res) => {
    const bonds = await storage.getAllBonds();
    res.json(bonds);
  });

  // Create bond
  app.post("/api/bonds", async (req, res) => {
    try {
      const bond = await storage.createBond(req.body);
      res.json(bond);
    } catch (error) {
      res.status(400).json({ error: "Invalid bond data" });
    }
  });

  // Get projects for user
  app.get("/api/projects", async (req, res) => {
    const userId = req.query.userId as string || "user-1";
    const projects = await storage.getProjectsByUserId(userId);
    res.json(projects);
  });

  // Get all projects (admin)
  app.get("/api/projects/all", async (req, res) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  // Create project
  app.post("/api/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  // AI Bond Finder chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Integration point: OpenAI for AI-powered bond recommendations
      const response = await generateAIResponse(messages);
      
      res.json({ 
        message: response,
        success: true 
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // Bond recommendation endpoint
  app.post("/api/bond-recommendations", async (req, res) => {
    const { role, projectSize, state } = req.body;
    
    const recommendations: Record<string, any> = {
      "gc_under_100k": {
        bonds: ["Performance Bond", "Payment Bond"],
        premium: "1-3% of contract value",
        docs: ["Financial statements", "Project details", "Resume of experience"]
      },
      "gc_100k_500k": {
        bonds: ["Bid Bond", "Performance Bond", "Payment Bond"],
        premium: "1-3% of contract value",
        docs: ["Financial statements", "Work-in-progress schedule", "Project details", "Resume"]
      },
      "sub_under_100k": {
        bonds: ["Performance Bond", "Payment Bond"],
        premium: "1-3% of contract value",
        docs: ["Financial statements", "Contract details", "Resume"]
      },
    };

    const key = `${role}_${projectSize}`;
    const recommendation = recommendations[key] || recommendations["gc_under_100k"];
    
    res.json(recommendation);
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Seed database endpoint (development only)
  app.post("/api/seed", async (req, res) => {
    // Only allow seeding in development mode
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ error: "Seeding is only allowed in development mode" });
    }

    try {
      // Check if demo user already exists (idempotent)
      const existingUser = await storage.getUserByUsername("demo");
      if (existingUser) {
        return res.json({ 
          success: true, 
          message: "Database already seeded",
          userId: existingUser.id
        });
      }

      // Create demo user
      const demoUser = await storage.createUser({
        username: "demo",
        password: "demo123",
        email: "john@abcconstruction.com",
        companyName: "ABC Construction LLC",
        role: "client",
      });

      // Create demo projects
      const project1 = await storage.createProject({
        userId: demoUser.id,
        name: "City Hall Renovation",
        description: "Complete renovation of municipal building",
        contractValue: "500000",
        state: "IL",
        status: "active",
        startDate: new Date("2023-06-15"),
        completionDate: new Date("2024-12-31"),
        obligee: "City of Springfield",
        bondIds: [],
      });

      const project2 = await storage.createProject({
        userId: demoUser.id,
        name: "Highway Bridge Project",
        description: "Bridge construction and road improvements",
        contractValue: "750000",
        state: "IL",
        status: "active",
        startDate: new Date("2023-09-01"),
        completionDate: new Date("2024-08-15"),
        obligee: "State DOT",
        bondIds: [],
      });

      // Create demo bonds
      const bond1 = await storage.createBond({
        userId: demoUser.id,
        quoteId: null,
        bondType: "Performance Bond",
        penalSum: "500000",
        premium: "7500",
        effectiveDate: new Date("2023-06-15"),
        expirationDate: new Date("2024-12-31"),
        status: "active",
        bondNumber: "QS-2023-4892",
        projectName: "City Hall Renovation",
        obligee: "City of Springfield",
      });

      const bond2 = await storage.createBond({
        userId: demoUser.id,
        quoteId: null,
        bondType: "Payment Bond",
        penalSum: "500000",
        premium: "7500",
        effectiveDate: new Date("2023-06-15"),
        expirationDate: new Date("2024-12-31"),
        status: "active",
        bondNumber: "QS-2023-4893",
        projectName: "City Hall Renovation",
        obligee: "City of Springfield",
      });

      const bond3 = await storage.createBond({
        userId: demoUser.id,
        quoteId: null,
        bondType: "Performance Bond",
        penalSum: "750000",
        premium: "11250",
        effectiveDate: new Date("2023-09-01"),
        expirationDate: new Date("2024-08-15"),
        status: "active",
        bondNumber: "QS-2023-5103",
        projectName: "Highway Bridge Project",
        obligee: "State DOT",
      });

      res.json({ 
        success: true, 
        message: "Database seeded successfully",
        created: {
          user: demoUser.id,
          projects: [project1.id, project2.id],
          bonds: [bond1.id, bond2.id, bond3.id]
        }
      });
    } catch (error: any) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to seed database", details: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
