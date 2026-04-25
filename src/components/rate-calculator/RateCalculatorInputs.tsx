"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, RotateCcw } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_SURCHARGES, SLOT_HOURS } from "@/lib/rate-calculator/constants";
import type { SlotConfig } from "@/lib/rate-calculator/types";
import { formatCurrency } from "@/lib/rate-calculator/utils";

const schema = z.object({
  baseRate: z.coerce.number().min(0).max(1_000_000),
  taxRate: z.coerce.number().min(0).max(50),
  minSlot: z.coerce.number().min(1).max(4),
});

export function RateCalculatorInputs({
  baseRate,
  taxRate,
  minSlot,
  perHourBase,
  slots,
  locale,
  currencySymbol,
  showSurchargeEditor,
  onBaseRateChange,
  onTaxRateChange,
  onMinSlotChange,
  onSurchargeChange,
  onResetSurcharges,
}: {
  baseRate: number;
  taxRate: number;
  minSlot: number;
  perHourBase: number;
  slots: SlotConfig[];
  locale: string;
  currencySymbol: string;
  showSurchargeEditor: boolean;
  onBaseRateChange: (v: number) => void;
  onTaxRateChange: (v: number) => void;
  onMinSlotChange: (v: number) => void;
  onSurchargeChange: (hours: number, v: number) => void;
  onResetSurcharges: () => void;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: { baseRate, taxRate, minSlot },
    mode: "onChange",
  });

  const perHour = formatCurrency(perHourBase, { locale, currencySymbol });

  return (
    <Card className="border-border bg-white/90 p-5 shadow-sm dark:bg-background">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            24-hr room rate
          </div>
          <Label htmlFor="baseRate" className="sr-only">
            24-hr room rate
          </Label>
          <Input
            id="baseRate"
            inputMode="decimal"
            {...form.register("baseRate", {
              onChange: (e) => onBaseRateChange(Number(e.target.value)),
            })}
          />
          <div className="text-xs text-muted-foreground">
            Per-hour base: <span className="font-mono font-semibold">{perHour}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            GST / Tax (%)
          </div>
          <Label htmlFor="taxRate" className="sr-only">
            GST / Tax (%)
          </Label>
          <Input
            id="taxRate"
            inputMode="decimal"
            {...form.register("taxRate", {
              onChange: (e) => onTaxRateChange(Number(e.target.value)),
            })}
          />
        </div>

        <div className="grid gap-2">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Min booking slot (hrs)
          </div>
          <Label htmlFor="minSlot" className="sr-only">
            Min booking slot (hrs)
          </Label>
          <div className="relative">
            <select
              id="minSlot"
              className="h-10 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("minSlot", {
                onChange: (e) => onMinSlotChange(Number(e.target.value)),
              })}
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={4}>4 hours</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {showSurchargeEditor ? (
        <div className="mt-5">
          <Collapsible defaultOpen>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  For hotel admin
                </div>
                <div className="text-sm font-semibold">Surcharge editor</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onResetSurcharges} type="button">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset defaults
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" type="button">
                    Toggle <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent className="mt-4">
              <div className="grid gap-3 md:grid-cols-5">
                {SLOT_HOURS.filter((h) => h !== 24).map((hours) => {
                  const slot = slots.find((s) => s.hours === hours);
                  const value = slot?.surchargePercent ?? DEFAULT_SURCHARGES[hours];
                  return (
                    <div key={hours} className="grid gap-1">
                      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {hours}h
                      </div>
                      <Input
                        inputMode="decimal"
                        value={value}
                        onChange={(e) => onSurchargeChange(hours, Number(e.target.value))}
                        aria-label={`${hours} hour surcharge percent`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                24h surcharge is always 0% (full day).
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : null}
    </Card>
  );
}

