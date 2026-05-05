import { Building2, CalendarDays, DollarSign, ShieldCheck, Users } from "lucide-react";

import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminLatestBookings } from "@/components/admin/admin-latest-bookings";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

function formatInrFromPaise(paise: number) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(rupees);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const since30d = addDays(now, -30);
  const since7d = addDays(now, -6);
  const since90d = addDays(now, -90);

  const [revenue30d, bookings30d, activeHosts, totalUsers, propertiesCount, disputesCount, payments7d, bookings7d] =
    await Promise.all([
      prisma.payment.aggregate({
        where: { status: "PAID", createdAt: { gte: since30d } },
        _sum: { amount: true },
      }),
      prisma.booking.count({ where: { createdAt: { gte: since30d } } }),
      prisma.user.count({ where: { role: "HOST", deletedAt: null } }),
      prisma.user.count({ where: { role: "USER", deletedAt: null } }),
      prisma.hotel.count({ where: { deletedAt: null } }),
      prisma.booking.count({ where: { status: "CANCELLED", createdAt: { gte: since90d } } }),
      prisma.payment.findMany({
        where: { status: "PAID", createdAt: { gte: since7d } },
        select: { amount: true, createdAt: true },
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: since7d } },
        select: { createdAt: true },
      }),
    ]);

  const byDayKey = (d: Date) => startOfDay(d).toISOString().slice(0, 10);
  const revenueByDay = new Map<string, number>();
  for (const p of payments7d) revenueByDay.set(byDayKey(p.createdAt), (revenueByDay.get(byDayKey(p.createdAt)) ?? 0) + p.amount / 100);
  const bookingsByDay = new Map<string, number>();
  for (const b of bookings7d) bookingsByDay.set(byDayKey(b.createdAt), (bookingsByDay.get(byDayKey(b.createdAt)) ?? 0) + 1);

  const dayFmt = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(startOfDay(now), i - 6);
    const key = byDayKey(d);
    return {
      label: dayFmt.format(d),
      revenue: Math.round(revenueByDay.get(key) ?? 0),
      bookings: bookingsByDay.get(key) ?? 0,
    };
  });

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
          value={formatInrFromPaise(revenue30d._sum.amount ?? 0)}
          sublabel="Last 30 days"
          delta={{ label: "Paid", tone: "neutral" }}
          icon={DollarSign}
        />
        <AdminKpiCard
          title="Bookings"
          value={bookings30d.toLocaleString("en-IN")}
          sublabel="Last 30 days"
          delta={{ label: "Created", tone: "neutral" }}
          icon={CalendarDays}
        />
        <AdminKpiCard
          title="Active Hosts"
          value={activeHosts.toLocaleString("en-IN")}
          sublabel="Registered hosts"
          delta={{ label: "All time", tone: "neutral" }}
          icon={ShieldCheck}
        />
        <AdminKpiCard
          title="Total Users"
          value={totalUsers.toLocaleString("en-IN")}
          sublabel="Registered"
          delta={{ label: "All time", tone: "neutral" }}
          icon={Users}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <AdminRevenueChart data={chartData} />
        <div className="grid gap-4">
          <AdminKpiCard
            title="Properties"
            value={propertiesCount.toLocaleString("en-IN")}
            sublabel="Listed on platform"
            delta={{ label: "All time", tone: "neutral" }}
            icon={Building2}
          />
          <AdminKpiCard
            title="Disputes"
            value={disputesCount.toLocaleString("en-IN")}
            sublabel="Cancelled (last 90 days)"
            delta={{ label: "Auto", tone: "neutral" }}
            icon={ShieldCheck}
          />
        </div>
      </div>

      <AdminLatestBookings />
    </div>
  );
}

