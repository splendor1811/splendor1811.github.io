import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Input } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import {
  formatResourceDate,
  isUnknownResourceDate,
  isValidResourceDate,
  localCalendarDate,
  parseResourceDate,
  toCalendarDateValue,
} from "@/lib/resource-fields";

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Existing free-form dates can be kept verbatim until the user chooses a replacement. */
  legacyValue?: string;
  "aria-describedby"?: string;
}

function monthStart(date: Date): Date {
  return localCalendarDate(date.getFullYear(), date.getMonth() + 1);
}

function anchorDate(value: string): Date {
  const parts = parseResourceDate(value);
  return parts ? localCalendarDate(parts.year, parts.month, parts.day) : new Date();
}

function moveMonth(date: Date, offset: number): Date {
  const next = localCalendarDate(date.getFullYear(), date.getMonth() + offset + 1);
  const lastDay = localCalendarDate(next.getFullYear(), next.getMonth() + 2, 0).getDate();
  next.setDate(Math.min(date.getDate(), lastDay));
  return next;
}

export function DatePicker({ id, value, onChange, disabled, legacyValue, "aria-describedby": describedBy }: DatePickerProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(anchorDate(value)));
  const [focusedDay, setFocusedDay] = useState(() => toCalendarDateValue(anchorDate(value)));
  const calendarRef = useRef<HTMLTableElement>(null);
  const shouldFocusDay = useRef(false);
  const today = new Date();
  const todayValue = toCalendarDateValue(today);
  const selectedParts = parseResourceDate(value);
  const selectedValue = selectedParts?.day ? value.trim() : null;
  const valid = isValidResourceDate(value) || (legacyValue !== undefined && value === legacyValue);
  const preservingLegacy = !isValidResourceDate(value) && value === legacyValue;
  const errorId = `${controlId}-error`;
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const yearOptions = [...new Set([...Array.from({ length: today.getFullYear() + 11 - 1900 }, (_, i) => 1900 + i), year])].sort((a, b) => a - b);
  const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });
  const fullDateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "full" });
  const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long" });
  const offset = (visibleMonth.getDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, index) => localCalendarDate(year, month + 1, index - offset + 1));

  function focusCalendarDay() {
    calendarRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusedDay}"]`)?.focus();
  }

  useEffect(() => {
    if (open && shouldFocusDay.current) {
      shouldFocusDay.current = false;
      focusCalendarDay();
    }
  }, [open, focusedDay, visibleMonth]);

  function onOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      const anchor = anchorDate(value);
      setVisibleMonth(monthStart(anchor));
      setFocusedDay(toCalendarDateValue(anchor));
    }
    setOpen(nextOpen);
  }

  function selectDate(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
  }

  function changeMonth(next: Date) {
    setVisibleMonth(monthStart(next));
    setFocusedDay(toCalendarDateValue(next));
  }

  function onDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    const next = new Date(date);
    const weekday = (date.getDay() + 6) % 7;
    switch (event.key) {
      case "ArrowLeft": next.setDate(date.getDate() - 1); break;
      case "ArrowRight": next.setDate(date.getDate() + 1); break;
      case "ArrowUp": next.setDate(date.getDate() - 7); break;
      case "ArrowDown": next.setDate(date.getDate() + 7); break;
      case "Home": next.setDate(date.getDate() - weekday); break;
      case "End": next.setDate(date.getDate() + 6 - weekday); break;
      case "PageUp": next.setTime(moveMonth(date, event.shiftKey ? -12 : -1).getTime()); break;
      case "PageDown": next.setTime(moveMonth(date, event.shiftKey ? 12 : 1).getTime()); break;
      default: return;
    }
    event.preventDefault();
    if (next.getFullYear() < 1 || next.getFullYear() > 9999) return;
    shouldFocusDay.current = true;
    changeMonth(next);
  }

  return (
    <div className="min-w-0">
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <button
            id={controlId}
            type="button"
            disabled={disabled}
            aria-invalid={!valid || undefined}
            aria-describedby={[describedBy, !valid ? errorId : null].filter(Boolean).join(" ") || undefined}
            className={cn(
              "flex min-h-11 w-full items-center gap-2.5 rounded-md border border-border bg-input px-3 py-2 text-left text-sm text-foreground shadow-subtle transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              !valid && "border-destructive",
            )}
          >
            <CalendarDays size={17} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className={cn("min-w-0 flex-1 truncate", isUnknownResourceDate(value) && "text-muted-foreground")}>
              {isUnknownResourceDate(value) ? "Choose a date" : formatResourceDate(value)}
            </span>
            <ChevronDown size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            collisionPadding={12}
            aria-label="Choose publication date"
            className="z-[80] max-h-[var(--radix-popover-content-available-height)] w-[340px] max-w-[calc(100vw-24px)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-raised"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              focusCalendarDay();
            }}
          >
            <div className="mb-2 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0"
                aria-label="Previous month"
                disabled={year === 1 && month === 0}
                onClick={() => changeMonth(moveMonth(visibleMonth, -1))}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </Button>
              <select
                aria-label="Month"
                className="h-11 min-w-0 flex-1 rounded-md bg-transparent pl-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={month}
                onChange={(event) => changeMonth(localCalendarDate(year, Number(event.target.value) + 1))}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={index}>{monthFormatter.format(localCalendarDate(2024, index + 1))}</option>
                ))}
              </select>
              <select
                aria-label="Year"
                className="h-11 w-[76px] shrink-0 rounded-md bg-transparent pl-1 text-sm font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={year}
                onChange={(event) => changeMonth(localCalendarDate(Number(event.target.value), month + 1))}
              >
                {yearOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0"
                aria-label="Next month"
                disabled={year === 9999 && month === 11}
                onClick={() => changeMonth(moveMonth(visibleMonth, 1))}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </Button>
            </div>

            <p id={`${controlId}-month`} className="sr-only" aria-live="polite">
              {new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(visibleMonth)}
            </p>
            <table ref={calendarRef} role="grid" aria-labelledby={`${controlId}-month`} className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: 7 }, (_, index) => (
                    <th key={index} scope="col" className="h-9 text-center text-xs font-medium text-muted-foreground">
                      {weekdayFormatter.format(localCalendarDate(2024, 1, index + 1))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }, (_, week) => (
                  <tr key={week}>
                    {days.slice(week * 7, week * 7 + 7).map((date) => {
                      const dateValue = toCalendarDateValue(date);
                      const selected = dateValue === selectedValue;
                      return (
                        <td key={dateValue} role="gridcell" aria-selected={selected} className="p-0">
                          <button
                            type="button"
                            data-date={dateValue}
                            aria-label={fullDateFormatter.format(date)}
                            aria-current={dateValue === todayValue ? "date" : undefined}
                            tabIndex={dateValue === focusedDay ? 0 : -1}
                            disabled={date.getFullYear() < 1 || date.getFullYear() > 9999}
                            className={cn(
                              "flex h-11 w-full items-center justify-center rounded-md text-sm tabular-nums transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-popover disabled:opacity-25",
                              date.getMonth() !== month ? "text-faint" : "text-foreground",
                              selected ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-surface-raised",
                              dateValue === todayValue && !selected && "bg-primary/10 font-semibold text-primary",
                            )}
                            onFocus={() => setFocusedDay(dateValue)}
                            onKeyDown={(event) => onDayKeyDown(event, date)}
                            onClick={() => selectDate(dateValue)}
                          >
                            {date.getDate()}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <Button type="button" variant="secondary" className="h-11" onClick={() => selectDate(todayValue)}>Today</Button>
              <Button type="button" variant="ghost" className="h-11" disabled={isUnknownResourceDate(value)} onClick={() => selectDate("")}>Clear date</Button>
            </div>
            <details className="mt-2 border-t border-border pt-1">
              <summary className="flex min-h-11 cursor-pointer items-center text-sm text-muted-foreground hover:text-foreground">Enter a date manually</summary>
              <label htmlFor={`${controlId}-manual`} className="mb-1.5 block text-xs text-muted-foreground">Year, month, or exact date</label>
              <Input
                id={`${controlId}-manual`}
                value={value}
                className="h-11 font-mono"
                placeholder="YYYY-MM-DD"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={!valid || undefined}
                aria-describedby={`${controlId}-format${!valid ? ` ${errorId}` : ""}`}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (valid) setOpen(false);
                  }
                }}
              />
              <p id={`${controlId}-format`} className="mb-2 mt-2 text-xs leading-relaxed text-muted-foreground">Use YYYY-MM-DD, YYYY-MM, or YYYY. Leave blank for an unknown date.</p>
            </details>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {!valid && <p id={errorId} className="mt-1.5 text-xs text-destructive" role="alert">Enter a real date as YYYY-MM-DD, YYYY-MM, or YYYY.</p>}
      {preservingLegacy && <p className="mt-1.5 text-xs text-muted-foreground">Original date kept. Choose a day to replace it.</p>}
    </div>
  );
}
