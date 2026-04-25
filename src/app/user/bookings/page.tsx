import Link from "next/link";
import { notFound } from "next/navigation";

import { UserDashboardShell } from "@/components/user/user-dashboard-shell";
import { Card } from "@/components/ui/card";
import { formatMinorCurrency } from "@/lib/booking-display";
import { cn } from "@/lib/cn";
import { getUserBookingsList, getUserNavAccount } from "@/server/services/user-dashboard.service";
import { requireCustomerSession } from "@/server/utils/require-customer";

export default async function UserBookingsPage() {
  const { user } = await requireCustomerSession();
  const [account, bookings] = await Promise.all([
    getUserNavAccount(user.id),
    getUserBookingsList(user.id),
  ]);
  if (!account) notFound();

  return (
    <UserDashboardShell account={account}>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Bookings</h1>
          <p className="mt-1 text-sm text-black/50">Reference, dates, status, and totals for every stay.</p>
        </div>

        {bookings.length === 0 ? (
          <p className="text-sm text-black/45">
            No bookings yet.{" "}
            <Link href="/" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Browse hotels
            </Link>
          </p>
        ) : (
          <div className="grid gap-3">
            {bookings.map((b) => (
              <Card
                key={b.id}
                id={b.id}
                className="scroll-mt-28 border-black/5 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{b.hotelName}</div>
                    <div className="mt-1 text-xs text-black/45">{b.locationLabel}</div>
                    <div className="mt-2 text-xs font-medium text-black/55">{b.datesLabel}</div>
                    <div className="mt-2 text-[11px] text-black/40">
                      Ref <span className="font-mono text-black/60">{b.bookingRef}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                        b.status === "CONFIRMED" && "bg-emerald-50 text-emerald-800",
                        b.status === "PENDING" && "bg-amber-50 text-amber-900",
                        b.status === "CANCELLED" && "bg-black/[0.06] text-black/55",
                        b.status === "COMPLETED" && "bg-sky-50 text-sky-900",
                        b.status === "EXPIRED" && "bg-black/[0.06] text-black/45",
                      )}
                    >
                      {b.status}
                    </span>
                    <div className="text-sm font-semibold">
                      {formatMinorCurrency(b.finalAmountMinor, b.currency)}
                    </div>
                    <Link
                      href={`/hotels/${b.hotelId}`}
                      className="text-xs font-semibold text-foreground underline-offset-4 hover:underline"
                    >
                      View hotel
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserDashboardShell>
  );
}
