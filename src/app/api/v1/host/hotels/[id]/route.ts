import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { Errors } from "@/server/errors/errorFactory";
import { success, noContent } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSessionApi } from "@/server/utils/require-session-api";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  location: z.string().trim().min(3).max(160).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  country: z.string().trim().min(2).max(80).optional(),
  address: z.string().trim().min(3).max(200).nullable().optional(),
  description: z.string().trim().min(30).max(2000).optional(),
  priceUsd: z.coerce.number().positive().max(1_000_000).optional(),
  reviewLabel: z.string().trim().min(2).max(40).optional(),
  perks: z.array(z.string().trim().min(2).max(80)).max(12).optional(),
  amenities: z.array(z.string().trim().min(2).max(80)).min(1).max(60).optional(),
  gallery: z.array(z.string().url()).min(4).max(20).optional(),
  rooms: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().trim().min(2).max(120),
        sleeps: z.coerce.number().int().min(1).max(12),
        bed: z.string().trim().min(2).max(60),
        refundable: z.boolean(),
        priceUsd: z.coerce.number().positive().max(1_000_000),
        isActive: z.boolean().optional(),
      }),
    )
    .min(1)
    .optional(),
  isActive: z.boolean().optional(),
});

export const GET = asyncHandler(async (_req: NextRequest, ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const params = await ctx.params;
  const id = params.id as string;

  const hotel = await prisma.hotel.findFirst({
    where: { id, ownerId: user.id, deletedAt: null },
    include: {
      gallery: { orderBy: { sortOrder: "asc" } },
      amenities: { orderBy: { name: "asc" } },
      perks: { orderBy: { name: "asc" } },
      rooms: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!hotel) throw Errors.NotFound("Hotel");
  return success(
    {
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      city: hotel.city,
      country: hotel.country,
      address: hotel.address,
      description: hotel.description,
      priceUsd: hotel.priceUsd,
      reviewLabel: hotel.reviewLabel,
      perks: hotel.perks.map((p) => p.name),
      amenities: hotel.amenities.map((a) => a.name),
      gallery: hotel.gallery.map((g) => g.url),
      rooms: hotel.rooms.map((r) => ({
        id: r.id,
        name: r.name,
        sleeps: r.sleeps,
        bed: r.bed,
        refundable: r.refundable,
        priceUsd: r.priceUsd,
        isActive: r.isActive,
      })),
      isActive: hotel.isActive,
      isVerified: hotel.isVerified,
    },
    "OK",
  );
});

export const PUT = asyncHandler(async (req: NextRequest, ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const params = await ctx.params;
  const id = params.id as string;

  const json: unknown = await req.json();
  const patch = updateSchema.parse(json);

  const updated = await prisma.hotel.updateMany({
    where: { id, ownerId: user.id, deletedAt: null },
    data: {
      ...(patch.name ? { name: patch.name } : {}),
      ...(patch.location ? { location: patch.location } : {}),
      ...(patch.city ? { city: patch.city } : {}),
      ...(patch.country ? { country: patch.country } : {}),
      ...(patch.address !== undefined ? { address: patch.address } : {}),
      ...(patch.description ? { description: patch.description } : {}),
      ...(typeof patch.priceUsd === "number" ? { priceUsd: patch.priceUsd } : {}),
      ...(patch.reviewLabel ? { reviewLabel: patch.reviewLabel } : {}),
      ...(typeof patch.isActive === "boolean" ? { isActive: patch.isActive } : {}),
    },
  });
  if (updated.count === 0) throw Errors.NotFound("Hotel");

  // Replace collections if provided (kept simple/robust; can be optimized later).
  if (patch.perks) {
    await prisma.hotelPerk.deleteMany({ where: { hotelId: id } });
    if (patch.perks.length) {
      await prisma.hotelPerk.createMany({
        data: patch.perks.map((name) => ({ hotelId: id, name })),
        skipDuplicates: true,
      });
    }
  }
  if (patch.amenities) {
    await prisma.hotelAmenity.deleteMany({ where: { hotelId: id } });
    await prisma.hotelAmenity.createMany({
      data: patch.amenities.map((name) => ({ hotelId: id, name })),
      skipDuplicates: true,
    });
  }
  if (patch.gallery) {
    await prisma.hotelImage.deleteMany({ where: { hotelId: id } });
    await prisma.hotelImage.createMany({
      data: patch.gallery.map((url, idx) => ({ hotelId: id, url, sortOrder: idx })),
    });
    await prisma.hotel.update({ where: { id }, data: { image: patch.gallery[0] ?? null } });
  }
  if (patch.rooms) {
    // Soft-disable existing rooms then upsert by id if provided.
    await prisma.room.updateMany({ where: { hotelId: id }, data: { isActive: false } });
    for (const r of patch.rooms) {
      if (r.id) {
        await prisma.room.updateMany({
          where: { id: r.id, hotelId: id },
          data: {
            name: r.name,
            sleeps: r.sleeps,
            bed: r.bed,
            refundable: r.refundable,
            priceUsd: r.priceUsd,
            isActive: r.isActive ?? true,
          },
        });
      } else {
        await prisma.room.create({
          data: {
            hotelId: id,
            name: r.name,
            sleeps: r.sleeps,
            bed: r.bed,
            refundable: r.refundable,
            priceUsd: r.priceUsd,
            isActive: r.isActive ?? true,
          },
        });
      }
    }
  }

  return success({ ok: true }, "Updated");
});

export const DELETE = asyncHandler(async (_req: NextRequest, ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const params = await ctx.params;
  const id = params.id as string;

  const updated = await prisma.hotel.updateMany({
    where: { id, ownerId: user.id, deletedAt: null },
    data: { deletedAt: new Date(), isActive: false },
  });
  if (updated.count === 0) throw Errors.NotFound("Hotel");
  return noContent();
});

