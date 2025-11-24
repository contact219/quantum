import { 
  type User, 
  type InsertUser,
  type Quote,
  type InsertQuote,
  type Bond,
  type InsertBond,
  type Project,
  type InsertProject,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: string): Promise<Quote | undefined>;

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

  // Helper methods
  private calculatePremium(contractValue: string): string {
    const value = parseFloat(contractValue.replace(/[^0-9.]/g, "")) || 0;
    const premium = value * 0.02; // 2% premium rate
    return premium.toFixed(2);
  }
}

export const storage = new MemStorage();
