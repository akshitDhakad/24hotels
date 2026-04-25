import { Bell, HelpCircle, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

function Avatar({ name }: { name: string }) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-black/5 text-xs font-semibold text-black/70">
      {initial}
    </div>
  );
}

export function AdminTopbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        className,
      )}
    >
      <div className="flex h-16 items-center gap-4 px-5 sm:px-8">
        <div className="text-sm font-semibold text-foreground">Admin</div>

        <div className="relative ml-2 hidden max-w-xl flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <Input
            placeholder="Search hosts, users, bookings..."
            className="h-10 rounded-xl border-black/10 bg-[#f7f7f8] pl-9 focus-visible:ring-black/10"
            aria-label="Search hosts, users, bookings"
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

          <div className="ml-2 flex items-center gap-3 rounded-full border border-black/10 bg-white px-2 py-1.5">
            <div className="text-right leading-tight">
              <div className="text-xs font-semibold">Admin</div>
              <div className="text-[10px] font-semibold tracking-wide text-black/35">FULL ACCESS</div>
            </div>
            <Avatar name="Admin" />
          </div>
        </div>
      </div>
    </header>
  );
}

