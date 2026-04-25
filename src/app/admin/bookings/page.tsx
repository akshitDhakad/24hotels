import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BookingRow = {
  id: string;
  guest: string;
  property: string;
  host: string;
  dates: string;
  total: string;
  status: "confirmed" | "pending" | "cancelled";
};

const bookings: readonly BookingRow[] = [
  {
    id: "b_10021",
    guest: "Sophia Reed",
    property: "Ocean Front Villa",
    host: "Alexander Thorne",
    dates: "Oct 05 – Oct 10",
    total: "$3,200.00",
    status: "confirmed",
  },
  {
    id: "b_10022",
    guest: "Julian Marc",
    property: "Sky Loft Penthouse",
    host: "Julian Marc",
    dates: "Oct 18 – Oct 22",
    total: "$1,850.00",
    status: "pending",
  },
  {
    id: "b_10024",
    guest: "Elena Rodriguez",
    property: "The Glass House",
    host: "Elena Rodriguez",
    dates: "Oct 12 – Oct 15",
    total: "$2,140.00",
    status: "cancelled",
  },
] as const;

function StatusPill({ status }: { status: BookingRow["status"] }) {
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

export default function AdminBookingsPage() {
  return (
    <AdminSimpleTable
      title="Bookings"
      subtitle="Track reservation lifecycle, disputes and payment status."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
            Export
          </Button>
          <Button className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
            Create booking
          </Button>
        </div>
      }
      columns={[
        { key: "id", header: "BOOKING ID", cell: (r) => <div className="text-sm font-semibold">{r.id}</div> },
        { key: "guest", header: "GUEST", cell: (r) => <div className="text-sm font-semibold">{r.guest}</div> },
        { key: "property", header: "PROPERTY", cell: (r) => <div className="text-sm font-semibold">{r.property}</div> },
        { key: "host", header: "HOST", cell: (r) => <div className="text-sm text-black/55">{r.host}</div> },
        { key: "dates", header: "DATES", cell: (r) => <div className="text-sm text-black/55">{r.dates}</div> },
        { key: "total", header: "TOTAL", cell: (r) => <div className="text-sm font-semibold">{r.total}</div> },
        { key: "status", header: "STATUS", cell: (r) => <StatusPill status={r.status} /> },
        {
          key: "actions",
          header: "",
          className: "text-right",
          cell: () => (
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]"
              aria-label="Row actions"
            >
              <span className="text-lg leading-none text-black/45">…</span>
            </button>
          ),
        },
      ]}
      rows={bookings}
    />
  );
}

