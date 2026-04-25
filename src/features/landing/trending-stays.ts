export type TrendingStay = {
  id: string;
  name: string;
  image: string;
  score: number;
  stars: number;
  neighborhood: string;
  city: string;
  priceInr: number;
  href?: string;
  imageBadges?: readonly string[];
  ribbonBadge?: string;
};

export const trendingStays: TrendingStay[] = [
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
    href: "/hotels?destination=Venice",
    imageBadges: ["Breakfast included", "Free cancellation"],
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
    href: "/hotels?destination=Tokyo",
    imageBadges: ["Top rated", "Instant booking"],
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
    href: "/hotels?destination=Maldives",
    ribbonBadge: "Featured",
  },
];
