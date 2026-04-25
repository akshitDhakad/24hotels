export type FeaturedHomeCity =
  | "Bangalore"
  | "Mumbai"
  | "Goa"
  | "Hyderabad"
  | "New Delhi";

export const FEATURED_HOME_CITIES: FeaturedHomeCity[] = [
  "Bangalore",
  "Mumbai",
  "Goa",
  "Hyderabad",
  "New Delhi",
];

export type FeaturedHome = {
  id: string;
  name: string;
  image: string;
  score: number;
  stars: number;
  neighborhood: string;
  city: FeaturedHomeCity;
  priceInr: number;
  /** Shown as teal pills on the image (top-left), max 2 used in UI */
  imageBadges?: readonly string[];
};

export const featuredHomes: FeaturedHome[] = [
  {
    id: "blr_1",
    name: "ICON GRAND HOTEL BY BHAGINI",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    score: 8.5,
    stars: 4,
    neighborhood: "Whitefield",
    city: "Bangalore",
    priceInr: 2665.24,
    imageBadges: ["Breakfast included", "Free cancellation"],
  },
  {
    id: "blr_2",
    name: "Yello Stays ITP",
    image:
      "https://images.unsplash.com/photo-1551887373-6f3f3c5f6c3a?auto=format&fit=crop&w=1600&q=80",
    score: 8.1,
    stars: 4,
    neighborhood: "HSR Layout",
    city: "Bangalore",
    priceInr: 3557.17,
    imageBadges: ["Instant booking", "Free cancellation"],
  },
  {
    id: "blr_3",
    name: "HomeSlice Nazaara, HomeStay in BTM",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    score: 7.7,
    stars: 3,
    neighborhood: "BTM Layout",
    city: "Bangalore",
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
    city: "Mumbai",
    priceInr: 4899.0,
    imageBadges: ["Sea view", "Breakfast included"],
  },
  {
    id: "mum_2",
    name: "Urban Boutique Stay",
    image:
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1600&q=80",
    score: 7.9,
    stars: 4,
    neighborhood: "Andheri",
    city: "Mumbai",
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
    city: "Mumbai",
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
    city: "Goa",
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
    city: "Goa",
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
    city: "Goa",
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
    city: "Hyderabad",
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
    city: "Hyderabad",
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
    city: "Hyderabad",
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
    city: "New Delhi",
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
    city: "New Delhi",
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
    city: "New Delhi",
    priceInr: 7499.0,
  },
];
