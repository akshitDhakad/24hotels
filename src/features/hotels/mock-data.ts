export type HotelId = "r_1" | "r_2" | "r_3";

export type HotelSummary = {
  id: HotelId;
  name: string;
  location: string;
  rating: number; // 0..10
  reviewLabel: string;
  priceUsd: number;
  perks: string[];
  image: string;
  isTopRated?: boolean;
};

export type HotelRoom = {
  id: string;
  name: string;
  sleeps: number;
  bed: string;
  refundable: boolean;
  priceUsd: number;
};

export type HotelDetails = HotelSummary & {
  description: string;
  gallery: string[];
  amenities: string[];
  rooms: HotelRoom[];
  reviewCount: number;
};

export const hotelSummaries: HotelSummary[] = [
  {
    id: "r_1",
    name: "The Azure Meridian",
    location: "Promenade des Anglais, Nice",
    rating: 9.4,
    reviewLabel: "Exceptional",
    priceUsd: 890,
    perks: ["Breakfast included", "Free cancellation"],
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "r_2",
    name: "Villa Ethereal Waters",
    location: "Oia, Santorini",
    rating: 9.8,
    reviewLabel: "Exceptional",
    priceUsd: 1850,
    perks: ["Private airport shuttle", "Instant booking"],
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    isTopRated: true,
  },
  {
    id: "r_3",
    name: "Harbor View Penthouse",
    location: "Marina Bay, Singapore",
    rating: 8.9,
    reviewLabel: "Excellent",
    priceUsd: 595,
    perks: ["Flexible check-in", "Free cancellation"],
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
  },
];

const detailsById: Record<HotelId, HotelDetails> = {
  r_1: {
    ...hotelSummaries[0],
    reviewCount: 412,
    description:
      "A refined coastal retreat with panoramic sea views, curated dining, and effortless access to Nice’s iconic promenade.",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1551887373-6f3f3c5f6c3a?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1501117716987-c8e2a49e5f8a?auto=format&fit=crop&w=2000&q=80",
    ],
    amenities: [
      "Free Wi‑Fi",
      "Breakfast included",
      "Ocean view",
      "Pool",
      "Spa & wellness",
      "Airport shuttle",
      "Fitness center",
      "24/7 concierge",
    ],
    rooms: [
      {
        id: "rm_1",
        name: "Deluxe King Room",
        sleeps: 2,
        bed: "1 king bed",
        refundable: true,
        priceUsd: 890,
      },
      {
        id: "rm_2",
        name: "Premier Suite with Sea View",
        sleeps: 3,
        bed: "1 king bed + sofa",
        refundable: false,
        priceUsd: 1180,
      },
    ],
  },
  r_2: {
    ...hotelSummaries[1],
    reviewCount: 128,
    description:
      "A serene hillside villa with private terraces and sunset views over Santorini’s caldera—crafted for slow luxury.",
    gallery: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1501876725168-00c445821c9e?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80",
    ],
    amenities: [
      "Private pool",
      "Caldera views",
      "Chef on request",
      "Airport shuttle",
      "Free cancellation",
      "Fast Wi‑Fi",
      "Daily housekeeping",
    ],
    rooms: [
      {
        id: "rm_1",
        name: "Private Villa (2BR)",
        sleeps: 4,
        bed: "2 queen beds",
        refundable: true,
        priceUsd: 1850,
      },
      {
        id: "rm_2",
        name: "Villa (3BR) with Pool",
        sleeps: 6,
        bed: "3 queen beds",
        refundable: false,
        priceUsd: 2350,
      },
    ],
  },
  r_3: {
    ...hotelSummaries[2],
    reviewCount: 289,
    description:
      "A modern penthouse escape in the heart of Marina Bay with skyline views, thoughtful design, and premium service.",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=2000&q=80",
    ],
    amenities: [
      "City views",
      "Flexible check‑in",
      "Gym access",
      "High‑speed Wi‑Fi",
      "Workspace",
      "Kitchenette",
    ],
    rooms: [
      {
        id: "rm_1",
        name: "Penthouse Suite",
        sleeps: 2,
        bed: "1 king bed",
        refundable: true,
        priceUsd: 595,
      },
      {
        id: "rm_2",
        name: "Penthouse Suite with Balcony",
        sleeps: 3,
        bed: "1 king bed + sofa",
        refundable: false,
        priceUsd: 760,
      },
    ],
  },
};

export function getHotelDetails(id: string): HotelDetails | null {
  if (id === "r_1" || id === "r_2" || id === "r_3") return detailsById[id];
  return null;
}

