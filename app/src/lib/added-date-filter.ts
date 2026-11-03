import type { Resource } from "@/data/schema";

export type AddedDatePreset = "all" | "today" | "yesterday" | "this-week" | "last-week" | "this-month" | "last-month" | "custom";

export const ADDED_DATE_PRESETS: { key: AddedDatePreset; label: string }[] = [
  { key: "all", label: "Any added date" },
  { key: "today", label: "Added today" },
  { key: "yesterday", label: "Added yesterday" },
  { key: "this-week", label: "Added this week" },
  { key: "last-week", label: "Added last week" },
  { key: "this-month", label: "Added this month" },
  { key: "last-month", label: "Added last month" },
  { key: "custom", label: "Custom date range" },
];

const TIME_ZONE = "Asia/Ho_Chi_Minh";

function dayKey(at: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(at));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function addDays(key: string, amount: number): string {
  const date = new Date(`${key}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function monthKey(key: string, amount: number): string {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return date.toISOString().slice(0, 10);
}

function vietnamStart(key: string): number {
  return Date.parse(`${key}T00:00:00+07:00`);
}

export function addedDateRange(preset: AddedDatePreset, now = Date.now(), from = "", to = ""): { start: number; end: number } | null {
  const today = dayKey(now);
  const weekday = new Date(`${today}T00:00:00Z`).getUTCDay();
  const monday = addDays(today, -((weekday + 6) % 7));
  let start: string;
  let end: string;

  switch (preset) {
    case "today": start = today; end = addDays(today, 1); break;
    case "yesterday": start = addDays(today, -1); end = today; break;
    case "this-week": start = monday; end = addDays(monday, 7); break;
    case "last-week": start = addDays(monday, -7); end = monday; break;
    case "this-month": start = today.slice(0, 8) + "01"; end = monthKey(start, 1); break;
    case "last-month": end = today.slice(0, 8) + "01"; start = monthKey(end, -1); break;
    case "custom":
      if (!/^\d{4}-\d{2}-\d{2}$/.test(from || "") && !/^\d{4}-\d{2}-\d{2}$/.test(to || "")) return null;
      start = /^\d{4}-\d{2}-\d{2}$/.test(from) ? from : "0001-01-01";
      end = /^\d{4}-\d{2}-\d{2}$/.test(to) ? addDays(to, 1) : "9999-12-31";
      break;
    default: return null;
  }
  return { start: vietnamStart(start), end: vietnamStart(end) };
}

export function matchesAddedDate(resource: Resource, range: { start: number; end: number } | null): boolean {
  if (!range) return true;
  const at = resource.addedAt ? Date.parse(resource.addedAt) : Number.NaN;
  return Number.isFinite(at) && at >= range.start && at < range.end;
}
