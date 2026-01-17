// src/app/api/houses/[id]/route.ts
import { NextRequest } from "next/server";
import { getHouse, updateHouse, deleteHouse } from "@/services/houses";
import { handleApi } from "@/lib/handleApi";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return handleApi(async () => getHouse(params.id));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return handleApi(async () => {
    const body = await req.json();
    return updateHouse(params.id, body);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return handleApi(async () => deleteHouse(params.id));
}
