import {
  BadgeDollarSign,
  Headphones,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HeroHeader } from "@/components/layout/hero-header";
import { HeroSearchBar } from "@/components/search/hero-search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    name: "The Grand Venetian",
    city: "Venice, Italy",
    price: 1250,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Aman Tokyo Skyline",
    city: "Tokyo, Japan",
    price: 2800,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e2a49e5f8a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Azure Sands Resort",
    city: "Maldives",
    price: 1900,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background">
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
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black">
                <BadgeDollarSign className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">Best Price Guarantee</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Price match within 24 hours.
              </div>
            </div>
            <div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">Fast Confirmation</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Instant booking confirmation.
              </div>
            </div>
            <div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">Verified Reviews</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Real stays. Real ratings.
              </div>
            </div>
            <div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black">
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
              <div className="relative h-44 overflow-hidden rounded-2xl bg-muted">
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
            <Card key={h.name} className="overflow-hidden">
              <div className="relative h-44 bg-muted">
                <Image
                  src={h.image}
                  alt={h.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{h.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {h.city}
                    </div>
                  </div>
                  <Badge className="gap-1">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {h.rating.toFixed(1)}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="text-sm font-semibold">
                    ${h.price.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      <section className="bg-black text-white">
        <Container className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-semibold tracking-tight">
              Join the inner circle of global travelers.
            </h3>
            <p className="mt-3 text-sm text-white/70">
              Get early access to promotions, hidden deals and concierge offers
              directly in your inbox.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg gap-2 rounded-2xl bg-white/10 p-2">
              <input
                className="h-11 flex-1 rounded-xl bg-transparent px-4 text-sm outline-none placeholder:text-white/50"
                placeholder="Your email address"
                aria-label="Email address"
              />
              <Button className="h-11 rounded-xl px-6">Subscribe</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

