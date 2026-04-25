import { z } from "zod";

import { apiGetJson } from "@/lib/api-client";

const hotelSummarySchema = z
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
  })
  .passthrough();

export type HotelSummaryDto = z.infer<typeof hotelSummarySchema>;

const hotelListSchema = z.array(hotelSummarySchema);

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

const hotelDetailsSchema = hotelSummarySchema.extend({
  description: z.string(),
  gallery: z.array(z.string()),
  amenities: z.array(z.string()),
  rooms: z.array(hotelRoomSchema),
  reviewCount: z.number(),
});

export type HotelDetailsDto = z.infer<typeof hotelDetailsSchema>;

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function parseTotalCount(headers: Headers): number {
  const raw = headers.get("x-total-count");
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function listHotels(input: {
  destination?: string;
  page: number;
  pageSize: number;
}): Promise<PaginatedResult<HotelSummaryDto>> {
  const { data, headers } = await apiGetJson<unknown>("/api/hotels", {
    query: {
      _page: input.page,
      _limit: input.pageSize,
      q: input.destination?.trim() ? input.destination.trim() : undefined,
      _sort: "rating",
      _order: "desc",
    },
  });

  const items = hotelListSchema.parse(data);
  const total = parseTotalCount(headers);
  const totalPages =
    total > 0 ? Math.max(1, Math.ceil(total / input.pageSize)) : 1;

  return { items, page: input.page, pageSize: input.pageSize, total, totalPages };
}

export async function getHotelById(id: string): Promise<HotelDetailsDto | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  try {
    const { data } = await apiGetJson<unknown>(`/api/hotels/${encodeURIComponent(trimmed)}`, {
      cache: "no-store",
    });
    return hotelDetailsSchema.parse(data);
  } catch {
    return null;
  }
}

