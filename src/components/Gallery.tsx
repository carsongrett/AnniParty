import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { event, type Photo } from "../config/event";
import { publicUrl } from "../lib/assets";

export function Gallery() {
  const photos = event.gallery.filter((photo) => photo.src);
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = active === null ? null : photos[active];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [active]);

  function show(index: number) {
    if (photos.length === 0) return;
    const next = (index + photos.length) % photos.length;
    setActive(next);
  }

  function onKeyDown(keyEvent: KeyboardEvent<HTMLDialogElement>) {
    if (active === null) return;
    if (keyEvent.key === "ArrowRight") {
      keyEvent.preventDefault();
      show(active + 1);
    } else if (keyEvent.key === "ArrowLeft") {
      keyEvent.preventDefault();
      show(active - 1);
    }
  }

  return (
    <section id="gallery" className="scroll-mt-32 border-t border-line bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          Gallery
        </h2>
        <ul className="mt-10 columns-2 gap-2 sm:gap-3 md:columns-3">
          {photos.map((item, index) => (
            <li key={item.src} className="mb-2 break-inside-avoid sm:mb-3">
              <PhotoButton photo={item} onOpen={() => setActive(index)} />
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Photograph"
        className="photo-dialog"
        onClose={() => setActive(null)}
        onKeyDown={onKeyDown}
      >
        {photo ? (
          <div
            className="flex h-full flex-col"
            onClick={() => setActive(null)}
          >
            <div className="flex justify-end p-3">
              <button
                ref={closeRef}
                type="button"
                className="inline-flex min-h-11 items-center justify-center border border-ivory/50 px-4 text-sm tracking-[0.14em] uppercase"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center px-4">
              <img
                src={publicUrl(photo.src)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="max-h-[70dvh] w-auto max-w-full object-contain"
                onClick={(click) => click.stopPropagation()}
              />
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-4">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center border border-ivory/50 px-3 text-sm tracking-[0.12em] uppercase"
                onClick={(click) => {
                  click.stopPropagation();
                  if (active !== null) show(active - 1);
                }}
              >
                Previous
              </button>
              <p className="text-sm text-ivory/80">
                {active! + 1} of {photos.length}
              </p>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center border border-ivory/50 px-3 text-sm tracking-[0.12em] uppercase"
                onClick={(click) => {
                  click.stopPropagation();
                  if (active !== null) show(active + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}

function PhotoButton({
  photo,
  onOpen,
}: {
  photo: Photo;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="block w-full"
      aria-haspopup="dialog"
      aria-label={`View larger: ${photo.alt}`}
      onClick={onOpen}
    >
      <img
        src={publicUrl(photo.src)}
        alt=""
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
      />
    </button>
  );
}
