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
