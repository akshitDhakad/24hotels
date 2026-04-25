import type { SlotConfig } from "./types";

export const DEFAULT_BASE_RATE = 2000;
export const DEFAULT_TAX_RATE = 12;
export const DEFAULT_MIN_SLOT = 4;

export const SLOT_HOURS = [4, 8, 12, 16, 20, 24] as const;

export const DEFAULT_SURCHARGES: Record<(typeof SLOT_HOURS)[number], number> = {
  4: 50,
  8: 40,
  12: 30,
  16: 20,
  20: 10,
  24: 0,
};

export const DEFAULT_SLOTS: SlotConfig[] = SLOT_HOURS.map((hours) => ({
  hours,
  surchargePercent: DEFAULT_SURCHARGES[hours],
}));

export const DEFAULT_ROOM_COUNT = 20;
export const DEFAULT_OCCUPANCY = 60; // %

