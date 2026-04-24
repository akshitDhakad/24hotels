import Link from "next/link";
import { MapPinHouse } from "lucide-react";

export function AuthBrand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#184d2c] text-white">
        <MapPinHouse className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold tracking-wide text-[#0f2d1c]">
        24 Hotels
      </span>
    </Link>
  );
}

