import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quoteFormSchema, insertCarrierSchema } from "@shared/schema";
import { generateAIResponse } from "./openai";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { sendApplicationStatusEmail, sendDocumentUploadNotificationEmail, sendDocumentsCompleteNotificationEmail, sendBondRequestNotification } from "./email";
import bcrypt from "bcryptjs";
import { evaluateRiskModel, generateSyntheticCreditScore } from "./risk-scoring";
import { registerBmc84Routes } from "./routes-bmc84";

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

  // Quote submission endpoint - PROTECTED (requires authentication)
  app.post("/api/quotes", async (req: any, res) => {
    try {
      // Check if user is authenticated (simpler check without strict token validation)
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }

      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }

      const validatedData = quoteFormSchema.parse(req.body);

      const quote = await storage.createQuote({
        userId,
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

      // Notify administrator of new bond request submission
      sendBondRequestNotification({
        applicantName: validatedData.contactName,
        companyName: validatedData.businessName,
        bondType: validatedData.bondType,
        contractValue: validatedData.contractValue,
        contactEmail: validatedData.contactEmail,
        quoteId: quote.id,
      }).catch((err) => console.error("[Email] Bond request notification failed:", err));
      
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
    // Disable caching for this endpoint to ensure fresh data
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    const quotes = await storage.getAllQuotes();
    console.log(`[Routes] Admin fetching all quotes, found ${quotes.length} quotes`);
    res.json(quotes);
  });

  // Get user's quotes - PROTECTED
  app.get("/api/user/quotes", async (req: any, res) => {
    try {
      // Disable caching for this endpoint to ensure fresh data
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");

      // Check if user is authenticated (simpler check without strict token validation)
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const userQuotes = await storage.getQuotesByUserId(userId);
      
      // Enrich quotes with application status
      const applications = await storage.getApplicationsByUserId(userId);
      
      const enrichedQuotes = userQuotes.map((quote) => {
        // First try exact match by preliminaryQuoteId
        let relatedApp = applications.find(app => app.preliminaryQuoteId === quote.id);
        
        // If no exact match, then try by business name (only as fallback)
        if (!relatedApp) {
          relatedApp = applications.find(app =>
            app.companyName && quote.businessName &&
            app.companyName.toLowerCase() === quote.businessName.toLowerCase()
          );
        }
        
        return {
          ...quote,
          applicationStatus: relatedApp?.status || "draft"
        };
      });
      
      res.json(enrichedQuotes);
    } catch (error) {
      console.error("Error fetching user quotes:", error);
      res.status(500).json({ error: "Failed to fetch user quotes" });
    }
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

  // Helper function to auto-seed default resources
  const autoSeedResources = async () => {
    try {
      const existing = await storage.getAllResources();
      if (existing.length > 0) return; // Already seeded

      // Create default resources
      await Promise.all([
        // Guides
        storage.createResource({
          type: "guide",
          title: "Construction Bond Guide for General Contractors",
          description: "Complete guide to bid, performance, and payment bonds for GCs",
          category: "Guide",
          downloadable: true,
          downloadUrl: "https://www.sba.gov/sites/default/files/2022-06/Surety-Bonds-508.pdf",
          order: 0,
        }),
        storage.createResource({
          type: "guide",
          title: "First-Time Bonding: A Subcontractor's Handbook",
          description: "Step-by-step process for subcontractors getting their first bond",
          category: "Guide",
          downloadable: true,
          downloadUrl: "https://www.naic.org/documents/committees/ci/single_docs/22_csc_101_11.pdf",
          order: 1,
        }),
        storage.createResource({
          type: "guide",
          title: "Understanding Bond Capacity",
          description: "How sureties calculate your bonding capacity and how to increase it",
          category: "Article",
          downloadable: false,
          order: 2,
        }),
        storage.createResource({
          type: "guide",
          title: "Financial Statement Preparation for Bonding",
          description: "What underwriters look for and how to present your financials",
          category: "Guide",
          downloadable: true,
          downloadUrl: "https://www.sba.gov/sites/default/files/2022-06/Financial-Statements-508.pdf",
          order: 3,
        }),
        // Videos
        storage.createResource({
          type: "video",
          title: "Introduction to Surety Bonds",
          description: "Learn the basics of surety bonds and how they work in construction",
          duration: "4:32",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
          order: 0,
        }),
        storage.createResource({
          type: "video",
          title: "Performance Bonds Explained",
          description: "Understanding performance bonds and contractor obligations",
          duration: "5:18",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          order: 1,
        }),
        storage.createResource({
          type: "video",
          title: "Building Contractor Financial Health",
          description: "How to strengthen your finances for better bonding capacity",
          duration: "6:45",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          order: 2,
        }),
        // Tools
        storage.createResource({
          type: "tool",
          title: "AI Bond Finder",
          description: "Get instant bond recommendations based on your project",
          link: "/ai-bond-finder",
          downloadable: false,
          order: 0,
        }),
        storage.createResource({
          type: "tool",
          title: "Premium Calculator",
          description: "Estimate your bond premium in seconds",
          link: "/quote",
          downloadable: false,
          order: 1,
        }),
        storage.createResource({
          type: "tool",
          title: "State Requirements Database",
          description: "Bond requirements by state and project type",
          link: "/resources/state-requirements",
          downloadable: false,
          order: 2,
        }),
      ]);
    } catch (error) {
      console.error("Auto-seed resources error:", error);
      // Silently fail - don't disrupt the request
    }
  };

  // Resource endpoints
  // Public endpoint to get all resources
  app.get("/api/resources", async (req, res) => {
    try {
      // Auto-seed on first access if empty
      await autoSeedResources();
      
      let resources = await storage.getAllResources();
      let needsUpdate = false;
      
      // Ensure all three interactive tools exist
      const tools = [
        {
          title: "AI Bond Finder",
          description: "Get instant bond recommendations based on your project",
          link: "/ai-bond-finder",
          order: 0,
        },
        {
          title: "Premium Calculator",
          description: "Estimate your bond premium in seconds",
          link: "/quote",
          order: 1,
        },
        {
          title: "State Requirements Database",
          description: "Bond requirements by state and project type",
          link: "/resources/state-requirements",
          order: 2,
        },
      ];
      
      for (const tool of tools) {
        const exists = resources.find((r: any) => r.title === tool.title);
        if (!exists) {
          await storage.createResource({
            type: "tool",
            ...tool,
            downloadable: false,
          });
          needsUpdate = true;
        } else if (exists.link !== tool.link) {
          // Fix the link if it's wrong
          await storage.updateResource(exists.id, { link: tool.link });
          needsUpdate = true;
        }
      }
      
      // Re-fetch if we made any changes
      if (needsUpdate) {
        resources = await storage.getAllResources();
      }
      
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Public endpoint to get resources by type
  app.get("/api/resources/type/:type", async (req, res) => {
    try {
      // Auto-seed on first access if empty
      await autoSeedResources();
      
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

  // Admin endpoint to fix State Requirements link
  app.post("/api/admin/resources/fix-state-requirements", isAdmin, async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      const stateReqResource = resources.find((r: any) => r.title === "State Requirements Database");
      
      if (!stateReqResource) {
        return res.json({ success: true, message: "State Requirements Database not found" });
      }

      await storage.updateResource(stateReqResource.id, {
        link: "/resources/state-requirements"
      });

      res.json({ success: true, message: "State Requirements link updated successfully" });
    } catch (error: any) {
      console.error("Fix state requirements error:", error);
      res.status(500).json({ error: "Failed to fix link", details: error.message });
    }
  });

  // Admin endpoint to seed default resources
  app.post("/api/admin/resources/seed", isAdmin, async (req, res) => {
    try {
      // Check if resources already exist
      const existingResources = await storage.getAllResources();
      if (existingResources.length > 0) {
        return res.json({ success: true, message: "Resources already exist", count: existingResources.length });
      }

      // Create default resources
      const defaultResources = [
        // Guides
        await storage.createResource({
          type: "guide",
          title: "Construction Bond Guide for General Contractors",
          description: "Complete guide to bid, performance, and payment bonds for GCs",
          category: "Guide",
          downloadable: true,
          downloadUrl: "https://www.sba.gov/sites/default/files/2022-06/Surety-Bonds-508.pdf",
          order: 0,
        }),
        await storage.createResource({
          type: "guide",
          title: "First-Time Bonding: A Subcontractor's Handbook",
          description: "Step-by-step process for subcontractors getting their first bond",
          category: "Guide",
          downloadable: true,
          downloadUrl: "https://www.naic.org/documents/committees/ci/single_docs/22_csc_101_11.pdf",
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
          downloadUrl: "https://www.sba.gov/sites/default/files/2022-06/Financial-Statements-508.pdf",
          order: 3,
        }),
        // Videos
        await storage.createResource({
          type: "video",
          title: "Introduction to Surety Bonds",
          description: "Learn the basics of surety bonds and how they work in construction",
          duration: "4:32",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
          order: 0,
        }),
        await storage.createResource({
          type: "video",
          title: "Performance Bonds Explained",
          description: "Understanding performance bonds and contractor obligations",
          duration: "5:18",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          order: 1,
        }),
        await storage.createResource({
          type: "video",
          title: "Building Contractor Financial Health",
          description: "How to strengthen your finances for better bonding capacity",
          duration: "6:45",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          order: 2,
        }),
        // Tools
        await storage.createResource({
          type: "tool",
          title: "AI Bond Finder",
          description: "Get instant bond recommendations based on your project",
          link: "/ai-bond-finder",
          downloadable: false,
          order: 0,
        }),
        await storage.createResource({
          type: "tool",
          title: "Premium Calculator",
          description: "Estimate your bond premium in seconds",
          link: "/quote",
          downloadable: false,
          order: 1,
        }),
        await storage.createResource({
          type: "tool",
          title: "State Requirements Database",
          description: "Bond requirements by state and project type",
          link: "#",
          downloadable: false,
          order: 2,
        }),
      ];

      res.json({ 
        success: true, 
        message: "Resources seeded successfully",
        count: defaultResources.length
      });
    } catch (error: any) {
      console.error("Seed resources error:", error);
      res.status(500).json({ error: "Failed to seed resources", details: error.message });
    }
  });

  // Carrier management endpoints
  app.get("/api/admin/carriers", isAdmin, async (req, res) => {
    try {
      const allCarriers = await storage.getAllCarriers();
      res.json(allCarriers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch carriers" });
    }
  });

  // Admin endpoint to seed default carriers
  app.post("/api/admin/carriers/seed", isAdmin, async (req, res) => {
    try {
      // Check if carriers already exist
      const existingCarriers = await storage.getAllCarriers();
      if (existingCarriers.length > 0) {
        return res.json({ success: true, message: "Carriers already exist", count: existingCarriers.length });
      }

      // Create default carriers
      const defaultCarriers = [
        await storage.createCarrier({
          name: "RLI Surety",
          website: "https://www.rlicorp.com",
          commissionRate: 15,
          minCreditScore: 650,
          contact: "John Smith",
          email: "john.smith@rli.com",
          phone: "(555) 123-4567",
          notes: "Leading surety carrier. Specializes in construction bonds.",
        }),
        await storage.createCarrier({
          name: "Liberty Surety",
          website: "https://www.libertysurety.com",
          commissionRate: 12,
          minCreditScore: 600,
          contact: "Sarah Johnson",
          email: "sarah@libertysurety.com",
          phone: "(555) 234-5678",
          notes: "Competitive rates on performance and payment bonds.",
        }),
        await storage.createCarrier({
          name: "Travelers Surety",
          website: "https://www.travelers.com",
          commissionRate: 18,
          minCreditScore: 700,
          contact: "Mike Davis",
          email: "mike.davis@travelers.com",
          phone: "(555) 345-6789",
          notes: "Premium carrier with strict underwriting standards.",
        }),
        await storage.createCarrier({
          name: "American Surety",
          website: "https://www.americansurety.com",
          commissionRate: 14,
          minCreditScore: 620,
          contact: "Lisa Chen",
          email: "lisa.chen@americansurety.com",
          phone: "(555) 456-7890",
          notes: "Good capacity for highway and bridge projects.",
        }),
        await storage.createCarrier({
          name: "Hartford Surety",
          website: "https://www.thehartford.com",
          commissionRate: 16,
          minCreditScore: 680,
          contact: "Robert Martinez",
          email: "robert@hartsurety.com",
          phone: "(555) 567-8901",
          notes: "Fast approvals on bid bonds. Experience with small contractors.",
        }),
      ];

      res.json({
        success: true,
        message: "Carriers seeded successfully",
        count: defaultCarriers.length
      });
    } catch (error: any) {
      console.error("Seed carriers error:", error);
      res.status(500).json({ error: "Failed to seed carriers", details: error.message });
    }
  });

  app.post("/api/admin/carriers", isAdmin, async (req, res) => {
    try {
      const carrier = await storage.createCarrier(req.body);
      res.json(carrier);
    } catch (error) {
      res.status(500).json({ error: "Failed to create carrier" });
    }
  });

  app.patch("/api/admin/carriers/:id", isAdmin, async (req, res) => {
    try {
      // Validate and parse the input
      const validatedData = insertCarrierSchema.partial().parse(req.body);
      const carrier = await storage.updateCarrier(req.params.id, validatedData);
      if (!carrier) {
        return res.status(404).json({ error: "Carrier not found" });
      }
      res.json(carrier);
    } catch (error: any) {
      console.error("Error updating carrier:", error);
      res.status(400).json({ error: "Failed to update carrier", details: error.message });
    }
  });

  app.delete("/api/admin/carriers/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteCarrier(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Carrier not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete carrier" });
    }
  });

  // Carrier Rules endpoints
  app.get("/api/admin/carriers/:carrierId/rules", isAdmin, async (req, res) => {
    try {
      const rules = await storage.getCarrierRules(req.params.carrierId);
      res.json(rules || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/carriers/:carrierId/rules", isAdmin, async (req, res) => {
    try {
      const rules = await storage.createCarrierRules({
        carrierId: req.params.carrierId,
        ...req.body,
      });
      res.json(rules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/carriers/:carrierId/rules", isAdmin, async (req, res) => {
    try {
      const rules = await storage.updateCarrierRules(req.params.carrierId, req.body);
      res.json(rules || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Carrier Capacity endpoints
  app.get("/api/admin/carriers/:carrierId/capacity/:year", isAdmin, async (req, res) => {
    try {
      const capacity = await storage.getCarrierCapacity(req.params.carrierId, parseInt(req.params.year));
      res.json(capacity || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/carriers/:carrierId/capacity", isAdmin, async (req, res) => {
    try {
      const capacity = await storage.createOrUpdateCapacity({
        carrierId: req.params.carrierId,
        ...req.body,
      });
      res.json(capacity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Carrier Metrics endpoints
  app.get("/api/admin/carriers/:carrierId/metrics", isAdmin, async (req, res) => {
    try {
      const metrics = await storage.getCarrierMetrics(req.params.carrierId);
      res.json(metrics || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/carriers/:carrierId/metrics", isAdmin, async (req, res) => {
    try {
      const metrics = await storage.updateCarrierMetrics(req.params.carrierId, req.body);
      res.json(metrics || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Quote recommendation endpoint
  app.post("/api/quotes/recommend-carriers", async (req, res) => {
    try {
      const quote = req.body as any;
      const recommended = await storage.recommendCarriers(quote);
      res.json(recommended);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  // Logout endpoint - destroy session
  app.post("/api/auth/logout", (req: any, res) => {
    req.logout((err: any) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
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
          downloadUrl: "https://www.sba.gov/sites/default/files/2022-06/Surety-Bonds-508.pdf",
          order: 0,
        }),
        await storage.createResource({
          type: "guide",
          title: "First-Time Bonding: A Subcontractor's Handbook",
          description: "Step-by-step process for subcontractors getting their first bond",
          category: "Guide",
          downloadable: true,
          downloadUrl: "https://www.naic.org/documents/committees/ci/single_docs/22_csc_101_11.pdf",
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
          downloadUrl: "https://www.sba.gov/sites/default/files/2022-06/Financial-Statements-508.pdf",
          order: 3,
        }),
        // Videos
        await storage.createResource({
          type: "video",
          title: "Introduction to Surety Bonds",
          description: "Learn the basics of surety bonds and how they work in construction",
          duration: "4:32",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
          order: 0,
        }),
        await storage.createResource({
          type: "video",
          title: "Performance Bonds Explained",
          description: "Understanding performance bonds and contractor obligations",
          duration: "5:18",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          order: 1,
        }),
        await storage.createResource({
          type: "video",
          title: "Building Contractor Financial Health",
          description: "How to strengthen your finances for better bonding capacity",
          duration: "6:45",
          downloadable: false,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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

  // Surety Application Portal endpoints
  
  // Create new application
  app.post("/api/applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub;
      const { companyName, contactName, contactEmail, contactPhone, businessType, yearsInBusiness, annualRevenue } = req.body;

      const app = await storage.createApplication({
        userId,
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        businessType,
        yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : 0,
        annualRevenue: annualRevenue ? annualRevenue.toString() : null,
        status: "draft",
      });

      res.json({ success: true, application: app });
    } catch (error: any) {
      res.status(400).json({ error: "Failed to create application" });
    }
  });

  // Get user's applications
  app.get("/api/applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub;
      const apps = await storage.getApplicationsByUserId(userId);
      res.json(apps);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Get specific application
  app.get("/api/applications/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      let application = await storage.getApplication(req.params.id);
      
      // If not found by ID, try to find by quote ID (preliminaryQuoteId)
      if (!application) {
        const userApps = await storage.getApplicationsByUserId(userId);
        application = userApps.find(app => app.preliminaryQuoteId === req.params.id);
      }
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const documents = await storage.getApplicationDocuments(application.id);
      const creditPull = await storage.getLatestCreditPull(application.id);

      res.json({ application, documents, creditPull });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // Upload document
  app.post("/api/applications/:id/documents", isAuthenticated, async (req: any, res) => {
    try {
      const { documentType, fileName, fileUrl, fileSize, mimeType } = req.body;
      const userId = req.user?.claims?.sub;
      const quoteId = req.params.id;  // Save the quote ID
      let applicationId = quoteId;
      
      // Try to get the application
      let application = await storage.getApplication(applicationId);
      
      // If application doesn't exist, try to find one by preliminaryQuoteId or create one
      if (!application) {
        const quote = await storage.getQuote(quoteId);
        if (quote) {
          // Try to find an application linked to this quote
          const userApps = await storage.getApplicationsByUserId(userId);
          application = userApps.find(app => app.preliminaryQuoteId === quoteId);
          
          if (!application && quote.businessName) {
            // Create a new application from the quote
            application = await storage.createApplication({
              userId,
              companyName: quote.businessName,
              contactName: quote.contactName || "",
              contactEmail: quote.contactEmail || "",
              contactPhone: quote.contactPhone || "",
              businessType: "contractor",
              yearsInBusiness: 0,
              annualRevenue: null,
              status: "draft",
            });
            
            // Link the quote to the application
            if (application) {
              await storage.updateApplication(application.id, {
                preliminaryQuoteId: quoteId,
                preliminaryPremium: quote.estimatedPremium || "0",
              });
            }
          } else if (application) {
            applicationId = application.id;
          }
        }
      }

      if (!application) {
        return res.status(404).json({ error: "Application not found and could not be created" });
      }

      const doc = await storage.addDocument({
        applicationId: application.id,
        documentType,
        fileName,
        fileUrl,
        fileSize,
        mimeType,
        validationStatus: "pending",
      });

      // Validate document type exists
      const requiredDocs = ["bond_request", "contract", "financials", "credit_auth", "resume", "job_breakdown", "prior_bonds", "work_schedule"];
      if (!requiredDocs.includes(documentType)) {
        await storage.updateDocumentValidation(doc.id, "invalid", ["Invalid document type"]);
        return res.status(400).json({ error: "Invalid document type" });
      }

      await storage.updateDocumentValidation(doc.id, "valid");

      // Get all admin users and notify them
      const adminUsers = await storage.getAdminUsers();
      console.log(`[Routes] Found ${adminUsers.length} admin users to notify`);
      
      for (const admin of adminUsers) {
        if (admin.email) {
          // Send email notification to admin
          await sendDocumentUploadNotificationEmail(
            admin.email,
            application.companyName,
            application.applicationNumber,
            documentType,
            `${process.env.APP_URL || "http://localhost:5000"}/admin`
          );
          
          // Create email notification record
          await storage.createEmailNotification({
            userId: admin.id,
            applicationId: application.id,
            type: "document_uploaded",
            subject: `Document Upload: ${application.applicationNumber}`,
            content: `New document uploaded: ${documentType}`,
            recipientEmail: admin.email,
            status: "sent",
            sentAt: new Date(),
          });
        }
      }

      // Check if all required documents are now uploaded
      const allDocuments = await storage.getApplicationDocuments(application.id);
      const uploadedDocTypes = allDocuments
        .filter(d => d.validationStatus === "valid")
        .map(d => d.documentType);
      const requiredDocTypes = ["bond_request", "contract", "financials", "credit_auth"];
      const missingDocs = requiredDocTypes.filter(d => !uploadedDocTypes.includes(d));

      // If all required documents are uploaded, notify admins to proceed with underwriting
      if (missingDocs.length === 0) {
        console.log(`[Routes] All required documents uploaded for application ${application.id}`);
        
        for (const admin of adminUsers) {
          if (admin.email) {
            await sendDocumentsCompleteNotificationEmail(
              admin.email,
              application.companyName,
              application.applicationNumber,
              `${process.env.APP_URL || "http://localhost:5000"}/admin`
            );
          }
        }

        // Update the application status to indicate documents are complete
        await storage.updateApplication(application.id, {
          status: "documents_complete",
        });
      }

      res.json({ 
        success: true, 
        document: doc, 
        documentsComplete: missingDocs.length === 0,
        applicationId: application.id 
      });
    } catch (error: any) {
      console.error("[Routes] Document upload error:", error);
      res.status(400).json({ error: "Failed to upload document" });
    }
  });

  // Get application documents
  app.get("/api/applications/:id/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      let applicationId = req.params.id;
      
      // If ID is a quote ID, find the associated application
      const application = await storage.getApplication(applicationId);
      if (!application) {
        const userApps = await storage.getApplicationsByUserId(userId);
        const foundApp = userApps.find(app => app.preliminaryQuoteId === applicationId);
        if (foundApp) {
          applicationId = foundApp.id;
        }
      }
      
      const docs = await storage.getApplicationDocuments(applicationId);
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Evaluate application (run underwriting rules)
  app.post("/api/applications/:id/evaluate", isAuthenticated, async (req: any, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const docs = await storage.getApplicationDocuments(req.params.id);
      const bureauScore = application.creditScore ?? generateSyntheticCreditScore(application);
      const assessment = evaluateRiskModel({ ...application, creditScore: bureauScore }, docs);

      const latestCreditPull = await storage.getLatestCreditPull(req.params.id);
      if (!latestCreditPull) {
        await storage.createCreditPull({
          applicationId: req.params.id,
          provider: "internal_model",
          externalId: `MODEL-${Date.now()}`,
          creditScore: bureauScore,
          debtToIncomeRatio: bureauScore >= 700 ? "0.28" : bureauScore >= 650 ? "0.37" : "0.49",
          businessRating: Math.round(assessment.score),
          riskLevel: assessment.riskLevel,
          details: assessment as any,
          pulledAt: new Date(),
        });
      }

      const status = assessment.missingDocuments.length === 0 ? "submitted" : "draft";
      const underwritingStatus = assessment.recommendedStatus === "rejected"
        ? "rejected"
        : assessment.recommendedStatus === "approved"
          ? "approved"
          : "in_review";

      const updated = await storage.updateApplication(req.params.id, {
        creditScore: bureauScore,
        creditPullStatus: "completed",
        creditPullData: {
          provider: "internal_model",
          bureauScore,
          refreshedAt: new Date().toISOString(),
        } as any,
        underwritingStatus,
        ruleValidationResults: assessment as any,
        missingDocuments: assessment.missingDocuments,
        status,
      });

      res.json({ 
        success: true, 
        application: updated,
        evaluation: assessment,
      });
    } catch (error: any) {
      console.error("[Routes] Evaluation failed", error);
      res.status(500).json({ error: "Evaluation failed" });
    }
  });

  // Generate preliminary quote
  app.post("/api/applications/:id/quote", isAuthenticated, async (req: any, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const docs = await storage.getApplicationDocuments(req.params.id);
      const assessment = evaluateRiskModel({
        ...application,
        creditScore: application.creditScore ?? generateSyntheticCreditScore(application),
      }, docs);

      const bondAmount = assessment.estimatedBondCapacity;
      const preliminaryPremium = (bondAmount * assessment.recommendedPremiumRate).toFixed(2);

      const quote = await storage.createQuote({
        bondType: "Performance Bond",
        contractValue: bondAmount.toString(),
        businessName: application.companyName,
        contactName: application.contactName,
        contactEmail: application.contactEmail,
        contactPhone: application.contactPhone,
        businessType: application.businessType,
        yearsInBusiness: application.yearsInBusiness,
        annualRevenue: application.annualRevenue?.toString(),
        creditScore: application.creditScore?.toString(),
        projectName: `${application.companyName} Project`,
        projectState: "IL",
      });

      await storage.updateApplication(req.params.id, {
        preliminaryQuoteId: quote.id,
        preliminaryPremium: preliminaryPremium as any,
      });

      res.json({ 
        success: true, 
        quote,
        preliminaryPremium,
        premiumRate: assessment.recommendedPremiumRate,
        estimatedBondCapacity: assessment.estimatedBondCapacity,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to generate quote" });
    }
  });

  // Initiate sign agreement workflow
  app.post("/api/applications/:id/sign", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      let applicationId = req.params.id;
      
      // Try to get the application
      let application = await storage.getApplication(applicationId);
      
      // If not found by ID, try to find by quote ID (preliminaryQuoteId)
      if (!application) {
        const userApps = await storage.getApplicationsByUserId(userId);
        application = userApps.find(app => app.preliminaryQuoteId === applicationId);
        if (application) {
          applicationId = application.id;
        }
      }
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Update status to sign_agreement_pending
      const updated = await storage.updateApplication(applicationId, {
        status: "sign_agreement_pending",
      });

      res.json({
        success: true,
        application: updated,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to initiate signing" });
    }
  });

  // Complete sign agreement workflow
  app.post("/api/applications/:id/sign/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      let applicationId = req.params.id;
      
      // Try to get the application
      let application = await storage.getApplication(applicationId);
      
      // If not found by ID, try to find by quote ID (preliminaryQuoteId)
      if (!application) {
        const userApps = await storage.getApplicationsByUserId(userId);
        application = userApps.find(app => app.preliminaryQuoteId === applicationId);
        if (application) {
          applicationId = application.id;
        }
      }
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Update status to agreement_signed
      const updated = await storage.updateApplication(applicationId, {
        status: "agreement_signed",
      });

      // Notify admins that user has signed
      const adminUsers = await storage.getAdminUsers();
      for (const admin of adminUsers) {
        if (admin.email) {
          await sendApplicationStatusEmail(
            admin.email,
            application.applicationNumber,
            "agreement_signed",
            `${application.companyName} has signed the agreement. Review it here: ${process.env.APP_URL || "http://localhost:5000"}/admin`
          );
        }
      }

      res.json({
        success: true,
        application: updated,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to complete signing" });
    }
  });

  // Prepare for e-signature
  app.post("/api/applications/:id/e-sign", isAuthenticated, async (req: any, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Simulate creating DocuSign envelope
      const envelopeId = `ENV-${Date.now()}`;

      const updated = await storage.updateApplication(req.params.id, {
        eSignatureStatus: "sent",
        eSignatureDocumentId: envelopeId,
      });

      res.json({
        success: true,
        eSignatureDocumentId: envelopeId,
        application: updated,
        signatureLink: `/sign/${envelopeId}`,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to prepare e-signature" });
    }
  });

  // Analytics endpoints
  app.get("/api/admin/analytics", isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getAnalyticsSnapshot();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Admin user management
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const admins = await storage.getAdminUsers();
      res.json(admins);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch admin users" });
    }
  });

  app.post("/api/admin/users", isAdmin, async (req: any, res) => {
    try {
      const { email, firstName, lastName, username, password, role, permission } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({ error: "Email, username, and password are required" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new admin user
      const newUser = await storage.createUser({
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        username,
        password: hashedPassword,
        role: role || "admin",
        permission: permission || "view",
      });
      
      // Update user role and permission
      const updatedUser = await storage.updateUserRole(newUser.id, role || "admin", permission || "view");
      res.status(201).json(updatedUser);
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  app.patch("/api/admin/users/:userId/role", isAdmin, async (req: any, res) => {
    try {
      const { role, permission } = req.body;
      if (!role || !permission) {
        return res.status(400).json({ error: "Role and permission are required" });
      }
      const updated = await storage.updateUserRole(req.params.userId, role, permission);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  app.patch("/api/admin/users/:userId", isAdmin, async (req: any, res) => {
    try {
      const { email, firstName, lastName, username } = req.body;
      const updated = await storage.updateUser(req.params.userId, {
        email,
        firstName,
        lastName,
        username,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:userId", isAdmin, async (req: any, res) => {
    try {
      const deleted = await storage.deleteUser(req.params.userId);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.post("/api/admin/users/:userId/change-password", isAdmin, async (req: any, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await storage.changeUserPassword(req.params.userId, hashedPassword);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Register BMC-84 routes
  registerBmc84Routes(app);

  const httpServer = createServer(app);
  return httpServer;
}
