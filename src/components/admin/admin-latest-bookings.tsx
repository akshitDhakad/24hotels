import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Booking = {
  id: string;
  guest: string;
  property: string;
  dates: string;
  amount: string;
  status: "confirmed" | "pending" | "cancelled";
};

const bookings: readonly Booking[] = [
  {
    id: "b_10021",
    guest: "Sophia Reed",
    property: "Ocean Front Villa",
    dates: "Oct 05 – Oct 10",
    amount: "$3,200.00",
    status: "confirmed",
  },
  {
    id: "b_10022",
    guest: "Julian Marc",
    property: "Sky Loft Penthouse",
    dates: "Oct 18 – Oct 22",
    amount: "$1,850.00",
    status: "pending",
  },
  {
    id: "b_10023",
    guest: "Elena Rodriguez",
    property: "The Glass House",
    dates: "Oct 12 – Oct 15",
    amount: "$2,140.00",
    status: "confirmed",
  },
] as const;

function StatusPill({ status }: { status: Booking["status"] }) {
  const label = status === "confirmed" ? "Confirmed" : status === "pending" ? "Pending" : "Cancelled";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "confirmed"
          ? "bg-emerald-50 text-emerald-700"
          : status === "pending"
            ? "bg-black/[0.04] text-black/55"
            : "bg-rose-50 text-rose-700",
      )}
    >
      {label}
    </span>
  );
}

export function AdminLatestBookings() {
  return (
    <Card className="border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Latest Bookings</div>
          <div className="mt-1 text-xs text-black/45">Recent activity across the platform</div>
        </div>
        <button type="button" className="text-xs font-semibold text-black/50 hover:text-foreground">
          View all
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[1.1fr_1.3fr_0.9fr_0.8fr_0.8fr_44px] gap-3 border-b border-black/5 pb-3 text-[11px] font-semibold tracking-wide text-black/40">
            <div>GUEST</div>
            <div>PROPERTY</div>
            <div>DATES</div>
            <div>AMOUNT</div>
            <div>STATUS</div>
            <div />
          </div>

          <div className="divide-y divide-black/5">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-[1.1fr_1.3fr_0.9fr_0.8fr_0.8fr_44px] items-center gap-3 py-4"
              >
                <div className="text-sm font-semibold">{b.guest}</div>
                <div className="text-sm font-semibold">{b.property}</div>
                <div className="text-sm text-black/55">{b.dates}</div>
                <div className="text-sm font-semibold">{b.amount}</div>
                <div>
                  <StatusPill status={b.status} />
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

