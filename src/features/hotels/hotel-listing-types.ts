export type HotelListingPrice =
  | { currency: "INR"; amount: number }
  | { currency: "USD"; amount: number };

export type HotelListingCardData = {
  id: string;
  href: string;
  name: string;
  image: string;
  /** Guest score shown on the dark blue badge (e.g. 8.5) */
  scoreBadge: number;
  stars: number;
  neighborhood: string;
  city: string;
  /** Top-left pill badges over the image (e.g. Breakfast included) */
  imageBadges?: readonly string[];
  /** Optional ribbon on the image (e.g. TOP RATED) */
  ribbonBadge?: string;
  wishlistHref?: string | null;
  price: HotelListingPrice;
};
