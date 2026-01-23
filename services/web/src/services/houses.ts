// services/houses.ts
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { HttpError } from "@/lib/errors";

// --------------------
// Zod Schemas
// --------------------
export const createHouseSchema = z.object({
  address: z.string().min(1),
  price: z.number().positive(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
});

export const updateHouseSchema = z.object({
  address: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional()
});

// --------------------
// Service Functions
// --------------------
export async function createHouse(body: unknown) {
  const parsed = createHouseSchema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError("Invalid request data", 400, parsed.error.format());
  }

  return prisma.house.create({ data: parsed.data });
}

export async function listHouses() {
  return prisma.house.findMany();
}

export async function getHouse(id: string) {
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    throw new HttpError("Invalid house ID", 400);
  }

  const house = await prisma.house.findUnique({ where: { id } });
  if (!house) throw new HttpError("House not found", 404);

  return house;
}

export async function updateHouse(id: string, body: unknown) {
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    throw new HttpError("Invalid house ID", 400);
  }

  const parsed = updateHouseSchema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError("Invalid request data", 400, parsed.error.format());
  }

  // Check if house exists first — clear, readable, real-world approach
  const house = await prisma.house.findUnique({ where: { id } });
  if (!house) throw new HttpError("House not found", 404);

  return prisma.house.update({ where: { id }, data: parsed.data });
}

export async function deleteHouse(id: string) {
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    throw new HttpError("Invalid house ID", 400);
  }

  // Check existence first
  const house = await prisma.house.findUnique({ where: { id } });
  if (!house) throw new HttpError("House not found", 404);

  await prisma.house.delete({ where: { id } });
  return { message: "House deleted" };
}
