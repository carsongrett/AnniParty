import { event } from "../config/event";
import {
  buildCalendar,
  downloadIcs,
  formatEventDate,
  formatEventTime,
  formatTimeZoneName,
} from "../lib/calendar";
import {
  disabledButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../lib/styles";
import { joinVisible, mapsHref, visibleText } from "../lib/text";

export function EventDetails() {
  const dateText =
    visibleText(event.date) ??
    formatEventDate(event.calendarStart, event.timeZone) ??
    event.date;
  const startText =
    visibleText(event.startTime) ??
    formatEventTime(event.calendarStart, event.timeZone) ??
    event.startTime;
  const endText =
    visibleText(event.endTime) ??
    formatEventTime(event.calendarEnd, event.timeZone) ??
    event.endTime;
  const zoneText =
    formatTimeZoneName(event.calendarStart, event.timeZone) ?? event.timeZone;
  const maps = mapsHref(event.mapsUrl, event.venueAddress);
  const location = joinVisible([event.venueName, event.venueAddress], "\n");
  const calendar = buildCalendar({
    name: event.calendarTitle,
    description: event.calendarDescription,
    timeZone: event.timeZone,
    start: event.calendarStart,
    end: event.calendarEnd,
    location: location.replaceAll("\n", ", "),
  });

  const rows = [
    { label: "Date", value: dateText },
    {
      label: "Time",
      value: (
        <>
          {startText} – {endText}
          <span className="mt-1 block text-base text-muted">{zoneText}</span>
        </>
      ),
    },
    {
      label: "Venue",
      value: (
        <>
          <span className="block">{event.venueName}</span>
          <span className="mt-1 block text-base text-muted">{event.venueAddress}</span>
          {maps ? (
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center underline decoration-line underline-offset-4"
            >
              Open in Google Maps
            </a>
          ) : (
            <span className="mt-3 block text-sm text-muted">
              A map link will appear once the venue address is added.
            </span>
          )}
        </>
      ),
    },
    { label: "Dress code", value: event.dressCode },
    { label: "Food & drink", value: event.menu },
  ];

  return (
    <section id="details" className="scroll-mt-32 border-t border-line">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          The Details
        </h2>
        <dl className="mt-10 border-t border-line">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 border-b border-line py-5 sm:grid-cols-[9rem_1fr] sm:gap-8 sm:py-6"
            >
              <dt className="text-xs tracking-[0.18em] text-muted uppercase">
                {row.label}
              </dt>
              <dd className="text-lg leading-relaxed text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12">
          <h3 className="font-serif text-3xl text-ink">Add to calendar</h3>
          {calendar ? (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                className={primaryButtonClass}
                href={calendar.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Calendar
              </a>
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => downloadIcs(calendar.filename, calendar.ics)}
              >
                Download .ics
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" className={disabledButtonClass} disabled>
                  Google Calendar
                </button>
                <button type="button" className={disabledButtonClass} disabled>
                  Download .ics
                </button>
              </div>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                Calendar links will turn on once the date, times, and time zone
                are added.
              </p>
            </div>
          )}
          <p className="mt-3 text-sm text-muted">
            The .ics file works with Apple Calendar and Outlook.
          </p>
        </div>

        {event.schedule.length > 0 ? (
          <div className="mt-14">
            <h3 className="font-serif text-3xl text-ink">Schedule</h3>
            <ol className="mt-6 border-t border-line">
              {event.schedule.map((item) => (
                <li
                  key={`${item.time}-${item.label}`}
                  className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-4"
                >
                  <span className="text-sm tracking-wide text-muted">{item.time}</span>
                  <span className="text-lg text-ink">{item.label}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}
