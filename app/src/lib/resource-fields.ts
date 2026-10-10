export interface ResourceDateParts {
  year: number;
  month?: number;
  day?: number;
}

/** Parse calendar dates without UTC conversion or silently rolling invalid days forward. */
export function parseResourceDate(value: string): ResourceDateParts | null {
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : undefined;
  const day = match[3] ? Number(match[3]) : undefined;
  if (year < 1 || (month !== undefined && (month < 1 || month > 12))) return null;
  if (day !== undefined && month !== undefined) {
    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day < 1 || day > daysInMonth[month - 1]) return null;
  }
  return { year, month, day };
}

export function isUnknownResourceDate(value: string): boolean {
  return ["", "—", "-", "n.d."].includes(value.trim());
}

export function isValidResourceDate(value: string): boolean {
  return isUnknownResourceDate(value) || parseResourceDate(value) !== null;
}

/** Noon avoids daylight-saving transitions, and setFullYear supports years below 100. */
export function localCalendarDate(year: number, month = 1, day = 1): Date {
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0);
  return date;
}

export function toCalendarDateValue(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatResourceDate(value: string, locale?: string): string {
  if (isUnknownResourceDate(value)) return "No date";
  const parts = parseResourceDate(value);
  if (!parts) return value;
  if (!parts.month) return String(parts.year).padStart(4, "0");
  const date = localCalendarDate(parts.year, parts.month, parts.day);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    ...(parts.day ? { day: "numeric" as const } : {}),
  }).format(date);
}

export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed) || /[\s<>\\]/.test(trimmed)) return false;
  try {
    const url = new URL(trimmed);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}
