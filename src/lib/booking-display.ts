/** Stay line e.g. “SEP 12 – SEP 18” for dashboard cards. */
export function formatStayDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const a = new Intl.DateTimeFormat("en-US", opts).format(start).toUpperCase();
  const b = new Intl.DateTimeFormat("en-US", opts).format(end).toUpperCase();
  return `${a} – ${b}`;
}

/**
 * Formats amounts stored in the smallest currency unit (e.g. paise / cents).
 */
export function formatMinorCurrency(amountMinor: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amountMinor / 100);
  } catch {
    return `${Math.round(amountMinor / 100)} ${currency}`;
  }
}

/** Whole-unit prices (e.g. room `pricePerNight` as integer major units). */
export function formatMajorCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
