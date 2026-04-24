"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";

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

  const role = form.watch("role");
  const errors = form.formState.errors;

  async function onSubmit(values: SignUpValues) {
    // Auth.js + Prisma wiring comes next.
    console.log(values);
  }

  return (
    <div className="h-svh bg-[#f3f1e6]">
      <div className="mx-auto h-full w-full max-w-6xl overflow-hidden bg-[#f3f1e6]">
        <div className="grid h-full lg:grid-cols-2">
          {/* Left */}
          <div className="relative px-8 pb-10 pt-8 lg:px-14">
            <AuthBrand />

            <div className="mx-auto mt-14 max-w-sm text-center">
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
                className="mt-6"
              />

              <div className="mt-6">
                <SocialAuthButtons />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-black/10" />
                <div className="text-[11px] font-medium text-[#58705f]">
                  OR
                </div>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 grid gap-4 text-left"
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
                    <Link
                      href="#"
                      className="text-xs font-medium text-[#1b5a35]"
                    >
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
                    <p className="text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  className="mt-2 h-12 rounded-full bg-[#184d2c] text-white hover:bg-[#144224]"
                >
                  Sign up
                </Button>

                <div className="pt-2 text-center text-xs text-[#58705f]">
                  Already have an account?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="font-semibold text-[#1b5a35]"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right */}
          <div className="relative hidden bg-[#fbfaf4] p-12 lg:block">
            <div className="mx-auto max-w-lg">
              <div className="text-6xl font-black leading-none text-[#d97706]">
                “
              </div>
              <div className="mt-6 text-base font-semibold leading-7 text-[#0f2d1c]">
                Seamless booking experience! The app makes finding and reserving
                rooms so easy. I loved the instant confirmation and personalized
                recommendations. Definitely my go-to for all future stays.
              </div>
              <div className="mt-10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-black/10" />
                <div>
                  <div className="text-sm font-semibold text-[#0f2d1c]">
                    Alex Mitchell
                  </div>
                  <div className="text-xs text-[#58705f]">Amsterdam</div>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-0 right-0 w-[92%] opacity-90">
                <svg
                  viewBox="0 0 900 520"
                  className="h-auto w-full"
                  xmlns="http://www.w3.org/2000/svg"
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

              <div className="absolute right-14 top-16 text-6xl font-black leading-none text-[#d97706]">
                ”
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

