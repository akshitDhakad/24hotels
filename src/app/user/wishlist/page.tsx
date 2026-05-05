import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { UserDashboardShell } from "@/components/user/user-dashboard-shell";
import { Card } from "@/components/ui/card";
import { getUserNavAccount, getUserWishlistRows } from "@/lib/legacy-server/services/user-dashboard.service";
import { requireCustomerSession } from "@/lib/auth/require-customer";

export default async function UserWishlistPage() {
  const { user } = await requireCustomerSession();
  const [account, wishlist] = await Promise.all([
    getUserNavAccount(user.id),
    getUserWishlistRows(user.id),
  ]);
  if (!account) notFound();

  return (
    <UserDashboardShell account={account}>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Saved Properties</h1>
          <p className="mt-1 text-sm text-black/50">Hotels you have saved to your wishlist.</p>
        </div>

        {wishlist.length === 0 ? (
          <p className="text-sm text-black/45">
            No saved properties yet.{" "}
            <Link href="/" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Explore stays
            </Link>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((p) => (
              <Card key={p.wishlistItemId} className="overflow-hidden border-black/5 bg-white shadow-sm">
                <Link href={`/hotels/${p.hotelId}`} className="block">
                  <div className="relative aspect-[16/10] bg-black/[0.04]">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="mt-1 text-xs text-black/45">{p.locationLabel}</div>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div className="text-xs text-black/45">From</div>
                      <div className="text-base font-semibold">{p.pricePerNightLabel}</div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserDashboardShell>
  );
}
