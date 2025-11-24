import { DbStorage } from "./storage";

async function seed() {
  const storage = new DbStorage();

  console.log("Seeding database...");

  // Create demo user
  const demoUser = await storage.createUser({
    username: "demo",
    password: "demo123",
    email: "john@abcconstruction.com",
    companyName: "ABC Construction LLC",
    role: "client",
  });

  console.log("Created demo user:", demoUser.id);

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

  console.log("Created demo projects:", project1.id, project2.id);

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

  console.log("Created demo bonds:", bond1.id, bond2.id, bond3.id);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
