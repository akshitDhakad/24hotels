/**
 * Hour-based hotel slot pricing (pre-tax subtotal, then GST on subtotal).
 * Monotonic rule: shorter duration total (ex-tax) never exceeds a longer slot's total.
 */

export const HOURLY_SLOT_HOURS = [4, 8, 12, 16, 20, 24] as const;
export type HourlySlotHours = (typeof HOURLY_SLOT_HOURS)[number];

/** Default surcharge on top of per-hour base, by slot length (percent). */
export const DEFAULT_SLOT_SURCHARGE_PERCENT: Record<HourlySlotHours, number> = {
  4: 50,
  8: 40,
  12: 30,
  16: 20,
  20: 10,
  24: 0,
};

export type HourlySlotPricingRow = {
  hours: HourlySlotHours;
  surchargePercent: number;
  /** Formula output before monotonic correction */
  rawSubtotalExTax: number;
  /** Pre-tax after monotonic enforcement */
  subtotalExTax: number;
  taxAmount: number;
  totalInclTax: number;
  wasMonotonicAdjusted: boolean;
};

function roundMoney(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

export function mergeSlotSurcharges(
  partial?: Partial<Record<HourlySlotHours, number>>,
): Record<HourlySlotHours, number> {
  return { ...DEFAULT_SLOT_SURCHARGE_PERCENT, ...partial };
}

/**
 * Per-hour base = baseRate24hr ÷ 24.
 * Raw subtotal for a slot = (baseRate24hr ÷ 24) × (1 + surcharge%) × hours.
 * Then enforce 4h ≤ 8h ≤ … ≤ 24h on pre-tax subtotals by raising longer slots if needed.
 * Tax = subtotalExTax × (taxPercent ÷ 100); total = subtotal + tax.
 */
export function computeHourlySlotPricing(params: {
  baseRate24hr: number;
  taxPercent: number;
  surchargePercentBySlot?: Partial<Record<HourlySlotHours, number>>;
}): HourlySlotPricingRow[] {
  const surcharges = mergeSlotSurcharges(params.surchargePercentBySlot);
  const base = params.baseRate24hr;
  const taxPct = Math.max(0, params.taxPercent);

  if (!Number.isFinite(base) || base <= 0) {
    return HOURLY_SLOT_HOURS.map((hours) => ({
      hours,
      surchargePercent: surcharges[hours],
      rawSubtotalExTax: 0,
      subtotalExTax: 0,
      taxAmount: 0,
      totalInclTax: 0,
      wasMonotonicAdjusted: false,
    }));
  }

  const perHourBase = base / 24;
  const taxRate = taxPct / 100;

  const rawRows = HOURLY_SLOT_HOURS.map((hours) => {
    const s = surcharges[hours] / 100;
    const raw = perHourBase * (1 + s) * hours;
    return {
      hours,
      surchargePercent: surcharges[hours],
      rawSubtotalExTax: roundMoney(raw),
    };
  });

  let prevSubtotal = rawRows[0]?.rawSubtotalExTax ?? 0;
  const monotonic = rawRows.map((row, index) => {
    if (index === 0) {
      prevSubtotal = row.rawSubtotalExTax;
      return {
        ...row,
        subtotalExTax: row.rawSubtotalExTax,
        wasMonotonicAdjusted: false,
      };
    }
    let subtotalExTax = row.rawSubtotalExTax;
    let wasMonotonicAdjusted = false;
    if (subtotalExTax < prevSubtotal) {
      subtotalExTax = prevSubtotal;
      wasMonotonicAdjusted = true;
    }
    prevSubtotal = subtotalExTax;
    return {
      ...row,
      subtotalExTax,
      wasMonotonicAdjusted,
    };
  });

  return monotonic.map((row) => {
    const subtotalExTax = roundMoney(row.subtotalExTax);
    const taxAmount = roundMoney(subtotalExTax * taxRate);
    const totalInclTax = roundMoney(subtotalExTax + taxAmount);
    return {
      hours: row.hours,
      surchargePercent: row.surchargePercent,
      rawSubtotalExTax: row.rawSubtotalExTax,
      subtotalExTax,
      taxAmount,
      totalInclTax,
      wasMonotonicAdjusted: row.wasMonotonicAdjusted,
    };
  });
}

export function formatHourlyMoney(
  amount: number,
  currency: string,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
