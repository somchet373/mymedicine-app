import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // ให้แสดง Log เวลาดึงข้อมูล (ช่วยตอน Debug)
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;