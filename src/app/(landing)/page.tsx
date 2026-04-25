import {
  BadgeDollarSign,
  Headphones,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HeroHeader } from "@/components/layout/hero-header";
import { HeroSearchBar } from "@/components/search/hero-search-bar";
import { PopularDestinationsCarousel } from "@/components/hotel/popular-destinations-carousel";
import { FeaturedHomesSection } from "@/components/hotel/featured-homes-section";
import { HotelListingCard } from "@/components/hotel/hotel-listing-card";
import { PromoShowcaseSection } from "@/components/hotel/promo-showcase-section";
import { hotelSummaryToListing } from "@/features/hotels/hotel-listing-mappers";
import type { HotelSummaryDto } from "@/features/hotels/hotels-api";
import { NewsletterSignupSection } from "@/components/marketing/newsletter-signup-section";
import { Button } from "@/components/ui/button";
import { readDb } from "@/app/api/_db/db";

type DestinationSummary = {
  name: string;
  country: string;
  accommodations: number;
  image: string;
  href: string;
  avgRating: number;
};

function normalizeDestination(hotel: HotelSummaryDto): { city: string; country: string } | null {
  const city = (hotel.city ?? "").trim();
  const country = (hotel.country ?? "").trim();
  if (!city || !country) return null;
  return { city, country };
}

function buildDestinationSummaries(hotels: HotelSummaryDto[]): DestinationSummary[] {
  const map = new Map<string, {
    city: string;
    country: string;
    count: number;
    ratingSum: number;
    image: string;
    imageRating: number;
  }>();

  for (const h of hotels) {
    const d = normalizeDestination(h);
    if (!d) continue;

    const key = `${d.city}__${d.country}`;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, {
        city: d.city,
        country: d.country,
        count: 1,
        ratingSum: h.rating,
        image: h.image,
        imageRating: h.rating,
      });
      continue;
    }

    prev.count += 1;
    prev.ratingSum += h.rating;
    if (h.rating > prev.imageRating && h.image) {
      prev.image = h.image;
      prev.imageRating = h.rating;
    }
  }

  return Array.from(map.values()).map((x) => {
    const avgRating = x.count ? x.ratingSum / x.count : 0;
    return {
      name: x.city,
      country: x.country,
      accommodations: x.count,
      image: x.image,
      href: `/hotels?destination=${encodeURIComponent(x.city)}`,
      avgRating,
    };
  });
}

function pickFeatured(hotels: HotelSummaryDto[]) {
  const featured = hotels.filter((h) => Boolean(h.isFeatured));
  if (featured.length > 0) return featured;
  return [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 12);
}

function pickTrending(hotels: HotelSummaryDto[]) {
  return [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 3);
}

export default async function LandingPage() {
  const db = await readDb();
  const hotels = (db.hotels ?? []) as HotelSummaryDto[];
  const featuredHotels = pickFeatured(hotels);
  const trendingHotels = pickTrending(hotels);

  const destinations = buildDestinationSummaries(hotels);
  const indiaPopular = destinations
    .filter((d) => d.country.toLowerCase() === "india")
    .sort((a, b) => b.accommodations - a.accommodations)
    .slice(0, 10)
    .map(({ name, accommodations, href, image }) => ({ name, accommodations, href, image }));

  const topDestinations = [...destinations]
    .sort((a, b) => (b.avgRating - a.avgRating) || (b.accommodations - a.accommodations))
    .slice(0, 4);

  return (
    <div className="bg-[#fafafa]">
      <section className="relative overflow-hidden min-h-[75svh]">
        <HeroHeader />

        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2200&q=80"
            alt="Luxury stay background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <Container className="relative flex min-h-[75svh] flex-col pb-10 pt-32 sm:pb-12 sm:pt-40 lg:pb-14 lg:pt-44">
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Find Your Best Staycation
            </h1>
          </div>

          <div className="mt-auto pt-10">
            <HeroSearchBar />
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-10">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black">
                <BadgeDollarSign className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">Best Price Guarantee</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Price match within 24 hours.
              </div>
            </div>
            <div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">Fast Confirmation</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Instant booking confirmation.
              </div>
            </div>
            <div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">Verified Reviews</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Real stays. Real ratings.
              </div>
            </div>
            <div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">24/7 Customer Support</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Concierge support anytime.
              </div>
            </div>
          </div>
        </Container>
      </section>

      <PopularDestinationsCarousel
        title="Popular destinations in India"
        items={indiaPopular}
      />
      <FeaturedHomesSection items={featuredHotels} />


      <Container className="py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-muted-foreground">
              Top Destinations
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Discover your destination
            </h2>
          </div>
          <Button variant="ghost" className="text-sm">
            Explore all
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topDestinations.map((d) => (
            <Link key={d.name} href={d.href} className="group">
              <div className="relative h-44 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={d.image}
                  alt={`${d.name} destination`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65),rgba(0,0,0,0.05))]" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="text-xs font-semibold text-white/70">
                    {d.country}
                  </div>
                  <div className="text-2xl font-semibold text-white">
                    {d.name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-muted-foreground">
              Trending hotels
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Trending stays
            </h2>
          </div>
          <Button variant="ghost" className="text-sm">
            See all
          </Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {trendingHotels.map((h) => (
            <HotelListingCard
              key={h.id}
              listing={hotelSummaryToListing(h, "INR")}
              imageSizes="(min-width: 768px) 33vw, 100vw"
            />
          ))}
        </div>
      </Container>

      <PromoShowcaseSection />

      <NewsletterSignupSection />
    </div>
  );
}

