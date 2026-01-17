import { NextRequest } from "next/server";
import { listHouses, createHouse } from "@/services/houses";
import { handleApi } from "@/lib/handleApi";

export async function GET() {
  return handleApi(async () => listHouses());
}

export async function POST(req: NextRequest) {
  return handleApi(async () => {
    const body = await req.json();
    return createHouse(body);
  });
}