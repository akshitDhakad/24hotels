"use client";

import Link from "next/link";
import { Bell, Globe, Search, User } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { SiteLogo } from "@/components/brand/site-logo";
import { Container } from "@/components/layout/container";
import { HoursRoomsLink } from "@/components/layout/hours-rooms-link";
import { Input } from "@/components/ui/input";
import { setOrDelete } from "@/lib/url-state";
import { useHotelsResultsStore } from "@/store/hotels-results-store";
import { useSearchStore } from "@/store/search-store";

export function HotelResultsHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { params, setParams } = useSearchStore();
  const resetPaging = useHotelsResultsStore((s) => s.resetPaging);
  const lastAppliedDestinationRef = React.useRef<string>("");

  const urlDestination = React.useMemo(() => {
    const sp = new URLSearchParams(searchParams?.toString());
    return (sp.get("destination") ?? "").trim();
  }, [searchParams]);

  React.useEffect(() => {
    if (urlDestination !== params.destination) {
      setParams({ destination: urlDestination });
    }
  }, [params.destination, setParams, urlDestination]);

  React.useEffect(() => {
    const next = params.destination.trim();

    // Avoid redundant URL writes and loops.
    if (next === urlDestination) {
      lastAppliedDestinationRef.current = next;
      return;
    }
    if (next === lastAppliedDestinationRef.current) return;

    const handle = window.setTimeout(() => {
      resetPaging();
      lastAppliedDestinationRef.current = next;

      const sp = new URLSearchParams(searchParams?.toString());
      setOrDelete(sp, "destination", next || undefined);
      sp.set("page", "1");

      // Always drive users to the results page for a search.
      const targetPath = "/hotels";
      router.replace(`${targetPath}?${sp.toString()}`);
    }, 500);

    return () => window.clearTimeout(handle);
  }, [
    params.destination,
    pathname,
    resetPaging,
    router,
    searchParams,
    urlDestination,
  ]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = params.destination.trim();

    setParams({ destination: next });
    resetPaging();

    const sp = new URLSearchParams(searchParams?.toString());
    setOrDelete(sp, "destination", next || undefined);
    sp.set("page", "1");

    const targetPath = "/hotels";
    router.replace(`${targetPath}?${sp.toString()}`);
  }

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
          <HoursRoomsLink />
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 md:block">
          <form onSubmit={onSubmit} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={params.destination}
              onChange={(e) => setParams({ destination: e.target.value })}
              placeholder="Where next?"
              className="h-10 rounded-full bg-white pl-9"
              aria-label="Where next?"
            />
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <HoursRoomsLink className="md:hidden" />
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
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:brightness-[0.92]"
          >
            Sign In
          </Link>
        </div>
      </Container>
    </header>
  );
}

