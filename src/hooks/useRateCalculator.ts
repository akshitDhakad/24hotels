"use client";

import * as React from "react";

import {
  DEFAULT_BASE_RATE,
  DEFAULT_MIN_SLOT,
  DEFAULT_OCCUPANCY,
  DEFAULT_ROOM_COUNT,
  DEFAULT_SLOTS,
  DEFAULT_TAX_RATE,
} from "@/lib/rate-calculator/constants";
import {
  computeAllSlots,
  computePerHourBase,
  computeRevenueEstimates,
} from "@/lib/rate-calculator/calculations";
import type {
  CalculatorDerived,
  CalculatorState,
  RateCalculatorProps,
  SlotConfig,
} from "@/lib/rate-calculator/types";

export function useRateCalculator(props: RateCalculatorProps) {
  const [baseRate, setBaseRate] = React.useState(
    props.defaultBaseRate ?? DEFAULT_BASE_RATE,
  );
  const [taxRate, setTaxRate] = React.useState(
    props.defaultTaxRate ?? DEFAULT_TAX_RATE,
  );
  const [minSlot, setMinSlot] = React.useState(DEFAULT_MIN_SLOT);
  const [slots, setSlots] = React.useState<SlotConfig[]>(DEFAULT_SLOTS);

  const [roomCount, setRoomCount] = React.useState(DEFAULT_ROOM_COUNT);
  const [occupancy, setOccupancy] = React.useState(DEFAULT_OCCUPANCY);

  const derived: CalculatorDerived = React.useMemo(() => {
    const perHourBase = computePerHourBase(baseRate);
    const slotData = computeAllSlots(baseRate, taxRate, slots);
    const bestValueSlot = slotData.find((s) => s.isBestValue) ?? slotData[0]!;

    const maxDailyRevenue =
      slotData.find((s) => s.hours === 4)?.withTax ?? slotData[0]?.withTax ?? 0;
    // 6× 4-hour bookings theoretical (with tax)
    const maxTheoreticalDaily = maxDailyRevenue * 6;

    const revenue = computeRevenueEstimates(slotData, roomCount, occupancy);

    return {
      perHourBase,
      slotData,
      bestValueSlot,
      maxDailyRevenue: maxTheoreticalDaily,
      dailyRevenueEstimate: revenue.daily * (1 + taxRate / 100),
      monthlyRevenueEstimate: revenue.monthly * (1 + taxRate / 100),
      annualRevenueEstimate: revenue.annual * (1 + taxRate / 100),
    };
  }, [baseRate, taxRate, slots, roomCount, occupancy]);

  function resetSurcharges() {
    setSlots(DEFAULT_SLOTS);
  }

  function updateSurcharge(hours: number, surchargePercent: number) {
    setSlots((prev) =>
      prev.map((s) =>
        s.hours === hours ? { ...s, surchargePercent } : s,
      ),
    );
  }

  function selectSlot(hours: number) {
    const slot = derived.slotData.find((s) => s.hours === hours);
    if (slot) props.onSlotSelect?.(slot);
  }

  const state: CalculatorState = {
    baseRate,
    taxRate,
    minSlot,
    slots,
    roomCount,
    occupancy,
  };

  return {
    ...state,
    setBaseRate,
    setTaxRate,
    setMinSlot,
    setSlots,
    setRoomCount,
    setOccupancy,
    resetSurcharges,
    updateSurcharge,
    selectSlot,
    derived,
  };
}

