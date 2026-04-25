import type { SlotConfig, SlotData } from "./types";

/**
 * Computes base per-hour rate from a 24-hour base rate.
 */
export function computePerHourBase(baseRate: number): number {
  return baseRate / 24;
}

/**
 * Computes subtotal (pre-tax) price for a slot using:
 * (baseRate ÷ 24) × (1 + surcharge%) × hours
 */
export function computeSlotPrice(
  baseRate: number,
  surchargePercent: number,
  hours: number,
): number {
  const perHour = computePerHourBase(baseRate);
  const multiplier = 1 + surchargePercent / 100;
  return perHour * multiplier * hours;
}

/**
 * Enforces monotonic constraint:
 * shorter slot total must never exceed longer slot total.
 * If it does, it is adjusted upward to match previous slot price.
 */
export function enforceMonotonicPrices(rawPrices: number[]): {
  prices: number[];
  adjusted: boolean[];
} {
  const prices = [...rawPrices];
  const adjusted = rawPrices.map(() => false);

  for (let i = 1; i < prices.length; i += 1) {
    if (prices[i] < prices[i - 1]) {
      prices[i] = prices[i - 1];
      adjusted[i] = true;
    }
  }

  return { prices, adjusted };
}

export function computeAllSlots(
  baseRate: number,
  taxRate: number,
  slotConfigs: SlotConfig[],
): SlotData[] {
  const raw = slotConfigs.map((s) =>
    computeSlotPrice(baseRate, s.surchargePercent, s.hours),
  );

  const { prices, adjusted } = enforceMonotonicPrices(raw);
  const fullDayIndex = slotConfigs.findIndex((s) => s.hours === 24);
  const fullDaySubtotal = fullDayIndex >= 0 ? prices[fullDayIndex] : prices[prices.length - 1] ?? 0;

  const slotData = slotConfigs.map((s, idx) => {
    const subtotal = prices[idx] ?? 0;
    const withTax = subtotal * (1 + taxRate / 100);
    const effectiveRatePerHour = s.hours > 0 ? subtotal / s.hours : 0;
    const percentOfFullDay =
      fullDaySubtotal > 0 ? (subtotal / fullDaySubtotal) * 100 : 0;

    return {
      hours: s.hours,
      surchargePercent: s.surchargePercent,
      effectiveRatePerHour,
      subtotal,
      withTax,
      percentOfFullDay,
      wasAdjusted: adjusted[idx] ?? false,
      isBestValue: false,
      isFullDay: s.hours === 24,
    } satisfies SlotData;
  });

  // best value = lowest effective per-hour rate
  let bestIdx = 0;
  for (let i = 1; i < slotData.length; i += 1) {
    if (slotData[i]!.effectiveRatePerHour < slotData[bestIdx]!.effectiveRatePerHour) {
      bestIdx = i;
    }
  }
  slotData[bestIdx] = { ...slotData[bestIdx]!, isBestValue: true };

  return slotData;
}

export function computeRevenueEstimates(
  slotData: SlotData[],
  roomCount: number,
  occupancy: number,
): {
  daily: number;
  monthly: number;
  annual: number;
} {
  const avgSubtotal =
    slotData.length > 0
      ? slotData.reduce((sum, s) => sum + s.subtotal, 0) / slotData.length
      : 0;
  const occ = occupancy / 100;
  const daily = roomCount * occ * avgSubtotal;
  return {
    daily,
    monthly: daily * 30,
    annual: daily * 365,
  };
}

