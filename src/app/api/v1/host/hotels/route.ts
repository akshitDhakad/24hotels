import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { success, created } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSessionApi } from "@/server/utils/require-session-api";
import { slugify } from "@/lib/slug";

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  location: z.string().trim().min(3).max(160),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  address: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(30, "Description must be at least 30 characters").max(2000),
  priceUsd: z.coerce.number().positive().max(50_000_000),
  reviewLabel: z.string().trim().min(2).max(40).default("New"),
  perks: z.array(z.string().trim().min(2).max(80)).max(12).default([]),
  amenities: z.array(z.string().trim().min(2).max(80)).min(1).max(60),
  gallery: z.array(z.string().url()).min(4, "At least 4 images are required").max(20),
  rooms: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(120),
        sleeps: z.coerce.number().int().min(1).max(12),
        bed: z.string().trim().min(2).max(60),
        refundable: z.boolean(),
        priceUsd: z.coerce.number().positive().max(50_000_000),
        perks: z.array(z.string().trim().min(1).max(120)).max(24).optional(),
      }),
    )
    .min(1, "Add at least one room type"),
});

export const GET = asyncHandler(async (_req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const hotels = await prisma.hotel.findMany({
    where: { ownerId: user.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      location: true,
      image: true,
      priceUsd: true,
      address: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return success(hotels, "OK");
});

export const POST = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const json: unknown = await req.json();
  const body = createSchema.parse(json);

  const base = slugify(body.name);
  const slug = `${base}-${user.id.slice(-6)}-${Date.now().toString(36)}`;

  const hotel = await prisma.hotel.create({
    data: {
      ownerId: user.id,
      name: body.name,
      slug,
      location: body.location,
      city: body.city,
      country: body.country,
      address: body.address ?? null,
      description: body.description,
      priceUsd: body.priceUsd,
      reviewLabel: body.reviewLabel,
      image: body.gallery[0] ?? null,
      isActive: false,
      isVerified: false,
      perks: body.perks.length
        ? { create: body.perks.map((name) => ({ name })) }
        : undefined,
      amenities: { create: body.amenities.map((name) => ({ name })) },
      gallery: { create: body.gallery.map((url, idx) => ({ url, sortOrder: idx })) },
      rooms: {
        create: body.rooms.map((r) => ({
          name: r.name,
          sleeps: r.sleeps,
          bed: r.bed,
          refundable: r.refundable,
          priceUsd: r.priceUsd,
          perks: (r.perks ?? []) as Prisma.InputJsonValue,
          isActive: true,
        })),
      },
    },
    select: { id: true },
  });
  return created(hotel, "Created");
});

