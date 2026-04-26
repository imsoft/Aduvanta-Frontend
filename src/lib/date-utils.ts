/**
 * Interprets a backend timestamp as a calendar date by reading its UTC
 * date components. Avoids the off-by-one-day shift that happens in
 * negative-offset timezones (e.g. Mexico UTC-6) when the backend stores
 * date-only fields as UTC midnight (e.g. "2026-04-26T00:00:00.000Z").
 *
 * Use this for date-only fields (dueAt, openedAt, closedAt, startsAt,
 * endsAt, trialEndsAt, currentPeriodEnd). Do NOT use it for timestamps
 * where the local time matters (createdAt, updatedAt).
 */
export function parseApiDate(iso: string): Date {
  const d = new Date(iso);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Converts a date-only string from <input type="date"> (e.g. "2026-04-26")
 * to an ISO timestamp at UTC noon. Storing at noon instead of UTC midnight
 * ensures the calendar date stays the same in any timezone (UTC-12 to UTC+12).
 */
export function toApiDate(dateStr: string): string {
  return `${dateStr}T12:00:00.000Z`;
}

/**
 * Extracts a "yyyy-MM-dd" string from a backend timestamp for use as the
 * value of <input type="date">. Reads UTC date components to avoid the
 * timezone shift.
 */
export function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
