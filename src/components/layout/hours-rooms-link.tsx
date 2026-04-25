"use client";

import { Clock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/cn";
import { useBookingModeStore } from "@/store/booking-mode-store";

type HoursRoomsLinkProps = {
  className?: string;
};

function isHotelDetailPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /^\/hotels\/[^/]+$/.test(pathname);
}

export function HoursRoomsLink({ className }: HoursRoomsLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const mode = useBookingModeStore((s) => s.mode);
  const toggle = useBookingModeStore((s) => s.toggle);
  const active = mode === "hours";

  const label = active ? "Hours" : "Hour Rooms";

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        if (!isHotelDetailPath(pathname)) {
          router.push("/hotels");
        }
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition",
        active
          ? "bg-gradient-to-br from-orange-500 to-red-600 text-white hover:brightness-[0.95] active:brightness-[0.9]"
          : "bg-white/60 text-foreground ring-1 ring-black/10 backdrop-blur-md hover:bg-white/70",
        className,
      )}
      aria-pressed={active}
      aria-label={active ? "Hours rates (active). Switch to rooms." : "Rooms rates. Switch to hours."}
    >
      {active ? <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
      {label}
    </button>
  );
}
