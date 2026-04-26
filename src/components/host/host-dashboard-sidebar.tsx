"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Building2, CalendarDays, DollarSign, LayoutGrid, ListChecks, Settings, User } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { VerifiedPill } from "@/components/ui/verified-pill";
import { cn } from "@/lib/cn";
import { getUserPrimaryLabel, getUserSecondaryLabel } from "@/lib/session-display";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const navItems: readonly NavItem[] = [
  { label: "Overview", icon: LayoutGrid, href: "/host/dashboard" },
  { label: "Listings", icon: Building2, href: "/host/listings" },
  { label: "Reservations", icon: CalendarDays, href: "/host/reservations" },
  { label: "Earnings", icon: DollarSign, href: "/host/earnings" },
  { label: "Profile", icon: User, href: "/host/profile" },
  { label: "Settings", icon: Settings, href: "/host/settings" },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white">
        <ListChecks className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold">24 Hotels</div>
        <div className="text-[11px] font-semibold tracking-wide text-black/40">HOST MANAGEMENT</div>
      </div>
    </div>
  );
}

export function HostDashboardSidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  const displayName = getUserPrimaryLabel(data?.user);
  const secondary = getUserSecondaryLabel(data?.user);
  const emailVerified = data?.user?.emailVerified === true;
  const phoneVerified = data?.user?.phoneVerified === true;
  return (
    <aside className="hidden border-r border-black/5 bg-white lg:sticky lg:top-0 lg:block lg:h-screen">
      <div className="flex h-full flex-col p-6">
        <BrandMark />
        <div className="mt-6 rounded-2xl border border-black/10 bg-[#f7f7f8] px-4 py-3">
          <div className="truncate text-sm font-semibold text-foreground">{displayName}</div>
          {secondary ? <div className="mt-0.5 truncate text-[11px] font-semibold text-black/45">{secondary}</div> : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {emailVerified ? <VerifiedPill label="Verified" title="Email verified" /> : null}
            {phoneVerified ? <VerifiedPill label="Verified" title="Phone verified" /> : null}
          </div>
        </div>

        <nav className="mt-8 grid gap-1 overflow-auto pr-1">
          {navItems.map((x) => {
            const active = pathname === x.href || pathname.startsWith(`${x.href}/`);
            return (
              <Link
                key={x.label}
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

        <div className="mt-auto pt-6">
          <Button
            className="h-11 w-full justify-start rounded-xl bg-black px-4 text-white hover:bg-black/90"
            asChild
          >
            <Link href="/host/listings/new">
              <span className="mr-2 text-lg leading-none">+</span>
              Add New Property
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}

