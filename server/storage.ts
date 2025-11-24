import { 
  type User, 
  type InsertUser,
  type UpsertUser,
  type Quote,
  type InsertQuote,
  type Bond,
  type InsertBond,
  type Project,
  type InsertProject,
  type ChatMessage,
  type InsertChatMessage,
  type CompanySettings,
  type InsertCompanySettings,
  type Resource,
  type InsertResource,
  type Carrier,
  type InsertCarrier,
  type QuoteCarrier,
  type InsertQuoteCarrier,
  type CarrierRules,
  type InsertCarrierRules,
  type CarrierCapacity,
  type InsertCarrierCapacity,
  type CarrierMetrics,
  type InsertCarrierMetrics,
  type SuretyApplication,
  type InsertSuretyApplication,
  type ApplicationDocument,
  type InsertApplicationDocument,
  type CreditPull,
  type InsertCreditPull,
  users,
  quotes,
  bonds,
  projects,
  chatMessages,
  companySettings,
  resources,
  carriers,
  quoteCarriers,
  carrierRules,
  carrierCapacity,
  carrierMetrics,
  suretyApplications,
  applicationDocuments,
  creditPulls
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import ws from "ws";

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

export interface IStorage {
  // User methods (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Legacy user methods
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: string): Promise<Quote | undefined>;
  updateQuote(id: string, data: Partial<InsertQuote>): Promise<Quote | undefined>;
  deleteQuote(id: string): Promise<boolean>;

  // Bond methods
  createBond(bond: InsertBond): Promise<Bond>;
  getBond(id: string): Promise<Bond | undefined>;
  getBondsByUserId(userId: string): Promise<Bond[]>;
  getAllBonds(): Promise<Bond[]>;

  // Project methods
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;

  // Chat message methods
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;

  // Company settings methods
  getCompanySettings(): Promise<CompanySettings | undefined>;
  updateCompanySettings(data: Partial<InsertCompanySettings>): Promise<CompanySettings>;

  // Resource methods
  createResource(resource: InsertResource): Promise<Resource>;
  getResource(id: string): Promise<Resource | undefined>;
  getResourcesByType(type: string): Promise<Resource[]>;
  getAllResources(): Promise<Resource[]>;
  updateResource(id: string, data: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;

  // Carrier methods
  createCarrier(carrier: InsertCarrier): Promise<Carrier>;
  getCarrier(id: string): Promise<Carrier | undefined>;
  getAllCarriers(): Promise<Carrier[]>;
  updateCarrier(id: string, data: Partial<InsertCarrier>): Promise<Carrier | undefined>;
  deleteCarrier(id: string): Promise<boolean>;

  // Quote-Carrier methods
  createQuoteCarrier(quoteCarrier: InsertQuoteCarrier): Promise<QuoteCarrier>;
  getQuoteCarriers(quoteId: string): Promise<QuoteCarrier[]>;
  updateQuoteCarrier(id: string, data: Partial<InsertQuoteCarrier>): Promise<QuoteCarrier | undefined>;

  // Carrier Rules methods
  createCarrierRules(rules: InsertCarrierRules): Promise<CarrierRules>;
  getCarrierRules(carrierId: string): Promise<CarrierRules | undefined>;
  updateCarrierRules(carrierId: string, rules: Partial<InsertCarrierRules>): Promise<CarrierRules | undefined>;

  // Carrier Capacity methods
  getCarrierCapacity(carrierId: string, year: number): Promise<CarrierCapacity | undefined>;
  createOrUpdateCapacity(capacity: InsertCarrierCapacity): Promise<CarrierCapacity>;

  // Carrier Metrics methods
  getCarrierMetrics(carrierId: string): Promise<CarrierMetrics | undefined>;
  updateCarrierMetrics(carrierId: string, metrics: Partial<InsertCarrierMetrics>): Promise<CarrierMetrics | undefined>;

  // Auto-routing/recommendation
  recommendCarriers(quote: Quote): Promise<Carrier[]>;

  // Surety Application methods
  createApplication(app: InsertSuretyApplication): Promise<SuretyApplication>;
  getApplication(id: string): Promise<SuretyApplication | undefined>;
  getApplicationsByUserId(userId: string): Promise<SuretyApplication[]>;
  updateApplication(id: string, data: Partial<InsertSuretyApplication>): Promise<SuretyApplication | undefined>;

  // Application Document methods
  addDocument(doc: InsertApplicationDocument): Promise<ApplicationDocument>;
  getApplicationDocuments(applicationId: string): Promise<ApplicationDocument[]>;
  updateDocumentValidation(docId: string, validationStatus: string, errors?: string[]): Promise<ApplicationDocument | undefined>;

  // Credit Pull methods
  createCreditPull(pull: InsertCreditPull): Promise<CreditPull>;
  getLatestCreditPull(applicationId: string): Promise<CreditPull | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quotes: Map<string, Quote>;
  private bonds: Map<string, Bond>;
  private projects: Map<string, Project>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.bonds = new Map();
    this.projects = new Map();
    this.chatMessages = new Map();
    this.seedData();
  }

  private seedData() {
    const demoUser: User = {
      id: "user-1",
      username: "demo",
      password: "demo123",
      email: "john@abcconstruction.com",
      companyName: "ABC Construction LLC",
      role: "client",
    };
    this.users.set(demoUser.id, demoUser);

    const demoProjects: Project[] = [
      {
        id: "proj-1",
        userId: "user-1",
        name: "City Hall Renovation",
        description: "Complete renovation of municipal building",
        contractValue: "500000",
        state: "IL",
        status: "active",
        startDate: new Date("2023-06-15"),
        completionDate: new Date("2024-12-31"),
        obligee: "City of Springfield",
        bondIds: ["bond-1", "bond-2"],
        createdAt: new Date("2023-06-01"),
      },
      {
        id: "proj-2",
        userId: "user-1",
        name: "Highway Bridge Project",
        description: "Bridge construction and road improvements",
        contractValue: "750000",
        state: "IL",
        status: "active",
        startDate: new Date("2023-09-01"),
        completionDate: new Date("2024-08-15"),
        obligee: "State DOT",
        bondIds: ["bond-3"],
        createdAt: new Date("2023-08-15"),
      },
    ];

    demoProjects.forEach(p => this.projects.set(p.id, p));

    const demoBonds: Bond[] = [
      {
        id: "bond-1",
        userId: "user-1",
        quoteId: null,
        bondType: "Performance Bond",
        penal_sum: "500000",
        premium: "7500",
        effectiveDate: new Date("2023-06-15"),
        expirationDate: new Date("2024-12-31"),
        status: "active",
        bondNumber: "QS-2023-4892",
        projectName: "City Hall Renovation",
        obligee: "City of Springfield",
        createdAt: new Date("2023-06-15"),
      },
      {
        id: "bond-2",
        userId: "user-1",
        quoteId: null,
        bondType: "Payment Bond",
        penal_sum: "500000",
        premium: "7500",
        effectiveDate: new Date("2023-06-15"),
        expirationDate: new Date("2024-12-31"),
        status: "active",
        bondNumber: "QS-2023-4893",
        projectName: "City Hall Renovation",
        obligee: "City of Springfield",
        createdAt: new Date("2023-06-15"),
      },
      {
        id: "bond-3",
        userId: "user-1",
        quoteId: null,
        bondType: "Performance Bond",
        penal_sum: "750000",
        premium: "11250",
        effectiveDate: new Date("2023-09-01"),
        expirationDate: new Date("2024-08-15"),
        status: "active",
        bondNumber: "QS-2023-5103",
        projectName: "Highway Bridge Project",
        obligee: "State DOT",
        createdAt: new Date("2023-09-01"),
      },
    ];

    demoBonds.forEach(b => this.bonds.set(b.id, b));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user = this.users.get(userData.id);
    if (user) {
      // Update existing user
      const updated = {
        ...user,
        email: userData.email ?? user.email,
        firstName: userData.firstName ?? user.firstName,
        lastName: userData.lastName ?? user.lastName,
        profileImageUrl: userData.profileImageUrl ?? user.profileImageUrl,
      };
      this.users.set(userData.id, updated);
      return updated;
    } else {
      // Create new user
      const newUser: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        username: null,
        password: null,
        companyName: null,
        role: "client",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }

  // Quote methods
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = `QS-${Date.now()}`;
    const quote: Quote = {
      ...insertQuote,
      id,
      status: "pending",
      estimatedPremium: this.calculatePremium(insertQuote.contractValue || "0"),
      createdAt: new Date(),
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async updateQuoteStatus(id: string, status: string): Promise<Quote | undefined> {
    const quote = this.quotes.get(id);
    if (quote) {
      quote.status = status;
      this.quotes.set(id, quote);
      return quote;
    }
    return undefined;
  }

  async updateQuote(id: string, data: Partial<InsertQuote>): Promise<Quote | undefined> {
    const quote = this.quotes.get(id);
    if (quote) {
      const updated = { ...quote, ...data };
      this.quotes.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteQuote(id: string): Promise<boolean> {
    return this.quotes.delete(id);
  }

  // Bond methods
  async createBond(insertBond: InsertBond): Promise<Bond> {
    const id = randomUUID();
    const bond: Bond = {
      ...insertBond,
      id,
      createdAt: new Date(),
    };
    this.bonds.set(id, bond);
    return bond;
  }

  async getBond(id: string): Promise<Bond | undefined> {
    return this.bonds.get(id);
  }

  async getBondsByUserId(userId: string): Promise<Bond[]> {
    return Array.from(this.bonds.values()).filter(b => b.userId === userId);
  }

  async getAllBonds(): Promise<Bond[]> {
    return Array.from(this.bonds.values());
  }

  // Project methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  // Chat message methods
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(m => m.sessionId === sessionId);
  }

  // Company settings methods
  private companySettings: CompanySettings = {
    id: "default",
    companyName: "Quantum Surety",
    phone: "",
    email: "",
    address: "",
    website: "",
    updatedAt: new Date(),
  };

  async getCompanySettings(): Promise<CompanySettings> {
    return this.companySettings;
  }

  async updateCompanySettings(data: Partial<InsertCompanySettings>): Promise<CompanySettings> {
    this.companySettings = {
      ...this.companySettings,
      ...data,
      updatedAt: new Date(),
    };
    return this.companySettings;
  }

  // Resource methods
  private resourcesMap: Map<string, Resource> = new Map();

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const newResource: Resource = {
      ...resource,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Resource;
    this.resourcesMap.set(id, newResource);
    return newResource;
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resourcesMap.get(id);
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return Array.from(this.resourcesMap.values())
      .filter(r => r.type === type && r.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resourcesMap.values())
      .filter(r => r.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async updateResource(id: string, data: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resourcesMap.get(id);
    if (resource) {
      const updated = { ...resource, ...data, updatedAt: new Date() };
      this.resourcesMap.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteResource(id: string): Promise<boolean> {
    return this.resourcesMap.delete(id);
  }

  // Carrier methods
  private carriersMap: Map<string, Carrier> = new Map();

  async createCarrier(carrier: InsertCarrier): Promise<Carrier> {
    const id = randomUUID();
    const newCarrier: Carrier = { ...carrier, id, createdAt: new Date(), updatedAt: new Date() } as Carrier;
    this.carriersMap.set(id, newCarrier);
    return newCarrier;
  }

  async getCarrier(id: string): Promise<Carrier | undefined> {
    return this.carriersMap.get(id);
  }

  async getAllCarriers(): Promise<Carrier[]> {
    return Array.from(this.carriersMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateCarrier(id: string, data: Partial<InsertCarrier>): Promise<Carrier | undefined> {
    const carrier = this.carriersMap.get(id);
    if (carrier) {
      const updated = { ...carrier, ...data, updatedAt: new Date() };
      this.carriersMap.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteCarrier(id: string): Promise<boolean> {
    return this.carriersMap.delete(id);
  }

  // Quote-Carrier methods
  private quoteCarriersMap: Map<string, QuoteCarrier> = new Map();

  async createQuoteCarrier(quoteCarrier: InsertQuoteCarrier): Promise<QuoteCarrier> {
    const id = randomUUID();
    const newQC: QuoteCarrier = { ...quoteCarrier, id, createdAt: new Date() } as QuoteCarrier;
    this.quoteCarriersMap.set(id, newQC);
    return newQC;
  }

  async getQuoteCarriers(quoteId: string): Promise<QuoteCarrier[]> {
    return Array.from(this.quoteCarriersMap.values()).filter(qc => qc.quoteId === quoteId);
  }

  async updateQuoteCarrier(id: string, data: Partial<InsertQuoteCarrier>): Promise<QuoteCarrier | undefined> {
    const qc = this.quoteCarriersMap.get(id);
    if (qc) {
      const updated = { ...qc, ...data };
      this.quoteCarriersMap.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Carrier Rules methods
  private carrierRulesMap: Map<string, CarrierRules> = new Map();

  async createCarrierRules(rules: InsertCarrierRules): Promise<CarrierRules> {
    const id = randomUUID();
    const newRules: CarrierRules = { ...rules, id, createdAt: new Date() } as CarrierRules;
    this.carrierRulesMap.set(id, newRules);
    return newRules;
  }

  async getCarrierRules(carrierId: string): Promise<CarrierRules | undefined> {
    return Array.from(this.carrierRulesMap.values()).find(r => r.carrierId === carrierId);
  }

  async updateCarrierRules(carrierId: string, rules: Partial<InsertCarrierRules>): Promise<CarrierRules | undefined> {
    const existing = await this.getCarrierRules(carrierId);
    if (existing) {
      const updated = { ...existing, ...rules };
      this.carrierRulesMap.set(existing.id, updated);
      return updated;
    }
    return undefined;
  }

  // Carrier Capacity methods
  private carrierCapacityMap: Map<string, CarrierCapacity> = new Map();

  async getCarrierCapacity(carrierId: string, year: number): Promise<CarrierCapacity | undefined> {
    return Array.from(this.carrierCapacityMap.values()).find(
      c => c.carrierId === carrierId && c.capacityYear === year
    );
  }

  async createOrUpdateCapacity(capacity: InsertCarrierCapacity): Promise<CarrierCapacity> {
    const existing = await this.getCarrierCapacity(capacity.carrierId, capacity.capacityYear);
    if (existing) {
      const updated = { ...existing, ...capacity };
      this.carrierCapacityMap.set(existing.id, updated);
      return updated;
    }
    const id = randomUUID();
    const newCapacity: CarrierCapacity = { ...capacity, id, createdAt: new Date() } as CarrierCapacity;
    this.carrierCapacityMap.set(id, newCapacity);
    return newCapacity;
  }

  // Carrier Metrics methods
  private carrierMetricsMap: Map<string, CarrierMetrics> = new Map();

  async getCarrierMetrics(carrierId: string): Promise<CarrierMetrics | undefined> {
    return Array.from(this.carrierMetricsMap.values()).find(m => m.carrierId === carrierId);
  }

  async updateCarrierMetrics(carrierId: string, metrics: Partial<InsertCarrierMetrics>): Promise<CarrierMetrics | undefined> {
    const existing = await this.getCarrierMetrics(carrierId);
    if (existing) {
      const updated = { ...existing, ...metrics };
      this.carrierMetricsMap.set(existing.id, updated);
      return updated;
    }
    const id = randomUUID();
    const newMetrics: CarrierMetrics = { carrierId, ...metrics, id, createdAt: new Date() } as CarrierMetrics;
    this.carrierMetricsMap.set(id, newMetrics);
    return newMetrics;
  }

  // Auto-routing recommendation
  async recommendCarriers(quote: Quote): Promise<Carrier[]> {
    const contractValue = parseFloat(quote.contractValue || "0");
    const creditScore = parseInt(quote.creditScore || "600");
    const yearsInBusiness = quote.yearsInBusiness || 0;
    const revenue = parseFloat(quote.annualRevenue || "0");
    
    const allCarriers = await this.getAllCarriers();
    const recommended: Carrier[] = [];

    for (const carrier of allCarriers) {
      if (!carrier.active) continue;

      const rules = await this.getCarrierRules(carrier.id);
      if (!rules) continue;

      // Check bond type
      if (rules.acceptedBondTypes && !rules.acceptedBondTypes.includes(quote.bondType)) continue;

      // Check credit score
      if (creditScore < (rules.minCreditScore || 600)) continue;

      // Check years in business
      if (yearsInBusiness < (rules.minYearsInBusiness || 0)) continue;

      // Check revenue requirement
      if (rules.minAnnualRevenue && revenue < parseFloat(rules.minAnnualRevenue.toString())) continue;

      // Check contract value limits
      if (rules.minContractValue && contractValue < parseFloat(rules.minContractValue.toString())) continue;
      if (rules.maxContractValue && contractValue > parseFloat(rules.maxContractValue.toString())) continue;

      // Check capacity
      const year = new Date().getFullYear();
      const capacity = await this.getCarrierCapacity(carrier.id, year);
      if (capacity && capacity.usedCapacity && capacity.annualCapacityLimit) {
        const available = parseFloat(capacity.annualCapacityLimit.toString()) - parseFloat(capacity.usedCapacity.toString());
        if (contractValue > available) continue;
      }

      recommended.push(carrier);
    }

    return recommended;
  }

  // Surety Application methods
  private applicationsMap: Map<string, SuretyApplication> = new Map();

  async createApplication(app: InsertSuretyApplication): Promise<SuretyApplication> {
    const id = randomUUID();
    const appNum = `APP-${Date.now()}`;
    const newApp: SuretyApplication = {
      ...app,
      id,
      applicationNumber: appNum,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SuretyApplication;
    this.applicationsMap.set(id, newApp);
    return newApp;
  }

  async getApplication(id: string): Promise<SuretyApplication | undefined> {
    return this.applicationsMap.get(id);
  }

  async getApplicationsByUserId(userId: string): Promise<SuretyApplication[]> {
    return Array.from(this.applicationsMap.values()).filter(app => app.userId === userId);
  }

  async updateApplication(id: string, data: Partial<InsertSuretyApplication>): Promise<SuretyApplication | undefined> {
    const app = this.applicationsMap.get(id);
    if (app) {
      const updated = { ...app, ...data, updatedAt: new Date() };
      this.applicationsMap.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Application Document methods
  private documentsMap: Map<string, ApplicationDocument> = new Map();

  async addDocument(doc: InsertApplicationDocument): Promise<ApplicationDocument> {
    const id = randomUUID();
    const newDoc: ApplicationDocument = { ...doc, id, createdAt: new Date(), updatedAt: new Date() } as ApplicationDocument;
    this.documentsMap.set(id, newDoc);
    return newDoc;
  }

  async getApplicationDocuments(applicationId: string): Promise<ApplicationDocument[]> {
    return Array.from(this.documentsMap.values()).filter(d => d.applicationId === applicationId);
  }

  async updateDocumentValidation(docId: string, validationStatus: string, errors?: string[]): Promise<ApplicationDocument | undefined> {
    const doc = this.documentsMap.get(docId);
    if (doc) {
      const updated = { ...doc, validationStatus, validationErrors: errors || [] };
      this.documentsMap.set(docId, updated);
      return updated;
    }
    return undefined;
  }

  // Credit Pull methods
  private creditPullsMap: Map<string, CreditPull> = new Map();

  async createCreditPull(pull: InsertCreditPull): Promise<CreditPull> {
    const id = randomUUID();
    const newPull: CreditPull = { ...pull, id, createdAt: new Date() } as CreditPull;
    this.creditPullsMap.set(id, newPull);
    return newPull;
  }

  async getLatestCreditPull(applicationId: string): Promise<CreditPull | undefined> {
    const pulls = Array.from(this.creditPullsMap.values()).filter(p => p.applicationId === applicationId);
    return pulls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  // Helper methods
  private calculatePremium(contractValue: string): string {
    const value = parseFloat(contractValue.replace(/[^0-9.]/g, "")) || 0;
    const premium = value * 0.02; // 2% premium rate
    return premium.toFixed(2);
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First check if user exists to preserve their role if they're an admin
    const existingUser = await this.getUser(userData.id);
    
    const result = await this.db
      .insert(users)
      .values({
        ...userData,
        // If user exists and is admin, keep them as admin
        // Otherwise, default to "client" role for new users
        role: existingUser?.role || "client",
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
          // Preserve existing role - do NOT overwrite it
          // This ensures admin users stay admin when logging in via OAuth
          role: existingUser?.role || "client",
        },
      })
      .returning();
    return result[0];
  }

  // Quote methods
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const quoteNumber = `QS-${Date.now()}`;
    const estimatedPremium = this.calculatePremium(insertQuote.contractValue || "0");
    
    const result = await this.db.insert(quotes).values({
      ...insertQuote,
      quoteNumber,
      estimatedPremium,
    }).returning();
    
    return result[0];
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    const result = await this.db.select().from(quotes).where(eq(quotes.id, id));
    return result[0];
  }

  async getAllQuotes(): Promise<Quote[]> {
    return await this.db.select().from(quotes);
  }

  async updateQuoteStatus(id: string, status: string): Promise<Quote | undefined> {
    const result = await this.db
      .update(quotes)
      .set({ status })
      .where(eq(quotes.id, id))
      .returning();
    return result[0];
  }

  async updateQuote(id: string, data: Partial<InsertQuote>): Promise<Quote | undefined> {
    const result = await this.db
      .update(quotes)
      .set(data)
      .where(eq(quotes.id, id))
      .returning();
    return result[0];
  }

  async deleteQuote(id: string): Promise<boolean> {
    const result = await this.db
      .delete(quotes)
      .where(eq(quotes.id, id))
      .returning();
    return result.length > 0;
  }

  // Bond methods
  async createBond(insertBond: InsertBond): Promise<Bond> {
    const result = await this.db.insert(bonds).values(insertBond).returning();
    return result[0];
  }

  async getBond(id: string): Promise<Bond | undefined> {
    const result = await this.db.select().from(bonds).where(eq(bonds.id, id));
    return result[0];
  }

  async getBondsByUserId(userId: string): Promise<Bond[]> {
    return await this.db.select().from(bonds).where(eq(bonds.userId, userId));
  }

  async getAllBonds(): Promise<Bond[]> {
    return await this.db.select().from(bonds);
  }

  // Project methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await this.db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await this.db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getAllProjects(): Promise<Project[]> {
    return await this.db.select().from(projects);
  }

  // Chat message methods
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const result = await this.db.insert(chatMessages).values(insertMessage).returning();
    return result[0];
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return await this.db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  // Company settings methods
  async getCompanySettings(): Promise<CompanySettings | undefined> {
    const result = await this.db.select().from(companySettings).limit(1);
    return result[0];
  }

  async updateCompanySettings(data: Partial<InsertCompanySettings>): Promise<CompanySettings> {
    const existing = await this.getCompanySettings();
    if (existing) {
      const result = await this.db
        .update(companySettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(companySettings.id, existing.id))
        .returning();
      return result[0];
    }
    const result = await this.db
      .insert(companySettings)
      .values({ ...data })
      .returning();
    return result[0];
  }

  // Resource methods
  async createResource(resource: InsertResource): Promise<Resource> {
    const result = await this.db.insert(resources).values(resource).returning();
    return result[0];
  }

  async getResource(id: string): Promise<Resource | undefined> {
    const result = await this.db.select().from(resources).where(eq(resources.id, id));
    return result[0];
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return await this.db
      .select()
      .from(resources)
      .where(eq(resources.type, type))
      .orderBy(resources.order);
  }

  async getAllResources(): Promise<Resource[]> {
    return await this.db.select().from(resources).orderBy(resources.order);
  }

  async updateResource(id: string, data: Partial<InsertResource>): Promise<Resource | undefined> {
    const result = await this.db
      .update(resources)
      .set(data)
      .where(eq(resources.id, id))
      .returning();
    return result[0];
  }

  async deleteResource(id: string): Promise<boolean> {
    const result = await this.db.delete(resources).where(eq(resources.id, id));
    return !!result;
  }

  // Carrier methods
  async createCarrier(carrier: InsertCarrier): Promise<Carrier> {
    const result = await this.db.insert(carriers).values(carrier).returning();
    return result[0];
  }

  async getCarrier(id: string): Promise<Carrier | undefined> {
    const result = await this.db.select().from(carriers).where(eq(carriers.id, id));
    return result[0];
  }

  async getAllCarriers(): Promise<Carrier[]> {
    return await this.db.select().from(carriers).orderBy(carriers.name);
  }

  async updateCarrier(id: string, data: Partial<InsertCarrier>): Promise<Carrier | undefined> {
    const result = await this.db
      .update(carriers)
      .set(data)
      .where(eq(carriers.id, id))
      .returning();
    return result[0];
  }

  async deleteCarrier(id: string): Promise<boolean> {
    const result = await this.db.delete(carriers).where(eq(carriers.id, id));
    return !!result;
  }

  async createQuoteCarrier(quoteCarrier: InsertQuoteCarrier): Promise<QuoteCarrier> {
    const result = await this.db.insert(quoteCarriers).values(quoteCarrier).returning();
    return result[0];
  }

  async getQuoteCarriers(quoteId: string): Promise<QuoteCarrier[]> {
    return await this.db.select().from(quoteCarriers).where(eq(quoteCarriers.quoteId, quoteId));
  }

  async updateQuoteCarrier(id: string, data: Partial<InsertQuoteCarrier>): Promise<QuoteCarrier | undefined> {
    const result = await this.db
      .update(quoteCarriers)
      .set(data)
      .where(eq(quoteCarriers.id, id))
      .returning();
    return result[0];
  }

  // Carrier Rules methods
  async createCarrierRules(rules: InsertCarrierRules): Promise<CarrierRules> {
    const result = await this.db.insert(carrierRules).values(rules).returning();
    return result[0];
  }

  async getCarrierRules(carrierId: string): Promise<CarrierRules | undefined> {
    const result = await this.db.select().from(carrierRules).where(eq(carrierRules.carrierId, carrierId));
    return result[0];
  }

  async updateCarrierRules(carrierId: string, rules: Partial<InsertCarrierRules>): Promise<CarrierRules | undefined> {
    const result = await this.db
      .update(carrierRules)
      .set(rules)
      .where(eq(carrierRules.carrierId, carrierId))
      .returning();
    return result[0];
  }

  // Carrier Capacity methods
  async getCarrierCapacity(carrierId: string, year: number): Promise<CarrierCapacity | undefined> {
    const result = await this.db.select().from(carrierCapacity)
      .where(eq(carrierCapacity.carrierId, carrierId) && eq(carrierCapacity.capacityYear, year));
    return result[0];
  }

  async createOrUpdateCapacity(capacity: InsertCarrierCapacity): Promise<CarrierCapacity> {
    const existing = await this.getCarrierCapacity(capacity.carrierId, capacity.capacityYear);
    if (existing) {
      const updated = await this.db
        .update(carrierCapacity)
        .set(capacity)
        .where(eq(carrierCapacity.id, existing.id))
        .returning();
      return updated[0];
    }
    const result = await this.db.insert(carrierCapacity).values(capacity).returning();
    return result[0];
  }

  // Carrier Metrics methods
  async getCarrierMetrics(carrierId: string): Promise<CarrierMetrics | undefined> {
    const result = await this.db.select().from(carrierMetrics).where(eq(carrierMetrics.carrierId, carrierId));
    return result[0];
  }

  async updateCarrierMetrics(carrierId: string, metrics: Partial<InsertCarrierMetrics>): Promise<CarrierMetrics | undefined> {
    const existing = await this.getCarrierMetrics(carrierId);
    if (existing) {
      const updated = await this.db
        .update(carrierMetrics)
        .set(metrics)
        .where(eq(carrierMetrics.id, existing.id))
        .returning();
      return updated[0];
    }
    const result = await this.db.insert(carrierMetrics).values({ carrierId, ...metrics }).returning();
    return result[0];
  }

  // Auto-routing recommendation logic
  async recommendCarriers(quote: Quote): Promise<Carrier[]> {
    const contractValue = parseFloat(quote.contractValue || "0");
    const creditScore = parseInt(quote.creditScore || "600");
    const yearsInBusiness = quote.yearsInBusiness || 0;
    const revenue = parseFloat(quote.annualRevenue || "0");
    
    const allCarriers = await this.getAllCarriers();
    const recommended: Carrier[] = [];

    for (const carrier of allCarriers) {
      if (!carrier.active) continue;

      const rules = await this.getCarrierRules(carrier.id);
      if (!rules) continue;

      // Check bond type
      if (rules.acceptedBondTypes && !rules.acceptedBondTypes.includes(quote.bondType)) continue;

      // Check credit score
      if (creditScore < (rules.minCreditScore || 600)) continue;

      // Check years in business
      if (yearsInBusiness < (rules.minYearsInBusiness || 0)) continue;

      // Check revenue requirement
      if (rules.minAnnualRevenue && revenue < parseFloat(rules.minAnnualRevenue.toString())) continue;

      // Check contract value limits
      if (rules.minContractValue && contractValue < parseFloat(rules.minContractValue.toString())) continue;
      if (rules.maxContractValue && contractValue > parseFloat(rules.maxContractValue.toString())) continue;

      // Check capacity
      const year = new Date().getFullYear();
      const capacity = await this.getCarrierCapacity(carrier.id, year);
      if (capacity && capacity.usedCapacity && capacity.annualCapacityLimit) {
        const available = parseFloat(capacity.annualCapacityLimit.toString()) - parseFloat(capacity.usedCapacity.toString());
        if (contractValue > available) continue;
      }

      recommended.push(carrier);
    }

    return recommended;
  }

  // Application methods
  async createApplication(app: InsertSuretyApplication): Promise<SuretyApplication> {
    const appNum = `APP-${Date.now()}`;
    const [created] = await this.db
      .insert(suretyApplications)
      .values({ ...app, applicationNumber: appNum })
      .returning();
    return created;
  }

  async getApplication(id: string): Promise<SuretyApplication | undefined> {
    const [app] = await this.db
      .select()
      .from(suretyApplications)
      .where(eq(suretyApplications.id, id));
    return app;
  }

  async getApplicationsByUserId(userId: string): Promise<SuretyApplication[]> {
    return await this.db
      .select()
      .from(suretyApplications)
      .where(eq(suretyApplications.userId, userId));
  }

  async updateApplication(id: string, data: Partial<InsertSuretyApplication>): Promise<SuretyApplication | undefined> {
    const [updated] = await this.db
      .update(suretyApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(suretyApplications.id, id))
      .returning();
    return updated;
  }

  async addDocument(doc: InsertApplicationDocument): Promise<ApplicationDocument> {
    const [created] = await this.db
      .insert(applicationDocuments)
      .values(doc)
      .returning();
    return created;
  }

  async getApplicationDocuments(applicationId: string): Promise<ApplicationDocument[]> {
    return await this.db
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, applicationId));
  }

  async updateDocumentValidation(docId: string, validationStatus: string, errors?: string[]): Promise<ApplicationDocument | undefined> {
    const [updated] = await this.db
      .update(applicationDocuments)
      .set({ validationStatus, validationErrors: errors || [] })
      .where(eq(applicationDocuments.id, docId))
      .returning();
    return updated;
  }

  async createCreditPull(pull: InsertCreditPull): Promise<CreditPull> {
    const [created] = await this.db
      .insert(creditPulls)
      .values(pull)
      .returning();
    return created;
  }

  async getLatestCreditPull(applicationId: string): Promise<CreditPull | undefined> {
    const [pull] = await this.db
      .select()
      .from(creditPulls)
      .where(eq(creditPulls.applicationId, applicationId))
      .orderBy((t) => t.pulledAt);
    return pull;
  }

  // Helper methods
  private calculatePremium(contractValue: string): string {
    const value = parseFloat(contractValue.replace(/[^0-9.]/g, "")) || 0;
    const premium = value * 0.02; // 2% premium rate
    return premium.toFixed(2);
  }
}

export const storage = new DbStorage();
