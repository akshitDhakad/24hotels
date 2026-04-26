import type { NextRequest } from "next/server";
import { z } from "zod";

import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { verifyHostProfileEditOtp } from "@/server/services/host-profile-edit-otp.service";
import { requireSessionApi } from "@/server/utils/require-session-api";

const bodySchema = z.object({
  otp: z.string().trim().regex(/^\d{6}$/, "Enter 6-digit code"),
});

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const json: unknown = await req.json();
  const { otp } = bodySchema.parse(json);
  const out = await verifyHostProfileEditOtp(user.id, otp);
  return success(out, "OK");
});
