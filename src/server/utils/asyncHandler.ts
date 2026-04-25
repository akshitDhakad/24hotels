import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { errorHandler } from "@/server/errors/errorHandler";

/** Next.js App Router route context (params are async in recent Next versions). */
export type AppRouteHandlerContext = {
  params: Promise<Record<string, string | string[]>>;
};

export function asyncHandler(
  fn: (req: NextRequest, ctx: AppRouteHandlerContext) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ctx: AppRouteHandlerContext) => {
    try {
      return await fn(req, ctx);
    } catch (error) {
      return errorHandler(error, req);
    }
  };
}
