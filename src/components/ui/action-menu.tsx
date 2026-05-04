"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

export type ActionMenuItem =
  | {
      type?: "button";
      key: string;
      label: string;
      icon?: React.ReactNode;
      onClick: () => void | Promise<void>;
      disabled?: boolean;
      tone?: "default" | "destructive";
      rightLabel?: string;
    }
  | {
      type: "link";
      key: string;
      label: string;
      icon?: React.ReactNode;
      href: string;
      target?: "_blank" | "_self";
      disabled?: boolean;
    }
  | { type: "separator"; key: string };

export function ActionMenu({
  ariaLabel = "Row actions",
  headerLabel = "ACTIONS",
  items,
  triggerClassName,
}: {
  ariaLabel?: string;
  headerLabel?: string;
  items: readonly ActionMenuItem[];
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = React.useState<{ top: number; left: number } | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function compute() {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = 224; // w-56
      const padding = 12;
      const left = Math.min(window.innerWidth - padding - width, Math.max(padding, r.right - width));
      const top = Math.min(window.innerHeight - padding - 20, r.bottom + 8);
      setMenuPos({ top, left });
    }
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (!open) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative h-full">
      <button
        ref={btnRef}
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04]",
          triggerClassName,
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-lg leading-none text-black/45">…</span>
      </button>

      {open && menuPos && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[70]" role="presentation">
              <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />
              <div
                className="fixed z-[71] w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
                style={{ top: menuPos.top, left: menuPos.left, maxHeight: "calc(100vh - 24px)" }}
                role="menu"
                aria-label={headerLabel}
              >
                <div className="border-b border-black/5 px-3 py-2">
                  <div className="text-[11px] font-semibold tracking-wide text-black/45">{headerLabel}</div>
                </div>
                <div className="max-h-[calc(100vh-84px)] overflow-y-auto p-2">
                  {items.map((it) => {
                    if (it.type === "separator") return <div key={it.key} className="my-2 h-px bg-black/5" />;
                    if (it.type === "link") {
                      return (
                        <Link
                          key={it.key}
                          href={it.href}
                          target={it.target}
                          aria-disabled={it.disabled}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-black/[0.04]",
                            it.disabled ? "pointer-events-none opacity-50" : "",
                          )}
                          role="menuitem"
                        >
                          {it.icon}
                          {it.label}
                        </Link>
                      );
                    }
                    const tone = it.tone ?? "default";
                    return (
                      <button
                        key={it.key}
                        type="button"
                        disabled={it.disabled}
                        onClick={async () => {
                          setOpen(false);
                          await it.onClick();
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm",
                          tone === "destructive" ? "text-rose-700 hover:bg-rose-50" : "hover:bg-black/[0.04]",
                          it.disabled ? "opacity-60" : "",
                        )}
                        role="menuitem"
                      >
                        {it.icon}
                        <span className="flex-1 text-left">{it.label}</span>
                        {it.rightLabel ? <span className="text-[11px] font-semibold text-black/40">{it.rightLabel}</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

