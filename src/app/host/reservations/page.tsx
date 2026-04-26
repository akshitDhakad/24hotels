import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { Card } from "@/components/ui/card";
import { requireHostSession } from "@/server/utils/require-host";

export default async function HostReservationsPage() {
  await requireHostSession();
  return (
    <HostDashboardShell>
      <Card className="border-black/5 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold">Reservations</div>
        <div className="mt-1 text-sm text-black/50">
          Coming next: reservations CRUD and approval workflow.
        </div>
      </Card>
    </HostDashboardShell>
  );
}

