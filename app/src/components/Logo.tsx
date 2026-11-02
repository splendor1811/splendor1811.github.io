export function Logo({ size = 26 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden className="drop-shadow-[2px_2px_0_hsl(var(--foreground))]">
        <rect x="1.5" y="1.5" width="31" height="31" rx="9" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="3" />
        <path d="M7 18h4l2.4-7 3.4 14 3.2-10 2.3 6H28" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="logo-copy min-w-0 leading-none">
        <div className="truncate font-display text-xl font-semibold tracking-[-0.025em] text-foreground">
          Second Brain
        </div>
        <div className="mt-0.5 font-mono text-[8px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Research pulse</div>
      </div>
    </div>
  );
}
