import type { NextRequest } from "next/server";

import { verifySignupOtpSchema } from "@/server/schemas/signup.schema";
import { verifySignupOtp } from "@/server/services/signup-session.service";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const json: unknown = await req.json();
  const body = verifySignupOtpSchema.parse(json);
  const result = await verifySignupOtp(body.sessionId, body.otp);
  return success(result, "Verified");
});

