"use client";

import { HotelHourlyRatesSection } from "@/components/hotel/hotel-hourly-rates-section";
import { Separator } from "@/components/ui/separator";
import { useBookingModeStore } from "@/store/booking-mode-store";

type HotelHourlyRatesGateProps = {
  baseNightInr: number;
};

/** Renders the hourly rates block (and surrounding dividers) only in Hours booking mode. */
export function HotelHourlyRatesGate({ baseNightInr }: HotelHourlyRatesGateProps) {
  const mode = useBookingModeStore((s) => s.mode);

  if (mode !== "hours") {
    return <Separator className="my-6" />;
  }

  return (
    <>
      <Separator className="my-6" />
      <HotelHourlyRatesSection baseNightInr={baseNightInr} />
      <Separator className="my-6" />
    </>
  );
}
