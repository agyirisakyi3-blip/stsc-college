import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

let _prisma: PrismaClient | null = null;
let _initPromise: Promise<void> | null = null;

export async function getDb(): Promise<PrismaClient> {
  if (_prisma) return _prisma;
  if (_initPromise) {
    await _initPromise;
    return _prisma!;
  }

  _initPromise = (async () => {
    if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
      const { PrismaNeon } = await import("@prisma/adapter-neon");
      const adapter = new PrismaNeon({ connectionString: dbUrl });
      _prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;
    } else {
      const { PrismaLibSql } = await import("@prisma/adapter-libsql");
      const adapter = new PrismaLibSql({ url: dbUrl });
      _prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;
    }
  })();

  await _initPromise;
  return _prisma!;
}
