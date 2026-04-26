import type { NextRequest } from "next/server";

import { prisma } from "@/server/config/database";
import { noContent } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSessionApi } from "@/server/utils/require-session-api";

export const POST = asyncHandler(async (_req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  await prisma.user.update({
    where: { id: user.id },
    data: { deletedAt: new Date() },
  });
  return noContent();
});

