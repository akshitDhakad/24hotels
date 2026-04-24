"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/container";

type CityKey = "Bangalore" | "Mumbai" | "Goa" | "Hyderabad" | "New Delhi";

export type FeaturedHome = {
  id: string;
  name: string;
  image: string;
  score: number; // e.g. 8.5
  stars: number; // 1..5
  neighborhood: string;
  city: CityKey;
  priceInr: number; // per night
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

const cities: CityKey[] = ["Bangalore", "Mumbai", "Goa", "Hyderabad", "New Delhi"];

export function FeaturedHomesSection({
  className,
  title = "Featured homes recommended for you",
  items,
}: {
  className?: string;
  title?: string;
  items: FeaturedHome[];
}) {
  const [activeCity, setActiveCity] = React.useState<CityKey>("Bangalore");

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
          {cities.map((c) => {
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
            <Link
              key={h.id}
              href={`/hotels?destination=${encodeURIComponent(h.city)}`}
              className="group"
            >
              <div className="overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10] bg-muted">
                  <Image
                    src={h.image}
                    alt={h.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow">
                    {h.score.toFixed(1)}
                  </div>
                </div>
                <div className="bg-white pt-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-black/60">
                    {h.name}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-black/60">
                    <div className="flex items-center gap-0.5 text-[#f59e0b]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < h.stars ? "fill-current" : "fill-transparent",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-black/40">•</span>
                    <span>{h.neighborhood}</span>
                    <span className="text-black/40">,</span>
                    <span className="text-primary">{h.city}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-black/45">
                    Per night before taxes and fees
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#b91c1c]">
                    {formatInr(h.priceInr)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

