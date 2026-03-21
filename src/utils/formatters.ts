/**
 * Formats an ISO string or Date into 12-hour time string.
 * Example: "2024-05-12T14:30:00Z" -> "2:30 PM"
 */
export const formatToTime = (dateString: string | null): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

/**
 * Formats an ISO string to Date and 12 hour time string
 * Example: "2024-05-12T14:30:00Z" -> "2024-05-12 2:30 PM"
 */
export const formatToDateTimeLocal = (dateString: string | null): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const datePart = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} ${timePart}`;
};

/**
 * Converts any parseable date string to the "yyyy-MM-ddThh:mm" format
 * required by <input type="datetime-local">.
 * Example: "2026-03-20 3:21 PM" -> "2026-03-20T15:21"
 */
export const toDateTimeInputValue = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Extracts the "YYYY-MM-DD" date key from an ISO string.
 * Example: "2024-05-12T14:30:00Z" -> "2024-05-12"
 */
export const formatDayKey = (iso: string): string => iso.slice(0, 10);

/**
 * Formats a "YYYY-MM-DD" key into a human-readable day label.
 * Example: "2024-05-12" -> "Sunday, May 12, 2024"
 */
export const formatDayLabel = (key: string): string => {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Calculates age in years from a date of birth string.
 * Example: "1990-04-25" -> 34 (as of 2024)
 */
export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const difference = Date.now() - birthDate.getTime();
  const ageDate = new Date(difference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
