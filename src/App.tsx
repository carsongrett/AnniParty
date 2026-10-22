import { useEffect } from "react";
import { Celebration } from "./components/Celebration";
import { EventDetails } from "./components/EventDetails";
import { FAQ } from "./components/FAQ";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RSVPSection } from "./components/RSVPSection";
import { StylePreview } from "./components/StylePreview";
import { event } from "./config/event";

export default function App() {
  useEffect(() => {
    document.title = `${event.name} · ${event.coupleNames}`;
  }, []);

  return (
    <div className="min-h-svh bg-ivory pb-28 font-sans text-ink antialiased">
      <Header />
      <main id="content">
        <Hero />
        <Celebration />
        <EventDetails />
        <Gallery />
        <FAQ />
        <RSVPSection />
      </main>
      <StylePreview />
    </div>
  );
}
