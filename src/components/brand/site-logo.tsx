import Image from "next/image";

import { cn } from "@/lib/cn";

export const SITE_LOGO_SRC =
  "https://res.cloudinary.com/dczsou0lr/image/upload/q_auto/f_auto/v1777051877/1_xucbg0.png";

type SiteLogoProps = {
  className?: string;
  /** Light mark on dark backgrounds (e.g. black footer) */
  onDark?: boolean;
  priority?: boolean;
};

export function SiteLogo({ className, onDark, priority }: SiteLogoProps) {
  return (
    <Image
      src={SITE_LOGO_SRC}
      alt="24 Hotels"
      width={1800}
      height={350}
      priority={priority}
      className={cn(
        "h-7 w-auto sm:h-8 md:h-9",
        onDark && "brightness-0 invert",
        className,
      )}
      sizes="(min-width: 768px) 220px, 180px"
    />
  );
}
