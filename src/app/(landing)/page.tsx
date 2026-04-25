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
import { trendingStayToListing } from "@/features/hotels/hotel-listing-mappers";
import { featuredHomes } from "@/features/landing/featured-homes";
import { trendingStays } from "@/features/landing/trending-stays";
import { NewsletterSignupSection } from "@/components/marketing/newsletter-signup-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const topDestinations = [
  {
    name: "Paris",
    country: "France",
    href: "/hotels?destination=Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Tokyo",
    country: "Japan",
    href: "/hotels?destination=Tokyo",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bali",
    country: "Indonesia",
    href: "/hotels?destination=Bali",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sydney",
    country: "Australia",
    href: "/hotels?destination=Sydney",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
  },
];

const popularOutsideIndia = [
  {
    name: "Kuala Lumpur",
    accommodations: 19902,
    href: "/hotels?destination=Kuala%20Lumpur",
    image:
      "https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Manila",
    accommodations: 13223,
    href: "/hotels?destination=Manila",
    image:
      "https://images.unsplash.com/photo-1589893931034-bd7a0d2c9b8a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Jakarta",
    accommodations: 14249,
    href: "/hotels?destination=Jakarta",
    image:
      "https://images.unsplash.com/photo-1555899434-94d1368aa6a7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bangkok",
    accommodations: 12048,
    href: "/hotels?destination=Bangkok",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Dubai",
    accommodations: 19464,
    href: "/hotels?destination=Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Singapore",
    accommodations: 11802,
    href: "/hotels?destination=Singapore",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function LandingPage() {
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

      <PopularDestinationsCarousel items={popularOutsideIndia} />
      <FeaturedHomesSection items={featuredHomes} />


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
          {trendingStays.map((h) => (
            <HotelListingCard
              key={h.id}
              listing={trendingStayToListing(h)}
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

