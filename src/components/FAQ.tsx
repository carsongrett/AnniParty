import { useId, useState } from "react";
import { event } from "../config/event";

export function FAQ() {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <section id="faq" className="scroll-mt-32 border-t border-line">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          Questions
        </h2>
        <div className="mt-10 border-t border-line">
          {event.faqs.map((item, index) => {
            const panelId = `${baseId}-${index}`;
            const expanded = open.has(index);
            return (
              <div key={item.question} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span className="font-serif text-2xl leading-snug text-ink">
                      {item.question}
                    </span>
                    <span aria-hidden="true" className="text-xl text-muted">
                      {expanded ? "–" : "+"}
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" hidden={!expanded}>
                  <p className="max-w-xl pb-5 leading-relaxed text-ink/80">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
