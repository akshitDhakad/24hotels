"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type HotelRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
};

type StatusBadge = { label: string; className: string };

function getStatusBadge(h: Pick<HotelRow, "isActive" | "isVerified">): StatusBadge {
  // With current schema, we can derive 3 useful states reliably:
  // - Draft: not active yet (host still editing)
  // - Pending review: active but not verified
  // - Verified: active + verified
  if (!h.isActive) return { label: "Draft", className: "bg-black/[0.04] text-black/60" };
  if (!h.isVerified) return { label: "Pending review", className: "bg-amber-50 text-amber-800" };
  return { label: "Verified", className: "bg-emerald-50 text-emerald-800" };
}

function StatusPill({ hotel }: { hotel: Pick<HotelRow, "isActive" | "isVerified"> }) {
  const s = getStatusBadge(hotel);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

export function HostListingsClient({ initialHotels }: { initialHotels: HotelRow[] }) {
  const [hotels, setHotels] = React.useState<HotelRow[]>(initialHotels);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onDelete(id: string) {
    setError(null);
    setDeletingId(id);
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
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {hotels.length === 0 ? (
          <Card className="border-black/5 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold">No properties yet</div>
            <div className="mt-1 text-sm text-black/50">
              Add your first property to start receiving bookings.
            </div>
          </Card>
        ) : (
          hotels.map((h) => (
            <Card key={h.id} className="border-black/5 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-base font-semibold">{h.name}</div>
                    <StatusPill hotel={h} />
                  </div>
                  <div className="mt-1 text-sm text-black/50">
                    {h.city}, {h.country}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-black/45">
                    {h.isVerified ? "Verified" : "Not verified"} •{" "}
                    {h.isActive ? "Active" : "Draft"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-xl border-black/10 bg-white px-4"
                  >
                    <Link href={`/host/listings/${h.id}/edit`}>Edit</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={deletingId === h.id}
                    className="h-10 rounded-xl border-red-200 bg-white px-4 text-red-700 hover:bg-red-50"
                    onClick={() => void onDelete(h.id)}
                  >
                    {deletingId === h.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

