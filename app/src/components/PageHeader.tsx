import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-wrap items-end justify-between gap-5 border-b-2 border-border pb-6", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="rail mb-2">{eyebrow}</div>}
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-10 lg:py-10", className)}>{children}</div>;
}
