import type { NextRequest } from "next/server";

import { registerBodySchema } from "@/server/schemas/auth.schema";
import { registerUser } from "@/server/services/user.service";
import { created } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const json: unknown = await req.json();
  const body = registerBodySchema.parse(json);
  const user = await registerUser(body);
  return created(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    "Account created successfully",
  );
});
