"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useNow } from "@/lib/use-now";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function OtpModal({
  open,
  title = "Verify OTP",
  maskedContact,
  expiresAt,
  error,
  isVerifying,
  isResending,
  onClose,
  onVerify,
  onResend,
}: {
  open: boolean;
  title?: string;
  maskedContact: string;
  expiresAt: string | Date;
  error: string | null;
  isVerifying: boolean;
  isResending: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void | Promise<void>;
  onResend: () => void | Promise<void>;
}) {
  const exp = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const now = useNow(1000);
  const [digits, setDigits] = React.useState<string[]>(() => Array.from({ length: 6 }, () => ""));
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const otp = digits.join("");
  const secondsLeft = Math.max(0, Math.floor((exp.getTime() - now) / 1000));
  const canSubmit = otp.length === 6 && /^\d{6}$/.test(otp) && !isVerifying;

  function setAt(i: number, v: string) {
    setDigits((prev) => {
      const next = prev.slice();
      next[i] = v;
      return next;
    });
  }

  function handleChange(i: number, nextRaw: string) {
    const next = nextRaw.replace(/\D/g, "");
    if (!next) {
      setAt(i, "");
      return;
    }
    // Handle paste of full code.
    if (next.length >= 6) {
      const full = next.slice(0, 6).split("");
      setDigits(full);
      setFocusedIndex(5);
      refs.current[5]?.focus();
      return;
    }
    setAt(i, next[0]!);
    const nextIndex = clamp(i + 1, 0, 5);
    setFocusedIndex(nextIndex);
    refs.current[nextIndex]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i]) {
      const prevIndex = clamp(i - 1, 0, 5);
      setAt(prevIndex, "");
      setFocusedIndex(prevIndex);
      refs.current[prevIndex]?.focus();
    }
    if (e.key === "ArrowLeft") {
      const prevIndex = clamp(i - 1, 0, 5);
      setFocusedIndex(prevIndex);
      refs.current[prevIndex]?.focus();
    }
    if (e.key === "ArrowRight") {
      const nextIndex = clamp(i + 1, 0, 5);
      setFocusedIndex(nextIndex);
      refs.current[nextIndex]?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl">
        <div className="text-left">
          <div className="text-lg font-semibold text-[#0f2d1c]">{title}</div>
          <div className="mt-1 text-xs text-[#58705f]">
            Enter the 6-digit code sent to <span className="font-semibold">{maskedContact}</span>.
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => setFocusedIndex(i)}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus={i === 0}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "h-12 w-11 rounded-2xl border border-black/10 text-center text-lg font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-primary/25",
                focusedIndex === i ? "ring-2 ring-primary/25" : "",
              )}
            />
          ))}
        </div>

        <div className="mt-3 text-center text-[11px] text-[#58705f]">
          {secondsLeft > 0 ? (
            <>Code expires in <span className="font-semibold">{secondsLeft}s</span></>
          ) : (
            <>Code expired. Please resend.</>
          )}
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-5 grid gap-2">
          <Button
            type="button"
            className="h-11 rounded-full"
            disabled={!canSubmit || secondsLeft === 0}
            onClick={() => onVerify(otp)}
          >
            {isVerifying ? "Verifying…" : "Verify"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full"
            disabled={isResending}
            onClick={onResend}
          >
            {isResending ? "Resending…" : "Resend code"}
          </Button>
        </div>
      </div>
    </div>
  );
}

