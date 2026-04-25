"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, MapPin, Minus, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/cn";
import { useSearchStore } from "@/store/search-store";
import {
  searchFormSchema,
  type SearchFormValues,
} from "@/utils/validation/search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="w-8 text-center text-sm font-medium">{value}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { params, setParams } = useSearchStore();

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

  const values = form.watch();

  function onSubmit(v: SearchFormValues) {
    setParams(v);
    const sp = new URLSearchParams();
    sp.set("destination", v.destination);
    if (v.checkIn) sp.set("checkIn", v.checkIn);
    if (v.checkOut) sp.set("checkOut", v.checkOut);
    sp.set("adults", String(v.adults));
    sp.set("children", String(v.children));
    sp.set("rooms", String(v.rooms));
    sp.set("currency", v.currency);
    router.push(`/hotels?${sp.toString()}`);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        "w-full rounded-xl border border-border bg-white/90 p-3 shadow-lg backdrop-blur",
        className,
      )}
    >
      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr_auto] lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-4 w-4" />
            LOCATION
          </div>
          <Input
            placeholder="Where are you going?"
            {...form.register("destination")}
          />
          {form.formState.errors.destination ? (
            <div className="mt-1 text-xs text-red-600">
              {form.formState.errors.destination.message}
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            CHECK IN
          </div>
          <Input type="date" {...form.register("checkIn")} />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            CHECK OUT
          </div>
          <Input type="date" {...form.register("checkOut")} />
          {form.formState.errors.checkOut ? (
            <div className="mt-1 text-xs text-red-600">
              {form.formState.errors.checkOut.message}
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-input bg-background px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Users className="h-4 w-4" />
            GUESTS & ROOMS
          </div>
          <div className="grid gap-3">
            <Stepper
              value={values.adults}
              onChange={(v) => form.setValue("adults", v, { shouldDirty: true })}
              min={1}
              max={10}
              label="Adults"
            />
            <Stepper
              value={values.children}
              onChange={(v) =>
                form.setValue("children", v, { shouldDirty: true })
              }
              min={0}
              max={10}
              label="Children"
            />
            <Stepper
              value={values.rooms}
              onChange={(v) => form.setValue("rooms", v, { shouldDirty: true })}
              min={1}
              max={10}
              label="Rooms"
            />
          </div>
        </div>

        <Button className="h-11 rounded-xl px-8" type="submit">
          Search
        </Button>
      </div>
    </form>
  );
}

