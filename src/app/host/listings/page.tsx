import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { prisma } from "@/server/config/database";
import { requireHostSession } from "@/server/utils/require-host";

import { HostListingsClient } from "./ui";

export default async function HostListingsPage() {
  const { user } = await requireHostSession();

  const hotels = await prisma.hotel.findMany({
    where: { ownerId: user.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <HostDashboardShell>
      <HostListingsClient initialHotels={hotels} />
    </HostDashboardShell>
  );
}

