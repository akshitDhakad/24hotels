import type { NextRequest } from "next/server";

import { startSignupSchema } from "@/server/schemas/signup.schema";
import { startSignupSession } from "@/server/services/signup-session.service";
import { created } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const json: unknown = await req.json();
  const body = startSignupSchema.parse(json);

  const result = await startSignupSession({
    role: body.role,
    contact: body.contact,
    legalName: body.legalName,
    password: body.password,
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: req.headers.get("user-agent") ?? null,
    deviceFingerprint: body.deviceFingerprint ?? null,
  });

  return created(result, "OTP sent");
});

