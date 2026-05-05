import type { NextRequest } from "next/server";

import { completeSignupSchema } from "@/lib/legacy-server/schemas/signup.schema";
import { completeSignup } from "@/lib/legacy-server/services/signup-session.service";
import { created } from "@/lib/legacy-server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/lib/legacy-server/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const json: unknown = await req.json();
  const body = completeSignupSchema.parse(json);
  const user = await completeSignup(body.signupToken);
  return created(user, "Account created");
});

