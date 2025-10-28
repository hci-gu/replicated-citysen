import { PrismaClient } from "@prisma/client";
import { ensureDatabaseUrl } from "./ensureDatabaseUrl.js";

const resolvedDatabaseUrl = ensureDatabaseUrl();

if (!resolvedDatabaseUrl && process.env.NODE_ENV === "production") {
  // Prisma will throw a more specific error, but provide a clearer message for misconfigured deployments.
  throw new Error(
    "DATABASE_URL environment variable is not set. Provide DATABASE_URL or one of POSTGRES_PRISMA_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING."
  );
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
