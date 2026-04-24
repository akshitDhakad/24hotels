import Link from "next/link";

import { SiteLogo } from "@/components/brand/site-logo";

export function AuthBrand() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="24 Hotels home">
      <SiteLogo className="h-7 sm:h-8" />
    </Link>
  );
}

