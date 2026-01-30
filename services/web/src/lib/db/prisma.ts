import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

// Ensure a single instance in development
const prisma = globalThis.__prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;

export { prisma };
