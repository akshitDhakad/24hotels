import Link from "next/link";
import { Bell, Globe, Search, User } from "lucide-react";

import { SiteLogo } from "@/components/brand/site-logo";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";

export function HotelResultsHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="24 Hotels home">
          <SiteLogo className="h-7 sm:h-8" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/hotels" className="text-foreground">
            Discover
          </Link>
          <Link href="#">Concierge</Link>
          <Link href="#">Reservations</Link>
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Where next?"
              className="h-10 rounded-full bg-white pl-9"
              aria-label="Where next?"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-foreground hover:bg-black/5 md:flex"
            aria-label="Language"
          >
            <Globe className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </button>
          <Link
            href="/auth/sign-in"
            className="inline-flex h-9 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold text-white hover:bg-black/90"
          >
            Sign In
          </Link>
        </div>
      </Container>
    </header>
  );
}

