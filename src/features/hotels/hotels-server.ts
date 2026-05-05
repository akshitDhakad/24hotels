import type { HotelDetailsDto } from "@/features/hotels/hotels-api";
import { getHotelById } from "@/features/hotels/hotels-api";

/** @deprecated Prefer `HotelDetailsDto` — name kept for existing imports. */
export type HotelDetailsFromDb = HotelDetailsDto;

export async function getHotelByIdFromDb(id: string): Promise<HotelDetailsFromDb | null> {
  return getHotelById(id);
}
