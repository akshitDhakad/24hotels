import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSession } from "@/server/utils/require-session";

const e164Phone = z.string().trim().regex(/^\+[1-9]\d{7,14}$/);

const bodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  dob: z.string().trim().min(10),
  email: z.string().trim().email(),
  businessPhone: e164Phone,
  businessEmail: z.string().trim().email(),
  address1: z.string().trim().min(3).max(200),
  address2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
});

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const { user } = await requireSession({
    allowRoles: ["HOST"],
    callbackUrl: "/onboarding/host/personal",
  });
  const json: unknown = await req.json();
  const body = bodySchema.parse(json);

  await prisma.user.update({
    where: { id: user.id },
    data: { name: body.name, email: body.email.toLowerCase() },
  });

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      dob: new Date(body.dob),
      businessPhone: body.businessPhone,
      businessEmail: body.businessEmail.toLowerCase(),
      address1: body.address1,
      address2: body.address2 ?? null,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      country: body.country,
    },
    create: {
      userId: user.id,
      dob: new Date(body.dob),
      businessPhone: body.businessPhone,
      businessEmail: body.businessEmail.toLowerCase(),
      address1: body.address1,
      address2: body.address2 ?? null,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      country: body.country,
    },
  });

  return success({ ok: true }, "Saved");
});

