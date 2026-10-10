import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatResourceDate, parseResourceDate, localCalendarDate } from "@/lib/resource-fields";

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
  if (parseResourceDate(dateRaw)) return formatResourceDate(dateRaw, "en-US");
  // Keep descriptive dates such as "2026 (Spring)" intact, without inventing a day.
  if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateRaw)) return dateRaw || "undated";
  const [year, month, day] = dateRaw.split("-").map(Number);
  const canonical = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (!parseResourceDate(canonical)) return dateRaw;
  return localCalendarDate(year, month, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function pluralize(n: number, word: string, plural?: string): string {
  return `${n} ${n === 1 ? word : (plural ?? word + "s")}`;
}
