"use client";

import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import {
  computeHourlySlotPricing,
  formatHourlyMoney,
  type HourlySlotHours,
} from "@/lib/pricing/hourly-slot-pricing";
import { Input } from "@/components/ui/input";

export type HourlyRateCalculatorProps = {
  /** 24-hour base rate in major currency units */
  defaultBaseRate24hr?: number;
  /** Tax/GST percent on subtotal (e.g. 18) */
  defaultTaxPercent?: number;
  currency?: string;
  locale?: string;
  /** Partial overrides for default slot surcharges */
  surchargePercentBySlot?: Partial<Record<HourlySlotHours, number>>;
  className?: string;
  showFormulaFootnote?: boolean;
};

export function HourlyRateCalculator({
  defaultBaseRate24hr = 2000,
  defaultTaxPercent = 18,
  currency = "INR",
  locale = "en-IN",
  surchargePercentBySlot,
  className,
  showFormulaFootnote = true,
}: HourlyRateCalculatorProps) {
  const [baseRate24hr, setBaseRate24hr] = useState(defaultBaseRate24hr);
  const [taxPercent, setTaxPercent] = useState(defaultTaxPercent);

  const rows = useMemo(
    () =>
      computeHourlySlotPricing({
        baseRate24hr: baseRate24hr,
        taxPercent,
        surchargePercentBySlot,
      }),
    [baseRate24hr, taxPercent, surchargePercentBySlot],
  );

  const perHourBase =
    baseRate24hr > 0 && Number.isFinite(baseRate24hr) ? baseRate24hr / 24 : 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm ring-1 ring-black/[0.04]",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Hour-based rate calculator
        </h2>
        <p className="text-sm text-muted-foreground">
          Slot prices from your 24h base rate, surcharges, GST, and monotonic pricing
          rules.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="calc-base-24h"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            24-hour base rate
          </label>
          <Input
            id="calc-base-24h"
            type="number"
            inputMode="decimal"
            min={0}
            step={100}
            value={Number.isFinite(baseRate24hr) ? baseRate24hr : ""}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setBaseRate24hr(Number.isFinite(v) ? Math.max(0, v) : 0);
            }}
            aria-describedby="calc-per-hour-hint"
          />
          <p id="calc-per-hour-hint" className="mt-1.5 text-xs text-muted-foreground">
            Per-hour base:{" "}
            <span className="font-medium text-foreground">
              {formatHourlyMoney(perHourBase, currency, locale)}
            </span>{" "}
            (base ÷ 24)
          </p>
        </div>
        <div>
          <label
            htmlFor="calc-tax"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Tax / GST (%)
          </label>
          <Input
            id="calc-tax"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={0.5}
            value={Number.isFinite(taxPercent) ? taxPercent : ""}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setTaxPercent(Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0);
            }}
          />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Hourly slot prices including subtotal before tax, tax amount, and total
            including tax
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-4 py-3">
                Slot
              </th>
              <th scope="col" className="px-4 py-3">
                Surcharge
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Subtotal (ex tax)
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Tax
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Total (incl. tax)
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.hours}
                className={cn(
                  "border-b border-border last:border-0",
                  row.wasMonotonicAdjusted &&
                  "bg-amber-50 text-foreground dark:bg-amber-950/30",
                )}
              >
                <td className="px-4 py-3 font-semibold text-foreground">
                  {row.hours} hrs
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {row.surchargePercent}%
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatHourlyMoney(row.subtotalExTax, currency, locale)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {formatHourlyMoney(row.taxAmount, currency, locale)}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                  {formatHourlyMoney(row.totalInclTax, currency, locale)}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.wasMonotonicAdjusted ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                      title={`Raw formula would be ${formatHourlyMoney(row.rawSubtotalExTax, currency, locale)}; raised to stay ≤ longer slots.`}
                    >
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Adjusted
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFormulaFootnote ? (
        <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
          <li>
            Subtotal (ex tax) = (24h base ÷ 24) × (1 + surcharge%) × hours, then
            monotonic correction so each row ≥ the row above.
          </li>
          <li>Tax = subtotal × (GST% ÷ 100). Total = subtotal + tax.</li>
        </ul>
      ) : null}
    </div>
  );
}
