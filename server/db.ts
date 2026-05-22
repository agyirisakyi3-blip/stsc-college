import "dotenv/config";

let prisma: any;

if (process.env.VERCEL) {
  prisma = null;
} else {
  const { PrismaClient } = await import("../generated/prisma/client.ts");
  const { PrismaLibSql } = await import("@prisma/adapter-libsql");

  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });

  prisma = new PrismaClient({ adapter });
}

export default prisma;
