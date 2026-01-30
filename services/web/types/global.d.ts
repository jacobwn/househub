import { PrismaClient } from '@/lib/generated/prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

export {};