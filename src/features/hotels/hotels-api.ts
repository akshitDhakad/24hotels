import { z } from "zod";

import { ApiError } from "@/lib/api-client";
import { USD_TO_INR_RATE } from "@/lib/currency";
import { gatewayGetJson } from "@/lib/gateway-client";

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

const hostBlockSchema = z
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
  .optional();

const hotelDetailsSchema = hotelSummarySchema.extend({
  description: z.string(),
  gallery: z.array(z.string()),
  amenities: z.array(z.string()),
  rooms: z.array(hotelRoomSchema),
  reviewCount: z.number(),
  host: hostBlockSchema,
});

export type HotelDetailsDto = z.infer<typeof hotelDetailsSchema>;

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const gatewayRoomSchema = z
  .object({
    id: z.string(),
    sourceRoomId: z.string(),
    hostId: z.string(),
    title: z.string(),
    description: z.string().optional().default(""),
    city: z.string(),
    address: z.string().optional().default(""),
    pricePerSlot: z.number(),
    availableSlots: z.array(z.number()).optional(),
    amenities: z.array(z.string()).optional().default([]),
    images: z
      .array(
        z
          .object({
            url: z.string(),
          })
          .passthrough(),
      )
      .optional()
      .default([]),
  })
  .passthrough();

type GatewayRoom = z.infer<typeof gatewayRoomSchema>;

const searchRoomsResponseSchema = z
  .object({
    success: z.boolean(),
    items: z.array(gatewayRoomSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .passthrough();

const roomDetailResponseSchema = z
  .object({
    success: z.boolean(),
    room: gatewayRoomSchema,
  })
  .passthrough();

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Search indexes INR slot prices; UI still expects a synthetic “USD” field consumed by `convertFromUsd`. */
function priceUsdFromInrSlot(priceInr: number): number {
  if (!Number.isFinite(priceInr) || priceInr <= 0) return 0;
  return priceInr / USD_TO_INR_RATE;
}

function stableRating(seed: string): number {
  const h = hashSeed(seed);
  return 4.2 + (h % 8) / 10;
}

function stableReviewCount(seed: string): number {
  const h = hashSeed(seed);
  return 8 + (h % 52);
}

function mapGatewayRoomToSummary(room: GatewayRoom): HotelSummaryDto {
  const key = room.sourceRoomId || room.id;
  const image = room.images[0]?.url?.trim() || FALLBACK_IMAGE;
  const location = [room.address?.trim(), room.city].filter(Boolean).join(", ") || room.city;
  const perks = (room.amenities ?? []).slice(0, 6);
  const rating = stableRating(key);
  const reviewCount = stableReviewCount(key);

  return {
    id: key,
    name: room.title,
    location,
    country: "India",
    city: room.city,
    rating,
    stars: Math.min(5, Math.max(1, Math.round(rating / 2))),
    reviewLabel: `${reviewCount} reviews`,
    priceUsd: priceUsdFromInrSlot(room.pricePerSlot),
    perks,
    image,
    isTopRated: rating >= 4.7,
    isFeatured: false,
  };
}

function mapGatewayRoomToDetails(room: GatewayRoom): HotelDetailsDto {
  const summary = mapGatewayRoomToSummary(room);
  const gallery =
    room.images.length > 0 ? room.images.map((i) => i.url).filter(Boolean) : [summary.image];
  const priceUsd = priceUsdFromInrSlot(room.pricePerSlot);

  return {
    ...summary,
    description: room.description?.trim() || `${room.title} in ${room.city}.`,
    gallery,
    amenities: [...(room.amenities ?? [])],
    rooms: [
      {
        id: room.sourceRoomId,
        name: room.title,
        sleeps: 4,
        bed: "1 queen bed",
        refundable: true,
        priceUsd,
      },
    ],
    reviewCount: stableReviewCount(room.sourceRoomId || room.id),
    perks: summary.perks.length ? summary.perks : ["Wi-Fi", "Hosted stay"],
    host: {
      name: "Host",
      image: null,
      reviewCount: stableReviewCount(room.hostId),
      rating: stableRating(room.hostId),
      monthsHosting: 6 + (hashSeed(room.hostId) % 24),
      isSuperhost: false,
      responseRate: 98,
      responseTimeLabel: "Responds within a few hours",
    },
  };
}

export async function listHotels(input: {
  destination?: string;
  page: number;
  pageSize: number;
}): Promise<PaginatedResult<HotelSummaryDto>> {
  const pageSize = Math.min(Math.max(1, input.pageSize), 50);
  const page = Math.max(1, input.page);

  const { data } = await gatewayGetJson<unknown>("/api/v1/search/rooms", {
    query: {
      page,
      limit: pageSize,
      city: input.destination?.trim() ? input.destination.trim() : undefined,
    },
  });

  const parsed = searchRoomsResponseSchema.safeParse(data);
  if (!parsed.success) {
    return { items: [], page, pageSize, total: 0, totalPages: 1 };
  }

  const { items: rawItems, total } = parsed.data;
  const items = rawItems.map(mapGatewayRoomToSummary);
  const totalPages =
    total > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return { items, page, pageSize, total, totalPages };
}

export async function getHotelById(id: string): Promise<HotelDetailsDto | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;
  if (!/^[a-fA-F0-9]{24}$/.test(trimmed)) return null;

  try {
    const { data } = await gatewayGetJson<unknown>(
      `/api/v1/search/rooms/${encodeURIComponent(trimmed)}`,
      { cache: "no-store" },
    );
    const parsed = roomDetailResponseSchema.safeParse(data);
    if (!parsed.success) return null;
    return hotelDetailsSchema.parse(mapGatewayRoomToDetails(parsed.data.room));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    return null;
  }
}
