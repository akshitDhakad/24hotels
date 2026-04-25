export function formatSlotLabel(hours: number) {
  return `${hours}h`;
}

export function clampNumber(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

export function formatCurrency(
  amount: number,
  opts: { locale: string; currencySymbol: string; maximumFractionDigits?: number },
) {
  const { locale, currencySymbol, maximumFractionDigits = 2 } = opts;
  return `${currencySymbol}${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  })}`;
}

