"use client";

import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, ChevronDown, HelpCircle, LogOut, Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { getUserPrimaryLabel } from "@/lib/session-display";

function Avatar({ name }: { name: string }) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <div
      className="grid h-9 w-9 place-items-center rounded-full bg-black/5 text-xs font-semibold text-black/70"
      aria-label={`${name} avatar`}
    >
      {initial}
    </div>
  );
}

export function HostDashboardTopbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data } = useSession();
  const displayName = getUserPrimaryLabel(data?.user);
  const title = React.useMemo(() => {
    if (pathname.startsWith("/host/listings")) return "Listings";
    if (pathname.startsWith("/host/reservations")) return "Reservations";
    if (pathname.startsWith("/host/earnings")) return "Earnings";
    if (pathname.startsWith("/host/settings")) return "Settings";
    return "Dashboard";
  }, [pathname]);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        className,
      )}
    >
      <div className="flex h-16 items-center gap-4 px-5 sm:px-8">
        <div className="text-sm font-semibold text-foreground">{title}</div>

        <div className="relative ml-2 hidden max-w-xl flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <Input
            placeholder="Search bookings, guests..."
            className="h-10 rounded-xl border-black/10 bg-[#f7f7f8] pl-9 focus-visible:ring-black/10"
            aria-label="Search bookings, guests"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-black/60" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4 text-black/60" />
          </button>

          <div className="relative ml-2" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 hover:bg-black/[0.02]"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open profile menu"
            >
              <div className="text-right leading-tight">
                <div className="max-w-[160px] truncate text-xs font-semibold">{displayName}</div>
                <div className="text-[10px] font-semibold tracking-wide text-black/35">HOST</div>
              </div>
              <Avatar name={displayName} />
              <ChevronDown className="h-4 w-4 text-black/45" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-black/10 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-black/70 hover:bg-black/[0.04]"
                  onClick={() => void signOut({ callbackUrl: "/auth/sign-in" })}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

