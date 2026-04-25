import { BadgeCheck, ShieldAlert } from "lucide-react";

import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type HostRow = {
  id: string;
  name: string;
  email: string;
  status: "verified" | "review";
  properties: number;
  revenue: string;
};

const hosts: readonly HostRow[] = [
  {
    id: "h_001",
    name: "Alexander Thorne",
    email: "alexander@host.com",
    status: "verified",
    properties: 6,
    revenue: "$48,120",
  },
  {
    id: "h_002",
    name: "Elena Rodriguez",
    email: "elena@host.com",
    status: "review",
    properties: 2,
    revenue: "$12,980",
  },
  {
    id: "h_003",
    name: "Julian Marc",
    email: "julian@host.com",
    status: "verified",
    properties: 3,
    revenue: "$21,440",
  },
] as const;

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

export default function AdminHostsPage() {
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
      rows={hosts}
    />
  );
}

