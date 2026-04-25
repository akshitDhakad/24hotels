import Link from "next/link";
import {
  Building2,
  CalendarDays,
  CreditCard,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

const navItems: readonly NavItem[] = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutGrid, active: true },
  { href: "/admin/hosts", label: "Hosts", icon: ShieldCheck },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/revenue", label: "Revenue", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold">24 Hotels</div>
        <div className="text-[11px] font-semibold tracking-wide text-black/40">ADMIN CONSOLE</div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden border-r border-black/5 bg-white lg:sticky lg:top-0 lg:block lg:h-screen">
      <div className="flex h-full flex-col p-6">
        <BrandMark />

        <nav className="mt-8 grid gap-1 overflow-auto pr-1">
          {navItems.map((x) => (
            <Link
              key={x.href}
              href={x.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-black/60 transition hover:bg-black/[0.04] hover:text-foreground",
                x.active && "bg-black/[0.04] text-foreground",
              )}
            >
              <x.icon className={cn("h-4.5 w-4.5", x.active ? "text-foreground" : "text-black/45")} />
              {x.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <Button className="h-11 w-full justify-start rounded-xl bg-black px-4 text-white hover:bg-black/90">
            <span className="mr-2 text-lg leading-none">+</span>
            Create Admin Task
          </Button>
        </div>
      </div>
    </aside>
  );
}

