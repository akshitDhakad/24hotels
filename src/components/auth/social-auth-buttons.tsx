"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.637 32.657 29.121 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.88 19.51C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.355 4.342-17.694 10.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238A11.946 11.946 0 0 1 24 36c-5.099 0-9.602-3.317-11.286-7.946l-6.519 5.02C9.5 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.075 5.565l.003-.002 6.19 5.238C36.988 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
      />
    </svg>
  );
}

export type SocialAuthButtonsProps = {
  /** Where to send the user after a successful OAuth sign-in */
  callbackUrl?: string;
  /** Button label */
  label?: string;
  className?: string;
  /** When false, Google OAuth is not started (e.g. host/admin must use email sign-up). */
  disabled?: boolean;
  /** Shown as tooltip / aria when disabled */
  disabledHint?: string;
};

export function SocialAuthButtons({
  callbackUrl = "/",
  label = "Sign up with Google",
  className,
  disabled = false,
  disabledHint,
}: SocialAuthButtonsProps) {
  return (
    <div className={cn("grid w-full gap-3", className)}>
      <Button
        variant="outline"
        type="button"
        disabled={disabled}
        title={disabled ? disabledHint : undefined}
        aria-disabled={disabled}
        className="h-11 w-full min-w-0 justify-center gap-2 rounded-full border-black/10 bg-white px-4 hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => {
          if (disabled) return;
          void signIn("google", { callbackUrl });
        }}
      >
        <GoogleIcon />
        <span className="truncate">{label}</span>
      </Button>
    </div>
  );
}
