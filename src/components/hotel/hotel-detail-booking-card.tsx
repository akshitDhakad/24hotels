"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { HoursRoomsLink } from "@/components/layout/hours-rooms-link";
import { Button } from "@/components/ui/button";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { convertFromUsd, formatCurrency } from "@/lib/currency";
import { computeSlotPrice } from "@/lib/rate-calculator/calculations";
import { useBookingModeStore } from "@/store/booking-mode-store";

/** Matches default slot curve in `DEFAULT_SURCHARGES` for any stay length 1–24h. */
const HOUR_SURCHARGE_ANCHORS: readonly { h: number; p: number }[] = [
  { h: 4, p: 50 },
  { h: 8, p: 40 },
  { h: 12, p: 30 },
  { h: 16, p: 20 },
  { h: 20, p: 10 },
  { h: 24, p: 0 },
];

export const HOURLY_STAY_OPTIONS = [4, 8, 23] as const;
export type HourlyStayHours = (typeof HOURLY_STAY_OPTIONS)[number];

function surchargePercentForStayHours(hours: number): number {
  const h = Math.max(1, Math.min(24, hours));
  if (h <= HOUR_SURCHARGE_ANCHORS[0].h) return HOUR_SURCHARGE_ANCHORS[0].p;
  for (let i = 0; i < HOUR_SURCHARGE_ANCHORS.length - 1; i += 1) {
    const a = HOUR_SURCHARGE_ANCHORS[i]!;
    const b = HOUR_SURCHARGE_ANCHORS[i + 1]!;
    if (h <= b.h) {
      const t = (h - a.h) / (b.h - a.h);
      return a.p + t * (b.p - a.p);
    }
  }
  return 0;
}

function addHoursToLocalDateTime(dateStr: string, timeStr: string, hoursToAdd: number): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, mo, d] = dateStr.split("-").map((x) => Number(x));
  const [hh, mm] = (timeStr || "00:00").split(":").map((x) => Number(x));
  if (![y, mo, d, hh, mm].every((n) => Number.isFinite(n))) return null;
  const dt = new Date(y, mo - 1, d, hh, mm, 0, 0);
  if (Number.isNaN(dt.getTime())) return null;
  dt.setHours(dt.getHours() + hoursToAdd);
  return dt;
}

function formatCheckoutLabel(dt: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dt);
}

export type HotelDetailBookingCardProps = {
  priceUsd: number;
  nights: number;
  conciergeFeeUsd: number;
  occupancyTaxesUsd: number;
  cityLabel?: string;
};

