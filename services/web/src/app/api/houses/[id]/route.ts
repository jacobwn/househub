// src/app/api/houses/[id]/route.ts
import { NextRequest } from "next/server";
import { getHouse, updateHouse, deleteHouse } from "@/services/houses";
// import { handleApi } from "@/lib/handleApi";
import { withErrorHandling } from "@/lib/withErrorHandling";

// GET /api/houses/[id]
export const GET = withErrorHandling(({ id }) => getHouse(id));

// PUT /api/houses/[id]
export const PUT = withErrorHandling(async ({ id }, req: NextRequest) => {
  const body = await req.json();
  return updateHouse(id, body);
});

// DELETE /api/houses/[id]
export const DELETE = withErrorHandling(({ id }) => deleteHouse(id));
