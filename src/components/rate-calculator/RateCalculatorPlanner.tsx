"use client";

import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/rate-calculator/utils";

export function RateCalculatorPlanner({
  show,
  roomCount,
  occupancy,
  onRoomCountChange,
  onOccupancyChange,
  daily,
  monthly,
  annual,
  locale,
  currencySymbol,
}: {
  show: boolean;
  roomCount: number;
  occupancy: number;
  onRoomCountChange: (v: number) => void;
  onOccupancyChange: (v: number) => void;
  daily: number;
  monthly: number;
  annual: number;
  locale: string;
  currencySymbol: string;
}) {
  if (!show) return null;

  return (
    <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Revenue scenario planner
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Rooms in property</div>
            <div className="font-mono">{roomCount}</div>
          </div>
          <Slider
            value={[roomCount]}
            min={1}
            max={200}
            step={1}
            onValueChange={(v) => onRoomCountChange(v[0] ?? roomCount)}
            aria-label="Number of rooms in property"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Avg daily occupancy</div>
            <div className="font-mono">{occupancy}%</div>
          </div>
          <Slider
            value={[occupancy]}
            min={10}
            max={100}
            step={5}
            onValueChange={(v) => onOccupancyChange(v[0] ?? occupancy)}
            aria-label="Average daily occupancy percentage"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-background p-4">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Daily revenue estimate
          </div>
          <div className="mt-2 text-2xl font-semibold font-mono">
            {formatCurrency(daily, { locale, currencySymbol })}
          </div>
        </Card>
        <Card className="border-border bg-background p-4">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Monthly revenue estimate
          </div>
          <div className="mt-2 text-2xl font-semibold font-mono">
            {formatCurrency(monthly, { locale, currencySymbol })}
          </div>
        </Card>
        <Card className="border-border bg-background p-4">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Annual revenue estimate
          </div>
          <div className="mt-2 text-2xl font-semibold font-mono">
            {formatCurrency(annual, { locale, currencySymbol })}
          </div>
        </Card>
      </div>
    </Card>
  );
}

