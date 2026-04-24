import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SiteLogo } from "@/components/brand/site-logo";
import { CheckoutForm } from "@/components/booking/checkout-form";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  return (
    <div className="bg-[#fafafa]">
      <div className="bg-white/50 ">
        <Container className="flex items-center justify-between gap-4 py-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label="24 Hotels home">
            <SiteLogo className="h-7 sm:h-8" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4" />
            256-bit Encryption
          </div>
        </Container>
      </div>
      <Container className="">


        <div className="mt-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground">
            ← Back to property details
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-2xl border border-border bg-white p-6">
            <CheckoutForm />
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-[92px_1fr] gap-4 p-5">
                <div className="relative h-[72px] w-[92px] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
                    alt="Azure Horizon Estate"
                    fill
                    className="object-cover"
                    sizes="92px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Luxury Villa</div>
                  <div className="mt-0.5 truncate text-sm font-semibold">
                    Azure Horizon Estate
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Santorini, Greece
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground">4.92</Badge>
                    <div className="text-xs text-muted-foreground">
                      (128 reviews)
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Check-in</div>
                    <div className="mt-1 font-medium">Oct 24, 2024</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Check-out</div>
                    <div className="mt-1 font-medium">Oct 30, 2024</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Guests</div>
                    <div className="mt-1 font-medium">2 Adults</div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">$1,200 × 6 nights</div>
                    <div className="font-medium">$7,200.00</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">
                      Concierge Service Fee
                    </div>
                    <div className="font-medium">$240.00</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">
                      Occupancy taxes & fees
                    </div>
                    <div className="font-medium">$185.00</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Total</div>
                  <div className="text-2xl font-semibold">$7,625.00</div>
                </div>

                <Button className="h-11 rounded-xl">Pay Now</Button>
                <div className="text-center text-xs text-muted-foreground">
                  Free cancellation before Oct 17
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
              By selecting the button below, I agree to the Property House Rules,
              24 Hotels Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>


      </Container>
      <div className="mt-16 bg-white/50">
        <Container className="py-6 flex flex-wrap items-center justify-between gap-4 border-t border-border  text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} 24 Hotels. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookie Settings</Link>
            <Link href="#">Sustainability</Link>
            <Link href="#">Press</Link>
          </div>
        </Container>
      </div>
    </div>
  );
}

