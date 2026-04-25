import { Download, TrendingUp } from "lucide-react";

import { HostKpiCard } from "@/components/host/host-kpi-card";
import { HostNewRequests } from "@/components/host/host-new-requests";
import { HostPerformanceInsights } from "@/components/host/host-performance-insights";
import { HostRecentActivity } from "@/components/host/host-recent-activity";
import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { Button } from "@/components/ui/button";

export default function HostDashboardPage() {
  return (
    <HostDashboardShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-3xl font-semibold tracking-tight">Good morning, Alexander</div>
          <div className="mt-1 text-sm text-black/50">
            Here’s what’s happening with your properties today.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
            View Calendar
          </Button>
          <Button className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <HostKpiCard
          title="Total Earnings"
          value="$42,850.00"
          delta={{ label: "+12.5%", tone: "positive" }}
          icon={TrendingUp}
        />
        <HostKpiCard
          title="Occupancy Rate"
          value="94.2%"
          delta={{ label: "+4.2%", tone: "positive" }}
          icon={TrendingUp}
        />
        <HostKpiCard title="Average Daily Rate" value="$580.00" delta={{ label: "Stable" }} icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <HostPerformanceInsights />
        <HostNewRequests />
      </div>

      <div className="mt-6">
        <HostRecentActivity />
      </div>
    </HostDashboardShell>
  );
}

