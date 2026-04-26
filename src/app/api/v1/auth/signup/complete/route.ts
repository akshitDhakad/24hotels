import type { NextRequest } from "next/server";

import { completeSignupSchema } from "@/server/schemas/signup.schema";
import { completeSignup } from "@/server/services/signup-session.service";
import { created } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const json: unknown = await req.json();
  const body = completeSignupSchema.parse(json);
  const user = await completeSignup(body.signupToken);
  return created(user, "Account created");
});

