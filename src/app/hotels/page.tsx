import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HotelResultCard, type HotelResult } from "@/components/hotel/hotel-result-card";
import { HotelResultsHeader } from "@/components/hotel/hotel-results-header";
import { HotelsFiltersSidebar } from "@/components/search/hotels-filters-sidebar";
import { hotelSummaries } from "@/features/hotels/mock-data";

type HotelsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const mockResults: HotelResult[] = hotelSummaries;

const recentlyViewed = [
  {
    id: "rv_1",
    name: "The Zen Sanctuary",
    location: "Kyoto, Japan",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rv_2",
    name: "Alpine Peak Lodge",
    location: "Zermatt, Switzerland",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rv_3",
    name: "Palazzo d'Oro",
    location: "Milan, Italy",
    price: 780,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rv_4",
    name: "Oceanic Overwater Villa",
    location: "Maldives",
    price: 2400,
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  },
];

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const sp = (await searchParams) ?? {};
  const destination =
    typeof sp.destination === "string" ? sp.destination : "";

  return (
    <div className="bg-[#fafafa]">
      <HotelResultsHeader />

      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-[288px_1fr]">
          <HotelsFiltersSidebar />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm font-semibold text-foreground">
                {destination ? `Stays in ${destination}` : "Most recommended"}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  className="rounded-full border border-border bg-white px-3 py-2 font-semibold text-foreground hover:bg-black/5"
                >
                  Free Cancellation
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border bg-white px-3 py-2 font-semibold text-foreground hover:bg-black/5"
                >
                  Instant Booking
                </button>
                <div className="ml-2 hidden items-center gap-2 text-muted-foreground md:flex">
                  Sort by:
                  <button
                    type="button"
                    className="rounded-full border border-border bg-white px-3 py-2 font-semibold text-foreground hover:bg-black/5"
                  >
                    Most Recommended ▾
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid lg:grid-cols-2 gap-4">
              {mockResults.map((h) => (
                <HotelResultCard key={h.id} hotel={h} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              {["‹", "1", "2", "3", "…", "12", "›"].map((p, idx) => (
                <button
                  key={`${p}-${idx}`}
                  type="button"
                  className={
                    p === "1"
                      ? "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:brightness-[0.92]"
                      : "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-black/5"
                  }
                  aria-label={`Page ${p}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Recently viewed</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Resume your search from where you left off.
              </div>
            </div>
            <Link href="#" className="text-sm font-semibold text-primary hover:underline">
              View all history
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewed.map((x) => (
              <div key={x.id} className="overflow-hidden rounded-2xl border border-border bg-white">
                <div className="relative aspect-[16/10] bg-muted">
                  <Image
                    src={x.image}
                    alt={x.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold">{x.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{x.location}</div>
                  <div className="mt-2 text-xs font-semibold">${x.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

