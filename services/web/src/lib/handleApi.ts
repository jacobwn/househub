import { NextResponse } from "next/server";
import { HttpError } from "./errors";
import { ZodError } from "zod";

export async function handleApi<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const result = await fn();
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
}
