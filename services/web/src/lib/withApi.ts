// lib/withApi.ts
import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "./errors";
import { ZodError } from "zod";

/**
 * Wrap your service logic into a proper Next.js route handler
 * fn: your business logic that receives params and optionally the request
 */
export function withApi<T>(
  fn: (params: Record<string, string>, req: NextRequest) => Promise<T>
) {
  return async (
    req: NextRequest,
    { params }: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      const result = await fn(params, req);
      return NextResponse.json(result);
    } catch (err: unknown) {
      // Zod validation errors
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request data", details: err.format() },
          { status: 400 }
        );
      }

      // Expected errors from service layer
      if (err instanceof HttpError) {
        return NextResponse.json(
          { error: err.message, details: err.details },
          { status: err.status }
        );
      }

      // Unexpected errors
      console.error(err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
