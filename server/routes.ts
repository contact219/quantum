import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quoteFormSchema } from "@shared/schema";
import { generateAIResponse } from "./openai";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Server-side protection for portal and admin routes
  // This middleware runs BEFORE the SPA is served
  app.use(['/portal', '/portal/*'], (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/api/login');
    }
    next();
  });

  // Admin-specific route protection
  app.use(['/admin', '/admin/*'], (req: any, res, next) => {
    if (!req.isAuthenticated()) {
      // Redirect to admin login page (username/password) instead of OAuth
      return res.redirect('/admin-login');
    }
    // Check if user has Replit Auth claims (OAuth user)
    const hasReplitAuth = !!req.user?.claims?.sub;
    if (!hasReplitAuth && !req.user?.id) {
      // If no Replit Auth and no local user ID, redirect to admin login
      return res.redirect('/admin-login');
    }
    // Continue to serve the SPA - role check will happen in ProtectedRoute component
    next();
  });

  // Auth routes - this endpoint MUST NOT use isAuthenticated middleware
  // so that the frontend can check auth status
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get user ID from claims (session stores the full user object with claims)
      const userId = req.user.claims?.sub;
      
      if (!userId) {
        console.error("User session missing claims.sub:", req.user);
        return res.status(401).json({ message: "Unauthorized" });
      }

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

  // Get all quotes (admin only) - PROTECTED
  app.get("/api/quotes", isAdmin, async (req, res) => {
    const quotes = await storage.getAllQuotes();
    res.json(quotes);
  });

  // Get specific quote - PROTECTED
  app.get("/api/quotes/:id", isAuthenticated, async (req, res) => {
    const quote = await storage.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ error: "Quote not found" });
    }
  });

  // Update quote status - PROTECTED (admin only)
  app.patch("/api/quotes/:id/status", isAdmin, async (req, res) => {
    const { status } = req.body;
    const quote = await storage.updateQuoteStatus(req.params.id, status);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ error: "Quote not found" });
    }
  });

  // Update quote - PROTECTED (admin only)
  app.patch("/api/quotes/:id", isAdmin, async (req, res) => {
    try {
      const quote = await storage.updateQuote(req.params.id, req.body);
      if (quote) {
        res.json(quote);
      } else {
        res.status(404).json({ error: "Quote not found" });
      }
    } catch (error) {
      res.status(400).json({ error: "Failed to update quote" });
    }
  });

  // Delete quote - PROTECTED (admin only)
  app.delete("/api/quotes/:id", isAdmin, async (req, res) => {
    const success = await storage.deleteQuote(req.params.id);
    if (success) {
      res.json({ success: true, message: "Quote deleted" });
    } else {
      res.status(404).json({ error: "Quote not found" });
    }
  });

  // Get bonds for user - PROTECTED
  app.get("/api/bonds", isAuthenticated, async (req: any, res) => {
    // Use authenticated user's ID from session
    const userId = req.user.claims?.sub;
    const bonds = await storage.getBondsByUserId(userId);
    res.json(bonds);
  });

  // Get all bonds (admin only) - PROTECTED
  app.get("/api/bonds/all", isAdmin, async (req, res) => {
    const bonds = await storage.getAllBonds();
    res.json(bonds);
  });

  // Create bond - PROTECTED
  app.post("/api/bonds", isAuthenticated, async (req, res) => {
    try {
      const bond = await storage.createBond(req.body);
      res.json(bond);
    } catch (error) {
      res.status(400).json({ error: "Invalid bond data" });
    }
  });

  // Get projects for user - PROTECTED
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    // Use authenticated user's ID from session
    const userId = req.user.claims?.sub;
    const projects = await storage.getProjectsByUserId(userId);
    res.json(projects);
  });

  // Get all projects (admin only) - PROTECTED
  app.get("/api/projects/all", isAdmin, async (req, res) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  // Create project - PROTECTED
  app.post("/api/projects", isAuthenticated, async (req, res) => {
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

  // Company settings endpoints
  // Public GET endpoint for displaying on homepage
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings || { companyName: "Quantum Surety", phone: "", email: "", address: "", website: "" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Admin-only endpoints for managing settings
  app.get("/api/admin/settings", isAdmin, async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings || { companyName: "Quantum Surety", phone: "", email: "", address: "", website: "" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/admin/settings", isAdmin, async (req, res) => {
    try {
      const settings = await storage.updateCompanySettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Resource endpoints
  // Public endpoint to get all resources
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Public endpoint to get resources by type
  app.get("/api/resources/type/:type", async (req, res) => {
    try {
      const resources = await storage.getResourcesByType(req.params.type);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Admin endpoint to create a resource
  app.post("/api/admin/resources", isAdmin, async (req, res) => {
    try {
      const resource = await storage.createResource(req.body);
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Failed to create resource" });
    }
  });

  // Admin endpoint to update a resource
  app.patch("/api/admin/resources/:id", isAdmin, async (req, res) => {
    try {
      const resource = await storage.updateResource(req.params.id, req.body);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Failed to update resource" });
    }
  });

  // Admin endpoint to delete a resource
  app.delete("/api/admin/resources/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteResource(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete resource" });
    }
  });

  // Admin endpoint to fetch all resources for management
  app.get("/api/admin/resources", isAdmin, async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Admin setup endpoint - create first admin user
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }

      // Check if any admin user exists
      const allUsers = await storage.getAllUsers();
      const existingAdmins = allUsers.filter((u: any) => u.role === "admin");
      if (existingAdmins.length > 0) {
        return res.status(403).json({ message: "Admin user already exists" });
      }

      // Check if username is taken
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        role: "admin",
      });

      res.json({ 
        success: true, 
        message: "Admin user created successfully",
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error: any) {
      console.error("Admin setup error:", error);
      res.status(500).json({ message: "Failed to create admin user", error: error.message });
    }
  });

  // Admin login endpoint - authenticate with username/password
  app.post("/api/admin/login", async (req: any, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Check if user is admin
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Verify password
      if (!user.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Create session
      req.login({ claims: { sub: user.id }, user }, (err: any) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create session" });
        }

        res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      });
    } catch (error: any) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Failed to log in", error: error.message });
    }
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

      // Create demo resources
      const resources = [
        // Guides
        await storage.createResource({
          type: "guide",
          title: "Construction Bond Guide for General Contractors",
          description: "Complete guide to bid, performance, and payment bonds for GCs",
          category: "Guide",
          downloadable: true,
          order: 0,
        }),
        await storage.createResource({
          type: "guide",
          title: "First-Time Bonding: A Subcontractor's Handbook",
          description: "Step-by-step process for subcontractors getting their first bond",
          category: "Guide",
          downloadable: true,
          order: 1,
        }),
        await storage.createResource({
          type: "guide",
          title: "Understanding Bond Capacity",
          description: "How sureties calculate your bonding capacity and how to increase it",
          category: "Article",
          downloadable: false,
          order: 2,
        }),
        await storage.createResource({
          type: "guide",
          title: "Financial Statement Preparation for Bonding",
          description: "What underwriters look for and how to present your financials",
          category: "Guide",
          downloadable: true,
          order: 3,
        }),
        // Videos
        await storage.createResource({
          type: "video",
          title: "How Surety Bonds Work (5 min)",
          description: "Quick overview of the surety bond process",
          duration: "5:23",
          downloadable: false,
          videoUrl: "https://www.youtube.com/watch?v=example1",
          order: 0,
        }),
        await storage.createResource({
          type: "video",
          title: "Bid Bond vs Performance Bond vs Payment Bond",
          description: "Understanding the three main construction bond types",
          duration: "8:15",
          downloadable: false,
          videoUrl: "https://www.youtube.com/watch?v=example2",
          order: 1,
        }),
        await storage.createResource({
          type: "video",
          title: "Improving Your Bond Capacity",
          description: "Strategies to qualify for larger projects",
          duration: "12:40",
          downloadable: false,
          videoUrl: "https://www.youtube.com/watch?v=example3",
          order: 2,
        }),
      ];

      res.json({ 
        success: true, 
        message: "Database seeded successfully",
        created: {
          user: demoUser.id,
          projects: [project1.id, project2.id],
          bonds: [bond1.id, bond2.id, bond3.id],
          resources: resources.map(r => r.id)
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
