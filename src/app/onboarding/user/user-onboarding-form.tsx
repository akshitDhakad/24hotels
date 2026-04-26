"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthBrand } from "@/components/auth/auth-brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

const schema = z
  .object({
    // String field keeps RHF + zodResolver typings stable; parse to number in onSubmit.
    age: z.string().optional(),
    address1: z.string().trim().min(3, "Enter address").max(200),
    address2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    postalCode: z.string().trim().min(3).max(20),
    country: z.string().trim().min(2).max(80),
  })
  .superRefine((data, ctx) => {
    if (!data.age?.trim()) return;
    const n = Number(data.age);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 18 || n > 120) {
      ctx.addIssue({ code: "custom", message: "Enter a valid age (18–120)", path: ["age"] });
    }
  });
type Values = z.infer<typeof schema>;

export function UserOnboardingForm() {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { country: "India", age: "" },
    mode: "onBlur",
  });
  const errors = form.formState.errors;

  async function onSubmit(values: Values) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const ageStr = values.age?.trim();
      const age =
        ageStr && ageStr.length > 0
          ? Number(ageStr)
          : undefined;
      const res = await fetch("/api/v1/onboarding/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          age: age === undefined || Number.isNaN(age) ? undefined : age,
        }),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || json.success === false) {
        setSubmitError(json.message ?? "Could not save details.");
        return;
      }
      window.location.href = "/user/dashboard";
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center px-8 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-md">
          <AuthBrand />
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[#0f2d1c] sm:mt-10">
            Step 2: Personal details
          </h1>
          <p className="mt-2 text-xs text-[#58705f]">
            This helps us keep bookings secure and compliant.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-4 text-left">
            {submitError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                {submitError}
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="age">
                Age
              </Label>
              <Input
                id="age"
                type="text"
                inputMode="numeric"
                className={cn("h-12 rounded-full border-black/10 bg-white", errors.age ? "ring-2 ring-red-500/40" : "")}
                {...form.register("age")}
              />
              {errors.age ? <p className="text-xs text-red-600">{errors.age.message}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="address1">
                Address line 1 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="address1"
                className={cn("h-12 rounded-full border-black/10 bg-white", errors.address1 ? "ring-2 ring-red-500/40" : "")}
                {...form.register("address1")}
              />
              {errors.address1 ? <p className="text-xs text-red-600">{errors.address1.message}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="address2">
                Address line 2
              </Label>
              <Input id="address2" className="h-12 rounded-full border-black/10 bg-white" {...form.register("address2")} />
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
                <Label className="text-xs text-[#0f2d1c]" htmlFor="state">
                  State <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="state"
                  className={cn("h-12 rounded-full border-black/10 bg-white", errors.state ? "ring-2 ring-red-500/40" : "")}
                  {...form.register("state")}
                />
                {errors.state ? <p className="text-xs text-red-600">{errors.state.message}</p> : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-xs text-[#0f2d1c]" htmlFor="postalCode">
                  Postal code <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="postalCode"
                  className={cn("h-12 rounded-full border-black/10 bg-white", errors.postalCode ? "ring-2 ring-red-500/40" : "")}
                  {...form.register("postalCode")}
                />
                {errors.postalCode ? <p className="text-xs text-red-600">{errors.postalCode.message}</p> : null}
              </div>
              <div className="grid gap-2">
                <Label className="text-xs text-[#0f2d1c]" htmlFor="country">
                  Country <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="country"
                  className={cn("h-12 rounded-full border-black/10 bg-white", errors.country ? "ring-2 ring-red-500/40" : "")}
                  {...form.register("country")}
                />
                {errors.country ? <p className="text-xs text-red-600">{errors.country.message}</p> : null}
              </div>
            </div>

            <Button type="submit" className="mt-1 h-12 rounded-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

