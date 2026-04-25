"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import type { SlotData } from "@/lib/rate-calculator/types";
import { formatCurrency, formatSlotLabel } from "@/lib/rate-calculator/utils";

type Row = {
  slot: string;
  subtotal: number;
  withTax: number;
};

export function RateCalculatorChart({
  slotData,
  locale,
  currencySymbol,
  fullDayBaseRate,
}: {
  slotData: SlotData[];
  locale: string;
  currencySymbol: string;
  fullDayBaseRate: number;
}) {
  const data: Row[] = React.useMemo(
    () =>
      slotData.map((s) => ({
        slot: formatSlotLabel(s.hours),
        subtotal: s.subtotal,
        withTax: s.withTax,
      })),
    [slotData],
  );

  return (
    <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Price vs slot (subtotal)
      </div>
      <div className="mt-4 h-[280px]" aria-label="Bar chart showing subtotal and tax-inclusive prices by slot duration">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="slot" />
            <YAxis
              tickFormatter={(v) =>
                `${currencySymbol}${Number(v).toLocaleString(locale, { maximumFractionDigits: 0 })}`
              }
            />
            <Tooltip
              formatter={(value: unknown, name: string) => {
                const n = typeof value === "number" ? value : Number(value);
                const label = name === "withTax" ? "With tax" : "Subtotal";
                return [formatCurrency(n, { locale, currencySymbol }), label];
              }}
            />
            <Legend />
            <ReferenceLine
              y={fullDayBaseRate}
              stroke="#3B82F6"
              strokeDasharray="6 6"
              ifOverflow="extendDomain"
            />
            <Bar dataKey="subtotal" fill="#A7F3D0" radius={[8, 8, 0, 0]} />
            <Bar dataKey="withTax" fill="#1D9E75" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Dashed line indicates the 24-hour base rate.
      </div>
    </Card>
  );
}

