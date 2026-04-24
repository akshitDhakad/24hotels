import Link from "next/link";

import { SiteLogo } from "@/components/brand/site-logo";
import { Container } from "@/components/layout/container";

function SocialInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.805 4.805 0 0 0 12 7.2Zm0 7.92A3.12 3.12 0 1 1 15.12 12 3.124 3.124 0 0 1 12 15.12ZM16.8 6.48a1.08 1.08 0 1 1-1.08 1.08 1.082 1.082 0 0 1 1.08-1.08Zm3.12-.72A4.8 4.8 0 0 0 15.12 1.2H8.88A4.8 4.8 0 0 0 4.08 5.88v6.24A4.8 4.8 0 0 0 8.88 16.8h6.24a4.8 4.8 0 0 0 4.8-4.68V5.88A4.812 4.812 0 0 0 19.92 5.76Z" />
    </svg>
  );
}

function SocialX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 3H21l-6.5 7.43L22 21h-6.56l-4.22-5.32L6.1 21H3l6.95-7.93L2 3h6.69l3.81 4.77L18.244 3Z" />
    </svg>
  );
}

function SocialFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.01 3.66 9.15 8.44 9.9v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.96h-2.34v7C18.34 21.21 22 17.07 22 12.06Z" />
    </svg>
  );
}

function SocialDiscord({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.27 5.33A17.94 17.94 0 0 0 15.42 4c-.18.32-.38.75-.52 1.09a16.6 16.6 0 0 0-4.8 0c-.14-.34-.33-.77-.51-1.09a17.85 17.85 0 0 0-3.87 1.34 18.2 18.2 0 0 0-3.45 13.87 18.3 18.3 0 0 0 4.56 2.3c.37-.5.7-1.03.98-1.59a11.7 11.7 0 0 1-1.55-.75c.13-.09.26-.2.38-.3 3 1.4 6.26 1.4 9.22 0 .13.11.25.21.38.3-.49.28-1 .52-1.55.75.28.56.61 1.09.99 1.59a18.2 18.2 0 0 0 4.57-2.3 18.05 18.05 0 0 0-3.45-13.87ZM9.68 14.87c-.96 0-1.75-.88-1.75-1.96s.77-1.97 1.75-1.97 1.77.89 1.75 1.97c0 1.08-.77 1.96-1.75 1.96Zm4.64 0c-.96 0-1.75-.88-1.75-1.96s.78-1.97 1.75-1.97c.98 0 1.77.89 1.75 1.97 0 1.08-.78 1.96-1.75 1.96Z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", href: "#", Icon: SocialInstagram },
  { label: "X", href: "#", Icon: SocialX },
  { label: "Facebook", href: "#", Icon: SocialFacebook },
  { label: "Discord", href: "#", Icon: SocialDiscord },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-7 lg:gap-4">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="24 Hotels home">
              <SiteLogo onDark className="h-8 sm:h-9 md:h-10" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-400">
              Our mission is to equip modern explorers with cutting-edge, functional, and
              stylish bags that elevate every adventure.
            </p>
          </div>

          {/* About */}
          <div>
            <div className="text-sm font-bold text-white">Quick Links</div>
            <nav className="mt-5 grid gap-3 text-sm text-neutral-400" aria-label="About">
              <Link href="#" className="transition-colors hover:text-white">
                About Us
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Blog
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Career
              </Link>
            </nav>
          </div>

          {/* Destinations */}
          <div>
            <div className="text-sm font-bold text-white">Quick Links</div>
            <nav className="mt-5 grid gap-3 text-sm text-neutral-400" aria-label="About">
              <Link href="#" className="transition-colors hover:text-white">
                About Us
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Blog
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Career
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <div className="text-sm font-bold text-white">Support</div>
            <nav className="mt-5 grid gap-3 text-sm text-neutral-400" aria-label="Support">
              <Link href="#" className="transition-colors hover:text-white">
                Contact Us
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Return
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="col-span-2">
            <div className="text-sm font-bold text-white">Get Updates</div>
            <div
              className="mt-5 flex rounded-xl bg-neutral-800/90 p-1 ring-1 ring-white/10"
              role="group"
              aria-label="Newsletter signup"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500"
              />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-100"
              >
                Subscribe
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500">
          <div>© {new Date().getFullYear()} 24 Hotels. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Cookie Settings
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
