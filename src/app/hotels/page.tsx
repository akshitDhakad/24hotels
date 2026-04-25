import { HotelsClientPage } from "@/app/hotels/hotels-client";
import { Suspense } from "react";

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#fafafa]" />}>
      <HotelsClientPage />
    </Suspense>
  );
}

