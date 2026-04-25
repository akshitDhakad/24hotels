import { Check } from "lucide-react";

import { computeAllSlots } from "@/lib/rate-calculator/calculations";
import { DEFAULT_SLOTS, DEFAULT_TAX_RATE } from "@/lib/rate-calculator/constants";
import { formatCurrency } from "@/lib/currency";

type HotelHourlyRatesSectionProps = {
  /** Full-night rate in INR (already converted from USD if applicable). */
  baseNightInr: number;
};

/**
 * Guest-facing flexible-stay prices (pre-tax `subtotal`), matching the nightly
 * headline. Slot surcharges and monotonic rules come from `computeAllSlots`.
 */
export function HotelHourlyRatesSection({ baseNightInr }: HotelHourlyRatesSectionProps) {
  const slots = computeAllSlots(baseNightInr, DEFAULT_TAX_RATE, DEFAULT_SLOTS);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="text-base font-semibold">Flexible hourly stays</div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Book by the hour when you need a daytime room, a short layover, or a
          partial night. Rates scale from a 24-hour reference price and include
          slot-based adjustments; longer stays typically offer better value per
          hour. Final taxes and fees are confirmed at checkout.
        </p>
      </div>
      <div className="grid gap-3 rounded-xl border border-border bg-white p-5">
        <div className="text-sm font-semibold">Available durations</div>
        <ul className="grid gap-2.5 text-sm text-muted-foreground">
          {slots.map((s) => (
            <li key={s.hours} className="flex items-start justify-between gap-3">
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                <span className="min-w-0 text-foreground">
                  <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span>
                      {s.hours} hour{s.hours === 1 ? "" : "s"}
                    </span>
                    {s.isBestValue ? (
                      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        Best value
                      </span>
                    ) : null}
                  </span>
                </span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-foreground">
                {formatCurrency(s.subtotal, "INR")}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Amounts are before taxes and fees (same basis as the nightly rate). Shorter
          slots may include a premium versus dividing the full-night rate by hours.
        </p>
      </div>
    </div>
  );
}
