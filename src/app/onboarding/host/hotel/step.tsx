"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

const schema = z.object({
  hotelName: z.string().trim().min(2, "Enter hotel name").max(120),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  address: z.string().trim().min(3, "Enter address").max(200).optional(),
});
type Values = z.infer<typeof schema>;

export function HostHotelForm() {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { country: "India" },
    mode: "onBlur",
  });
  const errors = form.formState.errors;

  async function onSubmit(values: Values) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/onboarding/host/hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || json.success === false) {
        setSubmitError(json.message ?? "Could not save hotel details.");
        return;
      }
      window.location.href = "/onboarding/host/kyc";
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      title="Step 3: Hotel details"
      subtitle="Add the basic details now. You can complete the full listing after verification."
      maxWidthClassName="max-w-md"
    >
      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
          {submitError}
        </div>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 grid gap-4 text-left">
        <div className="grid gap-2">
          <Label className="text-xs text-[#0f2d1c]" htmlFor="hotelName">
            Hotel name <span className="text-red-600">*</span>
          </Label>
          <Input
            id="hotelName"
            className={cn(
              "h-12 rounded-full border-black/10 bg-white",
              errors.hotelName ? "ring-2 ring-red-500/40" : "",
            )}
            {...form.register("hotelName")}
          />
          {errors.hotelName ? <p className="text-xs text-red-600">{errors.hotelName.message}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="city">
              City <span className="text-red-600">*</span>
            </Label>
            <Input
              id="city"
              className={cn("h-12 rounded-full border-black/10 bg-white", errors.city ? "ring-2 ring-red-500/40" : "")}
              {...form.register("city")}
            />
            {errors.city ? <p className="text-xs text-red-600">{errors.city.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="country">
              Country <span className="text-red-600">*</span>
            </Label>
            <Input
              id="country"
              className={cn(
                "h-12 rounded-full border-black/10 bg-white",
                errors.country ? "ring-2 ring-red-500/40" : "",
              )}
              {...form.register("country")}
            />
            {errors.country ? <p className="text-xs text-red-600">{errors.country.message}</p> : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-[#0f2d1c]" htmlFor="address">
            Hotel address
          </Label>
          <Input
            id="address"
            className={cn("h-12 rounded-full border-black/10 bg-white", errors.address ? "ring-2 ring-red-500/40" : "")}
            {...form.register("address")}
          />
          {errors.address ? <p className="text-xs text-red-600">{errors.address.message}</p> : null}
        </div>

        <Button type="submit" className="mt-1 h-12 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Continue to KYC"}
        </Button>
      </form>
    </AuthSplitLayout>
  );
}

