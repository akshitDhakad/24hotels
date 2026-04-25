"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  MapPin,
  Minus,
  Plus,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";

import { cn } from "@/lib/cn";
import { useHotelsResultsStore } from "@/store/hotels-results-store";
import { useSearchStore } from "@/store/search-store";
import {
  searchFormSchema,
  type SearchFormValues,
} from "@/utils/validation/search";

function Stepper({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-white/70">{label}</div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="w-6 text-center text-sm font-semibold text-white">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const pillFilters = ["Hotels", "Villas", "Apartments", "Resorts", "Cottages"];

export function HeroSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const { params, setParams } = useSearchStore();
  const resetPaging = useHotelsResultsStore((s) => s.resetPaging);
  const [guestsOpen, setGuestsOpen] = React.useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      destination: params.destination,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: params.adults,
      children: params.children,
      rooms: params.rooms,
      currency: params.currency,
    },
    mode: "onChange",
  });

  const values = useWatch({ control: form.control });
  const adults = values.adults ?? 1;
  const children = values.children ?? 0;
  const rooms = values.rooms ?? 1;

  function onSubmit(v: SearchFormValues) {
    setParams(v);
    resetPaging();
    const sp = new URLSearchParams();
    sp.set("destination", v.destination);
    if (v.checkIn) sp.set("checkIn", v.checkIn);
    if (v.checkOut) sp.set("checkOut", v.checkOut);
    sp.set("adults", String(v.adults));
    sp.set("children", String(v.children));
    sp.set("rooms", String(v.rooms));
    sp.set("currency", v.currency);
    sp.set("page", "1");
    router.push(`/hotels?${sp.toString()}`);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        "rounded-xl border border-black/10 bg-white/85 p-4 shadow-2xl backdrop-blur-md",
        className,
      )}
    >
      <div className="grid gap-3 lg:grid-cols-[1.1fr_1.3fr_1fr_auto] lg:items-center">
        {/* Location */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-black/50">
            <MapPin className="h-4 w-4" />
            LOCATION
          </div>
          <div className="rounded-xl bg-primary px-4 py-3">
            <input
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
              placeholder="Where are you going?"
              {...form.register("destination")}
            />
          </div>
        </div>

        {/* Dates */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-black/50">
            <CalendarDays className="h-4 w-4" />
            CHECK-IN AND CHECK-OUT DATE
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/70 p-2">
            <input
              className="h-11 rounded-lg bg-white px-4 text-sm outline-none placeholder:text-black/35"
              placeholder="dd-mm-yyyy"
              {...form.register("checkIn")}
            />
            <input
              className="h-11 rounded-lg bg-white px-4 text-sm outline-none placeholder:text-black/35"
              placeholder="dd-mm-yyyy"
              {...form.register("checkOut")}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-black/50">
            <Users className="h-4 w-4" />
            GUESTS AND ROOMS
          </div>

          <button
            type="button"
            onClick={() => setGuestsOpen((v) => !v)}
            className="flex h-[54px] w-full items-center justify-between rounded-xl bg-white/70 px-4 text-sm text-black"
          >
            <div>
              {adults + children} guests, {rooms} room
            </div>
            <span className="text-black/40">▾</span>
          </button>

          {guestsOpen ? (
            <div className="absolute right-0 top-[72px] z-20 w-[260px] rounded-xl bg-primary/95 p-4 shadow-2xl backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-semibold text-white/80">
                  GUESTS & ROOMS
                </div>
                <button
                  type="button"
                  className="text-xs text-white/60 hover:text-white"
                  onClick={() => setGuestsOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="grid gap-3">
                <Stepper
                  value={adults}
                  onChange={(v) =>
                    form.setValue("adults", v, { shouldDirty: true })
                  }
                  min={1}
                  max={10}
                  label="Adults"
                />
                <Stepper
                  value={children}
                  onChange={(v) =>
                    form.setValue("children", v, { shouldDirty: true })
                  }
                  min={0}
                  max={10}
                  label="Children"
                />
                <Stepper
                  value={rooms}
                  onChange={(v) =>
                    form.setValue("rooms", v, { shouldDirty: true })
                  }
                  min={1}
                  max={10}
                  label="Rooms"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Search */}
        <button
          type="submit"
          className="mt-5 inline-flex h-[54px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-[0.92] lg:mt-0"
        >
          Search
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="mr-1 inline-flex items-center gap-2 text-xs font-semibold text-black/60">
          <SlidersHorizontal className="h-4 w-4" />
          Filter:
        </div>
        {pillFilters.map((f) => (
          <button
            key={f}
            type="button"
            className={cn(
              "rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/70 hover:bg-black/5",
              f === "Hotels"
                ? "border-transparent bg-primary text-primary-foreground hover:brightness-[0.92]"
                : "",
            )}
          >
            {f}
          </button>
        ))}
      </div>
    </form>
  );
}

