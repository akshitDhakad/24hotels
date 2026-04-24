"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/container";

export type PopularDestination = {
  name: string;
  accommodations: number;
  href: string;
  image: string;
};

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function PopularDestinationsCarousel({
  title = "Popular destinations outside India",
  items,
  className,
}: {
  title?: string;
  items: PopularDestination[];
  className?: string;
}) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  function scrollByCard() {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll roughly 2 cards; looks like the reference.
    el.scrollBy({ left: Math.round(el.clientWidth * 0.6), behavior: "smooth" });
  }

  return (
    <section className={cn("bg-white", className)}>
      <Container className="py-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        <div className="relative mt-6">
          <div
            ref={scrollerRef}
            className={cn(
              "flex gap-4 overflow-x-auto scroll-smooth pb-2",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {items.map((d) => (
              <Link
                key={d.name}
                href={d.href}
                className="group shrink-0"
                aria-label={d.name}
              >
                <div className="w-[170px] sm:w-[190px]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="190px"
                    />
                    <div className="absolute inset-0 ring-1 ring-black/5" />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-semibold text-foreground">
                      {d.name}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {formatNumber(d.accommodations)} accommodations
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollByCard}
            className="absolute right-0 top-[42%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:bg-black/5 md:inline-flex"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}

