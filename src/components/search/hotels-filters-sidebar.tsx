"use client";

import * as React from "react";

import { cn } from "@/lib/cn";
import { convertFromUsd, formatCurrency } from "@/lib/currency";

type CheckboxProps = {
  label: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
};

function Checkbox({ label, checked, onCheckedChange }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="h-4 w-4 accent-black"
      />
      {label}
    </label>
  );
}

export function HotelsFiltersSidebar({ className }: { className?: string }) {
  const minInr = 0;
  const maxInr = convertFromUsd(2000, "INR");
  const [price, setPrice] = React.useState(convertFromUsd(1200, "INR"));
  const [star, setStar] = React.useState<3 | 4 | 5 | null>(4);

  return (
    <aside className={cn("w-full lg:w-72", className)}>
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="text-sm font-semibold">Filters</div>
        <div className="mt-5 grid gap-6">
          <div>
            <div className="text-[11px] font-semibold text-black/50">
              PRICE RANGE
            </div>
            <div className="mt-3">
              <input
                type="range"
                min={minInr}
                max={maxInr}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full"
                aria-label="Price range"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(minInr, "INR")}</span>
                <span className="font-mono font-semibold">{formatCurrency(price, "INR")}</span>
                <span>{formatCurrency(maxInr, "INR")}+</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-black/50">
              STAR RATING
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {([3, 4, 5] as const).map((s) => {
                const active = star === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStar(active ? null : s)}
                    className={cn(
                      "h-9 rounded-xl border px-3 text-xs font-semibold",
                      active
                        ? "border-primary bg-primary text-primary-foreground hover:brightness-[0.92]"
                        : "border-border bg-white text-foreground hover:bg-black/5",
                    )}
                  >
                    {s}*
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-black/50">
              PROPERTY TYPE
            </div>
            <div className="mt-3 grid gap-2">
              <Checkbox label="Hotels" checked />
              <Checkbox label="Villas" />
              <Checkbox label="Apartments" />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-black/50">
              AMENITIES
            </div>
            <div className="mt-3 grid gap-2">
              <Checkbox label="Infinity Pool" />
              <Checkbox label="Spa & Wellness" />
              <Checkbox label="Beachfront" />
              <Checkbox label="Michelin Dining" />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-black/50">
              GUEST RATING
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2">
                <div className="text-sm font-medium">Superb: 9+</div>
                <div className="text-xs text-muted-foreground">142</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2">
                <div className="text-sm font-medium">Excellent: 8+</div>
                <div className="text-xs text-muted-foreground">289</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

