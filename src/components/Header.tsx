import { event } from "../config/event";

const links = [
  { href: "#details", label: "The Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/95 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <a
          href="#top"
          className="min-w-0 truncate font-serif text-xl tracking-tight text-ink"
        >
          {event.name}
        </a>
        <div className="flex items-center gap-5">
          <nav aria-label="Sections" className="hidden items-center gap-5 sm:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-ink/80"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#rsvp"
            className="inline-flex min-h-11 items-center bg-ink px-4 text-sm tracking-[0.14em] text-ivory uppercase"
          >
            RSVP
          </a>
        </div>
      </div>
      <nav
        aria-label="Sections"
        className="flex border-t border-line/80 sm:hidden"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 flex-1 items-center justify-center text-sm text-ink/80"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
