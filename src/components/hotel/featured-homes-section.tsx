"use client";

import * as React from "react";
import Link from "next/link";

import { HotelListingCard } from "@/components/hotel/hotel-listing-card";
import { featuredHomeToListing } from "@/features/hotels/hotel-listing-mappers";
import {
  FEATURED_HOME_CITIES,
  type FeaturedHome,
  type FeaturedHomeCity,
} from "@/features/landing/featured-homes";
import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/container";

export type { FeaturedHome } from "@/features/landing/featured-homes";

export function FeaturedHomesSection({
  className,
  title = "Featured homes recommended for you",
  items,
}: {
  className?: string;
  title?: string;
  items: FeaturedHome[];
}) {
  const [activeCity, setActiveCity] = React.useState<FeaturedHomeCity>("Bangalore");

  const filtered = React.useMemo(
    () => items.filter((x) => x.city === activeCity),
    [items, activeCity],
  );

  return (
    <section className={cn("bg-white", className)}>
      <Container className="py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold tracking-tight">{title}</div>
          <Link
            href={`/hotels?destination=${encodeURIComponent(activeCity)}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            See more ({activeCity}) properties →
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
          {FEATURED_HOME_CITIES.map((c) => {
            const isActive = c === activeCity;
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
              listing={featuredHomeToListing(h)}
              imageSizes="(min-width: 768px) 33vw, 100vw"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
