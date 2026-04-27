import { HostDashboardShell } from "@/components/host/host-dashboard-shell";
import { prisma } from "@/server/config/database";
import { requireHostSession } from "@/server/utils/require-host";

import { HostListingForm } from "../../write-form";

export default async function HostEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireHostSession();
  const { id } = await params;

  const hotel = await prisma.hotel.findFirst({
    where: { id, ownerId: user.id, deletedAt: null },
    include: {
      gallery: { orderBy: { sortOrder: "asc" } },
      amenities: { orderBy: { name: "asc" } },
      perks: { orderBy: { name: "asc" } },
      rooms: { orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <HostDashboardShell>
      <HostListingForm
        mode="edit"
        initial={
          hotel
            ? {
                id: hotel.id,
                name: hotel.name,
                location: hotel.location,
                city: hotel.city,
                country: hotel.country,
                address: hotel.address,
                description: hotel.description,
                priceUsd: hotel.priceUsd,
                reviewLabel: hotel.reviewLabel,
                perks: hotel.perks.map((p) => p.name),
                amenities: hotel.amenities.map((a) => a.name),
                gallery: hotel.gallery.map((g) => g.url),
                rooms: hotel.rooms.map((r) => ({
                  id: r.id,
                  name: r.name,
                  sleeps: r.sleeps,
                  bed: r.bed,
                  refundable: r.refundable,
                  priceUsd: r.priceUsd,
                  perks: Array.isArray(r.perks) ? (r.perks as string[]).filter((x) => typeof x === "string") : [],
                })),
                isActive: hotel.isActive,
              }
            : null
        }
        hotelId={id}
      />
    </HostDashboardShell>
  );
}

