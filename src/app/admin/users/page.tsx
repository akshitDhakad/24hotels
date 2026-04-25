import { UserPlus } from "lucide-react";

import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type UserRow = {
  id: string;
  name: string;
  email: string;
  tier: "standard" | "elite";
  bookings: number;
  lastActive: string;
};

const users: readonly UserRow[] = [
  { id: "u_001", name: "Julian", email: "julian@user.com", tier: "elite", bookings: 14, lastActive: "2h ago" },
  { id: "u_002", name: "Sophia Reed", email: "sophia@user.com", tier: "standard", bookings: 6, lastActive: "1d ago" },
  { id: "u_003", name: "Liam Chen", email: "liam@user.com", tier: "standard", bookings: 4, lastActive: "3d ago" },
] as const;

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

export default function AdminUsersPage() {
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
        { key: "name", header: "USER", cell: (r) => <div className="text-sm font-semibold">{r.name}</div> },
        { key: "email", header: "EMAIL", cell: (r) => <div className="text-sm text-black/55">{r.email}</div> },
        { key: "tier", header: "TIER", cell: (r) => <TierPill tier={r.tier} /> },
        { key: "bookings", header: "BOOKINGS", cell: (r) => <div className="text-sm font-semibold">{r.bookings}</div> },
        { key: "lastActive", header: "LAST ACTIVE", cell: (r) => <div className="text-sm text-black/55">{r.lastActive}</div> },
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
      rows={users}
    />
  );
}

