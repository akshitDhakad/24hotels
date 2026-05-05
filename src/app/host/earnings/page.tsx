import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { Card } from "@/components/ui/card";
import { requireHostSession } from "@/lib/auth/require-host";

export default async function HostEarningsPage() {
  await requireHostSession();
  return (
    <HostDashboardShell>
      <Card className="border-black/5 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold">Earnings</div>
        <div className="mt-1 text-sm text-black/50">
          Coming next: payouts, settlement reports, and invoices.
        </div>
      </Card>
    </HostDashboardShell>
  );
}

