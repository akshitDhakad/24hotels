"use client";

import * as React from "react";

import { cn } from "@/lib/cn";
import type { SignUpValues } from "@/utils/validation/auth";

type AccountType = SignUpValues["role"];

const options: { value: AccountType; label: string; hint: string }[] = [
  { value: "customer", label: "Customer", hint: "Book stays" },
  { value: "host", label: "Host", hint: "Hotel Owner" },
];

export function RoleToggle({
  value,
  onChange,
  showAdminOption,
  className,
}: {
  value: AccountType;
  onChange: (next: AccountType) => void;
  showAdminOption: boolean;
  className?: string;
}) {
  const visible = React.useMemo(
    () => (showAdminOption ? options : options.filter((o) => o.value !== "admin")),
    [showAdminOption],
  );

  React.useEffect(() => {
    if (!showAdminOption && value === "admin") {
      onChange("customer");
    }
  }, [showAdminOption, value, onChange]);

  return (
    <div className={cn("grid gap-2 w-full", className)}>
      <div className="text-[11px] font-semibold tracking-wide text-[#58705f]">I am signing up as</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {visible.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition",
                active
                  ? "border-primary bg-primary/10 ring-2 ring-primary/25"
                  : "border-black/10 bg-white hover:bg-black/[0.02]",
              )}
            >
              <div className="text-sm font-semibold text-[#0f2d1c]">{o.label}</div>
              <div className="mt-0.5 text-[11px] text-[#58705f]">{o.hint}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
