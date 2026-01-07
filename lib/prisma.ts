import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  adapter?: PrismaMariaDb;
};

// Adapter berbasis DATABASE_URL (string), BUKAN Pool
const adapter =
  globalForPrisma.adapter ?? new PrismaMariaDb(process.env.DATABASE_URL!);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // optional:
    // log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.adapter = adapter;
}
