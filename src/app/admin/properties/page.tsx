import { Building2 } from "lucide-react";

import { AdminSimpleTable } from "@/components/admin/admin-simple-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type PropertyRow = {
  id: string;
  name: string;
  city: string;
  host: string;
  status: "live" | "paused";
  nightly: string;
};

const properties: readonly PropertyRow[] = [
  { id: "p_001", name: "Ocean Front Villa", city: "Nice", host: "Alexander Thorne", status: "live", nightly: "$580" },
  { id: "p_002", name: "The Glass House", city: "Santorini", host: "Elena Rodriguez", status: "live", nightly: "$720" },
  { id: "p_003", name: "Sky Loft Penthouse", city: "Singapore", host: "Julian Marc", status: "paused", nightly: "$460" },
] as const;

function StatusPill({ status }: { status: PropertyRow["status"] }) {
  const label = status === "live" ? "Live" : "Paused";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "live" ? "bg-emerald-50 text-emerald-700" : "bg-black/[0.04] text-black/55",
      )}
    >
      {label}
    </span>
  );
}

export default function AdminPropertiesPage() {
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
        { key: "nightly", header: "NIGHTLY", cell: (r) => <div className="text-sm font-semibold">{r.nightly}</div> },
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
      rows={properties}
    />
  );
}

