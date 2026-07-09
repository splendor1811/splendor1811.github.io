export function Logo({ size = 26 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="9" r="2.8" fill="hsl(var(--primary))" />
        <circle cx="8.5" cy="20" r="2.8" fill="hsl(var(--accent))" />
        <circle cx="23.5" cy="20" r="2.8" fill="#4ADE9E" />
        <path
          d="M16 9 L8.5 20 M16 9 L23.5 20 M8.5 20 L23.5 20"
          stroke="hsl(var(--faint))"
          strokeWidth="1.4"
        />
      </svg>
      <div className="leading-none">
        <div className="font-display text-[15px] font-semibold tracking-tight text-foreground">
          Second Brain
        </div>
      </div>
    </div>
  );
}
