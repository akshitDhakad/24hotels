import type { NextRequest } from "next/server";

import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { resendHostProfileEditOtp } from "@/server/services/host-profile-edit-otp.service";
import { requireSessionApi } from "@/server/utils/require-session-api";

export const POST = asyncHandler(async (_req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const out = await resendHostProfileEditOtp(user.id);
  return success(out, "OK");
});
