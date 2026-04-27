import { DollarSign, TrendingUp } from "lucide-react";

import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { Button } from "@/components/ui/button";
import { prisma } from "@/server/config/database";

function formatInrFromPaise(paise: number) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(rupees);
}

function addDays(d: Date, days: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export default async function AdminRevenuePage() {
  const now = new Date();
  const since90d = addDays(now, -90);
  const since14d = addDays(now, -14);

  const [gross, refunds, pendingOld] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID", createdAt: { gte: since90d } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "REFUNDED", createdAt: { gte: since90d } },
      _sum: { amount: true },
    }),
    prisma.payment.count({ where: { status: "PENDING", createdAt: { lt: since14d } } }),
  ]);

  const payoutHealth = pendingOld === 0 ? "Healthy" : "Needs review";

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
          value={formatInrFromPaise(gross._sum.amount ?? 0)}
          sublabel="Last 90 days"
          delta={{ label: "Paid", tone: "neutral" }}
          icon={DollarSign}
        />
        <AdminKpiCard
          title="Refunds"
          value={formatInrFromPaise(refunds._sum.amount ?? 0)}
          sublabel="Last 90 days"
          delta={{ label: pendingOld === 0 ? "Stable" : `${pendingOld} pending`, tone: pendingOld === 0 ? "positive" : "negative" }}
          icon={TrendingUp}
        />
        <AdminKpiCard
          title="Payout Health"
          value={payoutHealth}
          sublabel={pendingOld === 0 ? "No delayed payouts" : "Pending payments older than 14 days"}
          delta={{ label: pendingOld === 0 ? "Stable" : "Attention", tone: pendingOld === 0 ? "positive" : "negative" }}
          icon={TrendingUp}
        />
      </div>

      <AdminRevenueChart />
    </div>
  );
}

