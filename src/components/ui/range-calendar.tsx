"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";

type DateRange = { start: Date | null; end: Date | null };

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date) {
  const ad = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bd = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return ad < bd;
}

function isAfterDay(a: Date, b: Date) {
  const ad = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bd = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return ad > bd;
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function weekdayIndexSun0(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getDay();
}

function formatMonthYear(d: Date) {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(d);
}

function formatRangeLabel(range: DateRange, cityLabel?: string) {
  if (!range.start || !range.end) return "";
  const nights = Math.max(
    1,
    Math.round(
      (new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate()).getTime() -
        new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate()).getTime()) /
        (24 * 60 * 60 * 1000),
    ),
  );
  const fmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${nights} nights${cityLabel ? ` in ${cityLabel}` : ""}\n${fmt.format(range.start)} - ${fmt.format(range.end)}`;
}

function buildMonthGrid(monthStart: Date) {
  const firstWeekday = weekdayIndexSun0(monthStart);
  const total = daysInMonth(monthStart);
  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= total; day += 1) {
    cells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), day));
  }
  // Pad to complete weeks (6 rows max)
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function RangeCalendar({
  value,
  onChange,
  cityLabel,
  minDate,
}: {
  value: DateRange;
  onChange: (next: DateRange) => void;
  cityLabel?: string;
  minDate?: Date;
}) {
  const [baseMonth, setBaseMonth] = React.useState(() => startOfMonth(value.start ?? new Date()));
  const left = baseMonth;
  const right = addMonths(baseMonth, 1);

  const min = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : null;

  function isDisabled(d: Date) {
    if (!min) return false;
    return isBeforeDay(d, min);
  }

  function isInRange(d: Date) {
    if (!value.start || !value.end) return false;
    return !isBeforeDay(d, value.start) && !isAfterDay(d, value.end);
  }

  function handlePick(d: Date) {
    if (isDisabled(d)) return;
    if (!value.start || (value.start && value.end)) {
      onChange({ start: d, end: null });
      return;
    }
    // start exists, end not yet
    if (isBeforeDay(d, value.start)) {
      onChange({ start: d, end: value.start });
    } else if (isSameDay(d, value.start)) {
      onChange({ start: d, end: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) });
    } else {
      onChange({ start: value.start, end: d });
    }
  }

  const title = formatRangeLabel(value, cityLabel);

  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="whitespace-pre-line text-left">
          <div className="text-lg font-semibold text-foreground">{title.split("\n")[0] || "Select dates"}</div>
          <div className="mt-1 text-sm text-black/50">{title.split("\n")[1] || "Pick check-in and check-out"}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
            aria-label="Previous month"
            onClick={() => setBaseMonth((m) => addMonths(m, -1))}
          >
            <ChevronLeft className="h-4 w-4 text-black/60" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
            aria-label="Next month"
            onClick={() => setBaseMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4 text-black/60" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        {[left, right].map((month) => {
          const cells = buildMonthGrid(month);
          const monthLabel = formatMonthYear(month);
          return (
            <div key={month.toISOString()}>
              <div className="text-center text-sm font-semibold">{monthLabel}</div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-black/35">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {cells.map((d, idx) => {
                  if (!d) return <div key={idx} className="h-10" />;
                  const selectedStart = value.start && isSameDay(d, value.start);
                  const selectedEnd = value.end && isSameDay(d, value.end);
                  const inRange = isInRange(d);
                  const disabled = isDisabled(d);
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      disabled={disabled}
                      onClick={() => handlePick(d)}
                      className={cn(
                        "h-10 rounded-full text-sm font-semibold transition",
                        disabled ? "text-black/20" : "text-foreground hover:bg-black/[0.04]",
                        inRange ? "bg-black/[0.04]" : "",
                        (selectedStart || selectedEnd) ? "bg-black text-white hover:bg-black" : "",
                      )}
                      aria-label={d.toDateString()}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

