import { NextRequest } from "next/server";
import { listHouses, createHouse } from "@/services/houses";
import { withApi } from "@/lib/withApi";

// GET /api/houses
export const GET = withApi(() => listHouses());

// POST /api/houses
export const POST = withApi(async (_params, req: NextRequest) => {
  const body = await req.json();
  return createHouse(body);
});