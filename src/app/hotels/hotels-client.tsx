"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { HotelResultCard } from "@/components/hotel/hotel-result-card";
import { HotelResultsHeader } from "@/components/hotel/hotel-results-header";
import { Container } from "@/components/layout/container";
import { HotelsFiltersSidebar } from "@/components/search/hotels-filters-sidebar";
import { getIntParam, getStringParam, setOrDelete } from "@/lib/url-state";
import { listHotels } from "@/features/hotels/hotels-api";
import { useHotelsResultsStore } from "@/store/hotels-results-store";
import { useSearchStore } from "@/store/search-store";

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

function buildPageItems(current: number, total: number) {
  const items: Array<number | "…"> = [];
  const add = (v: number | "…") => items.push(v);

  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) add(i);
    return items;
  }

  add(1);
  if (current > 3) add("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i += 1) add(i);

  if (current < total - 2) add("…");
  add(total);

  return items;
}

export function HotelsClientPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currency = useSearchStore((s) => s.params.currency);

  const destination = React.useMemo(() => {
    const sp = new URLSearchParams(searchParams?.toString());
    return getStringParam(sp, "destination", "").trim();
  }, [searchParams]);

  const urlPage = React.useMemo(() => {
    const sp = new URLSearchParams(searchParams?.toString());
    return getIntParam(sp, "page", 1, { min: 1, max: 10_000 });
  }, [searchParams]);

  const pageSize = useHotelsResultsStore((s) => s.pageSize);
  const setPage = useHotelsResultsStore((s) => s.setPage);

  React.useEffect(() => {
    setPage(urlPage);
  }, [setPage, urlPage]);

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["hotels", { destination, page: urlPage, pageSize }],
    queryFn: () => listHotels({ destination, page: urlPage, pageSize }),
    placeholderData: keepPreviousData,
  });

  const currentPage = data?.page ?? urlPage;
  const totalPages = data?.totalPages ?? 1;

  const pageItems = React.useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  function goToPage(nextPage: number) {
    const sp = new URLSearchParams(searchParams?.toString());
    setOrDelete(sp, "destination", destination || undefined);
    sp.set("page", String(nextPage));
    router.push(`${pathname}?${sp.toString()}`);
  }

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
                    Rating ▾
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {isPending ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[290px] rounded-xl border border-border bg-white/60"
                    aria-hidden="true"
                  />
                ))
              ) : isError ? (
                <div className="rounded-xl border border-border bg-white p-6 text-sm text-muted-foreground">
                  Couldn’t load hotels. Make sure the mock server is running on{" "}
                  <span className="font-semibold">localhost:4000</span>.
                </div>
              ) : (
                (data?.items ?? []).map((h) => (
                  <HotelResultCard key={h.id} hotel={h} currency={currency} />
                ))
              )}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-black/5 disabled:opacity-50"
                aria-label="Previous page"
              >
                ‹
              </button>

              {pageItems.map((p, idx) =>
                p === "…" ? (
                  <span
                    key={`dots-${idx}`}
                    className="inline-flex h-9 w-9 items-center justify-center text-xs font-semibold text-muted-foreground"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    className={
                      p === currentPage
                        ? "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:brightness-[0.92]"
                        : "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-black/5"
                    }
                    aria-label={`Page ${p}`}
                    aria-current={p === currentPage ? "page" : undefined}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-foreground hover:bg-black/5 disabled:opacity-50"
                aria-label="Next page"
              >
                ›
              </button>
            </div>

            {isFetching ? (
              <div className="mt-3 text-center text-xs text-muted-foreground">
                Updating results…
              </div>
            ) : null}
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
              <div key={x.id} className="overflow-hidden rounded-xl border border-border bg-white">
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

