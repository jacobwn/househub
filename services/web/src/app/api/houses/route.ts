import { NextRequest } from "next/server";
import { listHouses, createHouse } from "@/services/houses";
import { withErrorHandling } from "@/lib/withErrorHandling";

// GET /api/houses
export const GET = withErrorHandling(() => listHouses());

// POST /api/houses
export const POST = withErrorHandling(async (_params, req: NextRequest) => {
  const body = await req.json();
  return createHouse(body);
});