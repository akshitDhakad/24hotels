import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { Errors } from "@/server/errors/errorFactory";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSession } from "@/server/utils/require-session";

const bodySchema = z.object({
  age: z.number().int().min(18).max(120).optional(),
  address1: z.string().trim().min(3).max(200),
  address2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
});

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const { user } = await requireSession({ allowRoles: ["USER"], callbackUrl: "/onboarding/user" });
  const json: unknown = await req.json();
  const body = bodySchema.parse(json);

  const updated = await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: body,
    create: { userId: user.id, ...body },
    select: { id: true },
  });
  if (!updated?.id) throw Errors.Internal();
  return success({ ok: true }, "Saved");
});

