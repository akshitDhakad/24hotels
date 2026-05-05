import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { UserDashboardShell } from "@/components/user/user-dashboard-shell";
import { Card } from "@/components/ui/card";
import { formatMinorCurrency } from "@/lib/booking-display";
import { cn } from "@/lib/cn";
import { DIAMOND_POINTS_THRESHOLD, pointsToDiamond, progressToDiamond } from "@/lib/loyalty";
import { getUserDashboardData, getUserNavAccount } from "@/lib/legacy-server/services/user-dashboard.service";
import { requireCustomerSession } from "@/lib/auth/require-customer";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-black/5 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-semibold tracking-wide text-black/40">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </Card>
  );
}

function UpcomingTripCard({
  id,
  name,
  location,
  dates,
  image,
  guestInitial,
  amountLabel,
}: {
  id: string;
  name: string;
  location: string;
  dates: string;
  image: string;
  guestInitial: string;
  amountLabel: string;
}) {
  const initial = (guestInitial.trim()[0] ?? "?").toUpperCase();
  return (
    <Card className="overflow-hidden border-black/5 bg-white shadow-sm">
      <div className="relative aspect-[16/9] bg-black/[0.04]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{name}</div>
            <div className="mt-1 text-xs text-black/45">{location}</div>
          </div>
          <span className="shrink-0 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-black/60">
            {dates}
          </span>
        </div>

        <div className="mt-2 text-[11px] font-medium text-black/40">{amountLabel}</div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex -space-x-2" aria-label="Guest">
            <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-black/[0.06] text-[10px] font-semibold text-black/60">
              {initial}
            </div>
          </div>

          <Link
            href={`/user/bookings#${id}`}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-black px-4 text-xs font-semibold text-white hover:bg-black/90"
          >
            Manage Booking
          </Link>
        </div>
      </div>
    </Card>
  );
}

function OverviewCard({
  title,
  description,
  cta,
  icon,
  tone = "light",
  progressPct,
}: {
  title: string;
  description: string;
  cta: string;
  icon: ReactNode;
  tone?: "light" | "dark";
  progressPct?: number;
}) {
  return (
    <Card
      className={cn(
        "border-black/5 shadow-sm",
        tone === "dark" ? "bg-black text-white" : "bg-white",
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl",
              tone === "dark" ? "bg-white/10" : "bg-black/[0.04]",
            )}
          >
            {icon}
          </div>
          {tone === "dark" ? (
            <span className="text-xs font-semibold text-white/80">Rewards</span>
          ) : null}
        </div>

        <div className="mt-5 text-sm font-semibold">{title}</div>
        <div
          className={cn(
            "mt-2 text-xs leading-5",
            tone === "dark" ? "text-white/70" : "text-black/45",
          )}
        >
          {description}
        </div>

        <button
          type="button"
          className={cn(
            "mt-6 inline-flex items-center gap-2 text-xs font-semibold",
            tone === "dark" ? "text-white" : "text-foreground",
          )}
        >
          {cta} <span className={cn(tone === "dark" ? "text-white/70" : "text-black/40")}>→</span>
        </button>

        {tone === "dark" && typeof progressPct === "number" ? (
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default async function UserDashboardPage() {
  const { user } = await requireCustomerSession();
  const [account, data] = await Promise.all([getUserNavAccount(user.id), getUserDashboardData(user.id)]);
  if (!account || !data) notFound();

  const loyaltyFmt = new Intl.NumberFormat("en-US").format(data.loyaltyPoints);
  const upcomingLabel =
    data.upcomingStaysTotal === 0
      ? "no upcoming stays"
      : data.upcomingStaysTotal === 1
        ? "1 upcoming stay"
        : `${data.upcomingStaysTotal} upcoming stays`;
  const diamondRemaining = pointsToDiamond(data.loyaltyPoints);
  const eliteDescription =
    data.loyaltyPoints >= DIAMOND_POINTS_THRESHOLD
      ? "You’ve reached Diamond status — enjoy top-tier perks on every stay."
      : `You’re ${new Intl.NumberFormat("en-US").format(diamondRemaining)} points away from Diamond status rewards.`;
  const eliteProgress = progressToDiamond(data.loyaltyPoints);

  return (
    <UserDashboardShell account={account}>
      <div className="grid gap-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px] lg:items-start">
          <div>
            <div className="text-3xl font-semibold tracking-tight">
              Welcome back, {data.displayName}
            </div>
            <div className="mt-1 text-sm text-black/50">
              You have {upcomingLabel} and {loyaltyFmt} loyalty points.
            </div>
          </div>
          <StatCard label="Total Trips" value={String(data.totalTrips)} />
          <StatCard label="Loyalty Points" value={loyaltyFmt} />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-lg font-semibold">Upcoming Trips</div>
            <Link
              href="/user/bookings"
              className="text-xs font-semibold text-black/50 hover:text-foreground"
            >
              View all bookings
            </Link>
          </div>

          {data.upcomingBookings.length === 0 ? (
            <p className="mt-4 text-sm text-black/45">
              No upcoming trips yet.{" "}
              <Link href="/" className="font-semibold text-foreground underline-offset-4 hover:underline">
                Explore hotels
              </Link>
            </p>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {data.upcomingBookings.map((b) => (
                <UpcomingTripCard
                  key={b.id}
                  id={b.id}
                  name={b.hotelName}
                  location={b.locationLabel}
                  dates={b.datesLabel}
                  image={b.imageUrl}
                  guestInitial={data.displayName}
                  amountLabel={`Total ${formatMinorCurrency(b.finalAmountMinor, b.currency)} · ${b.status}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-lg font-semibold">Account Overview</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <OverviewCard
              title="Payments"
              description="Manage cards, billing history, and membership fees."
              cta="Go to billing"
              icon={<ShieldCheck className="h-5 w-5 text-black/60" />}
            />
            <OverviewCard
              title="Security"
              description="Update password, 2FA settings, and login activity."
              cta="Secure account"
              icon={<ShieldCheck className="h-5 w-5 text-black/60" />}
            />
            <OverviewCard
              title="Elite Status"
              description={eliteDescription}
              cta="View benefits"
              tone="dark"
              progressPct={eliteProgress}
              icon={<ShieldCheck className="h-5 w-5 text-white/80" />}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Saved Properties</div>
              <div className="mt-1 text-sm text-black/45">Your favorite stays, ready when you are.</div>
            </div>
            <Link
              href="/user/wishlist"
              className="text-xs font-semibold text-black/50 hover:text-foreground"
            >
              View all
            </Link>
          </div>

          {data.wishlist.length === 0 ? (
            <p className="mt-4 text-sm text-black/45">
              Nothing saved yet. Tap the heart on a hotel to add it here.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {data.wishlist.map((p) => (
                <Card key={p.wishlistItemId} className="overflow-hidden border-black/5 bg-white shadow-sm">
                  <Link href={`/hotels/${p.hotelId}`} className="block">
                    <div className="relative aspect-[16/10] bg-black/[0.04]">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 30vw, 100vw"
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
      </div>
    </UserDashboardShell>
  );
}
