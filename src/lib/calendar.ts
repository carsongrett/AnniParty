import { isPlaceholder, visibleText } from "./text.ts";

export type CalendarSource = {
  name: string;
  description: string;
  timeZone: string;
  start: string;
  end: string;
  location: string;
};

export type CalendarFiles = {
  googleUrl: string;
  ics: string;
  filename: string;
};

const LOCAL_DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

type ZonedParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
};

export function normalizeLocalDateTime(value: string): string | null {
  const match = LOCAL_DATE_TIME.exec(value.trim());
  if (!match) return null;
  const [, year, month, day, hour, minute, second = "00"] = match;
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const hh = Number(hour);
  const mm = Number(minute);
  const ss = Number(second);
  if (m < 1 || m > 12 || hh > 23 || mm > 59 || ss > 59) return null;
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (
    probe.getUTCFullYear() !== y ||
    probe.getUTCMonth() !== m - 1 ||
    probe.getUTCDate() !== d
  ) {
    return null;
  }
  return `${year}-${month}-${day}T${hour}:${minute}:${second.padStart(2, "0")}`;
}

function readZonedParts(date: Date, timeZone: string): ZonedParts | null {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const map: Record<string, string> = {};
    for (const part of formatter.formatToParts(date)) {
      if (part.type !== "literal") map[part.type] = part.value;
    }
    let hour = map.hour ?? "";
    if (hour === "24") hour = "00";
    if (!map.year || !map.month || !map.day || !hour || !map.minute || !map.second) {
      return null;
    }
    return {
      year: map.year,
      month: map.month,
      day: map.day,
      hour,
      minute: map.minute,
      second: map.second,
    };
  } catch {
    return null;
  }
}

function timeZoneOffset(utcMs: number, timeZone: string): number | null {
  const parts = readZonedParts(new Date(utcMs), timeZone);
  if (!parts) return null;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - utcMs;
}

/** Interpret a wall-clock time in an IANA zone as a UTC instant. */
export function zonedWallTimeToUtc(local: string, timeZone: string): Date | null {
  const normalized = normalizeLocalDateTime(local);
  if (!normalized || isPlaceholder(timeZone) || !timeZone.trim()) return null;
  const [datePart, timePart] = normalized.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const offset = timeZoneOffset(utcGuess, timeZone);
  if (offset === null) return null;
  let utc = utcGuess - offset;
  const offsetAtResult = timeZoneOffset(utc, timeZone);
  if (offsetAtResult === null) return null;
  if (offsetAtResult !== offset) utc = utcGuess - offsetAtResult;
  const result = new Date(utc);
  const parts = readZonedParts(result, timeZone);
  if (!parts) return null;
  const actual = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
  return actual === normalized ? result : null;
}

export function formatEventDate(local: string, timeZone: string): string | null {
  const utc = zonedWallTimeToUtc(local, timeZone);
  if (!utc) return null;
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(utc);
}

export function formatEventTime(local: string, timeZone: string): string | null {
  const utc = zonedWallTimeToUtc(local, timeZone);
  if (!utc) return null;
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(utc);
}

export function formatTimeZoneName(local: string, timeZone: string): string | null {
  const utc = zonedWallTimeToUtc(local, timeZone);
  if (!utc) return null;
  return (
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(utc)
      .find((part) => part.type === "timeZoneName")?.value ?? null
  );
}

function formatUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function toGoogleLocal(local: string): string {
  return local.replaceAll("-", "").replaceAll(":", "");
}

function escapeIcs(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("\r\n", "\n")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 0) {
    chunks.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return chunks.join("\r\n");
}

function slug(value: string): string {
  const result = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return result || "celebration";
}

export function buildCalendar(source: CalendarSource): CalendarFiles | null {
  const timeZone = source.timeZone.trim();
  const startLocal = normalizeLocalDateTime(source.start);
  const endLocal = normalizeLocalDateTime(source.end);
  if (!startLocal || !endLocal) return null;
  const start = zonedWallTimeToUtc(startLocal, timeZone);
  const end = zonedWallTimeToUtc(endLocal, timeZone);
  if (!start || !end || end.getTime() <= start.getTime()) return null;

  const title = visibleText(source.name) ?? "Anniversary celebration";
  const description = visibleText(source.description) ?? "";
  const location = visibleText(source.location) ?? "";
  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", title);
  google.searchParams.set(
    "dates",
    `${toGoogleLocal(startLocal)}/${toGoogleLocal(endLocal)}`,
  );
  google.searchParams.set("ctz", timeZone);
  if (description) google.searchParams.set("details", description);
  if (location) google.searchParams.set("location", location);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AnniParty//Anniversary//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${toGoogleLocal(startLocal)}-${slug(title)}@anniversary.local`,
    `DTSTAMP:${formatUtcStamp(new Date())}`,
    `DTSTART:${formatUtcStamp(start)}`,
    `DTEND:${formatUtcStamp(end)}`,
    foldLine(`SUMMARY:${escapeIcs(title)}`),
  ];
  if (description) lines.push(foldLine(`DESCRIPTION:${escapeIcs(description)}`));
  if (location) lines.push(foldLine(`LOCATION:${escapeIcs(location)}`));
  lines.push("END:VEVENT", "END:VCALENDAR");

  return {
    googleUrl: google.toString(),
    ics: `${lines.join("\r\n")}\r\n`,
    filename: "anniversary.ics",
  };
}

export function downloadIcs(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
