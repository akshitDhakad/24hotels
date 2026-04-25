import { z } from "zod";

import { readDb } from "@/app/api/_db/db";

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
  })
  .passthrough();

export type HotelDetailsFromDb = z.infer<typeof hotelDetailsSchema>;

export async function getHotelByIdFromDb(
  id: string,
): Promise<HotelDetailsFromDb | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  const db = await readDb();
  const found = (db.hotels as unknown[]).find((h) => {
    const obj = h as Record<string, unknown>;
    return String(obj.id) === trimmed;
  });
  if (!found) return null;

  try {
    return hotelDetailsSchema.parse(found);
  } catch {
    return null;
  }
}

