import { PrismaClient } from "./generated/prisma/client.js";
const { PrismaNeonHttp } = await import("@prisma/adapter-neon");
const adapter = new PrismaNeonHttp({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const users = await prisma.user.findMany();
console.log("users:", users.length);
