import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSession } from "@/server/utils/require-session";
import { slugify } from "@/lib/slug";

const bodySchema = z.object({
  hotelName: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  address: z.string().trim().min(3).max(200).optional(),
});

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const { user } = await requireSession({ allowRoles: ["HOST"], callbackUrl: "/onboarding/host/hotel" });
  const json: unknown = await req.json();
  const body = bodySchema.parse(json);

  const base = slugify(body.hotelName);
  // Ensure uniqueness by appending a short stable suffix.
  const slug = `${base}-${user.id.slice(-6)}`;

  await prisma.hotel.create({
    data: {
      ownerId: user.id,
      name: body.hotelName,
      slug,
      city: body.city,
      country: body.country,
      address: body.address ?? null,
      isActive: false,
      isVerified: false,
    },
    select: { id: true },
  });

  return success({ ok: true }, "Saved");
});

