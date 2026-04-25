import { DollarSign, TrendingUp } from "lucide-react";

import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { Button } from "@/components/ui/button";

export default function AdminRevenuePage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Revenue</div>
          <div className="mt-1 text-sm text-black/50">
            Monitor platform earnings, refunds and payout health.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
            Export CSV
          </Button>
          <Button className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
            Generate report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminKpiCard
          title="Gross Revenue"
          value="$1,284,200"
          sublabel="Last 90 days"
          delta={{ label: "+11.2%", tone: "positive" }}
          icon={DollarSign}
        />
        <AdminKpiCard
          title="Refunds"
          value="$28,940"
          sublabel="Last 90 days"
          delta={{ label: "-1.4%", tone: "positive" }}
          icon={TrendingUp}
        />
        <AdminKpiCard
          title="Payout Health"
          value="Healthy"
          sublabel="No delayed payouts"
          delta={{ label: "Stable" }}
          icon={TrendingUp}
        />
      </div>

      <AdminRevenueChart />
    </div>
  );
}

