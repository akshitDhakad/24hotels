"use client";

import Link from "next/link";
import { Globe, Search } from "lucide-react";

import { SiteLogo } from "@/components/brand/site-logo";
import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";

export function HeroHeader({ className }: { className?: string }) {
  return (
    <header className={cn("absolute inset-x-0 top-0 z-20", className)}>
      <Container className="pt-5">
        <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
          <Link href="/" className="flex shrink-0 items-center" aria-label="24 Hotels home">
            <SiteLogo priority className="h-7 sm:h-8 md:h-9" />
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-white/75 md:flex">
            <Link href="/hotels" className="text-white">
              Hotel
            </Link>
            <Link href="/tour">Travel</Link>
          </nav>

          <div className="ml-auto hidden max-w-sm flex-1 md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <Input
                placeholder="Search destination..."
                className="h-10 border-white/15 bg-white/10 pl-9 text-white placeholder:text-white/60"
                aria-label="Search destination"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white/85 hover:bg-white/10 md:flex"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
              EN
            </button>
            <Link
              href="/auth/sign-in"
              className="hidden rounded-full px-3 py-2 text-xs font-medium text-white/85 hover:bg-white/10 md:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-full border border-white/20 bg-white/90 px-4 text-xs font-semibold text-black transition hover:bg-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

