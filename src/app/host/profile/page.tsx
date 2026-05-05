import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { requireHostSession } from "@/lib/auth/require-host";

import { HostProfileClient } from "./ui";

export default async function HostProfilePage() {
  await requireHostSession();
  return (
    <HostDashboardShell>
      <HostProfileClient />
    </HostDashboardShell>
  );
}

