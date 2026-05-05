import type { BookingStatus } from "@prisma/client";

import { formatMajorCurrency, formatStayDateRange } from "@/lib/booking-display";
import { membershipLabelFromPoints } from "@/lib/loyalty";
import { prisma } from "@/lib/prisma";

const FALLBACK_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80";

export type UserDashboardBookingRow = {
  id: string;
  bookingRef: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  currency: string;
  finalAmountMinor: number;
  hotelName: string;
  locationLabel: string;
  datesLabel: string;
  imageUrl: string;
};

export type UserDashboardWishlistRow = {
  wishlistItemId: string;
  hotelId: string;
  name: string;
  locationLabel: string;
  imageUrl: string;
  pricePerNightLabel: string;
};

export type UserDashboardData = {
  displayName: string;
  email: string;
  image: string | null;
  loyaltyPoints: number;
  membershipLabel: string;
  memberSinceYear: number;
  /** All upcoming stays (not capped by the card list length). */
  upcomingStaysTotal: number;
  upcomingBookings: UserDashboardBookingRow[];
  totalTrips: number;
  wishlist: UserDashboardWishlistRow[];
};

function locationLabel(city: string, country: string) {
  return `${city}, ${country}`;
}

export type UserNavAccount = {
  displayName: string;
  email: string;
  image: string | null;
  membershipLabel: string;
  memberSinceYear: number;
};

export async function getUserNavAccount(userId: string): Promise<UserNavAccount | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      email: true,
      name: true,
      image: true,
      loyaltyPoints: true,
      createdAt: true,
    },
  });
  if (!user) return null;
  const displayName = (user.name?.trim() || user.email.split("@")[0] || "Guest").trim();
  return {
    displayName,
    email: user.email,
    image: user.image,
    membershipLabel: membershipLabelFromPoints(user.loyaltyPoints),
    memberSinceYear: user.createdAt.getFullYear(),
  };
}

export async function getUserDashboardData(userId: string): Promise<UserDashboardData | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      email: true,
      name: true,
      image: true,
      loyaltyPoints: true,
      createdAt: true,
    },
  });
  if (!user) return null;

  const now = new Date();

  const [upcomingRaw, upcomingStaysTotal, totalTrips, wishlistRaw] = await Promise.all([
    prisma.booking.findMany({
      where: {
        userId,
        status: { in: ["PENDING", "CONFIRMED"] },
        endTime: { gte: now },
      },
      orderBy: { startTime: "asc" },
      take: 8,
      include: {
        hotel: {
          select: { name: true, city: true, country: true, coverImage: true },
        },
      },
    }),
    prisma.booking.count({
      where: {
        userId,
        status: { in: ["PENDING", "CONFIRMED"] },
        endTime: { gte: now },
      },
    }),
    prisma.booking.count({
      where: {
        userId,
        status: { notIn: ["CANCELLED", "EXPIRED"] },
      },
    }),
    prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
            coverImage: true,
            rooms: {
              where: { isActive: true },
              orderBy: { priceUsd: "asc" },
              take: 1,
              select: { priceUsd: true },
            },
          },
        },
      },
    }),
  ]);

  const displayName = (user.name?.trim() || user.email.split("@")[0] || "Guest").trim();
  const membershipLabel = membershipLabelFromPoints(user.loyaltyPoints);

  const upcomingBookings: UserDashboardBookingRow[] = upcomingRaw.map((b) => ({
    id: b.id,
    bookingRef: b.bookingRef,
    status: b.status,
    startTime: b.startTime,
    endTime: b.endTime,
    currency: b.currency,
    finalAmountMinor: b.finalAmount,
    hotelName: b.hotel.name,
    locationLabel: locationLabel(b.hotel.city, b.hotel.country),
    datesLabel: formatStayDateRange(b.startTime, b.endTime),
    imageUrl: b.hotel.coverImage ?? FALLBACK_HOTEL_IMAGE,
  }));

  const wishlist = mapWishlistRows(wishlistRaw);

  return {
    displayName,
    email: user.email,
    image: user.image,
    loyaltyPoints: user.loyaltyPoints,
    membershipLabel,
    memberSinceYear: user.createdAt.getFullYear(),
    upcomingStaysTotal,
    upcomingBookings,
    totalTrips,
    wishlist,
  };
}

type WishlistQueryRow = {
  id: string;
  hotel: {
    id: string;
    name: string;
    city: string;
    country: string;
    coverImage: string | null;
    rooms: Array<{ priceUsd: number }>;
  };
};

function mapWishlistRows(wishlistRaw: WishlistQueryRow[]): UserDashboardWishlistRow[] {
  return wishlistRaw.map((w) => {
    const h = w.hotel;
    const minRoom = h.rooms[0];
    const currency = "INR";
    const pricePerNightLabel = minRoom
      ? `${formatMajorCurrency(minRoom.priceUsd, currency)} / night`
      : "See hotel";

    return {
      wishlistItemId: w.id,
      hotelId: h.id,
      name: h.name,
      locationLabel: locationLabel(h.city, h.country),
      imageUrl: h.coverImage ?? FALLBACK_HOTEL_IMAGE,
      pricePerNightLabel,
    };
  });
}

export async function getUserWishlistRows(userId: string): Promise<UserDashboardWishlistRow[]> {
  const wishlistRaw = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      hotel: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
          coverImage: true,
          rooms: {
            where: { isActive: true },
            orderBy: { priceUsd: "asc" },
            take: 1,
            select: { priceUsd: true },
          },
        },
      },
    },
  });
  return mapWishlistRows(wishlistRaw);
}

export type UserBookingListRow = {
  id: string;
  hotelId: string;
  bookingRef: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  currency: string;
  finalAmountMinor: number;
  hotelName: string;
  locationLabel: string;
  datesLabel: string;
};

export async function getUserBookingsList(userId: string): Promise<UserBookingListRow[]> {
  const rows = await prisma.booking.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    include: {
      hotel: { select: { id: true, name: true, city: true, country: true } },
    },
  });
  return rows.map((b) => ({
    id: b.id,
    hotelId: b.hotel.id,
    bookingRef: b.bookingRef,
    status: b.status,
    startTime: b.startTime,
    endTime: b.endTime,
    currency: b.currency,
    finalAmountMinor: b.finalAmount,
    hotelName: b.hotel.name,
    locationLabel: locationLabel(b.hotel.city, b.hotel.country),
    datesLabel: formatStayDateRange(b.startTime, b.endTime),
  }));
}
