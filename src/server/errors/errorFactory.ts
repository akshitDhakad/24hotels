import { AppError } from "@/server/errors/AppError";

export const Errors = {
  NotFound: (resource: string) => new AppError(`${resource} not found`, 404, "NOT_FOUND"),
  Unauthorized: (msg = "Unauthorized") => new AppError(msg, 401, "UNAUTHORIZED"),
  Forbidden: (msg = "Forbidden") => new AppError(msg, 403, "FORBIDDEN"),
  BadRequest: (msg: string, details?: unknown) => new AppError(msg, 400, "BAD_REQUEST", true, details),
  Conflict: (msg: string) => new AppError(msg, 409, "CONFLICT"),
  Validation: (details: unknown) => new AppError("Validation failed", 422, "VALIDATION_ERROR", true, details),
  RateLimit: (msg = "Too many requests. Please try again shortly.") => new AppError(msg, 429, "RATE_LIMITED"),
  Internal: (msg = "Internal server error") => new AppError(msg, 500, "INTERNAL_ERROR", false),
  PaymentFailed: (msg: string) => new AppError(msg, 402, "PAYMENT_FAILED"),
  RoomUnavailable: () => new AppError("Room not available for selected slot", 409, "ROOM_UNAVAILABLE"),
} as const;

