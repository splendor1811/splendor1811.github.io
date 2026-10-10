import { describe, expect, test } from "bun:test";
import { formatResourceDate, isHttpUrl, isValidResourceDate, localCalendarDate, parseResourceDate, toCalendarDateValue } from "./resource-fields";
import { formatDate } from "./utils";

describe("resource dates", () => {
  test("preserves exact, month-only, year-only, and unknown precision", () => {
    expect(parseResourceDate("2026-10-10")).toEqual({ year: 2026, month: 10, day: 10 });
    expect(parseResourceDate("2026-10")).toEqual({ year: 2026, month: 10, day: undefined });
    expect(parseResourceDate("2026")).toEqual({ year: 2026, month: undefined, day: undefined });
    for (const date of ["", "—", "-", "n.d."]) expect(isValidResourceDate(date)).toBe(true);
    expect(formatResourceDate("2026-10", "en-US")).toBe("Oct 2026");
    expect(formatResourceDate("2026", "en-US")).toBe("2026");
    expect(formatResourceDate("2025-26 (Sem I)", "en-US")).toBe("2025-26 (Sem I)");
  });

  test("rejects impossible dates instead of normalizing into another month", () => {
    for (const date of ["2026-02-29", "2026-04-31", "1900-02-29", "2026-00", "2026-13", "2026-01-00", "0000", "2026-1-1", "2026-10-10extra"]) {
      expect(isValidResourceDate(date)).toBe(false);
    }
    expect(isValidResourceDate("2024-02-29")).toBe(true);
    expect(isValidResourceDate("2000-02-29")).toBe(true);
  });

  test("round-trips local dates through DST boundaries and early years", () => {
    for (const value of ["2026-01-01", "2026-03-08", "2026-11-01", "2024-02-29", "0099-01-01"]) {
      const parts = parseResourceDate(value)!;
      const date = localCalendarDate(parts.year, parts.month, parts.day);
      expect(toCalendarDateValue(date)).toBe(value);
    }
    expect(formatResourceDate("2026-01-01", "en-US")).toBe("Jan 1, 2026");
  });

  test("library display keeps date precision and legacy descriptive dates", () => {
    expect(formatDate("2026-01-01", "2026-01-01")).toBe("Jan 1, 2026");
    expect(formatDate("2026-01", "2026-01-01")).toBe("Jan 2026");
    expect(formatDate("2026", "2026-01-01")).toBe("2026");
    expect(formatDate("2026 (Spring)", "2026-01-01")).toBe("2026 (Spring)");
    expect(formatDate("2026-8-23", "2026-01-01")).toBe("Aug 23, 2026");
    expect(formatDate("—", null)).toBe("—");
  });
});

describe("resource URLs", () => {
  test("accepts complete web URLs and rejects unsafe or malformed protocols", () => {
    for (const url of ["https://example.com/paper?q=attention#results", "http://localhost:3000", " HTTPS://example.com "]) expect(isHttpUrl(url)).toBe(true);
    for (const url of ["", "http", "https://", "httpbad", "https:example.com", "javascript:alert(1)", "data:text/html,hello", "ftp://example.com", "https://exa mple.com", "https://example.com\nspoof"]) expect(isHttpUrl(url)).toBe(false);
  });
});
