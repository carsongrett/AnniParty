import { event } from "../config/event";
import { publicUrl } from "../lib/assets";

export function Footer() {
  const photo = event.footerImage;

  return (
    <footer className="border-t border-line">
      {photo.src ? (
        <img
          src={publicUrl(photo.src)}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          className="h-48 w-full object-cover md:h-72"
        />
      ) : null}
      <div className="mx-auto max-w-3xl px-5 py-14 text-center md:px-8">
        <p className="font-serif text-3xl text-ink md:text-4xl">{event.coupleNames}</p>
        {event.closingMessage ? (
          <p className="mt-4 text-lg leading-relaxed text-muted">{event.closingMessage}</p>
        ) : null}
      </div>
    </footer>
  );
}
