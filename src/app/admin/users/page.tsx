import { UserPlus } from "lucide-react";

import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { AdminUserActions } from "@/components/admin/admin-user-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/prisma";

type UserRow = {
  id: string;
  name: string;
  email: string;
  tier: "standard" | "elite";
  bookings: number;
  lastActive: string;
};

function timeAgo(from: Date) {
  const diffMs = Date.now() - from.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function TierPill({ tier }: { tier: UserRow["tier"] }) {
  const label = tier === "elite" ? "Elite" : "Standard";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tier === "elite" ? "bg-black text-white" : "bg-black/[0.04] text-black/55",
      )}
    >
      {label}
    </span>
  );
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER", deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      loyaltyPoints: true,
      updatedAt: true,
      _count: { select: { bookings: true } },
    },
  });

  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name?.trim() || "User",
    email: u.email,
    tier: u.loyaltyPoints >= 1000 ? "elite" : "standard",
    bookings: u._count.bookings,
    lastActive: timeAgo(u.updatedAt),
  }));

  return (
    <AdminSimpleTable
      title="Users"
      subtitle="Manage customers, membership tiers and activity."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
            Export
          </Button>
          <Button className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
            <UserPlus className="h-4 w-4" />
            Add user
          </Button>
        </div>
      }
      columns={[
        { key: "name", header: "USER", width: "1.2fr", cell: (r) => <div className="truncate text-sm font-semibold">{r.name}</div> },
        {
          key: "email",
          header: "EMAIL",
          width: "1.6fr",
          cell: (r) => <div className="truncate text-sm text-black/55">{r.email}</div>,
        },
        { key: "tier", header: "TIER", width: "0.7fr", cell: (r) => <TierPill tier={r.tier} /> },
        { key: "bookings", header: "BOOKINGS", width: "0.7fr", cell: (r) => <div className="text-sm font-semibold">{r.bookings}</div> },
        { key: "lastActive", header: "LAST ACTIVE", width: "0.9fr", cell: (r) => <div className="text-sm text-black/55">{r.lastActive}</div> },
        {
          key: "actions",
          header: "",
          width: "44px",
          className: "text-right",
          cell: (r) => <AdminUserActions userId={r.id} />,
        },
      ]}
      rows={rows}
    />
  );
}

