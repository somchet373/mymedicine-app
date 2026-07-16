import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !databaseUrl.includes("pooler.supabase.com")) return databaseUrl;

  // Supabase transaction pooler (port 6543) requires Prisma to disable
  // server-side prepared statements; otherwise PgBouncer can lose them.
  const url = new URL(databaseUrl);
  url.searchParams.set("pgbouncer", "true");
  return url.toString();
}

const databaseUrl = getDatabaseUrl();

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {}),
  log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
