import { event } from "../config/event";
import { publicUrl } from "../lib/assets";

export function Celebration() {
  const photo = event.celebrationImage;

  return (
    <section className="scroll-mt-32 border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
        <div>
          <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Our Celebration
          </h2>
          <p className="mt-6 max-w-xl font-serif text-2xl leading-snug text-ink md:text-3xl">
            {event.welcomeMessage}
          </p>
        </div>
        {photo.src ? (
          <img
            src={publicUrl(photo.src)}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover"
          />
        ) : null}
      </div>
    </section>
  );
}
