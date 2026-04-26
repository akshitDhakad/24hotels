"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type ToastTone = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  title?: string;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  push: (t: Omit<ToastItem, "id"> & { id?: string }) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function toneClasses(tone: ToastTone) {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (tone === "error") return "border-red-200 bg-red-50 text-red-900";
  return "border-black/10 bg-white text-foreground";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((t: Omit<ToastItem, "id"> & { id?: string }) => {
    const id = t.id ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const next: ToastItem = { id, title: t.title, message: t.message, tone: t.tone };
    setItems((prev) => [...prev, next].slice(-3));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] grid w-[min(360px,calc(100vw-2rem))] gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg",
              toneClasses(t.tone),
            )}
            role="status"
            aria-live="polite"
          >
            {t.title ? <div className="text-xs font-semibold">{t.title}</div> : null}
            <div className={cn("text-sm", t.title ? "mt-0.5" : "")}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

