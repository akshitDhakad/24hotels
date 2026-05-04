import { Building2 } from "lucide-react";

import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { AdminPropertyActions } from "@/components/admin/admin-property-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { prisma } from "@/server/config/database";

type PropertyRow = {
  id: string;
  name: string;
  slug: string;
  city: string;
  host: string;
  ownerId: string;
  isActive: boolean;
  isVerified: boolean;
  status: "live" | "paused" | "pending";
  nightlyInr: number;
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function StatusPill({ status }: { status: PropertyRow["status"] }) {
  const label = status === "live" ? "Live" : status === "pending" ? "Pending" : "Paused";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "live"
          ? "bg-emerald-50 text-emerald-700"
          : status === "pending"
            ? "bg-amber-50 text-amber-800"
            : "bg-black/[0.04] text-black/55",
      )}
    >
      {label}
    </span>
  );
}

export default async function AdminPropertiesPage() {
  const hotels = await prisma.hotel.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      priceUsd: true,
      isActive: true,
      isVerified: true,
      ownerId: true,
      owner: { select: { name: true, email: true } },
    },
  });

  const rows: PropertyRow[] = hotels.map((h) => {
    const hostName = h.owner.name?.trim() || h.owner.email;
    const status: PropertyRow["status"] = !h.isActive ? "paused" : h.isVerified ? "live" : "pending";
    return {
      id: h.id,
      name: h.name,
      slug: h.slug,
      city: h.city,
      host: hostName,
      ownerId: h.ownerId,
      isActive: h.isActive,
      isVerified: h.isVerified,
      status,
      nightlyInr: Math.round(h.priceUsd ?? 0),
    };
  });

  return (
    <AdminSimpleTable
      title="Properties"
      subtitle="Review listings, status, pricing and host ownership."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
            Export
          </Button>
          <Button className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
            <Building2 className="h-4 w-4" />
            Add property
          </Button>
        </div>
      }
      columns={[
        { key: "name", header: "PROPERTY", cell: (r) => <div className="text-sm font-semibold">{r.name}</div> },
        { key: "city", header: "CITY", cell: (r) => <div className="text-sm text-black/55">{r.city}</div> },
        { key: "host", header: "HOST", cell: (r) => <div className="text-sm font-semibold">{r.host}</div> },
        { key: "status", header: "STATUS", cell: (r) => <StatusPill status={r.status} /> },
        { key: "nightly", header: "NIGHTLY", cell: (r) => <div className="text-sm font-semibold">{formatInr(r.nightlyInr)}</div> },
        {
          key: "actions",
          header: "",
          className: "text-right",
          cell: (r) => (
            <AdminPropertyActions
              hotelId={r.id}
              hotelSlug={r.slug}
              ownerId={r.ownerId}
              isActive={r.isActive}
              isVerified={r.isVerified}
              nightlyInr={r.nightlyInr}
            />
          ),
        },
      ]}
      rows={rows}
    />
  );
}

