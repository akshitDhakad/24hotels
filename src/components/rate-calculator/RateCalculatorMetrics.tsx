"use client";

import { Card } from "@/components/ui/card";
import type { SlotData } from "@/lib/rate-calculator/types";
import { formatCurrency } from "@/lib/rate-calculator/utils";

export function RateCalculatorMetrics({
  slotData,
  bestValueSlot,
  locale,
  currencySymbol,
  maxDailyRevenue,
}: {
  slotData: SlotData[];
  bestValueSlot: SlotData;
  locale: string;
  currencySymbol: string;
  maxDailyRevenue: number;
}) {
  const fourHr = slotData.find((s) => s.hours === 4);
  const cheapestPerHour = bestValueSlot.effectiveRatePerHour;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Best value slot
        </div>
        <div className="mt-2 text-2xl font-semibold">
          {bestValueSlot.hours} hours
        </div>
      </Card>

      <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Cheapest per hour
        </div>
        <div className="mt-2 text-2xl font-semibold font-mono">
          {formatCurrency(cheapestPerHour, { locale, currencySymbol })}/hr
        </div>
      </Card>

      <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Max theoretical daily revenue
        </div>
        <div className="mt-2 text-2xl font-semibold font-mono">
          {formatCurrency(maxDailyRevenue, { locale, currencySymbol })}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Assumes 6× bookings of the 4-hour slot (tax included in derived value).
        </div>
      </Card>

      <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          4-hour slot price
        </div>
        <div className="mt-2 text-2xl font-semibold font-mono">
          {formatCurrency(fourHr?.withTax ?? 0, { locale, currencySymbol })}
        </div>
      </Card>
    </div>
  );
}

