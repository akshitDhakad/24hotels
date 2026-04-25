export interface SlotConfig {
  hours: number;
  surchargePercent: number;
}

export interface SlotData {
  hours: number;
  surchargePercent: number;
  effectiveRatePerHour: number;
  subtotal: number;
  withTax: number;
  percentOfFullDay: number;
  wasAdjusted: boolean;
  isBestValue: boolean;
  isFullDay: boolean;
}

export interface CalculatorState {
  baseRate: number;
  taxRate: number;
  minSlot: number;
  slots: SlotConfig[];
  roomCount: number;
  occupancy: number;
}

export interface CalculatorDerived {
  perHourBase: number;
  slotData: SlotData[];
  bestValueSlot: SlotData;
  maxDailyRevenue: number;
  dailyRevenueEstimate: number;
  monthlyRevenueEstimate: number;
  annualRevenueEstimate: number;
}

export interface RateCalculatorProps {
  defaultBaseRate?: number;
  defaultTaxRate?: number;
  currency?: string;
  currencySymbol?: string;
  locale?: string;
  roomName?: string;
  showRevenueSection?: boolean;
  showSurchargeEditor?: boolean;
  primaryColor?: string;
  onSlotSelect?: (slot: SlotData) => void;
}

