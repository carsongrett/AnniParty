import { event } from "../config/event";
import { publicUrl } from "../lib/assets";
import { primaryButtonClass } from "../lib/styles";

export function Hero() {
  return (
    <section id="top">
      <img
        src={publicUrl(event.hero.src)}
        alt={event.hero.alt}
        width={event.hero.width}
        height={event.hero.height}
        fetchPriority="high"
        decoding="async"
        className="h-[38svh] min-h-52 w-full object-cover object-[center_45%] sm:h-[48vh] md:h-[58vh]"
      />
      <div className="mx-auto max-w-3xl px-5 py-12 text-center md:px-8 md:py-20">
        <h1 className="font-serif text-6xl leading-[0.95] text-ink sm:text-7xl md:text-8xl">
          {event.name}
        </h1>
        <p className="mt-4 text-lg tracking-wide text-muted">{event.coupleNames}</p>
        <p className="mt-10 font-serif text-3xl text-ink md:text-4xl">{event.date}</p>
        <p className="mt-2 text-sm tracking-[0.16em] text-ink/80 uppercase">
          {event.startTime} – {event.endTime}
        </p>
        <p className="mt-6 text-base text-muted">Married {event.anniversaryDate}</p>
        <a href="#rsvp" className={`${primaryButtonClass} mt-8`}>
          RSVP
        </a>
      </div>
    </section>
  );
}
