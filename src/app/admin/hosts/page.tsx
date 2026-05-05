import { BadgeCheck, ShieldAlert } from "lucide-react";

import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/prisma";

type HostRow = {
  id: string;
  name: string;
  email: string;
  status: "verified" | "review";
  properties: number;
  revenue: string;
};

function formatInrFromPaise(paise: number) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(rupees);
}

function StatusPill({ status }: { status: HostRow["status"] }) {
  const label = status === "verified" ? "Verified" : "Needs review";
  const Icon = status === "verified" ? BadgeCheck : ShieldAlert;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

export default async function AdminHostsPage() {
  const hosts = await prisma.user.findMany({
    where: { role: "HOST", deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      hostKyc: { select: { status: true } },
      _count: { select: { hotels: { where: { deletedAt: null } } } },
      hotels: {
        where: { deletedAt: null },
        select: { bookings: { select: { payment: { select: { amount: true, status: true } } } } },
      },
    },
  });

  const rows: HostRow[] = hosts.map((h) => {
    let revenuePaise = 0;
    for (const hotel of h.hotels) {
      for (const b of hotel.bookings) {
        if (b.payment?.status === "PAID") revenuePaise += b.payment.amount;
      }
    }

    const status: HostRow["status"] = h.hostKyc?.status === "VERIFIED" ? "verified" : "review";
    return {
      id: h.id,
      name: h.name?.trim() || "Host",
      email: h.email,
      status,
      properties: h._count.hotels,
      revenue: formatInrFromPaise(revenuePaise),
    };
  });

  return (
    <AdminSimpleTable
      title="Hosts"
      subtitle="Verify hosts, monitor performance, and handle compliance."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
            Export
          </Button>
          <Button className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
            Add host
          </Button>
        </div>
      }
      columns={[
        {
          key: "name",
          header: "HOST",
          cell: (r) => <div className="text-sm font-semibold">{r.name}</div>,
        },
        {
          key: "email",
          header: "EMAIL",
          cell: (r) => <div className="text-sm text-black/55">{r.email}</div>,
        },
        {
          key: "status",
          header: "STATUS",
          cell: (r) => <StatusPill status={r.status} />,
        },
        {
          key: "properties",
          header: "PROPERTIES",
          cell: (r) => <div className="text-sm font-semibold">{r.properties}</div>,
        },
        {
          key: "revenue",
          header: "REVENUE",
          cell: (r) => <div className="text-sm font-semibold">{r.revenue}</div>,
        },
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

