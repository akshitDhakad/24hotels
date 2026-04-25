"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import type { HotelListingCardData, HotelListingPrice } from "@/features/hotels/hotel-listing-types";
import { cn } from "@/lib/cn";

function formatListingPrice(price: HotelListingPrice): string {
  if (price.currency === "INR") {
    return `₹${price.amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price.amount);
}

export type HotelListingCardProps = {
  listing: HotelListingCardData;
  className?: string;
  /** Passed to `next/image` `sizes` */
  imageSizes?: string;
};

export function HotelListingCard({
  listing: L,
  className,
  imageSizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
}: HotelListingCardProps) {
  const hasWishlist = Boolean(L.wishlistHref);
  const badges = L.imageBadges?.slice(0, 2) ?? [];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl transition-shadow",
        className,
      )}
    >
      <Link href={L.href} className="group block text-left">
        <div className="relative aspect-[16/10] bg-muted">
          <Image
            src={L.image}
            alt={L.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={imageSizes}
          />

          {badges.length > 0 ? (
            <div className="absolute left-3 top-3 z-10 flex max-w-[min(100%,14rem)] flex-col gap-1">
              {badges.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-teal-700 shadow-sm ring-1 ring-black/[0.06]"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}

          {L.ribbonBadge ? (
            <div className="absolute bottom-3 left-3 z-10 rounded-full bg-black/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {L.ribbonBadge}
            </div>
          ) : null}

          <div
            className={cn(
              "absolute top-3 z-10 rounded bg-[#1a4fa3] px-2 py-1 text-sm font-bold text-white shadow-sm",
              hasWishlist ? "right-14" : "right-3",
            )}
          >
            {L.scoreBadge.toFixed(1)}
          </div>
        </div>

        <div className="space-y-2 py-2">
          <div className="text-[11px] font-medium uppercase leading-snug tracking-wide text-slate-700 sm:text-xs">
            {L.name}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-black/60">
            <div className="flex items-center gap-0.5 text-[#f59e0b]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < L.stars ? "fill-current" : "fill-transparent",
                  )}
                />
              ))}
            </div>
            <span className="text-black/40">•</span>
            <span>{L.neighborhood}</span>
            <span className="text-black/40">,</span>
            <span className="font-medium text-primary">{L.city}</span>
          </div>

          <div className="text-[11px] text-gray-500">
            Per night before taxes and fees
          </div>

          <div className="text-base font-bold text-[#8b2020]">{formatListingPrice(L.price)}</div>
        </div>
      </Link>

      {L.wishlistHref ? (
        <Link
          href={L.wishlistHref}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md ring-1 ring-black/10 transition hover:bg-white"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
