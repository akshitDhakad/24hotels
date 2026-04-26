"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { TooltipProps } from "recharts";

import { Card } from "@/components/ui/card";
import { useIsClient } from "@/lib/use-is-client";

type Row = { label: string; revenue: number; bookings: number };

const data: Row[] = [
  { label: "Mon", revenue: 8400, bookings: 18 },
  { label: "Tue", revenue: 10150, bookings: 22 },
  { label: "Wed", revenue: 9350, bookings: 19 },
  { label: "Thu", revenue: 12300, bookings: 26 },
  { label: "Fri", revenue: 11850, bookings: 25 },
  { label: "Sat", revenue: 14200, bookings: 31 },
  { label: "Sun", revenue: 10950, bookings: 23 },
];

export function AdminRevenueChart() {
  const isClient = useIsClient();

  const formatter = React.useCallback<
    NonNullable<TooltipProps<ValueType, NameType>["formatter"]>
  >((value, name) => {
    const n =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : Number.NaN;
    const key = (name ?? "").toString();
    if (key === "revenue") return [`$${n.toLocaleString("en-US")}`, "Revenue"];
    return [Number.isFinite(n) ? n.toString() : "—", "Bookings"];
  }, []);

  return (
    <Card className="border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Revenue & Bookings</div>
          <div className="mt-1 text-xs text-black/45">Last 7 days performance</div>
        </div>
        <div className="text-xs font-semibold text-black/45">Weekly</div>
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
              <Bar dataKey="revenue" fill="#111111" radius={[8, 8, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-xl bg-black/[0.02]" aria-hidden="true" />
        )}
      </div>
    </Card>
  );
}

