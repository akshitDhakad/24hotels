import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { requireHostSession } from "@/server/utils/require-host";

import { HostProfileClient } from "./ui";

export default async function HostProfilePage() {
  await requireHostSession();
  return (
    <HostDashboardShell>
      <HostProfileClient />
    </HostDashboardShell>
  );
}

