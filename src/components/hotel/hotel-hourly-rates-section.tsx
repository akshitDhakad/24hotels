import { Check } from "lucide-react";

import { computeAllSlots } from "@/lib/rate-calculator/calculations";
import { DEFAULT_SLOTS, DEFAULT_TAX_RATE } from "@/lib/rate-calculator/constants";
import { formatCurrency } from "@/lib/currency";

type HotelHourlyRatesSectionProps = {
  /** Full-night rate in INR (already converted from USD if applicable). */
  baseNightInr: number;
};

/**
 * Guest-facing summary of flexible-stay slot totals, aligned with the rate
 * calculator’s default surcharges and monotonic pricing rules.
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
              <span className="flex min-w-0 items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                <span className="text-foreground">
                  {s.hours} hour{s.hours === 1 ? "" : "s"}
                  {s.isBestValue ? (
                    <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Best value
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-foreground">
                {formatCurrency(s.withTax, "INR")}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Indicative totals include {DEFAULT_TAX_RATE}% GST. Shorter slots may include
          a premium versus dividing the full-night rate by hours.
        </p>
      </div>
    </div>
  );
}
