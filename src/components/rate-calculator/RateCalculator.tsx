"use client";

import * as React from "react";

import { RateCalculatorInputs } from "@/components/rate-calculator/RateCalculatorInputs";
import { RateCalculatorTable } from "@/components/rate-calculator/RateCalculatorTable";
import { RateCalculatorMetrics } from "@/components/rate-calculator/RateCalculatorMetrics";
import { RateCalculatorChart } from "@/components/rate-calculator/RateCalculatorChart";
import { RateCalculatorPlanner } from "@/components/rate-calculator/RateCalculatorPlanner";
import { useRateCalculator } from "@/hooks/useRateCalculator";
import type { RateCalculatorProps } from "@/lib/rate-calculator/types";
import { DEFAULT_BASE_RATE } from "@/lib/rate-calculator/constants";
import { Card } from "@/components/ui/card";

export function RateCalculator(props: RateCalculatorProps) {
  const {
    baseRate,
    taxRate,
    minSlot,
    slots,
    roomCount,
    occupancy,
    setBaseRate,
    setTaxRate,
    setMinSlot,
    updateSurcharge,
    resetSurcharges,
    setRoomCount,
    setOccupancy,
    selectSlot,
    derived,
  } = useRateCalculator(props);

  const currencySymbol = props.currencySymbol ?? "₹";
  const locale = props.locale ?? "en-IN";
  const roomName = props.roomName ?? "Standard Room";
  const showRevenue = props.showRevenueSection ?? true;
  const showSurcharge = props.showSurchargeEditor ?? true;

  const fullDay = derived.slotData.find((s) => s.hours === 24);
  const fullDaySubtotal = fullDay?.subtotal ?? DEFAULT_BASE_RATE;

  return (
    <div className="grid gap-6">
      <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Room
        </div>
        <div className="mt-1 text-lg font-semibold">{roomName}</div>
      </Card>

      <RateCalculatorInputs
        baseRate={baseRate}
        taxRate={taxRate}
        minSlot={minSlot}
        perHourBase={derived.perHourBase}
        slots={slots}
        locale={locale}
        currencySymbol={currencySymbol}
        showSurchargeEditor={showSurcharge}
        onBaseRateChange={setBaseRate}
        onTaxRateChange={setTaxRate}
        onMinSlotChange={setMinSlot}
        onSurchargeChange={(hours, v) => updateSurcharge(hours, v)}
        onResetSurcharges={resetSurcharges}
      />

      <RateCalculatorTable
        slotData={derived.slotData}
        locale={locale}
        currencySymbol={currencySymbol}
        onSelect={selectSlot}
      />

      <RateCalculatorMetrics
        slotData={derived.slotData}
        bestValueSlot={derived.bestValueSlot}
        locale={locale}
        currencySymbol={currencySymbol}
        maxDailyRevenue={derived.maxDailyRevenue}
      />

      <RateCalculatorChart
        slotData={derived.slotData}
        locale={locale}
        currencySymbol={currencySymbol}
        fullDayBaseRate={fullDaySubtotal}
      />

      <RateCalculatorPlanner
        show={showRevenue}
        roomCount={roomCount}
        occupancy={occupancy}
        onRoomCountChange={setRoomCount}
        onOccupancyChange={setOccupancy}
        daily={derived.dailyRevenueEstimate}
        monthly={derived.monthlyRevenueEstimate}
        annual={derived.annualRevenueEstimate}
        locale={locale}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}

