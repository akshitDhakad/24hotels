"use client";

import * as React from "react";
import Link from "next/link";

import { HotelListingCard } from "@/components/hotel/hotel-listing-card";
import { hotelSummaryToListing } from "@/features/hotels/hotel-listing-mappers";
import type { HotelSummaryDto } from "@/features/hotels/hotels-api";
import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/container";

export function FeaturedHomesSection({
  className,
  title = "Featured homes recommended for you",
  items,
}: {
  className?: string;
  title?: string;
  items: HotelSummaryDto[];
}) {
  const cities = React.useMemo(() => {
    const set = new Set<string>();
    for (const h of items) {
      const city = h.city ? h.city.trim() : "";
      if (city) set.add(city);
    }
    return Array.from(set);
  }, [items]);

  const [activeCity, setActiveCity] = React.useState<string>(() => cities[0] ?? "");
  const resolvedCity = activeCity || cities[0] || "";

  const filtered = React.useMemo(
    () => items.filter((x) => x.city === resolvedCity),
    [items, resolvedCity],
  );

  return (
    <section className={cn("bg-white", className)}>
      <Container className="py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold tracking-tight">{title}</div>
          <Link
            href={`/hotels?destination=${encodeURIComponent(resolvedCity)}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            See more ({resolvedCity}) properties →
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
          {cities.map((c) => {
            const isActive = c === resolvedCity;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCity(c)}
                className={cn(
                  "relative pb-2 text-sm font-medium text-black/55 hover:text-black",
                  isActive ? "text-primary" : "",
                )}
              >
                {c}
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {filtered.slice(0, 3).map((h) => (
            <HotelListingCard
              key={h.id}
              listing={hotelSummaryToListing(h)}
              imageSizes="(min-width: 768px) 33vw, 100vw"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
