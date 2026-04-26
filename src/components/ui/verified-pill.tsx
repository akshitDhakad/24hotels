import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

export function VerifiedPill({
  className,
  label = "Verified",
  title,
}: {
  className?: string;
  label?: string;
  /** Native tooltip (e.g. “Phone verified”) when label is shortened to “Verified”. */
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800",
        className,
      )}
    >
      <Check className="h-3 w-3 text-emerald-700" aria-hidden />
      {label}
    </span>
  );
}
