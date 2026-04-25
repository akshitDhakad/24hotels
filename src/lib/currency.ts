import type { CurrencyCode } from "@/types/search";

// For demo/testing. In production this should come from a rates service.
export const USD_TO_INR_RATE = 83;

export function convertFromUsd(amountUsd: number, currency: CurrencyCode): number {
  if (currency === "INR") return amountUsd * USD_TO_INR_RATE;
  return amountUsd;
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

