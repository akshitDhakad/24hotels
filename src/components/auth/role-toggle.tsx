"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

type Role = "user" | "vendor";

export function RoleToggle({
  value,
  onChange,
  className,
}: {
  value: Role;
  onChange: (next: Role) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-6", className)}>
      <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input
          type="radio"
          checked={value === "user"}
          onChange={() => onChange("user")}
        />
        As a User
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input
          type="radio"
          checked={value === "vendor"}
          onChange={() => onChange("vendor")}
        />
        As a Hotel Owner
      </label>
    </div>
  );
}

