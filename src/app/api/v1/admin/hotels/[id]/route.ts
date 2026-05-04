import type { NextRequest } from "next/server";

import { prisma } from "@/server/config/database";
import { Errors } from "@/server/errors/errorFactory";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSessionApi } from "@/server/utils/require-session-api";

function parseBoolean(v: unknown): boolean | undefined {
  if (v === undefined) return undefined;
  if (typeof v === "boolean") return v;
  return undefined;
}

export const GET = asyncHandler(async (_req: NextRequest, ctx: AppRouteHandlerContext) => {
  await requireSessionApi(["ADMIN"]);
  const params = await ctx.params;
  const id = params?.id;
  if (!id || typeof id !== "string") throw Errors.BadRequest("Invalid hotel id.");

  const hotel = await prisma.hotel.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
      city: true,
      country: true,
      address: true,
      priceUsd: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          deletedAt: true,
          hostKyc: {
            select: {
              status: true,
              documentType: true,
              submittedAt: true,
              verifiedAt: true,
              reviewReason: true,
            },
          },
          hostSettings: {
            select: {
              businessName: true,
              businessEmail: true,
              businessPhone: true,
              businessAddress: true,
              taxId: true,
              payoutStatus: true,
              complianceStatus: true,
              complianceNotes: true,
              bankName: true,
              accountHolderName: true,
              accountNumberLast4: true,
              ifsc: true,
              swift: true,
            },
          },
          profile: {
            select: {
              dob: true,
              businessEmail: true,
              businessPhone: true,
              address1: true,
              address2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },
        },
      },
      _count: {
        select: {
          rooms: { where: { isActive: true } },
          gallery: true,
          bookings: true,
          reviews: true,
        },
      },
    },
  });
  if (!hotel) throw Errors.NotFound("Hotel");

  return success(hotel);
});

export const PATCH = asyncHandler(async (req: NextRequest, ctx: AppRouteHandlerContext) => {
  await requireSessionApi(["ADMIN"]);
  const params = await ctx.params;
  const id = params?.id;
  if (!id || typeof id !== "string") throw Errors.BadRequest("Invalid hotel id.");

  const json: unknown = await req.json();
  const body = (json ?? {}) as Record<string, unknown>;
  const isActive = parseBoolean(body.isActive);
  const isVerified = parseBoolean(body.isVerified);
  if (isActive === undefined && isVerified === undefined) {
    throw Errors.Validation({ isActive: ["Provide isActive and/or isVerified"] });
  }

  const updated = await prisma.hotel.update({
    where: { id },
    data: {
      ...(isActive === undefined ? {} : { isActive }),
      ...(isVerified === undefined ? {} : { isVerified }),
    },
    select: { id: true, isActive: true, isVerified: true, updatedAt: true },
  });

  return success(updated, "Updated");
});

export const DELETE = asyncHandler(async (_req: NextRequest, ctx: AppRouteHandlerContext) => {
  await requireSessionApi(["ADMIN"]);
  const params = await ctx.params;
  const id = params?.id;
  if (!id || typeof id !== "string") throw Errors.BadRequest("Invalid hotel id.");

  const now = new Date();
  await prisma.hotel.update({
    where: { id },
    data: { deletedAt: now, isActive: false },
    select: { id: true },
  });

  return success({ id }, "Deleted");
});

