"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { TooltipProps } from "recharts";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/use-is-client";

type RangeKey = "weekly" | "monthly" | "yearly";

type Row = { label: string; value: number };

const DATA: Record<RangeKey, Row[]> = {
  weekly: [
    { label: "Mon", value: 2400 },
    { label: "Tue", value: 3200 },
    { label: "Wed", value: 2800 },
    { label: "Thu", value: 4100 },
    { label: "Fri", value: 3500 },
    { label: "Sat", value: 5200 },
    { label: "Sun", value: 3900 },
  ],
  monthly: [
    { label: "W1", value: 13_200 },
    { label: "W2", value: 16_700 },
    { label: "W3", value: 14_900 },
    { label: "W4", value: 18_100 },
  ],
  yearly: [
    { label: "Jan", value: 42_000 },
    { label: "Feb", value: 39_500 },
    { label: "Mar", value: 47_200 },
    { label: "Apr", value: 45_100 },
    { label: "May", value: 51_300 },
    { label: "Jun", value: 49_700 },
  ],
};

function SegmentedControl({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (v: RangeKey) => void;
}) {
  const items: { key: RangeKey; label: string }[] = [
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];
  return (
    <div className="inline-flex rounded-xl border border-black/10 bg-[#f7f7f8] p-1">
      {items.map((x) => {
        const active = x.key === value;
        return (
          <button
            key={x.key}
            type="button"
            onClick={() => onChange(x.key)}
            className={cn(
              "h-8 rounded-lg px-3 text-xs font-semibold transition",
              active ? "bg-white text-foreground shadow-sm" : "text-black/50 hover:text-foreground",
            )}
          >
            {x.label}
          </button>
        );
      })}
    </div>
  );
}

export function HostPerformanceInsights() {
  const [range, setRange] = React.useState<RangeKey>("weekly");
  const isClient = useIsClient();
  const data = DATA[range];

  const formatter = React.useCallback<
    NonNullable<TooltipProps<ValueType, NameType>["formatter"]>
  >((value) => {
    const n =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : Number.NaN;
    const formatted = Number.isFinite(n)
      ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : "—";
    return [formatted, "Revenue"];
  }, []);

  return (
    <Card className="border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Performance Insights</div>
          <div className="mt-1 text-xs text-black/45">Earnings vs. Projected Revenue</div>
        </div>
        <SegmentedControl value={range} onChange={setRange} />
      </div>

      <div className="mt-5 h-[260px] min-h-[260px]">
        {isClient ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(0,0,0,0.45)", fontSize: 11, fontWeight: 600 }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                formatter={formatter}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                }}
              />
              <Bar dataKey="value" fill="#111111" radius={[8, 8, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-xl bg-black/[0.02]" aria-hidden="true" />
        )}
      </div>
    </Card>
  );
}

