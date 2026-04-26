import type { NextRequest } from "next/server";

import { resendSignupOtpSchema } from "@/server/schemas/signup.schema";
import { resendSignupOtp } from "@/server/services/signup-session.service";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const json: unknown = await req.json();
  const body = resendSignupOtpSchema.parse(json);
  const result = await resendSignupOtp(body.sessionId);
  return success(result, "OTP resent");
});

