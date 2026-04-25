import type * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type HostKpiCardProps = {
  title: string;
  value: string;
  delta?: { label: string; tone?: "positive" | "neutral" };
  icon: React.ComponentType<{ className?: string }>;
};

export function HostKpiCard({ title, value, delta, icon: Icon }: HostKpiCardProps) {
  const tone = delta?.tone ?? "neutral";
  return (
    <Card className="border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/[0.04]">
          <Icon className="h-4.5 w-4.5 text-black/60" />
        </div>
        {delta ? (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
              tone === "positive" ? "bg-emerald-50 text-emerald-700" : "bg-black/[0.04] text-black/50",
            )}
          >
            {delta.label}
          </span>
        ) : null}
      </div>
      <div className="mt-5 text-[11px] font-semibold tracking-wide text-black/45">{title.toUpperCase()}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </Card>
  );
}

