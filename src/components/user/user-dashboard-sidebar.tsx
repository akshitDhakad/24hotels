"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Bookmark, CalendarDays, LayoutGrid, Settings } from "lucide-react";

import type { UserNavAccount } from "@/lib/legacy-server/services/user-dashboard.service";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Dashboard", href: "/user/dashboard", icon: LayoutGrid },
  { label: "My Bookings", href: "/user/bookings", icon: CalendarDays },
  { label: "Saved Properties", href: "/user/wishlist", icon: Bookmark },
  { label: "Profile Settings", href: "/user/settings", icon: Settings },
] as const;

function Avatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  if (imageUrl) {
    return (
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-black/[0.04]">
        <Image src={imageUrl} alt="" fill className="object-cover" sizes="36px" />
      </div>
    );
  }
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/[0.04] text-xs font-semibold text-black/60">
      {initial}
    </div>
  );
}

export function UserDashboardSidebar({ account }: { account: UserNavAccount }) {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-black/5 bg-white lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)]">
      <div className="flex h-full flex-col p-6">
        <div>
          <div className="text-[10px] font-semibold tracking-wide text-black/40">ACCOUNT LEVEL</div>
          <div className="mt-1 text-sm font-semibold">{account.membershipLabel}</div>
        </div>

        <nav className="mt-6 grid gap-1" aria-label="Account">
          {navItems.map((x) => {
            const active = pathname === x.href || (x.href !== "/user/dashboard" && pathname.startsWith(x.href));
            return (
              <Link
                key={x.href}
                href={x.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-black/60 transition hover:bg-black/[0.04] hover:text-foreground",
                  active && "bg-black/[0.04] text-foreground",
                )}
              >
                <x.icon className={cn("h-4.5 w-4.5", active ? "text-foreground" : "text-black/45")} />
                {x.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center gap-3">
            <Avatar name={account.displayName} imageUrl={account.image} />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold">{account.displayName}</div>
              <div className="text-xs text-black/45">Member since {account.memberSinceYear}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
