// src/app/api/houses/[id]/route.ts
import { NextRequest } from "next/server";
import { getHouse, updateHouse, deleteHouse } from "@/services/houses";
// import { handleApi } from "@/lib/handleApi";
import { withApi } from "@/lib/withApi";

// GET /api/houses/[id]
export const GET = withApi(({ id }) => getHouse(id));

// PUT /api/houses/[id]
export const PUT = withApi(async ({ id }, req: NextRequest) => {
  const body = await req.json();
  return updateHouse(id, body);
});

// DELETE /api/houses/[id]
export const DELETE = withApi(({ id }) => deleteHouse(id));
