"use client";

import { Check, Info, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SlotData } from "@/lib/rate-calculator/types";
import { formatCurrency, formatSlotLabel } from "@/lib/rate-calculator/utils";
import { cn } from "@/lib/cn";

export function RateCalculatorTable({
  slotData,
  locale,
  currencySymbol,
  onSelect,
}: {
  slotData: SlotData[];
  locale: string;
  currencySymbol: string;
  onSelect: (hours: number) => void;
}) {
  const best = slotData.find((s) => s.isBestValue)?.hours;

  return (
    <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Pricing table
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th scope="col" className="py-3 text-left font-semibold">Slot</th>
              <th scope="col" className="py-3 text-left font-semibold">Surcharge %</th>
              <th scope="col" className="py-3 text-left font-semibold">Effective rate/hr</th>
              <th scope="col" className="py-3 text-left font-semibold">Subtotal</th>
              <th scope="col" className="py-3 text-left font-semibold">With Tax</th>
              <th scope="col" className="py-3 text-left font-semibold">vs 24hr day</th>
              <th scope="col" className="py-3 text-right font-semibold"> </th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {slotData.map((s) => {
              const withTax = formatCurrency(s.withTax, { locale, currencySymbol });
              const subtotal = formatCurrency(s.subtotal, { locale, currencySymbol });
              const perHr = formatCurrency(s.effectiveRatePerHour, { locale, currencySymbol });
              const percent = `${Math.round(s.percentOfFullDay)}%`;

              return (
                <tr
                  key={s.hours}
                  className={cn(
                    "border-b border-border/70 transition-colors",
                    s.wasAdjusted ? "bg-amber-50/70 dark:bg-amber-950/20" : "",
                    s.isBestValue ? "bg-emerald-50/70 dark:bg-emerald-950/20" : "",
                  )}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2 font-sans">
                      <span className="font-semibold">{formatSlotLabel(s.hours)}</span>
                      {s.wasAdjusted ? (
                        <Badge className="bg-amber-500 text-white">
                          <TriangleAlert className="mr-1 h-3.5 w-3.5" />
                          Adjusted
                        </Badge>
                      ) : null}
                      {s.isFullDay ? (
                        <Badge className="bg-blue-500 text-white">
                          <Info className="mr-1 h-3.5 w-3.5" />
                          Full day
                        </Badge>
                      ) : null}
                      {best === s.hours ? (
                        <Badge className="bg-emerald-600 text-white">
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Best value
                        </Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 font-sans">{s.surchargePercent}%</td>
                  <td className="py-3">{perHr}</td>
                  <td className="py-3">{subtotal}</td>
                  <td className="py-3 font-sans font-semibold">{withTax}</td>
                  <td className="py-3 font-sans">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                      {percent} of full day
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-sans">
                    <Button size="sm" onClick={() => onSelect(s.hours)} type="button">
                      Select this slot
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-muted-foreground font-sans">
        Adjusted rows are auto-corrected to satisfy the monotonic pricing rule.
      </div>
    </Card>
  );
}

