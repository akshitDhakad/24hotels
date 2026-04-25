import { HotelListingCard } from "@/components/hotel/hotel-listing-card";
import { hotelSummaryToListing } from "@/features/hotels/hotel-listing-mappers";
import type { HotelSummaryDto } from "@/features/hotels/hotels-api";
import type { CurrencyCode } from "@/types/search";

export type HotelResult = HotelSummaryDto;

export function HotelResultCard({
  hotel,
  currency = "INR",
}: {
  hotel: HotelResult;
  currency?: CurrencyCode;
}) {
  return (
    <HotelListingCard
      listing={hotelSummaryToListing(hotel, currency)}
      imageSizes="(min-width: 1024px) 40vw, 100vw"
    />
  );
}
