import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/prisma";

type BookingRow = {
  id: string;
  guest: string;
  property: string;
  host: string;
  dates: string;
  total: string;
  status: "confirmed" | "pending" | "cancelled";
};

function formatInrFromPaise(paise: number) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(rupees);
}

function formatRange(start: Date, end: Date) {
  const fmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

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

export default async function AdminBookingsPage() {
  const rows: BookingRow[] = (
    await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        bookingRef: true,
        status: true,
        startTime: true,
        endTime: true,
        finalAmount: true,
        user: { select: { name: true, email: true } },
        hotel: { select: { name: true, owner: { select: { name: true, email: true } } } },
      },
    })
  ).map((b) => {
    const guestName = b.user.name?.trim() || b.user.email;
    const hostName = b.hotel.owner.name?.trim() || b.hotel.owner.email;
    const status: BookingRow["status"] =
      b.status === "CONFIRMED" || b.status === "COMPLETED"
        ? "confirmed"
        : b.status === "CANCELLED" || b.status === "EXPIRED"
          ? "cancelled"
          : "pending";

    return {
      id: b.bookingRef,
      guest: guestName,
      property: b.hotel.name,
      host: hostName,
      dates: formatRange(b.startTime, b.endTime),
      total: formatInrFromPaise(b.finalAmount),
      status,
    };
  });

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
      rows={rows}
    />
  );
}