export function HotelDetailBookingCard({
  priceUsd,
  nights,
  conciergeFeeUsd,
  occupancyTaxesUsd,
  cityLabel,
}: HotelDetailBookingCardProps) {
  const mode = useBookingModeStore((s) => s.mode);

  const [checkInDate, setCheckInDate] = React.useState("2024-10-24");
  const [checkInTime, setCheckInTime] = React.useState("15:00");
  const [stayHours, setStayHours] = React.useState<HourlyStayHours>(8);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [range, setRange] = React.useState<{ start: Date | null; end: Date | null }>(() => {
    const start = new Date();
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + nights);
    return { start, end };
  });

  const nightInr = convertFromUsd(priceUsd, "INR");
  const conciergeInr = convertFromUsd(conciergeFeeUsd, "INR");
  const occupancyInr = convertFromUsd(occupancyTaxesUsd, "INR");

  const checkoutAt = React.useMemo(
    () => addHoursToLocalDateTime(checkInDate, checkInTime, stayHours),
    [checkInDate, checkInTime, stayHours],
  );

  const slotSubtotalInr = React.useMemo(() => {
    const surcharge = surchargePercentForStayHours(stayHours);
    return computeSlotPrice(nightInr, surcharge, stayHours);
  }, [nightInr, stayHours]);

  const roomsSubtotalInr = nightInr * nights;
  const roomsTotalInr = roomsSubtotalInr + conciergeInr + occupancyInr;
  const hoursTotalInr = slotSubtotalInr + conciergeInr + occupancyInr;

  const isHours = mode === "hours";

  const checkInLabel = React.useMemo(() => {
    if (!range.start) return "Select";
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(range.start);
  }, [range.start]);
  const checkOutLabel = React.useMemo(() => {
    if (!range.end) return "Select";
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(range.end);
  }, [range.end]);

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-black/50">PRICE</div>
          <div className="mt-1 text-xl font-semibold whitespace-nowrap">
            {isHours ? (
              <>
                {formatCurrency(slotSubtotalInr, "INR")}
                <span className="text-xs font-medium text-muted-foreground">
                  {" "}
                  · {stayHours} hr stay
                </span>
              </>
            ) : (
              <>
                {formatCurrency(nightInr, "INR")}
                <span className="text-xs font-medium text-muted-foreground"> / night</span>
              </>
            )}
          </div>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 whitespace-nowrap">
          FREE CANCELLATION
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] font-semibold tracking-wide text-black/50">RATE TYPE</div>
        <HoursRoomsLink />
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3">
        {isHours ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 rounded-xl border border-border bg-white p-3">
              <span className="text-[11px] font-semibold text-black/50">CHECK-IN DATE</span>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="mt-0.5 w-full min-w-0 bg-transparent text-sm font-semibold text-foreground outline-none"
              />
            </label>
            <label className="grid gap-1 rounded-xl border border-border bg-white p-3">
              <span className="text-[11px] font-semibold text-black/50">CHECK-IN TIME</span>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="mt-0.5 w-full min-w-0 bg-transparent text-sm font-semibold text-foreground outline-none"
              />
            </label>

            <div className="col-span-2 grid gap-2 rounded-xl border border-border bg-white p-3">
              <div className="text-[11px] font-semibold text-black/50">STAY DURATION</div>
              <div className="flex flex-wrap gap-2">
                {HOURLY_STAY_OPTIONS.map((h) => {
                  const active = stayHours === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setStayHours(h)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-foreground hover:bg-black/5",
                      )}
                    >
                      {h} hr
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-2 rounded-xl border border-dashed border-border bg-black/[0.02] p-3">
              <div className="text-[11px] font-semibold text-black/50">CHECK-OUT (AUTO)</div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {checkoutAt ? formatCheckoutLabel(checkoutAt) : "—"}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Checkout is {stayHours} hours after check-in.
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-3">
              <div className="text-[11px] font-semibold text-black/50">GUESTS</div>
              <div className="mt-1 text-sm font-semibold">2 Adults</div>
            </div>
            <div className="rounded-xl border border-border bg-white p-3">
              <div className="text-[11px] font-semibold text-black/50">ROOMS</div>
              <div className="mt-1 text-sm font-semibold">1 Room</div>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="grid grid-cols-2 gap-3 text-left"
              onClick={() => setCalendarOpen((v) => !v)}
              aria-label="Open calendar"
            >
              <div className="rounded-xl border border-border bg-white p-3">
                <div className="text-[11px] font-semibold text-black/50">CHECK-IN</div>
                <div className="mt-1 text-sm font-semibold">{checkInLabel}</div>
              </div>
              <div className="rounded-xl border border-border bg-white p-3">
                <div className="text-[11px] font-semibold text-black/50">CHECK-OUT</div>
                <div className="mt-1 text-sm font-semibold">{checkOutLabel}</div>
              </div>
            </button>

            {calendarOpen ? (
              <RangeCalendar
                value={range}
                onChange={(next) => setRange(next)}
                cityLabel={cityLabel}
                minDate={new Date()}
              />
            ) : null}

            <div className="rounded-xl border border-border bg-white p-3">
              <div className="text-[11px] font-semibold text-black/50">GUESTS</div>
              <div className="mt-1 text-sm font-semibold">2 Adults</div>
            </div>
            <div className="rounded-xl border border-border bg-white p-3">
              <div className="text-[11px] font-semibold text-black/50">ROOMS</div>
              <div className="mt-1 text-sm font-semibold">1 Room</div>
            </div>
          </>
        )}

        <Separator className="my-2" />

        <div className="grid gap-2 text-sm">
          {isHours ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="text-muted-foreground">
                  {formatCurrency(slotSubtotalInr, "INR")} · {stayHours} hours (room rent, before taxes)
                </div>
                <div className="shrink-0 font-medium">{formatCurrency(slotSubtotalInr, "INR")}</div>
              </div>
              <div className="flex items-center justify-between font-semibold text-foreground">
                <div>Price Before Taxes</div>
                <div className="shrink-0 tabular-nums">{formatCurrency(slotSubtotalInr, "INR")}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Taxes and fees</div>
                <div className="font-medium tabular-nums">{formatCurrency(conciergeInr + occupancyInr, "INR")}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium text-emerald-700">Booking fees</div>
                <div className="font-bold uppercase tracking-wide text-emerald-700">Free</div>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Price After Discounts</div>
                <div className="text-xl font-semibold tabular-nums">{formatCurrency(hoursTotalInr, "INR")}</div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  {formatCurrency(nightInr, "INR")} × {nights} nights
                </div>
                <div className="font-medium">{formatCurrency(roomsSubtotalInr, "INR")}</div>
              </div>
              <div className="flex items-center justify-between font-semibold text-foreground">
                <div>Price Before Taxes</div>
                <div className="shrink-0 tabular-nums">{formatCurrency(roomsSubtotalInr, "INR")}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Taxes and fees</div>
                <div className="font-medium tabular-nums">{formatCurrency(conciergeInr + occupancyInr, "INR")}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium text-emerald-700">Booking fees</div>
                <div className="font-bold uppercase tracking-wide text-emerald-700">Free</div>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Price After Discounts</div>
                <div className="text-xl font-semibold tabular-nums">{formatCurrency(roomsTotalInr, "INR")}</div>
              </div>
            </>
          )}
        </div>

        <Link href="/booking/checkout">
          <Button className="h-11 w-full rounded-xl">RESERVE NOW</Button>
        </Link>

        <div className="flex items-start gap-2 rounded-xl bg-black/5 p-3 text-xs text-muted-foreground">
          <Shield className="mt-0.5 h-4 w-4 text-black/50" />
          <div>
            You won’t be charged yet. Free cancellation available before check‑in.
          </div>
        </div>
      </div>
    </div>
  );
}
