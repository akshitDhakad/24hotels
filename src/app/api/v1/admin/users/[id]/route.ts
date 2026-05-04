import type { NextRequest } from "next/server";

import { prisma } from "@/server/config/database";
import { Errors } from "@/server/errors/errorFactory";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSessionApi } from "@/server/utils/require-session-api";

export const GET = asyncHandler(async (_req: NextRequest, ctx: AppRouteHandlerContext) => {
  await requireSessionApi(["ADMIN"]);
  const params = await ctx.params;
  const id = params?.id;
  if (!id || typeof id !== "string") throw Errors.BadRequest("Invalid user id.");

  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      loyaltyPoints: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      hostKyc: { select: { status: true, submittedAt: true, verifiedAt: true, reviewReason: true } },
      _count: { select: { hotels: true, bookings: true, reviews: true } },
    },
  });
  if (!user) throw Errors.NotFound("User");

  return success(user);
});

export const DELETE = asyncHandler(async (_req: NextRequest, ctx: AppRouteHandlerContext) => {
  await requireSessionApi(["ADMIN"]);
  const params = await ctx.params;
  const id = params?.id;
  if (!id || typeof id !== "string") throw Errors.BadRequest("Invalid user id.");

  const now = new Date();
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true, deletedAt: true } });
  if (!user) throw Errors.NotFound("User");
  if (user.deletedAt) return success({ id }, "Already deleted");
  if (user.role === "ADMIN") throw Errors.Forbidden("Admin users cannot be deleted from here.");

  await prisma.$transaction([
    prisma.user.update({ where: { id }, data: { deletedAt: now } }),
    prisma.hotel.updateMany({ where: { ownerId: id, deletedAt: null }, data: { deletedAt: now, isActive: false } }),
  ]);

  return success({ id }, "Deleted");
});

