"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type HotelRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  location: string | null;
  image: string | null;
  priceUsd: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date | string;
};

type ListingVisualStatus = "verified" | "pending" | "blocked";

function getListingVisualStatus(h: Pick<HotelRow, "isActive" | "isVerified">): { status: ListingVisualStatus; label: string } {
  if (h.isActive && h.isVerified) return { status: "verified", label: "Verified" };
  if (!h.isActive && h.isVerified) return { status: "blocked", label: "Blocked" };
  if (h.isActive && !h.isVerified) return { status: "pending", label: "Pending" };
  return { status: "pending", label: "Draft" };
}

function statusBadgeStyles(status: ListingVisualStatus) {
  if (status === "verified") {
    return "border-emerald-200 bg-emerald-100 text-emerald-900";
  }
  if (status === "blocked") {
    return "border-red-200 bg-red-100 text-red-900";
  }
  return "border-amber-200 bg-amber-100 text-amber-950";
}

function formatListingInr(price: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}

function ListingCard({
  hotel,
  deleting,
  onDelete,
}: {
  hotel: HotelRow;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  const { status, label } = getListingVisualStatus(hotel);
  const line = hotel.location?.trim() || `${hotel.city}, ${hotel.country}`;
  const img = hotel.image?.trim() || null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-black/[0.06] to-black/[0.02]">
        {img ? (
          <Image src={img} alt={hotel.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-black/35">No photo</div>
        )}

        <div className="absolute left-3 top-3 z-10">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-[2px]",
              statusBadgeStyles(status),
            )}
          >
            {label}
          </span>
        </div>

        <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5">
          <Link
            href={`/host/listings/${hotel.id}/edit`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-white/95 text-blue-600 shadow-sm transition hover:bg-blue-50"
            aria-label={`Edit ${hotel.name}`}
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
          </Link>
          <button
            type="button"
            disabled={deleting}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white/95 text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
            aria-label={deleting ? "Deleting…" : `Delete ${hotel.name}`}
            onClick={() => onDelete(hotel.id)}
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-bold uppercase tracking-wide text-[#0a2540]">{hotel.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs font-medium text-black/55">{line}</p>
        <p className="mt-0.5 text-[11px] text-black/40">
          {hotel.city}
          <span className="text-black/25"> · </span>
          <span className="text-blue-700">{hotel.country}</span>
        </p>
        <div className="mt-3 border-t border-black/[0.06] pt-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-black/40">Per night before taxes and fees</p>
          <p className="mt-0.5 text-lg font-bold text-[#8b1538]">
            {formatListingInr(hotel.priceUsd)}
            <span className="text-xs font-semibold text-black/45"> /night</span>
          </p>
        </div>
      </div>
    </article>
  );
}

export function HostListingsClient({ initialHotels }: { initialHotels: HotelRow[] }) {
  const [hotels, setHotels] = React.useState<HotelRow[]>(initialHotels);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function onDelete(id: string) {
    setError(null);
    setDeletingId(id);
    void (async () => {
      try {
        const res = await fetch(`/api/v1/host/hotels/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const json = (await res.json().catch(() => null)) as { message?: string } | null;
          setError(json?.message ?? "Could not delete property.");
          return;
        }
        setHotels((prev) => prev.filter((h) => h.id !== id));
      } finally {
        setDeletingId(null);
      }
    })();
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Listings</div>
          <div className="mt-1 text-sm text-black/50">Create and manage your properties.</div>
        </div>
        <Button asChild className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
          <Link href="/host/listings/new">Add New Property</Link>
        </Button>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">{error}</div>
      ) : null}

      <div className="mt-6">
        {hotels.length === 0 ? (
          <Card className="border-black/5 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold">No properties yet</div>
            <div className="mt-1 text-sm text-black/50">Add your first property to start receiving bookings.</div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {hotels.map((h) => (
              <ListingCard key={h.id} hotel={h} deleting={deletingId === h.id} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
