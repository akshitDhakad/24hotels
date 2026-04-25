import type { Metadata } from "next";

import { HourlyRateCalculator } from "@/components/pricing";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Hourly rate calculator | 24 Hotels",
  description:
    "Estimate slot-based room pricing from your 24-hour base rate, surcharges, and GST.",
};

export default function HourlyCalculatorPage() {
  return (
    <Container className="py-10">
      <HourlyRateCalculator />
    </Container>
  );
}
