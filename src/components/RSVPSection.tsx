import { useEffect, useRef } from "react";
import { event } from "../config/event";
import { httpUrl } from "../lib/text";

export function RSVPSection() {
  const pageUrl = httpUrl(event.rsvpPageUrl);
  const embedCode = event.rsvpifyEmbedCode.trim();
  const eventUrl = embedSrc(event.rsvpifyEventUrl);
  const fallback = httpUrl(event.rsvpifyUrl);

  return (
    <section id="rsvp" className="scroll-mt-32 border-t border-line bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-14 text-center md:px-8 md:py-20">
        {pageUrl ? (
          <a
            href={pageUrl}
            className="inline-flex min-h-24 w-full items-center justify-center bg-ink px-10 font-serif text-5xl text-ivory sm:w-auto sm:min-w-80 sm:px-20 md:min-h-28 md:text-6xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            RSVP
          </a>
        ) : embedCode ? (
          <EmbedCode html={embedCode} minHeight={event.rsvpifyFrameHeight} />
        ) : eventUrl ? (
          <iframe
            title="RSVP form"
            src={eventUrl}
            className="mt-10 block w-full border-0 bg-paper"
            style={{ height: event.rsvpifyFrameHeight }}
            loading="lazy"
          />
        ) : (
          <div className="mt-10 border border-line bg-paper px-6 py-14 text-center">
            <p className="font-serif text-3xl text-ink">RSVP details coming soon</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
              The reply page is almost ready.
            </p>
          </div>
        )}

        {!pageUrl && fallback ? (
          <p className="mt-4 text-center">
            <a
              href={fallback}
              className="text-sm text-muted underline decoration-line underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in browser
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function EmbedCode({ html, minHeight }: { html: string; minHeight: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const template = document.createElement("template");
    template.innerHTML = html;
    const scripts = [...template.content.querySelectorAll("script")];
    for (const script of scripts) script.remove();
    root.replaceChildren(template.content);

    const frames = [...root.querySelectorAll("iframe")];
    for (const frame of frames) {
      frame.style.width = "100%";
      frame.style.maxWidth = "100%";
      frame.style.border = "0";
      frame.style.display = "block";
      if (!frame.getAttribute("height") && !frame.style.height) {
        frame.style.height = `${minHeight}px`;
      }
      if (!frame.title) frame.title = "RSVP form";
    }

    for (const oldScript of scripts) {
      const script = document.createElement("script");
      for (const attr of oldScript.attributes) {
        script.setAttribute(attr.name, attr.value);
      }
      script.text = oldScript.textContent ?? "";
      root.appendChild(script);
    }

    function onMessage(message: MessageEvent) {
      const frame = frames.find((item) => item.contentWindow === message.source);
      const height = messageHeight(message.data);
      if (!frame || height === null || height < 240 || height > 8000) return;
      frame.style.height = `${height}px`;
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      root.replaceChildren();
    };
  }, [html, minHeight]);

  return <div ref={containerRef} className="rsvp-embed mt-10 w-full" />;
}

function embedSrc(value: string): string | null {
  const url = httpUrl(value);
  if (!url) return null;
  const parsed = new URL(url);
  if (!parsed.searchParams.has("embed")) parsed.searchParams.set("embed", "1");
  if (!parsed.searchParams.has("oEmbed")) parsed.searchParams.set("oEmbed", "1");
  return parsed.toString();
}

function messageHeight(data: unknown): number | null {
  if (typeof data === "number" && Number.isFinite(data)) return data;
  if (typeof data === "string" && /^\d+$/.test(data)) return Number(data);
  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;
  for (const key of ["height", "iframeHeight", "frameHeight"]) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  }
  return null;
}
