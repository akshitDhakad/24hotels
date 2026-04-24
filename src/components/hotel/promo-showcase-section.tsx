import { ArrowRight, ChevronRight, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";

const partnerNames = [
  "HELLOSIGN",
  "DOORDASH",
  "coinbase",
  "Airtable",
  "pendo",
  "treehouse",
] as const;

export function PromoShowcaseSection() {
  return (
    <section className="bg-[#fafafa]">
      <Container className="py-12 sm:py-14 lg:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Get promo for a cheaper price.
          </h2>
          <Link
            href="/hotels"
            className={cn(
              "inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full bg-black/5 px-4 pr-3 text-sm font-medium text-foreground transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            See All
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {/* Promo cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <Link
            href="/hotels"
            className="group relative isolate block min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[300px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=80"
              alt="Promo: extra discount at Azure Oasis Hotel"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
            <div className="absolute left-4 top-4 flex w-full items-start justify-between gap-3 pr-8">
              <span
                className="h-9 w-9 shrink-0 rounded-full bg-[#facc15] ring-2 ring-black/10"
                aria-hidden
              />
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-medium leading-tight text-white backdrop-blur-sm sm:text-[11px]">
                Valid only on 14 Jan - 28 Jan 2024
              </span>
            </div>
            <div className="absolute inset-x-4 bottom-5 sm:inset-x-5 sm:bottom-6">
              <p className="max-w-sm text-sm font-medium leading-snug text-white/95">
                Get Extra Discount at Azure Oasis Hotel
              </p>
              <p className="mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                50%
              </p>
              <p className="mt-2 text-[11px] text-white/60">*with Terms and Condition</p>
            </div>
          </Link>

          <Link
            href="/hotels"
            className="group relative isolate block min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[300px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
              alt="Promo: exclusive deals"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
            <div className="absolute left-4 top-4 flex w-full items-start justify-between gap-3 pr-8">
              <span
                className="h-9 w-9 shrink-0 rounded-full bg-[#facc15] ring-2 ring-black/10"
                aria-hidden
              />
              <span className="rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-medium leading-tight text-white backdrop-blur-sm sm:text-[11px]">
                Valid only on 16 Jan - 28 Jan 2024
              </span>
            </div>
            <div className="absolute inset-x-4 bottom-5 sm:inset-x-5 sm:bottom-6">
              <p className="max-w-sm text-sm font-medium leading-snug text-white/95">
                Exclusive Deals just For You
              </p>
              <p className="mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                75%
              </p>
              <p className="mt-2 text-[11px] text-white/60">*with Terms and Condition</p>
            </div>
          </Link>
        </div>

        {/* Partner logos */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 border-y border-black/5 py-10 sm:justify-between sm:gap-x-6">
          {partnerNames.map((name) => (
            <span
              key={name}
              className="text-xs font-semibold tracking-[0.2em] text-muted-foreground/80 sm:text-sm"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Bottom grid: left stack + right tall */}
        <div className="mt-10 grid gap-4 lg:min-h-[520px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-5 lg:items-stretch">
          <div className="flex min-h-0 flex-col gap-4 lg:h-full">
            <div className="relative isolate min-h-[220px] flex-1 overflow-hidden rounded-2xl bg-neutral-900 lg:min-h-0">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt=""
                fill
                className="object-cover opacity-40"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/50" />
              <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                  <LayoutGrid className="h-5 w-5 text-white" aria-hidden />
                </div>
                <div>
                  <h3 className="max-w-[18rem] text-lg font-semibold leading-snug text-white sm:text-xl">
                    Explore more to get your comfort zone
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-white/70">
                    Book your perfect stay with us.
                  </p>
                  <Link
                    href="/hotels"
                    className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Booking Now
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/hotels"
              className="group relative isolate min-h-[220px] flex-1 overflow-hidden rounded-2xl lg:min-h-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1611892440504-42a792e54d34?auto=format&fit=crop&w=1200&q=80"
                alt="Hotel room"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                <p className="text-xs font-medium text-white/80">Hotel Available</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  1,764,980
                </p>
              </div>
            </Link>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-2xl lg:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80"
              alt="Luxury bedroom"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
              <p className="max-w-md text-center text-xl font-semibold leading-snug text-white sm:text-2xl">
                Beyond accommodation, creating memories of a lifetime.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
