export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

export type SearchParams = {
  destination: string;
  checkIn: string | null; // ISO date
  checkOut: string | null; // ISO date
  adults: number;
  children: number;
  rooms: number;
  currency: CurrencyCode;
};

