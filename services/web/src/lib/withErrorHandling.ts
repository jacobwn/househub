import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./errors/errors";

export function withErrorHandling<T, P extends Record<string, string>>(
  fn: (params: P, req: NextRequest) => Promise<T>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<P> } // Next.js passes params as Promise
  ): Promise<Response> => {          // <--- Return type is Response, not NextResponse
    const params = await context.params;

    try {
      const result = await fn(params, req);
      return NextResponse.json(result); // still returns NextResponse, which is OK
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request data", details: err.format() },
          { status: 400 }
        );
      }
      if (err instanceof HttpError) {
        return NextResponse.json(
          { error: err.message, details: err.details },
          { status: err.status }
        );
      }

      console.error(err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}


// That means something below is throwing HttpError.

// That’s okay, but it’s slightly less clean than:

// domain/app errors (PermissionDeniedError, NotFoundError, etc.)