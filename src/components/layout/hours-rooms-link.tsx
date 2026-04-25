import Link from "next/link";

import { cn } from "@/lib/cn";

type HoursRoomsLinkProps = {
  className?: string;
};

export function HoursRoomsLink({ className }: HoursRoomsLinkProps) {
  return (
    <Link
      href="/hotels"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition",
        "bg-gradient-to-br from-orange-500 to-red-600 hover:brightness-[0.95] active:brightness-[0.9]",
        className,
      )}
    >
      Hours Rooms
    </Link>
  );
}
