import Link from "next/link";
import { Bell, Heart, User } from "lucide-react";

import { cn } from "@/lib/cn";

export function UserDashboardTopbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 border-b border-black/5 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        className,
      )}
    >
      <div className="flex h-full items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          LuxeStay
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-medium text-black/50 md:flex">
          <Link href="#" className="hover:text-foreground">
            Explore
          </Link>
          <Link href="#" className="hover:text-foreground">
            Destinations
          </Link>
          <Link href="#" className="hover:text-foreground">
            Offers
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-black/55" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
            aria-label="Saved"
          >
            <Heart className="h-4 w-4 text-black/55" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
            aria-label="Account"
          >
            <User className="h-4 w-4 text-black/55" />
          </button>
        </div>
      </div>
    </header>
  );
}

