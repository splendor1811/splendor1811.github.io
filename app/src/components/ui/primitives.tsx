import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
  {
    variants: {
      variant: {
        default: "border-border bg-accent text-accent-foreground shadow-subtle hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-raised",
        secondary: "border-border bg-surface-raised text-foreground shadow-subtle hover:bg-surface",
        outline: "border-border bg-surface text-foreground hover:bg-primary",
        ghost: "border-transparent text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground",
        subtle: "border-border/30 bg-muted text-foreground hover:border-border",
        destructive: "border-border bg-destructive text-destructive-foreground shadow-subtle hover:-translate-y-0.5",
      },
      size: {
        sm: "h-11 px-3 text-xs",
        md: "h-11 px-4",
        lg: "h-12 px-5",
        icon: "h-11 w-11",
        "icon-sm": "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "outline" | "accent" | "muted" }) {
  const tones = {
    default: "bg-primary/15 text-primary border-primary/25",
    accent: "bg-accent text-accent-foreground border-border",
    muted: "bg-muted text-muted-foreground border-transparent",
    outline: "bg-transparent text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-2 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border-2 border-border bg-input px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded border-2 border-border bg-surface-raised px-1.5 font-mono text-[10px] font-semibold text-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
