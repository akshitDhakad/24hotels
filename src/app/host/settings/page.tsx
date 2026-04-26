import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { requireHostSession } from "@/server/utils/require-host";

import { HostSettingsClient } from "./ui";

export default async function HostSettingsPage() {
  await requireHostSession();
  return (
    <HostDashboardShell>
      <HostSettingsClient />
    </HostDashboardShell>
  );
}

