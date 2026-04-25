import type { FeaturedHome } from "@/features/landing/featured-homes";
import type { TrendingStay } from "@/features/landing/trending-stays";

import type { HotelListingCardData } from "./hotel-listing-types";
import type { HotelSummaryDto } from "./hotels-api";
import type { CurrencyCode } from "@/types/search";
import { convertFromUsd } from "@/lib/currency";

function splitLocation(location: string): { neighborhood: string; city: string } {
  const idx = location.lastIndexOf(",");
  if (idx === -1) {
    return { neighborhood: location.trim(), city: "" };
  }
  return {
    neighborhood: location.slice(0, idx).trim(),
    city: location.slice(idx + 1).trim(),
  };
}

function starsFromRating(rating: number, explicit?: number): number {
  if (explicit !== undefined && Number.isFinite(explicit)) {
    return Math.min(5, Math.max(0, Math.round(explicit)));
  }
  return Math.min(5, Math.max(1, Math.round(rating / 2)));
}

export function hotelSummaryToListing(
  hotel: HotelSummaryDto,
  currency: CurrencyCode = "INR",
): HotelListingCardData {
  const { neighborhood, city } = splitLocation(hotel.location);
  const amount = convertFromUsd(hotel.priceUsd, currency);
  return {
    id: hotel.id,
    href: `/hotels/${hotel.id}`,
    name: hotel.name,
    image: hotel.image,
    scoreBadge: hotel.rating,
    stars: starsFromRating(hotel.rating, hotel.stars),
    neighborhood,
    city,
    imageBadges: hotel.perks.length ? hotel.perks.slice(0, 2) : undefined,
    ribbonBadge: hotel.isTopRated ? "Top rated" : undefined,
    wishlistHref: "/auth/sign-in",
    price: { currency, amount },
  };
}

export function featuredHomeToListing(home: FeaturedHome): HotelListingCardData {
  return {
    id: home.id,
    href: `/hotels?destination=${encodeURIComponent(home.city)}`,
    name: home.name,
    image: home.image,
    scoreBadge: home.score,
    stars: home.stars,
    neighborhood: home.neighborhood,
    city: home.city,
    imageBadges: home.imageBadges,
    price: { currency: "INR", amount: home.priceInr },
  };
}

export function trendingStayToListing(stay: TrendingStay): HotelListingCardData {
  return {
    id: stay.id,
    href:
      stay.href ??
      `/hotels?destination=${encodeURIComponent(stay.city)}`,
    name: stay.name,
    image: stay.image,
    scoreBadge: stay.score,
    stars: stay.stars,
    neighborhood: stay.neighborhood,
    city: stay.city,
    imageBadges: stay.imageBadges,
    ribbonBadge: stay.ribbonBadge,
    wishlistHref: null,
    price: { currency: "INR", amount: stay.priceInr },
  };
}
