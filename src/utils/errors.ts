export type PublicError = {
  message: string;
  code?: string;
};

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly expose: boolean;

  constructor(opts: {
    message: string;
    code?: string;
    status?: number;
    expose?: boolean;
    cause?: unknown;
  }) {
    super(opts.message, { cause: opts.cause });
    this.name = "AppError";
    this.code = opts.code ?? "APP_ERROR";
    this.status = opts.status ?? 400;
    this.expose = opts.expose ?? false;
  }
}

export function toPublicError(err: unknown): PublicError {
  if (err instanceof AppError) {
    return { message: err.expose ? err.message : "Something went wrong", code: err.code };
  }
  if (err instanceof Error) {
    return { message: "Something went wrong", code: "UNEXPECTED_ERROR" };
  }
  return { message: "Something went wrong", code: "UNKNOWN_ERROR" };
}

