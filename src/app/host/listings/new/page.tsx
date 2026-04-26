import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { requireHostSession } from "@/server/utils/require-host";

import { HostListingForm } from "../write-form";

export default async function HostNewListingPage() {
  await requireHostSession();
  return (
    <HostDashboardShell>
      <HostListingForm mode="create" />
    </HostDashboardShell>
  );
}

