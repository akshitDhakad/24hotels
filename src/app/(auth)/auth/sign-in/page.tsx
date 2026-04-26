"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { AuthBrand } from "@/components/auth/auth-brand";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { signInSchema, type SignInValues } from "@/utils/validation/auth";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/user/dashboard";
  const registered = searchParams.get("registered") === "1";
  const authError = searchParams.get("error");

  const [showPassword, setShowPassword] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const queryErrorMessage = React.useMemo(() => {
    if (!authError) return null;
    // NextAuth uses "CredentialsSignin" for invalid email/password.
    if (authError === "CredentialsSignin") return "Invalid email or password.";
    return "Could not sign in. Please try again.";
  }, [authError]);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const errors = form.formState.errors;

  async function onSubmit(values: SignInValues) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: values.email.trim(),
        password: values.password,
        redirect: false,
        callbackUrl,
      });
      if (!res?.ok) {
        setSubmitError("Invalid email or password.");
        return;
      }
      router.push(res.url ?? callbackUrl);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center px-8 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-sm text-center">
          <AuthBrand />
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[#0f2d1c] sm:mt-10">
            Sign In
          </h1>
          <p className="mt-2 text-xs text-[#58705f]">
            Continue with Google or sign in with email.
          </p>
          <div className="mt-8 grid w-full gap-3">
            <SocialAuthButtons callbackUrl="/user/dashboard" label="Sign in with Google" />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-[11px] font-medium text-[#58705f]">OR</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            {registered ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-left text-xs text-green-800">
                Account created. Please sign in.
              </div>
            ) : null}
            {submitError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-xs text-red-800">
                {submitError}
              </div>
            ) : null}
            {!submitError && queryErrorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-xs text-red-800">
                {queryErrorMessage}
              </div>
            ) : null}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-3 text-left sm:gap-4"
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
                    autoComplete="email"
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
                <Label className="text-xs text-[#0f2d1c]" htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#58705f]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="h-12 rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

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

export default function SignInPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-8">
          <div className="text-sm text-[#58705f]">Loading…</div>
        </div>
      }
    >
      <SignInContent />
    </React.Suspense>
  );
}

