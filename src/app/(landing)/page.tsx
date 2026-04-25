import {
  BadgeDollarSign,
  Headphones,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/container";
import { HeroHeader } from "@/components/layout/hero-header";
import { HeroSearchBar } from "@/components/search/hero-search-bar";
import { PopularDestinationsCarousel } from "@/components/hotel/popular-destinations-carousel";
import { FeaturedHomesSection } from "@/components/hotel/featured-homes-section";
import { PromoShowcaseSection } from "@/components/hotel/promo-showcase-section";
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

const trendingHotels = [
  {
    id: "tr_1",
    name: "The Grand Venetian",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    score: 4.9,
    stars: 5,
    neighborhood: "Venice",
    city: "Italy",
    priceInr: 1250,
  },
  {
    id: "tr_2",
    name: "Aman Tokyo Skyline",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e2a49e5f8a?auto=format&fit=crop&w=1200&q=80",
    score: 4.8,
    stars: 5,
    neighborhood: "Tokyo",
    city: "Japan",
    priceInr: 2800,
  },
  {
    id: "tr_3",
    name: "Azure Sands Resort",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    score: 4.7,
    stars: 4,
    neighborhood: "Maldives",
    city: "Maldives",
    priceInr: 1900,
  },
] as const;

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

const featuredHomes = [
  {
    id: "blr_1",
    name: "ICON GRAND HOTEL BY BHAGINI",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    score: 8.5,
    stars: 4,
    neighborhood: "Whitefield",
    city: "Bangalore" as const,
    priceInr: 2665.24,
  },
  {
    id: "blr_2",
    name: "Yello Stays ITP",
    image:
      "https://images.unsplash.com/photo-1551887373-6f3f3c5f6c3a?auto=format&fit=crop&w=1600&q=80",
    score: 8.1,
    stars: 4,
    neighborhood: "HSR Layout",
    city: "Bangalore" as const,
    priceInr: 3557.17,
  },
  {
    id: "blr_3",
    name: "HomeSlice Nazaara, HomeStay in BTM",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    score: 7.7,
    stars: 3,
    neighborhood: "BTM Layout",
    city: "Bangalore" as const,
    priceInr: 1288.29,
  },
  {
    id: "mum_1",
    name: "Seaside Residency",
    image:
      "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80",
    score: 8.2,
    stars: 4,
    neighborhood: "Bandra",
    city: "Mumbai" as const,
    priceInr: 4899.0,
  },
  {
    id: "mum_2",
    name: "Urban Boutique Stay",
    image:
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1600&q=80",
    score: 7.9,
    stars: 4,
    neighborhood: "Andheri",
    city: "Mumbai" as const,
    priceInr: 3599.0,
  },
  {
    id: "mum_3",
    name: "Harbor View Suites",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    score: 8.4,
    stars: 5,
    neighborhood: "Colaba",
    city: "Mumbai" as const,
    priceInr: 6299.0,
  },
  {
    id: "goa_1",
    name: "Palm Grove Villa",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    score: 8.6,
    stars: 4,
    neighborhood: "Candolim",
    city: "Goa" as const,
    priceInr: 5799.0,
  },
  {
    id: "goa_2",
    name: "Beachside Bungalow",
    image:
      "https://images.unsplash.com/photo-1501876725168-00c445821c9e?auto=format&fit=crop&w=1600&q=80",
    score: 8.0,
    stars: 4,
    neighborhood: "Calangute",
    city: "Goa" as const,
    priceInr: 4499.0,
  },
  {
    id: "goa_3",
    name: "Sunset Cove Resort",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
    score: 8.3,
    stars: 5,
    neighborhood: "Baga",
    city: "Goa" as const,
    priceInr: 6999.0,
  },
  {
    id: "hyd_1",
    name: "Pearl City Hotel",
    image:
      "https://images.unsplash.com/photo-1560067174-8943bd7e9f88?auto=format&fit=crop&w=1600&q=80",
    score: 8.1,
    stars: 4,
    neighborhood: "Gachibowli",
    city: "Hyderabad" as const,
    priceInr: 3199.0,
  },
  {
    id: "hyd_2",
    name: "Tech Park Suites",
    image:
      "https://images.unsplash.com/photo-1551776235-dde6d482980b?auto=format&fit=crop&w=1600&q=80",
    score: 7.8,
    stars: 3,
    neighborhood: "HITEC City",
    city: "Hyderabad" as const,
    priceInr: 2699.0,
  },
  {
    id: "hyd_3",
    name: "Charminar Boutique Stay",
    image:
      "https://images.unsplash.com/photo-1560448075-bb4caa6c85b6?auto=format&fit=crop&w=1600&q=80",
    score: 8.0,
    stars: 4,
    neighborhood: "Banjara Hills",
    city: "Hyderabad" as const,
    priceInr: 4099.0,
  },
  {
    id: "del_1",
    name: "Heritage Courtyard Hotel",
    image:
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1600&q=80",
    score: 8.2,
    stars: 4,
    neighborhood: "Connaught Place",
    city: "New Delhi" as const,
    priceInr: 5299.0,
  },
  {
    id: "del_2",
    name: "Modern Capital Stay",
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80",
    score: 7.9,
    stars: 4,
    neighborhood: "Karol Bagh",
    city: "New Delhi" as const,
    priceInr: 3399.0,
  },
  {
    id: "del_3",
    name: "Garden View Suites",
    image:
      "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1600&q=80",
    score: 8.4,
    stars: 5,
    neighborhood: "Aerocity",
    city: "New Delhi" as const,
    priceInr: 7499.0,
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
          {trendingHotels.map((h) => (
            <Link key={h.id} href="/hotels" className="group">
              <div className="overflow-hidden rounded-xl">
                <div className="relative aspect-[16/10] bg-muted">
                  <Image
                    src={h.image}
                    alt={h.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow">
                    {h.score.toFixed(1)}
                  </div>
                </div>
                <div className="bg-white pt-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-black/60">
                    {h.name}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-black/60">
                    <div className="flex items-center gap-0.5 text-[#f59e0b]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < h.stars ? "fill-current" : "fill-transparent",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-black/40">•</span>
                    <span>{h.neighborhood}</span>
                    <span className="text-black/40">,</span>
                    <span className="text-primary">{h.city}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-black/45">
                    Per night before taxes and fees
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#b91c1c]">
                    ₹
                    {h.priceInr.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      <PromoShowcaseSection />

      <NewsletterSignupSection />
    </div>
  );
}

