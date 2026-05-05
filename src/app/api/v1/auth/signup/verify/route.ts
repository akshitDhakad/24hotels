import type { NextRequest } from "next/server";

import { verifySignupOtpSchema } from "@/lib/legacy-server/schemas/signup.schema";
import { verifySignupOtp } from "@/lib/legacy-server/services/signup-session.service";
import { success } from "@/lib/legacy-server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/lib/legacy-server/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const json: unknown = await req.json();
  const body = verifySignupOtpSchema.parse(json);
  const result = await verifySignupOtp(body.sessionId, body.otp);
  return success(result, "Verified");
});

