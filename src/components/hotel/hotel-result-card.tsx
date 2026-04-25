import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";

import { cn } from "@/lib/cn";

export type HotelResult = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewLabel: string;
  priceUsd: number;
  perks: string[];
  image: string;
  isTopRated?: boolean;
};

export function HotelResultCard({ hotel }: { hotel: HotelResult }) {
  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-md flex flex-col"
    >
      <div className="relative">
        <div className="relative aspect-[16/10] md:aspect-auto md:h-56">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 280px, 100vw"
          />
        </div>

        <Link
          href="/auth/sign-in"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </Link>
        <div
          className="absolute left-3 top-3 inline-flex  items-center justify-center"
          aria-label="Add to wishlist"
        >
          <div className="grid gap-1">
            {hotel.perks.slice(0, 2).map((p) => (
              <div key={p} className="rounded-full bg-white/80 px-1.5 shadow hover:bg-white text-xs text-emerald-700">
                {p}
              </div>
            ))}
          </div>
        </div>

        {hotel.isTopRated ? (
          <div className="absolute bottom-3 left-3 rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white">
            TOP RATED
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{hotel.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{hotel.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2">
              <div className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                {hotel.rating.toFixed(1)}
              </div>
              <div className="text-xs font-semibold text-foreground">
                {hotel.reviewLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1 text-[#f59e0b]">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold text-foreground">4.8</span>
          </div>
          <span className="text-black/20">•</span>
          <span>Luxury Residence</span>
        </div>

        <div className="mt-auto grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="text-right flex items-baseline">
            <div className="text-2xl font-semibold">
              ${hotel.priceUsd.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">/ night</div>
          </div>

          <div className="flex items-end justify-between gap-4 md:flex-col md:items-end md:justify-end">

            <span
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground hover:brightness-[0.92]",
              )}
            >
              View Deal
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

