import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Activity = {
  id: string;
  guestName: string;
  guestInitials: string;
  property: string;
  dates: string;
  revenue: string;
  status: "checked-in" | "confirmed" | "pending";
};

const activities: readonly Activity[] = [
  {
    id: "ac_1",
    guestName: "Sophia Reed",
    guestInitials: "SR",
    property: "Ocean Front Villa",
    dates: "Oct 05 – Oct 10, 2023",
    revenue: "$3,200.00",
    status: "checked-in",
  },
  {
    id: "ac_2",
    guestName: "Marcus Bennett",
    guestInitials: "MB",
    property: "Modern Alpine Cabin",
    dates: "Oct 08 – Oct 12, 2023",
    revenue: "$1,850.00",
    status: "confirmed",
  },
  {
    id: "ac_3",
    guestName: "Liam Chen",
    guestInitials: "LC",
    property: "Desert Oasis Retreat",
    dates: "Oct 10 – Oct 15, 2023",
    revenue: "$4,120.00",
    status: "pending",
  },
];

function StatusBadge({ status }: { status: Activity["status"] }) {
  const label =
    status === "checked-in" ? "Checked-in" : status === "confirmed" ? "Confirmed" : "Pending";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "checked-in"
          ? "bg-emerald-50 text-emerald-700"
          : status === "confirmed"
            ? "bg-blue-50 text-blue-700"
            : "bg-black/[0.04] text-black/55",
      )}
    >
      {label}
    </span>
  );
}

function GuestCell({ initials, name }: { initials: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-black/[0.04] text-[11px] font-semibold text-black/60">
        {initials}
      </div>
      <div className="text-sm font-semibold">{name}</div>
    </div>
  );
}

export function HostRecentActivity() {
  return (
    <Card className="border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold">Recent Activity</div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold text-foreground hover:bg-black/[0.04]"
        >
          All Properties <span className="text-black/40">▾</span>
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[1.1fr_1.2fr_0.9fr_0.8fr_0.8fr_44px] gap-3 border-b border-black/5 pb-3 text-[11px] font-semibold tracking-wide text-black/40">
            <div>GUEST</div>
            <div>PROPERTY</div>
            <div>DATES</div>
            <div>REVENUE</div>
            <div>STATUS</div>
            <div />
          </div>

          <div className="divide-y divide-black/5">
            {activities.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-[1.1fr_1.2fr_0.9fr_0.8fr_0.8fr_44px] items-center gap-3 py-4"
              >
                <GuestCell initials={a.guestInitials} name={a.guestName} />
                <div className="text-sm font-semibold">{a.property}</div>
                <div className="text-sm text-black/55">{a.dates}</div>
                <div className="text-sm font-semibold">{a.revenue}</div>
                <div>
                  <StatusBadge status={a.status} />
                </div>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
                  aria-label="Row actions"
                >
                  <span className="text-lg leading-none text-black/45">…</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

