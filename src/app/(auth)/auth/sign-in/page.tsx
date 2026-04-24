"use client";

import Link from "next/link";

import { AuthBrand } from "@/components/auth/auth-brand";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center px-8 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-sm text-center">
          <AuthBrand />
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[#0f2d1c] sm:mt-10">
            Sign In
          </h1>
          <p className="mt-2 text-xs text-[#58705f]">
            Auth.js integration comes next.
          </p>
          <div className="mt-8 grid gap-3">
            <Button className="h-12 rounded-full">Continue</Button>
            <div className="pb-1 text-xs text-[#58705f]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="font-semibold text-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

