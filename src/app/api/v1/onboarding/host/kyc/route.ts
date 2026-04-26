import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSession } from "@/server/utils/require-session";

const bodySchema = z.object({
  documentType: z.enum(["AADHAAR", "PASSPORT", "DRIVERS_LICENSE", "NATIONAL_ID"]),
});

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const { user } = await requireSession({ allowRoles: ["HOST"], callbackUrl: "/onboarding/host/kyc" });
  const json: unknown = await req.json();
  const body = bodySchema.parse(json);

  await prisma.hostKycSubmission.upsert({
    where: { userId: user.id },
    update: { documentType: body.documentType, status: "DRAFT" },
    create: { userId: user.id, documentType: body.documentType, status: "DRAFT" },
  });

  return success({ ok: true }, "Saved");
});

