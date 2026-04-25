import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { UserDashboardShell } from "@/components/user/user-dashboard-shell";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const upcomingTrips = [
  {
    id: "t1",
    name: "Aura Boutique Hotel",
    location: "Santorini, Greece",
    dates: "SEP 12 – SEP 18",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "t2",
    name: "Summit Peak Lodge",
    location: "Zermatt, Switzerland",
    dates: "DEC 20 – DEC 27",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

const savedProperties = [
  {
    id: "s1",
    name: "Glass Beach House",
    location: "Malibu, USA",
    price: "$1,250",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "s2",
    name: "Eucalyptus Villa",
    location: "Tuscany, Italy",
    price: "$890",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "s3",
    name: "The Grand Palace",
    location: "Tokyo, Japan",
    price: "$2,100",
    image:
      "https://images.unsplash.com/photo-1551887373-6f3f3c5f6c3a?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-black/5 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-semibold tracking-wide text-black/40">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </Card>
  );
}

function UpcomingTripCard({
  name,
  location,
  dates,
  image,
}: {
  name: string;
  location: string;
  dates: string;
  image: string;
}) {
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
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-black/60">
            {dates}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex -space-x-2">
            {["A", "B", "C"].slice(0, 3).map((x) => (
              <div
                key={x}
                className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-black/[0.06] text-[10px] font-semibold text-black/60"
                aria-hidden="true"
              >
                {x}
              </div>
            ))}
            <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-black text-[10px] font-semibold text-white">
              +1
            </div>
          </div>

          <button
            type="button"
            className="h-9 rounded-xl bg-black px-4 text-xs font-semibold text-white hover:bg-black/90"
          >
            Manage Booking
          </button>
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
}: {
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  tone?: "light" | "dark";
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
          <div className={cn("grid h-10 w-10 place-items-center rounded-xl", tone === "dark" ? "bg-white/10" : "bg-black/[0.04]")}>
            {icon}
          </div>
          {tone === "dark" ? (
            <button type="button" className="text-xs font-semibold text-white/80 hover:text-white">
              + New Trip
            </button>
          ) : null}
        </div>

        <div className="mt-5 text-sm font-semibold">{title}</div>
        <div className={cn("mt-2 text-xs leading-5", tone === "dark" ? "text-white/70" : "text-black/45")}>
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

        {tone === "dark" ? (
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[62%] rounded-full bg-white/70" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default function UserDashboardPage() {
  return (
    <UserDashboardShell>
      <div className="grid gap-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px] lg:items-start">
          <div>
            <div className="text-3xl font-semibold tracking-tight">Welcome back, Julian</div>
            <div className="mt-1 text-sm text-black/50">
              You have 2 upcoming stays and 12,450 points to spend.
            </div>
          </div>
          <StatCard label="Total Trips" value="14" />
          <StatCard label="Loyalty Points" value="12,450" />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-lg font-semibold">Upcoming Trips</div>
            <button type="button" className="text-xs font-semibold text-black/50 hover:text-foreground">
              View all bookings
            </button>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {upcomingTrips.map((t) => (
              <UpcomingTripCard
                key={t.id}
                name={t.name}
                location={t.location}
                dates={t.dates}
                image={t.image}
              />
            ))}
          </div>
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
              description="You’re 4 nights away from Diamond status rewards."
              cta="View benefits"
              tone="dark"
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white hover:bg-black/[0.04]"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white hover:bg-black/[0.04]"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {savedProperties.map((p) => (
              <Card key={p.id} className="overflow-hidden border-black/5 bg-white shadow-sm">
                <div className="relative aspect-[16/10] bg-black/[0.04]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(min-width: 1024px) 30vw, 100vw" />
                  <button
                    type="button"
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black/60 shadow-sm ring-1 ring-black/10 hover:bg-white"
                    aria-label="Save"
                  >
                    ♥
                  </button>
                </div>
                <div className="p-5">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-xs text-black/45">{p.location}</div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div className="text-xs text-black/45">Per night</div>
                    <div className="text-base font-semibold">{p.price}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </UserDashboardShell>
  );
}

