"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type NewsletterSignupFormProps = {
  className?: string;
};

export function NewsletterSignupForm({ className }: NewsletterSignupFormProps) {
  return (
    <form
      className={cn("w-full", className)}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="Your email address"
          className={cn(
            "min-h-12 w-full flex-1 rounded-lg border border-gray-200 bg-white px-4 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow]",
            "placeholder:text-gray-400",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 shrink-0 rounded-lg px-8 font-semibold sm:w-auto"
        >
          Subscribe
        </Button>
      </div>
    </form>
  );
}
