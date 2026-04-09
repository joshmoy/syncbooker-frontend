export const DEFAULT_TIMEZONE = "UTC";

function normalizeTimeZone(timeZone?: string | null): string {
  if (!timeZone) {
    return DEFAULT_TIMEZONE;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function getBrowserTimeZone(): string {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return normalizeTimeZone(detected);
}

export function formatCalendarDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateKeyInTimeZone(
  dateLike: Date | string,
  timeZone?: string | null,
): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: normalizeTimeZone(timeZone),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date(dateLike));
}

export function formatInTimeZone(
  dateLike: Date | string,
  options: Intl.DateTimeFormatOptions,
  timeZone?: string | null,
  locale = "en-US",
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: normalizeTimeZone(timeZone),
  }).format(new Date(dateLike));
}

export function formatDateInTimeZone(
  dateLike: Date | string,
  timeZone?: string | null,
): string {
  return formatInTimeZone(
    dateLike,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
    timeZone,
  );
}

export function formatShortDateInTimeZone(
  dateLike: Date | string,
  timeZone?: string | null,
): string {
  return formatInTimeZone(
    dateLike,
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    },
    timeZone,
  );
}

export function formatTimeInTimeZone(
  dateLike: Date | string,
  timeZone?: string | null,
): string {
  return formatInTimeZone(
    dateLike,
    {
      hour: "numeric",
      minute: "2-digit",
    },
    timeZone,
  );
}

export function formatTimeRangeInTimeZone(
  start: Date | string,
  end: Date | string,
  timeZone?: string | null,
): string {
  return `${formatTimeInTimeZone(start, timeZone)} - ${formatTimeInTimeZone(end, timeZone)}`;
}

export function getTimeZoneName(
  dateLike: Date | string,
  timeZone?: string | null,
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: normalizeTimeZone(timeZone),
    timeZoneName: "short",
  }).formatToParts(new Date(dateLike));

  return (
    parts.find((part) => part.type === "timeZoneName")?.value ||
    normalizeTimeZone(timeZone)
  );
}
