import { z } from "zod";

export const CreateHouseContract = z.object({
  address: z.string().min(1),
  price: z.number().int().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
});

export type CreateHouseInput = z.infer<typeof CreateHouseContract>;
