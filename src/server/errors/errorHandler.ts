import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { env } from "@/server/config/env";
import { logger } from "@/server/config/logger";
import { AppError } from "@/server/errors/AppError";
import { Errors } from "@/server/errors/errorFactory";

function requestIdFrom(req: NextRequest): string {
  return req.headers.get("x-request-id") ?? req.headers.get("x-request-id".toUpperCase()) ?? crypto.randomUUID();
}

function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof ZodError) return Errors.Validation(err.flatten().fieldErrors);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return Errors.Conflict("Resource already exists");
    if (err.code === "P2025") return Errors.NotFound("Record");
    if (err.code === "P2003") return Errors.BadRequest("Foreign key constraint failed");
  }

  if (err instanceof TokenExpiredError) {
    return new AppError("Token expired", 401, "TOKEN_EXPIRED");
  }
  if (err instanceof JsonWebTokenError) {
    return Errors.Unauthorized("Invalid token");
  }

  return Errors.Internal(env.NODE_ENV === "production" ? "Internal server error" : String((err as Error)?.message ?? err));
}

export function errorHandler(error: unknown, req: NextRequest) {
  const requestId = requestIdFrom(req);
  const appError = toAppError(error);

  logger.error(
    {
      requestId,
      url: req.url,
      method: req.method,
      statusCode: appError.statusCode,
      code: appError.code,
      err: error instanceof Error ? { message: error.message, stack: error.stack } : { value: error },
    },
    "request_failed",
  );

  return NextResponse.json(
    {
      success: false,
      code: appError.code,
      message: appError.statusCode >= 500 && env.NODE_ENV === "production" ? "Internal server error" : appError.message,
      ...(appError.code === "VALIDATION_ERROR" ? { details: appError.details } : {}),
      requestId,
    },
    { status: appError.statusCode, headers: { "cache-control": "no-store", "x-request-id": requestId } },
  );
}

