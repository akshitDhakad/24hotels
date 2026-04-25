import { cn } from "@/lib/cn";
import { useBookingModeStore } from "@/store/booking-mode-store";
import { useRouter } from "next/navigation";
import * as React from "react";

type HoursRoomsLinkProps = {
  className?: string;
};

export function HoursRoomsLink({ className }: HoursRoomsLinkProps) {
  const router = useRouter();
  const mode = useBookingModeStore((s) => s.mode);
  const toggle = useBookingModeStore((s) => s.toggle);
  const active = mode === "hours";

  const label = active ? "Hours" : "Rooms";

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        router.push("/hotels");
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition",
        active
          ? "bg-gradient-to-br from-orange-500 to-red-600 text-white hover:brightness-[0.95] active:brightness-[0.9]"
          : "bg-white/60 text-foreground ring-1 ring-black/10 backdrop-blur-md hover:bg-white/70",
        className,
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
