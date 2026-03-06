/**
 * @vitest-environment node
 *
 * Unit tests for the business-logic helpers in src/utils/formatters.ts.
 * Each function is tested for normal inputs, edge cases, and null / empty inputs.
 */

import { describe, expect, it } from "vitest";
import {
  calculateAge,
  formatDayKey,
  formatDayLabel,
  formatToDateTimeLocal,
  formatToTime,
} from "../src/utils/formatters";

// ─── formatToTime ─────────────────────────────────────────────────────────────

describe("formatToTime", () => {
  it("returns an empty string for null", () => {
    expect(formatToTime(null)).toBe("");
  });

  it("formats a UTC noon ISO string to 12-hour time", () => {
    // 2026-03-06T12:00:00Z → local noon — verify shape not exact tz-offset value
    const result = formatToTime("2026-03-06T12:00:00Z");
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });

  it("formats a midnight ISO string correctly", () => {
    const result = formatToTime("2026-01-01T00:00:00Z");
    expect(result).toMatch(/\d{1,2}:00\s?(AM|PM)/i);
  });

  it("always includes a two-digit minute portion", () => {
    const result = formatToTime("2026-03-06T09:05:00Z");
    // minute part must be zero-padded, e.g. "9:05 AM" not "9:5 AM"
    expect(result).toMatch(/:\d{2}/);
  });

  it("always includes AM or PM", () => {
    const am = formatToTime("2026-03-06T08:00:00Z");
    const pm = formatToTime("2026-03-06T20:00:00Z");
    expect(am).toMatch(/AM|PM/i);
    expect(pm).toMatch(/AM|PM/i);
  });
});

// ─── formatToDateTimeLocal ────────────────────────────────────────────────────

describe("formatToDateTimeLocal", () => {
  it("returns an empty string for null", () => {
    expect(formatToDateTimeLocal(null)).toBe("");
  });

  it("output contains a date portion in YYYY-MM-DD format", () => {
    const result = formatToDateTimeLocal("2026-03-06T14:30:00Z");
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it("output contains a 12-hour time portion with AM/PM", () => {
    const result = formatToDateTimeLocal("2026-03-06T14:30:00Z");
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });

  it("date and time parts are separated by a space", () => {
    const result = formatToDateTimeLocal("2026-03-06T00:00:00Z");
    // expect format: "YYYY-MM-DD H:MM AM/PM"
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}/);
  });

  it("returns a non-empty string for a valid ISO string", () => {
    expect(formatToDateTimeLocal("2026-06-15T10:00:00Z")).not.toBe("");
  });
});

// ─── formatDayKey ─────────────────────────────────────────────────────────────

describe("formatDayKey", () => {
  it("extracts the first 10 characters of an ISO string", () => {
    expect(formatDayKey("2026-03-06T14:30:00Z")).toBe("2026-03-06");
  });

  it("returns the date unchanged when given a bare YYYY-MM-DD string", () => {
    expect(formatDayKey("2026-01-01")).toBe("2026-01-01");
  });

  it("handles timestamps without a time component", () => {
    expect(formatDayKey("2026-12-31T00:00:00.000Z")).toBe("2026-12-31");
  });

  it("always returns exactly 10 characters", () => {
    const result = formatDayKey("2026-07-04T08:00:00Z");
    expect(result).toHaveLength(10);
  });
});

// ─── formatDayLabel ───────────────────────────────────────────────────────────

describe("formatDayLabel", () => {
  it("includes the full weekday name", () => {
    // 2026-03-06 is a Friday
    const result = formatDayLabel("2026-03-06");
    expect(result).toMatch(/friday/i);
  });

  it("includes the full month name", () => {
    const result = formatDayLabel("2026-03-06");
    expect(result).toMatch(/march/i);
  });

  it("includes the numeric day", () => {
    const result = formatDayLabel("2026-03-06");
    expect(result).toContain("6");
  });

  it("includes the four-digit year", () => {
    const result = formatDayLabel("2026-03-06");
    expect(result).toContain("2026");
  });

  it("returns different labels for different dates", () => {
    expect(formatDayLabel("2026-01-01")).not.toBe(formatDayLabel("2026-07-04"));
  });
});

// ─── calculateAge ─────────────────────────────────────────────────────────────

describe("calculateAge", () => {
  it("returns 0 for a date of birth that is today", () => {
    const today = new Date();
    const dob = today.toISOString().slice(0, 10);
    expect(calculateAge(dob)).toBe(0);
  });

  it("returns the correct age for a known past date", () => {
    // Someone born on 2000-01-01 is 26 as of March 2026
    expect(calculateAge("2000-01-01")).toBe(26);
  });

  it("returns a positive integer for any historical date of birth", () => {
    const age = calculateAge("1985-06-15");
    expect(age).toBeGreaterThan(0);
    expect(Number.isInteger(age)).toBe(true);
  });

  it("handles a date one year ago", () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const dob = lastYear.toISOString().slice(0, 10);
    expect(calculateAge(dob)).toBe(1);
  });

  it("returns 100 for a centenary birth date", () => {
    expect(calculateAge("1926-03-06")).toBe(100);
  });
});
