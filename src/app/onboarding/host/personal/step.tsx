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

const e164Phone = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format (e.g., +919876543210)");

const schema = z.object({
  name: z.string().trim().min(2, "Enter full name").max(120),
  dob: z.string().trim().min(10, "Enter date of birth"),
  email: z.string().trim().email("Enter a valid email"),
  businessPhone: e164Phone,
  businessEmail: z.string().trim().email("Enter a valid business email"),
  address1: z.string().trim().min(3, "Enter address").max(200),
  address2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
});
type Values = z.infer<typeof schema>;

export function HostPersonalForm() {
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
      const res = await fetch("/api/v1/onboarding/host/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || json.success === false) {
        setSubmitError(json.message ?? "Could not save details.");
        return;
      }
      window.location.href = "/onboarding/host/hotel";
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      title="Step 2: Personal & business details"
      subtitle="We use this to keep the platform compliant and fraud-resistant."
      maxWidthClassName="max-w-md"
    >
      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
          {submitError}
        </div>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 grid gap-4 text-left">
        <div className="grid gap-2">
          <Label className="text-xs text-[#0f2d1c]" htmlFor="name">
            Name <span className="text-red-600">*</span>
          </Label>
          <Input
            id="name"
            className={cn("h-12 rounded-full border-black/10 bg-white", errors.name ? "ring-2 ring-red-500/40" : "")}
            {...form.register("name")}
          />
          {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="dob">
              Date of birth <span className="text-red-600">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              className={cn("h-12 rounded-full border-black/10 bg-white", errors.dob ? "ring-2 ring-red-500/40" : "")}
              {...form.register("dob")}
            />
            {errors.dob ? <p className="text-xs text-red-600">{errors.dob.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="email">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className={cn("h-12 rounded-full border-black/10 bg-white", errors.email ? "ring-2 ring-red-500/40" : "")}
              {...form.register("email")}
            />
            {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="businessPhone">
              Business number <span className="text-red-600">*</span>
            </Label>
            <Input
              id="businessPhone"
              placeholder="+919876543210"
              className={cn(
                "h-12 rounded-full border-black/10 bg-white",
                errors.businessPhone ? "ring-2 ring-red-500/40" : "",
              )}
              {...form.register("businessPhone")}
            />
            {errors.businessPhone ? (
              <p className="text-xs text-red-600">{errors.businessPhone.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="businessEmail">
              Business email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="businessEmail"
              type="email"
              className={cn(
                "h-12 rounded-full border-black/10 bg-white",
                errors.businessEmail ? "ring-2 ring-red-500/40" : "",
              )}
              {...form.register("businessEmail")}
            />
            {errors.businessEmail ? (
              <p className="text-xs text-red-600">{errors.businessEmail.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-[#0f2d1c]" htmlFor="address1">
            Address <span className="text-red-600">*</span>
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
              className={cn(
                "h-12 rounded-full border-black/10 bg-white",
                errors.postalCode ? "ring-2 ring-red-500/40" : "",
              )}
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
          {isSubmitting ? "Saving…" : "Continue to hotel details"}
        </Button>
      </form>
    </AuthSplitLayout>
  );
}

