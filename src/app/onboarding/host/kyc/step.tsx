"use client";

import * as React from "react";

import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type DocType = "AADHAAR" | "PASSPORT" | "DRIVERS_LICENSE" | "NATIONAL_ID";

const options: { key: DocType; label: string; hint: string }[] = [
  { key: "AADHAAR", label: "Aadhaar Card (India)", hint: "Front + back (if applicable) + live selfie" },
  { key: "PASSPORT", label: "Passport", hint: "Photo page + live selfie" },
  { key: "DRIVERS_LICENSE", label: "Driver's License", hint: "Front + back (if applicable) + live selfie" },
  { key: "NATIONAL_ID", label: "National ID / Voter ID", hint: "Front + back (if applicable) + live selfie" },
];

export function HostKycStep() {
  const [selected, setSelected] = React.useState<DocType | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onContinue() {
    if (!selected) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/onboarding/host/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: selected }),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || json.success === false) {
        setSubmitError(json.message ?? "Could not save KYC choice.");
        return;
      }
      window.location.href = "/host/dashboard";
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      title="Step 4: Owner identity verification (KYC)"
      subtitle="Choose one document. Upload + live selfie comes next."
      maxWidthClassName="max-w-xl"
    >
      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
          {submitError}
        </div>
      ) : null}

      <div className="mt-2 grid gap-3">
        {options.map((o) => {
          const active = selected === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => setSelected(o.key)}
              className={cn(
                "rounded-2xl border px-5 py-4 text-left transition",
                active
                  ? "border-primary bg-primary/10 ring-2 ring-primary/25"
                  : "border-black/10 bg-white hover:bg-black/[0.02]",
              )}
            >
              <div className="text-sm font-semibold text-[#0f2d1c]">{o.label}</div>
              <div className="mt-1 text-[11px] text-[#58705f]">{o.hint}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <Button
          type="button"
          className="h-12 w-full rounded-full"
          disabled={!selected || isSubmitting}
          onClick={onContinue}
        >
          {isSubmitting ? "Saving…" : "Continue"}
        </Button>
      </div>
    </AuthSplitLayout>
  );
}

