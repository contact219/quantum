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
  users,
  quotes,
  bonds,
  projects,
  chatMessages,
  companySettings
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
    const result = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
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

  // Helper methods
  private calculatePremium(contractValue: string): string {
    const value = parseFloat(contractValue.replace(/[^0-9.]/g, "")) || 0;
    const premium = value * 0.02; // 2% premium rate
    return premium.toFixed(2);
  }
}

export const storage = new DbStorage();
