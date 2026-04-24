"use client";

import Link from "next/link";

import { AuthBrand } from "@/components/auth/auth-brand";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="h-svh bg-[#f3f1e6]">
      <div className="mx-auto h-full w-full max-w-6xl overflow-hidden bg-[#f3f1e6]">
        <div className="grid h-full place-items-center px-8 py-12">
          <div className="w-full max-w-sm text-center">
            <AuthBrand />
            <h1 className="mt-10 text-3xl font-semibold tracking-tight text-[#0f2d1c]">
              Sign In
            </h1>
            <p className="mt-2 text-xs text-[#58705f]">
              Auth.js integration comes next.
            </p>
            <div className="mt-8 grid gap-3">
              <Button className="h-12 rounded-full bg-[#184d2c] text-white hover:bg-[#144224]">
                Continue
              </Button>
              <div className="text-xs text-[#58705f]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="font-semibold text-[#1b5a35]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

