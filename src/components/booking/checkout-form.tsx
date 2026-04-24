"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import {
  checkoutGuestSchema,
  type CheckoutGuestValues,
} from "@/utils/validation/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFormProps = {
  onSubmit?: (values: CheckoutGuestValues) => Promise<void> | void;
};

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const form = useForm<CheckoutGuestValues>({
    resolver: zodResolver(checkoutGuestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneCountryCode: "+1",
      phoneNumber: "",
      specialRequests: "",
      paymentMethod: "card",
    },
    mode: "onBlur",
  });

  async function handleSubmit(values: CheckoutGuestValues) {
    await onSubmit?.(values);
  }

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-7">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Guest details</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Johnathan Doe" {...form.register("fullName")} />
          {errors.fullName ? (
            <p className="text-xs text-red-600">{errors.fullName.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="j_doe@example.com"
            type="email"
            {...form.register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <div className="grid grid-cols-[110px_1fr] gap-2">
          <Input
            aria-label="Country code"
            {...form.register("phoneCountryCode")}
          />
          <Input
            id="phoneNumber"
            placeholder="201-555-0123"
            inputMode="tel"
            {...form.register("phoneNumber")}
          />
        </div>
        {errors.phoneNumber ? (
          <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-semibold">Special requests</div>
        <div className="text-sm text-muted-foreground">
          Let the concierge know if you have any preferences or dietary
          requirements.
        </div>
        <textarea
          className="min-h-28 w-full resize-none rounded-xl border border-input bg-background p-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="E.g., early check-in, feather pillows, airport transfer..."
          {...form.register("specialRequests")}
        />
        {errors.specialRequests ? (
          <p className="text-xs text-red-600">{errors.specialRequests.message}</p>
        ) : null}
      </div>

      <div className="grid gap-3">
        <div className="text-sm font-semibold">Payment method</div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4">
          <input
            type="radio"
            value="card"
            className="mt-1"
            {...form.register("paymentMethod")}
          />
          <div className="flex-1">
            <div className="text-sm font-medium">Credit or Debit Card</div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <Input placeholder="0000 0000 0000 0000" className="md:col-span-3" />
              <Input placeholder="MM/YY" />
              <Input placeholder="CVV" />
            </div>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4">
          <input
            type="radio"
            value="paypal"
            className="mt-0"
            {...form.register("paymentMethod")}
          />
          <div className="text-sm font-medium">PayPal</div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4">
          <input
            type="radio"
            value="apple_pay"
            className="mt-0"
            {...form.register("paymentMethod")}
          />
          <div className="text-sm font-medium">Apple Pay</div>
        </label>
      </div>

      <Button type="submit" className="h-11 rounded-xl md:hidden">
        Pay Now
      </Button>
    </form>
  );
}

