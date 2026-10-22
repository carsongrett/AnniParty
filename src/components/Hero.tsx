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
        <p className="text-xs tracking-[0.28em] text-muted uppercase">
          First anniversary
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
          {event.name}
        </h1>
        <p className="mt-6 font-serif text-2xl text-ink md:text-3xl">
          {event.coupleNames}
        </p>
        <p className="mt-3 text-sm tracking-[0.18em] text-muted uppercase">
          {event.date}
        </p>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink/80">
          {event.tagline}
        </p>
        <a href="#rsvp" className={`${primaryButtonClass} mt-8`}>
          RSVP
        </a>
      </div>
    </section>
  );
}
