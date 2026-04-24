import Link from "next/link";
import { Bell, Heart, Search, User } from "lucide-react";

import { SiteLogo } from "@/components/brand/site-logo";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";

export function PublicHeader({ className }: { className?: string }) {
  return (
    <header className={cn("w-full", className)}>
      <Container className="flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="24 Hotels home">
          <SiteLogo priority className="h-7 sm:h-8" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/" className="text-foreground">
            Home
          </Link>
          <Link href="/hotels">Hotels</Link>
          <Link href="/tour">Tour</Link>
        </nav>

        <div className="ml-auto hidden max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search destination..."
              className="h-10 pl-9"
              aria-label="Search destination"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account">
            <User className="h-4 w-4" />
          </Button>
          <div className="hidden md:block">
            <Button variant="outline" className="h-10">
              Sign up
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}

