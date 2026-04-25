import { Container } from "@/components/layout/container";

import { NewsletterSignupForm } from "./newsletter-signup-form";

export function NewsletterSignupSection() {
  return (
    <section className="border-t border-gray-100 bg-white">
      <Container>
        <div className="mx-auto max-w-2xl py-16 text-center sm:py-20">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Join the inner circle of global travelers.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-gray-500">
            Get early access to promotions, hidden deals and concierge offers
            directly in your inbox.
          </p>

          <NewsletterSignupForm className="mx-auto mt-8 max-w-xl" />
        </div>
      </Container>
    </section>
  );
}
