import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  Check,
  Clock,
  Circle,
  Shield,
  MapPin,
  Star,
  Sparkles,
  UtensilsCrossed,
  Waves,
  Users,
  Wifi,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { HotelHourlyRatesSection } from "@/components/hotel/hotel-hourly-rates-section";
import { HotelResultsHeader } from "@/components/hotel/hotel-results-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getHotelByIdFromDb } from "@/features/hotels/hotels-server";
import { convertFromUsd, formatCurrency } from "@/lib/currency";

type PageProps = {
  params: Promise<{ hotelId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hotelId } = await params;
  const hotel = await getHotelByIdFromDb(hotelId);
  if (!hotel) return { title: "Hotel not found" };
  return {
    title: hotel.name,
    description: hotel.description,
    openGraph: {
      title: hotel.name,
      description: hotel.description,
      images: [{ url: hotel.image }],
    },
  };
}

function formatInrFromUsd(amountUsd: number) {
  return formatCurrency(convertFromUsd(amountUsd, "INR"), "INR");
}

export default async function HotelDetailsPage({ params }: PageProps) {
  const { hotelId } = await params;
  const hotel = await getHotelByIdFromDb(hotelId);

  if (!hotel) {
    return (
      <div className="bg-[#fafafa]">
        <HotelResultsHeader />
        <Container className="py-10">
          <div className="rounded-xl border border-border bg-white p-8">
            <div className="text-lg font-semibold">Hotel not found</div>
            <div className="mt-2 text-sm text-muted-foreground">
              The hotel you’re looking for doesn’t exist.
            </div>
            <div className="mt-6">
              <Link href="/hotels" className="text-sm font-semibold text-primary hover:underline">
                Back to search
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const [hero, ...thumbs] = hotel.gallery;
  const nights = 6;
  const totalUsd = hotel.priceUsd * nights + 240 + 185;

  return (
    <div className="bg-[#fafafa]">
      <HotelResultsHeader />

      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Gallery: full width inside container; lg main + 2×2 share one height */}
          <div className="lg:col-span-2 -mx-4 mb-6 w-auto sm:-mx-6 sm:mb-8 lg:-mx-8 lg:mb-10">
            <div className="grid gap-3 lg:aspect-[2.25/1] lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-stretch">
              <div className="relative aspect-[16/10] min-h-0 w-full overflow-hidden rounded-xl bg-muted lg:aspect-auto lg:h-full">
                <Image
                  src={hero}
                  alt={`${hotel.name} main photo`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </div>

              <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-3 lg:h-full">
                <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-muted lg:aspect-auto">
                  <Image
                    src={thumbs[0] ?? hero}
                    alt="Gallery photo"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 18vw, 50vw"
                  />
                </div>
                <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-[#f3f5f4] lg:aspect-auto">
                  <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_70%_20%,rgba(34,211,238,0.55),rgba(255,255,255,0.0))]" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.85),rgba(255,255,255,0.55))]" />
                  <div className="absolute inset-0 p-4">
                    <div className="text-[11px] font-semibold tracking-wide text-black/50">
                      SPA
                    </div>
                    <div className="mt-1 text-sm font-semibold text-black/80">
                      Cete
                    </div>
                  </div>
                </div>
                <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-muted lg:aspect-auto">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.85),rgba(0,0,0,0.35))]" />
                  <div className="absolute inset-0 p-4">
                    <div className="text-xs font-semibold text-white/70">
                      Dining
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      Dining
                      <br />
                      Experience
                    </div>
                    <div className="mt-2 text-xs text-white/70">
                      Curated menus & wines
                    </div>
                  </div>
                </div>
                <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-muted lg:aspect-auto">
                  <Image
                    src={thumbs[1] ?? thumbs[2] ?? hero}
                    alt="Gallery photo"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 18vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Details Section */}
          <div className="min-w-0">
            <div className="overflow-hidden p-6">
              {/* Top meta + title (match reference) */}
              <div className="">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
                    RARE FIND
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-current text-[#f59e0b]" />
                    <span className="font-medium text-foreground">
                      {hotel.rating.toFixed(1)}
                    </span>
                    <span>({hotel.reviewCount} reviews)</span>
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                  {hotel.name}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.location}</span>
                </div>
              </div>

              {/* Amenity icon row */}
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {(
                  [
                    { label: "INFINITY POOL", sublabel: "Oceanfront", icon: Waves },
                    {
                      label: "MICHELIN STAR",
                      sublabel: "Fine dining",
                      icon: UtensilsCrossed,
                    },
                    { label: "PRIVATE SPA", sublabel: "Wellness", icon: Sparkles },
                    { label: "ULTRA FAST", sublabel: "Wi‑Fi included", icon: Wifi },
                    { label: "24/7 CONCIERGE", sublabel: "On-demand", icon: Shield },
                    { label: "FAMILY FRIENDLY", sublabel: "For everyone", icon: Users },
                  ] as const
                ).map((x) => (
                  <div key={x.label} className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">
                      <x.icon className="h-5 w-5" />
                    </span>
                    <div className="leading-tight">
                      <div className="text-[11px] font-semibold tracking-wide text-foreground">
                        {x.label}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {x.sublabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <div className="text-base font-semibold">
                    Experience the heights of Mediterranean luxury
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {hotel.description}
                  </p>
                </div>
                <div className="grid gap-3 rounded-xl border border-border bg-white p-4">
                  <div className="text-sm font-semibold">Highlights</div>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    {hotel.amenities.slice(0, 5).map((a) => (
                      <div key={a} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-700" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <HotelHourlyRatesSection
                baseNightInr={convertFromUsd(hotel.priceUsd, "INR")}
              />

              <Separator className="my-6" />

              {/* Accommodation table */}
              <div>
                <div className="text-base font-semibold">Select your accommodation</div>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr] bg-black/5 px-4 py-3 text-[11px] font-semibold text-black/50">
                    <div>ROOM TYPE</div>
                    <div>SLEEPS</div>
                    <div>DAILY RATE</div>
                    <div className="text-right"> </div>
                  </div>
                  {hotel.rooms.map((r) => (
                    <div key={r.id} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr] items-center gap-3 border-t border-border px-4 py-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{r.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <BedDouble className="h-4 w-4" /> {r.bed}
                          </span>
                          <span className="text-black/20">•</span>
                          <span className="inline-flex items-center gap-2">
                            <Bath className="h-4 w-4" /> Ensuite
                          </span>
                          <span className="text-black/20">•</span>
                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4" /> {r.refundable ? "Refundable" : "Non‑refundable"}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{r.sleeps} Adults</div>
                      <div className="text-sm font-semibold">
                        {formatInrFromUsd(r.priceUsd)}
                      </div>
                      <div className="flex justify-end">
                        <Link
                          href="/booking/checkout"
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:brightness-[0.92]"
                        >
                          Reserve
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Taxes and fees calculated at checkout.
                </div>
              </div>

              <Separator className="my-6" />

              {/* Guest reviews */}
              <div>
                <div className="text-base font-semibold">Guest Reviews</div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    {
                      name: "Amanda K.",
                      text: "A stunning stay with thoughtful details. The concierge arranged everything perfectly and the view was unforgettable.",
                    },
                    {
                      name: "George D.",
                      text: "Impeccable service and an amazing breakfast. Rooms were spotless and the location is excellent.",
                    },
                  ].map((r) => (
                    <div
                      key={r.name}
                      className="rounded-xl border border-border bg-white p-5"
                    >
                      <div className="text-sm font-semibold">{r.name}</div>
                      <div className="mt-2 text-sm leading-6 text-muted-foreground">
                        {r.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:sticky lg:top-24 lg:h-fit lg:w-full">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-black/50">
                    PRICE
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {formatInrFromUsd(hotel.priceUsd)}
                    <span className="text-xs font-medium text-muted-foreground">
                      {" "}
                      / night
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  FREE CANCELLATION
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-white p-3">
                    <div className="text-[11px] font-semibold text-black/50">
                      CHECK-IN
                    </div>
                    <div className="mt-1 text-sm font-semibold">Oct 24, 2024</div>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-3">
                    <div className="text-[11px] font-semibold text-black/50">
                      CHECK-OUT
                    </div>
                    <div className="mt-1 text-sm font-semibold">Oct 30, 2024</div>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-3">
                    <div className="text-[11px] font-semibold text-black/50">
                      GUESTS
                    </div>
                    <div className="mt-1 text-sm font-semibold">2 Adults</div>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-3">
                    <div className="text-[11px] font-semibold text-black/50">
                      ROOMS
                    </div>
                    <div className="mt-1 text-sm font-semibold">1 Room</div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">
                      {formatInrFromUsd(hotel.priceUsd)} × {nights} nights
                    </div>
                    <div className="font-medium">{formatInrFromUsd(hotel.priceUsd * nights)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Concierge Service Fee</div>
                    <div className="font-medium">{formatInrFromUsd(240)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Occupancy taxes & fees</div>
                    <div className="font-medium">{formatInrFromUsd(185)}</div>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Total</div>
                    <div className="text-xl font-semibold">{formatInrFromUsd(totalUsd)}</div>
                  </div>
                </div>

                <Link href="/booking/checkout">
                  <Button className="h-11 w-full rounded-xl">
                    RESERVE NOW
                  </Button>
                </Link>

                <div className="flex items-start gap-2 rounded-xl bg-black/5 p-3 text-xs text-muted-foreground">
                  <Shield className="mt-0.5 h-4 w-4 text-black/50" />
                  <div>
                    You won’t be charged yet. Free cancellation available before
                    check‑in.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Outside grid sections (match reference layout) */}
        <Separator className="my-12" />

        <div>
          <div className="text-sm font-semibold tracking-tight text-foreground">
            Important Information
          </div>
          <div className="mt-6 grid gap-10 md:grid-cols-3">
            <div>
              <div className="text-[11px] font-semibold tracking-wide text-black/50">
                HOUSE RULES
              </div>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {[
                  "Check-in: 3:00 PM - 10:00 PM",
                  "Check-out: 11:00 AM",
                  "No smoking indoors",
                  "No pets allowed",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <Circle className="h-3 w-3 fill-current text-black/35" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-wide text-black/50">
                SAFETY & PRIVACY
              </div>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {[
                  "Security cameras on property",
                  "Smoke alarm installed",
                  "First aid kit available",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-black/40" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-wide text-black/50">
                CANCELLATION POLICY
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Full refund for cancellations made within 48 hours of booking, if
                the check-in date is at least 14 days away. 50% refund for
                cancellations made at least 7 days before check-in.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div>
          <div className="flex items-end justify-between gap-4">
            <div className="text-2xl font-semibold tracking-tight">
              Similar Destinations
            </div>
            <Link
              href="/hotels"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Explore all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Azure Night",
                price: 990,
                image:
                  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
              },
              {
                name: "The Peak Hotel",
                price: 1200,
                image:
                  "https://images.unsplash.com/photo-1501117716987-c8e2a49e5f8a?auto=format&fit=crop&w=1200&q=80",
              },
              {
                name: "Garden & Villa",
                price: 1400,
                image:
                  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
              },
              {
                name: "Riviera Retreat",
                price: 820,
                image:
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
              },
            ].map((x) => (
              <Link
                key={x.name}
                href="/hotels"
                className="group overflow-hidden rounded-xl border border-border bg-white"
              >
                <div className="relative aspect-[16/10] bg-muted">
                  <Image
                    src={x.image}
                    alt={x.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-[10px] font-semibold text-white">
                    DESTINATION
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold">{x.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatInrFromUsd(x.price)} / night
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

