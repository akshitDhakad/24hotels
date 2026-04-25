"use client";

import { Info, Lock, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { SiteLogo } from "@/components/brand/site-logo";
import { CheckoutForm } from "@/components/booking/checkout-form";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, convertFromUsd } from "@/lib/currency";
import { useBookingModeStore } from "@/store/booking-mode-store";

const PROMO_DISCOUNT_PERCENT = 35;
const INCLUDED_TAX_PERCENT = 5;
/** Demo coupon: 10% off room subtotal before taxes & fees. */
const COUPON_SAVE10 = "SAVE10";

export default function CheckoutPage() {
  const mode = useBookingModeStore((s) => s.mode);
  const isHours = mode === "hours";

  const [couponDraft, setCouponDraft] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [couponMessage, setCouponMessage] = React.useState<string | null>(null);

  // Placeholder pricing for UI; in a real flow this comes from selected hotel/room.
  const rooms = 1;
  const nightlyUsd = 1200;
  const baseInr = convertFromUsd(nightlyUsd, "INR");
  const hours = 4;
  const nights = 6;
  const hoursTotalInr = baseInr / 6; // 4 hours of 24
  const stayTotalInr = baseInr * nights;
  const conciergeFeeInr = convertFromUsd(240, "INR");
  const occupancyTaxesInr = convertFromUsd(185, "INR");

  const priceBeforeTaxesInr = isHours ? hoursTotalInr : stayTotalInr;
  const stayLabel = isHours
    ? `${rooms} room × ${hours} hours`
    : `${rooms} room × ${nights} nights`;

  const listPriceInr = priceBeforeTaxesInr / (1 - PROMO_DISCOUNT_PERCENT / 100);
  const taxOnRoomInr = priceBeforeTaxesInr * (INCLUDED_TAX_PERCENT / 100);
  /** Promo layout (hours): taxes line = GST on room only, per reference. */
  const promoTaxesAndFeesInr = taxOnRoomInr;
  const priceAfterDiscountsInr = priceBeforeTaxesInr + promoTaxesAndFeesInr;

  const roomsTaxesAndFeesInr = conciergeFeeInr + occupancyTaxesInr;
  const couponDiscountRoomsInr =
    appliedCoupon === COUPON_SAVE10 ? Math.round(stayTotalInr * 0.1 * 100) / 100 : 0;
  const roomsPriceBeforeTaxesInr = stayTotalInr - couponDiscountRoomsInr;
  const roomsPriceAfterDiscountsInr = roomsPriceBeforeTaxesInr + roomsTaxesAndFeesInr;

  function applyRoomsCoupon() {
    const code = couponDraft.trim().toUpperCase();
    if (!code) {
      setCouponMessage("Enter a coupon code.");
      return;
    }
    if (code === COUPON_SAVE10) {
      setAppliedCoupon(COUPON_SAVE10);
      setCouponMessage("10% off your room rate applied.");
      return;
    }
    setAppliedCoupon(null);
    setCouponMessage("That code isn’t valid for this stay.");
  }

  function clearRoomsCoupon() {
    setAppliedCoupon(null);
    setCouponDraft("");
    setCouponMessage(null);
  }

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
          <div className="rounded-xl border border-border bg-white p-6">
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

                {isHours ? (
                  <div className="relative rounded-xl border border-border bg-white p-4">
                    <div className="absolute right-3 top-3">
                      <span className="rounded bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        {PROMO_DISCOUNT_PERCENT}% OFF TODAY
                      </span>
                    </div>

                    <div className="grid gap-0 pr-20 text-sm">
                      <div className="flex items-start justify-between gap-3 py-2">
                        <span className="text-muted-foreground">
                          Original price ({stayLabel})
                        </span>
                        <span className="shrink-0 tabular-nums text-muted-foreground line-through">
                          {formatCurrency(listPriceInr, "INR")}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-3 py-2">
                        <span className="text-muted-foreground">
                          Room price ({stayLabel})
                        </span>
                        <span className="shrink-0 font-medium tabular-nums text-foreground">
                          {formatCurrency(priceBeforeTaxesInr, "INR")}
                        </span>
                      </div>

                      <div className="border-t border-dashed border-border" />

                      <div className="flex items-start justify-between gap-3 py-2 font-semibold text-foreground">
                        <span>Price Before Taxes</span>
                        <span className="shrink-0 tabular-nums">
                          {formatCurrency(priceBeforeTaxesInr, "INR")}
                        </span>
                      </div>

                      <div className="border-t border-dashed border-border" />

                      <div className="flex items-start justify-between gap-3 py-2">
                        <span className="text-muted-foreground">Taxes and fees</span>
                        <span className="shrink-0 font-medium tabular-nums text-foreground">
                          {formatCurrency(promoTaxesAndFeesInr, "INR")}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-3 py-2">
                        <span className="font-medium text-emerald-700">Booking fees</span>
                        <span className="shrink-0 font-bold uppercase tracking-wide text-emerald-700">
                          Free
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-border" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                        <span>Price After Discounts</span>
                        <span
                          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                          title="Room rate after promo, plus taxes shown above. No booking fee."
                        >
                          <Info className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                      <span className="shrink-0 text-lg font-semibold tabular-nums text-foreground">
                        {formatCurrency(priceAfterDiscountsInr, "INR")}
                      </span>
                    </div>

                    <div className="mt-3 border-t border-dashed border-border pt-3">
                      <p className="text-[11px] text-muted-foreground">
                        Included in price: Tax {INCLUDED_TAX_PERCENT}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-white p-4">
                    <div className="mb-3 grid gap-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-black/50">
                        Coupon code
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Input
                          value={couponDraft}
                          onChange={(e) => {
                            setCouponDraft(e.target.value);
                            if (couponMessage) setCouponMessage(null);
                          }}
                          placeholder="e.g. SAVE10"
                          className="h-9 min-w-[140px] flex-1 text-sm"
                          aria-label="Coupon code"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-9 shrink-0"
                          onClick={applyRoomsCoupon}
                        >
                          Apply
                        </Button>
                        {appliedCoupon ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 shrink-0 text-muted-foreground"
                            onClick={clearRoomsCoupon}
                          >
                            Remove
                          </Button>
                        ) : null}
                      </div>
                      {couponMessage ? (
                        <p
                          className={
                            appliedCoupon
                              ? "text-xs font-medium text-emerald-700"
                              : "text-xs text-destructive"
                          }
                        >
                          {couponMessage}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-0 text-sm">
                      <div className="flex items-start justify-between gap-3 py-2">
                        <span className="text-muted-foreground">
                          {formatCurrency(baseInr, "INR")} × {nights} nights
                        </span>
                        <span className="shrink-0 font-medium tabular-nums text-foreground">
                          {formatCurrency(stayTotalInr, "INR")}
                        </span>
                      </div>

                      {couponDiscountRoomsInr > 0 ? (
                        <div className="flex items-start justify-between gap-3 py-2 text-emerald-700">
                          <span className="font-medium">Coupon ({appliedCoupon})</span>
                          <span className="shrink-0 font-semibold tabular-nums">
                            −{formatCurrency(couponDiscountRoomsInr, "INR")}
                          </span>
                        </div>
                      ) : null}

                      <div className="border-t border-dashed border-border" />

                      <div className="flex items-start justify-between gap-3 py-2 font-semibold text-foreground">
                        <span>Price Before Taxes</span>
                        <span className="shrink-0 tabular-nums">
                          {formatCurrency(roomsPriceBeforeTaxesInr, "INR")}
                        </span>
                      </div>

                      <div className="border-t border-dashed border-border" />

                      <div className="flex items-start justify-between gap-3 py-2">
                        <span className="text-muted-foreground">Taxes and fees</span>
                        <span className="shrink-0 font-medium tabular-nums text-foreground">
                          {formatCurrency(roomsTaxesAndFeesInr, "INR")}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-3 py-2">
                        <span className="font-medium text-emerald-700">Booking fees</span>
                        <span className="shrink-0 font-bold uppercase tracking-wide text-emerald-700">
                          Free
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-border" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                        <span>Price After Discounts</span>
                        <span
                          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                          title="Includes room after any coupon, plus taxes and fees. No booking fee."
                        >
                          <Info className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                      <span className="shrink-0 text-lg font-semibold tabular-nums text-foreground">
                        {formatCurrency(roomsPriceAfterDiscountsInr, "INR")}
                      </span>
                    </div>

                    <div className="mt-3 border-t border-dashed border-border pt-3">
                      <p className="text-[11px] text-muted-foreground">
                        Taxes and fees include concierge and occupancy charges for this demo
                        stay.
                      </p>
                    </div>
                  </div>
                )}

                <Button className="h-11 w-full rounded-xl text-sm font-semibold uppercase tracking-wide">
                  Reserve now
                </Button>
                <div className="flex items-start gap-2 rounded-xl bg-black/[0.04] p-3 text-xs text-muted-foreground">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-black/45" aria-hidden />
                  <span>
                    You won’t be charged yet. Free cancellation available before check-in.
                  </span>
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

