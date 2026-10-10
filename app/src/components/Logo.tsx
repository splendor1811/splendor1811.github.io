export function Logo({ size = 26 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="9" fill="hsl(var(--primary))" />
        <path
          d="M9 10h7a5 5 0 0 1 0 10h-1M23 22h-7a5 5 0 0 1 0-10h1"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="leading-none">
        <div className="font-display text-lg font-semibold tracking-tight text-foreground">
          Second Brain
        </div>
      </div>
    </div>
  );
}
