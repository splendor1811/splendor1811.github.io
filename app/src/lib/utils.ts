import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Hex color -> "r, g, b" for rgba() composition in inline styles. */
export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Human-readable relative/absolute date; tolerates unknown ("—") dates. */
export function formatDate(dateRaw: string, dateSort: string | null): string {
  if (!dateSort) return dateRaw || "undated";
  const d = new Date(dateSort);
  // If we only know the year (Jan 1 placeholder from a bare year), show the year.
  if (dateRaw.length === 4) return dateRaw;
  if (/^\d{4}-\d{2}$/.test(dateRaw)) {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function pluralize(n: number, word: string, plural?: string): string {
  return `${n} ${n === 1 ? word : (plural ?? word + "s")}`;
}
