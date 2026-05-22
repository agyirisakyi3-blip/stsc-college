import "dotenv/config";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

let prisma: any;

if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
  const { PrismaClient } = await import("../generated/prisma-pg/client.ts");
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  const adapter = new PrismaNeon({ connectionString: dbUrl });
  prisma = new PrismaClient({ adapter });
} else {
  const { PrismaClient } = await import("../generated/prisma/client.ts");
  const { PrismaLibSql } = await import("@prisma/adapter-libsql");
  const adapter = new PrismaLibSql({ url: dbUrl });
  prisma = new PrismaClient({ adapter });
}

export default prisma;
