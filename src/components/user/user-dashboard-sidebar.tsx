import { Bookmark, CalendarDays, LayoutGrid, Settings } from "lucide-react";

import { cn } from "@/lib/cn";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

const navItems: readonly NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "My Bookings", icon: CalendarDays },
  { label: "Saved Properties", icon: Bookmark },
  { label: "Profile Settings", icon: Settings },
];

function Avatar({ name }: { name: string }) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-black/[0.04] text-xs font-semibold text-black/60">
      {initial}
    </div>
  );
}

export function UserDashboardSidebar() {
  return (
    <aside className="hidden border-r border-black/5 bg-white lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)]">
      <div className="flex h-full flex-col p-6">
        <div>
          <div className="text-[10px] font-semibold tracking-wide text-black/40">ACCOUNT LEVEL</div>
          <div className="mt-1 text-sm font-semibold">Elite Member</div>
        </div>

        <nav className="mt-6 grid gap-1">
          {navItems.map((x) => (
            <button
              key={x.label}
              type="button"
              className={cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-black/60 transition hover:bg-black/[0.04] hover:text-foreground",
                x.active && "bg-black/[0.04] text-foreground",
              )}
            >
              <x.icon className={cn("h-4.5 w-4.5", x.active ? "text-foreground" : "text-black/45")} />
              {x.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center gap-3">
            <Avatar name="Julian" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Julian</div>
              <div className="text-xs text-black/45">Member since 2021</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

