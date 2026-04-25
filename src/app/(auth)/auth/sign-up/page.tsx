"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";

import { AuthBrand } from "@/components/auth/auth-brand";
import { RoleToggle } from "@/components/auth/role-toggle";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { signUpSchema, type SignUpValues } from "@/utils/validation/auth";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: "user", email: "", password: "" },
    mode: "onBlur",
  });

  const role = useWatch({ control: form.control, name: "role" });
  const errors = form.formState.errors;

  async function onSubmit(values: SignUpValues) {
    // Auth.js + Prisma wiring comes next.
    console.log(values);
  }

  return (
    <div className="flex min-h-dvh w-full flex-col lg:h-dvh lg:max-h-screen lg:flex-row lg:items-stretch">
      {/* Left: fixed width band; scroll only when form is tall */}
      <div className="flex min-h-0 w-full flex-col justify-center overflow-y-auto overscroll-y-contain px-8 py-8 sm:py-10 lg:w-[min(560px,46vw)] lg:max-w-[640px] lg:shrink-0 lg:px-14 lg:py-12">
        <div className="mx-auto w-full max-w-sm">
          <AuthBrand />

          <div className="mt-8 text-center sm:mt-10">
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d1c]">
              Sign Up
            </h1>
            <p className="mt-2 text-xs text-[#58705f]">
              Create your account to continue
            </p>

            <RoleToggle
              value={role}
              onChange={(next) =>
                form.setValue("role", next, { shouldDirty: true })
              }
              className="mt-5 sm:mt-6"
            />

            <div className="mt-5 sm:mt-6">
              <SocialAuthButtons />
            </div>

            <div className="mt-5 flex items-center gap-3 sm:mt-6">
              <div className="h-px flex-1 bg-black/10" />
              <div className="text-[11px] font-medium text-[#58705f]">OR</div>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-5 grid gap-3 text-left sm:mt-6 sm:gap-4"
            >
              <div className="grid gap-2">
                <Label className="text-xs text-[#0f2d1c]" htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#58705f]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@delisas.com"
                    className={cn(
                      "h-12 rounded-full border-black/10 bg-white pl-11",
                      errors.email ? "ring-2 ring-red-500/40" : "",
                    )}
                    {...form.register("email")}
                  />
                </div>
                {errors.email ? (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-[#0f2d1c]" htmlFor="password">
                    Password <span className="text-red-600">*</span>
                  </Label>
                  <Link href="#" className="text-xs font-medium text-primary">
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#58705f]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className={cn(
                      "h-12 rounded-full border-black/10 bg-white pl-11 pr-11",
                      errors.password ? "ring-2 ring-red-500/40" : "",
                    )}
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#58705f] hover:bg-black/5"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                ) : null}
              </div>

              <Button type="submit" className="mt-2 h-12 rounded-full">
                Sign up
              </Button>

              <div className="pb-2 pt-2 text-center text-xs text-[#58705f]">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="font-semibold text-primary">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right — wheat, edge-to-edge to viewport; no scrollbar */}
      <div className="relative hidden max-h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-black/[0.08] bg-[#f5f0e4] pl-8 pr-0 pt-10 pb-10 lg:flex lg:pl-12 lg:pt-12 lg:pb-12">
        <div className="relative flex max-h-100vh  min-h-0 w-full flex-col">
          <div className="min-h-0 shrink-0 pr-8 sm:pr-10 lg:max-w-xl lg:pr-12">
            <div className="text-6xl font-black leading-none text-[#d97706]">“</div>
            <div className="mt-6 text-base font-semibold leading-7 text-[#0f2d1c]">
              Seamless booking experience! The app makes finding and reserving rooms
              so easy. I loved the instant confirmation and personalized
              recommendations. Definitely my go-to for all future stays.
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-black/10" />
              <div>
                <div className="text-sm font-semibold text-[#0f2d1c]">
                  Alex Mitchell
                </div>
                <div className="text-xs text-[#58705f]">Amsterdam</div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex min-h-0 w-full flex-col items-end gap-4 pt-8 lg:gap-5 lg:pt-10">
            <div className="shrink-0 text-6xl font-black leading-none text-[#d97706]">
              ”
            </div>
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

