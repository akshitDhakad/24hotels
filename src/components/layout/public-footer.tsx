import Link from "next/link";

import { Container } from "@/components/layout/container";

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="text-sm font-semibold tracking-wide">LUXESTAY</div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Discover stays worldwide with premium support and transparent
              pricing.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold">Company</div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <Link href="#">About us</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Press</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Support</div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <Link href="#">Contact</Link>
              <Link href="#">Help center</Link>
              <Link href="#">Cancellation options</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Legal</div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <Link href="#">Privacy policy</Link>
              <Link href="#">Terms of service</Link>
              <Link href="#">Cookie settings</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} LuxeStay Global. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

