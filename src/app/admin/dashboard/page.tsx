import { Building2, CalendarDays, DollarSign, ShieldCheck, Users } from "lucide-react";

import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminLatestBookings } from "@/components/admin/admin-latest-bookings";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Platform Overview</div>
          <div className="mt-1 text-sm text-black/50">
            Manage hosts, properties, users and bookings from one place.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
            View reports
          </Button>
          <Button className="h-10 rounded-xl bg-black px-4 text-white hover:bg-black/90">
            Create announcement
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          title="Total Revenue"
          value="$428,500"
          sublabel="Last 30 days"
          delta={{ label: "+8.4%", tone: "positive" }}
          icon={DollarSign}
        />
        <AdminKpiCard
          title="Bookings"
          value="3,284"
          sublabel="Last 30 days"
          delta={{ label: "+4.1%", tone: "positive" }}
          icon={CalendarDays}
        />
        <AdminKpiCard
          title="Active Hosts"
          value="412"
          sublabel="Verified & live"
          delta={{ label: "Stable" }}
          icon={ShieldCheck}
        />
        <AdminKpiCard
          title="Total Users"
          value="28,940"
          sublabel="Registered"
          delta={{ label: "+2.0%", tone: "positive" }}
          icon={Users}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <AdminRevenueChart />
        <div className="grid gap-4">
          <AdminKpiCard
            title="Properties"
            value="1,284"
            sublabel="Listed on platform"
            delta={{ label: "+1.6%", tone: "positive" }}
            icon={Building2}
          />
          <AdminKpiCard
            title="Disputes"
            value="12"
            sublabel="Open cases"
            delta={{ label: "-3", tone: "positive" }}
            icon={ShieldCheck}
          />
        </div>
      </div>

      <AdminLatestBookings />
    </div>
  );
}

