import { HotelListingCard } from "@/components/hotel/hotel-listing-card";
import { hotelSummaryToListing } from "@/features/hotels/hotel-listing-mappers";
import type { HotelSummary } from "@/features/hotels/mock-data";

export type HotelResult = HotelSummary;

export function HotelResultCard({ hotel }: { hotel: HotelResult }) {
  return (
    <HotelListingCard
      listing={hotelSummaryToListing(hotel)}
      imageSizes="(min-width: 1024px) 40vw, 100vw"
    />
  );
}
