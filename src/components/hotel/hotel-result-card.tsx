import { HotelListingCard } from "@/components/hotel/hotel-listing-card";
import { hotelSummaryToListing } from "@/features/hotels/hotel-listing-mappers";
import type { HotelSummaryDto } from "@/features/hotels/hotels-api";
import type { BookingMode } from "@/store/booking-mode-store";

export type HotelResult = HotelSummaryDto;

export function HotelResultCard({
  hotel,
  mode = "rooms",
}: {
  hotel: HotelResult;
  mode?: BookingMode;
}) {
  return (
    <HotelListingCard
      listing={hotelSummaryToListing(hotel, mode)}
      imageSizes="(min-width: 1024px) 40vw, 100vw"
    />
  );
}
