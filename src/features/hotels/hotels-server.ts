import { z } from "zod";

import { prisma } from "@/server/config/database";

const hotelRoomSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    sleeps: z.number(),
    bed: z.string(),
    refundable: z.boolean(),
    priceUsd: z.number(),
  })
  .passthrough();

const hotelDetailsSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    country: z.string().optional(),
    city: z.string().optional(),
    rating: z.number(),
    stars: z.number().optional(),
    reviewLabel: z.string(),
    priceUsd: z.number(),
    perks: z.array(z.string()),
    image: z.string(),
    isTopRated: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    description: z.string(),
    gallery: z.array(z.string()),
    amenities: z.array(z.string()),
    rooms: z.array(hotelRoomSchema),
    reviewCount: z.number(),
    host: z
      .object({
        name: z.string(),
        image: z.string().nullable().optional(),
        reviewCount: z.number(),
        rating: z.number(),
        monthsHosting: z.number(),
        isSuperhost: z.boolean(),
        responseRate: z.number(),
        responseTimeLabel: z.string(),
      })
      .optional(),
  })
  .passthrough();

export type HotelDetailsFromDb = z.infer<typeof hotelDetailsSchema>;

export async function getHotelByIdFromDb(
  id: string,
): Promise<HotelDetailsFromDb | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  const hotel = await prisma.hotel.findFirst({
    where: { id: trimmed, deletedAt: null, isActive: true },
    include: {
      gallery: { orderBy: { sortOrder: "asc" } },
      amenities: { orderBy: { name: "asc" } },
      perks: { orderBy: { name: "asc" } },
      rooms: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
      owner: { select: { id: true, name: true, image: true, createdAt: true } },
    },
  });
  if (!hotel) return null;

  const hostAgg = await prisma.review.aggregate({
    where: {
      isApproved: true,
      hotel: { ownerId: hotel.ownerId, deletedAt: null },
    },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const monthsHosting = Math.max(
    1,
    Math.round((Date.now() - hotel.owner.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000)),
  );
  const hostRating = Number(hostAgg._avg.rating ?? hotel.rating ?? 0);
  const hostReviewCount = Number(hostAgg._count.rating ?? hotel.reviewCount ?? 0);

  const dto: Record<string, unknown> = {
    id: hotel.id,
    name: hotel.name,
    location: hotel.location ?? `${hotel.city}, ${hotel.country}`,
    country: hotel.country,
    city: hotel.city,
    rating: hotel.rating ?? 0,
    stars: hotel.stars ?? 0,
    reviewLabel: hotel.reviewLabel ?? "New",
    priceUsd: hotel.priceUsd ?? 0,
    perks: hotel.perks.map((p) => p.name),
    image: hotel.image ?? hotel.coverImage ?? hotel.gallery[0]?.url ?? "",
    description: hotel.description ?? "",
    gallery: hotel.gallery.map((g) => g.url),
    amenities: hotel.amenities.map((a) => a.name),
    rooms: hotel.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      sleeps: r.sleeps,
      bed: r.bed,
      refundable: r.refundable,
      priceUsd: r.priceUsd,
    })),
    reviewCount: hotel.reviewCount ?? 0,
    host: {
      name: hotel.owner.name ?? "Host",
      image: hotel.owner.image,
      reviewCount: hostReviewCount,
      rating: hostRating,
      monthsHosting,
      isSuperhost: hostRating >= 4.8 && hostReviewCount >= 10,
      responseRate: 100,
      responseTimeLabel: "Responds within an hour",
    },
  };

  try {
    return hotelDetailsSchema.parse(dto);
  } catch {
    return null;
  }
}

