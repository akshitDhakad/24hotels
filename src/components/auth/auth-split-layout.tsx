"use client";

import * as React from "react";

import { AuthBrand } from "@/components/auth/auth-brand";
import { cn } from "@/lib/cn";

export function AuthSplitLayout({
  title,
  subtitle,
  children,
  maxWidthClassName = "max-w-md",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col lg:h-dvh lg:max-h-screen lg:flex-row lg:items-stretch">
      <div className="flex min-h-0 w-full flex-col justify-center overflow-y-auto overscroll-y-contain px-8 py-8 sm:py-10 lg:w-[min(560px,46vw)] lg:max-w-[640px] lg:shrink-0 lg:px-14 lg:py-12">
        <div className={cn("mx-auto w-full", maxWidthClassName)}>
          <AuthBrand />
          <div className="mt-8 sm:mt-10">
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d1c]">{title}</h1>
            {subtitle ? <p className="mt-2 text-xs text-[#58705f]">{subtitle}</p> : null}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>

      <div className="relative hidden max-h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-black/[0.08] bg-[#f5f0e4] pl-8 pr-0 pt-10 pb-10 lg:flex lg:pl-12 lg:pt-12 lg:pb-12">
        <div className="relative flex max-h-100vh  min-h-0 w-full flex-col">
          <div className="min-h-0 shrink-0 pr-8 sm:pr-10 lg:max-w-xl lg:pr-12">
            <div className="text-6xl font-black leading-none text-[#d97706]">“</div>
            <div className="mt-6 text-base font-semibold leading-7 text-[#0f2d1c]">
              Seamless booking experience! The app makes finding and reserving rooms so easy.
              Instant confirmation and personalized recommendations.
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-black/10" />
              <div>
                <div className="text-sm font-semibold text-[#0f2d1c]">Alex Mitchell</div>
                <div className="text-xs text-[#58705f]">Amsterdam</div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex min-h-0 w-full flex-col items-end gap-4 pt-8 lg:gap-5 lg:pt-10">
            <div className="shrink-0 text-6xl font-black leading-none text-[#d97706]">”</div>
            <div className="pointer-events-none w-full min-w-0 shrink opacity-90">
              <svg
                viewBox="0 0 900 520"
                className="ml-auto block h-auto w-full max-w-full max-h-[min(34vh,280px)] sm:max-h-[min(36vh,300px)] lg:max-h-[min(40vh,340px)]"
                preserveAspectRatio="xMaxYMax meet"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <g fill="none" stroke="#1f3b2f" strokeWidth="6">
                  <path d="M160 500V260l140-90 10 330" />
                  <path d="M290 500V220l120-70 10 350" />
                  <path d="M420 500V120l170-95 10 475" />
                  <path d="M610 500V170l120-60 10 390" />
                  <path d="M120 500h740" />
                </g>
                <g fill="#cfe5f0" stroke="#1f3b2f" strokeWidth="6">
                  <rect x="458" y="290" width="70" height="60" rx="6" />
                  <rect x="458" y="370" width="70" height="60" rx="6" />
                </g>
                <g fill="#f7d6cc" stroke="#1f3b2f" strokeWidth="6">
                  <rect x="654" y="320" width="68" height="80" rx="10" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

