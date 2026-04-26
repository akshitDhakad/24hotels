import * as React from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-[0.92] active:brightness-[0.88]",
  secondary: "bg-muted text-foreground hover:bg-black/5",
  outline:
    "border border-border bg-background text-foreground hover:bg-black/5",
  ghost: "bg-transparent text-foreground hover:bg-black/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4",
  md: "h-10 px-5",
  lg: "h-11 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type, asChild, children, ...rest },
    ref,
  ) => {
    if (asChild) {
      if (!React.isValidElement<{ className?: string }>(children)) {
        return null;
      }
      return React.cloneElement(children, {
        className: cn(
          base,
          variants[variant],
          sizes[size],
          className,
          children.props.className,
        ),
      });
    }
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(base, variants[variant], sizes[size], className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

