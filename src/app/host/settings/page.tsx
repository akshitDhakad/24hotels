import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { requireHostSession } from "@/lib/auth/require-host";

import { HostSettingsClient } from "./ui";

export default async function HostSettingsPage() {
  await requireHostSession();
  return (
    <HostDashboardShell>
      <HostSettingsClient />
    </HostDashboardShell>
  );
}

